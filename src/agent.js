// agent.js - Main Security AI Agent
// Install: npm install @anthropic-ai/sdk openai
// Run: node agent.js

const readline = require('readline');
const SecurityScanner = require('./modules/security/scanner');
const TrafficMonitor = require('./modules/security/monitor');
const AIAnalyzer = require('./modules/analyze/analyzer');
const CodeAnalyzer = require('./modules/code/code-analyzer');
const APITester = require('./modules/api-tester');
const CVEDatabase = require('./modules/cve-database');
const CodeRefactor = require('./modules/code/code-refactor');

function SecurityAgent() {
  this.scanner = new SecurityScanner();
  this.trafficMonitor = new TrafficMonitor();
  this.aiAnalyzer = new AIAnalyzer();
  this.codeAnalyzer = new CodeAnalyzer();
  this.apiTester = new APITester();
  this.cveDatabase = new CVEDatabase();
  this.codeRefactor = new CodeRefactor();
  this.colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m'
  };
  this.commands = {
    // Scanning commands
    'scan-ports': args => this.scanner.scanPorts(args),
    'check-deps': args => this.scanner.checkDependencies(args),
    'network-info': args => this.scanner.getNetworkInfo(args),
    'security-audit': args => this.scanner.securityAudit(args),
    
    // Code analysis commands
    'analyze-code': args => this.codeAnalyzer.analyzeCode(args),
    'analyze-project': args => this.codeAnalyzer.analyzeProject(args),
    
    // Traffic monitoring commands
    'monitor-traffic': args => this.trafficMonitor.startMonitoring(args),
    'stop-monitor': args => this.trafficMonitor.stopMonitoring(args),
    'traffic-stats': args => this.trafficMonitor.showStats(args),
    'export-traffic': args => this.trafficMonitor.exportData(args),
    
    // AI commands
    'ai-analyze': args => this.aiAnalyzer.analyzeCode(args),
    'ai-threat': args => this.aiAnalyzer.threatAssessment(args),
    'ai-explain': args => this.aiAnalyzer.explainVulnerability(args),
    'setup-api': args => this.aiAnalyzer.setupAPI(args),
    'switch-provider': args => this.aiAnalyzer.switchProvider(args),
    
    // CVE & Security Database commands
    'search-cve': args => this.cveDatabase.searchCVE(args),
    'check-cwe': args => this.cveDatabase.checkCWE(args),
    'check-package': args => this.cveDatabase.checkPackage(args),
    'check-exploits': args => this.cveDatabase.checkExploits(args),
    'scan-deps': args => this.cveDatabase.scanDependencies(args),
    'export-cve': args => this.cveDatabase.exportCVEReport(args),
    
    // API Testing commands
    'test-endpoint': args => this.apiTester.testEndpoint(args),
    'test-collection': args => this.apiTester.testCollection(args),
    'export-report': args => this.apiTester.exportReport(args),
    
    // Code Refactoring commands
    'refactor-file': args => this.codeRefactor.refactorFile(args),
    'refactor-project': args => this.codeRefactor.refactorProject(args),
    'analyze-refactor': args => this.codeRefactor.analyzeCode(args),
    'compare-refactor': args => this.codeRefactor.compareVersions(args),
    
    // Utility commands
    'help': () => this.showHelp(),
    'exit': () => {
      this.trafficMonitor.stopMonitoring();
      process.exit(0);
    }
  };
}

