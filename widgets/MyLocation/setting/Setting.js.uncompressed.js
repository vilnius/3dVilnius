// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'widgets/MyLocation/setting/_build-generate_module':function(){
define(["dojo/text!./Setting.html",
"dojo/text!./css/style.css",
"dojo/i18n!./nls/strings"], function(){});
},
'url:widgets/MyLocation/setting/Setting.html':"<div style=\"width:100%;\">\r\n  <table class=\"setting-table input-table\" cellspacing=\"0\">\r\n    <tbody>\r\n    <tr>\r\n      <td class=\"first\">\r\n        <div class=\"cb\" data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"highlightLocation\"></div>\r\n        <div class=\"cb-label\">${nls.highlightLocation}</div>\r\n      </td>\r\n      <!--<td class=\"second\"></td>-->\r\n      <td class=\"third\">\r\n        <div class=\"help-icon\"></div>\r\n      </td>\r\n    </tr>\r\n    <tr>\r\n      <td class=\"first\">\r\n        <div class=\"cb\" data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"useTracking\"></div>\r\n        <div class=\"cb-label\">${nls.useTracking}</div>\r\n      </td>\r\n      <!--<td class=\"second\"></td>-->\r\n      <td class=\"third\">\r\n        <div class=\"help-icon\"></div>\r\n      </td>\r\n    </tr>\r\n    <tr>\r\n      <td class=\"first\">\r\n        <span class=\"inputs-label\">${nls.timeout}</span>\r\n        <div class=\"config-group\">\r\n          <input type=\"text\" data-dojo-type=\"dijit/form/NumberTextBox\" required=\"true\" placeHolder=\"15000\"\r\n                 data-dojo-attach-point=\"timeout\" data-dojo-props='style:{width:\"100px\"}, constraints:{min:10}'/>\r\n          <span style=\"margin: 0 10px\">(ms)</span>\r\n        </div>\r\n      </td>\r\n      <!--<td class=\"second\"></td>-->\r\n      <td class=\"third\">\r\n        <div class=\"help-icon\"></div>\r\n      </td>\r\n    </tr>\r\n    <tr>\r\n      <td class=\"first\">\r\n        <span class=\"inputs-label\">${nls.zoomScale}</span>\r\n        <div class=\"config-group\">\r\n          <span>1: </span>\r\n          <input type=\"text\" data-dojo-type=\"dijit/form/NumberTextBox\" required=\"true\" placeHolder=\"50000\"\r\n                 data-dojo-attach-point=\"scale\" data-dojo-props='style:{width:\"150px\"},\r\n                   constraints:{min:1,pattern:\"##############0.################\"}'/>\r\n        </div>\r\n      </td>\r\n      <!--<td class=\"second\"></td>-->\r\n      <td class=\"third\">\r\n        <div class=\"help-icon\"></div>\r\n      </td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n</div>\r\n",
'url:widgets/MyLocation/setting/css/style.css':".jimu-widget-mylocation-setting{margin:0; padding:0; font-size:15px;}.jimu-widget-mylocation-setting .setting-table > thead > tr > th,.jimu-widget-mylocation-setting .setting-table > tbody > tr > td{height:40px; line-height:40px; vertical-align:middle;}.jimu-widget-mylocation-setting .input-table > tbody > tr > .first{width:auto; text-align: left; padding-right:15px; position: relative; display: flex;}.jimu-widget-mylocation-setting .input-table > tbody > tr > .first .cb,.cb-label{vertical-align: middle; line-height: 20px; height: 20px; display: inline-block; padding-left: 5px;}.jimu-widget-mylocation-setting .input-table > tbody > tr > .first .inputs-label{min-width: 150px; padding-right: 20px; display: flex;}.jimu-widget-mylocation-setting .input-table > tbody > tr > .first .config-group{display: flex; align-items: center; min-width: 200px;}.jimu-widget-mylocation-setting .input-table > tbody > tr > .second{width:200px;}.jimu-widget-mylocation-setting .input-table > tbody > tr > .third{width:35px;}",
'*now':function(r){r(['dojo/i18n!*preload*widgets/MyLocation/setting/nls/Setting*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]']);}
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
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/Message',
    'dijit/form/NumberTextBox',
    'jimu/dijit/CheckBox'
  ],
  function(declare,
           _WidgetsInTemplateMixin,
           BaseWidgetSetting,
           Message) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-mylocation-setting',

      startup: function() {
        this.inherited(arguments);
        if (!this.config.locateButton) {
          this.config.locateButton = {};
        }
        if (!this.config.locateButton.geolocationOptions) {
          this.config.locateButton.geolocationOptions = {};
        }
        this.setConfig(this.config);
      },

      setConfig: function(config) {
        this.config = config;
        if (config.locateButton.geolocationOptions &&
          config.locateButton.geolocationOptions.timeout) {
          this.timeout.set('value', config.locateButton.geolocationOptions.timeout);
        }
        if (config.locateButton.highlightLocation ||
          typeof(config.locateButton.highlightLocation) === "undefined") {
          this.highlightLocation.setValue(true);
        } else {
          this.highlightLocation.setValue(false);
        }
        if (config.locateButton.useTracking ||
          typeof(config.locateButton.useTracking) === "undefined") {
          this.useTracking.setValue(true);
        } else {
          this.useTracking.setValue(false);
        }
        //set the scale to zoom , when location has been found
        if (config.locateButton.scale) {
          this.scale.set('value', config.locateButton.scale);
        }
      },

      getConfig: function() {
        if (!this.isValid()) {
          new Message({
            message: this.nls.warning
          });
          return false;
        }
        this.config.locateButton.geolocationOptions.timeout = parseInt(this.timeout.value, 10);
        //if (!this.config.locateButton.highlightLocation) {
        this.config.locateButton.highlightLocation = this.highlightLocation.checked;
        //}
        this.config.locateButton.useTracking = this.useTracking.checked;

        this.config.locateButton.scale = parseFloat(this.scale.value);
        return this.config;
      },

      isValid: function () {
        if (!this.scale.isValid() || !this.timeout.isValid()) {
          return false;
        }

        return true;
      }
    });
  });