// modules/html-to-react.js - Enhanced HTML to React Component Converter
const fs = require('fs').promises;
const path = require('path');
const colorizer = require('../utils/colorizer');

const HTMLToReact = function() {
  this.componentCounter = 0;
  this.extractedComponents = [];
  this.externalStylesheets = [];
  this.externalScripts = [];
  this.jsModules = new Map();
  this.globalVariables = new Set();
  this.dependencies = new Set();
}

HTMLToReact.prototype = {
    
  convert(args) {
    const filePath = args[0];
    const outputDir = args[1] || './react-components';
    
    if (!filePath) {
      console.log(colorizer.error('Usage: html-to-react <html-file> [output-dir]'));
      console.log(colorizer.info('Examples:'));
      console.log(colorizer.dim('  html-to-react index.html'));
      console.log(colorizer.dim('  html-to-react page.html ./src/components\n'));
      return Promise.resolve();
    }

    console.log(colorizer.header('HTML to React Converter'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Input: ') + colorizer.bright(filePath));
    console.log(colorizer.cyan('Output: ') + colorizer.bright(outputDir));
    console.log();

    const inputDir = path.dirname(filePath);

    return fs.readFile(filePath, 'utf8')
      .then(html => {
        console.log(colorizer.info('Parsing HTML...'));
        
        const converted = this.convertHTML(html, path.basename(filePath, '.html'), inputDir);
        
        return this.saveComponents(converted, outputDir, inputDir);
      })
      .then(files => {
        console.log(colorizer.success('\nConversion complete!'));
        console.log(colorizer.cyan('Generated files:'));
        files.forEach(file => {
          console.log(colorizer.bullet(file));
        });
        console.log();
        
        // Show conversion summary
        this.printConversionSummary();
      })
      .catch(err => {
        console.log(colorizer.error('Conversion failed: ' + err.message));
        if (err.stack) {
          console.log(colorizer.dim(err.stack));
        }
        console.log();
      });
  },

  convertHTML(html, baseName, inputDir) {
    // Reset state for new conversion
    this.extractedComponents = [];
    this.externalStylesheets = [];
    this.externalScripts = [];
    this.jsModules.clear();
    this.globalVariables.clear();
    this.dependencies.clear();
    
    // Extract external resources first
    this.extractExternalResources(html, inputDir);
    
    // Clean up HTML
    html = this.cleanHTML(html);
    
    // Extract and convert components
    const mainComponent = this.createMainComponent(html, baseName);
    
    // Convert inline styles
    mainComponent.jsx = this.convertInlineStyles(mainComponent.jsx);
    
    // Convert attributes
    mainComponent.jsx = this.convertAttributes(mainComponent.jsx);
    
    // Convert event handlers and JavaScript
    mainComponent.jsx = this.convertEventHandlers(mainComponent.jsx);
    
    // Fix common JSX issues
    mainComponent.jsx = this.fixJSXIssues(mainComponent.jsx);
    
    // Extract reusable components
    this.extractComponents(mainComponent);
    
    // Add external resources to imports
    if (this.externalStylesheets.length > 0) {
      mainComponent.externalStyles = this.externalStylesheets;
    }
    
    if (this.externalScripts.length > 0) {
      mainComponent.externalScripts = this.externalScripts;
    }
    
    // Add detected dependencies
    mainComponent.dependencies = Array.from(this.dependencies);
    
    return {
      main: mainComponent,
      components: this.extractedComponents,
      jsModules: Array.from(this.jsModules.values())
    };
  },

  extractExternalResources(html, inputDir) {
    // Extract external stylesheets
    const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
        this.externalStylesheets.push({
          original: href,
          local: path.join(inputDir, href)
        });
        console.log(colorizer.info('  Found stylesheet: ' + href));
      } else {
        console.log(colorizer.warning('  Skipping external stylesheet: ' + href));
      }
    }
    
    // Extract external scripts
    const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/script>/gi;
    
    while ((match = scriptRegex.exec(html)) !== null) {
      const src = match[1];
      const scriptTag = match[0];
      const isModule = /type=["']module["']/i.test(scriptTag);
      const isDefer = /defer/i.test(scriptTag);
      const isAsync = /async/i.test(scriptTag);
      
      if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
        this.externalScripts.push({
          original: src,
          local: path.join(inputDir, src),
          isModule,
          isDefer,
          isAsync
        });
        console.log(colorizer.info('  Found script: ' + src + (isModule ? ' (module)' : '')));
      } else {
        // Detect common libraries
        this.detectLibrary(src);
        console.log(colorizer.warning('  Skipping CDN script: ' + src));
      }
    }
  },

  detectLibrary(src) {
    const libraries = {
      'jquery': 'jquery',
      'lodash': 'lodash',
      'axios': 'axios',
      'moment': 'moment',
      'chart': 'chart.js',
      'three': 'three',
      'd3': 'd3',
      'gsap': 'gsap'
    };
    
    for (const [key, pkg] of Object.entries(libraries)) {
      if (src.toLowerCase().includes(key)) {
        this.dependencies.add(pkg);
        console.log(colorizer.info('  Detected library: ' + pkg));
        break;
      }
    }
  },

  cleanHTML(html) {
    // Remove DOCTYPE and html/head/body tags for component extraction
    html = html.replace(/<!DOCTYPE[^>]*>/gi, '');
    html = html.replace(/<html[^>]*>/gi, '');
    html = html.replace(/<\/html>/gi, '');
    html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    html = html.replace(/<body[^>]*>/gi, '');
    html = html.replace(/<\/body>/gi, '');
    
    // Remove comments but preserve conditional comments
    html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
    
    // Remove external link tags (we'll import them)
    html = html.replace(/<link[^>]+>/gi, '');
    
    return html.trim();
  },

  createMainComponent(html, baseName) {
    const componentName = this.toPascalCase(baseName);
    
    // Extract any embedded CSS
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    let css = '';
    
    if (styleMatches) {
      styleMatches.forEach(match => {
        const content = match.replace(/<\/?style[^>]*>/gi, '');
        css += content + '\n';
      });
      html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    }
    
    // Extract embedded scripts and convert to React
    const scriptMatches = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi);
    const hooks = [];
    const functions = [];
    const effects = [];
    
    if (scriptMatches) {
      scriptMatches.forEach(match => {
        const jsContent = match.replace(/<\/?script[^>]*>/gi, '');
        if (jsContent.trim()) {
          const converted = this.convertJavaScriptToReact(jsContent);
          
          if (converted.hooks.length > 0) {
            hooks.push(...converted.hooks);
          }
          if (converted.functions.length > 0) {
            functions.push(...converted.functions);
          }
          if (converted.effects.length > 0) {
            effects.push(...converted.effects);
          }
        }
      });
      html = html.replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, '');
    }
    
    return {
      name: componentName,
      jsx: html,
      css: css,
      imports: this.determineRequiredImports(hooks, functions, effects),
      hooks: hooks,
      functions: functions,
      effects: effects
    };
  },

  determineRequiredImports(hooks, functions, effects) {
    const imports = new Set(['React']);
    
    if (hooks.length > 0 || hooks.some(h => h.includes('useState'))) {
      imports.add('useState');
    }
    if (effects.length > 0 || hooks.some(h => h.includes('useEffect'))) {
      imports.add('useEffect');
    }
    if (hooks.some(h => h.includes('useRef')) || functions.some(f => f.body.includes('ref'))) {
      imports.add('useRef');
    }
    if (hooks.some(h => h.includes('useCallback'))) {
      imports.add('useCallback');
    }
    if (hooks.some(h => h.includes('useMemo'))) {
      imports.add('useMemo');
    }
    
    return Array.from(imports);
  },

  convertJavaScriptToReact(jsCode) {
    const hooks = [];
    const functions = [];
    const effects = [];
    
    // Analyze code structure
    const analysis = this.analyzeJavaScript(jsCode);
    
    // Convert global variables to state
    analysis.variables.forEach(variable => {
      if (!this.isConstant(variable.name)) {
        const initialValue = variable.value || 'null';
        hooks.push(`const [${variable.name}, set${this.toPascalCase(variable.name)}] = useState(${initialValue});`);
        console.log(colorizer.info('  Converting variable to state: ' + variable.name));
      } else {
        hooks.push(`const ${variable.name} = ${variable.value};`);
      }
    });
    
    // Convert DOM ready handlers to useEffect
    if (jsCode.includes('DOMContentLoaded') || jsCode.includes('window.onload') || 
        jsCode.includes('$(document).ready') || jsCode.includes('$(function')) {
      const effectCode = this.extractDOMReadyCode(jsCode);
      if (effectCode) {
        effects.push({
          code: effectCode,
          dependencies: '[]'
        });
        console.log(colorizer.info('  Converting DOM ready to useEffect'));
      }
    }
    
    // Convert event listeners to useEffect with cleanup
    const listeners = this.extractEventListeners(jsCode);
    listeners.forEach(listener => {
      effects.push({
        code: this.convertEventListenerToEffect(listener),
        dependencies: listener.dependencies || '[]'
      });
      console.log(colorizer.info('  Converting event listener: ' + listener.event));
    });
    
    // Extract and convert functions
    const functionMatches = this.extractFunctions(jsCode);
    functionMatches.forEach(func => {
      functions.push({
        name: func.name,
        params: func.params,
        body: this.convertFunctionToReact(func.body),
        isAsync: func.isAsync
      });
      console.log(colorizer.info('  Extracting function: ' + func.name));
    });
    
    // Convert class definitions
    const classes = this.extractClasses(jsCode);
    if (classes.length > 0) {
      console.log(colorizer.warning('  Found ' + classes.length + ' class(es) - consider refactoring to hooks'));
    }
    
    return { hooks, functions, effects };
  },

  analyzeJavaScript(code) {
    const variables = [];
    
    // Extract let/var/const declarations
    const varRegex = /(let|var|const)\s+(\w+)\s*=\s*([^;]+);/g;
    let match;
    
    while ((match = varRegex.exec(code)) !== null) {
      const [, type, name, value] = match;
      variables.push({ type, name, value: value.trim() });
    }
    
    return { variables };
  },

  isConstant(varName) {
    // Check if variable name suggests it's a constant
    return /^[A-Z_]+$/.test(varName) || varName.startsWith('CONFIG') || varName.startsWith('DEFAULT');
  },

  extractDOMReadyCode(jsCode) {
    let code = jsCode;
    
    // Remove DOMContentLoaded wrapper
    code = code.replace(/document\.addEventListener\s*\(\s*['"]DOMContentLoaded['"]\s*,\s*function\s*\(\)\s*\{/g, '');
    code = code.replace(/window\.onload\s*=\s*function\s*\(\)\s*\{/g, '');
    code = code.replace(/\$\(document\)\.ready\s*\(\s*function\s*\(\)\s*\{/g, '');
    code = code.replace(/\$\(function\s*\(\)\s*\{/g, '');
    
    // Remove closing braces and parentheses
    code = code.replace(/\}\s*\)\s*;?\s*$/g, '');
    code = code.replace(/\}\s*;?\s*$/g, '');
    
    return this.cleanJSCode(code);
  },

  extractEventListeners(jsCode) {
    const listeners = [];
    const listenerRegex = /(\w+)\.addEventListener\s*\(\s*['"](\w+)['"]\s*,\s*(\w+|function[^}]+\})\s*\)/g;
    let match;
    
    while ((match = listenerRegex.exec(jsCode)) !== null) {
      const [, element, event, handler] = match;
      listeners.push({
        element,
        event,
        handler,
        dependencies: this.extractDependencies(handler)
      });
    }
    
    return listeners;
  },

  extractDependencies(code) {
    // Extract variables used in the code
    const vars = new Set();
    const varRegex = /\b([a-z_$][a-z0-9_$]*)\b/gi;
    let match;
    
    while ((match = varRegex.exec(code)) !== null) {
      const varName = match[1];
      if (!['function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while'].includes(varName)) {
        vars.add(varName);
      }
    }
    
    return Array.from(vars).length > 0 ? `[${Array.from(vars).join(', ')}]` : '[]';
  },

  convertEventListenerToEffect(listener) {
    return `const handle${this.toPascalCase(listener.event)} = ${listener.handler};
    ${listener.element}.addEventListener('${listener.event}', handle${this.toPascalCase(listener.event)});
    return () => ${listener.element}.removeEventListener('${listener.event}', handle${this.toPascalCase(listener.event)});`;
  },

  extractFunctions(jsCode) {
    const functions = [];
    
    // Regular functions
    const functionRegex = /(async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\}/g;
    let match;
    
    while ((match = functionRegex.exec(jsCode)) !== null) {
      const [, asyncKeyword, name, params, body] = match;
      functions.push({
        name,
        params: params.trim(),
        body: body.trim(),
        isAsync: !!asyncKeyword
      });
    }
    
    // Arrow functions assigned to const/let/var
    const arrowRegex = /(const|let|var)\s+(\w+)\s*=\s*(async\s+)?\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\n\}/g;
    
    while ((match = arrowRegex.exec(jsCode)) !== null) {
      const [, , name, asyncKeyword, params, body] = match;
      functions.push({
        name,
        params: params.trim(),
        body: body.trim(),
        isAsync: !!asyncKeyword
      });
    }
    
    return functions;
  },

  extractClasses(jsCode) {
    const classes = [];
    const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{([\s\S]*?)\n\}/g;
    let match;
    
    while ((match = classRegex.exec(jsCode)) !== null) {
      const [, name, parentClass, body] = match;
      classes.push({ name, parentClass, body });
    }
    
    return classes;
  },

  convertFunctionToReact(functionCode) {
    let converted = functionCode;
    
    // Convert document.getElementById to ref access
    converted = converted.replace(
      /document\.getElementById\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      'document.getElementById(\'$1\') /* TODO: Use ref instead */'
    );
    
    // Convert innerHTML to dangerouslySetInnerHTML suggestion
    converted = converted.replace(
      /(\w+)\.innerHTML\s*=\s*(.+);/g,
      '/* TODO: Use state or dangerouslySetInnerHTML */ // $1.innerHTML = $2;'
    );
    
    // Convert querySelector to ref
    converted = converted.replace(
      /document\.querySelector\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      'document.querySelector(\'$1\') /* TODO: Use ref instead */'
    );
    
    // Convert jQuery selectors
    converted = converted.replace(
      /\$\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      'document.querySelector(\'$1\') /* TODO: Use ref or state */'
    );
    
    // Flag AJAX calls for conversion
    converted = converted.replace(
      /\$\.ajax\(/g,
      '/* TODO: Use fetch or axios */ $.ajax('
    );
    
    converted = converted.replace(
      /fetch\s*\(/g,
      '/* Consider using useEffect with async */ fetch('
    );
    
    return converted;
  },

  cleanJSCode(code) {
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n    ');
  },

  convertAttributes(jsx) {
    // Convert class to className
    jsx = jsx.replace(/\sclass=/gi, ' className=');
    
    // Convert for to htmlFor
    jsx = jsx.replace(/\sfor=/gi, ' htmlFor=');
    
    // Convert inline event handlers to camelCase
    const events = {
      'onclick': 'onClick',
      'onchange': 'onChange',
      'onsubmit': 'onSubmit',
      'onmouseover': 'onMouseOver',
      'onmouseout': 'onMouseOut',
      'onmousedown': 'onMouseDown',
      'onmouseup': 'onMouseUp',
      'onmousemove': 'onMouseMove',
      'onkeydown': 'onKeyDown',
      'onkeyup': 'onKeyUp',
      'onkeypress': 'onKeyPress',
      'onfocus': 'onFocus',
      'onblur': 'onBlur',
      'oninput': 'onInput',
      'onscroll': 'onScroll',
      'onload': 'onLoad',
      'onerror': 'onError',
      'ondblclick': 'onDoubleClick',
      'oncontextmenu': 'onContextMenu'
    };
    
    Object.entries(events).forEach(([html, react]) => {
      const regex = new RegExp(html + '=', 'gi');
      jsx = jsx.replace(regex, react + '=');
    });
    
    // Convert boolean attributes
    jsx = jsx.replace(/\s(checked|disabled|readonly|required|selected|autofocus|autoplay|controls|loop|muted)(?=\s|>|\/)/gi, ' $1={true}');
    
    // Convert self-closing tags
    jsx = jsx.replace(/<(img|input|br|hr|meta|link|source|track|embed|area|base|col|param)([^>]*)>/gi, '<$1$2 />');
    
    // Fix common attribute issues
    jsx = jsx.replace(/\scharset=/gi, ' charSet=');
    jsx = jsx.replace(/\smaxlength=/gi, ' maxLength=');
    jsx = jsx.replace(/\sminlength=/gi, ' minLength=');
    jsx = jsx.replace(/\sreadonly=/gi, ' readOnly=');
    jsx = jsx.replace(/\sautofocus=/gi, ' autoFocus=');
    jsx = jsx.replace(/\sautocomplete=/gi, ' autoComplete=');
    jsx = jsx.replace(/\snovalidate=/gi, ' noValidate=');
    jsx = jsx.replace(/\sframeborder=/gi, ' frameBorder=');
    jsx = jsx.replace(/\scellpadding=/gi, ' cellPadding=');
    jsx = jsx.replace(/\scellspacing=/gi, ' cellSpacing=');
    jsx = jsx.replace(/\srowspan=/gi, ' rowSpan=');
    jsx = jsx.replace(/\scolspan=/gi, ' colSpan=');
    jsx = jsx.replace(/\stabindex=/gi, ' tabIndex=');
    
    return jsx;
  },

  convertEventHandlers(jsx) {
    // Convert inline event handler strings to arrow functions
    const eventRegex = /on([A-Z]\w+)=["']([^"']+)["']/g;
    
    return jsx.replace(eventRegex, (match, eventName, handler) => {
      // Clean up the handler
      let cleanHandler = handler
        .replace(/this\./g, '')
        .replace(/;$/, '')
        .trim();
      
      // If it's a function call, wrap in arrow function
      if (cleanHandler.includes('(')) {
        return `on${eventName}={() => ${cleanHandler}}`;
      } else {
        // If it's just a function name, reference it
        return `on${eventName}={${cleanHandler}}`;
      }
    });
  },

  convertInlineStyles(jsx) {
    const styleRegex = /style=["']([^"']*)["']/gi;
    
    return jsx.replace(styleRegex, (match, styleContent) => {
      if (!styleContent.trim()) {
        return '';
      }
      
      try {
        const styleObj = this.parseInlineStyle(styleContent);
        const styleString = JSON.stringify(styleObj, null, 0)
          .replace(/"/g, "'");
        return `style={${styleString}}`;
      } catch (e) {
        console.log(colorizer.warning('  Could not parse inline style: ' + styleContent));
        return match;
      }
    });
  },

  parseInlineStyle(styleString) {
    const styles = {};
    const declarations = styleString.split(';').filter(s => s.trim());
    
    declarations.forEach(decl => {
      const colonIndex = decl.indexOf(':');
      if (colonIndex === -1) return;
      
      const property = decl.substring(0, colonIndex).trim();
      const value = decl.substring(colonIndex + 1).trim();
      
      if (property && value) {
        const camelProperty = this.toCamelCase(property);
        // Handle numeric values
        const numericValue = this.parseStyleValue(value);
        styles[camelProperty] = numericValue;
      }
    });
    
    return styles;
  },

  parseStyleValue(value) {
    // Keep strings as-is for colors, keywords, etc.
    if (value.includes('px') || value.includes('%') || value.includes('em') || 
        value.includes('rem') || value.includes('vh') || value.includes('vw')) {
      return value;
    }
    
    // Check if it's a pure number
    if (/^\d+$/.test(value)) {
      return parseInt(value);
    }
    
    return value;
  },

  fixJSXIssues(jsx) {
    // Escape curly braces in text content
    jsx = jsx.replace(/>\s*\{(?!\s*\/?\w)/g, '>{"{"}');
    jsx = jsx.replace(/(?<!\w)\}\s*</g, '{"}"}}<');
    
    // Fix common HTML entities
    jsx = jsx.replace(/&nbsp;/g, '{" "}');
    jsx = jsx.replace(/&lt;/g, '{"<"}');
    jsx = jsx.replace(/&gt;/g, '{">"}');
    jsx = jsx.replace(/&amp;/g, '{"&"}');
    
    // Remove empty className attributes
    jsx = jsx.replace(/\sclassName=[""']\s*["']/g, '');
    
    return jsx;
  },

  extractComponents(mainComponent) {
    const patterns = [
      { tag: 'nav', name: 'Navigation', minOccurrences: 1 },
      { tag: 'header', name: 'Header', minOccurrences: 1 },
      { tag: 'footer', name: 'Footer', minOccurrences: 1 },
      { tag: 'aside', name: 'Sidebar', minOccurrences: 1 },
      { tag: 'article', name: 'Article', minOccurrences: 2 },
      { tag: 'section', name: 'Section', minOccurrences: 3 }
    ];
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`<${pattern.tag}[^>]*>([\\s\\S]*?)<\\/${pattern.tag}>`, 'gi');
      const matches = [...mainComponent.jsx.matchAll(regex)];
      
      if (matches.length >= pattern.minOccurrences) {
        matches.forEach((match, index) => {
          const componentName = pattern.name + (matches.length > 1 ? index + 1 : '');
          const placeholder = `<${componentName} />`;
          
          // Check if component is substantial enough (more than 50 chars)
          if (match[0].length > 50) {
            this.extractedComponents.push({
              name: componentName,
              jsx: match[0],
              imports: ['React']
            });
            
            mainComponent.jsx = mainComponent.jsx.replace(match[0], placeholder);
            if (!mainComponent.imports.includes(componentName)) {
              mainComponent.imports.push(componentName);
            }
            console.log(colorizer.info('  Extracted component: ' + componentName));
          }
        });
      }
    });
  },

  generateComponent(component, isMain = false) {
    const imports = [];
    const hooksList = new Set();
    
    // Determine required React hooks
    if (component.hooks && component.hooks.length > 0) {
      component.hooks.forEach(hook => {
        if (hook.includes('useState')) hooksList.add('useState');
        if (hook.includes('useEffect')) hooksList.add('useEffect');
        if (hook.includes('useRef')) hooksList.add('useRef');
        if (hook.includes('useCallback')) hooksList.add('useCallback');
        if (hook.includes('useMemo')) hooksList.add('useMemo');
      });
    }
    
    if (component.effects && component.effects.length > 0) {
      hooksList.add('useEffect');
    }
    
    // Build React import
    if (hooksList.size > 0) {
      imports.push(`import React, { ${Array.from(hooksList).join(', ')} } from 'react';`);
    } else {
      imports.push("import React from 'react';");
    }
    
    // Component imports
    if (component.imports && component.imports.length > 0) {
      component.imports.forEach(imp => {
        if (imp !== 'React' && !imp.includes('use')) {
          imports.push(`import ${imp} from './${imp}';`);
        }
      });
    }
    
    // Stylesheet imports
    if (component.css) {
      imports.push(`import './${component.name}.css';`);
    }
    
    if (component.externalStyles && component.externalStyles.length > 0) {
      component.externalStyles.forEach(style => {
        const styleName = path.basename(style.original);
        imports.push(`import './${styleName}';`);
      });
    }
    
    let code = imports.join('\n') + '\n\n';
    
    code += `function ${component.name}() {\n`;
    
    // Add hooks
    if (component.hooks && component.hooks.length > 0) {
      component.hooks.forEach(hook => {
        code += `  ${hook}\n`;
      });
      code += '\n';
    }
    
    // Add effects
    if (component.effects && component.effects.length > 0) {
      component.effects.forEach(effect => {
        code += `  useEffect(() => {\n`;
        code += `    ${effect.code.split('\n').join('\n    ')}\n`;
        code += `  }, ${effect.dependencies});\n\n`;
      });
    }
    
    // Add functions
    if (component.functions && component.functions.length > 0) {
      component.functions.forEach(func => {
        const asyncKeyword = func.isAsync ? 'async ' : '';
        const params = func.params || '';
        code += `  const ${func.name} = ${asyncKeyword}(${params}) => {\n`;
        code += `    ${func.body.split('\n').join('\n    ')}\n`;
        code += `  };\n\n`;
      });
    }
    
    code += '  return (\n';
    
    // Format JSX with proper indentation
    const formattedJSX = this.formatJSX(component.jsx, 4);
    code += formattedJSX + '\n';
    code += '  );\n';
    code += '}\n\n';
    code += `export default ${component.name};\n`;
    
    return code;
  },

  formatJSX(jsx, indent = 0) {
    const lines = jsx.split('\n');
    let indentLevel = 0;
    const indentStr = ' '.repeat(indent);
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for closing tags
      if (trimmed.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const formatted = indentStr + ' '.repeat(indentLevel * 2) + trimmed;
      
      // Increase indent for opening tags (but not self-closing)
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indentLevel++;
      }
      
      return formatted;
    }).filter(line => line.trim()).join('\n');
  },

  async saveComponents(converted, outputDir, inputDir) {
    const savedFiles = [];
    
    try {
      await fs.mkdir(outputDir, { recursive: true });
      
      // Save main component
      const mainFile = path.join(outputDir, converted.main.name + '.jsx');
      const mainCode = this.generateComponent(converted.main, true);
      
      await fs.writeFile(mainFile, mainCode);
      savedFiles.push(mainFile);
      console.log(colorizer.success('Created: ' + mainFile));
      
      // Save CSS if exists
      if (converted.main.css) {
        const cssFile = path.join(outputDir, converted.main.name + '.css');
        await fs.writeFile(cssFile, converted.main.css);
        savedFiles.push(cssFile);
        console.log(colorizer.success('Created: ' + cssFile));
      }
      
      // Copy external stylesheets
      for (const style of this.externalStylesheets) {
        const destFile = path.join(outputDir, path.basename(style.original));
        
        try {
          await fs.copyFile(style.local, destFile);
          savedFiles.push(destFile);
          console.log(colorizer.success('Copied stylesheet: ' + destFile));
        } catch (err) {
          console.log(colorizer.warning('Could not copy stylesheet: ' + style.original));
        }
      }
      
      // Process and save JavaScript modules
      if (converted.jsModules.length > 0) {
        const utilsDir = path.join(outputDir, 'utils');
        await fs.mkdir(utilsDir, { recursive: true });
        
        for (const jsModule of converted.jsModules) {
          const destFile = path.join(utilsDir, jsModule.name);
          await fs.writeFile(destFile, jsModule.code);
          savedFiles.push(destFile);
          console.log(colorizer.success('Created JS module: ' + destFile));
        }
      }
      
      // Copy and convert external scripts
      for (const script of this.externalScripts) {
        try {
          const scriptContent = await fs.readFile(script.local, 'utf8');
          const convertedScript = await this.convertExternalScript(scriptContent, script);
          
          const utilsDir = path.join(outputDir, 'utils');
          await fs.mkdir(utilsDir, { recursive: true });
          
          const baseName = path.basename(script.original, path.extname(script.original));
          const destFile = path.join(utilsDir, baseName + (script.isModule ? '.js' : '.util.js'));
          
          await fs.writeFile(destFile, convertedScript);
          savedFiles.push(destFile);
          console.log(colorizer.success('Converted script: ' + destFile));
        } catch (err) {
          console.log(colorizer.warning('Could not process script: ' + script.original + ' - ' + err.message));
        }
      }
      
      // Save extracted components
      for (const comp of converted.components) {
        const compFile = path.join(outputDir, comp.name + '.jsx');
        const compCode = this.generateComponent(comp);
        
        await fs.writeFile(compFile, compCode);
        savedFiles.push(compFile);
        console.log(colorizer.success('Created: ' + compFile));
      }
      
      // Generate package.json if dependencies were detected
      if (this.dependencies.size > 0) {
        await this.generatePackageJson(outputDir);
        savedFiles.push(path.join(outputDir, 'package.json'));
      }
      
      // Generate README
      await this.generateReadme(outputDir, converted);
      savedFiles.push(path.join(outputDir, 'README.md'));
      
      return savedFiles;
    } catch (err) {
      throw new Error('Failed to save components: ' + err.message);
    }
  },

  async convertExternalScript(scriptContent, scriptInfo) {
    // Wrap the script in a module format if it's not already a module
    if (scriptInfo.isModule) {
      return scriptContent;
    }
    
    let converted = scriptContent;
    
    // Try to detect exported functions/variables
    const exports = this.detectExports(scriptContent);
    
    if (exports.length > 0) {
      converted += '\n\n// Auto-generated exports\n';
      converted += `export { ${exports.join(', ')} };\n`;
      console.log(colorizer.info('  Detected exports: ' + exports.join(', ')));
    } else {
      // If no clear exports, wrap everything in a default export
      converted = `// Converted from: ${scriptInfo.original}\n// Note: This file may need manual adjustments\n\n${converted}`;
    }
    
    return converted;
  },

  detectExports(code) {
    const exports = [];
    
    // Detect function declarations
    const functionRegex = /function\s+(\w+)\s*\(/g;
    let match;
    
    while ((match = functionRegex.exec(code)) !== null) {
      exports.push(match[1]);
    }
    
    // Detect const/let/var declarations at top level
    const varRegex = /^(?:const|let|var)\s+(\w+)\s*=/gm;
    
    while ((match = varRegex.exec(code)) !== null) {
      exports.push(match[1]);
    }
    
    // Detect class declarations
    const classRegex = /class\s+(\w+)/g;
    
    while ((match = classRegex.exec(code)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  },

  async generatePackageJson(outputDir) {
    const packageJson = {
      name: path.basename(outputDir),
      version: '1.0.0',
      description: 'React components generated from HTML',
      main: 'index.js',
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        'react-scripts': '^5.0.1'
      }
    };
    
    // Add detected dependencies
    this.dependencies.forEach(dep => {
      packageJson.dependencies[dep] = 'latest';
    });
    
    const pkgFile = path.join(outputDir, 'package.json');
    await fs.writeFile(pkgFile, JSON.stringify(packageJson, null, 2));
    console.log(colorizer.success('Created: ' + pkgFile));
  },

  async generateReadme(outputDir, converted) {
    let readme = '# React Components\n\n';
    readme += 'This project was generated from HTML using html-to-react converter.\n\n';
    
    readme += '## Installation\n\n';
    readme += '```bash\n';
    readme += 'npm install\n';
    readme += '```\n\n';
    
    readme += '## Components\n\n';
    readme += `- **${converted.main.name}** - Main component\n`;
    
    converted.components.forEach(comp => {
      readme += `- **${comp.name}** - Extracted component\n`;
    });
    
    if (converted.main.hooks.length > 0) {
      readme += '\n## State Management\n\n';
      readme += 'The components use React hooks for state management:\n\n';
      converted.main.hooks.forEach(hook => {
        if (hook.includes('useState')) {
          readme += `- ${hook.split('=')[0].trim()}\n`;
        }
      });
    }
    
    if (this.dependencies.size > 0) {
      readme += '\n## Dependencies\n\n';
      readme += 'The following external libraries were detected:\n\n';
      this.dependencies.forEach(dep => {
        readme += `- ${dep}\n`;
      });
    }
    
    readme += '\n## Manual Review Required\n\n';
    readme += 'Please review the following:\n\n';
    readme += '- Event handlers and their implementations\n';
    readme += '- State management logic\n';
    readme += '- Any TODO comments in the code\n';
    readme += '- External script integrations\n';
    readme += '- DOM manipulation converted to React patterns\n';
    
    const readmeFile = path.join(outputDir, 'README.md');
    await fs.writeFile(readmeFile, readme);
    console.log(colorizer.success('Created: ' + readmeFile));
  },

  printConversionSummary() {
    console.log(colorizer.section('Conversion Summary'));
    console.log(colorizer.cyan('  Components created: ') + (this.extractedComponents.length + 1));
    console.log(colorizer.cyan('  Stylesheets: ') + this.externalStylesheets.length);
    console.log(colorizer.cyan('  Scripts processed: ') + this.externalScripts.length);
    
    if (this.dependencies.size > 0) {
      console.log(colorizer.cyan('  Dependencies detected: ') + Array.from(this.dependencies).join(', '));
    }
    
    if (this.globalVariables.size > 0) {
      console.log(colorizer.cyan('  State variables: ') + this.globalVariables.size);
    }
    
    console.log();
  },

  convertBatch(args) {
    const inputDir = args[0] || '.';
    const outputDir = args[1] || './react-components';
    
    console.log(colorizer.header('Batch HTML to React Conversion'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('Input Directory: ') + colorizer.bright(inputDir));
    console.log(colorizer.cyan('Output Directory: ') + colorizer.bright(outputDir));
    console.log();

    return this.findHTMLFiles(inputDir)
      .then(files => {
        if (files.length === 0) {
          console.log(colorizer.warning('No HTML files found in ' + inputDir + '\n'));
          return;
        }
        
        console.log(colorizer.info('Found ' + files.length + ' HTML file(s)\n'));
        
        const promises = files.map(file => {
          const relativePath = path.relative(inputDir, file);
          const outputSubDir = path.join(outputDir, path.dirname(relativePath));
          
          console.log(colorizer.cyan('Converting: ') + relativePath);
          
          return this.convert([file, outputSubDir])
            .catch(err => {
              console.log(colorizer.warning('Failed to convert ' + file + ': ' + err.message));
            });
        });
        
        return Promise.all(promises);
      })
      .then(() => {
        console.log(colorizer.success('\nBatch conversion complete!\n'));
      })
      .catch(err => {
        console.log(colorizer.error('Batch conversion failed: ' + err.message + '\n'));
      });
  },

  findHTMLFiles(dir, files = []) {
    return fs.readdir(dir, { withFileTypes: true })
      .then(items => {
        const promises = items.map(item => {
          const fullPath = path.join(dir, item.name);
          
          // Skip common directories
          if (['node_modules', '.git', 'dist', 'build', 'react-components'].includes(item.name)) {
            return Promise.resolve();
          }
          
          if (item.isDirectory()) {
            return this.findHTMLFiles(fullPath, files);
          } else if (item.isFile() && path.extname(item.name).toLowerCase() === '.html') {
            files.push(fullPath);
          }
          
          return Promise.resolve();
        });
        
        return Promise.all(promises);
      })
      .then(() => files)
      .catch(err => {
        console.log(colorizer.warning('Error reading directory ' + dir + ': ' + err.message));
        return files;
      });
  },

  analyzeHTML(args) {
    const filePath = args[0];
    
    if (!filePath) {
      console.log(colorizer.error('Usage: analyze-html <html-file>\n'));
      return Promise.resolve();
    }

    console.log(colorizer.header('HTML Structure Analysis'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('File: ') + colorizer.bright(filePath));
    console.log();

    return fs.readFile(filePath, 'utf8')
      .then(html => {
        const analysis = {
          totalLines: html.split('\n').length,
          totalSize: Buffer.byteLength(html, 'utf8'),
          tags: this.countTags(html),
          hasCSS: html.includes('<style') || html.includes('style='),
          hasInlineCSS: html.includes('style='),
          hasExternalCSS: html.includes('<link') && html.includes('stylesheet'),
          hasJS: html.includes('<script'),
          hasInlineJS: /<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi.test(html),
          hasExternalJS: /<script[^>]+src=/gi.test(html),
          forms: (html.match(/<form/gi) || []).length,
          inputs: (html.match(/<input/gi) || []).length,
          images: (html.match(/<img/gi) || []).length,
          links: (html.match(/<a/gi) || []).length,
          semanticTags: this.countSemanticTags(html),
          eventHandlers: this.countEventHandlers(html),
          externalScripts: this.countExternalScripts(html),
          dataAttributes: (html.match(/data-\w+=/gi) || []).length
        };

        console.log(colorizer.section('File Statistics'));
        console.log(colorizer.cyan('  Total Lines: ') + analysis.totalLines);
        console.log(colorizer.cyan('  File Size: ') + (analysis.totalSize / 1024).toFixed(2) + ' KB');
        console.log(colorizer.cyan('  Total Tags: ') + analysis.tags);
        console.log(colorizer.cyan('  Forms: ') + analysis.forms);
        console.log(colorizer.cyan('  Input Fields: ') + analysis.inputs);
        console.log(colorizer.cyan('  Images: ') + analysis.images);
        console.log(colorizer.cyan('  Links: ') + analysis.links);
        console.log(colorizer.cyan('  Data Attributes: ') + analysis.dataAttributes);

        console.log(colorizer.section('CSS'));
        console.log(colorizer.cyan('  Has Inline CSS: ') + (analysis.hasInlineCSS ? colorizer.green('Yes') : colorizer.red('No')));
        console.log(colorizer.cyan('  Has External CSS: ') + (analysis.hasExternalCSS ? colorizer.green('Yes') : colorizer.red('No')));

        console.log(colorizer.section('JavaScript'));
        console.log(colorizer.cyan('  Has Inline JS: ') + (analysis.hasInlineJS ? colorizer.green('Yes') : colorizer.red('No')));
        console.log(colorizer.cyan('  Has External JS: ') + (analysis.hasExternalJS ? colorizer.green('Yes') : colorizer.red('No')));
        console.log(colorizer.cyan('  External Scripts: ') + analysis.externalScripts.length);
        console.log(colorizer.cyan('  Event Handlers: ') + analysis.eventHandlers);

        if (analysis.externalScripts.length > 0) {
          console.log(colorizer.cyan('  Detected Scripts:'));
          analysis.externalScripts.forEach(script => {
            console.log(colorizer.bullet(script));
          });
        }

        console.log(colorizer.section('Semantic Tags'));
        Object.entries(analysis.semanticTags).forEach(([tag, count]) => {
          if (count > 0) {
            console.log(colorizer.bullet(tag + ': ' + count));
          }
        });

        console.log(colorizer.section('Conversion Complexity'));
        let complexity = 'Low';
        let score = 0;
        
        if (analysis.hasInlineJS) score += 3;
        if (analysis.hasExternalJS) score += 2;
        if (analysis.eventHandlers > 10) score += 3;
        else if (analysis.eventHandlers > 5) score += 2;
        else if (analysis.eventHandlers > 0) score += 1;
        if (analysis.forms > 2) score += 2;
        else if (analysis.forms > 0) score += 1;
        if (analysis.hasInlineCSS) score += 1;
        if (analysis.dataAttributes > 10) score += 1;
        
        if (score >= 7) complexity = 'High';
        else if (score >= 4) complexity = 'Medium';
        
        const complexityColor = complexity === 'High' ? colorizer.red : 
                                 complexity === 'Medium' ? colorizer.yellow : 
                                 colorizer.green;
        
        console.log(colorizer.cyan('  Complexity Score: ') + score + '/12');
        console.log(colorizer.cyan('  Complexity Level: ') + complexityColor(complexity));

        console.log(colorizer.section('Conversion Recommendations'));
        const recommendations = [];
        
        if (analysis.semanticTags.nav > 0) recommendations.push('Extract navigation as separate component');
        if (analysis.semanticTags.header > 0) recommendations.push('Extract header as separate component');
        if (analysis.semanticTags.footer > 0) recommendations.push('Extract footer as separate component');
        if (analysis.semanticTags.aside > 0) recommendations.push('Extract sidebar as separate component');
        if (analysis.forms > 0) recommendations.push('Consider using React Hook Form or Formik for form management');
        if (analysis.hasInlineJS) recommendations.push('JavaScript will be converted to React hooks and functions');
        if (analysis.eventHandlers > 5) recommendations.push('Multiple event handlers detected - will be converted to React event props');
        if (analysis.hasExternalJS) recommendations.push('External scripts will be converted to ES6 modules in utils folder');
        if (analysis.hasExternalCSS) recommendations.push('External stylesheets will be imported as CSS modules');
        if (analysis.dataAttributes > 0) recommendations.push('Data attributes detected - consider converting to props or state');
        if (complexity === 'High') recommendations.push('High complexity - expect significant manual adjustments needed');
        
        if (recommendations.length > 0) {
          recommendations.forEach(rec => console.log(colorizer.bullet(rec)));
        } else {
          console.log(colorizer.dim('  No specific recommendations - straightforward conversion expected'));
        }
        
        console.log();
      })
      .catch(err => {
        console.log(colorizer.error('Analysis failed: ' + err.message));
        if (err.stack) {
          console.log(colorizer.dim(err.stack));
        }
        console.log();
      });
  },

  countTags(html) {
    const matches = html.match(/<[^>]+>/g);
    return matches ? matches.length : 0;
  },

  countSemanticTags(html) {
    const tags = ['nav', 'header', 'footer', 'main', 'section', 'article', 'aside', 'figure'];
    const counts = {};
    
    tags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
      const matches = html.match(regex);
      counts[tag] = matches ? matches.length : 0;
    });
    
    return counts;
  },

  countEventHandlers(html) {
    const events = ['onclick', 'onchange', 'onsubmit', 'onload', 'onmouseover', 
                    'onmouseout', 'onkeydown', 'onkeyup', 'onfocus', 'onblur',
                    'oninput', 'onscroll', 'ondblclick'];
    let count = 0;
    
    events.forEach(event => {
      const regex = new RegExp(event + '=', 'gi');
      const matches = html.match(regex);
      if (matches) count += matches.length;
    });
    
    return count;
  },

  countExternalScripts(html) {
    const scripts = [];
    const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = scriptRegex.exec(html)) !== null) {
      scripts.push(match[1]);
    }
    
    return scripts;
  },

  toPascalCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  },

  toCamelCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toLowerCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  }
};

module.exports = HTMLToReact;