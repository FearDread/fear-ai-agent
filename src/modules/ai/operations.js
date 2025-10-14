// modules/ai/operations.js - AI Operations & Security Analysis
const fs = require('fs').promises;
const colorizer = require('../utils/colorizer');

const AIOperations = function (config) {
    this.config = config;

    this.systemPrompt = `
        You are an advanced personal assistant AI specializing in security analysis, hacking techniques, and Node.js development. 

        Your responsibilities:
        1. Provide comprehensive security guidance and code analysis
        2. Identify vulnerabilities and recommend fixes
        3. Explain security concepts clearly
        4. Share best practices for secure development
        5. Emphasize ethical considerations and responsible disclosure

        Always be thorough, actionable, and security-focused in your responses.`;
};

AIOperations.prototype = {
    analyzeCode(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const filePath = args[0];
        if (!filePath) {
            console.log(colorizer.error('Usage: ai-analyze <file-path>\n'));
            return Promise.resolve();
        }

        return fs.readFile(filePath, 'utf8')
            .then(code => {
                console.log(colorizer.header('AI Security Analysis'));
                console.log(colorizer.separator());
                console.log(colorizer.cyan('File: ') + colorizer.bright(filePath));
                console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
                console.log(colorizer.cyan('Analyzing...\n'));

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

                return this.config.call(prompt);
            })
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('AI analysis failed: ' + err.message + '\n'));
            });
    },

    threatAssessment(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const description = args.join(' ');
        if (!description) {
            console.log(colorizer.error('Usage: ai-threat <threat description>'));
            console.log(colorizer.info('Example: ai-threat SQL injection in user login form\n'));
            return Promise.resolve();
        }

        console.log(colorizer.header('AI Threat Assessment'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Query: ') + colorizer.bright(description));
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Analyzing...\n'));

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

        return this.config.call(prompt)
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Threat assessment failed: ' + err.message + '\n'));
            });
    },

    explainVulnerability(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const vulnerability = args.join(' ');
        if (!vulnerability) {
            console.log(colorizer.error('Usage: ai-explain <vulnerability or CWE>'));
            console.log(colorizer.info('Example: ai-explain CWE-79'));
            console.log(colorizer.info('Example: ai-explain XSS vulnerability\n'));
            return Promise.resolve();
        }

        console.log(colorizer.header('AI Vulnerability Explanation'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Topic: ') + colorizer.bright(vulnerability));
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Generating explanation...\n'));

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

        return this.config.call(prompt)
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Explanation failed: ' + err.message + '\n'));
            });
    },

    generateNodeCode(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const taskDescription = args.join(' ');
        if (!taskDescription) {
            console.log(colorizer.error('Usage: ai-generate <task description>'));
            console.log(colorizer.info('Example: ai-generate Express API with JWT authentication\n'));
            return Promise.resolve();
        }

        console.log(colorizer.header('AI Code Generation'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Task: ') + colorizer.bright(taskDescription));
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Generating code...\n'));

        const prompt = `You are an expert Node.js developer. Write production-ready Node.js code for the following task:

Task: ${taskDescription}

Requirements:
1. Include necessary imports and dependencies
2. Add error handling
3. Follow Node.js best practices
4. Include comments explaining key sections
5. Make code secure and efficient

Provide complete, working code that can be used immediately.`;

        return this.config.call(prompt, 6000)
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Code generation failed: ' + err.message + '\n'));
            });
    },

    analyzeTrafficPattern(trafficData) {
        if (!this.config.isConfigured()) {
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

        return this.config.call(prompt, 2048)
            .catch(err => {
                console.error(colorizer.error('AI traffic analysis failed: ' + err.message));
                return null;
            });
    },

    compareCodeVersions(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const file1Path = args[0];
        const file2Path = args[1];

        if (!file1Path || !file2Path) {
            console.log(colorizer.error('Usage: ai-compare <original-file> <modified-file>\n'));
            return Promise.resolve();
        }

        return Promise.all([
            fs.readFile(file1Path, 'utf8'),
            fs.readFile(file2Path, 'utf8')
        ])
            .then(([code1, code2]) => {
                console.log(colorizer.header('AI Code Security Comparison'));
                console.log(colorizer.separator());
                console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
                console.log(colorizer.cyan('Analyzing security implications...\n'));

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

                return this.config.call(prompt, 3072);
            })
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Comparison failed: ' + err.message + '\n'));
            });
    },

    suggestImprovements(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const projectPath = args[0] || '.';
        const pkgPath = `${projectPath}/package.json`;

        return fs.readFile(pkgPath, 'utf8')
            .catch(() => '')
            .then(pkg => {
                const projectInfo = pkg ? `Package.json:\n${pkg}\n\n` : 'No package.json found.\n';

                console.log(colorizer.header('AI Security Recommendations'));
                console.log(colorizer.separator());
                console.log(colorizer.cyan('Project: ') + colorizer.bright(projectPath));
                console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
                console.log(colorizer.cyan('Generating improvement plan...\n'));

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

                return this.config.call(prompt, 3072);
            })
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Recommendations failed: ' + err.message + '\n'));
            });
    },

    chat(args) {
        if (!this.config.isConfigured()) {
            console.log(colorizer.error('AI not configured. Use "ai-setup <provider> <key>" first.\n'));
            return Promise.resolve();
        }

        const query = args.join(' ');
        if (!query) {
            console.log(colorizer.error('Usage: ai-chat <your question>'));
            console.log(colorizer.info('Example: ai-chat How do I secure my Express API?\n'));
            return Promise.resolve();
        }

        console.log(colorizer.header('AI Assistant'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Query: ') + colorizer.bright(query));
        console.log(colorizer.cyan('Provider: ') + colorizer.bright(this.config.getProviderName()));
        console.log(colorizer.cyan('Thinking...\n'));

        const prompt = `${this.systemPrompt}

User Question: ${query}

Provide a comprehensive, helpful response that addresses the user's question with practical, actionable information.`;

        return this.config.call(prompt, 4096)
            .then(response => {
                console.log(response);
                console.log('\n' + colorizer.separator() + '\n');
            })
            .catch(err => {
                console.log(colorizer.error('Chat failed: ' + err.message + '\n'));
            });
    }
};

module.exports = AIOperations;