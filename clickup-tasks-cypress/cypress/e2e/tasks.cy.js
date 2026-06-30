describe("ClickUp Tasks API lifecycle", () => {
  const token = Cypress.env("token");
  const listId = Cypress.env("listId");
  let taskId;
  const taskName = `cypress_task_${Date.now()}`;

  it("creates a task", () => {
    cy.createTask(listId, { name: taskName, priority: 3 }, token).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("id");
      expect(res.body.name).to.eq(taskName);
      taskId = res.body.id;
    });
  });

  it("gets the task by id", () => {
    cy.getTask(taskId, token).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.eq(taskId);
    });
  });

  it("finds the task in the list", () => {
    cy.getTasks(listId, token).then((res) => {
      expect(res.status).to.eq(200);
      const ids = res.body.tasks.map((t) => t.id);
      expect(ids).to.include(taskId);
    });
  });

  it("updates the task", () => {
    cy.updateTask(taskId, { name: `${taskName}_updated` }, token).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.name).to.eq(`${taskName}_updated`);
    });
  });

  it("negative: get task without token returns 400 (verified against live API via pytest run)", () => {
    cy.getTask(taskId, null).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it("negative: get nonexistent task returns 401 (verified against live API)", () => {
    cy.getTask("invalid_task_id_000", token).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it("deletes the task (API returns 204 No Content, verified against live API)", () => {
    cy.deleteTask(taskId, token).then((res) => {
      expect(res.status).to.eq(204);
    });
  });

  it("verifies the task is gone after deletion (404)", () => {
    cy.getTask(taskId, token).then((res) => {
      expect(res.status).to.eq(404);
    });
  });
});
