const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://api.clickup.com/api/v2",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      config.env.token = process.env.CLICKUP_TOKEN;
      config.env.listId = process.env.CLICKUP_LIST_ID;
      return config;
    },
  },
});
