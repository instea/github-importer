import { existsSync } from "fs";
import { config } from "./config";
import { bash, callGHApi, ensureDirSync } from "./utils";

const WORK_DIR = "./work/";
const MASTER_BRANCH = "master";

const { repoNames, srcGitPrefix, github } = config;

function makeGLUrl(repo: string) {
  return `${srcGitPrefix}${repo}.git`;
}

async function migrate(repo: string) {
  // it looks bare repo contains git in the name
  const dir = WORK_DIR + repo + ".git";
  if (!existsSync(dir)) {
    console.log("> Clone --mirror repo");
    await bash(`git clone --mirror ${makeGLUrl(repo)}`, WORK_DIR);

    await createRepo(repo);

    const ghUrl = `git@github.com:${github.organization}/${repo}.git`;
    console.log("> Pushing to GH");
    await bash(`git push --no-verify --mirror ${ghUrl}`, dir);
    await bash(`git remote set-url --push origin  ${ghUrl}`, dir);

    const hasMaster = await checkMasterBranch(repo);
    if (hasMaster) {
      // default branch must be set only once the branches are there
      await fixDefaultBranch(repo);
    }
  } else {
    console.log("> Syncing GL -> GH");
    await bash(`git fetch -p origin`, dir);
    await bash(`git push --no-verify --mirror`, dir);
  }
}

async function createRepo(name: string) {
  console.log("createRepo", name);
  const body = { name, private: true, team_id: github.teamId };
  await callGHApi(
    `https://api.github.com/orgs/${github.organization}/repos`,
    body
  );
}

async function fixDefaultBranch(name: string) {
  console.log("fixDefaultBranch", name);
  const body = { default_branch: MASTER_BRANCH };
  await callGHApi(
    `https://api.github.com/repos/${github.organization}/${name}`,
    body,
    "PATCH"
  );
}

/** It checks if GH repo has `master` branch. */
async function checkMasterBranch(repo: string) {
  try {
    const result = await bash(
      `git ls-remote --heads ${makeGLUrl(
        repo
      )} ${MASTER_BRANCH} | grep ${MASTER_BRANCH} >/dev/null`,
      "."
    );
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  ensureDirSync(WORK_DIR);
  let idx = 0;
  for (const repo of repoNames) {
    console.log("Migrating", repo, `${idx++} / ${repoNames.length}`);
    await migrate(repo);
  }
}

main().then(() => console.log("Done"));
