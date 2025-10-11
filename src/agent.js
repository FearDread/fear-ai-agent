// agent.js - Main Security AI Agent
// Install: npm install @anthropic-ai/sdk openai
// Run: node agent.js

const readline = require('readline');
const SecurityScanner = require('./modules/security/scanner');
const TrafficMonitor = require('./modules/security/monitor');
const AIAnalyzer = require('./modules/analyze/ai');
const CodeAnalyzer = require('./modules/code/analyzer');
const APITester = require('./modules/analyze/api');
const CVEDatabase = require('./modules/cve-database');
const CodeRefactor = require('./modules/code/refactor');
const WebScraper = require('./modules/security/web');
const colorizer = require('./modules/utils/colorizer');

const C = colorizer;
const SecurityAgent = function() {
  this.scanner = new SecurityScanner();
  this.trafficMonitor = new TrafficMonitor();
  this.aiAnalyzer = new AIAnalyzer();
  this.codeAnalyzer = new CodeAnalyzer();
  this.apiTester = new APITester();
  this.cveDatabase = new CVEDatabase();
  this.codeRefactor = new CodeRefactor();
  this.webScraper = new WebScraper();
  
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
    
    // Web Scraping commands
    'scrape': args => this.webScraper.scrape(args),
    'scrape-links': args => this.webScraper.scrapeLinks(args),
    'scrape-images': args => this.webScraper.scrapeImages(args),
    'export-scrape': args => this.webScraper.exportScrape(args),
    'analyze-headers': args => this.webScraper.analyzeSecurityHeaders(args),
    
    // Utility commands
    'help': () => this.showHelp(),
    'exit': () => {
      this.trafficMonitor.stopMonitoring();
      process.exit(0);
    }
  };

  this.logo = `
                                        
@@@@@@@@  @@@@@@@@   @@@@@@   @@@@@@@   
@@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@  
@@!       @@!       @@!  @@@  @@!  @@@  
!@!       !@!       !@!  @!@  !@!  @!@  
@!!!:!    @!!!:!    @!@!@!@!  @!@!!@!   
!!!!!:    !!!!!:    !!!@!!!!  !!@!@!    
!!:       !!:       !!:  !!!  !!: :!!   
:!:       :!:       :!:  !:!  :!:  !:!  
 ::        :: ::::  ::   :::  ::   :::  
 :        : :: ::    :   : :   :   : :                                                                                                                                                          
`;

}

