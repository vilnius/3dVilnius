// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'url:widgets/Splash/setting/ColorPickerEditor.html':"<div class=\"colorPickerEditor\">\r\n  <div class=\"colorPicker\" data-dojo-attach-point=\"colorPicker\"></div>\r\n  <span class=\"trans\">${nls.transparency}</span>\r\n  <div class=\"sliderbar\" data-dojo-attach-point=\"sliderBar\"></div>\r\n  <input type=\"text\" data-dojo-type=\"dijit/form/NumberSpinner\" value=\"0\"\r\n         data-dojo-attach-point=\"spinner\" data-dojo-props=\"smallDelta:10,intermediateChanges:true,constraints: {min:0,max:100}\">\r\n  <span >%</span>\r\n</div>\r\n\r\n"}});
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
    "dojo/_base/lang",
    'dojo/_base/Color',
    'dojo/on',
    "dojo/query",
    "dojo/_base/html",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./ColorPickerEditor.html',
    "dijit/form/HorizontalSlider",
    'jimu/dijit/ColorPicker',
    "dijit/form/NumberSpinner"
  ],
  function(declare, lang, Color, on, query, html,
           _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
           HorizontalSlider, ColorPicker) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      _defaultColor: '#485566',
      templateString: template,
      nls: null,

      postMixInProperties: function () {
        if (!this.nls.transparency) {
          this.nls.transparency = window.jimuNls.transparency.transparency;//for the deleted nls, ver 2.12
        }
        this.inherited(arguments);
      },

      postCreate: function() {
        this.colorPicker = new ColorPicker({
          color: this._defaultColor
        }, this.colorPicker);
        this.colorPicker.startup();

        this.slider = new HorizontalSlider({
          name: "slider",
          value: 0,
          minimum: 0,
          maximum: 100,
          discreteValues: 101,
          intermediateChanges: true,
          showButtons: false,
          style: "width:140px;display: inline-block;"
        }, this.sliderBar);
        this.slider.startup();

        this.inherited(arguments);
      },
      startup: function() {
        this.own(on(this.slider, 'change', lang.hitch(this, function(val) {
          if (false === this._isSameVal()) {
            this.spinner.setValue(val);
          }
        })));

        this.own(on(this.spinner, 'change', lang.hitch(this, function(val) {
          if (false === this._isSameVal()) {
            this.slider.setValue(val);
          }
        })));

        this._stylePolyfill();
        this.inherited(arguments);
      },
      _isSameVal: function() {
        return this.slider.getValue() === this.spinner.getValue();
      },
      getValues: function() {
        var rgb = null,
          a = null;
        var bgColor = this.colorPicker.getColor();
        if (bgColor && bgColor.toHex) {
          rgb = bgColor.toHex();
        }
        a = this.spinner.getValue() / 100;

        return {
          color: rgb,
          transparency: a
        };
      },
      setValues: function(obj) {
        if (typeof obj === "object" || typeof obj === "string") {
          this.colorPicker.setColor(new Color(obj.color));

          if (typeof obj.transparency === "undefined") {
            obj.transparency = 0;
          } else {
            obj.transparency = obj.transparency * 100;
          }
          this.slider.setValue(obj.transparency);
          this.spinner.setValue(obj.transparency);
        }
      },
      _stylePolyfill: function() {
        var leftBumper = query('.dijitSliderLeftBumper', this.domNode)[0];
        if (leftBumper && leftBumper.parentNode) {
          html.setStyle(leftBumper.parentNode, 'background-color', "#24b5cc");
        }
      }
    });
  });