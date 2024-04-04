const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
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
    try {
      await octokit.rest.issues.addAssignees({
        owner,
        repo,
        issue_number: number,
        assignees: [requested_reviewer.login],
      });
    } catch (error) {
      core.setFailed(error.message);
    }
  } else if (action === "review_request_removed") {
    try {
      await octokit.rest.issues.removeAssignees({
        owner,
        repo,
        issue_number: number,
        assignees: [requested_reviewer.login],
      });
    } catch (error) {
      core.info(`Error removing assignee: ${error.message}`);
      core.info("Ignoring error");
    }
  } else {
    core.setFailed(`Unsupported action: ${action}`);
  }
}

run();
