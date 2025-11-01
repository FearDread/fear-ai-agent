# Security AI Agent - Documentation

## Overview

Security AI Agent is a comprehensive command-line security testing and analysis framework built on Node.js. Version 2.3.0 provides an integrated suite of tools for security scanning, code analysis, vulnerability assessment, and AI-powered security intelligence.

## Features

### Core Capabilities

- **File System Browser**: Navigate and inspect files directly from the command line
- **AI-Powered Analysis**: Integrate with multiple AI providers (Anthropic Claude, OpenAI GPT, Google Gemini)
- **Security Scanning**: Network port scanning, dependency checking, and security audits
- **Code Analysis**: Automated code review and project analysis
- **Traffic Monitoring**: Real-time network traffic monitoring and statistics
- **CVE Database**: Search and analyze Common Vulnerabilities and Exposures
- **API Testing**: Test and validate API endpoints and collections
- **Code Refactoring**: Automated code refactoring with AI assistance
- **Web Scraping**: Extract and analyze web content and security headers
- **Vulnerability Assessment**: Comprehensive vulnerability scanning and reporting
- **Card Validation**: Credit card number format validation and BIN analysis
- **Cryptocurrency Tools**: Real-time crypto price checking and rate comparisons
- **Code Conversion**: Convert HTML and jQuery to React components

### AI Integration

The agent supports three AI providers with seamless switching:

- **Anthropic Claude** (Default: Claude Sonnet 4.5)
- **OpenAI GPT**
- **Google Gemini** (with streaming support)

## Installation

```bash
npm install
```

### Required Dependencies

- readline (built-in)
- fs (built-in)
- path (built-in)
- Custom modules in ./modules directory

## Configuration

### Environment Variables

Set API keys via environment variables for automatic configuration:

```bash
export ANTHROPIC_API_KEY="your-anthropic-key"
export OPENAI_API_KEY="your-openai-key"
export GOOGLE_API_KEY="your-google-key"
export AI_PROVIDER="anthropic"  # Set default provider
export NO_COLOR=1               # Disable colored output
export DEBUG=1                  # Enable verbose debugging
```

### Manual Configuration

Configure AI providers at runtime:

```bash
ai-setup anthropic YOUR_API_KEY
ai-setup openai YOUR_API_KEY
ai-setup google YOUR_API_KEY
```

## Command Reference

### System Commands

- `help` - Display all available commands
- `status` - Show system and module status
- `history` - View command history (last 20 commands)
- `version` - Display version information
- `tips` - Show tips, shortcuts, and example workflows
- `banner` - Display the application banner
- `clear` - Clear the screen
- `exit` - Exit the application

### File Browser Commands

- `ls` - List files and directories
- `cd <directory>` - Change directory
- `pwd` - Show current directory path
- `cat <file>` - Display file contents
- `less <file>` - View file with pagination
- `find <pattern>` - Search for files matching pattern
- `file-info <file>` - Show detailed file information
- `tree` - Display directory tree structure
- `bookmark` - Manage directory bookmarks
- `browse-help` - Show file browser help

### AI Configuration Commands

- `ai-setup <provider> <api-key>` - Configure AI provider
- `ai-provider <provider>` - Switch between AI providers
- `ai-status` - Show AI module configuration status
- `ai-help` - Display detailed AI command documentation

### AI Code Analysis Commands

- `ai-analyze <file>` - Perform AI security analysis on code file
- `ai-batch <files...>` - Batch analyze multiple files
- `ai-compare <file1> <file2>` - Compare two code versions
- `ai-scan <target>` - Quick security scan

### AI Security Intelligence Commands

- `ai-threat <target>` - Comprehensive threat assessment
- `ai-explain <vulnerability>` - Explain vulnerability or CWE details

### AI Code Generation Commands

- `ai-generate <description>` - Generate secure Node.js code

### AI Project Improvement Commands

