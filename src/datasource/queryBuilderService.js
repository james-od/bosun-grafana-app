export class QueryBuilderService {

  constructor() {
  }

  substituteFinalQuery(finalQuery, _this) {
    //Dictionary doesn't guarantee ordering, so convert to array and sort by key
    var values = new Array();
    if (_this.scope.variableOrder.length) {
      for (var i = 0; i < _this.scope.variableOrder.length; i++) {
        _this.scope.variables[_this.scope.variableOrder[i].id]["id"] = _this.scope.variableOrder[i].id
        values.push(_this.scope.variables[_this.scope.variableOrder[i].id])
      }
    } else {
      for (var id in _this.scope.variables) {
        if (_this.scope.variables.hasOwnProperty(id)) {
          _this.scope.variables[id]["id"] = id
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
        substitutedFinalQuery = substitutedFinalQuery.split(value["inputValue"]).join(the_service.buildQueryVariable(value, value.id, _this.scope));
      }
    });
    _this.scope.subbedQuery = substitutedFinalQuery;
    return substitutedFinalQuery;
  }

  buildQueryVariable(queryVariable, id, scope) {

    console.log(queryVariable)
    console.log(id)
    console.log(scope)
    var constructedQuery = "";
    if(!queryVariable){
      throw new ReferenceError("No query parameters found")
    }
    if(queryVariable["queryFunction"]){
      constructedQuery += queryVariable["queryFunction"] + '("'
    }else{
      throw new ReferenceError("Query function not set")
    }
    if(queryVariable["queryAgg"]){
      constructedQuery += queryVariable["queryAgg"] + ":"
    }else{
      throw new ReferenceError("Query aggregator not set")
    }
    if(queryVariable["downsampleTime"]){
      constructedQuery += queryVariable["downsampleTime"]
      if(queryVariable["downsampleAgg"]){
        constructedQuery += "-" + queryVariable["downsampleAgg"]
      }
      if(queryVariable["fillPolicy"]){
        constructedQuery += "-" + queryVariable["fillPolicy"]
      }
    }
    if(queryVariable["conversionFlag"]){
      constructedQuery += ":" + queryVariable["conversionFlag"]
    }
    if(queryVariable["metric"]){
      constructedQuery += ":" + queryVariable["metric"] + "{"
    }else{
      throw new ReferenceError("Query metric not set")
    }
    if(queryVariable["metricTags"]){
      constructedQuery += queryVariable["metricTags"]
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
    if(queryVariable["startDuration"]){
      constructedQuery += ', "' + queryVariable["startDuration"] + '"'
    }
    if(queryVariable["endDuration"]){
      constructedQuery += ', "' + queryVariable["endDuration"] + '"'
    }
    if(queryVariable["duration"]){
      constructedQuery += ', "' + queryVariable["duration"] + '"'
    }
    if(queryVariable["period"]){
      constructedQuery += ', "' + queryVariable["period"] + '"'
    }
    if(queryVariable["num"]){
      constructedQuery += ', ' + queryVariable["num"]
    }
    if(queryVariable["funcName"]){
      constructedQuery += ', "' + queryVariable["funcName"] + '"'
    }
    constructedQuery += ")";
    console.log(constructedQuery)
    return constructedQuery;
  }
}
