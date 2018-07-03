// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'widgets/3DFx/setting/_build-generate_module':function(){
define(["dojo/text!./Setting.html",
"dojo/text!./css/style.css",
"dojo/i18n!./nls/strings"], function(){});
},
'url:widgets/3DFx/setting/Setting.html':"<div style=\"width:100%;height:100%;\">\r\n  <!-- Viz Settings -->\r\n  <div class=\"jimu-r-row\">\r\n    <div class=\"label\" style=\"padding-top:0px;font-weight: bold;\">\r\n      ${nls.viz_settings}\r\n    </div>\r\n    <hr />\r\n  </div>\r\n  <div class=\"jimu-r-row\">\r\n    <div class=\"col-1-4\">\r\n      <span class=\"label\">${nls.viz_type}: </span>\r\n    </div>\r\n    <div class=\"col-3-4\">\r\n      <select data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"vizType\">\r\n        <option value=\"Bounce\" selected=\"selected\">${nls.bounce}</option>\r\n        <option value=\"PointExtrude\" selected=\"selected\">${nls.point_extrusion}</option>\r\n        <option value=\"Pulse\" selected=\"selected\">${nls.pulse}</option>\r\n        <!--<option value=\"GridSurface\" selected=\"selected\">${nls.grid_surface}</option>-->\r\n        <option value=\"Fireball\" selected=\"selected\">${nls.fireball}</option>\r\n        <option value=\"JetTrail\" selected=\"selected\">${nls.jet_trail}</option>\r\n        <option value=\"AreaExtrude\" selected=\"selected\">${nls.area_extrusion}</option>\r\n      </select>\r\n    </div>\r\n  </div>\r\n  <div class=\"jimu-r-row\" style=\"padding-top:15px\">\r\n    <div class=\"col-2-3\">\r\n      <div class=\"col-1-2\">\r\n        <input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"showPercent\" title=\"${nls.show_percent}\" />\r\n        <span class=\"label\">${nls.show_percent}</span>\r\n      </div>\r\n      <div class=\"col-1-2 jettrail-endpoints-container\">\r\n        <input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"showJetTrailEndPoints\" title=\"${nls.show_jettrail_end_points}\" />\r\n        <span class=\"label\">${nls.show_jettrail_end_points}</span>\r\n      </div>\r\n    </div>\r\n    <div class=\"col-1-3\">\r\n      <input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"cycleColors\" title=\"${nls.cycle_colors}\" />\r\n      <span class=\"label\">${nls.cycle_colors}</span>\r\n    </div>\r\n  </div>\r\n  <div class=\"jimu-r-row\" style=\"padding-top:15px\">\r\n    <div class=\"col-1-3\">\r\n      <span class=\"label\" data-dojo-attach-point=\"maxHeightLabel\">${nls.max_height}: </span>\r\n    </div>\r\n    <div class=\"col-1-3\">\r\n      <span class=\"label\" data-dojo-attach-point=\"maxWidthLabel\">${nls.max_width}: </span>\r\n    </div>\r\n    <div class=\"col-1-3\">\r\n      <span class=\"label\">${nls.interval}: </span>\r\n    </div>\r\n  </div>\r\n  <div class=\"jimu-r-row\" style=\"padding-top:0px\">\r\n    <div class=\"col-1-3\">\r\n      <input data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"maxHeight\" />\r\n    </div>\r\n    <div class=\"col-1-3\">\r\n      <input data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"maxWidth\" />\r\n    </div>\r\n    <div class=\"col-1-3\">\r\n      <input data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"interval\" />\r\n    </div>\r\n  </div>\r\n  <br/>\r\n  <!-- Layer Settings -->\r\n  <div data-dojo-attach-point=\"layerSection\">\r\n    <div class=\"jimu-r-row\">\r\n      <div class=\"label\" style=\"padding-top:10px;font-weight: bold;\">\r\n        ${nls.layer_settings}\r\n      </div>\r\n      <hr />\r\n    </div>\r\n    <div class=\"jimu-r-row\">\r\n      <div class=\"col-1-4\">\r\n        <span class=\"label\">${nls.viz_layer}: </span>\r\n      </div>\r\n      <div class=\"col-3-4\">\r\n        <select data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"vizLayer\">\r\n        </select>\r\n      </div>\r\n    </div>\r\n    <div class=\"jimu-r-row\" style=\"padding-top: 10px\">\r\n      <div class=\"col-1-4\">\r\n        <span class=\"label\">${nls.display_field}: </span>\r\n      </div>\r\n      <div class=\"col-3-4\">\r\n        <select data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"displayField\">\r\n        </select>\r\n      </div>\r\n    </div>\r\n    <div>\r\n      <div class=\"btn-add-section\" data-dojo-attach-point=\"btnAdd\">\r\n        <span class=\"btn-add-label\">${nls.add_field}</span>\r\n        <span class=\"btn-add-icon\"></span>\r\n      </div>\r\n      <br/>\r\n      <div data-dojo-attach-point=\"table\" data-dojo-type=\"jimu/dijit/SimpleTable\" data-dojo-props='fields:[\r\n    {name:\"field\",title:\"${nls.field}\",\"class\":\"label\",type:\"empty\"},\r\n    {name:\"label\",title:\"${nls.label}\",\"class\":\"label\",type:\"empty\"},\r\n    {name:\"actions\",title:\"${nls.actions}\",\"class\":\"actions\",type:\"actions\",actions:[\"up\",\"down\",\"delete\"]}]'></div>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
'url:widgets/3DFx/setting/css/style.css':".jimu-widget-viz-setting .btn-add-section {display: inline-block; overflow: hidden; height: 24px; margin-left: 1px; margin-bottom: 3px; cursor: pointer; font-size: 13px; color: #538ec8; margin-top: 8px;}.jimu-widget-viz-setting .btn-add-section .btn-add-icon {float: left; height: 100%; width: 14px; background-repeat: no-repeat; background-position: center center; background-image: url(images/add.png);}.jimu-widget-viz-setting .btn-add-section .btn-add-label {float: left; height: 100%; line-height: 24px; vertical-align: middle; margin-right: 7px; text-decoration: underline;}.jimu-widget-viz-setting .label-disabled {color: #6e6e6e;}",
'*now':function(r){r(['dojo/i18n!*preload*widgets/3DFx/setting/nls/Setting*["ar","bs","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]']);}
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
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/_base/html',

    'dojo/Deferred',
    'dojo/promise/all',

    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/on',
    'dojo/query',
    'dojo/store/Memory',

    'dijit/form/Select',
    'dijit/form/ValidationTextBox',
    'dijit/_WidgetsInTemplateMixin',

    'esri/request',

    'jimu/BaseWidgetSetting',
    'jimu/dijit/Message',
    'jimu/dijit/LoadingShelter',
    'jimu/dijit/SimpleTable'
  ],
  function(
    declare, array, lang, html,
    Deferred, all,
    domClass, domStyle, on, query, Memory,
    Select, ValidationTextBox, _WidgetsInTemplateMixin, esriRequest,
    BaseWidgetSetting, Message, LoadingShelter
  ) {

    var MaxRecsCount = 400;

    function _filterFields(fields) {
      var displayFields = [],
          vizFields = [],
          validTypes = ["esriFieldTypeSmallInteger",
                        "esriFieldTypeInteger",
                        "esriFieldTypeSingle",
                        "esriFieldTypeDouble"
                       ],
          invalidNames = ["lat", "latitude", "y", "ycenter", "latitude83", "latdecdeg", "POINT-Y",
                          "lon", "lng", "long", "longitude", "x", "xcenter",
                          "longitude83", "longdecdeg", "POINT-X",
                          "alt", "altitude", "z", "POINT-Z", "zcenter", "altitude83", "altdecdeg"
                         ];

      array.forEach(fields, function(f) {
        displayFields.push(f.name);
        var n = f.name.toLowerCase();
        if (validTypes.indexOf(f.type) > -1 && invalidNames.indexOf(n) === -1) {
          vizFields.push(f.name);
        }
      });

      return {
        displayFields: displayFields,
        vizFields: vizFields
      };
    }

    function _fetchService(url, callback) {
      return esriRequest({
        url: url,
        content: lang.mixin({ f: "json" }, {}),
        handleAs: "json",
        callbackParamName: "callback"
      }).then(function(response) {
        // Update URL scheme if the response was obtained via HTTPS
        // See esri/request for context regarding "response._ssl"
        if (response._ssl) {
          delete response._ssl;
          url = url.replace(/^http:/i, "https:");
        }
        if (response.type === "Feature Layer") {
          var result = {};
          lang.mixin(result, _filterFields(response.fields));
          callback(null, result);
        } else {
          callback("3DFx widget can only accecpt a feature service.");
        }
      }, function(error) {
        console.log(error);
        callback("3DFx widget can only accecpt a valid feature service.");
      });
    }

    // Return a Deferred object
    function getFields(featureLayer) {
      var dfd = new Deferred();
      if (lang.isString(featureLayer)) {
        _fetchService(featureLayer, function(err, response) {
          if (err) {
            dfd.reject(err);
          } else {
            dfd.resolve(response);
          }
        });
      } else {
        dfd.reject("3DFx widget can only accecpt a feature service url now.");
      }
      return dfd;
    }

    function getFeatureCount(featureLayer) {
      return esriRequest({
        url: featureLayer + '/query',
        content: lang.mixin({ f: "json" }, { returnGeometry: false, returnCountOnly: true, where: "1=1" }),
        handleAs: "json",
        callbackParamName: "callback"
      });
    }

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-viz-setting',

      postCreate: function() {
        this.inherited(arguments);

        this.layers = [];
        this.fldOptions = [];
        this._selectedLyrId = null;
        this.loadingCover = new LoadingShelter({hidden: true});
        this.loadingCover.placeAt(this.domNode);
        this.loadingCover.startup();
      },

      startup: function() {
        this.inherited(arguments);
        this._processLayers();
        this._postProcessLayers();
      },

      _processLayers: function() {
        var map = this.sceneView.map;
        var i, j;
        var mapLayers = map.layers.toArray(),
            subLayers;
        for (i = mapLayers.length - 1; i >= 0; i--) {
          if (mapLayers[i].declaredClass === "esri.layers.FeatureLayer" &&
            mapLayers[i].listMode === "show") {
            this.layers.push(map.findLayerById(mapLayers[i].id));
          } else if (mapLayers[i].declaredClass === "esri.layers.GroupLayer") {
            subLayers = mapLayers[i].layers.toArray();
            for (j = 0; j < subLayers.length; j++) {
              if (subLayers[j].declaredClass === "esri.layers.FeatureLayer" &&
                subLayers[j].listMode === "show") {
                this.layers.push(map.findLayerById(subLayers[j].id));
              }
            }
          }
        }
      },

      _postProcessLayers: function() {
        this.own(on(this.vizType, "change", lang.hitch(this, this._changeVizType)));
        this.own(on(this.vizLayer, 'change', lang.hitch(this, this._changeVizLayer)));
        this.own(on(this.btnAdd, 'click', lang.hitch(this, this._addRow)));

        if (this.config.vizType) {
          if (this.vizType.value != this.config.vizType) {
            this.vizType.set('value', lang.trim(this.config.vizType));
          } else {
            this._changeVizType();
          }
        }
      },

      _changeVizType: function() {
        this._refreshVizSetting();
        if (this.layers.length === 0) {
          domStyle.set(this.layerSection, "display", "none");
          this.loadingCover.hide();
          
          new Message({
            message: this.nls.no_layers
          });
          return;
        }
        this._refreshLayerList();
        var _found = false, _id, opts = this.vizLayer.getOptions();
        if (this.config.vizLayer) {
          _id = this.config.vizLayer.id;
          for (var i=0; i<opts.length; i++) {
            if (opts[i].value === _id) {
              _found = true;
              break;
            }
          }
        }
        if (_found && _id) {
          this.vizLayer.set('value', lang.trim(_id));
        } else {
          if (opts && opts[0]) {
            this.vizLayer.set('value', lang.trim(opts[0].value));
          }
        }
      },

      _refreshVizSetting: function() {
        // Viz settings
        this._refreshVizSettingStates();

        if (this.config.showPercent) {
          this.showPercent.set('value', true);
        }

        if (this.config.showJetTrailEndPoints) {
          this.showJetTrailEndPoints.set('value', true);
        }

        if (this.config.cycleColors) {
          this.cycleColors.set('value', true);
        }

        if (this.config.maxHeight) {
          this.maxHeight.set('value', this.config.maxHeight);
        }

        if (this.config.maxWidth) {
          this.maxWidth.set('value', this.config.maxWidth);
        }

        if (this.config.interval) {
          this.interval.set('value', this.config.interval);
        }
      },

      _refreshVizSettingStates: function() {
        var vizType = this.vizType.value || this.config.vizType;
        var endPointsDom = query('.jettrail-endpoints-container', this.domNode)[0];
        if (endPointsDom) {
          if (vizType == "JetTrail") {
            domStyle.set(endPointsDom, "display", "block");
          } else {
            domStyle.set(endPointsDom, "display", "none");
          }
        }
        switch (vizType) {
          case ("Fireball"):
          case ("JetTrail"):
            domClass.add(this.maxWidthLabel, "label-disabled");
            domClass.add(this.maxHeightLabel, "label-disabled");
            this.maxWidth.set("disabled", true);
            this.maxHeight.set("disabled", true);
            this.maxWidth.set("readOnly", true);
            this.maxHeight.set("readOnly", true);
            break;
          case ("Bounce"):
          case ("AreaExtrude"):
            domClass.add(this.maxWidthLabel, "label-disabled");
            domClass.remove(this.maxHeightLabel, "label-disabled");
            this.maxWidth.set("disabled", true);
            this.maxHeight.set("disabled", false);
            this.maxWidth.set("readOnly", true);
            this.maxHeight.set("readOnly", false);
            break;
          case ("Pulse"):
            domClass.remove(this.maxWidthLabel, "label-disabled");
            domClass.add(this.maxHeightLabel, "label-disabled");
            this.maxWidth.set("disabled", false);
            this.maxHeight.set("disabled", true);
            this.maxWidth.set("readOnly", false);
            this.maxHeight.set("readOnly", true);
            break;
          default:
            domClass.remove(this.maxWidthLabel, "label-disabled");
            domClass.remove(this.maxHeightLabel, "label-disabled");
            this.maxWidth.set("disabled", false);
            this.maxHeight.set("disabled", false);
            this.maxWidth.set("readOnly", false);
            this.maxHeight.set("readOnly", false);
            break;
        }
      },

      _refreshLayerList: function() {
        this.vizLayer.removeOption(this.vizLayer.getOptions());
        this.vizLayer._set("value", null);
        this.vizLayer._lastValueReported = null;
        this.vizLayer._setDisplay('');

        var geomType = null;
        var vizType = this.vizType.value;
        if (vizType) {
          switch (vizType) {
            case ("Fireball"):
            case ("JetTrail"):
              geomType = "polyline";
              break;
            case ("PointExtrude"):
            case ("Pulse"):
            case ("Bounce"):
              geomType = "point";
              break;
            case ("AreaExtrude"):
              geomType = "polygon";
              break;
            default:
              break;
          }
        }
        if (geomType) {
          array.forEach(this.layers, lang.hitch(this, function(lyr) {
            if (geomType == lyr.geometryType) {
              var obj = {
                label: lyr.title,
                value: lang.trim(lyr.id)
              };
              this.vizLayer.addOption(obj);
            }
          }));
        }
      },

      _getLayerById: function(id) {
        var lyrs = array.filter(this.layers, function(lyr) {
          return lyr.id === id;
        });
        if (lyrs.length > 0) {
          return lyrs[0];
        }
        return null;
      },

      _changeVizLayer: function() {
        var lyr = this._getLayerById(this.vizLayer.value);
        if (lyr && lyr.id === this._selectedLyrId) {
          return;
        }
        this._selectedLyrId = lyr.id;
        this.loadingCover.show();
        this.displayField.removeOption(this.displayField.getOptions());
        this.displayField._set("value", null);
        this.displayField._lastValueReported = null;
        this.displayField._setDisplay('');
        this.table.clear();
        this._setFields(lyr);
      },

      _setFields: function(lyr) {
        var flds = [];
        this.fldOptions = [];
        var url = lyr.url;
        if (typeof lyr.layerId === 'number') {
          url += "/" + lyr.layerId;
        }
        all([getFeatureCount(url), getFields(url)]).then(function(responses) {
          // success
          if (lang.isObject(responses[0])) {
            if (responses[0].count > MaxRecsCount) {
              this.showPercent.set('value', false);
              this.showPercent.set('disabled', true);
              this.showPercent.set('title', this.nls.show_percentage_limited);
            } else {
              this.showPercent.set('disabled', false);
              this.showPercent.set('title', '');
            }
          }
          if (lang.isObject(responses[1])) {
            array.forEach(responses[1].displayFields, lang.hitch(this, function(name) {
              flds.push(this._getFieldOption(lyr, name));
            }.bind(this)));
            array.forEach(responses[1].vizFields, lang.hitch(this, function(name) {
              this.fldOptions.push(this._getFieldOption(lyr, name));
            }.bind(this)));
            var store = new Memory({
              idProperty: "label",
              data: flds
            });
            this.displayField.set("labelAttr", "label");
            this.displayField.setStore(store);
            this._refreshFields();
          }
          // Hide loading shelter
          this.loadingCover.hide();
        }.bind(this), function(err) {
          console.warn(err);
          this.loadingCover.hide();
        }.bind(this));
      },

      _refreshFields: function() {
        var _found = false, _value, opts;
        if (this.config.vizLayer && this.config.vizLayer.id === this.vizLayer.value) {
          opts = this.displayField.getOptions();
          if (this.config.displayField) {
            _value = this.config.displayField;
            for (var i=0; i<opts.length; i++) {
              if (opts[i].value === _value) {
                _found = true;
                break;
              }
            }
          }
          array.forEach(this.config.vizFields, lang.hitch(this, function(fld) {
            this._populateTableRow(fld);
          }));
        }
        if (_found && _value) {
          this.displayField.set('value', lang.trim(_value));
        } else {
          if (opts && opts[0]) {
            this.displayField.set('value', lang.trim(opts[0].value));
          }
        }
      },

      _getFieldOption: function(lyr, name) {
        var option = {
          label: name,
          value: name
        };
        if (lyr.popupTemplate && lyr.popupTemplate.fieldInfos instanceof Array) {
          array.some(lyr.popupTemplate.fieldInfos, function(f) {
            if (f.fieldName === name) {
              option.label = f.label;
              return true;
            }
          });
        }
        return option;
      },

      _populateTableRow: function(info) {
        var tr = this._addRow();
        if (tr) {
          tr.selectField.set('value', info.field);
          tr.labelText.set('value', info.label);
        }
      },

      _addRow: function() {
        var result = this.table.addRow({});
        if (result.success && result.tr) {
          var tr = result.tr;
          this._addField(tr);
          this._addLabel(tr);
          return tr;
        }
      },

      _addField: function(tr) {
        var options = lang.clone(this.fldOptions);
        var td = query('.simple-table-cell', tr)[0];
        if (td) {
          html.setStyle(td, "verticalAlign", "middle");
          var node = new Select({
            style: {
              width: "100%",
              height: "30px"
            },
            options: options
          });
          node.placeAt(td);
          node.startup();
          tr.selectField = node;
        }
      },

      _addLabel: function(tr) {
        var td = query('.simple-table-cell', tr)[1];
        html.setStyle(td, "verticalAlign", "middle");
        var node = new ValidationTextBox({
          style: {
            width: "100%",
            height: "30px"
          }
        });
        node.placeAt(td);
        node.startup();
        tr.labelText = node;
      },

      _validateVizType: function() {
        var valid = false;
        if (this.vizLayer.value) {
          var lyr = this._getLayerById(this.vizLayer.value);
          var geomType = lyr.geometryType;
          var vizType = this.vizType.value;
          switch (vizType) {
            case ("Fireball"):
            case ("JetTrail"):
              if (geomType === "polyline" ) {
                valid = true;
              }
              break;
            case ("PointExtrude"):
            case ("Bounce"):
            case ("Pulse"):
              if (geomType === "point" ) {
                valid = true;
              }
              break;
            case ("AreaExtrude"):
              if (geomType === "polygon" ) {
                valid = true;
              }
              break;
            default:
              break;  
          }
        }
        if (!valid) {
          console.log(this.vizType);
          new Message({
            message: this.vizType.attr('displayedValue') + ": " + this.nls.viz_not_supported
          });
        }
        return valid;
      },

      getConfig: function() {
        // Viz settings
        this.config.vizType = lang.trim(this.vizType.value);

        this.config.showPercent = this.showPercent.checked;

        this.config.showJetTrailEndPoints = this.showJetTrailEndPoints.checked;

        this.config.cycleColors = this.cycleColors.checked;

        this.config.maxHeight = this.maxHeight.value;

        this.config.maxWidth = this.maxWidth.value;

        this.config.interval = this.interval.value;

        // Layer settings
        if (this.layers.length > 0) {

          var valid = this._validateVizType();
          if (!valid) {
            return false;
          }

          var lyr = this._getLayerById(this.vizLayer.value);

          var url = lyr.url;
          if (typeof lyr.layerId === "number") {
            url += "/"  + lyr.layerId;
          }
          this.config.vizLayer = {
            id: lyr.id,
            url: url
          };

          this.config.displayField = lang.trim(this.displayField.value);

          var flds = [];
          var trs = this.table.getRows();
          array.forEach(trs, function(tr) {
            var fld = lang.trim(tr.selectField.value);
            var alias = tr.selectField.attr('displayedValue');
            var lbl = lang.trim(tr.labelText.value);
            flds.push({
              field: fld,
              alias: alias,
              label: lbl
            });
          });
          this.config.vizFields = flds;

        }

        if (!this.config.vizLayer || !this.config.vizFields || this.config.vizFields.length === 0) {
          return false;
        }

        return this.config;
      }

    });
  });
