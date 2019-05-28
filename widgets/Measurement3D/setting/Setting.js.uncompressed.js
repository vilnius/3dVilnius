// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'widgets/Measurement3D/setting/_build-generate_module':function(){
define(["dojo/text!./Setting.html",
"dojo/text!./css/style.css",
"dojo/i18n!./nls/strings"], function(){});
},
'url:widgets/Measurement3D/setting/Setting.html':"<div>\r\n\t<div class=\"row\">\r\n  \t<div class=\"left-cell\">${nls.defaultLengthUnit}</div>\r\n    <select data-dojo-attach-point=\"selectLengthUnit\" data-dojo-type=\"dijit/form/Select\">\r\n\t\t\t<option value=\"metric\">${nls.metric}</option>\r\n\t\t\t<option value=\"imperial\">${nls.imperial}</option>\r\n\t\t\t<option value=\"inches\">${nls.inches}</option>\r\n\t\t\t<option value=\"feet\">${nls.feet}</option>\r\n\t\t\t<option value=\"yards\">${nls.yards}</option>\r\n\t\t\t<option value=\"miles\">${nls.miles}</option>\r\n\t\t\t<option value=\"nautical-miles\">${nls.nauticalMiles}</option>\r\n\t\t\t<option value=\"us-feet\">${nls.feetUS}</option>\r\n\t\t\t<option value=\"meters\">${nls.meters}</option>\r\n\t\t\t<option value=\"kilometers\">${nls.kilometers}</option>\r\n    </select>\r\n  </div>\r\n\t<!-- <div class=\"row\">\r\n\t\t<div class=\"left-cell\">${nls.showtools}</div>\r\n\t\t<div class=\"input-group\">\r\n      <div data-dojo-type=\"jimu/dijit/CheckBox\"\r\n\t\t\t\t\t data-dojo-attach-point=\"showArea\"\r\n\t\t\t\t\t data-dojo-props=\"label: '${nls.showArea}'\"></div>\r\n      <div data-dojo-type=\"jimu/dijit/CheckBox\"\r\n\t\t\t\t\t data-dojo-attach-point=\"showDistance\"\r\n\t\t\t\t\t data-dojo-props=\"label: '${nls.showDistance}'\"></div>\r\n      <div data-dojo-type=\"jimu/dijit/CheckBox\"\r\n\t\t\t\t\t data-dojo-attach-point=\"showLocation\"\r\n\t\t\t\t\t data-dojo-props=\"label: '${nls.showLocation}'\"></div>\r\n\t\t\t</div>\r\n\t</div> -->\r\n</div>\r\n",
'url:widgets/Measurement3D/setting/css/style.css':".jimu-widget-measurement-setting {font-size: 14px; color: #596679;}.jimu-widget-measurement-setting .dijit {margin-left: 10px;}.jimu-widget-measurement-setting .dijitSelect {width: 180px;}.jimu-widget-measurement-setting .row {margin-top: 20px; margin-bottom: 20px;}.jimu-widget-measurement-setting .row + .row {margin-top: 25px;}.jimu-widget-measurement-setting .left-cell {display: inline-block;}.jimu-widget-measurement-setting .input-group {margin-top: 15px;}.jimu-widget-measurement-setting .input-group > * + * {margin-left: 20px;}",
'*now':function(r){r(['dojo/i18n!*preload*widgets/Measurement3D/setting/nls/Setting*["ar","bs","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]']);}
}});
///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/Deferred',
  'jimu/BaseWidgetSetting',
  'jimu/portalUtils',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/form/Select',
  'jimu/dijit/CheckBox'
],
function(
  declare,
  lang,
  Deferred,
  BaseWidgetSetting,
  portalUtils,
  _WidgetsInTemplateMixin) {

  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

    baseClass: 'jimu-widget-measurement-setting',

    postCreate: function(){
      if (!this.config.measurement) {
        this.config.measurement = {};
      }

      // hide the checkboxes
      // until more measurement options are available
      // this.showArea.setStatus(false);
      // // this.showDistance.setStatus(false);
      // this.showLocation.setStatus(false);
    },

    startup: function() {
      this.inherited(arguments);

      this.setConfig(this.config);
    },

    setConfig: function(config){
      if(!config) return;

      this.config = config;

      this._processConfig(config).then(lang.hitch(this, function(configJson) {

        //

        if (configJson.measurement && configJson.measurement.lengthUnit) {
          this.selectLengthUnit.set('value', configJson.measurement.lengthUnit);
        } else {
          this.selectLengthUnit.set('value', configJson.defaultLengthUnit);
        }

        // hide all options until more are available
        // // only show "distance" as the available option for now
        // this.showDistance.setValue(true);
        // this.showArea.setValue(false);
        // this.showLocation.setValue(false);
      }));


    },

    getConfig: function(){
      this.config.measurement.lengthUnit = this.selectLengthUnit.value;

      // hide all options until more are available
      // this.config.showArea = this.showArea.checked;
      // this.config.showDistance = this.showDistance.checked;
      // this.config.showLocation = this.showLocation.checked;

      return this.config;
    },


    _processConfig: function(configJson) {
      var def = new Deferred();
      if (configJson.defaultLengthUnit) {
        def.resolve(configJson);
      } else {
        portalUtils.getUnits(this.appConfig.portalUrl).then(function(units) {
          configJson.defaultLengthUnit = units === 'english' ?
            'imperial' : 'metric'
          def.resolve(configJson);
        });
      }

      return def;
    }

  });
});