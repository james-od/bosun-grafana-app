import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!';
import Sortable from './../external/Sortable.min';
import {QueryBuilderService} from "./queryBuilderService";


export class BosunDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, uiSegmentSrv, $sce) {
    super($scope, $injector, $sce);
    this.scope = $scope;
    this.sce = $sce;
    this.queryHelper = {};
    this.uiSegmentSrv = uiSegmentSrv;
    this.target.expandHelper = 0;
    this.target.target = this.target.target || 'Bosun Query';
    this.setSortable = this.setSortable.bind(this);
    this.deleteVariable = this.deleteVariable.bind(this);
    this.suggestMetrics = this.suggestMetrics.bind(this);
    this.addSuggest = this.addSuggest.bind(this);
    this.labelFromUnit = this.labelFromUnit.bind(this);
    this.metricInfo = this.metricInfo.bind(this);
    this.suggestQuery = this.suggestQuery.bind(this);
    this.suggestTagValues = this.suggestTagValues.bind(this);
    this.addNewVariable = this.addNewVariable.bind(this);
    this.addNewVariableQ = this.addNewVariableQ.bind(this);
    this.getMetricSuggestions = this.getMetricSuggestions.bind(this);
    this.addTagBox = this.addTagBox.bind(this);
    this.filterTypes = ["Group By", "Filter"]
    this.scope.variables = {};
    this.scope.aggOptions = [
      {text: 'avg'}, {text: 'count'}, {text: 'dev'}, {text: 'diff'}, {text: 'ep50r3'}, {text: 'ep50r7'},
      {text: 'ep75r3'}, {text: 'ep75r7'}, {text: 'ep90r3'}, {text: 'ep90r7'}, {text: 'ep95r3'}, {text: 'ep95r7'},
      {text: 'ep99r3'}, {text: 'ep99r7'}, {text: 'ep999r3'}, {text: 'ep999r7'}, {text: 'first'}, {text: 'last'},
      {text: 'median'}, {text: 'mimmin'}, {text: 'mimmax'}, {text: 'min'}, {text: 'max'}, {text: 'mult'},
      {text: 'none'}, {text: 'p50'}, {text: 'p75'}, {text: 'p90'}, {text: 'p95'}, {text: 'p99'}, {text: 'p999'},
      {text: 'pfsum'}, {text: 'sum'}, {text: 'zimsum'}
    ];
    this.scope.fillPolicies = [{text: 'none'}, {text: 'nan'}, {text: 'null'}, {text: 'zero'}];
    this.scope.queryFunctions = [
      {func: 'q', type:'seriesSet', args:{'query': 'string', 'startDuration': 'string', 'endDuration': 'string'}},
      {func: 'band', type:'seriesSet', args:{'query': 'string', 'duration': 'string', 'period': 'string', 'num': 'scalar'}},
      {func: 'over', type:'seriesSet', args:{'query': 'string', 'duration': 'string', 'period': 'string', 'num': 'scalar'}},
      {func: 'shiftBand', type:'seriesSet', args:{'query': 'string', 'duration': 'string', 'period': 'string', 'num': 'scalar'}},
      {func: 'change', type:'numberSet', args:{'query': 'string', 'startDuration': 'string', 'endDuration': 'string'}},
      {func: 'count', type:'scalar', args:{'query': 'string', 'startDuration': 'string', 'endDuration': 'string'}},
      {func: 'window', type:'seriesSet', args:{'query': 'string', 'duration': 'string', 'period': 'string', 'num': 'scalar', 'funcName': 'string'}},
    ];
    this.scope.suggestions = [];
    this.scope.tagBoxes = {};
    this.scope.varCounter = 0;
    this.scope.tagBoxCounter = 0;
    this.scope.finalQuery = "";
    this.scope.subbedQuery = "";
    this.scope.variableOrder = [];
  }

  deleteVariable(id){
    //delete variable
    delete this.scope.variables[id];

    //delete corresponding id in variableOrder
    for(var i=0; i<this.scope.variableOrder.length; i++){
      if(this.scope.variableOrder[i].id == id){
        this.scope.variableOrder[i].remove()
      }
    }

    //Reorder variables by variable order as deletion resets it
    var values = new Array();
    if (this.scope.variableOrder.length) {
      for (var i = 0; i < this.scope.variableOrder.length; i++) {
        this.scope.variables[this.scope.variableOrder[i].id]["id"] = this.scope.variableOrder[i].id
        values.push(this.scope.variables[this.scope.variableOrder[i].id])
      }
    } else {
      for (var id in this.scope.variables) {
        if (this.scope.variables.hasOwnProperty(id)) {
          this.scope.variables[id]["id"] = id
          values.push(this.scope.variables[id])
        }
      }
    }
    this.scope.variables = {}
    for(var i=0; i<values.length; i++){
      this.scope.variables[i] = values[i];
    }
  }

  setSortable(){
    var el = document.getElementById('allVariables');
    let _this = this;
    var sortable = Sortable.create(el, {
      onUpdate(evt) {
        console.log(evt)
        console.log(_this.scope.variableOrder)
        _this.scope.variableOrder = evt.to.children;
      }
    });
  }

  suggestMetrics(metric, callback) {
    return this.datasource._metricsStartWith(metric).then(callback);
  }

  metricInfo() {
    return this.datasource._tagKeysForMetric(this.queryHelper.metric).then((tagKeys) => {
      this.datasource.q.all(_.map(tagKeys, (tagKey) => {
        return this.datasource._tagValuesForMetricAndTagKey(this.queryHelper.metric, tagKey).then((tagValues) => {
          return { key: tagKey, value: tagValues }
        })
      })
      ).then((tagKeysToValues) => {
        tagKeysToValues = _.each(tagKeysToValues, (v) => { v.filterType = "Group By" })
        this.queryHelper.tagKeysToValues = tagKeysToValues;
      })
    }).then(() => this.datasource._metricMetadata(this.queryHelper.metric).then((metadata) => {
      this.queryHelper.rate = metadata.Rate;
      this.queryHelper.unit = metadata.Unit;
      this.queryHelper.desc = metadata.Desc;
    })).then(() => this.suggestQuery());
  }

  // Expects that getTags has been called
  suggestTagValues(key, callback) {
    return this.queryHelper.tagKeysToValues[key].then(callback)
  }

  labelFromUnit() {
    if (this.panelCtrl.panel.type === "graph") {
      this.panelCtrl.panel.yaxes[0].label = this.queryHelper.unit;
    }
    if (this.panelCtrl.panel.type === "singlestat") {
      this.panelCtrl.panel.postfix = " " + this.queryHelper.unit;
    }
  }

  suggestQuery() {
    var metric = this.queryHelper.metric || "metric.goes.here";
    var selectedGroupByTags = [];
    var selectedFilterTags = [];
    _.each(this.queryHelper.tagKeysToValues, (v) => {
      if (v.selectedValue && v.selectedValue != "") {
        if (v.filterType === this.filterTypes[0]) {
          selectedGroupByTags.push(v.key + "=" + v.selectedValue);
        }
        if (v.filterType === this.filterTypes[1]) {
          selectedFilterTags.push(v.key + "=" + v.selectedValue);
        }
      }
    }, this);
    var rate = "";
    if (this.queryHelper.rate && this.queryHelper.rate == "counter") {
      rate = "rate{counter,,1}:"
    }
    this.queryHelper.suggestedQuery = "q(\"avg:$ds-avg:" + rate + metric + "{" + selectedGroupByTags.join(",") + "}" + "{" + selectedFilterTags.join(",") + "}" + "\", \"$start\", \"\")"
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }

  getMetricSuggestions(typeahead) {
    if(!this.datasource.openTSDBUrl){
      throw ReferenceError("Missing OpenTSDB URL")
    }
    var request = new Request(this.datasource.openTSDBUrl + "/suggest?type=metrics&q=" + typeahead);

    var the_scope = this.scope
    var req = fetch(request).then(function(response) {
      return response.json();
    }).then(function(responseSuggestions) {
      the_scope.suggestions = responseSuggestions;
    }).catch(function(error) {
      throw error;
    });
    return req
  }


  updateFinalQuery(finalQuery) {
    this.scope.finalQuery = finalQuery;
    var qbs = new QueryBuilderService();
    return qbs.substituteFinalQuery(finalQuery, this);
  }

  addVariableValue(inputValue, id) {
    if(this.scope.variables[id]){
      this.scope.variables[id]["value"] = inputValue;
    }else{
      throw new ReferenceError("When trying to add value the requested variable id could not be found")
    }
  }

  addQueryVariableParameter(inputType, inputValue, id) {
    if(this.scope.variables[id]){
      if(!this.scope.variables[id]["value"]){
        this.scope.variables[id]["value"] = {}
      }
      this.scope.variables[id]["value"][inputType] = inputValue;
    }else{
      throw new ReferenceError("Requested queryVariable id could not be found")
    }
  }

  addVariableName(inputName, id) {
    if(this.scope.variables[id]){
      this.scope.variables[id]["name"] = inputName;
    }else{
      throw new ReferenceError("When trying to add name the requested variable id could not be found")
    }
  }

  addNewVariable() {
    this.scope.variables[this.scope.varCounter] = {type: 'variable'};
    this.scope.varCounter += 1;
    this.setSortable();
  }

  addNewVariableQ() {
    console.log(this.scope)
    this.scope.variables[this.scope.varCounter] = {type: 'queryVariable'};
    this.scope.varCounter += 1;
    this.setSortable();
  }

  substituteVariables(finalQuery) {
    //TODO
  }

  editTagBox(queryId, tagId, input, type) {
    this.scope.tagBoxes[parseInt(queryId)][parseInt(tagId)][type] = input;
  }

  addTagBox(queryId) {
    if(!this.scope.tagBoxes[queryId]){
      this.scope.tagBoxes[queryId] = {}
    }
    this.scope.tagBoxes[queryId][this.scope.tagBoxCounter] = {key: "", value: ""};
    this.scope.tagBoxCounter += 1;
  }

  addSuggest() {
    if (this.target.expr) {
      this.target.expr += "\n" + this.queryHelper.suggestedQuery;
    } else {
      this.target.expr = this.queryHelper.suggestedQuery;
    }
  }
}
export default { BosunDatasourceQueryCtrl }
BosunDatasourceQueryCtrl.templateUrl = 'datasource/partials/query.editor.html';