SecurityAgent.prototype = {
  start() {
    console.log(C.header(this.logo));
    console.log(C.box('-- The Security & DevOps AI --'));
    console.log(C.separator());
    console.log(C.cyan('AI Provider: ') + C.bright(this.aiAnalyzer.getProvider()) + ' ' + 
      (this.aiAnalyzer.configure() ? C.green('[READY]') : C.red('[NOT CONFIGURED]')));
    console.log(C.cyan('Traffic Monitor: ') + C.green('[Ready]'));
    console.log(C.cyan('Security Scanner: ') + C.green('[Ready]'));
    console.log(C.cyan('API Tester: ') + C.green('[Ready]'));
    console.log(C.cyan('CVE Database: ') + C.green('[Ready]'));
    console.log(C.cyan('Code Refactor: ') + C.green('[Ready]'));
    console.log(C.cyan('Web Scraper: ') + C.green('[Ready]'));
    console.log('\n' + C.magenta('Type "help" for available commands') + '\n');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: C.bright(C.cyan('agent> '))
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
            console.error(C.error(err.message));
            if (err.stack && process.env.DEBUG) {
              console.error(C.dim(err.stack));
            }
          })
          .then(() => rl.prompt());
      } else {
        console.log(C.error('Unknown command: ' + cmd + '. Type "help" for available commands.'));
        rl.prompt();
      }
    });

    rl.on('close', () => {
      this.trafficMonitor.stopMonitoring();
      console.log('\n' + C.cyan('Goodbye!'));
      process.exit(0);
    });
    
    return Promise.resolve();
  },

  showHelp() {
    console.log(C.box('-- FEAR AI Help Menu: --'));
    console.log(C.section('NETWORK SCANNING'));
    console.log(C.bullet('scan-ports [host] [start] [end]  - Scan ports (default: localhost 1-1024)'));
    console.log(C.bullet('network-info                     - Display network interfaces'));
    console.log(C.bullet('check-deps [dir]                 - Analyze package.json dependencies'));
    console.log(C.bullet('security-audit [dir]             - Run security audit on project'));

    console.log(C.section('CODE ANALYSIS'));
    console.log(C.bullet('analyze-code <file>              - Scan file for vulnerabilities'));
    console.log(C.bullet('analyze-project [dir]            - Scan entire project directory'));
    
    console.log(C.section('TRAFFIC MONITORING'));
    console.log(C.bullet('monitor-traffic [interface]      - Start real-time traffic monitoring'));
    console.log(C.bullet('stop-monitor                     - Stop traffic monitoring'));
    console.log(C.bullet('traffic-stats                    - Show traffic statistics'));
    console.log(C.bullet('export-traffic <file>            - Export traffic data to JSON'));

    console.log(C.section('AI FEATURES'));
    console.log(C.bullet('setup-api <provider> <key>       - Configure AI (anthropic/openai)'));
    console.log(C.bullet('switch-provider <provider>       - Switch between AI providers'));
    console.log(C.bullet('ai-analyze <file>                - Deep AI analysis of code'));
    console.log(C.bullet('ai-threat [description]          - AI threat assessment'));
    console.log(C.bullet('ai-explain <vulnerability>       - Explain security issue'));

    console.log(C.section('CVE & SECURITY DATABASES'));
    console.log(C.bullet('search-cve <keyword|CVE-ID>      - Search CVE database'));
    console.log(C.bullet('check-cwe <CWE-ID>               - Get CWE details'));
    console.log(C.bullet('check-package <name> [version]   - Check package vulnerabilities'));
    console.log(C.bullet('check-exploits <keyword>         - Search exploit database'));
    console.log(C.bullet('scan-deps [directory]            - Scan dependencies for CVEs'));
    console.log(C.bullet('export-cve [filename]            - Export CVE report'));

    console.log(C.section('API TESTING'));
    console.log(C.bullet('test-endpoint <url> [method]     - Test API endpoint security'));
    console.log(C.bullet('test-collection <json-file>      - Test multiple endpoints'));
    console.log(C.bullet('export-report [filename]         - Export test results'));

    console.log(C.section('CODE REFACTORING'));
    console.log(C.bullet('refactor-file <file> [pattern]   - Refactor JavaScript file'));
    console.log(C.bullet('refactor-project [dir] [pattern] - Refactor entire project'));
    console.log(C.bullet('analyze-refactor <file>          - Analyze code for refactoring'));
    console.log(C.bullet('compare-refactor <orig> <new>    - Compare refactored versions'));
    console.log(C.dim('  Patterns: class-to-function, async-to-promise, arrow-functions,'));
    console.log(C.dim('            use-this, modernize (default)'));

    console.log(C.section('WEB SCRAPING'));
    console.log(C.bullet('scrape <url>                     - Scrape webpage content'));
    console.log(C.bullet('scrape-links <url>               - Extract all links from page'));
    console.log(C.bullet('scrape-images <url>              - Extract all images from page'));
    console.log(C.bullet('export-scrape <url> [filename]   - Export scraped data to JSON'));
    console.log(C.bullet('analyze-headers <url>            - Analyze security headers'));

    console.log(C.section('UTILITY'));
    console.log(C.bullet('help                             - Show this help message'));
    console.log(C.bullet('exit                             - Exit the agent'));

    console.log(C.section('EXAMPLES'));
    console.log(C.dim('  scan-ports 127.0.0.1 8000 9000'));
    console.log(C.dim('  analyze-code server.js'));
    console.log(C.dim('  monitor-traffic eth0'));
    console.log(C.dim('  setup-api openai sk-your-key'));
    console.log(C.dim('  search-cve CVE-2024-1234'));
    console.log(C.dim('  check-cwe CWE-79'));
    console.log(C.dim('  check-package express'));
    console.log(C.dim('  ai-analyze app.js'));
    console.log(C.dim('  test-endpoint https://api.example.com/users GET'));
    console.log(C.dim('  refactor-file app.js modernize'));
    console.log(C.dim('  scrape https://example.com'));
    console.log(C.dim('  analyze-headers https://example.com'));

    console.log(C.section('ENVIRONMENT'));
    console.log(C.dim('  ANTHROPIC_API_KEY - Set API key for Anthropic Claude'));
    console.log(C.dim('  OPENAI_API_KEY    - Set API key for OpenAI GPT'));
    console.log(C.dim('  AI_PROVIDER       - Set default provider (anthropic|openai)'));
    console.log(C.dim('  NO_COLOR=1        - Disable colored output'));
    console.log(C.dim('  DEBUG=1           - Enable debug output'));
    console.log();
    
    return Promise.resolve();
  }
};

// Start the agent
if (require.main === module) {
  const agent = new SecurityAgent();
  agent.start().catch(err => {
    console.error(C.error('Fatal error: ' + err.message));
    process.exit(1);
  });
}

module.exports = SecurityAgent;