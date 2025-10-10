# Ì†ΩÌª°Ô∏è Security AI Agent

A powerful AI-powered personal development and network security agent built with Node.js. Features real-time traffic monitoring, code vulnerability scanning, and intelligent security analysis using Claude AI.

## ‚ú® Features

### Ì†ΩÌ¥ç Security Scanning
- **Port Scanning** - Detect open ports on local or remote hosts
- **Dependency Analysis** - Review npm packages for vulnerabilities
- **Security Audits** - Check project security best practices
- **Network Information** - Display network interface details

### Ì†ΩÌ≥ù Code Analysis
- **Vulnerability Detection** - Scan code for 10+ common security issues
- **Project-wide Analysis** - Recursively scan entire directories
- **CWE Classification** - Issues mapped to Common Weakness Enumeration
- **Severity Levels** - Critical, High, Medium, Low categorization

### Ì†ΩÌ≥° Traffic Monitoring
- **Real-time Monitoring** - Live network packet analysis
- **Protocol Detection** - HTTP, HTTPS, DNS, SSH, FTP identification
- **Suspicious Activity** - Automatic threat detection
- **Traffic Statistics** - Detailed analytics and reporting
- **Data Export** - JSON export for further analysis

### Ì†æÌ¥ñ AI-Powered Features
- **Deep Code Analysis** - AI reviews code for security issues
- **Threat Assessment** - Detailed vulnerability explanations
- **Security Consultation** - Ask AI about any security concept
- **Intelligent Recommendations** - Context-aware security advice

## Ì†ΩÌ≥¶ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/security-ai-agent.git
cd security-ai-agent

# Install dependencies
npm install

# Set up your Anthropic API key (optional, for AI features)
export ANTHROPIC_API_KEY=your-api-key-here

# Run the agent
npm start
```

## Ì†ΩÌ∫Ä Quick Start

```bash
# Start the agent
node agent.js

# Configure AI (if not set in environment)
Ì†æÌ¥ñ agent> setup-api sk-ant-your-key-here

# Scan ports
Ì†æÌ¥ñ agent> scan-ports 127.0.0.1 1 1000

# Analyze code
Ì†æÌ¥ñ agent> analyze-code server.js

# Start traffic monitoring (may require sudo)
Ì†æÌ¥ñ agent> monitor-traffic

# Get AI security assessment
Ì†æÌ¥ñ agent> ai-threat SQL injection in login endpoint
```

## Ì†ΩÌ≥ö Command Reference

### Network Scanning
```bash
scan-ports [host] [start] [end]  # Default: localhost 1-1024
network-info                      # Show network interfaces
check-deps [directory]            # Analyze package.json
security-audit [directory]        # Run security audit
```

### Code Analysis
```bash
analyze-code <file>              # Scan single file
analyze-project [directory]      # Scan entire project
```

### Traffic Monitoring
```bash
monitor-traffic [interface]      # Start monitoring (eth0, en0, etc.)
stop-monitor                     # Stop monitoring
traffic-stats                    # Show statistics
export-traffic <filename>        # Export data to JSON
```

### AI Features
```bash
setup-api <key>                  # Configure Anthropic API
ai-analyze <file>                # Deep AI code analysis
ai-threat <description>          # Threat assessment
ai-explain <vulnerability>       # Explain security concepts
```

## Ì†ºÌøóÔ∏è Project Structure

```
security-ai-agent/
‚îú‚îÄ‚îÄ agent.js                     # Main application
‚îú‚îÄ‚îÄ modules/
‚îÇ   ‚îú‚îÄ‚îÄ scanner.js              # Network & security scanner
‚îÇ   ‚îú‚îÄ‚îÄ code-analyzer.js        # Code vulnerability detection
‚îÇ   ‚îú‚îÄ‚îÄ traffic-monitor.js      # Network traffic monitoring
‚îÇ   ‚îî‚îÄ‚îÄ ai-analyzer.js          # AI-powered analysis
‚îú‚îÄ‚îÄ package.json
‚îî‚îÄ‚îÄ README.md
```

## Ì†ΩÌ¥í Security Detections

The agent can detect:
- ‚úÖ Hardcoded credentials (passwords, API keys, secrets)
- ‚úÖ Code injection vulnerabilities (eval, exec)
- ‚úÖ XSS vulnerabilities (innerHTML, document.write)
- ‚úÖ Command injection risks
- ‚úÖ Weak cryptography
- ‚úÖ Insecure randomness
- ‚úÖ Unvalidated user input
- ‚úÖ Port scanning activity
- ‚úÖ Suspicious network connections
- ‚úÖ Unencrypted protocols (FTP, Telnet)

## Ì†ΩÌª†Ô∏è Requirements

- **Node.js** 18.0.0 or higher
- **tcpdump** (optional, for traffic monitoring on Linux/Mac)
- **Anthropic API Key** (optional, for AI features)

### Platform-specific Notes

**Linux:**
```bash
# Install tcpdump for traffic monitoring
sudo apt-get install tcpdump

