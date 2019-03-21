// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'widgets/Measurement3D/setting/_build-generate_module':function(){
define(["dojo/text!./Setting.html",
"dojo/text!./css/style.css",
"dojo/i18n!./nls/strings"], function(){});
},
'url:widgets/Measurement3D/setting/Setting.html':"<div>\r\n\t<div class=\"row\">\r\n\t\t<div class=\"left-cell\">${nls.defaultAreaUnit}</div>\r\n\t\t<select data-dojo-attach-point=\"selectAreaUnit\" data-dojo-type=\"dijit/form/Select\">\r\n\t\t\t<option value=\"metric\">${nls.metric}</option>\r\n\t\t\t<option value=\"imperial\">${nls.imperial}</option>\r\n\t\t\t<option value=\"square-inches\">${nls.squareInches}</option>\r\n\t\t\t<option value=\"square-feet\">${nls.squareFeet}</option>\r\n\t\t\t<option value=\"square-yards\">${nls.squareYards}</option>\r\n\t\t\t<option value=\"square-miles\">${nls.squareMiles}</option>\r\n\t\t\t<option value=\"square-us-feet\">${nls.squareUSFeet}</option>\r\n\t\t\t<option value=\"square-meters\">${nls.squareMeters}</option>\r\n\t\t\t<option value=\"square-kilometers\">${nls.squareKilometers}</option>\r\n\t\t\t<option value=\"acres\">${nls.acres}</option>\r\n\t\t\t<option value=\"ares\">${nls.ares}</option>\r\n\t\t\t<option value=\"hectares\">${nls.hectares}</option>\r\n\t\t</select>\r\n\t</div>\r\n\t<div class=\"row\">\r\n\t\t<div class=\"left-cell\">${nls.defaultLengthUnit}</div>\r\n\t\t<select data-dojo-attach-point=\"selectLengthUnit\" data-dojo-type=\"dijit/form/Select\">\r\n\t\t\t<option value=\"metric\">${nls.metric}</option>\r\n\t\t\t<option value=\"imperial\">${nls.imperial}</option>\r\n\t\t\t<option value=\"inches\">${nls.inches}</option>\r\n\t\t\t<option value=\"feet\">${nls.feet}</option>\r\n\t\t\t<option value=\"yards\">${nls.yards}</option>\r\n\t\t\t<option value=\"miles\">${nls.miles}</option>\r\n\t\t\t<option value=\"nautical-miles\">${nls.nauticalMiles}</option>\r\n\t\t\t<option value=\"us-feet\">${nls.feetUS}</option>\r\n\t\t\t<option value=\"meters\">${nls.meters}</option>\r\n\t\t\t<option value=\"kilometers\">${nls.kilometers}</option>\r\n\t\t</select>\r\n\t</div>\r\n\t<div class=\"row\">\r\n\t\t<div class=\"left-cell\">${nls.showtools}</div>\r\n\t\t<div class=\"input-group\">\r\n\t\t\t<div data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"showArea\" data-dojo-props=\"label: '${nls.showArea}'\"></div>\r\n\t\t\t<div data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"showDistance\" data-dojo-props=\"label: '${nls.showDistance}'\"></div>\r\n\t\t</div>\r\n\t</div>",
'url:widgets/Measurement3D/setting/css/style.css':".jimu-widget-measurement-setting {font-size: 14px; color: #596679;}.jimu-widget-measurement-setting .dijit {margin-left: 10px;}.jimu-widget-measurement-setting .dijitSelect {width: 180px;}.jimu-widget-measurement-setting .row {margin-top: 20px; margin-bottom: 20px;}.jimu-widget-measurement-setting .row + .row {margin-top: 25px;}.jimu-widget-measurement-setting .left-cell {display: inline-block;}.jimu-widget-measurement-setting .input-group {margin-top: 15px;}.jimu-widget-measurement-setting .input-group > * + * {margin-left: 20px;}",
'*now':function(r){r(['dojo/i18n!*preload*widgets/Measurement3D/setting/nls/Setting*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]']);}
}});
///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
    'dojo/on',
    'dojo/mouse',    
    'jimu/BaseWidgetSetting',
    'jimu/portalUtils',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/Tooltip',    
    'dijit/form/Select',
    'jimu/dijit/CheckBox'
  ],
  function (
    declare,
    lang,
    Deferred,
    on,
    mouse,
    BaseWidgetSetting,
    portalUtils,
    _WidgetsInTemplateMixin,
    Tooltip) {

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-measurement-setting',

      startup: function () {
        this.inherited(arguments);

        if (!this.config.measurement) {
          this.config.measurement = {};
        }
        
        this._showToolsItems = [];
        Tooltip.position = "below";
        this._initShowToolItem(this.showArea);
        this._initShowToolItem(this.showDistance);
        // this._initShowToolItem(this.showLocation);

        this.setConfig(this.config);
      },

      setConfig: function (config) {
        if (!config) return;

        this.config = config;

        this._processConfig(config).then(lang.hitch(this, function (configJson) {
          // set length unit dropdown
          if (configJson.measurement && configJson.measurement.lengthUnit) {
            this.selectLengthUnit.set('value', configJson.measurement.lengthUnit);
          } else {
            this.selectLengthUnit.set('value', configJson.defaultLengthUnit);
          }
          // set area unit dropdown
          if (configJson.measurement && configJson.measurement.areaUnit) {
            this.selectAreaUnit.set('value', configJson.measurement.areaUnit);
          } else {
            this.selectAreaUnit.set('value', configJson.defaultAreaUnit);
          }

          this.showDistance.setValue(configJson.showDistance);
          this.showArea.setValue(configJson.showArea);
        }));


      },

      getConfig: function () {
        this.config.measurement.lengthUnit = this.selectLengthUnit.value;
        this.config.measurement.areaUnit = this.selectAreaUnit.value;

        this.config.showArea = this.showArea.checked;
        this.config.showDistance = this.showDistance.checked;

        return this.config;
      },

      _initShowToolItem: function(item) {
        if (item) {
          item.setValue(true);
          this._showToolsItems.push(item);
          this.own(on(item, 'change', lang.hitch(this, this._onShowToolItemsChange, item)));
        }
      },

      _onShowToolItemsChange: function(obj) {
        if (obj) {
          if (false === obj.checked && this._isItemsAllHide()) {
            obj.check();
            Tooltip.hide();
            Tooltip.show(this.nls.allHidedTips, obj.domNode);
            this.own(on.once(obj.domNode, mouse.leave,
              lang.hitch(this, function() {
                Tooltip.hide(obj.domNode);
              }))
            );
          }
        }
      },

      _isItemsAllHide: function() {
        for (var i = 0, len = this._showToolsItems.length; i < len; i++) {
          var item = this._showToolsItems[i];
          if (true === item.checked) {
            return false;
          }
        }
        return true;
      },

      _processConfig: function (configJson) {
        var def = new Deferred();
        if (configJson.defaultLengthUnit && configJson.defaultAreaUnit) {
          def.resolve(configJson);
        } else {
          portalUtils.getUnits(this.appConfig.portalUrl).then(function (units) {
            configJson.defaultAreaUnit = configJson.defaultLengthUnit =
              units === 'english' ? 'imperial' : 'metric';
            def.resolve(configJson);
          });
        }

        return def;
      }

    });
  });