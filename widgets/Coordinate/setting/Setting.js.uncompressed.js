// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'widgets/Coordinate/setting/Edit':function(){
///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2017 Esri. All Rights Reserved.
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
},
'jimu/SpatialReference/srUtils':function(){
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/request',
  'esri/SpatialReference',
  './unitUtils'
], function(
  declare,
  lang,
  array,
  Deferred,
  all,
  dojoRequest,
  SpatialReference,
  unitUtils
) {
  var spatialRefs = null,
    datumTrans = null;
  var _loaded = false;

  var mo = declare(null, function() {
    // nothing
  });

  var url = require.toUrl('jimu');
  var wkidDef = dojoRequest(url + '/SpatialReference/cs.json', {
    handleAs: "json"
  });
  var transformDef = dojoRequest(url + '/SpatialReference/transform.json', {
    handleAs: "json"
  });

  mo.loadResource = function() {
    var def = new Deferred();
    if (spatialRefs && datumTrans) {
      def.resolve();
      return def;
    }

    all([wkidDef, transformDef]).then(function(results) {
      spatialRefs = results[0];
      datumTrans = results[1];

      _loaded = true;
      def.resolve();
    }, function(err) {
      console.error(err);
      _loaded = false;
      def.reject(err);
    });

    return def;
  };

  mo.getAllCSUnits = function() {
    if (!_loaded) {
      return;
    }
    var units = [];
    array.forEach(spatialRefs.wkids, lang.hitch(this, function(wkid) {
      var unit = this.getCSUnit(wkid);
      if (array.indexOf(units, unit) === -1) {
        units.push(unit);
      }
    }));
    return units;
  };

  // Unit
  mo.convertUnit = function(sUnit, tUnit, num) {
    if (!_loaded) {
      return;
    }
    return unitUtils.convertUnit(sUnit, tUnit, num);
  };

  mo.getUnitRate = function(sUnit, tUnit) {
    if (!_loaded) {
      return;
    }
    return unitUtils.getUnitRate(sUnit, tUnit);
  };

  mo.isProjectUnit = function(unit) {
    if (!_loaded) {
      return;
    }
    return unitUtils.isProjectUnit(unit);
  };

  mo.isGeographicUnit = function(unit) {
    if (!_loaded) {
      return;
    }
    return unitUtils.isGeographicUnit(unit);
  };

  mo.getGeographicUnits = function() {
    if (!_loaded) {
      return;
    }
    return unitUtils.getGeographicUnits();
  };

  mo.getProjectUnits = function() {
    if (!_loaded) {
      return;
    }
    return unitUtils.getProjectUnits();
  };

  mo.getCSUnit = function(wkid) {
    if (!_loaded) {
      return;
    }
    var pos = array.indexOf(spatialRefs.wkids, wkid);
    return spatialRefs.units[pos];
  };

  // coordinate
  mo.isSameSR = function(tWkid, sWkid) {
    if (!_loaded) {
      return;
    }
    var idx = this.indexOfWkid(tWkid),
      idx2 = this.indexOfWkid(sWkid);
    return spatialRefs.labels[idx] === spatialRefs.labels[idx2];
  };

  mo.isValidWkid = function(wkid) {
    if (!_loaded) {
      return;
    }
    return this.indexOfWkid(wkid) > -1;
  };

  mo.getSRLabel = function(wkid) {
    if (!_loaded) {
      return;
    }
    if (this.isValidWkid(wkid)) {
      var i = this.indexOfWkid(wkid);
      return spatialRefs.labels[i];
    }
  };

  mo.indexOfWkid = function(wkid) {
    if (!_loaded) {
      return;
    }
    return array.indexOf(spatialRefs.wkids, wkid);
  };

  mo.isWebMercator = function(wkid) {
    // true if this spatial reference is web mercator
    if (SpatialReference.prototype._isWebMercator) {
      return SpatialReference.prototype._isWebMercator.apply({
        wkid: parseInt(wkid, 10)
      }, []);
    } else {
      var sr = new SpatialReference(parseInt(wkid, 10));
      return sr.isWebMercator();
    }
  };

  mo.standardizeWkid = function(wkid) {
    return this.isWebMercator(wkid) ? 3857 : parseInt(wkid, 10);
  };

  mo.isValidTfWkid = function(tfWkid) {
    if (!_loaded) {
      return;
    }
    return this.indexOfTfWkid(tfWkid) > -1;
  };

  mo.getTransformationLabel = function(tfWkid) {
    if (!_loaded) {
      return;
    }
    if (this.isValidTfWkid(tfWkid)) {
      var i = this.indexOfTfWkid(tfWkid);
      return datumTrans.labels[i];
    }
    return "";
  };

  mo.indexOfTfWkid = function(tfWkid) {
    if (!_loaded) {
      return;
    }
    return array.indexOf(datumTrans.tfWkids, tfWkid);
  };

  mo.isGeographicCS = function(wkid) {
    if (!_loaded) {
      return;
    }
    if (this.isValidWkid(wkid)) {
      var pos = this.indexOfWkid(wkid);
      return !spatialRefs.projSR[pos];
    }

    return false;
  };

  mo.isProjectedCS = function(wkid) {
    if (!_loaded) {
      return;
    }
    if (this.isValidWkid(wkid)) {
      var pos = this.indexOfWkid(wkid);
      return spatialRefs.projSR[pos];
    }

    return false;
  };

  mo.getGeoCSByProj = function(wkid) {
    if (!_loaded) {
      return;
    }
    if (!this.isProjectedCS(wkid)) {
      return;
    }
    var pos = this.indexOfWkid(wkid);
    return spatialRefs.spheroids[pos];
  };

  mo.getSpheroidStr = function(wkid) {
    if (!_loaded) {
      return;
    }
    if (this.isGeographicCS(wkid)) {
      return spatialRefs.labels[this.indexOfWkid(wkid)];
    } else if (this.isProjectedCS(wkid)) {
      var gWkid = mo.getGeoCSByProj(wkid);
      return spatialRefs.labels[this.indexOfWkid(gWkid)];
    }

    return null;
  };

  mo.isSameSpheroid = function(tWkid, sWkid) {
    if (!_loaded) {
      return;
    }
    var tSpheroid = this.getSpheroidStr(tWkid),
      sSpheroid = this.getSpheroidStr(sWkid);

    if (tSpheroid && sSpheroid && tSpheroid === sSpheroid) {
      return true;
    }

    return false;
  };

  return mo;
});
},
'widgets/Coordinate/setting/_build-generate_module':function(){
define(["dojo/text!./Setting.html",
"dojo/text!./css/style.css",
"dojo/i18n!./nls/strings"], function(){});
},
'url:widgets/Coordinate/setting/Edit.html':"  <div style=\"width:100%\">\r\n    <div class=\"output-wkid edit-module\" data-dojo-attach-point=\"outputDiv\">\r\n      <table cellspacing=\"0\">\r\n        <tbody>\r\n          <tr>\r\n            <td>\r\n              <div class=\"wkid-header\">\r\n                <span>${nls.output}</span>\r\n                <a href=\"https://developers.arcgis.com/javascript/jshelp/ref_coordsystems.html\" target=\"blank\">WKID</a>\r\n              </div>\r\n            </td>\r\n          </tr>\r\n          <tr>\r\n            <td>\r\n              <input type=\"text\" data-dojo-type=\"dijit/form/ValidationTextBox\" required=\"true\"\r\n            placeHolder=\"WKID\" data-dojo-attach-event=\"onChange:onWkidChange\"\r\n            data-dojo-attach-point=\"wkid\" data-dojo-props='style:{width:\"100%\"}' />\r\n            </td>\r\n          </tr>\r\n          <tr>\r\n            <td>\r\n              <span class=\"wkid-label\" data-dojo-attach-point=\"wkidLabel\">${nls.cName}</span>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n    <div class=\"display-units edit-module\" data-dojo-attach-point=\"displayUnits\">\r\n      <table cellspacing=\"0\">\r\n        <tbody>\r\n          <tr>\r\n            <td class=\"display\">\r\n              <span>${nls.units}</span>\r\n            </td>\r\n            <td class=\"units\">\r\n              <select data-dojo-attach-point=\"outputUnit\" data-dojo-props='style:{width:\"462px\"}' data-dojo-type=\"dijit/form/Select\">\r\n                <option value=\"\">${nls.Default}</option>\r\n                <option type=\"separator\"></option>\r\n                <option value=\"INCHES\">${nls.Inches}</option>\r\n                <option value=\"FOOT\">${nls.Foot}</option>\r\n                <option value=\"YARDS\">${nls.Yards}</option>\r\n                <option value=\"MILES\">${nls.Miles}</option>\r\n                <option value=\"NAUTICAL_MILES\">${nls.Nautical_Miles}</option>\r\n                <option value=\"MILLIMETERS\">${nls.Millimeters}</option>\r\n                <option value=\"CENTIMETERS\">${nls.Centimeters}</option>\r\n                <option value=\"METER\">${nls.Meter}</option>\r\n                <option value=\"KILOMETERS\">${nls.Kilometers}</option>\r\n                <option value=\"DECIMETERS\">${nls.Decimeters}</option>\r\n                <option type=\"separator\"></option>\r\n                <option value=\"DECIMAL_DEGREES\">${nls.Decimal_Degrees}</option>\r\n                <option value=\"DEGREE_MINUTE_SECONDS\">${nls.Degree_Minutes_Seconds}</option>\r\n                <option type=\"separator\"></option>\r\n                <option value=\"MGRS\">${nls.MGRS}</option>\r\n                <option value=\"USNG\">${nls.USNG}</option>\r\n              </select>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n    <div data-dojo-attach-point=\"enhanceVersionDiv\">\r\n      <div class=\"datum-wkid edit-module\" data-dojo-attach-point=\"transformDiv\">\r\n        <table cellspacing=\"0\">\r\n          <tbody>\r\n            <tr>\r\n              <td>\r\n                <div class=\"wkid-header\">\r\n                  <span>${nls.datum}</span>\r\n                  <a href=\"http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000r8000000\" target=\"blank\">TFWKID</a>\r\n                </div>\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>\r\n                <input type=\"text\" data-dojo-type=\"dijit/form/ValidationTextBox\" required=\"true\" placeHolder=\"${nls.tWKIDPlaceHolder}\"\r\n              data-dojo-attach-point=\"transformationWkid\" data-dojo-attach-event=\"onChange:ontfWkidChange\" data-dojo-props='style:{width:\"100%\"}' />\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>\r\n                <span class=\"wkid-label\" data-dojo-attach-point=\"transformationLabel\">${nls.tName}</span>\r\n              </td>\r\n            </tr>\r\n          </tbody>\r\n        </table>\r\n        <div class=\"check\" data-dojo-attach-point=\"transformForward\"></div>\r\n      </div>\r\n    </div>\r\n    <div class=\"older-version\" data-dojo-attach-point=\"olderVersionDiv\">${nls.olderVersion}</div>\r\n  </div>",
'url:widgets/Coordinate/setting/Setting.html':"<div class=\"jimu-widget-coordinate-setting\">\r\n  <div class=\"settings-section\" data-dojo-attach-point=\"searchesSection\">\r\n    <p>${nls.state}</p>\r\n    <div class=\"add-output-coordinate\" data-dojo-attach-event=\"onclick: onAddClick\">\r\n      <span class=\"add-output-coordinate-icon\"></span>\r\n      <span class=\"add-output-coordinate-label\">${nls.add}</span>\r\n    </div>\r\n    <div class=\"coordinate-table\" data-dojo-attach-point=\"tableCoordinate\"></div>\r\n    <div data-dojo-attach-point=\"displayNumber\" class=\"display-number\">\r\n      <div>\r\n        <span class=\"spinner-label ops-label\">${nls.spinnerLabel}</span>\r\n        <input type=\"text\" data-dojo-type=\"dijit/form/NumberSpinner\" value=\"3\" data-dojo-attach-point=\"latLonDecimalPlaces\" data-dojo-props=\"constraints: {min:0}\">\r\n        <span class=\"demical-place\">${nls.decimalPlace}</span>\r\n      </div>\r\n      <div class=\"decimal-row\">\r\n        <span class=\"decimal-label ops-label\">${nls.eyeDecimalLabel}</span>\r\n        <input type=\"text\" data-dojo-type=\"dijit/form/NumberSpinner\" value=\"3\" data-dojo-attach-point=\"eyeDecimalPlaces\" data-dojo-props=\"constraints: {min:0}\">\r\n        <span class=\"demical-place\">${nls.decimalPlace}</span>\r\n      </div>\r\n      <div class=\"separator\">\r\n        <div class=\"check\" data-dojo-attach-point=\"separator\"></div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"displayOrder\">\r\n      <span class=\"jimu-float-leading displayOrderTips\">${nls.displayOrderLonLatTips}</span>\r\n      <span class=\"order\">\r\n        <div class=\"jimu-float-leading order-btn\">\r\n          <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"lonLat\" data-dojo-props=\"group:'displayOrderLonLat'\"></div>\r\n          <label>${nls.lonLatTips}</label>\r\n        </div>\r\n        <div class=\"jimu-float-leading order-btn\">\r\n          <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"latLon\" data-dojo-props=\"group:'displayOrderLonLat'\"></div>\r\n          <label>${nls.latLonTips}</label>\r\n        </div>\r\n      </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
'url:widgets/Coordinate/setting/css/style.css':".jimu-widget-coordinate-setting{margin:0; padding:0; font-size: 14px; padding-top: 20px; color: #596679;}.jimu-widget-coordinate-setting .dijitSelect{height: 30px; width: 100%;}.jimu-widget-coordinate-setting .dijitArrowButtonContainer{width: 17px;}.jimu-widget-coordinate-setting .zoom-scale-table{margin-top:12px;}.jimu-widget-coordinate-setting .settings-section p{font-size: 14px; margin-bottom: 20px;}.jimu-widget-coordinate-setting .add-output-coordinate{margin-bottom: 7px; cursor: pointer; display: inline-block;}.jimu-widget-coordinate-setting .add-output-coordinate-icon{background-image: url(images/add_icon.png); background-repeat: no-repeat; background-position: center; width: 14px; height: 14px; display: inline-block; vertical-align: middle;}.jimu-widget-coordinate-setting .add-output-coordinate-label{font-size: 14px; color: #518dca; margin-left: 10px; display: inline-block; height: 100%; text-decoration: underline;}.jimu-widget-coordinate-setting .wkid, .jimu-widget-coordinate-setting .transformationWkid,.jimu-widget-coordinate-setting .actions{width: 120px;}.jimu-widget-coordinate-setting .coordinate-table{height: 186px;}.jimu-widget-coordinate-setting .display-number,.jimu-widget-coordinate-setting .separator{margin-top: 10px;}.jimu-widget-coordinate-setting .display-number .decimal-row{margin-top: 8px;}.jimu-widget-coordinate-setting .display-number .ops-label{min-width: 150px; display: inline-block;}.jimu-widget-coordinate-setting .display-number .dijitNumberTextBox {width: 70px;}.jimu-coordinate-edit{width: 100%; font-size: 16px; color: #596679;}.jimu-coordinate-edit table{width: 100%;}.jimu-coordinate-edit .wkid-header{margin: 0 0 10px;}.jimu-coordinate-edit .check{margin-top: 10px;}.jimu-coordinate-edit .label{font-size: 14px;}.jimu-coordinate-edit .wkid-label{font-size: 14px; font-style: italic; color: #a0acbf; width: 100%; display: inline-block; margin-top: 5px;}.jimu-coordinate-edit .edit-module{margin-bottom: 10px;}.jimu-coordinate-edit .edit-module:last-child{margin-bottom: 0;}.jimu-coordinate-edit .display-units .display{width: 20%;}.jimu-coordinate-edit .older-version{font-size: 14px; font-style: italic; color: #e84b4b;}.jimu-widget-coordinate-setting{width:100%; height:100%;}.jimu-widget-coordinate-setting .displayOrder{margin-top: 16px;}.jimu-widget-coordinate-setting .displayOrder .displayOrderTips{margin-right: 10px;}.jimu-rtl .jimu-widget-coordinate-setting .displayOrder .displayOrderTips{margin-left: 10px; margin-right: auto;}.jimu-widget-coordinate-setting .displayOrder .jimu-radio {border: 1px solid #ccc; vertical-align: top;}.jimu-widget-coordinate-setting .displayOrder .jimu-radio-checked .jimu-radio-inner {width: 6px; height: 6px; margin: 4px; border-radius: 50%; background-color: #24B5CC;}.jimu-widget-coordinate-setting .displayOrder .order-btn{margin: 0 10px 0 10px;}",
'*now':function(r){r(['dojo/i18n!*preload*widgets/Coordinate/setting/nls/Setting*["ar","bs","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]']);}
}});
///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2017 Esri. All Rights Reserved.
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
    'dojo/_base/html',
    'dojo/on',
    'dojo/aspect',
    'dojo/query',
    'dojo/keys',
    'dojo/json',
    //'esri/request',
    'esri/request',
    'jimu/BaseWidgetSetting',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/dijit/SimpleTable',
    'jimu/dijit/Message',
    'jimu/dijit/Popup',
    'jimu/dijit/CheckBox',
    'jimu/dijit/LoadingShelter',
    'jimu/portalUtils',
    './Edit',
    "jimu/SpatialReference/srUtils",
    'dojo/NodeList-dom',
    'dijit/form/NumberSpinner',
    'dijit/form/NumberTextBox',
    'jimu/dijit/RadioBtn'
  ],
  function(
    declare,
    lang,
    html,
    on,
    aspect,
    query,
    keys,
    dojoJSON,
    esriRequest,
    BaseWidgetSetting,
    _WidgetsInTemplateMixin,
    Table,
    Message,
    Popup,
    CheckBox,
    LoadingShelter,
    portalUtils,
    Edit,
    utils) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      /*global esriConfig*/
      baseClass: 'jimu-widget-coordinate-setting',
      edit: null,
      popup: null,
      popupState: "", // ADD or EDIT
      editTr: null,
      gsVersion: 0,

      postCreate: function() {
        this.inherited(arguments);

        this.separator = new CheckBox({
          label: this.nls.separator,
          checked: false
        }, this.separator);

        this.shelter1 = new LoadingShelter({
          hidden: true
        });
        this.shelter1.placeAt(this.domNode);
        this.shelter1.startup();

        this.shelter2 = new LoadingShelter({
          hidden: true
        });
        this.shelter2.placeAt(this.domNode);
        this.shelter2.startup();
      },

      startup: function() {
        this.inherited(arguments);

        var fields = [{
          name: 'id',
          title: this.nls.id,
          type: 'text',
          unique: true,
          hidden: true,
          editable: false
        }, {
          name: 'wkid',
          title: this.nls.wkid,
          type: 'text',
          'class': "wkid",
          hidden: true,
          editable: false
        }, {
          name: 'label',
          title: this.nls.label,
          type: 'text',
          editable: false
        }, {
          name: 'outputUnit',
          title: this.nls.output,
          type: 'text',
          hidden: true,
          editable: false
        }, {
          name: 'transformationWkid',
          title: this.nls.transformationWkid,
          type: 'text',
          'class': 'transformationWkid',
          editable: false,
          hidden: true
        }, {
          name: 'transformationLabel',
          title: this.nls.transformationLabel,
          type: 'text',
          editable: false,
          hidden: true
        }, {
          name: 'transformForward',
          title: this.nls.transformForward,
          type: 'checkbox',
          editable: false,
          hidden: true
        }, {
          name: 'options',
          title: 'options',
          type: 'text',
          editable: false,
          hidden: true
        }, {
          name: 'actions',
          title: this.nls.actions,
          type: 'actions',
          'class': "actions",
          actions: ['edit', 'up', 'down', 'delete']
        }];
        var args = {
          autoHeight: false,
          fields: fields,
          selectable: false
        };
        this.outputCoordinateTable = new Table(args);
        html.setStyle(this.outputCoordinateTable.domNode, 'height', '100%');
        this.outputCoordinateTable.placeAt(this.tableCoordinate);
        this.outputCoordinateTable.startup();

        this.own(on(this.outputCoordinateTable, 'actions-edit', lang.hitch(this, 'onEditClick')));
        this.setConfig(this.config);

        this._initOrderLonLatRadioBtns();

        this._getGeometryServiceVersion();
      },

      setConfig: function(config) {
        this.config = config;
        this.outputCoordinateTable.clear();

        this.shelter1.show();
        utils.loadResource().then(lang.hitch(this, function() {
          if (config.spatialReferences && config.spatialReferences.length) {
            var json = [];
            var len = config.spatialReferences.length;
            for (var i = 0; i < len; i++) {
              var wkid = parseInt(config.spatialReferences[i].wkid, 10);
              json.push({
                id: i,
                wkid: utils.standardizeWkid(wkid),
                label: config.spatialReferences[i].label,
                outputUnit: config.spatialReferences[i].outputUnit,
                transformationWkid: config.spatialReferences[i].transformationWkid,
                transformationLabel: config.spatialReferences[i].transformationLabel,
                transformForward: config.spatialReferences[i].transformForward,
                options: dojoJSON.stringify(config.spatialReferences[i].options)
              });
            }
            this.outputCoordinateTable.addRows(json);
          } else {
            //there is no config before, get map spatialReference as default
            this._addMapCoordinate();
          }
        }), lang.hitch(this, function(err) {
          console.error(err);
        })).always(lang.hitch(this, function() {
          this.shelter1.hide();
        }));

        if (isFinite(parseInt(config.latLonDecimalPlaces, 10))) {
          this.latLonDecimalPlaces.set('value', parseInt(config.latLonDecimalPlaces, 10));
        }
        if (isFinite(parseInt(config.eyeDecimalPlaces, 10))) {
          this.eyeDecimalPlaces.set('value', parseInt(config.eyeDecimalPlaces, 10));
        }

        if (config.addSeparator) {
          this.separator.setValue(config.addSeparator);
        }
      },

      _getGeometryServiceVersion: function() {
        this.shelter2.show();
        if (esriConfig.defaults.geometryService && esriConfig.defaults.geometryService.url) {
          var gsUrl = esriConfig.defaults.geometryService.url;
          var services = gsUrl.slice(0, gsUrl.indexOf('/Geometry/'));
          esriRequest({
            url: services,
            handleAs: "json",
            callbackParamName: "callback",
            content: {
              f: "json"
            }
          }).then(lang.hitch(this, function(response) {
            console.log(response);
            if (response && response.currentVersion) {
              this.gsVersion = parseFloat(response.currentVersion);
            }
          }), lang.hitch(this, function(err) {
            console.error(err);
          })).always(lang.hitch(this, function() {
            this.shelter2.hide();
          }));
        } else {
          this.shelter2.hide();
          new Message({
            message: this.nls.getVersionError
          });
        }
      },

      _addMapCoordinate: function() {
        var mapWkid = this.sceneView.spatialReference.wkid;
        portalUtils.getUnits(this.appConfig.portalUrl).then(lang.hitch(this, function(units) {
          if (utils.isValidWkid(mapWkid)) {
            var item = {
              wkid: utils.standardizeWkid(mapWkid),
              label: utils.getSRLabel(parseInt(mapWkid, 10))
            };

            if (utils.isProjectedCS(item.wkid)) {
              item.outputUnit = units === "english" ? "FOOT" : "METER";
            } else {
              item.outputUnit = item.outputUnit || utils.getCSUnit(item.wkid);
            }

            var _options = {
              sameSRWithMap: utils.isSameSR(item.wkid, this.sceneView.spatialReference.wkid),
              isGeographicCS: utils.isGeographicCS(item.wkid),
              isGeographicUnit: utils.isGeographicUnit(item.outputUnit),
              isProjectedCS: utils.isProjectedCS(item.wkid),
              isProjectUnit: utils.isProjectUnit(item.outputUnit),
              spheroidCS: utils.isProjectedCS(item.wkid) ?
                utils.getGeoCSByProj(item.wkid) : item.wkid,
              defaultUnit: utils.getCSUnit(item.wkid),
              unitRate: utils.getUnitRate(utils.getCSUnit(item.wkid), item.outputUnit)
            };

            //default show mercator is degrees.
            if (this.sceneView.spatialReference.isWebMercator){
              _options.isGeographicUnit = true;
              _options.isProjectUnit = false;
              _options.unitRate = 1;
              item.outputUnit = "DECIMAL_DEGREES";
            }
            item.options = dojoJSON.stringify(_options);
            this.outputCoordinateTable.addRow(item);
          }
        }));
      },

      _keepDefaultOnlyEdit: function() {
        var pSelector = "." + this.baseClass + " .body-section tr[rowid=row1]",
          row = query(pSelector)[0];

        query('.action-item', row).style('display', 'none');
        query('.row-edit-div', row).style('display', 'block');

        aspect.after(this.outputCoordinateTable, 'onBeforeRowUp', lang.hitch(this, function(tr) {
          if (query(".body-section .simple-table-row")[1] === tr) {
            return false;
          }
        }), true);
      },

      onAddClick: function() {
        this.popupState = "ADD";
        this._openEdit(this.nls.add, {});
      },

      onEditClick: function(tr) {
        var cs = this.outputCoordinateTable.getRowData(tr);
        this.popupState = "EDIT";
        this.editTr = tr;
        this._openEdit(this.nls.edit, cs);
      },

      _openEdit: function(title, config) {
        this.edit = new Edit({
          version: this.gsVersion,
          sceneView:this.sceneView,
          nls: this.nls
        });
        // this.edit.setConfig(config || {});
        this.popup = new Popup({
          titleLabel: title,
          autoHeight: true,
          content: this.edit,
          container: 'main-page',
          width: 640,
          buttons: [{
            label: this.nls.ok,
            key: keys.ENTER,
            disable: true,
            onClick: lang.hitch(this, '_onEditOk')
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            key: keys.ESCAPE
          }],
          onClose: lang.hitch(this, '_onEditClose')
        });
        this.edit.setConfig(config || {});
        html.addClass(this.popup.domNode, 'widget-setting-popup');
        this.edit.startup();
      },

      _onEditOk: function() {
        var json = this.edit.getConfig(),
          editResult = null;

        json.wkid = utils.standardizeWkid(json.wkid);
        json.options = dojoJSON.stringify(json.options);

        if (this.popupState === "ADD") {
          editResult = this.outputCoordinateTable.addRow(json);
        } else if (this.popupState === "EDIT") {
          editResult = this.outputCoordinateTable.editRow(this.editTr, json);
        }

        if (editResult.success) {
          this.popup.close();
          this.popupState = "";
          this.editTr = null;
        } else {
          // var repeatTitles = array.map(
          //   editResult.repeatFields,
          //   lang.hitch(this, function(field) {
          //     return field && field.title;
          //   }));
          new Message({
            message: json.wkid + this.nls[editResult.errorCode]
          });
        }
      },

      _onEditClose: function() {
        this.edit = null;
        this.popup = null;
      },

      getConfig: function() {
        var data = this.outputCoordinateTable.getData();
        var json = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
          delete data[i].id;
          data[i].options = dojoJSON.parse(data[i].options);
          json.push(data[i]);
        }
        this.config.spatialReferences = json;

        this.config.latLonDecimalPlaces = this.latLonDecimalPlaces.get('value');
        this.config.eyeDecimalPlaces = this.eyeDecimalPlaces.get('value');

        this.config.addSeparator = this.separator.getValue();

        return this.config;
      },
      _initOrderLonLatRadioBtns: function() {
        this.own(on(this.lonLat, 'click', lang.hitch(this, function() {
          this.config.displayOrderLonLat = true;
        })));
        this.own(on(this.latLon, 'click', lang.hitch(this, function() {
          this.config.displayOrderLonLat = false;
        })));
        if (this.config.displayOrderLonLat) {
          this._selectRadioBtnItem("lonLat");
          this.config.displayOrderLonLat = true;
        } else {
          this._selectRadioBtnItem("latLon");
          this.config.displayOrderLonLat = false;
        }
      },
      _selectRadioBtnItem: function(name) {
        var _radio = this[name];
        if (_radio && _radio.check) {
          _radio.check(true);
        }
      }
    });
  });