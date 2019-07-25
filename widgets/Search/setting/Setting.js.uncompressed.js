// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'widgets/Search/setting/utils':function(){
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
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/Deferred',
  'dojo/when',
  'dojo/promise/all',
  'jimu/portalUtils',
  'esri/lang',
  'esri/request'
], function(lang, array, Deferred, when, all, portalUtils, esriLang, esriRequest) {
  //jshint unused:false
  var mo = {
    map: null,
    layerInfosObj: null,
    appConfig: null,
    _esriLocatorRegExp: /geocode(.){0,3}\.arcgis.com\/arcgis\/rest\/services\/World\/GeocodeServer/g
  };

  mo.setMap = function(map) {
    this.map = map;
  };

  mo.setLayerInfosObj = function(lobj) {
    this.layerInfosObj = lobj;
  };

  mo.setAppConfig = function(apc) {
    this.appConfig = apc;
  };

  mo.getConfigInfo = function(config) {
    if (config && config.sources && config.sources.length > 0) {
      var searchInfo = null;
      if (this.searchLayer(this.map) && config.upgradeFromGeocoder) {
        // back compatibility for config which come from geocoders
        searchInfo = this.map.itemInfo.itemData.applicationProperties.viewing.search;
        var defs = array.map(searchInfo.layers, lang.hitch(this, function(hintText, _layer) {
          _layer.hintText = hintText;
          return this._getQueryTypeGeocoder(_layer);
        }, searchInfo.hintText));
        return all(defs).then(lang.hitch(this, function(results) {
          config.sources = [].concat(results).concat(config.sources);
          return config;
        }));
      } else {
        return config;
      }
    } else {
      return when(this._getSoucesFromPortalAndWebmap())
        .then(lang.hitch(this, function(sources) {
          return {
            "allPlaceholder": "",
            "showInfoWindowOnSelect": true,
            "sources": sources
          };
        }));
    }
  };

  mo._getSoucesFromPortalAndWebmap = function() {
    var defs = [];
    var searchInfo = null;
    if (this.searchLayer(this.map)) {
      searchInfo = this.map.itemInfo.itemData.applicationProperties.viewing.search;
      array.forEach(searchInfo.layers, lang.hitch(this, function(hintText, _layer) {
        _layer.hintText = hintText;
        defs.push(this._getQueryTypeGeocoder(_layer));
      }, searchInfo.hintText));
    } // else do nothing

    return portalUtils.getPortalSelfInfo(this.appConfig.portalUrl)
      .then(lang.hitch(this, function(response) {
        var geocoders = response.helperServices && response.helperServices.geocode;

        if (geocoders && geocoders.length > 0) {
          for (var i = 0, len = geocoders.length; i < len; i++) {
            var geocoder = geocoders[i];
            if (geocoder) {
              defs.push(this._processSingleLine(geocoder));
            }
          }
        }

        return all(defs).then(lang.hitch(this, function(results) {
          var validSources = [];
          for (var i = 0; i < results.length; i++) {
            var geocode = results[i];
            if (!geocode) {
              continue;
            } else if (geocode && geocode.type === 'query') {
              validSources.push(geocode);
            } else {
              var json = {
                name: geocode.name || this._getGeocodeName(geocode.url),
                url: geocode.url,
                singleLineFieldName: geocode.singleLineFieldName,
                placeholder: geocode.placeholder || window.jimuNls.common.findAddressOrPlace ||
                  geocode.name || this._getGeocodeName(geocode.url),
                maxResults: 6,
                searchInCurrentMapExtent: false,
                type: "locator"
              };
              validSources.push(json);
            }
          }

          return validSources;
        }));
      }));
  };

  mo._getQueryTypeGeocoder = function(item) {
    //var layer = this.map.getLayer(item.id);
    var layer = this.map.findLayerById(item.id);
    var url = null;
    //var _layerInfo = null;
    var _layerId = null;

    /*
    if (esriLang.isDefined(item.subLayer)) {
      _layerId = item.id + "_" + item.subLayer;
    } else {
      _layerId = item.id;
    }
    */
    _layerId = item.id;

    /*
    var isInMap = this.layerInfosObj.traversal(function(layerInfo) {
      if (layerInfo.id === _layerId) {
        _layerInfo = layerInfo;
        return true;
      }

      return false;
    });
    */

    var subLayer = null;
    if(layer && layer.allSublayers) {
      subLayer = layer.allSublayers.find(function(layer) {
        return layer.id === item.subLayer;
      });
    }

    if (layer) {
      if(layer.type === "scene") {
        url = layer.url + "/layers/" + layer.layerId;
      } else if (subLayer/*esriLang.isDefined(item.subLayer)*/) {
        url = subLayer.url || (layer.url + "/" + item.subLayer);
      } else {
        url = layer.url + "/" + layer.layerId;
      }

      return {
        name: layer.title,
        layerId: _layerId,
        url: url,
        placeholder: item.hintText || window.jimuNls.common.findAddressOrPlace,
        searchFields: [item.field.name],
        displayField: item.field.name,
        exactMatch: item.field.exactMatch || false,
        maxResults: 6,
        searchInCurrentMapExtent: false,
        type: "query"
      };
    } else {
      return null;
    }
  };

  mo._isEsriLocator = function(url) {
    this._esriLocatorRegExp.lastIndex = 0;
    return this._esriLocatorRegExp.test(url);
  };

  mo._processSingleLine = function(geocode) {
    // this._esriLocatorRegExp.lastIndex = 0;
    if (geocode.singleLineFieldName) {
      return geocode;
    } else if (this._isEsriLocator(geocode.url)) {
      geocode.singleLineFieldName = 'SingleLine';
      return geocode;
    } else {
      var def = new Deferred();
      esriRequest({
        url: geocode.url,
        content: {
          f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback"
      }).then(lang.hitch(this, function(response) {
        if (response.singleLineAddressField && response.singleLineAddressField.name) {
          geocode.singleLineFieldName = response.singleLineAddressField.name;
          def.resolve(geocode);
        } else {
          console.warn(geocode.url + "has no singleLineFieldName");
          def.resolve(null);
        }
      }), lang.hitch(this, function(err) {
        console.error(err);
        def.resolve(null);
      }));

      return def.promise;
    }
  };

  mo._getGeocodeName = function(geocodeUrl) {
    if (typeof geocodeUrl !== "string") {
      return "geocoder";
    }
    var strs = geocodeUrl.split('/');
    return strs[strs.length - 2] || "geocoder";
  };

  mo.getGeocoderName = function(url) {
    return this._getGeocodeName(url);
  };

  mo.hasAppSearchInfo = function(map) {
    return map.itemInfo && map.itemInfo.itemData &&
      map.itemInfo.itemData.applicationProperties &&
      map.itemInfo.itemData.applicationProperties.viewing &&
      map.itemInfo.itemData.applicationProperties.viewing.search;
  };

  mo.searchLayer = function(map) {
    if (!map) {
      return false;
    }
    if (!this.hasAppSearchInfo(map)) {
      return false;
    }
    var search = map.itemInfo.itemData.applicationProperties.viewing.search;
    if (!search.enabled) {
      return false;
    }
    if (search.layers.length === 0) {
      return false;
    }

    return true;
  };

  return mo;
});

},
'widgets/Search/setting/QuerySourceSetting':function(){
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
  'dojo/_base/html',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./QuerySourceSetting.html',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/on',
  'dojo/query',
  'dojo/Deferred',
  'dojo/Evented',
  'jimu/dijit/_FeaturelayerSourcePopup',
  'jimu/portalUrlUtils',
  'esri/request',
  'esri/lang',
  'jimu/utils',
  'jimu/dijit/Popup',
  'jimu/dijit/CheckBox',
  './LayerChooserForSearch',
  'jimu/dijit/LoadingShelter',
  'dijit/form/ValidationTextBox',
  'dojo/NodeList-data'
],
function(declare, html, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
  template, lang, array, on, query, Deferred, Evented,
  _FeaturelayerSourcePopup, portalUrlUtils, esriRequest, esriLang,
  jimuUtils, Popup, CheckBox, LayerChooserForSearch) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    baseClass: 'jimu-widget-search-query-source-setting',
    templateString: template,

    nls: null,
    appConfig: null,
    map: null,

    tr: null,
    config: null,
    fieldsPopup: null,
    _layerDefinition: null,//include url
    _fieldsCheckBox : null,
    _layerId: null,
    _suggestible: false,

    _clickSet: false,

    //event
    //reset-query-source

    postCreate: function() {
      this.inherited(arguments);

      this.exactMatch = new CheckBox({
        checked: false,
        label: this.nls.exactMatch
      }, this.exactMatch);
      this.searchInCurrentMapExtent = new CheckBox({
        checked: false,
        label: this.nls.searchInCurrentMapExtent
      }, this.searchInCurrentMapExtent);

      this._layerDefinition = {};
      this._fieldsCheckBox = [];

      this._setMessageNodeContent("");
    },

    setDefinition: function(definition) {
      this._layerDefinition = definition || {};
    },

    getDefinition: function() {
      return this._layerDefinition;
    },

    setRelatedTr: function(tr) {
      this.tr = tr;
    },

    getRelatedTr: function() {
      return this.tr;
    },

    setConfig: function(config) {
      if (Object.prototype.toString.call(config) !== "[object Object]") {
        return;
      }

      var url = config.url;
      if (!url) {
        return;
      }
      this.config = config;

      this.shelter.show();
      if (this._layerDefinition.url !== url) {
        this._getDefinitionFromRemote(url).then(lang.hitch(this, function(response) {
          if (url && (response && response.type !== 'error')) {
            this._layerDefinition = response;
            this._layerDefinition.url = url;
            this._setSourceItems();
            this._setMessageNodeContent("");
          } else if (url && (response && response.type === 'error')) {
            this._setSourceItems();
            this._disableSourceItems();
            this._setMessageNodeContent(esriLang.substitute({
              'URL': response.url
            }, lang.clone(this.nls.invalidUrlTip)), true);
          }
          this.shelter.hide();
        }));
      } else {
        this._setMessageNodeContent("");
        this._setSourceItems();
        this.shelter.hide();
      }
    },

    isValidConfig: function() {
      var config = this.getConfig();
      if (config.url && config.name && config.displayField) {
        return true;
      }else {
        return false;
      }
    },

    showValidationTip: function() {
      this._showValidationErrorTip(this.sourceUrl);
      this._showValidationErrorTip(this.sourceName);
    },

    getConfig: function() {
      var json = {
        layerId: this._layerId,
        url: this.sourceUrl.get('value'),
        name: jimuUtils.stripHTML(this.sourceName.get('value')),
        placeholder: jimuUtils.stripHTML(this.placeholder.get('value')),
        searchFields: this._getSearchFields(),// defaults to FeatureLayer.displayField
        displayField: this.displayField.get('value'),// defaults to FeatureLayer.displayField
        exactMatch: this.exactMatch.getValue(),
        searchInCurrentMapExtent: this.searchInCurrentMapExtent.checked,
        zoomScale: this.zoomScale.get('value') || 50000,
        maxSuggestions: this.maxSuggestions.get('value') || 6,
        maxResults: this.maxResults.get('value'),
        type: 'query'
      };

      return json;
    },

    destroy: function() {
      this.inherited(arguments);
      if (this.fieldsPopup) {
        this.fieldsPopup.close();
        this.fieldsPopup = null;
      }
      this._layerDefinition = null;
      this.config = null;
      this.nls = null;
      this.tr = null;
    },

    _onSourceNameBlur: function() {
      this.sourceName.set('value', jimuUtils.stripHTML(this.sourceName.get('value')));
    },

    _onPlaceholderBlur: function() {
      this.placeholder.set('value', jimuUtils.stripHTML(this.placeholder.get('value')));
    },

    _disableSourceItems: function() {
      this.sourceName.set('disabled', true);
      this.placeholder.set('disabled', true);
      this.searchFields.set('disabled', true);
      html.setStyle(this.fieldsSelectorNode, 'display', 'none');
      this.displayField.set('disabled', true);
      this.maxSuggestions.set('disabled', true);
      this.maxResults.set('disabled', true);
      this.zoomScale.set('disabled', true);
    },

    _enableSourceItems: function() {
      this.sourceName.set('disabled', false);
      this.placeholder.set('disabled', false);
      this.searchFields.set('disabled', false);
      html.setStyle(this.fieldsSelectorNode, 'display', 'inline-block');
      this.displayField.set('disabled', false);
      this.maxSuggestions.set('disabled', false);
      this.maxResults.set('disabled', false);
      this.zoomScale.set('disabled', false);
    },

    _setSourceItems: function() {
      this.sourceUrl.set('value', this.config.url);
      this.sourceName.set('value', jimuUtils.stripHTML(this.config.name || ""));
      this.placeholder.set('value', jimuUtils.stripHTML(this.config.placeholder || ""));
      this._setSearchFields2Node();
      this.searchFields.set('value', this._getSearchFieldsAlias());
      this._setDisplayFieldOptions();
      this.displayField.set('value', this.config.displayField || "");
      this.exactMatch.setValue(!!this.config.exactMatch);
      this.searchInCurrentMapExtent.setValue(!!this.config.searchInCurrentMapExtent);
      this.zoomScale.set('value', this.config.zoomScale || 50000);
      this.maxSuggestions.set('value', this.config.maxSuggestions || 6);
      this.maxResults.set('value', this.config.maxResults || 6);
      this._layerId = this.config.layerId;

      this._suggestible = this._layerDefinition &&
        this._layerDefinition.advancedQueryCapabilities &&
        this._layerDefinition.advancedQueryCapabilities.supportsPagination;
      if (!this._suggestible) {
        this._showSuggestibleTips();
      } else {
        this._hideSuggestibleTips();
      }
      var isPointLayer = this._layerDefinition &&
        this._layerDefinition.geometryType === 'esriGeometryPoint';
      if (!isPointLayer) {
        html.setStyle(this.zoomScaleTr, 'display', 'none');
      } else {
        html.setStyle(this.zoomScaleTr, 'display', '');
      }
      this._enableSourceItems();
    },

    _getDefinitionFromRemote: function(url) {
      var resultDef = new Deferred();
      var def = esriRequest({
          url: url,
          content: {
            f: 'json'
          },
          handleAs: 'json',
          callbackParamName: 'callback'
        });
      this.own(def);
      def.then(lang.hitch(this, function(response) {
          resultDef.resolve(response);
        }), lang.hitch(this, function(err) {
          console.error(err);
          resultDef.resolve({
            type: 'error',
            url: this._getRequestUrl(url)
          });
        }));
      return resultDef.promise;
    },

    _setMessageNodeContent: function(content, err) {
      html.empty(this.messageNode);
      if (!content.nodeType) {
        content = html.toDom(content);
      }
      html.place(content, this.messageNode);
      if (err) {
        html.setStyle(this.messageTr, 'display', '');
      } else {
        html.setStyle(this.messageTr, 'display', 'none');
      }
    },

    _getRequestUrl: function(url) {
      var protocol = window.location.protocol;
      if (protocol === 'http:') {
        return portalUrlUtils.setHttpProtocol(url);
      } else if (protocol === 'https:'){
        return portalUrlUtils.setHttpsProtocol(url);
      } else {
        return url;
      }
    },

    _setSearchFields2Node: function() {
      var fields = null;
      var fieldsFromDefinition = this._layerDefinition &&
        this._layerDefinition.fields && this._layerDefinition.fields.length > 0;
      var fieldsFromConfig = this.config && this.config.searchFields &&
        this.config.searchFields.length > 0;

      if (!fieldsFromConfig) {
        fields = [];
      }
      if (!fieldsFromDefinition) {
        fields = this.config.searchFields;
      } else { //fieldsFromDefinition && fieldsFromConfig
        var layerFields = this._layerDefinition.fields;
        var configFields = this.config.searchFields;
        fields = array.filter(configFields, function(cf) {
          return array.some(layerFields, function(lf) {
            return lf.name === cf;
          });
        });
      }

      this.searchFields.set('_fields', fields);
    },

    _setDisplayFieldOptions: function() {
      var fieldsFromDefinition = this._layerDefinition &&
        this._layerDefinition.fields && this._layerDefinition.fields.length > 0;
      var options = [];
      if (fieldsFromDefinition) {
        var layerFields = this._layerDefinition.fields;
        options = array.map(layerFields, function(lf) {
          return {
            label: lf.alias || lf.name || "",
            value: lf.name || ""
          };
        });
      } else if (this.config && this.config.displayField) {
        options = [{
          label: this.config.displayField,
          value: this.config.displayField
        }];
      }

      this.displayField.set('options', options);
    },

    _getSearchFieldsAlias: function() {
      var fields = this._getSearchFields();
      var fieldsFromDefinition = this._layerDefinition &&
        this._layerDefinition.fields && this._layerDefinition.fields.length > 0;
      var fieldsFromConfig = fields && fields.length > 0;
      if (!fieldsFromConfig) {
        return "";
      }
      if (!fieldsFromDefinition) {
        return fields.join(',');
      } else { //fieldsFromDefinition && fieldsFromConfig
        var layerFields = this._layerDefinition.fields;
        var fNames = array.map(layerFields, function(field) {
          return field && field.name;
        });
        var alias = [];
        for (var i = 0, len = fields.length; i < len; i++) {
          var index = fNames.indexOf(fields[i]);
          if (index > -1) {
            alias.push(layerFields[index].alias);
          }
        }
        return alias.join(',');
      }
    },

    _getSearchFields: function() {
      return this.searchFields.get('_fields');
    },

    _setSearchFields: function(fields) {
      this.searchFields.set('_fields', fields);
    },

    _onSetSourceClick: function() {
      this._clickSet = true;
      this._openServiceChooser();
    },

    _openQuerySourceChooser: function() {
      this._clickSet = false;
      this._openServiceChooser();
    },

    /*
    _replace3DLayerChooser: function(featurePopup) {
      var featurelayerChooserWithButtons3d = new FeaturelayerChooserWithButtons3d({
        map: this.map
      });
      var flcContainerNode = query(".dijit-container.map-dijit-container", featurePopup.domNode)[0];
      if(flcContainerNode) {
        flcContainerNode.removeChild(flcContainerNode.firstChild);
        featurelayerChooserWithButtons3d.placeAt(flcContainerNode);
      }

      //featurePopup.fls.flcMap = featurelayerChooserWithButtons3d;

      featurePopup.fls.own(on(featurelayerChooserWithButtons3d, 'ok', lang.hitch(this, function(items){
        if(items && items.length > 0){
          featurePopup.fls.emit('ok', items);
        }
      })));

      featurePopup.fls.own(on(featurelayerChooserWithButtons3d, 'cancel', lang.hitch(this, function(){
        featurePopup.fls.emit('cancel');
      })));

    },
    */

    _openServiceChooser: function() {

      var layerChooserForSearch = new LayerChooserForSearch({
        map: this.map,
        mustSupportQuery: true
      });

      var args = {
        titleLabel: this.nls.setLayerSource,
        dijitArgs: {
          layerChooserFromMap: layerChooserForSearch,
          multiple: false,
          createMapResponse: this.map.webMapResponse,
          portalUrl: this.appConfig.portalUrl,
          style: {
            height: '100%'
          }
        }
      };

      var featurePopup = new _FeaturelayerSourcePopup(args);

      //this._replace3DLayerChooser(featurePopup);

      on.once(featurePopup, 'ok', lang.hitch(this, function(item) {
        featurePopup.close();
        this.setDefinition(item.definition || {});
        this.setConfig({
          layerId: item.layerInfo && item.layerInfo.id || null,
          url: item.url,
          name: item.name || "",
          placeholder: "",
          searchFields: [],
          displayField: this._layerDefinition.displayField || "",
          exactMatch: false,
          zoomScale: 50000, //default
          maxSuggestions: 6, //default
          maxResults: 6,//default
          type: "query"
        });
        featurePopup = null;

        if (this._clickSet) {
          this.emit('reselect-query-source-ok', item);
        } else {
          this.emit('select-query-source-ok', item);
        }
      }));

      on.once(featurePopup, 'cancel', lang.hitch(this, function() {
        featurePopup.close();
        featurePopup = null;

        this.emit('select-query-source-cancel');
      }));
    },

    _onFieldsSelectorClick: function() {
      var contentDom = html.create('div', {
        style: {
          maxHeight: '480px'
        }
      });

      var layerFields = this._layerDefinition.fields;
      this._fieldsCheckBox = [];
      array.forEach(layerFields, lang.hitch(this, function(field, idx) {
        var chk = new CheckBox({
          checked: this._isSearchable(field),
          label: field.alias || field.name
        });
        html.addClass(chk.domNode, 'fields-checkbox');
        html.addClass(chk.labelNode, 'jimu-ellipsis');
        html.setAttr(chk.domNode, {
          'title': field.alias || field.name
        });
        if (idx % 3 === 0) {
          if (window.isRTL) {
            html.setStyle(chk.domNode, 'marginRight', 0);
          } else {
            html.setStyle(chk.domNode, 'marginLeft', 0);
          }
        }
        chk.placeAt(contentDom);
        query(chk.domNode).data('fieldName', field.name);
        this._fieldsCheckBox.push(chk);
      }));

      this.fieldsPopup = new Popup({
        titleLabel: this.nls.setSearchFields,
        autoHeight: true,
        content: contentDom,
        container: window.jimuConfig.layoutId,
        width: 640,
        maxHeight: 600,
        buttons: [{
          label: this.nls.ok,
          onClick: lang.hitch(this, '_onSearchFieldsOk')
        }, {
          label: this.nls.cancel,
          classNames: ['jimu-btn-vacation']
        }],
        onClose: lang.hitch(this, function() {
          this.fieldsPopup = null;
        })
      });
      html.addClass(this.fieldsPopup.domNode, 'jimu-widget-search-query-source-setting-fields');
    },

    _onSearchFieldsOk: function() {
      var _fields = [];
      array.forEach(this._fieldsCheckBox, function(chk) {
        if (chk.getValue()) {
          var _data = query(chk.domNode).data('fieldName');
          _fields.push(_data[0]);
          query(chk.domNode).removeData();
        }
      });
      this._setSearchFields(_fields);
      this.searchFields.set('value', this._getSearchFieldsAlias());
      this.fieldsPopup.close();
    },

    _isSearchable: function(field) {
      var searchFields = this._getSearchFields();
      return array.some(searchFields, lang.hitch(this, function(sf){
        return field.name === sf;
      }));
    },

    _showSuggestibleTips: function() {
      html.addClass(this.tipsNode, 'source-tips-show');
      html.setStyle(this.maxSuggestions.domNode, 'display', 'none');
    },

    _hideSuggestibleTips: function() {
      html.removeClass(this.tipsNode, 'source-tips-show');
      html.setStyle(this.maxSuggestions.domNode, 'display', 'block');
    },

    _showValidationErrorTip: function(_dijit){
      if (!_dijit.validate() && _dijit.domNode) {
        if (_dijit.focusNode) {
          var _disabled = _dijit.get('disabled');
          if (_disabled) {
            _dijit.set('disabled', false);
          }
          _dijit.focusNode.focus();
          setTimeout(lang.hitch(this, function() {
            _dijit.focusNode.blur();
            if (_disabled) {
              _dijit.set('disabled', true);
            }
            _dijit = null;
          }), 100);
        }
      }
    }
  });
});

},
'jimu/dijit/_FeaturelayerSourcePopup':function(){
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
  'dojo/Evented',
  'dojo/on',
  'dojo/_base/lang',
  'dojo/_base/html',
  'jimu/dijit/Popup',
  'jimu/dijit/FeaturelayerSource',
  'jimu/dijit/LoadingIndicator',
  'esri/request'
],
function(declare, Evented, on, lang, html, Popup, FeaturelayerSource, LoadingIndicator,
  esriRequest) {
  return declare([Popup, Evented], {
    width: 830,
    height: 560,
    titleLabel: '',

    //dijitArgs: {
    //  layerChooserFromMap:,// optional, default value is 'jimu/dijit/FeaturelayerChooserFromMap'
    //  multiple: false,
    //  createMapResponse: ,
    //  portalUrl: ,
    //}
    dijitArgs: null,//refer to the parameters of dijit FeaturelayerSource

    //events:
    //ok return {name,url,definition}
    //cancel

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-featurelayer-source-popup');
      this._initFls();
      this._initLoading();
    },

    getSelectedRadioType: function(){
      return this.fls.getSelectedRadioType();
    },

    _initFls: function(){
      this.fls = new FeaturelayerSource(this.dijitArgs);
      this.fls.placeAt(this.contentContainerNode);
      this.fls.startup();

      this.own(on(this.fls, 'ok', lang.hitch(this, function(items){
        if(items.length === 0){
          return;
        }
        var item = items[0];
        if(item.definition){
          try{
            item.definition.name = item.name;
            item.definition.url = item.url;
            this.emit('ok', item);
          }
          catch(e){
            console.error(e);
          }
        }
        else{
          this.loading.show();
          esriRequest({
            url: item.url,
            content: {f:'json'},
            handleAs: 'json',
            callbackParamName: 'callback'
          }).then(lang.hitch(this, function(response){
            if(!this.domNode){
              return;
            }
            this.loading.hide();
            item.definition = response;
            try{
              item.definition.name = item.name;
              item.definition.url = item.url;
              this.emit('ok', item);
            }
            catch(e){
              console.error(e);
            }
          }), lang.hitch(this, function(err){
            console.error(err);
            if(!this.domNode){
              return;
            }
            this.loading.hide();
          }));
        }
      })));

      this.own(on(this.fls, 'cancel', lang.hitch(this, function(){
        try{
          this.emit('cancel');
        }
        catch(e){
          console.error(e);
        }
      })));
    },

    _initLoading: function(){
      this.loading = new LoadingIndicator({
        hidden: true
      });
      this.loading.placeAt(this.domNode);
      this.loading.startup();
    }

  });
});

},
'jimu/dijit/FeaturelayerSource':function(){
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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./templates/FeaturelayerSource.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/on',
  'dojo/Evented',
  'jimu/dijit/RadioBtn',
  'jimu/dijit/_FeaturelayerChooserWithButtons',
  'jimu/dijit/FeaturelayerChooserFromPortal',
  'jimu/dijit/_FeaturelayerServiceChooserContent',
  'jimu/portalUrlUtils'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, lang, html, on, Evented,
  RadioBtn, FeaturelayerChooserWithButtons, FeaturelayerChooserFromPortal, _FeaturelayerServiceChooserContent,
  portalUrlUtils) {

  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: 'jimu-layer-source jimu-featurelayer-source',
    declaredClass: 'jimu.dijit.FeaturelayerSource',
    nls: null,

    //common options:
    multiple: false,

    //FeaturelayerChooserFromMap options
    createMapResponse: null,

    //FeaturelayerChooserFromPortal options
    portalUrl: null,

    layerChooserFromMap: null, // optional, default value is 'jimu/dijit/FeaturelayerChooserFromMap'
    //public methods:
    //getSelectedItems
    //getSelectedRadioType

    //events:
    //ok
    //cancel

    postMixInProperties: function(){
      this.nls = window.jimuNls.featureLayerSource;
      this.portalUrl = portalUrlUtils.getStandardPortalUrl(this.portalUrl);
    },

    postCreate: function(){
      this.inherited(arguments);
      this._initSelf();
    },

    getSelectedRadioType: function(){
      if(this.mapRadio.checked){
        return "map";
      }else if(this.portalRadio.checked){
        return "portal";
      }else if(this.urlRadio.checked){
        return "url";
      }
    },

    getSelectedItems: function(){
      var items = [];
      if(this.mapRadio.checked){
        items = this.flcMap.getSelectedItems();
      }
      else if(this.portalRadio.checked){
        items = this.flcPortal.getSelectedItems();
      }
      else if(this.urlRadio.checked){
        items = this.flcUrl.getSelectedItems();
      }
      return items;
    },

    startup: function(){
      this.inherited(arguments);
      this.flcMap.startup();
      this.flcPortal.startup();
      this.flcUrl.startup();
    },

    _initSelf: function(){
      this._initRadios();

      //create FeaturelayerChooserWithButtons
      this._createFeaturelayerChooserWithButtons();

      //create FeaturelayerChooserFromPortal
      this._createFeaturelayerChooserFromPortal();

      //create _FeaturelayerServiceChooserContent
      this._createFeaturelayerServiceChooserContent();

      this._onRadioClicked();
    },

    _createFeaturelayerChooserWithButtons: function(){
      var args1 = {
        style: {
          width: '100%',
          height: '100%'
        },
        multiple: this.multiple,
        createMapResponse: this.createMapResponse,
        onlyShowWebMapLayers: true,
        layerChooserFromMap: this.layerChooserFromMap
      };
      this.flcMap = new FeaturelayerChooserWithButtons(args1);
      this.flcMap.operationTip = this.nls.selectLayer;
      this.flcMap.placeAt(this.flcContainer);

      this.own(on(this.flcMap, 'ok', lang.hitch(this, function(items){
        if(items && items.length > 0){
          this.emit('ok', items);
        }
      })));

      this.own(on(this.flcMap, 'cancel', lang.hitch(this, function(){
        this.emit('cancel');
      })));
    },

    _createFeaturelayerChooserFromPortal: function(){
      var args2 = {
        multiple: this.multiple,
        portalUrl: this.portalUrl,
        style: {
          width: '100%',
          height: '100%'
        }
      };
      this.flcPortal = new FeaturelayerChooserFromPortal(args2);
      this.flcPortal.operationTip = this.nls.chooseItem;
      this.flcPortal.placeAt(this.hflcContainer);

      this.own(on(this.flcPortal, 'next', lang.hitch(this, function(){
        this.flcPortal.operationTip = this.nls.chooseItem + " -> " + this.nls.chooseLayer;
        this._updateOperationTip();
      })));

      this.own(on(this.flcPortal, 'back', lang.hitch(this, function(){
        this.flcPortal.operationTip = this.nls.chooseItem;
        this._updateOperationTip();
      })));

      this.own(on(this.flcPortal, 'ok', lang.hitch(this, function(items){
        if(items && items.length > 0){
          this.emit('ok', items);
        }
      })));

      this.own(on(this.flcPortal, 'cancel', lang.hitch(this, function(){
        this.emit('cancel');
      })));

      var portalUrl = this.portalUrl || '';
      if(portalUrl.toLowerCase().indexOf('.arcgis.com') >= 0){
        this.portalLabel.innerHTML = this.nls.selectFromOnline;
      }
      else{
        this.portalLabel.innerHTML = this.nls.selectFromPortal;
      }
    },

    _createFeaturelayerServiceChooserContent: function(){
      var args3 = {
        multiple: this.multiple,
        style: {
          width: '100%',
          height: '100%'
        }
      };
      this.flcUrl = new _FeaturelayerServiceChooserContent(args3);
      this.flcUrl.operationTip = this.nls.setServiceUrl;
      this.flcUrl.placeAt(this.flscContainer);

      this.own(on(this.flcUrl, 'ok', lang.hitch(this, function(items){
        if(items && items.length > 0){
          this.emit('ok', items);
        }
      })));

      this.own(on(this.flcUrl, 'cancel', lang.hitch(this, function(){
        this.emit('cancel');
      })));
    },

    _initRadios: function(){
      var group = "featureLayerSourceRadios_" + this._getRandomString();
      var radioChangeHandler = lang.hitch(this, this._onRadioClicked);

      this.mapRadio = new RadioBtn({
        group: group,
        onStateChange: radioChangeHandler,
        checked: true
      });
      this.mapRadio.placeAt(this.mapTd, 'first');

      this.portalRadio = new RadioBtn({
        group: group,
        onStateChange: radioChangeHandler,
        checked: false
      });
      this.portalRadio.placeAt(this.portalTd, 'first');

      this.urlRadio = new RadioBtn({
        group: group,
        onStateChange: radioChangeHandler,
        checked: false
      });
      this.urlRadio.placeAt(this.urlTd, 'first');

      this.own(on(this.mapLabel, 'click', lang.hitch(this, function(){
        this.mapRadio.check();
      })));

      this.own(on(this.portalLabel, 'click', lang.hitch(this, function(){
        this.portalRadio.check();
      })));

      this.own(on(this.urlLabel, 'click', lang.hitch(this, function(){
        this.urlRadio.check();
      })));
    },

    _getRandomString: function(){
      var str = Math.random().toString();
      str = str.slice(2, str.length);
      return str;
    },

    _onRadioClicked: function(){
      html.setStyle(this.flcContainer, 'display', 'none');
      html.setStyle(this.hflcContainer, 'display', 'none');
      html.setStyle(this.flscContainer, 'display', 'none');

      if(this.mapRadio.checked){
        html.setStyle(this.flcContainer, 'display', 'block');
        this.operationTip.innerHTML = this.nls.selectLayer;
      }
      else if(this.portalRadio.checked){
        html.setStyle(this.hflcContainer, 'display', 'block');
        this.operationTip.innerHTML = this.nls.chooseItem;
      }
      else if(this.urlRadio.checked){
        html.setStyle(this.flscContainer, 'display', 'block');
        this.operationTip.innerHTML = this.nls.setServiceUrl;
      }

      this._updateOperationTip();
    },

    _updateOperationTip: function(){
      if(this.mapRadio.checked){
        this.operationTip.innerHTML = this.flcMap.operationTip;
      }
      else if(this.portalRadio.checked){
        this.operationTip.innerHTML = this.flcPortal.operationTip;
      }
      else if(this.urlRadio.checked){
        this.operationTip.innerHTML = this.flcUrl.operationTip;
      }
    }

  });
});

},
'jimu/dijit/_FeaturelayerChooserWithButtons':function(){
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
  'dojo/on',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/dijit/FeaturelayerChooserFromMap'
],
function(on, Evented, lang, html, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
  FeaturelayerChooserFromMap) {

  var baseClassArr = [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented];

  var FeaturelayerChooserWithButtons = declare(baseClassArr, {
    baseClass: 'jimu-layer-chooser-with-buttons jimu-feature-layer-chooser-with-buttons',
    declaredClass: 'jimu.dijit.FeaturelayerChooserWithButtons',
    templateString: '<div>' +
      '<div class="chooser-container" data-dojo-attach-point="chooserContainer"></div>' +
      '<div class="footer">' +
        '<div class="jimu-btn jimu-float-trailing cancel jimu-btn-vacation" data-dojo-attach-point="btnCancel">' +
          '${nls.cancel}' +
        '</div>' +
        '<div class="jimu-btn jimu-float-trailing ok jimu-trailing-margin1 jimu-state-disabled"' +
        ' data-dojo-attach-point="btnOk">' +
          '${nls.ok}' +
        '</div>' +
      '</div>' +
    '</div>',

    layerChooserFromMap: null, // optional, default value is 'jimu/dijit/FeaturelayerChooserFromMap'
    //events:
    //ok
    //cancel

    //public methods:
    //getSelectedItems

    constructor: function(options){
      this.options = options;
    },

    postMixInProperties: function(){
      this.nls = lang.clone(window.jimuNls.common);
    },

    postCreate: function(){
      this.inherited(arguments);
      if(this.layerChooserFromMap) {
        this.layerChooser = this.layerChooserFromMap;
      } else {
        this.layerChooser = new FeaturelayerChooserFromMap(this.options);
      }
      this.layerChooser.placeAt(this.chooserContainer);
      html.setStyle(this.layerChooser.domNode, {
        width: '100%',
        height: '100%'
      });

      this.own(on(this.layerChooser, 'tree-click', lang.hitch(this, function(){
        var items = this.getSelectedItems();
        if(items.length > 0){
          html.removeClass(this.btnOk, 'jimu-state-disabled');
        }
        else{
          html.addClass(this.btnOk, 'jimu-state-disabled');
        }
      })));

      this.own(on(this.btnOk, 'click', lang.hitch(this, function(){
        var items = this.getSelectedItems();
        if(items.length > 0){
          this.emit('ok', items);
        }
      })));

      this.own(on(this.btnCancel, 'click', lang.hitch(this, function(){
        this.emit('cancel');
      })));
    },

    getSelectedItems: function(){
      return this.layerChooser.getSelectedItems();
    },

    startup: function(){
      this.inherited(arguments);
      this.layerChooser.startup();
    }
  });

  return FeaturelayerChooserWithButtons;
});

},
'jimu/dijit/FeaturelayerChooserFromMap':function(){
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
  'dojo/Deferred',
  'dojo/_base/html',
  'dojo/_base/lang',
  './LayerChooserFromMap'
],
function(declare, Deferred, html, lang, LayerChooserFromMap) {
  return declare([LayerChooserFromMap], {
    baseClass: 'jimu-featurelayer-chooser-from-map',
    declaredClass: 'jimu.dijit.FeaturelayerChooserFromMap',

    //options:
    types: null,//available values:['point','polyline','polygon']
    showLayerFromFeatureSet: false,
    showTable: false,//if true, types will be ignored for table layer
    onlyShowVisible: false,//if the layer is a Table, this option is ignored
    ignoredFeaturelayerIds: null,//an array of ignored feature layer ids
    mustSupportStatistics: false,
    ignoreVirtualLayer: false,

    //public methods:
    //getSelectedItems return [{name, url, layerInfo}]

    //methods need to be override:
    //getHandledItem
    //filter

    postMixInProperties:function(){
      this.inherited(arguments);
      if(!this.ignoredFeaturelayerIds){
        this.ignoredFeaturelayerIds = [];
      }
      this.basicFilter = lang.hitch(this, this.basicFilter);
      this.filter = LayerChooserFromMap.createFeaturelayerFilter(this.types,
                                                                 this.showLayerFromFeatureSet,
                                                                 this.showTable,
                                                                 this.mustSupportStatistics);

      if(this.ignoreVirtualLayer){
        this.filter = LayerChooserFromMap.andCombineFilters(
          [this.filter, lang.hitch(this, this._ignoreVirtualLayerFilter)]
        );
      }
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-basic-layer-chooser-from-map');
    },

    _ignoreVirtualLayerFilter: function(layerInfo){
      return layerInfo.getLayerType().then(function(layerType) {
        var virtualLayer = layerType === 'ArcGISDynamicMapServiceLayer' ||
          layerType === 'ArcGISTiledMapServiceLayer' || layerType === 'GroupLayer';
        return !virtualLayer;
      });
    },

    //override basicFilter method of LayerChooserFromMap
    basicFilter: function(layerInfo) {
      var def = new Deferred();
      if(this.ignoredFeaturelayerIds.indexOf(layerInfo.id) >= 0){
        def.resolve(false);
      }else{
        if (this.onlyShowVisible && layerInfo.getLayerType() !== 'Table') {
          def.resolve(layerInfo.isShowInMap());
        } else {
          def.resolve(true);
        }
      }
      return def;
    },

    //both getSelectedItems and getAllItems return [{name, url, layerInfo}]
    //return [{name, url, layerInfo}], if featurecollection, url is empty
    getHandledItem: function(item){
      var result = this.inherited(arguments);
      var layerInfo = item && item.layerInfo;
      var layerObject = layerInfo && layerInfo.layerObject;
      var url = (layerObject && layerObject.url) || '';
      result.url = url;
      return result;
    }

  });
});
},
'jimu/dijit/LayerChooserFromMap':function(){
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
    'dojo/on',
    'dojo/Evented',
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/store/Memory',
    'dojo/Deferred',
    'dojo/store/Observable',
    'dijit/tree/ObjectStoreModel',
    'dojo/promise/all',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/array',
    'jimu/utils',
    'jimu/dijit/_Tree',
    'jimu/LayerInfos/LayerInfos',
    'jimu/dijit/LoadingIndicator'
  ],
  function(on, Evented, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Memory, Deferred, Observable,
    ObjectStoreModel, all, lang, html, array, jimuUtils, JimuTree, LayerInfos, LoadingIndicator) {

    var LayerChooser = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      templateString:'<div style="width:100%;">' +
        '<div data-dojo-attach-point="errorTipSection" class="error-tip-section">' +
          '<span class="jimu-icon jimu-icon-error"></span>' +
          '<span class="jimu-state-error-text" data-dojo-attach-point="errTip">' +
          '${nls.noLayersTip}</span>' +
        '</div>' +
      '</div>',
      _store: null,
      _id: 0,
      _treeClass: 'layer-chooser-tree',

      //constructor options:
      createMapResponse: null, //The response of method createMap.
      multiple: false, //Can select multiple layers or a single layer.
      onlyShowVisible: false,
      updateWhenLayerInfosIsShowInMapChanged: false,
      onlyShowWebMapLayers: false,
      displayTooltipForTreeNode: false,

      //public methods:
      //getSelectedItems

      //methods need to override:
      //getSelectedItems
      //filter

      //attributes:
      //tree

      //events:
      //tree-click
      //update

      postMixInProperties:function(){
        this.nls = window.jimuNls.basicLayerChooserFromMap;
      },

      postCreate: function() {
        this.inherited(arguments);
        html.addClass(this.domNode, 'jimu-basic-layer-chooser-from-map');
        this.multiple = !!this.multiple;

        this.shelter = new LoadingIndicator({hidden:true});
        this.shelter.placeAt(this.domNode);
        this.shelter.startup();

        this._createTree();
        this.basicFilter = lang.hitch(this, this.basicFilter);
        this.filter = LayerChooser.andCombineFilters([this.basicFilter, this.filter]);

        if(this.createMapResponse){
          this.setCreateMapResponse(this.createMapResponse);
        }
      },

      basicFilter: function(layerInfo){
        var def = new Deferred();
        if(this.onlyShowVisible){
          def.resolve(layerInfo.isShowInMap());
        }else{
          def.resolve(true);
        }
        return def;
      },

      //to be override, return Deferred object
      //if resolve true, means layerInfo can be displayed in tree
      filter: function(layerInfo){
        /*jshint unused: false*/
        var def = new Deferred();
        def.resolve(true);
        return def;
      },

      //return an array, each element has 'name' and 'layerInfo' attribute
      getSelectedItems: function(){
        var items = this.tree.getSelectedItems();
        var handledItems = array.map(items, lang.hitch(this, function(item){
          return this.getHandledItem(item);
        }));
        return handledItems;
      },

      //return an array, each element has 'name' and 'layerInfo' attribute
      getAllItems: function(){
        var items = this.tree.getAllItems();
        var handledItems = [];
        array.forEach(items, lang.hitch(this, function(item){
          if(item.id !== 'root'){
            var handledItem = this.getHandledItem(item);
            handledItems.push(handledItem);
          }
        }));
        return handledItems;
      },

      //to be override
      getHandledItem: function(item){
        return {
          name: item.name,
          layerInfo: item.layerInfo
        };
      },

      _isLeafItem: function(item) {
        return item.isLeaf;
      },

      setCreateMapResponse: function(createMapResponse){
        this.createMapResponse = createMapResponse;
        var map = this.createMapResponse.map;
        var mapItemInfo = this.createMapResponse.itemInfo;
        LayerInfos.getInstance(map, mapItemInfo).then(lang.hitch(this, function(layerInfosObj) {
          this.layerInfosObj = layerInfosObj;
          this.own(
            on(this.layerInfosObj, 'layerInfosChanged', lang.hitch(this, this._onLayerInfosChanged))
          );
          if(this.updateWhenLayerInfosIsShowInMapChanged){
            this.own(
              on(this.layerInfosObj, 'layerInfosIsShowInMapChanged',
                lang.hitch(this, this._onLayerInfosIsShowInMapChanged))
            );
          }
          this._buildTree(this.layerInfosObj);
        }));
      },

      _onLayerInfosChanged: function(layerInfo, changedType) {
        /*jshint unused: false*/
        this._buildTree(this.layerInfosObj);
        this.emit('update');
      },

      _onLayerInfosIsShowInMapChanged: function(changedLayerInfos){
        /*jshint unused: false*/
        this._buildTree(this.layerInfosObj);
        this.emit('update');
      },

      _buildTree: function(layerInfosObj){
        this._clear();
        html.setStyle(this.errorTipSection, 'display', 'block');
        var layerInfos = [];

        if(this.onlyShowWebMapLayers){
          layerInfos = layerInfosObj.getLayerInfoArrayOfWebmap();
          layerInfos = layerInfos.concat(layerInfosObj.getTableInfoArrayOfWebmap());
        }else{
          layerInfos = layerInfosObj.getLayerInfoArray();
          layerInfos = layerInfos.concat(layerInfosObj.getTableInfoArray());
        }

        if(layerInfos.length === 0){
          return;
        }

        html.setStyle(this.errorTipSection, 'display', 'none');
        array.forEach(layerInfos, lang.hitch(this, function(layerInfo){
          this._addDirectLayerInfo(layerInfo);
        }));
      },

      _addDirectLayerInfo: function(layerInfo){
        if(!layerInfo){
          return;
        }
        layerInfo.getLayerObject().then(lang.hitch(this, function(){
          this._addItem('root', layerInfo);
        }), lang.hitch(this, function(err){
          console.error(err);
        }));
      },

      _clear:function(){
        var items = this._store.query({parent:'root'});
        array.forEach(items, lang.hitch(this, function(item){
          if(item && item.id !== 'root'){
            this._store.remove(item.id);
          }
        }));
      },

      _addItem: function(parentId, layerInfo) {
        var item = null;
        var layerTypeDef = layerInfo.getLayerType();
        var validDef = this.filter(layerInfo);
        all({
          layerType: layerTypeDef,
          valid: validDef
        }).then(lang.hitch(this, function(result) {
          if(result.valid) {
            var callback = lang.hitch(this, function(isLeaf, hasChildren){
              this._id++;
              item = {
                name: layerInfo.title || "",
                parent: parentId,
                layerInfo: layerInfo,
                type: result.layerType,
                layerClass: layerInfo.layerObject.declaredClass,
                id: this._id.toString(),
                isLeaf: isLeaf,
                hasChildren: hasChildren
              };
              this._store.add(item);
            });

            var subLayerInfos = layerInfo.getSubLayers();

            var isLeaf = subLayerInfos.length === 0;

            var hasChildren = true;

            if(isLeaf){
              hasChildren = false;
              callback(isLeaf, hasChildren);
            }else{
              var defs = array.map(subLayerInfos, lang.hitch(this, function(subLayerInfo){
                return this.filter(subLayerInfo);
              }));
              all(defs).then(lang.hitch(this, function(filterResults){
                var hasChildren = array.some(filterResults, function(filterResult){
                  return filterResult;
                });
                if(hasChildren){
                  callback(isLeaf, hasChildren);
                }
              }));
            }
          }
        }));
      },

      _getRootItem:function(){
        return { id: 'root', name:'Map Root', type:'root', isLeaf: false, hasChildren: true};
      },

      _createTree: function() {
        var rootItem = this._getRootItem();
        var myMemory = new Memory({
          data: [rootItem],
          getChildren: function(object) {
            return this.query({
              parent: object.id
            });
          }
        });

        // Wrap the store in Observable so that updates to the store are reflected to the Tree
        this._store = new Observable(myMemory);

        var myModel = new ObjectStoreModel({
          store: this._store,
          query: {
            id: "root"
          },
          mayHaveChildren: lang.hitch(this, this._mayHaveChildren)
        });

        this.tree = new JimuTree({
          multiple: this.multiple,
          model: myModel,
          showRoot: false,
          isLeafItem: lang.hitch(this, this._isLeafItem),

          style: {
            width: "100%"
          },

          onOpen: lang.hitch(this, function(item, node) {
            if (item.id === 'root') {
              return;
            }
            this._onTreeOpen(item, node);
          }),

          onClick: lang.hitch(this, function(item, node, evt) {
            this._onTreeClick(item, node, evt);
            this.emit('tree-click', item, node, evt);
          }),

          getIconStyle: lang.hitch(this, function(item, opened) {
            var icon = null;
            if (!item || item.id === 'root') {
              return null;
            }

            var a = {
              width: "20px",
              height: "20px",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundImage: ''
            };

            var baseUrl = window.location.protocol + "//" + window.location.host + require.toUrl("jimu");

            var imageName = this._getIconInfo(item, opened).imageName;

            if (imageName) {
              a.backgroundImage = "url(" + baseUrl + "/css/images/" + imageName + ")";
              icon = a;
            }

            return icon;
          }),

          getIconClass: lang.hitch(this, function(item, opend) {
            return this._getIconInfo(item, opend).className;
          }),

          getTooltip: lang.hitch(this, function(item){
            return this.displayTooltipForTreeNode ? item.layerInfo.title : "";
          })
        });
        html.addClass(this.tree.domNode, this._treeClass);
        this.tree.placeAt(this.shelter.domNode, 'before');
      },

      _mayHaveChildren: function(item) {
        return item.hasChildren;
      },

      _getIconInfo: function(item, opened) {
        var imageName = '';
        var className = '';

        if (item.type === 'ArcGISDynamicMapServiceLayer' ||
          item.type === 'ArcGISTiledMapServiceLayer') {
          if (opened) {
            imageName = 'mapserver_open.png';
            className = 'mapservice-layer-icon open';
          } else {
            imageName = 'mapserver_close.png';
            className = 'mapservice-layer-icon close';
          }
        } else if (item.type === 'GroupLayer') {
          if (opened) {
            imageName = 'group_layer2.png';
            className = 'group-layer-icon open';
          } else {
            imageName = 'group_layer1.png';
            className = 'group-layer-icon close';
          }
        } else if (item.type === 'FeatureLayer') {
          var geoType = jimuUtils.getTypeByGeometryType(item.layerInfo.layerObject.geometryType);
          if (geoType === 'point') {
            imageName = 'point_layer1.png';
            className = 'point-layer-icon';
          } else if (geoType === 'polyline') {
            imageName = 'line_layer1.png';
            className = 'line-layer-icon';
          } else if (geoType === 'polygon') {
            imageName = 'polygon_layer1.png';
            className = 'polygon-layer-icon';
          }
        } else if(item.type === 'Table'){
          imageName = "table.png";
          className = 'table-icon';
        } else if(item.type === 'ArcGISImageServiceLayer' ||
         item.type === 'ArcGISImageServiceVectorLayer'){
          imageName = 'image_layer.png';
          className = 'iamge-layer-icon';
        } else {
          if (opened) {
            imageName = 'mapserver_open.png';
            className = 'mapservice-layer-icon open';
          } else {
            imageName = 'mapserver_close.png';
            className = 'mapservice-layer-icon close';
          }
        }
        return {
          imageName: imageName,
          className: className
        };
      },

      _onTreeOpen: function(item, node) { /*jshint unused: false*/
        if(item.id === 'root'){
          return;
        }
        var layerInfo = item.layerInfo;
        var subLayerInfos = [];
        var defs = [];
        subLayerInfos = layerInfo.getSubLayers();
        if (item.checked) {
          return;
        }
        this.shelter.show();
        defs = array.map(subLayerInfos, lang.hitch(this, function(subLayerInfo) {
          return subLayerInfo.getLayerObject();
        }));

        all(defs).then(lang.hitch(this, function() {
          if (!this.domNode) {
            return;
          }
          array.forEach(subLayerInfos, lang.hitch(this, function(subLayerInfo) {
            this._addItem(item.id, subLayerInfo);
          }));
          item.checked = true;
          this.shelter.hide();
        }), lang.hitch(this, function(err) {
          console.error(err);
          this.shelter.hide();
          if (!this.domNode) {
            return;
          }
        }));
      },

      //to be override
      _onTreeClick: function(item, node, evt){/*jshint unused: false*/},

      destroy: function(){
        if(this.shelter){
          this.shelter.destroy();
          this.shelter = null;
        }
        if(this.tree){
          this.tree.destroy();
        }
        this.inherited(arguments);
      }
    });

    //layerTypes: array, such as ['FeatureLayer']
    //supports layers:
    //    "FeatureLayer"
    //    "ArcGISDynamicMapServiceLayer"
    //    "ArcGISTiledMapServiceLayer"
    //    "GeoRSSLayer"
    //    "KMLLayer"
    //    "WMSLayer"
    //    "WTMSLayer"
    //    "FeatureCollection"
    //the returned filter will filter layers by layerType
    LayerChooser.createFilterByLayerType = function(layerTypes) {
      if (!lang.isArrayLike(layerTypes)) {
        layerTypes = [];
      }
      return function(layerInfo) {
        var defResult = new Deferred();
        if (layerTypes.length === 0) {
          defResult.resolve(true);
        } else {
          var layerTypeDefs = [];

          layerInfo.traversal(function(layerInfo) {
            layerTypeDefs.push(layerInfo.getLayerType());
          });

          all(layerTypeDefs).then(function(layerTypeDefResults) {
            for (var i = 0; i < layerTypeDefResults.length; i++) {
              for (var j = 0; j < layerTypes.length; j++) {
                if (layerTypeDefResults[i] === layerTypes[j]) {
                  defResult.resolve(true);
                  return;
                }
              }
            }
            defResult.resolve(false);
          }, function(err){
            console.error(err);
            defResult.reject(err);
          });
        }

        return defResult;
      };
    };

    //the returned filter only filters FeatureLayer
    LayerChooser.createFeaturelayerFilter = function(types, showLayerFromFeatureSet, showTable, mustSupportStatistics){
      var allTypes = ['point', 'polyline', 'polygon'];
      if(types && types.length > 0){
        types = array.filter(types, function(type){
          return allTypes.indexOf(type) >= 0;
        });
        if(types.length === 0){
          types = allTypes;
        }
      }
      else{
        types = allTypes;
      }

      return function(layerInfo){
        var defLayerType = layerInfo.getLayerType();
        var defLayerObject = layerInfo.getLayerObject();
        return all({
          layerType: defLayerType,
          layerObject: defLayerObject
        }).then(function(result){
          var layerType = result.layerType;
          var layerObject = result.layerObject;
          if (layerType === 'ArcGISDynamicMapServiceLayer') {
            return true;
          } else if (layerType === 'ArcGISTiledMapServiceLayer') {
            return true;
          } else if (layerType === 'GroupLayer'){
            return true;
          } else if (layerType === 'FeatureCollection'){
            return true;
          }else if (layerType === 'FeatureLayer') {
            var geoType = jimuUtils.getTypeByGeometryType(layerObject.geometryType);
            var isValidGeoType = array.indexOf(types, geoType) >= 0;
            var isLayerValidStatistics = LayerChooser._shouldPassStatisticsCheck(mustSupportStatistics, layerObject);

            if (layerObject.url) {
              //featurelayer by url
              var isLayerSupportQuery = jimuUtils.isFeaturelayerUrlSupportQuery(layerObject.url,
                  layerObject.capabilities);
              return (isValidGeoType && isLayerSupportQuery && isLayerValidStatistics);
            } else {
              //featurelayer by featureset
              return (showLayerFromFeatureSet && isValidGeoType);
            }
          } else if(layerType === 'Table'){
            //if showTable is true, we will ignore types
            var isTableSupportQuery = jimuUtils.isFeaturelayerUrlSupportQuery(layerObject.url,
                  layerObject.capabilities);
            var isTableValidStatistics = LayerChooser._shouldPassStatisticsCheck(mustSupportStatistics, layerObject);
            return (showTable && isTableSupportQuery && isTableValidStatistics);
          }else{
            return false;
          }
        });
      };
    };

    //the returned filter only filters ArcGISImageServiceLayer and ArcGISImageServiceVectorLayer
    LayerChooser.createImageServiceLayerFilter = function(isSupportQuery, mustSupportStatistics){
      return function(layerInfo){
        var defLayerType = layerInfo.getLayerType();
        var defLayerObject = layerInfo.getLayerObject();
        return all({
          layerType: defLayerType,
          layerObject: defLayerObject
        }).then(function(result){
          var layerType = result.layerType;
          var layerObject = result.layerObject;
          if(layerType === 'ArcGISImageServiceLayer' ||
           layerType === 'ArcGISImageServiceVectorLayer'){
            if(isSupportQuery){
              if(jimuUtils.isImageServiceSupportQuery(result.layerObject.capabilities)){
                if(mustSupportStatistics){
                  return LayerChooser._shouldPassStatisticsCheck(mustSupportStatistics, layerObject);
                }else{
                  return true;
                }
              }else{
                return false;
              }
            }else{
              return true;
            }
          }else{
            return false;
          }
        });
      };
    };

    LayerChooser._shouldPassStatisticsCheck = function(mustSupportStatistics, layerObject){
      if(mustSupportStatistics){
        var isSupport = false;
        if (layerObject.advancedQueryCapabilities) {
          isSupport = !!layerObject.advancedQueryCapabilities.supportsStatistics;
        } else {
          isSupport = !!layerObject.supportsStatistics;
        }
        return isSupport;
      }else{
        return true;
      }
    };

    LayerChooser.createQueryableLayerFilter = function(mustSupportStatistics){
      var types = ['point', 'polyline', 'polygon'];
      var featureLayerFilter = LayerChooser.createFeaturelayerFilter(types, false, true, mustSupportStatistics);
      var imageServiceLayerFilter = LayerChooser.createImageServiceLayerFilter(true, mustSupportStatistics);
      var filters = [featureLayerFilter, imageServiceLayerFilter];
      var combinedFilter = LayerChooser.orCombineFilters(filters);
      return combinedFilter;
    };

    //combine multiple filters into one filter
    //if all filters pass, the combined filter will pass
    LayerChooser.andCombineFilters = function(filters){
      return LayerChooser._combineFilters(filters, true);
    };

    //combine multiple filters into one filter
    //if one of the filters passes, the combined filter will pass
    LayerChooser.orCombineFilters = function(filters){
      return LayerChooser._combineFilters(filters, false);
    };

    LayerChooser._combineFilters = function(filters, isAnd){
      return function(layerInfo){
        var defResult = new Deferred();
        var defs = array.map(filters, function(filter){
          return filter(layerInfo);
        });
        all(defs).then(function(filterResults){
          var isPass = false;
          if(isAnd){
            isPass = array.every(filterResults, function(filterResult){
              return filterResult;
            });
          }else{
            isPass = array.some(filterResults, function(filterResult){
              return filterResult;
            });
          }

          defResult.resolve(isPass);
        }, function(err){
          console.error(err);
          defResult.reject(err);
        });
        return defResult;
      };
    };

    return LayerChooser;
  });

},
'dojo/store/Observable':function(){
define(["../_base/kernel", "../_base/lang", "../when", "../_base/array" /*=====, "./api/Store" =====*/
], function(kernel, lang, when, array /*=====, Store =====*/){

// module:
//		dojo/store/Observable

var Observable = function(/*Store*/ store){
	// summary:
	//		The Observable store wrapper takes a store and sets an observe method on query()
	//		results that can be used to monitor results for changes.
	//
	// description:
	//		Observable wraps an existing store so that notifications can be made when a query
	//		is performed.
	//
	// example:
	//		Create a Memory store that returns an observable query, and then log some
	//		information about that query.
	//
	//	|	var store = Observable(new Memory({
	//	|		data: [
	//	|			{id: 1, name: "one", prime: false},
	//	|			{id: 2, name: "two", even: true, prime: true},
	//	|			{id: 3, name: "three", prime: true},
	//	|			{id: 4, name: "four", even: true, prime: false},
	//	|			{id: 5, name: "five", prime: true}
	//	|		]
	//	|	}));
	//	|	var changes = [], results = store.query({ prime: true });
	//	|	var observer = results.observe(function(object, previousIndex, newIndex){
	//	|		changes.push({previousIndex:previousIndex, newIndex:newIndex, object:object});
	//	|	});
	//
	//		See the Observable tests for more information.

	var undef, queryUpdaters = [], revision = 0;
	// a Comet driven store could directly call notify to notify observers when data has
	// changed on the backend
	// create a new instance
	store = lang.delegate(store);
	
	store.notify = function(object, existingId){
		revision++;
		var updaters = queryUpdaters.slice();
		for(var i = 0, l = updaters.length; i < l; i++){
			updaters[i](object, existingId);
		}
	};
	var originalQuery = store.query;
	store.query = function(query, options){
		options = options || {};
		var results = originalQuery.apply(this, arguments);
		if(results && results.forEach){
			var nonPagedOptions = lang.mixin({}, options);
			delete nonPagedOptions.start;
			delete nonPagedOptions.count;

			var queryExecutor = store.queryEngine && store.queryEngine(query, nonPagedOptions);
			var queryRevision = revision;
			var listeners = [], queryUpdater;
			results.observe = function(listener, includeObjectUpdates){
				if(listeners.push(listener) == 1){
					// first listener was added, create the query checker and updater
					queryUpdaters.push(queryUpdater = function(changed, existingId){
						when(results, function(resultsArray){
							var atEnd = resultsArray.length != options.count;
							var i, l, listener;
							if(++queryRevision != revision){
								throw new Error("Query is out of date, you must observe() the query prior to any data modifications");
							}
							var removedObject, removedFrom = -1, insertedInto = -1;
							if(existingId !== undef){
								// remove the old one
								var filteredArray = [].concat(resultsArray);
								if(queryExecutor && !changed){
									filteredArray = queryExecutor(resultsArray);
								}
								for(i = 0, l = resultsArray.length; i < l; i++){
									var object = resultsArray[i];
									if(store.getIdentity(object) == existingId){
										if(filteredArray.indexOf(object)<0) continue;
										removedObject = object;
										removedFrom = i;
										if(queryExecutor || !changed){// if it was changed and we don't have a queryExecutor, we shouldn't remove it because updated objects would be eliminated
											resultsArray.splice(i, 1);
										}
										break;
									}
								}
							}
							if(queryExecutor){
								// add the new one
								if(changed &&
										// if a matches function exists, use that (probably more efficient)
										(queryExecutor.matches ? queryExecutor.matches(changed) : queryExecutor([changed]).length)){

									var firstInsertedInto = removedFrom > -1 ? 
										removedFrom : // put back in the original slot so it doesn't move unless it needs to (relying on a stable sort below)
										resultsArray.length;
									resultsArray.splice(firstInsertedInto, 0, changed); // add the new item
									insertedInto = array.indexOf(queryExecutor(resultsArray), changed); // sort it
									// we now need to push the change back into the original results array
									resultsArray.splice(firstInsertedInto, 1); // remove the inserted item from the previous index
									
									if((options.start && insertedInto == 0) ||
										(!atEnd && insertedInto == resultsArray.length)){
										// if it is at the end of the page, assume it goes into the prev or next page
										insertedInto = -1;
									}else{
										resultsArray.splice(insertedInto, 0, changed); // and insert into the results array with the correct index
									}
								}
							}else if(changed){
								// we don't have a queryEngine, so we can't provide any information
								// about where it was inserted or moved to. If it is an update, we leave it's position alone, other we at least indicate a new object
								if(existingId !== undef){
									// an update, keep the index the same
									insertedInto = removedFrom;
								}else if(!options.start){
									// a new object
									insertedInto = store.defaultIndex || 0;
									resultsArray.splice(insertedInto, 0, changed);
								}
							}
							if((removedFrom > -1 || insertedInto > -1) &&
									(includeObjectUpdates || !queryExecutor || (removedFrom != insertedInto))){
								var copyListeners = listeners.slice();
								for(i = 0;listener = copyListeners[i]; i++){
									listener(changed || removedObject, removedFrom, insertedInto);
								}
							}
						});
					});
				}
				var handle = {};
				// TODO: Remove cancel in 2.0.
				handle.remove = handle.cancel = function(){
					// remove this listener
					var index = array.indexOf(listeners, listener);
					if(index > -1){ // check to make sure we haven't already called cancel
						listeners.splice(index, 1);
						if(!listeners.length){
							// no more listeners, remove the query updater too
							queryUpdaters.splice(array.indexOf(queryUpdaters, queryUpdater), 1);
						}
					}
				};
				return handle;
			};
		}
		return results;
	};
	var inMethod;
	function whenFinished(method, action){
		var original = store[method];
		if(original){
			store[method] = function(value){
				var originalId;
				if(method === 'put'){
					originalId = store.getIdentity(value);
				}
				if(inMethod){
					// if one method calls another (like add() calling put()) we don't want two events
					return original.apply(this, arguments);
				}
				inMethod = true;
				try{
					var results = original.apply(this, arguments);
					when(results, function(results){
						action((typeof results == "object" && results) || value, originalId);
					});
					return results;
				}finally{
					inMethod = false;
				}
			};
		}
	}
	// monitor for updates by listening to these methods
	whenFinished("put", function(object, originalId){
		store.notify(object, originalId);
	});
	whenFinished("add", function(object){
		store.notify(object);
	});
	whenFinished("remove", function(id){
		store.notify(undefined, id);
	});

	return store;
};

lang.setObject("dojo.store.Observable", Observable);

return Observable;
});

},
'dijit/tree/ObjectStoreModel':function(){
define([
	"dojo/_base/array", // array.filter array.forEach array.indexOf array.some
	"dojo/aspect", // aspect.before, aspect.after
	"dojo/_base/declare", // declare
	"dojo/Deferred",
	"dojo/_base/lang", // lang.hitch
	"dojo/when",
	"../Destroyable"
], function(array, aspect, declare, Deferred, lang, when, Destroyable){

	// module:
	//		dijit/tree/ObjectStoreModel

	return declare("dijit.tree.ObjectStoreModel", Destroyable, {
		// summary:
		//		Implements dijit/tree/model connecting dijit/Tree to a dojo/store/api/Store that implements
		//		getChildren().
		//
		//		If getChildren() returns an array with an observe() method, then it will be leveraged to reflect
		//		store updates to the tree.   So, this class will work best when:
		//
		//			1. the store implements dojo/store/Observable
		//			2. getChildren() is implemented as a query to the server (i.e. it calls store.query())
		//
		//		Drag and Drop: To support drag and drop, besides implementing getChildren()
		//		and dojo/store/Observable, the store must support the parent option to put().
		//		And in order to have child elements ordered according to how the user dropped them,
		//		put() must support the before option.

		// store: dojo/store/api/Store
		//		Underlying store
		store: null,

		// labelAttr: String
		//		Get label for tree node from this attribute
		labelAttr: "name",

		// labelType: [const] String
		//		Specifies how to interpret the labelAttr in the data store items.
		//		Can be "html" or "text".
		labelType: "text",

		// root: [readonly] Object
		//		Pointer to the root item from the dojo/store/api/Store (read only, not a parameter)
		root: null,

		// query: anything
		//		Specifies datastore query to return the root item for the tree.
		//		Must only return a single item.   Alternately can just pass in pointer
		//		to root item.
		// example:
		//	|	{id:'ROOT'}
		query: null,

		constructor: function(/* Object */ args){
			// summary:
			//		Passed the arguments listed above (store, etc)
			// tags:
			//		private

			lang.mixin(this, args);

			// Map from id of each parent node to array of its children, or to Promise for that array of children.
			this.childrenCache = {};
		},

		// =======================================================================
		// Methods for traversing hierarchy

		getRoot: function(onItem, onError){
			// summary:
			//		Calls onItem with the root item for the tree, possibly a fabricated item.
			//		Calls onError on error.
			if(this.root){
				onItem(this.root);
			}else{
				var res = this.store.query(this.query);
				if(res.then){
					this.own(res);	// in case app calls destroy() before query completes
				}

				when(res,
					lang.hitch(this, function(items){
						//console.log("queried root: ", res);
						if(items.length != 1){
							throw new Error("dijit.tree.ObjectStoreModel: root query returned " + items.length +
								" items, but must return exactly one");
						}
						this.root = items[0];
						onItem(this.root);

						// Setup listener to detect if root item changes
						if(res.observe){
							res.observe(lang.hitch(this, function(obj){
								// Presumably removedFrom == insertedInto == 1, and this call indicates item has changed.
								//console.log("root changed: ", obj);
								this.onChange(obj);
							}), true);	// true to listen for updates to obj
						}
					}),
					onError
				);
			}
		},

		mayHaveChildren: function(/*===== item =====*/){
			// summary:
			//		Tells if an item has or might have children.  Implementing logic here
			//		avoids showing +/- expando icon for nodes that we know won't have children.
			//		(For efficiency reasons we may not want to check if an element actually
			//		has children until user clicks the expando node).
			//
			//		Application code should override this method based on the data, for example
			//		it could be `return item.leaf == true;`.
			//
			//		Note that mayHaveChildren() must return true for an item if it could possibly
			//		have children in the future, due to drag-an-drop or some other data store update.
			//		Also note that it may return true if it's just too expensive to check during tree
			//		creation whether or not the item has children.
			// item: Object
			//		Item from the dojo/store
			return true;
		},

		getChildren: function(/*Object*/ parentItem, /*function(items)*/ onComplete, /*function*/ onError){
			// summary:
			//		Calls onComplete() with array of child items of given parent item.
			// parentItem:
			//		Item from the dojo/store

			// TODO:
			// For 2.0, change getChildren(), getRoot(), etc. to return a cancelable promise, rather than taking
			// onComplete() and onError() callbacks.   Also, probably get rid of the caching.
			//
			// But be careful if we continue to maintain ObjectStoreModel as a separate class
			// from Tree, because in that case ObjectStoreModel can be shared by two trees, and destroying one tree
			// should not interfere with an in-progress getChildren() call from another tree.  Also, need to make
			// sure that multiple calls to getChildren() for the same parentItem don't trigger duplicate calls
			// to onChildrenChange() and onChange().
			//
			// I think for 2.0 though that ObjectStoreModel should be rolled into Tree itself.

			var id = this.store.getIdentity(parentItem);

			if(this.childrenCache[id]){
				// If this.childrenCache[id] is defined, then it always has the latest list of children
				// (like a live collection), so just return it.
				when(this.childrenCache[id], onComplete, onError);
				return;
			}

			// Query the store.
			// Cache result so that we can close the query on destroy(), and to avoid setting up multiple observers
			// when getChildren() is called multiple times for the same parent.
			// The only problem is that getChildren() on non-Observable stores may return a stale value.
			var res = this.childrenCache[id] = this.store.getChildren(parentItem);
			if(res.then){
				this.own(res);	// in case app calls destroy() before query completes
			}

			// Setup observer in case children list changes, or the item(s) in the children list are updated.
			if(res.observe){
				this.own(res.observe(lang.hitch(this, function(obj, removedFrom, insertedInto){
					//console.log("observe on children of ", id, ": ", obj, removedFrom, insertedInto);

					// If removedFrom == insertedInto, this call indicates that the item has changed.
					// Even if removedFrom != insertedInto, the item may have changed.
					this.onChange(obj);

					if(removedFrom != insertedInto){
						// Indicates an item was added, removed, or re-parented.  The children[] array (returned from
						// res.then(...)) has already been updated (like a live collection), so just use it.
						when(res, lang.hitch(this, "onChildrenChange", parentItem));
					}
				}), true));	// true means to notify on item changes
			}

			// User callback
			when(res, onComplete, onError);
		},

		// =======================================================================
		// Inspecting items

		isItem: function(/*===== something =====*/){
			return true;	// Boolean
		},

		getIdentity: function(/* item */ item){
			return this.store.getIdentity(item);	// Object
		},

		getLabel: function(/*dojo/data/Item*/ item){
			// summary:
			//		Get the label for an item
			return item[this.labelAttr];	// String
		},

		// =======================================================================
		// Write interface, for DnD

		newItem: function(/* dijit/tree/dndSource.__Item */ args, /*Item*/ parent, /*int?*/ insertIndex, /*Item*/ before){
			// summary:
			//		Creates a new item.   See `dojo/data/api/Write` for details on args.
			//		Used in drag & drop when item from external source dropped onto tree.

			return this.store.put(args, {
				parent: parent,
				before: before
			});
		},

		pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem,
					/*Boolean*/ bCopy, /*int?*/ insertIndex, /*Item*/ before){
			// summary:
			//		Move or copy an item from one parent item to another.
			//		Used in drag & drop.

			var d = new Deferred();

			if(oldParentItem === newParentItem && !bCopy && !before){
				// Avoid problem when items visually disappear when dropped onto their parent.
				// Happens because the (no-op) store.put() call doesn't generate any notification
				// that the childItem was added/moved.
				d.resolve(true);
				return d;
			}

			if(oldParentItem && !bCopy){
				// In order for DnD moves to work correctly, childItem needs to be orphaned from oldParentItem
				// before being adopted by newParentItem.   That way, the TreeNode is moved rather than
				// an additional TreeNode being created, and the old TreeNode subsequently being deleted.
				// The latter loses information such as selection and opened/closed children TreeNodes.
				// Unfortunately simply calling this.store.put() will send notifications in a random order, based
				// on when the TreeNodes in question originally appeared, and not based on the drag-from
				// TreeNode vs. the drop-onto TreeNode.

				this.getChildren(oldParentItem, lang.hitch(this, function(oldParentChildren){
					oldParentChildren = [].concat(oldParentChildren); // concat to make copy
					var index = array.indexOf(oldParentChildren, childItem);
					oldParentChildren.splice(index, 1);
					this.onChildrenChange(oldParentItem, oldParentChildren);

					d.resolve(this.store.put(childItem, {
						overwrite: true,
						parent: newParentItem,
						oldParent: oldParentItem,
						before: before,
						isCopy: false
					}));
				}));
			}else{
				d.resolve(this.store.put(childItem, {
					overwrite: true,
					parent: newParentItem,
					oldParent: oldParentItem,
					before: before,
					isCopy: true
				}));
			}

			return d;
		},

		// =======================================================================
		// Callbacks

		onChange: function(/*dojo/data/Item*/ /*===== item =====*/){
			// summary:
			//		Callback whenever an item has changed, so that Tree
			//		can update the label, icon, etc.   Note that changes
			//		to an item's children or parent(s) will trigger an
			//		onChildrenChange() so you can ignore those changes here.
			// tags:
			//		callback
		},

		onChildrenChange: function(/*===== parent, newChildrenList =====*/){
			// summary:
			//		Callback to do notifications about new, updated, or deleted items.
			// parent: dojo/data/Item
			// newChildrenList: Object[]
			//		Items from the store
			// tags:
			//		callback
		},

		onDelete: function(/*dojo/data/Item*/ /*===== item =====*/){
			// summary:
			//		Callback when an item has been deleted.
			//		Actually we have no way of knowing this with the new dojo.store API,
			//		so this method is never called (but it's left here since Tree connects
			//		to it).
			// tags:
			//		callback
		}
	});
});

},
'jimu/dijit/_Tree':function(){
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

define(['dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/text!./templates/_TreeNode.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/event',
  'dojo/query',
  'dojo/aspect',
  'dojo/on',
  'dojo/keys',
  'dojo/Evented',
  'dijit/registry',
  'dijit/Tree',
  'jimu/utils'
],
function(declare, _WidgetBase, _TemplatedMixin, tnTemplate, lang, html, array,
  dojoEvent, query, aspect, on, keys, Evented, registry, DojoTree, jimuUtils) {
  /*jshint unused: false*/
  var JimuTreeNode = declare([DojoTree._TreeNode, Evented], {
    templateString: tnTemplate,
    declaredClass: 'jimu._TreeNode',

    //options:
    isLeaf: false,
    groupId: "", //radio group

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-tree-node');
      this.isLeaf = !!this.isLeaf;

      if(this.groupId){
        this.checkNode = html.toDom('<input type="radio" />');
        this.checkNode.name = this.groupId;
      }
      else{
        this.checkNode = html.toDom('<input type="checkbox" />');
      }

      html.addClass(this.checkNode, "jimu-tree-check-node");

      html.place(this.checkNode, this.contentNode, 'first');

      this.own(on(this.checkNode, 'click', lang.hitch(this, this._onClick)));
      // this.own(on(this.checkNode, 'keydown', lang.hitch(this, function(evt){
      //   if(evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE){
      //     this._onClick(evt);
      //   }
      // })));
      this.own(on(this.rowNode, 'keydown', lang.hitch(this, function(checkNode, evt){
        evt.target = checkNode;
        if(evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE){
          this._onClick(evt);
        }
      },this.checkNode)));

      if(this.isLeaf){
        if(this.groupId){
          html.setStyle(this.checkNode, 'display', 'none');
        }else{
          html.setStyle(this.checkNode, 'display', 'inline');
        }
      }
      else{
        html.setStyle(this.checkNode, 'display', 'none');
      }
      if(this.isLeaf){
        html.addClass(this.domNode, 'jimu-tree-leaf-node');
      }else{
        html.addClass(this.domNode, 'jimu-tree-not-leaf-node');
      }
    },

    // hasSelectedClass: function(){
    //   if(this.rowNode){
    //     if(html.hasClass(this.rowNode, 'dijitTreeRowSelected')){
    //       return true;
    //     }
    //   }
    //   return false;
    // },

    select: function(){
      if(this.isLeaf){
        this.checkNode.checked = true;
        html.addClass(this.domNode, 'jimu-tree-selected-leaf-node');
      }
    },

    unselect: function(){
      if(this.isLeaf){
        this.checkNode.checked = false;
        html.removeClass(this.domNode, 'jimu-tree-selected-leaf-node');
      }
    },

    toggleSelect: function(){
      if(this.isLeaf){
        if(this.checkNode.checked){
          this.unselect();
        }else{
          this.select();
        }
      }
    },

    _onClick: function(evt){
      var target = evt.target || evt.srcElement;
      if(target === this.checkNode){
        this.tree._onCheckNodeClick(this, this.checkNode.checked, evt);
      }
      else{
        this.tree._onClick(this, evt);
      }
    },

    _onChange: function(){
      if(this.isLeaf){
        setTimeout(lang.hitch(this, function(){
          if(this.checkNode.checked){
            this.emit('tn-select', this);
          }
          else{
            this.emit('tn-unselect', this);
          }
        }), 100);
      }
    },

    destroy: function(){
      delete this.tree;
      this.inherited(arguments);
    }
  });

  var JimuTree = declare([DojoTree, Evented], {
    declaredClass:'jimu._Tree',
    openOnClick: true,

    //options:
    multiple: true,
    uniqueId: '',
    showRoot: false,

    //public methods:
    //getSelectedItems
    //getTreeNodeByItemId
    //selectItem
    //unselectItem
    //removeItem
    //getAllLeafTreeNodeWidgets
    //getAllTreeNodeWidgets

    //method need to be override
    //isLeafItem

    postMixInProperties: function(){
      this.inherited(arguments);
      this.uniqueId = "tree_" + jimuUtils.getRandomString();
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-tree');
      this.own(aspect.before(this, 'onClick', lang.hitch(this, this._jimuBeforeClick)));
      //this.own(aspect.before(this, 'onOpen', lang.hitch(this, this._jimuBeforeOpen)));
      if(this.rootLoadingIndicator){
        html.setStyle(this.rootLoadingIndicator, 'display', 'none');
      }
      //disable selection by shift key or ctrl key + mouse click
      //http://stackoverflow.com/questions/12261723/
      //how-to-disable-multiple-selection-of-nodes-in-dijit-tree
      this.dndController.singular = true;

      //make tree dijit focusable
      html.setAttr(this.domNode, 'tabindex', 0);
    },

    removeItem: function(id){
      this.model.store.remove(id);
    },

    getAllItems: function(){
      var allTNs = this.getAllTreeNodeWidgets();
      var items = array.map(allTNs, lang.hitch(this, function(tn){
        var a = tn.item;//lang.clone(tn.item);
        a.selected = tn.checkNode.checked;
        return a;
      }));
      return items;
    },

    getSelectedItems: function(){
      var allTNs = this.getAllTreeNodeWidgets();
      var selectedTNs = array.filter(allTNs, lang.hitch(this, function(tn){
        return tn.checkNode.checked;
      }));
      // selectedTNs = array.filter(selectedTNs, lang.hitch(this, function(tn){
      //   return tn.hasSelectedClass();
      // }));
      var items = array.map(selectedTNs, lang.hitch(this, function(tn){
        return tn.item;
      }));
      return items;//lang.clone(items) may throw an error
    },

    getFilteredItems: function(func){
      var allTNs = this.getAllTreeNodeWidgets();
      var allItems = array.map(allTNs, lang.hitch(this, function(tn){
        var a = tn.item;//lang.clone(tn.item);
        a.selected = tn.checkNode.checked;
        return a;
      }));
      var filteredItems = array.filter(allItems, lang.hitch(this, function(item){
        return func(item);
      }));
      return filteredItems;
    },

    getTreeNodeByItemId: function(itemId){
      var doms = this._getAllTreeNodeDoms();
      for(var i = 0; i < doms.length; i++){
        var d = doms[i];
        var tn = registry.byNode(d);
        if(tn.item.id.toString() === itemId.toString()){
          return tn;
        }
      }
      return null;
    },

    selectItem: function(itemId){
      var tn = this.getTreeNodeByItemId(itemId);
      if(tn && tn.isLeaf){
        //tn.select();
        this.selectNodeWidget(tn);
      }
    },

    unselectItem: function(itemId){
      var tn = this.getTreeNodeByItemId(itemId);
      if(tn && tn.isLeaf){
        tn.unselect();
      }
    },

    getAllLeafTreeNodeWidgets: function(){
      var tns = this.getAllTreeNodeWidgets();
      return array.filter(tns, lang.hitch(this, function(tn){
        return tn.isLeaf;
      }));
    },

    getAllTreeNodeWidgets: function(){
      var doms = this._getAllTreeNodeDoms();
      return array.map(doms, lang.hitch(this, function(node){
        return registry.byNode(node);
      }));
    },

    //to be override
    isLeafItem: function(item){
      return item && item.isLeaf;
    },

    _getAllTreeNodeDoms: function(){
      return query('.dijitTreeNode', this.domNode);
    },

    _createTreeNode: function(args){
      args.isLeaf = this.isLeafItem(args.item);
      if(!this.multiple){
        args.groupId = this.uniqueId;
      }
      var tn = new JimuTreeNode(args);
      // this.own(on(tn, 'tn-select', lang.hitch(this, this._onTreeNodeSelect)));
      // this.own(on(tn, 'tn-unselect', lang.hitch(this, this._onTreeNodeUnselect)));
      return tn;
    },

    _onTreeNodeSelect: function(/*TreeNode*/ nodeWidget){
      var item = nodeWidget.item;
      var args = {
        item: item,
        treeNode: nodeWidget
      };
      this.emit('item-select', args);
    },

    _onTreeNodeUnselect: function(/*TreeNode*/ nodeWidget){
      var item = nodeWidget.item;
      var args = {
        item: item,
        treeNode: nodeWidget
      };
      this.emit('item-unselect', args);
    },

    selectNodeWidget: function(nodeWidget){
      if(!this.multiple){
        this.unselectAllLeafNodeWidgets();
      }
      nodeWidget.select();
    },

    _jimuBeforeClick: function(item, node, evt){
      /*jshint unused: false*/
      //only handle leaf node
      if(node.isLeaf){
        var target = evt.target || evt.srcElement;
        //if click <input> in node, we don't handle it
        //only handle it when click the row
        if(!html.hasClass(target, 'jimu-tree-check-node')){
          if(this.multiple){
            node.toggleSelect();
          }else{
            //node.select();
            this.selectNodeWidget(node);
          }
        }
      }
      return arguments;
    },

    _onCheckNodeClick: function(/*TreeNode*/ nodeWidget,/*Boolean*/ newState, /*Event*/ evt){
      if(!this.multiple && newState){
        this.unselectAllLeafNodeWidgets();
      }
      dojoEvent.stop(evt);
      this.focusNode(nodeWidget);
      setTimeout(lang.hitch(this, function(){
        if(newState){
          //nodeWidget.select();
          this.selectNodeWidget(nodeWidget);
        }else{
          nodeWidget.unselect();
        }
        //nodeWidget.checkNode.checked = newState;
        this.onClick(nodeWidget.item, nodeWidget, evt);
      }), 0);
    },

    unselectAllLeafNodeWidgets: function(){
      // var allCbxes = query('.jimu-tree-check-node', this.domNode);
      // array.forEach(allCbxes, lang.hitch(this, function(checkNode){
      //   checkNode.checked = false;
      // }));
      var nodes = this.getAllLeafTreeNodeWidgets();
      array.forEach(nodes, lang.hitch(this, function(nodeWidget){
        nodeWidget.unselect();
      }));
    }

  });

  return JimuTree;
});
},
'dijit/Tree':function(){
define([
	"dojo/_base/array", // array.filter array.forEach array.map
	"dojo/aspect",
	"dojo/cookie", // cookie
	"dojo/_base/declare", // declare
	"dojo/Deferred", // Deferred
	"dojo/promise/all",
	"dojo/dom", // dom.isDescendant
	"dojo/dom-class", // domClass.add domClass.remove domClass.replace domClass.toggle
	"dojo/dom-geometry", // domGeometry.setMarginBox domGeometry.position
	"dojo/dom-style", // domStyle.set
	"dojo/errors/create", // createError
	"dojo/fx", // fxUtils.wipeIn fxUtils.wipeOut
	"dojo/has",
	"dojo/_base/kernel", // kernel.deprecated
	"dojo/keys", // arrows etc.
	"dojo/_base/lang", // lang.getObject lang.mixin lang.hitch
	"dojo/on", // on(), on.selector()
	"dojo/topic",
	"dojo/touch",
	"dojo/when",
	"./a11yclick",
	"./focus",
	"./registry", // registry.byNode(), registry.getEnclosingWidget()
	"./_base/manager", // manager.defaultDuration
	"./_Widget",
	"./_TemplatedMixin",
	"./_Container",
	"./_Contained",
	"./_CssStateMixin",
	"./_KeyNavMixin",
	"dojo/text!./templates/TreeNode.html",
	"dojo/text!./templates/Tree.html",
	"./tree/TreeStoreModel",
	"./tree/ForestStoreModel",
	"./tree/_dndSelector",
	"dojo/query!css2"	// needed when on.selector() used with a string for the selector
], function(array, aspect, cookie, declare, Deferred, all,
			dom, domClass, domGeometry, domStyle, createError, fxUtils, has, kernel, keys, lang, on, topic, touch, when,
			a11yclick, focus, registry, manager, _Widget, _TemplatedMixin, _Container, _Contained, _CssStateMixin, _KeyNavMixin,
			treeNodeTemplate, treeTemplate, TreeStoreModel, ForestStoreModel, _dndSelector){

	// module:
	//		dijit/Tree

	function shimmedPromise(/*Deferred|Promise*/ d){
		// summary:
		//		Return a Promise based on given Deferred or Promise, with back-compat addCallback() and addErrback() shims
		//		added (TODO: remove those back-compat shims, and this method, for 2.0)

		return lang.delegate(d.promise || d, {
			addCallback: function(callback){
				this.then(callback);
			},
			addErrback: function(errback){
				this.otherwise(errback);
			}
		});
	}

	var TreeNode = declare("dijit._TreeNode", [_Widget, _TemplatedMixin, _Container, _Contained, _CssStateMixin], {
		// summary:
		//		Single node within a tree.   This class is used internally
		//		by Tree and should not be accessed directly.
		// tags:
		//		private

		// item: [const] Item
		//		the dojo.data entry this tree represents
		item: null,

		// isTreeNode: [protected] Boolean
		//		Indicates that this is a TreeNode.   Used by `dijit.Tree` only,
		//		should not be accessed directly.
		isTreeNode: true,

		// label: String
		//		Text of this tree node
		label: "",
		_setLabelAttr: function(val){
			this.labelNode[this.labelType == "html" ? "innerHTML" : "innerText" in this.labelNode ?
				"innerText" : "textContent"] = val;
			this._set("label", val);
			if(has("dojo-bidi")){
				this.applyTextDir(this.labelNode);
			}
		},

		// labelType: [const] String
		//		Specifies how to interpret the label.  Can be "html" or "text".
		labelType: "text",

		// isExpandable: [private] Boolean
		//		This node has children, so show the expando node (+ sign)
		isExpandable: null,

		// isExpanded: [readonly] Boolean
		//		This node is currently expanded (ie, opened)
		isExpanded: false,

		// state: [private] String
		//		Dynamic loading-related stuff.
		//		When an empty folder node appears, it is "NotLoaded" first,
		//		then after dojo.data query it becomes "Loading" and, finally "Loaded"
		state: "NotLoaded",

		templateString: treeNodeTemplate,

		baseClass: "dijitTreeNode",

		// For hover effect for tree node, and focus effect for label
		cssStateNodes: {
			rowNode: "dijitTreeRow"
		},

		// Tooltip is defined in _WidgetBase but we need to handle the mapping to DOM here
		_setTooltipAttr: {node: "rowNode", type: "attribute", attribute: "title"},

		buildRendering: function(){
			this.inherited(arguments);

			// set expand icon for leaf
			this._setExpando();

			// set icon and label class based on item
			this._updateItemClasses(this.item);

			if(this.isExpandable){
				this.labelNode.setAttribute("aria-expanded", this.isExpanded);
			}

			//aria-selected should be false on all selectable elements.
			this.setSelected(false);
		},

		_setIndentAttr: function(indent){
			// summary:
			//		Tell this node how many levels it should be indented
			// description:
			//		0 for top level nodes, 1 for their children, 2 for their
			//		grandchildren, etc.

			// Math.max() is to prevent negative padding on hidden root node (when indent == -1)
			var pixels = (Math.max(indent, 0) * this.tree._nodePixelIndent) + "px";

			domStyle.set(this.domNode, "backgroundPosition", pixels + " 0px");	// TODOC: what is this for???
			domStyle.set(this.rowNode, this.isLeftToRight() ? "paddingLeft" : "paddingRight", pixels);

			array.forEach(this.getChildren(), function(child){
				child.set("indent", indent + 1);
			});

			this._set("indent", indent);
		},

		markProcessing: function(){
			// summary:
			//		Visually denote that tree is loading data, etc.
			// tags:
			//		private
			this.state = "Loading";
			this._setExpando(true);
		},

		unmarkProcessing: function(){
			// summary:
			//		Clear markup from markProcessing() call
			// tags:
			//		private
			this._setExpando(false);
		},

		_updateItemClasses: function(item){
			// summary:
			//		Set appropriate CSS classes for icon and label dom node
			//		(used to allow for item updates to change respective CSS)
			// tags:
			//		private
			var tree = this.tree, model = tree.model;
			if(tree._v10Compat && item === model.root){
				// For back-compat with 1.0, need to use null to specify root item (TODO: remove in 2.0)
				item = null;
			}
			this._applyClassAndStyle(item, "icon", "Icon");
			this._applyClassAndStyle(item, "label", "Label");
			this._applyClassAndStyle(item, "row", "Row");

			this.tree._startPaint(true);		// signifies paint started and finished (synchronously)
		},

		_applyClassAndStyle: function(item, lower, upper){
			// summary:
			//		Set the appropriate CSS classes and styles for labels, icons and rows.
			//
			// item:
			//		The data item.
			//
			// lower:
			//		The lower case attribute to use, e.g. 'icon', 'label' or 'row'.
			//
			// upper:
			//		The upper case attribute to use, e.g. 'Icon', 'Label' or 'Row'.
			//
			// tags:
			//		private

			var clsName = "_" + lower + "Class";
			var nodeName = lower + "Node";
			var oldCls = this[clsName];

			this[clsName] = this.tree["get" + upper + "Class"](item, this.isExpanded);
			domClass.replace(this[nodeName], this[clsName] || "", oldCls || "");

			domStyle.set(this[nodeName], this.tree["get" + upper + "Style"](item, this.isExpanded) || {});
		},

		_updateLayout: function(){
			// summary:
			//		Set appropriate CSS classes for this.domNode
			// tags:
			//		private

			// if we are hiding the root node then make every first level child look like a root node
			var parent = this.getParent(),
				markAsRoot = !parent || !parent.rowNode || parent.rowNode.style.display == "none";
			domClass.toggle(this.domNode, "dijitTreeIsRoot", markAsRoot);

			domClass.toggle(this.domNode, "dijitTreeIsLast", !markAsRoot && !this.getNextSibling());
		},

		_setExpando: function(/*Boolean*/ processing){
			// summary:
			//		Set the right image for the expando node
			// tags:
			//		private

			var styles = ["dijitTreeExpandoLoading", "dijitTreeExpandoOpened",
					"dijitTreeExpandoClosed", "dijitTreeExpandoLeaf"],
				_a11yStates = ["*", "-", "+", "*"],
				idx = processing ? 0 : (this.isExpandable ? (this.isExpanded ? 1 : 2) : 3);

			// apply the appropriate class to the expando node
			domClass.replace(this.expandoNode, styles[idx], styles);

			// provide a non-image based indicator for images-off mode
			this.expandoNodeText.innerHTML = _a11yStates[idx];

		},

		expand: function(){
			// summary:
			//		Show my children
			// returns:
			//		Promise that resolves when expansion is complete

			// If there's already an expand in progress or we are already expanded, just return
			if(this._expandDeferred){
				return shimmedPromise(this._expandDeferred);		// dojo/promise/Promise
			}

			// cancel in progress collapse operation
			if(this._collapseDeferred){
				this._collapseDeferred.cancel();
				delete this._collapseDeferred;
			}

			// All the state information for when a node is expanded, maybe this should be
			// set when the animation completes instead
			this.isExpanded = true;
			this.labelNode.setAttribute("aria-expanded", "true");
			if(this.tree.showRoot || this !== this.tree.rootNode){
				this.containerNode.setAttribute("role", "group");
			}
			domClass.add(this.contentNode, 'dijitTreeContentExpanded');
			this._setExpando();
			this._updateItemClasses(this.item);

			if(this == this.tree.rootNode && this.tree.showRoot){
				this.tree.domNode.setAttribute("aria-expanded", "true");
			}

			var wipeIn = fxUtils.wipeIn({
				node: this.containerNode,
				duration: manager.defaultDuration
			});

			// Deferred that fires when expand is complete
			var def = (this._expandDeferred = new Deferred(function(){
				// Canceller
				wipeIn.stop();
			}));

			aspect.after(wipeIn, "onEnd", function(){
				def.resolve(true);
			}, true);

			wipeIn.play();

			return shimmedPromise(def);		// dojo/promise/Promise
		},

		collapse: function(){
			// summary:
			//		Collapse this node (if it's expanded)
			// returns:
			//		Promise that resolves when collapse is complete

			if(this._collapseDeferred){
				// Node is already collapsed, or there's a collapse in progress, just return that Deferred
				return shimmedPromise(this._collapseDeferred);
			}

			// cancel in progress expand operation
			if(this._expandDeferred){
				this._expandDeferred.cancel();
				delete this._expandDeferred;
			}

			this.isExpanded = false;
			this.labelNode.setAttribute("aria-expanded", "false");
			if(this == this.tree.rootNode && this.tree.showRoot){
				this.tree.domNode.setAttribute("aria-expanded", "false");
			}
			domClass.remove(this.contentNode, 'dijitTreeContentExpanded');
			this._setExpando();
			this._updateItemClasses(this.item);

			var wipeOut = fxUtils.wipeOut({
				node: this.containerNode,
				duration: manager.defaultDuration
			});

			// Deferred that fires when expand is complete
			var def = (this._collapseDeferred = new Deferred(function(){
				// Canceller
				wipeOut.stop();
			}));

			aspect.after(wipeOut, "onEnd", function(){
				def.resolve(true);
			}, true);

			wipeOut.play();

			return shimmedPromise(def);		// dojo/promise/Promise
		},

		// indent: Integer
		//		Levels from this node to the root node
		indent: 0,

		setChildItems: function(/* Object[] */ items){
			// summary:
			//		Sets the child items of this node, removing/adding nodes
			//		from current children to match specified items[] array.
			//		Also, if this.persist == true, expands any children that were previously
			//		opened.
			// returns:
			//		Promise that resolves after all previously opened children
			//		have been expanded again (or fires instantly if there are no such children).

			var tree = this.tree,
				model = tree.model,
				defs = [];	// list of deferreds that need to fire before I am complete


			var focusedChild = tree.focusedChild;

			// Orphan all my existing children.
			// If items contains some of the same items as before then we will reattach them.
			// Don't call this.removeChild() because that will collapse the tree etc.
			var oldChildren = this.getChildren();
			array.forEach(oldChildren, function(child){
				_Container.prototype.removeChild.call(this, child);
			}, this);

			// All the old children of this TreeNode are subject for destruction if
			//		1) they aren't listed in the new children array (items)
			//		2) they aren't immediately adopted by another node (DnD)
			this.defer(function(){
				array.forEach(oldChildren, function(node){
					if(!node._destroyed && !node.getParent()){
						// If node is in selection then remove it.
						tree.dndController.removeTreeNode(node);

						// Deregister mapping from item id --> this node and its descendants
						function remove(node){
							var id = model.getIdentity(node.item),
								ary = tree._itemNodesMap[id];
							if(ary.length == 1){
								delete tree._itemNodesMap[id];
							}else{
								var index = array.indexOf(ary, node);
								if(index != -1){
									ary.splice(index, 1);
								}
							}
							array.forEach(node.getChildren(), remove);
						}

						remove(node);

						// Remove any entries involving this node from cookie tracking expanded nodes
						if(tree.persist){
							var destroyedPath = array.map(node.getTreePath(),function(item){
								return tree.model.getIdentity(item);
							}).join("/");
							for(var path in tree._openedNodes){
								if(path.substr(0, destroyedPath.length) == destroyedPath){
									delete tree._openedNodes[path];
								}
							}
							tree._saveExpandedNodes();
						}

						// If we've orphaned the focused node then move focus to the root node
						if(tree.lastFocusedChild && !dom.isDescendant(tree.lastFocusedChild.domNode, tree.domNode)){
							delete tree.lastFocusedChild;
						}
						if(focusedChild && !dom.isDescendant(focusedChild.domNode, tree.domNode)){
							tree.focus();	// could alternately focus this node (parent of the deleted node)
						}

						// And finally we can destroy the node
						node.destroyRecursive();
					}
				});

			});

			this.state = "Loaded";

			if(items && items.length > 0){
				this.isExpandable = true;

				// Create _TreeNode widget for each specified tree node, unless one already
				// exists and isn't being used (presumably it's from a DnD move and was recently
				// released
				array.forEach(items, function(item){    // MARKER: REUSE NODE
					var id = model.getIdentity(item),
						existingNodes = tree._itemNodesMap[id],
						node;
					if(existingNodes){
						for(var i = 0; i < existingNodes.length; i++){
							if(existingNodes[i] && !existingNodes[i].getParent()){
								node = existingNodes[i];
								node.set('indent', this.indent + 1);
								break;
							}
						}
					}
					if(!node){
						node = this.tree._createTreeNode({
							item: item,
							tree: tree,
							isExpandable: model.mayHaveChildren(item),
							label: tree.getLabel(item),
							labelType: (tree.model && tree.model.labelType) || "text",
							tooltip: tree.getTooltip(item),
							ownerDocument: tree.ownerDocument,
							dir: tree.dir,
							lang: tree.lang,
							textDir: tree.textDir,
							indent: this.indent + 1
						});
						if(existingNodes){
							existingNodes.push(node);
						}else{
							tree._itemNodesMap[id] = [node];
						}
					}
					this.addChild(node);

					// If node was previously opened then open it again now (this may trigger
					// more data store accesses, recursively)
					if(this.tree.autoExpand || this.tree._state(node)){
						defs.push(tree._expandNode(node));
					}
				}, this);

				// note that updateLayout() needs to be called on each child after
				// _all_ the children exist
				array.forEach(this.getChildren(), function(child){
					child._updateLayout();
				});
			}else{
				this.isExpandable = false;
			}

			if(this._setExpando){
				// change expando to/from dot or + icon, as appropriate
				this._setExpando(false);
			}

			// Set leaf icon or folder icon, as appropriate
			this._updateItemClasses(this.item);

			var def = all(defs);
			this.tree._startPaint(def);		// to reset TreeNode widths after an item is added/removed from the Tree
			return shimmedPromise(def);		// dojo/promise/Promise
		},

		getTreePath: function(){
			var node = this;
			var path = [];
			while(node && node !== this.tree.rootNode){
				path.unshift(node.item);
				node = node.getParent();
			}
			path.unshift(this.tree.rootNode.item);

			return path;
		},

		getIdentity: function(){
			return this.tree.model.getIdentity(this.item);
		},

		removeChild: function(/* treeNode */ node){
			this.inherited(arguments);

			var children = this.getChildren();
			if(children.length == 0){
				this.isExpandable = false;
				this.collapse();
			}

			array.forEach(children, function(child){
				child._updateLayout();
			});
		},

		makeExpandable: function(){
			// summary:
			//		if this node wasn't already showing the expando node,
			//		turn it into one and call _setExpando()

			// TODO: hmm this isn't called from anywhere, maybe should remove it for 2.0

			this.isExpandable = true;
			this._setExpando(false);
		},

		setSelected: function(/*Boolean*/ selected){
			// summary:
			//		A Tree has a (single) currently selected node.
			//		Mark that this node is/isn't that currently selected node.
			// description:
			//		In particular, setting a node as selected involves setting tabIndex
			//		so that when user tabs to the tree, focus will go to that node (only).
			this.labelNode.setAttribute("aria-selected", selected ? "true" : "false");
			domClass.toggle(this.rowNode, "dijitTreeRowSelected", selected);
		},

		focus: function(){
			focus.focus(this.focusNode);
		}
	});

	if(has("dojo-bidi")){
		TreeNode.extend({
			_setTextDirAttr: function(textDir){
				if(textDir && ((this.textDir != textDir) || !this._created)){
					this._set("textDir", textDir);
					this.applyTextDir(this.labelNode);
					array.forEach(this.getChildren(), function(childNode){
						childNode.set("textDir", textDir);
					}, this);
				}
			}
		});
	}

	var Tree = declare("dijit.Tree", [_Widget, _KeyNavMixin, _TemplatedMixin, _CssStateMixin], {
		// summary:
		//		This widget displays hierarchical data from a store.

		baseClass: "dijitTree",

		// store: [deprecated] String|dojo/data/Store
		//		Deprecated.  Use "model" parameter instead.
		//		The store to get data to display in the tree.
		store: null,

		// model: [const] dijit/tree/model
		//		Interface to read tree data, get notifications of changes to tree data,
		//		and for handling drop operations (i.e drag and drop onto the tree)
		model: null,

		// query: [deprecated] anything
		//		Deprecated.  User should specify query to the model directly instead.
		//		Specifies datastore query to return the root item or top items for the tree.
		query: null,

		// label: [deprecated] String
		//		Deprecated.  Use dijit/tree/ForestStoreModel directly instead.
		//		Used in conjunction with query parameter.
		//		If a query is specified (rather than a root node id), and a label is also specified,
		//		then a fake root node is created and displayed, with this label.
		label: "",

		// showRoot: [const] Boolean
		//		Should the root node be displayed, or hidden?
		showRoot: true,

		// childrenAttr: [deprecated] String[]
		//		Deprecated.   This information should be specified in the model.
		//		One ore more attributes that holds children of a tree node
		childrenAttr: ["children"],

		// paths: String[][] or Item[][]
		//		Full paths from rootNode to selected nodes expressed as array of items or array of ids.
		//		Since setting the paths may be asynchronous (because of waiting on dojo.data), set("paths", ...)
		//		returns a Promise to indicate when the set is complete.
		paths: [],

		// path: String[] or Item[]
		//		Backward compatible singular variant of paths.
		path: [],

		// selectedItems: [readonly] Item[]
		//		The currently selected items in this tree.
		//		This property can only be set (via set('selectedItems', ...)) when that item is already
		//		visible in the tree.   (I.e. the tree has already been expanded to show that node.)
		//		Should generally use `paths` attribute to set the selected items instead.
		selectedItems: null,

		// selectedItem: [readonly] Item
		//		Backward compatible singular variant of selectedItems.
		selectedItem: null,

		// openOnClick: Boolean
		//		If true, clicking a folder node's label will open it, rather than calling onClick()
		openOnClick: false,

		// openOnDblClick: Boolean
		//		If true, double-clicking a folder node's label will open it, rather than calling onDblClick()
		openOnDblClick: false,

		templateString: treeTemplate,

		// persist: Boolean
		//		Enables/disables use of cookies for state saving.
		persist: false,

		// autoExpand: Boolean
		//		Fully expand the tree on load.   Overrides `persist`.
		autoExpand: false,

		// dndController: [protected] Function|String
		//		Class to use as as the dnd controller.  Specifying this class enables DnD.
		//		Generally you should specify this as dijit/tree/dndSource.
		//		Setting of dijit/tree/_dndSelector handles selection only (no actual DnD).
		dndController: _dndSelector,

		// parameters to pull off of the tree and pass on to the dndController as its params
		dndParams: ["onDndDrop", "itemCreator", "onDndCancel", "checkAcceptance", "checkItemAcceptance", "dragThreshold", "betweenThreshold"],

		//declare the above items so they can be pulled from the tree's markup

		// onDndDrop: [protected] Function
		//		Parameter to dndController, see `dijit/tree/dndSource.onDndDrop()`.
		//		Generally this doesn't need to be set.
		onDndDrop: null,

		itemCreator: null,
		/*=====
		itemCreator: function(nodes, target, source){
			// summary:
			//		Returns objects passed to `Tree.model.newItem()` based on DnD nodes
			//		dropped onto the tree.   Developer must override this method to enable
			//		dropping from external sources onto this Tree, unless the Tree.model's items
			//		happen to look like {id: 123, name: "Apple" } with no other attributes.
			//
			//		For each node in nodes[], which came from source, create a hash of name/value
			//		pairs to be passed to Tree.model.newItem().  Returns array of those hashes.
			// nodes: DomNode[]
			//		The DOMNodes dragged from the source container
			// target: DomNode
			//		The target TreeNode.rowNode
			// source: dojo/dnd/Source
			//		The source container the nodes were dragged from, perhaps another Tree or a plain dojo/dnd/Source
			// returns: Object[]
			//		Array of name/value hashes for each new item to be added to the Tree, like:
			// |	[
			// |		{ id: 123, label: "apple", foo: "bar" },
			// |		{ id: 456, label: "pear", zaz: "bam" }
			// |	]
			// tags:
			//		extension
			return [{}];
		},
		=====*/

		// onDndCancel: [protected] Function
		//		Parameter to dndController, see `dijit/tree/dndSource.onDndCancel()`.
		//		Generally this doesn't need to be set.
		onDndCancel: null,

		/*=====
		checkAcceptance: function(source, nodes){
			// summary:
			//		Checks if the Tree itself can accept nodes from this source
			// source: dijit/tree/dndSource
			//		The source which provides items
			// nodes: DOMNode[]
			//		Array of DOM nodes corresponding to nodes being dropped, dijitTreeRow nodes if
			//		source is a dijit/Tree.
			// tags:
			//		extension
			return true;	// Boolean
		},
		=====*/
		checkAcceptance: null,

		/*=====
		checkItemAcceptance: function(target, source, position){
			// summary:
			//		Stub function to be overridden if one wants to check for the ability to drop at the node/item level
			// description:
			//		In the base case, this is called to check if target can become a child of source.
			//		When betweenThreshold is set, position="before" or "after" means that we
			//		are asking if the source node can be dropped before/after the target node.
			// target: DOMNode
			//		The dijitTreeRoot DOM node inside of the TreeNode that we are dropping on to
			//		Use registry.getEnclosingWidget(target) to get the TreeNode.
			// source: dijit/tree/dndSource
			//		The (set of) nodes we are dropping
			// position: String
			//		"over", "before", or "after"
			// tags:
			//		extension
			return true;	// Boolean
		},
		=====*/
		checkItemAcceptance: null,

		// dragThreshold: Integer
		//		Number of pixels mouse moves before it's considered the start of a drag operation
		dragThreshold: 5,

		// betweenThreshold: Integer
		//		Set to a positive value to allow drag and drop "between" nodes.
		//
		//		If during DnD mouse is over a (target) node but less than betweenThreshold
		//		pixels from the bottom edge, dropping the the dragged node will make it
		//		the next sibling of the target node, rather than the child.
		//
		//		Similarly, if mouse is over a target node but less that betweenThreshold
		//		pixels from the top edge, dropping the dragged node will make it
		//		the target node's previous sibling rather than the target node's child.
		betweenThreshold: 0,

		// _nodePixelIndent: Integer
		//		Number of pixels to indent tree nodes (relative to parent node).
		//		Default is 19 but can be overridden by setting CSS class dijitTreeIndent
		//		and calling resize() or startup() on tree after it's in the DOM.
		_nodePixelIndent: 19,

		_publish: function(/*String*/ topicName, /*Object*/ message){
			// summary:
			//		Publish a message for this widget/topic
			topic.publish(this.id, lang.mixin({tree: this, event: topicName}, message || {}));	// publish
		},

		postMixInProperties: function(){
			this.tree = this;

			if(this.autoExpand){
				// There's little point in saving opened/closed state of nodes for a Tree
				// that initially opens all it's nodes.
				this.persist = false;
			}

			this._itemNodesMap = {};

			if(!this.cookieName && this.id){
				this.cookieName = this.id + "SaveStateCookie";
			}

			// Deferred that resolves when all the children have loaded.
			this.expandChildrenDeferred = new Deferred();

			// Promise that resolves when all pending operations complete.
			this.pendingCommandsPromise = this.expandChildrenDeferred.promise;

			this.inherited(arguments);
		},

		postCreate: function(){
			this._initState();

			// Catch events on TreeNodes
			var self = this;
			this.own(
				on(this.containerNode, on.selector(".dijitTreeNode", touch.enter), function(evt){
					self._onNodeMouseEnter(registry.byNode(this), evt);
				}),
				on(this.containerNode, on.selector(".dijitTreeNode", touch.leave), function(evt){
					self._onNodeMouseLeave(registry.byNode(this), evt);
				}),
				on(this.containerNode, on.selector(".dijitTreeRow", a11yclick.press), function(evt){
					self._onNodePress(registry.getEnclosingWidget(this), evt);
				}),
				on(this.containerNode, on.selector(".dijitTreeRow", a11yclick), function(evt){
					self._onClick(registry.getEnclosingWidget(this), evt);
				}),
				on(this.containerNode, on.selector(".dijitTreeRow", "dblclick"), function(evt){
					self._onDblClick(registry.getEnclosingWidget(this), evt);
				})
			);

			// Create glue between store and Tree, if not specified directly by user
			if(!this.model){
				this._store2model();
			}

			// monitor changes to items
			this.own(
				aspect.after(this.model, "onChange", lang.hitch(this, "_onItemChange"), true),
				aspect.after(this.model, "onChildrenChange", lang.hitch(this, "_onItemChildrenChange"), true),
				aspect.after(this.model, "onDelete", lang.hitch(this, "_onItemDelete"), true)
			);

			this.inherited(arguments);

			if(this.dndController){
				// TODO: remove string support in 2.0.
				if(lang.isString(this.dndController)){
					this.dndController = lang.getObject(this.dndController);
				}
				var params = {};
				for(var i = 0; i < this.dndParams.length; i++){
					if(this[this.dndParams[i]]){
						params[this.dndParams[i]] = this[this.dndParams[i]];
					}
				}
				this.dndController = new this.dndController(this, params);
			}

			this._load();

			// onLoadDeferred should fire when all commands that are part of initialization have completed.
			// It will include all the set("paths", ...) commands that happen during initialization.
			this.onLoadDeferred = shimmedPromise(this.pendingCommandsPromise);

			this.onLoadDeferred.then(lang.hitch(this, "onLoad"));
		},

		_store2model: function(){
			// summary:
			//		User specified a store&query rather than model, so create model from store/query
			this._v10Compat = true;
			kernel.deprecated("Tree: from version 2.0, should specify a model object rather than a store/query");

			var modelParams = {
				id: this.id + "_ForestStoreModel",
				store: this.store,
				query: this.query,
				childrenAttrs: this.childrenAttr
			};

			// Only override the model's mayHaveChildren() method if the user has specified an override
			if(this.params.mayHaveChildren){
				modelParams.mayHaveChildren = lang.hitch(this, "mayHaveChildren");
			}

			if(this.params.getItemChildren){
				modelParams.getChildren = lang.hitch(this, function(item, onComplete, onError){
					this.getItemChildren((this._v10Compat && item === this.model.root) ? null : item, onComplete, onError);
				});
			}
			this.model = new ForestStoreModel(modelParams);

			// For backwards compatibility, the visibility of the root node is controlled by
			// whether or not the user has specified a label
			this.showRoot = Boolean(this.label);
		},

		onLoad: function(){
			// summary:
			//		Called when tree finishes loading and expanding.
			// description:
			//		If persist == true the loading may encompass many levels of fetches
			//		from the data store, each asynchronous.   Waits for all to finish.
			// tags:
			//		callback
		},

		_load: function(){
			// summary:
			//		Initial load of the tree.
			//		Load root node (possibly hidden) and it's children.
			this.model.getRoot(
				lang.hitch(this, function(item){
					var rn = (this.rootNode = this.tree._createTreeNode({
						item: item,
						tree: this,
						isExpandable: true,
						label: this.label || this.getLabel(item),
						labelType: this.model.labelType || "text",
						textDir: this.textDir,
						indent: this.showRoot ? 0 : -1
					}));

					if(!this.showRoot){
						rn.rowNode.style.display = "none";
						// if root is not visible, move tree role to the invisible
						// root node's containerNode, see #12135
						this.domNode.setAttribute("role", "presentation");
						this.domNode.removeAttribute("aria-expanded");
						this.domNode.removeAttribute("aria-multiselectable");

						// move the aria-label or aria-labelledby to the element with the role
						if(this["aria-label"]){
							rn.containerNode.setAttribute("aria-label", this["aria-label"]);
							this.domNode.removeAttribute("aria-label");
						}else if(this["aria-labelledby"]){
							rn.containerNode.setAttribute("aria-labelledby", this["aria-labelledby"]);
							this.domNode.removeAttribute("aria-labelledby");
						}
						rn.labelNode.setAttribute("role", "presentation");
						rn.labelNode.removeAttribute("aria-selected");
						rn.containerNode.setAttribute("role", "tree");
						rn.containerNode.setAttribute("aria-expanded", "true");
						rn.containerNode.setAttribute("aria-multiselectable", !this.dndController.singular);
					}else{
						this.domNode.setAttribute("aria-multiselectable", !this.dndController.singular);
						this.rootLoadingIndicator.style.display = "none";
					}

					this.containerNode.appendChild(rn.domNode);
					var identity = this.model.getIdentity(item);
					if(this._itemNodesMap[identity]){
						this._itemNodesMap[identity].push(rn);
					}else{
						this._itemNodesMap[identity] = [rn];
					}

					rn._updateLayout();		// sets "dijitTreeIsRoot" CSS classname

					// Load top level children, and if persist==true, all nodes that were previously opened
					this._expandNode(rn).then(lang.hitch(this, function(){
						// Then, select the nodes specified by params.paths[], assuming Tree hasn't been deleted.
						if(!this._destroyed){
							this.rootLoadingIndicator.style.display = "none";
							this.expandChildrenDeferred.resolve(true);
						}
					}));
				}),
				lang.hitch(this, function(err){
					console.error(this, ": error loading root: ", err);
				})
			);
		},

		getNodesByItem: function(/*Item or id*/ item){
			// summary:
			//		Returns all tree nodes that refer to an item
			// returns:
			//		Array of tree nodes that refer to passed item

			if(!item){
				return [];
			}
			var identity = lang.isString(item) ? item : this.model.getIdentity(item);
			// return a copy so widget don't get messed up by changes to returned array
			return [].concat(this._itemNodesMap[identity]);
		},

		_setSelectedItemAttr: function(/*Item or id*/ item){
			this.set('selectedItems', [item]);
		},

		_setSelectedItemsAttr: function(/*Items or ids*/ items){
			// summary:
			//		Select tree nodes related to passed items.
			//		WARNING: if model use multi-parented items or desired tree node isn't already loaded
			//		behavior is undefined. Use set('paths', ...) instead.
			var tree = this;
			return this.pendingCommandsPromise = this.pendingCommandsPromise.always(lang.hitch(this, function(){
				var identities = array.map(items, function(item){
					return (!item || lang.isString(item)) ? item : tree.model.getIdentity(item);
				});
				var nodes = [];
				array.forEach(identities, function(id){
					nodes = nodes.concat(tree._itemNodesMap[id] || []);
				});
				this.set('selectedNodes', nodes);
			}));
		},

		_setPathAttr: function(/*Item[]|String[]*/ path){
			// summary:
			//		Singular variant of _setPathsAttr
			if(path.length){
				return shimmedPromise(this.set("paths", [path]).then(function(paths){ return paths[0]; }));
			}else{
				// Empty list is interpreted as "select nothing"
				return shimmedPromise(this.set("paths", []).then(function(paths){ return paths[0]; }));
			}
		},

		_setPathsAttr: function(/*Item[][]|String[][]*/ paths){
			// summary:
			//		Select the tree nodes identified by passed paths.
			// paths:
			//		Array of arrays of items or item id's
			// returns:
			//		Promise to indicate when the set is complete

			var tree = this;

			function selectPath(path, nodes){
				// Traverse path, returning Promise for node at the end of the path.
				// The next path component should be among "nodes".
				var nextPath = path.shift();
				var nextNode = array.filter(nodes, function(node){
					return node.getIdentity() == nextPath;
				})[0];
				if(!!nextNode){
					if(path.length){
						return tree._expandNode(nextNode).then(function(){
							return selectPath(path, nextNode.getChildren());
						});
					}else{
						// Successfully reached the end of this path
						return nextNode;
					}
				}else{
					throw new Tree.PathError("Could not expand path at " + nextPath);
				}
			}

			// Let any previous set("path", ...) commands complete before this one starts.
			// TODO for 2.0: make the user do this wait themselves?
			return shimmedPromise(this.pendingCommandsPromise = this.pendingCommandsPromise.always(function(){
				// We may need to wait for some nodes to expand, so setting
				// each path will involve a Deferred. We bring those deferreds
				// together with a dojo/promise/all.
				return all(array.map(paths, function(path){
					// normalize path to use identity
					path = array.map(path, function(item){
						return item && lang.isObject(item) ? tree.model.getIdentity(item) : item;
					});

					if(path.length){
						return selectPath(path, [tree.rootNode]);
					}else{
						throw new Tree.PathError("Empty path");
					}
				}));
			}).then(function setNodes(newNodes){
				// After all expansion is finished, set the selection to last element from each path
				tree.set("selectedNodes", newNodes);
				return tree.paths;
			}));
		},

		_setSelectedNodeAttr: function(node){
			this.set('selectedNodes', [node]);
		},
		_setSelectedNodesAttr: function(nodes){
			// summary:
			//		Marks the specified TreeNodes as selected.
			// nodes: TreeNode[]
			//		TreeNodes to mark.
			this.dndController.setSelection(nodes);
		},


		expandAll: function(){
			// summary:
			//		Expand all nodes in the tree
			// returns:
			//		Promise that resolves when all nodes have expanded

			var _this = this;

			function expand(node){
				// Expand the node
				return _this._expandNode(node).then(function(){
					// When node has expanded, call expand() recursively on each non-leaf child
					var childBranches = array.filter(node.getChildren() || [], function(node){
						return node.isExpandable;
					});

					// And when all those recursive calls finish, signal that I'm finished
					return all(array.map(childBranches, expand));
				});
			}

			return shimmedPromise(expand(this.rootNode));
		},

		collapseAll: function(){
			// summary:
			//		Collapse all nodes in the tree
			// returns:
			//		Promise that resolves when all nodes have collapsed

			var _this = this;

			function collapse(node){
				// Collapse children first
				var childBranches = array.filter(node.getChildren() || [], function(node){
						return node.isExpandable;
					}),
					defs = all(array.map(childBranches, collapse));

				// And when all those recursive calls finish, collapse myself, unless I'm the invisible root node,
				// in which case collapseAll() is finished
				if(!node.isExpanded || (node == _this.rootNode && !_this.showRoot)){
					return defs;
				}else{
					// When node has collapsed, signal that call is finished
					return defs.then(function(){
						return _this._collapseNode(node);
					});
				}
			}

			return shimmedPromise(collapse(this.rootNode));
		},

		////////////// Data store related functions //////////////////////
		// These just get passed to the model; they are here for back-compat

		mayHaveChildren: function(/*dojo/data/Item*/ /*===== item =====*/){
			// summary:
			//		Deprecated.   This should be specified on the model itself.
			//
			//		Overridable function to tell if an item has or may have children.
			//		Controls whether or not +/- expando icon is shown.
			//		(For efficiency reasons we may not want to check if an element actually
			//		has children until user clicks the expando node)
			// tags:
			//		deprecated
		},

		getItemChildren: function(/*===== parentItem, onComplete =====*/){
			// summary:
			//		Deprecated.   This should be specified on the model itself.
			//
			//		Overridable function that return array of child items of given parent item,
			//		or if parentItem==null then return top items in tree
			// tags:
			//		deprecated
		},

		///////////////////////////////////////////////////////
		// Functions for converting an item to a TreeNode
		getLabel: function(/*dojo/data/Item*/ item){
			// summary:
			//		Overridable function to get the label for a tree node (given the item)
			// tags:
			//		extension
			return this.model.getLabel(item);	// String
		},

		getIconClass: function(/*dojo/data/Item*/ item, /*Boolean*/ opened){
			// summary:
			//		Overridable function to return CSS class name to display icon
			// tags:
			//		extension
			return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
		},

		getLabelClass: function(/*===== item, opened =====*/){
			// summary:
			//		Overridable function to return CSS class name to display label
			// item: dojo/data/Item
			// opened: Boolean
			// returns: String
			//		CSS class name
			// tags:
			//		extension
		},

		getRowClass: function(/*===== item, opened =====*/){
			// summary:
			//		Overridable function to return CSS class name to display row
			// item: dojo/data/Item
			// opened: Boolean
			// returns: String
			//		CSS class name
			// tags:
			//		extension
		},

		getIconStyle: function(/*===== item, opened =====*/){
			// summary:
			//		Overridable function to return CSS styles to display icon
			// item: dojo/data/Item
			// opened: Boolean
			// returns: Object
			//		Object suitable for input to dojo.style() like {backgroundImage: "url(...)"}
			// tags:
			//		extension
		},

		getLabelStyle: function(/*===== item, opened =====*/){
			// summary:
			//		Overridable function to return CSS styles to display label
			// item: dojo/data/Item
			// opened: Boolean
			// returns:
			//		Object suitable for input to dojo.style() like {color: "red", background: "green"}
			// tags:
			//		extension
		},

		getRowStyle: function(/*===== item, opened =====*/){
			// summary:
			//		Overridable function to return CSS styles to display row
			// item: dojo/data/Item
			// opened: Boolean
			// returns:
			//		Object suitable for input to dojo.style() like {background-color: "#bbb"}
			// tags:
			//		extension
		},

		getTooltip: function(/*dojo/data/Item*/ /*===== item =====*/){
			// summary:
			//		Overridable function to get the tooltip for a tree node (given the item)
			// tags:
			//		extension
			return "";	// String
		},

		/////////// Keyboard and Mouse handlers ////////////////////


		_onDownArrow: function(/*Event*/ evt, /*TreeNode*/ node){
			// summary:
			//		down arrow pressed; get next visible node, set focus there

			var nextNode = this._getNext(node);
			if(nextNode && nextNode.isTreeNode){
				this.focusNode(nextNode);
			}
		},

		_onUpArrow: function(/*Event*/ evt, /*TreeNode*/ node){
			// summary:
			//		Up arrow pressed; move to previous visible node

			// if younger siblings
			var previousSibling = node.getPreviousSibling();
			if(previousSibling){
				node = previousSibling;
				// if the previous node is expanded, dive in deep
				while(node.isExpandable && node.isExpanded && node.hasChildren()){
					// move to the last child
					var children = node.getChildren();
					node = children[children.length - 1];
				}
			}else{
				// if this is the first child, return the parent
				// unless the parent is the root of a tree with a hidden root
				var parent = node.getParent();
				if(!(!this.showRoot && parent === this.rootNode)){
					node = parent;
				}
			}

			if(node && node.isTreeNode){
				this.focusNode(node);
			}
		},

		_onRightArrow: function(/*Event*/ evt, /*TreeNode*/ node){
			// summary:
			//		Right arrow pressed; go to child node

			// if not expanded, expand, else move to 1st child
			if(node.isExpandable && !node.isExpanded){
				this._expandNode(node);
			}else if(node.hasChildren()){
				node = node.getChildren()[0];
				if(node && node.isTreeNode){
					this.focusNode(node);
				}
			}
		},

		_onLeftArrow: function(/*Event*/ evt, /*TreeNode*/ node){
			// summary:
			//		Left arrow pressed.
			//		If not collapsed, collapse, else move to parent.

			if(node.isExpandable && node.isExpanded){
				this._collapseNode(node);
			}else{
				var parent = node.getParent();
				if(parent && parent.isTreeNode && !(!this.showRoot && parent === this.rootNode)){
					this.focusNode(parent);
				}
			}
		},

		focusLastChild: function(){
			// summary:
			//		End key pressed; go to last visible node.

			var node = this._getLast();
			if(node && node.isTreeNode){
				this.focusNode(node);
			}
		},

		_getFirst: function(){
			// summary:
			//		Returns the first child.
			// tags:
			//		abstract extension
			return this.showRoot ? this.rootNode : this.rootNode.getChildren()[0];
		},

		_getLast: function(){
			// summary:
			//		Returns the last descendant.
			// tags:
			//		abstract extension
			var node = this.rootNode;
			while(node.isExpanded){
				var c = node.getChildren();
				if(!c.length){
					break;
				}
				node = c[c.length - 1];
			}
			return node;
		},

		// Tree only searches forward so dir parameter is unused
		_getNext: function(node){
			// summary:
			//		Returns the next descendant, compared to "child".
			// node: Widget
			//		The current widget
			// tags:
			//		abstract extension

			if(node.isExpandable && node.isExpanded && node.hasChildren()){
				// if this is an expanded node, get the first child
				return node.getChildren()[0];		// TreeNode
			}else{
				// find a parent node with a sibling
				while(node && node.isTreeNode){
					var returnNode = node.getNextSibling();
					if(returnNode){
						return returnNode;		// TreeNode
					}
					node = node.getParent();
				}
				return null;
			}
		},

		// Implement _KeyNavContainer.childSelector, to identify which nodes are navigable
		childSelector: ".dijitTreeRow",

		isExpandoNode: function(node, widget){
			// summary:
			//		check whether a dom node is the expandoNode for a particular TreeNode widget
			return dom.isDescendant(node, widget.expandoNode) || dom.isDescendant(node, widget.expandoNodeText);
		},

		_onNodePress: function(/*TreeNode*/ nodeWidget, /*Event*/ e){
			// Touching a node should focus it, even if you touch the expando node or the edges rather than the label.
			// Especially important to avoid _KeyNavMixin._onContainerFocus() causing the previously focused TreeNode
			// to get focus
			this.focusNode(nodeWidget);
		},

		__click: function(/*TreeNode*/ nodeWidget, /*Event*/ e, /*Boolean*/doOpen, /*String*/func){
			var domElement = e.target,
				isExpandoClick = this.isExpandoNode(domElement, nodeWidget);

			if(nodeWidget.isExpandable && (doOpen || isExpandoClick)){
				// expando node was clicked, or label of a folder node was clicked; open it
				this._onExpandoClick({node: nodeWidget});
			}else{
				this._publish("execute", { item: nodeWidget.item, node: nodeWidget, evt: e });
				this[func](nodeWidget.item, nodeWidget, e);
				this.focusNode(nodeWidget);
			}
			e.stopPropagation();
			e.preventDefault();
		},
		_onClick: function(/*TreeNode*/ nodeWidget, /*Event*/ e){
			// summary:
			//		Translates click events into commands for the controller to process
			this.__click(nodeWidget, e, this.openOnClick, 'onClick');
		},
		_onDblClick: function(/*TreeNode*/ nodeWidget, /*Event*/ e){
			// summary:
			//		Translates double-click events into commands for the controller to process
			this.__click(nodeWidget, e, this.openOnDblClick, 'onDblClick');
		},

		_onExpandoClick: function(/*Object*/ message){
			// summary:
			//		User clicked the +/- icon; expand or collapse my children.
			var node = message.node;

			// If we are collapsing, we might be hiding the currently focused node.
			// Also, clicking the expando node might have erased focus from the current node.
			// For simplicity's sake just focus on the node with the expando.
			this.focusNode(node);

			if(node.isExpanded){
				this._collapseNode(node);
			}else{
				this._expandNode(node);
			}
		},

		onClick: function(/*===== item, node, evt =====*/){
			// summary:
			//		Callback when a tree node is clicked
			// item: Object
			//		Object from the dojo/store corresponding to this TreeNode
			// node: TreeNode
			//		The TreeNode itself
			// evt: Event
			//		The event
			// tags:
			//		callback
		},
		onDblClick: function(/*===== item, node, evt =====*/){
			// summary:
			//		Callback when a tree node is double-clicked
			// item: Object
			//		Object from the dojo/store corresponding to this TreeNode
			// node: TreeNode
			//		The TreeNode itself
			// evt: Event
			//		The event
			// tags:
			//		callback
		},
		onOpen: function(/*===== item, node =====*/){
			// summary:
			//		Callback when a node is opened
			// item: dojo/data/Item
			// node: TreeNode
			// tags:
			//		callback
		},
		onClose: function(/*===== item, node =====*/){
			// summary:
			//		Callback when a node is closed
			// item: Object
			//		Object from the dojo/store corresponding to this TreeNode
			// node: TreeNode
			//		The TreeNode itself
			// tags:
			//		callback
		},

		_getNextNode: function(node){
			// summary:
			//		Get next visible node

			kernel.deprecated(this.declaredClass + "::_getNextNode(node) is deprecated. Use _getNext(node) instead.", "", "2.0");
			return this._getNext(node);
		},

		_getRootOrFirstNode: function(){
			// summary:
			//		Get first visible node
			kernel.deprecated(this.declaredClass + "::_getRootOrFirstNode() is deprecated. Use _getFirst() instead.", "", "2.0");
			return this._getFirst();
		},

		_collapseNode: function(/*TreeNode*/ node){
			// summary:
			//		Called when the user has requested to collapse the node
			// returns:
			//		Promise that resolves when the node has finished closing

			if(node._expandNodeDeferred){
				delete node._expandNodeDeferred;
			}

			if(node.state == "Loading"){
				// ignore clicks while we are in the process of loading data
				return;
			}

			if(node.isExpanded){
				var ret = node.collapse();

				this.onClose(node.item, node);
				this._state(node, false);

				this._startPaint(ret);	// after this finishes, need to reset widths of TreeNodes

				return ret;
			}
		},

		_expandNode: function(/*TreeNode*/ node){
			// summary:
			//		Called when the user has requested to expand the node
			// returns:
			//		Promise that resolves when the node is loaded and opened and (if persist=true) all it's descendants
			//		that were previously opened too

			if(node._expandNodeDeferred){
				// there's already an expand in progress, or completed, so just return
				return node._expandNodeDeferred;	// dojo/Deferred
			}

			var model = this.model,
				item = node.item,
				_this = this;

			// Load data if it's not already loaded
			if(!node._loadDeferred){
				// need to load all the children before expanding
				node.markProcessing();

				// Setup deferred to signal when the load and expand are finished.
				// Save that deferred in this._expandDeferred as a flag that operation is in progress.
				node._loadDeferred = new Deferred();

				// Get the children
				model.getChildren(
					item,
					function(items){
						node.unmarkProcessing();

						// Display the children and also start expanding any children that were previously expanded
						// (if this.persist == true).   The returned Deferred will fire when those expansions finish.
						node.setChildItems(items).then(function(){
							node._loadDeferred.resolve(items);
						});
					},
					function(err){
						console.error(_this, ": error loading " + node.label + " children: ", err);
						node._loadDeferred.reject(err);
					}
				);
			}

			// Expand the node after data has loaded
			var def = node._loadDeferred.then(lang.hitch(this, function(){
				var def2 = node.expand();

				// seems like these should delayed until node.expand() completes, but left here for back-compat about
				// when this.isOpen flag gets set (ie, at the beginning of the animation)
				this.onOpen(node.item, node);
				this._state(node, true);

				return def2;
			}));

			this._startPaint(def);	// after this finishes, need to reset widths of TreeNodes

			return def;	// dojo/promise/Promise
		},

		////////////////// Miscellaneous functions ////////////////

		focusNode: function(/* _tree.Node */ node){
			// summary:
			//		Focus on the specified node (which must be visible)
			// tags:
			//		protected
                        var tmp = [];
                        for(var domNode = this.domNode; 
                            domNode && domNode.tagName && domNode.tagName.toUpperCase() !== 'IFRAME';
                            domNode = domNode.parentNode) {
                            tmp.push({
                                domNode: domNode.contentWindow || domNode,
                                scrollLeft: domNode.scrollLeft || 0,
                                scrollTop: domNode.scrollTop || 0
                            });
                        }
			this.focusChild(node);
			this.defer(function() {
                            for (var i = 0, max = tmp.length; i < max; i++) {
                                tmp[i].domNode.scrollLeft = tmp[i].scrollLeft;
                                tmp[i].domNode.scrollTop = tmp[i].scrollTop;
                            }
			}, 0);
		},

		_onNodeMouseEnter: function(/*dijit/_WidgetBase*/ /*===== node =====*/){
			// summary:
			//		Called when mouse is over a node (onmouseenter event),
			//		this is monitored by the DND code
		},

		_onNodeMouseLeave: function(/*dijit/_WidgetBase*/ /*===== node =====*/){
			// summary:
			//		Called when mouse leaves a node (onmouseleave event),
			//		this is monitored by the DND code
		},

		//////////////// Events from the model //////////////////////////

		_onItemChange: function(/*Item*/ item){
			// summary:
			//		Processes notification of a change to an item's scalar values like label
			var model = this.model,
				identity = model.getIdentity(item),
				nodes = this._itemNodesMap[identity];

			if(nodes){
				var label = this.getLabel(item),
					tooltip = this.getTooltip(item);
				array.forEach(nodes, function(node){
					node.set({
						item: item, // theoretically could be new JS Object representing same item
						label: label,
						tooltip: tooltip
					});
					node._updateItemClasses(item);
				});
			}
		},

		_onItemChildrenChange: function(/*dojo/data/Item*/ parent, /*dojo/data/Item[]*/ newChildrenList){
			// summary:
			//		Processes notification of a change to an item's children
			var model = this.model,
				identity = model.getIdentity(parent),
				parentNodes = this._itemNodesMap[identity];

			if(parentNodes){
				array.forEach(parentNodes, function(parentNode){
					parentNode.setChildItems(newChildrenList);
				});
			}
		},

		_onItemDelete: function(/*Item*/ item){
			// summary:
			//		Processes notification of a deletion of an item.
			//		Not called from new dojo.store interface but there's cleanup code in setChildItems() instead.

			var model = this.model,
				identity = model.getIdentity(item),
				nodes = this._itemNodesMap[identity];

			if(nodes){
				array.forEach(nodes, function(node){
					// Remove node from set of selected nodes (if it's selected)
					this.dndController.removeTreeNode(node);

					var parent = node.getParent();
					if(parent){
						// if node has not already been orphaned from a _onSetItem(parent, "children", ..) call...
						parent.removeChild(node);
					}

					// If we've orphaned the focused node then move focus to the root node
					if(this.lastFocusedChild && !dom.isDescendant(this.lastFocusedChild.domNode, this.domNode)){
						delete this.lastFocusedChild;
					}
					if(this.focusedChild && !dom.isDescendant(this.focusedChild.domNode, this.domNode)){
						this.focus();
					}

					node.destroyRecursive();
				}, this);
				delete this._itemNodesMap[identity];
			}
		},

		/////////////// Miscellaneous funcs

		_initState: function(){
			// summary:
			//		Load in which nodes should be opened automatically
			this._openedNodes = {};
			if(this.persist && this.cookieName){
				var oreo = cookie(this.cookieName);
				if(oreo){
					array.forEach(oreo.split(','), function(item){
						this._openedNodes[item] = true;
					}, this);
				}
			}
		},

		_state: function(node, expanded){
			// summary:
			//		Query or set expanded state for an node
			if(!this.persist){
				return false;
			}
			var path = array.map(node.getTreePath(),function(item){
				return this.model.getIdentity(item);
			}, this).join("/");
			if(arguments.length === 1){
				return this._openedNodes[path];
			}else{
				if(expanded){
					this._openedNodes[path] = true;
				}else{
					delete this._openedNodes[path];
				}
				this._saveExpandedNodes();
			}
		},

		_saveExpandedNodes: function(){
			if(this.persist && this.cookieName){
				var ary = [];
				for(var id in this._openedNodes){
					ary.push(id);
				}
				cookie(this.cookieName, ary.join(","), {expires: 365});
			}
		},

		destroy: function(){
			if(this._curSearch){
				this._curSearch.timer.remove();
				delete this._curSearch;
			}
			if(this.rootNode){
				this.rootNode.destroyRecursive();
			}
			if(this.dndController && !lang.isString(this.dndController)){
				this.dndController.destroy();
			}
			this.rootNode = null;
			this.inherited(arguments);
		},

		destroyRecursive: function(){
			// A tree is treated as a leaf, not as a node with children (like a grid),
			// but defining destroyRecursive for back-compat.
			this.destroy();
		},

		resize: function(changeSize){
			if(changeSize){
				domGeometry.setMarginBox(this.domNode, changeSize);
			}

			// The main JS sizing involved w/tree is the indentation, which is specified
			// in CSS and read in through this dummy indentDetector node (tree must be
			// visible and attached to the DOM to read this).
			// If the Tree is hidden domGeometry.position(this.tree.indentDetector).w will return 0, in which case just
			// keep the default value.
			this._nodePixelIndent = domGeometry.position(this.tree.indentDetector).w || this._nodePixelIndent;

			// resize() may be called before this.rootNode is created, so wait until it's available
			this.expandChildrenDeferred.then(lang.hitch(this, function(){
				// If tree has already loaded, then reset indent for all the nodes
				this.rootNode.set('indent', this.showRoot ? 0 : -1);

				// Also, adjust widths of all rows to match width of Tree
				this._adjustWidths();
			}));
		},

		_outstandingPaintOperations: 0,
		_startPaint: function(/*Promise|Boolean*/ p){
			// summary:
			//		Called at the start of an operation that will change what's displayed.
			// p:
			//		Promise that tells when the operation will complete.  Alternately, if it's just a Boolean, it signifies
			//		that the operation was synchronous, and already completed.

			this._outstandingPaintOperations++;
			if(this._adjustWidthsTimer){
				this._adjustWidthsTimer.remove();
				delete this._adjustWidthsTimer;
			}

			var oc = lang.hitch(this, function(){
				this._outstandingPaintOperations--;

				if(this._outstandingPaintOperations <= 0 && !this._adjustWidthsTimer && this._started){
					// Use defer() to avoid a width adjustment when another operation will immediately follow,
					// such as a sequence of opening a node, then it's children, then it's grandchildren, etc.
					this._adjustWidthsTimer = this.defer("_adjustWidths");
				}
			});
			when(p, oc, oc);
		},

		_adjustWidths: function(){
			// summary:
			//		Size container to match widest TreeNode, so that highlighting with scrolling works (#13141, #16132)

			if(this._adjustWidthsTimer){
				this._adjustWidthsTimer.remove();
				delete this._adjustWidthsTimer;
			}

			this.containerNode.style.width = "auto";
			this.containerNode.style.width = this.domNode.scrollWidth > this.domNode.offsetWidth ? "auto" : "100%";
		},

		_createTreeNode: function(/*Object*/ args){
			// summary:
			//		creates a TreeNode
			// description:
			//		Developers can override this method to define their own TreeNode class;
			//		However it will probably be removed in a future release in favor of a way
			//		of just specifying a widget for the label, rather than one that contains
			//		the children too.
			return new TreeNode(args);
		},

		focus: function(){
			// summary:
			//		Default focus() implementation: focus the previously focused child, or first child.
			//		Some applications may want to change this method to focus the [first] selected child.

			if(this.lastFocusedChild){
				this.focusNode(this.lastFocusedChild);
			}else{
				this.focusFirstChild();
			}
		}
	});

	if(has("dojo-bidi")){
		Tree.extend({
			_setTextDirAttr: function(textDir){
				if(textDir && this.textDir != textDir){
					this._set("textDir", textDir);
					this.rootNode.set("textDir", textDir);
				}
			}
		});
	}

	Tree.PathError = createError("TreePathError");
	Tree._TreeNode = TreeNode;	// for monkey patching or creating subclasses of TreeNode

	return Tree;
});

},
'dijit/tree/TreeStoreModel':function(){
define([
	"dojo/_base/array", // array.filter array.forEach array.indexOf array.some
	"dojo/aspect", // aspect.after
	"dojo/_base/declare", // declare
	"dojo/_base/lang" // lang.hitch
], function(array, aspect, declare, lang){

	// module:
	//		dijit/tree/TreeStoreModel

	return declare("dijit.tree.TreeStoreModel", null, {
		// summary:
		//		Implements dijit/Tree/model connecting to a dojo.data store with a single
		//		root item.  Any methods passed into the constructor will override
		//		the ones defined here.

		// store: dojo/data/api/Read
		//		Underlying store
		store: null,

		// childrenAttrs: String[]
		//		One or more attribute names (attributes in the dojo.data item) that specify that item's children
		childrenAttrs: ["children"],

		// newItemIdAttr: String
		//		Name of attribute in the Object passed to newItem() that specifies the id.
		//
		//		If newItemIdAttr is set then it's used when newItem() is called to see if an
		//		item with the same id already exists, and if so just links to the old item
		//		(so that the old item ends up with two parents).
		//
		//		Setting this to null or "" will make every drop create a new item.
		newItemIdAttr: "id",

		// labelAttr: String
		//		If specified, get label for tree node from this attribute, rather
		//		than by calling store.getLabel()
		labelAttr: "",

		// root: [readonly] dojo/data/Item
		//		Pointer to the root item (read only, not a parameter)
		root: null,

		// query: anything
		//		Specifies datastore query to return the root item for the tree.
		//		Must only return a single item.   Alternately can just pass in pointer
		//		to root item.
		// example:
		//	|	{id:'ROOT'}
		query: null,

		// deferItemLoadingUntilExpand: Boolean
		//		Setting this to true will cause the TreeStoreModel to defer calling loadItem on nodes
		//		until they are expanded. This allows for lazying loading where only one
		//		loadItem (and generally one network call, consequently) per expansion
		//		(rather than one for each child).
		//		This relies on partial loading of the children items; each children item of a
		//		fully loaded item should contain the label and info about having children.
		deferItemLoadingUntilExpand: false,

		constructor: function(/* Object */ args){
			// summary:
			//		Passed the arguments listed above (store, etc)
			// tags:
			//		private

			lang.mixin(this, args);

			this.connects = [];

			var store = this.store;
			if(!store.getFeatures()['dojo.data.api.Identity']){
				throw new Error("dijit.tree.TreeStoreModel: store must support dojo.data.Identity");
			}

			// if the store supports Notification, subscribe to the notification events
			if(store.getFeatures()['dojo.data.api.Notification']){
				this.connects = this.connects.concat([
					aspect.after(store, "onNew", lang.hitch(this, "onNewItem"), true),
					aspect.after(store, "onDelete", lang.hitch(this, "onDeleteItem"), true),
					aspect.after(store, "onSet", lang.hitch(this, "onSetItem"), true)
				]);
			}
		},

		destroy: function(){
			var h;
			while(h = this.connects.pop()){ h.remove(); }
			// TODO: should cancel any in-progress processing of getRoot(), getChildren()
		},

		// =======================================================================
		// Methods for traversing hierarchy

		getRoot: function(onItem, onError){
			// summary:
			//		Calls onItem with the root item for the tree, possibly a fabricated item.
			//		Calls onError on error.
			if(this.root){
				onItem(this.root);
			}else{
				this.store.fetch({
					query: this.query,
					onComplete: lang.hitch(this, function(items){
						if(items.length != 1){
							throw new Error("dijit.tree.TreeStoreModel: root query returned " + items.length +
								" items, but must return exactly one");
						}
						this.root = items[0];
						onItem(this.root);
					}),
					onError: onError
				});
			}
		},

		mayHaveChildren: function(/*dojo/data/Item*/ item){
			// summary:
			//		Tells if an item has or may have children.  Implementing logic here
			//		avoids showing +/- expando icon for nodes that we know don't have children.
			//		(For efficiency reasons we may not want to check if an element actually
			//		has children until user clicks the expando node)
			return array.some(this.childrenAttrs, function(attr){
				return this.store.hasAttribute(item, attr);
			}, this);
		},

		getChildren: function(/*dojo/data/Item*/ parentItem, /*function(items)*/ onComplete, /*function*/ onError){
			// summary:
			//		Calls onComplete() with array of child items of given parent item, all loaded.

			var store = this.store;
			if(!store.isItemLoaded(parentItem)){
				// The parent is not loaded yet, we must be in deferItemLoadingUntilExpand
				// mode, so we will load it and just return the children (without loading each
				// child item)
				var getChildren = lang.hitch(this, arguments.callee);
				store.loadItem({
					item: parentItem,
					onItem: function(parentItem){
						getChildren(parentItem, onComplete, onError);
					},
					onError: onError
				});
				return;
			}
			// get children of specified item
			var childItems = [];
			for(var i=0; i<this.childrenAttrs.length; i++){
				var vals = store.getValues(parentItem, this.childrenAttrs[i]);
				childItems = childItems.concat(vals);
			}

			// count how many items need to be loaded
			var _waitCount = 0;
			if(!this.deferItemLoadingUntilExpand){
				array.forEach(childItems, function(item){ if(!store.isItemLoaded(item)){ _waitCount++; } });
			}

			if(_waitCount == 0){
				// all items are already loaded (or we aren't loading them).  proceed...
				onComplete(childItems);
			}else{
				// still waiting for some or all of the items to load
				array.forEach(childItems, function(item, idx){
					if(!store.isItemLoaded(item)){
						store.loadItem({
							item: item,
							onItem: function(item){
								childItems[idx] = item;
								if(--_waitCount == 0){
									// all nodes have been loaded, send them to the tree
									onComplete(childItems);
								}
							},
							onError: onError
						});
					}
				});
			}
		},

		// =======================================================================
		// Inspecting items

		isItem: function(/* anything */ something){
			return this.store.isItem(something);	// Boolean
		},

		fetchItemByIdentity: function(/* object */ keywordArgs){
			// summary:
			//		Given the identity of an item, this method returns the item that has
			//		that identity through the onItem callback.  Conforming implementations
			//		should return null if there is no item with the given identity.
			//		Implementations of fetchItemByIdentity() may sometimes return an item
			//		from a local cache and may sometimes fetch an item from a remote server.
			// tags:
			//		extension
			this.store.fetchItemByIdentity(keywordArgs);
		},

		getIdentity: function(/* item */ item){
			return this.store.getIdentity(item);	// Object
		},

		getLabel: function(/*dojo/data/Item*/ item){
			// summary:
			//		Get the label for an item
			if(this.labelAttr){
				return this.store.getValue(item,this.labelAttr);	// String
			}else{
				return this.store.getLabel(item);	// String
			}
		},

		// =======================================================================
		// Write interface

		newItem: function(/* dijit/tree/dndSource.__Item */ args, /*dojo/data/api/Item*/ parent, /*int?*/ insertIndex){
			// summary:
			//		Creates a new item.   See `dojo/data/api/Write` for details on args.
			//		Used in drag & drop when item from external source dropped onto tree.
			// description:
			//		Developers will need to override this method if new items get added
			//		to parents with multiple children attributes, in order to define which
			//		children attribute points to the new item.

			var pInfo = {parent: parent, attribute: this.childrenAttrs[0]}, LnewItem;

			if(this.newItemIdAttr && args[this.newItemIdAttr]){
				// Maybe there's already a corresponding item in the store; if so, reuse it.
				this.fetchItemByIdentity({identity: args[this.newItemIdAttr], scope: this, onItem: function(item){
					if(item){
						// There's already a matching item in store, use it
						this.pasteItem(item, null, parent, true, insertIndex);
					}else{
						// Create new item in the tree, based on the drag source.
						LnewItem=this.store.newItem(args, pInfo);
						if(LnewItem && (insertIndex!=undefined)){
							// Move new item to desired position
							this.pasteItem(LnewItem, parent, parent, false, insertIndex);
						}
					}
				}});
			}else{
				// [as far as we know] there is no id so we must assume this is a new item
				LnewItem=this.store.newItem(args, pInfo);
				if(LnewItem && (insertIndex!=undefined)){
					// Move new item to desired position
					this.pasteItem(LnewItem, parent, parent, false, insertIndex);
				}
			}
		},

		pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy, /*int?*/ insertIndex){
			// summary:
			//		Move or copy an item from one parent item to another.
			//		Used in drag & drop
			var store = this.store,
				parentAttr = this.childrenAttrs[0];	// name of "children" attr in parent item

			// remove child from source item, and record the attribute that child occurred in
			if(oldParentItem){
				array.forEach(this.childrenAttrs, function(attr){
					if(store.containsValue(oldParentItem, attr, childItem)){
						if(!bCopy){
							var values = array.filter(store.getValues(oldParentItem, attr), function(x){
								return x != childItem;
							});
							store.setValues(oldParentItem, attr, values);
						}
						parentAttr = attr;
					}
				});
			}

			// modify target item's children attribute to include this item
			if(newParentItem){
				if(typeof insertIndex == "number"){
					// call slice() to avoid modifying the original array, confusing the data store
					var childItems = store.getValues(newParentItem, parentAttr).slice();
					childItems.splice(insertIndex, 0, childItem);
					store.setValues(newParentItem, parentAttr, childItems);
				}else{
					store.setValues(newParentItem, parentAttr,
						store.getValues(newParentItem, parentAttr).concat(childItem));
				}
			}
		},

		// =======================================================================
		// Callbacks

		onChange: function(/*dojo/data/Item*/ /*===== item =====*/){
			// summary:
			//		Callback whenever an item has changed, so that Tree
			//		can update the label, icon, etc.   Note that changes
			//		to an item's children or parent(s) will trigger an
			//		onChildrenChange() so you can ignore those changes here.
			// tags:
			//		callback
		},

		onChildrenChange: function(/*===== parent, newChildrenList =====*/){
			// summary:
			//		Callback to do notifications about new, updated, or deleted items.
			// parent: dojo/data/Item
			// newChildrenList: dojo/data/Item[]
			// tags:
			//		callback
		},

		onDelete: function(/*dojo/data/Item*/ /*===== item =====*/){
			// summary:
			//		Callback when an item has been deleted.
			// description:
			//		Note that there will also be an onChildrenChange() callback for the parent
			//		of this item.
			// tags:
			//		callback
		},

		// =======================================================================
		// Events from data store

		onNewItem: function(/* dojo/data/Item */ item, /* Object */ parentInfo){
			// summary:
			//		Handler for when new items appear in the store, either from a drop operation
			//		or some other way.   Updates the tree view (if necessary).
			// description:
			//		If the new item is a child of an existing item,
			//		calls onChildrenChange() with the new list of children
			//		for that existing item.
			//
			// tags:
			//		extension

			// We only care about the new item if it has a parent that corresponds to a TreeNode
			// we are currently displaying
			if(!parentInfo){
				return;
			}

			// Call onChildrenChange() on parent (ie, existing) item with new list of children
			// In the common case, the new list of children is simply parentInfo.newValue or
			// [ parentInfo.newValue ], although if items in the store has multiple
			// child attributes (see `childrenAttr`), then it's a superset of parentInfo.newValue,
			// so call getChildren() to be sure to get right answer.
			this.getChildren(parentInfo.item, lang.hitch(this, function(children){
				this.onChildrenChange(parentInfo.item, children);
			}));
		},

		onDeleteItem: function(/*Object*/ item){
			// summary:
			//		Handler for delete notifications from underlying store
			this.onDelete(item);
		},

		onSetItem: function(item, attribute /*===== , oldValue, newValue =====*/){
			// summary:
			//		Updates the tree view according to changes in the data store.
			// description:
			//		Handles updates to an item's children by calling onChildrenChange(), and
			//		other updates to an item by calling onChange().
			//
			//		See `onNewItem` for more details on handling updates to an item's children.
			// item: Item
			// attribute: attribute-name-string
			// oldValue: Object|Array
			// newValue: Object|Array
			// tags:
			//		extension

			if(array.indexOf(this.childrenAttrs, attribute) != -1){
				// item's children list changed
				this.getChildren(item, lang.hitch(this, function(children){
					// See comments in onNewItem() about calling getChildren()
					this.onChildrenChange(item, children);
				}));
			}else{
				// item's label/icon/etc. changed.
				this.onChange(item);
			}
		}
	});
});

},
'dijit/tree/ForestStoreModel':function(){
define([
	"dojo/_base/array", // array.indexOf array.some
	"dojo/_base/declare", // declare
	"dojo/_base/kernel", // global
	"dojo/_base/lang", // lang.hitch
	"./TreeStoreModel"
], function(array, declare, kernel, lang, TreeStoreModel){

// module:
//		dijit/tree/ForestStoreModel

return declare("dijit.tree.ForestStoreModel", TreeStoreModel, {
	// summary:
	//		Interface between a dijit.Tree and a dojo.data store that doesn't have a root item,
	//		a.k.a. a store that has multiple "top level" items.
	//
	// description:
	//		Use this class to wrap a dojo.data store, making all the items matching the specified query
	//		appear as children of a fabricated "root item".  If no query is specified then all the
	//		items returned by fetch() on the underlying store become children of the root item.
	//		This class allows dijit.Tree to assume a single root item, even if the store doesn't have one.
	//
	//		When using this class the developer must override a number of methods according to their app and
	//		data, including:
	//
	//		- onNewRootItem
	//		- onAddToRoot
	//		- onLeaveRoot
	//		- onNewItem
	//		- onSetItem

	// Parameters to constructor

	// rootId: String
	//		ID of fabricated root item
	rootId: "$root$",

	// rootLabel: String
	//		Label of fabricated root item
	rootLabel: "ROOT",

	// query: String
	//		Specifies the set of children of the root item.
	// example:
	//	|	{type:'continent'}
	query: null,

	// End of parameters to constructor

	constructor: function(params){
		// summary:
		//		Sets up variables, etc.
		// tags:
		//		private

		// Make dummy root item
		this.root = {
			store: this,
			root: true,
			id: params.rootId,
			label: params.rootLabel,
			children: params.rootChildren	// optional param
		};
	},

	// =======================================================================
	// Methods for traversing hierarchy

	mayHaveChildren: function(/*dojo/data/Item*/ item){
		// summary:
		//		Tells if an item has or may have children.  Implementing logic here
		//		avoids showing +/- expando icon for nodes that we know don't have children.
		//		(For efficiency reasons we may not want to check if an element actually
		//		has children until user clicks the expando node)
		// tags:
		//		extension
		return item === this.root || this.inherited(arguments);
	},

	getChildren: function(/*dojo/data/Item*/ parentItem, /*function(items)*/ callback, /*function*/ onError){
		// summary:
		//		Calls onComplete() with array of child items of given parent item, all loaded.
		if(parentItem === this.root){
			if(this.root.children){
				// already loaded, just return
				callback(this.root.children);
			}else{
				this.store.fetch({
					query: this.query,
					onComplete: lang.hitch(this, function(items){
						this.root.children = items;
						callback(items);
					}),
					onError: onError
				});
			}
		}else{
			this.inherited(arguments);
		}
	},

	// =======================================================================
	// Inspecting items

	isItem: function(/* anything */ something){
		return (something === this.root) ? true : this.inherited(arguments);
	},

	fetchItemByIdentity: function(/* object */ keywordArgs){
		if(keywordArgs.identity == this.root.id){
			var scope = keywordArgs.scope || kernel.global;
			if(keywordArgs.onItem){
				keywordArgs.onItem.call(scope, this.root);
			}
		}else{
			this.inherited(arguments);
		}
	},

	getIdentity: function(/* item */ item){
		return (item === this.root) ? this.root.id : this.inherited(arguments);
	},

	getLabel: function(/* item */ item){
		return	(item === this.root) ? this.root.label : this.inherited(arguments);
	},

	// =======================================================================
	// Write interface

	newItem: function(/* dijit/tree/dndSource.__Item */ args, /*Item*/ parent, /*int?*/ insertIndex){
		// summary:
		//		Creates a new item.   See dojo/data/api/Write for details on args.
		//		Used in drag & drop when item from external source dropped onto tree.
		if(parent === this.root){
			this.onNewRootItem(args);
			return this.store.newItem(args);
		}else{
			return this.inherited(arguments);
		}
	},

	onNewRootItem: function(/* dijit/tree/dndSource.__Item */ /*===== args =====*/){
		// summary:
		//		User can override this method to modify a new element that's being
		//		added to the root of the tree, for example to add a flag like root=true
	},

	pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy, /*int?*/ insertIndex){
		// summary:
		//		Move or copy an item from one parent item to another.
		//		Used in drag & drop
		if(oldParentItem === this.root){
			if(!bCopy){
				// It's onLeaveRoot()'s responsibility to modify the item so it no longer matches
				// this.query... thus triggering an onChildrenChange() event to notify the Tree
				// that this element is no longer a child of the root node
				this.onLeaveRoot(childItem);
			}
		}
		this.inherited(arguments, [childItem,
			oldParentItem === this.root ? null : oldParentItem,
			newParentItem === this.root ? null : newParentItem,
			bCopy,
			insertIndex
		]);
		if(newParentItem === this.root){
			// It's onAddToRoot()'s responsibility to modify the item so it matches
			// this.query... thus triggering an onChildrenChange() event to notify the Tree
			// that this element is now a child of the root node
			this.onAddToRoot(childItem);
		}
	},

	// =======================================================================
	// Handling for top level children

	onAddToRoot: function(/* item */ item){
		// summary:
		//		Called when item added to root of tree; user must override this method
		//		to modify the item so that it matches the query for top level items
		// example:
		//	|	store.setValue(item, "root", true);
		// tags:
		//		extension
		console.log(this, ": item ", item, " added to root");
	},

	onLeaveRoot: function(/* item */ item){
		// summary:
		//		Called when item removed from root of tree; user must override this method
		//		to modify the item so it doesn't match the query for top level items
		// example:
		//	|	store.unsetAttribute(item, "root");
		// tags:
		//		extension
		console.log(this, ": item ", item, " removed from root");
	},

	// =======================================================================
	// Events from data store

	_requeryTop: function(){
		// reruns the query for the children of the root node,
		// sending out an onSet notification if those children have changed
		var oldChildren = this.root.children || [];
		this.store.fetch({
			query: this.query,
			onComplete: lang.hitch(this, function(newChildren){
				this.root.children = newChildren;

				// If the list of children or the order of children has changed...
				if(oldChildren.length != newChildren.length ||
					array.some(oldChildren, function(item, idx){ return newChildren[idx] != item;})){
					this.onChildrenChange(this.root, newChildren);
				}
			})
		});
	},

	onNewItem: function(/* dojo/data/api/Item */ item, /* Object */ parentInfo){
		// summary:
		//		Handler for when new items appear in the store.  Developers should override this
		//		method to be more efficient based on their app/data.
		// description:
		//		Note that the default implementation requeries the top level items every time
		//		a new item is created, since any new item could be a top level item (even in
		//		addition to being a child of another item, since items can have multiple parents).
		//
		//		If developers can detect which items are possible top level items (based on the item and the
		//		parentInfo parameters), they should override this method to only call _requeryTop() for top
		//		level items.  Often all top level items have parentInfo==null, but
		//		that will depend on which store you use and what your data is like.
		// tags:
		//		extension
		this._requeryTop();

		this.inherited(arguments);
	},

	onDeleteItem: function(/*Object*/ item){
		// summary:
		//		Handler for delete notifications from underlying store

		// check if this was a child of root, and if so send notification that root's children
		// have changed
		if(array.indexOf(this.root.children, item) != -1){
			this._requeryTop();
		}

		this.inherited(arguments);
	},

	onSetItem: function(/* item */ item,
					/* attribute-name-string */ attribute,
					/* Object|Array */ oldValue,
					/* Object|Array */ newValue){
		// summary:
		//		Updates the tree view according to changes to an item in the data store.
		//		Developers should override this method to be more efficient based on their app/data.
		// description:
		//		Handles updates to an item's children by calling onChildrenChange(), and
		//		other updates to an item by calling onChange().
		//
		//		Also, any change to any item re-executes the query for the tree's top-level items,
		//		since this modified item may have started/stopped matching the query for top level items.
		//
		//		If possible, developers should override this function to only call _requeryTop() when
		//		the change to the item has caused it to stop/start being a top level item in the tree.
		// tags:
		//		extension

		this._requeryTop();
		this.inherited(arguments);
	}

});

});

},
'dijit/tree/_dndSelector':function(){
define([
	"dojo/_base/array", // array.filter array.forEach array.map
	"dojo/_base/declare", // declare
	"dojo/_base/kernel",	// global
	"dojo/_base/lang", // lang.hitch
	"dojo/dnd/common",
	"dojo/dom", // isDescendant
	"dojo/mouse", // mouse.isLeft
	"dojo/on",
	"dojo/touch",
	"../a11yclick",
	"./_dndContainer"
], function(array, declare, kernel, lang, dndCommon, dom, mouse, on, touch, a11yclick, _dndContainer){

	// module:
	//		dijit/tree/_dndSelector

	return declare("dijit.tree._dndSelector", _dndContainer, {
		// summary:
		//		This is a base class for `dijit/tree/dndSource`, and isn't meant to be used directly.
		//		It's based on `dojo/dnd/Selector`.
		// tags:
		//		protected

		/*=====
		// selection: Object
		//		(id to DomNode) map for every TreeNode that's currently selected.
		//		The DOMNode is the TreeNode.rowNode.
		selection: {},
		=====*/

		constructor: function(){
			// summary:
			//		Initialization
			// tags:
			//		private

			this.selection={};
			this.anchor = null;

			this.events.push(
				// listeners setup here but no longer used (left for backwards compatibility
				on(this.tree.domNode, touch.press, lang.hitch(this,"onMouseDown")),
				on(this.tree.domNode, touch.release, lang.hitch(this,"onMouseUp")),

				// listeners used in this module
				on(this.tree.domNode, touch.move, lang.hitch(this,"onMouseMove")),
				on(this.tree.domNode, a11yclick.press, lang.hitch(this,"onClickPress")),
				on(this.tree.domNode, a11yclick.release, lang.hitch(this,"onClickRelease"))
			);
		},

		// singular: Boolean
		//		Allows selection of only one element, if true.
		//		Tree hasn't been tested in singular=true mode, unclear if it works.
		singular: false,

		// methods
		getSelectedTreeNodes: function(){
			// summary:
			//		Returns a list of selected node(s).
			//		Used by dndSource on the start of a drag.
			// tags:
			//		protected
			var nodes=[], sel = this.selection;
			for(var i in sel){
				nodes.push(sel[i]);
			}
			return nodes;
		},

		selectNone: function(){
			// summary:
			//		Unselects all items
			// tags:
			//		private

			this.setSelection([]);
			return this;	// self
		},

		destroy: function(){
			// summary:
			//		Prepares the object to be garbage-collected
			this.inherited(arguments);
			this.selection = this.anchor = null;
		},
		addTreeNode: function(/*dijit/Tree._TreeNode*/ node, /*Boolean?*/isAnchor){
			// summary:
			//		add node to current selection
			// node: Node
			//		node to add
			// isAnchor: Boolean
			//		Whether the node should become anchor.

			this.setSelection(this.getSelectedTreeNodes().concat( [node] ));
			if(isAnchor){ this.anchor = node; }
			return node;
		},
		removeTreeNode: function(/*dijit/Tree._TreeNode*/ node){
			// summary:
			//		remove node and it's descendants from current selection
			// node: Node
			//		node to remove
			var newSelection = array.filter(this.getSelectedTreeNodes(), function(selectedNode){
				return !dom.isDescendant(selectedNode.domNode, node.domNode); // also matches when selectedNode == node
			});
			this.setSelection(newSelection);
			return node;
		},
		isTreeNodeSelected: function(/*dijit/Tree._TreeNode*/ node){
			// summary:
			//		return true if node is currently selected
			// node: Node
			//		the node to check whether it's in the current selection

			return node.id && !!this.selection[node.id];
		},
		setSelection: function(/*dijit/Tree._TreeNode[]*/ newSelection){
			// summary:
			//		set the list of selected nodes to be exactly newSelection. All changes to the
			//		selection should be passed through this function, which ensures that derived
			//		attributes are kept up to date. Anchor will be deleted if it has been removed
			//		from the selection, but no new anchor will be added by this function.
			// newSelection: Node[]
			//		list of tree nodes to make selected
			var oldSelection = this.getSelectedTreeNodes();
			array.forEach(this._setDifference(oldSelection, newSelection), lang.hitch(this, function(node){
				node.setSelected(false);
				if(this.anchor == node){
					delete this.anchor;
				}
				delete this.selection[node.id];
			}));
			array.forEach(this._setDifference(newSelection, oldSelection), lang.hitch(this, function(node){
				node.setSelected(true);
				this.selection[node.id] = node;
			}));
			this._updateSelectionProperties();
		},
		_setDifference: function(xs,ys){
			// summary:
			//		Returns a copy of xs which lacks any objects
			//		occurring in ys. Checks for membership by
			//		modifying and then reading the object, so it will
			//		not properly handle sets of numbers or strings.

			array.forEach(ys, function(y){ y.__exclude__ = true; });
			var ret = array.filter(xs, function(x){ return !x.__exclude__; });

			// clean up after ourselves.
			array.forEach(ys, function(y){ delete y['__exclude__'] });
			return ret;
		},
		_updateSelectionProperties: function(){
			// summary:
			//		Update the following tree properties from the current selection:
			//		path[s], selectedItem[s], selectedNode[s]

			var selected = this.getSelectedTreeNodes();
			var paths = [], nodes = [];
			array.forEach(selected, function(node){
				var ary = node.getTreePath();
				nodes.push(node);
				paths.push(ary);
			}, this);
			var items = array.map(nodes,function(node){ return node.item; });
			this.tree._set("paths", paths);
			this.tree._set("path", paths[0] || []);
			this.tree._set("selectedNodes", nodes);
			this.tree._set("selectedNode", nodes[0] || null);
			this.tree._set("selectedItems", items);
			this.tree._set("selectedItem", items[0] || null);
		},

		// selection related events
		onClickPress: function(e){
			// summary:
			//		Event processor for onmousedown/ontouchstart/onkeydown corresponding to a click event
			// e: Event
			//		onmousedown/ontouchstart/onkeydown event
			// tags:
			//		protected

			// ignore mouse or touch on expando node
			if(this.current && this.current.isExpandable && this.tree.isExpandoNode(e.target, this.current)){ return; }

			if(e.type == "mousedown" && mouse.isLeft(e)){
				// Prevent text selection while dragging on desktop, see #16328.   But don't call preventDefault()
				// for mobile because it will break things completely, see #15838.  Also, don't preventDefault() on
				// MSPointerDown or pointerdown events, because that stops the mousedown event from being generated,
				// see #17709.
				// TODO: remove this completely in 2.0.  It shouldn't be needed since dojo/dnd/Manager already
				// calls preventDefault() for the "selectstart" event.  It can also be achieved via CSS:
				// http://stackoverflow.com/questions/826782/css-rule-to-disable-text-selection-highlighting
				e.preventDefault();
			}

			var treeNode = e.type == "keydown" ? this.tree.focusedChild : this.current;

			if(!treeNode){
				// Click must be on the Tree but not on a TreeNode, happens especially when Tree is stretched to fill
				// a pane of a BorderContainer, etc.
				return;
			}

			var copy = dndCommon.getCopyKeyState(e), id = treeNode.id;

			// if shift key is not pressed, and the node is already in the selection,
			// delay deselection until onmouseup so in the case of DND, deselection
			// will be canceled by onmousemove.
			if(!this.singular && !e.shiftKey && this.selection[id]){
				this._doDeselect = true;
				return;
			}else{
				this._doDeselect = false;
			}
			this.userSelect(treeNode, copy, e.shiftKey);
		},

		onClickRelease: function(e){
			// summary:
			//		Event processor for onmouseup/ontouchend/onkeyup corresponding to a click event
			// e: Event
			//		onmouseup/ontouchend/onkeyup event
			// tags:
			//		protected

			// _doDeselect is the flag to indicate that the user wants to either ctrl+click on
			// an already selected item (to deselect the item), or click on a not-yet selected item
			// (which should remove all current selection, and add the clicked item). This can not
			// be done in onMouseDown, because the user may start a drag after mousedown. By moving
			// the deselection logic here, the user can drag an already selected item.
			if(!this._doDeselect){ return; }
			this._doDeselect = false;
			this.userSelect(e.type == "keyup" ? this.tree.focusedChild : this.current, dndCommon.getCopyKeyState(e), e.shiftKey);
		},
		onMouseMove: function(/*===== e =====*/){
			// summary:
			//		event processor for onmousemove/ontouchmove
			// e: Event
			//		onmousemove/ontouchmove event
			this._doDeselect = false;
		},

		// mouse/touch events that are no longer used
		onMouseDown: function(){
			// summary:
			//		Event processor for onmousedown/ontouchstart
			// e: Event
			//		onmousedown/ontouchstart event
			// tags:
			//		protected
		},
		onMouseUp: function(){
			// summary:
			//		Event processor for onmouseup/ontouchend
			// e: Event
			//		onmouseup/ontouchend event
			// tags:
			//		protected
		},

		_compareNodes: function(n1, n2){
			if(n1 === n2){
				return 0;
			}

			if('sourceIndex' in document.documentElement){ //IE
				//TODO: does not yet work if n1 and/or n2 is a text node
				return n1.sourceIndex - n2.sourceIndex;
			}else if('compareDocumentPosition' in document.documentElement){ //FF, Opera
				return n1.compareDocumentPosition(n2) & 2 ? 1: -1;
			}else if(document.createRange){ //Webkit
				var r1 = doc.createRange();
				r1.setStartBefore(n1);

				var r2 = doc.createRange();
				r2.setStartBefore(n2);

				return r1.compareBoundaryPoints(r1.END_TO_END, r2);
			}else{
				throw Error("dijit.tree._compareNodes don't know how to compare two different nodes in this browser");
			}
		},

		userSelect: function(node, multi, range){
			// summary:
			//		Add or remove the given node from selection, responding
			//		to a user action such as a click or keypress.
			// multi: Boolean
			//		Indicates whether this is meant to be a multi-select action (e.g. ctrl-click)
			// range: Boolean
			//		Indicates whether this is meant to be a ranged action (e.g. shift-click)
			// tags:
			//		protected

			if(this.singular){
				if(this.anchor == node && multi){
					this.selectNone();
				}else{
					this.setSelection([node]);
					this.anchor = node;
				}
			}else{
				if(range && this.anchor){
					var cr = this._compareNodes(this.anchor.rowNode, node.rowNode),
					begin, end, anchor = this.anchor;

					if(cr < 0){ //current is after anchor
						begin = anchor;
						end = node;
					}else{ //current is before anchor
						begin = node;
						end = anchor;
					}
					var nodes = [];
					//add everything betweeen begin and end inclusively
					while(begin != end){
						nodes.push(begin);
						begin = this.tree._getNext(begin);
					}
					nodes.push(end);

					this.setSelection(nodes);
				}else{
					if( this.selection[ node.id ] && multi ){
						this.removeTreeNode( node );
					}else if(multi){
						this.addTreeNode(node, true);
					}else{
						this.setSelection([node]);
						this.anchor = node;
					}
				}
			}
		},

		getItem: function(/*String*/ key){
			// summary:
			//		Returns the dojo/dnd/Container._Item (representing a dragged node) by it's key (id).
			//		Called by dojo/dnd/Source.checkAcceptance().
			// tags:
			//		protected

			var widget = this.selection[key];
			return {
				data: widget,
				type: ["treeNode"]
			}; // dojo/dnd/Container._Item
		},

		forInSelectedItems: function(/*Function*/ f, /*Object?*/ o){
			// summary:
			//		Iterates over selected items;
			//		see `dojo/dnd/Container.forInItems()` for details
			o = o || kernel.global;
			for(var id in this.selection){
				// console.log("selected item id: " + id);
				f.call(o, this.getItem(id), id, this);
			}
		}
	});
});

},
'dijit/tree/_dndContainer':function(){
define([
	"dojo/aspect", // aspect.after
	"dojo/_base/declare", // declare
	"dojo/dom-class", // domClass.add domClass.remove domClass.replace
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dojo/on",
	"dojo/touch"
], function(aspect, declare, domClass, lang, on, touch){

	// module:
	//		dijit/tree/_dndContainer

	/*=====
	 var __Args = {
	 // summary:
	 //		A dict of parameters for Tree source configuration.
	 // isSource: Boolean?
	 //		Can be used as a DnD source. Defaults to true.
	 // accept: String[]
	 //		List of accepted types (text strings) for a target; defaults to
	 //		["text", "treeNode"]
	 // copyOnly: Boolean?
	 //		Copy items, if true, use a state of Ctrl key otherwise,
	 // dragThreshold: Number
	 //		The move delay in pixels before detecting a drag; 0 by default
	 // betweenThreshold: Integer
	 //		Distance from upper/lower edge of node to allow drop to reorder nodes
	 };
	 =====*/

	return declare("dijit.tree._dndContainer", null, {

		// summary:
		//		This is a base class for `dijit/tree/_dndSelector`, and isn't meant to be used directly.
		//		It's modeled after `dojo/dnd/Container`.
		// tags:
		//		protected

		/*=====
		 // current: TreeNode
		 //		The currently hovered TreeNode.  Not set to anything for keyboard operation.  (TODO: change?)
		 current: null,
		 =====*/

		constructor: function(tree, params){
			// summary:
			//		A constructor of the Container
			// tree: Node
			//		Node or node's id to build the container on
			// params: __Args
			//		A dict of parameters, which gets mixed into the object
			// tags:
			//		private
			this.tree = tree;
			this.node = tree.domNode;	// TODO: rename; it's not a TreeNode but the whole Tree
			lang.mixin(this, params);

			// states
			this.containerState = "";
			domClass.add(this.node, "dojoDndContainer");

			// set up events
			this.events = [
				// Mouse (or touch) enter/leave on Tree itself
				on(this.node, touch.enter, lang.hitch(this, "onOverEvent")),
				on(this.node, touch.leave, lang.hitch(this, "onOutEvent")),

				// switching between TreeNodes
				aspect.after(this.tree, "_onNodeMouseEnter", lang.hitch(this, "onMouseOver"), true),
				aspect.after(this.tree, "_onNodeMouseLeave", lang.hitch(this, "onMouseOut"), true),

				// cancel text selection and text dragging
				on(this.node, "dragstart, selectstart", function(evt){
					evt.preventDefault();
				})
			];
		},

		destroy: function(){
			// summary:
			//		Prepares this object to be garbage-collected

			var h;
			while(h = this.events.pop()){
				h.remove();
			}

			// this.clearItems();
			this.node = this.parent = null;
		},

		// mouse events
		onMouseOver: function(widget /*===== , evt =====*/){
			// summary:
			//		Called when mouse is moved over a TreeNode
			// widget: TreeNode
			// evt: Event
			// tags:
			//		protected
			this.current = widget;
		},

		onMouseOut: function(/*===== widget, evt =====*/){
			// summary:
			//		Called when mouse is moved away from a TreeNode
			// widget: TreeNode
			// evt: Event
			// tags:
			//		protected
			this.current = null;
		},

		_changeState: function(type, newState){
			// summary:
			//		Changes a named state to new state value
			// type: String
			//		A name of the state to change
			// newState: String
			//		new state
			var prefix = "dojoDnd" + type;
			var state = type.toLowerCase() + "State";
			//domClass.replace(this.node, prefix + newState, prefix + this[state]);
			domClass.replace(this.node, prefix + newState, prefix + this[state]);
			this[state] = newState;
		},

		_addItemClass: function(node, type){
			// summary:
			//		Adds a class with prefix "dojoDndItem"
			// node: Node
			//		A node
			// type: String
			//		A variable suffix for a class name
			domClass.add(node, "dojoDndItem" + type);
		},

		_removeItemClass: function(node, type){
			// summary:
			//		Removes a class with prefix "dojoDndItem"
			// node: Node
			//		A node
			// type: String
			//		A variable suffix for a class name
			domClass.remove(node, "dojoDndItem" + type);
		},

		onOverEvent: function(){
			// summary:
			//		This function is called once, when mouse is over our container
			// tags:
			//		protected
			this._changeState("Container", "Over");
		},

		onOutEvent: function(){
			// summary:
			//		This function is called once, when mouse is out of our container
			// tags:
			//		protected
			this._changeState("Container", "");
		}
	});
});

},
'jimu/dijit/FeaturelayerChooserFromPortal':function(){
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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./templates/FeaturelayerChooserFromPortal.html',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/on',
  'dojo/query',
  'dojo/Deferred',
  'dojo/Evented',
  'dojo/promise/all',
  'jimu/dijit/ItemSelector',
  'jimu/dijit/FeaturelayerServiceBrowser',
  'jimu/portalUrlUtils',
  'esri/request'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
  lang, html, array, on, query, Deferred, Evented, promiseAll, ItemSelector,
  ServiceBrowser, portalUrlUtils, esriRequest) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    /*jshint unused: false*/
    templateString: template,
    declaredClass: 'jimu.dijit.FeaturelayerChooserFromPortal',
    baseClass: 'jimu-service-chooser-from-portal jimu-featurelayer-chooser-from-portal',

    _serviceBrowserDef:null,

    //options:
    portalUrl: null,
    multiple: false,

    //events:
    //ok
    //cancel

    //public methods:
    //getSelectedItems return [{name,url,definition}]

    postMixInProperties: function(){
      this.nls = lang.mixin({}, window.jimuNls.common);
      this.nls = lang.mixin(this.nls, window.jimuNls.featureLayerChooserFromPortal);
      this.portalUrl = portalUrlUtils.getStandardPortalUrl(this.portalUrl);
      this.multiple = this.multiple === true ? true : false;
    },

    postCreate: function(){
      this.inherited(arguments);
      this._initSelf();
    },

    getSelectedItems: function(){
      //[{name,url,definition}]
      var items = this.serviceBrowser.getSelectedItems();
      return items;
    },

    _initSelf: function(){
      //init selector
      this.selector = new ItemSelector({
        portalUrl: this.portalUrl,
        itemTypes: ['Feature Service', 'Map Service'],
        onlyShowOnlineFeaturedItems: false
      });
      this.own(on(this.selector, 'item-selected', lang.hitch(this, this._onItemSelected)));
      this.own(on(this.selector, 'none-item-selected', lang.hitch(this, this._onNoneItemSelected)));
      this.selector.placeAt(this.selectorContainer);
      this.selector.startup();

      //init service browser
      this.serviceBrowser = new ServiceBrowser({
        multiple: this.multiple
      });
      this.own(on(this.serviceBrowser,
                  'tree-click',
                  lang.hitch(this, this._onServiceBrowserClicked)));
      this.serviceBrowser.placeAt(this.serviceBrowserContainer);
      this.serviceBrowser.startup();
    },

    _onItemSelected: function(){
      html.removeClass(this.btnNext, 'jimu-state-disabled');
    },

    _onNoneItemSelected: function(){
      html.addClass(this.btnNext, 'jimu-state-disabled');
    },

    _onBtnBackClicked: function(){
      if(this._serviceBrowserDef && !this._serviceBrowserDef.isFulfilled()){
        this._serviceBrowserDef.cancel();
      }
      html.setStyle(this.btnOk, 'display', 'none');
      html.setStyle(this.btnNext, 'display', 'block');
      html.setStyle(this.btnBack, 'display', 'none');
      html.addClass(this.btnOk, 'jimu-state-disabled');
      html.setStyle(this.selectorContainer, 'display', 'block');
      html.setStyle(this.serviceBrowserContainer, 'display', 'none');
      this.serviceBrowser.reset();
      this.emit('back');
    },

    _onBtnOkClicked: function(){
      var items = this.getSelectedItems();
      if(items.length > 0){
        this.emit('ok', items);
      }
    },

    _onBtnNextClicked: function(){
      var item = this.selector.getSelectedItem();
      if(!item){
        return;
      }
      html.setStyle(this.btnNext, 'display', 'none');
      html.setStyle(this.btnBack, 'display', 'block');
      html.setStyle(this.btnOk, 'display', 'block');
      html.addClass(this.btnOk, 'jimu-state-disabled');
      html.setStyle(this.selectorContainer, 'display', 'none');
      html.setStyle(this.serviceBrowserContainer, 'display', 'block');
      this.serviceBrowser.reset();
      var url = item.url || item.item;
      this._serviceBrowserDef = this.serviceBrowser.setUrl(url);
      this._serviceBrowserDef.then(lang.hitch(this, function(){
        this._serviceBrowserDef = null;
        this._setOkStateBySelectedItems();
      }), lang.hitch(this, function(){
        this._serviceBrowserDef = null;
      }));
      this.emit('next');
    },

    _setOkStateBySelectedItems: function(){
      var items = this.serviceBrowser.getSelectedItems();
      if(items.length > 0){
        html.removeClass(this.btnOk, 'jimu-state-disabled');
      }
      else{
        html.addClass(this.btnOk, 'jimu-state-disabled');
      }
    },

    _onServiceBrowserClicked: function(){
      this._setOkStateBySelectedItems();
    },

    _onBtnCancelClicked: function(){
      this.emit('cancel');
    }

  });
});
},
'jimu/dijit/ItemSelector':function(){
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
  'dojo/topic',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./templates/ItemSelector.html',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/_base/config',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/Deferred',
  'dojo/promise/all',
  'dojo/query',
  'dojo/on',
  'dojo/dom-style',
  'jimu/utils',
  'jimu/portalUtils',
  'jimu/tokenUtils',
  'jimu/portalUrlUtils',
  'jimu/dijit/ViewStack',
  'jimu/dijit/Search',
  'jimu/dijit/TabContainer3',
  'jimu/dijit/_ItemTable',
  'jimu/dijit/BindLabelPropsMixin',
  'dijit/form/RadioButton'
], function(declare, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
  Evented, lang, dojoConfig, array, html, Deferred, all, query, on, domStyle, jimuUtils, portalUtils,
  tokenUtils, portalUrlUtils, ViewStack, Search, TabContainer3,  _ItemTable, BindLabelPropsMixin) {
  /*jshint unused: false*/
  /* jshint maxlen: 200 */
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, BindLabelPropsMixin, Evented], {
    templateString: template,
    declaredClass: 'jimu.dijit.ItemSelector',
    baseClass: "jimu-item-selector",
    tab: null,

    _user: null,
    _group: null,
    //public portal
    _allPublicPortalQuery: null,
    _filterPublicPortalQuery: null,
    //public ArcGIS.com
    _allPublicOnlineQuery: null,
    _filterPublicOnlineQuery: null,
    //organization
    _allOrganizationQuery: null,
    _filterOrganizationQuery: null,
    //my content
    _allMyContentQuery: null,
    _filterMyContentQuery: null,
    //group
    _allGroupQuery: null,
    _filterGroupQuery: null,

    _isPublicTabShow: false,
    _signIn:false,
    _itemTypeQueryString: '',
    _typeKeywordQueryString: '',

    //options:
    portalUrl: null,
    itemTypes: '',//array, such as ['Web Map'], ['Feature Service','Map Service']...
    typeKeywords: '',//array, such as ['Web AppBuilder'] or ['Web AppBuilder','Web Map']...
    showOnlineItems: true,
    onlyShowOnlineFeaturedItems: false,
    showMyContent: true,
    showMyOrganization: true,
    showMyGroups: true,
    showPublic: true,
    showOnlyEditableGroups: false,

    //public methods:
    //getSelectedItem

    //events:
    //item-selected
    //none-item-selected
    //update

    //css classes:
    //signin-tip
    //search-none-icon
    //search-none-tip

    postMixInProperties: function(){
      this.portalUrl = portalUrlUtils.getStandardPortalUrl(this.portalUrl);
      this.showOnlineItems = this.showOnlineItems === false ? false : true;

      //handle itemTypes
      if(!(this.itemTypes && this.itemTypes.length > 0)){
        this.itemTypes = [];
      }
      this._itemTypes = '';
      array.forEach(this.itemTypes, lang.hitch(this, function(type, index){
        this._itemTypes += '"' +  type + '"';
        if(index !== this.itemTypes.length - 1){
          this._itemTypes += ',';
        }
      }));
      this._itemTypes = '[' + this._itemTypes + ']';

      //handle typeKeywords
      if(!(this.typeKeywords && this.typeKeywords.length > 0)){
        this.typeKeywords = [];
      }
      this._typeKeywords = '';
      array.forEach(this.typeKeywords, lang.hitch(this, function(keyword, index){
        this._typeKeywords += '"' + keyword + '"';
        if(index !== this.typeKeywords.length - 1){
          this._typeKeywords += ',';
        }
      }));
      this._typeKeywords = '[' + this._typeKeywords + ']';

      this.nls = window.jimuNls.itemSelector;
    },

    postCreate: function() {
      this.inherited(arguments);
      var portalUrl = this._getPortalUrl();
      this.portal = portalUtils.getPortal(portalUrl);
      this._initOptions();
      this._initSearchQuery();
      this._initTabs();
      this._initPortalRadio();
      this._initItemTables();
      this._initPublic();
      this._initPrivate();
      this._updateUIbySignIn();
    },

    _initOptions: function(){
      this._itemTypeQueryString = jimuUtils.getItemQueryStringByTypes(this.itemTypes);
      this._typeKeywordQueryString = jimuUtils.getItemQueryStringByTypeKeywords(this.typeKeywords);
    },

    _initTabs: function(){
      var tabMyContent = {
        title: this.nls.myContent,
        content: this.mycontentTabNode
      };

      var tabOrganization = {
        title: this.nls.myOrganization,
        content: this.organizationTabNode
      };

      var tabGroup = {
        title: this.nls.myGroup,
        content: this.groupTabNode
      };

      var tabPublic = {
        title: this.nls.publicMap,
        content: this.publicTabNode
      };

      domStyle.set(this.mycontentTabNode, "display", "none");
      domStyle.set(this.organizationTabNode, "display", "none");
      domStyle.set(this.groupTabNode, "display", "none");
      domStyle.set(this.publicTabNode, "display", "none");

      var tabs = [];
      if(this.showMyContent) {
        tabs.push(tabMyContent);
        domStyle.set(this.mycontentTabNode, "display", "block");
      }
      if(this.showMyOrganization) {
        tabs.push(tabOrganization);
        domStyle.set(this.organizationTabNode, "display", "block");
      }
      if(this.showMyGroups) {
        tabs.push(tabGroup);
        domStyle.set(this.groupTabNode, "display", "block");
      }
      if(this.showPublic) {
        tabs.push(tabPublic);
        domStyle.set(this.publicTabNode, "display", "block");
      }

      this.tab = new TabContainer3({
        tabs: tabs
      }, this.tabNode);

      this.own(on(this.tab, "tabChanged", lang.hitch(this, function(title) {
        html.setStyle(this.signinSection, 'display', 'none');
        if (title !== this.nls.publicMap) {
          this._isPublicTabShow = false;
          this._updateUIbySignIn();
        } else {
          this._isPublicTabShow = true;
        }
      })));
    },

    _updateUIbySignIn: function(){
      html.setStyle(this.signinSection, 'display', 'none');
      var selector = '.organization-tab-content-main,' +
                     '.group-tab-content-main,' +
                     '.mycontent-tab-content-main';
      var contentMains = query(selector, this.domNode);
      var signIn = tokenUtils.userHaveSignInPortal(this._getPortalUrl());
      if (signIn) {
        contentMains.style('display', 'block');
      } else {
        contentMains.style('display', 'none');
        if(!this._isPublicTabShow){
          html.setStyle(this.signinSection, 'display', 'block');
        }
      }
    },

    _initPortalRadio: function(){
      var portalUrl = this._getPortalUrl();
      var portalServer = portalUrlUtils.getServerByUrl(portalUrl);

      this.portalPublicRaido.set("disabled", false);
      this.onlinePublicRaido.set("disabled", false);
      this.portalPublicRaido.set("checked", true);
      var shouldHidePublicArcGIScom = false;
      if(portalUrlUtils.isArcGIScom(portalServer)){
        shouldHidePublicArcGIScom = true;
        this.portalPublicLabel.innerHTML = 'ArcGIS.com';
      }
      else{
        this.portalPublicLabel.innerHTML = portalServer;
        if(this.showOnlineItems){
          shouldHidePublicArcGIScom = false;
        }
        else{
          shouldHidePublicArcGIScom = true;
        }
      }
      if(shouldHidePublicArcGIScom){
        this.onlinePublicRaido.set("disabled", true);
        html.setStyle(this.onlinePublicRaido, 'display', 'none');
        html.setStyle(this.onlinePublicLabel, 'display', 'none');
      }
    },

    _initSearchQuery: function(){
      var culture = dojoConfig.locale && dojoConfig.locale.slice(0, 2) || 'en';
      var currentLocaleOwner = 'esri_' + culture.toLowerCase();

      var allLocaleOwners = ["esri_he", "esri_fr", "esri_ja", "esri_nl",
                             "esri_th", "esri_tr", "esri_nb", "esri_ro",
                             "esri_it", "esri_pl", "esri_po", "esri_ru",
                             "esri_pt", "esri_en", "esri_ar", "esri_et",
                             "esri_es", "esri_ko", "esri_cs", "esri_da",
                             "esri_zh", "esri_sv", "esri_lt", "esri_fi",
                             "esri_lv", "esri_de", "esri_vi"];
      var removedOwners = array.filter(allLocaleOwners, lang.hitch(this, function(item){
        return item !== currentLocaleOwner;
      }));

      var ownerStr = '';
      array.forEach(removedOwners, lang.hitch(this, function(owner){
        ownerStr += ' -owner:' + owner + ' ';
      }));

      var orgStr = " ";
      if(this.portal && this.portal.user && this.portal.user.orgId){
        orgStr = " orgid:" + this.portal.user.orgId + " ";
      }

      var strPublicPortalQuery = orgStr + this._itemTypeQueryString + ' AND access:public ' +
      ownerStr + ' ' + this._typeKeywordQueryString;

      //portal public
      this._allPublicPortalQuery = this._getQuery({
        sortField:'numViews',
        sortOrder:'desc',
        q: strPublicPortalQuery
      });

      this._filterPublicPortalQuery = this._getQuery({
        q: strPublicPortalQuery,
        basicQ: strPublicPortalQuery
      });

      //ArcGIS.com public
      var groupIds = ' (group:"c755678be14e4a0984af36a15f5b643e" ' +
        ' OR group:"b8787a74b4d74f7fb9b8fac918735153") ';
      var strGroup = this.onlyShowOnlineFeaturedItems ? groupIds : ' ';
      this._allPublicOnlineQuery = this._getQuery({
        sortField:'numViews',
        sortOrder:'desc',
        q: strGroup + this._itemTypeQueryString +
        ' AND access:public ' + this._typeKeywordQueryString
      });

      this._filterPublicOnlineQuery = this._getQuery({
        q:this._itemTypeQueryString + ' AND access:public ' + this._typeKeywordQueryString
      });

      //organization
      this._allOrganizationQuery = this._getQuery();
      this._filterOrganizationQuery = this._getQuery();

      //my content
      this._allMyContentQuery = this._getQuery();
      this._filterMyContentQuery = this._getQuery();

      //group
      this._allGroupQuery = this._getQuery();
      this._filterGroupQuery = this._getQuery();
    },

    _getQuery: function(other){
      var other2 = other || {};
      var query = lang.mixin({
        start:1,
        num:16,
        f:'json'
      }, other2);
      return query;
    },

    _getPortalUrl: function(){
      return portalUrlUtils.getStandardPortalUrl(this.portalUrl);
    },

    _initItemTables: function(){
      //pass onCreateItemContent callback
      if(typeof this.onCreateItemContent === 'function'){
        this.mycontentItemTable.onCreateItemContent = this.onCreateItemContent;
        this.organizationItemTable.onCreateItemContent = this.onCreateItemContent;
        this.groupItemTable.onCreateItemContent = this.onCreateItemContent;
        this.publicPortalItemTable.onCreateItemContent = this.onCreateItemContent;
        this.publicOnlineItemTable.onCreateItemContent = this.onCreateItemContent;
      }

      //bind events
      this.own(
        on(this.publicPortalItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked))
      );
      this.own(
        on(this.publicOnlineItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked))
      );
      this.own(
        on(this.organizationItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked))
      );
      this.own(
        on(this.groupItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked))
      );
      this.own(
        on(this.mycontentItemTable, 'item-dom-clicked', lang.hitch(this, this._onItemDomClicked))
      );

      this.own(
        on(this.publicPortalItemTable, 'update', lang.hitch(this, this._onItemTableUpdate))
      );
      this.own(
        on(this.publicOnlineItemTable, 'update', lang.hitch(this, this._onItemTableUpdate))
      );
      this.own(
        on(this.organizationItemTable, 'update', lang.hitch(this, this._onItemTableUpdate))
      );
      this.own(
        on(this.groupItemTable, 'update', lang.hitch(this, this._onItemTableUpdate))
      );
      this.own(
        on(this.mycontentItemTable, 'update', lang.hitch(this, this._onItemTableUpdate))
      );

      var portalUrl = this._getPortalUrl();
      //portal public
      if(!this.portalPublicRaido.get("disabled")){
        this.publicPortalItemTable.set('portalUrl', portalUrl);
        this.publicPortalItemTable.searchAllItems(this._allPublicPortalQuery);
        this.publicPortalItemTable.set('filteredQuery', this._filterPublicPortalQuery);
      }

      //ArcGIS.com public
      if(!this.onlinePublicRaido.get("disabled")){
        this.publicOnlineItemTable.set('portalUrl', window.location.protocol + '//www.arcgis.com');
        this.publicOnlineItemTable.searchAllItems(this._allPublicOnlineQuery);
        this.publicOnlineItemTable.set('filteredQuery', this._filterPublicOnlineQuery);
      }
    },

    _initPublic: function(){
      this.own(on(this.portalPublicRaido, 'click', lang.hitch(this, this._onPublicRaidoClicked)));
      this.own(on(this.onlinePublicRaido, 'click', lang.hitch(this, this._onPublicRaidoClicked)));
      this._onPublicRaidoClicked();
    },

    _onPublicRaidoClicked: function(){
      if(this.portalPublicRaido.get("checked")){
        this.publicPortalItemTable.show();
        this.publicOnlineItemTable.hide();
      }
      else if(this.onlinePublicRaido.get("checked")){
        this.publicPortalItemTable.hide();
        this.publicOnlineItemTable.show();
      }
    },

    _onPublicSearch: function(text){
      text = text && lang.trim(text);
      if(text){
        //show filtered section
        this.publicPortalItemTable.showFilterItemsSection();
        this.publicOnlineItemTable.showFilterItemsSection();

        if (this.portalPublicRaido.get("checked")) {
          //text + this._itemTypeQueryString + ' AND access:public ' + this._typeKeywordQueryString
          this._filterPublicPortalQuery.q = text + ' ' + this._filterPublicPortalQuery.basicQ;
          this._filterPublicPortalQuery.start = 1;
          this.publicPortalItemTable.searchFilteredItems(this._filterPublicPortalQuery);
        } else if (this.onlinePublicRaido.get("checked")) {
          this._filterPublicOnlineQuery.q = text + ' ' + this._itemTypeQueryString +
          ' AND access:public ' + this._typeKeywordQueryString;
          this._filterPublicOnlineQuery.start = 1;
          this.publicOnlineItemTable.searchFilteredItems(this._filterPublicOnlineQuery);
        }
      }
      else{
        //show all section
        this.publicPortalItemTable.showAllItemsSection();
        this.publicOnlineItemTable.showAllItemsSection();
      }
    },

    _initPrivate: function(){
      this._resetPortalMaps();
      this.own(on(this.groupsSelect, 'change', lang.hitch(this, this._onGroupsSelectChange)));
      var portalServer = portalUrlUtils.getServerByUrl(this._getPortalUrl());
      if(portalUrlUtils.isArcGIScom(portalServer)){
        portalServer = 'ArcGIS.com';
      }
      var signIn = tokenUtils.userHaveSignInPortal(this._getPortalUrl());
      if(signIn){
        this._onSignIn();
      }
    },

    _onOrganizationSearch: function(text){
      text = text && lang.trim(text);
      if(text){
        //show filtered section
        if(this._allOrganizationQuery){
          var q = this._allOrganizationQuery.q;
          if(q){
            this._filterOrganizationQuery.q = text + ' ' + q;
            this._filterOrganizationQuery.start = 1;
            this.organizationItemTable.searchFilteredItems(this._filterOrganizationQuery);
          }
        }
      }
      else{
        //show all section
        this.organizationItemTable.showAllItemsSection();
      }
    },

    _onMyContentSearch: function(text){
      text = text && lang.trim(text);
      if(text){
        //show filtered section
        if(this._allMyContentQuery){
          var q = this._allMyContentQuery.q;
          if(q){
            this._filterMyContentQuery.q = text + ' ' + q;
            this._filterMyContentQuery.start = 1;
            this.mycontentItemTable.searchFilteredItems(this._filterMyContentQuery);
          }
        }
      }
      else{
        //show all section
        this.mycontentItemTable.showAllItemsSection();
      }
    },

    _onGroupSearch: function(text){
      text = text && lang.trim(text);
      if(text){
        //show filtered section
        if(this._allGroupQuery){
          var q = this._allGroupQuery.q;
          if(q){
            this._filterGroupQuery.q = text + ' ' + q;
            this._filterGroupQuery.start = 1;
            this.groupItemTable.searchFilteredItems(this._filterGroupQuery);
          }
        }
      }
      else{
        this.groupItemTable.showAllItemsSection();
      }
    },

    _onSignIn: function(){
      this._updateUIbySignIn();
      if(this._signIn){
        return;
      }
      this._signIn = true;
      var portalUrl = this._getPortalUrl();
      var portal = portalUtils.getPortal(portalUrl);
      portal.getUser().then(lang.hitch(this, function(user){
        if(!this.domNode){
          return;
        }
        this._resetPortalMaps();
        this._searchOrganization(user);
        this._searchMyContent(user);
        this._searchGroups(user);
      }));
    },

    _onSignOut: function(){
      this._signIn = false;
      this._resetPortalMaps();
      this._updateUIbySignIn();
    },

    _resetPortalMaps: function(){
      this.organizationItemTable.clear();
      this.mycontentItemTable.clear();
      this._resetGroupsSection();
    },

    _searchOrganization: function(user) {
      this.organizationItemTable.clear();
      var strPublicOrg = " AND (access:org OR access:public) ";
      var q = " orgid:" + user.orgId + " AND " + this._itemTypeQueryString +
      strPublicOrg + this._typeKeywordQueryString;
      var portalUrl = this._getPortalUrl();
      this._allOrganizationQuery = this._getQuery({q:q});
      this._filterOrganizationQuery = this._getQuery({q:q});
      this.organizationItemTable.set('portalUrl', portalUrl);
      this.organizationItemTable.searchAllItems(this._allOrganizationQuery);
    },

    _searchMyContent: function(user) {
      this.mycontentItemTable.clear();
      var portalUrl = this._getPortalUrl();
      var q = "owner:" + user.username + " AND " + this._itemTypeQueryString + ' ' +
      this._typeKeywordQueryString;
      this._allMyContentQuery = this._getQuery({q:q});
      this._filterMyContentQuery = this._getQuery({q:q});
      this.mycontentItemTable.set('portalUrl', portalUrl);
      this.mycontentItemTable.searchAllItems(this._allMyContentQuery);
    },

    _searchGroups: function(user){
      this._resetGroupsSection();
      html.setStyle(this.groupsSection, "display", "flex");
      var groups = user.getGroups();
      if (groups.length > 0) {
        html.setStyle(this.groupSearch.domNode, 'display', 'block');
        this.groupItemTable.show();
        html.empty(this.groupsSelect);
        for (var i = 0; i < groups.length; i++) {
          var group = groups[i];
          html.create("option", {
            value: group.id,
            innerHTML: group.title
          }, this.groupsSelect);
        }
        this._onGroupsSelectChange();
      }
      this._updateUIbyGroups(groups.length);
    },

    _resetGroupsSection: function(){
      html.setStyle(this.groupsSection, "display", "none");
      html.empty(this.groupsSelect);
      html.create("option", {
        value: 'nodata',
        innerHTML: this.nls.noneGroups
      }, this.groupsSelect);
      this.groupItemTable.clear();
      html.setStyle(this.groupSearch.domNode, 'display', 'none');
      this.groupItemTable.hide();
      this._updateUIbyGroups(0);
    },

    _updateUIbyGroups: function(groupIdsCount){
      if(groupIdsCount === 0){
        html.setStyle(this.groupsSection, 'top', '15px');
      }
      else{
        html.setStyle(this.groupsSection, 'top', '50px');
      }
    },

    _onGroupsSelectChange: function(){
      var groupId = this.groupsSelect.value;
      this.groupItemTable.clear();
      if (groupId === 'nodata') {
        html.setStyle(this.groupSearch, 'display', 'none');
        this.groupItemTable.hide();
      }
      else{
        html.setStyle(this.groupSearch, 'display', 'block');
        this.groupItemTable.show();
        var portalUrl = this._getPortalUrl();
        var q = "group:" + groupId + " AND " + this._itemTypeQueryString + ' ' +
        this._typeKeywordQueryString;
        this._allGroupQuery = this._getQuery({q:q});
        this._filterGroupQuery = this._getQuery({q:q});
        this.groupItemTable.set('portalUrl', portalUrl);
        this.groupItemTable.searchAllItems(this._allGroupQuery);
      }
    },

    _onItemTableUpdate: function(){
      this.emit("update");
    },

    _onItemDomClicked: function(itemDiv){
      var isSelected = html.hasClass(itemDiv, 'jimu-state-active');
      query('.item.jimu-state-active', this.domNode).removeClass('jimu-state-active');
      if(isSelected){
        html.addClass(itemDiv, 'jimu-state-active');
      }
      var item = this.getSelectedItem();
      if(item){
        this.emit('item-selected', item);
      }
      else{
        this.emit('none-item-selected');
      }
    },

    getSelectedItem: function(){
      var item = null;
      var itemDivs = query('.item.jimu-state-active', this.domNode);
      if(itemDivs.length > 0){
        var itemDiv = itemDivs[0];
        item = lang.mixin({}, itemDiv.item);
      }
      return item;
    }
  });
});
},
'jimu/dijit/_ItemTable':function(){
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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./templates/_ItemTable.html',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/Deferred',
  'dojo/query',
  'dojo/on',
  'jimu/utils',
  'jimu/portalUtils',
  'jimu/portalUrlUtils',
  'jimu/dijit/LoadingIndicator'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Evented,
  lang, array, html, Deferred, query, on, jimuUtils, portalUtils, portalUrlUtils, LoadingIndicator){
  /*jshint unused: false*/
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    declaredClass: "jimu.dijit.ItemTable",
    baseClass: "jimu-item-table",
    query: null,
    filteredQuery: null,
    portalUrl: null,
    hidden: false,
    nls: null,
    types: '',//required,array, filter search results,such as ["Feature Service","Map Service"]
    typeKeywords: '',//optional, array, filter search results,such as ["Web AppBuilder","Web Map"]

    //public methods:
    //getSelectedItem
    //show
    //hide
    //searchAllItems
    //searchFilteredItems
    //clear
    //clearAllItemsSection
    //clearFilteredItemsSection
    //showAllItemsSection
    //showFilterItemsSection

    //callback methods
    //onCreateItemContent(item, itemInfoDom)

    //css classes:
    //item
    //item-border
    //item-thumbnail
    //item-info
    //item-name
    //item-type-owner
    //item-date
    //item-details
    //search-none-icon
    //search-none-tip

    _defaultThumbnail:{
      "Web Mapping Application": "desktopapp.png",
      "Mobile Application": "mobileapp.png"
    },

    postMixInProperties:function(){
      this.nls = window.jimuNls.itemSelector;
    },

    postCreate: function() {
      this.inherited(arguments);
      this._initSelf();
    },

    _initSelf: function(){
      if(!(this.types && this.types.length > 0)){
        this.types = [];
      }

      this.hidden = this.hidden === true;
      if(this.hidden){
        this.hide();
      }
      if(this.portalUrl){
        this.portalUrl = portalUrlUtils.getStandardPortalUrl(this.portalUrl);
      }

      this.showAllItemsSection();
      this.searchAllItems();
    },

    show:function(){
      html.setStyle(this.domNode, 'display', 'block');
    },

    hide:function(){
      html.setStyle(this.domNode, 'display', 'none');
    },

    searchAllItems:function(newQuery){
      this.showAllItemsSection();
      if(newQuery){
        this.query = lang.mixin({}, newQuery);
        this.query.start = 1;
        this.clearAllItemsSection();
      }
      if(!this.portalUrl || !this.query){
        return;
      }
      if(this.query.start > 0){
        this.allItemsShelter.show();
        var portal = portalUtils.getPortal(this.portalUrl);
        var def = portal.queryItems(this.query);

        def.then(lang.hitch(this, function(response) {
          if(!this.domNode){
            return;
          }
          this.allItemsShelter.hide();
          this.query.start = response.nextStart;
          this._createItems(response, this.allItemTbody);
        }), lang.hitch(this, function(err) {
          console.error(err);
          if(!this.domNode){
            return;
          }
          this.allItemsShelter.hide();
        }));
      }
    },

    searchFilteredItems:function(/*optional*/ newFilteredQuery){
      //if newFilteredQuery is not null or undefined, it means the dijit will search a new query
      //otherwise it means this method is called when scroll to bottom of this.filteredItemsTableDiv
      this.showFilterItemsSection();

      if(newFilteredQuery){
        this.filteredQuery = lang.clone(newFilteredQuery);
        this.filteredQuery.start = 1;
        this.clearFilteredItemsSection();
      }

      if(!this.portalUrl || !this.filteredQuery){
        return;
      }

      if(this.filteredQuery.start > 0){
        this.filteredItemShelter.show();
        var portal = portalUtils.getPortal(this.portalUrl);
        var def = portal.queryItems(this.filteredQuery);

        def.then(lang.hitch(this, function(response){
          if(!this.domNode){
            return;
          }
          this.showFilterItemsSection();
          if(newFilteredQuery){
            this.clearFilteredItemsSection();
          }
          this.filteredQuery.start = response.nextStart;
          this._createItems(response, this.filteredItemsTbody);
          this._filterItemCallback();
        }), lang.hitch(this, function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
          this._filterItemCallback();
        }));
      }
    },

    _filterItemCallback: function(){
      this.filteredItemShelter.hide();
      var count = this._getItemCount(this.filteredItemsTbody);
      if(count > 0){
        html.setStyle(this.filteredItemsTableDiv, 'display', 'block');
        html.setStyle(this.searchNoneTipSection, 'display', 'none');
      }else{
        html.setStyle(this.filteredItemsTableDiv, 'display', 'none');
        html.setStyle(this.searchNoneTipSection, 'display', 'block');
      }
    },

    clear:function(){
      this.clearAllItemsSection();
      this.clearFilteredItemsSection();
    },

    clearAllItemsSection:function(){
      html.empty(this.allItemTbody);
    },

    clearFilteredItemsSection:function(){
      html.empty(this.filteredItemsTbody);
    },

    showAllItemsSection:function(){
      html.setStyle(this.allItemsSection, 'display', 'block');
      html.setStyle(this.filteredItemsSection, 'display', 'none');
    },

    showFilterItemsSection:function(){
      html.setStyle(this.allItemsSection, 'display', 'none');
      html.setStyle(this.filteredItemsSection, 'display', 'block');
      html.setStyle(this.filteredItemsTableDiv, 'display', 'block');
      html.setStyle(this.searchNoneTipSection, 'display', 'none');
    },

    _onAllItemsSectionScroll:function(){
      if(this._isScrollToBottom(this.allItemsTableDiv)){
        this.searchAllItems();
      }
    },

    _onFilteredItemsSectionScroll:function(){
      if(this._isScrollToBottom(this.filteredItemsTableDiv)){
        this.searchFilteredItems();
      }
    },

    _isScrollToBottom:function(div){
      return jimuUtils.isScrollToBottom(div);
    },

    _createItems: function(response, tbody) {
      var results = response.results;
      var typesLowerCase = array.map(this.types, lang.hitch(this, function(type){
        return type.toLowerCase();
      }));
      var items = array.filter(results, lang.hitch(this, function(item) {
        var type = (item.type && item.type.toLowerCase()) || '';
        return array.indexOf(typesLowerCase, type) >= 0;
      }));
      var countPerRow = 2;
      if (items.length === 0) {
        return;
      }
      var itemsHash = {}, itemDiv;
      var emptyTds = query('td.empty', tbody);
      var i;
      if(emptyTds.length > 0){
        var usedEmptyTdCount = Math.min(items.length, emptyTds.length);
        var ws = items.splice(0, usedEmptyTdCount);
        for(i = 0; i < usedEmptyTdCount; i++){
          var emptyTd = emptyTds[i];
          itemDiv = this._createItem(ws[i]);
          itemsHash[itemDiv.item.id] = itemDiv;
          html.place(itemDiv, emptyTd);
          html.removeClass(emptyTd, 'empty');
        }
      }

      if(items.length === 0){
        return;
      }

      var trCount = Math.ceil(items.length / countPerRow);
      for (i = 0; i < trCount; i++) {
        var trStr = "<tr><td></td><td></td></tr>";
        var trDom = html.toDom(trStr);
        html.place(trDom, tbody);
        var tds = query('td', trDom);
        for (var j = 0; j < tds.length; j++) {
          var td = tds[j];
          var item = items[countPerRow * i + j];
          if(item){
            itemDiv = this._createItem(item);
            itemsHash[itemDiv.item.id] = itemDiv;
            html.place(itemDiv, td);
          }
          else{
            html.addClass(td, 'empty');
          }
        }
      }
      this.emit("update");
    },

    _getItemCount:function(tbody){
      return query('.item', tbody).length;
    },

    _createItem: function(item){
      var str = '<div class="item">' +
        '<div class="item-border"></div>' +
        '<div class="item-thumbnail jimu-auto-vertical">' +
          '<div class="none-thumbnail-tip jimu-auto-vertical-content"></div>' +
        '</div>' +
        '<div class="item-info">' +
          '<div class="item-name"></div>' +
          '<div class="item-type-owner"></div>' +
          '<div class="item-date"></div>' +
          '<a class="item-details" target="_blank"></a>' +
        '</div>' +
      '</div>';
      var itemDiv = html.toDom(str);
      itemDiv.item = item;
      var itemThumbnail = query('.item-thumbnail', itemDiv)[0];
      var itemName = query('.item-name', itemDiv)[0];
      var itemTypeOwner = query('.item-type-owner', itemDiv)[0];
      var itemDate = query('.item-date', itemDiv)[0];
      var itemDetails = query('.item-details', itemDiv)[0];
      var noneThumbnailTip = query('.none-thumbnail-tip', itemDiv)[0];
      if(!item.thumbnailUrl){
        var defaultThumbnail = this._defaultThumbnail[item.type];
        if(defaultThumbnail){
          item.thumbnailUrl = require.toUrl('jimu') + '/images/' + defaultThumbnail;
        }
      }
      if(item.thumbnailUrl){
        html.setStyle(itemThumbnail, 'backgroundImage', "url(" + item.thumbnailUrl + ")");
      }
      else{
        noneThumbnailTip.innerHTML = this.nls.noneThumbnail;
      }

      if(typeof this.onCreateItemContent === 'function'){
        var itemInfoDom = query('.item-info', itemDiv)[0];
        this.onCreateItemContent(item, itemInfoDom);
      }else{
        itemName.innerHTML = item.title;
        itemName.title = itemName.innerHTML;
        itemTypeOwner.innerHTML = item.type + ' by ' + item.owner;
        itemTypeOwner.title = itemTypeOwner.innerHTML;
        var d = new Date();
        d.setTime(item.modified);
        itemDate.innerHTML = d.toLocaleString();
        itemDate.title = itemDate.innerHTML;
        itemDetails.innerHTML = this.nls.moreDetails;
        itemDetails.href = item.detailsPageUrl || "#";
      }

      return itemDiv;
    },

    _onItemsTableClicked: function(event){
      var target = event.target || event.srcElement;
      var itemDiv = null;
      if(html.hasClass(target, 'item-thumbnail')){
        itemDiv = target.parentNode;
      }
      else if(html.hasClass(target, 'none-thumbnail-tip')){
        itemDiv = target.parentNode.parentNode;
      }

      if(!itemDiv){
        return;
      }

      var isSelected = html.hasClass(itemDiv, 'jimu-state-active');
      query('.item.jimu-state-active', this.domNode).removeClass('jimu-state-active');
      if (isSelected) {
        html.removeClass(itemDiv, 'jimu-state-active');
      } else {
        html.addClass(itemDiv, 'jimu-state-active');
      }
      this.emit('item-dom-clicked', itemDiv);
    },

    getSelectedItem: function(){
      var item = null;
      var itemDivs = query('.item.jimu-state-active', this.domNode);
      if(itemDivs.length > 0){
        var itemDiv = itemDivs[0];
        item = lang.mixin({}, itemDiv.item);
      }
      return item;
    }
  });
});
},
'dijit/form/RadioButton':function(){
define([
	"dojo/_base/declare", // declare
	"./CheckBox",
	"./_RadioButtonMixin"
], function(declare, CheckBox, _RadioButtonMixin){

	// module:
	//		dijit/form/RadioButton

	return declare("dijit.form.RadioButton", [CheckBox, _RadioButtonMixin], {
		// summary:
		//		Same as an HTML radio, but with fancy styling.

		baseClass: "dijitRadio"
	});
});

},
'dijit/form/_RadioButtonMixin':function(){
define([
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/_base/lang", // lang.hitch
	"dojo/query!css2", // query
	"../registry"    // registry.getEnclosingWidget
], function(array, declare, domAttr, lang, query, registry){

	// module:
	//		dijit/form/_RadioButtonMixin

	return declare("dijit.form._RadioButtonMixin", null, {
		// summary:
		//		Mixin to provide widget functionality for an HTML radio button

		// type: [private] String
		//		type attribute on `<input>` node.
		//		Users should not change this value.
		type: "radio",

		_getRelatedWidgets: function(){
			// Private function needed to help iterate over all radio buttons in a group.
			var ary = [];
			query("input[type=radio]", this.focusNode.form || this.ownerDocument).forEach(// can't use name= since query doesn't support [] in the name
				lang.hitch(this, function(inputNode){
					if(inputNode.name == this.name && inputNode.form == this.focusNode.form){
						var widget = registry.getEnclosingWidget(inputNode);
						if(widget){
							ary.push(widget);
						}
					}
				})
			);
			return ary;
		},

		_setCheckedAttr: function(/*Boolean*/ value){
			// If I am being checked then have to deselect currently checked radio button
			this.inherited(arguments);
			if(!this._created){
				return;
			}
			if(value){
				array.forEach(this._getRelatedWidgets(), lang.hitch(this, function(widget){
					if(widget != this && widget.checked){
						widget.set('checked', false);
					}
				}));
			}
		},

		_getSubmitValue: function(/*String*/ value){
			return value == null ? "on" : value;
		},

		_onClick: function(/*Event*/ e){
			if(this.checked || this.disabled){ // nothing to do
				e.stopPropagation();
				e.preventDefault();
				return false;
			}

			if(this.readOnly){ // ignored by some browsers so we have to resync the DOM elements with widget values
				e.stopPropagation();
				e.preventDefault();
				array.forEach(this._getRelatedWidgets(), lang.hitch(this, function(widget){
					domAttr.set(this.focusNode || this.domNode, 'checked', widget.checked);
				}));
				return false;
			}

			// RadioButton has some unique logic since it must enforce only a single button being checked at once
			// For this reason the "_onClick" method does not call this.inherited

			var canceled = false;
			var previouslyCheckedButton;

			array.some(this._getRelatedWidgets(), function(radioButton){
				if(radioButton.checked){
					previouslyCheckedButton = radioButton;
					return true;
				}
				return false;
			});

			// We want to set the post-click values correctly for any event handlers, but since
			// the event handlers could revert them, we don't want to fully update the widget state
			// yet and trigger notifications
			this.checked = true;
			previouslyCheckedButton && (previouslyCheckedButton.checked = false);

			// Call event handlers
			// If event handler prevents it, the clicked radio button will not be checked
			if(this.onClick(e) === false || e.defaultPrevented){
				canceled = true;
			}

			// Reset internal state to how it was before the click
			this.checked = false;
			previouslyCheckedButton && (previouslyCheckedButton.checked = true);

			if(canceled){
				e.preventDefault();
			}else{
				this.set('checked', true);
			}

			return !canceled;
		}
	});
});

},
'jimu/dijit/FeaturelayerServiceBrowser':function(){
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
  './_BasicServiceBrowser',
  'dojo/_base/lang',
  'dojo/_base/array',
  'jimu/serviceBrowserRuleUtils'
],
function(declare, _BasicServiceBrowser, lang, array, serviceBrowserRuleUtils) {
  return declare([_BasicServiceBrowser], {
    baseClass: 'jimu-featurelayer-service-browser',
    declaredClass: 'jimu.dijit.FeaturelayerServiceBrowser',

    //options:
    url: '',
    multiple: false,
    types: null,//available values:point,polyline,polygon
    isSupportQuery: true,//if true, only filter queryable feature layer

    //public methods:
    //setUrl
    //getSelectedItems return [{name,url,definition}]

    //test url:
    //base url: http://sampleserver1.arcgisonline.com/ArcGIS/rest/services
    //folder url:  http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics
    //service url: http://tryitlive.arcgis.com/arcgis/rest/services/GeneralPurpose/MapServer
    //group layer url: http://tryitlive.arcgis.com/arcgis/rest/services/GeneralPurpose/MapServer/0
    //group layer url: http://tryitlive.arcgis.com/arcgis/rest/services/GeneralPurpose/MapServer/1
    //layer url: http://tryitlive.arcgis.com/arcgis/rest/services/GeneralPurpose/MapServer/2

    postMixInProperties:function(){
      this.inherited(arguments);
      this.rule = serviceBrowserRuleUtils.getFeaturelayerServiceBrowserRule(this.types,
                                                                            this.isSupportQuery);
    },

    getSelectedItems: function(){
      var items = this.inherited(arguments);
      items = array.map(items, lang.hitch(this, function(item){
        return {
          name: item.name,
          url: item.url,
          definition: item.definition
        };
      }));
      return items;
    }

  });
});
},
'jimu/dijit/_BasicServiceBrowser':function(){
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
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/store/Memory',
  'dojo/store/Observable',
  'dijit/tree/ObjectStoreModel',
  'jimu/utils',
  'jimu/dijit/_Tree',
  'jimu/dijit/LoadingIndicator'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, lang, html,
 array, Deferred, all, Memory, Observable, ObjectStoreModel, jimuUtils, Tree) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString:'<div style="width:100%;"><div data-dojo-attach-point="shelter" ' +
    ' data-dojo-type="jimu/dijit/LoadingIndicator" data-dojo-props="hidden:true"></div></div>',
    _store: null,
    _id: 0,
    _currentUrl: '',
    _treeClass: 'service-browser-tree',
    _def: null,

    //options:
    url:'',
    multiple: false,
    rule: null,//create rule by serviceBrowserRuleUtils

    //test urls
    //https://gis.lmi.is/arcgis/rest/services
    //https://gis.lmi.is/arcgis/rest/services/GP_service
    //https://gis.lmi.is/arcgis/rest/services/GP_service/geocode_thjonusta_single/GeocodeServer
    //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services

    //public methods:
    //setUrl
    //getSelectedItems
    //reset

    //events:
    //tree-click
    //tree-open


    //item consist of {name,type,url,parent,isLeaf}

    postMixInProperties:function(){
      this.nls = window.jimuNls.basicServiceBrowser;
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-basic-service-browser');
      this.multiple = !!this.multiple;
      this._createTree();
      if(this.url && typeof this.url === 'string'){
        this.setUrl(this.url);
      }
    },

    reset: function(){
      this.url = '';
      this._clear();
    },

    getSelectedItems: function(){
      var items = this.tree.getSelectedItems();
      return items;//lang.clone(items);
    },

    setUrl:function(url){
      if(this._def){
        if(!this._def.isFulfilled()){
          this._def.cancel();
        }
        this._def = null;
      }
      this._def = new Deferred();

      var validUrl = url && typeof url === 'string' && url.replace(/\/*$/g, '');
      if(!validUrl){
        this._def.reject();
      }
      url = url.replace(/\/*$/g, '');

      var theUrl = lang.trim(url);
      var pattern1 = /^http(s?):\/\//gi;
      var matchResult = theUrl.match(pattern1);
      if(!(matchResult && matchResult.length > 0)){
        theUrl = 'http://' + theUrl;
      }

      var pattern2 = /\/rest\/services/i;
      if(theUrl.search(pattern2) <= 0){
        this._def.reject();
        return;
      }

      /*if(this._currentUrl === theUrl){
        return;
      }*/

      this._clear();
      this._currentUrl = theUrl;
      if(!this._currentUrl){
        this._def.reject();
        return;
      }
      var root = this._getRootItem();
      var requestDef;
      if(jimuUtils.isStringEndWith(this._currentUrl, 'rest/services')){
        //rest/services
        //http://sampleserver6.arcgisonline.com/arcgis/rest/services
        var baseUrl = this._currentUrl;
        requestDef = this._searchBaseServiceUrl(baseUrl, root);
      }
      else if(!this._isUrlContainsServiceType(this._currentUrl)){
        //folder
        //http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation
        var folderUrl = this._currentUrl;
        requestDef = this._searchFolderServiceUrl(folderUrl, root);
      }
      else{
        //service url contains ServiceType, such as 'MapServer','FeatureServer'...
        //http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/WorldElevations/MapServer
        var serviceUrl = this._currentUrl;
        requestDef = this._searchServiceUrl(serviceUrl, root);
      }

      this.shelter.show();

      requestDef.then(lang.hitch(this, function(response){
        if(this.domNode){
          this.shelter.hide();
        }
        var tns = this.tree.getAllLeafTreeNodeWidgets();
        if(tns.length === 1){
          var tn = tns[0];
          tn.select();
        }
        this._def.resolve(response);
      }), lang.hitch(this, function(err){
        // var netErr = err && err.errorCode && err.errorCode === 'NETWORK_ERROR';
        // if(netErr){
        //   this._showRequestError();
        // }
        if(this.domNode){
          this.shelter.hide();
        }
        this._showRequestError();
        this._def.reject(err);
      }));

      return this._def;
    },

    _getItem: function(url){
      return this.rule.getItem(url);
    },

    _getSubItemUrls: function(url){
      return this.rule.getSubItemUrls(url);
    },

    //resolve [{name,type,url}]
    _getSubItems: function(parentUrl){
      var def = new Deferred();
      this._getSubItemUrls(parentUrl).then(lang.hitch(this, function(urls){
        var defs = array.map(urls, lang.hitch(this, function(url){
          return this._getItem(url);
        }));
        all(defs).then(lang.hitch(this, function(items){
          var result = array.filter(items, lang.hitch(this, function(item){
            //item maybe null because the url doesn't meet needs
            return item && typeof item === 'object';
          }));
          def.resolve(result);
        }), lang.hitch(this, function(err){
          def.reject(err);
        }));
      }), lang.hitch(this, function(err){
        def.reject(err);
      }));
      return def;
    },

    _selectFirstLeafTreeNodeWidget: function(){
      var tns = this.tree.getAllLeafTreeNodeWidgets();
      if (tns.length === 1) {
        var tn = tns[0];
        tn.select();
      }
    },

    isLeafItem: function(item){
      return this.rule.leafTypes.indexOf(item.type) >= 0;
    },

    isServiceTypeSupported: function(type){
      return this.rule.isServiceTypeSupported(type);
    },

    _getStringEndWith:function(str, endStr){
      var result = '';
      var index = str.indexOf(endStr);
      if(index >= 0){
        var a = index + endStr.length;
        result = str.slice(0, a);
      }
      return result;
    },

    _isUrlContainsServiceType: function(url){
      return this.rule.isUrlContainsServiceType(url);
    },

    _getBaseServiceUrl:function(){
      return this._getStringEndWith(this._currentUrl, 'rest/services');
    },

    _getServiceName:function(serviceName){
      var result = '';
      var splits = serviceName.split('/');
      result = splits[splits.length - 1];
      return result;
    },

    _searchBaseServiceUrl:function(baseUrl, root){
      //url is end with 'rest/services'
      // this.shelter.show();
      var resultDef = new Deferred();
      this._getRestInfo(baseUrl).then(lang.hitch(this, function(response){
        if(!this.domNode){
          return;
        }
        var defs = [];

        //handle folders
        array.map(response.folders, lang.hitch(this, function(folderName){
          var folderItem = {
            name: folderName,
            type:'folder',
            url: baseUrl + "/" + folderName,
            parent: root.id
          };

          //add folder
          this._addItem(folderItem);

          //traverse services under the folder
          var def = new Deferred();
          this._doSearchFolderServiceUrl(folderItem.url, folderItem.id).then(lang.hitch(this,
            function(items){
            if(items.length > 0){
              //add service item under the folder
              array.forEach(items, lang.hitch(this, function(item){
                item.parent = folderItem.id;
                this._addItem(item);
              }));
            }else{
              //if there are no proper services under folder, remove the folder
              this._removeItem(folderItem.id);
            }
            def.resolve();
          }), lang.hitch(this, function(err){
            def.reject(err);
          }));
          defs.push(def);
          return def;
        }));

        //handle services
        array.forEach(response.services, lang.hitch(this, function(service){
          if(this.isServiceTypeSupported(service.type)){
            var serviceUrl = baseUrl + '/' + service.name + '/' + service.type;
            var def = new Deferred();
            this.rule.getItem(serviceUrl).then(lang.hitch(this, function(item){
              if(item){
                item.parent = root.id;
                this._addItem(item);
              }
              def.resolve();
            }), lang.hitch(this, function(err){
              console.error(err);
              def.reject(err);
            }));
            defs.push(def);
          }
        }));

        all(defs).then(lang.hitch(this, function(){
          if(!this.domNode){
            return;
          }
          // this.shelter.hide();
          resultDef.resolve();
        }), lang.hitch(this, function(err){
          console.error(err);
          if(!this.domNode){
            return;
          }
          // this.shelter.hide();
          resultDef.reject(err);
        }));
      }), lang.hitch(this, function(err){
        console.error(err);
        if(!this.domNode){
          return;
        }
        // this.shelter.hide();
        var errObj = {
          errorCode: 'NETWORK_ERROR',
          error: err
        };
        resultDef.reject(errObj);
      }));
      return resultDef;
    },

    _searchFolderServiceUrl:function(folderUrl, parent){
      //url is end with folder name
      //http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics
      //http://pslgis.cityofpsl.com/arcgis/rest/services/aerials/
      var resultDef = new Deferred();
      // this.shelter.show();
      this._doSearchFolderServiceUrl(folderUrl, parent).then(lang.hitch(this, function(items){
        if(!this.domNode){
          return;
        }
        array.forEach(items, lang.hitch(this, function(item){
          item.parent = parent.id;
          this._addItem(item);
        }));
        // this.shelter.hide();
        resultDef.resolve();
      }), lang.hitch(this, function(err){
        console.error(err);
        if(!this.domNode){
          return;
        }
        // this.shelter.hide();
        var errObj = {
          errorCode: 'NETWORK_ERROR',
          error: err
        };
        resultDef.reject(errObj);
      }));
      return resultDef;
    },

    //resolve items
    _doSearchFolderServiceUrl: function(folderUrl){
      //url is end with folder name
      var resultDef = new Deferred();
      var baseUrl = this._getBaseServiceUrl();
      this._getRestInfo(folderUrl).then(lang.hitch(this, function(folderResponse){
        var services = folderResponse.services;
        var defs = [];
        if(services && services.length > 0){
          array.forEach(services, lang.hitch(this, function(service){
            if(this.isServiceTypeSupported(service.type)){
              //service.name:Demographics/ESRI_Census_USA
              var serviceUrl = baseUrl + '/' + service.name + '/' + service.type;
              var defItem = this.rule.getItem(serviceUrl);
              defs.push(defItem);
            }
          }));
        }
        all(defs).then(lang.hitch(this, function(items){
          var resultItems = array.filter(items, lang.hitch(this, function(item){
            return item;
          }));
          resultDef.resolve(resultItems);
        }), lang.hitch(this, function(err){
          console.error(err);
          resultDef.reject(err);
        }));
      }), lang.hitch(this, function(err){
        console.error(err);
        resultDef.reject(err);
      }));
      return resultDef;
    },

    _searchServiceUrl:function(serviceUrl, parent){
      //serviceUrl contains 'MapServer' or 'FeatureServer' ...
      //http://servername/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer
      //http://servername/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/0
      var resultDef = new Deferred();
      this._getSubItems(serviceUrl).then(lang.hitch(this, function(items) {
        if (items && items.length > 0) {
          array.forEach(items, lang.hitch(this, function(item) {
            item.parent = parent.id;
            this._addItem(item);
          }));
          resultDef.resolve();
        } else {
          this._getItem(serviceUrl).then(lang.hitch(this, function(item) {
            //if serviceUrl doesn't pass rule, item will be null
            if(item){
              item.parent = parent.id;
              this._addItem(item);
            }
            resultDef.resolve();
          }), lang.hitch(this, function(err) {
            resultDef.reject(err);
          }));
        }
      }), lang.hitch(this, function(err) {
        resultDef.reject(err);
      }));

      return resultDef;
    },

    _getRestInfo:function(url){
      var def = new Deferred();
      this.rule.getRestInfo(url).then(lang.hitch(this, function(response){
        if(!this.domNode){
          return;
        }
        def.resolve(response);
      }), lang.hitch(this, function(err){
        if(!this.domNode){
          return;
        }
        def.reject(err);
      }));
      return def;
    },

    _clear:function(){
      var items = this._store.query({parent:'root'});
      array.forEach(items, lang.hitch(this, function(item){
        if(item && item.id !== 'root'){
          this._store.remove(item.id);
        }
      }));
    },

    _showRequestError:function(){
      //this.nls.unableConnectTo + " " + this._currentUrl
      // new Message({
      //   message: this.nls.invalidUrlTip
      // });
      this.emit('error', this.nls.invalidUrlTip);
    },

    //item:{name,type,url,parent}
    //type:root,folder,[MapServer,FeatureServer,...]
    _addItem:function(item){
      this._id++;
      item.id = this._id.toString();
      this._store.add(item);
      return item;
    },

    _removeItem: function(itemId){
      this._store.remove(itemId);
    },

    _getRootItem:function(){
      return { id: 'root', name:'Services Root', type:'root'};
    },

    _createTree:function(){
      var rootItem = this._getRootItem();
      var myMemory = new Memory({
        data: [rootItem],
        getChildren: function(object){
          return this.query({parent: object.id});
        }
      });

      // Wrap the store in Observable so that updates to the store are reflected to the Tree
      this._store = new Observable(myMemory);

      var myModel = new ObjectStoreModel({
        store: this._store,
        query: { id: "root" },
        mayHaveChildren: lang.hitch(this, this._mayHaveChildren)
      });

      this.tree = new Tree({
        multiple: this.multiple,
        model: myModel,
        showRoot: false,
        style:{
          width:"100%"
        },

        isLeafItem: lang.hitch(this, this.isLeafItem),

        onOpen: lang.hitch(this, function(item, node){
          this._onTreeOpen(item, node);
          this.emit('tree-open', item, node);
        }),

        onClick: lang.hitch(this, function(item, node, evt){
          this._onTreeClick(item, node, evt);
          this.emit('tree-click', item, node, evt);
        }),

        getIconStyle:lang.hitch(this, function(item, opened){
          var icon = null;
          if (!item) {
            return null;
          }
          var a = {
            width: "20px",
            height: "20px",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundImage: ''
          };
          var baseUrl = window.location.protocol + "//" + window.location.host +
          require.toUrl("jimu");
          var imageName = this._getIconImageName(item, opened);

          if(!imageName){
            if (item.type === 'folder') {
              if (opened) {
                imageName = 'folder_open_default.png';
              } else {
                imageName = 'folder_close_default.png';
              }
            }
            else if(this.isServiceTypeSupported(item.type)){
              if (opened) {
                imageName = 'folder_open_default.png';
              } else {
                imageName = 'folder_close_default.png';
              }
            }
          }

          if(imageName){
            a.backgroundImage = "url(" + baseUrl + "/css/images/" + imageName + ")";
            icon = a;
          }
          return icon;
        })
      });
      html.addClass(this.tree.domNode, this._treeClass);
      // this.own(on(this.tree,'item-select', lang.hitch(this, function(args){
      //   //{item,treeNode}
      //   this.emit('item-select', args);
      // })));
      // this.own(on(this.tree,'item-unselect', lang.hitch(this, function(args){
      //   //{item,treeNode}
      //   this.emit('item-unselect', args);
      // })));
      this.tree.placeAt(this.domNode);
    },

    _getIconImageName: function(item, opened){
      var imageName = "";
      if(typeof this.rule.getIconImageName === 'function'){
        imageName = this.rule.getIconImageName(item, opened);
      }
      return imageName;
    },

    _mayHaveChildren:function(item){
      if(item.type === 'root'){
        return true;
      }else{
        return !this.isLeafItem(item);
      }
    },

    _onTreeOpen:function(item, node){
      /*jshint unused: false*/
      if(item.id === 'root'){
        return;
      }
      var children = this._store.query({parent:item.id});
      if(children.length > 0){
        return;
      }
      if(item.checking || item.checked){
        return;
      }

      item.checking = true;
      this._getSubItems(item.url).then(lang.hitch(this, function(childrenItems){
        array.forEach(childrenItems, lang.hitch(this, function(childItem){
          childItem.parent = item.id;
          this._addItem(childItem);
        }));
        item.checking = false;
        item.checked = true;
      }), lang.hitch(this, function(err){
        console.error(err);
        item.checking = false;
        item.checked = true;
      }));
    },

    _onTreeClick:function(item, node, evt){/*jshint unused: false*/},

    destroy:function(){
      if(this.shelter){
        this.shelter.destroy();
        this.shelter = null;
      }
      this.inherited(arguments);
    }

  });
});
},
'jimu/serviceBrowserRuleUtils':function(){
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
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/Deferred',
  'jimu/utils',
  'jimu/ServiceBrowserRule'
],
function(lang, array, Deferred, jimuUtils, ServiceBrowserRule) {

  var mo = {};

  //combine multiple rules into one rule
  mo.combineRules = function(rules){
    var allRule = new ServiceBrowserRule();
    //override leafTypes and serviceTypes
    array.forEach(rules, function(rule){
      //iterator for leafTypes
      array.forEach(rule.leafTypes, function(leafType){
        if(allRule.leafTypes.indexOf(leafType) < 0){
          allRule.leafTypes.push(leafType);
        }
      });

      //iterator for serviceTypes
      array.forEach(rule.serviceTypes, function(serviceType){
        if(allRule.serviceTypes.indexOf(serviceType) < 0){
          allRule.serviceTypes.push(serviceType);
        }
      });
    });

    allRule.getMatchedRule = function(url){
      var matchedRule = null;
      array.some(rules, function(rule){
        if(rule.isUrlContainsServiceType(url)){
          matchedRule = rule;
          return true;
        }else{
          return false;
        }
      });
      return matchedRule;
    };

    //override getItem method
    allRule.getItem = function(url){
      var result = null;
      var matchedRule = allRule.getMatchedRule(url);
      if(matchedRule){
        result = matchedRule.getItem(url);
      }else{
        result = allRule.defaultGetItem(url);
      }
      return result;
    };

    //override getSubItemUrls method
    allRule.getSubItemUrls = function(url){
      var result = null;
      var matchedRule = allRule.getMatchedRule(url);
      if(matchedRule){
        result = matchedRule.getSubItemUrls(url);
      }else{
        result = allRule.defaultGetSubItemUrls(url);
      }
      return result;
    };

    allRule.getIconImageName = function(item, opened){
      var imageName = '';
      if(item.url){
        var matchedRule = allRule.getMatchedRule(item.url);
        if(matchedRule && typeof matchedRule.getIconImageName === 'function'){
          imageName = matchedRule.getIconImageName(item, opened);
        }
      }
      return imageName;
    };

    return allRule;
  };

  mo.getFeaturelayerServiceBrowserRule = function(_types, isSupportQuery, isSupportTable){
    //init types
    var types = lang.clone(_types);
    var allTypes = ['point', 'polyline', 'polygon'];
    if (lang.isArrayLike(types) && types.length > 0) {
      types = array.filter(types, function(type) {
        return allTypes.indexOf(type) >= 0;
      });
      if (types.length === 0) {
        types = allTypes;
      }
    } else {
      types = allTypes;
    }

    return mo._getFeaturelayerServiceBrowserRule(types, isSupportQuery, isSupportTable);
  };

  mo._getFeaturelayerServiceBrowserRule = function(types, shouldSupportQuery, shouldSupportTable){
    var rule = new ServiceBrowserRule({
      types: types,
      leafTypes: ['Feature Layer', 'Table'],
      serviceTypes: ['MapServer', 'FeatureServer'],
      _groupLayerType: 'Group Layer',
      _featureLayerType: 'Feature Layer',
      _tableType: 'Table',

      //override
      getItem: function(url){
        var  def = new Deferred();
        if(this.isUrlEndWithServiceType(url, this.serviceTypes)){
          //http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer
          def = this.defaultGetItem(url);
        }else{
          //http://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0
          this.getRestInfo(url).then(lang.hitch(this, function(layerDefinition){
            var item = this._getItemByLayerDefinition(url, layerDefinition);
            def.resolve(item);
          }), lang.hitch(this, function(err){
            def.reject(err);
          }));
        }
        return def;
      },

      //override
      getSubItemUrls: function(url){
        var def = new Deferred();
        if(this.isUrlEndWithServiceType(url)){
          def = this._getSubUrlsByServiceUrl(url);
        }else{
          def = this._getSubUrlsByGroupUrl(url);
        }
        return def;
      },

      //override
      getIconImageName: function(item, opened) {
        var imageName = '';
        if (item.type === 'MapServer' || item.type === 'FeatureServer') {
          if (opened) {
            imageName = 'mapserver_open.png';
          } else {
            imageName = 'mapserver_close.png';
          }
        } else if (item.type === this._groupLayerType) {
          if (opened) {
            imageName = 'group_layer2.png';
          } else {
            imageName = 'group_layer1.png';
          }
        } else if (item.type === this._featureLayerType) {
          var esriType = item.definition && item.definition.geometryType;
          var geoType = jimuUtils.getTypeByGeometryType(esriType);
          if (geoType === 'point') {
            imageName = 'point_layer1.png';
          } else if (geoType === 'polyline') {
            imageName = 'line_layer1.png';
          } else if (geoType === 'polygon') {
            imageName = 'polygon_layer1.png';
          }
        } else if(item.type === this._tableType){
          imageName = "table.png";
        } else if (item.type === 'root') {
          if (this._currentUrl) {
            var isMapFeatureServer = array.some(this.serviceTypes,
              lang.hitch(this, function(serviceType) {
                return jimuUtils.isStringEndWith(this._currentUrl, '/' + serviceType);
              }));

            if (isMapFeatureServer) {
              if (opened) {
                imageName = 'mapserver_open.png';
              } else {
                imageName = 'mapserver_close.png';
              }
            }
          }
        }

        return imageName;
      },

      _getSubUrlsByServiceUrl: function(serviceUrl) {
        var def = new Deferred();
        this.getRestInfo(serviceUrl).then(lang.hitch(this, function(serviceMeta) {
          var urls = [];
          array.forEach(serviceMeta.layers, lang.hitch(this, function(layerInfo) {
            var hasParent = layerInfo.parentLayerId >= 0;
            if (!hasParent) {
              var url = serviceUrl + '/' + layerInfo.id;
              urls.push(url);
            }
          }));
          if (shouldSupportTable) {
            array.forEach(serviceMeta.tables, lang.hitch(this, function(layerInfo) {
              var hasParent = layerInfo.parentLayerId >= 0;
              if (!hasParent) {
                var url = serviceUrl + '/' + layerInfo.id;
                urls.push(url);
              }
            }));
          }
          def.resolve(urls);
        }), lang.hitch(this, function(err) {
          def.reject(err);
        }));
        return def;
      },

      _getSubUrlsByGroupUrl: function(groupLayerUrl) {
        var def = new Deferred();
        this.getRestInfo(groupLayerUrl).then(lang.hitch(this, function(layerDefinition) {
          var urls = [];
          if (layerDefinition.type === this._groupLayerType) {
            var serviceUrl = this._getServiceUrlByLayerUrl(groupLayerUrl);
            var subLayers = layerDefinition.subLayers || [];
            urls = array.map(subLayers, lang.hitch(this, function(subLayer) {
              return serviceUrl + '/' + subLayer.id;
            }));
          }
          def.resolve(urls);
        }), lang.hitch(this, function(err) {
          def.reject(err);
        }));
        return def;
      },

      _getItemByLayerDefinition: function(layerUrl, layerDefinition) {
        //layerUrl maybe a group url or feature layer url
        var item = null;
        var type = layerDefinition.type;
        if (type === this._groupLayerType) {
          item = {
            name: layerDefinition.name,
            type: type,
            url: layerUrl,
            definition: layerDefinition
          };
        } else if (type === this._featureLayerType || type === this._tableType) {
          //check geometry type
          var isPassGeoTypeCheck = false;

          if(type === this._featureLayerType){
            //it is a feature layer
            isPassGeoTypeCheck = this._validateEsriGeometryType(layerDefinition.geometryType);
          }else if(type === this._tableType){
            //it is a table and let the table pass the geometryType check
            isPassGeoTypeCheck = true;
          }

          if(isPassGeoTypeCheck){
            var isPassQueryCheck = false;

            if(shouldSupportQuery){
              //check query/data capability
              var capabilities = layerDefinition.capabilities;
              isPassQueryCheck = jimuUtils.isFeaturelayerUrlSupportQuery(layerUrl, capabilities);
            }else{
              isPassQueryCheck = true;
            }

            if(isPassQueryCheck){
              item = {
                name: layerDefinition.name,
                type: type,
                url: layerUrl,
                definition: layerDefinition
              };
            }
          }
        }
        return item;
      },

      _validateEsriGeometryType: function(esriType){
        var type = jimuUtils.getTypeByGeometryType(esriType);
        return this.types.indexOf(type) >= 0;
      },

      _getServiceUrlByLayerUrl: function(layerUrl) {
        var serviceUrl = '';
        for (var i = 0; i < this.serviceTypes.length; i++) {
          var serviceType = this.serviceTypes[i].toLowerCase();
          var lastIndex = layerUrl.toLowerCase().lastIndexOf('/' + serviceType + '/');
          if (lastIndex >= 0) {
            serviceUrl = layerUrl.slice(0, lastIndex + serviceType.length + 1);
            return serviceUrl;
          }
        }
        return serviceUrl;
      }
    });

    return rule;
  };

  mo.getGeocodeServiceBrowserRule = function(){
    var rule = new ServiceBrowserRule({
      leafTypes: ['GeocodeServer'],
      serviceTypes:['GeocodeServer']
    });
    return rule;
  };

  mo.getGpServiceBrowserRule = function(){
    var rule = new ServiceBrowserRule({
      leafTypes: ['GPTask'],
      serviceTypes: ['GPServer'],

      //override
      getItem: function(url){
        var def = new Deferred();
        if(this.isUrlEndWithServiceType(url)){
          //GPServer service url
          def = this.defaultGetItem(url);
        }else{
          //GP task url
          this.getRestInfo(url).then(lang.hitch(this, function(taskDefinition){
            var item = {
              name: taskDefinition.displayName || taskDefinition.name,
              type: 'GPTask',
              url: url,
              definition: taskDefinition
            };
            def.resolve(item);
          }), lang.hitch(this, function(err){
            def.reject(err);
          }));
        }
        return def;
      },

      //override
      getSubItemUrls: function(url){
        var def = new Deferred();
        if(this.isUrlEndWithServiceType(url)){
          this.getRestInfo(url).then(lang.hitch(this, function(serviceMeta){
            var tasks = serviceMeta.tasks || [];
            var urls = array.map(tasks, lang.hitch(this, function(taskName){
              return url + '/' + taskName;
            }));
            def.resolve(urls);
          }), lang.hitch(this, function(err){
            def.reject(err);
          }));
        }else{
          def.resolve([]);
        }
        return def;
      },

      //override
      getIconImageName: function(item, opened){
        /*jshint unused: false*/
        var imageName = '';
        if (item.type === 'GPServer') {
          imageName = 'toolbox.png';
        } else if (item.type === 'GPTask') {
          imageName = 'tool.png';
        }
        return imageName;
      }
    });

    return rule;
  };

  mo.getImageServiceBrowserRule = function(isSupportQuery){
    var rule = new ServiceBrowserRule({
      leafTypes: ['ImageServer'],
      serviceTypes: ['ImageServer'],

      //override
      getItem: function(url){
        var def = new Deferred();
        if(this.isUrlEndWithServiceType(url)){
          //ImageServer service url
          this.defaultGetItem(url).then(lang.hitch(this, function(item){
            if(isSupportQuery){
              if(jimuUtils.isImageServiceSupportQuery(item.definition.capabilities)){
                def.resolve(item);
              }else{
                def.resolve(null);
              }
            }else{
              def.resolve(item);
            }
          }), lang.hitch(this, function(err){
            def.reject(err);
          }));
        }else{
          def.resolve(null);
        }
        return def;
      },

      //override
      getIconImageName: function(item, opened){
        /*jshint unused: false*/
        var imageName = '';
        if(item.type === 'ImageServer'){
          imageName = 'image_layer.png';
        }
        return imageName;
      }
    });
    return rule;
  };

  mo.getQueryableServiceBrowserRule = function(){
    var featureServiceRule = mo.getFeaturelayerServiceBrowserRule(['point', 'polyline', 'polygon'],
                                                                  true, true);
    var imageServiceRule = mo.getImageServiceBrowserRule(true);
    var rule = mo.combineRules([featureServiceRule, imageServiceRule]);
    return rule;
  };

  return mo;
});
},
'jimu/ServiceBrowserRule':function(){
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
  'dojo/_base/array',
  'dojo/Deferred',
  'jimu/utils',
  'esri/request',
  'esri/IdentityManager'
],
function(declare, lang, array, Deferred, jimuUtils, esriRequest, IdentityManager) {

  //properties required:
  //leafTypes
  //serviceTypes

  //methods need to be overridden:
  //getItem
  //getSubItemUrls
  //getIconImageName
  var BaseRule = declare([], {
    leafTypes: null,//string array
    serviceTypes: null,//such as['MapServer','FeatureServer'] or ['GPServer']...

    _restInfoCache: {},

    constructor: function(options){
      lang.mixin(this, options);
      if(!lang.isArrayLike(this.leafTypes)){
        this.leafTypes = [];
      }
      if(!lang.isArrayLike(this.serviceTypes)){
        this.serviceTypes = [];
      }
    },

    //to be override
    //this method return a Deferred object,
    //the Deferred object resolve an item object{name,type,url} of the input url
    //here is the default implementation of getItem
    //if resolve null, means can't pass the filter
    getItem: function(url){
      return this.defaultGetItem(url);
    },

    //to be override
    //this method return a Deferred object,
    //the Deferred object resolve an the children urls
    getSubItemUrls: function(url){
      return this.defaultGetSubItemUrls(url);
    },

    //to be override
    getIconImageName: function(item, opened) {
      /* jshint unused: false */
      var imageName = "";
      return imageName;
    },

    //resolve {name,type,url,definition}
    defaultGetItem: function(url){
      var def = new Deferred();
      url = url.replace(/\/*$/g, '');
      if(this.isUrlEndWithServiceType(url)){
        var splits = url.split('/');
        var serviceType = splits[splits.length - 1];
        var serviceName = splits[splits.length - 2];
        this.getRestInfo(url).then(lang.hitch(this, function(definition){
          var item = {
            name: serviceName,
            type: serviceType,
            url: url,
            definition: definition
          };
          def.resolve(item);
        }), lang.hitch(this, function(err){
          console.error(err);
          def.reject({
            errorCode: 'NETWORK_ERROR',
            error: err
          });
        }));
      }else{
        def.resolve(null);
      }
      return def;
    },

    defaultGetSubItemUrls: function(url){
      /*jshint unused: false*/
      var def = new Deferred();
      def.resolve([]);
      return def;
    },

    getRestInfo: function(url){
      var def = new Deferred();

      url = url.replace(/\/*$/g, '');
      var info = this._restInfoCache[url];
      if (info) {
        def.resolve(info);
      } else {
        var args = {
          url: url,
          content: {
            f: "json"
          },
          handleAs: "json",
          callbackParamName: "callback",
          timeout: 20000
        };
        var credential = IdentityManager.findCredential(url);
        if(credential && credential.token){
          args.content.token = credential.token;
        }
        esriRequest(args).then(lang.hitch(this, function(response) {
          this._restInfoCache[url] = response;
          def.resolve(response);
        }), function(err) {
          def.reject(err);
        });
      }

      return def;
    },

    isServiceTypeSupported: function(type){
      type = type.toLowerCase();
      return array.some(this.serviceTypes, lang.hitch(this, function(serviceType){
        return serviceType.toLowerCase() === type;
      }));
    },

    isUrlEndWithServiceType: function(url){
      return array.some(this.serviceTypes, lang.hitch(this, function(type){
        return jimuUtils.isStringEndWith(url, '/' + type);
      }));
    },

    isUrlContainsServiceType: function(url){
      url = url.toLowerCase();
      return array.some(this.serviceTypes, lang.hitch(this, function(type){
        type = type.toLowerCase();
        return url.indexOf('/' + type) >= 0;
      }));
    }
  });

  return BaseRule;
});
},
'jimu/dijit/_FeaturelayerServiceChooserContent':function(){
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

define(['dojo/_base/declare',
  './_BasicServiceChooserContent',
  './FeaturelayerServiceBrowser'
],
function(declare, _BasicServiceChooserContent, FeaturelayerServiceBrowser) {
  return declare([_BasicServiceChooserContent], {
    baseClass: 'jimu-featurelayer-service-chooser-content',

    _examples:['http://myserver/arcgis/rest/services',
    'http://myserver/arcgis/rest/services/folder',
    'http://myserver/arcgis/rest/services/myservice/MapServer',
    'http://myserver/arcgis/rest/services/myservice/FeatureServer'],

    //public methods:
    //setUrl

    //events:
    //ok
    //cancel

    //test urls:
    //http://services.arcgisonline.com/arcgis/rest/services

    //methods need to override:
    //_createServiceBrowser, return a service browser

    //to be override,return a service browser
    _createServiceBrowser: function(args){
      return new FeaturelayerServiceBrowser(args);
    }

  });
});
},
'jimu/dijit/_BasicServiceChooserContent':function(){
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

define(['dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./templates/_BasicServiceChooserContent.html',
  'dojo/Evented',
  'dojo/Deferred',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/aspect',
  'dojo/promise/all',
  'jimu/dijit/URLInput',
  'jimu/dijit/LoadingIndicator'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Evented,
  Deferred, html, array, lang, on, aspect, all, URLInput, LoadingIndicator) {
  /*jshint unused: false*/
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: template,

    _examples:['http://myserver/arcgis/rest/services',
    'http://myserver/arcgis/rest/services/folder',
    'http://myserver/arcgis/rest/services/myservice/servicetype'],

    //options:
    multiple: false,
    url:'',

    //public methods:
    //setUrl

    //events:
    //ok
    //cancel

    //methods need to override:
    //_createServiceBrowser, return a service browser

    //public methods:
    //getSelectedItems return [{name,url, /*optional*/ definition}]

    getSelectedItems: function(){
      return this.serviceBrowser.getSelectedItems();
    },

    postMixInProperties:function(){
      this.nls = lang.mixin({}, window.jimuNls.common);
      this.nls = lang.mixin(this.nls, window.jimuNls.basicServiceChooser);
    },

    postCreate: function(){
      this.inherited(arguments);
      html.addClass(this.domNode, 'jimu-basic-service-chooser-content');
      this.multiple = !!this.multiple;
      this._initSelf();
      this.exampleTd.innerHTML = this.exampleTd.innerHTML;
    },

    setUrl: function(url){
      var def = new Deferred();

      this.url = url;
      if(this.url && typeof this.url === 'string'){
        this.urlInput.set('value', this.url);
        def = this._onBtnValidateClick();
      }
      else{
        def.reject();
      }

      return def;
    },

    focusInput: function(){
      this.urlInput.focus();
    },

    _initSelf: function(){
      //set examples
      if(this._examples && this._examples.length > 0){
        array.forEach(this._examples, lang.hitch(this, function(example){
          html.create('div', {
            innerHTML: example,
            'class': 'example-url'
          }, this.exampleTd);
        }));
      }
      else{
        html.setStyle(this.exampleTr, 'display', 'none');
      }

      //set service browser
      var args = {
        multiple: this.multiple,
        _onTreeClick: lang.hitch(this, this._onTreeClick)
      };
      this.serviceBrowser = this._createServiceBrowser(args);
      this.serviceBrowser.placeAt(this.serviceBrowserContainer);
      this.serviceBrowser.startup();

      this.own(aspect.after(this.urlInput, 'validator', lang.hitch(this, this._afterUrlValidate)));

      if(this.url && typeof this.url === 'string'){
        this.urlInput.set('value', this.url);
      }

      this.own(on(this.serviceBrowser, 'error', lang.hitch(this, this._onServiceBrowserError)));
    },

    //to be override,return a service browser
    _createServiceBrowser: function(args){/* jshint unused: false */},

    //to be override,return a bool value
    _validateUrl: function(url){
      url = url.replace(/\/*$/g, '');
      var matchResult = url.match(/\/rest\/services\/*(.*)/gi);
      if(matchResult && matchResult.length > 0){
        //"/rest/services/SampleWorldCities/MapServer/"
        var url2 = matchResult[0];
        //"SampleWorldCities/MapServer/"
        var url3 = url2.replace(/\/rest\/services\/*/, "");
        if(url3){
          var splits = url3.split("/");
          if(splits.length === 1){
            //url ends with folder name
            //url: http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation
            return true;
          }else if(splits.length === 2){
            //url ends with service type
            //url: http://sampleserver6.arcgisonline.com/arcgis/rest/services/SF311/MapServer
            return this.serviceBrowser.isServiceTypeSupported(splits[1]);
          }else if(splits.length >= 3){
            //url ends with service type and has folder
            //url:http://sampleserver6/arcgis/rest/services/SampleWorldCities/MapServer/0
            //or
            //url:http://sampleserver6/arcgis/rest/services/Elevation/WorldElevations/MapServer
            var b1 = this.serviceBrowser.isServiceTypeSupported(splits[1]);
            var b2 = this.serviceBrowser.isServiceTypeSupported(splits[2]);
            return b1 || b2;
          }
        }else{
          //url ends with "rest/services"
          //url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services"
          return true;
        }
      }else{
        return false;
      }
    },

    _afterUrlValidate: function(isValidate){
      var disabledClass = 'jimu-state-disabled';

      if(isValidate){
        var url = this.urlInput.get('value');
        isValidate = this._validateUrl(url);
      }

      if(isValidate){
        html.removeClass(this.btnValidate, disabledClass);
      }else{
        html.addClass(this.btnValidate, disabledClass);
      }

      return isValidate;
    },

    _onServiceBrowserError: function(msg){
      this._showErrorMessage(msg);
    },

    _showErrorMessage: function(msg){
      if(msg && typeof msg === 'string'){
        this.errorNode.innerHTML = msg;
        html.addClass(this.errorSection, 'visible');
      }else{
        html.removeClass(this.errorSection, 'visible');
      }
    },

    _clearErrorMessage: function(){
      this.errorNode.innerHTML = '';
      html.removeClass(this.errorSection, 'visible');
    },

    _onBtnValidateClick: function(){
      this._clearErrorMessage();

      var def = new Deferred();

      var isValidate = this.urlInput.validate();
      if(isValidate){
        var url = this.urlInput.get('value');
        this.serviceBrowser.setUrl(url).then(lang.hitch(this, function(){
          if(this.domNode){
            this._checkSelectedItemsNumber();
          }
          def.resolve();
        }), lang.hitch(this, function(){
          if(this.domNode){
            this._checkSelectedItemsNumber();
          }
          def.reject();
        }));
        this.emit('validate-click');
      }
      else{
        def.reject();
      }

      return def;
    },

    _checkSelectedItemsNumber: function(){
      var disabledClass = 'jimu-state-disabled';
      var items = this.getSelectedItems();
      if(items.length > 0){
        html.removeClass(this.btnOk, disabledClass);
      }
      else{
        html.addClass(this.btnOk, disabledClass);
      }
    },

    _onTreeClick: function(){
      this._checkSelectedItemsNumber();
    },

    _onBtnOkClick: function(){
      var items = this.getSelectedItems();
      if(items.length > 0){
        this.emit('ok', items);
      }
    },

    _onBtnCancelClick: function(){
      this.emit('cancel');
    }

  });
});
},
'widgets/Search/setting/LayerChooserForSearch':function(){
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
  'dojo/Deferred',
  'dojo/_base/html',
  'dojo/_base/lang',
  'for3dSetting/FeaturelayerChooserFromMap3d'
],
function(declare, Deferred, html, lang, FeaturelayerChooserFromMap3d) {
  //jshint unused:false
  return declare([FeaturelayerChooserFromMap3d], {
    declaredClass: 'jimu.dijit.FeaturelayerChooserFromMap3d',

    _featureLayerFilter: function(layer) {
      var def = new Deferred();
      var queryable = this.mustSupportQuery ? this._isQueryable(layer) : true;
      if(layer && layer.type === "feature" && queryable) {
        def.resolve();
      } else if(layer && layer.type === "scene") {
        layer.queryFeatures().then(lang.hitch(this, function() {
          def.resolve();
        }), lang.hitch(this, function() {
          def.reject();
        }));
      } else {
        def.reject();
      }
      return def;
    }

  });
});

},
'for3dSetting/FeaturelayerChooserFromMap3d':function(){
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
  'dojo/Deferred',
  'dojo/_base/html',
  'dojo/_base/lang',
  './LayerChooserFromMap3d'
],
function(declare, Deferred, html, lang, LayerChooserFromMap3d) {
  //jshint unused:false
  return declare([LayerChooserFromMap3d], {
    baseClass: 'jimu-layer-chooser-from-map-3d jimu-featurelayer-chooser-from-map-3d',
    declaredClass: 'jimu.dijit.FeaturelayerChooserFromMap3d',
    mustSupportQuery: null,

    constructor: function(){
      this.mustSupportQuery = false;
    },

    postMixInProperties:function(){
      this.inherited(arguments);
      this.layerFilter = lang.hitch(this, this._featureLayerFilter);
    },

    /*
    postCreate: function(){
      this.inherited(arguments);
      this.layerFilter = lang.hitch(this, this._featureLayerFilter);
      //html.addClass(this.domNode, 'jimu-layer-chooser-from-map-3d');
    },
    */

    _isQueryable: function(layer) {
      if(layer &&
         layer.capabilities &&
         layer.capabilities.operations &&
         layer.capabilities.operations.supportsQuery) {
        return true;
      }
    },

    _featureLayerFilter: function(layer) {
      var def = new Deferred();
      var queryable = this.mustSupportQuery ? this._isQueryable(layer) : true;
      if(layer && layer.type === "feature" && queryable) {
        def.resolve();
      } else {
        def.reject();
      }
      return def;
    }

  });
});

},
'for3dSetting/LayerChooserFromMap3d':function(){
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
  'dojo/on',
  'dojo/Evented',
  'dojo/query',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/dijit/LoadingIndicator'
],
function(on, Evented, query, Deferred, all, lang, html, declare, _WidgetBase,
_TemplatedMixin, _WidgetsInTemplateMixin, LoadingIndicator) {

  var baseClassArr = [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented];

  var Clazz = declare(baseClassArr, {
    baseClass: 'jimu-layer-chooser-from-map-3d',
    declaredClass: 'builder.for3dSetting.LayerChooserFromMap3d',
    templateString: '<div>' +
      '<div class="chooser-container" data-dojo-attach-point="chooserContainer"></div>' +
      '</div>',

    layerFilter: null,
    _selectedLayer: null,

    constructor: function(options){
      this.options = options;
    },

    postMixInProperties: function(){
      this.nls = lang.clone(window.jimuNls.common);
      if(!this.layerFilter) {
        this.layerFilter = function(layer) {
          var def = new Deferred();
          //jshint unused:false
          def.resolve();
          return def;
        };
      }
    },

    postCreate: function(){
      this.inherited(arguments);
      this.loadingIndecator = new LoadingIndicator({
        hidden: false
      }).placeAt(this.domNode);
      this.createLayerChooser();
    },

    createLayerChooser: function() {
      var createdLayers = [];
      this.map.layers.forEach(lang.hitch(this, function(layer) {
        if(layer.allSublayers) {
          layer.allSublayers.forEach(lang.hitch(this, function(sublayer) {
            var subFeatureLayer = sublayer.createFeatureLayer();
            if(subFeatureLayer) {
              // working around for incorrect subFeatureLayer.url
              // it's a bug of js-api?
              subFeatureLayer._urlAddedByWab = sublayer.url;
              createdLayers.push(this._createLayerItem(subFeatureLayer));
            }
          }));
        } else {
          // working around for incorrect layer.url
          // confirmed, every layerId substring will be cutted from the layer.url after creating a new 'FeatreLayer'
          // it's a bug of js-api?
          if(layer.type === "scene") {
            layer._urlAddedByWab = layer.url + "/layers/" + layer.layerId;
          } else {
            layer._urlAddedByWab = layer.url + "/" + layer.layerId;
          }
          createdLayers.push(this._createLayerItem(layer));
        }
      }));
      all(createdLayers).then(lang.hitch(this, function(){
        this.loadingIndecator.hide();
      }));
    },

    _createLayerItem: function(layer) {
      var retDef = new Deferred();
      var layerItem = html.create("div", {
        'class': "layer-item",
        'innerHTML': layer.title
      }, this.chooserContainer);

      this.own(on(layerItem, 'click', lang.hitch(this, this._layerItemClick, layer)));
      if(layer.loaded) {
        this._showLayerItem(layer, layerItem);
        retDef.resolve();
      } else {
        layer.load();
        layer.when(lang.hitch(this, function() {
          this._showLayerItem(layer, layerItem);
          retDef.resolve();
        }), lang.hitch(this, function() {
          retDef.resolve();
        }));
      }
      return retDef;
    },

    _showLayerItem: function(layer, layerItem) {
      this.layerFilter(layer).then(lang.hitch(this, function() {
        html.addClass(layerItem, 'enable');
      }), lang.hitch(this, function() {
        html.removeClass(layerItem, 'enable');
      }));
    },

    _layerItemClick: function(layer, evt) {
      query(".layer-item.selected", this.chooserContainer).forEach(function(node) {
        html.removeClass(node, 'selected');
      });
      html.addClass(evt.target, 'selected');

      this._selectedLayer = layer;
      // compatible with LayerChooserFromMap.js
      this.emit('tree-click');
    },

    getSelectedItems: function(){
      var items = [];
      if(this._selectedLayer) {
        items.push({
          name: this._selectedLayer.title,
          url: this._selectedLayer._urlAddedByWab || this._selectedLayer.url,
          layerInfo: {
            id: this._selectedLayer.id
          }
        });
      }
      return items;
    }

    /*
    startup: function(){
      this.inherited(arguments);
      this.layerChooser.startup();
    }
    */
  });

  return Clazz;
});

},
'dojo/NodeList-data':function(){
define([
	"./_base/kernel", "./query", "./_base/lang", "./_base/array", "./dom-attr"
], function(dojo, query, lang, array, attr){

	// module:
	//		dojo/NodeList-data

	/*=====
	return function(){
		// summary:
		//		Adds data() and removeData() methods to NodeList, and returns NodeList constructor.
	};
	=====*/

	var NodeList = query.NodeList;

	var dataCache = {}, x = 0, dataattr = "data-dojo-dataid",
		dopid = function(node){
			// summary:
			//		Return a uniqueish ID for the passed node reference
			var pid = attr.get(node, dataattr);
			if(!pid){
				pid = "pid" + (x++);
				attr.set(node, dataattr, pid);
			}
			return pid;
		}
	;

	
	var dodata = dojo._nodeData = function(node, key, value){
		// summary:
		//		Private helper for dojo/NodeList.data for single node data access. Refer to NodeList.data
		//		documentation for more information.
		//
		// node: String|DomNode
		//		The node to associate data with
		//
		// key: Object|String?
		//		If an object, act as a setter and iterate over said object setting data items as defined.
		//		If a string, and `value` present, set the data for defined `key` to `value`
		//		If a string, and `value` absent, act as a getter, returning the data associated with said `key`
		//
		// value: Anything?
		//		The value to set for said `key`, provided `key` is a string (and not an object)
		//
		var pid = dopid(node), r;
		if(!dataCache[pid]){ dataCache[pid] = {}; }

		// API discrepency: calling with only a node returns the whole object. $.data throws
		if(arguments.length == 1){ return dataCache[pid]; }
		if(typeof key == "string"){
			// either getter or setter, based on `value` presence
			if(arguments.length > 2){
				dataCache[pid][key] = value;
			}else{
				r = dataCache[pid][key];
			}
		}else{
			// must be a setter, mix `value` into data hash
			// API discrepency: using object as setter works here
			r = lang.mixin(dataCache[pid], key);
		}

		return r; // Object|Anything|Nothing
	};

	var removeData = dojo._removeNodeData = function(node, key){
		// summary:
		//		Remove some data from this node
		// node: String|DomNode
		//		The node reference to remove data from
		// key: String?
		//		If omitted, remove all data in this dataset.
		//		If passed, remove only the passed `key` in the associated dataset
		var pid = dopid(node);
		if(dataCache[pid]){
			if(key){
				delete dataCache[pid][key];
			}else{
				delete dataCache[pid];
			}
		}
	};

	NodeList._gcNodeData = dojo._gcNodeData = function(){
		// summary:
		//		super expensive: GC all data in the data for nodes that no longer exist in the dom.
		// description:
		//		super expensive: GC all data in the data for nodes that no longer exist in the dom.
		//		MUCH safer to do this yourself, manually, on a per-node basis (via `NodeList.removeData()`)
		//		provided as a stop-gap for exceptionally large/complex applications with constantly changing
		//		content regions (eg: a dijit/layout/ContentPane with replacing data)
		//		There is NO automatic GC going on. If you dojo.destroy() a node, you should _removeNodeData
		//		prior to destruction.
		var livePids = query("[" + dataattr + "]").map(dopid);
		for(var i in dataCache){
			if(array.indexOf(livePids, i) < 0){ delete dataCache[i]; }
		}
	};

	// make nodeData and removeNodeData public on dojo/NodeList:
	lang.extend(NodeList, {
		data: NodeList._adaptWithCondition(dodata, function(a){
			return a.length === 0 || a.length == 1 && (typeof a[0] == "string");
		}),
		removeData: NodeList._adaptAsForEach(removeData)
	});

	/*=====
	 lang.extend(NodeList, {
		 data: function(key, value){
			// summary:
			//		stash or get some arbitrary data on/from these nodes.
			//
			// description:
			//		Stash or get some arbitrary data on/from these nodes. This private _data function is
			//		exposed publicly on `dojo/NodeList`, eg: as the result of a `dojo/query` call.
			//		DIFFERS from jQuery.data in that when used as a getter, the entire list is ALWAYS
			//		returned. EVEN WHEN THE LIST IS length == 1.
			//
			//		A single-node version of this function is provided as `dojo._nodeData`, which follows
			//		the same signature, though expects a String ID or DomNode reference in the first
			//		position, before key/value arguments.
			//
			// node: String|DomNode
			//		The node to associate data with
			//
			// key: Object|String?
			//		If an object, act as a setter and iterate over said object setting data items as defined.
			//		If a string, and `value` present, set the data for defined `key` to `value`
			//		If a string, and `value` absent, act as a getter, returning the data associated with said `key`
			//
			// value: Anything?
			//		The value to set for said `key`, provided `key` is a string (and not an object)
			//
			// example:
			//		Set a key `bar` to some data, then retrieve it.
			//	|	require(["dojo/query", "dojo/NodeList-data"], function(query){
			//	|		query(".foo").data("bar", "touched");
			//	|		var touched = query(".foo").data("bar");
			//	|		if(touched[0] == "touched"){ alert('win'); }
			//	|	});
			//
			// example:
			//		Get all the data items for a given node.
			//	|	require(["dojo/query", "dojo/NodeList-data"], function(query){
			//	|		var list = query(".foo").data();
			//	|		var first = list[0];
			//	|	});
			//
			// example:
			//		Set the data to a complex hash. Overwrites existing keys with new value
			//	|	require(["dojo/query", "dojo/NodeList-data"], function(query){
			//	|		query(".foo").data({ bar:"baz", foo:"bar" });
			//		Then get some random key:
			//	|		query(".foo").data("foo"); // returns [`bar`]
			//	|	});
			//
			// returns: Object|Anything|Nothing
			//		When used as a setter via `dojo/NodeList`, a NodeList instance is returned
			//		for further chaining. When used as a getter via `dojo/NodeList` an ARRAY
			//		of items is returned. The items in the array correspond to the elements
			//		in the original list. This is true even when the list length is 1, eg:
			//		when looking up a node by ID (#foo)
		 },

		 removeData: function(key){
			// summary:
			//		Remove the data associated with these nodes.
			// key: String?
			//		If omitted, clean all data for this node.
			//		If passed, remove the data item found at `key`
		 }
	 });
	 =====*/

// TODO: this is the basic implementation of adaptWithConditionAndWhenMappedConsiderLength, for lack of a better API name
// it conflicts with the the `dojo/NodeList` way: always always return an arrayLike thinger. Consider for 2.0:
//
//	NodeList.prototype.data = function(key, value){
//		var a = arguments, r;
//		if(a.length === 0 || a.length == 1 && (typeof a[0] == "string")){
//			r = this.map(function(node){
//				return d._data(node, key);
//			});
//			if(r.length == 1){ r = r[0]; } // the offending line, and the diff on adaptWithCondition
//		}else{
//			r = this.forEach(function(node){
//				d._data(node, key, value);
//			});
//		}
//		return r; // NodeList|Array|SingleItem
//	};

	return NodeList;

});

},
'widgets/Search/setting/LocatorSourceSetting':function(){
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
define(
  ["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/html",
    "dojo/on",
    "dojo/Evented",
    "dojo/Deferred",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "jimu/portalUrlUtils",
    "jimu/dijit/Message",
    "jimu/dijit/_GeocodeServiceChooserContent",
    "jimu/dijit/Popup",
    "jimu/dijit/LoadingShelter",
    "esri/request",
    "esri/lang",
    "./utils",
    "jimu/utils",
    "dojo/text!./LocatorSourceSetting.html",
    "jimu/dijit/CheckBox",
    "dijit/form/ValidationTextBox",
    "dijit/form/NumberTextBox"
  ],
  function(
    declare,
    lang,
    html,
    on,
    Evented,
    Deferred,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    portalUrlUtils,
    Message,
    _GeocodeServiceChooserContent,
    Popup,
    LoadingShelter,
    esriRequest,
    esriLang,
    utils,
    jimuUtils,
    template,
    CheckBox) {
    /*jshint maxlen:150*/
    return declare([
      _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented
    ], {
      baseClass: "jimu-widget-search-locator-source-setting",
      tr: null,
      nls: null,
      config: null,
      singleLineFieldName: null,
      templateString: template,

      _suggestible: false,
      _locatorDefinition: null,
      _esriLocatorRegExp: /http(s)?:\/\/geocode(.){0,3}\.arcgis.com\/arcgis\/rest\/services\/World\/GeocodeServer/g,
      serviceChooserContent: null,
      geocoderPopup: null,

      _clickSet: false,

      postCreate: function() {
        this.inherited(arguments);
        this.exampleHint = this.nls.locatorExample +
          ": http://&lt;myServerName&gt;/arcgis/rest/services/World/GeocodeServer";
        this.searchInCurrentMapExtent = new CheckBox({
          checked: false,
          label: this.nls.searchInCurrentMapExtent
        }, this.searchInCurrentMapExtent);

        this.config = this.config ? this.config : {};
        this.setConfig(this.config);
      },

      setRelatedTr: function(tr) {
        this.tr = tr;
      },

      getRelatedTr: function() {
        return this.tr;
      },

      setDefinition: function(definition) {
        this._locatorDefinition = definition || {};
      },

      getDefinition: function() {
        return this._locatorDefinition;
      },

      setConfig: function(config) {
        if (Object.prototype.toString.call(config) !== "[object Object]") {
          return;
        }

        var url = config.url;
        if (!url) {
          return;
        }
        this.config = config;

        this.shelter.show();
        if (this._locatorDefinition.url !== url) {
          this._getDefinitionFromRemote(url).then(lang.hitch(this, function(response) {
            if (url && (response && response.type !== 'error')) {
              this._locatorDefinition = response;
              this._locatorDefinition.url = url;
              this._setSourceItems();

              this._setMessageNodeContent(this.exampleHint);
            } else if (url && (response && response.type === 'error')) {
              this._setSourceItems();
              this._disableSourceItems();

              this._setMessageNodeContent(esriLang.substitute({
                'URL': response.url
              }, lang.clone(this.nls.invalidUrlTip)), true);
            }
            this.shelter.hide();
          }));
        } else {
          this._setSourceItems();
          this._setMessageNodeContent(this.exampleHint);
          this.shelter.hide();
        }
      },

      isValidConfig: function() {
        var config = this.getConfig();
        if (config.url && config.name && config.singleLineFieldName) {
          return true;
        } else {
          return false;
        }
      },

      showValidationTip: function() {
        this._showValidationErrorTip(this.locatorUrl);
        this._showValidationErrorTip(this.locatorName);
      },

      getConfig: function() {
        var geocode = {
          url: this.locatorUrl.get('value'),
          name: jimuUtils.stripHTML(this.locatorName.get('value')),
          singleLineFieldName: this.singleLineFieldName,
          placeholder: jimuUtils.stripHTML(this.placeholder.get('value')),
          countryCode: jimuUtils.stripHTML(this.countryCode.get('value')),
          zoomScale: this.zoomScale.get('value') || 50000,
          maxSuggestions: this.maxSuggestions.get('value') || 6,
          maxResults: this.maxResults.get('value') || 6,
          searchInCurrentMapExtent: this.searchInCurrentMapExtent.checked,
          type: "locator"
        };
        return geocode;
      },

      _onLocatorNameBlur: function() {
        this.locatorName.set('value', jimuUtils.stripHTML(this.locatorName.get('value')));
      },

      _onPlaceholderBlur: function() {
        this.placeholder.set('value', jimuUtils.stripHTML(this.placeholder.get('value')));
      },

      _onCountryCodeBlur: function() {
        this.countryCode.set('value', jimuUtils.stripHTML(this.countryCode.get('value')));
      },

      _disableSourceItems: function() {
        this.locatorName.set('disabled', true);
        this.placeholder.set('disabled', true);
        this.countryCode.set('disabled', true);
        this.maxSuggestions.set('disabled', true);
        this.maxResults.set('disabled', true);
        this.zoomScale.set('disabled', true);
      },

      _enableSourceItems: function() {
        this.locatorName.set('disabled', false);
        this.placeholder.set('disabled', false);
        this.countryCode.set('disabled', false);
        this.maxSuggestions.set('disabled', false);
        this.maxResults.set('disabled', false);
        this.zoomScale.set('disabled', false);
      },

      _setSourceItems: function() {
        var config = this.config;
        if (config.url) {
          // this.validService = true;
          this.locatorUrl.set('value', config.url);
          this._processCountryCodeRow(config.url);
        }
        if (config.name) {
          this.locatorName.set('value', jimuUtils.stripHTML(config.name));
        }
        if (config.singleLineFieldName) {
          this.singleLineFieldName = config.singleLineFieldName;
        }
        if (config.placeholder) {
          this.placeholder.set('value', jimuUtils.stripHTML(config.placeholder));
        }
        if (config.countryCode) {
          this.countryCode.set('value', jimuUtils.stripHTML(config.countryCode));
        }

        this._suggestible = this._locatorDefinition && this._locatorDefinition.capabilities &&
          this._locatorDefinition.capabilities.indexOf("Suggest") > -1;
        if (!this._suggestible) {
          this._showSuggestibleTips();
        } else {
          this._hideSuggestibleTips();
        }

        this.searchInCurrentMapExtent.setValue(!!config.searchInCurrentMapExtent);
        this.zoomScale.set('value', config.zoomScale || 50000);
        this.maxSuggestions.set('value', config.maxSuggestions || 6);
        this.maxResults.set('value', config.maxResults || 6);

        this._enableSourceItems();
      },

      _isEsriLocator: function(url) {
        this._esriLocatorRegExp.lastIndex = 0;
        return this._esriLocatorRegExp.test(url);
      },

      _getDefinitionFromRemote: function(url) {
        var resultDef = new Deferred();
        // this._esriLocatorRegExp.lastIndex = 0;
        if (this._isEsriLocator(url)) {
          // optimize time
          resultDef.resolve({
            singleLineAddressField: {
              name: "SingleLine",
              type: "esriFieldTypeString",
              alias: "Single Line Input",
              required: false,
              length: 200,
              localizedNames: {},
              recognizedNames: {}
            },
            capabilities: "Geocode,ReverseGeocode,Suggest"
          });
        } else {
          var def = esriRequest({
            url: url,
            content: {
              f: 'json'
            },
            handleAs: 'json',
            callbackParamName: 'callback'
          });
          this.own(def);
          def.then(lang.hitch(this, function(response) {
            resultDef.resolve(response);
          }), lang.hitch(this, function(err) {
            console.error(err);
            resultDef.resolve({
              type: 'error',
              url: this._getRequestUrl(url)
            });
          }));
        }

        return resultDef.promise;
      },

      _setMessageNodeContent: function(content, err) {
        html.empty(this.messageNode);
        if (!content.nodeType) {
          content = html.toDom(content);
        }
        html.place(content, this.messageNode);
        if (err) {
          html.addClass(this.messageNode, 'error-message');
        } else {
          html.removeClass(this.messageNode, 'error-message');
        }
      },

      _getRequestUrl: function(url) {
        var protocol = window.location.protocol;
        if (protocol === 'http:') {
          return portalUrlUtils.setHttpProtocol(url);
        } else if (protocol === 'https:'){
          return portalUrlUtils.setHttpsProtocol(url);
        } else {
          return url;
        }
      },

      _onSetLocatorUrlClick: function() {
        this._clickSet = true;
        this._openServiceChooser();
      },

      _openLocatorChooser: function() {
        this._clickSet = false;
        this._openServiceChooser();
      },

      _openServiceChooser: function() {
        this.serviceChooserContent = new _GeocodeServiceChooserContent({
          url: this.locatorUrl.get('value') || ""
        });
        this.shelter = new LoadingShelter({
          hidden: true
        });

        this.geocoderPopup = new Popup({
          titleLabel: this.nls.setGeocoderURL,
          autoHeight: true,
          content: this.serviceChooserContent.domNode,
          container: window.jimuConfig.layoutId,
          width: 640
        });
        this.shelter.placeAt(this.geocoderPopup.domNode);
        html.setStyle(this.serviceChooserContent.domNode, 'width', '580px');
        html.addClass(
          this.serviceChooserContent.domNode,
          'override-geocode-service-chooser-content'
        );

        this.serviceChooserContent.own(
          on(this.serviceChooserContent, 'validate-click', lang.hitch(this, function() {
            html.removeClass(
              this.serviceChooserContent.domNode,
              'override-geocode-service-chooser-content'
            );
          }))
        );
        this.serviceChooserContent.own(
          on(this.serviceChooserContent, 'ok', lang.hitch(this, '_onSelectLocatorUrlOk'))
        );
        this.serviceChooserContent.own(
          on(this.serviceChooserContent, 'cancel', lang.hitch(this, '_onSelectLocatorUrlCancel'))
        );
      },

      _onSelectLocatorUrlOk: function(evt) {
        if (!(evt && evt[0] && evt[0].url && this.domNode)) {
          return;
        }
        this.shelter.show();
        esriRequest({
          url: evt[0].url,
          content: {
            f: 'json'
          },
          handleAs: 'json',
          callbackParamName: 'callback'
        }).then(lang.hitch(this, function(response) {
          this.shelter.hide();
          if (response &&
            response.singleLineAddressField &&
            response.singleLineAddressField.name) {
            this._enableSourceItems();
            this.locatorUrl.set('value', evt[0].url);
            if(!this.locatorName.get('value')){
              this.locatorName.set('value', utils.getGeocoderName(evt[0].url));
            }
            if (!this.maxResults.get('value')) {
              this.maxResults.set('value', 6);
            }

            this.singleLineFieldName = response.singleLineAddressField.name;

            this._processCountryCodeRow(evt[0].url);

            this._locatorDefinition = response;
            this._locatorDefinition.url = evt[0].url;
            this._suggestible = response.capabilities &&
              this._locatorDefinition.capabilities.indexOf("Suggest") > -1;
            if (!this._suggestible) {
              this._showSuggestibleTips();
            } else {
              this._hideSuggestibleTips();
            }

            if (this._clickSet) {
              this.emit('reselect-locator-url-ok', this.getConfig());
            } else {
              this.emit('select-locator-url-ok', this.getConfig());
            }

            if (this.geocoderPopup) {
              this.geocoderPopup.close();
              this.geocoderPopup = null;
            }
            this._setMessageNodeContent(this.exampleHint);
          } else {
            new Message({
              message: this.nls.locatorWarning
            });
          }
        }), lang.hitch(this, function(err) {
          console.error(err);
          this.shelter.hide();
          new Message({
            'message': esriLang.substitute({
                'URL': this._getRequestUrl(evt[0].url)
              }, lang.clone(this.nls.invalidUrlTip))
          });
        }));
      },

      _onSelectLocatorUrlCancel: function() {
        if (this.geocoderPopup) {
          this.geocoderPopup.close();
          this.geocoderPopup = null;

          this.emit('select-locator-url-cancel');
        }
      },

      _processCountryCodeRow: function(url) {
        if (this._isEsriLocator(url)) {
          this.countryCode.set('value', "");
          html.removeClass(this.countryCodeRow, 'hide-country-code-row');
        } else {
          html.addClass(this.countryCodeRow, 'hide-country-code-row');
        }
      },

      _showSuggestibleTips: function() {
        html.addClass(this.tipsNode, 'source-tips-show');
        html.setStyle(this.maxSuggestions.domNode, 'display', 'none');
      },

      _hideSuggestibleTips: function() {
        html.removeClass(this.tipsNode, 'source-tips-show');
        html.setStyle(this.maxSuggestions.domNode, 'display', 'block');
      },

      _showValidationErrorTip: function(_dijit) {
        if (!_dijit.validate() && _dijit.domNode) {
          if (_dijit.focusNode) {
            var _disabled = _dijit.get('disabled');
            if (_disabled) {
              _dijit.set('disabled', false);
            }
            _dijit.focusNode.focus();
            setTimeout(lang.hitch(this, function() {
              _dijit.focusNode.blur();
              if (_disabled) {
                _dijit.set('disabled', true);
              }
              _dijit = null;
            }), 100);
          }
        }
      }
    });
  });
},
'jimu/dijit/_GeocodeServiceChooserContent':function(){
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

define(['dojo/_base/declare',
  './_BasicServiceChooserContent',
  './GeocodeServiceBrowser'
],
function(declare, _BasicServiceChooserContent, GeocodeServiceBrowser) {
  return declare([_BasicServiceChooserContent], {
    baseClass: 'jimu-geocode-service-chooser-content',

    _examples:['http://myserver/arcgis/rest/services',
    'http://myserver/arcgis/rest/services/folder',
    'http://myserver/arcgis/rest/services/myservice/GeocodeServer'],

    //https://gis.lmi.is/arcgis/rest/services/GP_service/geocode_thjonusta_single/GeocodeServer
    //https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer

    //methods need to override:
    //_createServiceBrowser, return a service browser

    //to be override,return a service browser
    _createServiceBrowser: function(args){
      return new GeocodeServiceBrowser(args);
    }

  });
});
},
'jimu/dijit/GeocodeServiceBrowser':function(){
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
  './_BasicServiceBrowser',
  'dojo/_base/lang',
  'dojo/_base/array',
  'jimu/serviceBrowserRuleUtils'
],
function(declare, _BasicServiceBrowser, lang, array, serviceBrowserRuleUtils) {
  return declare([_BasicServiceBrowser], {
    baseClass: 'jimu-geocode-service-browser',
    declaredClass: 'jimu.dijit.GeocodeServiceBrowser',

    //options:
    url: '',
    multiple: false,

    //public methods:
    //getSelectedItems return [{name, url}]

    //test urls
    //https://gis.lmi.is/arcgis/rest/services/GP_service
    //https://gis.lmi.is/arcgis/rest/services/GP_service/geocode_thjonusta_single/GeocodeServer

    postMixInProperties:function(){
      this.inherited(arguments);
      this.rule = serviceBrowserRuleUtils.getGeocodeServiceBrowserRule();
    },

    //override
    getSelectedItems: function(){
      var items = this.inherited(arguments);
      items = array.map(items, lang.hitch(this, function(item){
        return {
          name: item.name,
          url: item.url
        };
      }));
      return items;
    }

  });
});
},
'widgets/Search/setting/_build-generate_module':function(){
define(["dojo/text!./Setting.html",
"dojo/text!./css/style.css",
"dojo/i18n!./nls/strings"], function(){});
},
'url:widgets/Search/setting/QuerySourceSetting.html':"<div>\r\n  <div class=\"source-url-section\">\r\n    <table class=\"source-table\">\r\n      <tr>\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.layerSource}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <div data-dojo-attach-point=\"sourceUrl\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props=\"required:true,trim:true,disabled:true,style:{width:'100%'}\"></div>\r\n        </td>\r\n        <td class=\"third\">\r\n          <span class=\"jimu-btn\" title=\"${nls.set}\" data-dojo-attach-event=\"click:_onSetSourceClick\">${nls.set}</span>\r\n        </td>\r\n      </tr>\r\n      <tr data-dojo-attach-point=\"messageTr\">\r\n        <td class=\"first\"></td>\r\n        <td class=\"second\" colspan=\"2\">\r\n          <span data-dojo-attach-point=\"messageNode\" class=\"tip error-message\"></span>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n  </div>\r\n  <div class=\"source-details-section\">\r\n    <table class=\"source-table\">\r\n      <tr>\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.name}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <div data-dojo-attach-point=\"sourceName\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-event=\"Blur:_onSourceNameBlur\" data-dojo-props=\"trim:true,required:true,style:{width:'100%'}\"></div>\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.placeholder}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <div data-dojo-attach-point=\"placeholder\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-event=\"Blur:_onPlaceholderBlur\" data-dojo-props=\"trim:true,style:{width:'100%'}\"></div>\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.searchFields}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <div class=\"search-fields\">\r\n            <!-- <span class=\"fields jimu-float-leading\" data-dojo-attach-point=\"fieldsNode\"></span> -->\r\n            <div data-dojo-attach-point=\"searchFields\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props=\"required:true,trim:true,disabled:true,style:{width:'95%'}\"></div>\r\n            <div class=\"search-fields-selector jimu-float-trailing\" data-dojo-attach-point=\"fieldsSelectorNode\" data-dojo-attach-event=\"click:_onFieldsSelectorClick\"></div>\r\n          </div>\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.displayField}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <div data-dojo-attach-point=\"displayField\" data-dojo-type=\"dijit/form/Select\" data-dojo-props='style:{width:\"100%\"}'></div>\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.maxSuggestions}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <div class=\"source-tips\" title=\"${nls.searchLayerTips}\" data-dojo-attach-point=\"tipsNode\">\r\n            <em>${nls.searchLayerTips}</em>\r\n          </div>\r\n          <div data-dojo-attach-point=\"maxSuggestions\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props=\"constraints:{min:1,places:0},style:{width:'100%'},value:6\"></div>\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.maxResults}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <div data-dojo-attach-point=\"maxResults\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props=\"constraints:{min:1,places:0},style:{width:'100%'}\"></div>\r\n        </td>\r\n      </tr>\r\n      <tr data-dojo-attach-point=\"zoomScaleTr\">\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.zoomScale}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <span class=\"jimu-float-leading\" style=\"line-height:30px;\">1: </span>\r\n          <div class=\"jimu-float-trailing\" data-dojo-attach-point=\"zoomScale\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props=\"constraints:{min:1},style:{width:'96%'},value:50000\"></div>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n    <table class=\"source-table\">\r\n      <tbody>\r\n        <tr>\r\n          <td class=\"first\">\r\n            <div data-dojo-attach-point=\"exactMatch\"></div>\r\n          </td>\r\n        </tr>\r\n        <tr>\r\n          <td class=\"first\">\r\n            <div data-dojo-attach-point=\"searchInCurrentMapExtent\"></div>\r\n          </td>\r\n        </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n  <div data-dojo-attach-point=\"shelter\" data-dojo-type=\"jimu/dijit/LoadingShelter\" data-dojo-props=\"hidden:true\"></div>\r\n</div>",
'url:jimu/dijit/templates/FeaturelayerSource.html':"<div>\r\n\t<table class=\"radio-table\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tbody>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"map-td\" nowrap data-dojo-attach-point=\"mapTd\">\r\n\t\t\t\t\t<label data-dojo-attach-point=\"mapLabel\">${nls.selectFromMap}</label>\r\n\t\t\t\t</td>\r\n\t\t\t\t<td class=\"portal-td\" nowrap data-dojo-attach-point=\"portalTd\">\r\n\t\t\t\t\t<label data-dojo-attach-point=\"portalLabel\">${nls.selectFromPortal}</label>\r\n\t\t\t\t</td>\r\n\t\t\t\t<td class=\"url-td\" nowrap data-dojo-attach-point=\"urlTd\">\r\n\t\t\t\t\t<label data-dojo-attach-point=\"urlLabel\">${nls.addServiceUrl}</label>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t</tbody>\r\n\t</table>\r\n\t<div class=\"source-content\">\r\n\t\t<div data-dojo-attach-point=\"operationTip\" class=\"operation-tip\"></div>\r\n\t\t<div data-dojo-attach-point=\"flcContainer\" class=\"dijit-container map-dijit-container\" style=\"display:none;\"></div>\r\n\t\t<div data-dojo-attach-point=\"hflcContainer\" class=\"dijit-container portal-dijit-container\" style=\"display:none;\"></div>\r\n\t\t<div data-dojo-attach-point=\"flscContainer\" class=\"dijit-container url-dijit-container\" style=\"display:none;\"></div>\r\n\t</div>\r\n</div>",
'url:jimu/dijit/templates/_TreeNode.html':"<div class=\"dijitTreeNode\" role=\"presentation\">\r\n\t<div data-dojo-attach-point=\"rowNode\" class=\"dijitTreeRow\" role=\"presentation\">\r\n\t\t<span data-dojo-attach-point=\"expandoNode\" class=\"dijitInline dijitTreeExpando\" role=\"presentation\"></span>\r\n\t\t<span data-dojo-attach-point=\"expandoNodeText\" class=\"dijitExpandoText\" role=\"presentation\"></span>\r\n\t\t<span data-dojo-attach-point=\"contentNode\" class=\"dijitTreeContent\" role=\"presentation\">\r\n\t\t\t<span role=\"presentation\" class=\"dijitInline dijitIcon dijitTreeIcon\" data-dojo-attach-point=\"iconNode\"></span>\r\n\t\t\t<span data-dojo-attach-point=\"labelNode,focusNode\" class=\"dijitTreeLabel\" role=\"treeitem\" tabindex=\"-1\" aria-selected=\"false\"></span>\r\n\t\t</span>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"containerNode\" class=\"dijitTreeNodeContainer\" role=\"presentation\" style=\"display: none;\"></div>\r\n</div>",
'url:dijit/templates/TreeNode.html':"<div class=\"dijitTreeNode\" role=\"presentation\"\r\n\t><div data-dojo-attach-point=\"rowNode\" class=\"dijitTreeRow\" role=\"presentation\"\r\n\t\t><span data-dojo-attach-point=\"expandoNode\" class=\"dijitInline dijitTreeExpando\" role=\"presentation\"></span\r\n\t\t><span data-dojo-attach-point=\"expandoNodeText\" class=\"dijitExpandoText\" role=\"presentation\"></span\r\n\t\t><span data-dojo-attach-point=\"contentNode\"\r\n\t\t\tclass=\"dijitTreeContent\" role=\"presentation\">\r\n\t\t\t<span role=\"presentation\" class=\"dijitInline dijitIcon dijitTreeIcon\" data-dojo-attach-point=\"iconNode\"></span\r\n\t\t\t><span data-dojo-attach-point=\"labelNode,focusNode\" class=\"dijitTreeLabel\" role=\"treeitem\"\r\n\t\t\t\t   tabindex=\"-1\" aria-selected=\"false\" id=\"${id}_label\"></span>\r\n\t\t</span\r\n\t></div>\r\n\t<div data-dojo-attach-point=\"containerNode\" class=\"dijitTreeNodeContainer\" role=\"presentation\"\r\n\t\t style=\"display: none;\" aria-labelledby=\"${id}_label\"></div>\r\n</div>\r\n",
'url:dijit/templates/Tree.html':"<div role=\"tree\">\r\n\t<div class=\"dijitInline dijitTreeIndent\" style=\"position: absolute; top: -9999px\" data-dojo-attach-point=\"indentDetector\"></div>\r\n\t<div class=\"dijitTreeExpando dijitTreeExpandoLoading\" data-dojo-attach-point=\"rootLoadingIndicator\"></div>\r\n\t<div data-dojo-attach-point=\"containerNode\" class=\"dijitTreeContainer\" role=\"presentation\">\r\n\t</div>\r\n</div>\r\n",
'url:jimu/dijit/templates/FeaturelayerChooserFromPortal.html':"<div>\r\n\t<div class=\"selector-container\" data-dojo-attach-point=\"selectorContainer\"></div>\r\n\t<div class=\"service-browser-container\" data-dojo-attach-point=\"serviceBrowserContainer\"></div>\r\n\t<div class=\"footer\">\r\n\t\t<div class=\"jimu-btn jimu-float-trailing cancel jimu-btn-vacation\" data-dojo-attach-point=\"btnCancel\" data-dojo-attach-event=\"onclick:_onBtnCancelClicked\">${nls.cancel}</div>\r\n\t\t<div class=\"jimu-btn jimu-float-trailing next jimu-state-disabled\" data-dojo-attach-point=\"btnNext\" data-dojo-attach-event=\"onclick:_onBtnNextClicked\">${nls.next}</div>\r\n\t\t<div class=\"jimu-btn jimu-float-trailing ok jimu-state-disabled\" data-dojo-attach-point=\"btnOk\" data-dojo-attach-event=\"onclick:_onBtnOkClicked\">${nls.ok}</div>\r\n\t\t<div class=\"jimu-btn jimu-float-trailing back\" data-dojo-attach-point=\"btnBack\" data-dojo-attach-event=\"onclick:_onBtnBackClicked\">${nls.back}</div>\r\n\t</div>\r\n</div>",
'url:jimu/dijit/templates/ItemSelector.html':"\r\n<div>\r\n\t<div class=\"setting-tab-container\">\r\n\t\t<div data-dojo-attach-point=\"tabNode\"></div>\r\n\r\n\t\t<div class=\"tab-content mycontent-tab\" data-dojo-attach-point=\"mycontentTabNode\">\r\n\t\t\t<div class=\"tab-content-main mycontent-tab-content-main\">\r\n\t\t\t\t<div data-dojo-attach-point=\"mycontentSearch\" data-dojo-type=\"jimu/dijit/Search\" data-dojo-props='searchWhenInput:false' data-dojo-attach-event=\"onSearch:_onMyContentSearch\" style=\"position:absolute;width:100%;top:0;\"></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"mycontentItemTable\" data-dojo-type=\"jimu/dijit/_ItemTable\" data-dojo-props='types:${_itemTypes},typeKeywords:${_typeKeywords}' style=\"top:50px;\"></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"tab-content organization-tab\" data-dojo-attach-point=\"organizationTabNode\">\r\n\t\t\t<div class=\"tab-content-main organization-tab-content-main\">\r\n\t\t\t\t<div data-dojo-attach-point=\"organizationSearch\" data-dojo-type=\"jimu/dijit/Search\" data-dojo-props='searchWhenInput:false' data-dojo-attach-event=\"onSearch:_onOrganizationSearch\" style=\"position:absolute;width:100%;top:0;\"></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"organizationItemTable\" data-dojo-type=\"jimu/dijit/_ItemTable\" data-dojo-props='types:${_itemTypes},typeKeywords:${_typeKeywords}' style=\"top:50px;\"></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"tab-content group-tab\" data-dojo-attach-point=\"groupTabNode\">\r\n\t\t\t<div class=\"tab-content-main group-tab-content-main\">\r\n\t\t\t\t<div class=\"groups-section\" data-dojo-attach-point=\"groupsSection\">\r\n\t\t\t\t\t<div>${nls.groups}:</div>\r\n\t\t\t\t\t<select class=\"groups-select\" data-dojo-attach-point=\"groupsSelect\">\r\n\t\t\t\t\t\t<option value=\"nodata\">${nls.noneGroups}</option>\r\n\t\t\t\t\t</select>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div data-dojo-attach-point=\"groupSearch\" data-dojo-type=\"jimu/dijit/Search\" data-dojo-props='searchWhenInput:false' data-dojo-attach-event=\"onSearch:_onGroupSearch\" style=\"position:absolute;width:100%;top:0;\"></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"groupItemTable\" data-dojo-type=\"jimu/dijit/_ItemTable\" data-dojo-props='types:${_itemTypes},typeKeywords:${_typeKeywords}' style=\"top:85px;\"></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"tab-content public-tab\" data-dojo-attach-point=\"publicTabNode\">\r\n\t\t\t<div class=\"tab-content-main public-tab-content-main\">\r\n\t\t\t\t<div data-dojo-attach-point=\"publicSearch\" data-dojo-type=\"jimu/dijit/Search\" data-dojo-props='searchWhenInput:false' data-dojo-attach-event=\"onSearch:_onPublicSearch\" style=\"position:absolute;width:100%;top:0;\"></div>\r\n\t\t\t\t<div class=\"public-search-radios\">\r\n\t\t\t\t\t<fieldset id=\"publicSearchRaido\">\r\n\t\t\t\t\t\t<input data-dojo-attach-point=\"portalPublicRaido\" data-dojo-type=\"dijit/form/RadioButton\" \r\n\t\t\t\t\t\t\tdata-label-id=\"portalPublicRaido\" name=\"publicSearchRaido\" class=\"jimu-float-leading portal-public-radio\" />\r\n\t\t\t\t\t\t<label data-dojo-attach-point=\"portalPublicLabel\" data-label-for=\"portalPublicRaido\" class=\"jimu-float-leading portal-public-label\">Portal</label>\r\n\r\n\t\t\t\t\t\t<input data-dojo-attach-point=\"onlinePublicRaido\" data-dojo-type=\"dijit/form/RadioButton\"\r\n\t\t\t\t\t\t\tdata-label-id=\"onlinePublicRaido\" name=\"publicSearchRaido\" class=\"jimu-float-leading online-public-radio\" />\r\n\t\t\t\t\t\t<label data-dojo-attach-point=\"onlinePublicLabel\" data-label-for=\"onlinePublicRaido\" class=\"jimu-float-leading portal-public-label\">ArcGIS Online</label>\r\n\t\t\t\t\t</fieldset>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div data-dojo-attach-point=\"publicItemSection\" class=\"public-item-section\">\r\n\t\t\t\t\t<div data-dojo-attach-point=\"publicPortalItemTable\" data-dojo-type=\"jimu/dijit/_ItemTable\" data-dojo-props='types:${_itemTypes},typeKeywords:${_typeKeywords}'></div>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"publicOnlineItemTable\" data-dojo-type=\"jimu/dijit/_ItemTable\" data-dojo-props='types:${_itemTypes},typeKeywords:${_typeKeywords}'></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"signin-section\" data-dojo-attach-point=\"signinSection\" style=\"display:none;\">\r\n\t\t<div class=\"signin-tip\">${nls.signInTip}</div>\r\n\t</div>\r\n</div>",
'url:jimu/dijit/templates/_ItemTable.html':"<div>\r\n\t<div class=\"items-section all-items-section\" data-dojo-attach-point=\"allItemsSection\">\r\n\t\t<div class=\"items-table-div\" data-dojo-attach-point=\"allItemsTableDiv\" data-dojo-attach-event=\"onscroll:_onAllItemsSectionScroll\">\r\n\t\t\t<table class=\"items-table\" cellpadding=\"10\" data-dojo-attach-point=\"allItemsTable\" data-dojo-attach-event=\"onclick:_onItemsTableClicked\">\r\n\t\t\t\t<tbody data-dojo-attach-point=\"allItemTbody\"></tbody>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"jimu/dijit/LoadingIndicator\" data-dojo-attach-point=\"allItemsShelter\" data-dojo-props='hidden:true'></div>\r\n\t</div>\r\n\t<div class=\"items-section filtered-items-section\" data-dojo-attach-point=\"filteredItemsSection\">\r\n\t\t<div class=\"items-table-div\" data-dojo-attach-point=\"filteredItemsTableDiv\" data-dojo-attach-event=\"onscroll:_onFilteredItemsSectionScroll\">\r\n\t\t\t<table class=\"items-table\" cellpadding=\"10\" data-dojo-attach-point=\"filteredItemsTable\" data-dojo-attach-event=\"onclick:_onItemsTableClicked\">\r\n\t\t\t\t<tbody data-dojo-attach-point=\"filteredItemsTbody\"></tbody>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t<div class=\"search-none-tip-section\" data-dojo-attach-point=\"searchNoneTipSection\" style=\"display:none;\">\r\n\t\t\t<span class=\"search-none-icon jimu-icon jimu-icon-error\"></span>\r\n\t\t\t<span class=\"search-none-tip jimu-state-error-text\">${nls.searchNone}</span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"jimu/dijit/LoadingIndicator\" data-dojo-attach-point=\"filteredItemShelter\" data-dojo-props='hidden:true'></div>\r\n\t</div>\r\n</div>",
'url:jimu/dijit/templates/_BasicServiceChooserContent.html':"<div>\r\n\t<div class=\"content-section\">\r\n\t\t<table class=\"layout\">\r\n\t\t\t<colgroup>\r\n\t\t\t\t<col width=\"80px\" align=\"right\"></col>\r\n\t\t\t\t<col width=\"auto\"></col>\r\n\t\t\t\t<col width=\"170px\"></col>\r\n\t\t\t</colgroup>\r\n\t\t\t<tbody>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td class=\"first-td\">\r\n\t\t\t\t\t\t<span>URL:</span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<div data-dojo-attach-point=\"urlInput\" data-dojo-type=\"jimu/dijit/URLInput\" style=\"width:100%;\"></div>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<div class=\"jimu-btn jimu-state-disabled validate-btn jimu-float-trailing\" data-dojo-attach-point=\"btnValidate\" data-dojo-attach-event=\"onclick:_onBtnValidateClick\">${nls.validate}</div>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"exampleTr\" class=\"example-tr\">\r\n\t\t\t\t\t<td class=\"first-td\" style=\"padding-top:5px;\">\r\n\t\t\t\t\t\t<span title=\"${nls.example}:\">${nls.example}:</span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td data-dojo-attach-point=\"exampleTd\" colspan=\"2\" style=\"padding-top:5px;font-style:italic;color:#ccc;\">\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t</tbody>\r\n\t\t</table>\r\n\t\t<div class=\"service-browser-container\" data-dojo-attach-point=\"serviceBrowserContainer\">\r\n\t\t\t<div class=\"error-section\" data-dojo-attach-point=\"errorSection\">\r\n\t\t\t\t<span class=\"jimu-icon jimu-icon-error\"></span>\r\n\t\t\t\t<span class=\"error-message\" data-dojo-attach-point=\"errorNode\"></span>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"operations\">\r\n\t\t<div class=\"jimu-btn jimu-float-trailing cancel jimu-btn-vacation\" data-dojo-attach-event=\"onclick:_onBtnCancelClick\">${nls.cancel}</div>\r\n\t\t<div class=\"jimu-btn jimu-float-trailing jimu-state-disabled ok\" data-dojo-attach-point=\"btnOk\" data-dojo-attach-event=\"onclick:_onBtnOkClick\">${nls.ok}</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"loading\" data-dojo-type=\"jimu/dijit/LoadingIndicator\" data-dojo-props='hidden:true'></div>\r\n</div>",
'url:widgets/Search/setting/LocatorSourceSetting.html':"<div>\r\n  <div class=\"source-tips jimu-ellipsis\" title=\"${nls.locatorTips}\" data-dojo-attach-point=\"tipsNode\">\r\n    <em>${nls.locatorTips}</em>\r\n  </div>\r\n  <div class=\"source-url-section\">\r\n    <table class=\"source-table\" cellspacing=\"0\">\r\n      <tbody>\r\n        <tr>\r\n          <td class=\"first\">\r\n            <span class=\"source-label\">${nls.locatorUrl}</span>\r\n          </td>\r\n          <td class=\"second\">\r\n            <div data-dojo-attach-point=\"locatorUrl\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props=\"required:true,trim:true,disabled:true,style:{width:'100%'}\"></div>\r\n          </td>\r\n          <td class=\"third\">\r\n            <span class=\"jimu-btn\" title=\"${nls.set}\" data-dojo-attach-event=\"click:_onSetLocatorUrlClick\">${nls.set}</span>\r\n          </td>\r\n        </tr>\r\n        <tr>\r\n          <td class=\"first\"></td>\r\n          <td class=\"second\" colspan=\"2\">\r\n            <span data-dojo-attach-point=\"messageNode\" class=\"tip\"></span>\r\n          </td>\r\n        </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n  <div class=\"source-details-section\" data-dojo-attach-point=\"detailsSection\">\r\n    <table class=\"source-table\" cellspacing=\"0\">\r\n      <tbody>\r\n        <tr>\r\n          <td class=\"first\">${nls.locatorName}</td>\r\n          <td class=\"second\">\r\n            <input type=\"text\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"locatorName\" data-dojo-attach-event=\"Blur: _onLocatorNameBlur\"\r\n            placeHolder=\"${nls.locatorName}\"\r\n            required=\"true\" data-dojo-props='style:{width:\"100%\"}'/>\r\n          </td>\r\n        </tr>\r\n        <tr>\r\n          <td class=\"first\">${nls.placeholder}</td>\r\n          <td class=\"second\">\r\n            <input type=\"text\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"placeholder\"\r\n            data-dojo-attach-event=\"Blur: _onPlaceholderBlur\"\r\n            placeHolder=\"${nls.placeholder}\" data-dojo-props='style:{width:\"100%\"}'/>\r\n          </td>\r\n        </tr>\r\n        <tr class=\"hide-country-code-row country-code-row\" data-dojo-attach-point=\"countryCodeRow\">\r\n          <td class=\"first\">${nls.countryCode}</td>\r\n          <td class=\"second\">\r\n            <input type=\"text\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"countryCode\"\r\n            data-dojo-attach-event=\"Blur:_onCountryCodeBlur\"\r\n            placeHolder=\"${nls.countryCodeEg} USA,CHN\" data-dojo-props='style:{width:\"97%\"}'/>\r\n            <a class=\"jimu-float-trailing\" target=\"_blank\" href=\"https://developers.arcgis.com/rest/geocode/api-reference/geocode-coverage.htm\" style=\"line-height:30px;\">?</a>\r\n            <span class=\"example\">${nls.countryCodeHint}</span>\r\n          </td>\r\n        </tr>\r\n        <tr>\r\n          <td class=\"first\">\r\n            <span class=\"source-label\">${nls.maxSuggestions}</span>\r\n          </td>\r\n          <td class=\"second\">\r\n            <div class=\"source-tips\" title=\"${nls.locatorTips}\" data-dojo-attach-point=\"tipsNode\">\r\n              <em>${nls.locatorTips}</em>\r\n            </div>\r\n            <div data-dojo-attach-point=\"maxSuggestions\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props=\"constraints:{min:1,places:0},style:{width:'100%'},value:6\"></div>\r\n          </td>\r\n        </tr>\r\n        <tr>\r\n          <td class=\"first\">\r\n            <span class=\"source-label\">${nls.maxResults}</span>\r\n          </td>\r\n          <td class=\"second\">\r\n            <div data-dojo-attach-point=\"maxResults\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props=\"constraints:{min:1,places:0},style:{width:'100%'}\"></div>\r\n          </td>\r\n        </tr>\r\n        <tr>\r\n          <td class=\"first\">\r\n            <span class=\"source-label\">${nls.zoomScale}</span>\r\n          </td>\r\n          <td class=\"second\">\r\n            <span class=\"jimu-float-leading\" style=\"line-height:30px;\">1: </span>\r\n            <div class=\"jimu-float-trailing\" data-dojo-attach-point=\"zoomScale\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props=\"constraints:{min:1},style:{width:'96%'},value:50000\"></div>\r\n          </td>\r\n        </tr>\r\n      </tbody>\r\n    </table>\r\n    <table class=\"source-table\" cellspacing=\"0\">\r\n      <tbody>\r\n        <tr>\r\n          <td class=\"first\">\r\n            <div data-dojo-attach-point=\"searchInCurrentMapExtent\"></div>\r\n          </td>\r\n        </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n  <div data-dojo-attach-point=\"shelter\" data-dojo-type=\"jimu/dijit/LoadingShelter\" data-dojo-props=\"hidden:true\"></div>\r\n</div>\r\n",
'url:widgets/Search/setting/Setting.html':"<div>\r\n  <div class=\"sources-setting\">\r\n    <span class=\"group-label\">${nls.sourceSetting}</span>\r\n    <div class=\"instruction\">\r\n      <p>${nls.instruction2}</p>\r\n    </div>\r\n    <div class=\"dropdown-button\" role=\"button\">\r\n      <div class=\"button\">\r\n        <span class=\"button-text\">${nls.add}</span>\r\n      </div>\r\n      <ul class=\"dropdown-menu\" role=\"menu\" data-dojo-attach-event=\"click:_onMenuItemClick\">\r\n        <li class=\"dropdown-item\" type=\"query\">${nls.searchableLayer}</li>\r\n        <li class=\"dropdown-item\" type=\"locator\">${nls.geocoder}</li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"sources\">\r\n      <div class=\"source-list jimu-float-leading\">\r\n        <div class=\"source-list-table\" data-dojo-attach-point=\"sourceList\" style=\"100%\"></div>\r\n      </div>\r\n      <div class=\"source-setting jimu-float-trailing\" data-dojo-attach-point=\"sourceSettingNode\"></div>\r\n    </div>\r\n  </div>\r\n  <div class=\"general-setting\">\r\n    <span class=\"group-label\">${nls.generalSetting}</span>\r\n    <table class=\"general-setting-table\">\r\n      <tr>\r\n        <td class=\"first\">\r\n          <span class=\"source-label\">${nls.allPlaceholder}</span>\r\n        </td>\r\n        <td class=\"second\">\r\n          <div data-dojo-attach-point=\"allPlaceholder\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-event=\"Blur:_onAllPlaceholderBlur\" data-dojo-props=\"trim:true,style:{width:'100%'}\"></div>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n    <table class=\"general-setting-table\">\r\n      <tr>\r\n        <td class=\"first\">\r\n          <div data-dojo-attach-point=\"showInfoWindowOnSelect\"></div>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n  </div>\r\n  <div data-dojo-attach-point=\"shelter\" data-dojo-type=\"jimu/dijit/LoadingIndicator\" data-dojo-props=\"hidden:true\"></div>\r\n</div>\r\n",
'url:widgets/Search/setting/css/style.css':".jimu-widget-search-setting{overflow: hidden; width: 100%; margin-top: 20px; color: #596679; font-size: 14px;}.jimu-widget-search-setting .group-label{display: inline-block; margin-bottom: 10px; font-weight: bold;}.jimu-widget-search-setting .instruction{font-size: 12px;}.jimu-widget-search-setting .dropdown-button {margin: 8px 0; display: inline-block; position: relative; padding-left: 16px; color: #518dca; background: url(images/add_icon.png) no-repeat left; cursor: pointer;}.jimu-rtl .jimu-widget-search-setting .dropdown-button{padding-left: 0; padding-right: 16px; background-position: right;}.jimu-widget-search-setting .dropdown-button .dropdown-menu{position: absolute; display: none; list-style-type: none; top: 16px; left: 0; margin: 0; padding: 0; background: #fafafa; color: #7989a0; z-index: 999;}.jimu-rtl .jimu-widget-search-setting .dropdown-button .dropdown-menu{right: 0; left: auto;}.jimu-widget-search-setting .dropdown-button:hover .dropdown-menu{display: inline-block;}.jimu-widget-search-setting .dropdown-menu .dropdown-item{white-space: nowrap; height: 30px; padding: 0 25px; line-height: 30px;}.jimu-widget-search-setting .dropdown-menu .dropdown-item:hover{background: #edf2f5; color: #15a4fa;}.jimu-widget-search-setting .sources{height: 366px;}.jimu-widget-search-setting .source-list{width: 270px; height: 100%;}.jimu-widget-search-setting .source-setting{width: 660px; position: relative;}.jimu-widget-search-setting .source-setting .source-tips{display: none; font-size: 12px; color: #a0acbf;}.jimu-widget-search-setting .source-setting .source-tips-show{display: block;}.jimu-widget-search-setting .general-setting .group-label{margin-top: 20px; margin-bottom: 5px;}.jimu-widget-search-setting .source-table,.jimu-widget-search-setting .general-setting-table{width: 100%;}.jimu-widget-search-setting .search-fields-selector {display: inline-block; margin: 6px 0; width: 18px; height: 18px; background: url(images/selector.png) no-repeat center;}.jimu-widget-search-setting .jimu-widget-search-locator-source-setting .source-details-section .country-code-row td{padding-bottom: 35px; position: relative;}.jimu-widget-search-setting .jimu-widget-search-locator-source-setting .source-details-section .country-code-row .example{position: absolute; top: 35px; left: 0; font-size: 12px;}.jimu-rtl .jimu-widget-search-setting .jimu-widget-search-locator-source-setting .source-details-section .country-code-row .example{left: auto; right: 0;}.jimu-widget-search-setting .jimu-widget-search-locator-source-setting .source-details-section .hide-country-code-row {display: none;}.jimu-widget-search-setting .source-url-section .source-table > tbody > tr:first-child > td {padding-bottom: 5px;}.jimu-widget-search-setting .source-table > tbody > tr > td,.jimu-widget-search-setting .general-setting-table > tbody > tr > td{padding-bottom: 10px;}.jimu-widget-search-setting .source-table > tbody > tr > .first,.jimu-widget-search-setting .general-setting-table > tbody > tr > .first{width: auto; text-align: left; padding-right: 10px; white-space: nowrap;}.jimu-widget-search-setting .source-table > tbody > tr > .second{width:550px;}.jimu-widget-search-setting .general-setting-table > tbody > tr > .second{width: 650px;}.jimu-widget-search-setting .source-table > tbody > tr > .third{width: 70px; padding-left: 10px;}.jimu-rtl .jimu-widget-search-setting .source-table > tbody > tr > .first,.jimu-rtl .jimu-widget-search-setting .general-setting-table > tbody > tr > .first{padding-left: 10px; padding-right: 0;}.jimu-rtl .jimu-widget-search-setting .source-table > tbody > tr > .first,.jimu-rtl .jimu-widget-search-setting .general-setting-table > tbody > tr > .first{text-align: right; padding-left: 10px; padding-right: auto;}.jimu-rtl .jimu-widget-search-setting .source-table > tbody > tr > .third{padding-left: 0; padding-right: 10px;}.jimu-widget-query-source-setting .source-url-section .source-table > tbody > tr > .second {width: 455px;}.jimu-widget-search-setting .source-table .jimu-btn{padding: 0; line-height: 30px; width: 60px;}.jimu-widget-search-setting .source-table > tbody > tr > .second .tip{font-style: italic; font-size: 12px; color: #a0acbf; width: 100%; display: inline-block;}.jimu-widget-search-setting .source-table .error-message{color: #e84b4b !important;}.jimu-widget-search-setting .jimu-basic-service-chooser {width: auto;}.override-geocode-service-chooser-content {width: 580px !important; min-height: 150px !important;}.override-geocode-service-chooser-content .service-browser-container{display: none;}.jimu-widget-search-query-source-setting-fields .fields-checkbox{width: 167px; margin-bottom: 20px; color: #596679; font-size: 14px; margin-left: 30px;}.jimu-widget-search-query-source-setting-fields .fields-checkbox .label{width: 140px;}.jimu-rtl .jimu-widget-search-query-source-setting-fields .fields-checkbox{margin-right: 30px; margin-left: auto;}",
'*now':function(r){r(['dojo/i18n!*preload*widgets/Search/setting/nls/Setting*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]']);}
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
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/html",
    "dojo/_base/lang",
    "dojo/query",
    "dojo/on",
    "dojo/when",
    "esri/lang",
    "dijit/_WidgetsInTemplateMixin",
    "jimu/BaseWidgetSetting",
    // "jimu/LayerInfos/LayerInfos",
    "./utils",
    "jimu/utils",
    "./QuerySourceSetting",
    "./LocatorSourceSetting",
    "jimu/dijit/CheckBox",
    "jimu/dijit/SimpleTable",
    "jimu/dijit/LoadingIndicator"
  ],
  function(
    declare, array, html, lang, query, on, when, esriLang,
    _WidgetsInTemplateMixin, BaseWidgetSetting, /*LayerInfos,*/ utils, jimuUtils,
    QuerySourceSetting, LocatorSourceSetting, CheckBox, SimpleTable) {
    /*jshint maxlen: 150*/
    /*jshint smarttabs:true */

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-search-setting',
      _currentSourceSetting: null,

      postCreate: function() {
        this.inherited(arguments);

        this.sourceList = new SimpleTable({
          autoHeight: false,
          selectable: true,
          fields: [{
            name: "name",
            title: this.nls.name,
            width: "auto",
            type: "text",
            editable: false
          }, {
            name: "actions",
            title: "",
            width: "70px",
            type: "actions",
            actions: ["up", "down", "delete"]
          }]
        }, this.sourceList);
        html.setStyle(this.sourceList.domNode, 'height', '100%');
        this.sourceList.startup();
        this.own(on(this.sourceList, 'row-select', lang.hitch(this, this._onSourceItemSelected)));
        this.own(on(this.sourceList, 'row-delete', lang.hitch(this, this._onSourceItemRemoved)));

        this.showInfoWindowOnSelect = new CheckBox({
          checked: true,
          label: this.nls.showInfoWindowOnSelect
        }, this.showInfoWindowOnSelect);
      },

      startup: function() {
        this.inherited(arguments);

        if (!(this.config && this.config.sources)) {
          this.config.sources = [];
        }

        this.shelter.show();

        // LayerInfos.getInstance(this.map, this.map.itemInfo)
        //   .then(lang.hitch(this, function(layerInfosObj) {
        //     this.layerInfosObj = layerInfosObj;
        // utils.setMap(this.map);
        // utils.setLayerInfosObj(this.layerInfosObj);
        utils.setMap(this.sceneView.map);
        utils.setAppConfig(this.appConfig);
        when(utils.getConfigInfo(this.config)).then(lang.hitch(this, function(config) {
          if (!this.domNode) {
            return;
          }
          this.setConfig(config);
          this.shelter.hide();
        }));
        // }));
      },

      setConfig: function(config) {
        this.config = config;
        var sources = config.sources;
        this.allPlaceholder.set('value', jimuUtils.stripHTML(this.config.allPlaceholder));
        this.showInfoWindowOnSelect.setValue(
          esriLang.isDefined(this.config.showInfoWindowOnSelect) ?
          !!this.config.showInfoWindowOnSelect : true);
        array.forEach(sources, lang.hitch(this, function(source, index) {
          var addResult = this.sourceList.addRow({
            name: source.name || ""
          });

          if (addResult && addResult.success) {
            this._setRelatedConfig(addResult.tr, source);

            if (index === 0) {
              var firstTr = addResult.tr;
              setTimeout(lang.hitch(this, function() {
                this.sourceList.selectRow(addResult.tr);
                firstTr = null;
              }), 100);
            }
          } else {
            console.error("add row failed ", addResult);
          }
        }));
      },

      getConfig: function() {
        if (this._currentSourceSetting) {
          this._closeSourceSetting();
        }
        var config = {
          allPlaceholder: jimuUtils.stripHTML(this.allPlaceholder.get('value')),
          showInfoWindowOnSelect: this.showInfoWindowOnSelect.checked
        };
        var trs = this.sourceList.getRows();
        var sources = [];
        array.forEach(trs, lang.hitch(this, function(tr) {
          var source = this._getRelatedConfig(tr);
          delete source._definition;
          this._removeRelatedConfig(tr);

          sources.push(source);
        }));

        config.sources = sources;
        return config;
      },

      destroy: function() {
        utils.setAppConfig(null);

        this.inherited(arguments);
      },

      _onAllPlaceholderBlur: function() {
        this.allPlaceholder.set('value', jimuUtils.stripHTML(this.allPlaceholder.get('value')));
      },

      _onMenuItemClick: function(evt) {
        // check fields
        if (this._currentSourceSetting && !this._currentSourceSetting.isValidConfig()) {
          this._currentSourceSetting.showValidationTip();
          return;
        }

        var itemType = evt && evt.target && html.getAttr(evt.target, "type");
        if (itemType === "locator") {
          this._addNewLocator();
        } else if (itemType === "query") {
          this._addNewQuerySource();
        }
      },

      _addNewLocator: function() {
        this._createNewLocatorSourceSettingFromMenuItem({}, {});
      },

      _addNewQuerySource: function() {
        this._createNewQuerySourceSettingFromMenuItem({}, {});
      },

      _setRelatedConfig: function(tr, source) {
        query(tr).data('config', lang.clone(source));
      },

      _getRelatedConfig: function(tr) {
        return query(tr).data('config')[0];
      },

      _removeRelatedConfig: function(tr) {
        return query(tr).removeData('config');
      },

      _createNewLocatorSourceSettingFromMenuItem: function(setting, definition) {
        var locatorSetting = new LocatorSourceSetting({
          nls: this.nls
          // map: this.map
        });
        locatorSetting.setDefinition(definition);
        locatorSetting.setConfig({
          url: setting.url || "",
          name: setting.name || "",
          singleLineFieldName: setting.singleLineFieldName || "",
          placeholder: setting.placeholder || "",
          countryCode: setting.countryCode || "",
          zoomScale: setting.zoomScale || 50000,
          maxSuggestions: setting.maxSuggestions || 6,
          maxResults: setting.maxResults || 6,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          type: "locator"
        });
        locatorSetting._openLocatorChooser();

        locatorSetting.own(
          on(locatorSetting, 'select-locator-url-ok', lang.hitch(this, function(item) {
            var addResult = this.sourceList.addRow({
              name: item.name || "New Geocoder"
            }, this.sourceList.getRows().length);
            if (addResult && addResult.success) {
              if (this._currentSourceSetting) {
                this._closeSourceSetting();
              }
              locatorSetting.setRelatedTr(addResult.tr);
              locatorSetting.placeAt(this.sourceSettingNode);
              this.sourceList.selectRow(addResult.tr);

              this._currentSourceSetting = locatorSetting;
            }
          }))
        );
        locatorSetting.own(
          on(locatorSetting, 'reselect-locator-url-ok', lang.hitch(this, function(item) {
            var tr = this._currentSourceSetting.getRelatedTr();
            this.sourceList.editRow(tr, {
              name: item.name
            });
          }))
        );
        locatorSetting.own(
          on(locatorSetting, 'select-locator-url-cancel', lang.hitch(this, function() {
            if (this._currentSourceSetting !== locatorSetting) {// locator doesn't display in UI
              locatorSetting.destroy();
              locatorSetting = null;
            }
          }))
        );
      },

      _createNewLocatorSourceSettingFromSourceList: function(setting, definition, relatedTr) {
        if (this._currentSourceSetting) {
          this._closeSourceSetting();
        }

        this._currentSourceSetting = new LocatorSourceSetting({
          nls: this.nls
          // map: this.map
        });
        this._currentSourceSetting.setDefinition(definition);
        this._currentSourceSetting.setConfig({
          url: setting.url || "",
          name: setting.name || "",
          singleLineFieldName: setting.singleLineFieldName || "",
          placeholder: setting.placeholder || "",
          countryCode: setting.countryCode || "",
          zoomScale: setting.zoomScale || 50000,
          maxSuggestions: setting.maxSuggestions || 6,
          maxResults: setting.maxResults || 6,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          type: "locator"
        });
        this._currentSourceSetting.setRelatedTr(relatedTr);
        this._currentSourceSetting.placeAt(this.sourceSettingNode);

        this._currentSourceSetting.own(
          on(this._currentSourceSetting,
            'reselect-locator-url-ok',
            lang.hitch(this, function(item) {
              var tr = this._currentSourceSetting.getRelatedTr();
              this.sourceList.editRow(tr, {
                name: item.name
              });
            }))
        );
      },

      _closeSourceSetting: function() {
        var tr = this._currentSourceSetting.getRelatedTr();
        var source = this._currentSourceSetting.getConfig();
        source._definition = this._currentSourceSetting.getDefinition();
        this._setRelatedConfig(tr, source);
        this.sourceList.editRow(tr, {
          name: source.name
        });
        this._currentSourceSetting.destroy();
      },

      _createNewQuerySourceSettingFromMenuItem: function(setting, definition) {
        var querySetting = new QuerySourceSetting({
          nls: this.nls,
          map: this.sceneView.map,
          appConfig: this.appConfig
        });
        querySetting.setDefinition(definition);
        querySetting.setConfig({
          url: setting.url,
          name: setting.name || "",
          layerId: setting.layerId,
          placeholder: setting.placeholder || "",
          searchFields: setting.searchFields || [],
          displayField: setting.displayField || definition.displayField || "",
          exactMatch: !!setting.exactMatch,
          zoomScale: setting.zoomScale || 50000,
          maxSuggestions: setting.maxSuggestions || 6,
          maxResults: setting.maxResults || 6,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          type: "query"
        });
        querySetting._openQuerySourceChooser();

        querySetting.own(
          on(querySetting, 'select-query-source-ok', lang.hitch(this, function(item) {
            var addResult = this.sourceList.addRow({
              name: item.name
            }, 0);
            if (addResult && addResult.success) {
              if (this._currentSourceSetting) {
                this._closeSourceSetting();
              }
              querySetting.setRelatedTr(addResult.tr);
              querySetting.placeAt(this.sourceSettingNode);
              this.sourceList.selectRow(addResult.tr);

              this._currentSourceSetting = querySetting;
            }
          }))
        );
        querySetting.own(
          on(querySetting, 'reselect-query-source-ok', lang.hitch(this, function(item) {
            var tr = this._currentSourceSetting.getRelatedTr();
            this.sourceList.editRow(tr, {
              name: item.name
            });
          }))
        );
        querySetting.own(
          on(querySetting, 'select-query-source-cancel', lang.hitch(this, function() {
            if (this._currentSourceSetting !== querySetting) {// query source doesn't display in UI
              querySetting.destroy();
              querySetting = null;
            }
          }))
        );
      },

      _createNewQuerySourceSettingFromSourceList: function(setting, definition, relatedTr) {
        if (this._currentSourceSetting) {
          this._closeSourceSetting();
        }

        this._currentSourceSetting = new QuerySourceSetting({
          nls: this.nls,
          map: this.sceneView.map,
          appConfig: this.appConfig
        });
        this._currentSourceSetting.placeAt(this.sourceSettingNode);
        this._currentSourceSetting.setDefinition(definition);
        this._currentSourceSetting.setConfig({
          url: setting.url,
          name: setting.name || "",
          layerId: setting.layerId,
          placeholder: setting.placeholder || "",
          searchFields: setting.searchFields || [],
          displayField: setting.displayField || definition.displayField || "",
          exactMatch: !!setting.exactMatch,
          zoomScale: setting.zoomScale || 50000,
          maxSuggestions: setting.maxSuggestions || 6,
          maxResults: setting.maxResults || 6,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          type: "query"
        });
        this._currentSourceSetting.setRelatedTr(relatedTr);

        this._currentSourceSetting.own(
          on(this._currentSourceSetting, 'reselect-query-source', lang.hitch(this, function(item) {
            var tr = this._currentSourceSetting.getRelatedTr();
            this.sourceList.editRow(tr, {
              name: item.name
            });
          }))
        );
      },

      _onSourceItemRemoved: function(tr) {
        if (!this._currentSourceSetting) {
          return;
        }

        var currentTr = this._currentSourceSetting.getRelatedTr();
        if (currentTr === tr) {
          this._currentSourceSetting.destroy();
          this._currentSourceSetting = null;
        }
      },

      _onSourceItemSelected: function(tr) {
        var config = this._getRelatedConfig(tr);
        var currentTr = this._currentSourceSetting && this._currentSourceSetting.tr;
        if (!config || tr === currentTr) {
          return;
        }

        // check fields
        if (this._currentSourceSetting && !this._currentSourceSetting.isValidConfig()) {
          this._currentSourceSetting.showValidationTip();
          this.sourceList.selectRow(currentTr);
          return;
        }

        if (config.type === "query") {
          this._createNewQuerySourceSettingFromSourceList(config, config._definition || {}, tr);
        } else if (config.type === "locator") {
          this._createNewLocatorSourceSettingFromSourceList(config, config._definition || {}, tr);
        }
      }
    });
  });
