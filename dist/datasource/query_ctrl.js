"use strict";

System.register(["app/plugins/sdk", "./css/query-editor.css!", "./../external/Sortable.min"], function (_export, _context) {
  "use strict";

  var QueryCtrl, Sortable, BosunDatasourceQueryCtrl;

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
    }],
    execute: function () {
      _export("BosunDatasourceQueryCtrl", BosunDatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(BosunDatasourceQueryCtrl, _QueryCtrl);

        function BosunDatasourceQueryCtrl($scope, $injector, uiSegmentSrv, $sce) {
          var _this;

          _classCallCheck(this, BosunDatasourceQueryCtrl);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(BosunDatasourceQueryCtrl).call(this, $scope, $injector, $sce));
          _this.scope = $scope;
          _this.sce = $sce;
          _this.queryHelper = {};
          _this.uiSegmentSrv = uiSegmentSrv;
          _this.target.expandHelper = 0;
          _this.target.target = _this.target.target || 'Bosun Query';
          _this.suggestMetrics = _this.suggestMetrics.bind(_assertThisInitialized(_this));
          _this.addSuggest = _this.addSuggest.bind(_assertThisInitialized(_this));
          _this.labelFromUnit = _this.labelFromUnit.bind(_assertThisInitialized(_this));
          _this.metricInfo = _this.metricInfo.bind(_assertThisInitialized(_this));
          _this.suggestQuery = _this.suggestQuery.bind(_assertThisInitialized(_this));
          _this.suggestTagValues = _this.suggestTagValues.bind(_assertThisInitialized(_this));
          _this.getSubstitutedFinalQuery = _this.getSubstitutedFinalQuery.bind(_assertThisInitialized(_this));
          _this.addNewVariable = _this.addNewVariable.bind(_assertThisInitialized(_this));
          _this.addNewVariableQ = _this.addNewVariableQ.bind(_assertThisInitialized(_this));
          _this.getMetricSuggestions = _this.getMetricSuggestions.bind(_assertThisInitialized(_this));
          _this.buildQueryVariable = _this.buildQueryVariable.bind(_assertThisInitialized(_this));
          _this.addTagBox = _this.addTagBox.bind(_assertThisInitialized(_this));
          _this.setSortable = _this.setSortable.bind(_assertThisInitialized(_this));
          _this.filterTypes = ["Group By", "Filter"];
          _this.scope.variables = {};
          _this.scope.aggOptions = [{
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
          _this.scope.fillPolicies = [{
            text: 'none'
          }, {
            text: 'nan'
          }, {
            text: 'null'
          }, {
            text: 'zero'
          }];
          _this.scope.queryFunctions = [{
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
          _this.scope.suggestions = [];
          _this.scope.tagBoxes = {};
          _this.scope.varCounter = 0;
          _this.scope.tagBoxCounter = 0;
          _this.scope.finalQuery = "";
          return _this;
        }

        _createClass(BosunDatasourceQueryCtrl, [{
          key: "setSortable",
          value: function setSortable() {
            var el = document.getElementById('allVariables');
            var sortable = Sortable.create(el);
          }
        }, {
          key: "suggestMetrics",
          value: function suggestMetrics(metric, callback) {
            return this.datasource._metricsStartWith(metric).then(callback);
          }
        }, {
          key: "metricInfo",
          value: function metricInfo() {
            var _this2 = this;

            return this.datasource._tagKeysForMetric(this.queryHelper.metric).then(function (tagKeys) {
              _this2.datasource.q.all(_.map(tagKeys, function (tagKey) {
                return _this2.datasource._tagValuesForMetricAndTagKey(_this2.queryHelper.metric, tagKey).then(function (tagValues) {
                  return {
                    key: tagKey,
                    value: tagValues
                  };
                });
              })).then(function (tagKeysToValues) {
                tagKeysToValues = _.each(tagKeysToValues, function (v) {
                  v.filterType = "Group By";
                });
                _this2.queryHelper.tagKeysToValues = tagKeysToValues;
              });
            }).then(function () {
              return _this2.datasource._metricMetadata(_this2.queryHelper.metric).then(function (metadata) {
                _this2.queryHelper.rate = metadata.Rate;
                _this2.queryHelper.unit = metadata.Unit;
                _this2.queryHelper.desc = metadata.Desc;
              });
            }).then(function () {
              return _this2.suggestQuery();
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
            var _this3 = this;

            var metric = this.queryHelper.metric || "metric.goes.here";
            var selectedGroupByTags = [];
            var selectedFilterTags = [];

            _.each(this.queryHelper.tagKeysToValues, function (v) {
              if (v.selectedValue && v.selectedValue != "") {
                if (v.filterType === _this3.filterTypes[0]) {
                  selectedGroupByTags.push(v.key + "=" + v.selectedValue);
                }

                if (v.filterType === _this3.filterTypes[1]) {
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
            this.panelCtrl.refresh();
            return req;
          }
        }, {
          key: "getSubstitutedFinalQuery",
          value: function getSubstitutedFinalQuery(finalQuery) {
            //Dictionary doesn't guarantee ordering, so convert to array and sort by key
            var values = new Array();

            for (var id in this.scope.variables) {
              this.scope.variables[id]["id"] = id;
              values.push(this.scope.variables[id]);
            }

            values.sort();
            values = values.reverse();
            var the_scope = this;
            var substitutedFinalQuery = finalQuery;
            values.forEach(function (value) {
              if (value.type == "variable") {
                if (value["name"] && value["name"].startsWith("$")) {
                  if (value["value"] == undefined) {
                    substitutedFinalQuery = substitutedFinalQuery.split(value["name"]).join("");
                  } else {
                    substitutedFinalQuery = substitutedFinalQuery.split(value["name"]).join(value["value"]);
                  }
                }
              }

              if (value.type == "queryVariable") {
                substitutedFinalQuery = substitutedFinalQuery.split(value.value["queryVariableName"]).join(the_scope.buildQueryVariable(value, value.id));
              }
            });
            return substitutedFinalQuery;
          }
        }, {
          key: "updateFinalQuery",
          value: function updateFinalQuery(finalQuery) {
            this.scope.finalQuery = finalQuery;
            console.log(this.getSubstitutedFinalQuery(finalQuery));
            this.panelCtrl.refresh();
          }
        }, {
          key: "addVariableValue",
          value: function addVariableValue(inputValue, id) {
            if (this.scope.variables[id]) {
              this.scope.variables[id]["value"] = inputValue;
            } else {
              throw new ReferenceError("When trying to add value the requested variable id could not be found");
            }

            this.panelCtrl.refresh();
          }
        }, {
          key: "buildQueryVariable",
          value: function buildQueryVariable(parameterObject, id) {
            var $scope = this.scope;
            var params = parameterObject.value;
            var constructedQuery = "";

            if (!params) {
              throw new ReferenceError("No query parameters found");
            }

            if (params["queryFunction"]) {
              constructedQuery += params["queryFunction"] + '("';
            } else {
              throw new ReferenceError("Query function not set");
            }

            if (params["queryAgg"]) {
              constructedQuery += params["queryAgg"] + ":";
            } else {
              throw new ReferenceError("Query aggregator not set");
            }

            if (params["downsampleTime"]) {
              constructedQuery += params["downsampleTime"];

              if (params["downsampleAgg"]) {
                constructedQuery += "-" + params["downsampleAgg"];
              }

              if (params["fillPolicy"]) {
                constructedQuery += "-" + params["fillPolicy"];
              }
            }

            if (params["conversionFlag"]) {
              constructedQuery += ":" + params["conversionFlag"];
            }

            if (params["metric"]) {
              constructedQuery += ":" + params["metric"] + "{";
            } else {
              throw new ReferenceError("Query metric not set");
            }

            if (params["metricTags"]) {
              constructedQuery += params["metricTags"];
            }

            constructedQuery += "}";

            if ($scope.tagBoxes[id]) {
              var onFirstTag = true;
              constructedQuery += "{";

              for (var tagMapping in $scope.tagBoxes[id]) {
                if ($scope.tagBoxes[id].hasOwnProperty(tagMapping)) {
                  if (!onFirstTag) {
                    constructedQuery += ", ";
                  } else {
                    onFirstTag = false;
                  }

                  constructedQuery += $scope.tagBoxes[id][tagMapping]["key"] + "=" + $scope.tagBoxes[id][tagMapping]["value"];
                }
              }

              constructedQuery += '}"';
            } else {
              constructedQuery += '{}"';
            }

            if (params["startDuration"]) {
              constructedQuery += ', "' + params["startDuration"] + '"';
            }

            if (params["endDuration"]) {
              constructedQuery += ', "' + params["endDuration"] + '"';
            }

            if (params["duration"]) {
              constructedQuery += ', "' + params["duration"] + '"';
            }

            if (params["period"]) {
              constructedQuery += ', "' + params["period"] + '"';
            }

            if (params["num"]) {
              constructedQuery += ', "' + params["num"] + '"';
            }

            if (params["funcName"]) {
              constructedQuery += ', "' + params["funcName"] + '"';
            }

            constructedQuery += ")";
            this.panelCtrl.refresh();
            console.log(constructedQuery);
            return constructedQuery;
          }
        }, {
          key: "addQueryVariableParameter",
          value: function addQueryVariableParameter(inputType, inputValue, id) {
            if (this.scope.variables[id]) {
              if (!this.scope.variables[id]["value"]) {
                this.scope.variables[id]["value"] = {};
              }

              this.scope.variables[id]["value"][inputType] = inputValue;
            } else {
              throw new ReferenceError("Requested queryVariable id could not be found");
            }

            this.panelCtrl.refresh();
          }
        }, {
          key: "addVariableName",
          value: function addVariableName(inputName, id) {
            if (this.scope.variables[id]) {
              this.scope.variables[id]["name"] = inputName;
            } else {
              throw new ReferenceError("When trying to add name the requested variable id could not be found");
            }

            this.panelCtrl.refresh();
          }
        }, {
          key: "addNewVariable",
          value: function addNewVariable() {
            this.scope.variables[this.scope.varCounter] = {
              type: 'variable'
            };
            this.scope.varCounter += 1;
            this.setSortable();
            this.panelCtrl.refresh();
          }
        }, {
          key: "addNewVariableQ",
          value: function addNewVariableQ() {
            console.log(this.scope);
            this.scope.variables[this.scope.varCounter] = {
              type: 'queryVariable'
            };
            this.scope.varCounter += 1;
            this.setSortable();
            this.panelCtrl.refresh();
          }
        }, {
          key: "substituteVariables",
          value: function substituteVariables(finalQuery) {
            //TODO
            this.panelCtrl.refresh();
          }
        }, {
          key: "editTagBox",
          value: function editTagBox(queryId, tagId, input, type) {
            this.scope.tagBoxes[parseInt(queryId)][parseInt(tagId)][type] = input;
            this.panelCtrl.refresh();
          }
        }, {
          key: "addTagBox",
          value: function addTagBox(queryId) {
            if (!this.scope.tagBoxes[queryId]) {
              this.scope.tagBoxes[queryId] = {};
            }

            this.scope.tagBoxes[queryId][this.scope.tagBoxCounter] = {
              key: "",
              value: ""
            };
            this.scope.tagBoxCounter += 1;
            this.panelCtrl.refresh();
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

      BosunDatasourceQueryCtrl.templateUrl = 'datasource/partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
