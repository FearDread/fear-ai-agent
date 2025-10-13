const SecurityAgent = require("./src/agent");
const colorizer = require('./src/utils/colorizer');
// Start the agent
if (require.main === module) {

  const agent = new SecurityAgent();
  
  agent.start().catch(err => {
    console.error(colorizer.error('Fatal error: ' + err.message));
    process.exit(1);
  });
}
