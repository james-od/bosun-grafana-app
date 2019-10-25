'use strict';

System.register(['app/plugins/sdk', './css/query-editor.css!'], function (_export, _context) {
  "use strict";

  var QueryCtrl, _createClass, BosunDatasourceQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('BosunDatasourceQueryCtrl', BosunDatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(BosunDatasourceQueryCtrl, _QueryCtrl);

        function BosunDatasourceQueryCtrl($scope, $injector, $sce, uiSegmentSrv) {
          _classCallCheck(this, BosunDatasourceQueryCtrl);

          var _this = _possibleConstructorReturn(this, (BosunDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(BosunDatasourceQueryCtrl)).call(this, $scope, $injector, $sce));

          _this.scope = $scope;
          _this.sce = $sce
          _this.queryHelper = {};
          _this.uiSegmentSrv = uiSegmentSrv;
          _this.target.expandHelper = 0;
          _this.target.target = _this.target.target || 'Bosun Query';
          _this.suggestMetrics = _this.suggestMetrics.bind(_this);
          _this.addSuggest = _this.addSuggest.bind(_this);
          _this.labelFromUnit = _this.labelFromUnit.bind(_this);
          _this.metricInfo = _this.metricInfo.bind(_this);
          _this.suggestQuery = _this.suggestQuery.bind(_this);
          _this.suggestTagValues = _this.suggestTagValues.bind(_this);
          _this.getSubstitutedFinalQuery = _this.getSubstitutedFinalQuery.bind(_this);
          _this.addNewVariable = _this.addNewVariable.bind(_this);
          _this.addNewVariableQ = _this.addNewVariableQ.bind(_this);
          _this.getMetricSuggestions = _this.getMetricSuggestions.bind(_this);
          _this.buildQueryVariable = _this.buildQueryVariable.bind(_this);
          _this.filterTypes = ["Group By", "Filter"];
          _this.scope.variables = {};
          _this.scope.aggOptions = [{text: 'avg'}, {text: 'count'}, {text: 'dev'}, {text: 'diff'}, {text: 'ep50r3'}, {text: 'ep50r7'}, {text: 'ep75r3'}, {text: 'ep75r7'}, {text: 'ep90r3'}, {text: 'ep90r7'}, {text: 'ep95r3'}, {text: 'ep95r7'}, {text: 'ep99r3'}, {text: 'ep99r7'}, {text: 'ep999r3'}, {text: 'ep999r7'}, {text: 'first'}, {text: 'last'}, {text: 'median'}, {text: 'mimmin'}, {text: 'mimmax'}, {text: 'min'}, {text: 'max'}, {text: 'mult'}, {text: 'none'}, {text: 'p50'}, {text: 'p75'}, {text: 'p90'}, {text: 'p95'}, {text: 'p99'}, {text: 'p999'}, {text: 'pfsum'}, {text: 'sum'}, {text: 'zimsum'}];
          _this.scope.fillPolicies = [{text: 'none'}, {text: 'nan'}, {text: 'null'}, {text: 'zero'}];
          _this.scope.queryFunctions = [
            {func: 'q', type:'seriesSet', args:{'query': 'string', 'startDuration': 'string', 'endDuration': 'string'}},
            {func: 'band', type:'seriesSet', args:{'query': 'string', 'duration': 'string', 'period': 'string', 'num': 'scalar'}},
            {func: 'over', type:'seriesSet', args:{'query': 'string', 'duration': 'string', 'period': 'string', 'num': 'scalar'}},
            {func: 'shiftBand', type:'seriesSet', args:{'query': 'string', 'duration': 'string', 'period': 'string', 'num': 'scalar'}},
            {func: 'change', type:'numberSet', args:{'query': 'string', 'startDuration': 'string', 'endDuration': 'string'}},
            {func: 'count', type:'scalar', args:{'query': 'string', 'startDuration': 'string', 'endDuration': 'string'}},
            {func: 'window', type:'seriesSet', args:{'query': 'string', 'duration': 'string', 'period': 'string', 'num': 'scalar', 'funcName': 'string'}},
          ];
          _this.scope.suggestions = [];
          _this.scope.varCounter = 0;
          _this.scope.finalQuery = "";
          return _this;
        }

        _createClass(BosunDatasourceQueryCtrl, [{
          key: 'suggestMetrics',
          value: function suggestMetrics(metric, callback) {
            return this.datasource._metricsStartWith(metric).then(callback);
          }
        }, {
          key: 'metricInfo',
          value: function metricInfo() {
            var _this2 = this;

            return this.datasource._tagKeysForMetric(this.queryHelper.metric).then(function (tagKeys) {
              _this2.datasource.q.all(_.map(tagKeys, function (tagKey) {
                return _this2.datasource._tagValuesForMetricAndTagKey(_this2.queryHelper.metric, tagKey).then(function (tagValues) {
                  return { key: tagKey, value: tagValues };
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
          key: 'suggestTagValues',
          value: function suggestTagValues(key, callback) {
            return this.queryHelper.tagKeysToValues[key].then(callback);
          }
        }, {
          key: 'labelFromUnit',
          value: function labelFromUnit() {
            if (this.panelCtrl.panel.type === "graph") {
              this.panelCtrl.panel.yaxes[0].label = this.queryHelper.unit;
            }
            if (this.panelCtrl.panel.type === "singlestat") {
              this.panelCtrl.panel.postfix = " " + this.queryHelper.unit;
            }
          }
        }, {
          key: 'suggestQuery',
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
          key: 'onChangeInternal',
          value: function onChangeInternal() {
            console.log("HI")
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'getMetricSuggestions',
          value: function getMetricSuggestions(typeahead) {
            var request = new Request('http://localhost:8010/proxy/suggest?type=metrics&q='.concat(typeahead));

            var the_scope = this.scope
            var req = fetch(request).then(function(response) {
              console.log(request)
              console.log(response)
              // Convert to JSON
              return response.json();
            }).then(function(j) {
              the_scope.suggestions = j;
            }).catch(function(error) {
              console.log('Request failed', error)
            });
            this.panelCtrl.refresh(); // Asks the panel to refresh data
            return req
          }
        }, {
          key: 'getSubstitutedFinalQuery',
          value: function getSubstitutedFinalQuery(finalQuery) {
            //Dictionary doesn't guarantee ordering, so convert to array and sort by key
            var values = new Array();
            for (var id in this.scope.variables) {
              values.push(this.scope.variables[id]);
            }
            values.sort()
            values = values.reverse()

            console.log("value are")
            console.log(values)

            var the_scope = this

            var substitutedFinalQuery = finalQuery
            values.forEach(function(value) {
              console.log("for value: ")
              console.log(value)
              if(value.type == "variable") {
                console.log("type is variable")

                if (value["name"] && value["name"].startsWith("$")) {
                  if (value["value"] == undefined) {
                    substitutedFinalQuery = substitutedFinalQuery.split(value["name"]).join("");
                  } else {
                    substitutedFinalQuery = substitutedFinalQuery.split(value["name"]).join(value["value"]);
                  }
                }
                console.log(substitutedFinalQuery)
              }
              if(value.type == "queryVariable") {
                console.log("type is query")
                console.log(value.value)
                console.log(the_scope.buildQueryVariable(value))
                substitutedFinalQuery = substitutedFinalQuery.split(value.value["queryVariableName"]).join(the_scope.buildQueryVariable(value));
                console.log(substitutedFinalQuery)
              }
            });
            return substitutedFinalQuery;
          }
        }, {
          key: 'updateFinalQuery',
          value: function updateFinalQuery(finalQuery) {
            this.scope.finalQuery = finalQuery;
            console.log(this.getSubstitutedFinalQuery(finalQuery))
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'addVariableValue',
          value: function addVariableValue(inputValue, id) {
            console.log(this.scope.variables[id])
            if(this.scope.variables[id]){
              this.scope.variables[id]["value"] = inputValue;
            }else{
              console.log("Oh no, id doesn't exist")
            }
            console.log(this.scope.variables)
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'buildQueryVariable',
          value: function buildQueryVariable(parameterObject) {

            // [query function]("[agg]:[downsample_time]-[downsample_agg]-[fill_policy]:[conversion flag e.g rate]:[metric]{}{[tag=value for every desired tag]}", "[each query param]")

            var params = parameterObject.value
            var constructedQuery = ""
            if(!params){
              return ""
            }
            if(params["queryFunction"]){
              constructedQuery = constructedQuery + params["queryFunction"] + '("'
            }else{
              console.log("Missing query function")
              return ""
            }
            if(params["queryAgg"]){
              constructedQuery = constructedQuery + params["queryAgg"] + ":"
            }else{
              console.log("Missing query aggregator")
              return ""
            }
            if(params["downsampleTime"]){
              constructedQuery = constructedQuery + params["downsampleTime"]
              if(params["downsampleAgg"]){
                constructedQuery = constructedQuery + "-" + params["downsampleAgg"]
              }else{
                console.log("Missing downsample agg")
              }
              if(params["fillPolicy"]){
                constructedQuery = constructedQuery + "-" + params["fillPolicy"]
              }else{
                console.log("Missing fillPolicy")
              }
            }else{
              console.log("Missing downsample time")
            }
            if(params["conversionFlag"]){
              constructedQuery = constructedQuery + ":" + params["conversionFlag"]
            }else{
              console.log("Missing conversionFlag")
            }
            if(params["metric"]){
              constructedQuery = constructedQuery + ":" + params["metric"] + "{"
            }else{
              console.log("Missing metric")
              return ""
            }
            if(params["metricTags"]){
              constructedQuery = constructedQuery + params["metricTags"] + "}"
            }else{
              console.log("Missing metric tags")
              constructedQuery = constructedQuery + "}"
            }
            if(params["tagsAndValues"]){
              constructedQuery = constructedQuery + "{" + params["tagsAndValues"] + '}"'
            }else{
              console.log("Missing tags")
              constructedQuery = constructedQuery + '{}"'
            }
            if(params["startDuration"]){
              constructedQuery = constructedQuery + ', "' + params["startDuration"] + '"'
            }
            if(params["endDuration"]){
              constructedQuery = constructedQuery + ', "' + params["endDuration"] + '"'
            }
            if(params["duration"]){
              constructedQuery = constructedQuery + ', "' + params["duration"] + '"'
            }
            if(params["period"]){
              constructedQuery = constructedQuery + ', "' + params["period"] + '"'
            }
            if(params["num"]){
              constructedQuery = constructedQuery + ', "' + params["num"] + '"'
            }
            if(params["funcName"]){
              constructedQuery = constructedQuery + ', "' + params["funcName"] + '"'
            }
            constructedQuery = constructedQuery + ")"
            console.log("COntstructed query is:")
            console.log(constructedQuery)
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
            return constructedQuery;
          }
        }, {
          key: 'addQueryVariableParameter',
          value: function addQueryVariableParameter(inputType, inputValue, id) {
            console.log("addQueryVariableParameter")
            if(this.scope.variables[id]){
              if(!this.scope.variables[id]["value"]){
                this.scope.variables[id]["value"] = {}
              }
              this.scope.variables[id]["value"][inputType] = inputValue;
            }else{
              console.log("Oh no, id doesn't exist")
            }
            console.log(this.scope.variables)
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'addVariableName',
          value: function addVariableName(inputName, id) {
            console.log(this.scope.variables[id])
            if(this.scope.variables[id]){
              this.scope.variables[id]["name"] = inputName;
            }else{
              console.log("Oh no, id doesn't exist")
            }
            console.log(this.scope.variables)
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'addNewVariable',
          value: function addNewVariable() {
            console.log(this.scope)
            this.scope.variables[this.scope.varCounter] = {type: 'variable'};
            this.scope.varCounter += 1;
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'addNewVariableQ',
          value: function addNewVariableQ() {
            console.log(this.scope)
            this.scope.variables[this.scope.varCounter] = {type: 'queryVariable'};
            this.scope.varCounter += 1;
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'substituteVariables',
          value: function substituteVariables(finalQuery) {
            console.log(this.variables)
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'addSuggest',
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

      _export('BosunDatasourceQueryCtrl', BosunDatasourceQueryCtrl);

      BosunDatasourceQueryCtrl.templateUrl = 'datasource/partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
