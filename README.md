
# Security Agent

**Advanced Security Testing and Analysis Framework with AI capabilities**

A comprehensive security testing toolkit that combines traditional security tools with AI-powered analysis for vulnerability assessment, code analysis, network scanning, and more.

[![npm version](https://img.shields.io/npm/v/security-agent.svg)](https://www.npmjs.com/package/security-agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/security-agent.svg)](https://nodejs.org)

## Features

### 🔒 Security Testing
- **Port Scanning**: Network port scanning and service detection
- **Vulnerability Assessment**: Automated security vulnerability scanning
- **CVE Database**: Search and analyze CVE vulnerabilities
- **Traffic Monitoring**: Real-time network traffic analysis
- **Security Audits**: Comprehensive security audit reports

### 🤖 AI-Powered Analysis
- **Code Analysis**: AI-driven security code review
- **Threat Assessment**: Intelligent threat detection and analysis
- **Vulnerability Explanation**: Detailed vulnerability explanations
- **Security Recommendations**: AI-generated security improvements
- **Interactive Chat**: Conversational AI for security questions

### 🌐 Web Security
- **Web Scraping**: Extract and analyze web content
- **Security Headers**: Analyze HTTP security headers
- **API Testing**: Comprehensive API endpoint testing
- **Google Dorks**: Advanced search query generation

### 💻 Code Tools
- **Code Refactoring**: Automated code improvement
- **HTML to React**: Convert HTML to React components
- **jQuery to React**: Migrate jQuery to React
- **Code Comparison**: Compare code versions

### 🔧 Utilities
- **File Browser**: Advanced file system navigation
- **Proxy Manager**: Manage and test proxies
- **Card Validator**: Credit card validation and BIN analysis
- **Crypto Checker**: Cryptocurrency price tracking
- **Background Services**: Run tasks in the background

## Installation

### As a Global CLI Tool

```bash
npm install -g security-agent
```

### As a Project Dependency

```bash
npm install security-agent
```

### From Source

```bash
git clone https://github.com/yourusername/security-agent.git
cd security-agent
npm install
npm link  # For global CLI access
```

## Usage

### Interactive CLI Mode

Start the interactive command-line interface:

```bash
security-agent
# or
security-agent start
```

This launches the full-featured interactive shell with command history, auto-completion, and real-time feedback.

### Execute Single Commands

Run individual commands directly:

```bash
# Check network information
security-agent exec network-info

# Scan ports
security-agent exec scan-ports localhost 80,443,8080

# Check AI status
security-agent exec ai-status

# Search CVE database
security-agent exec search-cve "log4j"
```

### Batch Command Execution

Execute multiple commands from a JSON file:

```bash
# Create example batch file
security-agent example -o my-commands.json

# Run batch commands
security-agent batch my-commands.json
```

**Example batch file** (`my-commands.json`):
```json
[
  {
    "command": "network-info",
    "args": []
  },
  {
    "command": "scan-ports",
    "args": ["localhost", "80,443"]
  },
  {
    "command": "ai-status",
    "args": []
  }
]
```

### Programmatic Usage

Use Security Agent as a library in your Node.js applications:

```javascript
const securityAgent = require('security-agent');

// Initialize agent
const { agent, controller } = securityAgent.initialize();

// Execute commands
async function runSecurity() {
  try {
    // Check network info
    await securityAgent.executeCommand('network-info');
    
    // Scan ports
    await securityAgent.executeCommand('scan-ports', ['localhost', '80,443']);
    
    // Get status
    const status = securityAgent.getStatus();
    console.log('Agent Status:', status);
    
    // Execute batch
    const results = await securityAgent.executeBatch([
      { command: 'network-info', args: [] },
      { command: 'check-ip', args: [] }
    ]);
    
    console.log('Batch Results:', results);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Cleanup
    securityAgent.shutdown();
  }
}

runSecurity();
```

### Express.js Integration

Use the agent controller in your Express application:

```javascript
const express = require('express');
const securityAgent = require('security-agent');

const app = express();
app.use(express.json());

// Custom route handler
app.post('/api/security/scan', async (req, res) => {
  try {
    const { target, ports } = req.body;
    const result = await securityAgent.executeCommand('scan-ports', [target, ports]);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Or use the built-in controller
const agentController = securityAgent.getController();

app.post('/api/agent/execute', async (req, res) => {
  const handler = {
    success: (res, data) => res.json(data),
    error: (res, message, code) => res.status(code).json({ error: message })
  };
  
  const logger = console;
  
  return agentController.executeCommand(req, res, handler, logger);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## CLI Commands Reference

### Core Commands

- `help` - Show help information
- `status` - Display system and module status
- `version` - Show version information
- `history` - View command history
- `tips` - Show tips and tricks
- `exit` - Exit the agent

### AI Commands

- `ai-setup <provider> <apiKey>` - Configure AI provider (openai/anthropic)
- `ai-status` - Show AI module status
- `ai-analyze <file>` - Analyze code for security issues
- `ai-scan <path>` - Quick security scan
- `ai-ask <question>` - Ask AI a security question
- `chat` - Start interactive AI chat session

### Security Scanning

- `scan-ports <target> [ports]` - Scan network ports
- `network-info` - Display network information
- `security-audit` - Run comprehensive security audit
- `check-deps` - Check for vulnerable dependencies

### CVE & Vulnerabilities

- `search-cve <query>` - Search CVE database
- `check-cwe <id>` - Check CWE details
- `check-package <name>` - Check package vulnerabilities
- `scan-deps [path]` - Scan project dependencies

### Code Analysis

- `analyze-code <file>` - Analyze code file
- `analyze-project <path>` - Analyze entire project
- `refactor-file <file>` - Refactor JavaScript file
- `html-to-react <file>` - Convert HTML to React

### Web Tools

- `scrape <url>` - Scrape webpage
- `analyze-headers <url>` - Analyze security headers
- `test-endpoint <url>` - Test API endpoint

### File Browser

- `ls [path]` - List files
- `cd <path>` - Change directory
- `pwd` - Show current directory
- `cat <file>` - Display file contents
- `find <pattern>` - Search for files

### Proxy Management

- `check-ip` - Check current public IP
- `configure-proxifly <apiKey>` - Configure Proxifly
- `list-proxies` - List available proxies
- `select-proxy <id>` - Activate proxy
- `proxy-status` - Show proxy status

### Background Services

- `service-start <name>` - Start background service
- `service-stop <name>` - Stop background service
- `service-status` - Show all services status
- `service-list` - List available services

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# AI Configuration
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Proxy Configuration
PROXIFLY_API_KEY=your_proxifly_key
PROXY5_USERNAME=your_username
PROXY5_PASSWORD=your_password

# Debug Mode
DEBUG=false
```

### AI Provider Setup

Configure AI providers interactively:

```bash
security-agent exec ai-setup openai YOUR_API_KEY
# or
security-agent exec ai-setup anthropic YOUR_API_KEY
```

## API Reference

### Main Functions

#### `initialize()`
Initialize and return agent with controller
```javascript
const { agent, controller } = securityAgent.initialize();
```

#### `executeCommand(command, args)`
Execute a single command programmatically
```javascript
await securityAgent.executeCommand('scan-ports', ['localhost', '80,443']);
```

#### `executeBatch(commands)`
Execute multiple commands in batch
```javascript
const results = await securityAgent.executeBatch([
  { command: 'network-info', args: [] },
  { command: 'check-ip', args: [] }
]);
```

#### `getStatus()`
Get agent and module status
```javascript
const status = securityAgent.getStatus();
console.log(status.initialized, status.modules);
```

#### `getCommands()`
Get all available commands
```javascript
const commands = securityAgent.getCommands();
```

#### `commandExists(command)`
Check if a command exists
```javascript
const exists = securityAgent.commandExists('scan-ports');
```

#### `shutdown()`
Shutdown agent and cleanup
```javascript
securityAgent.shutdown();
```

## Examples

### Example 1: Security Audit Script

```javascript
const securityAgent = require('security-agent');

async function runAudit(target) {
  const { agent } = securityAgent.initialize();
  
  console.log('Running security audit...');
  
  const commands = [
    { command: 'scan-ports', args: [target, '1-1000'] },
    { command: 'security-audit', args: [] },
    { command: 'check-deps', args: [] },
    { command: 'scan-deps', args: ['./'] }
  ];
  
  const results = await securityAgent.executeBatch(commands);
  
  results.forEach(result => {
    console.log(`${result.command}: ${result.success ? '✓' : '✗'}`);
  });
  
  securityAgent.shutdown();
}

runAudit('example.com');
```

### Example 2: AI Code Review

```javascript
const securityAgent = require('security-agent');

async function reviewCode(filePath) {
  await securityAgent.executeCommand('ai-setup', ['openai', process.env.OPENAI_API_KEY]);
  
  console.log('Analyzing code with AI...');
  await securityAgent.executeCommand('ai-analyze', [filePath]);
  
  console.log('Getting security recommendations...');
  await securityAgent.executeCommand('ai-improve', [filePath]);
  
  securityAgent.shutdown();
}

reviewCode('./src/app.js');
```

### Example 3: Automated CVE Monitoring

```javascript
const securityAgent = require('security-agent');

async function monitorCVEs(packages) {
  const { agent } = securityAgent.initialize();
  
  for (const pkg of packages) {
    console.log(`Checking ${pkg}...`);
    await securityAgent.executeCommand('check-package', [pkg]);
  }
  
  await securityAgent.executeCommand('export-cve', ['./cve-report.json']);
  
  securityAgent.shutdown();
}

monitorCVEs(['express', 'axios', 'lodash']);
```

## Module Architecture

Security Agent uses a modular architecture:

```
security-agent/
├── index.js              # Main entry point
├── agent.js              # Core agent class
├── controllers/          # API controllers
│   └── agentController.js
├── routes/               # Express routes
│   └── agent.js
├── modules/
│   ├── security/         # Security modules
│   ├── ai/              # AI modules
│   ├── code/            # Code analysis
│   ├── network/         # Network tools
│   ├── analyze/         # Analysis tools
│   └── utils/           # Utilities
└── bin/
    └── cli.js           # CLI interface
```

## Development

### Running Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Building Documentation

```bash
npm run docs
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/security-agent/issues)
- 📖 Documentation: [Full Docs](https://github.com/yourusername/security-agent/wiki)

## Changelog

### Version 2.4.0
- Added AI chat session support
- Implemented background services
- Enhanced proxy management
- Improved code analysis tools
- Added cryptocurrency checker
- Enhanced card validation

### Version 2.3.0
- Added CVE database integration
- Implemented traffic monitoring
- Enhanced web scraping capabilities

### Version 2.2.0
- Added AI-powered security analysis
- Implemented code refactoring tools

## Security Notice

This tool is designed for authorized security testing only. Users are responsible for ensuring they have permission to test any systems. Unauthorized access to computer systems is illegal.

## Acknowledgments

- Built with Node.js
- Uses various open-source security tools
- AI integration with OpenAI and Anthropic

---

**Made with ❤️ for the security community**
