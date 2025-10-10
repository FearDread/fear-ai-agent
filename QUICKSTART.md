# í ½íº€ Quick Start Guide

Get up and running with Security AI Agent in 5 minutes.

## âš¡ Installation

```bash
# 1. Clone or download the project
git clone https://github.com/yourusername/security-ai-agent.git
cd security-ai-agent

# 2. Create module directory
mkdir modules

# 3. Copy all module files to modules/
# - scanner.js
# - code-analyzer.js
# - traffic-monitor.js
# - ai-analyzer.js
# - api-tester.js

# 4. Install dependencies
npm install

# 5. (Optional) Configure AI features
export ANTHROPIC_API_KEY=sk-ant-your-key-here

# 6. Run the agent
node agent.js
```

## í ¼í¾¯ Common Tasks

### Task 1: Scan Your Network

```bash
í ¾í´– agent> network-info
# Shows your network interfaces

í ¾í´– agent> scan-ports 192.168.1.1 1 1000
# Scans ports 1-1000 on your router
```

### Task 2: Check Code Security

```bash
í ¾í´– agent> analyze-code app.js
# Scans a single file

í ¾í´– agent> analyze-project ./src
# Scans entire project directory
```

### Task 3: Monitor Network Traffic

```bash
# May require sudo/admin privileges
í ¾í´– agent> monitor-traffic eth0
# Monitors live traffic

# In another terminal or after stopping:
í ¾í´– agent> traffic-stats
# View statistics

í ¾í´– agent> stop-monitor
# Stop monitoring
```

### Task 4: Test API Endpoints

```bash
í ¾í´– agent> test-endpoint https://api.example.com/users GET
# Tests single endpoint

í ¾í´– agent> test-collection sample-api-collection.json
# Tests multiple endpoints

í ¾í´– agent> export-report api-findings.json
# Export results
```

### Task 5: AI Security Analysis

```bash
# First, configure API key
í ¾í´– agent> setup-api sk-ant-your-key-here

# Deep code analysis
í ¾í´– agent> ai-analyze server.js

# Threat assessment
í ¾í´– agent> ai-threat SQL injection in login form

# Explain vulnerability
í ¾í´– agent> ai-explain CWE-79
```

## í ½í³‹ File Structure Setup

Create this structure:

```
security-ai-agent/
â”œâ”€â”€ agent.js                         # Main file
â”œâ”€â”€ modules/
â”‚   â”œâ”€â”€ scanner.js                  # Network scanner
â”‚   â”œâ”€â”€ code-analyzer.js            # Code analysis
â”‚   â”œâ”€â”€ traffic-monitor.js          # Traffic monitoring
â”‚   â”œâ”€â”€ ai-analyzer.js              # AI features
â”‚   â””â”€â”€ api-tester.js               # API testing
â”œâ”€â”€ sample-api-collection.json      # Example API tests
â”œâ”€â”€ package.json                    # Dependencies
â”œâ”€â”€ .gitignore                      # Git ignore
â”œâ”€â”€ setup.sh                        # Setup script
â”œâ”€â”€ README.md                       # Full documentation
â”œâ”€â”€ API-TESTING-GUIDE.md           # API testing guide
â””â”€â”€ QUICKSTART.md                   # This file
```

## í ½í´‘ Essential Commands

### General
- `help` - Show all commands
- `exit` - Exit agent

### Security Scanning
- `scan-ports <host> [start] [end]` - Scan ports
- `security-audit` - Run security audit
- `check-deps` - Check npm dependencies

### Code Analysis
- `analyze-code <file>` - Scan file
- `analyze-project <dir>` - Scan directory

### API Testing
- `test-endpoint <url> [method]` - Test API
- `test-collection <file>` - Test multiple APIs

### Network Monitoring
-