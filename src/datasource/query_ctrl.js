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
    this.deleteVariable = this.deleteVariable.bind( this);
    this.suggestMetrics = this.suggestMetrics.bind(this);
    this.addSuggest = this.addSuggest.bind(this);
    this.labelFromUnit = this.labelFromUnit.bind(this);
    this.metricInfo = this.metricInfo.bind(this);
    this.suggestQuery = this.suggestQuery.bind(this);
    this.suggestTagValues = this.suggestTagValues.bind(this);
    this.addNewVariable = this.addNewVariable.bind(this);
    this.getMetricSuggestions = this.getMetricSuggestions.bind(this);
    this.addFilterTagBox = this.addFilterTagBox.bind(this);
    this.addGroupTagBox = this.addGroupTagBox.bind(this);
    this.filterTypes = ["Group By", "Filter"]
    if(!this.target.variables){
      this.target.variables = [];
    }else{
      this.target.variables = _.orderBy(this.target.variables, ['indexInUI'])
    }
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
    if(!this.target.filtertagBoxes){
      this.target.filtertagBoxes = {};
    }
    if(!this.target.grouptagBoxes) {
      this.target.grouptagBoxes = {};
    }
    if(!this.target.varCounter){
      this.target.varCounter = 0;
    }
    if(!this.target.filterTagBoxCounter){
      this.target.filterTagBoxCounter = 0;
    }
    if(!this.target.groupTagBoxCounter) {
      this.target.groupTagBoxCounter = 0;
    }
    if(!this.target.finalQuery){
      if(this.target.expr){
        this.target.finalQuery = this.target.expr;
        this.target.expr = ""
      }else{
        this.target.finalQuery = "";
      }
    }
    console.log(this.target.finalQuery)
    this.target.subbedQuery = "";
    if(!this.target.flags){
      this.target.flags = "";
    }
    var _this = this;
    $(document).ready(function(){
      //Give time for page to load before setting elements as sortable
      setTimeout(function(){
        _this.setSortable();
        }, 2000);
    });
    try{
      this.updateFinalQuery(this.target.finalQuery);
    }catch (e) {
      console.log(e)
    }
  }

  _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }
    return target;
  }

  deleteVariable(id) {
    var tmp = []
    for (var i = 0; i < this.target.variables.length; i++) {
      if (this.target.variables[i].id.toString() !== id.toString()) {
        tmp.push(this._objectWithoutProperties(this.target.variables[i], ["$$hashKey"]))
      }
    }
    this.target.variables = tmp;
  }

  deleteTag(queryId, tagId, type){
    if(type === 'filter'){
      delete this.target.filtertagBoxes[queryId][tagId]
    }
    if(type === 'group'){
      delete this.target.grouptagBoxes[queryId][tagId]
    }
  }

  htmlCollectionToListOfIds(htmlCollection){
    var ret = []
    for(var i=0; i<htmlCollection.length; i++){
      ret.push(htmlCollection[i].id)
    }
    return ret;
  }

  setSortable(){
    var el = document.getElementById('allVariables');
    let _this = this;
    var sortable = Sortable.create(el, {
      onUpdate(evt) {
        console.log(evt.to.children)
        var orderedListOfIds = _this.htmlCollectionToListOfIds(evt.to.children);

        for(var i=0; i<_this.target.variables.length; i++){
          _this.target.variables[i]["indexInUI"] = orderedListOfIds[_this.target.variables[i].id]
        }
        _this.target.variables = _.orderBy(_this.target.variables, ['indexInUI'])
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
    var qbs = new QueryBuilderService();
    this.target.expr = qbs.substituteFinalQuery(finalQuery, this);
    this.panelCtrl.refresh();
    this.target.finalQuery = finalQuery;
    return qbs.substituteFinalQuery(finalQuery, this);
  }

  addNewVariable(type) {
    this.target.variables.push({id: this.target.varCounter, type: type});
    this.target.varCounter += 1;
    this.setSortable();

    var orderedListOfIds = document.querySelectorAll('#allVariables li[id]');

    for(var i=0; i<orderedListOfIds.length; i++){
      if(this.target.variables[i]){
        this.target.variables[i]["indexInUI"] = orderedListOfIds[i]
      }
    }

    this.target.variables = _.orderBy(this.target.variables, ['indexInUI'])
  }

  addFilterTagBox(queryId) {
    if(!this.target.filtertagBoxes[queryId]){
      this.target.filtertagBoxes[queryId] = {}
    }
    this.target.filtertagBoxes[queryId][this.target.filterTagBoxCounter] = {key: "", value: ""};
    this.target.filterTagBoxCounter += 1;
  }

  addGroupTagBox(queryId) {
    if(!this.target.grouptagBoxes[queryId]){
      this.target.grouptagBoxes[queryId] = {};
    }
    this.target.grouptagBoxes[queryId][this.target.groupTagBoxCounter] = {key: "", value: ""};
    this.target.groupTagBoxCounter += 1;
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
