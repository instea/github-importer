import { exec } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { promisify } from "util";

const promiseExec = promisify(exec);

export function bash(cmd: string, cwd: string) {
  return promiseExec(cmd, { cwd });
}

export function ensureDirSync(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}
