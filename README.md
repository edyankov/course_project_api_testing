# Final Course Project — API Testing

Automated testing of the **ClickUp Tasks API** using four independent
approaches: Python + pytest, Postman/Newman, Cypress, and k6 (performance).

This project extends the earlier coursework on ClickUp Goals/Lists by
covering Tasks — ClickUp's central entity, not previously addressed in the
course.

---

## What's Inside

| Folder / File | Approach | Covers |
|---|---|---|
| `clickup-tasks-python/` | Python + pytest | Full CRUD lifecycle + negative cases |
| `ClickUp Tasks API.postman_*.json` | Postman / Newman | Same lifecycle, via collection |
| `clickup-tasks-cypress/` | Cypress (JS) | Same lifecycle, via e2e specs |
| `k6-performance/` | k6 | Load test on `Get Tasks in List` |
| `.circleci/config.yml` | CircleCI | Runs all of the above (+ earlier Goals jobs) on every push |

Each subfolder has its own `README.md` with setup, run instructions, and a
table of the exact endpoints/status codes tested.

---

## Quick Start

Each approach is self-contained — pick the one you want to run:

```bash
# Python
cd clickup-tasks-python && pip install -r requirements.txt && pytest

# Cypress
cd clickup-tasks-cypress && npm install && npm test

# Postman (via Newman)
npm install -g newman newman-reporter-htmlextra
newman run "ClickUp Tasks API.postman_collection.json" \
  -e "ClickUp Tasks API.postman_environment.json" -r htmlextra

# k6 (performance)
cd k6-performance && k6 run perf-test-tasks.js
```

All four require a ClickUp API token and a `list_id` — see each subfolder's
`README.md` / `.env.example` for exact variable names.

---

## CI

All jobs run automatically on every push via CircleCI:
[app.circleci.com/pipelines/github/edyankov/api_testing](https://app.circleci.com/pipelines/github/edyankov/api_testing)

Required CircleCI Environment Variables (Project Settings → Environment Variables):

| Variable | Used by |
|---|---|
| `CLICKUP_TOKEN` | all jobs |
| `CLICKUP_TEAM_ID` | Goals jobs |
| `CLICKUP_USER_ID` | Goals jobs |
| `CLICKUP_FOLDER_ID` | Goals/Lists Postman job |
| `CLICKUP_SPACE_ID` | Goals/Lists Postman job |
| `CLICKUP_LIST_ID` | all Tasks jobs |

---

## A Note on Status Codes

Several status codes in this project were verified directly against the
live ClickUp API rather than assumed from documentation — and a few turned
out to be non-obvious:

| Action | Naive assumption | Actual |
|---|---|---|
| `DELETE /task/{id}` on success | `200` | **`204` No Content** |
| `GET /task/{id}` with no Authorization header at all | `401` | **`400`** |
| `GET /task/{invalid_id}` | `404` | **`401`** |
| `GET /task/{id}` after deletion | `401` or `404` | **`404`** |

Each test file has an inline comment at the relevant assertion explaining why.
