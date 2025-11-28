
// index.js - Main entry point for Security Agent Library
const SecurityAgent = require('./src/agent');
const agentController = require('./src/controller');

/**
 * Security Agent Library
 * A comprehensive security testing and analysis framework
 * @version 2.4.0
 */

/**
 * Create a new Security Agent instance
 * @returns {SecurityAgent} New agent instance
 */
function createAgent() {
  return new SecurityAgent();
}

/**
 * Get the singleton controller instance
 * @returns {AgentController} Controller instance
 */
function getController() {
  return agentController;
}

/**
 * Quick start - Initialize and return agent with controller
 * @returns {Object} { agent, controller }
 */
function initialize() {
  const agent = new SecurityAgent();
  return {
    agent,
    controller: agentController
  };
}

/**
 * Execute a command programmatically
 * @param {string} command - Command name
 * @param {Array} args - Command arguments
 * @returns {Promise<any>} Command result
 */
async function executeCommand(command, args = []) {
  const agent = agentController.getInstance();
  
  if (!agentController.isInitialized) {
    agentController.isInitialized = true;
  }

  if (!agent.commands[command]) {
    throw new Error(`Unknown command: ${command}`);
  }

  const parsedArgs = Array.isArray(args) ? args : [args];
  return await agent.commands[command](parsedArgs);
}

/**
 * Execute multiple commands in batch
 * @param {Array<{command: string, args: Array}>} commands - Array of command objects
 * @returns {Promise<Array>} Array of results
 */
async function executeBatch(commands) {
  const agent = agentController.getInstance();
  
  if (!agentController.isInitialized) {
    agentController.isInitialized = true;
  }

  const results = [];

  for (const cmdConfig of commands) {
    const { command, args } = cmdConfig;
    
    if (!command) {
      results.push({
        success: false,
        error: 'Command name is required'
      });
      continue;
    }

    if (!agent.commands[command]) {
      results.push({
        success: false,
        command,
        error: `Unknown command: ${command}`
      });
      continue;
    }

    try {
      const parsedArgs = Array.isArray(args) ? args : (args ? [args] : []);
      const result = await agent.commands[command](parsedArgs);
      
      results.push({
        success: true,
        command,
        result
      });
    } catch (error) {
      results.push({
        success: false,
        command,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Get available commands
 * @returns {Object} Command mappings
 */
function getCommands() {
  const agent = agentController.getInstance();
  
  if (!agentController.isInitialized) {
    agentController.isInitialized = true;
  }

  const commands = {};
  
  // Build command list with descriptions
  Object.entries(agent.mappings).forEach(([cmd, config]) => {
    commands[cmd] = {
      description: config.description,
      module: config.module,
      method: config.method
    };
  });

  // Add built-in commands
  const builtInCommands = {
    'help': { description: 'Show help information', module: 'core', method: 'showHelp' },
    'status': { description: 'Show system status', module: 'core', method: 'showStatus' },
    'history': { description: 'Show command history', module: 'core', method: 'showHistory' },
    'clear': { description: 'Clear screen', module: 'core', method: 'clearScreen' },
    'banner': { description: 'Show banner', module: 'core', method: 'showBanner' },
    'version': { description: 'Show version info', module: 'core', method: 'showVersion' },
    'tips': { description: 'Show tips and tricks', module: 'core', method: 'showTips' },
    'exit': { description: 'Exit agent', module: 'core', method: 'exit' }
  };

  Object.assign(commands, builtInCommands);

  return commands;
}

/**
 * Check if a command exists
 * @param {string} command - Command name
 * @returns {boolean} True if command exists
 */
function commandExists(command) {
  const agent = agentController.getInstance();
  
  if (!agentController.isInitialized) {
    agentController.isInitialized = true;
  }

  return !!agent.commands[command];
}

/**
 * Get agent status
 * @returns {Object} Status information
 */
function getStatus() {
  const agent = agentController.getInstance();
  
  if (!agentController.isInitialized) {
    return {
      initialized: false,
      message: 'Agent not initialized'
    };
  }

  // Get module status
  const modules = {};
  agent.definitions.forEach(moduleDef => {
    const module = agent.modules[moduleDef.name];
    modules[moduleDef.name] = {
      displayName: moduleDef.displayName,
      loaded: !!module,
      status: module ? 'ready' : 'unavailable'
    };

    // Special handling for AI modules
    if (moduleDef.name === 'aiAnalyzer' && module) {
      modules[moduleDef.name].configured = module.isConfigured ? module.isConfigured() : false;
      modules[moduleDef.name].provider = module.getProviderName ? module.getProviderName() : null;
    }
    if (moduleDef.name === 'aiChat' && module) {
      modules[moduleDef.name].configured = module.isConfigured ? module.isConfigured() : false;
    }
  });

  // Get background services status
  const services = {};
  agent.backgroundServices.forEach((service, name) => {
    services[name] = agent.serviceStatus.get(name) || 'stopped';
  });

  return {
    initialized: true,
    version: '2.4.0',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    modules,
    services,
    stats: {
      modulesLoaded: Object.keys(agent.modules).length,
      commandsAvailable: Object.keys(agent.commands).length,
      servicesRunning: Array.from(agent.serviceStatus.values()).filter(s => s === 'running').length,
      commandHistory: agent.commandHistory.length
    }
  };
}

/**
 * Get version information
 * @returns {Object} Version info
 */
function getVersion() {
  return {
    version: '2.4.0',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch
  };
}

/**
 * Start interactive CLI mode
 * @returns {Promise<void>}
 */
async function startCLI() {
  const agent = new SecurityAgent();
  return agent.start();
}

/**
 * Shutdown the agent
 * @returns {Object} Shutdown result
 */
function shutdown() {
  const agent = agentController.getInstance();

  if (!agentController.isInitialized) {
    return {
      success: true,
      message: 'Agent was not initialized'
    };
  }

  // Stop all background services
  const stoppedServices = [];
  agent.backgroundServices.forEach((service, name) => {
    if (agent.serviceStatus.get(name) === 'running') {
      agent.stopService(name);
      stoppedServices.push(name);
    }
  });

  // Cleanup modules
  if (agent.modules.trafficMonitor && agent.modules.trafficMonitor.stopMonitoring) {
    agent.modules.trafficMonitor.stopMonitoring();
  }

  agentController.isInitialized = false;
  agentController.agentInstance = null;

  return {
    success: true,
    message: 'Agent shutdown successfully',
    servicesStopped: stoppedServices
  };
}

// Export main API
module.exports = {
  // Core
  createAgent,
  initialize,
  getController,
  startCLI,
  shutdown,
  
  // Command execution
  executeCommand,
  executeBatch,
  
  // Information
  getCommands,
  commandExists,
  getStatus,
  getVersion,
  
  // Classes (for advanced usage)
  SecurityAgent,
  AgentController: agentController,
  
  // Aliases for convenience
  create: createAgent,
  init: initialize,
  exec: executeCommand,
  batch: executeBatch,
  status: getStatus,
  version: getVersion,
  cli: startCLI
};

// Default export
module.exports.default = module.exports;
