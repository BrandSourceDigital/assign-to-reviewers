const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  const token = core.getInput("token");
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;
  const { pull_request, action } = github.context.payload;

  if (!pull_request) {
    core.setFailed("No pull request found.");
    return;
  }
  const { number } = pull_request;

  if (action === "review_requested") {
    /** @type {import('@octokit/openapi-types').components['schemas']['simple-user']} */
    const requested_reviewer = github.context.payload.requested_reviewer;
    if (!requested_reviewer) {
      core.info(
        "No requested reviewer found. Maybe a team was assigned? Ignoring."
      );
      return;
    }

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
    /** @type {import('@octokit/openapi-types').components['schemas']['simple-user']} */
    const requested_reviewer = github.context.payload.requested_reviewer;
    if (!requested_reviewer) {
      core.info(
        "No requested reviewer found. Maybe a team was assigned? Ignoring."
      );
      return;
    }

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
  } else if (action === "opened" || action === "ready_for_review") {
    try {
      const { data: reviewers } =
        await octokit.rest.pulls.listRequestedReviewers({
          owner,
          repo,
          pull_number: number,
        });
      if (reviewers.users.length > 0) {
        await octokit.rest.issues.addAssignees({
          owner,
          repo,
          issue_number: number,
          assignees: reviewers.users.map((u) => u.login),
        });
      }
    } catch (error) {
      core.setFailed(error.message);
    }
  } else {
    core.setFailed(`Unsupported action: ${action}`);
  }
}

run();
