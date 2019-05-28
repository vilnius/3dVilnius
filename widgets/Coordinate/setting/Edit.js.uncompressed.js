// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'url:widgets/Coordinate/setting/Edit.html':"  <div style=\"width:100%\">\r\n    <div class=\"output-wkid edit-module\" data-dojo-attach-point=\"outputDiv\">\r\n      <table cellspacing=\"0\">\r\n        <tbody>\r\n          <tr>\r\n            <td>\r\n              <div class=\"wkid-header\">\r\n                <span>${nls.output}</span>\r\n                <a href=\"https://developers.arcgis.com/javascript/jshelp/ref_coordsystems.html\" target=\"blank\">WKID</a>\r\n              </div>\r\n            </td>\r\n          </tr>\r\n          <tr>\r\n            <td>\r\n              <input type=\"text\" data-dojo-type=\"dijit/form/ValidationTextBox\" required=\"true\"\r\n            placeHolder=\"WKID\" data-dojo-attach-event=\"onChange:onWkidChange\"\r\n            data-dojo-attach-point=\"wkid\" data-dojo-props='style:{width:\"100%\"}' />\r\n            </td>\r\n          </tr>\r\n          <tr>\r\n            <td>\r\n              <span class=\"wkid-label\" data-dojo-attach-point=\"wkidLabel\">${nls.cName}</span>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n    <div class=\"display-units edit-module\" data-dojo-attach-point=\"displayUnits\">\r\n      <table cellspacing=\"0\">\r\n        <tbody>\r\n          <tr>\r\n            <td class=\"display\">\r\n              <span>${nls.units}</span>\r\n            </td>\r\n            <td class=\"units\">\r\n              <select data-dojo-attach-point=\"outputUnit\" data-dojo-props='style:{width:\"462px\"}' data-dojo-type=\"dijit/form/Select\">\r\n                <option value=\"\">${nls.Default}</option>\r\n                <option type=\"separator\"></option>\r\n                <option value=\"INCHES\">${nls.Inches}</option>\r\n                <option value=\"FOOT\">${nls.Foot}</option>\r\n                <option value=\"YARDS\">${nls.Yards}</option>\r\n                <option value=\"MILES\">${nls.Miles}</option>\r\n                <option value=\"NAUTICAL_MILES\">${nls.Nautical_Miles}</option>\r\n                <option value=\"MILLIMETERS\">${nls.Millimeters}</option>\r\n                <option value=\"CENTIMETERS\">${nls.Centimeters}</option>\r\n                <option value=\"METER\">${nls.Meter}</option>\r\n                <option value=\"KILOMETERS\">${nls.Kilometers}</option>\r\n                <option value=\"DECIMETERS\">${nls.Decimeters}</option>\r\n                <option type=\"separator\"></option>\r\n                <option value=\"DECIMAL_DEGREES\">${nls.Decimal_Degrees}</option>\r\n                <option value=\"DEGREE_MINUTE_SECONDS\">${nls.Degree_Minutes_Seconds}</option>\r\n                <option type=\"separator\"></option>\r\n                <option value=\"MGRS\">${nls.MGRS}</option>\r\n                <option value=\"USNG\">${nls.USNG}</option>\r\n              </select>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n    <div data-dojo-attach-point=\"enhanceVersionDiv\">\r\n      <div class=\"datum-wkid edit-module\" data-dojo-attach-point=\"transformDiv\">\r\n        <table cellspacing=\"0\">\r\n          <tbody>\r\n            <tr>\r\n              <td>\r\n                <div class=\"wkid-header\">\r\n                  <span>${nls.datum}</span>\r\n                  <a href=\"http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000r8000000\" target=\"blank\">TFWKID</a>\r\n                </div>\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>\r\n                <input type=\"text\" data-dojo-type=\"dijit/form/ValidationTextBox\" required=\"true\" placeHolder=\"${nls.tWKIDPlaceHolder}\"\r\n              data-dojo-attach-point=\"transformationWkid\" data-dojo-attach-event=\"onChange:ontfWkidChange\" data-dojo-props='style:{width:\"100%\"}' />\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>\r\n                <span class=\"wkid-label\" data-dojo-attach-point=\"transformationLabel\">${nls.tName}</span>\r\n              </td>\r\n            </tr>\r\n          </tbody>\r\n        </table>\r\n        <div class=\"check\" data-dojo-attach-point=\"transformForward\"></div>\r\n      </div>\r\n    </div>\r\n    <div class=\"older-version\" data-dojo-attach-point=\"olderVersionDiv\">${nls.olderVersion}</div>\r\n  </div>"}});
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
define(
  ['dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/array',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/CheckBox',
    'dojo/text!./Edit.html',
    "jimu/SpatialReference/srUtils",
    'dijit/form/ValidationTextBox',
    'dijit/form/Select'
  ],
  function(
    declare,
    lang,
    html,
    array,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    CheckBox,
    template,
    utils
  ) {
    var options = [{
      "value": "",
      "label": "Default",
      "selected": true,
      "disabled": false
    }, {
      "value": "",
      "label": "",
      "selected": true,
      "disabled": false
    }, {
      "value": "INCHES",
      "label": "Inches",
      "selected": false,
      "disabled": false
    }, {
      "value": "FOOT",
      "label": "Foot",
      "selected": false,
      "disabled": false
    }, {
      "value": "YARDS",
      "label": "Yards",
      "selected": false,
      "disabled": false
    }, {
      "value": "MILES",
      "label": "Miles",
      "selected": false,
      "disabled": false
    }, {
      "value": "NAUTICAL_MILES",
      "label": "Nautical_Miles",
      "selected": false,
      "disabled": false
    }, {
      "value": "MILLIMETERS",
      "label": "Millimeters",
      "selected": false,
      "disabled": false
    }, {
      "value": "CENTIMETERS",
      "label": "Centimeters",
      "selected": false,
      "disabled": false
    }, {
      "value": "METER",
      "label": "Meter",
      "selected": false,
      "disabled": false
    }, {
      "value": "KILOMETERS",
      "label": "Kilometers",
      "selected": false,
      "disabled": false
    }, {
      "value": "DECIMETERS",
      "label": "Decimeters",
      "selected": false,
      "disabled": false
    }, {
      "value": "",
      "label": "",
      "selected": true,
      "disabled": false
    }, {
      "value": "DECIMAL_DEGREES",
      "label": "Decimal_Degrees",
      "selected": false,
      "disabled": false
    }, {
      "value": "DEGREE_MINUTE_SECONDS",
      "label": "Degree_Minutes_Seconds",
      "selected": false,
      "disabled": false
    }, {
      "value": "",
      "label": "",
      "selected": true,
      "disabled": false
    }, {
      "value": "MGRS",
      "label": "MGRS",
      "selected": false,
      "disabled": false
    }, {
      "value": "USNG",
      "label": "USNG",
      "selected": false,
      "disabled": false
    }];

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: "jimu-coordinate-edit",
      templateString: template,
      currentWkid: null,
      version: null,
      enhanceVersion: 10.1, // support transform wkid
      _config: null,

      postCreate: function() {
        this.inherited(arguments);

        this.transformForward = new CheckBox({
          label: this.nls.forward,
          checked: false
        }, this.transformForward);

        if (this.version < this.enhanceVersion) {
          html.setStyle(this.olderVersionDiv, "display", "block");
          html.setStyle(this.enhanceVersionDiv, "display", "none");
        } else {
          html.setStyle(this.olderVersionDiv, "display", "none");
          html.setStyle(this.enhanceVersionDiv, "display", "block");
        }

        html.setStyle(this.transformDiv, "display", "none");
        html.setStyle(this.transformForward.domNode, "display", "none");

        this.wkid.set('missingMessage', this.nls.warning);
        this.transformationWkid.set('missingMessage', this.nls.tfWarning);
      },

      setConfig: function(config) {
        this._config = lang.clone(config);

        utils.loadResource().then(lang.hitch(this, function() {
          if (config.wkid) {
            this.wkid.set('value', parseInt(config.wkid, 10));
            this.currentWkid = parseInt(config.wkid, 10);

            this._adjustUnitOption();
          }
          if (config.label) {
            this.wkidLabel.innerHTML = config.label;
          }
          if (config.outputUnit) {
            this.outputUnit.set('value', config.outputUnit);
          }
          if (config.transformationWkid) {
            this.transformationWkid.set('value', parseInt(config.transformationWkid, 10));
          }
          if (config.transformationLabel) {
            this.transformationLabel.innerHTML = config.transformationLabel;
          }
          if (config.transformForward) {
            this.transformForward.setValue(config.transformForward);
          }
        }), lang.hitch(this, function(err) {
          console.error(err);
        }));
      },

      getConfig: function() {
        var cs = {
          wkid: utils.standardizeWkid(this.wkid.get('value')),
          label: this.wkidLabel.innerHTML,
          outputUnit: this.outputUnit.get('value'),
          transformationWkid: parseInt(this.transformationWkid.get('value'), 10),
          transformationLabel: this.transformationLabel.innerHTML,
          transformForward: this.transformForward.getValue()
        };
        cs.outputUnit = cs.outputUnit || utils.getCSUnit(cs.wkid);
        var _options = {
          sameSRWithMap: utils.isSameSR(cs.wkid, this.sceneView.spatialReference.wkid),
          isGeographicCS: utils.isGeographicCS(cs.wkid),
          isGeographicUnit: utils.isGeographicUnit(cs.outputUnit),
          isProjectedCS: utils.isProjectedCS(cs.wkid),
          isProjectUnit: utils.isProjectUnit(cs.outputUnit),
          spheroidCS: utils.isProjectedCS(cs.wkid) ? utils.getGeoCSByProj(cs.wkid) : cs.wkid,
          defaultUnit: utils.getCSUnit(cs.wkid),
          unitRate: utils.getUnitRate(utils.getCSUnit(cs.wkid), cs.outputUnit)
        };

        if (_options.isGeographicUnit && _options.isProjectedCS) { // use spheroidCS unit
          _options.unitRate = 1;
        }
        cs.options = _options;
        // console.log(cs);
        return cs;
      },

      _removeGeoUnits: function() {
        array.forEach(utils.getGeographicUnits(), lang.hitch(this, function(unit) {
          this.outputUnit.removeOption(unit);
        }));
      },

      _removeProjUnits: function() {
        array.forEach(utils.getProjectUnits(), lang.hitch(this, function(unit) {
          this.outputUnit.removeOption(unit);
        }));
      },

      _removeAllUnits: function() {
        for (var i = 0, len = options.length; i < len; i++) {
          this.outputUnit.removeOption(options[i].value);
        }
      },

      _addAllUnits: function() {
        for (var i = 0, len = options.length; i < len; i++) {
          // options[i].label = this.nls[options[i].label];
          var _option = lang.clone(options[i]);
          _option.label = this.nls[options[i].label];
          this.outputUnit.addOption(_option);
        }
      },

      _adjustUnitOption: function() { // display unit by cs
        if (this.currentWkid === this.sceneView.spatialReference.wkid) { // realtime
          var isSpecialCS = utils.isWebMercator(this.currentWkid);
          if (isSpecialCS) {
            return;
          } else if (this.currentWkid === 4326) {
            this._removeProjUnits();
          } else if (utils.isGeographicCS(this.currentWkid)) {
            this._removeProjUnits();
          } else if (utils.isProjectedCS(this.currentWkid)) {
            this._removeGeoUnits();
            this.outputUnit.removeOption("USNG");
            this.outputUnit.removeOption("MGRS");
          }
        } else if (utils.isGeographicCS(this.currentWkid)) {
          this._removeProjUnits();
        }

        if (this._config.outputUnit) {
          this.outputUnit.set('value', this._config.outputUnit);
        }
      },

      _isDefaultSR: function() {
        var wkid = this.wkid.get('value'),
          defaultWkid = this.sceneView.spatialReference.wkid;
        return utils.isSameSR(wkid, defaultWkid);
      },

      onWkidChange: function(newValue) {
        var label = "",
          newWkid = parseInt(newValue, 10);

        this.popup.disableButton(0);

        if (utils.isValidWkid(newWkid)) {
          label = utils.getSRLabel(newWkid);
          this.wkidLabel.innerHTML = label;

          // same spheroid doesn't need transformation
          if (utils.isSameSpheroid(newWkid, this.sceneView.spatialReference.wkid)) {
            this.transformationWkid.set('value', "");
            html.setStyle(this.transformDiv, 'display', 'none');
          } else {
            html.setStyle(this.transformDiv, 'display', 'block');
          }
          // this.wkid.set('value', newWkid);

          this.popup.enableButton(0);
        } else if (newValue) {
          this.wkid.set('value', "");
          this.wkidLabel.innerHTML = this.nls.cName;
        }
        if (this.currentWkid !== newWkid) {
          this.transformationWkid.set('value', "");
        }
        this.currentWkid = newWkid;

        this._removeAllUnits();
        this._addAllUnits();
        this._adjustUnitOption();
        this.outputUnit.closeDropDown();
      },

      ontfWkidChange: function(newValue) {
        if (newValue) {
          var tfid = "",
            label = "",
            newtfWkid = parseInt(newValue, 10);
          if (utils.isValidTfWkid(newtfWkid)) {
            tfid = newtfWkid;
            label = utils.getTransformationLabel(newtfWkid);
            this.transformationLabel.innerHTML = label;

            html.setStyle(this.transformForward.domNode, "display", "block");
          } else {
            this.transformationLabel.innerHTML = this.nls.tName;
            html.setStyle(this.transformForward.domNode, "display", "none");
          }
          this.transformationWkid.set('value', tfid);
        } else {
          this.transformationLabel.innerHTML = this.nls.tName;
          html.setStyle(this.transformForward.domNode, "display", "none");
        }
      }
    });
  });