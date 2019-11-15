export class QueryBuilderService {

  buildWithProvidedOrdering(variableOrderLength, variables, variableOrder, values) {
    for (var i = 0; i < variableOrderLength; i++) {
      variables[variableOrder[i].id]["id"] = variableOrder[i].id;
      values.push(variables[variableOrder[i].id]);
    }
  }

  buildWithDefaultOrdering(variables, values){
    variables = _.orderBy(variables, ['indexInUI'])

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
    console.log(controller)
    //Dictionary doesn't guarantee ordering, so convert to array and sort by key
    var orderedVariablesList = [];
    const variables = controller.target.variables;
    this.buildWithDefaultOrdering(variables, orderedVariablesList);
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

  addQueryArg(queryVariable, arg){
    if(queryVariable[arg]){
      if(arg === "num"){
        return ', ' + queryVariable[arg]
      }else{
        return ', "' + queryVariable[arg] + '"'
      }
    }else{
      return ', ""'
    }
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
      constructedQuery += ":" + queryVariable["flags"]
    }
    if(queryVariable["downsampleTime"] || queryVariable["downsampleAgg"] || queryVariable["fillPolicy"]){
      constructedQuery += ":"
    }
    constructedQuery += queryVariable["metric"] + "{";
    if(controller.target.grouptagBoxes[id]) {
      var onFirstTag = true;
      for (var tagMapping in controller.target.grouptagBoxes[id]) {
        if (controller.target.grouptagBoxes[id].hasOwnProperty(tagMapping)) {
          if (!onFirstTag) {
            constructedQuery += ","
          } else {
            onFirstTag = false;
          }
          constructedQuery += controller.target.grouptagBoxes[id][tagMapping]["key"] + "=" + controller.target.grouptagBoxes[id][tagMapping]["value"]
        }
      }
    }
    constructedQuery += "}";
    if(controller.target.filtertagBoxes[id]){
      var onFirstTag = true;

      constructedQuery += "{";
      for (var tagMapping in controller.target.filtertagBoxes[id]) {
        if (controller.target.filtertagBoxes[id].hasOwnProperty(tagMapping)) {
          if(!onFirstTag){
            constructedQuery += ","
          }else{onFirstTag = false;}
          constructedQuery += controller.target.filtertagBoxes[id][tagMapping]["key"] + "=" + controller.target.filtertagBoxes[id][tagMapping]["value"]
        }
      }
      constructedQuery += '}"'
    }else{
      constructedQuery += '{}"'
    }
    const queryVar = queryVariable["queryFunction"]
    if(queryVar === "q" || queryVar === "change" || queryVar === "count") {
      constructedQuery += this.addQueryArg(queryVariable, "startDuration");
      constructedQuery += this.addQueryArg(queryVariable, "endDuration");
    }
    if(queryVar === "band" || queryVar === "over" || queryVar === "shiftBand") {
      constructedQuery += this.addQueryArg(queryVariable, "duration");
      constructedQuery += this.addQueryArg(queryVariable, "period");
      constructedQuery += this.addQueryArg(queryVariable, "num");
    }
    if(queryVar === "window") {
      constructedQuery += this.addQueryArg(queryVariable, "duration");
      constructedQuery += this.addQueryArg(queryVariable, "period");
      constructedQuery += this.addQueryArg(queryVariable, "num");
      constructedQuery += this.addQueryArg(queryVariable, "funcName");
    }
    constructedQuery += ")";
    console.log(constructedQuery);
    return constructedQuery;
  }
}
