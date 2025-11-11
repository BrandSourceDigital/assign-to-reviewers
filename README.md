# Assign to reviewers

This action assigns a pull request to the reviewers.

## Inputs

## `token`

The token to use to authenticate to GitHub. Defaults to `${{ github.token }}`.

## Example usage

```yaml
name: Assign to reviewers

on:
  pull_request:
    types: [review_requested, review_request_removed]

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - name: Assign to reviewers
        uses: BrandSourceDigital/assign-to-reviewers@v0.3
```
