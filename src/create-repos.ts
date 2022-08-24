import fetch from "node-fetch";
import { config } from "./config";

const { repoNames, github } = config;

console.log("Going to create repos ", repoNames);

async function createRepo(name: string) {
  console.log("Creating", name);
  const body = { name, private: true, team_id: github.teamId };
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${github.token}`,
    },
    body: JSON.stringify(body),
  };
  const resp = await fetch(
    `https://api.github.com/orgs/${github.organization}/repos`,
    opts
  );
  console.log(">", resp.statusText);
}

async function main() {
  for (const repo of repoNames) {
    await createRepo(repo);
  }
}

main().then(() => console.log("Done"));
