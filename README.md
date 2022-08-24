# github-importer

Import github projects from everywhere

## Prerequisites

In Github go to Settings -> Developer Settings -> `Personal Access Token` and generate a New Access token with following permissions:

- `repo`

And fill-in team ID in `config.ts`

```
export GH_TOKEN=your token
curl -H "Authorization: token $GH_TOKEN" https://api.github.com/orgs/instea/teams
```

## Procedure

```
export GH_TOKEN=your token
yarn create-repos
```
