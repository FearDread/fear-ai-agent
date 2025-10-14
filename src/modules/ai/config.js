// modules/ai/config.js - AI Configuration & Provider Management
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const colorizer = require('../utils/colorizer');
const GoogleGenAI = require('@google/genai');


const AIConfig = function () {
  // Provider instances
  this.anthropic = null;
  this.openai = null;
  this.googleAi = null;
  // API keys
  this.anthropicKey = process.env.ANTHROPIC_API_KEY || '';
  this.openaiKey = process.env.OPENAI_API_KEY || '';
  this.googleKey = process.env.GOOGLE_API_KEY,
    // Current provider
    this.provider = process.env.AI_PROVIDER || 'openai';

  // Model configurations
  this.models = {
    openai: 'gpt-5',
    anthropic: 'claude-sonnet-4-5-20250929',

    google: 'gemini-2.5-flash-preview-09-2025'
  };

  // Initialize providers if keys exist
  this.initializeProviders();
};

AIConfig.prototype = {
  initializeProviders() {
    // Initialize Anthropic
    if (this.anthropicKey) {
      try {
        this.anthropic = new Anthropic({ apiKey: this.anthropicKey });
        console.log(colorizer.dim('  Anthropic initialized'));
      } catch (err) {
        console.log(colorizer.warning('  Anthropic SDK error: ' + err.message));
      }
    }

    // Initialize OpenAI
    if (this.openaiKey) {

      try {
        this.openai = new OpenAI({ apiKey: this.openaiKey });
        console.log(colorizer.dim('  OpenAI initialized'));
      } catch (err) {
        console.log(colorizer.warning('  OpenAI SDK error: ' + err.message));
      }
    }

    if (this.googleKey) {
      this.googleAi = new GoogleGenAI({ apiKey: this.googleKey })
      console.log(colorizer.dim('  OpenAI initialized'));
    }
  },

  setup(args) {
    if (args.length === 0) {

      if (this.openaiKey) return this.setupOpenAI(this.openaiKey);
      if (this.googleKey) return this.setupGoogle(this.googleKey);

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
        return this.setupAnthropic(key);

      case 'openai':
        return this.setupOpenAI(key);

      case 'google':
        return this.setupGoogle(key);

      default:
        console.log(colorizer.error('Unknown provider. Use "anthropic", "openai", or "google"\n'));
        return Promise.resolve();
    }
  },

  setupGoogle(key) {

    if (this.googleKey) {
      key = this.googleKey;
      this.googleAi = new GoogleGenAI({ apiKey: key })
      this.provider = 'Google';
      console.log(colorizer.success('Google AI configured successfully!'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.google));
      return Promise.resolve(true);
    } else {
      console.log(colorizer.error("Unable to setup Google AI"));
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
    console.log(colorizer.bullet('anthropic - Anthropic Claude'));
    console.log(colorizer.dim('    Model: ' + this.models.anthropic));
    console.log(colorizer.bullet('openai    - OpenAI GPT'));
    console.log(colorizer.dim('    Model: ' + this.models.openai));
    console.log(colorizer.bullet('google    - Google Gemeni AI'));
    console.log(colorizer.dim('    Model: ' + this.models.google));
    console.log();

    console.log(colorizer.section('Examples'));
    console.log(colorizer.dim('  ai-setup anthropic sk-ant-your-key-here'));
    console.log(colorizer.dim('  ai-setup openai sk-your-openai-key-here'));
    console.log();

    console.log(colorizer.section('Environment Variables'));
    console.log(colorizer.dim('  export ANTHROPIC_API_KEY=your-key'));
    console.log(colorizer.dim('  export OPENAI_API_KEY=your-key'));
    console.log(colorizer.dim('  export AI_PROVIDER=anthropic|openai'));
    console.log();

    console.log(colorizer.section('Current Status'));
    console.log(colorizer.cyan('  Provider: ') + colorizer.bright(this.getProviderName()));
    console.log(colorizer.cyan('  Status: ') +
      (this.isConfigured() ? colorizer.green('Configured') : colorizer.red('Not configured')));
    console.log();

    return Promise.resolve();
  },

  setProvider(args) {
    const provider = args[0]?.toLowerCase();

    if (!provider) {
      return this.showProviderInfo();
    }

    if (provider === 'anthropic' && this.anthropic) {
      this.provider = 'anthropic';
      console.log(colorizer.success('Switched to Anthropic Claude'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.anthropic));
      console.log();
    } else if (provider === 'openai' && this.openai) {
      this.provider = 'openai';
      console.log(colorizer.success('Switched to OpenAI GPT'));
      console.log(colorizer.cyan('Model: ') + colorizer.bright(this.models.openai));
      console.log();
    } else {
      console.log(colorizer.error(provider + ' is not configured. Use ai-setup first.\n'));
    }

    return Promise.resolve();
  },

  showProviderInfo() {
    console.log(colorizer.header('AI Provider Management'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Usage: ') + colorizer.bright('ai-provider <anthropic|openai>'));
    console.log();

    console.log(colorizer.section('Current Provider'));
    console.log(colorizer.cyan('  Active: ') + colorizer.bright(this.getProviderName()));
    console.log();

    console.log(colorizer.section('Available Providers'));
    console.log(colorizer.cyan('  Anthropic: ') +
      (this.anthropic ? colorizer.green('[Available]') : colorizer.red('[Not configured]')));
    console.log(colorizer.cyan('  OpenAI: ') +
      (this.openai ? colorizer.green('[Available]') : colorizer.red('[Not configured]')));
    console.log();

    return Promise.resolve();
  },

  isConfigured() {
    return this.provider === 'openai' ? !!this.openai : !!this.anthropic;
  },

  getProviderName() {
    return this.provider === 'openai' ? 'OpenAI GPT' : 'Anthropic Claude';
  },

  getProvider() {
    return this.provider;
  },

  getClient() {
    return this.provider === 'openai' ? this.openai : this.anthropic;
  },

  getModel() {
    return this.models[this.provider];
  },

  callGoogle(prompt, tokens = 4096) {
    const config = {
      maxOutputTokens: tokens,
      temperature: 1,
      topP: 0.95,
      seed: 0,
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'OFF',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'OFF',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'OFF',
        },
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'OFF',
        }
      ],
    }

    return this.googleAi.models.generateContentStream({
      model: this.models.google,
      contents: prompt,
      config: config,
    }).then((resp) => resp[0].text);
  },

  // Call methods for AI operations
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

  callOpenAI(prompt, maxTokens = 4096) {
    if (!this.openai) {
      return Promise.reject(new Error('OpenAI not configured'));
    }

    return this.openai.chat.completions.create({
      model: this.models.openai,
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

  call(prompt, maxTokens = 4096) {
    if (!this.isConfigured()) {
      return Promise.reject(new Error('AI not configured'));
    }

    return this.provider === 'openai'
      ? this.callOpenAI(prompt, maxTokens)
      : this.callAnthropic(prompt, maxTokens);
  }
};

module.exports = AIConfig;