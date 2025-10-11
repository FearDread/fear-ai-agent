const SecurityAgent = require("./src/agent");
// Start the agent

  const agent = new SecurityAgent();
  agent.start().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
