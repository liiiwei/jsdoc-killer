function GenerateTemplateConfig(config) {
  const options = config.options;
  const handles = config.handles;
  const handleNames = Object.keys(handles);
  const hasGetLevel1HeadingPrefix = Object.has(handles, 'getLevel1HeadingPrefix');
  const hasGetLevel2HeadingPrefix = Object.has(handles, 'getLevel2HeadingPrefix');
  const hasGetLevel3HeadingPrefix = Object.has(handles, 'getLevel3HeadingPrefix');
  const hasGetLevel4HeadingPrefix = Object.has(handles, 'getLevel4HeadingPrefix');
  return `
    /**
     * create by ${slots['author']} on 2020-11-17
     */
    'use strict';
    
    const schema = {
      keywordsCN: {
        from: 'abstract.keywords',
        operation: {
          name: 'getKeywordsCNStr',
          options: {
            separator: '${slots['cnKeywordSep']}'
          },
          dependOnOperations: [{
            name: 'getKeywordsStr'
          }]
        }
      },
      keywordsEN: {
        from: 'abstract.keywords',
        operation: {
          name: 'getKeywordsENStr',
          options: {
            separator: '${slots['enKeywordSep']}'
          },
          dependOnOperations: [{
            name: 'getKeywordsStr'
          }]
        }
      },
      'chapters:refContents': {
        from: 'content',
        associateFrom: ['image', 'table', 'formula', 'reference'],
        operation: {
          name: 'getContent',
          options: {
            quoteIndent: '36pt',
            isChinese: false,
            indexTypeForCatpion: 'count'
          },
          dependOnOperations: [
            {
              name: 'processPreParagraphsOrSections',
              dependOnOperations: [
                {
                  name: 'getProcessedPreParagraphs',
                  dependOnOperations: [
                    {
                      name: 'getIndexForCapterOrContent'
                    }, {
                      name: 'getFigureName'
                    }, {
                      name: 'getTableName'
                    }, {
                      name: 'getTableSourceName'
                    }, {
                      name: 'getFormulaName'
                    }
                  ]
                },
                {
                  name: 'processPreParagraphsOrSections'
                }
              ]
            }, {
              name: 'processChaptersOrSections',
              dependOnOperations: [
                {
                  name: 'getHeadingPrefix',
                  dependOnOperations: [
                    {
                      name: 'getLevel1HeadingPrefix',
                      ${hasGetLevel1HeadingPrefix ? "replace: 'myGetLevel1HeadingPrefix'" : ''}
                    }, {
                      name: 'getLevel2HeadingPrefix',
                      ${hasGetLevel2HeadingPrefix ? "replace: 'myGetLevel2HeadingPrefix'" : ''}
                    }, {
                      name: 'getLevel3HeadingPrefix',
                      ${hasGetLevel3HeadingPrefix ? "replace: 'myGetLevel3HeadingPrefix'" : ''}
                    }, {
                      name: 'getLevel4HeadingPrefix',
                      ${hasGetLevel4HeadingPrefix ? "replace: 'myGetLevel4HeadingPrefix'" : ''}
                    }
                  ]
                }, {
                  name: 'getProcessedPreParagraphs',
                  dependOnOperations: [
                    {
                      name: 'getIndexForCapterOrContent'
                    }, {
                      name: 'getFigureName'
                    }, {
                      name: 'getTableName'
                    }, {
                      name: 'getTableSourceName'
                    }, {
                      name: 'getFormulaName'
                    }
                  ]
                }, {
                  name: 'processChaptersOrSections'
                }
              ]
            }
          ]
        }
      },
      ${options.join(',')}
    };

    ${slots.funcs.join('\n')}

    ${handles}
    
    module.exports = {
      schema,
      ${handleNames.join('\n,')}
    };
    `;
}

const GET_ENGLISH_NUMBER_FUNCS = `
function getEnglishNumber(num) {
  let str;
  switch(num) {
    case 1: str = 'one';break;
    case 2: str = 'two';break;
    case 3: str = 'three';break;
    case 4: str = 'four';break;
    case 5: str = 'five';break;
    case 6: str = 'six';break;
    case 7: str = 'seven';break;
    case 8: str = 'eight';break;
    case 9: str = 'nine';break;
    case 10: str = 'ten';break;
    case 11: str = 'eleven';break;
    case 12: str = 'twelve';break;
    case 13: str = 'thirteen';break;
    case 14: str = 'fourteen';break;
    case 15: str = 'fifteen';break;
    case 16: str = 'sixteen';break;
    case 17: str = 'seventeen';break;
    case 18: str = 'eighteen';break;
    case 19: str = 'nineteen';break;
    case 20: str = 'twenty';break;
    case 30: str = 'thirty';break;
    case 40: str = 'forty';break;
    case 50: str = 'fifty';break;
    case 60: str = 'sixty';break;
    case 70: str = 'seventy';break;
    case 80: str = 'eighty';break;
    case 90: str = 'ninety';break;
    case 100: str = 'hundred';break;
    default: str = 'zero';
  }
  return str;
}

function getEnglishNumberAssembly(num) {
  num = parseInt(num, 10);
  if (!num) {
    return 'zero';
  }
  //get hundred
  let hdd = Math.floor(num % 1000 / 100);
  let strArr = [];
  if (hdd > 0) {
    strArr.push(getEnglishNumber(hdd), 'hundred');
  }
  let ten = num % 100;
  if (ten) {
    let tenStr;
    if (ten / 10 < 2) {
      tenStr = getEnglishNumber(num % 100);
    } else {
      tenStr = getEnglishNumber(Math.floor(ten / 10) * 10);
      if (ten % 10) {
        tenStr += ('-' + getEnglishNumber(ten % 10));
      }
    }
    strArr.push(tenStr);
  }
  return strArr.join(' ');
}
`;

