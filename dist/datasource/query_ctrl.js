"use strict";

System.register(["app/plugins/sdk", "./css/query-editor.css!", "./../external/Sortable.min", "./queryBuilderService"], function (_export, _context) {
  "use strict";

  var QueryCtrl, Sortable, substituteFinalQuery, BosunDatasourceQueryCtrl;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}, function (_externalSortableMin) {
      Sortable = _externalSortableMin.default;
    }, function (_queryBuilderService) {
      substituteFinalQuery = _queryBuilderService.substituteFinalQuery;
    }],
    execute: function () {
      _export("BosunDatasourceQueryCtrl", BosunDatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(BosunDatasourceQueryCtrl, _QueryCtrl);

        function BosunDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
          var _this2;

          _classCallCheck(this, BosunDatasourceQueryCtrl);

          _this2 = _possibleConstructorReturn(this, _getPrototypeOf(BosunDatasourceQueryCtrl).call(this, $scope, $injector));
          _this2.scope = $scope;
          _this2.queryHelper = {};
          _this2.uiSegmentSrv = uiSegmentSrv;
          _this2.target.expandHelper = 0;
          _this2.target.target = _this2.target.target || 'Bosun Query';
          _this2.deleteVariable = _this2.deleteVariable.bind(_assertThisInitialized(_this2));
          _this2.suggestMetrics = _this2.suggestMetrics.bind(_assertThisInitialized(_this2));
          _this2.addSuggest = _this2.addSuggest.bind(_assertThisInitialized(_this2));
          _this2.labelFromUnit = _this2.labelFromUnit.bind(_assertThisInitialized(_this2));
          _this2.metricInfo = _this2.metricInfo.bind(_assertThisInitialized(_this2));
          _this2.suggestQuery = _this2.suggestQuery.bind(_assertThisInitialized(_this2));
          _this2.suggestTagValues = _this2.suggestTagValues.bind(_assertThisInitialized(_this2));
          _this2.addNewVariable = _this2.addNewVariable.bind(_assertThisInitialized(_this2));
          _this2.getMetricSuggestions = _this2.getMetricSuggestions.bind(_assertThisInitialized(_this2));
          _this2.addTagBox = _this2.addTagBox.bind(_assertThisInitialized(_this2));
          _this2.filterTypes = ["Group By", "Filter"];

          if (!_this2.target.variables) {
            _this2.target.variables = [];
          } else {
            _this2.target.variables = _.orderBy(_this2.target.variables, ['indexInUI']);
          }

          _this2.scope.aggOptions = [{
            text: 'avg'
          }, {
            text: 'count'
          }, {
            text: 'dev'
          }, {
            text: 'diff'
          }, {
            text: 'ep50r3'
          }, {
            text: 'ep50r7'
          }, {
            text: 'ep75r3'
          }, {
            text: 'ep75r7'
          }, {
            text: 'ep90r3'
          }, {
            text: 'ep90r7'
          }, {
            text: 'ep95r3'
          }, {
            text: 'ep95r7'
          }, {
            text: 'ep99r3'
          }, {
            text: 'ep99r7'
          }, {
            text: 'ep999r3'
          }, {
            text: 'ep999r7'
          }, {
            text: 'first'
          }, {
            text: 'last'
          }, {
            text: 'median'
          }, {
            text: 'mimmin'
          }, {
            text: 'mimmax'
          }, {
            text: 'min'
          }, {
            text: 'max'
          }, {
            text: 'mult'
          }, {
            text: 'none'
          }, {
            text: 'p50'
          }, {
            text: 'p75'
          }, {
            text: 'p90'
          }, {
            text: 'p95'
          }, {
            text: 'p99'
          }, {
            text: 'p999'
          }, {
            text: 'pfsum'
          }, {
            text: 'sum'
          }, {
            text: 'zimsum'
          }];
          _this2.scope.fillPolicies = [{
            text: 'none'
          }, {
            text: 'nan'
          }, {
            text: 'null'
          }, {
            text: 'zero'
          }];
          _this2.scope.queryFunctions = [{
            func: 'q',
            type: 'seriesSet',
            args: {
              'query': 'string',
              'startDuration': 'string',
              'endDuration': 'string'
            }
          }, {
            func: 'band',
            type: 'seriesSet',
            args: {
              'query': 'string',
              'duration': 'string',
              'period': 'string',
              'num': 'scalar'
            }
          }, {
            func: 'over',
            type: 'seriesSet',
            args: {
              'query': 'string',
              'duration': 'string',
              'period': 'string',
              'num': 'scalar'
            }
          }, {
            func: 'shiftBand',
            type: 'seriesSet',
            args: {
              'query': 'string',
              'duration': 'string',
              'period': 'string',
              'num': 'scalar'
            }
          }, {
            func: 'change',
            type: 'numberSet',
            args: {
              'query': 'string',
              'startDuration': 'string',
              'endDuration': 'string'
            }
          }, {
            func: 'count',
            type: 'scalar',
            args: {
              'query': 'string',
              'startDuration': 'string',
              'endDuration': 'string'
            }
          }, {
            func: 'window',
            type: 'seriesSet',
            args: {
              'query': 'string',
              'duration': 'string',
              'period': 'string',
              'num': 'scalar',
              'funcName': 'string'
            }
          }];
          _this2.scope.suggestions = [];

          if (!_this2.target.varCounter) {
            _this2.target.varCounter = 0;
          }

          if (!_this2.target.finalQuery) {
            if (_this2.target.expr) {
              _this2.target.finalQuery = _this2.target.expr;
              _this2.target.expr = "";
            } else {
              _this2.target.finalQuery = "";
            }
          }

          _this2.target.subbedQuery = "";

          if (!_this2.target.flags) {
            _this2.target.flags = "";
          }

          var _this = _assertThisInitialized(_this2);

          $(document).ready(function () {
            //DOM needs to load before element can be set as sortable
            setTimeout(function () {
              _this.setSortable();
            }, 1000);
          });

          try {
            _this2.updateFinalQuery(_this2.target.finalQuery);
          } catch (e) {
            console.log(e);
          }

          return _this2;
        }

        _createClass(BosunDatasourceQueryCtrl, [{
          key: "objectWithoutProperties",
          value: function objectWithoutProperties(obj, keys) {
            var target = {};

            for (var i in obj) {
              if (keys.indexOf(i) >= 0) continue;
              if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
              target[i] = obj[i];
            }

            return target;
          }
        }, {
          key: "htmlCollectionToListOfIds",
          value: function htmlCollectionToListOfIds(htmlCollection) {
            var ret = [];

            for (var i = 0; i < htmlCollection.length; i++) {
              ret.push(htmlCollection[i].id);
            }

            return ret;
          }
        }, {
          key: "getVariablesFromUI",
          value: function getVariablesFromUI() {
            return this.htmlCollectionToListOfIds(document.getElementById('allVariables').getElementsByTagName("li"));
          }
        }, {
          key: "ensureOrdering",
          value: function ensureOrdering(variables) {
            this.setSortable();
            var orderedListOfIds = this.getVariablesFromUI();

            for (var i = 0; i < variables.length; i++) {
              variables[i].indexInUI = orderedListOfIds.indexOf(variables[i].id.toString());
            }

            return _.orderBy(variables, ['indexInUI']);
          }
        }, {
          key: "setSortable",
          value: function setSortable() {
            var el = document.getElementById('allVariables');

            var _this = this;

            Sortable.create(el, {
              onUpdate: function onUpdate() {
                _this.target.variables = _this.ensureOrdering(_this.target.variables);
              }
            });
          }
        }, {
          key: "getMetricSuggestions",
          value: function getMetricSuggestions(typeahead) {
            if (!this.datasource.openTSDBUrl) {
              throw ReferenceError("Missing OpenTSDB URL");
            }

            var request = new Request(this.datasource.openTSDBUrl + "/suggest?type=metrics&q=" + typeahead);
            var the_scope = this.scope;
            var req = fetch(request).then(function (response) {
              return response.json();
            }).then(function (responseSuggestions) {
              the_scope.suggestions = responseSuggestions;
            })["catch"](function (error) {
              throw error;
            });
            return req;
          }
        }, {
          key: "deleteVariable",
          value: function deleteVariable(id) {
            //Angular keeps track of objects in ng-repeat, removing $$hashkey prevents issues with ordering after deleting.
            var tmp = [];

            for (var i = 0; i < this.target.variables.length; i++) {
              if (this.target.variables[i].id.toString() !== id.toString()) {
                tmp.push(this.objectWithoutProperties(this.target.variables[i], ["$$hashKey"]));
              }
            }

            this.target.variables = tmp;
          }
        }, {
          key: "deleteTag",
          value: function deleteTag(variableId, tagId, type) {
            delete this.target.variables[variableId][type + "tagBoxes"][tagId];
          }
        }, {
          key: "addNewVariable",
          value: function addNewVariable(type) {
            var variables = this.target.variables;
            var defaultVariable = {
              id: this.target.varCounter,
              type: type,
              startDuration: "$start",
              duration: "$start",
              downsampleTime: "$ds"
            };
            variables.push(defaultVariable);
            this.target.varCounter += 1;

            var _this = this; //timeout necessary as ng-repeat doesn't seem to provide a callback when updated


            setTimeout(function () {
              variables = _this.ensureOrdering(variables);
            }, 100);
          }
        }, {
          key: "addTagBox",
          value: function addTagBox(queryId, type) {
            var defaultTagBox = {
              key: "",
              value: "",
              editorClosed: false
            };
            var queryVariable = this.target.variables[queryId];

            if (!queryVariable[type + "tagBoxes"]) {
              queryVariable[type + "tagBoxes"] = {};
            }

            if (!queryVariable[type + "TagBoxCounter"]) {
              queryVariable[type + "TagBoxCounter"] = 0;
            }

            queryVariable[type + "tagBoxes"][queryVariable[type + "TagBoxCounter"]] = defaultTagBox;
            queryVariable[type + "TagBoxCounter"] += 1;
          }
        }, {
          key: "updateFinalQuery",
          value: function updateFinalQuery(finalQuery) {
            this.target.expr = substituteFinalQuery(finalQuery, this);
            this.panelCtrl.refresh();
            this.target.finalQuery = finalQuery;
            return substituteFinalQuery(finalQuery, this);
          }
        }, {
          key: "suggestMetrics",
          value: function suggestMetrics(metric, callback) {
            return this.datasource._metricsStartWith(metric).then(callback);
          }
        }, {
          key: "metricInfo",
          value: function metricInfo() {
            var _this3 = this;

            return this.datasource._tagKeysForMetric(this.queryHelper.metric).then(function (tagKeys) {
              _this3.datasource.q.all(_.map(tagKeys, function (tagKey) {
                return _this3.datasource._tagValuesForMetricAndTagKey(_this3.queryHelper.metric, tagKey).then(function (tagValues) {
                  return {
                    key: tagKey,
                    value: tagValues
                  };
                });
              })).then(function (tagKeysToValues) {
                tagKeysToValues = _.each(tagKeysToValues, function (v) {
                  v.filterType = "Group By";
                });
                _this3.queryHelper.tagKeysToValues = tagKeysToValues;
              });
            }).then(function () {
              return _this3.datasource._metricMetadata(_this3.queryHelper.metric).then(function (metadata) {
                _this3.queryHelper.rate = metadata.Rate;
                _this3.queryHelper.unit = metadata.Unit;
                _this3.queryHelper.desc = metadata.Desc;
              });
            }).then(function () {
              return _this3.suggestQuery();
            });
          }
        }, {
          key: "suggestTagValues",
          value: function suggestTagValues(key, callback) {
            return this.queryHelper.tagKeysToValues[key].then(callback);
          }
        }, {
          key: "labelFromUnit",
          value: function labelFromUnit() {
            if (this.panelCtrl.panel.type === "graph") {
              this.panelCtrl.panel.yaxes[0].label = this.queryHelper.unit;
            }

            if (this.panelCtrl.panel.type === "singlestat") {
              this.panelCtrl.panel.postfix = " " + this.queryHelper.unit;
            }
          }
        }, {
          key: "suggestQuery",
          value: function suggestQuery() {
            var _this4 = this;

            var metric = this.queryHelper.metric || "metric.goes.here";
            var selectedGroupByTags = [];
            var selectedFilterTags = [];

            _.each(this.queryHelper.tagKeysToValues, function (v) {
              if (v.selectedValue && v.selectedValue != "") {
                if (v.filterType === _this4.filterTypes[0]) {
                  selectedGroupByTags.push(v.key + "=" + v.selectedValue);
                }

                if (v.filterType === _this4.filterTypes[1]) {
                  selectedFilterTags.push(v.key + "=" + v.selectedValue);
                }
              }
            }, this);

            var rate = "";

            if (this.queryHelper.rate && this.queryHelper.rate == "counter") {
              rate = "rate{counter,,1}:";
            }

            this.queryHelper.suggestedQuery = "q(\"avg:$ds-avg:" + rate + metric + "{" + selectedGroupByTags.join(",") + "}" + "{" + selectedFilterTags.join(",") + "}" + "\", \"$start\", \"\")";
          }
        }, {
          key: "onChangeInternal",
          value: function onChangeInternal() {
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: "addSuggest",
          value: function addSuggest() {
            if (this.target.expr) {
              this.target.expr += "\n" + this.queryHelper.suggestedQuery;
            } else {
              this.target.expr = this.queryHelper.suggestedQuery;
            }
          }
        }]);

        return BosunDatasourceQueryCtrl;
      }(QueryCtrl));

      _export("BosunDatasourceQueryCtrl", BosunDatasourceQueryCtrl);

      _export("default", {
        BosunDatasourceQueryCtrl: BosunDatasourceQueryCtrl
      });

      BosunDatasourceQueryCtrl.templateUrl = 'datasource/partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
