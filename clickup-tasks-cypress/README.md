# ClickUp Tasks API — Cypress Tests

Cypress API tests for ClickUp Tasks with full object lifecycle:
**Create → Verify → Update → Negative checks → Delete**

---

## Status Codes — Verified Against Live API

The status codes asserted in these tests were verified directly against the
live ClickUp API — not assumed from documentation. Three behaviors are easy
to get wrong if you only read the docs:

| Action | Naive assumption | Actual (verified) |
|---|---|---|
| `DELETE /task/{id}` on success | `200` | **`204` No Content** |
| `GET /task/{id}` with no Authorization header at all | `401` | **`400`** (verified via a live pytest run on the same `list_id`) |
| `GET /task/{invalid_id}` | `404` | **`401`** (ClickUp checks token scope before existence) |
| `GET /task/{id}` after that task was deleted | `401` or `404` | **`404`** |

---

## Project Structure

```
clickup-tasks-cypress/
├── .env                    # your secrets (not committed to Git)
├── .env.example            # template — committed to Git
├── .gitignore
├── package.json
├── cypress.config.js
└── cypress/
    ├── e2e/
    │   └── tasks.cy.js      # all tests — full lifecycle
    └── support/
        ├── commands.js      # custom commands (createTask, getTask, etc.)
        └── e2e.js
```

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

Check if you have Node.js installed:

```bash
node --version
npm --version
```

---

## Setup

### 1. Install dependencies

```bash
cd clickup-tasks-cypress
npm install
```

This installs Cypress and dotenv locally into `node_modules/`.

### 2. Create the `.env` file

```bash
cp .env.example .env
```

Fill in:

```
CLICKUP_TOKEN=pk_your_token_here
CLICKUP_LIST_ID=your_list_id_here
```

| Variable | Where to find it |
|---|---|
| `CLICKUP_TOKEN` | ClickUp → Settings → Apps → API Token |
| `CLICKUP_LIST_ID` | Open the List in ClickUp, copy the id from the URL |

> ⚠️ Never commit `.env` to Git — it is already excluded via `.gitignore`

---

## Running Tests

### Headless mode (terminal output only)

```bash
npm test
```

### Interactive mode (Cypress UI)

```bash
npm run open
```

Then in the Cypress window:
1. Choose **E2E Testing**
2. Choose a browser (Chrome recommended)
3. Click `tasks.cy.js`

---

## Test Lifecycle

Each full run executes these steps in order:

| # | Test | Method | Expected |
|---|------|--------|----------|
| 1 | Creates a task | `POST` `/list/{id}/task` | 200 |
| 2 | Gets the task by id | `GET` `/task/{id}` | 200 |
| 3 | Finds the task in the list | `GET` `/list/{id}/task` | 200 |
| 4 | Updates the task | `PUT` `/task/{id}` | 200 |
| 5 | Negative: no token at all | `GET` `/task/{id}` | **400** |
| 6 | Negative: nonexistent task id | `GET` `/task/invalid_id` | **401** |
| 7 | Deletes the task | `DELETE` `/task/{id}` | **204** |
| 8 | Confirms deletion | `GET` `/task/{id}` | 404 |

---

## Troubleshooting

**`ENOENT: .env` not found**
→ Run `cp .env.example .env` and fill in the values.

**`401 Token invalid`**
→ Your token has expired or was regenerated. Go to ClickUp Settings → Apps and copy the current token into `.env`.

**Test 5 (no token) fails with a different status than 400**
→ ClickUp's behavior for a fully-missing Authorization header was verified live and can vary slightly depending on how the request is sent (browser fetch vs. a plain HTTP client). If this fails locally, check the actual status returned and compare — it may need re-verifying against the current API behavior.

**Tests pass individually but fail when run together**
→ `taskId` is shared between tests via a `let` variable — make sure tests run in order (Cypress does this by default).
