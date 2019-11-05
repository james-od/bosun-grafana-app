export class QueryBuilderService {

  constructor() {
  }

  substituteFinalQuery(finalQuery, _this) {
    //Dictionary doesn't guarantee ordering, so convert to array and sort by key
    var values = new Array();
    if (_this.scope.variableOrder.length) {
      console.log("Is variable order")
      for (var i = 0; i < _this.scope.variableOrder.length; i++) {
        values.push(_this.scope.variables[_this.scope.variableOrder[i].id])
      }
    } else {
      console.log("No variable order")
      for (var id in _this.scope.variables) {
        if (_this.scope.variables.hasOwnProperty(id)) {
          values.push(_this.scope.variables[id])
        }
      }
    }
    values.sort()
    //Work upwards
    values = values.reverse()

    var the_service = this

    var substitutedFinalQuery = finalQuery
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
        substitutedFinalQuery = substitutedFinalQuery.split(value.value["queryVariableName"]).join(the_service.buildQueryVariable(value, value.id, _this.scope));
      }
    });
    _this.scope.subbedQuery = substitutedFinalQuery;
    return substitutedFinalQuery;
  }

  buildQueryVariable(parameterObject, id, scope) {

    var params = parameterObject.value;
    var constructedQuery = "";
    if(!params){
      throw new ReferenceError("No query parameters found")
    }
    if(params["queryFunction"]){
      constructedQuery += params["queryFunction"] + '("'
    }else{
      throw new ReferenceError("Query function not set")
    }
    if(params["queryAgg"]){
      constructedQuery += params["queryAgg"] + ":"
    }else{
      throw new ReferenceError("Query aggregator not set")
    }
    if(params["downsampleTime"]){
      constructedQuery += params["downsampleTime"]
      if(params["downsampleAgg"]){
        constructedQuery += "-" + params["downsampleAgg"]
      }
      if(params["fillPolicy"]){
        constructedQuery += "-" + params["fillPolicy"]
      }
    }
    if(params["conversionFlag"]){
      constructedQuery += ":" + params["conversionFlag"]
    }
    if(params["metric"]){
      constructedQuery += ":" + params["metric"] + "{"
    }else{
      throw new ReferenceError("Query metric not set")
    }
    if(params["metricTags"]){
      constructedQuery += params["metricTags"]
    }
    constructedQuery += "}"
    if(scope.tagBoxes[id]){
      var onFirstTag = true

      constructedQuery += "{"
      for (var tagMapping in scope.tagBoxes[id]) {
        if (scope.tagBoxes[id].hasOwnProperty(tagMapping)) {
          if(!onFirstTag){
            constructedQuery += ", "
          }else{onFirstTag = false;}
          constructedQuery += scope.tagBoxes[id][tagMapping]["key"] + "=" + scope.tagBoxes[id][tagMapping]["value"]
        }
      }
      constructedQuery += '}"'
    }else{
      constructedQuery += '{}"'
    }
    if(params["startDuration"]){
      constructedQuery += ', "' + params["startDuration"] + '"'
    }
    if(params["endDuration"]){
      constructedQuery += ', "' + params["endDuration"] + '"'
    }
    if(params["duration"]){
      constructedQuery += ', "' + params["duration"] + '"'
    }
    if(params["period"]){
      constructedQuery += ', "' + params["period"] + '"'
    }
    if(params["num"]){
      constructedQuery += ', "' + params["num"] + '"'
    }
    if(params["funcName"]){
      constructedQuery += ', "' + params["funcName"] + '"'
    }
    constructedQuery += ")";
    console.log(constructedQuery);
    return constructedQuery;
  }
}
