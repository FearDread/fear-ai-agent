const SecAgent = require("./src/agent");
// Start the agent

const agent = new SecAgent();

agent.start().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});