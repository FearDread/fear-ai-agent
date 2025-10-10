# �� Quick Start Guide

Get up and running with Security AI Agent in 5 minutes.

## ⚡ Installation

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

## �� Common Tasks

### Task 1: Scan Your Network

```bash
�� agent> network-info
# Shows your network interfaces

�� agent> scan-ports 192.168.1.1 1 1000
# Scans ports 1-1000 on your router
```

### Task 2: Check Code Security

```bash
�� agent> analyze-code app.js
# Scans a single file

�� agent> analyze-project ./src
# Scans entire project directory
```

### Task 3: Monitor Network Traffic

```bash
# May require sudo/admin privileges
�� agent> monitor-traffic eth0
# Monitors live traffic

# In another terminal or after stopping:
�� agent> traffic-stats
# View statistics

�� agent> stop-monitor
# Stop monitoring
```

### Task 4: Test API Endpoints

```bash
�� agent> test-endpoint https://api.example.com/users GET
# Tests single endpoint

�� agent> test-collection sample-api-collection.json
# Tests multiple endpoints

�� agent> export-report api-findings.json
# Export results
```

### Task 5: AI Security Analysis

```bash
# First, configure API key
�� agent> setup-api sk-ant-your-key-here

# Deep code analysis
�� agent> ai-analyze server.js

# Threat assessment
�� agent> ai-threat SQL injection in login form

# Explain vulnerability
�� agent> ai-explain CWE-79
```

## �� File Structure Setup

Create this structure:

```
security-ai-agent/
├── agent.js                         # Main file
├── modules/
│   ├── scanner.js                  # Network scanner
│   ├── code-analyzer.js            # Code analysis
│   ├── traffic-monitor.js          # Traffic monitoring
│   ├── ai-analyzer.js              # AI features
│   └── api-tester.js               # API testing
├── sample-api-collection.json      # Example API tests
├── package.json                    # Dependencies
├── .gitignore                      # Git ignore
├── setup.sh                        # Setup script
├── README.md                       # Full documentation
├── API-TESTING-GUIDE.md           # API testing guide
└── QUICKSTART.md                   # This file
```

## �� Essential Commands

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