# Run with sudo for network monitoring
sudo node agent.js
```

**macOS:**
```bash
# tcpdump is pre-installed
# Run with sudo for network monitoring
sudo node agent.js
```

**Windows:**
```bash
# Traffic monitoring uses netstat (no admin required)
# For advanced monitoring, install Wireshark/WinPcap
node agent.js
```

## Ì†ºÌæØ Usage Examples

### Example 1: Basic Security Audit
```bash
Ì†æÌ¥ñ agent> security-audit
Ì†æÌ¥ñ agent> check-deps
Ì†æÌ¥ñ agent> analyze-project ./src
```

### Example 2: Network Reconnaissance
```bash
Ì†æÌ¥ñ agent> network-info
Ì†æÌ¥ñ agent> scan-ports 192.168.1.1 1 1000
```

### Example 3: Code Security Review
```bash
Ì†æÌ¥ñ agent> analyze-code app.js
Ì†æÌ¥ñ agent> ai-analyze app.js
Ì†æÌ¥ñ agent> ai-explain CWE-79
```

### Example 4: Traffic Analysis
```bash
Ì†æÌ¥ñ agent> monitor-traffic eth0
# ... monitoring runs ...
Ì†æÌ¥ñ agent> traffic-stats
Ì†æÌ¥ñ agent> export-traffic security-report.json
Ì†æÌ¥ñ agent> stop-monitor
```

### Example 5: Threat Intelligence
```bash
Ì†æÌ¥ñ agent> ai-threat Cross-site scripting in React app
Ì†æÌ¥ñ agent> ai-explain SQL injection prevention
```

## Ì†ΩÌ¥ß Configuration

### Environment Variables
```bash
# Anthropic API key for AI features
export ANTHROPIC_API_KEY=sk-ant-your-key-here

# Enable debug mode
export DEBUG=1

# Verbose output
export VERBOSE=1
```

### Network Interface Selection
Common interface names:
- **Linux**: `eth0`, `wlan0`, `enp0s3`
- **macOS**: `en0`, `en1`
- **Windows**: `Ethernet`, `Wi-Fi`

Use `network-info` to list all available interfaces.

## Ì†ΩÌ≥ä Sample Output

### Port Scan Results
```
Ì†ΩÌ¥ç Port Scan Report
‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê
Target: 127.0.0.1
Range: 1-1024
Started: 10/10/2025, 3:45:00 PM

‚úÖ Port 22 OPEN - SSH
‚úÖ Port 80 OPEN - HTTP
‚úÖ Port 443 OPEN - HTTPS
‚úÖ Port 3306 OPEN - MySQL

Ì†ΩÌ≥ä Scan Summary
‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê
Total ports scanned: 1024
Open ports: 4
Duration: 15.2s
```

### Code Analysis Results
```
Ì†ΩÌ¥é Code Security Analysis
‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê
File: server.js
Size: 15234 bytes
Lines: 458
Issues Found: 3

Ì†ΩÌ¥¥ CRITICAL Issues:
  Line 45: Hardcoded Credentials (CWE-798)
  ‚îî‚îÄ Hardcoded API key detected
     Code: const apiKey = "sk-1234567890abcdef"

Ì†ΩÌø† HIGH Issues:
  Line 128: Command Injection (CWE-78)
  ‚îî‚îÄ Shell command execution can be dangerous
     Code: exec(`ls ${userInput}`)

