import { exec } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { promisify } from "util";
import fetch from "node-fetch";

import { config } from "./config";

const { github } = config;

const promiseExec = promisify(exec);

export function bash(cmd: string, cwd: string) {
  return promiseExec(cmd, { cwd });
}

export function ensureDirSync(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

export async function callGHApi(url: string, body: {}, method = "POST") {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${github.token}`,
    },
    body: JSON.stringify(body),
  };
  const resp = await fetch(url, opts);
  console.log(">", url, resp.statusText);
  if (resp.status >= 400) {
    const text = await resp.text();
    console.log(">", text);
  }
}
