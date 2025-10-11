// modules/ai-analyzer.js - AI-Powered Security Analysis (OpenAI + Anthropic)
const fs = require('fs').promises;
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

const Analyzer = function() {
  // Anthropic setup
  this.anthropicKey = process.env.ANTHROPIC_API_KEY || '';
  this.anthropic = null;
  if (this.anthropicKey) {
    try {
      const Anthropic = require('@anthropic-ai/sdk');
      this.anthropic = new Anthropic({ apiKey: this.anthropicKey });
    } catch (err) {
      // Anthropic SDK not installed
    }
  }

  // OpenAI setup
  this.openaiKey = process.env.OPENAI_API_KEY || '';
  this.openai = null;
  if (this.openaiKey) {
    try {
      const OpenAI = require('openai');
      this.openai = new OpenAI({ apiKey: this.openaiKey });
    } catch (err) {
      // OpenAI SDK not installed
    }
  }

  this.provider = process.env.AI_PROVIDER || 'anthropic';
  this.anthropicModel = 'claude-sonnet-4-5-20250929';
  this.openaiModel = 'gpt-4-turbo-preview';

 // return this;
}

Analyzer.prototype = {

  setup(args) {

    const provider = args[0].toLowerCase();
    const key = args[1];

    if (args.length === 0) {
      console.log('AI API Configuration');
      console.log('═══════════════════════════════════════');
      console.log('Usage: setup-api <provider> <api-key>');
      console.log('\nProviders:');
      console.log('anthropic - Anthropic Claude');
      console.log('openai    - OpenAI GPT\n');
      console.log('Examples:');
      console.log('setup-api anthropic sk-ant-your-key-here');
      console.log('setup-api openai sk-your-openai-key-here\n');
      console.log('Or set environment variables:');
      console.log('export ANTHROPIC_API_KEY=your-key');
      console.log('export OPENAI_API_KEY=your-key');
      console.log('export AI_PROVIDER=anthropic|openai\n');
      console.log('Current provider:', this.getProvider());
      console.log('Status:', this.configure() ? 'Configured' : 'Not configured\n');

      return Promise.resolve();
    }


    if (!key) {
      console.log('Please provide an API key\n');
      return Promise.resolve();
    }

    if (provider === 'anthropic') {
      this.anthropicKey = key;
      this.anthropic = new Anthropic({ apiKey: key });
      this.provider = 'anthropic';
      console.log('Anthropic Claude configured successfully!\n');

    } else if (provider === 'openai') {

      this.openaiKey = key;
      this.openai = new OpenAI({ apiKey: key });
      this.provider = 'openai';
      console.log('OpenAI configured successfully!\n');

    } else {
      console.log('Unknown provider. Use "anthropic" or "openai"\n');
    }

    return Promise.resolve();
  },

  configure() {
    return this.provider === 'openai' ? !!this.openai : !!this.anthropic;
  },

  getProvider() {
    return this.provider === 'openai' ? 'OpenAI' : 'Anthropic Claude';;
  },

  setProvider(args) {
    const provider = args[0]?.toLowerCase();

    if (!provider) {
      console.log('\n📝 Switch AI Provider');
      console.log('═══════════════════════════════════════');
      console.log('Usage: switch-provider <anthropic|openai>\n');
      console.log('Current provider:', this.getProviderName());
      console.log('Anthropic:', this.anthropic ? '✅ Available' : '❌ Not configured');
      console.log('OpenAI:', this.openai ? '✅ Available' : '❌ Not configured\n');
      return Promise.resolve();
    }

    if (provider === 'anthropic' && this.anthropic) {
      this.provider = 'anthropic';
      console.log('✅ Switched to Anthropic Claude\n');
    } else if (provider === 'openai' && this.openai) {
      this.provider = 'openai';
      console.log('✅ Switched to OpenAI GPT\n');
    } else {
      console.log(`❌ ${provider} is not configured. Use setup-api first.\n`);
    }

    return Promise.resolve();
  },

  analyzeCode(args) {
    if (!this.configure()) {
      console.log('AI not configured. Use "setup-api <provider> <key>" first.\n');
      return Promise.resolve();
    }

    const filePath = args[0];
    if (!filePath) {
      console.log('Usage: ai-analyze <file-path>\n');
      return Promise.resolve();
    }

    return fs.readFile(filePath, 'utf8')
      .then(code => {
        console.log('\nAI Security Analysis');
        console.log('═══════════════════════════════════════');
        console.log(`File: ${filePath}`);
        console.log(`Provider: ${this.getProvider()}`);
        console.log('Analyzing...\n');

        const prompt = `You are a senior security engineer conducting a code security audit. Analyze this code for security vulnerabilities, best practices violations, and potential issues.

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

Be thorough but concise. Focus on actionable findings.`;

        if (this.provider === 'openai') {
          return this.call.openApi(prompt);
        } else {
          return this.call.anthropic(prompt);
        }
      })
      .then(response => {
        console.log(response);
        console.log('\n═══════════════════════════════════════\n');
      })
      .catch(err => {
        console.log(`AI analysis failed: ${err.message}\n`);
      });
  },

  threatAssessment(args) {
    if (!this.configure()) {
      console.log('AI not configured. Use "setup-api <provider> <key>" first.\n');
      return Promise.resolve();
    }

    const description = args.join(' ');
    if (!description) {
      console.log('❌ Usage: ai-threat <threat description>\n');
      console.log('Example: ai-threat SQL injection in user login form\n');
      return Promise.resolve();
    }

    console.log('\nAI Threat Assessment');
    console.log('═══════════════════════════════════════');
    console.log(`Query: ${description}`);
    console.log(`Provider: ${this.getProvider()}\n`);
    console.log('Analyzing...\n');

    const prompt = `You are a cybersecurity expert. Provide a comprehensive threat assessment for the following security concern:

"${description}"

Include:
1. Threat Overview - What is this vulnerability/threat?
2. Severity Level - Critical/High/Medium/Low with justification
3. Attack Vectors - How could this be exploited?
4. Potential Impact - What damage could occur?
5. Mitigation Steps - Specific actions to prevent/fix
6. Detection Methods - How to identify if you're vulnerable
7. Real-world Examples - Brief examples if relevant

Be practical and actionable.`;

    const callPromise = this.provider === 'openai'
      ? this.call.openApi(prompt)
      : this.call.anthropic(prompt);

    return callPromise
      .then(response => {
        console.log(response);
        console.log('\n═══════════════════════════════════════\n');
      })
      .catch(err => {
        console.log(`❌ Threat assessment failed: ${err.message}\n`);
      });
  },

  explainVulnerability(args) {
    if (!this.configure()) {
      console.log('❌ AI not configured. Use "setup-api <provider> <key>" first.\n');
      return Promise.resolve();
    }

    const vulnerability = args.join(' ');
    if (!vulnerability) {
      console.log('❌ Usage: ai-explain <vulnerability or CWE>\n');
      console.log('Example: ai-explain CWE-79\n');
      console.log('Example: ai-explain XSS vulnerability\n');
      return Promise.resolve();
    }

    console.log('\n🤖 AI Vulnerability Explanation');
    console.log('═══════════════════════════════════════');
    console.log(`Topic: ${vulnerability}`);
    console.log(`Provider: ${this.getProviderName()}\n`);
    console.log('Generating explanation...\n');

    const prompt = `Explain the following security vulnerability or concept in a clear, educational way:

"${vulnerability}"

Structure your explanation with:
1. Definition - What is it?
2. How it works - Technical explanation
3. Why it's dangerous - Potential consequences
4. Common scenarios - Where it appears
5. Prevention - How to avoid it
6. Code examples - Show vulnerable vs secure code if applicable

Keep it educational but accessible.`;

    const callPromise = this.provider === 'openai'
      ? this.call.openAi(prompt)
      : this.call.anthropic(prompt);

    return callPromise
      .then(response => {
        console.log(response);
        console.log('\n═══════════════════════════════════════\n');
      })
      .catch(err => {
        console.log(`❌ Explanation failed: ${err.message}\n`);
      });
  },

  analyzeTrafficPattern(trafficData) {
    if (!this.configure()) {
      return Promise.resolve(null);
    }

    const prompt = `Analyze this network traffic pattern for security concerns:

${JSON.stringify(trafficData, null, 2)}

Identify:
1. Suspicious patterns
2. Potential attacks (DDoS, port scanning, etc.)
3. Anomalies
4. Recommendations

Be concise and security-focused.`;

    const callPromise = this.provider === 'openai'
      ? this.call.openAi(prompt, 2048)
      : this.call.anthropic(prompt, 2048);

    return callPromise.catch(err => {
      console.error(`AI traffic analysis failed: ${err.message}`);
      return null;
    });
  },

  compareCodeVersions(file1Path, file2Path) {
    if (!this.configure()) {
      console.log('❌ AI not configured. Use "setup-api <provider> <key>" first.\n');
      return Promise.resolve();
    }

    return Promise.all([
      fs.readFile(file1Path, 'utf8'),
      fs.readFile(file2Path, 'utf8')
    ])
      .then(([code1, code2]) => {
        console.log('\n🤖 AI Code Security Comparison');
        console.log('═══════════════════════════════════════');
        console.log(`Provider: ${this.getProviderName()}`);
        console.log('Analyzing security implications of changes...\n');

        const prompt = `Compare these two code versions from a security perspective:

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

Focus only on security-relevant changes.`;

        return this.provider === 'openai'
          ? this.call.openAi(prompt, 3072)
          : this.call.anthropic(prompt, 3072);
      })
      .then(response => {
        console.log(response);
        console.log('\n═══════════════════════════════════════\n');
      })
      .catch(err => {
        console.log(`❌ Comparison failed: ${err.message}\n`);
      });
  },

  suggestImprovements(projectPath) {
    if (!this.configure()) {
      console.log('❌ AI not configured. Use "setup-api <provider> <key>" first.\n');
      return Promise.resolve();
    }

    const pkgPath = `${projectPath}/package.json`;

    return fs.readFile(pkgPath, 'utf8')
      .catch(() => '')
      .then(pkg => {
        const projectInfo = pkg ? `Package.json:\n${pkg}\n\n` : '';

        console.log('\n🤖 AI Security Recommendations');
        console.log('═══════════════════════════════════════');
        console.log(`Provider: ${this.getProviderName()}`);
        console.log('Generating security improvement plan...\n');

        const prompt = `As a security consultant, provide a comprehensive security improvement plan for this project:

${projectInfo}

Provide:
1. Quick wins - Easy security improvements
2. Critical priorities - Must-fix issues
3. Best practices - Security measures to implement
4. Tools to integrate - Security scanning, monitoring, etc.
5. Development workflow improvements
6. Long-term security strategy

Be practical and prioritized.`;

        return this.provider === 'openai'
          ? this.call.openAi(prompt, 3072)
          : this.call.anthropic(prompt, 3072);
      })
      .then(response => {
        console.log(response);
        console.log('\n═══════════════════════════════════════\n');
      })
      .catch(err => {
        console.log(`❌ Recommendations failed: ${err.message}\n`);
      });
  },

  call: {
    openApi(prompt, maxTokens = 4096) {
      return this.openai.chat.completions.create({
        model: this.openaiModel,
        max_tokens: maxTokens,
        messages: [{
          role: 'system',
          content: 'You are an expert cybersecurity analyst and consultant.'
        }, {
          role: 'user',
          content: prompt
        }]
      }).then(completion => completion.choices[0].message.content);
    },

    anthropic(prompt, maxTokens = 4096) {
      return this.anthropic.messages.create({
        model: this.anthropicModel,
        max_tokens: maxTokens,
        messages: [{
          role: 'user',
          content: prompt
        }]
      }).then(message => message.content[0].text);
    }

  },

}

module.exports = Analyzer;