- `ai-improve <project>` - Get security recommendations for project

### AI Chat & Assistance Commands

- `ai-chat` - Start interactive AI chat session
- `ai-ask <question>` - Quick AI question
- `ai-clear-history` - Clear chat conversation history

### Network Scanning Commands

- `scan-ports <host>` - Scan network ports on target host
- `network-info` - Display network information
- `check-deps` - Check project dependencies
- `security-audit` - Run comprehensive security audit

### Code Analysis Commands

- `analyze-code <file>` - Analyze code file for issues
- `analyze-project <directory>` - Analyze entire project

### Traffic Monitoring Commands

- `monitor-traffic` - Start network traffic monitoring
- `stop-monitor` - Stop traffic monitoring
- `traffic-stats` - Show traffic statistics
- `export-traffic <file>` - Export traffic data to file

### CVE & Security Commands

- `search-cve <cve-id>` - Search CVE database
- `check-cwe <cwe-id>` - Check CWE (Common Weakness Enumeration) details
- `check-package <package>` - Check package for known vulnerabilities
- `check-exploits <query>` - Search for known exploits
- `scan-deps` - Scan project dependencies for CVEs
- `export-cve <file>` - Export CVE report

### API Testing Commands

- `test-endpoint <url>` - Test API endpoint
- `test-collection <file>` - Test API collection from file
- `export-report <file>` - Export test results report

### Code Refactoring Commands

- `refactor-file <file>` - Refactor JavaScript file
- `refactor-project <directory>` - Refactor entire project
- `analyze-refactor <file>` - Analyze code for refactoring opportunities
- `compare-refactor <file1> <file2>` - Compare refactored versions

### Web Scraping Commands

- `scrape <url>` - Scrape webpage content
- `scrape-links <url>` - Extract all links from webpage
- `scrape-images <url>` - Extract all images from webpage
- `export-scrape <file>` - Export scraped data to file
- `analyze-headers <url>` - Analyze security headers

### Vulnerability Assessment Commands

- `vuln-assess <target>` - Run vulnerability assessment
- `export-vuln <file>` - Export vulnerability results

### Credit Card Commands

- `validate-card <number>` - Validate card number format
- `validate-batch <file>` - Batch validate card numbers
- `analyze-bin <bin>` - Analyze Bank Identification Number
- `show-test-cards` - Display official test card numbers
- `explain-algorithm` - Explain validation algorithms (Luhn, etc.)
- `card-security-report` - Generate card security report
- `check-card-status <number>` - Check single card payment status
- `check-card-batch <file>` - Check batch card payment status
- `configure-card-checker` - Configure card checker settings
- `card-checker-help` - Show card checker help

### Cryptocurrency Commands

- `compare-rates <crypto>` - Compare rates across exchanges
- `crypto-price <symbol>` - Get cryptocurrency current price
- `track-portfolio <symbols>` - Track multiple cryptocurrencies
- `crypto-convert <amount> <from> <to>` - Convert between cryptocurrencies
- `market-summary` - Show cryptocurrency market summary
- `export-rates <file>` - Export rates to file
- `crypto-help` - Show cryptocurrency commands help

### HTML/jQuery Conversion Commands

- `html-to-react <file>` - Convert HTML file to React component
- `batch-convert <directory>` - Batch convert HTML files
- `analyze-html <file>` - Analyze HTML structure
- `jquery-to-react <file>` - Convert jQuery code to React
- `jq-batch-convert <directory>` - Batch convert jQuery files
- `analyze-jquery <file>` - Analyze jQuery code structure

## Usage Examples

### Basic File Navigation

```bash
FEAR >> ls
FEAR >> cd src
FEAR >> pwd
FEAR >> cat config.js
FEAR >> find *.js
```

### AI-Powered Security Analysis

```bash
FEAR >> ai-setup anthropic sk-ant-xxxxx
FEAR >> ai-analyze vulnerable.js
FEAR >> ai-threat myapp
FEAR >> ai-improve .
```