SecurityAgent.prototype.start = function() {
  // ANSI color codes
  const c = this.colors;  

  console.log('\n' + c.bright + c.red + 'FEAR AI Security & Development Agent v1.0.1' + c.reset);
  console.log(c.cyan + '=======================================================' + c.reset);
  console.log(c.yellow + 'AI Provider:' + c.reset, this.aiAnalyzer.getProvider(), this.aiAnalyzer.configure() ? c.green + 'READY' + c.reset : c.red + 'NOT CONFIGURED' + c.reset);
  console.log(c.yellow + 'Traffic Monitor:' + c.reset, c.green + 'Ready' + c.reset);
  console.log(c.yellow + 'Security Scanner:' + c.reset, c.green + 'Ready' + c.reset);
  console.log(c.yellow + 'API Tester:' + c.reset, c.green + 'Ready' + c.reset);
  console.log(c.yellow + 'CVE Database:' + c.reset, c.green + 'Ready' + c.reset);
  console.log(c.yellow + 'Code Refactor:' + c.reset, c.green + 'Ready' + c.reset);
  console.log('\n' + c.magenta + 'Type "help" for available commands' + c.reset + '\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: c.bright + c.cyan + 'FEAR >> ' + c.reset
  });

  rl.prompt();

  rl.on('line', input => {
    const trimmed = input.trim();
    if (!trimmed) {
      rl.prompt();
      return;
    }

    const [cmd, ...args] = trimmed.split(' ');
    
    if (this.commands[cmd]) {
      Promise.resolve()
        .then(() => this.commands[cmd](args))
        .catch(err => {
          console.error(c.red + 'Error: ' + err.message + c.reset);
          if (err.stack && process.env.DEBUG) {
            console.error(err.stack);
          }
        })
        .then(() => rl.prompt());
    } else {
      console.log(c.red + 'Unknown command: ' + cmd + '. Type "help" for available commands.' + c.reset);
      rl.prompt();
    }
  });

  rl.on('close', () => {
    this.trafficMonitor.stopMonitoring();
    console.log('\n' + c.cyan + 'Goodbye!' + c.reset);
    process.exit(0);
  });
  
  return Promise.resolve();
};

SecurityAgent.prototype.showHelp = function() {
  const c = this.colors;
  console.log(`
` + c.magenta + `==========================================================` + c.reset + `
` + c.magenta + `#           Security AI Agent - Command Reference        #` + c.reset + `
` + c.magenta + `==========================================================` + c.reset + `

NETWORK SCANNING
  scan-ports [host] [start] [end]  - Scan ports (default: localhost 1-1024)
  network-info                     - Display network interfaces
  check-deps [dir]                 - Analyze package.json dependencies
  security-audit [dir]             - Run security audit on project

CODE ANALYSIS
  analyze-code <file>              - Scan file for vulnerabilities
  analyze-project [dir]            - Scan entire project directory
  
TRAFFIC MONITORING
  monitor-traffic [interface]      - Start real-time traffic monitoring
  stop-monitor                     - Stop traffic monitoring
  traffic-stats                    - Show traffic statistics
  export-traffic <file>            - Export traffic data to JSON

AI FEATURES
  setup-api <provider> <key>       - Configure AI (anthropic/openai)
  switch-provider <provider>       - Switch between AI providers
  ai-analyze <file>                - Deep AI analysis of code
  ai-threat [description]          - AI threat assessment
  ai-explain <vulnerability>       - Explain security issue

CVE & SECURITY DATABASES
  search-cve <keyword|CVE-ID>      - Search CVE database
  check-cwe <CWE-ID>               - Get CWE details
  check-package <name> [version]   - Check package vulnerabilities
  check-exploits <keyword>         - Search exploit database
  scan-deps [directory]            - Scan dependencies for CVEs
  export-cve [filename]            - Export CVE report

API TESTING
  test-endpoint <url> [method]     - Test API endpoint security
  test-collection <json-file>      - Test multiple endpoints
  export-report [filename]         - Export test results

CODE REFACTORING
  refactor-file <file> [pattern]   - Refactor JavaScript file
  refactor-project [dir] [pattern] - Refactor entire project
  analyze-refactor <file>          - Analyze code for refactoring
  compare-refactor <orig> <new>    - Compare refactored versions
  
  Patterns: class-to-function, async-to-promise, arrow-functions,
            use-this, modernize (default)

 UTILITY
  help                             - Show this help message
  exit                             - Exit the agent

EXAMPLES:
  scan-ports 127.0.0.1 8000 9000
  analyze-code server.js
  monitor-traffic eth0
  setup-api openai sk-your-key
  search-cve CVE-2024-1234
  check-cwe CWE-79
  check-package express
  ai-analyze app.js
  test-endpoint https://api.example.com/users GET
  refactor-file app.js modernize
  analyze-refactor server.js

ENVIRONMENT:
  ANTHROPIC_API_KEY - Set API key for Anthropic Claude
  OPENAI_API_KEY    - Set API key for OpenAI GPT
  AI_PROVIDER       - Set default provider (anthropic|openai)
  DEBUG=1           - Enable debug output
`);
  return Promise.resolve();
};

module.exports = SecurityAgent;