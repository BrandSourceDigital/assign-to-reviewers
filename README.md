# Assign to reviewers

This action assigns a pull request to its reviewers.

If used with `review_requested` and `review_request_removed`, it will assign/unassign the specific person requested. This is the recommended workflow.

If used with `opened` and `ready_for_review`, it will assign all the reviewers that are currently requested. This allows it to integrate with another action that assigns reviewers (such as [hkusu/review-assign-action](https://github.com/hkusu/review-assign-action)), since GitHub doesn't trigger workflows based on actions done by another workflow.

## Inputs

## `token`

The token to use to authenticate to GitHub. Defaults to `${{ github.token }}`.

## Examples

### Review requested/removed

```yaml
name: Assign to reviewers

on:
  pull_request:
    types:
      - review_requested
      - review_request_removed

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - name: Assign to reviewers
        uses: BrandSourceDigital/assign-to-reviewers@v1
```

### Opened/ready for review

```yaml
name: Request reviewers

on:
  pull_request:
    types:
      - opened
      - ready_for_review # if draft, assigned when draft is released

  request:
    runs-on: ubuntu-latest

    steps:
      - name: Request reviewers
        uses: hkusu/review-assign-action@v1
        with:
          reviewers: georgewashington, JohnAdams, thomasJefferson1

      - name: Assign to reviewers
        uses: BrandSourceDigital/assign-to-reviewers@v1