### Security Audit Workflow

```bash
FEAR >> security-audit
FEAR >> scan-deps
FEAR >> search-cve CVE-2024-1234
FEAR >> ai-explain CVE-2024-1234
```

### Code Refactoring Workflow

```bash
FEAR >> analyze-code old.js
FEAR >> refactor-file old.js
FEAR >> ai-compare old.js old.refactored.js
```

### Interactive AI Chat

```bash
FEAR >> ai-chat
AI Chat > Explain SQL injection vulnerabilities
AI Chat > /history
AI Chat > /save security-notes.txt
AI Chat > /exit
```

### Vulnerability Research

```bash
FEAR >> search-cve authentication
FEAR >> check-package express
FEAR >> ai-threat authentication-bypass
FEAR >> export-cve vulnerability-report.json
```

## Command Line Features

### Keyboard Shortcuts

- **TAB** - Command autocomplete
- **Up/Down Arrows** - Navigate command history
- **Ctrl+C** - Cancel current operation
- **Ctrl+D** - Exit application

### Command History

- Maintains last 100 commands
- View with `history` command
- Navigate with arrow keys

### Auto-completion

Press TAB to autocomplete commands. If multiple matches exist, all options will be displayed.

## Module Architecture

The agent uses a modular architecture with the following structure:

```
modules/
├── utils/
│   ├── browser.js      # File system browser
│   └── colorizer.js    # Terminal output formatting
├── security/
│   ├── scanner.js      # Network scanning
│   ├── web.js          # Web scraping
│   ├── vulnerability.js # Vulnerability assessment
│   ├── monitor.js      # Traffic monitoring
│   └── cve.js          # CVE database
├── ai/
│   └── ai.js           # AI integration
├── code/
│   ├── analyzer.js     # Code analysis
│   ├── refactor.js     # Code refactoring
│   ├── react.js        # HTML to React
│   └── jquery.js       # jQuery to React
├── analyze/
│   └── api.js          # API testing
├── ccard/
│   ├── validator.js    # Card validation
│   └── checker.js      # Card status checking
└── crypto/
    └── exchange.js     # Cryptocurrency tools
```

## Best Practices

### Security

- Store API keys in environment variables, never in code
- Use `ai-status` to verify configuration before running analyses
- Export reports regularly for audit trails
- Run `security-audit` before deploying applications

### Performance

- Use batch commands for multiple file operations
- Clear AI chat history periodically with `ai-clear-history`
- Export large datasets to files rather than viewing in terminal

### Workflow Optimization

- Bookmark frequently accessed directories
- Use command history for repeated operations
- Configure default AI provider via environment variable
- Create shell aliases for common command sequences

## Troubleshooting

### Module Not Loading

If a module shows `[UNAVAILABLE]` status:

1. Check that all dependencies are installed
2. Verify module file exists in correct path
3. Enable DEBUG mode: `DEBUG=1 node agent.js`

### AI Configuration Issues

```bash
FEAR >> ai-status  # Check current configuration
FEAR >> ai-setup anthropic YOUR_KEY  # Reconfigure
FEAR >> ai-help  # View detailed AI documentation
```

### Command Not Found

```bash
FEAR >> help  # View all available commands
FEAR >> browse-help  # View file browser commands
FEAR >> ai-help  # View AI commands
```

## Version Information

**Current Version**: 2.3.0

**Node.js Requirements**: Compatible with Node.js 12.x and higher

**Platform Support**: Cross-platform (Windows, macOS, Linux)

## License

This is a security testing framework intended for authorized security assessments and educational purposes only. Always obtain proper authorization before testing systems you do not own.

## Support

For issues, questions, or feature requests, consult the following resources:

- Run `help` for command reference
- Run `tips` for usage examples and workflows
- Run `ai-help` for AI-specific documentation
- Enable DEBUG mode for verbose error output