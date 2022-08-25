import { existsSync } from "fs";
import { config } from "./config";
import { bash, ensureDirSync } from "./utils";

const WORK_DIR = "./work/";
const { repoNames, srcGitPrefix, github } = config;

async function migrate(repo: string) {
  // it looks bare repo contains git in the name
  const dir = WORK_DIR + repo + ".git";
  if (!existsSync(dir)) {
    console.log("> Clone --mirror repo");
    await bash(`git clone --mirror ${srcGitPrefix}${repo}.git`, WORK_DIR);
    const ghUrl = `git@github.com:${github.organization}/${repo}.git`;
    console.log("> Pushing to GH");
    await bash(`git push --no-verify --mirror ${ghUrl}`, dir)
    await bash(`git remote set-url --push origin  ${ghUrl}`, dir)
  } else {
    console.log('> Syncing GL -> GH');
    await bash(`git fetch -p origin`, dir)
    await bash(`git push --no-verify --mirror`, dir)
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
