const SecurityAgent = require("./src/agent");
// Start the agent

const agent = new SecurityAgent();

agent.start().catch(console.error);
