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
          key: "buildWithProvidedOrdering",
          value: function buildWithProvidedOrdering(variableOrderLength, variables, variableOrder, values) {
            for (var i = 0; i < variableOrderLength; i++) {
              variables[variableOrder[i].id]["id"] = variableOrder[i].id;
              values.push(variables[variableOrder[i].id]);
            }
          }
        }, {
          key: "variableIsValid",
          value: function variableIsValid(value) {
            return value["inputName"] && value["inputName"].startsWith("$");
          }
        }, {
          key: "substituteVariable",
          value: function substituteVariable(queryString, matching, replacement) {
            return queryString.split(matching).join(replacement);
          }
        }, {
          key: "substituteFinalQuery",
          value: function substituteFinalQuery(finalQuery, controller) {
            console.log(controller); //Ensure ordered and work upwards
            //Copy to not affect ordering

            var orderedVariablesList = controller.target.variables.slice();
            orderedVariablesList.sort(function (a, b) {
              return a.indexInUI < b.indexInUI ? 1 : -1;
            });
            var the_service = this;
            var substitutedFinalQuery = finalQuery;
            var index = 0;
            orderedVariablesList.forEach(function (value) {
              if (value.type === "variable") {
                if (the_service.variableIsValid(value)) {
                  if (value["inputValue"] === undefined) {
                    substitutedFinalQuery = the_service.substituteVariable(substitutedFinalQuery, value["inputName"], "");
                  } else {
                    substitutedFinalQuery = the_service.substituteVariable(substitutedFinalQuery, value["inputName"], value["inputValue"]);
                  }
                }
              }

              if (value.type === "queryVariable") {
                substitutedFinalQuery = the_service.substituteVariable(substitutedFinalQuery, value["inputValue"], the_service.buildQueryVariable(orderedVariablesList, value, index, controller));
              }

              index += 1;
            });
            controller.target.subbedQuery = substitutedFinalQuery;
            return substitutedFinalQuery;
          }
        }, {
          key: "addQueryArg",
          value: function addQueryArg(queryVariable, arg) {
            if (queryVariable[arg]) {
              if (arg === "num") {
                return ', ' + queryVariable[arg];
              } else {
                return ', "' + queryVariable[arg] + '"';
              }
            } else {
              return ', ""';
            }
          }
        }, {
          key: "buildQueryVariable",
          value: function buildQueryVariable(orderedVariablesList, queryVariable, index, controller) {
            console.log(queryVariable);
            var constructedQuery = "";

            if (!queryVariable) {
              throw new ReferenceError("No query parameters found");
            }

            if (!queryVariable["queryFunction"]) {
              throw new ReferenceError("Query function not set");
            }

            if (!queryVariable["queryAgg"]) {
              throw new ReferenceError("Query aggregator not set");
            }

            if (!queryVariable["metric"]) {
              throw new ReferenceError("Query metric not set");
            }

            constructedQuery += queryVariable["queryFunction"] + '("';
            constructedQuery += queryVariable["queryAgg"] + ":";

            if (queryVariable["downsampleTime"]) {
              constructedQuery += queryVariable["downsampleTime"];

              if (queryVariable["downsampleAgg"]) {
                constructedQuery += "-" + queryVariable["downsampleAgg"];
              }

              if (queryVariable["fillPolicy"]) {
                constructedQuery += "-" + queryVariable["fillPolicy"];
              }
            } else {
              if (queryVariable["downsampleAgg"]) {
                constructedQuery += queryVariable["downsampleAgg"];
              }

              if (queryVariable["fillPolicy"]) {
                constructedQuery += "-" + queryVariable["fillPolicy"];
              }
            }

            if (queryVariable["conversionFlag"]) {
              constructedQuery += ":" + queryVariable["conversionFlag"];
            }

            if (queryVariable["flags"]) {
              constructedQuery += ":" + queryVariable["flags"];
            }

            if (queryVariable["downsampleTime"] || queryVariable["downsampleAgg"] || queryVariable["fillPolicy"]) {
              constructedQuery += ":";
            }

            constructedQuery += queryVariable["metric"] + "{";

            if (orderedVariablesList[index] && orderedVariablesList[index].grouptagBoxes) {
              var onFirstTag = true;

              for (var tagMapping in orderedVariablesList[index].grouptagBoxes) {
                if (orderedVariablesList[index].grouptagBoxes.hasOwnProperty(tagMapping)) {
                  if (!onFirstTag) {
                    constructedQuery += ",";
                  } else {
                    onFirstTag = false;
                  }

                  constructedQuery += orderedVariablesList[index].grouptagBoxes[tagMapping]["key"] + "=" + orderedVariablesList[index].grouptagBoxes[tagMapping]["value"];
                }
              }
            }

            constructedQuery += "}";

            if (orderedVariablesList[index] && orderedVariablesList[index].filtertagBoxes) {
              var onFirstTag = true;
              constructedQuery += "{";

              for (var tagMapping in orderedVariablesList[index].filtertagBoxes) {
                if (orderedVariablesList[index].filtertagBoxes.hasOwnProperty(tagMapping)) {
                  if (!onFirstTag) {
                    constructedQuery += ",";
                  } else {
                    onFirstTag = false;
                  }

                  constructedQuery += orderedVariablesList[index].filtertagBoxes[tagMapping]["key"] + "=" + orderedVariablesList[index].filtertagBoxes[tagMapping]["value"];
                }
              }

              constructedQuery += '}"';
            } else {
              constructedQuery += '{}"';
            }

            var queryVar = queryVariable["queryFunction"];

            if (queryVar === "q" || queryVar === "change" || queryVar === "count") {
              constructedQuery += this.addQueryArg(queryVariable, "startDuration");
              constructedQuery += this.addQueryArg(queryVariable, "endDuration");
            }

            if (queryVar === "band" || queryVar === "over" || queryVar === "shiftBand") {
              constructedQuery += this.addQueryArg(queryVariable, "duration");
              constructedQuery += this.addQueryArg(queryVariable, "period");
              constructedQuery += this.addQueryArg(queryVariable, "num");
            }

            if (queryVar === "window") {
              constructedQuery += this.addQueryArg(queryVariable, "duration");
              constructedQuery += this.addQueryArg(queryVariable, "period");
              constructedQuery += this.addQueryArg(queryVariable, "num");
              constructedQuery += this.addQueryArg(queryVariable, "funcName");
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
