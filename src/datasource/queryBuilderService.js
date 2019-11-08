export class QueryBuilderService {

  constructor() {
  }

  substituteFinalQuery(finalQuery, _this) {
    //Dictionary doesn't guarantee ordering, so convert to array and sort by key
    var values = new Array();
    if (_this.target.variableOrder.length) {
      for (var i = 0; i < _this.target.variableOrder.length; i++) {
        _this.target.variables[_this.target.variableOrder[i].id]["id"] = _this.target.variableOrder[i].id
        values.push(_this.target.variables[_this.target.variableOrder[i].id])
      }
    } else {
      for (var id in _this.target.variables) {
        if (_this.target.variables.hasOwnProperty(id)) {
          _this.target.variables[id]["id"] = id
          values.push(_this.target.variables[id])
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
        substitutedFinalQuery = substitutedFinalQuery.split(value["inputValue"]).join(the_service.buildQueryVariable(value, value.id, _this));
      }
    });
    _this.target.subbedQuery = substitutedFinalQuery;
    return substitutedFinalQuery;
  }

  addQueryArg(constructedQuery, queryVariable, arg){
    if(queryVariable[arg]){
      if(arg == "num"){
        constructedQuery += ', ' + queryVariable[arg]
      }else{
        constructedQuery += ', "' + queryVariable[arg] + '"'
      }
    }
    return constructedQuery
  }

  buildQueryVariable(queryVariable, id, _this) {

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
      constructedQuery += queryVariable["downsampleTime"];
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
    constructedQuery += "}";
    if(_this.target.tagBoxes[id]){
      var onFirstTag = true;

      constructedQuery += "{";
      for (var tagMapping in _this.target.tagBoxes[id]) {
        if (_this.target.tagBoxes[id].hasOwnProperty(tagMapping)) {
          if(!onFirstTag){
            constructedQuery += ", "
          }else{onFirstTag = false;}
          constructedQuery += _this.target.tagBoxes[id][tagMapping]["key"] + "=" + _this.target.tagBoxes[id][tagMapping]["value"]
        }
      }
      constructedQuery += '}"'
    }else{
      constructedQuery += '{}"'
    }
    var the_service = this;
    var queryArgs = ["startDuration", "endDuration", "duration", "period", "funcName", "num"]
    queryArgs.forEach(function (arg) {
      constructedQuery = the_service.addQueryArg(constructedQuery, queryVariable, arg);
    });
    constructedQuery += ")";
    console.log(constructedQuery);
    return constructedQuery;
  }
}
