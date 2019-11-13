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
          key: "buildWithDefaultOrdering",
          value: function buildWithDefaultOrdering(variables, values) {
            for (var id in variables) {
              if (variables.hasOwnProperty(id)) {
                variables[id]["id"] = id;
                values.push(variables[id]);
              }
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
            console.log(controller); //Dictionary doesn't guarantee ordering, so convert to array and sort by key

            var orderedVariablesList = [];
            var variables = controller.target.variables;
            var variableOrder = controller.target.variableOrder;
            var variableOrderLength = variableOrder.length;

            if (variableOrderLength) {
              this.buildWithProvidedOrdering(variableOrderLength, variables, variableOrder, orderedVariablesList);
            } else {
              this.buildWithDefaultOrdering(variables, orderedVariablesList);
            }

            orderedVariablesList.sort(); //Work upwards

            orderedVariablesList = orderedVariablesList.reverse();
            var the_service = this;
            var substitutedFinalQuery = finalQuery;
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
                substitutedFinalQuery = the_service.substituteVariable(substitutedFinalQuery, value["inputValue"], the_service.buildQueryVariable(value, value.id, controller));
              }
            });
            controller.target.subbedQuery = substitutedFinalQuery;
            return substitutedFinalQuery;
          }
        }, {
          key: "addQueryArg",
          value: function addQueryArg(constructedQuery, queryFunction, queryVariable, arg) {
            if (queryFunction === "q" || queryFunction === "change" || queryFunction === "count") {
              if (arg !== "startDuration" && arg !== "endDuration") {
                return constructedQuery;
              }
            }

            if (queryFunction === "band" || queryFunction === "over" || queryFunction === "shiftBand") {
              if (arg !== "duration" && arg !== "period" && arg !== "num") {
                return constructedQuery;
              }
            }

            if (queryFunction === "window") {
              if (arg !== "duration" && arg !== "period" && arg !== "num" && arg !== "funcName") {
                return constructedQuery;
              }
            }

            if (queryVariable[arg]) {
              if (arg === "num") {
                constructedQuery += ', ' + queryVariable[arg];
              } else {
                constructedQuery += ', "' + queryVariable[arg] + '"';
              }
            }

            return constructedQuery;
          }
        }, {
          key: "buildQueryVariable",
          value: function buildQueryVariable(queryVariable, id, controller) {
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

            if (controller.target.grouptagBoxes[id]) {
              var onFirstTag = true;

              for (var tagMapping in controller.target.grouptagBoxes[id]) {
                if (controller.target.grouptagBoxes[id].hasOwnProperty(tagMapping)) {
                  if (!onFirstTag) {
                    constructedQuery += ",";
                  } else {
                    onFirstTag = false;
                  }

                  constructedQuery += controller.target.grouptagBoxes[id][tagMapping]["key"] + "=" + controller.target.grouptagBoxes[id][tagMapping]["value"];
                }
              }
            }

            constructedQuery += "}";

            if (controller.target.filtertagBoxes[id]) {
              var onFirstTag = true;
              constructedQuery += "{";

              for (var tagMapping in controller.target.filtertagBoxes[id]) {
                if (controller.target.filtertagBoxes[id].hasOwnProperty(tagMapping)) {
                  if (!onFirstTag) {
                    constructedQuery += ",";
                  } else {
                    onFirstTag = false;
                  }

                  constructedQuery += controller.target.filtertagBoxes[id][tagMapping]["key"] + "=" + controller.target.filtertagBoxes[id][tagMapping]["value"];
                }
              }

              constructedQuery += '}"';
            } else {
              constructedQuery += '{}"';
            }

            var the_service = this;
            var queryArgs = ["startDuration", "endDuration", "duration", "period", "funcName", "num"];
            queryArgs.forEach(function (arg) {
              constructedQuery = the_service.addQueryArg(constructedQuery, queryVariable["queryFunction"], queryVariable, arg);
            });
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
