const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("token");
    const octokit = github.getOctokit(token);
    const { owner, repo, number } = github.context.issue;

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
      issue_number,
      assignees: reviewers.users.map((user) => user.login),
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
