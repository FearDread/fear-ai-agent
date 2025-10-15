// modules/ai/config.js - Enhanced AI Configuration & Provider Management
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const colorizer = require('../utils/colorizer');

const AIConfig = function () {
  // Provider instances
  this.anthropic = null;
  this.openai = null;
  this.googleAi = null;
  
  // API keys
  this.anthropicKey = process.env.ANTHROPIC_API_KEY || '';
  this.openaiKey = process.env.OPENAI_API_KEY || '';
  this.googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '';
  
  // Current provider
  this.provider = process.env.AI_PROVIDER || 'openai';

  // Model configurations
  this.models = {
    anthropic: 'claude-sonnet-4-5-20250929',
    openai: 'gpt-4o',
    google: 'gemini-2.0-flash-exp'
  };

  // Safety settings for Google
  this.googleSafetySettings = [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    }
  ];

  // Initialize providers if keys exist
  this.initializeProviders();
};

AIConfig.prototype = {
  initializeProviders() {
    // Initialize Anthropic
    if (this.anthropicKey) {
      try {
        this.anthropic = new Anthropic({ apiKey: this.anthropicKey });
        console.log(colorizer.dim('  ✓ Anthropic initialized'));
      } catch (err) {
        console.log(colorizer.warning('  ✗ Anthropic SDK error: ' + err.message));
      }
    }

    // Initialize OpenAI
    if (this.openaiKey) {
      try {
        this.openai = new OpenAI({ apiKey: this.openaiKey });
        console.log(colorizer.dim('  ✓ OpenAI initialized'));
      } catch (err) {
        console.log(colorizer.warning('  ✗ OpenAI SDK error: ' + err.message));
      }
    }

    // Initialize Google Gemini
    if (this.googleKey) {
      try {
        this.googleAi = new GoogleGenerativeAI(this.googleKey);
        console.log(colorizer.dim('  ✓ Google Gemini initialized'));
      } catch (err) {
        console.log(colorizer.warning('  ✗ Google SDK error: ' + err.message));
      }
    }

    // Auto-select first available provider if current is not configured
    if (!this.isConfigured()) {
      if (this.openai) this.provider = 'openai';
      else if (this.googleAi) this.provider = 'google';
      else if (this.anthropic) this.provider = 'anthropic';
    }
  },

  setup(args) {
    if (args.length === 0) {
      return this.showSetupInfo();
    }

    const provider = args[0]?.toLowerCase();
    const key = args[1];

    if (!key) {
      console.log(colorizer.error('Please provide an API key\n'));
      return Promise.resolve();
    }

    switch (provider) {
      case 'anthropic':
      case 'claude':
        return this.setupAnthropic(key);

      case 'openai':
      case 'gpt':
        return this.setupOpenAI(key);

      case 'google':
      case 'gemini':
        return this.setupGoogle(key);

      default:
        console.log(colorizer.error('Unknown provider. Use "anthropic", "openai", or "google"\n'));
        return Promise.resolve();
    }
  },

  setupGoogle(key) {
    try {
      this.googleKey = key;
      this.googleAi = new GoogleGenerativeAI(key);
      this.provider = 'google';

      console.log(colorizer.success('Google Gemini configured successfully!'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.google));
      console.log();

      return Promise.resolve(true);
    } catch (err) {
      console.log(colorizer.error('Failed to configure Google: ' + err.message + '\n'));
      return Promise.resolve(false);
    }
  },

  setupAnthropic(key) {
    try {
      this.anthropicKey = key;
      this.anthropic = new Anthropic({ apiKey: key });
      this.provider = 'anthropic';

      console.log(colorizer.success('Anthropic Claude configured successfully!'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.anthropic));
      console.log();

      return Promise.resolve(true);
    } catch (err) {
      console.log(colorizer.error('Failed to configure Anthropic: ' + err.message + '\n'));
      return Promise.resolve(false);
    }
  },

  setupOpenAI(key) {
    try {
      this.openaiKey = key;
      this.openai = new OpenAI({ apiKey: key });
      this.provider = 'openai';

      console.log(colorizer.success('OpenAI configured successfully!'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.openai));
      console.log();

      return Promise.resolve(true);
    } catch (err) {
      console.log(colorizer.error('Failed to configure OpenAI: ' + err.message + '\n'));
      return Promise.resolve(false);
    }
  },

  showSetupInfo() {
    console.log(colorizer.header('AI API Configuration'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Usage: ') + colorizer.bright('ai-setup <provider> <api-key>'));
    console.log();

    console.log(colorizer.section('Available Providers'));
    console.log(colorizer.bullet('anthropic (claude) - Anthropic Claude'));
    console.log(colorizer.dim('    Model: ' + this.models.anthropic));
    console.log(colorizer.bullet('openai (gpt)       - OpenAI GPT'));
    console.log(colorizer.dim('    Model: ' + this.models.openai));
    console.log(colorizer.bullet('google (gemini)    - Google Gemini'));
    console.log(colorizer.dim('    Model: ' + this.models.google));
    console.log();

    console.log(colorizer.section('Examples'));
    console.log(colorizer.dim('  ai-setup anthropic sk-ant-your-key-here'));
    console.log(colorizer.dim('  ai-setup openai sk-your-openai-key-here'));
    console.log(colorizer.dim('  ai-setup google your-gemini-key-here'));
    console.log();

    console.log(colorizer.section('Environment Variables'));
    console.log(colorizer.dim('  export ANTHROPIC_API_KEY=your-key'));
    console.log(colorizer.dim('  export OPENAI_API_KEY=your-key'));
    console.log(colorizer.dim('  export GOOGLE_API_KEY=your-key'));
    console.log(colorizer.dim('  export AI_PROVIDER=anthropic|openai|google'));
    console.log();

    console.log(colorizer.section('Current Status'));
    console.log(colorizer.cyan('  Provider: ') + colorizer.bright(this.getProviderName()));
    console.log(colorizer.cyan('  Status: ') +
      (this.isConfigured() ? colorizer.green('✓ Configured') : colorizer.red('✗ Not configured')));
    
    if (!this.isConfigured() && (this.anthropic || this.openai || this.googleAi)) {
      console.log();
      console.log(colorizer.info('Other providers available:'));
      if (this.anthropic && this.provider !== 'anthropic') {
        console.log(colorizer.dim('  Run "ai-provider anthropic" to switch'));
      }
      if (this.openai && this.provider !== 'openai') {
        console.log(colorizer.dim('  Run "ai-provider openai" to switch'));
      }
      if (this.googleAi && this.provider !== 'google') {
        console.log(colorizer.dim('  Run "ai-provider google" to switch'));
      }
    }
    console.log();

    return Promise.resolve();
  },

  setProvider(args) {
    const provider = args[0]?.toLowerCase();

    if (!provider) {
      return this.showProviderInfo();
    }

    // Normalize provider names
    const normalizedProvider = provider === 'claude' ? 'anthropic' :
                              provider === 'gpt' ? 'openai' :
                              provider === 'gemini' ? 'google' :
                              provider;

    if (normalizedProvider === 'anthropic' && this.anthropic) {
      this.provider = 'anthropic';
      console.log(colorizer.success('✓ Switched to Anthropic Claude'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.anthropic));
      console.log();
    } else if (normalizedProvider === 'openai' && this.openai) {
      this.provider = 'openai';
      console.log(colorizer.success('✓ Switched to OpenAI GPT'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.openai));
      console.log();
    } else if (normalizedProvider === 'google' && this.googleAi) {
      this.provider = 'google';
      console.log(colorizer.success('✓ Switched to Google Gemini'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.google));
      console.log();
    } else {
      console.log(colorizer.error(provider + ' is not configured. Use ai-setup first.\n'));
    }

    return Promise.resolve();
  },

  showProviderInfo() {
    console.log(colorizer.header('AI Provider Management'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Usage: ') + colorizer.bright('ai-provider <anthropic|openai|google>'));
    console.log();

    console.log(colorizer.section('Current Provider'));
    console.log(colorizer.cyan('  Active: ') + colorizer.bright(this.getProviderName()));
    console.log(colorizer.cyan('  Model: ') + colorizer.dim(this.getModel()));
    console.log();

    console.log(colorizer.section('Available Providers'));
    console.log(colorizer.cyan('  Anthropic Claude: ') +
      (this.anthropic ? colorizer.green('✓ Available') : colorizer.red('✗ Not configured')));
    if (this.anthropic) {
      console.log(colorizer.dim('    Model: ' + this.models.anthropic));
    }
    
    console.log(colorizer.cyan('  OpenAI GPT:       ') +
      (this.openai ? colorizer.green('✓ Available') : colorizer.red('✗ Not configured')));
    if (this.openai) {
      console.log(colorizer.dim('    Model: ' + this.models.openai));
    }
    
    console.log(colorizer.cyan('  Google Gemini:    ') +
      (this.googleAi ? colorizer.green('✓ Available') : colorizer.red('✗ Not configured')));
    if (this.googleAi) {
      console.log(colorizer.dim('    Model: ' + this.models.google));
    }
    console.log();

    return Promise.resolve();
  },

  isConfigured() {
    if (this.provider === 'openai') return !!this.openai;
    if (this.provider === 'google') return !!this.googleAi;
    if (this.provider === 'anthropic') return !!this.anthropic;
    return false;
  },

  getProviderName() {
    if (this.provider === 'openai') return 'OpenAI GPT';
    if (this.provider === 'google') return 'Google Gemini';
    if (this.provider === 'anthropic') return 'Anthropic Claude';
    return 'Unknown';
  },

  getProvider() {
    return this.provider;
  },

  getClient() {
    if (this.provider === 'openai') return this.openai;
    if (this.provider === 'google') return this.googleAi;
    if (this.provider === 'anthropic') return this.anthropic;
    return null;
  },

  getModel() {
    return this.models[this.provider];
  },

  // Google Gemini API call
  async callGoogle(prompt, maxTokens = 4096) {
    if (!this.googleAi) {
      throw new Error('Google Gemini not configured');
    }

    try {
      const model = this.googleAi.getGenerativeModel({
        model: this.models.google,
        safetySettings: this.googleSafetySettings,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
          topP: 0.95,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      // Handle safety filter blocking
      if (err.message.includes('SAFETY')) {
        throw new Error('Content blocked by safety filters. Try rephrasing your query.');
      }
      throw err;
    }
  },

  // Google Gemini streaming call
  async callGoogleStream(prompt, maxTokens = 4096, onChunk) {
    if (!this.googleAi) {
      throw new Error('Google Gemini not configured');
    }

    try {
      const model = this.googleAi.getGenerativeModel({
        model: this.models.google,
        safetySettings: this.googleSafetySettings,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
          topP: 0.95,
        }
      });

      const result = await model.generateContentStream(prompt);
      let fullText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        if (onChunk) {
          onChunk(chunkText);
        }
      }

      return fullText;
    } catch (err) {
      if (err.message.includes('SAFETY')) {
        throw new Error('Content blocked by safety filters. Try rephrasing your query.');
      }
      throw err;
    }
  },

  // Anthropic API call
  callAnthropic(prompt, maxTokens = 4096) {
    if (!this.anthropic) {
      return Promise.reject(new Error('Anthropic not configured'));
    }

    return this.anthropic.messages.create({
      model: this.models.anthropic,
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: prompt
      }]
    }).then(message => message.content[0].text);
  },

  // OpenAI API call
  callOpenAI(prompt, maxTokens = 4096) {
    if (!this.openai) {
      return Promise.reject(new Error('OpenAI not configured'));
    }

    return this.openai.chat.completions.create({
      model: this.models.openai,
      max_tokens: maxTokens,
      messages: [{
        role: 'system',
        content: 'You are an expert cybersecurity analyst and software development consultant.'
      }, {
        role: 'user',
        content: prompt
      }]
    }).then(completion => completion.choices[0].message.content);
  },

  // Universal call method
  call(prompt, maxTokens = 4096) {
    if (!this.isConfigured()) {
      return Promise.reject(new Error('AI not configured. Use ai-setup first.'));
    }

    if (this.provider === 'openai') {
      return this.callOpenAI(prompt, maxTokens);
    } else if (this.provider === 'google') {
      return this.callGoogle(prompt, maxTokens);
    } else if (this.provider === 'anthropic') {
      return this.callAnthropic(prompt, maxTokens);
    }

    return Promise.reject(new Error('Invalid provider configuration'));
  },

  // Streaming call method
  async callStream(prompt, maxTokens = 4096, onChunk) {
    if (!this.isConfigured()) {
      throw new Error('AI not configured. Use ai-setup first.');
    }

    if (this.provider === 'google') {
      return this.callGoogleStream(prompt, maxTokens, onChunk);
    } else {
      // For non-streaming providers, simulate streaming
      const response = await this.call(prompt, maxTokens);
      if (onChunk) {
        onChunk(response);
      }
      return response;
    }
  }
};

module.exports = AIConfig;