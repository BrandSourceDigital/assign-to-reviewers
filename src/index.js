const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("token");
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const { pull_request, action } = github.context.payload;
    /** @type {import('@octokit/openapi-types').components['schemas']['simple-user']} */
    const requested_reviewer = github.context.payload.requested_reviewer;

    if (!pull_request) {
      core.setFailed("No pull request found.");
      return;
    }
    const { number } = pull_request;

    if (!requested_reviewer) {
      core.info(
        "No requested reviewer found. Maybe a team was assigned? Ignoring."
      );
      return;
    }

    if (action === "review_requested") {
      await octokit.rest.issues.addAssignees({
        owner,
        repo,
        issue_number: number,
        assignees: [requested_reviewer.login],
      });
    } else if (action === "review_request_removed") {
      await octokit.rest.issues.removeAssignees({
        owner,
        repo,
        issue_number: number,
        assignees: [requested_reviewer.login],
      });
    } else {
      core.setFailed(`Unsupported action: ${action}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
