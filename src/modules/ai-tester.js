// modules/ai-analyzer.js - AI-Powered Security Analysis
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;

class AIAnalyzer {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    this.anthropic = this.apiKey ? new Anthropic({ apiKey: this.apiKey }) : null;
    this.model = 'claude-sonnet-4-5-20250929';
  }

  isConfigured() {
    return !!this.anthropic;
  }

  async setupAPI(args) {
    if (args[0]) {
      this.apiKey = args[0];
      this.anthropic = new Anthropic({ apiKey: this.apiKey });
      console.log('✅ Anthropic API configured successfully!');
      console.log('������ AI-powered features are now enabled.\n');
    } else {
      console.log('\n������ API Configuration');
      console.log('═══════════════════════════════════════');
      console.log('Usage: setup-api <your-anthropic-api-key>\n');
      console.log('Or set environment variable:');
      console.log('  export ANTHROPIC_API_KEY=your-key\n');
      console.log('Get your API key at: https://console.anthropic.com\n');
    }
  }

  async analyzeCode(args) {
    if (!this.anthropic) {
      console.log('❌ AI not configured. Use "setup-api <key>" first.\n');
      return;
    }

    const filePath = args[0];
    if (!filePath) {
      console.log('❌ Usage: ai-analyze <file-path>\n');
      return;
    }

    try {
      const code = await fs.readFile(filePath, 'utf8');
      
      console.log('\n������ AI Security Analysis');
      console.log('═══════════════════════════════════════');
      console.log(`File: ${filePath}`);
      console.log('Analyzing with Claude...\n');

      const message = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are a senior security engineer conducting a code security audit. Analyze this code for security vulnerabilities, best practices violations, and potential issues.

File: ${filePath}

\`\`\`
${code}
\`\`\`

Provide:
1. Security vulnerabilities (CRITICAL, HIGH, MEDIUM, LOW)
2. Specific line numbers or code sections with issues
3. Explanation of each vulnerability
4. Recommended fixes
5. General security recommendations

Be thorough but concise. Focus on actionable findings.`
        }]
      });

      const response = message.content[0].text;
      console.log(response);
      console.log('\n═══════════════════════════════════════\n');

    } catch (err) {
      console.log(`❌ AI analysis failed: ${err.message}\n`);
    }
  }

  async threatAssessment(args) {
    if (!this.anthropic) {
      console.log('❌ AI not configured. Use "setup-api <key>" first.\n');
      return;
    }

    const description = args.join(' ');
    if (!description) {
      console.log('❌ Usage: ai-threat <threat description>\n');
      console.log('Example: ai-threat SQL injection in user login form\n');
      return;
    }

    try {
      console.log('\n������ AI Threat Assessment');
      console.log('═══════════════════════════════════════');
      console.log(`Query: ${description}\n`);
      console.log('Analyzing...\n');

      const message = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 3072,
        messages: [{
          role: 'user',
          content: `You are a cybersecurity expert. Provide a comprehensive threat assessment for the following security concern:

"${description}"

Include:
1. Threat Overview - What is this vulnerability/threat?
2. Severity Level - Critical/High/Medium/Low with justification
3. Attack Vectors - How could this be exploited?
4. Potential Impact - What damage could occur?
5. Mitigation Steps - Specific actions to prevent/fix
6. Detection Methods - How to identify if you're vulnerable
7. Real-world Examples - Brief examples if relevant

Be practical and actionable.`
        }]
      });

      const response = message.content[0].text;
      console.log(response);
      console.log('\n═══════════════════════════════════════\n');

    } catch (err) {
      console.log(`❌ Threat assessment failed: ${err.message}\n`);
    }
  }

  async explainVulnerability(args) {
    if (!this.anthropic) {
      console.log('❌ AI not configured. Use "setup-api <key>" first.\n');
      return;
    }

    const vulnerability = args.join(' ');
    if (!vulnerability) {
      console.log('❌ Usage: ai-explain <vulnerability or CWE>\n');
      console.log('Example: ai-explain CWE-79\n');
      console.log('Example: ai-explain XSS vulnerability\n');
      return;
    }

    try {
      console.log('\n������ AI Vulnerability Explanation');
      console.log('═══════════════════════════════════════');
      console.log(`Topic: ${vulnerability}\n`);
      console.log('Generating explanation...\n');

      const message = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Explain the following security vulnerability or concept in a clear, educational way:

"${vulnerability}"

Structure your explanation with:
1. Definition - What is it?
2. How it works - Technical explanation
3. Why it's dangerous - Potential consequences
4. Common scenarios - Where it appears
5. Prevention - How to avoid it
6. Code examples - Show vulnerable vs secure code if applicable

Keep it educational but accessible.`
        }]
      });

      const response = message.content[0].text;
      console.log(response);
      console.log('\n═══════════════════════════════════════\n');

    } catch (err) {
      console.log(`❌ Explanation failed: ${err.message}\n`);
    }
  }

  async analyzeTrafficPattern(trafficData) {
    if (!this.anthropic) {
      return null;
    }

    try {
      const message = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Analyze this network traffic pattern for security concerns:

${JSON.stringify(trafficData, null, 2)}

Identify:
1. Suspicious patterns
2. Potential attacks (DDoS, port scanning, etc.)
3. Anomalies
4. Recommendations

Be concise and security-focused.`
        }]
      });

      return message.content[0].text;
    } catch (err) {
      console.error(`AI traffic analysis failed: ${err.message}`);
      return null;
    }
  }

  async compareCodeVersions(file1Path, file2Path) {
    if (!this.anthropic) {
      console.log('❌ AI not configured. Use "setup-api <key>" first.\n');
      return;
    }

    try {
      const code1 = await fs.readFile(file1Path, 'utf8');
      const code2 = await fs.readFile(file2Path, 'utf8');

      console.log('\n������ AI Code Security Comparison');
      console.log('═══════════════════════════════════════');
      console.log('Analyzing security implications of changes...\n');

      const message = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 3072,
        messages: [{
          role: 'user',
          content: `Compare these two code versions from a security perspective:

Original (${file1Path}):
\`\`\`
${code1}
\`\`\`

Modified (${file2Path}):
\`\`\`
${code2}
\`\`\`

Analyze:
1. New vulnerabilities introduced
2. Security improvements made
3. Security regressions
4. Overall security impact assessment

Focus only on security-relevant changes.`
        }]
      });

      const response = message.content[0].text;
      console.log(response);
      console.log('\n═══════════════════════════════════════\n');

    } catch (err) {
      console.log(`❌ Comparison failed: ${err.message}\n`);
    }
  }

  async suggestSecurityImprovements(projectPath) {
    if (!this.anthropic) {
      console.log('❌ AI not configured. Use "setup-api <key>" first.\n');
      return;
    }

    try {
      // Read package.json if exists
      let projectInfo = '';
      try {
        const pkg = await fs.readFile(`${projectPath}/package.json`, 'utf8');
        projectInfo = `Package.json:\n${pkg}\n\n`;
      } catch {
        // No package.json
      }

      console.log('\n������ AI Security Recommendations');
      console.log('═══════════════════════════════════════');
      console.log('Generating security improvement plan...\n');

      const message = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 3072,
        messages: [{
          role: 'user',
          content: `As a security consultant, provide a comprehensive security improvement plan for this project:

${projectInfo}

Provide:
1. Quick wins - Easy security improvements
2. Critical priorities - Must-fix issues
3. Best practices - Security measures to implement
4. Tools to integrate - Security scanning, monitoring, etc.
5. Development workflow improvements
6. Long-term security strategy

Be practical and prioritized.`
        }]
      });

      const response = message.content[0].text;
      console.log(response);
      console.log('\n═══════════════════════════════════════\n');

    } catch (err) {
      console.log(`❌ Recommendations failed: ${err.message}\n`);
    }
  }
}

module.exports = AIAnalyzer;