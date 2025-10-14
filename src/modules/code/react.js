// modules/html-to-react.js - HTML to React Component Converter
const fs = require('fs').promises;
const path = require('path');
const colorizer = require('../utils/colorizer');

const HTMLToReact = function() {
  this.componentCounter = 0;
  this.extractedComponents = [];
  this.externalStylesheets = [];
  this.externalScripts = [];
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
      })
      .catch(err => {
        console.log(colorizer.error('Conversion failed: ' + err.message + '\n'));
      });
  },

  convertHTML(html, baseName, inputDir) {
    // Extract external stylesheets and scripts first
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
    
    // Extract reusable components
    this.extractComponents(mainComponent);
    
    // Add external resources to imports
    if (this.externalStylesheets.length > 0) {
      mainComponent.externalStyles = this.externalStylesheets;
    }
    
    if (this.externalScripts.length > 0) {
      mainComponent.externalScripts = this.externalScripts;
    }
    
    return {
      main: mainComponent,
      components: this.extractedComponents
    };
  },

  extractExternalResources(html, inputDir) {
    // Extract external stylesheets
    const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      if (!href.startsWith('http://') && !href.startsWith('https://')) {
        this.externalStylesheets.push({
          original: href,
          local: path.join(inputDir, href)
        });
        console.log(colorizer.info('  Found stylesheet: ' + href));
      }
    }
    
    // Extract external scripts
    const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi;
    
    while ((match = scriptRegex.exec(html)) !== null) {
      const src = match[1];
      if (!src.startsWith('http://') && !src.startsWith('https://') && 
          !src.includes('jquery') && !src.includes('bootstrap')) {
        this.externalScripts.push({
          original: src,
          local: path.join(inputDir, src)
        });
        console.log(colorizer.info('  Found script: ' + src));
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
    
    // Remove comments
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    
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
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    const hooks = [];
    const functions = [];
    
    if (scriptMatches) {
      scriptMatches.forEach(match => {
        const jsContent = match.replace(/<\/?script[^>]*>/gi, '');
        const converted = this.convertJavaScriptToReact(jsContent);
        
        if (converted.hooks.length > 0) {
          hooks.push(...converted.hooks);
        }
        if (converted.functions.length > 0) {
          functions.push(...converted.functions);
        }
      });
      html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    }
    
    return {
      name: componentName,
      jsx: html,
      css: css,
      imports: ['React', '{ useState, useEffect }'],
      hooks: hooks,
      functions: functions
    };
  },

  convertJavaScriptToReact(jsCode) {
    const hooks = [];
    const functions = [];
    
    // Convert document.getElementById to useRef
    if (jsCode.includes('document.getElementById')) {
      hooks.push('const elemRef = useRef(null);');
      console.log(colorizer.info('  Converting getElementById to useRef'));
    }
    
    // Convert addEventListener to React event handlers
    if (jsCode.includes('addEventListener')) {
      console.log(colorizer.info('  Converting event listeners to React handlers'));
    }
    
    // Convert document.ready or window.onload to useEffect
    if (jsCode.includes('DOMContentLoaded') || jsCode.includes('window.onload')) {
      const effectCode = jsCode
        .replace(/document\.addEventListener\(['"]DOMContentLoaded['"],\s*function\s*\(\)\s*\{/, '')
        .replace(/window\.onload\s*=\s*function\s*\(\)\s*\{/, '')
        .replace(/\}\);?\s*$/, '');
      
      hooks.push(`useEffect(() => {\n    ${this.cleanJSCode(effectCode)}\n  }, []);`);
      console.log(colorizer.info('  Converting to useEffect'));
    }
    
    // Extract regular functions
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
    let match;
    
    while ((match = functionRegex.exec(jsCode)) !== null) {
      const functionName = match[1];
      const functionBody = match[0];
      functions.push({
        name: functionName,
        body: this.convertFunctionToReact(functionBody)
      });
      console.log(colorizer.info('  Extracting function: ' + functionName));
    }
    
    // Detect state variables (variables that change)
    const stateVarRegex = /let\s+(\w+)\s*=\s*([^;]+);/g;
    
    while ((match = stateVarRegex.exec(jsCode)) !== null) {
      const varName = match[1];
      const initialValue = match[2].trim();
      hooks.push(`const [${varName}, set${this.toPascalCase(varName)}] = useState(${initialValue});`);
      console.log(colorizer.info('  Converting variable to state: ' + varName));
    }
    
    return { hooks, functions };
  },

  convertFunctionToReact(functionCode) {
    // Convert DOM manipulation to React patterns
    let converted = functionCode;
    
    // Convert document.getElementById to ref access
    converted = converted.replace(
      /document\.getElementById\(['"]([^'"]+)['"]\)/g,
      'elemRef.current'
    );
    
    // Convert innerHTML to state updates
    converted = converted.replace(
      /\.innerHTML\s*=\s*(['"][^'"]*['"])/g,
      ' // TODO: Update state instead of innerHTML'
    );
    
    // Convert querySelector to ref
    converted = converted.replace(
      /document\.querySelector\(['"]([^'"]+)['"]\)/g,
      'elemRef.current'
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
    jsx = jsx.replace(/class=/gi, 'className=');
    
    // Convert for to htmlFor
    jsx = jsx.replace(/\sfor=/gi, ' htmlFor=');
    
    // Convert inline event handlers
    jsx = jsx.replace(/onclick=/gi, 'onClick=');
    jsx = jsx.replace(/onchange=/gi, 'onChange=');
    jsx = jsx.replace(/onsubmit=/gi, 'onSubmit=');
    jsx = jsx.replace(/onmouseover=/gi, 'onMouseOver=');
    jsx = jsx.replace(/onmouseout=/gi, 'onMouseOut=');
    jsx = jsx.replace(/onkeydown=/gi, 'onKeyDown=');
    jsx = jsx.replace(/onkeyup=/gi, 'onKeyUp=');
    jsx = jsx.replace(/onkeypress=/gi, 'onKeyPress=');
    jsx = jsx.replace(/onfocus=/gi, 'onFocus=');
    jsx = jsx.replace(/onblur=/gi, 'onBlur=');
    jsx = jsx.replace(/oninput=/gi, 'onInput=');
    
    // Convert boolean attributes
    jsx = jsx.replace(/\s(checked|disabled|readonly|required|selected)(?=\s|>|\/)/gi, ' $1={true}');
    
    // Convert self-closing tags
    jsx = jsx.replace(/<(img|input|br|hr|meta|link)([^>]*)>/gi, '<$1$2 />');
    
    return jsx;
  },

  convertEventHandlers(jsx) {
    // Convert inline event handler strings to functions
    const eventRegex = /on(\w+)=["']([^"']+)["']/gi;
    
    return jsx.replace(eventRegex, (match, eventName, handler) => {
      // Clean up the handler
      const cleanHandler = handler
        .replace(/this\./g, '')
        .replace(/;$/, '');
      
      return `on${eventName}={() => ${cleanHandler}}`;
    });
  },

  convertInlineStyles(jsx) {
    const styleRegex = /style="([^"]*)"/gi;
    
    return jsx.replace(styleRegex, (match, styleContent) => {
      const styleObj = this.parseInlineStyle(styleContent);
      const styleString = JSON.stringify(styleObj)
        .replace(/"/g, "'")
        .replace(/,/g, ', ');
      return `style={${styleString}}`;
    });
  },

  parseInlineStyle(styleString) {
    const styles = {};
    const declarations = styleString.split(';').filter(s => s.trim());
    
    declarations.forEach(decl => {
      const [property, value] = decl.split(':').map(s => s.trim());
      if (property && value) {
        const camelProperty = this.toCamelCase(property);
        styles[camelProperty] = value;
      }
    });
    
    return styles;
  },

  extractComponents(mainComponent) {
    const patterns = [
      { tag: 'nav', name: 'Navigation' },
      { tag: 'header', name: 'Header' },
      { tag: 'footer', name: 'Footer' },
      { tag: 'aside', name: 'Sidebar' },
      { tag: 'article', name: 'Article' },
      { tag: 'section', name: 'Section' }
    ];
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`<${pattern.tag}[^>]*>([\\s\\S]*?)<\\/${pattern.tag}>`, 'gi');
      const matches = mainComponent.jsx.match(regex);
      
      if (matches && matches.length > 0) {
        matches.forEach((match, index) => {
          const componentName = pattern.name + (index > 0 ? index + 1 : '');
          const placeholder = `<${componentName} />`;
          
          this.extractedComponents.push({
            name: componentName,
            jsx: match,
            imports: ['React']
          });
          
          mainComponent.jsx = mainComponent.jsx.replace(match, placeholder);
          mainComponent.imports.push(componentName);
        });
      }
    });
  },

  generateComponent(component, isMain = false) {
    const imports = [];
    
    // React imports
    if (component.hooks && component.hooks.length > 0) {
      imports.push("import React, { useState, useEffect, useRef } from 'react';");
    } else {
      imports.push("import React from 'react';");
    }
    
    // Component imports
    if (component.imports && component.imports.length > 0) {
      component.imports.forEach(imp => {
        if (imp !== 'React' && imp !== '{ useState, useEffect }') {
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
    
    // Add functions
    if (component.functions && component.functions.length > 0) {
      component.functions.forEach(func => {
        code += `  ${func.body}\n\n`;
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
      
      if (trimmed.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const formatted = indentStr + ' '.repeat(indentLevel * 2) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indentLevel++;
      }
      
      return formatted;
    }).join('\n');
  },

  saveComponents(converted, outputDir, inputDir) {
    const savedFiles = [];
    
    return fs.mkdir(outputDir, { recursive: true })
      .then(() => {
        // Save main component
        const mainFile = path.join(outputDir, converted.main.name + '.jsx');
        const mainCode = this.generateComponent(converted.main, true);
        
        return fs.writeFile(mainFile, mainCode)
          .then(() => {
            savedFiles.push(mainFile);
            console.log(colorizer.success('Created: ' + mainFile));
            
            // Save CSS if exists
            if (converted.main.css) {
              const cssFile = path.join(outputDir, converted.main.name + '.css');
              return fs.writeFile(cssFile, converted.main.css)
                .then(() => {
                  savedFiles.push(cssFile);
                  console.log(colorizer.success('Created: ' + cssFile));
                });
            }
          });
      })
      .then(() => {
        // Copy external stylesheets
        const stylePromises = this.externalStylesheets.map(style => {
          const destFile = path.join(outputDir, path.basename(style.original));
          
          return fs.copyFile(style.local, destFile)
            .then(() => {
              savedFiles.push(destFile);
              console.log(colorizer.success('Copied stylesheet: ' + destFile));
            })
            .catch(err => {
              console.log(colorizer.warning('Could not copy stylesheet: ' + style.original));
            });
        });
        
        return Promise.all(stylePromises);
      })
      .then(() => {
        // Copy external scripts (as utils or helpers)
        const scriptPromises = this.externalScripts.map(script => {
          const destFile = path.join(outputDir, 'utils', path.basename(script.original));
          
          return fs.mkdir(path.join(outputDir, 'utils'), { recursive: true })
            .then(() => fs.copyFile(script.local, destFile))
            .then(() => {
              savedFiles.push(destFile);
              console.log(colorizer.success('Copied script: ' + destFile));
            })
            .catch(err => {
              console.log(colorizer.warning('Could not copy script: ' + script.original));
            });
        });
        
        return Promise.all(scriptPromises);
      })
      .then(() => {
        // Save extracted components
        const componentPromises = converted.components.map(comp => {
          const compFile = path.join(outputDir, comp.name + '.jsx');
          const compCode = this.generateComponent(comp);
          
          return fs.writeFile(compFile, compCode)
            .then(() => {
              savedFiles.push(compFile);
              console.log(colorizer.success('Created: ' + compFile));
            });
        });
        
        return Promise.all(componentPromises);
      })
      .then(() => savedFiles);
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
        console.log(colorizer.info('Found ' + files.length + ' HTML files\n'));
        
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
    return fs.readdir(dir)
      .then(items => {
        const promises = items.map(item => {
          const fullPath = path.join(dir, item);
          
          if (['node_modules', '.git', 'dist', 'build'].includes(item)) {
            return Promise.resolve();
          }
          
          return fs.stat(fullPath)
            .then(stat => {
              if (stat.isDirectory()) {
                return this.findHTMLFiles(fullPath, files);
              } else if (path.extname(fullPath).toLowerCase() === '.html') {
                files.push(fullPath);
              }
            })
            .catch(() => {});
        });
        
        return Promise.all(promises);
      })
      .then(() => files)
      .catch(() => files);
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
          tags: this.countTags(html),
          hasCSS: html.includes('<style') || html.includes('style='),
          hasInlineCSS: html.includes('style='),
          hasExternalCSS: html.includes('<link') && html.includes('stylesheet'),
          hasJS: html.includes('<script'),
          hasInlineJS: /<script[^>]*>[\s\S]*?<\/script>/gi.test(html),
          hasExternalJS: /<script[^>]+src=/gi.test(html),
          forms: (html.match(/<form/gi) || []).length,
          images: (html.match(/<img/gi) || []).length,
          links: (html.match(/<a/gi) || []).length,
          semanticTags: this.countSemanticTags(html),
          eventHandlers: this.countEventHandlers(html)
        };

        console.log(colorizer.section('File Statistics'));
        console.log(colorizer.cyan('  Total Lines: ') + analysis.totalLines);
        console.log(colorizer.cyan('  Total Tags: ') + analysis.tags);
        console.log(colorizer.cyan('  Forms: ') + analysis.forms);
        console.log(colorizer.cyan('  Images: ') + analysis.images);
        console.log(colorizer.cyan('  Links: ') + analysis.links);

        console.log(colorizer.section('CSS'));
        console.log(colorizer.cyan('  Has Inline CSS: ') + (analysis.hasInlineCSS ? colorizer.green('Yes') : colorizer.red('No')));
        console.log(colorizer.cyan('  Has External CSS: ') + (analysis.hasExternalCSS ? colorizer.green('Yes') : colorizer.red('No')));

        console.log(colorizer.section('JavaScript'));
        console.log(colorizer.cyan('  Has Inline JS: ') + (analysis.hasInlineJS ? colorizer.green('Yes') : colorizer.red('No')));
        console.log(colorizer.cyan('  Has External JS: ') + (analysis.hasExternalJS ? colorizer.green('Yes') : colorizer.red('No')));
        console.log(colorizer.cyan('  Event Handlers: ') + analysis.eventHandlers);

        console.log(colorizer.section('Semantic Tags'));
        Object.entries(analysis.semanticTags).forEach(([tag, count]) => {
          if (count > 0) {
            console.log(colorizer.bullet(tag + ': ' + count));
          }
        });

        console.log(colorizer.section('Conversion Complexity'));
        let complexity = 'Low';
        let score = 0;
        
        if (analysis.hasInlineJS) score += 2;
        if (analysis.hasExternalJS) score += 1;
        if (analysis.eventHandlers > 5) score += 2;
        if (analysis.forms > 0) score += 1;
        if (analysis.hasInlineCSS) score += 1;
        
        if (score >= 5) complexity = 'High';
        else if (score >= 3) complexity = 'Medium';
        
        console.log(colorizer.cyan('  Complexity: ') + 
          (complexity === 'High' ? colorizer.red(complexity) :
           complexity === 'Medium' ? colorizer.yellow(complexity) :
           colorizer.green(complexity)));

        console.log(colorizer.section('Conversion Recommendations'));
        const recommendations = [];
        
        if (analysis.semanticTags.nav > 0) recommendations.push('Extract navigation as separate component');
        if (analysis.semanticTags.header > 0) recommendations.push('Extract header as separate component');
        if (analysis.semanticTags.footer > 0) recommendations.push('Extract footer as separate component');
        if (analysis.forms > 0) recommendations.push('Consider using React Hook Form or Formik');
        if (analysis.hasInlineJS) recommendations.push('JavaScript will be converted to React hooks and functions');
        if (analysis.eventHandlers > 0) recommendations.push('Event handlers will be converted to React event props');
        if (analysis.hasExternalJS) recommendations.push('External scripts will be copied to utils folder');
        if (analysis.hasExternalCSS) recommendations.push('External stylesheets will be imported');

        if (recommendations.length > 0) {
          recommendations.forEach(rec => console.log(colorizer.bullet(rec)));
        }
        console.log();
      })
      .catch(err => {
        console.log(colorizer.error('Analysis failed: ' + err.message + '\n'));
      });
  },

  countTags(html) {
    const matches = html.match(/<[^>]+>/g);
    return matches ? matches.length : 0;
  },

  countSemanticTags(html) {
    const tags = ['nav', 'header', 'footer', 'main', 'section', 'article', 'aside'];
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
                    'onmouseout', 'onkeydown', 'onkeyup', 'onfocus', 'onblur'];
    let count = 0;
    
    events.forEach(event => {
      const regex = new RegExp(event + '=', 'gi');
      const matches = html.match(regex);
      if (matches) count += matches.length;
    });
    
    return count;
  },

  toPascalCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  },

  toCamelCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toLowerCase());
  }
};

module.exports = HTMLToReact;