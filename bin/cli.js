
#!/usr/bin/env node

/**
 * Security Agent CLI
 * Command-line interface for the Security Agent framework
 */

const { program } = require('commander');
const securityAgent = require('../index');
const path = require('path');
const fs = require('fs');

// Package info
const packageJson = require('../package.json');

program
  .name('security-agent')
  .description('Advanced Security Testing and Analysis Framework')
  .version(packageJson.version);

// Interactive CLI mode (default)
program
  .command('start', { isDefault: true })
  .description('Start interactive CLI mode')
  .action(async () => {
    try {
      await securityAgent.startCLI();
    } catch (error) {
      console.error('Error starting CLI:', error.message);
      process.exit(1);
    }
  });

// Execute a single command
program
  .command('exec <command> [args...]')
  .description('Execute a single command')
  .option('-j, --json', 'Output as JSON')
  .action(async (command, args, options) => {
    try {
      const result = await securityAgent.executeCommand(command, args);
      
      if (options.json) {
        console.log(JSON.stringify({ success: true, result }, null, 2));
      } else {
        console.log(result);
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ success: false, error: error.message }, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      process.exit(1);
    }
  });

// Execute batch commands from file
program
  .command('batch <file>')
  .description('Execute commands from a JSON file')
  .option('-j, --json', 'Output as JSON')
  .action(async (file, options) => {
    try {
      const filePath = path.resolve(process.cwd(), file);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${file}`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const commands = JSON.parse(fileContent);

      if (!Array.isArray(commands)) {
        throw new Error('File must contain an array of commands');
      }

      const results = await securityAgent.executeBatch(commands);
      
      if (options.json) {
        console.log(JSON.stringify({ success: true, results }, null, 2));
      } else {
        results.forEach((result, index) => {
          console.log(`\nCommand ${index + 1}: ${result.command || 'unknown'}`);
          console.log('Success:', result.success);
          if (result.error) {
            console.log('Error:', result.error);
          } else if (result.result) {
            console.log('Result:', result.result);
          }
        });
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ success: false, error: error.message }, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      process.exit(1);
    }
  });

// List available commands
program
  .command('commands')
  .description('List all available commands')
  .option('-c, --category <category>', 'Filter by category')
  .option('-j, --json', 'Output as JSON')
  .action((options) => {
    try {
      const commands = securityAgent.getCommands();
      
      if (options.json) {
        console.log(JSON.stringify(commands, null, 2));
      } else {
        console.log('\nAvailable Commands:\n');
        
        Object.entries(commands).forEach(([cmd, config]) => {
          if (!options.category || config.module === options.category) {
            console.log(`  ${cmd.padEnd(30)} - ${config.description}`);
            console.log(`    Module: ${config.module}, Method: ${config.method}\n`);
          }
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Show agent status
program
  .command('status')
  .description('Show agent and module status')
  .option('-j, --json', 'Output as JSON')
  .action((options) => {
    try {
      const status = securityAgent.getStatus();
      
      if (options.json) {
        console.log(JSON.stringify(status, null, 2));
      } else {
        console.log('\nAgent Status:\n');
        console.log(`  Initialized: ${status.initialized}`);
        console.log(`  Version: ${status.version}`);
        console.log(`  Node: ${status.nodeVersion}`);
        console.log(`  Platform: ${status.platform}`);
        
        if (status.stats) {
          console.log('\nStatistics:');
          console.log(`  Modules Loaded: ${status.stats.modulesLoaded}`);
          console.log(`  Commands Available: ${status.stats.commandsAvailable}`);
          console.log(`  Services Running: ${status.stats.servicesRunning}`);
        }
        
        if (status.modules) {
          console.log('\nModules:');
          Object.entries(status.modules).forEach(([name, info]) => {
            const statusText = info.loaded ? '✓' : '✗';
            console.log(`  ${statusText} ${info.displayName.padEnd(25)} - ${info.status}`);
          });
        }
        
        if (status.services && Object.keys(status.services).length > 0) {
          console.log('\nBackground Services:');
          Object.entries(status.services).forEach(([name, serviceStatus]) => {
            const statusText = serviceStatus === 'running' ? '●' : '○';
            console.log(`  ${statusText} ${name.padEnd(25)} - ${serviceStatus}`);
          });
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Initialize agent programmatically
program
  .command('init')
  .description('Initialize the agent and output initialization info')
  .option('-j, --json', 'Output as JSON')
  .action((options) => {
    try {
      const { agent, controller } = securityAgent.initialize();
      
      const info = {
        success: true,
        modulesLoaded: Object.keys(agent.modules).length,
        commandsRegistered: Object.keys(agent.commands).length,
        version: packageJson.version
      };
      
      if (options.json) {
        console.log(JSON.stringify(info, null, 2));
      } else {
        console.log('\nAgent Initialized Successfully!\n');
        console.log(`  Modules Loaded: ${info.modulesLoaded}`);
        console.log(`  Commands Registered: ${info.commandsRegistered}`);
        console.log(`  Version: ${info.version}\n`);
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ success: false, error: error.message }, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      process.exit(1);
    }
  });

// Create example batch file
program
  .command('example')
  .description('Create an example batch commands file')
  .option('-o, --output <file>', 'Output file', 'batch-commands.json')
  .action((options) => {
    try {
      const exampleCommands = [
        {
          command: 'ai-status',
          args: []
        },
        {
          command: 'network-info',
          args: []
        },
        {
          command: 'check-ip',
          args: []
        }
      ];
      
      const outputPath = path.resolve(process.cwd(), options.output);
      fs.writeFileSync(outputPath, JSON.stringify(exampleCommands, null, 2));
      
      console.log(`\nExample batch file created: ${outputPath}\n`);
      console.log('Run it with: security-agent batch', options.output);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Check if command exists
program
  .command('check <command>')
  .description('Check if a command exists')
  .option('-j, --json', 'Output as JSON')
  .action((command, options) => {
    try {
      const exists = securityAgent.commandExists(command);
      const commands = securityAgent.getCommands();
      const details = commands[command];
      
      if (options.json) {
        console.log(JSON.stringify({ exists, command, details }, null, 2));
      } else {
        if (exists) {
          console.log(`\n✓ Command '${command}' exists\n`);
          if (details) {
            console.log(`  Description: ${details.description}`);
            console.log(`  Module: ${details.module}`);
            console.log(`  Method: ${details.method}\n`);
          }
        } else {
          console.log(`\n✗ Command '${command}' does not exist\n`);
          console.log('Run "security-agent commands" to see available commands');
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Shutdown agent
program
  .command('shutdown')
  .description('Shutdown the agent and all services')
  .option('-j, --json', 'Output as JSON')
  .action((options) => {
    try {
      const result = securityAgent.shutdown();
      
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log('\n' + result.message);
        if (result.servicesStopped && result.servicesStopped.length > 0) {
          console.log('\nServices stopped:');
          result.servicesStopped.forEach(service => {
            console.log(`  - ${service}`);
          });
        }
        console.log();
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ success: false, error: error.message }, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);

// If no command provided, show help
if (!process.argv.slice(2).length) {
  securityAgent.startCLI().catch(error => {
    console.error('Error starting CLI:', error.message);
    process.exit(1);
  });
}
