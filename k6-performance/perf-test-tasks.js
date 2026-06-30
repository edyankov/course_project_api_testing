import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const BASE = "https://api.clickup.com/api/v2";
const TOKEN = __ENV.CLICKUP_TOKEN;
const LIST_ID = __ENV.CLICKUP_LIST_ID;

export const options = {
  stages: [
    { duration: "30s", target: 10 }, // ramp-up
    { duration: "1m", target: 10 },  // steady load
    { duration: "20s", target: 0 },  // ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // 95% of requests under 800ms
    http_req_failed: ["rate<0.01"],   // less than 1% errors
  },
};

const headers = { Authorization: TOKEN };

export default function () {
  // Read load on "Get Tasks in list"
  const res = http.get(`${BASE}/list/${LIST_ID}/task`, { headers });
  check(res, {
    "status is 200": (r) => r.status === 200,
    "has tasks array": (r) => Array.isArray(r.json("tasks")),
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    "perf-report-tasks.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
