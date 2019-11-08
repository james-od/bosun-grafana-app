"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var QueryBuilderService;

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

  return {
    setters: [],
    execute: function () {
      _export("QueryBuilderService", QueryBuilderService = function () {
        function QueryBuilderService() {
          _classCallCheck(this, QueryBuilderService);
        }

        _createClass(QueryBuilderService, [{
          key: "substituteFinalQuery",
          value: function substituteFinalQuery(finalQuery, _this) {
            //Dictionary doesn't guarantee ordering, so convert to array and sort by key
            var values = new Array();

            if (_this.scope.variableOrder.length) {
              for (var i = 0; i < _this.scope.variableOrder.length; i++) {
                _this.target.variables[_this.scope.variableOrder[i].id]["id"] = _this.scope.variableOrder[i].id;
                values.push(_this.target.variables[_this.scope.variableOrder[i].id]);
              }
            } else {
              for (var id in _this.target.variables) {
                if (_this.target.variables.hasOwnProperty(id)) {
                  _this.target.variables[id]["id"] = id;
                  values.push(_this.target.variables[id]);
                }
              }
            }

            values.sort(); //Work upwards

            values = values.reverse();
            var the_service = this;
            var substitutedFinalQuery = finalQuery;
            values.forEach(function (value) {
              if (value.type == "variable") {
                if (value["inputName"] && value["inputName"].startsWith("$")) {
                  if (value["inputValue"] == undefined) {
                    substitutedFinalQuery = substitutedFinalQuery.split(value["inputName"]).join("");
                  } else {
                    substitutedFinalQuery = substitutedFinalQuery.split(value["inputName"]).join(value["inputValue"]);
                  }
                }
              }

              if (value.type == "queryVariable") {
                substitutedFinalQuery = substitutedFinalQuery.split(value["inputValue"]).join(the_service.buildQueryVariable(value, value.id, _this));
              }
            });
            _this.scope.subbedQuery = substitutedFinalQuery;
            return substitutedFinalQuery;
          }
        }, {
          key: "buildQueryVariable",
          value: function buildQueryVariable(queryVariable, id, _this) {
            console.log(queryVariable);
            console.log(id);
            console.log(_this.scope);
            var constructedQuery = "";

            if (!queryVariable) {
              throw new ReferenceError("No query parameters found");
            }

            if (queryVariable["queryFunction"]) {
              constructedQuery += queryVariable["queryFunction"] + '("';
            } else {
              throw new ReferenceError("Query function not set");
            }

            if (queryVariable["queryAgg"]) {
              constructedQuery += queryVariable["queryAgg"] + ":";
            } else {
              throw new ReferenceError("Query aggregator not set");
            }

            if (queryVariable["downsampleTime"]) {
              constructedQuery += queryVariable["downsampleTime"];

              if (queryVariable["downsampleAgg"]) {
                constructedQuery += "-" + queryVariable["downsampleAgg"];
              }

              if (queryVariable["fillPolicy"]) {
                constructedQuery += "-" + queryVariable["fillPolicy"];
              }
            }

            if (queryVariable["conversionFlag"]) {
              constructedQuery += ":" + queryVariable["conversionFlag"];
            }

            if (queryVariable["metric"]) {
              constructedQuery += ":" + queryVariable["metric"] + "{";
            } else {
              throw new ReferenceError("Query metric not set");
            }

            if (queryVariable["metricTags"]) {
              constructedQuery += queryVariable["metricTags"];
            }

            constructedQuery += "}";

            if (_this.target.tagBoxes[id]) {
              var onFirstTag = true;
              constructedQuery += "{";

              for (var tagMapping in _this.target.tagBoxes[id]) {
                if (_this.target.tagBoxes[id].hasOwnProperty(tagMapping)) {
                  if (!onFirstTag) {
                    constructedQuery += ", ";
                  } else {
                    onFirstTag = false;
                  }

                  constructedQuery += _this.target.tagBoxes[id][tagMapping]["key"] + "=" + _this.target.tagBoxes[id][tagMapping]["value"];
                }
              }

              constructedQuery += '}"';
            } else {
              constructedQuery += '{}"';
            }

            if (queryVariable["startDuration"]) {
              constructedQuery += ', "' + queryVariable["startDuration"] + '"';
            }

            if (queryVariable["endDuration"]) {
              constructedQuery += ', "' + queryVariable["endDuration"] + '"';
            }

            if (queryVariable["duration"]) {
              constructedQuery += ', "' + queryVariable["duration"] + '"';
            }

            if (queryVariable["period"]) {
              constructedQuery += ', "' + queryVariable["period"] + '"';
            }

            if (queryVariable["num"]) {
              constructedQuery += ', ' + queryVariable["num"];
            }

            if (queryVariable["funcName"]) {
              constructedQuery += ', "' + queryVariable["funcName"] + '"';
            }

            constructedQuery += ")";
            console.log(constructedQuery);
            return constructedQuery;
          }
        }]);

        return QueryBuilderService;
      }());

      _export("QueryBuilderService", QueryBuilderService);
    }
  };
});
//# sourceMappingURL=queryBuilderService.js.map
