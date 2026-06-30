const BASE = "https://api.clickup.com/api/v2";

Cypress.Commands.add("createTask", (listId, body, token) => {
  return cy.request({
    method: "POST",
    url: `${BASE}/list/${listId}/task`,
    headers: { Authorization: token, "Content-Type": "application/json" },
    body,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("getTask", (taskId, token) => {
  return cy.request({
    method: "GET",
    url: `${BASE}/task/${taskId}`,
    headers: token ? { Authorization: token } : {},
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("getTasks", (listId, token) => {
  return cy.request({
    method: "GET",
    url: `${BASE}/list/${listId}/task`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("updateTask", (taskId, body, token) => {
  return cy.request({
    method: "PUT",
    url: `${BASE}/task/${taskId}`,
    headers: { Authorization: token, "Content-Type": "application/json" },
    body,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("deleteTask", (taskId, token) => {
  return cy.request({
    method: "DELETE",
    url: `${BASE}/task/${taskId}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  });
});
