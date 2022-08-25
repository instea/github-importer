import { existsSync } from "fs";
import { config } from "./config";
import { bash, ensureDirSync } from "./utils";

const WORK_DIR = "./work/";
const { repoNames, srcGitPrefix } = config;

async function migrate(repo: string) {
  console.log("Migrating", repo);
  // it looks bare repo contains git in the name
  const dir = WORK_DIR + repo + ".git";
  if (!existsSync(dir)) {
    console.log("> Clone --mirror repo");
    await bash(`git clone --mirror ${srcGitPrefix}${repo}.git`, WORK_DIR);
  }
}

async function main() {
  ensureDirSync(WORK_DIR);
  for (const repo of repoNames) {
    await migrate(repo);
  }
}

main().then(() => console.log("Done"));
