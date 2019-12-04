export class QueryBuilderService {

  buildWithProvidedOrdering(variableOrderLength, variables, variableOrder, values) {
    for (var i = 0; i < variableOrderLength; i++) {
      variables[variableOrder[i].id]["id"] = variableOrder[i].id;
      values.push(variables[variableOrder[i].id]);
    }
  }

  variableIsValid(value){
    return value["inputName"] && value["inputName"].startsWith("$")
  }

  substituteVariable(queryString, matching, replacement){
    return queryString.split(matching).join(replacement);
  }

  substituteFinalQuery(finalQuery, controller) {
    //Ensure ordered and work upwards
    //Copy to not affect ordering
    var orderedVariablesList = controller.target.variables.slice();

    orderedVariablesList.sort((a, b) => (a.indexInUI < b.indexInUI) ? 1 : -1);

    const the_service = this;

    var substitutedFinalQuery = finalQuery;
    var index = 0;
    orderedVariablesList.forEach(function (value) {
      if (value.type === "variable") {
        if (the_service.variableIsValid(value)) {
          if (value["inputValue"] === undefined) {
            substitutedFinalQuery = the_service.substituteVariable(
              substitutedFinalQuery,
              value["inputName"],
              ""
            );
          } else {
            substitutedFinalQuery = the_service.substituteVariable(
              substitutedFinalQuery,
              value["inputName"],
              value["inputValue"]
            );
          }
        }
      }
      if (value.type === "queryVariable") {
        substitutedFinalQuery = the_service.substituteVariable(
          substitutedFinalQuery, value["inputValue"],
          the_service.buildQueryVariable(orderedVariablesList, value, index, controller)
        );
      }
      index +=1;
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

  ensureMinimalQuery(queryVariable){
    if(!queryVariable){throw new ReferenceError("No query parameters found")}
    if(!queryVariable["queryFunction"]){throw new ReferenceError("Query function not set")}
    if(!queryVariable["queryAgg"]){throw new ReferenceError("Query aggregator not set")}
    if(!queryVariable["metric"]){throw new ReferenceError("Query metric not set")}
  }

  addParamToQuery(queryVariable, prepend, param, append){
    if(queryVariable[param]){
      return prepend + queryVariable[param] + append;
    }
    return "";
  }

  addTagsToQuery(constructedQuery, orderedVariablesList, index, tagType){
    var onFirstTag = true;
    for (var tagMapping in orderedVariablesList[index][tagType+"tagBoxes"]) {
      if (orderedVariablesList[index][tagType+"tagBoxes"].hasOwnProperty(tagMapping)) {
        if (!onFirstTag) {
          constructedQuery += ","
        } else {
          onFirstTag = false;
        }
        constructedQuery +=
          orderedVariablesList[index][tagType+"tagBoxes"][tagMapping]["key"]
          + "="
          + orderedVariablesList[index][tagType+"tagBoxes"][tagMapping]["value"]
      }
    }
    return constructedQuery;
  }

  buildQueryVariable(orderedVariablesList, queryVariable, index) {

    this.ensureMinimalQuery(queryVariable);

    var constructedQuery = queryVariable["queryFunction"] + '("' + queryVariable["queryAgg"] + ":";
    if(queryVariable["downsampleTime"]){
      constructedQuery += queryVariable["downsampleTime"];
      constructedQuery += this.addParamToQuery(queryVariable, "-", "downsampleAgg", "");
    }else{
      constructedQuery += this.addParamToQuery(queryVariable, "", "downsampleAgg", "");
    }
    constructedQuery += this.addParamToQuery(queryVariable, "-", "fillPolicy", "");
    constructedQuery += this.addParamToQuery(queryVariable, ":", "conversionFlag", "");
    constructedQuery += this.addParamToQuery(queryVariable, ":", "flags", "");

    if(queryVariable["downsampleTime"] || queryVariable["downsampleAgg"] || queryVariable["fillPolicy"]){
      constructedQuery += ":"
    }
    constructedQuery += queryVariable["metric"] + "{";

    if(orderedVariablesList[index] && orderedVariablesList[index].grouptagBoxes) {
      constructedQuery = this.addTagsToQuery(constructedQuery, orderedVariablesList, index, 'group')
    }
    constructedQuery += "}{";
    if(orderedVariablesList[index] && orderedVariablesList[index].filtertagBoxes){
      constructedQuery = this.addTagsToQuery(constructedQuery, orderedVariablesList, index, 'filter');
    }
    constructedQuery += '}"'

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
    return constructedQuery;
  }
}
