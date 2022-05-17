# Assign to reviewers

This action assigns a pull request to the reviewers.

## Inputs

## `token`

The token to use to authenticate to GitHub. Defaults to `${{ github.token }}`.

## `sha`

The SHA of a commit on the PR branch. Defaults to `${{ github.event.pull_request.head.sha }}`.

## Example usage

```
uses: BrandSourceDigital/assign-to-reviewers
```
