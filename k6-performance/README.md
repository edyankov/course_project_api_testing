# ClickUp Tasks API — k6 Performance Test

Load test for the ClickUp `GET /list/{id}/task` endpoint (Get Tasks in List)
using [k6](https://k6.io/).

**Endpoint tested:** `GET https://api.clickup.com/api/v2/list/{list_id}/task`

---

## Load Profile

| Phase | Target | Duration |
|-------|--------|----------|
| Ramp-up | 0 → 10 VUs | 30s |
| Steady load | 10 VUs | 1m |
| Ramp-down | 10 → 0 VUs | 20s |

**Thresholds:**

| Metric | Threshold |
|--------|-----------|
| `http_req_duration` (p95) | < 800ms |
| `http_req_failed` (error rate) | < 1% |

---

## Requirements

- [k6](https://k6.io/) — install via `brew install k6` (Mac)
  - If brew fails on a network error: `brew install k6 --force-bottle`

---

## Running the Test

```bash
cd k6-performance
export CLICKUP_TOKEN="pk_your_token_here"
export CLICKUP_LIST_ID="your_list_id_here"

k6 run perf-test-tasks.js
```

A self-contained HTML report is generated automatically:

```
perf-report-tasks.html
```

Open it directly in a browser — no server needed.

---

## What to Expect

This endpoint (`Get Tasks in List`) is a simple read, so under normal load it
should comfortably stay under the 800ms p95 threshold with close to 0% errors.

If you push the load significantly higher (well beyond 10 VUs), ClickUp's
rate limit (~100 requests/minute per token) may kick in and you'll start
seeing `429 Too Many Requests` responses — that's expected API behavior
under heavy load, not a bug in the script.

---

## Project Structure

```
k6-performance/
└── perf-test-tasks.js   # load test script + HTML report generator
```

After running, `perf-report-tasks.html` will appear alongside the script —
include it in the repo for submission.
