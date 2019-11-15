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
        mocked_this.target = {
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
        mocked_this.target = {
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
        mocked_this.target = {
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
      test('Complex substitutions', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.target = {
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
              inputValue: "$q",
              queryFunction: "q",
              metric: "example.metric",
              queryAgg: "avg",
              downsampleTime: "$time",
              downsampleAgg: "avg",
              endDuration: "2h",
              startDuration: "$time"
            }
          },
          variableOrder: [],
          grouptagBoxes: {},
          filtertagBoxes: {
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
      test('Flags', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.target = {
          variables: {
            0: {
              type: "queryVariable",
              inputValue: "$q",
              queryFunction: "q",
              flags: "rate{counter,,1}",
              metric: "example.metric",
              queryAgg: "avg",
              downsampleTime: "$time",
              downsampleAgg: "avg",
              endDuration: "2h",
              startDuration: "$time"
            }
          },
          variableOrder: [],
          grouptagBoxes: {},
          filtertagBoxes: {}
        };
        expect(qbs.substituteFinalQuery("$q", mocked_this)).toBe("q(\"avg:$time-avg:rate{counter,,1}:example.metric{}{}\", \"$time\", \"2h\")");
      });
      test('reordered complex substitution', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.target = {
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
              inputValue: "$q",
              queryFunction: "q",
              metric: "example.metric",
              queryAgg: "avg",
              downsampleTime: "$time",
              downsampleAgg: "avg",
              endDuration: "2h",
              startDuration: "$time"
            }
          },
          //Simpler than trying to mock HTMLCollection
          variableOrder: [{
            "id": 0
          }, {
            "id": 2
          }, {
            "id": 1
          }],
          grouptagBoxes: {},
          filtertagBoxes: {
            2: {
              0: {
                key: "tagName",
                value: "$tagValue"
              }
            }
          }
        };
        expect(qbs.substituteFinalQuery("$q", mocked_this)).toBe("q(\"avg:1h-avg:example.metric{}{tagName=$tagValue}\", \"1h\", \"2h\")");
      });
      test('error case - query function not set', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.target = {
          variables: {
            0: {
              type: "queryVariable",
              inputValue: "$q",
              queryFunction: undefined,
              metric: "example.metric",
              queryAgg: "avg",
              downsampleTime: "$time",
              downsampleAgg: "avg",
              endDuration: "2h",
              startDuration: "$time"
            }
          },
          //Simpler than trying to mock HTMLCollection
          variableOrder: []
        };

        try {
          qbs.substituteFinalQuery("$q", mocked_this);
        } catch (e) {
          expect(e.message).toBe("Query function not set");
        }
      });
      test('query types with `num` arg are built correctly', function () {
        var qbs = new QueryBuilderService();
        var myMock = jest.fn();
        var mocked_this = new myMock();
        mocked_this.target = {
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
              inputValue: "$q",
              queryFunction: "over",
              metric: "example.metric",
              queryAgg: "avg",
              downsampleTime: "$time",
              downsampleAgg: "avg",
              duration: "7d",
              num: "3",
              period: "period"
            }
          },
          variableOrder: [],
          grouptagBoxes: {},
          filtertagBoxes: {
            2: {
              0: {
                key: "tagName",
                value: "$tagValue"
              }
            }
          }
        };
        expect(qbs.substituteFinalQuery("$q", mocked_this)).toBe("over(\"avg:1h-avg:example.metric{}{tagName=hello}\", \"7d\", \"period\", 3)");
      });
    }
  };
});
//# sourceMappingURL=queryBuilderService.js.map
