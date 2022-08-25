export const config = {
  github: {
    token: process.env.GH_TOKEN,
    organization: "instea",
    // instea-dev
    teamId: 2469941,
  },
  // all repos to be migrated
  repoNames: ["sport-events"],
  // "git url prefix",
  srcGitPrefix: "git@gitlab.com:instea.sk/",
};
