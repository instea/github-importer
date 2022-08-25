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
# create repo in github
yarn create-repos
# migrate repos to github
yarn migrate
```

## Possible steps afterwards

Migration of other "things" like wiki etc can be done with https://github.com/piceaTech/node-gitlab-2-github
