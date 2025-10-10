// agent.js - Main Security AI Agent
// Install: npm install @anthropic-ai/sdk
// Run: node agent.js

const readline = require('readline');
const SecurityScanner = require('./modules/scanner');
const TrafficMonitor = require('./modules/traffic-monitor');
const AIAnalyzer = require('./modules/ai-analyzer');
const CodeAnalyzer = require('./modules/code-analyzer');
const APITester = require('./modules/api-tester');

class SecurityAgent {
  constructor() {
    this.scanner = new SecurityScanner();
    this.trafficMonitor = new TrafficMonitor();
    this.aiAnalyzer = new AIAnalyzer();
    this.codeAnalyzer = new CodeAnalyzer();
    this.apiTester = new APITester();
    
    this.commands = {
      // Scanning commands
      'scan-ports': this.scanner.scanPorts.bind(this.scanner),
      'check-deps': this.scanner.checkDependencies.bind(this.scanner),
      'network-info': this.scanner.getNetworkInfo.bind(this.scanner),
      'security-audit': this.scanner.securityAudit.bind(this.scanner),
      
      // Code analysis commands
      'analyze-code': this.codeAnalyzer.analyzeCode.bind(this.codeAnalyzer),
      'analyze-project': this.codeAnalyzer.analyzeProject.bind(this.codeAnalyzer),
      
      // Traffic monitoring commands
      'monitor-traffic': this.trafficMonitor.startMonitoring.bind(this.trafficMonitor),
      'stop-monitor': this.trafficMonitor.stopMonitoring.bind(this.trafficMonitor),
      'traffic-stats': this.trafficMonitor.showStats.bind(this.trafficMonitor),
      'export-traffic': this.trafficMonitor.exportData.bind(this.trafficMonitor),
      
      // AI commands
      'ai-analyze': this.aiAnalyzer.analyzeCode.bind(this.aiAnalyzer),
      'ai-threat': this.aiAnalyzer.threatAssessment.bind(this.aiAnalyzer),
      'ai-explain': this.aiAnalyzer.explainVulnerability.bind(this.aiAnalyzer),
      'setup-api': this.aiAnalyzer.setupAPI.bind(this.aiAnalyzer),
      
      // Utility commands
      'help': this.showHelp.bind(this),
      'exit': () => {
        this.trafficMonitor.stopMonitoring();
        process.exit(0);
      }
    };
  }

  async start() {
    console.log('\n������️  Security AI Agent v2.0');
    console.log('═══════════════════════════════════════');
    console.log('������ AI Features:', this.aiAnalyzer.isConfigured() ? 'Enabled ✅' : 'Disabled (use setup-api)');
    console.log('������ Traffic Monitor: Ready');
    console.log('������ Security Scanner: Ready');
    console.log('\nType "help" for available commands\n');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '������ agent> '
    });

    rl.prompt();

    rl.on('line', async (input) => {
      const trimmed = input.trim();
      if (!trimmed) {
        rl.prompt();
        return;
      }

      const [cmd, ...args] = trimmed.split(' ');
      
      if (this.commands[cmd]) {
        try {
          await this.commands[cmd](args);
        } catch (err) {
          console.error(`❌ Error: ${err.message}`);
          if (err.stack && process.env.DEBUG) {
            console.error(err.stack);
          }
        }
      } else {
        console.log(`❌ Unknown command: ${cmd}. Type "help" for available commands.`);
      }
      
      rl.prompt();
    });

    rl.on('close', () => {
      this.trafficMonitor.stopMonitoring();
      console.log('\n������ Goodbye!');
      process.exit(0);
    });
  }

  showHelp() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║           Security AI Agent - Command Reference                ║
╚════════════════════════════════════════════════════════════════╝

������ NETWORK SCANNING
  scan-ports [host] [start] [end]  - Scan ports (default: localhost 1-1024)
  network-info                     - Display network interfaces
  check-deps [dir]                 - Analyze package.json dependencies
  security-audit [dir]             - Run security audit on project

������ CODE ANALYSIS
  analyze-code <file>              - Scan file for vulnerabilities
  analyze-project [dir]            - Scan entire project directory
  
������ TRAFFIC MONITORING
  monitor-traffic [interface]      - Start real-time traffic monitoring
  stop-monitor                     - Stop traffic monitoring
  traffic-stats                    - Show traffic statistics
  export-traffic <file>            - Export traffic data to JSON

������ AI FEATURES
  setup-api <key>                  - Configure Anthropic API key
  ai-analyze <file>                - Deep AI analysis of code
  ai-threat [description]          - AI threat assessment
  ai-explain <vulnerability>       - Explain security issue

⚙️  UTILITY
  help                             - Show this help message
  exit                             - Exit the agent

EXAMPLES:
  scan-ports 127.0.0.1 8000 9000
  analyze-code server.js
  monitor-traffic eth0
  ai-analyze app.js
  ai-threat SQL injection in login form

ENVIRONMENT:
  ANTHROPIC_API_KEY - Set API key for AI features
  DEBUG=1           - Enable debug output
`);
  }
}
module.exports = SecurityAgent;