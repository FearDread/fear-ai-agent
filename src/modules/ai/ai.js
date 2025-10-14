// modules/ai/ai.js - Main AI Module (Combines Config & Operations)
const AIConfig = require('./config');
const AIOperations = require('./operations');

const AiAnalyzer = function() {
  // Initialize configuration
  this.config = new AIConfig();
  
  // Initialize operations with config reference
  this.operations = new AIOperations(this.config);
};

AiAnalyzer.prototype = {
  // Configuration methods
  setup(args) {
    return this.config.setup(args);
  },

  setProvider(args) {
    return this.config.setProvider(args);
  },

  isConfigured() {
    return this.config.isConfigured();
  },

  getProviderName() {
    return this.config.getProviderName();
  },

  // Operation methods
  analyzeCode(args) {
    return this.operations.analyzeCode(args);
  },

  threatAssessment(args) {
    return this.operations.threatAssessment(args);
  },

  explainVulnerability(args) {
    return this.operations.explainVulnerability(args);
  },

  generateNodeCode(args) {
    return this.operations.generateNodeCode(args);
  },

  analyzeTrafficPattern(trafficData) {
    return this.operations.analyzeTrafficPattern(trafficData);
  },

  compareCodeVersions(args) {
    return this.operations.compareCodeVersions(args);
  },

  suggestImprovements(args) {
    return this.operations.suggestImprovements(args);
  },

  chat(args) {
    return this.operations.chat(args);
  }
};

module.exports = AiAnalyzer;