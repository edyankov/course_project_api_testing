import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api.clickup.com/api/v2"


class ClickUpTasksClient:
    def __init__(self, token=None, list_id=None):
        self.token = token or os.getenv("CLICKUP_TOKEN")
        self.list_id = list_id or os.getenv("CLICKUP_LIST_ID")

    def _headers(self, with_token=True):
        headers = {"Content-Type": "application/json"}
        if with_token:
            headers["Authorization"] = self.token
        return headers

    def create_task(self, payload, with_token=True):
        return requests.post(
            f"{BASE_URL}/list/{self.list_id}/task",
            json=payload,
            headers=self._headers(with_token),
        )

    def get_task(self, task_id, with_token=True):
        return requests.get(
            f"{BASE_URL}/task/{task_id}",
            headers=self._headers(with_token),
        )

    def get_tasks(self, with_token=True):
        return requests.get(
            f"{BASE_URL}/list/{self.list_id}/task",
            headers=self._headers(with_token),
        )

    def update_task(self, task_id, payload, with_token=True):
        return requests.put(
            f"{BASE_URL}/task/{task_id}",
            json=payload,
            headers=self._headers(with_token),
        )

    def delete_task(self, task_id, with_token=True):
        return requests.delete(
            f"{BASE_URL}/task/{task_id}",
            headers=self._headers(with_token),
        )
