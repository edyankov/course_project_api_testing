# ClickUp Tasks API — Python Tests

Python tests (pytest + requests) for ClickUp Tasks API with full object lifecycle:
**Create → Verify → Update → Negative checks → Delete**

---

## Status Codes — Verified Against Live API

The status codes asserted in these tests were verified directly against the
live ClickUp API before writing the assertions — not assumed from documentation.
Two behaviors are easy to get wrong if you only read the docs:

| Action | Naive assumption | Actual (verified) |
|---|---|---|
| `DELETE /task/{id}` on success | `200` | **`204` No Content** |
| `GET /task/{id}` with no Authorization header at all | `401` | **`400`** (verified via a live pytest run) |
| `GET /task/{invalid_id}` | `404` | **`401`** (ClickUp checks token scope before existence) |
| `GET /task/{id}` after that task was deleted | `401` or `404` | **`404`** |

---

## Project Structure

```
clickup-tasks-python/
├── .env                    # your secrets (not committed to Git)
├── .env.example            # template — committed to Git
├── .gitignore
├── requirements.txt
├── pytest.ini
├── api/
│   ├── __init__.py
│   └── clickup_tasks_client.py
└── tests/
    ├── __init__.py
    └── test_tasks.py
```

---

## Setup

```bash
cd clickup-tasks-python
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`:

```
CLICKUP_TOKEN=pk_your_token_here
CLICKUP_LIST_ID=your_list_id_here
```

| Variable | Where to find it |
|---|---|
| `CLICKUP_TOKEN` | ClickUp → Settings → Apps → API Token |
| `CLICKUP_LIST_ID` | Open the List in ClickUp, copy the id from the URL |

---

## Running Tests

```bash
pytest
```

Generates `report.html` (self-contained, open directly in a browser).

---

## Test Lifecycle

| # | Test | Method | Expected |
|---|------|--------|----------|
| 1 | Creates a task | `POST /list/{id}/task` | 200 |
| 2 | Verifies by ID | `GET /task/{id}` | 200 |
| 3 | Finds in list | `GET /list/{id}/task` | 200 |
| 4 | Updates the task | `PUT /task/{id}` | 200 |
| 5 | Negative: no token at all | `GET /task/{id}` | 400 |
| 6 | Negative: invalid body (no name) | `POST /list/{id}/task` | 400 |
| 7 | Negative: nonexistent task id | `GET /task/invalid_id` | 401 |
| 8 | Deletes the task | `DELETE /task/{id}` | **204** |
| 9 | Confirms deletion | `GET /task/{id}` | 404 |
