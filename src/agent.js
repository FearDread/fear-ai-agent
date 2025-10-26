const readline = require('readline');
const fs = require('fs');
const path = require('path');
const colorizer = require('./modules/utils/colorizer');

const SecurityAgent = function () {
  this.modules = {};
  this.commands = {};
  this.commandHistory = [];
  this.historyIndex = 0;
  this.maxHistory = 100;

  // Module definitions with metadata
  this.definitions = [
    // Security
    { name: 'scanner', file: './modules/security/scanner', displayName: 'Security Scanner' },
    { name: 'webScraper', file: './modules/security/web', displayName: 'Web Scraper' },
    { name: 'vulnAssessment', file: './modules/security/vulnerability', displayName: 'Vuln Assessment' },
    { name: 'trafficMonitor', file: './modules/security/monitor', displayName: 'Traffic Monitor' },
    { name: 'cveDatabase', file: './modules/security/cve', displayName: 'CVE Database' },
    // AI
    { name: 'aiAnalyzer', file: './modules/ai/ai', displayName: 'AI Analyzer' },
    { name: 'codeAnalyzer', file: './modules/code/analyzer', displayName: 'Code Analyzer' },
    { name: 'apiTester', file: './modules/analyze/api', displayName: 'API Tester' },
    // Coding
    { name: 'codeRefactor', file: './modules/code/refactor', displayName: 'Code Refactor' },
    { name: 'htmlToReact', file: './modules/code/react', displayName: 'HTML to React' },
    { name: 'JQueryToReact', file: './modules/code/jquery', displayName: 'jQuery to React' },
    // CC / Bin validation
    { name: 'cardValidator', file: './modules/ccard/validator', displayName: 'Card Validator' },
    { name: 'cardStatusChecker', file: './modules/ccard/checker', displayName: 'Card Payment Checker'},
    { name: 'cryptoChecker', file: './modules/crypto/exchange', displayName: 'Crypto Exchange' }
  ];

  // Command to module mappings
  this.mappings = {
    // Scanner commands
    'scan-ports': { module: 'scanner', method: 'scanPorts', description: 'Scan network ports' },
    'check-deps': { module: 'scanner', method: 'checkDependencies', description: 'Check dependencies' },
    'network-info': { module: 'scanner', method: 'getNetworkInfo', description: 'Show network info' },
    'security-audit': { module: 'scanner', method: 'securityAudit', description: 'Run security audit' },

    // Code analyzer commands
    'analyze-code': { module: 'codeAnalyzer', method: 'analyzeCode', description: 'Analyze code file' },
    'analyze-project': { module: 'codeAnalyzer', method: 'analyzeProject', description: 'Analyze project' },

    // Traffic monitor commands
    'monitor-traffic': { module: 'trafficMonitor', method: 'startMonitoring', description: 'Start traffic monitoring' },
    'stop-monitor': { module: 'trafficMonitor', method: 'stopMonitoring', description: 'Stop monitoring' },
    'traffic-stats': { module: 'trafficMonitor', method: 'showStats', description: 'Show traffic stats' },
    'export-traffic': { module: 'trafficMonitor', method: 'exportData', description: 'Export traffic data' },

    // AI analyzer commands - EXPANDED
    // Configuration
    'ai-setup': { module: 'aiAnalyzer', method: 'setup', description: 'Configure AI provider (anthropic/openai/google)' },
    'ai-provider': { module: 'aiAnalyzer', method: 'setProvider', description: 'Switch AI provider' },
    'ai-status': { module: 'aiAnalyzer', method: 'status', description: 'Show AI module status' },
    'ai-help': { module: 'aiAnalyzer', method: 'help', description: 'Show AI commands help' },

    // Code Analysis
    'ai-analyze': { module: 'aiAnalyzer', method: 'analyzeCode', description: 'AI security analysis of code file' },
    'ai-batch': { module: 'aiAnalyzer', method: 'analyzeBatch', description: 'Batch analyze multiple files' },
    'ai-compare': { module: 'aiAnalyzer', method: 'compareCodeVersions', description: 'Compare two code versions' },

    // Security Intelligence
    'ai-threat': { module: 'aiAnalyzer', method: 'threatAssessment', description: 'Comprehensive threat assessment' },
    'ai-explain': { module: 'aiAnalyzer', method: 'explainVulnerability', description: 'Explain vulnerability/CWE' },

    // Code Generation
    'ai-generate': { module: 'aiAnalyzer', method: 'generateNodeCode', description: 'Generate secure Node.js code' },

    // Project Improvement
    'ai-improve': { module: 'aiAnalyzer', method: 'suggestImprovements', description: 'Get security recommendations' },

    // Interactive Chat
    'ai-chat': { module: 'aiAnalyzer', method: 'chat', description: 'Interactive AI chat assistant' },
    'ai-clear-history': { module: 'aiAnalyzer', method: 'clearChatHistory', description: 'Clear chat history' },

    // Quick access aliases
    'ai-scan': { module: 'aiAnalyzer', method: 'quickScan', description: 'Quick security scan' },
    'ai-ask': { module: 'aiAnalyzer', method: 'quickChat', description: 'Quick AI question' },

    // Legacy aliases (for backwards compatibility)
    'switch-provider': { module: 'aiAnalyzer', method: 'setProvider', description: 'Switch AI provider (alias)' },

    // CVE database commands
    'search-cve': { module: 'cveDatabase', method: 'searchCVE', description: 'Search CVE database' },
    'check-cwe': { module: 'cveDatabase', method: 'checkCWE', description: 'Check CWE details' },
    'check-package': { module: 'cveDatabase', method: 'checkPackage', description: 'Check package vulnerabilities' },
    'check-exploits': { module: 'cveDatabase', method: 'checkExploits', description: 'Search exploits' },
    'scan-deps': { module: 'cveDatabase', method: 'scanDependencies', description: 'Scan dependencies for CVEs' },
    'export-cve': { module: 'cveDatabase', method: 'exportCVEReport', description: 'Export CVE report' },

    // API tester commands
    'test-endpoint': { module: 'apiTester', method: 'testEndpoint', description: 'Test API endpoint' },
    'test-collection': { module: 'apiTester', method: 'testCollection', description: 'Test API collection' },
    'export-report': { module: 'apiTester', method: 'exportReport', description: 'Export test report' },

    // Code refactor commands
    'refactor-file': { module: 'codeRefactor', method: 'refactorFile', description: 'Refactor JavaScript file' },
    'refactor-project': { module: 'codeRefactor', method: 'refactorProject', description: 'Refactor project' },
    'analyze-refactor': { module: 'codeRefactor', method: 'analyzeCode', description: 'Analyze for refactoring' },
    'compare-refactor': { module: 'codeRefactor', method: 'compareVersions', description: 'Compare versions' },

    // Web scraper commands
    'scrape': { module: 'webScraper', method: 'scrape', description: 'Scrape webpage' },
    'scrape-links': { module: 'webScraper', method: 'scrapeLinks', description: 'Extract links' },
    'scrape-images': { module: 'webScraper', method: 'scrapeImages', description: 'Extract images' },
    'export-scrape': { module: 'webScraper', method: 'exportScrape', description: 'Export scraped data' },
    'analyze-headers': { module: 'webScraper', method: 'analyzeSecurityHeaders', description: 'Analyze security headers' },

    // Vulnerability assessment commands
    'vuln-assess': { module: 'vulnAssessment', method: 'assess', description: 'Run vulnerability assessment' },
    'export-vuln': { module: 'vulnAssessment', method: 'exportResults', description: 'Export vulnerability results' },

    // HTML to React commands
    'html-to-react': { module: 'htmlToReact', method: 'convert', description: 'Convert HTML to React' },
    'batch-convert': { module: 'htmlToReact', method: 'convertBatch', description: 'Batch convert HTML files' },
    'analyze-html': { module: 'htmlToReact', method: 'analyzeHTML', description: 'Analyze HTML structure' },

    // jQuery to React commands
    'jquery-to-react': { module: 'JQueryToReact', method: 'convert', description: 'Convert jQuery to React' },
    'jq-batch-convert': { module: 'JQueryToReact', method: 'convertBatch', description: 'Batch convert jQuery files' },
    'analyze-jquery': { module: 'JQueryToReact', method: 'analyzeBatch', description: 'Analyze jQuery structure' },

    // CC and BIN number validation
    'validate-card': { module: 'cardValidator', method: 'validateCard', description: 'Validate card number format' },
    'validate-batch': { module: 'cardValidator', method: 'validateBatch', description: 'Batch validate cards' },
    'analyze-bin': { module: 'cardValidator', method: 'analyzeBIN', description: 'Analyze BIN number' },
    'show-test-cards': { module: 'cardValidator', method: 'showTestCards', description: 'Show official test cards' },
    'explain-algorithm': { module: 'cardValidator', method: 'explainAlgorithm', description: 'Explain validation algorithms' },
    'card-security-report': { module: 'cardValidator', method: 'securityReport', description: 'Generate security report' },

    'check-card-status': { module:'cardStatusChecker', method:'checkCardStatus', description:'- Check single card' },
    'check-card-batch': { module:'cardStatusChecker', method:'checkCardBatch', description:'- Check single card' },
    'configure-card-checker': { module:'cardStatusChecker', method:'configureCardChecker', description:'- Check single card' },
    'card-checker-help': { module:'cardStatusChecker', method:'showHelp', description:'- show help menu' },

    'compare-rates': { module: 'cryptoChecker', method: 'compareRates', description: 'Compare crypto rates across exchanges' },

    'crypto-price': { module: 'cryptoChecker', method: 'getPrice', description: 'Get cryptocurrency price' },
    'track-portfolio': { module: 'cryptoChecker', method: 'trackPortfolio', description: 'Track multiple cryptos' },
    'crypto-convert': { module: 'cryptoChecker', method: 'convert', description: 'Convert between cryptocurrencies' },
    'market-summary': { module: 'cryptoChecker', method: 'marketSummary', description: 'Show market summary' },
    'export-rates': { module: 'cryptoChecker', method: 'exportRates', description: 'Export rates to file' },
    'crypto-help': { module: 'cryptoChecker', method: 'showHelp', description: 'Show crypto commands help' }
  };

  this.loadModules();
  this.registerCommands();

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

  loadModules() {
    console.log(colorizer.dim('Loading modules...'));

    this.definitions.forEach(moduleDef => {
      try {
        const ModuleClass = require(moduleDef.file);
        this.modules[moduleDef.name] = new ModuleClass();
        console.log(colorizer.dim('  [OK] ' + moduleDef.displayName));
      } catch (err) {
        console.log(colorizer.warning('  [SKIP] ' + moduleDef.displayName + ' - ' + err.message));
      }
    });

    console.log();
  },

  registerCommands() {
    Object.entries(this.mappings).forEach(([cmd, config]) => {
      const module = this.modules[config.module];
      if (module && typeof module[config.method] === 'function') {
        this.commands[cmd] = args => module[config.method](args);
      }
    });

    // Add built-in commands
    this.commands['help'] = () => this.showHelp();
    this.commands['status'] = () => this.showStatus();
    this.commands['history'] = () => this.showHistory();
    this.commands['clear'] = () => this.clearScreen();
    this.commands['banner'] = () => this.showBanner();
    this.commands['version'] = () => this.showVersion();
    this.commands['tips'] = () => this.showTips();
    this.commands['exit'] = () => this.exit();
  },

  start() {
    //this.clearScreen();
    this.showBanner();
    this.showStatus();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.getPrompt(),
      completer: line => this.autocomplete(line)
    });

    rl.prompt();

    rl.on('line', input => {
      const trimmed = input.trim();

      if (trimmed) {
        this.addToHistory(trimmed);
        this.executeCommand(trimmed)
          .then(() => rl.prompt())
          .catch(() => rl.prompt());
      } else {
        rl.prompt();
      }
    });

    rl.on('close', () => {
      this.exit();
    });

    return Promise.resolve();
  },

  showBanner() {

    const banner = [
      '=============================================================',
      '║                                                           ║',
      '║           SECURITY AI AGENT v2.3                          ║',
      '║           Advanced Security Testing Framework             ║',
      '║                                                           ║',
      '=============================================================',
    ];

    console.log(colorizer.header(this.logo));
    console.log(colorizer.bright(colorizer.cyan(banner.join('\n'))));
    console.log();
  },

  showStatus() {
    console.log(colorizer.section('System Status'));

    this.definitions.forEach(moduleDef => {
      const module = this.modules[moduleDef.name];
      const status = module ? colorizer.green('[READY]') : colorizer.red('[UNAVAILABLE]');

      // Special status for AI Analyzer
      if (moduleDef.name === 'aiAnalyzer' && module) {
        const configured = module.isConfigured && module.isConfigured();
        const provider = module.getProviderName && module.getProviderName();
        const aiStatus = configured ?
          colorizer.green('[READY - ' + provider + ']') :
          colorizer.yellow('[NOT CONFIGURED]');
        console.log(colorizer.cyan('  ' + moduleDef.displayName.padEnd(20)) + aiStatus);
      } else {
        console.log(colorizer.cyan('  ' + moduleDef.displayName.padEnd(20)) + status);
      }
    });

    console.log();
    console.log(colorizer.magenta('Type "help" for commands, "ai-help" for AI features, "exit" to quit'));
    console.log();
  },

  getPrompt() {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    return colorizer.bright(colorizer.cyan('[' + timestamp + '] ')) +
      colorizer.bright(colorizer.green('FEAR >> '));
  },

  executeCommand(input) {
    const [cmd, ...args] = input.split(' ');

    if (this.commands[cmd]) {
      return Promise.resolve()
        .then(() => this.commands[cmd](args))
        .catch(err => {
          console.log(colorizer.error(err.message));
          if (err.stack && process.env.DEBUG) {
            console.log(colorizer.dim(err.stack));
          }
        });
    } else {
      console.log(colorizer.error('Unknown command: ' + cmd));
      console.log(colorizer.info('Type "help" for available commands'));
      return Promise.resolve();
    }
  },

  autocomplete(line) {
    const completions = Object.keys(this.commands);
    const hits = completions.filter(c => c.startsWith(line));
    return [hits.length ? hits : completions, line];
  },

  addToHistory(cmd) {
    this.commandHistory.push(cmd);
    if (this.commandHistory.length > this.maxHistory) {
      this.commandHistory.shift();
    }
  },

  showHistory() {
    console.log(colorizer.section('Command History'));

    if (this.commandHistory.length === 0) {
      console.log(colorizer.dim('  No commands in history'));
    } else {
      const recent = this.commandHistory.slice(-20);
      recent.forEach((cmd, i) => {
        const num = this.commandHistory.length - recent.length + i + 1;
        console.log(colorizer.numbered(num, cmd));
      });
    }
    console.log();
    return Promise.resolve();
  },

  showVersion() {
    console.log(colorizer.section('Version Information'));
    console.log(colorizer.cyan('  Agent Version: ') + colorizer.bright('2.3.0'));
    console.log(colorizer.cyan('  Node Version: ') + colorizer.bright(process.version));
    console.log(colorizer.cyan('  Platform: ') + colorizer.bright(process.platform));
    console.log(colorizer.cyan('  Architecture: ') + colorizer.bright(process.arch));

    const moduleCount = Object.keys(this.modules).length;
    const commandCount = Object.keys(this.commands).length;

    console.log(colorizer.cyan('  Loaded Modules: ') + colorizer.bright(moduleCount));
    console.log(colorizer.cyan('  Available Commands: ') + colorizer.bright(commandCount));
    console.log();
    return Promise.resolve();
  },

  clearScreen() {
    console.clear();
    process.stdout.write('\x1Bc');
  },

  showHelp() {
    console.log(colorizer.box('Security AI Agent - Command Reference'));

    // Group commands by category
    const categories = {
      'AI Configuration': [
        'ai-setup', 'ai-provider', 'ai-status', 'ai-help'
      ],
      'AI Code Analysis': [
        'ai-analyze', 'ai-batch', 'ai-compare', 'ai-scan'
      ],
      'AI Security Intelligence': [
        'ai-threat', 'ai-explain'
      ],
      'AI Code Generation': [
        'ai-generate'
      ],
      'AI Project Improvement': [
        'ai-improve'
      ],
      'AI Chat & Assistance': [
        'ai-chat', 'ai-ask', 'ai-clear-history'
      ],
      'Network Scanning': [
        'scan-ports', 'network-info', 'check-deps', 'security-audit'
      ],
      'Code Analysis': [
        'analyze-code', 'analyze-project'
      ],
      'Traffic Monitoring': [
        'monitor-traffic', 'stop-monitor', 'traffic-stats', 'export-traffic'
      ],
      'CVE & Security': [
        'search-cve', 'check-cwe', 'check-package', 'check-exploits', 'scan-deps', 'export-cve'
      ],
      'API Testing': [
        'test-endpoint', 'test-collection', 'export-report'
      ],
      'Code Refactoring': [
        'refactor-file', 'refactor-project', 'analyze-refactor', 'compare-refactor'
      ],
      'Web Scraping': [
        'scrape', 'scrape-links', 'scrape-images', 'export-scrape', 'analyze-headers'
      ],
      'Vulnerability Assessment': [
        'vuln-assess', 'export-vuln'
      ],
      'HTML to React': [
        'html-to-react', 'batch-convert', 'analyze-html'
      ],
      'jQuery to React': [
        'jquery-to-react', 'jq-batch-convert', 'analyze-jquery'
      ],
      'System': [
        'help', 'status', 'history', 'banner', 'version', 'tips', 'clear', 'exit'
      ]
    };

    Object.entries(categories).forEach(([category, commands]) => {
      console.log(colorizer.section(category.toUpperCase()));
      commands.forEach(cmd => {
        const config = this.mappings[cmd];
        const desc = config ? config.description : 'Show ' + cmd.replace('-', ' ');

        console.log(colorizer.bullet(cmd.padEnd(25) + ' - ' + colorizer.dim(desc)));
      });
      console.log();
    });

    console.log(colorizer.info('Quick Start Tips:'));
    console.log(colorizer.dim('  • Run "ai-setup anthropic YOUR_API_KEY" to configure Claude'));
    console.log(colorizer.dim('  • Run "ai-help" for detailed AI command documentation'));
    console.log(colorizer.dim('  • Run "ai-chat" to start interactive AI conversation'));
    console.log(colorizer.dim('  • Run "tips" for keyboard shortcuts and advanced features'));
    console.log();

    return Promise.resolve();
  },

  showTips() {
    console.log(colorizer.section('💡 Tips & Tricks'));
    console.log();

    console.log(colorizer.cyan('Keyboard Shortcuts:'));
    console.log(colorizer.dim('  • Press TAB for command autocomplete'));
    console.log(colorizer.dim('  • Use arrow keys to navigate command history'));
    console.log(colorizer.dim('  • Ctrl+C to cancel current operation'));
    console.log(colorizer.dim('  • Ctrl+D to exit'));
    console.log();

    console.log(colorizer.cyan('AI Features:'));
    console.log(colorizer.dim('  • Multiple providers: Anthropic Claude, OpenAI GPT, Google Gemini'));
    console.log(colorizer.dim('  • Claude Sonnet 4.5 is the default model for Anthropic'));
    console.log(colorizer.dim('  • Chat maintains conversation context (20 messages)'));
    console.log(colorizer.dim('  • Use /stream in chat for real-time streaming (Gemini only)'));
    console.log(colorizer.dim('  • Use /save in chat to export conversations'));
    console.log();

    console.log(colorizer.cyan('Best Practices:'));
    console.log(colorizer.dim('  • Set environment variables for API keys (see ai-help)'));
    console.log(colorizer.dim('  • Use ai-batch for analyzing multiple files at once'));
    console.log(colorizer.dim('  • Export reports with export-* commands for documentation'));
    console.log(colorizer.dim('  • Run ai-status to check AI configuration'));
    console.log();

    console.log(colorizer.cyan('Environment Variables:'));
    console.log(colorizer.dim('  • NO_COLOR=1 - Disable colored output'));
    console.log(colorizer.dim('  • DEBUG=1 - Enable verbose error output'));
    console.log(colorizer.dim('  • ANTHROPIC_API_KEY - Auto-configure Anthropic Claude'));
    console.log(colorizer.dim('  • OPENAI_API_KEY - Auto-configure OpenAI GPT'));
    console.log(colorizer.dim('  • GOOGLE_API_KEY - Auto-configure Google Gemini'));
    console.log(colorizer.dim('  • AI_PROVIDER - Set default AI provider'));
    console.log();

    console.log(colorizer.cyan('Example Workflows:'));
    console.log(colorizer.dim('  1. Security Audit:'));
    console.log(colorizer.dim('     security-audit -> ai-improve -> ai-analyze <file>'));
    console.log();
    console.log(colorizer.dim('  2. Code Review:'));
    console.log(colorizer.dim('     ai-analyze old.js -> refactor-file old.js -> ai-compare old.js new.js'));
    console.log();
    console.log(colorizer.dim('  3. Vulnerability Research:'));
    console.log(colorizer.dim('     search-cve CVE-2024-1234 -> ai-explain <vulnerability> -> ai-threat <threat>'));
    console.log();
    console.log(colorizer.dim('  4. Interactive Learning:'));
    console.log(colorizer.dim('     ai-chat -> ask questions -> /history -> /save report.txt'));
    console.log();

    return Promise.resolve();
  },

  exit() {
    console.log(colorizer.cyan('\nShutting down...'));

    // Cleanup
    if (this.modules.trafficMonitor && this.modules.trafficMonitor.stopMonitoring) {
      this.modules.trafficMonitor.stopMonitoring();
    }

    console.log(colorizer.bright(colorizer.cyan('Goodbye!\n')));
    process.exit(0);
  }
};


module.exports = SecurityAgent;