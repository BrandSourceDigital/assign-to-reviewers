const core = require("@actions/core");
const github = require("@actions/github");

async function getPullRequest() {
  const token = core.getInput("token");
  const octokit = github.getOctokit(token);
  const commit_sha = core.getInput("sha");

  const { owner, repo } = github.context.repo;

  const { data: pulls } =
    await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      owner,
      repo,
      commit_sha,
    });

  const filteredPRs = pulls
    .filter(({ state }) => state === "open")
    .filter(({ draft }) => !draft);

  return filteredPRs[0];
}

async function run() {
  try {
    const token = core.getInput("token");
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const { number } = await getPullRequest();

    const { data: reviewers } = await octokit.rest.pulls.listRequestedReviewers(
      {
        owner,
        repo,
        pull_number: number,
      }
    );

    await octokit.rest.issues.addAssignees({
      owner,
      repo,
      issue_number: number,
      assignees: reviewers.users.map((user) => user.login),
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
