const JS_TEMPLATE_CONFIG = `
  /**
   * create by liwei on 2020-11-17
   */
  'use strict';

  const schema = {
    keywordsCN: {
      from: 'abstract.keywords',
      operation: {
        name: 'getKeywordsCNStr',
        options: {
          separator: '；'
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
          separator: '; '
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
                    replace: 'myGetLevel1HeadingPrefix'
                  }, {
                    name: 'getLevel2HeadingPrefix',
                    replace: 'myGetLevel2HeadingPrefix'
                  }, {
                    name: 'getLevel3HeadingPrefix',
                    replace: 'myGetLevel3HeadingPrefix'
                  }, {
                    name: 'getLevel4HeadingPrefix',
                    replace: 'myGetLevel4HeadingPrefix'
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
    }
  };

  module.exports = {
    schema,
    myGetLevel1HeadingPrefix,
    myGetLevel2HeadingPrefix,
    myGetLevel3HeadingPrefix,
    myGetLevel4HeadingPrefix
  };
`

function createPreviewEditor() {
  const lines = JS_TEMPLATE_CONFIG.SCHEMA.split('\n');
  const lineElems = lines.map(line => {

    const elem = strToDom(`
      <div class='line'>${line.replace(/\s/g, '&nbsp;')}</div>
    `);
    return elem;
  });
  const area = document.createElement('div');
  lineElems.forEach(lineElem => area.appendChild(lineElem));
  document.body.appendChild(area);
}

createPreviewEditor();