Ì†ΩÌ≥ä Summary:
  Critical: 1
  High: 1
  Medium: 1
  Low: 0
  Info: 0
```

### Traffic Statistics
```
Ì†ΩÌ≥ä Traffic Statistics
‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê
Duration: 5m 32s
Status: Ì†ΩÌø¢ Active

Packets:
  Total: 15,847
  TCP: 12,456 (78.6%)
  UDP: 2,891 (18.2%)
  ICMP: 500 (3.2%)

Protocols:
  HTTP: 234
  HTTPS: 8,945
  DNS: 1,234
  SSH: 12
  FTP: 0

Top Connections:
  192.168.1.1: 5,234 packets
  8.8.8.8: 1,234 packets
  1.1.1.1: 876 packets
```

## Ì†æÌ¥ñ AI Analysis Examples

### Deep Code Review
```bash
Ì†æÌ¥ñ agent> ai-analyze vulnerable.js

Ì†æÌ¥ñ AI Security Analysis
‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê
File: vulnerable.js
Analyzing with Claude...

CRITICAL VULNERABILITIES:

1. SQL Injection (Line 23-25)
   The code directly concatenates user input into SQL queries:
   `const query = "SELECT * FROM users WHERE id = " + userId;`
   
   Fix: Use parameterized queries:
   `const query = "SELECT * FROM users WHERE id = ?";`
   `db.query(query, [userId]);`

2. Hardcoded Credentials (Line 8)
   API key is hardcoded in source code.
   
   Fix: Use environment variables:
   `const apiKey = process.env.API_KEY;`

[... additional findings ...]
```

## Ì†ΩÌ∞õ Troubleshooting

### Traffic Monitoring Issues

**Permission Denied:**
```bash
# Linux/macOS - Run with sudo
sudo node agent.js
```

**tcpdump not found:**
```bash
# Linux
sudo apt-get install tcpdump

# macOS (should be pre-installed)
which tcpdump
```

**No packets captured:**
- Check interface name with `network-info`
- Verify interface is active and has traffic
- Try `monitor-traffic any` to capture all interfaces

### AI Features Not Working

```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Or configure in agent
Ì†æÌ¥ñ agent> setup-api sk-ant-your-key-here
```

### Module Not Found Errors

```bash
# Reinstall dependencies
npm install

# Check Node version
node --version  # Should be >= 18.0.0
```

## Ì†ΩÌ¥ê Security Considerations

### Running as Root
Traffic monitoring requires elevated privileges. Be cautious:
- Only use on trusted networks
- Review code before running with sudo
- Consider using capabilities instead of full root

### API Keys
- Never commit API keys to version control
- Use environment variables or secure vaults
- Rotate keys regularly

### Network Scanning
- Only scan systems you own or have permission to scan
- Port scanning may trigger IDS/IPS alerts
- Be aware of local laws and regulations

## Ì†ΩÌª£Ô∏è Roadmap

- [ ] Web dashboard for visualization
- [ ] CVE database integration
- [ ] Automated remediation suggestions
- [ ] Integration with SIEM systems
- [ ] Docker container support
- [ ] CI/CD pipeline integration
- [ ] Multi-language code support (Python, Java, Go)
- [ ] Machine learning anomaly detection
- [ ] SSL/TLS certificate analysis
- [ ] API endpoint security testing

## Ì†æÌ¥ù Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Ì†ΩÌ≥Ñ License

MIT License - see LICENSE file for details

## ‚ö†Ô∏è Disclaimer

This tool is for educational and authorized security testing purposes only. Users are responsible for complying with applicable laws and regulations. The authors assume no liability for misuse.

## Ì†ΩÌ≥û Support

- Ì†ΩÌ∞õ Issues: [GitHub Issues](https://github.com/yourusername/security-ai-agent/issues)
- Ì†ΩÌ≥ß Email: your-email@example.com
- Ì†ΩÌ≤¨ Discord: [Community Server](#)

## Ì†ΩÌπè Acknowledgments

- Built with [Anthropic Claude](https://www.anthropic.com/)
- Inspired by security tools like nmap, Burp Suite, and OWASP ZAP
- Thanks to the open-source security community

---

**Made with ‚ù§Ô∏è for the security community**