import os
import time
import pytest
from dotenv import load_dotenv
from api.clickup_tasks_client import ClickUpTasksClient

load_dotenv()

LIST_ID = os.getenv("CLICKUP_LIST_ID")


@pytest.fixture(scope="module")
def client():
    return ClickUpTasksClient(list_id=LIST_ID)


@pytest.fixture(scope="module")
def task_context():
    return {"task_id": None, "name": f"py_task_{int(time.time())}"}


class TestTaskLifecycle:
    """Full lifecycle: create -> verify -> update -> negative -> delete."""

    # 1. CREATE
    def test_create_task(self, client, task_context):
        payload = {
            "name": task_context["name"],
            "description": "Created by pytest autotest",
            "priority": 3,
        }
        res = client.create_task(payload)
        assert res.status_code == 200, res.text
        body = res.json()
        assert body["name"] == task_context["name"]
        assert "id" in body
        task_context["task_id"] = body["id"]

    # 2. VERIFY by ID
    def test_get_task(self, client, task_context):
        res = client.get_task(task_context["task_id"])
        assert res.status_code == 200, res.text
        assert res.json()["id"] == task_context["task_id"]

    # 2b. VERIFY in list
    def test_task_in_list(self, client, task_context):
        res = client.get_tasks()
        assert res.status_code == 200, res.text
        ids = [t["id"] for t in res.json()["tasks"]]
        assert task_context["task_id"] in ids

    # 3. UPDATE
    def test_update_task(self, client, task_context):
        new_name = task_context["name"] + "_updated"
        res = client.update_task(task_context["task_id"], {"name": new_name})
        assert res.status_code == 200, res.text
        assert res.json()["name"] == new_name
        task_context["name"] = new_name

    # ---------- Negative cases ----------
    # NOTE: status codes below were verified directly against the live
    # ClickUp API (not assumed) before writing these assertions.

    def test_get_task_without_token(self, client, task_context):
        res = client.get_task(task_context["task_id"], with_token=False)
        # Verified via live pytest run: a request with no Authorization header
        # at all (no token, not even an empty one) returns 400, not 401.
        assert res.status_code == 400

    def test_create_task_invalid_body(self, client):
        # "name" is a required field -> API returns 400
        res = client.create_task({"description": "no name field"})
        assert res.status_code == 400

    def test_get_nonexistent_task(self, client):
        # Note: ClickUp returns 401 (not 404) for a malformed/unknown task id
        # when using a personal token - verified against the live API.
        res = client.get_task("invalid_task_id_000")
        assert res.status_code == 401

    # 4. DELETE
    def test_delete_task(self, client, task_context):
        res = client.delete_task(task_context["task_id"])
        # ClickUp returns 204 No Content on successful delete (verified live),
        # not 200 as some docs/examples assume.
        assert res.status_code == 204

    def test_get_deleted_task_returns_404(self, client, task_context):
        # After deletion, the task id is gone entirely -> 404
        res = client.get_task(task_context["task_id"])
        assert res.status_code == 404
