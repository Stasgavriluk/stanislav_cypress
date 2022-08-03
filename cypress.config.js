const { default: axios } = require("axios");
const {defineConfig} = require("cypress");

testDataApiEndpoint = "http://localhost:3001/testData";

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    watchForFileChanges: false,
    numTestsKeptInMemory: 50,
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    retries: {
      runMode: 2,
      openMode: 1,
    },
    setupNodeEvents(on, config) {
      on("task", {
        async "db:seed"() {
          // seed database with test data
          const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
          return data;
        },
      });
    },
  },
});
