export class QueryBuilderService {

  buildWithProvidedOrdering(variableOrderLength, variables, variableOrder, values) {
    for (var i = 0; i < variableOrderLength; i++) {
      variables[variableOrder[i].id]["id"] = variableOrder[i].id;
      values.push(variables[variableOrder[i].id]);
    }
  }

  buildWithDefaultOrdering(variables, values){
    for (var id in variables) {
      if (variables.hasOwnProperty(id)) {
        variables[id]["id"] = id;
        values.push(variables[id]);
      }
    }
  }

  variableIsValid(value){
    return value["inputName"] && value["inputName"].startsWith("$")
  }

  substituteVariable(queryString, matching, replacement){
    return queryString.split(matching).join(replacement);
  }

  substituteFinalQuery(finalQuery, controller) {
    //Dictionary doesn't guarantee ordering, so convert to array and sort by key
    var orderedVariablesList = [];
    const variables = controller.target.variables;
    const variableOrder = controller.target.variableOrder;
    const variableOrderLength = variableOrder.length;
    if (variableOrderLength) {
      this.buildWithProvidedOrdering(variableOrderLength, variables, variableOrder, orderedVariablesList);
    } else {
      this.buildWithDefaultOrdering(variables, orderedVariablesList);
    }
    orderedVariablesList.sort();
    //Work upwards
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

  addQueryArg(constructedQuery, queryFunction, queryVariable, arg){
    if(queryFunction === "q" || queryFunction === "change" || queryFunction === "count"){
      if(arg !== "startDuration" && arg !== "endDuration"){
        return constructedQuery;
      }
    }
    if(queryFunction === "band" || queryFunction === "over" || queryFunction === "shiftBand"){
      if(arg !== "duration" && arg !== "period" && arg !== "num"){
        return constructedQuery;
      }
    }
    if(queryFunction === "window"){
      if(arg !== "duration" && arg !== "period" && arg !== "num" && arg !== "funcName"){
        return constructedQuery;
      }
    }

    if(queryVariable[arg]){
      if(arg === "num"){
        constructedQuery += ', ' + queryVariable[arg]
      }else{
        constructedQuery += ', "' + queryVariable[arg] + '"'
      }
    }
    return constructedQuery
  }

  buildQueryVariable(queryVariable, id, controller) {
    console.log(queryVariable)

    var constructedQuery = "";
    if(!queryVariable){throw new ReferenceError("No query parameters found")}
    if(!queryVariable["queryFunction"]){throw new ReferenceError("Query function not set")}
    if(!queryVariable["queryAgg"]){throw new ReferenceError("Query aggregator not set")}
    if(!queryVariable["metric"]){throw new ReferenceError("Query metric not set")}

    constructedQuery += queryVariable["queryFunction"] + '("';
    constructedQuery += queryVariable["queryAgg"] + ":";
    if(queryVariable["downsampleTime"]){
      constructedQuery += queryVariable["downsampleTime"];
      if(queryVariable["downsampleAgg"]){
        constructedQuery += "-" + queryVariable["downsampleAgg"]
      }
      if(queryVariable["fillPolicy"]){
        constructedQuery += "-" + queryVariable["fillPolicy"]
      }
    }else{
      if(queryVariable["downsampleAgg"]){
        constructedQuery += queryVariable["downsampleAgg"]
      }
      if(queryVariable["fillPolicy"]){
        constructedQuery += "-" + queryVariable["fillPolicy"]
      }
    }
    if(queryVariable["conversionFlag"]){
      constructedQuery += ":" + queryVariable["conversionFlag"]
    }
    if(queryVariable["flags"]){
      constructedQuery += queryVariable["flags"]
    }
    if(queryVariable["downsampleTime"] || queryVariable["downsampleAgg"] || queryVariable["fillPolicy"]){
      constructedQuery += ":"
    }
    constructedQuery += queryVariable["metric"] + "{";
    console.log(constructedQuery)
    if(queryVariable["metricTags"]){
      constructedQuery += queryVariable["metricTags"]
    }
    constructedQuery += "}";
    if(controller.target.tagBoxes[id]){
      var onFirstTag = true;

      constructedQuery += "{";
      for (var tagMapping in controller.target.tagBoxes[id]) {
        if (controller.target.tagBoxes[id].hasOwnProperty(tagMapping)) {
          if(!onFirstTag){
            constructedQuery += ", "
          }else{onFirstTag = false;}
          constructedQuery += controller.target.tagBoxes[id][tagMapping]["key"] + "=" + controller.target.tagBoxes[id][tagMapping]["value"]
        }
      }
      constructedQuery += '}"'
    }else{
      constructedQuery += '{}"'
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
}
