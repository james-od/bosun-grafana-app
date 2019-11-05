"use strict";

System.register(["./../queryBuilderService"], function (_export, _context) {
  "use strict";

  var QueryBuilderService;
  return {
    setters: [function (_queryBuilderService) {
      QueryBuilderService = _queryBuilderService.QueryBuilderService;
    }],
    execute: function () {
      test('simple substitution in final query', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.scope = {
          variables: {
            0: {
              type: "variable",
              inputName: "$a",
              inputValue: "1"
            }
          },
          variableOrder: []
        };
        expect(qbs.substituteFinalQuery("$a", mocked_this)).toBe("1");
      });
      test('multiple simple substitutions in final query', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.scope = {
          variables: {
            0: {
              type: "variable",
              inputName: "$a",
              inputValue: "1"
            },
            1: {
              type: "variable",
              inputName: "$b",
              inputValue: "2"
            },
            2: {
              type: "variable",
              inputName: "$c",
              inputValue: "3"
            }
          },
          variableOrder: []
        };
        expect(qbs.substituteFinalQuery("$a$b$c", mocked_this)).toBe("123");
      });
      test('multiple nested substitutions', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.scope = {
          variables: {
            0: {
              type: "variable",
              inputName: "$a",
              inputValue: "1"
            },
            1: {
              type: "variable",
              inputName: "$b",
              inputValue: "$a"
            },
            2: {
              type: "variable",
              inputName: "$c",
              inputValue: "$a$b"
            }
          },
          variableOrder: []
        };
        expect(qbs.substituteFinalQuery("$c", mocked_this)).toBe("11");
      });
      test('reordered simple substitutions', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.scope = {
          variables: {
            0: {
              type: "variable",
              inputName: "$time",
              inputValue: "1h"
            },
            1: {
              type: "variable",
              inputName: "$tagValue",
              inputValue: "hello"
            },
            2: {
              type: "queryVariable",
              value: {
                queryVariableName: "$q",
                queryFunction: "q",
                metric: "example.metric",
                queryAgg: "avg",
                downsampleTime: "$time",
                downsampleAgg: "avg",
                endDuration: "2h",
                startDuration: "$time"
              }
            }
          },
          variableOrder: [],
          tagBoxes: {
            2: {
              0: {
                key: "tagName",
                value: "$tagValue"
              }
            }
          }
        };
        expect(qbs.substituteFinalQuery("$q", mocked_this)).toBe("q(\"avg:1h-avg:example.metric{}{tagName=hello}\", \"1h\", \"2h\")");
      });
    }
  };
});
//# sourceMappingURL=queryBuilderService.js.map