const GET_CHINESE_NUMBER_FUNCS = `
function getChineseNumber(num) {
  let str;
  switch(num) {
    case 1: str = '一';break;
    case 2: str = '二';break;
    case 3: str = '三';break;
    case 4: str = '四';break;
    case 5: str = '五';break;
    case 6: str = '六';break;
    case 7: str = '七';break;
    case 8: str = '八';break;
    case 9: str = '九';break;
    case 10: str = '十';break;
    case 11: str = '十一';break;
    case 12: str = '十二';break;
    case 13: str = '十三';break;
    case 14: str = '十四';break;
    case 15: str = '十五';break;
    case 16: str = '十六';break;
    case 17: str = '十七';break;
    case 18: str = '十八';break;
    case 19: str = '十九';break;
    case 20: str = '二十';break;
    case 30: str = '三十';break;
    case 40: str = '四十';break;
    case 50: str = '五十';break;
    case 60: str = '六十';break;
    case 70: str = '七十';break;
    case 80: str = '八十';break;
    case 90: str = '九十';break;
    case 100: str = '一百';break;
    default: str = '零';
  }
  return str;
}

function getChineseNumberAssembly(num) {
  num = parseInt(num, 10);
  if (!num) {
    return '零';
  }
  //get hundred
  let hdd = Math.floor(num % 1000 / 100);
  let strArr = [];
  if (hdd > 0) {
    strArr.push(getChineseNumber(hdd), '百');
  }
  let ten = num % 100;
  if (ten) {
    let tenStr;
    if (ten / 10 < 2) {
      tenStr = getChineseNumber(num % 100);
    } else {
      tenStr = getChineseNumber(Math.floor(ten / 10) * 10);
      if (ten % 10) {
        tenStr += getChineseNumber(ten % 10);
      }
    }
    strArr.push(tenStr);
  }
  return strArr.join(' ');
}
`;

const AUTHOR_FIELD = {
  label: 'author',
  type: 'text',
  options: [
    'liwei',
    'heludan'
  ],
  handle: (state, value) => state.author = value
}

const FIELDS = [
  AUTHOR_FIELD
];

function init() {
  const state = {};
  const app = document.querySelector('#app');
  const layout = new Layout(state, FIELDS);
  app.appendChild(layout.elem);
}

class Layout {
  
  constructor(store, fields) {
    this.store = store;
    const inputs = fields.map(field => this.initField(field));
    this.elem = document.createElement('div');
    this.elem.appendChild(...inputs);
  }

  initField(fieldConfig) {
    const field = new SingleField(fieldConfig);
    field.on('input', e => console.log(e));
    return field.elem;
  }

}

class EventEmmiter {
  constructor() {
    this.eventCallbackMaps = {};
  }

  on(eventName, callback) {
    if (!Reflect.has(this.eventCallbackMaps, eventName)) {
      this.eventCallbackMaps[eventName] = [];
    }

    this.eventCallbackMaps[eventName].push(callback);
  }

  trigger(eventName, ...rest) {
    if (!Reflect.has(this.eventCallbackMaps, eventName)) {
      return;
    }

    this.eventCallbackMaps[eventName].forEach(callback => callback(...rest));
  }
}

class Field extends EventEmmiter {
  constructor(config) {
    super();
    this.config = config;
    this._value = this.initValue();
    this.elem = this.createDom();
  }

  initValue() {
    return '';
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.trigger('input', this._value);
  }

  createDom() {
    return null;
  }

}

class SingleField extends Field {

  createDom() {
    const elem = strToDom(`
      <div class='form-field'>
        <label>${this.config.label}</label>
        <input type='text' />
      </div>
    `);

    const input = elem.querySelector('input');
    input.addEventListener('input', e => {
      let value = e.target.value;
      this.value = value;
    });
    return elem;
  }
}

class SelectField extends Field {
  initValue() {
    return {};
  }

  createDom() {

  }
}

class CodeField {
}

class ConfigModel {
  setOption() {
    
  }
}

init();