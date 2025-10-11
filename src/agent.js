// agent.js - Main Security AI Agent
// Install: npm install @anthropic-ai/sdk openai
// Run: node agent.js

const readline = require('readline');
const Scanner = require('./modules/scanner');
const Monitor = require('./modules/monitor');
const Analyzer = require('./modules/analyzer');
const CodeAnalyzer = require('./modules/code-analyzer');
const Tester = require('./modules/api-tester');
const CVE = require('./modules/cve-database');

const SecAgent = function() {
  this.scanner = new Scanner();
  this.trafficMonitor = new Monitor();
  this.aiAnalyzer = new Analyzer();
  this.codeAnalyzer = new CodeAnalyzer();
  this.apiTester = new Tester();
  this.cveDatabase = new CVE();
  
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
    'setup-api': args => this.aiAnalyzer.setup(args),
    'switch-provider': args => this.aiAnalyzer.setProvider(args),
    
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
    
    // Utility commands
    'help': () => this.showHelp(),
    'exit': () => {
      this.trafficMonitor.stopMonitoring();
      process.exit(0);
    }
  };
}

SecAgent.prototype.start = function() {
  console.log('\n🛡️  Security AI Agent v2.2');
  console.log('═══════════════════════════════════════');
  console.log('🤖 AI Provider:', this.aiAnalyzer.getProvider(), this.aiAnalyzer.configure() ? '✅' : '❌');
  console.log('📡 Traffic Monitor: Ready');
  console.log('🔍 Security Scanner: Ready');
  console.log('🌐 API Tester: Ready');
  console.log('🗄️  CVE Database: Ready');
  console.log('\nType "help" for available commands\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '🤖 agent> '
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
          console.error(`❌ Error: ${err.message}`);
          if (err.stack && process.env.DEBUG) {
            console.error(err.stack);
          }
        })
        .then(() => rl.prompt());
    } else {
      console.log(`❌ Unknown command: ${cmd}. Type "help" for available commands.`);
      rl.prompt();
    }
  });

  rl.on('close', () => {
    this.trafficMonitor.stopMonitoring();
    console.log('\n👋 Goodbye!');
    process.exit(0);
  });
  
  return Promise.resolve();
};

SecAgent.prototype.showHelp = function() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           Security AI Agent - Command Reference                ║
╚════════════════════════════════════════════════════════════════╝

📡 NETWORK SCANNING
  scan-ports [host] [start] [end]  - Scan ports (default: localhost 1-1024)
  network-info                     - Display network interfaces
  check-deps [dir]                 - Analyze package.json dependencies
  security-audit [dir]             - Run security audit on project

🔍 CODE ANALYSIS
  analyze-code <file>              - Scan file for vulnerabilities
  analyze-project [dir]            - Scan entire project directory
  
📊 TRAFFIC MONITORING
  monitor-traffic [interface]      - Start real-time traffic monitoring
  stop-monitor                     - Stop traffic monitoring
  traffic-stats                    - Show traffic statistics
  export-traffic <file>            - Export traffic data to JSON

🤖 AI FEATURES
  setup-api <provider> <key>       - Configure AI (anthropic/openai)
  switch-provider <provider>       - Switch between AI providers
  ai-analyze <file>                - Deep AI analysis of code
  ai-threat [description]          - AI threat assessment
  ai-explain <vulnerability>       - Explain security issue

🗄️  CVE & SECURITY DATABASES
  search-cve <keyword|CVE-ID>      - Search CVE database
  check-cwe <CWE-ID>               - Get CWE details
  check-package <name> [version]   - Check package vulnerabilities
  check-exploits <keyword>         - Search exploit database
  scan-deps [directory]            - Scan dependencies for CVEs
  export-cve [filename]            - Export CVE report

🌐 API TESTING
  test-endpoint <url> [method]     - Test API endpoint security
  test-collection <json-file>      - Test multiple endpoints
  export-report [filename]         - Export test results

⚙️  UTILITY
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

ENVIRONMENT:
  ANTHROPIC_API_KEY - Set API key for Anthropic Claude
  OPENAI_API_KEY    - Set API key for OpenAI GPT
  AI_PROVIDER       - Set default provider (anthropic|openai)
  DEBUG=1           - Enable debug output
`);
  return Promise.resolve();
};

// Start the agent
if (require.main === module) {

}

module.exports = SecAgent;