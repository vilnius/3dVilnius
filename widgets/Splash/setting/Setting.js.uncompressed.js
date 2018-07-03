// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'widgets/Splash/setting/ColorPickerEditor':function(){
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
},
'widgets/Splash/setting/BackgroundSelector':function(){
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
    "dojo/_base/lang",
    'dojo/on',
    'dojo/_base/html',
    './ColorPickerEditor',
    'jimu/dijit/ImageChooser',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./BackgroundSelector.html',
    'jimu/dijit/RadioBtn'
  ],
  function(declare, lang, on, html,
           ColorPickerEditor, ImageChooser,
           _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,
      nls: null,
      _defaultColor: '#485566',
      _defaultTransparency: 0,
      _defaultFillType: "fill",
      _imageMaxSize: (1024),//1M

      postCreate: function() {
        this.backgroundColorPicker = new ColorPickerEditor({nls: this.nls}, this.backgroundColorPickerEditor);
        this.backgroundColorPicker.startup();

        this.imageChooser = new ImageChooser({
          cropImage: false,
          showSelfImg: true,
          format: [ImageChooser.GIF, ImageChooser.JPEG, ImageChooser.PNG],
          goldenWidth: 160,
          goldenHeight: 90,
          maxSize: this._imageMaxSize,
          label: this.nls.chooseFile
        }, this.imageChooser);

        this.inherited(arguments);
      },
      startup: function() {
        this._initBgEvent();
        this._selectItem(this._defaultFillType);
        this.sizeType = this._defaultFillType;
        this.inherited(arguments);
      },

      _initBgEvent: function() {
        this.own(on(this.colorFillBtn, 'click', lang.hitch(this, function() {
          this._clickColorFillBtn();
        })));
        this.own(on(this.imageFillBtn, 'click', lang.hitch(this, function() {
          this._clickImageFillBtnBtn();
        })));

        this.own(on(this.imageChooser, 'imageChange', lang.hitch(this, function(data, fileProperty) {
          /* jshint unused: true */
          this._showFillsType();
          if (fileProperty) {
            this._setFileName(fileProperty.fileName);
          }
        })));

        this.own(on(this.fill, 'click', lang.hitch(this, function() {
          this.sizeType = "fill";
        })));
        this.own(on(this.fit, 'click', lang.hitch(this, function() {
          this.sizeType = "fit";
        })));
        this.own(on(this.stretch, 'click', lang.hitch(this, function() {
          this.sizeType = "stretch";
        })));
        this.own(on(this.center, 'click', lang.hitch(this, function() {
          this.sizeType = "center";
        })));
        this.own(on(this.tile, 'click', lang.hitch(this, function() {
          this.sizeType = "tile";
        })));
      },
      getValues: function() {
        var bg = {};
        bg.mode = this.mode;
        //if ("image" === this.mode) {
        //image
        bg.image = this.imageChooser.imageData;
        bg.type = this.sizeType;
        bg.fileName = encodeURIComponent(this.fileName.innerHTML);
        //} else {
        //color
        var bgColor = this.backgroundColorPicker.getValues();
        bg.color = bgColor.color;
        bg.transparency = bgColor.transparency;
        //}
        return bg;
      },
      _setColorPicker: function(bg) {
        var color = this._defaultColor;
        var transparency = this._defaultTransparency;
        if (bg) {
          color = bg.color;
          transparency = bg.transparency;
        }

        this.backgroundColorPicker.setValues({
          "color": color,
          "transparency": transparency
        });
      },
      setValues: function(config) {
        if ("undefined" !== typeof config.splash && "undefined" !== typeof config.splash.background) {
          var bg = config.splash.background;
          //if ("image" === bg.mode) {
          //this._setColorPicker();
          // } else {
          this._setColorPicker(bg);
          if (bg.image) {
            this.imageChooser.setDefaultSelfSrc(bg.image);
            this._showFillsType();
          }
          if (bg.fileName) {
            this.fileName.innerHTML = decodeURIComponent(bg.fileName);
          }
          if (bg.type) {
            this._selectItem(bg.type);
            this.sizeType = bg.type;
          }

          if ("image" === bg.mode) {
            this._selectItem("imageFillBtn");
            this._clickImageFillBtnBtn();
          } else {
            this._selectItem("colorFillBtn");
            this._clickColorFillBtn();
          }
          //}
          // } else {
          //   this._setColorPicker();
          //   this._selectItem("colorFillBtn");
          //   this._clickColorFillBtn();
        }
      },
      _selectItem: function(name) {
        var _radio = this[name];//registry.byNode(query('.jimu-radio', this[name])[0]);
        if (_radio && _radio.check) {
          _radio.check(true);
        }
      },
      _clickColorFillBtn: function() {
        html.addClass(this.colorFillOptions, 'hide');
        html.addClass(this.imageFillOptions, 'hide');
        html.removeClass(this.colorFillOptions, 'hide');
        this.mode = "color";
      },
      _clickImageFillBtnBtn: function() {
        html.addClass(this.colorFillOptions, 'hide');
        html.addClass(this.imageFillOptions, 'hide');
        html.removeClass(this.imageFillOptions, 'hide');
        this.mode = "image";
      },
      _hideFillsType: function() {
        html.addClass(this.fillsType, 'hide');
      },
      _showFillsType: function() {
        html.removeClass(this.fillsType, 'hide');
      },
      _setFileName: function(str) {
        this.fileName.innerHTML = str;
      }
    });
  });
},
'widgets/Splash/setting/SizeSelector':function(){
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
    "dojo/_base/lang",
    'dojo/on',
    'dojo/_base/html',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./SizeSelector.html',
    "dijit/form/NumberSpinner",
    'jimu/dijit/CheckBox'
  ],
  function(declare, lang, on, html,
           _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,
      nls: null,
      _size: null,
      _isCustom: false,

      postCreate: function() {
        this.inherited(arguments);
        this._initSize();
      },
      startup: function() {
        //TODO over screen piex
        this.inherited(arguments);
      },
      _initSize: function() {
        this.own(on(this.percent25, 'click', lang.hitch(this, function() {
          this._cleanSelected();
          html.addClass(this.percent25, "selected");
        })));
        this.own(on(this.percent50, 'click', lang.hitch(this, function() {
          this._cleanSelected();
          html.addClass(this.percent50, "selected");
        })));
        this.own(on(this.percent75, 'click', lang.hitch(this, function() {
          this._cleanSelected();
          html.addClass(this.percent75, "selected");
        })));
        this.own(on(this.percent100, 'click', lang.hitch(this, function() {
          this._cleanSelected();
          html.addClass(this.percent100, "selected");
        })));
        this.own(on(this.custom, 'click', lang.hitch(this, function() {
          this._cleanSelected();
          html.addClass(this.custom, "selected");
          this._setCustomSizeDisplay();
        })));
      },
      _setCustomSizeDisplay: function() {
        if (html.hasClass(this.custom, 'selected')) {
          html.setStyle(this.wh, "display", "block");
        } else {
          html.setStyle(this.wh, "display", "none");
        }
      },
      _cleanSelected: function() {
        html.removeClass(this.percent25, 'selected');
        html.removeClass(this.percent50, 'selected');
        html.removeClass(this.percent75, 'selected');
        html.removeClass(this.percent100, 'selected');
        html.removeClass(this.custom, 'selected');
        this._setCustomSizeDisplay();
      },

      getValue: function() {
        var val = {};
        val.mode = "percent";
        if (html.hasClass(this.percent25, 'selected')) {
          val.percent = "25%";
        } else if (html.hasClass(this.percent50, 'selected')) {
          val.percent = "50%";
        } else if (html.hasClass(this.percent75, 'selected')) {
          val.percent = "75%";
        } else if (html.hasClass(this.percent100, 'selected')) {
          val.percent = "100%";
        } else if (html.hasClass(this.custom, 'selected')) {
          val.mode = "wh";
        }
        //record wh values all the time
        val.wh = {};
        val.wh.w = this.width.getValue();
        val.wh.h = this.height.getValue();

        return val;
      },
      setValue: function(obj) {
        this._cleanSelected();
        if (typeof obj === "object") {
          if (typeof obj.wh !== "undefined") {
            this.width.setValue(obj.wh.w);
            this.height.setValue(obj.wh.h);
          }

          if (obj.mode === "wh") {
            html.addClass(this.custom, "selected");
          }

          if (obj.mode === "percent" && typeof obj.percent !== "undefined") {
            if (obj.percent === "25%") {
              html.addClass(this.percent25, "selected");
            } else if (obj.percent === "50%") {
              html.addClass(this.percent50, "selected");
            } else if (obj.percent === "75%") {
              html.addClass(this.percent75, "selected");
            } else {
              html.addClass(this.percent100, "selected");
            }
          }
        }
        this._setCustomSizeDisplay();
      }
    });
  });
},
'widgets/Splash/setting/AlignSelector':function(){
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
    "dojo/_base/lang",
    'dojo/on',
    'dojo/_base/html',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./AlignSelector.html',
    "dijit/form/NumberSpinner",
    'jimu/dijit/CheckBox'
  ],
  function(declare, lang, on, html,
           _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,
      nls: null,
      // _size: null,
      // _isCustom: false,

      postCreate: function() {
        this.inherited(arguments);
        this._initAlign();
      },
      startup: function() {
        this.inherited(arguments);
      },
      _initAlign: function() {
        this.own(on(this.top, 'click', lang.hitch(this, function() {
          this._cleanSelected();
          html.addClass(this.top, "selected");
        })));
        this.own(on(this.middle, 'click', lang.hitch(this, function() {
          this._cleanSelected();
          html.addClass(this.middle, "selected");
        })));
      },

      _cleanSelected: function() {
        html.removeClass(this.top, 'selected');
        html.removeClass(this.middle, 'selected');
      },

      getValue: function() {
        var val;
        if (html.hasClass(this.top, 'selected')) {
          val = "top";
        } else if (html.hasClass(this.middle, 'selected')) {
          val = "middle";
        }
        return val;
      },
      setValue: function(align) {
        this._cleanSelected();
        if (typeof align === "string") {
          if (align === "top") {
            html.addClass(this.top, "selected");
          } else if (align === "middle") {
            html.addClass(this.middle, "selected");
          }
        }
      }
    });
  });
},
'dijit/Editor':function(){
define([
	"require",
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/Deferred", // Deferred
	"dojo/i18n", // i18n.getLocalization
	"dojo/dom-attr", // domAttr.set
	"dojo/dom-class", // domClass.add
	"dojo/dom-geometry",
	"dojo/dom-style", // domStyle.set, get
	"dojo/keys", // keys.F1 keys.F15 keys.TAB
	"dojo/_base/lang", // lang.getObject lang.hitch
	"dojo/sniff", // has("ie") has("mac") has("webkit")
	"dojo/string", // string.substitute
	"dojo/topic", // topic.publish()
	"./_Container",
	"./Toolbar",
	"./ToolbarSeparator",
	"./layout/_LayoutWidget",
	"./form/ToggleButton",
	"./_editor/_Plugin",
	"./_editor/plugins/EnterKeyHandling",
	"./_editor/html",
	"./_editor/range",
	"./_editor/RichText",
	"./main", // dijit._scopeName
	"dojo/i18n!./_editor/nls/commands"
], function(require, array, declare, Deferred, i18n, domAttr, domClass, domGeometry, domStyle,
			keys, lang, has, string, topic,
			_Container, Toolbar, ToolbarSeparator, _LayoutWidget, ToggleButton,
			_Plugin, EnterKeyHandling, html, rangeapi, RichText, dijit){

	// module:
	//		dijit/Editor

	var Editor = declare("dijit.Editor", RichText, {
		// summary:
		//		A rich text Editing widget
		//
		// description:
		//		This widget provides basic WYSIWYG editing features, based on the browser's
		//		underlying rich text editing capability, accompanied by a toolbar (`dijit.Toolbar`).
		//		A plugin model is available to extend the editor's capabilities as well as the
		//		the options available in the toolbar.  Content generation may vary across
		//		browsers, and clipboard operations may have different results, to name
		//		a few limitations.  Note: this widget should not be used with the HTML
		//		&lt;TEXTAREA&gt; tag -- see dijit/_editor/RichText for details.

		// plugins: [const] Object[]
		//		A list of plugin names (as strings) or instances (as objects)
		//		for this widget.
		//
		//		When declared in markup, it might look like:
		//	|	plugins="['bold',{name:'dijit._editor.plugins.FontChoice', command:'fontName', generic:true}]"
		plugins: null,

		// extraPlugins: [const] Object[]
		//		A list of extra plugin names which will be appended to plugins array
		extraPlugins: null,

		constructor: function(/*===== params, srcNodeRef =====*/){
			// summary:
			//		Create the widget.
			// params: Object|null
			//		Initial settings for any of the attributes, except readonly attributes.
			// srcNodeRef: DOMNode
			//		The editor replaces the specified DOMNode.

			if(!lang.isArray(this.plugins)){
				this.plugins = ["undo", "redo", "|", "cut", "copy", "paste", "|", "bold", "italic", "underline", "strikethrough", "|",
					"insertOrderedList", "insertUnorderedList", "indent", "outdent", "|", "justifyLeft", "justifyRight", "justifyCenter", "justifyFull",
					EnterKeyHandling /*, "createLink"*/];
			}

			this._plugins = [];
			this._editInterval = this.editActionInterval * 1000;

			//IE will always lose focus when other element gets focus, while for FF and safari,
			//when no iframe is used, focus will be lost whenever another element gets focus.
			//For IE, we can connect to onBeforeDeactivate, which will be called right before
			//the focus is lost, so we can obtain the selected range. For other browsers,
			//no equivalent of onBeforeDeactivate, so we need to do two things to make sure
			//selection is properly saved before focus is lost: 1) when user clicks another
			//element in the page, in which case we listen to mousedown on the entire page and
			//see whether user clicks out of a focus editor, if so, save selection (focus will
			//only lost after onmousedown event is fired, so we can obtain correct caret pos.)
			//2) when user tabs away from the editor, which is handled in onKeyDown below.
			if(has("ie") || has("trident") || has("edge")){
				this.events.push("onBeforeDeactivate");
				this.events.push("onBeforeActivate");
			}
		},

		postMixInProperties: function(){
			// summary:
			//	Extension to make sure a deferred is in place before certain functions
			//	execute, like making sure all the plugins are properly inserted.

			// Set up a deferred so that the value isn't applied to the editor
			// until all the plugins load, needed to avoid timing condition
			// reported in #10537.
			this.setValueDeferred = new Deferred();
			this.inherited(arguments);
		},

		postCreate: function(){
			this.inherited(arguments);

			//for custom undo/redo, if enabled.
			this._steps = this._steps.slice(0);
			this._undoedSteps = this._undoedSteps.slice(0);

			if(lang.isArray(this.extraPlugins)){
				this.plugins = this.plugins.concat(this.extraPlugins);
			}

			this.commands = i18n.getLocalization("dijit._editor", "commands", this.lang);

			if(has("webkit")){
				// Disable selecting the entire editor by inadvertent double-clicks.
				// on buttons, title bar, etc.  Otherwise clicking too fast on
				// a button such as undo/redo selects the entire editor.
				domStyle.set(this.domNode, "KhtmlUserSelect", "none");
			}
		},

		startup: function(){

			this.inherited(arguments);

			if(!this.toolbar){
				// if we haven't been assigned a toolbar, create one
				this.toolbar = new Toolbar({
					ownerDocument: this.ownerDocument,
					dir: this.dir,
					lang: this.lang,
					"aria-label": this.id
				});
				this.header.appendChild(this.toolbar.domNode);
			}

			array.forEach(this.plugins, this.addPlugin, this);

			// Okay, denote the value can now be set.
			this.setValueDeferred.resolve(true);

			domClass.add(this.iframe.parentNode, "dijitEditorIFrameContainer");
			domClass.add(this.iframe, "dijitEditorIFrame");
			domAttr.set(this.iframe, "allowTransparency", true);

			this.toolbar.startup();
			this.onNormalizedDisplayChanged(); //update toolbar button status
		},

		destroy: function(){
			array.forEach(this._plugins, function(p){
				if(p && p.destroy){
					p.destroy();
				}
			});
			this._plugins = [];
			this.toolbar.destroyRecursive();
			delete this.toolbar;
			this.inherited(arguments);
		},
		addPlugin: function(/*String||Object||Function*/ plugin, /*Integer?*/ index){
			// summary:
			//		takes a plugin name as a string or a plugin instance and
			//		adds it to the toolbar and associates it with this editor
			//		instance. The resulting plugin is added to the Editor's
			//		plugins array. If index is passed, it's placed in the plugins
			//		array at that index. No big magic, but a nice helper for
			//		passing in plugin names via markup.
			// plugin:
			//		String, args object, plugin instance, or plugin constructor
			// args:
			//		This object will be passed to the plugin constructor
			// index:
			//		Used when creating an instance from
			//		something already in this.plugins. Ensures that the new
			//		instance is assigned to this.plugins at that index.
			var args = lang.isString(plugin) ? {name: plugin} : lang.isFunction(plugin) ? {ctor: plugin} : plugin;
			if(!args.setEditor){
				var o = {"args": args, "plugin": null, "editor": this};
				if(args.name){
					// search registry for a plugin factory matching args.name, if it's not there then
					// fallback to 1.0 API:
					// ask all loaded plugin modules to fill in o.plugin if they can (ie, if they implement args.name)
					// remove fallback for 2.0.
					if(_Plugin.registry[args.name]){
						o.plugin = _Plugin.registry[args.name](args);
					}else{
						topic.publish(dijit._scopeName + ".Editor.getPlugin", o);	// publish
					}
				}
				if(!o.plugin){
					try{
						// TODO: remove lang.getObject() call in 2.0
						var pc = args.ctor || lang.getObject(args.name) || require(args.name);
						if(pc){
							o.plugin = new pc(args);
						}
					}catch(e){
						throw new Error(this.id + ": cannot find plugin [" + args.name + "]");
					}
				}
				if(!o.plugin){
					throw new Error(this.id + ": cannot find plugin [" + args.name + "]");
				}
				plugin = o.plugin;
			}
			if(arguments.length > 1){
				this._plugins[index] = plugin;
			}else{
				this._plugins.push(plugin);
			}
			plugin.setEditor(this);
			if(lang.isFunction(plugin.setToolbar)){
				plugin.setToolbar(this.toolbar);
			}
		},

		//the following 2 functions are required to make the editor play nice under a layout widget, see #4070

		resize: function(size){
			// summary:
			//		Resize the editor to the specified size, see `dijit/layout/_LayoutWidget.resize()`
			if(size){
				// we've been given a height/width for the entire editor (toolbar + contents), calls layout()
				// to split the allocated size between the toolbar and the contents
				_LayoutWidget.prototype.resize.apply(this, arguments);
			}
			/*
			 else{
			 // do nothing, the editor is already laid out correctly.   The user has probably specified
			 // the height parameter, which was used to set a size on the iframe
			 }
			 */
		},
		layout: function(){
			// summary:
			//		Called from `dijit/layout/_LayoutWidget.resize()`.  This shouldn't be called directly
			// tags:
			//		protected

			// Converts the iframe (or rather the <div> surrounding it) to take all the available space
			// except what's needed for the header (toolbars) and footer (breadcrumbs, etc).
			// A class was added to the iframe container and some themes style it, so we have to
			// calc off the added margins and padding too. See tracker: #10662
			var areaHeight = (this._contentBox.h -
				(this.getHeaderHeight() + this.getFooterHeight() +
					domGeometry.getPadBorderExtents(this.iframe.parentNode).h +
					domGeometry.getMarginExtents(this.iframe.parentNode).h));
			this.editingArea.style.height = areaHeight + "px";
			if(this.iframe){
				this.iframe.style.height = "100%";
			}
			this._layoutMode = true;
		},

		_onIEMouseDown: function(/*Event*/ e){
			// summary:
			//		IE only to prevent 2 clicks to focus
			// tags:
			//		private
			var outsideClientArea;
			// IE 8's componentFromPoint is broken, which is a shame since it
			// was smaller code, but oh well.  We have to do this brute force
			// to detect if the click was scroller or not.
			var b = this.document.body;
			var clientWidth = b.clientWidth;
			var clientHeight = b.clientHeight;
			var clientLeft = b.clientLeft;
			var offsetWidth = b.offsetWidth;
			var offsetHeight = b.offsetHeight;
			var offsetLeft = b.offsetLeft;

			//Check for vertical scroller click.
			if(/^rtl$/i.test(b.dir || "")){
				if(clientWidth < offsetWidth && e.x > clientWidth && e.x < offsetWidth){
					// Check the click was between width and offset width, if so, scroller
					outsideClientArea = true;
				}
			}else{
				// RTL mode, we have to go by the left offsets.
				if(e.x < clientLeft && e.x > offsetLeft){
					// Check the click was between width and offset width, if so, scroller
					outsideClientArea = true;
				}
			}
			if(!outsideClientArea){
				// Okay, might be horiz scroller, check that.
				if(clientHeight < offsetHeight && e.y > clientHeight && e.y < offsetHeight){
					// Horizontal scroller.
					outsideClientArea = true;
				}
			}
			if(!outsideClientArea){
				delete this._cursorToStart; // Remove the force to cursor to start position.
				delete this._savedSelection; // new mouse position overrides old selection
				if(e.target.tagName == "BODY"){
					this.defer("placeCursorAtEnd");
				}
				this.inherited(arguments);
			}
		},
		onBeforeActivate: function(){
			this._restoreSelection();
		},
		onBeforeDeactivate: function(e){
			// summary:
			//		Called on IE right before focus is lost.   Saves the selected range.
			// tags:
			//		private
			if(this.customUndo){
				this.endEditing(true);
			}
			//in IE, the selection will be lost when other elements get focus,
			//let's save focus before the editor is deactivated
			if(e.target.tagName != "BODY"){
				this._saveSelection();
			}
			//console.log('onBeforeDeactivate',this);
		},

		/* beginning of custom undo/redo support */

		// customUndo: Boolean
		//		Whether we shall use custom undo/redo support instead of the native
		//		browser support. By default, we now use custom undo.  It works better
		//		than native browser support and provides a consistent behavior across
		//		browsers with a minimal performance hit.  We already had the hit on
		//		the slowest browser, IE, anyway.
		customUndo: true,

		// editActionInterval: Integer
		//		When using customUndo, not every keystroke will be saved as a step.
		//		Instead typing (including delete) will be grouped together: after
		//		a user stops typing for editActionInterval seconds, a step will be
		//		saved; if a user resume typing within editActionInterval seconds,
		//		the timeout will be restarted. By default, editActionInterval is 3
		//		seconds.
		editActionInterval: 3,

		beginEditing: function(cmd){
			// summary:
			//		Called to note that the user has started typing alphanumeric characters, if it's not already noted.
			//		Deals with saving undo; see editActionInterval parameter.
			// tags:
			//		private
			if(!this._inEditing){
				this._inEditing = true;
				this._beginEditing(cmd);
			}
			if(this.editActionInterval > 0){
				if(this._editTimer){
					this._editTimer.remove();
				}
				this._editTimer = this.defer("endEditing", this._editInterval);
			}
		},

		// TODO: declaring these in the prototype is meaningless, just create in the constructor/postCreate
		_steps: [],
		_undoedSteps: [],

		execCommand: function(cmd){
			// summary:
			//		Main handler for executing any commands to the editor, like paste, bold, etc.
			//		Called by plugins, but not meant to be called by end users.
			// tags:
			//		protected
			if(this.customUndo && (cmd == 'undo' || cmd == 'redo')){
				return this[cmd]();
			}else{
				if(this.customUndo){
					this.endEditing();
					this._beginEditing();
				}
				var r = this.inherited(arguments);
				if(this.customUndo){
					this._endEditing();
				}
				return r;
			}
		},

		_pasteImpl: function(){
			// summary:
			//		Over-ride of paste command control to make execCommand cleaner
			// tags:
			//		Protected
			return this._clipboardCommand("paste");
		},

		_cutImpl: function(){
			// summary:
			//		Over-ride of cut command control to make execCommand cleaner
			// tags:
			//		Protected
			return this._clipboardCommand("cut");
		},

		_copyImpl: function(){
			// summary:
			//		Over-ride of copy command control to make execCommand cleaner
			// tags:
			//		Protected
			return this._clipboardCommand("copy");
		},

		_clipboardCommand: function(cmd){
			// summary:
			//		Function to handle processing clipboard commands (or at least try to).
			// tags:
			//		Private
			var r;
			try{
				// Try to exec the superclass exec-command and see if it works.
				r = this.document.execCommand(cmd, false, null);
				if(has("webkit") && !r){ //see #4598: webkit does not guarantee clipboard support from js
					throw {}; // throw to show the warning
				}
			}catch(e){
				//Ticket #18467 removed the checks to specific codes
				// Warn user of platform limitation.  Cannot programmatically access clipboard. See ticket #4136
				var sub = string.substitute,
					accel = {cut: 'X', copy: 'C', paste: 'V'};
				alert(sub(this.commands.systemShortcut,
					[this.commands[cmd], sub(this.commands[has("mac") ? 'appleKey' : 'ctrlKey'], [accel[cmd]])]));
				r = false;
			}
			return r;
		},

		queryCommandEnabled: function(cmd){
			// summary:
			//		Returns true if specified editor command is enabled.
			//		Used by the plugins to know when to highlight/not highlight buttons.
			// tags:
			//		protected
			if(this.customUndo && (cmd == 'undo' || cmd == 'redo')){
				return cmd == 'undo' ? (this._steps.length > 1) : (this._undoedSteps.length > 0);
			}else{
				return this.inherited(arguments);
			}
		},
		_moveToBookmark: function(b){
			// summary:
			//		Selects the text specified in bookmark b
			// tags:
			//		private
			var bookmark = b.mark;
			var mark = b.mark;
			var col = b.isCollapsed;
			var r, sNode, eNode, sel;
			if(mark){
				if(has("ie") < 9 || (has("ie") === 9 && has("quirks"))){
					if(lang.isArray(mark)){
						// IE CONTROL, have to use the native bookmark.
						bookmark = [];
						array.forEach(mark, function(n){
							bookmark.push(rangeapi.getNode(n, this.editNode));
						}, this);
						this.selection.moveToBookmark({mark: bookmark, isCollapsed: col});
					}else{
						if(mark.startContainer && mark.endContainer){
							// Use the pseudo WC3 range API.  This works better for positions
							// than the IE native bookmark code.
							sel = rangeapi.getSelection(this.window);
							if(sel && sel.removeAllRanges){
								sel.removeAllRanges();
								r = rangeapi.create(this.window);
								sNode = rangeapi.getNode(mark.startContainer, this.editNode);
								eNode = rangeapi.getNode(mark.endContainer, this.editNode);
								if(sNode && eNode){
									// Okay, we believe we found the position, so add it into the selection
									// There are cases where it may not be found, particularly in undo/redo, when
									// IE changes the underlying DOM on us (wraps text in a <p> tag or similar.
									// So, in those cases, don't bother restoring selection.
									r.setStart(sNode, mark.startOffset);
									r.setEnd(eNode, mark.endOffset);
									sel.addRange(r);
								}
							}
						}
					}
				}else{//w3c range
					sel = rangeapi.getSelection(this.window);
					if(sel && sel.removeAllRanges){
						sel.removeAllRanges();
						r = rangeapi.create(this.window);
						sNode = rangeapi.getNode(mark.startContainer, this.editNode);
						eNode = rangeapi.getNode(mark.endContainer, this.editNode);
						if(sNode && eNode){
							// Okay, we believe we found the position, so add it into the selection
							// There are cases where it may not be found, particularly in undo/redo, when
							// formatting as been done and so on, so don't restore selection then.
							r.setStart(sNode, mark.startOffset);
							r.setEnd(eNode, mark.endOffset);
							sel.addRange(r);
						}
					}
				}
			}
		},
		_changeToStep: function(from, to){
			// summary:
			//		Reverts editor to "to" setting, from the undo stack.
			// tags:
			//		private
			this.setValue(to.text);
			var b = to.bookmark;
			if(!b){
				return;
			}
			this._moveToBookmark(b);
		},
		undo: function(){
			// summary:
			//		Handler for editor undo (ex: ctrl-z) operation
			// tags:
			//		private
			var ret = false;
			if(!this._undoRedoActive){
				this._undoRedoActive = true;
				this.endEditing(true);
				var s = this._steps.pop();
				if(s && this._steps.length > 0){
					this.focus();
					this._changeToStep(s, this._steps[this._steps.length - 1]);
					this._undoedSteps.push(s);
					this.onDisplayChanged();
					delete this._undoRedoActive;
					ret = true;
				}
				delete this._undoRedoActive;
			}
			return ret;
		},
		redo: function(){
			// summary:
			//		Handler for editor redo (ex: ctrl-y) operation
			// tags:
			//		private
			var ret = false;
			if(!this._undoRedoActive){
				this._undoRedoActive = true;
				this.endEditing(true);
				var s = this._undoedSteps.pop();
				if(s && this._steps.length > 0){
					this.focus();
					this._changeToStep(this._steps[this._steps.length - 1], s);
					this._steps.push(s);
					this.onDisplayChanged();
					ret = true;
				}
				delete this._undoRedoActive;
			}
			return ret;
		},
		endEditing: function(ignore_caret){
			// summary:
			//		Called to note that the user has stopped typing alphanumeric characters, if it's not already noted.
			//		Deals with saving undo; see editActionInterval parameter.
			// tags:
			//		private
			if(this._editTimer){
				this._editTimer = this._editTimer.remove();
			}
			if(this._inEditing){
				this._endEditing(ignore_caret);
				this._inEditing = false;
			}
		},

		_getBookmark: function(){
			// summary:
			//		Get the currently selected text
			// tags:
			//		protected
			var b = this.selection.getBookmark();
			var tmp = [];
			if(b && b.mark){
				var mark = b.mark;
				if(has("ie") < 9 || (has("ie") === 9 && has("quirks"))){
					// Try to use the pseudo range API on IE for better accuracy.
					var sel = rangeapi.getSelection(this.window);
					if(!lang.isArray(mark)){
						if(sel){
							var range;
							if(sel.rangeCount){
								range = sel.getRangeAt(0);
							}
							if(range){
								b.mark = range.cloneRange();
							}else{
								b.mark = this.selection.getBookmark();
							}
						}
					}else{
						// Control ranges (img, table, etc), handle differently.
						array.forEach(b.mark, function(n){
							tmp.push(rangeapi.getIndex(n, this.editNode).o);
						}, this);
						b.mark = tmp;
					}
				}
				try{
					if(b.mark && b.mark.startContainer){
						tmp = rangeapi.getIndex(b.mark.startContainer, this.editNode).o;
						b.mark = {startContainer: tmp,
							startOffset: b.mark.startOffset,
							endContainer: b.mark.endContainer === b.mark.startContainer ? tmp : rangeapi.getIndex(b.mark.endContainer, this.editNode).o,
							endOffset: b.mark.endOffset};
					}
				}catch(e){
					b.mark = null;
				}
			}
			return b;
		},
		_beginEditing: function(){
			// summary:
			//		Called when the user starts typing alphanumeric characters.
			//		Deals with saving undo; see editActionInterval parameter.
			// tags:
			//		private
			if(this._steps.length === 0){
				// You want to use the editor content without post filtering
				// to make sure selection restores right for the 'initial' state.
				// and undo is called.  So not using this.value, as it was 'processed'
				// and the line-up for selections may have been altered.
				this._steps.push({'text': html.getChildrenHtml(this.editNode), 'bookmark': this._getBookmark()});
			}
		},
		_endEditing: function(){
			// summary:
			//		Called when the user stops typing alphanumeric characters.
			//		Deals with saving undo; see editActionInterval parameter.
			// tags:
			//		private

			// Avoid filtering to make sure selections restore.
			var v = html.getChildrenHtml(this.editNode);

			this._undoedSteps = [];//clear undoed steps
			this._steps.push({text: v, bookmark: this._getBookmark()});
		},
		onKeyDown: function(e){
			// summary:
			//		Handler for onkeydown event.
			// tags:
			//		private

			//We need to save selection if the user TAB away from this editor
			//no need to call _saveSelection for IE, as that will be taken care of in onBeforeDeactivate
			if(!has("ie") && !this.iframe && e.keyCode == keys.TAB && !this.tabIndent){
				this._saveSelection();
			}
			if(!this.customUndo){
				this.inherited(arguments);
				return;
			}
			var k = e.keyCode;
			if(e.ctrlKey && !e.shiftKey && !e.altKey){//undo and redo only if the special right Alt + z/y are not pressed #5892
				if(k == 90 || k == 122){ //z, but also F11 key
					e.stopPropagation();
					e.preventDefault();
					this.undo();
					return;
				}else if(k == 89 || k == 121){ //y
					e.stopPropagation();
					e.preventDefault();
					this.redo();
					return;
				}
			}
			this.inherited(arguments);

			switch(k){
				case keys.ENTER:
				case keys.BACKSPACE:
				case keys.DELETE:
					this.beginEditing();
					break;
				case 88: //x
				case 86: //v
					if(e.ctrlKey && !e.altKey && !e.metaKey){
						this.endEditing();//end current typing step if any
						if(e.keyCode == 88){
							this.beginEditing('cut');
						}else{
							this.beginEditing('paste');
						}
						//use timeout to trigger after the paste is complete
						this.defer("endEditing", 1);
						break;
					}
				//pass through
				default:
					if(!e.ctrlKey && !e.altKey && !e.metaKey && (e.keyCode < keys.F1 || e.keyCode > keys.F15)){
						this.beginEditing();
						break;
					}
				//pass through
				case keys.ALT:
					this.endEditing();
					break;
				case keys.UP_ARROW:
				case keys.DOWN_ARROW:
				case keys.LEFT_ARROW:
				case keys.RIGHT_ARROW:
				case keys.HOME:
				case keys.END:
				case keys.PAGE_UP:
				case keys.PAGE_DOWN:
					this.endEditing(true);
					break;
				//maybe ctrl+backspace/delete, so don't endEditing when ctrl is pressed
				case keys.CTRL:
				case keys.SHIFT:
				case keys.TAB:
					break;
			}
		},
		_onBlur: function(){
			// summary:
			//		Called from focus manager when focus has moved away from this editor
			// tags:
			//		protected

			//this._saveSelection();
			this.inherited(arguments);
			this.endEditing(true);
		},
		_saveSelection: function(){
			// summary:
			//		Save the currently selected text in _savedSelection attribute
			// tags:
			//		private
			try{
				this._savedSelection = this._getBookmark();
			}catch(e){ /* Squelch any errors that occur if selection save occurs due to being hidden simultaneously. */
			}
		},
		_restoreSelection: function(){
			// summary:
			//		Re-select the text specified in _savedSelection attribute;
			//		see _saveSelection().
			// tags:
			//		private
			if(this._savedSelection){
				// Clear off cursor to start, we're deliberately going to a selection.
				delete this._cursorToStart;
				// only restore the selection if the current range is collapsed
				// if not collapsed, then it means the editor does not lose
				// selection and there is no need to restore it
				if(this.selection.isCollapsed()){
					this._moveToBookmark(this._savedSelection);
				}
				delete this._savedSelection;
			}
		},

		onClick: function(){
			// summary:
			//		Handler for when editor is clicked
			// tags:
			//		protected
			this.endEditing(true);
			this.inherited(arguments);
		},

		replaceValue: function(/*String*/ html){
			// summary:
			//		over-ride of replaceValue to support custom undo and stack maintenance.
			// tags:
			//		protected
			if(!this.customUndo){
				this.inherited(arguments);
			}else{
				if(this.isClosed){
					this.setValue(html);
				}else{
					this.beginEditing();
					if(!html){
						html = "&#160;";	// &nbsp;
					}
					this.setValue(html);
					this.endEditing();
				}
			}
		},

		_setDisabledAttr: function(/*Boolean*/ value){
			this.setValueDeferred.then(lang.hitch(this, function(){
				if((!this.disabled && value) || (!this._buttonEnabledPlugins && value)){
					// Disable editor: disable all enabled buttons and remember that list
					array.forEach(this._plugins, function(p){
						p.set("disabled", true);
					});
				}else if(this.disabled && !value){
					// Restore plugins to being active.
					array.forEach(this._plugins, function(p){
						p.set("disabled", false);
					});
				}
			}));
			this.inherited(arguments);
		},

		_setStateClass: function(){
			try{
				this.inherited(arguments);

				// Let theme set the editor's text color based on editor enabled/disabled state.
				// We need to jump through hoops because the main document (where the theme CSS is)
				// is separate from the iframe's document.
				if(this.document && this.document.body){
					domStyle.set(this.document.body, "color", domStyle.get(this.iframe, "color"));
				}
			}catch(e){ /* Squelch any errors caused by focus change if hidden during a state change */
			}
		}
	});

	// Register the "default plugins", ie, the built-in editor commands
	function simplePluginFactory(args){
		return new _Plugin({ command: args.name });
	}

	function togglePluginFactory(args){
		return new _Plugin({ buttonClass: ToggleButton, command: args.name });
	}

	lang.mixin(_Plugin.registry, {
		"undo": simplePluginFactory,
		"redo": simplePluginFactory,
		"cut": simplePluginFactory,
		"copy": simplePluginFactory,
		"paste": simplePluginFactory,
		"insertOrderedList": simplePluginFactory,
		"insertUnorderedList": simplePluginFactory,
		"indent": simplePluginFactory,
		"outdent": simplePluginFactory,
		"justifyCenter": simplePluginFactory,
		"justifyFull": simplePluginFactory,
		"justifyLeft": simplePluginFactory,
		"justifyRight": simplePluginFactory,
		"delete": simplePluginFactory,
		"selectAll": simplePluginFactory,
		"removeFormat": simplePluginFactory,
		"unlink": simplePluginFactory,
		"insertHorizontalRule": simplePluginFactory,

		"bold": togglePluginFactory,
		"italic": togglePluginFactory,
		"underline": togglePluginFactory,
		"strikethrough": togglePluginFactory,
		"subscript": togglePluginFactory,
		"superscript": togglePluginFactory,

		"|": function(){
			return new _Plugin({
				setEditor: function(editor){
					this.editor = editor;
					this.button = new ToolbarSeparator({ownerDocument: editor.ownerDocument});
				}
			});
		}
	});

	return Editor;
});

},
'dijit/Toolbar':function(){
define([
	"require",
	"dojo/_base/declare", // declare
	"dojo/has",
	"dojo/keys", // keys.LEFT_ARROW keys.RIGHT_ARROW
	"dojo/ready",
	"./_Widget",
	"./_KeyNavContainer",
	"./_TemplatedMixin"
], function(require, declare, has, keys, ready, _Widget, _KeyNavContainer, _TemplatedMixin){

	// module:
	//		dijit/Toolbar


	// Back compat w/1.6, remove for 2.0
	if(has("dijit-legacy-requires")){
		ready(0, function(){
			var requires = ["dijit/ToolbarSeparator"];
			require(requires);	// use indirection so modules not rolled into a build
		});
	}

	return declare("dijit.Toolbar", [_Widget, _TemplatedMixin, _KeyNavContainer], {
		// summary:
		//		A Toolbar widget, used to hold things like `dijit/Editor` buttons

		templateString:
			'<div class="dijit" role="toolbar" tabIndex="${tabIndex}" data-dojo-attach-point="containerNode">' +
			'</div>',

		baseClass: "dijitToolbar",

		_onLeftArrow: function(){
			this.focusPrev();
		},

		_onRightArrow: function(){
			this.focusNext();
		}
	});
});

},
'dijit/ToolbarSeparator':function(){
define([
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"./_Widget",
	"./_TemplatedMixin"
], function(declare, dom, _Widget, _TemplatedMixin){

	// module:
	//		dijit/ToolbarSeparator


	return declare("dijit.ToolbarSeparator", [_Widget, _TemplatedMixin], {
		// summary:
		//		A spacer between two `dijit.Toolbar` items

		templateString: '<div class="dijitToolbarSeparator dijitInline" role="presentation"></div>',

		buildRendering: function(){
			this.inherited(arguments);
			dom.setSelectable(this.domNode, false);
		},

		isFocusable: function(){
			// summary:
			//		This widget isn't focusable, so pass along that fact.
			// tags:
			//		protected
			return false;
		}
	});
});

},
'dijit/_editor/_Plugin':function(){
define([
	"dojo/_base/connect", // connect.connect
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.mixin, lang.hitch
	"../Destroyable",
	"../form/Button"
], function(connect, declare, lang, Destroyable, Button){

	// module:
	//		dijit/_editor/_Plugin

	var _Plugin = declare("dijit._editor._Plugin", Destroyable, {
		// summary:
		//		Base class for a "plugin" to the editor, which is usually
		//		a single button on the Toolbar and some associated code

		constructor: function(args){
			// summary:
			//		Create the plugin.
			// args: Object?
			//		Initial settings for any of the attributes.

			this.params = args || {};
			lang.mixin(this, this.params);
			this._attrPairNames = {};
		},

		// editor: [const] dijit.Editor
		//		Points to the parent editor
		editor: null,

		// iconClassPrefix: [const] String
		//		The CSS class name for the button node is formed from `iconClassPrefix` and `command`
		iconClassPrefix: "dijitEditorIcon",

		// button: dijit/_WidgetBase?
		//		Pointer to `dijit/form/Button` or other widget (ex: `dijit/form/FilteringSelect`)
		//		that is added to the toolbar to control this plugin.
		//		If not specified, will be created on initialization according to `buttonClass`
		button: null,

		// command: String
		//		String like "insertUnorderedList", "outdent", "justifyCenter", etc. that represents an editor command.
		//		Passed to editor.execCommand() if `useDefaultCommand` is true.
		command: "",

		// useDefaultCommand: Boolean
		//		If true, this plugin executes by calling Editor.execCommand() with the argument specified in `command`.
		useDefaultCommand: true,

		// buttonClass: Widget Class
		//		Class of widget (ex: dijit.form.Button or dijit/form/FilteringSelect)
		//		that is added to the toolbar to control this plugin.
		//		This is used to instantiate the button, unless `button` itself is specified directly.
		buttonClass: Button,

		// disabled: Boolean
		//		Flag to indicate if this plugin has been disabled and should do nothing
		//		helps control button state, among other things.  Set via the setter api.
		disabled: false,

		getLabel: function(/*String*/key){
			// summary:
			//		Returns the label to use for the button
			// tags:
			//		private
			return this.editor.commands[key];		// String
		},

		_initButton: function(){
			// summary:
			//		Initialize the button or other widget that will control this plugin.
			//		This code only works for plugins controlling built-in commands in the editor.
			// tags:
			//		protected extension
			if(this.command.length){
				var label = this.getLabel(this.command),
					editor = this.editor,
					className = this.iconClassPrefix + " " + this.iconClassPrefix + this.command.charAt(0).toUpperCase() + this.command.substr(1);
				if(!this.button){
					var props = lang.mixin({
						label: label,
						ownerDocument: editor.ownerDocument,
						dir: editor.dir,
						lang: editor.lang,
						showLabel: false,
						iconClass: className,
						dropDown: this.dropDown,
						tabIndex: "-1"
					}, this.params || {});

					// Avoid creating Button with a name like "dijit/editor/_plugins/ToggleDir", since that name becomes
					// a global object, and then if the ToggleDir plugin is referenced again, _Plugin.js will
					// find the <input> rather than the ToggleDir module.
					// Not necessary in 2.0 once the getObject() call is removed from _Plugin.js.
					delete props.name;

					this.button = new this.buttonClass(props);
				}
			}
			if(this.get("disabled") && this.button){
				this.button.set("disabled", this.get("disabled"));
			}
		},

		destroy: function(){
			if(this.dropDown){
				this.dropDown.destroyRecursive();
			}

			this.inherited(arguments);
		},

		connect: function(o, f, tf){
			// summary:
			//		Deprecated.  Use this.own() with dojo/on or dojo/aspect.instead.
			//
			//		Make a connect.connect() that is automatically disconnected when this plugin is destroyed.
			//		Similar to `dijit/_Widget.connect()`.
			// tags:
			//		protected deprecated

			this.own(connect.connect(o, f, this, tf));
		},

		updateState: function(){
			// summary:
			//		Change state of the plugin to respond to events in the editor.
			// description:
			//		This is called on meaningful events in the editor, such as change of selection
			//		or caret position (but not simple typing of alphanumeric keys).   It gives the
			//		plugin a chance to update the CSS of its button.
			//
			//		For example, the "bold" plugin will highlight/unhighlight the bold button depending on whether the
			//		characters next to the caret are bold or not.
			//
			//		Only makes sense when `useDefaultCommand` is true, as it calls Editor.queryCommandEnabled(`command`).
			var e = this.editor,
				c = this.command,
				checked, enabled;
			if(!e || !e.isLoaded || !c.length){
				return;
			}
			var disabled = this.get("disabled");
			if(this.button){
				try{
					enabled = !disabled && e.queryCommandEnabled(c);
					if(this.enabled !== enabled){
						this.enabled = enabled;
						this.button.set('disabled', !enabled);
					}
					if(enabled){
						if(typeof this.button.checked == 'boolean'){
							checked = e.queryCommandState(c);
							if(this.checked !== checked){
								this.checked = checked;
								this.button.set('checked', e.queryCommandState(c));
							}
						}
					}
				}catch(e){
					console.log(e); // FIXME: we shouldn't have debug statements in our code.  Log as an error?
				}
			}
		},

		setEditor: function(/*dijit/Editor*/ editor){
			// summary:
			//		Tell the plugin which Editor it is associated with.

			// TODO: refactor code to just pass editor to constructor.

			// FIXME: detach from previous editor!!
			this.editor = editor;

			// FIXME: prevent creating this if we don't need to (i.e., editor can't handle our command)
			this._initButton();

			// Processing for buttons that execute by calling editor.execCommand()
			if(this.button && this.useDefaultCommand){
				if(this.editor.queryCommandAvailable(this.command)){
					this.own(this.button.on("click",
						lang.hitch(this.editor, "execCommand", this.command, this.commandArg)
					));
				}else{
					// hide button because editor doesn't support command (due to browser limitations)
					this.button.domNode.style.display = "none";
				}
			}

			this.own(this.editor.on("NormalizedDisplayChanged", lang.hitch(this, "updateState")));
		},

		setToolbar: function(/*dijit/Toolbar*/ toolbar){
			// summary:
			//		Tell the plugin to add it's controller widget (often a button)
			//		to the toolbar.  Does nothing if there is no controller widget.

			// TODO: refactor code to just pass toolbar to constructor.

			if(this.button){
				toolbar.addChild(this.button);
			}
			// console.debug("adding", this.button, "to:", toolbar);
		},

		set: function(/* attribute */ name, /* anything */ value){
			// summary:
			//		Set a property on a plugin
			// name:
			//		The property to set.
			// value:
			//		The value to set in the property.
			// description:
			//		Sets named properties on a plugin which may potentially be handled by a
			//		setter in the plugin.
			//		For example, if the plugin has a properties "foo"
			//		and "bar" and a method named "_setFooAttr", calling:
			//	|	plugin.set("foo", "Howdy!");
			//		would be equivalent to writing:
			//	|	plugin._setFooAttr("Howdy!");
			//		and:
			//	|	plugin.set("bar", 3);
			//		would be equivalent to writing:
			//	|	plugin.bar = 3;
			//
			//		set() may also be called with a hash of name/value pairs, ex:
			//	|	plugin.set({
			//	|		foo: "Howdy",
			//	|		bar: 3
			//	|	})
			//		This is equivalent to calling set(foo, "Howdy") and set(bar, 3)
			if(typeof name === "object"){
				for(var x in name){
					this.set(x, name[x]);
				}
				return this;
			}
			var names = this._getAttrNames(name);
			if(this[names.s]){
				// use the explicit setter
				var result = this[names.s].apply(this, Array.prototype.slice.call(arguments, 1));
			}else{
				this._set(name, value);
			}
			return result || this;
		},

		get: function(name){
			// summary:
			//		Get a property from a plugin.
			// name:
			//		The property to get.
			// description:
			//		Get a named property from a plugin. The property may
			//		potentially be retrieved via a getter method. If no getter is defined, this
			//		just retrieves the object's property.
			//		For example, if the plugin has a properties "foo"
			//		and "bar" and a method named "_getFooAttr", calling:
			//	|	plugin.get("foo");
			//		would be equivalent to writing:
			//	|	plugin._getFooAttr();
			//		and:
			//	|	plugin.get("bar");
			//		would be equivalent to writing:
			//	|	plugin.bar;
			var names = this._getAttrNames(name);
			return this[names.g] ? this[names.g]() : this[name];
		},

		_setDisabledAttr: function(disabled){
			// summary:
			//		Function to set the plugin state and call updateState to make sure the
			//		button is updated appropriately.
			this._set("disabled", disabled);
			this.updateState();
		},

		_getAttrNames: function(name){
			// summary:
			//		Helper function for get() and set().
			//		Caches attribute name values so we don't do the string ops every time.
			// tags:
			//		private

			var apn = this._attrPairNames;
			if(apn[name]){
				return apn[name];
			}
			var uc = name.charAt(0).toUpperCase() + name.substr(1);
			return (apn[name] = {
				s: "_set" + uc + "Attr",
				g: "_get" + uc + "Attr"
			});
		},

		_set: function(/*String*/ name, /*anything*/ value){
			// summary:
			//		Helper function to set new value for specified attribute
			this[name] = value;
		}
	});

	// Hash mapping plugin name to factory, used for registering plugins
	_Plugin.registry = {};

	return _Plugin;
});

},
'dijit/_editor/plugins/EnterKeyHandling':function(){
define([
	"dojo/_base/declare", // declare
	"dojo/dom-construct", // domConstruct.destroy domConstruct.place
	"dojo/keys", // keys.ENTER
	"dojo/_base/lang",
	"dojo/on",
	"dojo/sniff", // has("ie") has("mozilla") has("webkit")
	"dojo/_base/window", // win.withGlobal
	"dojo/window", // winUtils.scrollIntoView
	"../_Plugin",
	"../RichText",
	"../range"
], function(declare, domConstruct, keys, lang, on, has, win, winUtils, _Plugin, RichText, rangeapi){

	// module:
	//		dijit/_editor/plugins/EnterKeyHandling

	return declare("dijit._editor.plugins.EnterKeyHandling", _Plugin, {
		// summary:
		//		This plugin tries to make all browsers behave consistently with regard to
		//		how ENTER behaves in the editor window.  It traps the ENTER key and alters
		//		the way DOM is constructed in certain cases to try to commonize the generated
		//		DOM and behaviors across browsers.
		//
		// description:
		//		This plugin has three modes:
		//
		//		- blockNodeForEnter=BR
		//		- blockNodeForEnter=DIV
		//		- blockNodeForEnter=P
		//
		//		In blockNodeForEnter=P, the ENTER key starts a new
		//		paragraph, and shift-ENTER starts a new line in the current paragraph.
		//		For example, the input:
		//
		//	|	first paragraph <shift-ENTER>
		//	|	second line of first paragraph <ENTER>
		//	|	second paragraph
		//
		//		will generate:
		//
		//	|	<p>
		//	|		first paragraph
		//	|		<br/>
		//	|		second line of first paragraph
		//	|	</p>
		//	|	<p>
		//	|		second paragraph
		//	|	</p>
		//
		//		In BR and DIV mode, the ENTER key conceptually goes to a new line in the
		//		current paragraph, and users conceptually create a new paragraph by pressing ENTER twice.
		//		For example, if the user enters text into an editor like this:
		//
		//	|		one <ENTER>
		//	|		two <ENTER>
		//	|		three <ENTER>
		//	|		<ENTER>
		//	|		four <ENTER>
		//	|		five <ENTER>
		//	|		six <ENTER>
		//
		//		It will appear on the screen as two 'paragraphs' of three lines each.  Markupwise, this generates:
		//
		//		BR:
		//	|		one<br/>
		//	|		two<br/>
		//	|		three<br/>
		//	|		<br/>
		//	|		four<br/>
		//	|		five<br/>
		//	|		six<br/>
		//
		//		DIV:
		//	|		<div>one</div>
		//	|		<div>two</div>
		//	|		<div>three</div>
		//	|		<div>&nbsp;</div>
		//	|		<div>four</div>
		//	|		<div>five</div>
		//	|		<div>six</div>

		// blockNodeForEnter: String
		//		This property decides the behavior of Enter key. It can be either P,
		//		DIV, BR, or empty (which means disable this feature). Anything else
		//		will trigger errors.  The default is 'BR'
		//
		//		See class description for more details.
		blockNodeForEnter: 'BR',

		constructor: function(args){
			if(args){
				if("blockNodeForEnter" in args){
					args.blockNodeForEnter = args.blockNodeForEnter.toUpperCase();
				}
				lang.mixin(this, args);
			}
		},

		setEditor: function(editor){
			// Overrides _Plugin.setEditor().
			if(this.editor === editor){
				return;
			}
			this.editor = editor;
			if(this.blockNodeForEnter == 'BR'){
				// While Moz has a mode tht mostly works, it's still a little different,
				// So, try to just have a common mode and be consistent.  Which means
				// we need to enable customUndo, if not already enabled.
				this.editor.customUndo = true;
				editor.onLoadDeferred.then(lang.hitch(this, function(d){
					this.own(on(editor.document, "keydown", lang.hitch(this, function(e){
						if(e.keyCode == keys.ENTER){
							// Just do it manually.  The handleEnterKey has a shift mode that
							// Always acts like <br>, so just use it.
							var ne = lang.mixin({}, e);
							ne.shiftKey = true;
							if(!this.handleEnterKey(ne)){
								e.stopPropagation();
								e.preventDefault();
							}
						}
					})));
					if(has("ie") >= 9 && has("ie") <= 10){
						this.own(on(editor.document, "paste", lang.hitch(this, function(e){
							setTimeout(lang.hitch(this, function(){
								// Use the old range/selection code to kick IE 9 into updating
								// its range by moving it back, then forward, one 'character'.
								var r = this.editor.document.selection.createRange();
								r.move('character', -1);
								r.select();
								r.move('character', 1);
								r.select();
							}), 0);
						})));
					}
					return d;
				}));
			}else if(this.blockNodeForEnter){
				// add enter key handler
				var h = lang.hitch(this, "handleEnterKey");
				editor.addKeyHandler(13, 0, 0, h); //enter
				editor.addKeyHandler(13, 0, 1, h); //shift+enter
				this.own(this.editor.on('KeyPressed', lang.hitch(this, 'onKeyPressed')));
			}
		},
		onKeyPressed: function(){
			// summary:
			//		Handler for after the user has pressed a key, and the display has been updated.
			//		Connected to RichText's onKeyPressed() method.
			// tags:
			//		private
			if(this._checkListLater){
				if(this.editor.selection.isCollapsed()){
					var liparent = this.editor.selection.getAncestorElement('LI');
					if(!liparent){
						// circulate the undo detection code by calling RichText::execCommand directly
						RichText.prototype.execCommand.call(this.editor, 'formatblock', this.blockNodeForEnter);
						// set the innerHTML of the new block node
						var block = this.editor.selection.getAncestorElement(this.blockNodeForEnter);
						if(block){
							block.innerHTML = this.bogusHtmlContent;
							if(has("ie") <= 9){
								// move to the start by moving backwards one char
								var r = this.editor.document.selection.createRange();
								r.move('character', -1);
								r.select();
							}
						}else{
							console.error('onKeyPressed: Cannot find the new block node'); // FIXME
						}
					}else{
						if(has("mozilla")){
							if(liparent.parentNode.parentNode.nodeName == 'LI'){
								liparent = liparent.parentNode.parentNode;
							}
						}
						var fc = liparent.firstChild;
						if(fc && fc.nodeType == 1 && (fc.nodeName == 'UL' || fc.nodeName == 'OL')){
							liparent.insertBefore(fc.ownerDocument.createTextNode('\xA0'), fc);
							var newrange = rangeapi.create(this.editor.window);
							newrange.setStart(liparent.firstChild, 0);
							var selection = rangeapi.getSelection(this.editor.window, true);
							selection.removeAllRanges();
							selection.addRange(newrange);
						}
					}
				}
				this._checkListLater = false;
			}
			if(this._pressedEnterInBlock){
				// the new created is the original current P, so we have previousSibling below
				if(this._pressedEnterInBlock.previousSibling){
					this.removeTrailingBr(this._pressedEnterInBlock.previousSibling);
				}
				delete this._pressedEnterInBlock;
			}
		},

		// bogusHtmlContent: [private] String
		//		HTML to stick into a new empty block
		bogusHtmlContent: '&#160;', // &nbsp;

		// blockNodes: [private] Regex
		//		Regex for testing if a given tag is a block level (display:block) tag
		blockNodes: /^(?:P|H1|H2|H3|H4|H5|H6|LI)$/,

		handleEnterKey: function(e){
			// summary:
			//		Handler for enter key events when blockNodeForEnter is DIV or P.
			// description:
			//		Manually handle enter key event to make the behavior consistent across
			//		all supported browsers. See class description for details.
			// tags:
			//		private

			var selection, range, newrange, startNode, endNode, brNode, doc = this.editor.document, br, rs, txt;
			if(e.shiftKey){        // shift+enter always generates <br>
				var parent = this.editor.selection.getParentElement();
				var header = rangeapi.getAncestor(parent, this.blockNodes);
				if(header){
					if(header.tagName == 'LI'){
						return true; // let browser handle
					}
					selection = rangeapi.getSelection(this.editor.window);
					range = selection.getRangeAt(0);
					if(!range.collapsed){
						range.deleteContents();
						selection = rangeapi.getSelection(this.editor.window);
						range = selection.getRangeAt(0);
					}
					if(rangeapi.atBeginningOfContainer(header, range.startContainer, range.startOffset)){
						br = doc.createElement('br');
						newrange = rangeapi.create(this.editor.window);
						header.insertBefore(br, header.firstChild);
						newrange.setStartAfter(br);
						selection.removeAllRanges();
						selection.addRange(newrange);
					}else if(rangeapi.atEndOfContainer(header, range.startContainer, range.startOffset)){
						newrange = rangeapi.create(this.editor.window);
						br = doc.createElement('br');
						header.appendChild(br);
						header.appendChild(doc.createTextNode('\xA0'));
						newrange.setStart(header.lastChild, 0);
						selection.removeAllRanges();
						selection.addRange(newrange);
					}else{
						rs = range.startContainer;
						if(rs && rs.nodeType == 3){
							// Text node, we have to split it.
							txt = rs.nodeValue;
							startNode = doc.createTextNode(txt.substring(0, range.startOffset));
							endNode = doc.createTextNode(txt.substring(range.startOffset));
							brNode = doc.createElement("br");

							if(endNode.nodeValue == "" && has("webkit")){
								endNode = doc.createTextNode('\xA0')
							}
							domConstruct.place(startNode, rs, "after");
							domConstruct.place(brNode, startNode, "after");
							domConstruct.place(endNode, brNode, "after");
							domConstruct.destroy(rs);
							newrange = rangeapi.create(this.editor.window);
							newrange.setStart(endNode, 0);
							selection.removeAllRanges();
							selection.addRange(newrange);
							return false;
						}
						return true; // let browser handle
					}
				}else{
					selection = rangeapi.getSelection(this.editor.window);
					if(selection.rangeCount){
						range = selection.getRangeAt(0);
						if(range && range.startContainer){
							if(!range.collapsed){
								range.deleteContents();
								selection = rangeapi.getSelection(this.editor.window);
								range = selection.getRangeAt(0);
							}
							rs = range.startContainer;
							if(rs && rs.nodeType == 3){
								// Text node, we have to split it.

								var offset = range.startOffset;
								if(rs.length < offset){
									//We are not splitting the right node, try to locate the correct one
									ret = this._adjustNodeAndOffset(rs, offset);
									rs = ret.node;
									offset = ret.offset;
								}
								txt = rs.nodeValue;

								startNode = doc.createTextNode(txt.substring(0, offset));
								endNode = doc.createTextNode(txt.substring(offset));
								brNode = doc.createElement("br");

								if(!endNode.length){
									// Create dummy text with a &nbsp to go after the BR, to prevent IE crash.
									// See https://bugs.dojotoolkit.org/ticket/12008 for details.
									endNode = doc.createTextNode('\xA0');
								}

								if(startNode.length){
									domConstruct.place(startNode, rs, "after");
								}else{
									startNode = rs;
								}
								domConstruct.place(brNode, startNode, "after");
								domConstruct.place(endNode, brNode, "after");
								domConstruct.destroy(rs);
								newrange = rangeapi.create(this.editor.window);
								newrange.setStart(endNode, 0);
								newrange.setEnd(endNode, endNode.length);
								selection.removeAllRanges();
								selection.addRange(newrange);
								this.editor.selection.collapse(true);
							}else{
								var targetNode;
								if(range.startOffset >= 0){
									targetNode = rs.childNodes[range.startOffset];
								}
								var brNode = doc.createElement("br");
								var endNode = doc.createTextNode('\xA0');
								if(!targetNode){
									rs.appendChild(brNode);
									rs.appendChild(endNode);
								}else{
									domConstruct.place(brNode, targetNode, "before");
									domConstruct.place(endNode, brNode, "after");
								}
								newrange = rangeapi.create(this.editor.window);
								newrange.setStart(endNode, 0);
								newrange.setEnd(endNode, endNode.length);
								selection.removeAllRanges();
								selection.addRange(newrange);
								this.editor.selection.collapse(true);
							}
							// \xA0 dummy text node remains, but is stripped before get("value")
							// by RichText._stripTrailingEmptyNodes().  Still, could we just use a plain
							// space (" ") instead?
						}
					}else{
						// don't change this: do not call this.execCommand, as that may have other logic in subclass
						RichText.prototype.execCommand.call(this.editor, 'inserthtml', '<br>');
					}
				}
				return false;
			}
			var _letBrowserHandle = true;

			// first remove selection
			selection = rangeapi.getSelection(this.editor.window);
			range = selection.getRangeAt(0);
			if(!range.collapsed){
				range.deleteContents();
				selection = rangeapi.getSelection(this.editor.window);
				range = selection.getRangeAt(0);
			}

			var block = rangeapi.getBlockAncestor(range.endContainer, null, this.editor.editNode);
			var blockNode = block.blockNode;

			// if this is under a LI or the parent of the blockNode is LI, just let browser to handle it
			if((this._checkListLater = (blockNode && (blockNode.nodeName == 'LI' || blockNode.parentNode.nodeName == 'LI')))){
				if(has("mozilla")){
					// press enter in middle of P may leave a trailing <br/>, let's remove it later
					this._pressedEnterInBlock = blockNode;
				}
				// if this li only contains spaces, set the content to empty so the browser will outdent this item
				if(/^(\s|&nbsp;|&#160;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|&#160;|\xA0)<\/span>)?(<br>)?$/.test(blockNode.innerHTML)){
					// empty LI node
					blockNode.innerHTML = '';
					if(has("webkit")){ // WebKit tosses the range when innerHTML is reset
						newrange = rangeapi.create(this.editor.window);
						newrange.setStart(blockNode, 0);
						selection.removeAllRanges();
						selection.addRange(newrange);
					}
					this._checkListLater = false; // nothing to check since the browser handles outdent
				}
				return true;
			}

			// text node directly under body, let's wrap them in a node
			if(!block.blockNode || block.blockNode === this.editor.editNode){
				try{
					RichText.prototype.execCommand.call(this.editor, 'formatblock', this.blockNodeForEnter);
				}catch(e2){ /*squelch FF3 exception bug when editor content is a single BR*/
				}
				// get the newly created block node
				// FIXME
				block = {blockNode: this.editor.selection.getAncestorElement(this.blockNodeForEnter),
					blockContainer: this.editor.editNode};
				if(block.blockNode){
					if(block.blockNode != this.editor.editNode &&
						(!(block.blockNode.textContent || block.blockNode.innerHTML).replace(/^\s+|\s+$/g, "").length)){
						this.removeTrailingBr(block.blockNode);
						return false;
					}
				}else{    // we shouldn't be here if formatblock worked
					block.blockNode = this.editor.editNode;
				}
				selection = rangeapi.getSelection(this.editor.window);
				range = selection.getRangeAt(0);
			}

			var newblock = doc.createElement(this.blockNodeForEnter);
			newblock.innerHTML = this.bogusHtmlContent;
			this.removeTrailingBr(block.blockNode);
			var endOffset = range.endOffset;
			var node = range.endContainer;
			if(node.length < endOffset){
				//We are not checking the right node, try to locate the correct one
				var ret = this._adjustNodeAndOffset(node, endOffset);
				node = ret.node;
				endOffset = ret.offset;
			}
			if(rangeapi.atEndOfContainer(block.blockNode, node, endOffset)){
				if(block.blockNode === block.blockContainer){
					block.blockNode.appendChild(newblock);
				}else{
					domConstruct.place(newblock, block.blockNode, "after");
				}
				_letBrowserHandle = false;
				// lets move caret to the newly created block
				newrange = rangeapi.create(this.editor.window);
				newrange.setStart(newblock, 0);
				selection.removeAllRanges();
				selection.addRange(newrange);
				if(this.editor.height){
					winUtils.scrollIntoView(newblock);
				}
			}else if(rangeapi.atBeginningOfContainer(block.blockNode,
				range.startContainer, range.startOffset)){
				domConstruct.place(newblock, block.blockNode, block.blockNode === block.blockContainer ? "first" : "before");
				if(newblock.nextSibling && this.editor.height){
					// position input caret - mostly WebKit needs this
					newrange = rangeapi.create(this.editor.window);
					newrange.setStart(newblock.nextSibling, 0);
					selection.removeAllRanges();
					selection.addRange(newrange);
					// browser does not scroll the caret position into view, do it manually
					winUtils.scrollIntoView(newblock.nextSibling);
				}
				_letBrowserHandle = false;
			}else{ //press enter in the middle of P/DIV/Whatever/
				if(block.blockNode === block.blockContainer){
					block.blockNode.appendChild(newblock);
				}else{
					domConstruct.place(newblock, block.blockNode, "after");
				}
				_letBrowserHandle = false;

				// Clone any block level styles.
				if(block.blockNode.style){
					if(newblock.style){
						if(block.blockNode.style.cssText){
							newblock.style.cssText = block.blockNode.style.cssText;
						}
					}
				}

				// Okay, we probably have to split.
				rs = range.startContainer;
				var firstNodeMoved;
				if(rs && rs.nodeType == 3){
					// Text node, we have to split it.
					var nodeToMove, tNode;
					endOffset = range.endOffset;
					if(rs.length < endOffset){
						//We are not splitting the right node, try to locate the correct one
						ret = this._adjustNodeAndOffset(rs, endOffset);
						rs = ret.node;
						endOffset = ret.offset;
					}

					txt = rs.nodeValue;
					startNode = doc.createTextNode(txt.substring(0, endOffset));
					endNode = doc.createTextNode(txt.substring(endOffset, txt.length));

					// Place the split, then remove original nodes.
					domConstruct.place(startNode, rs, "before");
					domConstruct.place(endNode, rs, "after");
					domConstruct.destroy(rs);

					// Okay, we split the text.  Now we need to see if we're
					// parented to the block element we're splitting and if
					// not, we have to split all the way up.  Ugh.
					var parentC = startNode.parentNode;
					while(parentC !== block.blockNode){
						var tg = parentC.tagName;
						var newTg = doc.createElement(tg);
						// Clone over any 'style' data.
						if(parentC.style){
							if(newTg.style){
								if(parentC.style.cssText){
									newTg.style.cssText = parentC.style.cssText;
								}
							}
						}
						// If font also need to clone over any font data.
						if(parentC.tagName === "FONT"){
							if(parentC.color){
								newTg.color = parentC.color;
							}
							if(parentC.face){
								newTg.face = parentC.face;
							}
							if(parentC.size){  // this check was necessary on IE
								newTg.size = parentC.size;
							}
						}

						nodeToMove = endNode;
						while(nodeToMove){
							tNode = nodeToMove.nextSibling;
							newTg.appendChild(nodeToMove);
							nodeToMove = tNode;
						}
						domConstruct.place(newTg, parentC, "after");
						startNode = parentC;
						endNode = newTg;
						parentC = parentC.parentNode;
					}

					// Lastly, move the split out tags to the new block.
					// as they should now be split properly.
					nodeToMove = endNode;
					if(nodeToMove.nodeType == 1 || (nodeToMove.nodeType == 3 && nodeToMove.nodeValue)){
						// Non-blank text and non-text nodes need to clear out that blank space
						// before moving the contents.
						newblock.innerHTML = "";
					}
					firstNodeMoved = nodeToMove;
					while(nodeToMove){
						tNode = nodeToMove.nextSibling;
						newblock.appendChild(nodeToMove);
						nodeToMove = tNode;
					}
				}

				//lets move caret to the newly created block
				newrange = rangeapi.create(this.editor.window);
				var nodeForCursor;
				var innerMostFirstNodeMoved = firstNodeMoved;
				if(this.blockNodeForEnter !== 'BR'){
					while(innerMostFirstNodeMoved){
						nodeForCursor = innerMostFirstNodeMoved;
						tNode = innerMostFirstNodeMoved.firstChild;
						innerMostFirstNodeMoved = tNode;
					}
					if(nodeForCursor && nodeForCursor.parentNode){
						newblock = nodeForCursor.parentNode;
						newrange.setStart(newblock, 0);
						selection.removeAllRanges();
						selection.addRange(newrange);
						if(this.editor.height){
							winUtils.scrollIntoView(newblock);
						}
						if(has("mozilla")){
							// press enter in middle of P may leave a trailing <br/>, let's remove it later
							this._pressedEnterInBlock = block.blockNode;
						}
					}else{
						_letBrowserHandle = true;
					}
				}else{
					newrange.setStart(newblock, 0);
					selection.removeAllRanges();
					selection.addRange(newrange);
					if(this.editor.height){
						winUtils.scrollIntoView(newblock);
					}
					if(has("mozilla")){
						// press enter in middle of P may leave a trailing <br/>, let's remove it later
						this._pressedEnterInBlock = block.blockNode;
					}
				}
			}
			return _letBrowserHandle;
		},

		_adjustNodeAndOffset: function(/*DomNode*/node, /*Int*/offset){
			// summary:
			//		In the case there are multiple text nodes in a row the offset may not be within the node.  If the offset is larger than the node length, it will attempt to find
			//		the next text sibling until it locates the text node in which the offset refers to
			// node:
			//		The node to check.
			// offset:
			//		The position to find within the text node
			// tags:
			//		private.
			while(node.length < offset && node.nextSibling && node.nextSibling.nodeType == 3){
				//Adjust the offset and node in the case of multiple text nodes in a row
				offset = offset - node.length;
				node = node.nextSibling;
			}
			return {"node": node, "offset": offset};
		},

		removeTrailingBr: function(container){
			// summary:
			//		If last child of container is a `<br>`, then remove it.
			// tags:
			//		private
			var para = /P|DIV|LI/i.test(container.tagName) ?
				container : this.editor.selection.getParentOfType(container, ['P', 'DIV', 'LI']);

			if(!para){
				return;
			}
			if(para.lastChild){
				if((para.childNodes.length > 1 && para.lastChild.nodeType == 3 && /^[\s\xAD]*$/.test(para.lastChild.nodeValue)) ||
					para.lastChild.tagName == 'BR'){

					domConstruct.destroy(para.lastChild);
				}
			}
			if(!para.childNodes.length){
				para.innerHTML = this.bogusHtmlContent;
			}
		}
	});

});

},
'dijit/_editor/RichText':function(){
define([
	"dojo/_base/array", // array.forEach array.indexOf array.some
	"dojo/_base/config", // config
	"dojo/_base/declare", // declare
	"dojo/_base/Deferred", // Deferred
	"dojo/dom", // dom.byId
	"dojo/dom-attr", // domAttr.set or get
	"dojo/dom-class", // domClass.add domClass.remove
	"dojo/dom-construct", // domConstruct.create domConstruct.destroy domConstruct.place
	"dojo/dom-geometry", // domGeometry.position
	"dojo/dom-style", // domStyle.getComputedStyle domStyle.set
	"dojo/_base/kernel", // kernel.deprecated, kernel.locale
	"dojo/keys", // keys.BACKSPACE keys.TAB
	"dojo/_base/lang", // lang.clone lang.hitch lang.isArray lang.isFunction lang.isString lang.trim
	"dojo/on", // on()
	"dojo/query", // query
	"dojo/domReady",
	"dojo/sniff", // has("ie") has("mozilla") has("opera") has("safari") has("webkit")
	"dojo/string",
	"dojo/topic", // topic.publish() (publish)
	"dojo/_base/unload", // unload
	"dojo/_base/url", // url
	"dojo/window", // winUtils.get()
	"../_Widget",
	"../_CssStateMixin",
	"../selection",
	"./range",
	"./html",
	"../focus",
	"../main"    // dijit._scopeName
], function(array, config, declare, Deferred, dom, domAttr, domClass, domConstruct, domGeometry, domStyle,
			kernel, keys, lang, on, query, domReady, has, string, topic, unload, _Url, winUtils,
			_Widget, _CssStateMixin, selectionapi, rangeapi, htmlapi, focus, dijit){

	// module:
	//		dijit/_editor/RichText

	// If you want to allow for rich text saving with back/forward actions, you must add a text area to your page with
	// the id==dijit._scopeName + "._editor.RichText.value" (typically "dijit/_editor/RichText.value). For example,
	// something like this will work:
	//
	//	<textarea id="dijit._editor.RichText.value" style="display:none;position:absolute;top:-100px;left:-100px;height:3px;width:3px;overflow:hidden;"></textarea>

	var RichText = declare("dijit._editor.RichText", [_Widget, _CssStateMixin], {
		// summary:
		//		dijit/_editor/RichText is the core of dijit.Editor, which provides basic
		//		WYSIWYG editing features.
		//
		// description:
		//		dijit/_editor/RichText is the core of dijit.Editor, which provides basic
		//		WYSIWYG editing features. It also encapsulates the differences
		//		of different js engines for various browsers.  Do not use this widget
		//		with an HTML &lt;TEXTAREA&gt; tag, since the browser unescapes XML escape characters,
		//		like &lt;.  This can have unexpected behavior and lead to security issues
		//		such as scripting attacks.
		//
		// tags:
		//		private

		constructor: function(params /*===== , srcNodeRef =====*/){
			// summary:
			//		Create the widget.
			// params: Object|null
			//		Initial settings for any of the widget attributes, except readonly attributes.
			// srcNodeRef: DOMNode
			//		The widget replaces the specified DOMNode.

			// contentPreFilters: Function(String)[]
			//		Pre content filter function register array.
			//		these filters will be executed before the actual
			//		editing area gets the html content.
			this.contentPreFilters = [];

			// contentPostFilters: Function(String)[]
			//		post content filter function register array.
			//		These will be used on the resulting html
			//		from contentDomPostFilters. The resulting
			//		content is the final html (returned by getValue()).
			this.contentPostFilters = [];

			// contentDomPreFilters: Function(DomNode)[]
			//		Pre content dom filter function register array.
			//		These filters are applied after the result from
			//		contentPreFilters are set to the editing area.
			this.contentDomPreFilters = [];

			// contentDomPostFilters: Function(DomNode)[]
			//		Post content dom filter function register array.
			//		These filters are executed on the editing area dom.
			//		The result from these will be passed to contentPostFilters.
			this.contentDomPostFilters = [];

			// editingAreaStyleSheets: dojo._URL[]
			//		array to store all the stylesheets applied to the editing area
			this.editingAreaStyleSheets = [];

			// Make a copy of this.events before we start writing into it, otherwise we
			// will modify the prototype which leads to bad things on pages w/multiple editors
			this.events = [].concat(this.events);

			this._keyHandlers = {};

			if(params && lang.isString(params.value)){
				this.value = params.value;
			}

			this.onLoadDeferred = new Deferred();
		},

		baseClass: "dijitEditor",

		// inheritWidth: Boolean
		//		whether to inherit the parent's width or simply use 100%
		inheritWidth: false,

		// focusOnLoad: [deprecated] Boolean
		//		Focus into this widget when the page is loaded
		focusOnLoad: false,

		// name: String?
		//		Specifies the name of a (hidden) `<textarea>` node on the page that's used to save
		//		the editor content on page leave.   Used to restore editor contents after navigating
		//		to a new page and then hitting the back button.
		name: "",

		// styleSheets: [const] String
		//		semicolon (";") separated list of css files for the editing area
		styleSheets: "",

		// height: String
		//		Set height to fix the editor at a specific height, with scrolling.
		//		By default, this is 300px.  If you want to have the editor always
		//		resizes to accommodate the content, use AlwaysShowToolbar plugin
		//		and set height="".  If this editor is used within a layout widget,
		//		set height="100%".
		height: "300px",

		// minHeight: String
		//		The minimum height that the editor should have.
		minHeight: "1em",

		// isClosed: [private] Boolean
		isClosed: true,

		// isLoaded: [private] Boolean
		isLoaded: false,

		// _SEPARATOR: [private] String
		//		Used to concat contents from multiple editors into a single string,
		//		so they can be saved into a single `<textarea>` node.  See "name" attribute.
		_SEPARATOR: "@@**%%__RICHTEXTBOUNDRY__%%**@@",

		// _NAME_CONTENT_SEP: [private] String
		//		USed to separate name from content.  Just a colon isn't safe.
		_NAME_CONTENT_SEP: "@@**%%:%%**@@",

		// onLoadDeferred: [readonly] dojo/promise/Promise
		//		Deferred which is fired when the editor finishes loading.
		//		Call myEditor.onLoadDeferred.then(callback) it to be informed
		//		when the rich-text area initialization is finalized.
		onLoadDeferred: null,

		// isTabIndent: Boolean
		//		Make tab key and shift-tab indent and outdent rather than navigating.
		//		Caution: sing this makes web pages inaccessible to users unable to use a mouse.
		isTabIndent: false,

		// disableSpellCheck: [const] Boolean
		//		When true, disables the browser's native spell checking, if supported.
		//		Works only in Firefox.
		disableSpellCheck: false,

		postCreate: function(){
			if("textarea" === this.domNode.tagName.toLowerCase()){
				console.warn("RichText should not be used with the TEXTAREA tag.  See dijit._editor.RichText docs.");
			}

			// Push in the builtin filters now, making them the first executed, but not over-riding anything
			// users passed in.  See: #6062
			this.contentPreFilters = [
				lang.trim,	// avoid IE10 problem hitting ENTER on last line when there's a trailing \n.
				lang.hitch(this, "_preFixUrlAttributes")
			].concat(this.contentPreFilters);
			if(has("mozilla")){
				this.contentPreFilters = [this._normalizeFontStyle].concat(this.contentPreFilters);
				this.contentPostFilters = [this._removeMozBogus].concat(this.contentPostFilters);
			}
			if(has("webkit")){
				// Try to clean up WebKit bogus artifacts.  The inserted classes
				// made by WebKit sometimes messes things up.
				this.contentPreFilters = [this._removeWebkitBogus].concat(this.contentPreFilters);
				this.contentPostFilters = [this._removeWebkitBogus].concat(this.contentPostFilters);
			}
			if(has("ie") || has("trident")){
				// IE generates <strong> and <em> but we want to normalize to <b> and <i>
				// Still happens in IE11, but doesn't happen with Edge.
				this.contentPostFilters = [this._normalizeFontStyle].concat(this.contentPostFilters);
				this.contentDomPostFilters = [lang.hitch(this, "_stripBreakerNodes")].concat(this.contentDomPostFilters);
			}
			this.contentDomPostFilters = [lang.hitch(this, "_stripTrailingEmptyNodes")].concat(this.contentDomPostFilters);
			this.inherited(arguments);

			topic.publish(dijit._scopeName + "._editor.RichText::init", this);
		},

		startup: function(){
			this.inherited(arguments);

			// Don't call open() until startup() because we need to be attached to the DOM, and also if we are the
			// child of a StackContainer, let StackContainer._setupChild() do DOM manipulations before iframe is
			// created, to avoid duplicate onload call.
			this.open();
			this.setupDefaultShortcuts();
		},

		setupDefaultShortcuts: function(){
			// summary:
			//		Add some default key handlers
			// description:
			//		Overwrite this to setup your own handlers. The default
			//		implementation does not use Editor commands, but directly
			//		executes the builtin commands within the underlying browser
			//		support.
			// tags:
			//		protected
			var exec = lang.hitch(this, function(cmd, arg){
				return function(){
					return !this.execCommand(cmd, arg);
				};
			});

			var ctrlKeyHandlers = {
				b: exec("bold"),
				i: exec("italic"),
				u: exec("underline"),
				a: exec("selectall"),
				s: function(){
					this.save(true);
				},
				m: function(){
					this.isTabIndent = !this.isTabIndent;
				},

				"1": exec("formatblock", "h1"),
				"2": exec("formatblock", "h2"),
				"3": exec("formatblock", "h3"),
				"4": exec("formatblock", "h4"),

				"\\": exec("insertunorderedlist")
			};

			if(!has("ie")){
				ctrlKeyHandlers.Z = exec("redo"); //FIXME: undo?
			}

			var key;
			for(key in ctrlKeyHandlers){
				this.addKeyHandler(key, true, false, ctrlKeyHandlers[key]);
			}
		},

		// events: [private] String[]
		//		 events which should be connected to the underlying editing area
		events: ["onKeyDown", "onKeyUp"], // onClick handled specially

		// captureEvents: [deprecated] String[]
		//		 Events which should be connected to the underlying editing
		//		 area, events in this array will be addListener with
		//		 capture=true.
		// TODO: looking at the code I don't see any distinction between events and captureEvents,
		// so get rid of this for 2.0 if not sooner
		captureEvents: [],

		_editorCommandsLocalized: false,
		_localizeEditorCommands: function(){
			// summary:
			//		When IE is running in a non-English locale, the API actually changes,
			//		so that we have to say (for example) danraku instead of p (for paragraph).
			//		Handle that here.
			// tags:
			//		private
			if(RichText._editorCommandsLocalized){
				// Use the already generate cache of mappings.
				this._local2NativeFormatNames = RichText._local2NativeFormatNames;
				this._native2LocalFormatNames = RichText._native2LocalFormatNames;
				return;
			}
			RichText._editorCommandsLocalized = true;
			RichText._local2NativeFormatNames = {};
			RichText._native2LocalFormatNames = {};
			this._local2NativeFormatNames = RichText._local2NativeFormatNames;
			this._native2LocalFormatNames = RichText._native2LocalFormatNames;
			//in IE, names for blockformat is locale dependent, so we cache the values here

			//put p after div, so if IE returns Normal, we show it as paragraph
			//We can distinguish p and div if IE returns Normal, however, in order to detect that,
			//we have to call this.document.selection.createRange().parentElement() or such, which
			//could slow things down. Leave it as it is for now
			var formats = ['div', 'p', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'address'];
			var localhtml = "", format, i = 0;
			while((format = formats[i++])){
				//append a <br> after each element to separate the elements more reliably
				if(format.charAt(1) !== 'l'){
					localhtml += "<" + format + "><span>content</span></" + format + "><br/>";
				}else{
					localhtml += "<" + format + "><li>content</li></" + format + "><br/>";
				}
			}
			// queryCommandValue returns empty if we hide editNode, so move it out of screen temporary
			// Also, IE9 does weird stuff unless we do it inside the editor iframe.
			var style = { position: "absolute", top: "0px", zIndex: 10, opacity: 0.01 };
			var div = domConstruct.create('div', {style: style, innerHTML: localhtml});
			this.ownerDocumentBody.appendChild(div);

			// IE9 has a timing issue with doing this right after setting
			// the inner HTML, so put a delay in.
			var inject = lang.hitch(this, function(){
				var node = div.firstChild;
				while(node){
					try{
						this.selection.selectElement(node.firstChild);
						var nativename = node.tagName.toLowerCase();
						this._local2NativeFormatNames[nativename] = document.queryCommandValue("formatblock");
						this._native2LocalFormatNames[this._local2NativeFormatNames[nativename]] = nativename;
						node = node.nextSibling.nextSibling;
						//console.log("Mapped: ", nativename, " to: ", this._local2NativeFormatNames[nativename]);
					}catch(e){ /*Sqelch the occasional IE9 error */
					}
				}
				domConstruct.destroy(div);
			});
			this.defer(inject);
		},

		open: function(/*DomNode?*/ element){
			// summary:
			//		Transforms the node referenced in this.domNode into a rich text editing
			//		node.
			// description:
			//		Sets up the editing area asynchronously. This will result in
			//		the creation and replacement with an iframe.
			// tags:
			//		private

			if(!this.onLoadDeferred || this.onLoadDeferred.fired >= 0){
				this.onLoadDeferred = new Deferred();
			}

			if(!this.isClosed){
				this.close();
			}
			topic.publish(dijit._scopeName + "._editor.RichText::open", this);

			if(arguments.length === 1 && element.nodeName){ // else unchanged
				this.domNode = element;
			}

			var dn = this.domNode;

			// Compute initial value of the editor
			var html;
			if(lang.isString(this.value)){
				// Allow setting the editor content programmatically instead of
				// relying on the initial content being contained within the target
				// domNode.
				html = this.value;
				dn.innerHTML = "";
			}else if(dn.nodeName && dn.nodeName.toLowerCase() == "textarea"){
				// if we were created from a textarea, then we need to create a
				// new editing harness node.
				var ta = (this.textarea = dn);
				this.name = ta.name;
				html = ta.value;
				dn = this.domNode = this.ownerDocument.createElement("div");
				dn.setAttribute('widgetId', this.id);
				ta.removeAttribute('widgetId');
				dn.cssText = ta.cssText;
				dn.className += " " + ta.className;
				domConstruct.place(dn, ta, "before");
				var tmpFunc = lang.hitch(this, function(){
					//some browsers refuse to submit display=none textarea, so
					//move the textarea off screen instead
					domStyle.set(ta, {
						display: "block",
						position: "absolute",
						top: "-1000px"
					});

					if(has("ie")){ //nasty IE bug: abnormal formatting if overflow is not hidden
						var s = ta.style;
						this.__overflow = s.overflow;
						s.overflow = "hidden";
					}
				});
				if(has("ie")){
					this.defer(tmpFunc, 10);
				}else{
					tmpFunc();
				}

				if(ta.form){
					var resetValue = ta.value;
					this.reset = function(){
						var current = this.getValue();
						if(current !== resetValue){
							this.replaceValue(resetValue);
						}
					};
					on(ta.form, "submit", lang.hitch(this, function(){
						// Copy value to the <textarea> so it gets submitted along with form.
						// FIXME: should we be calling close() here instead?
						domAttr.set(ta, 'disabled', this.disabled); // don't submit the value if disabled
						ta.value = this.getValue();
					}));
				}
			}else{
				html = htmlapi.getChildrenHtml(dn);
				dn.innerHTML = "";
			}
			this.value = html;

			// If we're a list item we have to put in a blank line to force the
			// bullet to nicely align at the top of text
			if(dn.nodeName && dn.nodeName === "LI"){
				dn.innerHTML = " <br>";
			}

			// Construct the editor div structure.
			this.header = dn.ownerDocument.createElement("div");
			dn.appendChild(this.header);
			this.editingArea = dn.ownerDocument.createElement("div");
			dn.appendChild(this.editingArea);
			this.footer = dn.ownerDocument.createElement("div");
			dn.appendChild(this.footer);

			if(!this.name){
				this.name = this.id + "_AUTOGEN";
			}

			// User has pressed back/forward button so we lost the text in the editor, but it's saved
			// in a hidden <textarea> (which contains the data for all the editors on this page),
			// so get editor value from there
			if(this.name !== "" && (!config["useXDomain"] || config["allowXdRichTextSave"])){
				var saveTextarea = dom.byId(dijit._scopeName + "._editor.RichText.value");
				if(saveTextarea && saveTextarea.value !== ""){
					var datas = saveTextarea.value.split(this._SEPARATOR), i = 0, dat;
					while((dat = datas[i++])){
						var data = dat.split(this._NAME_CONTENT_SEP);
						if(data[0] === this.name){
							this.value = data[1];
							datas = datas.splice(i, 1);
							saveTextarea.value = datas.join(this._SEPARATOR);
							break;
						}
					}
				}

				if(!RichText._globalSaveHandler){
					RichText._globalSaveHandler = {};
					unload.addOnUnload(function(){
						var id;
						for(id in RichText._globalSaveHandler){
							var f = RichText._globalSaveHandler[id];
							if(lang.isFunction(f)){
								f();
							}
						}
					});
				}
				RichText._globalSaveHandler[this.id] = lang.hitch(this, "_saveContent");
			}

			this.isClosed = false;

			var ifr = (this.editorObject = this.iframe = this.ownerDocument.createElement('iframe'));
			ifr.id = this.id + "_iframe";
			ifr.style.border = "none";
			ifr.style.width = "100%";
			if(this._layoutMode){
				// iframe should be 100% height, thus getting it's height from surrounding
				// <div> (which has the correct height set by Editor)
				ifr.style.height = "100%";
			}else{
				if(has("ie") >= 7){
					if(this.height){
						ifr.style.height = this.height;
					}
					if(this.minHeight){
						ifr.style.minHeight = this.minHeight;
					}
				}else{
					ifr.style.height = this.height ? this.height : this.minHeight;
				}
			}
			ifr.frameBorder = 0;
			ifr._loadFunc = lang.hitch(this, function(w){
				// This method is called when the editor is first loaded and also if the Editor's
				// dom node is repositioned. Unfortunately repositioning the Editor tends to
				// clear the iframe's contents, so we can't just no-op in that case.

				this.window = w;
				this.document = w.document;

				// instantiate class to access selected text in editor's iframe
				this.selection = new selectionapi.SelectionManager(w);

				if(has("ie")){
					this._localizeEditorCommands();
				}

				// Do final setup and set contents of editor.
				// Use get("value") rather than html in case _loadFunc() is being called for a second time
				// because editor's DOMNode was repositioned.
				this.onLoad(this.get("value"));
			});

			// Attach iframe to document, and set the initial (blank) content.
			var src = this._getIframeDocTxt().replace(/\\/g, "\\\\").replace(/'/g, "\\'"),
				s;

			// IE10 and earlier will throw an "Access is denied" error when attempting to access the parent frame if
			// document.domain has been set, unless the child frame also has the same document.domain set. In some
			// cases, we can only set document.domain while the document is being constructed using open/write/close;
			// attempting to set it later results in a different "This method can't be used in this context" error.
			// However, in at least IE9-10, sometimes the parent.window check will succeed and the access failure will
			// only happen later when trying to access frameElement, so there is an additional check and fix there
			// as well. See #17529
			if (has("ie") < 11) {
				s = 'javascript:document.open();try{parent.window;}catch(e){document.domain="' + document.domain + '";}' +
					'document.write(\'' + src + '\');document.close()';
			}
			else {
				s = "javascript: '" + src + "'";
			}

			// Attach to document before setting the content, to avoid problem w/iframe running in
			// wrong security context (IE9 and IE11), see #16633.
			this.editingArea.appendChild(ifr);
			ifr.src = s;

			// TODO: this is a guess at the default line-height, kinda works
			if(dn.nodeName === "LI"){
				dn.lastChild.style.marginTop = "-1.2em";
			}

			domClass.add(this.domNode, this.baseClass);
		},

		//static cache variables shared among all instance of this class
		_local2NativeFormatNames: {},
		_native2LocalFormatNames: {},

		_getIframeDocTxt: function(){
			// summary:
			//		Generates the boilerplate text of the document inside the iframe (ie, `<html><head>...</head><body/></html>`).
			//		Editor content (if not blank) should be added afterwards.
			// tags:
			//		private
			var _cs = domStyle.getComputedStyle(this.domNode);

			// Find any associated label element, aria-label, or aria-labelledby and get unescaped text.
			var title;
			if(this["aria-label"]){
				title = this["aria-label"];
			}else{
				var labelNode = query('label[for="' + this.id + '"]', this.ownerDocument)[0] ||
						dom.byId(this["aria-labelledby"], this.ownerDocument);
				if(labelNode){
					title = labelNode.textContent || labelNode.innerHTML || "";
				}
			}

			// The contents inside of <body>.  The real contents are set later via a call to setValue().
			// In auto-expand mode, need a wrapper div for AlwaysShowToolbar plugin to correctly
			// expand/contract the editor as the content changes.
			var html = "<div id='dijitEditorBody' role='textbox' aria-multiline='true' " +
					(title ? " aria-label='" + string.escape(title) + "'" : "") + "></div>";

			var font = [ _cs.fontWeight, _cs.fontSize, _cs.fontFamily ].join(" ");

			// line height is tricky - applying a units value will mess things up.
			// if we can't get a non-units value, bail out.
			var lineHeight = _cs.lineHeight;
			if(lineHeight.indexOf("px") >= 0){
				lineHeight = parseFloat(lineHeight) / parseFloat(_cs.fontSize);
				// console.debug(lineHeight);
			}else if(lineHeight.indexOf("em") >= 0){
				lineHeight = parseFloat(lineHeight);
			}else{
				// If we can't get a non-units value, just default
				// it to the CSS spec default of 'normal'.  Seems to
				// work better, esp on IE, than '1.0'
				lineHeight = "normal";
			}
			var userStyle = "";
			var self = this;
			this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/ig, function(match){
				match = match.replace(/^;/ig, "") + ';';
				var s = match.split(":")[0];
				if(s){
					s = lang.trim(s);
					s = s.toLowerCase();
					var i;
					var sC = "";
					for(i = 0; i < s.length; i++){
						var c = s.charAt(i);
						switch(c){
							case "-":
								i++;
								c = s.charAt(i).toUpperCase();
							default:
								sC += c;
						}
					}
					domStyle.set(self.domNode, sC, "");
				}
				userStyle += match + ';';
			});

			// Now that we have the title, also set it as the title attribute on the iframe
			this.iframe.setAttribute("title", title);

			// if this.lang is unset then use default value, to avoid invalid setting of lang=""
			var language = this.lang || kernel.locale.replace(/-.*/, "");

			return [
				"<!DOCTYPE html>",
				"<html lang='" + language + "'" + (this.isLeftToRight() ? "" : " dir='rtl'") + ">\n",
				"<head>\n",
				"<meta http-equiv='Content-Type' content='text/html'>\n",
				title ? "<title>" + string.escape(title) + "</title>" : "",
				"<style>\n",
				"\tbody,html {\n",
				"\t\tbackground:transparent;\n",
				"\t\tpadding: 1px 0 0 0;\n",
				"\t\tmargin: -1px 0 0 0;\n", // remove extraneous vertical scrollbar on safari and firefox
				"\t}\n",
				"\tbody,html,#dijitEditorBody { outline: none; }",

				// Set <body> to expand to full size of editor, so clicking anywhere will work.
				// Except in auto-expand mode, in which case the editor expands to the size of <body>.
				// Also determine how scrollers should be applied.  In autoexpand mode (height = "") no scrollers on y at all.
				// But in fixed height mode we want both x/y scrollers.
				// Scrollers go on <body> since it's been set to height: 100%.
				"html { height: 100%; width: 100%; overflow: hidden; }\n",	// scroll bar is on #dijitEditorBody, shouldn't be on <html>
				this.height ? "\tbody,#dijitEditorBody { height: 100%; width: 100%; overflow: auto; }\n" :
					"\tbody,#dijitEditorBody { min-height: " + this.minHeight + "; width: 100%; overflow-x: auto; overflow-y: hidden; }\n",

				// TODO: left positioning will cause contents to disappear out of view
				//	   if it gets too wide for the visible area
				"\tbody{\n",
				"\t\ttop:0px;\n",
				"\t\tleft:0px;\n",
				"\t\tright:0px;\n",
				"\t\tfont:", font, ";\n",
				((this.height || has("opera")) ? "" : "\t\tposition: fixed;\n"),
				"\t\tline-height:", lineHeight, ";\n",
				"\t}\n",
				"\tp{ margin: 1em 0; }\n",

				"\tli > ul:-moz-first-node, li > ol:-moz-first-node{ padding-top: 1.2em; }\n",
				// Can't set min-height in IE>=9, it puts layout on li, which puts move/resize handles.
				// Also can't set it on Edge, as it leads to strange behavior where hitting the return key
				// doesn't start a new list item.
				(has("ie") || has("trident") || has("edge") ? "" : "\tli{ min-height:1.2em; }\n"),
				"</style>\n",
				this._applyEditingAreaStyleSheets(), "\n",
				"</head>\n<body role='application'",
				title ? " aria-label='" + string.escape(title) + "'" : "",

				// Onload handler fills in real editor content.
				// On IE9, sometimes onload is called twice, and the first time frameElement is null (test_FullScreen.html)
				// On IE9-10, it is also possible that accessing window.parent in the initial creation of the
				// iframe DOM will succeed, but trying to access window.frameElement will fail, in which case we
				// *can* set the domain without a "This method can't be used in this context" error. See #17529
				"onload='try{frameElement && frameElement._loadFunc(window,document)}catch(e){document.domain=\"" + document.domain + "\";frameElement._loadFunc(window,document)}' ",
				"style='" + userStyle + "'>", html, "</body>\n</html>"
			].join(""); // String
		},

		_applyEditingAreaStyleSheets: function(){
			// summary:
			//		apply the specified css files in styleSheets
			// tags:
			//		private
			var files = [];
			if(this.styleSheets){
				files = this.styleSheets.split(';');
				this.styleSheets = '';
			}

			//empty this.editingAreaStyleSheets here, as it will be filled in addStyleSheet
			files = files.concat(this.editingAreaStyleSheets);
			this.editingAreaStyleSheets = [];

			var text = '', i = 0, url, ownerWindow = winUtils.get(this.ownerDocument);
			while((url = files[i++])){
				var abstring = (new _Url(ownerWindow.location, url)).toString();
				this.editingAreaStyleSheets.push(abstring);
				text += '<link rel="stylesheet" type="text/css" href="' + abstring + '"/>';
			}
			return text;
		},

		addStyleSheet: function(/*dojo/_base/url*/ uri){
			// summary:
			//		add an external stylesheet for the editing area
			// uri:
			//		Url of the external css file
			var url = uri.toString(), ownerWindow = winUtils.get(this.ownerDocument);

			//if uri is relative, then convert it to absolute so that it can be resolved correctly in iframe
			if(url.charAt(0) === '.' || (url.charAt(0) !== '/' && !uri.host)){
				url = (new _Url(ownerWindow.location, url)).toString();
			}

			if(array.indexOf(this.editingAreaStyleSheets, url) > -1){
//			console.debug("dijit/_editor/RichText.addStyleSheet(): Style sheet "+url+" is already applied");
				return;
			}

			this.editingAreaStyleSheets.push(url);
			this.onLoadDeferred.then(lang.hitch(this, function(){
				if(this.document.createStyleSheet){ //IE
					this.document.createStyleSheet(url);
				}else{ //other browser
					var head = this.document.getElementsByTagName("head")[0];
					var stylesheet = this.document.createElement("link");
					stylesheet.rel = "stylesheet";
					stylesheet.type = "text/css";
					stylesheet.href = url;
					head.appendChild(stylesheet);
				}
			}));
		},

		removeStyleSheet: function(/*dojo/_base/url*/ uri){
			// summary:
			//		remove an external stylesheet for the editing area
			var url = uri.toString(), ownerWindow = winUtils.get(this.ownerDocument);
			//if uri is relative, then convert it to absolute so that it can be resolved correctly in iframe
			if(url.charAt(0) === '.' || (url.charAt(0) !== '/' && !uri.host)){
				url = (new _Url(ownerWindow.location, url)).toString();
			}
			var index = array.indexOf(this.editingAreaStyleSheets, url);
			if(index === -1){
//			console.debug("dijit/_editor/RichText.removeStyleSheet(): Style sheet "+url+" has not been applied");
				return;
			}
			delete this.editingAreaStyleSheets[index];
			query('link[href="' + url + '"]', this.window.document).orphan();
		},

		// disabled: Boolean
		//		The editor is disabled; the text cannot be changed.
		disabled: false,

		_mozSettingProps: {'styleWithCSS': false},
		_setDisabledAttr: function(/*Boolean*/ value){
			value = !!value;
			this._set("disabled", value);
			if(!this.isLoaded){
				return;
			} // this method requires init to be complete
			var preventIEfocus = has("ie") && (this.isLoaded || !this.focusOnLoad);
			if(preventIEfocus){
				this.editNode.unselectable = "on";
			}
			this.editNode.contentEditable = !value;
			this.editNode.tabIndex = value ? "-1" : this.tabIndex;
			if(preventIEfocus){
				this.defer(function(){
					if(this.editNode){        // guard in case widget destroyed before timeout
						this.editNode.unselectable = "off";
					}
				});
			}
			if(has("mozilla") && !value && this._mozSettingProps){
				var ps = this._mozSettingProps;
				var n;
				for(n in ps){
					if(ps.hasOwnProperty(n)){
						try{
							this.document.execCommand(n, false, ps[n]);
						}catch(e2){
						}
					}
				}
			}
			this._disabledOK = true;
		},

		/* Event handlers
		 *****************/

		onLoad: function(/*String*/ html){
			// summary:
			//		Handler after the iframe finishes loading.
			// html: String
			//		Editor contents should be set to this value
			// tags:
			//		protected

			if(!this.window.__registeredWindow){
				this.window.__registeredWindow = true;
				this._iframeRegHandle = focus.registerIframe(this.iframe);
			}

			// there's a wrapper div around the content, see _getIframeDocTxt().
			this.editNode = this.document.body.firstChild;
			var _this = this;

			// Helper code so IE and FF skip over focusing on the <iframe> and just focus on the inner <div>.
			// See #4996 IE wants to focus the BODY tag.
			this.beforeIframeNode = domConstruct.place("<div tabIndex=-1></div>", this.iframe, "before");
			this.afterIframeNode = domConstruct.place("<div tabIndex=-1></div>", this.iframe, "after");
			this.iframe.onfocus = this.document.onfocus = function(){
				_this.editNode.focus();
			};

			this.focusNode = this.editNode; // for InlineEditBox


			var events = this.events.concat(this.captureEvents);
			var ap = this.iframe ? this.document : this.editNode;
			this.own.apply(this,
				array.map(events, function(item){
					var type = item.toLowerCase().replace(/^on/, "");
					return on(ap, type, lang.hitch(this, item));
				}, this)
			);

			this.own(
				// mouseup in the margin does not generate an onclick event
				on(ap, "mouseup", lang.hitch(this, "onClick"))
			);

			if(has("ie")){ // IE contentEditable
				this.own(on(this.document, "mousedown", lang.hitch(this, "_onIEMouseDown"))); // #4996 fix focus

				// give the node Layout on IE
				// TODO: this may no longer be needed, since we've reverted IE to using an iframe,
				// not contentEditable.   Removing it would also probably remove the need for creating
				// the extra <div> in _getIframeDocTxt()
				this.editNode.style.zoom = 1.0;
			}

			if(has("webkit")){
				//WebKit sometimes doesn't fire right on selections, so the toolbar
				//doesn't update right.  Therefore, help it out a bit with an additional
				//listener.  A mouse up will typically indicate a display change, so fire this
				//and get the toolbar to adapt.  Reference: #9532
				this._webkitListener = this.own(on(this.document, "mouseup", lang.hitch(this, "onDisplayChanged")))[0];
				this.own(on(this.document, "mousedown", lang.hitch(this, function(e){
					var t = e.target;
					if(t && (t === this.document.body || t === this.document)){
						// Since WebKit uses the inner DIV, we need to check and set position.
						// See: #12024 as to why the change was made.
						this.defer("placeCursorAtEnd");
					}
				})));
			}

			if(has("ie")){
				// Try to make sure 'hidden' elements aren't visible in edit mode (like browsers other than IE
				// do).  See #9103
				try{
					this.document.execCommand('RespectVisibilityInDesign', true, null);
				}catch(e){/* squelch */
				}
			}

			this.isLoaded = true;

			this.set('disabled', this.disabled); // initialize content to editable (or not)

			// Note that setValue() call will only work after isLoaded is set to true (above)

			// Set up a function to allow delaying the setValue until a callback is fired
			// This ensures extensions like dijit.Editor have a way to hold the value set
			// until plugins load (and do things like register filters).
			var setContent = lang.hitch(this, function(){
				this.setValue(html);

				// Tell app that the Editor has finished loading.  isFulfilled() check avoids spurious
				// console warning when this function is called repeatedly because Editor DOMNode was moved.
				if(this.onLoadDeferred && !this.onLoadDeferred.isFulfilled()){
					this.onLoadDeferred.resolve(true);
				}

				this.onDisplayChanged();
				if(this.focusOnLoad){
					// after the document loads, then set focus after updateInterval expires so that
					// onNormalizedDisplayChanged has run to avoid input caret issues
					domReady(lang.hitch(this, "defer", "focus", this.updateInterval));
				}
				// Save off the initial content now
				this.value = this.getValue(true);
			});
			if(this.setValueDeferred){
				this.setValueDeferred.then(setContent);
			}else{
				setContent();
			}
		},

		onKeyDown: function(/* Event */ e){
			// summary:
			//		Handler for keydown event
			// tags:
			//		protected

			// Modifier keys should not cause the onKeyPressed event because they do not cause any change to the
			// display
			if(e.keyCode === keys.SHIFT ||
			   e.keyCode === keys.ALT ||
			   e.keyCode === keys.META ||
			   e.keyCode === keys.CTRL){
				return true;
			}

			if(e.keyCode === keys.TAB && this.isTabIndent){
				//prevent tab from moving focus out of editor
				e.stopPropagation();
				e.preventDefault();

				// FIXME: this is a poor-man's indent/outdent. It would be
				// better if it added 4 "&nbsp;" chars in an undoable way.
				// Unfortunately pasteHTML does not prove to be undoable
				if(this.queryCommandEnabled((e.shiftKey ? "outdent" : "indent"))){
					this.execCommand((e.shiftKey ? "outdent" : "indent"));
				}
			}

			// Make tab and shift-tab skip over the <iframe>, going from the nested <div> to the toolbar
			// or next element after the editor
			if(e.keyCode == keys.TAB && !this.isTabIndent && !e.ctrlKey && !e.altKey){
				if(e.shiftKey){
					// focus the <iframe> so the browser will shift-tab away from it instead
					this.beforeIframeNode.focus();
				}else{
					// focus node after the <iframe> so the browser will tab away from it instead
					this.afterIframeNode.focus();
				}

				// Prevent onKeyPressed from firing in order to avoid triggering a display change event when the
				// editor is tabbed away; this fixes toolbar controls being inappropriately disabled in IE9+
				return true;
			}

			if(has("ie") < 9 && e.keyCode === keys.BACKSPACE && this.document.selection.type === "Control"){
				// IE has a bug where if a non-text object is selected in the editor,
				// hitting backspace would act as if the browser's back button was
				// clicked instead of deleting the object. see #1069
				e.stopPropagation();
				e.preventDefault();
				this.execCommand("delete");
			}

			if(has("ff")){
				if(e.keyCode === keys.PAGE_UP || e.keyCode === keys.PAGE_DOWN){
					if(this.editNode.clientHeight >= this.editNode.scrollHeight){
						// Stop the event to prevent firefox from trapping the cursor when there is no scroll bar.
						e.preventDefault();
					}
				}
			}

			var handlers = this._keyHandlers[e.keyCode],
				args = arguments;

			if(handlers && !e.altKey){
				array.some(handlers, function(h){
					// treat meta- same as ctrl-, for benefit of mac users
					if(!(h.shift ^ e.shiftKey) && !(h.ctrl ^ (e.ctrlKey || e.metaKey))){
						if(!h.handler.apply(this, args)){
							e.preventDefault();
						}
						return true;
					}
				}, this);
			}

			// function call after the character has been inserted
			this.defer("onKeyPressed", 1);

			return true;
		},

		onKeyUp: function(/*===== e =====*/){
			// summary:
			//		Handler for onkeyup event
			// tags:
			//		callback
		},

		setDisabled: function(/*Boolean*/ disabled){
			// summary:
			//		Deprecated, use set('disabled', ...) instead.
			// tags:
			//		deprecated
			kernel.deprecated('dijit.Editor::setDisabled is deprecated', 'use dijit.Editor::attr("disabled",boolean) instead', 2.0);
			this.set('disabled', disabled);
		},
		_setValueAttr: function(/*String*/ value){
			// summary:
			//		Registers that attr("value", foo) should call setValue(foo)
			this.setValue(value);
		},
		_setDisableSpellCheckAttr: function(/*Boolean*/ disabled){
			if(this.document){
				domAttr.set(this.document.body, "spellcheck", !disabled);
			}else{
				// try again after the editor is finished loading
				this.onLoadDeferred.then(lang.hitch(this, function(){
					domAttr.set(this.document.body, "spellcheck", !disabled);
				}));
			}
			this._set("disableSpellCheck", disabled);
		},

		addKeyHandler: function(/*String|Number*/ key, /*Boolean*/ ctrl, /*Boolean*/ shift, /*Function*/ handler){
			// summary:
			//		Add a handler for a keyboard shortcut
			// tags:
			//		protected

			if(typeof key == "string"){
				// Something like Ctrl-B.  Since using keydown event, we need to convert string to a number.
				key = key.toUpperCase().charCodeAt(0);
			}

			if(!lang.isArray(this._keyHandlers[key])){
				this._keyHandlers[key] = [];
			}

			this._keyHandlers[key].push({
				shift: shift || false,
				ctrl: ctrl || false,
				handler: handler
			});
		},

		onKeyPressed: function(){
			// summary:
			//		Handler for after the user has pressed a key, and the display has been updated.
			//		(Runs on a timer so that it runs after the display is updated)
			// tags:
			//		private
			this.onDisplayChanged(/*e*/); // can't pass in e
		},

		onClick: function(/*Event*/ e){
			// summary:
			//		Handler for when the user clicks.
			// tags:
			//		private

			// console.info('onClick',this._tryDesignModeOn);
			this.onDisplayChanged(e);
		},

		_onIEMouseDown: function(){
			// summary:
			//		IE only to prevent 2 clicks to focus
			// tags:
			//		protected

			if(!this.focused && !this.disabled){
				this.focus();
			}
		},

		_onBlur: function(e){
			// summary:
			//		Called from focus manager when focus has moved away from this editor
			// tags:
			//		protected

			// Workaround IE problem when you blur the browser windows while an editor is focused: IE hangs
			// when you focus editor #1, blur the browser window, and then click editor #0.  See #16939.
			// Note: Edge doesn't seem to have this problem.
			if(has("ie") || has("trident")){
				this.defer(function(){
					if(!focus.curNode){
						this.ownerDocumentBody.focus();
					}
				});
			}

			this.inherited(arguments);

			var newValue = this.getValue(true);
			if(newValue !== this.value){
				this.onChange(newValue);
			}
			this._set("value", newValue);
		},

		_onFocus: function(/*Event*/ e){
			// summary:
			//		Called from focus manager when focus has moved into this editor
			// tags:
			//		protected

			// console.info('_onFocus')
			if(!this.disabled){
				if(!this._disabledOK){
					this.set('disabled', false);
				}
				this.inherited(arguments);
			}
		},

		// TODO: remove in 2.0
		blur: function(){
			// summary:
			//		Remove focus from this instance.
			// tags:
			//		deprecated
			if(!has("ie") && this.window.document.documentElement && this.window.document.documentElement.focus){
				this.window.document.documentElement.focus();
			}else if(this.ownerDocumentBody.focus){
				this.ownerDocumentBody.focus();
			}
		},

		focus: function(){
			// summary:
			//		Move focus to this editor
			if(!this.isLoaded){
				this.focusOnLoad = true;
				return;
			}
			if(has("ie") < 9){
				//this.editNode.focus(); -> causes IE to scroll always (strict and quirks mode) to the top the Iframe
				// if we fire the event manually and let the browser handle the focusing, the latest
				// cursor position is focused like in FF
				this.iframe.fireEvent('onfocus', document.createEventObject()); // createEventObject/fireEvent only in IE < 11
			}else{
				// Firefox and chrome
				this.editNode.focus();
			}
		},

		// _lastUpdate: 0,
		updateInterval: 200,
		_updateTimer: null,
		onDisplayChanged: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		This event will be fired every time the display context
			//		changes and the result needs to be reflected in the UI.
			// description:
			//		If you don't want to have update too often,
			//		onNormalizedDisplayChanged should be used instead
			// tags:
			//		private

			// var _t=new Date();
			if(this._updateTimer){
				this._updateTimer.remove();
			}
			this._updateTimer = this.defer("onNormalizedDisplayChanged", this.updateInterval);

			// Technically this should trigger a call to watch("value", ...) registered handlers,
			// but getValue() is too slow to call on every keystroke so we don't.
		},
		onNormalizedDisplayChanged: function(){
			// summary:
			//		This event is fired every updateInterval ms or more
			// description:
			//		If something needs to happen immediately after a
			//		user change, please use onDisplayChanged instead.
			// tags:
			//		private
			delete this._updateTimer;
		},
		onChange: function(/*===== newContent =====*/){
			// summary:
			//		This is fired if and only if the editor loses focus and
			//		the content is changed.
		},
		_normalizeCommand: function(/*String*/ cmd, /*Anything?*/argument){
			// summary:
			//		Used as the advice function to map our
			//		normalized set of commands to those supported by the target
			//		browser.
			// tags:
			//		private

			var command = cmd.toLowerCase();
			if(command === "formatblock"){
				if(has("safari") && argument === undefined){
					command = "heading";
				}
			}else if(command === "hilitecolor" && !has("mozilla")){
				command = "backcolor";
			}

			return command;
		},

		_qcaCache: {},
		queryCommandAvailable: function(/*String*/ command){
			// summary:
			//		Tests whether a command is supported by the host. Clients
			//		SHOULD check whether a command is supported before attempting
			//		to use it, behaviour for unsupported commands is undefined.
			// command:
			//		The command to test for
			// tags:
			//		private

			// memoizing version. See _queryCommandAvailable for computing version
			var ca = this._qcaCache[command];
			if(ca !== undefined){
				return ca;
			}
			return (this._qcaCache[command] = this._queryCommandAvailable(command));
		},

		_queryCommandAvailable: function(/*String*/ command){
			// summary:
			//		See queryCommandAvailable().
			// tags:
			//		private

			switch(command.toLowerCase()){
				case "bold":
				case "italic":
				case "underline":
				case "subscript":
				case "superscript":
				case "fontname":
				case "fontsize":
				case "forecolor":
				case "hilitecolor":
				case "justifycenter":
				case "justifyfull":
				case "justifyleft":
				case "justifyright":
				case "delete":
				case "selectall":
				case "toggledir":

				case "createlink":
				case "unlink":
				case "removeformat":
				case "inserthorizontalrule":
				case "insertimage":
				case "insertorderedlist":
				case "insertunorderedlist":
				case "indent":
				case "outdent":
				case "formatblock":
				case "inserthtml":
				case "undo":
				case "redo":
				case "strikethrough":
				case "tabindent":

				case "cut":
				case "copy":
				case "paste":
					return true;

				// Note: This code path is apparently never called.  Not sure if it should return true or false
				// for Edge.
				case "blockdirltr":
				case "blockdirrtl":
				case "dirltr":
				case "dirrtl":
				case "inlinedirltr":
				case "inlinedirrtl":
					return has("ie") || has("trident") || has("edge");

				// Note: This code path is apparently never called, not even by the dojox/editor table plugins.
				// There's also an _inserttableEnabledImpl() method that's also never called.
				// Previously this code returned truthy for IE and mozilla, but false for chrome/safari, so
				// leaving it that way just in case.
				case "inserttable":
				case "insertcell":
				case "insertcol":
				case "insertrow":
				case "deletecells":
				case "deletecols":
				case "deleterows":
				case "mergecells":
				case "splitcell":
					return !has("webkit");

				default:
					return false;
			}
		},

		execCommand: function(/*String*/ command, argument){
			// summary:
			//		Executes a command in the Rich Text area
			// command:
			//		The command to execute
			// argument:
			//		An optional argument to the command
			// tags:
			//		protected
			var returnValue;

			//focus() is required for IE to work
			//In addition, focus() makes sure after the execution of
			//the command, the editor receives the focus as expected
			if(this.focused){
				// put focus back in the iframe, unless focus has somehow been shifted out of the editor completely
				this.focus();
			}

			command = this._normalizeCommand(command, argument);

			if(argument !== undefined){
				if(command === "heading"){
					throw new Error("unimplemented");
				}else if(command === "formatblock" && (has("ie") || has("trident"))){
					// See http://stackoverflow.com/questions/10741831/execcommand-formatblock-headings-in-ie.
					// Not necessary on Edge though.
					argument = '<' + argument + '>';
				}
			}

			//Check to see if we have any over-rides for commands, they will be functions on this
			//widget of the form _commandImpl.  If we don't, fall through to the basic native
			//exec command of the browser.
			var implFunc = "_" + command + "Impl";
			if(this[implFunc]){
				returnValue = this[implFunc](argument);
			}else{
				argument = arguments.length > 1 ? argument : null;
				if(argument || command !== "createlink"){
					returnValue = this.document.execCommand(command, false, argument);
				}
			}

			this.onDisplayChanged();
			return returnValue;
		},

		queryCommandEnabled: function(/*String*/ command){
			// summary:
			//		Check whether a command is enabled or not.
			// command:
			//		The command to execute
			// tags:
			//		protected
			if(this.disabled || !this._disabledOK){
				return false;
			}

			command = this._normalizeCommand(command);

			//Check to see if we have any over-rides for commands, they will be functions on this
			//widget of the form _commandEnabledImpl.  If we don't, fall through to the basic native
			//command of the browser.
			var implFunc = "_" + command + "EnabledImpl";

			if(this[implFunc]){
				return  this[implFunc](command);
			}else{
				return this._browserQueryCommandEnabled(command);
			}
		},

		queryCommandState: function(command){
			// summary:
			//		Check the state of a given command and returns true or false.
			// tags:
			//		protected

			if(this.disabled || !this._disabledOK){
				return false;
			}
			command = this._normalizeCommand(command);
			try{
				return this.document.queryCommandState(command);
			}catch(e){
				//Squelch, occurs if editor is hidden on FF 3 (and maybe others.)
				return false;
			}
		},

		queryCommandValue: function(command){
			// summary:
			//		Check the value of a given command. This matters most for
			//		custom selections and complex values like font value setting.
			// tags:
			//		protected

			if(this.disabled || !this._disabledOK){
				return false;
			}
			var r;
			command = this._normalizeCommand(command);
			if(has("ie") && command === "formatblock"){
				// This is to deal with IE bug when running in non-English.  See _localizeEditorCommands().
				// Apparently not needed on IE11 or Edge.
				r = this._native2LocalFormatNames[this.document.queryCommandValue(command)];
			}else if(has("mozilla") && command === "hilitecolor"){
				var oldValue;
				try{
					oldValue = this.document.queryCommandValue("styleWithCSS");
				}catch(e){
					oldValue = false;
				}
				this.document.execCommand("styleWithCSS", false, true);
				r = this.document.queryCommandValue(command);
				this.document.execCommand("styleWithCSS", false, oldValue);
			}else{
				r = this.document.queryCommandValue(command);
			}
			return r;
		},

		// Misc.

		_sCall: function(name, args){
			// summary:
			//		Deprecated, remove for 2.0.   New code should access this.selection directly.
			//		Run the named method of dijit/selection over the
			//		current editor instance's window, with the passed args.
			// tags:
			//		private deprecated

			return this.selection[name].apply(this.selection, args);
		},

		// FIXME: this is a TON of code duplication. Why?

		placeCursorAtStart: function(){
			// summary:
			//		Place the cursor at the start of the editing area.
			// tags:
			//		private

			this.focus();

			//see comments in placeCursorAtEnd
			var isvalid = false;
			if(has("mozilla")){
				// TODO:  Is this branch even necessary?
				var first = this.editNode.firstChild;
				while(first){
					if(first.nodeType === 3){
						if(first.nodeValue.replace(/^\s+|\s+$/g, "").length > 0){
							isvalid = true;
							this.selection.selectElement(first);
							break;
						}
					}else if(first.nodeType === 1){
						isvalid = true;
						var tg = first.tagName ? first.tagName.toLowerCase() : "";
						// Collapse before childless tags.
						if(/br|input|img|base|meta|area|basefont|hr|link/.test(tg)){
							this.selection.selectElement(first);
						}else{
							// Collapse inside tags with children.
							this.selection.selectElementChildren(first);
						}
						break;
					}
					first = first.nextSibling;
				}
			}else{
				isvalid = true;
				this.selection.selectElementChildren(this.editNode);
			}
			if(isvalid){
				this.selection.collapse(true);
			}
		},

		placeCursorAtEnd: function(){
			// summary:
			//		Place the cursor at the end of the editing area.
			// tags:
			//		private

			this.focus();

			//In mozilla, if last child is not a text node, we have to use
			// selectElementChildren on this.editNode.lastChild otherwise the
			// cursor would be placed at the end of the closing tag of
			//this.editNode.lastChild
			var isvalid = false;
			if(has("mozilla")){
				var last = this.editNode.lastChild;
				while(last){
					if(last.nodeType === 3){
						if(last.nodeValue.replace(/^\s+|\s+$/g, "").length > 0){
							isvalid = true;
							this.selection.selectElement(last);
							break;
						}
					}else if(last.nodeType === 1){
						isvalid = true;
						this.selection.selectElement(last.lastChild || last);
						break;
					}
					last = last.previousSibling;
				}
			}else{
				isvalid = true;
				this.selection.selectElementChildren(this.editNode);
			}
			if(isvalid){
				this.selection.collapse(false);
			}
		},

		getValue: function(/*Boolean?*/ nonDestructive){
			// summary:
			//		Return the current content of the editing area (post filters
			//		are applied).  Users should call get('value') instead.
			// nonDestructive:
			//		defaults to false. Should the post-filtering be run over a copy
			//		of the live DOM? Most users should pass "true" here unless they
			//		*really* know that none of the installed filters are going to
			//		mess up the editing session.
			// tags:
			//		private
			if(this.textarea){
				if(this.isClosed || !this.isLoaded){
					return this.textarea.value;
				}
			}

			return this.isLoaded ? this._postFilterContent(null, nonDestructive) : this.value;
		},
		_getValueAttr: function(){
			// summary:
			//		Hook to make attr("value") work
			return this.getValue(true);
		},

		setValue: function(/*String*/ html){
			// summary:
			//		This function sets the content. No undo history is preserved.
			//		Users should use set('value', ...) instead.
			// tags:
			//		deprecated

			// TODO: remove this and getValue() for 2.0, and move code to _setValueAttr()

			if(!this.isLoaded){
				// try again after the editor is finished loading
				this.onLoadDeferred.then(lang.hitch(this, function(){
					this.setValue(html);
				}));
				return;
			}
			if(this.textarea && (this.isClosed || !this.isLoaded)){
				this.textarea.value = html;
			}else{
				html = this._preFilterContent(html);
				var node = this.isClosed ? this.domNode : this.editNode;

				node.innerHTML = html;
				this._preDomFilterContent(node);
			}

			this.onDisplayChanged();
			this._set("value", this.getValue(true));
		},

		replaceValue: function(/*String*/ html){
			// summary:
			//		This function set the content while trying to maintain the undo stack
			//		(now only works fine with Moz, this is identical to setValue in all
			//		other browsers)
			// tags:
			//		protected

			if(this.isClosed){
				this.setValue(html);
			}else if(this.window && this.window.getSelection && !has("mozilla")){ // Safari
				// look ma! it's a totally f'd browser!
				this.setValue(html);
			}else if(this.window && this.window.getSelection){ // Moz
				html = this._preFilterContent(html);
				this.execCommand("selectall");
				this.execCommand("inserthtml", html);
				this._preDomFilterContent(this.editNode);
			}else if(this.document && this.document.selection){//IE
				//In IE, when the first element is not a text node, say
				//an <a> tag, when replacing the content of the editing
				//area, the <a> tag will be around all the content
				//so for now, use setValue for IE too
				this.setValue(html);
			}

			this._set("value", this.getValue(true));
		},

		_preFilterContent: function(/*String*/ html){
			// summary:
			//		Filter the input before setting the content of the editing
			//		area. DOM pre-filtering may happen after this
			//		string-based filtering takes place but as of 1.2, this is not
			//		guaranteed for operations such as the inserthtml command.
			// tags:
			//		private

			var ec = html;
			array.forEach(this.contentPreFilters, function(ef){
				if(ef){
					ec = ef(ec);
				}
			});
			return ec;
		},
		_preDomFilterContent: function(/*DomNode*/ dom){
			// summary:
			//		filter the input's live DOM. All filter operations should be
			//		considered to be "live" and operating on the DOM that the user
			//		will be interacting with in their editing session.
			// tags:
			//		private
			dom = dom || this.editNode;
			array.forEach(this.contentDomPreFilters, function(ef){
				if(ef && lang.isFunction(ef)){
					ef(dom);
				}
			}, this);
		},

		_postFilterContent: function(/*DomNode|DomNode[]|String?*/ dom, /*Boolean?*/ nonDestructive){
			// summary:
			//		filter the output after getting the content of the editing area
			//
			// description:
			//		post-filtering allows plug-ins and users to specify any number
			//		of transforms over the editor's content, enabling many common
			//		use-cases such as transforming absolute to relative URLs (and
			//		vice-versa), ensuring conformance with a particular DTD, etc.
			//		The filters are registered in the contentDomPostFilters and
			//		contentPostFilters arrays. Each item in the
			//		contentDomPostFilters array is a function which takes a DOM
			//		Node or array of nodes as its only argument and returns the
			//		same. It is then passed down the chain for further filtering.
			//		The contentPostFilters array behaves the same way, except each
			//		member operates on strings. Together, the DOM and string-based
			//		filtering allow the full range of post-processing that should
			//		be necessaray to enable even the most agressive of post-editing
			//		conversions to take place.
			//
			//		If nonDestructive is set to "true", the nodes are cloned before
			//		filtering proceeds to avoid potentially destructive transforms
			//		to the content which may still needed to be edited further.
			//		Once DOM filtering has taken place, the serialized version of
			//		the DOM which is passed is run through each of the
			//		contentPostFilters functions.
			//
			// dom:
			//		a node, set of nodes, which to filter using each of the current
			//		members of the contentDomPostFilters and contentPostFilters arrays.
			//
			// nonDestructive:
			//		defaults to "false". If true, ensures that filtering happens on
			//		a clone of the passed-in content and not the actual node
			//		itself.
			//
			// tags:
			//		private

			var ec;
			if(!lang.isString(dom)){
				dom = dom || this.editNode;
				if(this.contentDomPostFilters.length){
					if(nonDestructive){
						dom = lang.clone(dom);
					}
					array.forEach(this.contentDomPostFilters, function(ef){
						dom = ef(dom);
					});
				}
				ec = htmlapi.getChildrenHtml(dom);
			}else{
				ec = dom;
			}

			if(!lang.trim(ec.replace(/^\xA0\xA0*/, '').replace(/\xA0\xA0*$/, '')).length){
				ec = "";
			}

			array.forEach(this.contentPostFilters, function(ef){
				ec = ef(ec);
			});

			return ec;
		},

		_saveContent: function(){
			// summary:
			//		Saves the content in an onunload event if the editor has not been closed
			// tags:
			//		private

			var saveTextarea = dom.byId(dijit._scopeName + "._editor.RichText.value");
			if(saveTextarea){
				if(saveTextarea.value){
					saveTextarea.value += this._SEPARATOR;
				}
				saveTextarea.value += this.name + this._NAME_CONTENT_SEP + this.getValue(true);
			}
		},


		escapeXml: function(/*String*/ str, /*Boolean*/ noSingleQuotes){
			// summary:
			//		Adds escape sequences for special characters in XML.
			//		Optionally skips escapes for single quotes
			// tags:
			//		private

			str = str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
			if(!noSingleQuotes){
				str = str.replace(/'/gm, "&#39;");
			}
			return str; // string
		},

		getNodeHtml: function(/* DomNode */ node){
			// summary:
			//		Deprecated.   Use dijit/_editor/html::_getNodeHtml() instead.
			// tags:
			//		deprecated
			kernel.deprecated('dijit.Editor::getNodeHtml is deprecated', 'use dijit/_editor/html::getNodeHtml instead', 2);
			return htmlapi.getNodeHtml(node); // String
		},

		getNodeChildrenHtml: function(/* DomNode */ dom){
			// summary:
			//		Deprecated.   Use dijit/_editor/html::getChildrenHtml() instead.
			// tags:
			//		deprecated
			kernel.deprecated('dijit.Editor::getNodeChildrenHtml is deprecated', 'use dijit/_editor/html::getChildrenHtml instead', 2);
			return htmlapi.getChildrenHtml(dom);
		},

		close: function(/*Boolean?*/ save){
			// summary:
			//		Kills the editor and optionally writes back the modified contents to the
			//		element from which it originated.
			// save:
			//		Whether or not to save the changes. If false, the changes are discarded.
			// tags:
			//		private

			if(this.isClosed){
				return;
			}

			if(!arguments.length){
				save = true;
			}
			if(save){
				this._set("value", this.getValue(true));
			}

			// line height is squashed for iframes
			// FIXME: why was this here? if(this.iframe){ this.domNode.style.lineHeight = null; }

			if(this.interval){
				clearInterval(this.interval);
			}

			if(this._webkitListener){
				// Cleanup of WebKit fix: #9532
				this._webkitListener.remove();
				delete this._webkitListener;
			}

			// Guard against memory leaks on IE (see #9268)
			if(has("ie")){
				this.iframe.onfocus = null;
			}
			this.iframe._loadFunc = null;

			if(this._iframeRegHandle){
				this._iframeRegHandle.remove();
				delete this._iframeRegHandle;
			}

			if(this.textarea){
				var s = this.textarea.style;
				s.position = "";
				s.left = s.top = "";
				if(has("ie")){
					s.overflow = this.__overflow;
					this.__overflow = null;
				}
				this.textarea.value = this.value;
				domConstruct.destroy(this.domNode);
				this.domNode = this.textarea;
			}else{
				// Note that this destroys the iframe
				this.domNode.innerHTML = this.value;
			}
			delete this.iframe;

			domClass.remove(this.domNode, this.baseClass);
			this.isClosed = true;
			this.isLoaded = false;

			delete this.editNode;
			delete this.focusNode;

			if(this.window && this.window._frameElement){
				this.window._frameElement = null;
			}

			this.window = null;
			this.document = null;
			this.editingArea = null;
			this.editorObject = null;
		},

		destroy: function(){
			if(!this.isClosed){
				this.close(false);
			}
			if(this._updateTimer){
				this._updateTimer.remove();
			}
			this.inherited(arguments);
			if(RichText._globalSaveHandler){
				delete RichText._globalSaveHandler[this.id];
			}
		},

		_removeMozBogus: function(/* String */ html){
			// summary:
			//		Post filter to remove unwanted HTML attributes generated by mozilla
			// tags:
			//		private
			return html.replace(/\stype="_moz"/gi, '').replace(/\s_moz_dirty=""/gi, '').replace(/_moz_resizing="(true|false)"/gi, ''); // String
		},
		_removeWebkitBogus: function(/* String */ html){
			// summary:
			//		Post filter to remove unwanted HTML attributes generated by webkit
			// tags:
			//		private
			html = html.replace(/\sclass="webkit-block-placeholder"/gi, '');
			html = html.replace(/\sclass="apple-style-span"/gi, '');
			// For some reason copy/paste sometime adds extra meta tags for charset on
			// webkit (chrome) on mac.They need to be removed.  See: #12007"
			html = html.replace(/<meta charset=\"utf-8\" \/>/gi, '');
			return html; // String
		},
		_normalizeFontStyle: function(/* String */ html){
			// summary:
			//		Convert 'strong' and 'em' to 'b' and 'i'.
			// description:
			//		Moz can not handle strong/em tags correctly, so to help
			//		mozilla and also to normalize output, convert them to 'b' and 'i'.
			//
			//		Note the IE generates 'strong' and 'em' rather than 'b' and 'i'
			// tags:
			//		private
			return html.replace(/<(\/)?strong([ \>])/gi, '<$1b$2')
				.replace(/<(\/)?em([ \>])/gi, '<$1i$2'); // String
		},

		_preFixUrlAttributes: function(/* String */ html){
			// summary:
			//		Pre-filter to do fixing to href attributes on `<a>` and `<img>` tags
			// tags:
			//		private
			return html.replace(/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,
				'$1$4$2$3$5$2 _djrealurl=$2$3$5$2')
				.replace(/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,
				'$1$4$2$3$5$2 _djrealurl=$2$3$5$2'); // String
		},

		/*****************************************************************************
		 The following functions implement HTML manipulation commands for various
		 browser/contentEditable implementations.  The goal of them is to enforce
		 standard behaviors of them.
		 ******************************************************************************/

		/*** queryCommandEnabled implementations ***/

		_browserQueryCommandEnabled: function(command){
			// summary:
			//		Implementation to call to the native queryCommandEnabled of the browser.
			// command:
			//		The command to check.
			// tags:
			//		protected
			if(!command){
				return false;
			}
			if (has("ie") || has("trident") || has("edge")) {
				return this.focused && !this.disabled;
			}
			var elem = has("ie") < 9 ? this.document.selection.createRange() : this.document;
			try{
				return elem.queryCommandEnabled(command);
			}catch(e){
				return false;
			}
		},

		_createlinkEnabledImpl: function(/*===== argument =====*/){
			// summary:
			//		This function implements the test for if the create link
			//		command should be enabled or not.
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var enabled = true;
			if(has("opera")){
				var sel = this.window.getSelection();
				if(sel.isCollapsed){
					enabled = true;
				}else{
					enabled = this.document.queryCommandEnabled("createlink");
				}
			}else{
				enabled = this._browserQueryCommandEnabled("createlink");
			}
			return enabled;
		},

		_unlinkEnabledImpl: function(/*===== argument =====*/){
			// summary:
			//		This function implements the test for if the unlink
			//		command should be enabled or not.
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var enabled = true;
			if(has("mozilla") || has("webkit") || has("ie") || has("trident") || has("edge")){
				enabled = this.selection.hasAncestorElement("a");
			}else{
				enabled = this._browserQueryCommandEnabled("unlink");
			}
			return enabled;
		},

		_inserttableEnabledImpl: function(/*===== argument =====*/){
			// summary:
			//		This function implements the test for if the inserttable
			//		command should be enabled or not.
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var enabled = true;
			if(has("mozilla") || has("webkit")){
				enabled = true;
			}else{
				enabled = this._browserQueryCommandEnabled("inserttable");
			}
			return enabled;
		},

		_cutEnabledImpl: function(/*===== argument =====*/){
			// summary:
			//		This function implements the test for if the cut
			//		command should be enabled or not.
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var enabled = true;
			if(has("webkit")){
				// WebKit deems clipboard activity as a security threat and natively would return false
				var sel = this.window.getSelection();
				if(sel){
					sel = sel.toString();
				}
				enabled = !!sel;
			}else{
				enabled = this._browserQueryCommandEnabled("cut");
			}
			return enabled;
		},

		_copyEnabledImpl: function(/*===== argument =====*/){
			// summary:
			//		This function implements the test for if the copy
			//		command should be enabled or not.
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var enabled = true;
			if(has("webkit")){
				// WebKit deems clipboard activity as a security threat and natively would return false
				var sel = this.window.getSelection();
				if(sel){
					sel = sel.toString();
				}
				enabled = !!sel;
			}else{
				enabled = this._browserQueryCommandEnabled("copy");
			}
			return enabled;
		},

		_pasteEnabledImpl: function(/*===== argument =====*/){
			// summary:c
			//		This function implements the test for if the paste
			//		command should be enabled or not.
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var enabled = true;
			if(has("webkit")){
				return true;
			}else{
				enabled = this._browserQueryCommandEnabled("paste");
			}
			return enabled;
		},

		/*** execCommand implementations ***/

		_inserthorizontalruleImpl: function(argument){
			// summary:
			//		This function implements the insertion of HTML 'HR' tags.
			//		into a point on the page.  IE doesn't to it right, so
			//		we have to use an alternate form
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			if(has("ie")){
				return this._inserthtmlImpl("<hr>");
			}
			return this.document.execCommand("inserthorizontalrule", false, argument);
		},

		_unlinkImpl: function(argument){
			// summary:
			//		This function implements the unlink of an 'a' tag.
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			if((this.queryCommandEnabled("unlink")) && (has("mozilla") || has("webkit"))){
				var a = this.selection.getAncestorElement("a");
				this.selection.selectElement(a);
				return this.document.execCommand("unlink", false, null);
			}
			return this.document.execCommand("unlink", false, argument);
		},

		_hilitecolorImpl: function(argument){
			// summary:
			//		This function implements the hilitecolor command
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var returnValue;
			var isApplied = this._handleTextColorOrProperties("hilitecolor", argument);
			if(!isApplied){
				if(has("mozilla")){
					// mozilla doesn't support hilitecolor properly when useCSS is
					// set to false (bugzilla #279330)
					this.document.execCommand("styleWithCSS", false, true);
					console.log("Executing color command.");
					returnValue = this.document.execCommand("hilitecolor", false, argument);
					this.document.execCommand("styleWithCSS", false, false);
				}else{
					returnValue = this.document.execCommand("hilitecolor", false, argument);
				}
			}
			return returnValue;
		},

		_backcolorImpl: function(argument){
			// summary:
			//		This function implements the backcolor command
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			if(has("ie")){
				// Tested under IE 6 XP2, no problem here, comment out
				// IE weirdly collapses ranges when we exec these commands, so prevent it
				//	var tr = this.document.selection.createRange();
				argument = argument ? argument : null;
			}
			var isApplied = this._handleTextColorOrProperties("backcolor", argument);
			if(!isApplied){
				isApplied = this.document.execCommand("backcolor", false, argument);
			}
			return isApplied;
		},

		_forecolorImpl: function(argument){
			// summary:
			//		This function implements the forecolor command
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			if(has("ie")){
				// Tested under IE 6 XP2, no problem here, comment out
				// IE weirdly collapses ranges when we exec these commands, so prevent it
				//	var tr = this.document.selection.createRange();
				argument = argument ? argument : null;
			}
			var isApplied = false;
			isApplied = this._handleTextColorOrProperties("forecolor", argument);
			if(!isApplied){
				isApplied = this.document.execCommand("forecolor", false, argument);
			}
			return isApplied;
		},

		_inserthtmlImpl: function(argument){
			// summary:
			//		This function implements the insertion of HTML content into
			//		a point on the page.
			// argument:
			//		The content to insert, if any.
			// tags:
			//		protected
			argument = this._preFilterContent(argument);
			var rv = true;
			if(has("ie") < 9){
				var insertRange = this.document.selection.createRange();
				if(this.document.selection.type.toUpperCase() === 'CONTROL'){
					var n = insertRange.item(0);
					while(insertRange.length){
						insertRange.remove(insertRange.item(0));
					}
					n.outerHTML = argument;
				}else{
					insertRange.pasteHTML(argument);
				}
				insertRange.select();
			}else if(has("trident") < 8){
				var insertRange;
				var selection = rangeapi.getSelection(this.window);
				if(selection && selection.rangeCount && selection.getRangeAt){
					insertRange = selection.getRangeAt(0);
					insertRange.deleteContents();

					var div = domConstruct.create('div');
					div.innerHTML = argument;
					var node, lastNode;
					var n = this.document.createDocumentFragment();
					while((node = div.firstChild)){
						lastNode = n.appendChild(node);
					}
					insertRange.insertNode(n);
					if(lastNode) {
						insertRange = insertRange.cloneRange();
						insertRange.setStartAfter(lastNode);
						insertRange.collapse(false);
						selection.removeAllRanges();
						selection.addRange(insertRange);
					}
				}
			}else if(has("mozilla") && !argument.length){
				//mozilla can not inserthtml an empty html to delete current selection
				//so we delete the selection instead in this case
				this.selection.remove(); // FIXME
			}else{
				rv = this.document.execCommand("inserthtml", false, argument);
			}
			return rv;
		},

		_boldImpl: function(argument){
			// summary:
			//		This function implements an over-ride of the bold command.
			// argument:
			//		Not used, operates by selection.
			// tags:
			//		protected
			var applied = false;
			if(has("ie") || has("trident")){
				this._adaptIESelection();
				applied = this._adaptIEFormatAreaAndExec("bold");
			}
			if(!applied){
				applied = this.document.execCommand("bold", false, argument);
			}
			return applied;
		},

		_italicImpl: function(argument){
			// summary:
			//		This function implements an over-ride of the italic command.
			// argument:
			//		Not used, operates by selection.
			// tags:
			//		protected
			var applied = false;
			if(has("ie") || has("trident")){
				this._adaptIESelection();
				applied = this._adaptIEFormatAreaAndExec("italic");
			}
			if(!applied){
				applied = this.document.execCommand("italic", false, argument);
			}
			return applied;
		},

		_underlineImpl: function(argument){
			// summary:
			//		This function implements an over-ride of the underline command.
			// argument:
			//		Not used, operates by selection.
			// tags:
			//		protected
			var applied = false;
			if(has("ie") || has("trident")){
				this._adaptIESelection();
				applied = this._adaptIEFormatAreaAndExec("underline");
			}
			if(!applied){
				applied = this.document.execCommand("underline", false, argument);
			}
			return applied;
		},

		_strikethroughImpl: function(argument){
			// summary:
			//		This function implements an over-ride of the strikethrough command.
			// argument:
			//		Not used, operates by selection.
			// tags:
			//		protected
			var applied = false;
			if(has("ie") || has("trident")){
				this._adaptIESelection();
				applied = this._adaptIEFormatAreaAndExec("strikethrough");
			}
			if(!applied){
				applied = this.document.execCommand("strikethrough", false, argument);
			}
			return applied;
		},

		_superscriptImpl: function(argument){
			// summary:
			//		This function implements an over-ride of the superscript command.
			// argument:
			//		Not used, operates by selection.
			// tags:
			//		protected
			var applied = false;
			if(has("ie") || has("trident")){
				this._adaptIESelection();
				applied = this._adaptIEFormatAreaAndExec("superscript");
			}
			if(!applied){
				applied = this.document.execCommand("superscript", false, argument);
			}
			return applied;
		},

		_subscriptImpl: function(argument){
			// summary:
			//		This function implements an over-ride of the superscript command.
			// argument:
			//		Not used, operates by selection.
			// tags:
			//		protected
			var applied = false;
			if(has("ie") || has("trident")){
				this._adaptIESelection();
				applied = this._adaptIEFormatAreaAndExec("subscript");

			}
			if(!applied){
				applied = this.document.execCommand("subscript", false, argument);
			}
			return applied;
		},

		_fontnameImpl: function(argument){
			// summary:
			//		This function implements the fontname command
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var isApplied;
			if(has("ie") || has("trident")){
				isApplied = this._handleTextColorOrProperties("fontname", argument);
			}
			if(!isApplied){
				isApplied = this.document.execCommand("fontname", false, argument);
			}
			return isApplied;
		},

		_fontsizeImpl: function(argument){
			// summary:
			//		This function implements the fontsize command
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var isApplied;
			if(has("ie") || has("trident")){
				isApplied = this._handleTextColorOrProperties("fontsize", argument);
			}
			if(!isApplied){
				isApplied = this.document.execCommand("fontsize", false, argument);
			}
			return isApplied;
		},

		_insertorderedlistImpl: function(argument){
			// summary:
			//		This function implements the insertorderedlist command
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var applied = false;
			if(has("ie") || has("trident") || has("edge")){
				applied = this._adaptIEList("insertorderedlist", argument);
			}
			if(!applied){
				applied = this.document.execCommand("insertorderedlist", false, argument);
			}
			return applied;
		},

		_insertunorderedlistImpl: function(argument){
			// summary:
			//		This function implements the insertunorderedlist command
			// argument:
			//		arguments to the exec command, if any.
			// tags:
			//		protected
			var applied = false;
			if(has("ie") || has("trident") || has("edge")){
				applied = this._adaptIEList("insertunorderedlist", argument);
			}
			if(!applied){
				applied = this.document.execCommand("insertunorderedlist", false, argument);
			}
			return applied;
		},

		getHeaderHeight: function(){
			// summary:
			//		A function for obtaining the height of the header node
			return this._getNodeChildrenHeight(this.header); // Number
		},

		getFooterHeight: function(){
			// summary:
			//		A function for obtaining the height of the footer node
			return this._getNodeChildrenHeight(this.footer); // Number
		},

		_getNodeChildrenHeight: function(node){
			// summary:
			//		An internal function for computing the cumulative height of all child nodes of 'node'
			// node:
			//		The node to process the children of;
			var h = 0;
			if(node && node.childNodes){
				// IE didn't compute it right when position was obtained on the node directly is some cases,
				// so we have to walk over all the children manually.
				var i;
				for(i = 0; i < node.childNodes.length; i++){
					var size = domGeometry.position(node.childNodes[i]);
					h += size.h;
				}
			}
			return h; // Number
		},

		_isNodeEmpty: function(node, startOffset){
			// summary:
			//		Function to test if a node is devoid of real content.
			// node:
			//		The node to check.
			// tags:
			//		private.
			if(node.nodeType === 1/*element*/){
				if(node.childNodes.length > 0){
					return this._isNodeEmpty(node.childNodes[0], startOffset);	// huh?   why test just first child?
				}
				return true;
			}else if(node.nodeType === 3/*text*/){
				return (node.nodeValue.substring(startOffset) === "");
			}
			return false;
		},

		_removeStartingRangeFromRange: function(node, range){
			// summary:
			//		Function to adjust selection range by removing the current
			//		start node.
			// node:
			//		The node to remove from the starting range.
			// range:
			//		The range to adapt.
			// tags:
			//		private
			if(node.nextSibling){
				range.setStart(node.nextSibling, 0);
			}else{
				var parent = node.parentNode;
				while(parent && parent.nextSibling == null){
					//move up the tree until we find a parent that has another node, that node will be the next node
					parent = parent.parentNode;
				}
				if(parent){
					range.setStart(parent.nextSibling, 0);
				}
			}
			return range;
		},

		_adaptIESelection: function(){
			// summary:
			//		Function to adapt the IE range by removing leading 'newlines'
			//		Needed to fix issue with bold/italics/underline not working if
			//		range included leading 'newlines'.
			//		In IE, if a user starts a selection at the very end of a line,
			//		then the native browser commands will fail to execute correctly.
			//		To work around the issue,  we can remove all empty nodes from
			//		the start of the range selection.
			//
			//		Note: not needed on Edge because Windows 10 won't let the user make
			//		a selection containing leading or trailing newlines.
			var selection = rangeapi.getSelection(this.window);
			if(selection && selection.rangeCount && !selection.isCollapsed){
				var range = selection.getRangeAt(0);
				var firstNode = range.startContainer;
				var startOffset = range.startOffset;

				while(firstNode.nodeType === 3/*text*/ && startOffset >= firstNode.length && firstNode.nextSibling){
					//traverse the text nodes until we get to the one that is actually highlighted
					startOffset = startOffset - firstNode.length;
					firstNode = firstNode.nextSibling;
				}

				//Remove the starting ranges until the range does not start with an empty node.
				var lastNode = null;
				while(this._isNodeEmpty(firstNode, startOffset) && firstNode !== lastNode){
					lastNode = firstNode; //this will break the loop in case we can't find the next sibling
					range = this._removeStartingRangeFromRange(firstNode, range); //move the start container to the next node in the range
					firstNode = range.startContainer;
					startOffset = 0; //start at the beginning of the new starting range
				}
				selection.removeAllRanges();// this will work as long as users cannot select multiple ranges. I have not been able to do that in the editor.
				selection.addRange(range);
			}
		},

		_adaptIEFormatAreaAndExec: function(command){
			// summary:
			//		Function to handle IE's quirkiness regarding how it handles
			//		format commands on a word.  This involves a lit of node splitting
			//		and format cloning.
			// command:
			//		The format command, needed to check if the desired
			//		command is true or not.
			var selection = rangeapi.getSelection(this.window);
			var doc = this.document;
			var rs, ret, range, txt, startNode, endNode, breaker, sNode;
			if(command && selection && selection.isCollapsed){
				var isApplied = this.queryCommandValue(command);
				if(isApplied){

					// We have to split backwards until we hit the format
					var nNames = this._tagNamesForCommand(command);
					range = selection.getRangeAt(0);
					var fs = range.startContainer;
					if(fs.nodeType === 3){
						var offset = range.endOffset;
						if(fs.length < offset){
							//We are not looking from the right node, try to locate the correct one
							ret = this._adjustNodeAndOffset(rs, offset);
							fs = ret.node;
							offset = ret.offset;
						}
					}
					var topNode;
					while(fs && fs !== this.editNode){
						// We have to walk back and see if this is still a format or not.
						// Hm, how do I do this?
						var tName = fs.tagName ? fs.tagName.toLowerCase() : "";
						if(array.indexOf(nNames, tName) > -1){
							topNode = fs;
							break;
						}
						fs = fs.parentNode;
					}

					// Okay, we have a stopping place, time to split things apart.
					if(topNode){
						// Okay, we know how far we have to split backwards, so we have to split now.
						rs = range.startContainer;
						var newblock = doc.createElement(topNode.tagName);
						domConstruct.place(newblock, topNode, "after");
						if(rs && rs.nodeType === 3){
							// Text node, we have to split it.
							var nodeToMove, tNode;
							var endOffset = range.endOffset;
							if(rs.length < endOffset){
								//We are not splitting the right node, try to locate the correct one
								ret = this._adjustNodeAndOffset(rs, endOffset);
								rs = ret.node;
								endOffset = ret.offset;
							}

							txt = rs.nodeValue;
							startNode = doc.createTextNode(txt.substring(0, endOffset));
							var endText = txt.substring(endOffset, txt.length);
							if(endText){
								endNode = doc.createTextNode(endText);
							}
							// Place the split, then remove original nodes.
							domConstruct.place(startNode, rs, "before");
							if(endNode){
								breaker = doc.createElement("span");
								breaker.className = "ieFormatBreakerSpan";
								domConstruct.place(breaker, rs, "after");
								domConstruct.place(endNode, breaker, "after");
								endNode = breaker;
							}
							domConstruct.destroy(rs);

							// Okay, we split the text.  Now we need to see if we're
							// parented to the block element we're splitting and if
							// not, we have to split all the way up.  Ugh.
							var parentC = startNode.parentNode;
							var tagList = [];
							var tagData;
							while(parentC !== topNode){
								var tg = parentC.tagName;
								tagData = {tagName: tg};
								tagList.push(tagData);

								var newTg = doc.createElement(tg);
								// Clone over any 'style' data.
								if(parentC.style){
									if(newTg.style){
										if(parentC.style.cssText){
											newTg.style.cssText = parentC.style.cssText;
											tagData.cssText = parentC.style.cssText;
										}
									}
								}
								// If font also need to clone over any font data.
								if(parentC.tagName === "FONT"){
									if(parentC.color){
										newTg.color = parentC.color;
										tagData.color = parentC.color;
									}
									if(parentC.face){
										newTg.face = parentC.face;
										tagData.face = parentC.face;
									}
									if(parentC.size){  // this check was necessary on IE
										newTg.size = parentC.size;
										tagData.size = parentC.size;
									}
								}
								if(parentC.className){
									newTg.className = parentC.className;
									tagData.className = parentC.className;
								}

								// Now move end node and every sibling
								// after it over into the new tag.
								if(endNode){
									nodeToMove = endNode;
									while(nodeToMove){
										tNode = nodeToMove.nextSibling;
										newTg.appendChild(nodeToMove);
										nodeToMove = tNode;
									}
								}
								if(newTg.tagName == parentC.tagName){
									breaker = doc.createElement("span");
									breaker.className = "ieFormatBreakerSpan";
									domConstruct.place(breaker, parentC, "after");
									domConstruct.place(newTg, breaker, "after");
								}else{
									domConstruct.place(newTg, parentC, "after");
								}
								startNode = parentC;
								endNode = newTg;
								parentC = parentC.parentNode;
							}

							// Lastly, move the split out all the split tags
							// to the new block as they should now be split properly.
							if(endNode){
								nodeToMove = endNode;
								if(nodeToMove.nodeType === 1 || (nodeToMove.nodeType === 3 && nodeToMove.nodeValue)){
									// Non-blank text and non-text nodes need to clear out that blank space
									// before moving the contents.
									newblock.innerHTML = "";
								}
								while(nodeToMove){
									tNode = nodeToMove.nextSibling;
									newblock.appendChild(nodeToMove);
									nodeToMove = tNode;
								}
							}

							// We had intermediate tags, we have to now recreate them inbetween the split
							// and restore what styles, classnames, etc, we can.
							var newrange;
							if(tagList.length){
								tagData = tagList.pop();
								var newContTag = doc.createElement(tagData.tagName);
								if(tagData.cssText && newContTag.style){
									newContTag.style.cssText = tagData.cssText;
								}
								if(tagData.className){
									newContTag.className = tagData.className;
								}
								if(tagData.tagName === "FONT"){
									if(tagData.color){
										newContTag.color = tagData.color;
									}
									if(tagData.face){
										newContTag.face = tagData.face;
									}
									if(tagData.size){
										newContTag.size = tagData.size;
									}
								}
								domConstruct.place(newContTag, newblock, "before");
								while(tagList.length){
									tagData = tagList.pop();
									var newTgNode = doc.createElement(tagData.tagName);
									if(tagData.cssText && newTgNode.style){
										newTgNode.style.cssText = tagData.cssText;
									}
									if(tagData.className){
										newTgNode.className = tagData.className;
									}
									if(tagData.tagName === "FONT"){
										if(tagData.color){
											newTgNode.color = tagData.color;
										}
										if(tagData.face){
											newTgNode.face = tagData.face;
										}
										if(tagData.size){
											newTgNode.size = tagData.size;
										}
									}
									newContTag.appendChild(newTgNode);
									newContTag = newTgNode;
								}

								// Okay, everything is theoretically split apart and removed from the content
								// so insert the dummy text to select, select it, then
								// clear to position cursor.
								sNode = doc.createTextNode(".");
								breaker.appendChild(sNode);
								newContTag.appendChild(sNode);
								newrange = rangeapi.create(this.window);
								newrange.setStart(sNode, 0);
								newrange.setEnd(sNode, sNode.length);
								selection.removeAllRanges();
								selection.addRange(newrange);
								this.selection.collapse(false);
								sNode.parentNode.innerHTML = "";
							}else{
								// No extra tags, so we have to insert a breaker point and rely
								// on filters to remove it later.
								breaker = doc.createElement("span");
								breaker.className = "ieFormatBreakerSpan";
								sNode = doc.createTextNode(".");
								breaker.appendChild(sNode);
								domConstruct.place(breaker, newblock, "before");
								newrange = rangeapi.create(this.window);
								newrange.setStart(sNode, 0);
								newrange.setEnd(sNode, sNode.length);
								selection.removeAllRanges();
								selection.addRange(newrange);
								this.selection.collapse(false);
								sNode.parentNode.innerHTML = "";
							}
							if(!newblock.firstChild){
								// Empty, we don't need it.  Split was at end or similar
								// So, remove it.
								domConstruct.destroy(newblock);
							}
							return true;
						}
					}
					return false;
				}else{
					range = selection.getRangeAt(0);
					rs = range.startContainer;
					if(rs && rs.nodeType === 3){
						// Text node, we have to split it.
						var offset = range.startOffset;
						if(rs.length < offset){
							//We are not splitting the right node, try to locate the correct one
							ret = this._adjustNodeAndOffset(rs, offset);
							rs = ret.node;
							offset = ret.offset;
						}
						txt = rs.nodeValue;
						startNode = doc.createTextNode(txt.substring(0, offset));
						var endText = txt.substring(offset);
						if(endText !== ""){
							endNode = doc.createTextNode(txt.substring(offset));
						}
						// Create a space, we'll select and bold it, so
						// the whole word doesn't get bolded
						breaker = doc.createElement("span");
						sNode = doc.createTextNode(".");
						breaker.appendChild(sNode);
						if(startNode.length){
							domConstruct.place(startNode, rs, "after");
						}else{
							startNode = rs;
						}
						domConstruct.place(breaker, startNode, "after");
						if(endNode){
							domConstruct.place(endNode, breaker, "after");
						}
						domConstruct.destroy(rs);
						var newrange = rangeapi.create(this.window);
						newrange.setStart(sNode, 0);
						newrange.setEnd(sNode, sNode.length);
						selection.removeAllRanges();
						selection.addRange(newrange);
						doc.execCommand(command);
						domConstruct.place(breaker.firstChild, breaker, "before");
						domConstruct.destroy(breaker);
						newrange.setStart(sNode, 0);
						newrange.setEnd(sNode, sNode.length);
						selection.removeAllRanges();
						selection.addRange(newrange);
						this.selection.collapse(false);
						sNode.parentNode.innerHTML = "";
						return true;
					}
				}
			}else{
				return false;
			}
		},

		_adaptIEList: function(command /*===== , argument =====*/){
			// summary:
			//		This function handles normalizing the IE list behavior as
			//		much as possible.
			// command:
			//		The list command to execute.
			// argument:
			//		Any additional argument.
			// tags:
			//		private
			var selection = rangeapi.getSelection(this.window);
			if(selection.isCollapsed){
				// In the case of no selection, let's commonize the behavior and
				// make sure that it indents if needed.
				if(selection.rangeCount && !this.queryCommandValue(command)){
					var range = selection.getRangeAt(0);
					var sc = range.startContainer;
					if(sc && sc.nodeType == 3){
						// text node.  Lets see if there is a node before it that isn't
						// some sort of breaker.
						if(!range.startOffset){
							// We're at the beginning of a text area.  It may have been br split
							// Who knows?  In any event, we must create the list manually
							// or IE may shove too much into the list element.  It seems to
							// grab content before the text node too if it's br split.
							// Why can't IE work like everyone else?
							// This problem also happens on Edge.

							// Create a space, we'll select and bold it, so
							// the whole word doesn't get bolded
							var lType = "ul";
							if(command === "insertorderedlist"){
								lType = "ol";
							}
							var list = this.document.createElement(lType);
							var li = domConstruct.create("li", null, list);
							domConstruct.place(list, sc, "before");
							// Move in the text node as part of the li.
							li.appendChild(sc);
							// We need a br after it or the enter key handler
							// sometimes throws errors.
							domConstruct.create("br", null, list, "after");
							// Okay, now lets move our cursor to the beginning.
							var newrange = rangeapi.create(this.window);
							newrange.setStart(sc, 0);
							newrange.setEnd(sc, sc.length);
							selection.removeAllRanges();
							selection.addRange(newrange);
							this.selection.collapse(true);
							return true;
						}
					}
				}
			}
			return false;
		},

		_handleTextColorOrProperties: function(command, argument){
			// summary:
			//		This function handles applying text color as best it is
			//		able to do so when the selection is collapsed, making the
			//		behavior cross-browser consistent. It also handles the name
			//		and size for IE.
			// command:
			//		The command.
			// argument:
			//		Any additional arguments.
			// tags:
			//		private
			var selection = rangeapi.getSelection(this.window);
			var doc = this.document;
			var rs, ret, range, txt, startNode, endNode, breaker, sNode;
			argument = argument || null;
			if(command && selection && selection.isCollapsed){
				if(selection.rangeCount){
					range = selection.getRangeAt(0);
					rs = range.startContainer;
					if(rs && rs.nodeType === 3){
						// Text node, we have to split it.
						var offset = range.startOffset;
						if(rs.length < offset){
							//We are not splitting the right node, try to locate the correct one
							ret = this._adjustNodeAndOffset(rs, offset);
							rs = ret.node;
							offset = ret.offset;
						}
						txt = rs.nodeValue;
						startNode = doc.createTextNode(txt.substring(0, offset));
						var endText = txt.substring(offset);
						if(endText !== ""){
							endNode = doc.createTextNode(txt.substring(offset));
						}
						// Create a space, we'll select and bold it, so
						// the whole word doesn't get bolded
						breaker = doc.createElement("span");
						sNode = doc.createTextNode(".");
						breaker.appendChild(sNode);
						// Create a junk node to avoid it trying to style the breaker.
						// This will get destroyed later.
						var extraSpan = doc.createElement("span");
						breaker.appendChild(extraSpan);
						if(startNode.length){
							domConstruct.place(startNode, rs, "after");
						}else{
							startNode = rs;
						}
						domConstruct.place(breaker, startNode, "after");
						if(endNode){
							domConstruct.place(endNode, breaker, "after");
						}
						domConstruct.destroy(rs);
						var newrange = rangeapi.create(this.window);
						newrange.setStart(sNode, 0);
						newrange.setEnd(sNode, sNode.length);
						selection.removeAllRanges();
						selection.addRange(newrange);
						if(has("webkit")){
							// WebKit is frustrating with positioning the cursor.
							// It stinks to have a selected space, but there really
							// isn't much choice here.
							var style = "color";
							if(command === "hilitecolor" || command === "backcolor"){
								style = "backgroundColor";
							}
							domStyle.set(breaker, style, argument);
							this.selection.remove();
							domConstruct.destroy(extraSpan);
							breaker.innerHTML = "&#160;";	// &nbsp;
							this.selection.selectElement(breaker);
							this.focus();
						}else{
							this.execCommand(command, argument);
							domConstruct.place(breaker.firstChild, breaker, "before");
							domConstruct.destroy(breaker);
							newrange.setStart(sNode, 0);
							newrange.setEnd(sNode, sNode.length);
							selection.removeAllRanges();
							selection.addRange(newrange);
							this.selection.collapse(false);
							sNode.parentNode.removeChild(sNode);
						}
						return true;
					}
				}
			}
			return false;
		},

		_adjustNodeAndOffset: function(/*DomNode*/node, /*Int*/offset){
			// summary:
			//		In the case there are multiple text nodes in a row the offset may not be within the node.
			//		If the offset is larger than the node length, it will attempt to find
			//		the next text sibling until it locates the text node in which the offset refers to
			// node:
			//		The node to check.
			// offset:
			//		The position to find within the text node
			// tags:
			//		private.
			while(node.length < offset && node.nextSibling && node.nextSibling.nodeType === 3){
				//Adjust the offset and node in the case of multiple text nodes in a row
				offset = offset - node.length;
				node = node.nextSibling;
			}
			return {"node": node, "offset": offset};
		},

		_tagNamesForCommand: function(command){
			// summary:
			//		Function to return the tab names that are associated
			//		with a particular style.
			// command: String
			//		The command to return tags for.
			// tags:
			//		private
			if(command === "bold"){
				return ["b", "strong"];
			}else if(command === "italic"){
				return ["i", "em"];
			}else if(command === "strikethrough"){
				return ["s", "strike"];
			}else if(command === "superscript"){
				return ["sup"];
			}else if(command === "subscript"){
				return ["sub"];
			}else if(command === "underline"){
				return ["u"];
			}
			return [];
		},

		_stripBreakerNodes: function(/*DOMNode*/ node){
			// summary:
			//		Function for stripping out the breaker spans inserted by the formatting command.
			//		Registered as a filter for IE, handles the breaker spans needed to fix up
			//		How bold/italic/etc, work when selection is collapsed (single cursor).
			if(!this.isLoaded){
				return;
			} // this method requires init to be complete
			query(".ieFormatBreakerSpan", node).forEach(function(b){
				while(b.firstChild){
					domConstruct.place(b.firstChild, b, "before");
				}
				domConstruct.destroy(b);
			});
			return node;
		},

		_stripTrailingEmptyNodes: function(/*DOMNode*/ node){
			// summary:
			//		Function for stripping trailing nodes without any text, excluding trailing nodes
			//		like <img> or <div><img></div>, even though they don't have text either.

			function isEmpty(node){
				// If not for old IE we could check for Element children by node.firstElementChild
				return (/^(p|div|br)$/i.test(node.nodeName) && node.children.length == 0 &&
					/^[\s\xA0]*$/.test(node.textContent || node.innerText || "")) ||
					(node.nodeType === 3/*text*/ && /^[\s\xA0]*$/.test(node.nodeValue));
			}
			while(node.lastChild && isEmpty(node.lastChild)){
				domConstruct.destroy(node.lastChild);
			}

			return node;
		},

		// Needed to support ToggleDir plugin.  Intentionally not inside if(has("dojo-bidi")) block
		// so that (for backwards compatibility) ToggleDir plugin works even when has("dojo-bidi") is falsy.
		_setTextDirAttr: function(/*String*/ value){
			// summary:
			//		Sets textDir attribute.  Sets direction of editNode accordingly.
			this._set("textDir", value);
			this.onLoadDeferred.then(lang.hitch(this, function(){
				this.editNode.dir = value;
			}));
		}
	});

	return RichText;
});

},
'dijit/_editor/range':function(){
define([
	"dojo/_base/array", // array.every
	"dojo/_base/declare", // declare
	"dojo/_base/lang" // lang.isArray
], function(array, declare, lang){

	// module:
	//		dijit/_editor/range

	var rangeapi = {
		// summary:
		//		W3C range API

		getIndex: function(/*DomNode*/ node, /*DomNode*/ parent){
			var ret = [], retR = [];
			var onode = node;

			var pnode, n;
			while(node != parent){
				var i = 0;
				pnode = node.parentNode;
				while((n = pnode.childNodes[i++])){
					if(n === node){
						--i;
						break;
					}
				}
				//if(i>=pnode.childNodes.length){
				//console.debug("Error finding index of a node in dijit/range.getIndex()");
				//}
				ret.unshift(i);
				retR.unshift(i - pnode.childNodes.length);
				node = pnode;
			}

			//normalized() can not be called so often to prevent
			//invalidating selection/range, so we have to detect
			//here that any text nodes in a row
			if(ret.length > 0 && onode.nodeType == 3){
				n = onode.previousSibling;
				while(n && n.nodeType == 3){
					ret[ret.length - 1]--;
					n = n.previousSibling;
				}
				n = onode.nextSibling;
				while(n && n.nodeType == 3){
					retR[retR.length - 1]++;
					n = n.nextSibling;
				}
			}

			return {o: ret, r:retR};
		},

		getNode: function(/*Array*/ index, /*DomNode*/ parent){
			if(!lang.isArray(index) || index.length == 0){
				return parent;
			}
			var node = parent;
			//	if(!node)debugger
			array.every(index, function(i){
				if(i >= 0 && i < node.childNodes.length){
					node = node.childNodes[i];
				}else{
					node = null;
					//console.debug('Error: can not find node with index',index,'under parent node',parent );
					return false; //terminate array.every
				}
				return true; //carry on the every loop
			});

			return node;
		},

		getCommonAncestor: function(n1, n2, root){
			root = root || n1.ownerDocument.body;
			var getAncestors = function(n){
				var as = [];
				while(n){
					as.unshift(n);
					if(n !== root){
						n = n.parentNode;
					}else{
						break;
					}
				}
				return as;
			};
			var n1as = getAncestors(n1);
			var n2as = getAncestors(n2);

			var m = Math.min(n1as.length, n2as.length);
			var com = n1as[0]; //at least, one element should be in the array: the root (BODY by default)
			for(var i = 1; i < m; i++){
				if(n1as[i] === n2as[i]){
					com = n1as[i]
				}else{
					break;
				}
			}
			return com;
		},

		getAncestor: function(/*DomNode*/ node, /*RegEx?*/ regex, /*DomNode?*/ root){
			root = root || node.ownerDocument.body;
			while(node && node !== root){
				var name = node.nodeName.toUpperCase();
				if(regex.test(name)){
					return node;
				}

				node = node.parentNode;
			}
			return null;
		},

		BlockTagNames: /^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/,

		getBlockAncestor: function(/*DomNode*/ node, /*RegEx?*/ regex, /*DomNode?*/ root){
			root = root || node.ownerDocument.body;
			regex = regex || rangeapi.BlockTagNames;
			var block = null, blockContainer;
			while(node && node !== root){
				var name = node.nodeName.toUpperCase();
				if(!block && regex.test(name)){
					block = node;
				}
				if(!blockContainer && (/^(?:BODY|TD|TH|CAPTION)$/).test(name)){
					blockContainer = node;
				}

				node = node.parentNode;
			}
			return {blockNode:block, blockContainer:blockContainer || node.ownerDocument.body};
		},

		atBeginningOfContainer: function(/*DomNode*/ container, /*DomNode*/ node, /*Int*/ offset){
			var atBeginning = false;
			var offsetAtBeginning = (offset == 0);
			if(!offsetAtBeginning && node.nodeType == 3){ //if this is a text node, check whether the left part is all space
				if(/^[\s\xA0]+$/.test(node.nodeValue.substr(0, offset))){
					offsetAtBeginning = true;
				}
			}
			if(offsetAtBeginning){
				var cnode = node;
				atBeginning = true;
				while(cnode && cnode !== container){
					if(cnode.previousSibling){
						atBeginning = false;
						break;
					}
					cnode = cnode.parentNode;
				}
			}
			return atBeginning;
		},

		atEndOfContainer: function(/*DomNode*/ container, /*DomNode*/ node, /*Int*/ offset){
			var atEnd = false;
			var offsetAtEnd = (offset == (node.length || node.childNodes.length));
			if(!offsetAtEnd && node.nodeType == 3){ //if this is a text node, check whether the right part is all space
				if(/^[\s\xA0]+$/.test(node.nodeValue.substr(offset))){
					offsetAtEnd = true;
				}
			}
			if(offsetAtEnd){
				var cnode = node;
				atEnd = true;
				while(cnode && cnode !== container){
					if(cnode.nextSibling){
						atEnd = false;
						break;
					}
					cnode = cnode.parentNode;
				}
			}
			return atEnd;
		},

		adjacentNoneTextNode: function(startnode, next){
			var node = startnode;
			var len = (0 - startnode.length) || 0;
			var prop = next ? 'nextSibling' : 'previousSibling';
			while(node){
				if(node.nodeType != 3){
					break;
				}
				len += node.length;
				node = node[prop];
			}
			return [node,len];
		},

		create: function(/*Window?*/ win){	// TODO: for 2.0, replace optional window param w/mandatory window or document param
			win = win || window;
			if(win.getSelection){
				return win.document.createRange();
			}else{//IE
				return new W3CRange();
			}
		},

		getSelection: function(/*Window*/ window, /*Boolean?*/ ignoreUpdate){
			if(window.getSelection){
				return window.getSelection();
			}else{//IE
				var s = new ie.selection(window);
				if(!ignoreUpdate){
					s._getCurrentSelection();
				}
				return s;
			}
		}
	};

	// TODO: convert to has() test?   But remember IE9 issues with quirks vs. standards in main frame vs. iframe.
	if(!window.getSelection){
		var ie = rangeapi.ie = {
			cachedSelection: {},
			selection: function(window){
				this._ranges = [];
				this.addRange = function(r, /*boolean*/ internal){
					this._ranges.push(r);
					if(!internal){
						r._select();
					}
					this.rangeCount = this._ranges.length;
				};
				this.removeAllRanges = function(){
					//don't detach, the range may be used later
					//				for(var i=0;i<this._ranges.length;i++){
					//					this._ranges[i].detach();
					//				}
					this._ranges = [];
					this.rangeCount = 0;
				};
				var _initCurrentRange = function(){
					var r = window.document.selection.createRange();
					var type = window.document.selection.type.toUpperCase();
					if(type == "CONTROL"){
						//TODO: multiple range selection(?)
						return new W3CRange(ie.decomposeControlRange(r));
					}else{
						return new W3CRange(ie.decomposeTextRange(r));
					}
				};
				this.getRangeAt = function(i){
					return this._ranges[i];
				};
				this._getCurrentSelection = function(){
					this.removeAllRanges();
					var r = _initCurrentRange();
					if(r){
						this.addRange(r, true);
						this.isCollapsed = r.collapsed;
					}else{
						this.isCollapsed = true;
					}
				};
			},
			decomposeControlRange: function(range){
				var firstnode = range.item(0), lastnode = range.item(range.length - 1);
				var startContainer = firstnode.parentNode, endContainer = lastnode.parentNode;
				var startOffset = rangeapi.getIndex(firstnode, startContainer).o[0];
				var endOffset = rangeapi.getIndex(lastnode, endContainer).o[0] + 1;
				return [startContainer, startOffset,endContainer, endOffset];
			},
			getEndPoint: function(range, end){
				var atmrange = range.duplicate();
				atmrange.collapse(!end);
				var cmpstr = 'EndTo' + (end ? 'End' : 'Start');
				var parentNode = atmrange.parentElement();

				var startnode, startOffset, lastNode;
				if(parentNode.childNodes.length > 0){
					array.every(parentNode.childNodes, function(node, i){
						var calOffset;
						if(node.nodeType != 3){
							atmrange.moveToElementText(node);

							if(atmrange.compareEndPoints(cmpstr, range) > 0){
								//startnode = node.previousSibling;
								if(lastNode && lastNode.nodeType == 3){
									//where shall we put the start? in the text node or after?
									startnode = lastNode;
									calOffset = true;
								}else{
									startnode = parentNode;
									startOffset = i;
									return false;
								}
							}else{
								if(i == parentNode.childNodes.length - 1){
									startnode = parentNode;
									startOffset = parentNode.childNodes.length;
									return false;
								}
							}
						}else{
							if(i == parentNode.childNodes.length - 1){//at the end of this node
								startnode = node;
								calOffset = true;
							}
						}
						//			try{
						if(calOffset && startnode){
							var prevnode = rangeapi.adjacentNoneTextNode(startnode)[0];
							if(prevnode){
								startnode = prevnode.nextSibling;
							}else{
								startnode = parentNode.firstChild; //firstChild must be a text node
							}
							var prevnodeobj = rangeapi.adjacentNoneTextNode(startnode);
							prevnode = prevnodeobj[0];
							var lenoffset = prevnodeobj[1];
							if(prevnode){
								atmrange.moveToElementText(prevnode);
								atmrange.collapse(false);
							}else{
								atmrange.moveToElementText(parentNode);
							}
							atmrange.setEndPoint(cmpstr, range);
							startOffset = atmrange.text.length - lenoffset;

							return false;
						}
						//			}catch(e){ debugger }
						lastNode = node;
						return true;
					});
				}else{
					startnode = parentNode;
					startOffset = 0;
				}

				//if at the end of startnode and we are dealing with start container, then
				//move the startnode to nextSibling if it is a text node
				//TODO: do this for end container?
				if(!end && startnode.nodeType == 1 && startOffset == startnode.childNodes.length){
					var nextnode = startnode.nextSibling;
					if(nextnode && nextnode.nodeType == 3){
						startnode = nextnode;
						startOffset = 0;
					}
				}
				return [startnode, startOffset];
			},
			setEndPoint: function(range, container, offset){
				//text node
				var atmrange = range.duplicate(), node, len;
				if(container.nodeType != 3){ //normal node
					if(offset > 0){
						node = container.childNodes[offset - 1];
						if(node){
							if(node.nodeType == 3){
								container = node;
								offset = node.length;
								//pass through
							}else{
								if(node.nextSibling && node.nextSibling.nodeType == 3){
									container = node.nextSibling;
									offset = 0;
									//pass through
								}else{
									atmrange.moveToElementText(node.nextSibling ? node : container);
									var parent = node.parentNode;
									var tempNode = parent.insertBefore(node.ownerDocument.createTextNode(' '), node.nextSibling);
									atmrange.collapse(false);
									parent.removeChild(tempNode);
								}
							}
						}
					}else{
						atmrange.moveToElementText(container);
						atmrange.collapse(true);
					}
				}
				if(container.nodeType == 3){
					var prevnodeobj = rangeapi.adjacentNoneTextNode(container);
					var prevnode = prevnodeobj[0];
					len = prevnodeobj[1];
					if(prevnode){
						atmrange.moveToElementText(prevnode);
						atmrange.collapse(false);
						//if contentEditable is not inherit, the above collapse won't make the end point
						//in the correctly position: it always has a -1 offset, so compensate it
						if(prevnode.contentEditable != 'inherit'){
							len++;
						}
					}else{
						atmrange.moveToElementText(container.parentNode);
						atmrange.collapse(true);

						// Correct internal cursor position
						// http://bugs.dojotoolkit.org/ticket/15578
						atmrange.move('character', 1);
						atmrange.move('character', -1);
					}

					offset += len;
					if(offset > 0){
						if(atmrange.move('character', offset) != offset){
							console.error('Error when moving!');
						}
					}
				}

				return atmrange;
			},
			decomposeTextRange: function(range){
				var tmpary = ie.getEndPoint(range);
				var startContainer = tmpary[0], startOffset = tmpary[1];
				var endContainer = tmpary[0], endOffset = tmpary[1];

				if(range.htmlText.length){
					if(range.htmlText == range.text){ //in the same text node
						endOffset = startOffset + range.text.length;
					}else{
						tmpary = ie.getEndPoint(range, true);
						endContainer = tmpary[0],endOffset = tmpary[1];
						//					if(startContainer.tagName == "BODY"){
						//						startContainer = startContainer.firstChild;
						//					}
					}
				}
				return [startContainer, startOffset, endContainer, endOffset];
			},
			setRange: function(range, startContainer, startOffset, endContainer, endOffset, collapsed){
				var start = ie.setEndPoint(range, startContainer, startOffset);

				range.setEndPoint('StartToStart', start);
				if(!collapsed){
					var end = ie.setEndPoint(range, endContainer, endOffset);
				}
				range.setEndPoint('EndToEnd', end || start);

				return range;
			}
		};

		var W3CRange = rangeapi.W3CRange = declare(null, {
			constructor: function(){
				if(arguments.length>0){
					this.setStart(arguments[0][0],arguments[0][1]);
					this.setEnd(arguments[0][2],arguments[0][3]);
				}else{
					this.commonAncestorContainer = null;
					this.startContainer = null;
					this.startOffset = 0;
					this.endContainer = null;
					this.endOffset = 0;
					this.collapsed = true;
				}
			},
			_updateInternal: function(){
				if(this.startContainer !== this.endContainer){
					this.commonAncestorContainer = rangeapi.getCommonAncestor(this.startContainer, this.endContainer);
				}else{
					this.commonAncestorContainer = this.startContainer;
				}
				this.collapsed = (this.startContainer === this.endContainer) && (this.startOffset == this.endOffset);
			},
			setStart: function(node, offset){
				offset=parseInt(offset);
				if(this.startContainer === node && this.startOffset == offset){
					return;
				}
				delete this._cachedBookmark;

				this.startContainer = node;
				this.startOffset = offset;
				if(!this.endContainer){
					this.setEnd(node, offset);
				}else{
					this._updateInternal();
				}
			},
			setEnd: function(node, offset){
				offset=parseInt(offset);
				if(this.endContainer === node && this.endOffset == offset){
					return;
				}
				delete this._cachedBookmark;

				this.endContainer = node;
				this.endOffset = offset;
				if(!this.startContainer){
					this.setStart(node, offset);
				}else{
					this._updateInternal();
				}
			},
			setStartAfter: function(node, offset){
				this._setPoint('setStart', node, offset, 1);
			},
			setStartBefore: function(node, offset){
				this._setPoint('setStart', node, offset, 0);
			},
			setEndAfter: function(node, offset){
				this._setPoint('setEnd', node, offset, 1);
			},
			setEndBefore: function(node, offset){
				this._setPoint('setEnd', node, offset, 0);
			},
			_setPoint: function(what, node, offset, ext){
				var index = rangeapi.getIndex(node, node.parentNode).o;
				this[what](node.parentNode, index.pop()+ext);
			},
			_getIERange: function(){
				var r = (this._body || this.endContainer.ownerDocument.body).createTextRange();
				ie.setRange(r, this.startContainer, this.startOffset, this.endContainer, this.endOffset, this.collapsed);
				return r;
			},
			getBookmark: function(){
				this._getIERange();
				return this._cachedBookmark;
			},
			_select: function(){
				var r = this._getIERange();
				r.select();
			},
			deleteContents: function(){
				var s = this.startContainer, r = this._getIERange();
				if(s.nodeType === 3 && !this.startOffset){
					//if the range starts at the beginning of a
					//text node, move it to before the textnode
					//to make sure the range is still valid
					//after deleteContents() finishes
					this.setStartBefore(s);
				}
				r.pasteHTML('');
				this.endContainer = this.startContainer;
				this.endOffset = this.startOffset;
				this.collapsed = true;
			},
			cloneRange: function(){
				var r = new W3CRange([this.startContainer,this.startOffset,
					this.endContainer,this.endOffset]);
				r._body = this._body;
				return r;
			},
			detach: function(){
				this._body = null;
				this.commonAncestorContainer = null;
				this.startContainer = null;
				this.startOffset = 0;
				this.endContainer = null;
				this.endOffset = 0;
				this.collapsed = true;
			}
		});
	} //if(!window.getSelection)

	// remove for 2.0
	lang.setObject("dijit.range", rangeapi);

	return rangeapi;
});

},
'dijit/_editor/html':function(){
define([
	"dojo/_base/array",
	"dojo/_base/lang", // lang.setObject
	"dojo/sniff" // has("ie")
], function(array, lang, has){

	// module:
	//		dijit/_editor/html

	var exports = {
		// summary:
		//		HTML serialization utility functions used by editor
	};
	lang.setObject("dijit._editor.html", exports);

	var escape = exports.escapeXml = function(/*String*/ str, /*Boolean?*/ noSingleQuotes){
		// summary:
		//		Adds escape sequences for special characters in XML: `&<>"'`.
		//		Optionally skips escapes for single quotes.
		str = str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
		if(!noSingleQuotes){
			str = str.replace(/'/gm, "&#39;");
		}
		return str; // string
	};

	exports.getNodeHtml = function(/*DomNode*/ node){
		// summary:
		//		Return string representing HTML for node and it's children
		var output = [];
		exports.getNodeHtmlHelper(node, output);
		return output.join("");
	};

	exports.getNodeHtmlHelper = function(/*DomNode*/ node, /*String[]*/ output){
		// summary:
		//		Pushes array of strings into output[] which represent HTML for node and it's children
		switch(node.nodeType){
			case 1: // element node
				var lName = node.nodeName.toLowerCase();
				if(!lName || lName.charAt(0) == "/"){
					// IE does some strange things with malformed HTML input, like
					// treating a close tag </span> without an open tag <span>, as
					// a new tag with tagName of /span.  Corrupts output HTML, remove
					// them.  Other browsers don't prefix tags that way, so will
					// never show up.
					return "";
				}
				output.push('<', lName);

				// store the list of attributes and sort it to have the
				// attributes appear in the dictionary order
				var attrarray = [], attrhash = {};
				var attr;
				if(has("dom-attributes-explicit") || has("dom-attributes-specified-flag")){
					// IE8+ and all other browsers.
					var i = 0;
					while((attr = node.attributes[i++])){
						// ignore all attributes starting with _dj which are
						// internal temporary attributes used by the editor
						var n = attr.name;
						if(n.substr(0, 3) !== '_dj' &&
							(!has("dom-attributes-specified-flag") || attr.specified) && !(n in attrhash)){    // workaround repeated attributes bug in IE8 (LinkDialog test)
							var v = attr.value;
							if(n == 'src' || n == 'href'){
								if(node.getAttribute('_djrealurl')){
									v = node.getAttribute('_djrealurl');
								}
							}
							if(has("ie") === 8 && n === "style"){
								v = v.replace("HEIGHT:", "height:").replace("WIDTH:", "width:");
							}
							attrarray.push([n, v]);
							attrhash[n] = v;
						}
					}
				}else{
					// IE6-7 code path
					var clone = /^input$|^img$/i.test(node.nodeName) ? node : node.cloneNode(false);
					var s = clone.outerHTML;
					// Split up and manage the attrs via regexp
					// similar to prettyPrint attr logic.
					var rgxp_attrsMatch = /[\w-]+=("[^"]*"|'[^']*'|\S*)/gi
					var attrSplit = s.match(rgxp_attrsMatch);
					s = s.substr(0, s.indexOf('>'));
					array.forEach(attrSplit, function(attr){
						if(attr){
							var idx = attr.indexOf("=");
							if(idx > 0){
								var key = attr.substring(0, idx);
								if(key.substr(0, 3) != '_dj'){
									if(key == 'src' || key == 'href'){
										if(node.getAttribute('_djrealurl')){
											attrarray.push([key, node.getAttribute('_djrealurl')]);
											return;
										}
									}
									var val, match;
									switch(key){
										case 'style':
											val = node.style.cssText.toLowerCase();
											break;
										case 'class':
											val = node.className;
											break;
										case 'width':
											if(lName === "img"){
												// This somehow gets lost on IE for IMG tags and the like
												// and we have to find it in outerHTML, known IE oddity.
												match = /width=(\S+)/i.exec(s);
												if(match){
													val = match[1];
												}
												break;
											}
										case 'height':
											if(lName === "img"){
												// This somehow gets lost on IE for IMG tags and the like
												// and we have to find it in outerHTML, known IE oddity.
												match = /height=(\S+)/i.exec(s);
												if(match){
													val = match[1];
												}
												break;
											}
										default:
											val = node.getAttribute(key);
									}
									if(val != null){
										attrarray.push([key, val.toString()]);
									}
								}
							}
						}
					}, this);
				}
				attrarray.sort(function(a, b){
					return a[0] < b[0] ? -1 : (a[0] == b[0] ? 0 : 1);
				});
				var j = 0;
				while((attr = attrarray[j++])){
					output.push(' ', attr[0], '="',
						(typeof attr[1] === "string" ? escape(attr[1], true) : attr[1]), '"');
				}
				switch(lName){
					case 'br':
					case 'hr':
					case 'img':
					case 'input':
					case 'base':
					case 'meta':
					case 'area':
					case 'basefont':
						// These should all be singly closed
						output.push(' />');
						break;
					case 'script':
						// Browsers handle script tags differently in how you get content,
						// but innerHTML always seems to work, so insert its content that way
						// Yes, it's bad to allow script tags in the editor code, but some people
						// seem to want to do it, so we need to at least return them right.
						// other plugins/filters can strip them.
						output.push('>', node.innerHTML, '</', lName, '>');
						break;
					default:
						output.push('>');
						if(node.hasChildNodes()){
							exports.getChildrenHtmlHelper(node, output);
						}
						output.push('</', lName, '>');
				}
				break;
			case 4: // cdata
			case 3: // text
				// FIXME:
				output.push(escape(node.nodeValue, true));
				break;
			case 8: // comment
				// FIXME:
				output.push('<!--', escape(node.nodeValue, true), '-->');
				break;
			default:
				output.push("<!-- Element not recognized - Type: ", node.nodeType, " Name: ", node.nodeName, "-->");
		}
	};

	exports.getChildrenHtml = function(/*DomNode*/ node){
		// summary:
		//		Returns the html content of a DomNode's children
		var output = [];
		exports.getChildrenHtmlHelper(node, output);
		return output.join("");
	};

	exports.getChildrenHtmlHelper = function(/*DomNode*/ dom, /*String[]*/ output){
		// summary:
		//		Pushes the html content of a DomNode's children into out[]

		if(!dom){
			return;
		}
		var nodes = dom["childNodes"] || dom;

		// IE issue.
		// If we have an actual node we can check parent relationships on for IE,
		// We should check, as IE sometimes builds invalid DOMS.  If no parent, we can't check
		// And should just process it and hope for the best.
		var checkParent = !has("ie") || nodes !== dom;

		var node, i = 0;
		while((node = nodes[i++])){
			// IE is broken.  DOMs are supposed to be a tree.  But in the case of malformed HTML, IE generates a graph
			// meaning one node ends up with multiple references (multiple parents).  This is totally wrong and invalid, but
			// such is what it is.  We have to keep track and check for this because otherwise the source output HTML will have dups.
			// No other browser generates a graph.  Leave it to IE to break a fundamental DOM rule.  So, we check the parent if we can
			// If we can't, nothing more we can do other than walk it.
			if(!checkParent || node.parentNode == dom){
				exports.getNodeHtmlHelper(node, output);
			}
		}
	};

	return exports;
});

},
'dijit/_editor/plugins/LinkDialog':function(){
define([
	"require",
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.get
	"dojo/keys", // keys.ENTER
	"dojo/_base/lang", // lang.delegate lang.hitch lang.trim
	"dojo/on",
	"dojo/sniff", // has("ie")
	"dojo/query", // query
	"dojo/string", // string.substitute
	"../_Plugin",
	"../../form/DropDownButton",
	"../range"
], function(require, declare, domAttr, keys, lang, on, has, query, string,
	_Plugin, DropDownButton, rangeapi){

	// module:
	//		dijit/_editor/plugins/LinkDialog

	var LinkDialog = declare("dijit._editor.plugins.LinkDialog", _Plugin, {
		// summary:
		//		This plugin provides the basis for an 'anchor' (link) dialog and an extension of it
		//		provides the image link dialog.
		// description:
		//		The command provided by this plugin is:
		//
		//		- createLink

		// Override _Plugin.buttonClass.   This plugin is controlled by a DropDownButton
		// (which triggers a TooltipDialog).
		buttonClass: DropDownButton,

		// Override _Plugin.useDefaultCommand... processing is handled by this plugin, not by dijit/Editor.
		useDefaultCommand: false,

		// urlRegExp: [protected] String
		//		Used for validating input as correct URL.  While file:// urls are not terribly
		//		useful, they are technically valid.
		urlRegExp: "((https?|ftps?|file)\\://|\./|\.\./|/|)(/[a-zA-Z]{1,1}:/|)(((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)*(?:[a-zA-Z](?:[-\\da-zA-Z]{0,80}[\\da-zA-Z])?)\\.?)|(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])|(0[xX]0*[\\da-fA-F]?[\\da-fA-F]\\.){3}0[xX]0*[\\da-fA-F]?[\\da-fA-F]|(0+[0-3][0-7][0-7]\\.){3}0+[0-3][0-7][0-7]|(0|[1-9]\\d{0,8}|[1-3]\\d{9}|4[01]\\d{8}|42[0-8]\\d{7}|429[0-3]\\d{6}|4294[0-8]\\d{5}|42949[0-5]\\d{4}|429496[0-6]\\d{3}|4294967[01]\\d{2}|42949672[0-8]\\d|429496729[0-5])|0[xX]0*[\\da-fA-F]{1,8}|([\\da-fA-F]{1,4}\\:){7}[\\da-fA-F]{1,4}|([\\da-fA-F]{1,4}\\:){6}((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])))(\\:\\d+)?(/(?:[^?#\\s/]+/)*(?:[^?#\\s/]{0,}(?:\\?[^?#\\s/]*)?(?:#.*)?)?)?",

		// emailRegExp: [protected] String
		//		Used for validating input as correct email address.  Taken from dojox.validate
		emailRegExp: "<?(mailto\\:)([!#-'*+\\-\\/-9=?A-Z^-~]+[.])*[!#-'*+\\-\\/-9=?A-Z^-~]+" /*username*/ + "@" +
			"((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)+(?:[a-zA-Z](?:[-\\da-zA-Z]{0,6}[\\da-zA-Z])?)\\.?)|localhost|^[^-][a-zA-Z0-9_-]*>?", // host.

		// htmlTemplate: [protected] String
		//		String used for templating the HTML to insert at the desired point.
		htmlTemplate: "<a href=\"${urlInput}\" _djrealurl=\"${urlInput}\"" +
			" target=\"${targetSelect}\"" +
			">${textInput}</a>",

		// tag: [protected] String
		//		Tag used for the link type.
		tag: "a",

		// _hostRxp [private] RegExp
		//		Regular expression used to validate url fragments (ip address, hostname, etc)
		_hostRxp: /^((([^\[:]+):)?([^@]+)@)?(\[([^\]]+)\]|([^\[:]*))(:([0-9]+))?$/,

		// _userAtRxp [private] RegExp
		//		Regular expression used to validate e-mail address fragment.
		_userAtRxp: /^([!#-'*+\-\/-9=?A-Z^-~]+[.])*[!#-'*+\-\/-9=?A-Z^-~]+@/i,

		// linkDialogTemplate: [protected] String
		//		Template for contents of TooltipDialog to pick URL
		linkDialogTemplate: [
			"<table role='presentation'><tr><td>",
			"<label for='${id}_urlInput'>${url}</label>",
			"</td><td>",
			"<input data-dojo-type='dijit.form.ValidationTextBox' required='true' " +
				"id='${id}_urlInput' name='urlInput' data-dojo-props='intermediateChanges:true'/>",
			"</td></tr><tr><td>",
			"<label for='${id}_textInput'>${text}</label>",
			"</td><td>",
			"<input data-dojo-type='dijit.form.ValidationTextBox' required='true' id='${id}_textInput' " +
				"name='textInput' data-dojo-props='intermediateChanges:true'/>",
			"</td></tr><tr><td>",
			"<label for='${id}_targetSelect'>${target}</label>",
			"</td><td>",
			"<select id='${id}_targetSelect' name='targetSelect' data-dojo-type='dijit.form.Select'>",
			"<option selected='selected' value='_self'>${currentWindow}</option>",
			"<option value='_blank'>${newWindow}</option>",
			"<option value='_top'>${topWindow}</option>",
			"<option value='_parent'>${parentWindow}</option>",
			"</select>",
			"</td></tr><tr><td colspan='2'>",
			"<button data-dojo-type='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>",
			"<button data-dojo-type='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>",
			"</td></tr></table>"
		].join(""),

		_initButton: function(){
			this.inherited(arguments);

			// Setup to lazy create TooltipDialog first time the button is clicked
			this.button.loadDropDown = lang.hitch(this, "_loadDropDown");

			this._connectTagEvents();
		},
		_loadDropDown: function(callback){
			// Called the first time the button is pressed.  Initialize TooltipDialog.
			require([
				"dojo/i18n", // i18n.getLocalization
				"../../TooltipDialog",
				"../../registry", // registry.byId, registry.getUniqueId
				"../../form/Button", // used by template
				"../../form/Select", // used by template
				"../../form/ValidationTextBox", // used by template
				"dojo/i18n!../../nls/common",
				"dojo/i18n!../nls/LinkDialog"
			], lang.hitch(this, function(i18n, TooltipDialog, registry){
				var _this = this;
				this.tag = this.command == 'insertImage' ? 'img' : 'a';
				var messages = lang.delegate(i18n.getLocalization("dijit", "common", this.lang),
					i18n.getLocalization("dijit._editor", "LinkDialog", this.lang));
				var dropDown = (this.dropDown = this.button.dropDown = new TooltipDialog({
					title: messages[this.command + "Title"],
					ownerDocument: this.editor.ownerDocument,
					dir: this.editor.dir,
					execute: lang.hitch(this, "setValue"),
					onOpen: function(){
						_this._onOpenDialog();
						TooltipDialog.prototype.onOpen.apply(this, arguments);
					},
					onCancel: function(){
						setTimeout(lang.hitch(_this, "_onCloseDialog"), 0);
					}
				}));
				messages.urlRegExp = this.urlRegExp;
				messages.id = registry.getUniqueId(this.editor.id);
				this._uniqueId = messages.id;
				this._setContent(dropDown.title +
					"<div style='border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'></div>" +
					string.substitute(this.linkDialogTemplate, messages));
				dropDown.startup();
				this._urlInput = registry.byId(this._uniqueId + "_urlInput");
				this._textInput = registry.byId(this._uniqueId + "_textInput");
				this._setButton = registry.byId(this._uniqueId + "_setButton");
				this.own(registry.byId(this._uniqueId + "_cancelButton").on("click", lang.hitch(this.dropDown, "onCancel")));
				if(this._urlInput){
					this.own(this._urlInput.on("change", lang.hitch(this, "_checkAndFixInput")));
				}
				if(this._textInput){
					this.own(this._textInput.on("change", lang.hitch(this, "_checkAndFixInput")));
				}

				// Build up the dual check for http/https/file:, and mailto formats.
				this._urlRegExp = new RegExp("^" + this.urlRegExp + "$", "i");
				this._emailRegExp = new RegExp("^" + this.emailRegExp + "$", "i");
				this._urlInput.isValid = lang.hitch(this, function(){
					// Function over-ride of isValid to test if the input matches a url or a mailto style link.
					var value = this._urlInput.get("value");
					return this._urlRegExp.test(value) || this._emailRegExp.test(value);
				});

				// Listen for enter and execute if valid.
				this.own(on(dropDown.domNode, "keydown", lang.hitch(this, lang.hitch(this, function(e){
					if(e && e.keyCode == keys.ENTER && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey){
						if(!this._setButton.get("disabled")){
							dropDown.onExecute();
							dropDown.execute(dropDown.get('value'));
						}
					}
				}))));

				callback();
			}));
		},

		_checkAndFixInput: function(){
			// summary:
			//		A function to listen for onChange events and test the input contents
			//		for valid information, such as valid urls with http/https/ftp and if
			//		not present, try and guess if the input url is relative or not, and if
			//		not, append http:// to it.  Also validates other fields as determined by
			//		the internal _isValid function.
			var self = this;
			var url = this._urlInput.get("value");
			var fixupUrl = function(url){
				var appendHttp = false;
				var appendMailto = false;
				if(url && url.length > 1){
					url = lang.trim(url);
					if(url.indexOf("mailto:") !== 0){
						if(url.indexOf("/") > 0){
							if(url.indexOf("://") === -1){
								// Check that it doesn't start with /, ./, or ../, which would
								// imply 'target server relativeness'
								if(url.charAt(0) !== '/' && url.indexOf("./") && url.indexOf("../") !== 0){
									if(self._hostRxp.test(url)){
										appendHttp = true;
									}
								}
							}
						}else if(self._userAtRxp.test(url)){
							// If it looks like a foo@, append a mailto.
							appendMailto = true;
						}
					}
				}
				if(appendHttp){
					self._urlInput.set("value", "http://" + url);
				}
				if(appendMailto){
					self._urlInput.set("value", "mailto:" + url);
				}
				self._setButton.set("disabled", !self._isValid());
			};
			if(this._delayedCheck){
				clearTimeout(this._delayedCheck);
				this._delayedCheck = null;
			}
			this._delayedCheck = setTimeout(function(){
				fixupUrl(url);
			}, 250);
		},

		_connectTagEvents: function(){
			// summary:
			//		Over-ridable function that connects tag specific events.
			this.editor.onLoadDeferred.then(lang.hitch(this, function(){
				this.own(on(this.editor.editNode, "dblclick", lang.hitch(this, "_onDblClick")));
			}));
		},

		_isValid: function(){
			// summary:
			//		Internal function to allow validating of the inputs
			//		for a link to determine if set should be disabled or not
			// tags:
			//		protected
			return this._urlInput.isValid() && this._textInput.isValid();
		},

		_setContent: function(staticPanel){
			// summary:
			//		Helper for _initButton above.   Not sure why it's a separate method.
			this.dropDown.set({
				parserScope: "dojo", // make parser search for dojoType/data-dojo-type even if page is multi-version
				content: staticPanel
			});
		},

		_checkValues: function(args){
			// summary:
			//		Function to check the values in args and 'fix' them up as needed.
			// args: Object
			//		Content being set.
			// tags:
			//		protected
			if(args && args.urlInput){
				args.urlInput = args.urlInput.replace(/"/g, "&quot;");
			}
			return args;
		},

		setValue: function(args){
			// summary:
			//		Callback from the dialog when user presses "set" button.
			// tags:
			//		private

			// TODO: prevent closing popup if the text is empty
			this._onCloseDialog();
			if(has("ie") < 9){ //see #4151
				var sel = rangeapi.getSelection(this.editor.window);
				var range = sel.getRangeAt(0);
				var a = range.endContainer;
				if(a.nodeType === 3){
					// Text node, may be the link contents, so check parent.
					// This plugin doesn't really support nested HTML elements
					// in the link, it assumes all link content is text.
					a = a.parentNode;
				}
				if(a && (a.nodeName && a.nodeName.toLowerCase() !== this.tag)){
					// Still nothing, one last thing to try on IE, as it might be 'img'
					// and thus considered a control.
					a = this.editor.selection.getSelectedElement(this.tag);
				}
				if(a && (a.nodeName && a.nodeName.toLowerCase() === this.tag)){
					// Okay, we do have a match.  IE, for some reason, sometimes pastes before
					// instead of removing the targeted paste-over element, so we unlink the
					// old one first.  If we do not the <a> tag remains, but it has no content,
					// so isn't readily visible (but is wrong for the action).
					if(this.editor.queryCommandEnabled("unlink")){
						// Select all the link children, then unlink.  The following insert will
						// then replace the selected text.
						this.editor.selection.selectElementChildren(a);
						this.editor.execCommand("unlink");
					}
				}
			}
			// make sure values are properly escaped, etc.
			args = this._checkValues(args);
			this.editor.execCommand('inserthtml',
				string.substitute(this.htmlTemplate, args));

			// IE sometimes leaves a blank link, so we need to fix it up.
			// Go ahead and do this for everyone just to avoid blank links
			// in the page.
			query("a", this.editor.document).forEach(function(a){
				if(!a.innerHTML && !domAttr.has(a, "name")){
					// Remove empty anchors that do not have "name" set.
					// Empty ones with a name set could be a hidden hash
					// anchor.
					a.parentNode.removeChild(a);
				}
			}, this);
		},

		_onCloseDialog: function(){
			// summary:
			//		Handler for close event on the dialog

			if(this.editor.focused){
				// put focus back in the edit area, unless the dialog closed because the user clicked somewhere else
				this.editor.focus();
			}
		},

		_getCurrentValues: function(a){
			// summary:
			//		Over-ride for getting the values to set in the dropdown.
			// a:
			//		The anchor/link to process for data for the dropdown.
			// tags:
			//		protected
			var url, text, target;
			if(a && a.tagName.toLowerCase() === this.tag){
				url = a.getAttribute('_djrealurl') || a.getAttribute('href');
				target = a.getAttribute('target') || "_self";
				text = a.textContent || a.innerText;
				this.editor.selection.selectElement(a, true);
			}else{
				text = this.editor.selection.getSelectedText();
			}
			return {urlInput: url || '', textInput: text || '', targetSelect: target || ''}; //Object;
		},

		_onOpenDialog: function(){
			// summary:
			//		Handler for when the dialog is opened.
			//		If the caret is currently in a URL then populate the URL's info into the dialog.
			var a, b, fc;
			if(has("ie")){
				// IE, even IE10, is difficult to select the element in, using the range unified
				// API seems to work reasonably well.
				var sel = rangeapi.getSelection(this.editor.window);
				if(sel.rangeCount){
					var range = sel.getRangeAt(0);
					a = range.endContainer;
					if(a.nodeType === 3){
						// Text node, may be the link contents, so check parent.
						// This plugin doesn't really support nested HTML elements
						// in the link, it assumes all link content is text.
						a = a.parentNode;
					}
					if(a && (a.nodeName && a.nodeName.toLowerCase() !== this.tag)){
						// Still nothing, one last thing to try on IE, as it might be 'img'
						// and thus considered a control.
						a = this.editor.selection.getSelectedElement(this.tag);
					}
					if(!a || (a.nodeName && a.nodeName.toLowerCase() !== this.tag)){
						// Try another lookup, IE's selection is just terrible.
						b = this.editor.selection.getAncestorElement(this.tag);
						if(b && (b.nodeName && b.nodeName.toLowerCase() == this.tag)){
							// Looks like we found an A tag, use it and make sure just it is
							// selected.
							a = b;
							this.editor.selection.selectElement(a);
						}else if(range.startContainer === range.endContainer){
							// STILL nothing.  Trying one more thing.  Lets look at the first child.
							// It might be an anchor tag in a div by itself or the like.  If it is,
							// we'll use it otherwise we give up.  The selection is not easily
							// determinable to be on an existing anchor tag.
							fc = range.startContainer.firstChild;
							if(fc && (fc.nodeName && fc.nodeName.toLowerCase() == this.tag)){
								a = fc;
								this.editor.selection.selectElement(a);
							}
						}
					}
				}
			}else{
				a = this.editor.selection.getAncestorElement(this.tag);
			}
			this.dropDown.reset();
			this._setButton.set("disabled", true);
			this.dropDown.set("value", this._getCurrentValues(a));
		},

		_onDblClick: function(e){
			// summary:
			//		Function to define a behavior on double clicks on the element
			//		type this dialog edits to select it and pop up the editor
			//		dialog.
			// e: Object
			//		The double-click event.
			// tags:
			//		protected.
			if(e && e.target){
				var t = e.target;
				var tg = t.tagName ? t.tagName.toLowerCase() : "";
				if(tg === this.tag && domAttr.get(t, "href")){
					var editor = this.editor;

					this.editor.selection.selectElement(t);
					editor.onDisplayChanged();

					// Call onNormalizedDisplayChange() now, rather than on timer.
					// On IE, when focus goes to the first <input> in the TooltipDialog, the editor loses it's selection.
					// Later if onNormalizedDisplayChange() gets called via the timer it will disable the LinkDialog button
					// (actually, all the toolbar buttons), at which point clicking the <input> will close the dialog,
					// since (for unknown reasons) focus.js ignores disabled controls.
					if(editor._updateTimer){
						editor._updateTimer.remove();
						delete editor._updateTimer;
					}
					editor.onNormalizedDisplayChanged();

					var button = this.button;
					setTimeout(function(){
						// Focus shift outside the event handler.
						// IE doesn't like focus changes in event handles.
						button.set("disabled", false);
						button.loadAndOpenDropDown().then(function(){
							if(button.dropDown.focus){
								button.dropDown.focus();
							}
						});
					}, 10);
				}
			}
		}
	});

	var ImgLinkDialog = declare("dijit._editor.plugins.ImgLinkDialog", [LinkDialog], {
		// summary:
		//		This plugin extends LinkDialog and adds in a plugin for handling image links.
		//		provides the image link dialog.
		// description:
		//		The command provided by this plugin is:
		//
		//		- insertImage

		// linkDialogTemplate: [protected] String
		//		Over-ride for template since img dialog doesn't need target that anchor tags may.
		linkDialogTemplate: [
			"<table role='presentation'><tr><td>",
			"<label for='${id}_urlInput'>${url}</label>",
			"</td><td>",
			"<input dojoType='dijit.form.ValidationTextBox' regExp='${urlRegExp}' " +
				"required='true' id='${id}_urlInput' name='urlInput' data-dojo-props='intermediateChanges:true'/>",
			"</td></tr><tr><td>",
			"<label for='${id}_textInput'>${text}</label>",
			"</td><td>",
			"<input data-dojo-type='dijit.form.ValidationTextBox' required='false' id='${id}_textInput' " +
				"name='textInput' data-dojo-props='intermediateChanges:true'/>",
			"</td></tr><tr><td>",
			"</td><td>",
			"</td></tr><tr><td colspan='2'>",
			"<button data-dojo-type='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>",
			"<button data-dojo-type='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>",
			"</td></tr></table>"
		].join(""),

		// htmlTemplate: [protected] String
		//		String used for templating the `<img>` HTML to insert at the desired point.
		htmlTemplate: "<img src=\"${urlInput}\" _djrealurl=\"${urlInput}\" alt=\"${textInput}\" />",

		// tag: [protected] String
		//		Tag used for the link type (img).
		tag: "img",

		_getCurrentValues: function(img){
			// summary:
			//		Over-ride for getting the values to set in the dropdown.
			// a:
			//		The anchor/link to process for data for the dropdown.
			// tags:
			//		protected
			var url, text;
			if(img && img.tagName.toLowerCase() === this.tag){
				url = img.getAttribute('_djrealurl') || img.getAttribute('src');
				text = img.getAttribute('alt');
				this.editor.selection.selectElement(img, true);
			}else{
				text = this.editor.selection.getSelectedText();
			}
			return {urlInput: url || '', textInput: text || ''}; //Object
		},

		_isValid: function(){
			// summary:
			//		Over-ride for images.  You can have alt text of blank, it is valid.
			// tags:
			//		protected
			return this._urlInput.isValid();
		},

		_connectTagEvents: function(){
			// summary:
			//		Over-ridable function that connects tag specific events.
			this.inherited(arguments);
			this.editor.onLoadDeferred.then(lang.hitch(this, function(){
				// Use onmousedown instead of onclick.  Seems that IE eats the first onclick
				// to wrap it in a selector box, then the second one acts as onclick.  See #10420
				this.own(on(this.editor.editNode, "mousedown", lang.hitch(this, "_selectTag")));
			}));
		},

		_selectTag: function(e){
			// summary:
			//		A simple event handler that lets me select an image if it is clicked on.
			//		makes it easier to select images in a standard way across browsers.  Otherwise
			//		selecting an image for edit becomes difficult.
			// e: Event
			//		The mousedown event.
			// tags:
			//		private
			if(e && e.target){
				var t = e.target;
				var tg = t.tagName ? t.tagName.toLowerCase() : "";
				if(tg === this.tag){
					this.editor.selection.selectElement(t);
				}
			}
		},

		_checkValues: function(args){
			// summary:
			//		Function to check the values in args and 'fix' them up as needed
			//		(special characters in the url or alt text)
			// args: Object
			//		Content being set.
			// tags:
			//		protected
			if(args && args.urlInput){
				args.urlInput = args.urlInput.replace(/"/g, "&quot;");
			}
			if(args && args.textInput){
				args.textInput = args.textInput.replace(/"/g, "&quot;");
			}
			return args;
		},

		_onDblClick: function(e){
			// summary:
			//		Function to define a behavior on double clicks on the element
			//		type this dialog edits to select it and pop up the editor
			//		dialog.
			// e: Object
			//		The double-click event.
			// tags:
			//		protected.
			if(e && e.target){
				var t = e.target;
				var tg = t.tagName ? t.tagName.toLowerCase() : "";
				if(tg === this.tag && domAttr.get(t, "src")){
					var editor = this.editor;

					this.editor.selection.selectElement(t);
					editor.onDisplayChanged();

					// Call onNormalizedDisplayChange() now, rather than on timer.
					// On IE, when focus goes to the first <input> in the TooltipDialog, the editor loses it's selection.
					// Later if onNormalizedDisplayChange() gets called via the timer it will disable the LinkDialog button
					// (actually, all the toolbar buttons), at which point clicking the <input> will close the dialog,
					// since (for unknown reasons) focus.js ignores disabled controls.
					if(editor._updateTimer){
						editor._updateTimer.remove();
						delete editor._updateTimer;
					}
					editor.onNormalizedDisplayChanged();

					var button = this.button;
					setTimeout(function(){
						// Focus shift outside the event handler.
						// IE doesn't like focus changes in event handles.
						button.set("disabled", false);
						button.loadAndOpenDropDown().then(function(){
							if(button.dropDown.focus){
								button.dropDown.focus();
							}
						});
					}, 10);
				}
			}
		}
	});

	// Register these plugins
	_Plugin.registry["createLink"] = function(){
		return new LinkDialog({command: "createLink"});
	};
	_Plugin.registry["insertImage"] = function(){
		return new ImgLinkDialog({command: "insertImage"});
	};


	// Export both LinkDialog and ImgLinkDialog
	// TODO for 2.0: either return both classes in a hash, or split this file into two separate files.
	// Then the documentation for the module can be applied to the hash, and will show up in the API doc.
	LinkDialog.ImgLinkDialog = ImgLinkDialog;
	return LinkDialog;
});

},
'dijit/_editor/plugins/ViewSource':function(){
define([
	"dojo/_base/array", // array.forEach
	"dojo/aspect", // Aspect commands for advice
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/dom-construct", // domConstruct.create domConstruct.place
	"dojo/dom-geometry", // domGeometry.setMarginBox domGeometry.position
	"dojo/dom-style", // domStyle.set
	"dojo/i18n", // i18n.getLocalization
	"dojo/keys", // keys.F12
	"dojo/_base/lang", // lang.hitch
	"dojo/on", // on()
	"dojo/sniff", // has("ie")
	"dojo/window", // winUtils.getBox
	"../../focus", // focus.focus()
	"../_Plugin",
	"../../form/ToggleButton",
	"../..", // dijit._scopeName
	"../../registry", // registry.getEnclosingWidget()
	"dojo/i18n!../nls/commands"
], function(array, aspect, declare, domAttr, domConstruct, domGeometry, domStyle, i18n, keys, lang, on, has, winUtils,
			focus, _Plugin, ToggleButton, dijit, registry){

	// module:
	//		dijit/_editor/plugins/ViewSource

	var ViewSource = declare("dijit._editor.plugins.ViewSource", _Plugin, {
		// summary:
		//		This plugin provides a simple view source capability.  When view
		//		source mode is enabled, it disables all other buttons/plugins on the RTE.
		//		It also binds to the hotkey: CTRL-SHIFT-F11 for toggling ViewSource mode.

		// stripScripts: [public] Boolean
		//		Boolean flag used to indicate if script tags should be stripped from the document.
		//		Defaults to true.
		stripScripts: true,

		// stripComments: [public] Boolean
		//		Boolean flag used to indicate if comment tags should be stripped from the document.
		//		Defaults to true.
		stripComments: true,

		// stripComments: [public] Boolean
		//		Boolean flag used to indicate if iframe tags should be stripped from the document.
		//		Defaults to true.
		stripIFrames: true,

		// readOnly: [const] Boolean
		//		Boolean flag used to indicate if the source view should be readonly or not.
		//		Cannot be changed after initialization of the plugin.
		//		Defaults to false.
		readOnly: false,

		// _fsPlugin: [private] Object
		//		Reference to a registered fullscreen plugin so that viewSource knows
		//		how to scale.
		_fsPlugin: null,

		toggle: function(){
			// summary:
			//		Function to allow programmatic toggling of the view.

			// For Webkit, we have to focus a very particular way.
			// when swapping views, otherwise focus doesn't shift right
			// but can't focus this way all the time, only for VS changes.
			// If we did it all the time, buttons like bold, italic, etc
			// break.
			if(has("webkit")){
				this._vsFocused = true;
			}
			this.button.set("checked", !this.button.get("checked"));

		},

		_initButton: function(){
			// summary:
			//		Over-ride for creation of the resize button.
			var strings = i18n.getLocalization("dijit._editor", "commands"),
				editor = this.editor;
			this.button = new ToggleButton({
				label: strings["viewSource"],
				ownerDocument: editor.ownerDocument,
				dir: editor.dir,
				lang: editor.lang,
				showLabel: false,
				iconClass: this.iconClassPrefix + " " + this.iconClassPrefix + "ViewSource",
				tabIndex: "-1",
				onChange: lang.hitch(this, "_showSource")
			});

			// Make sure readonly mode doesn't make the wrong cursor appear over the button.
			this.button.set("readOnly", false);
		},


		setEditor: function(/*dijit/Editor*/ editor){
			// summary:
			//		Tell the plugin which Editor it is associated with.
			// editor: Object
			//		The editor object to attach the print capability to.
			this.editor = editor;
			this._initButton();

			this.editor.addKeyHandler(keys.F12, true, true, lang.hitch(this, function(e){
				// Move the focus before switching
				// It'll focus back.  Hiding a focused
				// node causes issues.
				this.button.focus();
				this.toggle();
				e.stopPropagation();
				e.preventDefault();

				// Call the focus shift outside of the handler.
				setTimeout(lang.hitch(this, function(){
					// Focus the textarea... unless focus has moved outside of the editor completely during the timeout.
					// Since we override focus, so we just need to call it.
					if(this.editor.focused){
						this.editor.focus();
					}
				}), 100);
			}));
		},

		_showSource: function(source){
			// summary:
			//		Function to toggle between the source and RTE views.
			// source: boolean
			//		Boolean value indicating if it should be in source mode or not.
			// tags:
			//		private
			var ed = this.editor;
			var edPlugins = ed._plugins;
			var html;
			this._sourceShown = source;
			var self = this;
			try{
				if(!this.sourceArea){
					this._createSourceView();
				}
				if(source){
					// Update the QueryCommandEnabled function to disable everything but
					// the source view mode.  Have to over-ride a function, then kick all
					// plugins to check their state.
					ed._sourceQueryCommandEnabled = ed.queryCommandEnabled;
					ed.queryCommandEnabled = function(cmd){
						return cmd.toLowerCase() === "viewsource";
					};
					this.editor.onDisplayChanged();
					html = ed.get("value");
					html = this._filter(html);
					ed.set("value", html);
					array.forEach(edPlugins, function(p){
						// Turn off any plugins not controlled by queryCommandenabled.
						if(p && !(p instanceof ViewSource) && p.isInstanceOf(_Plugin)){
							p.set("disabled", true)
						}
					});

					// We actually do need to trap this plugin and adjust how we
					// display the textarea.
					if(this._fsPlugin){
						this._fsPlugin._getAltViewNode = function(){
							return self.sourceArea;
						};
					}

					this.sourceArea.value = html;

					// Since neither iframe nor textarea have margin, border, or padding,
					// just set sizes equal.
					this.sourceArea.style.height = ed.iframe.style.height;
					this.sourceArea.style.width = ed.iframe.style.width;

					// Hide the iframe and show the HTML source <textarea>.  But don't use display:none because
					// that loses scroll position, and also causes weird problems on FF (see #18607).
					ed.iframe.parentNode.style.position = "relative";
					domStyle.set(ed.iframe, {
						position: "absolute",
						top: 0,
						visibility: "hidden"
					});
					domStyle.set(this.sourceArea, {
						display: "block"
					});

					var resizer = function(){
						// function to handle resize events.
						// Will check current VP and only resize if
						// different.
						var vp = winUtils.getBox(ed.ownerDocument);

						if("_prevW" in this && "_prevH" in this){
							// No actual size change, ignore.
							if(vp.w === this._prevW && vp.h === this._prevH){
								return;
							}else{
								this._prevW = vp.w;
								this._prevH = vp.h;
							}
						}else{
							this._prevW = vp.w;
							this._prevH = vp.h;
						}
						if(this._resizer){
							clearTimeout(this._resizer);
							delete this._resizer;
						}
						// Timeout it to help avoid spamming resize on IE.
						// Works for all browsers.
						this._resizer = setTimeout(lang.hitch(this, function(){
							delete this._resizer;
							this._resize();
						}), 10);
					};
					this._resizeHandle = on(window, "resize", lang.hitch(this, resizer));

					//Call this on a delay once to deal with IE glitchiness on initial size.
					setTimeout(lang.hitch(this, this._resize), 100);

					//Trigger a check for command enablement/disablement.
					this.editor.onNormalizedDisplayChanged();

					this.editor.__oldGetValue = this.editor.getValue;
					this.editor.getValue = lang.hitch(this, function(){
						var txt = this.sourceArea.value;
						txt = this._filter(txt);
						return txt;
					});

					this._setListener = aspect.after(this.editor, "setValue", lang.hitch(this, function(htmlTxt){
						htmlTxt = htmlTxt || "";
						htmlTxt = this._filter(htmlTxt);
						this.sourceArea.value = htmlTxt;
					}), true);
				}else{
					// First check that we were in source view before doing anything.
					// corner case for being called with a value of false and we hadn't
					// actually been in source display mode.
					if(!ed._sourceQueryCommandEnabled){
						return;
					}

					// Remove the set listener.
					this._setListener.remove();
					delete this._setListener;

					this._resizeHandle.remove();
					delete this._resizeHandle;

					if(this.editor.__oldGetValue){
						this.editor.getValue = this.editor.__oldGetValue;
						delete this.editor.__oldGetValue;
					}

					// Restore all the plugin buttons state.
					ed.queryCommandEnabled = ed._sourceQueryCommandEnabled;
					if(!this._readOnly){
						html = this.sourceArea.value;
						html = this._filter(html);
						ed.beginEditing();
						ed.set("value", html);
						ed.endEditing();
					}

					array.forEach(edPlugins, function(p){
						// Turn back on any plugins we turned off.
						if(p && p.isInstanceOf(_Plugin)){
							p.set("disabled", false);
						}
					});

					domStyle.set(this.sourceArea, "display", "none");
					domStyle.set(ed.iframe, {
						position: "relative",
						visibility: "visible"
					});
					delete ed._sourceQueryCommandEnabled;

					//Trigger a check for command enablement/disablement.
					this.editor.onDisplayChanged();
				}
				// Call a delayed resize to wait for some things to display in header/footer.
				setTimeout(lang.hitch(this, function(){
					// Make resize calls.
					var parent = ed.domNode.parentNode;
					if(parent){
						var container = registry.getEnclosingWidget(parent);
						if(container && container.resize){
							container.resize();
						}
					}
					ed.resize();
				}), 300);
			}catch(e){
				console.log(e);
			}
		},

		updateState: function(){
			// summary:
			//		Over-ride for button state control for disabled to work.
			this.button.set("disabled", this.get("disabled"));
		},

		_resize: function(){
			// summary:
			//		Internal function to resize the source view
			// tags:
			//		private
			var ed = this.editor;
			var tbH = ed.getHeaderHeight();
			var fH = ed.getFooterHeight();
			var eb = domGeometry.position(ed.domNode);

			// Styles are now applied to the internal source container, so we have
			// to subtract them off.
			var containerPadding = domGeometry.getPadBorderExtents(ed.iframe.parentNode);
			var containerMargin = domGeometry.getMarginExtents(ed.iframe.parentNode);

			var extents = domGeometry.getPadBorderExtents(ed.domNode);
			var edb = {
				w: eb.w - extents.w,
				h: eb.h - (tbH + extents.h + fH)
			};

			// Fullscreen gets odd, so we need to check for the FS plugin and
			// adapt.
			if(this._fsPlugin && this._fsPlugin.isFullscreen){
				// Okay, probably in FS, adjust.
				var vp = winUtils.getBox(ed.ownerDocument);
				edb.w = (vp.w - extents.w);
				edb.h = (vp.h - (tbH + extents.h + fH));
			}

			domGeometry.setMarginBox(this.sourceArea, {
				w: Math.round(edb.w - (containerPadding.w + containerMargin.w)),
				h: Math.round(edb.h - (containerPadding.h + containerMargin.h))
			});
		},

		_createSourceView: function(){
			// summary:
			//		Internal function for creating the source view area.
			// tags:
			//		private
			var ed = this.editor;
			var edPlugins = ed._plugins;
			this.sourceArea = domConstruct.create("textarea");
			if(this.readOnly){
				domAttr.set(this.sourceArea, "readOnly", true);
				this._readOnly = true;
			}
			domStyle.set(this.sourceArea, {
				padding: "0px",
				margin: "0px",
				borderWidth: "0px",
				borderStyle: "none"
			});
			domAttr.set(this.sourceArea, "aria-label", this.editor.id);

			domConstruct.place(this.sourceArea, ed.iframe, "before");

			if(has("ie") && ed.iframe.parentNode.lastChild !== ed.iframe){
				// There's some weirdo div in IE used for focus control
				// But is messed up scaling the textarea if we don't config
				// it some so it doesn't have a varying height.
				domStyle.set(ed.iframe.parentNode.lastChild, {
					width: "0px",
					height: "0px",
					padding: "0px",
					margin: "0px",
					borderWidth: "0px",
					borderStyle: "none"
				});
			}

			// We also need to take over editor focus a bit here, so that focus calls to
			// focus the editor will focus to the right node when VS is active.
			ed._viewsource_oldFocus = ed.focus;
			var self = this;
			ed.focus = function(){
				if(self._sourceShown){
					self.setSourceAreaCaret();
				}else{
					try{
						if(this._vsFocused){
							delete this._vsFocused;
							// Must focus edit node in this case (webkit only) or
							// focus doesn't shift right, but in normal
							// cases we focus with the regular function.
							focus.focus(ed.editNode);
						}else{
							ed._viewsource_oldFocus();
						}
					}catch(e){
						console.log("ViewSource focus code error: " + e);
					}
				}
			};

			var i, p;
			for(i = 0; i < edPlugins.length; i++){
				// We actually do need to trap this plugin and adjust how we
				// display the textarea.
				p = edPlugins[i];
				if(p && (p.declaredClass === "dijit._editor.plugins.FullScreen" ||
					p.declaredClass === (dijit._scopeName +
						"._editor.plugins.FullScreen"))){
					this._fsPlugin = p;
					break;
				}
			}
			if(this._fsPlugin){
				// Found, we need to over-ride the alt-view node function
				// on FullScreen with our own, chain up to parent call when appropriate.
				this._fsPlugin._viewsource_getAltViewNode = this._fsPlugin._getAltViewNode;
				this._fsPlugin._getAltViewNode = function(){
					return self._sourceShown ? self.sourceArea : this._viewsource_getAltViewNode();
				};
			}

			// Listen to the source area for key events as well, as we need to be able to hotkey toggle
			// it from there too.
			this.own(on(this.sourceArea, "keydown", lang.hitch(this, function(e){
				if(this._sourceShown && e.keyCode == keys.F12 && e.ctrlKey && e.shiftKey){
					this.button.focus();
					this.button.set("checked", false);
					setTimeout(lang.hitch(this, function(){
						ed.focus();
					}), 100);
					e.stopPropagation();
					e.preventDefault();
				}
			})));
		},

		_stripScripts: function(html){
			// summary:
			//		Strips out script tags from the HTML used in editor.
			// html: String
			//		The HTML to filter
			// tags:
			//		private
			if(html){
				// Look for closed and unclosed (malformed) script attacks.
				html = html.replace(/<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>/ig, "");
				html = html.replace(/<\s*script\b([^<>]|\s)*>?/ig, "");
				html = html.replace(/<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>/ig, "");
			}
			return html;
		},

		_stripComments: function(html){
			// summary:
			//		Strips out comments from the HTML used in editor.
			// html: String
			//		The HTML to filter
			// tags:
			//		private
			if(html){
				html = html.replace(/<!--(.|\s){1,}?-->/g, "");
			}
			return html;
		},

		_stripIFrames: function(html){
			// summary:
			//		Strips out iframe tags from the content, to avoid iframe script
			//		style injection attacks.
			// html: String
			//		The HTML to filter
			// tags:
			//		private
			if(html){
				html = html.replace(/<\s*iframe[^>]*>((.|\s)*?)<\\?\/\s*iframe\s*>/ig, "");
			}
			return html;
		},

		_filter: function(html){
			// summary:
			//		Internal function to perform some filtering on the HTML.
			// html: String
			//		The HTML to filter
			// tags:
			//		private
			if(html){
				if(this.stripScripts){
					html = this._stripScripts(html);
				}
				if(this.stripComments){
					html = this._stripComments(html);
				}
				if(this.stripIFrames){
					html = this._stripIFrames(html);
				}
			}
			return html;
		},

		setSourceAreaCaret: function(){
			// summary:
			//		Internal function to set the caret in the sourceArea
			//		to 0x0
			var elem = this.sourceArea;
			focus.focus(elem);
			if(this._sourceShown && !this.readOnly){
				if(elem.setSelectionRange){
					elem.setSelectionRange(0, 0);
				}else if(this.sourceArea.createTextRange){
					// IE
					var range = elem.createTextRange();
					range.collapse(true);
					range.moveStart("character", -99999); // move to 0
					range.moveStart("character", 0); // delta from 0 is the correct position
					range.moveEnd("character", 0);
					range.select();
				}
			}
		},

		destroy: function(){
			if(this._resizer){
				clearTimeout(this._resizer);
				delete this._resizer;
			}
			if(this._resizeHandle){
				this._resizeHandle.remove();
				delete this._resizeHandle;
			}
			if(this._setListener){
				this._setListener.remove();
				delete this._setListener;
			}
			this.inherited(arguments);
		}
	});

	// Register this plugin.
	// For back-compat accept "viewsource" (all lowercase) too, remove in 2.0
	_Plugin.registry["viewSource"] = _Plugin.registry["viewsource"] = function(args){
		return new ViewSource({
			readOnly: ("readOnly" in args) ? args.readOnly : false,
			stripComments: ("stripComments" in args) ? args.stripComments : true,
			stripScripts: ("stripScripts" in args) ? args.stripScripts : true,
			stripIFrames: ("stripIFrames" in args) ? args.stripIFrames : true
		});
	};

	return ViewSource;
});

},
'dijit/_editor/plugins/FontChoice':function(){
define([
	"require",
	"dojo/_base/array", // array.indexOf array.map
	"dojo/_base/declare", // declare
	"dojo/dom-construct", // domConstruct.place
	"dojo/i18n", // i18n.getLocalization
	"dojo/_base/lang", // lang.delegate lang.hitch lang.isString
	"dojo/store/Memory", // MemoryStore
	"../../registry", // registry.getUniqueId
	"../../_Widget",
	"../../_TemplatedMixin",
	"../../_WidgetsInTemplateMixin",
	"../../form/FilteringSelect",
	"../_Plugin",
	"../range",
	"dojo/i18n!../nls/FontChoice"
], function(require, array, declare, domConstruct, i18n, lang, MemoryStore,
	registry, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, FilteringSelect, _Plugin, rangeapi){

	// module:
	//		dijit/_editor/plugins/FontChoice

	var _FontDropDown = declare("dijit._editor.plugins._FontDropDown",
		[_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
			// summary:
			//		Base class for widgets that contains a label (like "Font:")
			//		and a FilteringSelect drop down to pick a value.
			//		Used as Toolbar entry.

			// label: [public] String
			//		The label to apply to this particular FontDropDown.
			label: "",

			// plainText: [public] boolean
			//		Flag to indicate that the returned label should be plain text
			//		instead of an example.
			plainText: false,

			// templateString: [public] String
			//		The template used to construct the labeled dropdown.
			templateString: "<span style='white-space: nowrap' class='dijit dijitReset dijitInline'>" +
				"<label class='dijitLeft dijitInline' for='${selectId}'>${label}</label>" +
				"<input data-dojo-type='../../form/FilteringSelect' required='false' " +
				"data-dojo-props='labelType:\"html\", labelAttr:\"label\", searchAttr:\"name\"' " +
				"class='${comboClass}' " +
				"tabIndex='-1' id='${selectId}' data-dojo-attach-point='select' value=''/>" +
				"</span>",

			// contextRequire: [public] Function
			//		The context require that is used to resolve modules in template.
			contextRequire: require,

			postMixInProperties: function(){
				// summary:
				//		Over-ride to set specific properties.
				this.inherited(arguments);

				this.strings = i18n.getLocalization("dijit._editor", "FontChoice");

				// Set some substitution variables used in the template
				this.label = this.strings[this.command];

				// _WidgetBase sets the id after postMixInProperties(), but we need it now.
				// Alternative is to have a buildRendering() method and move this.selectId setting there,
				// or alternately get rid of selectId variable and just access ${id} in template?
				this.id = registry.getUniqueId(this.declaredClass.replace(/\./g, "_"));

				this.selectId = this.id + "_select";	// used in template

				this.inherited(arguments);
			},

			postCreate: function(){
				// summary:
				//		Over-ride for the default postCreate action
				//		This establishes the filtering selects and the like.

				// Initialize the list of items in the drop down by creating data store with items like:
				// {value: 1, name: "xx-small", label: "<font size=1>xx-small</font-size>" }
				this.select.set("store", new MemoryStore({
					idProperty: "value",
					data: array.map(this.values, function(value){
						var name = this.strings[value] || value;
						return {
							label: this.getLabel(value, name),
							name: name,
							value: value
						};
					}, this)
				}));

				this.select.set("value", "", false);
				this.disabled = this.select.get("disabled");
			},

			_setValueAttr: function(value, priorityChange){
				// summary:
				//		Over-ride for the default action of setting the
				//		widget value, maps the input to known values
				// value: Object|String
				//		The value to set in the select.
				// priorityChange:
				//		Optional parameter used to tell the select whether or not to fire
				//		onChange event.

				// if the value is not a permitted value, just set empty string to prevent showing the warning icon
				priorityChange = priorityChange !== false;
				this.select.set('value', array.indexOf(this.values, value) < 0 ? "" : value, priorityChange);
				if(!priorityChange){
					// Clear the last state in case of updateState calls.  Ref: #10466
					this.select._lastValueReported = null;
				}
			},

			_getValueAttr: function(){
				// summary:
				//		Allow retrieving the value from the composite select on
				//		call to button.get("value");
				return this.select.get('value');
			},

			focus: function(){
				// summary:
				//		Over-ride for focus control of this widget.  Delegates focus down to the
				//		filtering select.
				this.select.focus();
			},

			_setDisabledAttr: function(value){
				// summary:
				//		Over-ride for the button's 'disabled' attribute so that it can be
				//		disabled programmatically.

				// Save off ths disabled state so the get retrieves it correctly
				//without needing to have a function proxy it.
				this._set("disabled", value);
				this.select.set("disabled", value);
			}
		});


	var _FontNameDropDown = declare("dijit._editor.plugins._FontNameDropDown", _FontDropDown, {
		// summary:
		//		Dropdown to select a font; goes in editor toolbar.

		// generic: [const] Boolean
		//		Use generic (web standard) font names
		generic: false,

		// command: [public] String
		//		The editor 'command' implemented by this plugin.
		command: "fontName",

		comboClass: "dijitFontNameCombo",

		postMixInProperties: function(){
			// summary:
			//		Over-ride for the default posr mixin control
			if(!this.values){
				this.values = this.generic ?
					["serif", "sans-serif", "monospace", "cursive", "fantasy"] : // CSS font-family generics
					["Arial", "Times New Roman", "Comic Sans MS", "Courier New"];
			}
			this.inherited(arguments);
		},

		getLabel: function(value, name){
			// summary:
			//		Function used to generate the labels of the format dropdown
			//		will return a formatted, or plain label based on the value
			//		of the plainText option.
			// value: String
			//		The 'insert value' associated with a name
			// name: String
			//		The text name of the value
			if(this.plainText){
				return name;
			}else{
				return "<div style='font-family: " + value + "'>" + name + "</div>";
			}
		},

		_setValueAttr: function(value, priorityChange){
			// summary:
			//		Over-ride for the default action of setting the
			//		widget value, maps the input to known values

			priorityChange = priorityChange !== false;
			if(this.generic){
				var map = {
					"Arial": "sans-serif",
					"Helvetica": "sans-serif",
					"Myriad": "sans-serif",
					"Times": "serif",
					"Times New Roman": "serif",
					"Comic Sans MS": "cursive",
					"Apple Chancery": "cursive",
					"Courier": "monospace",
					"Courier New": "monospace",
					"Papyrus": "fantasy",
					"Estrangelo Edessa": "cursive", // Windows 7
					"Gabriola": "fantasy" // Windows 7
				};
				value = map[value] || value;
			}
			this.inherited(arguments, [value, priorityChange]);
		}
	});

	var _FontSizeDropDown = declare("dijit._editor.plugins._FontSizeDropDown", _FontDropDown, {
		// summary:
		//		Dropdown to select a font size; goes in editor toolbar.

		// command: [public] String
		//		The editor 'command' implemented by this plugin.
		command: "fontSize",

		comboClass: "dijitFontSizeCombo",

		// values: [public] Number[]
		//		The HTML font size values supported by this plugin
		values: [1, 2, 3, 4, 5, 6, 7], // sizes according to the old HTML FONT SIZE

		getLabel: function(value, name){
			// summary:
			//		Function used to generate the labels of the format dropdown
			//		will return a formatted, or plain label based on the value
			//		of the plainText option.
			//		We're stuck using the deprecated FONT tag to correspond
			//		with the size measurements used by the editor
			// value: String
			//		The 'insert value' associated with a name
			// name: String
			//		The text name of the value
			if(this.plainText){
				return name;
			}else{
				return "<font size=" + value + "'>" + name + "</font>";
			}
		},

		_setValueAttr: function(value, priorityChange){
			// summary:
			//		Over-ride for the default action of setting the
			//		widget value, maps the input to known values
			priorityChange = priorityChange !== false;
			if(value.indexOf && value.indexOf("px") != -1){
				var pixels = parseInt(value, 10);
				value = {10: 1, 13: 2, 16: 3, 18: 4, 24: 5, 32: 6, 48: 7}[pixels] || value;
			}

			this.inherited(arguments, [value, priorityChange]);
		}
	});


	var _FormatBlockDropDown = declare("dijit._editor.plugins._FormatBlockDropDown", _FontDropDown, {
		// summary:
		//		Dropdown to select a format (like paragraph or heading); goes in editor toolbar.

		// command: [public] String
		//		The editor 'command' implemented by this plugin.
		command: "formatBlock",

		comboClass: "dijitFormatBlockCombo",

		// values: [public] Array
		//		The HTML format tags supported by this plugin
		values: ["noFormat", "p", "h1", "h2", "h3", "pre"],

		postCreate: function(){
			// Init and set the default value to no formatting.  Update state will adjust it
			// as needed.
			this.inherited(arguments);
			this.set("value", "noFormat", false);
		},

		getLabel: function(value, name){
			// summary:
			//		Function used to generate the labels of the format dropdown
			//		will return a formatted, or plain label based on the value
			//		of the plainText option.
			// value: String
			//		The 'insert value' associated with a name
			// name: String
			//		The text name of the value
			if(this.plainText || value == "noFormat"){
				return name;
			}else{
				return "<" + value + ">" + name + "</" + value + ">";
			}
		},

		_execCommand: function(editor, command, choice){
			// summary:
			//		Over-ride for default exec-command label.
			//		Allows us to treat 'none' as special.
			if(choice === "noFormat"){
				var start;
				var end;
				var sel = rangeapi.getSelection(editor.window);
				if(sel && sel.rangeCount > 0){
					var range = sel.getRangeAt(0);
					var node, tag;
					if(range){
						start = range.startContainer;
						end = range.endContainer;

						// find containing nodes of start/end.
						while(start && start !== editor.editNode &&
							start !== editor.document.body &&
							start.nodeType !== 1){
							start = start.parentNode;
						}

						while(end && end !== editor.editNode &&
							end !== editor.document.body &&
							end.nodeType !== 1){
							end = end.parentNode;
						}

						var processChildren = lang.hitch(this, function(node, ary){
							if(node.childNodes && node.childNodes.length){
								var i;
								for(i = 0; i < node.childNodes.length; i++){
									var c = node.childNodes[i];
									if(c.nodeType == 1){
										if(editor.selection.inSelection(c)){
											var tag = c.tagName ? c.tagName.toLowerCase() : "";
											if(array.indexOf(this.values, tag) !== -1){
												ary.push(c);
											}
											processChildren(c, ary);
										}
									}
								}
							}
						});

						var unformatNodes = lang.hitch(this, function(nodes){
							// summary:
							//		Internal function to clear format nodes.
							// nodes:
							//		The array of nodes to strip formatting from.
							if(nodes && nodes.length){
								editor.beginEditing();
								while(nodes.length){
									this._removeFormat(editor, nodes.pop());
								}
								editor.endEditing();
							}
						});

						var clearNodes = [];
						if(start == end){
							//Contained within the same block, may be collapsed, but who cares, see if we
							// have a block element to remove.
							var block;
							node = start;
							while(node && node !== editor.editNode && node !== editor.document.body){
								if(node.nodeType == 1){
									tag = node.tagName ? node.tagName.toLowerCase() : "";
									if(array.indexOf(this.values, tag) !== -1){
										block = node;
										break;
									}
								}
								node = node.parentNode;
							}

							//Also look for all child nodes in the selection that may need to be
							//cleared of formatting
							processChildren(start, clearNodes);
							if(block){
								clearNodes = [block].concat(clearNodes);
							}
							unformatNodes(clearNodes);
						}else{
							// Probably a multi select, so we have to process it.  Whee.
							node = start;
							while(editor.selection.inSelection(node)){
								if(node.nodeType == 1){
									tag = node.tagName ? node.tagName.toLowerCase() : "";
									if(array.indexOf(this.values, tag) !== -1){
										clearNodes.push(node);
									}
									processChildren(node, clearNodes);
								}
								node = node.nextSibling;
							}
							unformatNodes(clearNodes);
						}
						editor.onDisplayChanged();
					}
				}
			}else{
				editor.execCommand(command, choice);
			}
		},

		_removeFormat: function(editor, node){
			// summary:
			//		function to remove the block format node.
			// node:
			//		The block format node to remove (and leave the contents behind)
			if(editor.customUndo){
				// So of course IE doesn't work right with paste-overs.
				// We have to do this manually, which is okay since IE already uses
				// customUndo and we turned it on for WebKit.  WebKit pasted funny,
				// so couldn't use the execCommand approach
				while(node.firstChild){
					domConstruct.place(node.firstChild, node, "before");
				}
				node.parentNode.removeChild(node);
			}else{
				// Everyone else works fine this way, a paste-over and is native
				// undo friendly.
				editor.selection.selectElementChildren(node);
				var html = editor.selection.getSelectedHtml();
				editor.selection.selectElement(node);
				editor.execCommand("inserthtml", html || "");
			}
		}
	});

	// TODO: for 2.0, split into FontChoice plugin into three separate classes,
	// one for each command (and change registry below)
	var FontChoice = declare("dijit._editor.plugins.FontChoice", _Plugin, {
		// summary:
		//		This plugin provides three drop downs for setting style in the editor
		//		(font, font size, and format block), as controlled by command.
		//
		// description:
		//		The commands provided by this plugin are:
		//
		//		- fontName: Provides a drop down to select from a list of font names
		//		- fontSize: Provides a drop down to select from a list of font sizes
		//		- formatBlock: Provides a drop down to select from a list of block styles
		//		  which can easily be added to an editor by including one or more of the above commands
		//		  in the `plugins` attribute as follows:
		//
		//	|	plugins="['fontName','fontSize',...]"
		//
		//		It is possible to override the default dropdown list by providing an Array for the `custom` property when
		//		instantiating this plugin, e.g.
		//
		//	|	plugins="[{name:'dijit._editor.plugins.FontChoice', command:'fontName', values:['Verdana','Myriad','Garamond']},...]"
		//
		//		Alternatively, for `fontName` only, `generic:true` may be specified to provide a dropdown with
		//		[CSS generic font families](http://www.w3.org/TR/REC-CSS2/fonts.html#generic-font-families).
		//
		//		Note that the editor is often unable to properly handle font styling information defined outside
		//		the context of the current editor instance, such as pre-populated HTML.

		// useDefaultCommand: [protected] Boolean
		//		Override _Plugin.useDefaultCommand...
		//		processing is handled by this plugin, not by dijit/Editor.
		useDefaultCommand: false,

		_initButton: function(){
			// summary:
			//		Overrides _Plugin._initButton(), to initialize the FilteringSelect+label in toolbar,
			//		rather than a simple button.
			// tags:
			//		protected

			// Create the widget to go into the toolbar (the so-called "button")
			var clazz = {
					fontName: _FontNameDropDown,
					fontSize: _FontSizeDropDown,
					formatBlock: _FormatBlockDropDown
				}[this.command],
				params = this.params;

			// For back-compat reasons support setting custom values via "custom" parameter
			// rather than "values" parameter.   Remove in 2.0.
			if(this.params.custom){
				params.values = this.params.custom;
			}

			var editor = this.editor;
			this.button = new clazz(lang.delegate({dir: editor.dir, lang: editor.lang}, params));

			// Reflect changes to the drop down in the editor
			this.own(this.button.select.on("change", lang.hitch(this, function(choice){
				// User invoked change, since all internal updates set priorityChange to false and will
				// not trigger an onChange event.

				if(this.editor.focused){
					// put focus back in the iframe, unless focus has somehow been shifted out of the editor completely
					this.editor.focus();
				}

				if(this.command == "fontName" && choice.indexOf(" ") != -1){
					choice = "'" + choice + "'";
				}

				// Invoke, the editor already normalizes commands called through its
				// execCommand.
				if(this.button._execCommand){
					this.button._execCommand(this.editor, this.command, choice);
				}else{
					this.editor.execCommand(this.command, choice);
				}
			})));
		},

		updateState: function(){
			// summary:
			//		Overrides _Plugin.updateState().  This controls updating the menu
			//		options to the right values on state changes in the document (that trigger a
			//		test of the actions.)
			//		It set value of drop down in toolbar to reflect font/font size/format block
			//		of text at current caret position.
			// tags:
			//		protected
			var _e = this.editor;
			var _c = this.command;
			if(!_e || !_e.isLoaded || !_c.length){
				return;
			}

			if(this.button){
				var disabled = this.get("disabled");
				this.button.set("disabled", disabled);
				if(disabled){
					return;
				}
				var value;
				try{
					value = _e.queryCommandValue(_c) || "";
				}catch(e){
					//Firefox may throw error above if the editor is just loaded, ignore it
					value = "";
				}

				// strip off single quotes, if any
				var quoted = lang.isString(value) && (value.match(/'([^']*)'/) || value.match(/"([^"]*)"/));
				if(quoted){
					value = quoted[1];
				}

				if(_c === "formatBlock"){
					if(!value || value == "p"){
						// Some browsers (WebKit) doesn't actually get the tag info right.
						// and IE returns paragraph when in a DIV!, so incorrect a lot,
						// so we have double-check it.
						value = null;
						var elem;
						// Try to find the current element where the caret is.
						var sel = rangeapi.getSelection(this.editor.window);
						if(sel && sel.rangeCount > 0){
							var range = sel.getRangeAt(0);
							if(range){
								elem = range.endContainer;
							}
						}

						// Okay, now see if we can find one of the formatting types we're in.
						while(elem && elem !== _e.editNode && elem !== _e.document){
							var tg = elem.tagName ? elem.tagName.toLowerCase() : "";
							if(tg && array.indexOf(this.button.values, tg) > -1){
								value = tg;
								break;
							}
							elem = elem.parentNode;
						}
						if(!value){
							// Still no value, so lets select 'none'.
							value = "noFormat";
						}
					}else{
						// Check that the block format is one allowed, if not,
						// null it so that it gets set to empty.
						if(array.indexOf(this.button.values, value) < 0){
							value = "noFormat";
						}
					}
				}
				if(value !== this.button.get("value")){
					// Set the value, but denote it is not a priority change, so no
					// onchange fires.
					this.button.set('value', value, false);
				}
			}
		}
	});

	// Register these plugins
	array.forEach(["fontName", "fontSize", "formatBlock"], function(name){
		_Plugin.registry[name] = function(args){
			return new FontChoice({
				command: name,
				plainText: args.plainText
			});
		};
	});

	// Make all classes available through AMD, and return main class
	FontChoice._FontDropDown = _FontDropDown;
	FontChoice._FontNameDropDown = _FontNameDropDown;
	FontChoice._FontSizeDropDown = _FontSizeDropDown;
	FontChoice._FormatBlockDropDown = _FormatBlockDropDown;
	return FontChoice;

});

},
'dojox/editor/plugins/Preview':function(){
define([
	"dojo",
	"dijit",
	"dojox",
	"dijit/_editor/_Plugin",
	"dijit/form/Button",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/i18n",
	"dojo/i18n!dojox/editor/plugins/nls/Preview"
], function(dojo, dijit, dojox, _Plugin) {

var Preview = dojo.declare("dojox.editor.plugins.Preview", _Plugin, {
	// summary:
	//		This plugin provides Preview capability to the editor.  When
	//		clicked, the document in the editor frame will displayed in a separate
	//		window/tab

	// Over-ride indicating that the command processing is done all by this plugin.
	useDefaultCommand: false,

	// styles: [public] String
	//		A string of CSS styles to apply to the previewed content, if any.
	styles: "",

	// stylesheets: [public] Array
	//		An array of stylesheets to import into the preview, if any.
	stylesheets: null,

	// iconClassPrefix: [const] String
	//		The CSS class name for the button node icon.
	iconClassPrefix: "dijitAdditionalEditorIcon",

	_initButton: function(){
		// summary:
		//		Over-ride for creation of the preview button.
		this._nlsResources = dojo.i18n.getLocalization("dojox.editor.plugins", "Preview");
		this.button = new dijit.form.Button({
			label: this._nlsResources["preview"],
			showLabel: false,
			iconClass: this.iconClassPrefix + " " + this.iconClassPrefix + "Preview",
			tabIndex: "-1",
			onClick: dojo.hitch(this, "_preview")
		});
	},

	setEditor: function(editor){
		// summary:
		//		Over-ride for the setting of the editor.
		// editor: Object
		//		The editor to configure for this plugin to use.
		this.editor = editor;
		this._initButton();
	},

	updateState: function(){
		// summary:
		//		Over-ride for button state control for disabled to work.
		this.button.set("disabled", this.get("disabled"));
	},
	
	_preview: function(){
		// summary:
		//		Function to trigger previewing of the editor document
		// tags:
		//		private
		try{
			var content = this.editor.get("value");
			var head = "\t\t<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>\n";
			var i;
			// Apply the stylesheets, then apply the styles.
			if(this.stylesheets){
				for(i = 0; i < this.stylesheets.length; i++){
					head += "\t\t<link rel='stylesheet' type='text/css' href='" + this.stylesheets[i] + "'>\n";
				}
			}
			if(this.styles){
				head += ("\t\t<style>" + this.styles + "</style>\n");
			}
			content = "<html>\n\t<head>\n" + head + "\t</head>\n\t<body>\n" + content + "\n\t</body>\n</html>";
			var win = window.open("javascript: ''", this._nlsResources["preview"], "status=1,menubar=0,location=0,toolbar=0");
			win.document.open();
			win.document.write(content);
			win.document.close();

		}catch(e){
			console.warn(e);
		}
	}
});

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	var name = o.args.name.toLowerCase();
	if(name === "preview"){
		o.plugin = new Preview({
			styles: ("styles" in o.args)?o.args.styles:"",
			stylesheets: ("stylesheets" in o.args)? o.args.stylesheets:null
		});
	}
});

return Preview;

});

},
'dijit/_editor/plugins/TextColor':function(){
define([
	"require",
	"dojo/colors", // colors.fromRgb
	"dojo/_base/declare", // declare
	"dojo/_base/lang",
	"../_Plugin",
	"../../form/DropDownButton"
], function(require, colors, declare, lang, _Plugin, DropDownButton){

	// module:
	//		dijit/_editor/plugins/TextColor

	var TextColor = declare("dijit._editor.plugins.TextColor", _Plugin, {
		// summary:
		//		This plugin provides dropdown color pickers for setting text color and background color
		// description:
		//		The commands provided by this plugin are:
		//
		//		- foreColor - sets the text color
		//		- hiliteColor - sets the background color

		// Override _Plugin.buttonClass to use DropDownButton (with ColorPalette) to control this plugin
		buttonClass: DropDownButton,
				
		// colorPicker: String|Constructor
		//		The color picker dijit to use, defaults to dijit/ColorPalette
		colorPicker: "dijit/ColorPalette",

		// useDefaultCommand: Boolean
		//		False as we do not use the default editor command/click behavior.
		useDefaultCommand: false,

		_initButton: function(){
			this.command = this.name;

			this.inherited(arguments);

			// Setup to lazy load ColorPalette first time the button is clicked
			var self = this;
			this.button.loadDropDown = function(callback){
				function onColorPaletteLoad(ColorPalette){
					self.button.dropDown = new ColorPalette({
						dir: self.editor.dir,
						ownerDocument: self.editor.ownerDocument,
						value: self.value,
						onChange: function(color){
							self.editor.execCommand(self.command, color);
						},
						onExecute: function(){
							self.editor.execCommand(self.command, this.get("value"));
						}
					});
					callback();
				}
				if(typeof self.colorPicker == "string"){
					require([self.colorPicker], onColorPaletteLoad);
				}else{
					onColorPaletteLoad(self.colorPicker);
				}
			};
		},

		updateState: function(){
			// summary:
			//		Overrides _Plugin.updateState().  This updates the ColorPalette
			//		to show the color of the currently selected text.
			// tags:
			//		protected

			var _e = this.editor;
			var _c = this.command;
			if(!_e || !_e.isLoaded || !_c.length){
				return;
			}

			if(this.button){
				var disabled = this.get("disabled");
				this.button.set("disabled", disabled);
				if(disabled){
					return;
				}

				var value;
				try{
					value = _e.queryCommandValue(_c) || "";
				}catch(e){
					//Firefox may throw error above if the editor is just loaded, ignore it
					value = "";
				}
			}

			if(value == ""){
				value = "#000000";
			}
			if(value == "transparent"){
				value = "#ffffff";
			}

			if(typeof value == "string"){
				//if RGB value, convert to hex value
				if(value.indexOf("rgb") > -1){
					value = colors.fromRgb(value).toHex();
				}
			}else{    //it's an integer(IE returns an MS access #)
				value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
				value = value.toString(16);
				value = "#000000".slice(0, 7 - value.length) + value;

			}

			this.value = value;

			var dropDown = this.button.dropDown;
			if(dropDown && dropDown.get && value !== dropDown.get('value')){
				dropDown.set('value', value, false);
			}
		}
	});

	// Register this plugin.
	_Plugin.registry["foreColor"] = function(args){
		return new TextColor(args);
	};
	_Plugin.registry["hiliteColor"] = function(args){
		return new TextColor(args);
	};

	return TextColor;
});

},
'dojox/editor/plugins/ToolbarLineBreak':function(){
define([
	"dojo",
	"dijit",
	"dojox",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_editor/_Plugin",
	"dojo/_base/declare"
], function(dojo, dijit, dojox, _Widget, _TemplatedMixin, _Plugin, declare) {

var ToolbarLineBreak = declare("dojox.editor.plugins.ToolbarLineBreak",
	[ _Widget, _TemplatedMixin ],
	{
	// summary:
	//		A 'line break' between two `dijit.Toolbar` items so that very
	//		long toolbars can be organized a bit.
	templateString: "<span class='dijit dijitReset'><br></span>",
	postCreate: function(){
		dojo.setSelectable(this.domNode, false);
	},
	isFocusable: function(){
		// summary:
		//		This widget isn't focusable, so pass along that fact.
		// tags:
		//		protected
		return false;
	}
});


// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	var name = o.args.name.toLowerCase();
	if(name ===  "||" || name === "toolbarlinebreak"){
		o.plugin = new _Plugin({
			button: new ToolbarLineBreak(),
			setEditor: function(editor){
				this.editor = editor;
			}
		});
	}
});

return ToolbarLineBreak;

});

},
'dojox/editor/plugins/FindReplace':function(){
define([
	"dojo",
	"dijit",
	"dojox",
	"dijit/_base/manager",	// getUniqueId
	"dijit/_base/popup",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_KeyNavContainer",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/TooltipDialog",
	"dijit/Toolbar",
	"dijit/form/CheckBox",
	"dijit/form/_TextBoxMixin",	// selectInputText
	"dijit/form/TextBox",
	"dijit/_editor/_Plugin",
	"dijit/form/Button",
	"dijit/form/DropDownButton",
	"dijit/form/ToggleButton",
	"./ToolbarLineBreak",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/i18n",
	"dojo/string",
	"dojo/i18n!dojox/editor/plugins/nls/FindReplace"
], function(dojo, dijit, dojox, manager, popup,
			_Widget, _TemplatedMixin, _KeyNavContainer, _WidgetsInTemplateMixin, TooltipDialog,
			Toolbar, CheckBox, _TextBoxMixin, TextBox, _Plugin) {

dojo.experimental("dojox.editor.plugins.FindReplace");

var FindReplaceCloseBox = dojo.declare("dojox.editor.plugins._FindReplaceCloseBox",
	[_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
	// summary:
	//		Base class for widgets that contains a button labeled X
	//		to close the tool bar.
	
	btnId: "",
	widget: null,
	widgetsInTemplate: true,
	
	templateString:
		"<span style='float: right' class='dijitInline' tabindex='-1'>" +
			"<button class='dijit dijitReset dijitInline' " +
				"id='${btnId}' dojoAttachPoint='button' dojoType='dijit.form.Button' tabindex='-1' iconClass='dijitEditorIconsFindReplaceClose' showLabel='false'>X</button>" +
		"</span>",
	
	postMixInProperties: function(){
		// Set some substitution variables used in the template
		this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		this.btnId = this.id + "_close";
		this.inherited(arguments);
	},
	startup: function(){
		this.connect(this.button, "onClick", "onClick");
	},
	onClick: function(){
	}
});


var FindReplaceTextBox = dojo.declare("dojox.editor.plugins._FindReplaceTextBox",
	[_Widget, _TemplatedMixin, _WidgetsInTemplateMixin],{
	// summary:
	//		Base class for widgets that contains a label (like "Font:")
	//		and a TextBox to pick a value.
	//		Used as Toolbar entry.

	// textId: [public] String
	//		The id of the enhanced textbox
	textId: "",
	
	// label: [public] String
	//		The label of the enhanced textbox
	label: "",
	
	// tooltip: [public] String
	//		The tooltip of the enhanced textbox when the mouse is hovering on it
	toolTip: "",
	widget: null,
	widgetsInTemplate: true,

	templateString:
		"<span style='white-space: nowrap' class='dijit dijitReset dijitInline dijitEditorFindReplaceTextBox' " +
			"title='${tooltip}' tabindex='-1'>" +
			"<label class='dijitLeft dijitInline' for='${textId}' tabindex='-1'>${label}</label>" +
			"<input dojoType='dijit.form.TextBox' intermediateChanges='true' class='focusTextBox' " +
					"tabIndex='0' id='${textId}' dojoAttachPoint='textBox, focusNode' value='' dojoAttachEvent='onKeyPress: _onKeyPress'/>" +
		"</span>",

	postMixInProperties: function(){
		// Set some substitution variables used in the template
		this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		this.textId = this.id + "_text";
		
		this.inherited(arguments);
	},

	postCreate: function(){
		this.textBox.set("value", "");
		this.disabled =  this.textBox.get("disabled");
		this.connect(this.textBox, "onChange", "onChange");
		dojo.attr(this.textBox.textbox, "formnovalidate", "true");
	},

	_setValueAttr: function(/*String*/ value){
		//If the value is not a permitted value, just set empty string to prevent showing the warning icon
		this.value = value;
		this.textBox.set("value", value);
	},

	focus: function(){
		this.textBox.focus();
	},

	_setDisabledAttr: function(/*Boolean*/ value){
		// summary:
		//		Over-ride for the textbox's 'disabled' attribute so that it can be
		//		disabled programmatically.
		// value:
		//		The boolean value to indicate if the textbox should be disabled or not
		// tags:
		//		private
		this.disabled = value;
		this.textBox.set("disabled", value);
	},

	onChange: function(/*String*/ val){
		// summary:
		//		Stub function for change events on the box.
		// tags:
		//		public
		this.value= val;
	},
	
	_onKeyPress: function(/*Event*/ evt){
		// summary:
		//		Handle the arrow key events
		// evt:
		//		Event object passed to this handler
		// tags:
		//		private
		var start = 0;
		var end = 0;
		
		// If CTRL, ALT or SHIFT is not held on
		if(evt.target && !evt.ctrlKey && !evt.altKey && !evt.shiftKey){
			if(evt.keyCode == dojo.keys.LEFT_ARROW){
				start = evt.target.selectionStart;
				end = evt.target.selectionEnd;
				if(start < end){
					dijit.selectInputText(evt.target, start, start);
					dojo.stopEvent(evt);
				}
			}else if(evt.keyCode == dojo.keys.RIGHT_ARROW){
				start = evt.target.selectionStart;
				end = evt.target.selectionEnd;
				if(start < end){
					dijit.selectInputText(evt.target, end, end);
					dojo.stopEvent(evt);
				}
			}
		}
	}
});


var FindReplaceCheckBox = dojo.declare("dojox.editor.plugins._FindReplaceCheckBox",
	[_Widget, _TemplatedMixin, _WidgetsInTemplateMixin],{
	// summary:
	//		Base class for widgets that contains a label (like "Match case: ")
	//		and a checkbox to indicate if it is checked or not.
	//		Used as Toolbar entry.

	// checkId: [public] String
	//		The id of the enhanced checkbox
	checkId: "",
	
	// label: [public] String
	//		The label of the enhanced checkbox
	label: "",
	
	// tooltip: [public] String
	//		The tooltip of the enhanced checkbox when the mouse is hovering it
	tooltip: "",
	
	widget: null,
	widgetsInTemplate: true,

	templateString:
		"<span style='white-space: nowrap' tabindex='-1' " +
			"class='dijit dijitReset dijitInline dijitEditorFindReplaceCheckBox' title='${tooltip}' >" +
			"<input dojoType='dijit.form.CheckBox' " +
					"tabIndex='0' id='${checkId}' dojoAttachPoint='checkBox, focusNode' value=''/>" +
			"<label tabindex='-1' class='dijitLeft dijitInline' for='${checkId}'>${label}</label>" +
		"</span>",

	postMixInProperties: function(){
		// Set some substitution variables used in the template
		this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		this.checkId = this.id + "_check";
		this.inherited(arguments);
	},

	postCreate: function(){
		this.checkBox.set("checked", false);
		this.disabled =  this.checkBox.get("disabled");
		this.checkBox.isFocusable = function(){ return false; };
	},

	_setValueAttr: function(/*Boolean*/ value){
		// summary:
		//		Passthrough for checkbox.
		// tags:
		//		private
		this.checkBox.set('value', value);
	},

	_getValueAttr: function(){
		// summary:
		//		Passthrough for checkbox.
		// tags:
		//		private
		return this.checkBox.get('value');
	},

	focus: function(){
		// summary:
		//		Handle the focus event when this widget gets focused
		// tags:
		//		private
		this.checkBox.focus();
	},

	_setDisabledAttr: function(/*Boolean*/ value){
		// summary:
		//		Over-ride for the button's 'disabled' attribute so that it can be
		//		disabled programmatically.
		// value:
		//		The flag that indicates if the checkbox is disabled or not.
		// tags:
		//		private
		this.disabled = value;
		this.checkBox.set("disabled", value);
	}
});


var FindReplaceToolbar = dojo.declare("dojox.editor.plugins._FindReplaceToolbar", Toolbar, {
	// summary:
	//		A toolbar that derived from dijit.Toolbar, which
	//		eliminates some unnecessary event response such as LEFT_ARROW pressing
	//		and click bubbling.

	postCreate: function(){
		this.connectKeyNavHandlers([], []); // Prevent arrow key navigation
		this.connect(this.containerNode, "onclick", "_onToolbarEvent");
		this.connect(this.containerNode, "onkeydown", "_onToolbarEvent");
		dojo.addClass(this.domNode, "dijitToolbar");
	},
	
	addChild: function(/*dijit._Widget*/ widget, /*int?*/ insertIndex){
		// summary:
		//		Add a child to our _Container and prevent the default
		//		arrow key navigation function. This function may bring in
		//		side effect
		dijit._KeyNavContainer.superclass.addChild.apply(this, arguments);
	},
	
	_onToolbarEvent: function(/*Event*/ evt){
		// Editor may have special treatment to some events, so stop the bubbling.
		// evt:
		//		The Event object
		// tages:
		//		private
		evt.stopPropagation();
	}
});

var FindReplace = dojo.declare("dojox.editor.plugins.FindReplace",[_Plugin],{
	// summary:
	//		This plugin provides a Find/Replace capability for the editor.
	//		Note that this plugin is NOT supported on Opera currently, as opera
	//		does not implement a window.find or equiv function.

	// buttonClass: [protected]
	//		Define the class of button the editor uses.
	buttonClass: dijit.form.ToggleButton,

	// iconClassPrefix: [const] String
	//		The CSS class name for the button node is formed from `iconClassPrefix` and `command`
	iconClassPrefix: "dijitEditorIconsFindReplace",

	// editor: [protected]
	//		The editor this plugin belongs to
	editor: null,
	
	// button: [protected]
	//		The toggle button
	button: null,
	
	// _frToolbar: [private]
	//		The toolbar that contain all the entries and buttons
	_frToolbar: null,
	
	// _closeBox: [private]
	//		The close button of the F/R toolbar
	_closeBox: null,
	
	// _findField: [private]
	//		The Find field of the F/R toolbar
	_findField: null,
	
	// _replaceField: [private]
	//		The Replace field of the F/R toolbar
	_replaceField: null,
	
	// _findButton: [private]
	//		The Find button of the F/R toolbar
	_findButton: null,
	
	// _replaceButton: [private]
	//		The Replace button of the F/R toolbar
	_replaceButton: null,
	
	// _replaceAllButton: [private]
	//		The ReplaceAll button of the F/R toolbar
	_replaceAllButton: null,
	
	// _caseSensitive: [private]
	//		The case sensitive checkbox
	_caseSensitive: null,
	
	// _backwards: [private]
	//		The backwards checkbox
	_backwards: null,
	
	// _promDialog: [private]
	//		The prompt message box that shows the user some messages
	//		such as the end of a search, the end of a replacement, etc.
	_promDialog: null,
	_promDialogTimeout: null,

	// _strings: [private]
	//		The array that contains globalized strings
	_strings: null,

	_bookmark: null,

	_initButton: function(){
		// summary:
		//		Over-ride for creation of the resize button.
		this._strings = dojo.i18n.getLocalization("dojox.editor.plugins", "FindReplace");
		this.button = new dijit.form.ToggleButton({
			label: this._strings["findReplace"],
			showLabel: false,
			iconClass: this.iconClassPrefix + " dijitEditorIconFindString",
			tabIndex: "-1",
			onChange: dojo.hitch(this, "_toggleFindReplace")
		});
		if(dojo.isOpera){
			// Not currently supported on Opera!
			this.button.set("disabled", true);
		}
		//Link up so that if the toggle is disabled, then the view of Find/Replace is closed.
		this.connect(this.button, "set", dojo.hitch(this, function(attr, val){
			if(attr === "disabled"){
				this._toggleFindReplace((!val && this._displayed), true, true);
			}
		}));
	},

	setEditor: function(editor){
		// summary:
		//		This is a callback handler that set a reference to the editor this plugin
		//		hosts in
		this.editor = editor;
		this._initButton();
	},

	toggle: function(){
		// summary:
		//		Function to allow programmatic toggling of the find toolbar.
		// tags:
		//		public
		this.button.set("checked", !this.button.get("checked"));
	},

	_toggleFindReplace: function(/*Boolean*/ show, /*Boolean?*/ ignoreState, /*Boolean?*/ buttonDisabled){
		// summary:
		//		Function to toggle whether or not find/replace is displayed.
		// show:
		//		Indicate if the toolbar is shown or not
		// ignoreState:
		//		Indicate if the status should be ignored or not
		// blurEditor:
		//		Indicate if the focus should be removed from the editor or not
		// tags:
		//		private
		var size = dojo.marginBox(this.editor.domNode);
		if(show && !dojo.isOpera){
			dojo.style(this._frToolbar.domNode, "display", "block");
			// Auto populate the Find field
			this._populateFindField();
			if(!ignoreState){
				this._displayed = true;
			}
		}else{
			dojo.style(this._frToolbar.domNode, "display", "none");
			if(!ignoreState){
				this._displayed = false;
			}
			
			// If the toggle button is disabled, it is most likely that
			// another plugin such as ViewSource disables it.
			// So we do not need to focus the text area of the editor to
			// prevent the editor from an invalid status.
			// Please refer to dijit._editor.plugins.ViewSource for more details.
			if(!buttonDisabled){
				this.editor.focus();
			}
		}

		// Resize the editor.
		this.editor.resize({h: size.h});
	},

	_populateFindField: function(){
		// summary:
		//		Populate the Find field with selected text when dialog initially displayed.
		//		Auto-select text in Find field after it is populated.
		//		If nothing selected, restore previous entry from the same session.
		// tags:
		//		private
		var ed = this.editor;
		var win = ed.window;
		var selectedTxt = ed._sCall("getSelectedText", [null]);
		if(this._findField && this._findField.textBox){
			if(selectedTxt){
				this._findField.textBox.set("value", selectedTxt);
			}
			this._findField.textBox.focus();
			dijit.selectInputText(this._findField.textBox.focusNode);
		}
	},

	setToolbar: function(/*dijit.Toolbar*/ toolbar){
		// summary:
		//		Over-ride so that find/replace toolbar is appended after the current toolbar.
		// toolbar:
		//		The current toolbar of the editor
		// tags:
		//		public
		this.inherited(arguments);
		if(!dojo.isOpera){
			var _tb = (this._frToolbar = new FindReplaceToolbar());
			dojo.style(_tb.domNode, "display", "none");
			dojo.place(_tb.domNode, toolbar.domNode, "after");
			_tb.startup();

			// IE6 will put the close box in a new line when its style is "float: right".
			// So place the close box ahead of the other fields, which makes it align with
			// the other components.
			this._closeBox = new FindReplaceCloseBox();
			_tb.addChild(this._closeBox);
			
			// Define the search/replace fields.
			this._findField = new FindReplaceTextBox(
				{label: this._strings["findLabel"], tooltip: this._strings["findTooltip"]});
			_tb.addChild(this._findField);
			
			this._replaceField = new FindReplaceTextBox(
				{label: this._strings["replaceLabel"], tooltip: this._strings["replaceTooltip"]});
			_tb.addChild(this._replaceField);

			// Define the Find/Replace/ReplaceAll buttons.
			_tb.addChild(new dojox.editor.plugins.ToolbarLineBreak());
			
			this._findButton = new dijit.form.Button({label: this._strings["findButton"], showLabel: true,
				iconClass: this.iconClassPrefix + " dijitEditorIconFind"});
			this._findButton.titleNode.title = this._strings["findButtonTooltip"];
			_tb.addChild(this._findButton);
			
			this._replaceButton = new dijit.form.Button({label: this._strings["replaceButton"], showLabel: true,
				iconClass: this.iconClassPrefix + " dijitEditorIconReplace"});
			this._replaceButton.titleNode.title = this._strings["replaceButtonTooltip"];
			_tb.addChild(this._replaceButton);
			
			this._replaceAllButton = new dijit.form.Button({label: this._strings["replaceAllButton"], showLabel: true,
				iconClass: this.iconClassPrefix + " dijitEditorIconReplaceAll"});
			this._replaceAllButton.titleNode.title = this._strings["replaceAllButtonTooltip"];
			_tb.addChild(this._replaceAllButton);
			
			// Define the option checkboxes.
			this._caseSensitive = new FindReplaceCheckBox(
				{label: this._strings["matchCase"], tooltip: this._strings["matchCaseTooltip"]});
			_tb.addChild(this._caseSensitive);
			
			this._backwards = new FindReplaceCheckBox(
				{label: this._strings["backwards"], tooltip: this._strings["backwardsTooltip"]});
			_tb.addChild(this._backwards);

			// Set initial states, buttons should be disabled unless content is
			// present in the fields.
			this._findButton.set("disabled", true);
			this._replaceButton.set("disabled", true);
			this._replaceAllButton.set("disabled", true);

			// Connect the event to the status of the items
			this.connect(this._findField, "onChange", "_checkButtons");
			this.connect(this._findField, "onKeyDown", "_onFindKeyDown");
			this.connect(this._replaceField, "onKeyDown", "_onReplaceKeyDown");

			// Connect up the actual search events.
			this.connect(this._findButton, "onClick", "_find");
			this.connect(this._replaceButton, "onClick", "_replace");
			this.connect(this._replaceAllButton, "onClick", "_replaceAll");
			
			// Connect up the close event
			this.connect(this._closeBox, "onClick", "toggle");
			
			// Prompt for the message
			this._promDialog = new dijit.TooltipDialog();
			this._promDialog.startup();
			this._promDialog.set("content", "");
		}
	},

	_checkButtons: function(){
		// summary:
		//		Ensure that all the buttons are in a correct status
		//		when certain events are fired.
		var fText = this._findField.get("value");

		if(fText){
			// Only enable if find text is not empty or just blank/spaces.
			this._findButton.set("disabled", false);
			this._replaceButton.set("disabled", false);
			this._replaceAllButton.set("disabled", false);
		}else{
			this._findButton.set("disabled", true);
			this._replaceButton.set("disabled", true);
			this._replaceAllButton.set("disabled", true);
		}
	},
	
	_onFindKeyDown: function(evt){
		if(evt.keyCode == dojo.keys.ENTER){
			// Perform the default search action
			this._find();
			dojo.stopEvent(evt);
		}
	},
	
	_onReplaceKeyDown: function(evt){
		if(evt.keyCode == dojo.keys.ENTER){
			// Perform the default replace action
			if(!this._replace()) this._replace();
			dojo.stopEvent(evt);
		}
	},

	_find: function(/*Boolean?*/ showMessage){
		// summary:
		//		This function invokes a find on the editor document with the noted options for
		//		find.
		// showMessage:
		//		Indicated whether the tooltip is shown or not when the search reaches the end
		// tags:
		//		private.
		// returns:
		//		Boolean indicating if the content was found or not.
		var txt = this._findField.get("value") || "";
		if(txt){
			var caseSensitive = this._caseSensitive.get("value");
			var backwards = this._backwards.get("value");
			var isFound = this._findText(txt, caseSensitive, backwards);
			if(!isFound && showMessage){
				this._promDialog.set("content", dojo.string.substitute(
					this._strings["eofDialogText"], {"0": this._strings["eofDialogTextFind"]}));
				dijit.popup.open({popup: this._promDialog, around: this._findButton.domNode});
				this._promDialogTimeout = setTimeout(dojo.hitch(this, function(){
					clearTimeout(this._promDialogTimeout);
					this._promDialogTimeout = null;
					dijit.popup.close(this._promDialog);
				}), 3000);
				setTimeout(dojo.hitch(this, function(){
					this.editor.focus();
				}), 0);
			}
			return isFound;
		}
		
		return false;
	},

	_replace: function(/*Boolean?*/ showMessage){
		// summary:
		//		This function invokes a replace on the editor document with the noted options for replace
		// showMessage:
		//		Indicate if the prompt message is shown or not when the replacement
		//		reaches the end
		// tags:
		//		private
		// returns:
		//		Boolean indicating if the content was replaced or not.
		var isReplaced = false;
		var ed = this.editor;
		ed.focus();
		var txt = this._findField.get("value") || "";
		var repTxt = this._replaceField.get("value") || "";
		 
		if(txt){
			var caseSensitive = this._caseSensitive.get("value");
			// Check if it is forced to be forwards or backwards
			var backwards = this._backwards.get("value");
			
			//Replace the current selected text if it matches the pattern
			var selected = ed._sCall("getSelectedText", [null]);
			// Handle checking/replacing current selection.  For some reason on Moz
			// leading whitespace is trimmed, so we have to trim it down on this check
			// or we don't always replace.  Moz bug!
			if(dojo.isMoz){
				txt = dojo.trim(txt);
				selected = dojo.trim(selected);
			}
			
			var regExp = this._filterRegexp(txt, !caseSensitive);
			if(selected && regExp.test(selected)){
				ed.execCommand("inserthtml", repTxt);
				isReplaced = true;
			
				if(backwards){
					// Move to the beginning of the replaced text
					// to avoid the infinite recursive replace
					this._findText(repTxt, caseSensitive, backwards);
					ed._sCall("collapse", [true]);
				}
			}
			
			if(!this._find(false) && showMessage){	// Find the next
				this._promDialog.set("content", dojo.string.substitute(
					this._strings["eofDialogText"], {"0": this._strings["eofDialogTextReplace"]}));
				dijit.popup.open({popup: this._promDialog, around: this._replaceButton.domNode});
				this._promDialogTimeout = setTimeout(dojo.hitch(this, function(){
					clearTimeout(this._promDialogTimeout);
					this._promDialogTimeout = null;
					dijit.popup.close(this._promDialog);
				}), 3000);
				setTimeout(dojo.hitch(this, function(){
					this.editor.focus();
				}), 0);
			}
			return isReplaced;
		 }
		 return null;
	},
	
	_replaceAll: function(/*Boolean?*/ showMessage){
		// summary:
		//		This function replaces all the matched content on the editor document
		//		with the noted options for replace
		// showMessage:
		//		Indicate if the prompt message is shown or not when the action is done.
		// tags:
		//		private
		var replaced = 0;
		var backwards = this._backwards.get("value");
		
		if(backwards){
			this.editor.placeCursorAtEnd();
		}else{
			this.editor.placeCursorAtStart();
		}
		
		// The _replace will return false if the current selection deos not match
		// the searched text. So try the first attempt so that the selection
		// is always the searched text if there is one that matches
		if(this._replace(false)) { replaced++; }
		// Do the replace via timeouts to avoid locking the browser up for a lot of replaces.
		var loopBody = dojo.hitch(this, function(){
			if(this._replace(false)){
				replaced++;
				setTimeout(loopBody, 10);
			}else{
				if(showMessage){
					this._promDialog.set("content", dojo.string.substitute(
						this._strings["replaceDialogText"], {"0": "" + replaced}));
					dijit.popup.open({
						popup: this._promDialog,
						around: this._replaceAllButton.domNode
					});
					this._promDialogTimeout = setTimeout(dojo.hitch(this, function(){
						clearTimeout(this._promDialogTimeout);
						this._promDialogTimeout = null;
						dijit.popup.close(this._promDialog);
					}), 3000);
					setTimeout(dojo.hitch(this, function(){
						this._findField.focus();
						this._findField.textBox.focusNode.select();
					}), 0);
				}
			}
		});
		loopBody();
	},

	_findText: function(/*String*/ txt, /*Boolean*/ caseSensitive, /*Boolean*/ backwards){
		// summary:
		//		This function invokes a find with specific options
		// txt: String
		//		The text to locate in the document.
		// caseSensitive: Boolean
		//		Whether or ot to search case-sensitively.
		// backwards: Boolean
		//		Whether or not to search backwards in the document.
		// tags:
		//		private.
		// returns:
		//		Boolean indicating if the content was found or not.
		var ed = this.editor;
		var win = ed.window;
		var found = false;
		if(txt){
			if(win.find){
				found = win.find(txt, caseSensitive, backwards, false, false, false, false);
			}else{
				var doc = ed.document;
				if(doc.selection || win.getSelection){
					/* IE */
					// Focus to restore position/selection,
					// then shift to search from current position.
					this.editor.focus();
					var txtRg = doc.body.createTextRange();
					var txtRg2 = txtRg.duplicate();
					var sel1 = win.getSelection();
					var sRange = sel1.getRangeAt(0);
					var curPos = doc.selection?doc.selection.createRange():null;
					if(curPos){
						if(backwards){
							txtRg.setEndPoint("EndToStart", curPos);
						}else{
							txtRg.setEndPoint("StartToEnd", curPos);
						}
					}else if(this._bookmark){
						var currentText = win.getSelection().toString();
						txtRg.moveToBookmark(this._bookmark);
						//if selection is different to previous bookmark, need to search from that position
						if ( txtRg.text != currentText ) {
							txtRg = txtRg2.duplicate();
							this._bookmark = null;
						}else if(backwards){
							txtRg2.setEndPoint("EndToStart", txtRg);
							txtRg = txtRg2.duplicate();
						}else{
							txtRg2.setEndPoint("StartToEnd", txtRg);
							txtRg = txtRg2.duplicate();
						}
					}
					var flags = caseSensitive?4:0;
					if(backwards){
						flags = flags | 1;
					}
					//flags = flags |
					found = txtRg.findText(txt,txtRg.text.length,flags);
					if(found){
						txtRg.select();
						this._bookmark = txtRg.getBookmark();
					}
				}
			}
		}
		return found;
	},

	_filterRegexp: function(/*String*/ pattern, /*Boolean*/ ignoreCase){
		// summary:
		//		Helper function to convert a simple pattern to a regular expression for matching.
		// description:
		//		Returns a regular expression object that conforms to the defined conversion rules.
		//		For example:
		//
		//		- ca*   -> /^ca.*$/
		//		- *ca*  -> /^.*ca.*$/
		//		- *c\*a*  -> /^.*c\*a.*$/
		//		- *c\*a?*  -> /^.*c\*a..*$/
		//
		//		and so on.
		// pattern: string
		//		A simple matching pattern to convert that follows basic rules:
		//
		//		- * Means match anything, so ca* means match anything starting with ca
		//		- ? Means match single character.  So, b?b will match to bob and bab, and so on.
		//		- \ is an escape character.  So for example, \* means do not treat * as a match, but literal character *.
		//		  To use a \ as a character in the string, it must be escaped.  So in the pattern it should be
		//		  represented by \\ to be treated as an ordinary \ character instead of an escape.
		// ignoreCase:
		//		An optional flag to indicate if the pattern matching should be treated as case-sensitive or not when comparing
		//		By default, it is assumed case sensitive.
		// tags:
		//		private

		var rxp = "";
		var c = null;
		for(var i = 0; i < pattern.length; i++){
			c = pattern.charAt(i);
			switch(c){
				case '\\':
					rxp += c;
					i++;
					rxp += pattern.charAt(i);
					break;
				case '$':
				case '^':
				case '/':
				case '+':
				case '.':
				case '|':
				case '(':
				case ')':
				case '{':
				case '}':
				case '[':
				case ']':
					rxp += "\\"; //fallthrough
				default:
					rxp += c;
			}
		}
		rxp = "^" + rxp + "$";
		if(ignoreCase){
			return new RegExp(rxp,"mi"); //RegExp
		}else{
			return new RegExp(rxp,"m"); //RegExp
		}
		
	},
	
	updateState: function(){
		// summary:
		//		Over-ride for button state control for disabled to work.
		this.button.set("disabled", this.get("disabled"));
	},

	destroy: function(){
		// summary:
		//		Cleanup of our custom toolbar.
		this.inherited(arguments);
		if(this._promDialogTimeout){
			clearTimeout(this._promDialogTimeout);
			this._promDialogTimeout = null;
			dijit.popup.close(this._promDialog);
		}
		if(this._frToolbar){
			this._frToolbar.destroyRecursive();
			this._frToolbar = null;
		}
		if(this._promDialog){
			this._promDialog.destroyRecursive();
			this._promDialog = null;
		}
	}
});

// For monkey patching
FindReplace._FindReplaceCloseBox = FindReplaceCloseBox;
FindReplace._FindReplaceTextBox = FindReplaceTextBox;
FindReplace._FindReplaceCheckBox = FindReplaceCheckBox;
FindReplace._FindReplaceToolbar = FindReplaceToolbar;

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	var name = o.args.name.toLowerCase();
	if(name ===  "findreplace"){
		o.plugin = new FindReplace({});
	}
});

return FindReplace;

});

},
'dojox/editor/plugins/PasteFromWord':function(){
define([
	"dojo",
	"dijit",
	"dojox",
	"dijit/_editor/_Plugin",
	"dijit/_base/manager",
	"dijit/_editor/RichText",
	"dijit/form/Button",
	"dijit/Dialog",
	"dojox/html/format",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/i18n",
	"dojo/string",
	"dojo/i18n!dojox/editor/plugins/nls/PasteFromWord",
	"dojo/i18n!dijit/nls/common",
	"dojo/i18n!dijit/_editor/nls/commands"
], function(dojo, dijit, dojox, _Plugin) {

var PasteFromWord = dojo.declare("dojox.editor.plugins.PasteFromWord", _Plugin, {
	// summary:
	//		This plugin provides PasteFromWord capability to the editor.  When
	//		clicked, a dialog opens with a spartan RichText instance to paste
	//		word content into via the keyboard commands.  The contents are
	//		then filtered to remove word style classes and other meta-junk
	//		that tends to cause issues.

	// iconClassPrefix: [const] String
	//		The CSS class name for the button node is formed from `iconClassPrefix`
	//		and `command`
	iconClassPrefix: "dijitAdditionalEditorIcon",

	// width: [public] String
	//		The width to use for the rich text area in the copy/pate dialog, in px.  Default is 400px.
	width: "400px",

	// height: [public] String
	//		The height to use for the rich text area in the copy/pate dialog, in px.  Default is 300px.
	height: "300px",

	_template: ["<div class='dijitPasteFromWordEmbeddedRTE'>",
				"<div style='width: ${width}; padding-top: 5px; padding-bottom: 5px;'>${instructions}</div>",
				"<div id='${uId}_rte' style='width: ${width}; height: ${height}'></div>",
				"<table style='width: ${width}' tabindex='-1'>",
					"<tbody>",
						"<tr>",
							"<td align='center'>",
								"<button type='button' dojoType='dijit.form.Button' id='${uId}_paste'>${paste}</button>",
								"&nbsp;",
								"<button type='button' dojoType='dijit.form.Button' id='${uId}_cancel'>${buttonCancel}</button>",
							"</td>",
						"</tr>",
					"</tbody>",
				"</table>",
			   "</div>"].join(""),

	// _filters: [protected] Array
	//		The filters is an array of regular expressions to try and strip out a lot
	//		of style data MS Word likes to insert when pasting into a contentEditable.
	//		Prettymuch all of it is junk and not good html.  The hander is a place to put a function
	//		for match handling.  In most cases, it just handles it as empty string.  But the option is
	//		there for more complex handling.
	_filters: [
		// Meta tags, link tags, and prefixed tags
		{regexp: /(<meta\s*[^>]*\s*>)|(<\s*link\s* href="file:[^>]*\s*>)|(<\/?\s*\w+:[^>]*\s*>)/gi, handler: ""},
		// Style tags
		{regexp: /(?:<style([^>]*)>([\s\S]*?)<\/style>|<link\s+(?=[^>]*rel=['"]?stylesheet)([^>]*?href=(['"])([^>]*?)\4[^>\/]*)\/?>)/gi, handler: ""},
		// MS class tags and comment tags.
		{regexp: /(class="Mso[^"]*")|(<!--(.|\s){1,}?-->)/gi, handler: ""},
		// blank p tags
		{regexp: /(<p[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/p[^>]*>)|(<p[^>]*>\s*<font[^>]*>\s*(\&nbsp;|\u00A0)*\s*<\/\s*font\s*>\s<\/p[^>]*>)/ig, handler: ""},
		// Strip out styles containing mso defs and margins, as likely added in IE and are not good to have as it mangles presentation.
		{regexp: /(style="[^"]*mso-[^;][^"]*")|(style="margin:\s*[^;"]*;")/gi, handler: ""},
		// Scripts (if any)
		{regexp: /(<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>)|(<\s*script\b([^<>]|\s)*>?)|(<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>)/ig, handler: ""},
		// Word 10 odd o:p tags.
		{regexp: /<(\/?)o\:p[^>]*>/gi, handler: ""}
	],

	_initButton: function(){
		// summary:
		//		Over-ride for creation of the save button.
		this._filters = this._filters.slice(0); 
			
		var strings = dojo.i18n.getLocalization("dojox.editor.plugins", "PasteFromWord");
		dojo.mixin(strings, dojo.i18n.getLocalization("dijit", "common"));
		dojo.mixin(strings, dojo.i18n.getLocalization("dijit._editor", "commands"));
		this.button = new dijit.form.Button({
			label: strings["pasteFromWord"],
			showLabel: false,
			iconClass: this.iconClassPrefix + " " + this.iconClassPrefix + "PasteFromWord",
			tabIndex: "-1",
			onClick: dojo.hitch(this, "_openDialog")
		});

		this._uId = dijit.getUniqueId(this.editor.id);

		strings.uId = this._uId;
		strings.width = this.width || "400px";
		strings.height = this.height || "300px";

		this._dialog = new dijit.Dialog({title: strings["pasteFromWord"]}).placeAt(dojo.body());
		this._dialog.set("content", dojo.string.substitute(this._template, strings));

		// Make it translucent so we can fade in the window when the RTE is created.
		// the RTE has to be created 'visible, and this is a nice trick to make the creation
		// 'pretty'.
		dojo.style(dojo.byId(this._uId + "_rte"), "opacity", 0.001);

		// Link up the action buttons to perform the insert or cleanup.
		this.connect(dijit.byId(this._uId + "_paste"), "onClick", "_paste");
		this.connect(dijit.byId(this._uId + "_cancel"), "onClick", "_cancel");
		this.connect(this._dialog, "onHide", "_clearDialog");
	},

	updateState: function(){
		// summary:
		//		Over-ride for button state control for disabled to work.
		this.button.set("disabled", this.get("disabled"));
	},
	
	setEditor: function(editor){
		// summary:
		//		Over-ride for the setting of the editor.
		// editor: Object
		//		The editor to configure for this plugin to use.
		this.editor = editor;
		this._initButton();
	},

	_openDialog: function(){
		// summary:
		//		Function to trigger opening the copy dialog.
		// tags:
		//		private
		this._dialog.show();
		if(!this._rte){
			// RTE hasn't been created yet, so we need to create it now that the
			// dialog is showing up.
			setTimeout(dojo.hitch(this, function() {
				this._rte = new dijit._editor.RichText({height: this.height || "300px"}, this._uId + "_rte");
				this._rte.startup();
				this._rte.onLoadDeferred.addCallback(dojo.hitch(this, function() {
					dojo.animateProperty({
						node: this._rte.domNode, properties: { opacity: { start: 0.001, end: 1.0 } }
					}).play();
				}));
			}), 100);
		}
	},

	_paste: function(){
		// summary:
		//		Function to handle setting the contents of the copy from dialog
		//		into the editor.
		// tags:
		//		private

		// Gather the content and try to format it a bit (makes regexp cleanup simpler).
		// It also normalizes tag names and styles, so regexps are the same across browsers.
		var content = dojox.html.format.prettyPrint(this._rte.get("value"));

		//Close up the dialog and clear old content.
		this._dialog.hide();
		
		// Apply all the filters to remove MS specific injected text.
		var i;
		for(i = 0; i < this._filters.length; i++){
			var filter  = this._filters[i];
			content = content.replace(filter.regexp, filter.handler);
		}

		// Format it again to make sure it is reasonably formatted as
		// the regexp applies will have likely chewed up the formatting.
		content = dojox.html.format.prettyPrint(content);

		// Paste it in.
		this.editor.focus();
		this.editor.execCommand("inserthtml", content);
	},

	_cancel: function(){
		// summary:
		//		Function to handle cancelling setting the contents of the
		//		copy from dialog into the editor.
		// tags:
		//		private
		this._dialog.hide();
	},

	_clearDialog: function(){
		// summary:
		//		simple function to cleat the contents when hide is calledon dialog
		//		copy from dialog into the editor.
		// tags:
		//		private
		this._rte.set("value", "");
	},

	destroy: function(){
		// sunnary:
		//		Cleanup function
		// tags:
		//		public
		if(this._rte){
			this._rte.destroy();
		}
		if(this._dialog){
			this._dialog.destroyRecursive();
		}
		delete this._dialog;
		delete this._rte;
		this.inherited(arguments);
	}

});

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	var name = o.args.name.toLowerCase();
	if(name === "pastefromword"){
		o.plugin = new PasteFromWord({
			width: ("width" in o.args)?o.args.width:"400px",
			height: ("height" in o.args)?o.args.width:"300px"
		});
	}
});

return PasteFromWord;
});

},
'dojox/html/format':function(){
define(["dojo/_base/kernel", "./entities", "dojo/_base/array", "dojo/_base/window", "dojo/_base/sniff"], 
	function(lang, Entities, ArrayUtil, Window, has) {
	var dhf = lang.getObject("dojox.html.format",true);
	
	dhf.prettyPrint = function(html/*String*/, indentBy /*Integer?*/, maxLineLength /*Integer?*/, map/*Array?*/, /*boolean*/ xhtml){
		// summary:
		//		Function for providing a 'pretty print' version of HTML content from
		//		the provided string.  It's nor perfect by any means, but it does
		//		a 'reasonable job'.
		// html: String
		//		The string of HTML to try and generate a 'pretty' formatting.
		// indentBy:  Integer
		//		Optional input for the number of spaces to use when indenting.
		//		If not defined, zero, negative, or greater than 10, will just use tab
		//		as the indent.
		// maxLineLength: Integer
		//		Optional input for the number of characters a text line should use in
		//		the document, including the indent if possible.
		// map:	Array
		//		Optional array of entity mapping characters to use when processing the
		//		HTML Text content.  By default it uses the default set used by the
		//		dojox.html.entities.encode function.
		// xhtml: boolean
		//		Optional parameter that declares that the returned HTML should try to be 'xhtml' compatible.
		//		This means normally unclosed tags are terminated with /> instead of >.  Example: `<hr>` -> `<hr />`
		var content = [];
		var indentDepth = 0;
		var closeTags = [];
		var iTxt = "\t";
		var textContent = "";
		var inlineStyle = [];
		var i;
	
		// Compile regexps once for this call.
		var rgxp_fixIEAttrs = /[=]([^"']+?)(\s|>)/g;
		var rgxp_styleMatch = /style=("[^"]*"|'[^']*'|\S*)/gi;
		var rgxp_attrsMatch = /[\w-]+=("[^"]*"|'[^']*'|\S*)/gi;
	
		// Check to see if we want to use spaces for indent instead
		// of tab.
		if(indentBy && indentBy > 0 && indentBy < 10){
			iTxt = "";
			for(i = 0; i < indentBy; i++){
				iTxt += " ";
			}
		}
	
		//Build the content outside of the editor so we can walk
		//via DOM and build a 'pretty' output.
		var contentDiv = Window.doc.createElement("div");
		contentDiv.innerHTML = html;
	
		// Use the entity encode/decode functions, they cache on the map,
		// so it won't multiprocess a map.
		var encode = Entities.encode;
		var decode = Entities.decode;
	
		/** Define a bunch of formatters to format the output. **/
		var isInlineFormat = function(tag){
			// summary:
			//		Function to determine if the current tag is an inline
			//		element that does formatting, as we don't want to
			//		break/indent around it, as it can screw up text.
			// tag:
			//		The tag to examine
			switch(tag){
				case "a":
				case "b":
				case "strong":
				case "s":
				case "strike":
				case "i":
				case "u":
				case "em":
				case "sup":
				case "sub":
				case "span":
				case "font":
				case "big":
				case "cite":
				case "q":
				case "small":
					return true;
				default:
					return false;
			}
		};
	
		//Create less divs.
		var div = contentDiv.ownerDocument.createElement("div");
		var outerHTML =  function(node){
			// summary:
			//		Function to return the outer HTML of a node.
			//		Yes, IE has a function like this, but using cloneNode
			//		allows avoiding looking at any child nodes, because in this
			//		case, we don't want them.
			var clone = node.cloneNode(false);
			div.appendChild(clone);
			var html = div.innerHTML;
			div.innerHTML = "";
			return html;
		};
	
		var sizeIndent = function(){
			var i, txt = "";
			for(i = 0; i < indentDepth; i++){
				txt += iTxt;
			}
			return txt.length;
		}
	
		var indent = function(){
			// summary:
			//		Function to handle indent depth.
			var i;
			for(i = 0; i < indentDepth; i++){
				content.push(iTxt);
			}
		};
		var newline = function(){
			// summary:
			//		Function to handle newlining.
			content.push("\n");
		};
	
		var processTextNode = function(n){
			// summary:
			//		Function to process the text content for doc
			//		insertion
			// n:
			//		The text node to process.
			textContent += encode(n.nodeValue, map);
		};
	
		var formatText = function(txt){
			// summary:
			//		Function for processing the text content encountered up to a
			//		point and inserting it into the formatted document output.
			// txt:
			//		The text to format.
			var i;
			var _iTxt;
	
			// Clean up any indention organization since we're going to rework it
			// anyway.
			var _lines = txt.split("\n");
			for(i = 0; i < _lines.length; i++){
				_lines[i] = lang.trim(_lines[i]);
			}
			txt = _lines.join(" ");
			txt = lang.trim(txt);
			if(txt !== ""){
				var lines = [];
				if(maxLineLength && maxLineLength > 0){
					var indentSize = sizeIndent();
					var maxLine = maxLineLength;
					if(maxLineLength > indentSize){
						maxLine -= indentSize;
					}
					while(txt){
						if(txt.length > maxLineLength){
							for(i = maxLine; (i > 0 && txt.charAt(i) !== " "); i--){
								// Do nothing, we're just looking for a space to split at.
							}
							if(!i){
								// Couldn't find a split going back, so go forward.
								for(i = maxLine; (i < txt.length && txt.charAt(i) !== " "); i++){
									// Do nothing, we're just looking for a space to split at.
								}
							}
							var line = txt.substring(0, i);
							line = lang.trim(line);
							// Shift up the text string to the next chunk.
							txt = lang.trim(txt.substring((i == txt.length)?txt.length:i + 1, txt.length));
							if(line){
								_iTxt = "";
								for(i = 0; i < indentDepth; i++){
									_iTxt += iTxt;
								}
								line = _iTxt + line + "\n";
							}
							lines.push(line);
						}else{
							// Line is shorter than out desired length, so use it.
							// as/is
							_iTxt = "";
							for(i = 0; i < indentDepth; i++){
								_iTxt += iTxt;
							}
							txt = _iTxt + txt + "\n";
							lines.push(txt);
							txt = null;
						}
					}
					return lines.join("");
				}else{
					_iTxt = "";
					for(i = 0; i < indentDepth; i++){
						_iTxt += iTxt;
					}
					txt = _iTxt + txt + "\n";
					return txt;
				}
			}else{
				return "";
			}
		};
	
		var processScriptText = function(txt){
			// summary:
			//		Function to clean up potential escapes in the script code.
			if(txt){
				txt = txt.replace(/&quot;/gi, "\"");
				txt = txt.replace(/&gt;/gi, ">");
				txt = txt.replace(/&lt;/gi, "<");
				txt = txt.replace(/&amp;/gi, "&");
			}
			return txt;
		};
	
		var formatScript = function(txt){
			// summary:
			//		Function to rudimentary formatting of script text.
			//		Not perfect, but it helps get some level of organization
			//		in there.
			// txt:
			//		The script text to try to format a bit.
			if(txt){
				txt = processScriptText(txt);
				var i, t, c, _iTxt;
				var indent = 0;
				var scriptLines = txt.split("\n");
				var newLines = [];
				for (i = 0; i < scriptLines.length; i++){
					var line = scriptLines[i];
					var hasNewlines = (line.indexOf("\n") > -1);
					line = lang.trim(line);
					if(line){
						var iLevel = indent;
						// Not all blank, so we need to process.
						for(c = 0; c < line.length; c++){
							var ch = line.charAt(c);
							if(ch === "{"){
								indent++;
							}else if(ch === "}"){
								indent--;
								// We want to back up a bit before the
								// line is written.
								iLevel = indent;
							}
						}
						_iTxt = "";
						for(t = 0; t < indentDepth + iLevel; t++){
							_iTxt += iTxt;
						}
						newLines.push(_iTxt + line + "\n");
					}else if(hasNewlines && i === 0){
						// Just insert a newline for blank lines as
						// long as it's not the first newline (we
						// already inserted that in the openTag handler)
						newLines.push("\n");
					}
	
				}
				// Okay, create the script text, hopefully reasonably
				// formatted.
				txt = newLines.join("");
			}
			return txt;
		};
	
		var openTag = function(node){
			// summary:
			//		Function to open a new tag for writing content.
			var name = node.nodeName.toLowerCase();
			// Generate the outer node content (tag with attrs)
			var nText = lang.trim(outerHTML(node));
			var tag = nText.substring(0, nText.indexOf(">") + 1);
	
			// Also thanks to IE, we need to check for quotes around
			// attributes and insert if missing.
			tag = tag.replace(rgxp_fixIEAttrs,'="$1"$2');
	
			// And lastly, thanks IE for changing style casing and end
			// semi-colon and webkit adds spaces, so lets clean it up by
			// sorting, etc, while we're at it.
			tag = tag.replace(rgxp_styleMatch, function(match){
				var sL = match.substring(0,6);
				var style = match.substring(6, match.length);
				var closure = style.charAt(0);
				style = lang.trim(style.substring(1,style.length -1));
				style = style.split(";");
				var trimmedStyles = [];
				ArrayUtil.forEach(style, function(s){
					s = lang.trim(s);
					if(s){
						// Lower case the style name, leave the value alone.  Mainly a fixup for IE.
						s = s.substring(0, s.indexOf(":")).toLowerCase() + s.substring(s.indexOf(":"), s.length);
						trimmedStyles.push(s);
					}
				});
				trimmedStyles = trimmedStyles.sort();
				
				// Reassemble and return the styles in sorted order.
				style = trimmedStyles.join("; ");
				var ts = lang.trim(style);
				if(!ts || ts === ";"){
					// Just remove any style attrs that are empty.
					return "";
				}else{
					style += ";";
					return sL + closure + style + closure;
				}
			});
	
			// Try and sort the attributes while we're at it.
			var attrs = [];
			tag = tag.replace(rgxp_attrsMatch, function(attr){
				attrs.push(lang.trim(attr));
				return "";
			});
			attrs = attrs.sort();
	
			// Reassemble the tag with sorted attributes!
			tag = "<" + name;
			if(attrs.length){
				 tag += " " + attrs.join(" ");
			}
	
			// Determine closure status.  If xhtml,
			// then close the tag properly as needed.
			if(nText.indexOf("</") != -1){
				closeTags.push(name);
				tag += ">";
			}else{
				if(xhtml){
					tag += " />";
				}else{
					tag += ">";
				}
				closeTags.push(false);
			}
	
			var inline = isInlineFormat(name);
			inlineStyle.push(inline);
			if(textContent && !inline){
				// Process any text content we have that occurred
				// before the open tag of a non-inline.
				content.push(formatText(textContent));
				textContent = "";
			}
	
			// Determine if this has a closing tag or not!
			if(!inline){
				indent();
				content.push(tag);
				newline();
				indentDepth++;
			}else{
				textContent += tag;
			}
			
		};
		
		var closeTag = function(){
			// summary:
			//		Function to close out a tag if necessary.
			var inline = inlineStyle.pop();
			if(textContent && !inline){
				// Process any text content we have that occurred
				// before the close tag.
				content.push(formatText(textContent));
				textContent = "";
			}
			var ct = closeTags.pop();
			if(ct){
				ct = "</" + ct + ">";
				if(!inline){
					indentDepth--;
					indent();
					content.push(ct);
					newline();
				}else{
					textContent += ct;
				}
			}else{
				indentDepth--;
			}
		};
	
		var processCommentNode = function(n){
			// summary:
			//		Function to handle processing a comment node.
			// n:
			//		The comment node to process.
	
			//Make sure contents aren't double-encoded.
			var commentText = decode(n.nodeValue, map);
			indent();
			content.push("<!--");
			newline();
			indentDepth++;
			content.push(formatText(commentText));
			indentDepth--;
			indent();
			content.push("-->");
			newline();
		};
	
		var processNode = function(node) {
			// summary:
			//		Entrypoint for processing all the text!
			var children = node.childNodes;
			if(children){
				var i;
				for(i = 0; i < children.length; i++){
					var n = children[i];
					if(n.nodeType === 1){
						var tg = lang.trim(n.tagName.toLowerCase());
						if(has("ie") && n.parentNode != node){
							// IE is broken.  DOMs are supposed to be a tree.
							// But in the case of malformed HTML, IE generates a graph
							// meaning one node ends up with multiple references
							// (multiple parents).  This is totally wrong and invalid, but
							// such is what it is.  We have to keep track and check for
							// this because otherwise the source output HTML will have dups.
							continue;
						}
						if(tg && tg.charAt(0) === "/"){
							// IE oddity.  Malformed HTML can put in odd tags like:
							// </ >, </span>.  It treats a mismatched closure as a new
							// start tag.  So, remove them.
							continue;
						}else{
							//Process non-dup, seemingly well formed elements!
							openTag(n);
							if(tg === "script"){
								content.push(formatScript(n.innerHTML));
							}else if(tg === "pre"){
								var preTxt = n.innerHTML;
								if(has("mozilla")){
									//Mozilla screws this up, so fix it up.
									preTxt = preTxt.replace("<br>", "\n");
									preTxt = preTxt.replace("<pre>", "");
									preTxt = preTxt.replace("</pre>", "");
								}
								// Add ending newline, if needed.
								if(preTxt.charAt(preTxt.length - 1) !== "\n"){
									preTxt += "\n";
								}
								content.push(preTxt);
							}else{
								processNode(n);
							}
							closeTag();
						}
					}else if(n.nodeType === 3 || n.nodeType === 4){
						processTextNode(n);
					}else if(n.nodeType === 8){
						processCommentNode(n);
					}
				}
			}
		};
	
		//Okay, finally process the input string.
		processNode(contentDiv);
		if(textContent){
			// Insert any trailing text.  See: #10854
			content.push(formatText(textContent));
			textContent = "";
		}
		return content.join(""); //String
	};
	return dhf;
});


},
'dojox/editor/plugins/InsertAnchor':function(){
define([
	"dojo",
	"dijit",
	"dojox",
	"dijit/_editor/_Plugin",
	"dijit/_base/manager",	// TODO: change to dijit/registry, and change dijit.byId to registry.byId
	"dijit/_editor/range",
	"dijit/_Templated",
	"dijit/TooltipDialog",
	"dijit/form/ValidationTextBox",
	"dijit/form/Select",
	"dijit/form/Button",
	"dijit/form/DropDownButton",
	"dojo/_base/declare",
	"dojo/i18n",
	"dojo/string",
	"dojo/NodeList-dom",
	"dojox/editor/plugins/ToolbarLineBreak",
	"dojo/i18n!dojox/editor/plugins/nls/InsertAnchor",
	"dojo/i18n!dijit/nls/common"
], function(dojo, dijit, dojox, _Plugin ) {

var InsertAnchor = dojo.declare("dojox.editor.plugins.InsertAnchor", _Plugin, {
	// summary:
	//		This plugin provides the basis for an insert anchor dialog for the
	//		dijit.Editor
	//
	// description:
	//		The command provided by this plugin is:
	//
	//		- insertAnchor

	// htmlTemplate: [protected] String
	//		String used for templating the HTML to insert at the desired point.
	htmlTemplate: "<a name=\"${anchorInput}\" class=\"dijitEditorPluginInsertAnchorStyle\">${textInput}</a>",

	// iconClassPrefix: [const] String
	//		The CSS class name for the button node icon.
	iconClassPrefix: "dijitAdditionalEditorIcon",

	// linkDialogTemplate: [private] String
	//		Template for contents of TooltipDialog to pick URL
	_template: [
		"<table role='presentation'><tr><td>",
		"<label for='${id}_anchorInput'>${anchor}</label>",
		"</td><td>",
		"<input dojoType='dijit.form.ValidationTextBox' required='true' " +
		"id='${id}_anchorInput' name='anchorInput' intermediateChanges='true'>",
		"</td></tr><tr><td>",
		"<label for='${id}_textInput'>${text}</label>",
		"</td><td>",
		"<input dojoType='dijit.form.ValidationTextBox' required='true' id='${id}_textInput' " +
		"name='textInput' intermediateChanges='true'>",
		"</td></tr>",
		"<tr><td colspan='2'>",
		"<button dojoType='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>",
		"<button dojoType='dijit.form.Button' type='button' id='${id}_cancelButton'>${cancel}</button>",
		"</td></tr></table>"
	].join(""),

	_initButton: function(){
		// summary:
		//		Override _Plugin._initButton() to initialize DropDownButton and TooltipDialog.
		var _this = this;
		var messages = dojo.i18n.getLocalization("dojox.editor.plugins", "InsertAnchor", this.lang);

		// Build the dropdown dialog we'll use for the button
		var dropDown = (this.dropDown = new dijit.TooltipDialog({
			title: messages["title"],
			execute: dojo.hitch(this, "setValue"),
			onOpen: function(){
				_this._onOpenDialog();
				dijit.TooltipDialog.prototype.onOpen.apply(this, arguments);
			},
			onCancel: function(){
				setTimeout(dojo.hitch(_this, "_onCloseDialog"),0);
			}
		}));

		this.button = new dijit.form.DropDownButton({
			label: messages["insertAnchor"],
			showLabel: false,
			iconClass: this.iconClassPrefix + " " + this.iconClassPrefix + "InsertAnchor",
			tabIndex: "-1",
			dropDown: this.dropDown
		});

		messages.id = dijit.getUniqueId(this.editor.id);
		this._uniqueId = messages.id;

		this.dropDown.set('content', dropDown.title +
			"<div style='border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'></div>" +
			dojo.string.substitute(this._template, messages));

		dropDown.startup();
		this._anchorInput = dijit.byId(this._uniqueId + "_anchorInput");
		this._textInput = dijit.byId(this._uniqueId + "_textInput");
		this._setButton = dijit.byId(this._uniqueId + "_setButton");
		this.connect(dijit.byId(this._uniqueId + "_cancelButton"), "onClick", function(){
			this.dropDown.onCancel();
		});

		if(this._anchorInput){
			this.connect(this._anchorInput, "onChange", "_checkInput");
		}
		if(this._textInput){
			this.connect(this._anchorInput, "onChange", "_checkInput");
		}

		//Register some filters to handle setting/removing the class tags on anchors.
		this.editor.contentDomPreFilters.push(dojo.hitch(this, this._preDomFilter));
		this.editor.contentDomPostFilters.push(dojo.hitch(this, this._postDomFilter));
		this._setup();
	},
	
	updateState: function(){
		// summary:
		//		Over-ride for button state control for disabled to work.
		this.button.set("disabled", this.get("disabled"));
	},

	setEditor: function(editor){
		// summary:
		//		Over-ride for the setting of the editor.
		// editor: Object
		//		The editor to configure for this plugin to use.
		this.editor = editor;
		this._initButton();
	},

	_checkInput: function(){
		// summary:
		//		Function to check the input to the dialog is valid
		//		and enable/disable set button
		// tags:
		//		private
		var disable = true;
		if(this._anchorInput.isValid()){
			disable = false;
		}
		this._setButton.set("disabled", disable);
	},

	_setup: function(){
		// summary:
		//		Over-ridable function that connects tag specific events.
		this.editor.onLoadDeferred.addCallback(dojo.hitch(this, function(){
			this.connect(this.editor.editNode, "ondblclick", this._onDblClick);
			setTimeout(dojo.hitch(this, function() {
				this._applyStyles();
			}), 100);
		}));
	},

	getAnchorStyle: function(){
		// summary:
		//		Over-ridable function for getting the style to apply to the anchor.
		//		The default is a dashed border with an anchor symbol.
		// tags:
		//		public
		var style = "@media screen {\n" +
				"\t.dijitEditorPluginInsertAnchorStyle {\n" +
				"\t\tbackground-image: url({MODURL}/images/anchor.gif);\n" +
				"\t\tbackground-repeat: no-repeat;\n"	+
				"\t\tbackground-position: top left;\n" +
				"\t\tborder-width: 1px;\n" +
				"\t\tborder-style: dashed;\n" +
				"\t\tborder-color: #D0D0D0;\n" +
				 "\t\tpadding-left: 20px;\n" +
			"\t}\n" +
		"}\n";

		//Finally associate in the image locations based off the module url.
		var modurl = dojo.moduleUrl(dojox._scopeName, "editor/plugins/resources").toString();
		if(!(modurl.match(/^https?:\/\//i)) &&
			!(modurl.match(/^file:\/\//i))){
			// We have to root it to the page location on webkit for some nutball reason.
			// Probably has to do with how iframe was loaded.
			var bUrl;
			if(modurl.charAt(0) === "/"){
				//Absolute path on the server, so lets handle...
				var proto = dojo.doc.location.protocol;
				var hostn = dojo.doc.location.host;
				bUrl = proto + "//" + hostn;
			}else{
				bUrl = this._calcBaseUrl(dojo.global.location.href);
			}
			if(bUrl[bUrl.length - 1] !== "/" && modurl.charAt(0) !== "/"){
				bUrl += "/";
			}
			modurl = bUrl + modurl;
		}
		return style.replace(/\{MODURL\}/gi, modurl);
	},

	_applyStyles: function(){
		// summary:
		//		Function to apply a style to inserted anchor tags so that
		//		they are obviously anchors.
		if(!this._styled){
			try{
				//Attempt to inject our specialized style rules for doing this.
				this._styled = true;
				var doc = this.editor.document;
				var style = this.getAnchorStyle();
				if(!dojo.isIE){
					var sNode = doc.createElement("style");
					sNode.appendChild(doc.createTextNode(style));
					doc.getElementsByTagName("head")[0].appendChild(sNode);
				}else{
					var ss = doc.createStyleSheet("");
					ss.cssText = style;
				}
			 }catch(e){ /* Squelch */ }
		 }
	},

	_calcBaseUrl: function(fullUrl) {
		// summary:
		//		Internal function used to figure out the full root url (no relatives)
		//		for loading images in the styles in the iframe.
		// fullUrl: String
		//		The full url to tear down to the base.
		// tags:
		//		private
		var baseUrl = null;
		if (fullUrl !== null) {
			// Check to see if we need to strip off any query parameters from the Url.
			var index = fullUrl.indexOf("?");
			if (index != -1) {
				fullUrl = fullUrl.substring(0,index);
			}

			// Now we need to trim if necessary.  If it ends in /, then we don't
			// have a filename to trim off so we can return.
			index = fullUrl.lastIndexOf("/");
			if (index > 0 && index < fullUrl.length) {
				baseUrl = fullUrl.substring(0,index);
			}else{
				baseUrl = fullUrl;
			}
		}
		return baseUrl; //String
	},

	_checkValues: function(args){
		// summary:
		//		Function to check the values in args and 'fix' them up as needed.
		// args: Object
		//		Content being set.
		// tags:
		//		protected
		if(args){
			if(args.anchorInput){
				args.anchorInput = args.anchorInput.replace(/"/g, "&quot;");
			}
			if(!args.textInput){
				// WebKit doesn't work with double-click select unless there's
				// a space in the anchor text, so put a in the case of
				// empty desc.
				args.textInput = "&nbsp;";
			}
		}
		return args;
	},

	setValue: function(args){
		// summary:
		//		Callback from the dialog when user presses "set" button.
		// tags:
		//		private
		this._onCloseDialog();
		if(!this.editor.window.getSelection){
			// IE check without using user agent string.
			var sel = dijit.range.getSelection(this.editor.window);
			var range = sel.getRangeAt(0);
			var a = range.endContainer;
			if(a.nodeType === 3){
				// Text node, may be the link contents, so check parent.
				// This plugin doesn't really support nested HTML elements
				// in the link, it assumes all link content is text.
				a = a.parentNode;
			}
			if(a && (a.nodeName && a.nodeName.toLowerCase() !== "a")){
				// Stll nothing, one last thing to try on IE, as it might be 'img'
				// and thus considered a control.
				a = this.editor._sCall("getSelectedElement", ["a"]);
			}
			if(a && (a.nodeName && a.nodeName.toLowerCase() === "a")){
				// Okay, we do have a match.  IE, for some reason, sometimes pastes before
				// instead of removing the targetted paste-over element, so we unlink the
				// old one first.  If we do not the <a> tag remains, but it has no content,
				// so isn't readily visible (but is wrong for the action).
				if(this.editor.queryCommandEnabled("unlink")){
					// Select all the link childent, then unlink.  The following insert will
					// then replace the selected text.
					this.editor._sCall("selectElementChildren", [a]);
					this.editor.execCommand("unlink");
				}
			}
		}
		// make sure values are properly escaped, etc.
		args = this._checkValues(args);
		this.editor.execCommand('inserthtml',
			dojo.string.substitute(this.htmlTemplate, args));
	},

	_onCloseDialog: function(){
		// summary:
		//		Handler for close event on the dialog
		this.editor.focus();
	},

	_getCurrentValues: function(a){
		// summary:
		//		Over-ride for getting the values to set in the dropdown.
		// a:
		//		The anchor/link to process for data for the dropdown.
		// tags:
		//		protected
		var anchor, text;
		if(a && a.tagName.toLowerCase() === "a" && dojo.attr(a, "name")){
			anchor = dojo.attr(a, "name");
			text = a.textContent || a.innerText;
			this.editor._sCall("selectElement", [a, true]);
		}else{
			text = this.editor._sCall("getSelectedText");
		}
		return {anchorInput: anchor || '', textInput: text || ''}; //Object;
	},

	_onOpenDialog: function(){
		// summary:
		//		Handler for when the dialog is opened.
		//		If the caret is currently in a URL then populate the URL's info into the dialog.
		var a;
		if(!this.editor.window.getSelection){
			// IE is difficult to select the element in, using the range unified
			// API seems to work reasonably well.
			var sel = dijit.range.getSelection(this.editor.window);
			var range = sel.getRangeAt(0);
			a = range.endContainer;
			if(a.nodeType === 3){
				// Text node, may be the link contents, so check parent.
				// This plugin doesn't really support nested HTML elements
				// in the link, it assumes all link content is text.
				a = a.parentNode;
			}
			if(a && (a.nodeName && a.nodeName.toLowerCase() !== "a")){
				// Stll nothing, one last thing to try on IE, as it might be 'img'
				// and thus considered a control.
				a = this.editor._sCall("getSelectedElement", ["a"]);
			}
		}else{
			a = this.editor._sCall("getAncestorElement", ["a"]);
		}
		this.dropDown.reset();
		this._setButton.set("disabled", true);
		this.dropDown.set("value", this._getCurrentValues(a));
	},

	_onDblClick: function(e){
		// summary:
		//		Function to define a behavior on double clicks on the element
		//		type this dialog edits to select it and pop up the editor
		//		dialog.
		// e: Object
		//		The double-click event.
		// tags:
		//		protected.
		if(e && e.target){
			var t = e.target;
			var tg = t.tagName? t.tagName.toLowerCase() : "";
			if(tg === "a" && dojo.attr(t, "name")){
				this.editor.onDisplayChanged();
				this.editor._sCall("selectElement", [t]);
				setTimeout(dojo.hitch(this, function(){
					// Focus shift outside the event handler.
					// IE doesn't like focus changes in event handles.
					this.button.set("disabled", false);
					this.button.openDropDown();
					if(this.button.dropDown.focus){
						this.button.dropDown.focus();
					}
				}), 10);
			}
		}
	},

	_preDomFilter: function(node){
		// summary:
		//		A filter to identify the 'a' tags and if they're anchors,
		//		apply the right style to them.
		// node:
		//		The node to search from.
		// tags:
		//		private

		dojo.query("a[name]:not([href])", this.editor.editNode).addClass("dijitEditorPluginInsertAnchorStyle");
	},

	_postDomFilter: function(node){
		// summary:
		//		A filter to identify the 'a' tags and if they're anchors,
		//		remove the class style that shows up in the editor from
		//		them.
		// node:
		//		The node to search from.
		// tags:
		//		private
		if(node){	// avoid error when Editor.get("value") called before editor's iframe initialized
			dojo.query("a[name]:not([href])", node).removeClass("dijitEditorPluginInsertAnchorStyle");
		}
		return node;
	}
});


// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	var name = o.args.name;
	if(name) { name = name.toLowerCase(); }
	if(name === "insertanchor"){
		o.plugin = new InsertAnchor();
	}
});

return InsertAnchor;

});

},
'dojox/editor/plugins/Blockquote':function(){
define([
	"dojo",
	"dijit",
	"dojox",
	"dijit/_editor/_Plugin",
	"dijit/form/ToggleButton",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/i18n",
	"dojo/i18n!dojox/editor/plugins/nls/Blockquote"
], function(dojo, dijit, dojox, _Plugin) {

var Blockquote = dojo.declare("dojox.editor.plugins.Blockquote", _Plugin, {
	// summary:
	//		This plugin provides Blockquote capability to the editor.
	//		window/tab

	// iconClassPrefix: [const] String
	//		The CSS class name for the button node icon.
	iconClassPrefix: "dijitAdditionalEditorIcon",

	_initButton: function(){
		// summary:
		//		Over-ride for creation of the preview button.
		this._nlsResources = dojo.i18n.getLocalization("dojox.editor.plugins", "Blockquote");
		this.button = new dijit.form.ToggleButton({
			label: this._nlsResources["blockquote"],
			showLabel: false,
			iconClass: this.iconClassPrefix + " " + this.iconClassPrefix + "Blockquote",
			tabIndex: "-1",
			onClick: dojo.hitch(this, "_toggleQuote")
		});
	},

	setEditor: function(editor){
		// summary:
		//		Over-ride for the setting of the editor.
		// editor: Object
		//		The editor to configure for this plugin to use.
		this.editor = editor;
		this._initButton();
		this.connect(this.editor, "onNormalizedDisplayChanged", "updateState");
		// We need the custom undo code since we manipulate the dom
		// outside of the browser natives and only customUndo really handles
		// that.  It will incur a performance hit, but should hopefully be
		// relatively small.
		editor.customUndo = true;
	},
	
	_toggleQuote: function(arg){
		// summary:
		//		Function to trigger previewing of the editor document
		// tags:
		//		private
		try{
			var ed = this.editor;
			ed.focus();

			var quoteIt = this.button.get("checked");
			var sel = dijit.range.getSelection(ed.window);
			var range, elem, start, end;
			if(sel && sel.rangeCount > 0){
				range = sel.getRangeAt(0);
			}
			if(range){
				ed.beginEditing();
				if(quoteIt){
					// Lets see what we've got as a selection...
					var bq, tag;
					if(range.startContainer === range.endContainer){
						// No selection, just cursor point, we need to see if we're
						// in an indentable block, or similar.
						if(this._isRootInline(range.startContainer)){
							// Text at the 'root' of the document, so we need to gather all of it.,
		
							// First, we need to find the toplevel inline element that is rooted
							// to the document 'editNode'
							start = range.startContainer;
							while(start && start.parentNode !== ed.editNode){
								start = start.parentNode;
							}
							// Now we need to walk up its siblings and look for the first one in the rooting
							// that isn't inline or text, as we want to grab all of that for indent.
							while(start && start.previousSibling && (
									this._isTextElement(start) ||
									(start.nodeType === 1 &&
									 this._isInlineFormat(this._getTagName(start))
								))){
								start = start.previousSibling;
							}
							if(start && start.nodeType === 1 &&
							   !this._isInlineFormat(this._getTagName(start))){
								// Adjust slightly, we're one node too far back in this case.
								start = start.nextSibling;
							}
		
							// Okay, we have a configured start, lets grab everything following it that's
							// inline and make it part of the blockquote!
							if(start){
								bq = ed.document.createElement("blockquote");
								dojo.place(bq, start, "after");
								bq.appendChild(start);
								end = bq.nextSibling;
								while(end && (
									this._isTextElement(end) ||
									(end.nodeType === 1 &&
										this._isInlineFormat(this._getTagName(end)))
									)){
									// Add it.
									bq.appendChild(end);
									end = bq.nextSibling;
								}
							}
						}else{
							// Figure out what to do when not root inline....
							var node = range.startContainer;
							while ((this._isTextElement(node) ||
									this._isInlineFormat(this._getTagName(node))
									|| this._getTagName(node) === "li") &&
								node !== ed.editNode && node !== ed.document.body){
								node = node.parentNode;
							}
							if(node !== ed.editNode && node !==	node.ownerDocument.documentElement){
								bq = ed.document.createElement("blockquote");
								dojo.place(bq, node, "after");
								bq.appendChild(node);
							}
						}
						if(bq){
							ed._sCall("selectElementChildren", [bq]);
							ed._sCall("collapse", [true]);
						}
					}else{
						var curNode;
						// multi-node select.  We need to scan over them.
						// Find the two containing nodes at start and end.
						// then move the end one node past.  Then ... lets see
						// what we can blockquote!
						start = range.startContainer;
						end = range.endContainer;
						// Find the non-text nodes.

						while(start && this._isTextElement(start) && start.parentNode !== ed.editNode){
							start = start.parentNode;
						}

						// Try to find the end node.  We have to check the selection junk
						curNode = start;
						while(curNode.nextSibling && ed._sCall("inSelection", [curNode])){
							curNode = curNode.nextSibling;
						}
						end = curNode;
						if(end === ed.editNode || end === ed.document.body){
							// Unable to determine real selection end, so just make it
							// a single node indent of start + all following inline styles, if
							// present, then just exit.
							bq = ed.document.createElement("blockquote");
							dojo.place(bq, start, "after");
							tag = this._getTagName(start);
							if(this._isTextElement(start) || this._isInlineFormat(tag)){
								// inline element or textnode
								// Find and move all inline tags following the one we inserted also into the
								// blockquote so we don't split up content funny.
								var next = start;
								while(next && (
									this._isTextElement(next) ||
									(next.nodeType === 1 &&
									this._isInlineFormat(this._getTagName(next))))){
									bq.appendChild(next);
									next = bq.nextSibling;
								}
							}else{
								bq.appendChild(start);
							}
							return;
						}

						// Has a definite end somewhere, so lets try to blockquote up to it.
						// requires looking at the selections and in some cases, moving nodes
						// into separate blockquotes.
						end = end.nextSibling;
						curNode = start;
						while(curNode && curNode !== end){
							if(curNode.nodeType === 1){
								tag = this._getTagName(curNode);
								if(tag !== "br"){
									if(!window.getSelection){
										// IE sometimes inserts blank P tags, which we want to skip
										// as they end up blockquoted, which messes up layout.
										if(tag === "p" && this._isEmpty(curNode)){
											curNode = curNode.nextSibling;
											continue;
										}
									}
									if(this._isInlineFormat(tag)){
										// inline tag.
										if(!bq){
											bq = ed.document.createElement("blockquote");
											dojo.place(bq, curNode, "after");
											bq.appendChild(curNode);
										}else{
											bq.appendChild(curNode);
										}
										curNode = bq;
									}else{
										if(bq){
											if(this._isEmpty(bq)){
												bq.parentNode.removeChild(bq);
											}
										}
										bq = ed.document.createElement("blockquote");
										dojo.place(bq, curNode, "after");
										bq.appendChild(curNode);
										curNode = bq;
									}
								}
							}else if(this._isTextElement(curNode)){
								if(!bq){
									bq = ed.document.createElement("blockquote");
									dojo.place(bq, curNode, "after");
									bq.appendChild(curNode);
								}else{
									bq.appendChild(curNode);
								}
								curNode = bq;
							}
							curNode = curNode.nextSibling;
						}
						// Okay, check the last bq, remove it if no content.
						if(bq){
							if(this._isEmpty(bq)){
								bq.parentNode.removeChild(bq);
							}else{
								ed._sCall("selectElementChildren", [bq]);
								ed._sCall("collapse", [true]);
							}
							bq = null;
						}
					}
				}else{
					var found = false;
					if(range.startContainer === range.endContainer){
						elem = range.endContainer;
						// Okay, now see if we can find one of the formatting types we're in.
						while(elem && elem !== ed.editNode && elem !== ed.document.body){
							var tg = elem.tagName?elem.tagName.toLowerCase():"";
							if(tg === "blockquote"){
								found = true;
								break;
							}
							elem = elem.parentNode;
						}
						if(found){
							var lastChild;
							while(elem.firstChild){
								lastChild = elem.firstChild;
								dojo.place(lastChild, elem, "before");
							}
							elem.parentNode.removeChild(elem);
							if(lastChild){
								ed._sCall("selectElementChildren", [lastChild]);
								ed._sCall("collapse", [true]);
							}
						}
					}else{
						// Multi-select!  Gotta find all the blockquotes contained within the selection area.
						start = range.startContainer;
						end = range.endContainer;
						while(start && this._isTextElement(start) && start.parentNode !== ed.editNode){
							start = start.parentNode;
						}
						var selectedNodes = [];
						var cNode = start;
						while(cNode && cNode.nextSibling && ed._sCall("inSelection", [cNode])){
							if(cNode.parentNode && this._getTagName(cNode.parentNode) === "blockquote"){
								cNode = cNode.parentNode;
							}
							selectedNodes.push(cNode);
							cNode = cNode.nextSibling;
						}
						
						// Find all the blocknodes now that we know the selection area.
						var bnNodes = this._findBlockQuotes(selectedNodes);
						while(bnNodes.length){
							var bn = bnNodes.pop();
							if(bn.parentNode){
								// Make sure we haven't seen this before and removed it.
								while(bn.firstChild){
									dojo.place(bn.firstChild, bn, "before");
								}
								bn.parentNode.removeChild(bn);
							}
						}
					}
				}
				ed.endEditing();
			}
			ed.onNormalizedDisplayChanged();
		}catch(e){ /* Squelch */ }
	},

	updateState: function(){
		// summary:
		//		Overrides _Plugin.updateState().  This controls whether or not the current
		//		cursor position should toggle on the quote button or not.
		// tags:
		//		protected
		var ed = this.editor;
		var disabled = this.get("disabled");
		
		if(!ed || !ed.isLoaded){ return; }
		if(this.button){
			this.button.set("disabled", disabled);
			if(disabled){
				return;
			}

			// Some browsers (WebKit) doesn't actually get the tag info right.
			// So ... lets check it manually.
			var elem;
			var found = false;
			
			// Try to find the ansestor element (and see if it is blockquote)
			var sel = dijit.range.getSelection(ed.window);
			if(sel && sel.rangeCount > 0){
				var range = sel.getRangeAt(0);
				if(range){
					elem = range.endContainer;
				}
			}
			// Okay, now see if we can find one of the formatting types we're in.
			while(elem && elem !== ed.editNode && elem !== ed.document){
				var tg = elem.tagName?elem.tagName.toLowerCase():"";
				if(tg === "blockquote"){
					found = true;
					break;
				}
				elem = elem.parentNode;
			}
			// toggle whether or not the current selection is blockquoted.
			this.button.set("checked", found);
		}
	},

	_findBlockQuotes: function(nodeList){
		// summary:
		//		function to find all the blocknode elements in a collection of
		//		nodes
		// nodeList:
		//		The list of nodes.
		// tags:
		//		private
		var bnList = [];
		if(nodeList){
			var i;
			for(i = 0; i < nodeList.length; i++){
				var node = nodeList[i];
				if(node.nodeType === 1){
					if(this._getTagName(node) === "blockquote"){
						bnList.push(node);
					}
					if(node.childNodes && node.childNodes.length > 0){
						bnList = bnList.concat(this._findBlockQuotes(node.childNodes));
					}
				}
			}
		}
		return bnList;
	},

	/*****************************************************************/
	/* Functions borrowed from NormalizeIndentOutdent                */
	/*****************************************************************/

	_getTagName: function(node){
		// summary:
		//		Internal function to get the tag name of an element
		//		if any.
		// node:
		//		The node to look at.
		// tags:
		//		private
		var tag = "";
		if(node && node.nodeType === 1){
			tag = node.tagName?node.tagName.toLowerCase():"";
		}
		return tag;
	},

	_isRootInline: function(node){
		// summary:
		//		This functions tests whether an indicated node is in root as inline
		//		or rooted inline elements in the page.
		// node:
		//		The node to start at.
		// tags:
		//		private
		var ed = this.editor;
		if(this._isTextElement(node) && node.parentNode === ed.editNode){
			return true;
		}else if(node.nodeType === 1 && this._isInlineFormat(node) && node.parentNode === ed.editNode){
			return true;
		}else if(this._isTextElement(node) && this._isInlineFormat(this._getTagName(node.parentNode))){
			node = node.parentNode;
			while(node && node !== ed.editNode && this._isInlineFormat(this._getTagName(node))){
				node = node.parentNode;
			}
			if(node === ed.editNode){
				return true;
			}
		}
		return false;
	},

	_isTextElement: function(node){
		// summary:
		//		Helper function to check for text nodes.
		// node:
		//		The node to check.
		// tags:
		//		private
		if(node && node.nodeType === 3 || node.nodeType === 4){
			return true;
		}
		return false;
	},

	_isEmpty: function(node){
		// summary:
		//		Internal function to determine if a node is 'empty'
		//		Eg, contains only blank text.  Used to determine if
		//		an empty list element should be removed or not.
		// node:
		//		The node to check.
		// tags:
		//		private
		if(node.childNodes){
			var empty = true;
			var i;
			for(i = 0; i < node.childNodes.length; i++){
				var n = node.childNodes[i];
				if(n.nodeType === 1){
					if(this._getTagName(n) === "p"){
						if(!dojo.trim(n.innerHTML)){
							continue;
						}
					}
					empty = false;
					break;
				}else if(this._isTextElement(n)){
					// Check for empty text.
					var nv = dojo.trim(n.nodeValue);
					if(nv && nv !=="&nbsp;" && nv !== "\u00A0"){
						empty = false;
						break;
					}
				}else{
					empty = false;
					break;
				}
			}
			return empty;
		}else{
			return true;
		}
	},

	_isInlineFormat: function(tag){
		// summary:
		//		Function to determine if the current tag is an inline
		//		element that does formatting, as we don't want to
		//		break/indent around it, as it can screw up text.
		// tag:
		//		The tag to examine
		// tags:
		//		private
		switch(tag){
			case "a":
			case "b":
			case "strong":
			case "s":
			case "strike":
			case "i":
			case "u":
			case "em":
			case "sup":
			case "sub":
			case "span":
			case "font":
			case "big":
			case "cite":
			case "q":
			case "img":
			case "small":
				return true;
			default:
				return false;
		}
	}
});

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	var name = o.args.name.toLowerCase();
	if(name === "blockquote"){
		o.plugin = new Blockquote({});
	}
});

return Blockquote;

});

},
'dojox/editor/plugins/UploadImage':function(){
define([
	"dojo",
	"dijit",
	"dojox",
	"dijit/_editor/_Plugin",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojox/form/FileUploader",
	"dijit/_editor/_Plugin"
], function(dojo, dijit, dojox, _Plugin) {

	dojo.experimental("dojox.editor.plugins.UploadImage");

	var UploadImage = dojo.declare("dojox.editor.plugins.UploadImage", _Plugin, {
		// summary:
		// 		Adds an icon to the Editor toolbar that when clicked, opens a system dialog
		//		Although the toolbar icon is a tiny "image" the uploader could be used for
		//		any file type
		
		tempImageUrl: "",
		iconClassPrefix: "editorIcon",
		useDefaultCommand: false,
		uploadUrl: "",
		button:null,
		label:"Upload",
		
		setToolbar: function(toolbar){
			this.button.destroy();
			this.createFileInput();
			toolbar.addChild(this.button);
		},
		_initButton: function(){
			this.command = "uploadImage";
			this.editor.commands[this.command] = "Upload Image";
			this.inherited("_initButton", arguments);
			delete this.command;
		},
		
		updateState: function(){
			// summary:
			//		Over-ride for button state control for disabled to work.
			this.button.set("disabled", this.get("disabled"));
		},
		
		createFileInput: function(){
			var node = dojo.create('span', {innerHTML:"."}, document.body)
			dojo.style(node, {
				width:"40px",
				height:"20px",
				paddingLeft:"8px",
				paddingRight:"8px"
			});
			this.button = new dojox.form.FileUploader({
				isDebug:true,
				//force:"html",
				uploadUrl:this.uploadUrl,
				uploadOnChange:true,
				selectMultipleFiles:false,
				baseClass:"dojoxEditorUploadNorm",
				hoverClass:"dojoxEditorUploadHover",
				activeClass:"dojoxEditorUploadActive",
				disabledClass:"dojoxEditorUploadDisabled"
			}, node);
			this.connect(this.button, "onChange", "insertTempImage");
			this.connect(this.button, "onComplete", "onComplete");
		},
		
		onComplete: function(data,ioArgs,widgetRef){
			data = data[0];
			// Image is ready to insert
			var tmpImgNode = dojo.byId(this.currentImageId, this.editor.document);
			var file;
			// download path is mainly used so we can access a PHP script
			// not relative to this file. The server *should* return a qualified path.
			if(this.downloadPath){
				file = this.downloadPath+data.name
			}else{
				file = data.file;
			}
			
			tmpImgNode.src = file;
			dojo.attr(tmpImgNode,'_djrealurl',file);

			if(data.width){
				tmpImgNode.width = data.width;
				tmpImgNode.height = data.height;
			}
		},
		
		insertTempImage: function(){
			// summary:
			//		inserting a "busy" image to show something is hapening
			//		during upload and download of the image.
			this.currentImageId = "img_"+(new Date().getTime());
			var iTxt = '<img id="'+this.currentImageId+'" src="'+this.tempImageUrl+'" width="32" height="32"/>';
			this.editor.execCommand('inserthtml', iTxt);
		}
	});

	dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
		if(o.plugin){ return; }
		switch(o.args.name){
		case "uploadImage":
			o.plugin = new UploadImage({url: o.args.url});
		}
	});

	return UploadImage;
});

},
'dojox/form/FileUploader':function(){
define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/window",
	"dojo/_base/sniff",
	"dojo/query",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-geometry",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-form",
	"dojo/_base/config",
	"dijit/_base/manager",
	"dojo/io/iframe",
	"dojo/_base/Color",
	"dojo/_base/unload",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_Contained",
	"dojox/embed/Flash",
	"dojox/embed/flashVars",
	"dojox/html/styles"
],function(kernel, declare, lang, array, connect, win, has, query, dom, domStyle, domGeometry, domAttr, domClass, domConstruct, domForm, config, manager, ioIframe, Color, unloadUtils, Widget, TemplatedMixin, Contained, embedFlash, embedFlashVars, htmlStyles){

kernel.deprecated("dojox.form.FileUploader", "Use dojox.form.Uploader", "2.0");

	//	Usage Notes:
	//		To center text vertically, use vertical-align:middle;
	//		which emulates a boxModel button. Using line-height to center text
	//		can cause height problems in IE6

return declare("dojox.form.FileUploader", [Widget, TemplatedMixin, Contained], {
	// version:
	//		1.5 (deprecated)
	// summary:
	//		Handles File Uploading to a server (PHP script included for testing)
	//
	//		FileUploader is now a WIDGET. You do not have to pass a button
	//		in. Passing a button is still supported until version 1.5 to maintain
	//		backwards compatibility, but it is not recommended. Just create your
	//		uploader like any other widget.
	// description:
	//		If the correct version of Flash Player is available (> 9.0) , a SWF
	//		is used. If Flash Player is not installed or is outdated, a typical
	//		html fileInput is used. This process can be overridden with
	//		force:"flash" or force:"html".
	//
	//		FileUploader works with Flash 10.
	//
	//		The button styles are now recreated in Flash, so there is no longer
	//		using an invisible Flash movie with wmode=transparent. This way the Flash button
	//		is actually placed inline with the DOM, not floating above it and constantly
	//		resetting its position. The "Windows Firefox clickable bug" should be fixed (and
	//		hopefully some Linux problems).
	//
	//		The HTML button is created in a new way and it is now inline as is the
	//		FLash button. Styling is much easier and more versatile.
	//
	//		###Dependencies
	//
	//		FileUploader no longer uses FileInput.css. It now uses FileUploader.css
	//		See requires for JavaScript dependencies.
	//
	//		###NEW FEATURES
	//
	//		There are a ton of features and fixes in this version:
	//
	//		- Disabled: Can be toggled with widget.set("disabled", true|false)
	//		- Submit: A convenience method has been added for if the uploader is in a form.
	//			Instead of submitting the form, call uploader.submit(theForm), and the
	//			Uploader will handle all of the form values and post the data.
	//		- Selected List: If passing the ID of a container, the Uploaders will populate it
	//			with the selected files.
	//		- Deleting Files: You can now delete pending files.
	//		- Progress Built in: showProgress:true will change the button to a progress
	//			bar on upload.
	//		- Progress Attach: Passing progressWidgetId will tell the Uploader of a progress
	//			widget. If the Progress widget is initially hidden, it will change to
	//			visible and then restored after upload.
	//		- A11Y: The Flash button can be accessed with the TAB key. (The HTML cannot due
	//			to browser limitations)
	//		- Deferred Uploading: (Flash only) throttles the upload to one file at a time
	//
	//		###CDN USERS
	//
	//		FileUpload now works with the CDN but with limitations. The SWF must
	//		be from the same domain as the HTML page. 'swfPath' has been exposed
	//		so that you may link to that file (could of course be the same SWF in
	//		dojox resource folder). The SWF will *NOT* work from the
	//		CDN server. This would require a special XML file that would allow
	//		access to your server, and the logistics to that is impossible.
	//
	//		###LIMITATIONS
	//
	//		- This is not designed to be a part of a form, it contains its own. (See submit())
	//		- Currently does not in a Dialog box or a Tab where it is not initially visible,
	//		- The default style inherits font sizes - but a parent container should have a font size
	//			set somewhere of the results could be inconsistent.
	//
	//		###OPERA USERS
	//
	//		It works better than the 1.3 version. fileInputs apperantly can't have opacity
	//		set to zero. The Flash uploader works but files are auto-uploaded. Must be a
	//		flashVar problem.
	//
	//		###Safari Bug note:
	//
	//		The bug is in the way Safari handles the connection:
	//		https://bugs.webkit.org/show_bug.cgi?id=5760
	//		I added this to the virtual host in the Apache conf file, and now it
	//		works like a charm:
	//	|	BrowserMatch Safari nokeepalive

	swfPath: config.uploaderPath || require.toUrl("dojox/form/resources/fileuploader.swf"),


	templateString:'<div><div dojoAttachPoint="progNode"><div dojoAttachPoint="progTextNode"></div></div><div dojoAttachPoint="insideNode" class="uploaderInsideNode"></div></div>',

	// uploadUrl: String
	//		The url targeted for upload. An absolute URL is preferred. Relative URLs are
	//		changed to absolute.
	uploadUrl: "",

	// isDebug: Boolean
	//		If true, outputs traces from the SWF to console. What exactly gets passed
	//		is very relative, and depends upon what traces have been left in the DEFT SWF.
	isDebug:false,

	// devMode: Boolean
	//		Re-implemented. devMode increases the logging, adding style tracing from the SWF.
	devMode:false,

	/*=====
	// id: String
	//		The object id, just like any other widget in Dojo. However, this id
	//		is also used as a reference for the SWF
	id: "",
	=====*/

	// baseClass: String
	//		The name of the class that will style the button in a "normal" state.
	//		If baseClass is not defined, 'class' will be used.
	//		NOTE: By default the uploader will be styled like a dijit buttons and
	//		adhere to the the themes. Tundra, Soria, and Nihilo are supported.
	//		You can cascade the existing style by using 'class' or 'style'. If you
	//		overwrite baseClass, you should overwrite the remaing state classes
	//		that follow) as well.
	baseClass:"dojoxUploaderNorm",

	// hoverClass: String
	//		The name of the class that will style the button in a "hover" state. A specific
	//		class should be made to do this. Do not rely on a target like button:hover{...}
	hoverClass:"dojoxUploaderHover",

	// activeClass: String
	//		The name of the class that will style the button in a "press" state. A specific
	//		class should be made to do this. Do not rely on a target like button:active{...}
	activeClass:"dojoxUploaderActive",

	// disabledClass: String
	//		The name of the class that will style the button when its disabled.
	disabledClass:"dojoxUploaderDisabled",

	// force: String
	//		Use "flash" to always use Flash (and hopefully force the user to download the plugin
	//		if they don't have it). Use "html" to always use the HTML uploader. An empty string
	//		(default) will check for the right version of Flash and use HTML if not available.
	force:"",

	// uploaderType: [readonly] String
	//		Internal. What type of uploader is being used: "flash" or "html"
	uploaderType:"",

	// flashObject: [readonly] dojox.embed.Flash
	//		The object that creates the SWF embed object. Mostly Internal.
	flashObject: null,

	// flashMovie: [readonly] Function
	//		The SWF. Mostly Internal.
	flashMovie: null,

	// insideNode: [readonly] HTMLNode
	//		The div that holds the SWF and form/fileInput
	insideNode: null,

	// deferredUploading: Number (1 - X)
	//		(Flash only) throttles the upload to a certain amount of files at a time.
	//		By default, Flash uploads file one at a time to the server, but in parallel.
	//		Firefox will try to queue all files at once, leading to problems. Set this
	//		to the amount to upload in parallel at a time.
	//		Generally, 1 should work fine, but you can experiment with queuing more than
	//		one at a time.
	//		This is of course ignored if selectMultipleFiles equals false.
	deferredUploading: 1,

	// fileListId: String
	//		The id of a dom node to be used as a container for the pending file list.
	fileListId:"",

	// uploadOnChange: Boolean
	//		If true, uploads immediately after a file has been selected. If false,
	//		waits for upload() to be called.
	uploadOnChange: false,

	// selectMultipleFiles: Boolean
	//		If true and flash mode, multiple files may be selected from the dialog.
	//		If html mode, files are not uploaded until upload() is called. The references
	//		to each file is incremented:uploadedfile0, uploadedfile1, uploadedfile2... etc.
	selectMultipleFiles: true,

	// htmlFieldName: String
	//		The name of the field of the fileInput that the server is expecting
	htmlFieldName:"uploadedfile",

	// flashFieldName: String
	//		The name of the field of the flash uploaded files that the server is expecting
	flashFieldName:"flashUploadFiles",

	// fileMask:  Array[ Array[Description, FileTypes], Array[...]...]
	//		(an array, or an array of arrays)
	//		Restrict file selection to certain file types
	//		Empty array defaults to "All Files"
	//
	//		example:
	//
	//	|	fileMask = ["Images", "*.jpg;*.jpeg;*.gif;*.png"]
	//		or
	//	|	fileMask = [
	//	|		["Jpeg File", 	"*.jpg;*.jpeg"],
	//	|		["GIF File", 	"*.gif"],
	//	|		["PNG File", 	"*.png"],
	//	|		["All Images", 	"*.jpg;*.jpeg;*.gif;*.png"],
	//	|	]
	//
	//		NOTE: MacType is not supported, as it does not work very well.
	//		fileMask will work on a Mac, but differently than
	//		Windows.
	fileMask: null,

	// minFlashVersion: Number
	//		The minimum of version of Flash player to target. 0 would always install Flash, 100
	//		would never install it. The Flash Player has supported multiple uploads since
	//		version 8, so it could go as low as that safely.
	minFlashVersion:9,

	// tabIndex: Number|String
	//		The tab order in the DOM. Only supported by Flash. HTML Uploaders have security
	//		protection to prevent you from tabbing to the uploader. Stupid.
	tabIndex:-1,

	// showProgress: Boolean
	//		If true, the button changes to a progress bar during upload.
	showProgress:false,

	// progressMessage: String
	//		The message shown while the button is changed to a progress bar
	progressMessage:"Loading",

	// progressBackgroundUrl: String|Uri
	//		The background image to use for the button-progress
	progressBackgroundUrl:require.toUrl("dijit/themes/tundra/images/buttonActive.png"),

	// progressBackgroundColor: String|Number
	//		The background color to use for the button-progress
	progressBackgroundColor:"#ededed",

	// progressWidgetId:String
	//		The widget id of a Dijit Progress bar. The Uploader will bind to it and update it
	//		automatically.
	progressWidgetId:"",

	// skipServerCheck: Boolean
	//		If true, will not verify that the server was sent the correct format.
	//		This can be safely set to true. The purpose of the server side check
	//		is mainly to show the dev if they've implemented the different returns
	//		correctly.
	skipServerCheck:false,

	// serverTimeout:Number (milliseconds)
	//		The amount of time given to the uploaded file
	//		to wait for a server response. After this amount
	//		of time, the onComplete is fired but with a 'server timeout'
	//		error in the returned item.
	serverTimeout: 5000,


	log: function(){
		// summary:
		//		Due to the excessive logging necessary to make this code happen,
		//		It's easier to turn it on and off here in one place.
		//		Also helpful if there are multiple uploaders on one page.
		if(this.isDebug){
			console["log"](Array.prototype.slice.call(arguments).join(" "));
		}
	},

	constructor: function(){
		this._subs = [];
	},

	postMixInProperties: function(){
		// internal stuff:
		this.fileList = [];
		this._cons = [];
		this.fileMask = this.fileMask || [];
		this.fileInputs = [];
		this.fileCount = 0;
		this.flashReady = false;
		this._disabled = false;
		this.force = this.force.toLowerCase(); // Pete FTW.
		this.uploaderType = ((embedFlash.available >= this.minFlashVersion || this.force=="flash") && this.force != "html") ? "flash" : "html";
		this.deferredUploading = this.deferredUploading===true ? 1 : this.deferredUploading;

		this._refNode = this.srcNodeRef;

		this.getButtonStyle();
	},

	startup: function(){
	},

	postCreate: function(){
		this.inherited(arguments);

		// internal stuff:
		this.setButtonStyle();
		var createMethod;
		if(this.uploaderType == "flash"){
			createMethod = "createFlashUploader";
		}else{
			this.uploaderType = "html";
			createMethod = "createHtmlUploader";

		}

		this[createMethod]();

		if(this.fileListId){
			this.connect(dom.byId(this.fileListId), "click", function(evt){
				var p = evt.target.parentNode.parentNode.parentNode; // in a table
				if(p.id && p.id.indexOf("file_")>-1){
					this.removeFile(p.id.split("file_")[1]);
				}
			});
		}

		// cleaning up solves memory leak issues in the HTML version
		unloadUtils.addOnUnload(this, this.destroy);
	},

	getHiddenNode: function(/*DomNode*/ node){
		// summary:
		//		Internal.
		//		If a parent node is styled as display:none,
		//		returns that node. This node will be temporarilly
		//		changed to display:block. Note if the node is in
		//		a widget that has an onShow event, this is
		//		overridden.

		if(!node){ return null; }
		var hidden = null;
		var p = node.parentNode;
		while(p && p.tagName.toLowerCase() != "body"){
			var d = domStyle.get(p, "display");
			if(d == "none"){
				hidden = p;
				break;
			}
			p = p.parentNode;
		}
		return hidden;
	},

	getButtonStyle: function(){
		// summary:
		//		Internal.
		//		Get necessary style information from srcRefNode and
		//		assigned styles
		//


		// TODO:
		//		To call this from postCreate....
		//		could do the style stuff initially, but if hidden they will be bad sizes
		//		could then redo the sizes
		//		alt is to create a genuine button and copy THAT	instead of how doing now

		var refNode = this.srcNodeRef;
		this._hiddenNode = this.getHiddenNode(refNode);
		if(this._hiddenNode){
			domStyle.set(this._hiddenNode, "display", "block");
		}

		if(!refNode && this.button && this.button.domNode){
			// backwards compat for a Dijit button
			var isDijitButton = true;
			var cls = this.button.domNode.className + " dijitButtonNode";
			var txt = this.getText(query(".dijitButtonText", this.button.domNode)[0]);
			var domTxt = '<button id="'+this.button.id+'" class="'+cls+'">'+txt+'</button>';
			refNode = domConstruct.place(domTxt, this.button.domNode, "after");	 /// Pete doesn't like this?
			this.srcNodeRef = refNode;
			this.button.destroy();

			this.baseClass = "dijitButton";
			this.hoverClass = "dijitButtonHover";
			this.pressClass = "dijitButtonActive";
			this.disabledClass = "dijitButtonDisabled";

		}else if(!this.srcNodeRef && this.button){
			refNode = this.button;
		}

		if(domAttr.get(refNode, "class")){
			this.baseClass += " " + domAttr.get(refNode, "class");
		}
		domAttr.set(refNode, "class", this.baseClass);


		this.norm = this.getStyle(refNode);
		this.width = this.norm.w;
		this.height = this.norm.h;

		if(this.uploaderType == "flash"){

			this.over = this.getTempNodeStyle(refNode, this.baseClass+" "+this.hoverClass, isDijitButton);
			this.down = this.getTempNodeStyle(refNode, this.baseClass+" "+this.activeClass, isDijitButton);
			this.dsbl = this.getTempNodeStyle(refNode, this.baseClass+" "+this.disabledClass, isDijitButton);

			this.fhtml = {
				cn:this.getText(refNode),
				nr:this.norm,
				ov:this.over,
				dn:this.down,
				ds:this.dsbl
			};
		}else{
			this.fhtml = {
				cn:this.getText(refNode),
				nr:this.norm
			}
			if(this.norm.va == "middle"){
				this.norm.lh = this.norm.h;
			}
		}

		if(this.devMode){
			this.log("classes - base:", this.baseClass, " hover:", this.hoverClass, "active:", this.activeClass);
			this.log("fhtml:", this.fhtml)
			this.log("norm:", this.norm)
			this.log("over:", this.over)
			this.log("down:", this.down)
		}
	},

	setButtonStyle: function(){
		// summary:
		//		Internal.
		//		Set up internal dom nodes for button construction.

		domStyle.set(this.domNode, {
			width:this.fhtml.nr.w+"px",
			height:(this.fhtml.nr.h)+"px",
			padding:"0px",
			lineHeight: "normal",
			position:"relative"
		});
		if(this.uploaderType == "html" && this.norm.va == "middle"){
			domStyle.set(this.domNode, "lineHeight", this.norm.lh + "px");
		}
		if(this.showProgress){
			this.progTextNode.innerHTML = this.progressMessage;
			domStyle.set(this.progTextNode, {
				width:this.fhtml.nr.w+"px",
				height:(this.fhtml.nr.h+0)+"px",
				padding:"0px",
				margin:"0px",
				left:"0px",
				lineHeight:(this.fhtml.nr.h+0)+"px",
				position:"absolute"
			});
			domStyle.set(this.progNode, {
				width:this.fhtml.nr.w+"px",
				height:(this.fhtml.nr.h+0)+"px",
				padding:"0px",
				margin:"0px",
				left:"0px",
				position:"absolute",
				display:"none",
				backgroundImage:"url("+this.progressBackgroundUrl+")",
				backgroundPosition:"bottom",
				backgroundRepeat:"repeat-x",
				backgroundColor:this.progressBackgroundColor
			});
		}else{
			domConstruct.destroy(this.progNode);
		}
		domStyle.set(this.insideNode,{
			position:"absolute",
			top:"0px",
			left:"0px",
			display:""
		});
		domClass.add(this.domNode, this.srcNodeRef.className);
		if(this.fhtml.nr.d.indexOf("inline")>-1){
			domClass.add(this.domNode, "dijitInline");
		}

		try{
			this.insideNode.innerHTML = this.fhtml.cn;
		}catch(e){
			// You have got to be kidding me. IE does us he favor of checking that
			// we aren't inserting the improper type of content with innerHTML into
			// an inline element. Alert us with an "Unknown Runtime Error". You can't
			// MAKE this stuff up.

			if(this.uploaderType == "flash"){
			this.insideNode = this.insideNode.parentNode.removeChild(this.insideNode);
				win.body().appendChild(this.insideNode);
				this.insideNode.innerHTML = this.fhtml.cn;
				var c = connect.connect(this, "onReady", this, function(){ connect.disconnect(c);
					this.insideNode = this.insideNode.parentNode.removeChild(this.insideNode);
					this.domNode.appendChild(this.insideNode);
				});
			}else{
				this.insideNode.appendChild(document.createTextNode(this.fhtml.cn));
			}
		}
		if(this._hiddenNode){
			domStyle.set(this._hiddenNode, "display", "none");
		}
	},


	/*************************
	 *	   Public Events	 *
	 *************************/

	// The following events are inherited from _Widget and still may be connected:
	// onClick
	// onMouseUp
	// onMouseDown
	// onMouseOver
	// onMouseOut

	onChange: function(dataArray){
		// summary:
		//		stub to connect
		//		Fires when files are selected
		//		Event is an array of last files selected
	},

	onProgress: function(dataArray){
		// summary:
		//		Stub to connect
		//		Fires as progress returns from SWF
		//		Event is an array of all files uploading
		//		Can be connected to for HTML uploader,
		//		but will not return anything.
	},

	onComplete: function(dataArray){
		// summary:
		//		stub to connect
		//		Fires when all files have uploaded
		//		Event is an array of all files
	},

	onCancel: function(){
		// summary:
		//		Stub to connect
		//		Fires when dialog box has been closed
		//		without a file selection
	},

	onError: function(/*Object or String*/ evtObject){
		// summary:
		//		Fires on errors

		// FIXME: Unsure of a standard form for receiving errors
	},

	onReady: function(/*dojox.form.FileUploader*/ uploader){
		// summary:
		//		Stub - Fired when embedFlash has created the
		//		Flash object, but it has not necessarilly finished
		//		downloading, and is ready to be communicated with.
	},

	onLoad: function(/*dojox.form.FileUploader*/ uploader){
		// summary:
		//		Stub - SWF has been downloaded 100%.
	},

	/*************************
	 *	   Public Methods	 *
	 *************************/
	submit: function(/*form node ?*/ form){
		// summary:
		//		If FileUploader is in a form, and other data should be sent
		//		along with the files, use this instead of form submit.

		var data = form ? domForm.toObject(form) : null;
		this.upload(data);
		return false; // Boolean
	},
	upload: function(/*Object ? */ data){
		// summary:
		//		When called, begins file upload
		// data: Object
		//		postData to be sent to server

		if(!this.fileList.length){
			return false;
		}
		if(!this.uploadUrl){
			console.warn("uploadUrl not provided. Aborting.");
			return false;
		}
		if(!this.showProgress){
			this.set("disabled", true);
		}

		if(this.progressWidgetId){

			var node = manager.byId(this.progressWidgetId).domNode;
			if(domStyle.get(node, "display") == "none"){
				this.restoreProgDisplay = "none";
				domStyle.set(node, "display", "block");
			}
			if(domStyle.get(node, "visibility") == "hidden"){
				this.restoreProgDisplay = "hidden";
				domStyle.set(node, "visibility", "visible");
			}
		}

		if(data && !data.target){
			this.postData = data;
		}
		this.log("upload type:", this.uploaderType, " - postData:", this.postData);

		for(var i = 0; i < this.fileList.length; i++){
			var f = this.fileList[i];
			f.bytesLoaded = 0;
			f.bytesTotal = f.size || 100000;
			f.percent = 0;
		}
		if(this.uploaderType == "flash"){
			this.uploadFlash();
		}else{
			this.uploadHTML();
		}
		// prevent form submit
		return false;
	},
	removeFile: function(/*String*/ name, /*Boolean*/ noListEdit){
		// summary:
		//		Removes a file from the pending file list.
		//		Removes pending data from the Flash movie
		//		and fileInputes from the HTML uploader.
		//		If a file container node is bound, the file
		//		will also be removed.
		// name: String
		//		The name of the file to be removed. Typically the file name,
		//		such as: picture01.png
		// noListEdit: Boolean
		//		Internal. If true don't remove files from list.

		var i;
		for(i = 0; i < this.fileList.length; i++){
			if(this.fileList[i].name == name){
				if(!noListEdit){ // if onComplete, don't do this
					this.fileList.splice(i,1);
				}
				break;
			}
		}
		if(this.uploaderType == "flash"){
			this.flashMovie.removeFile(name);
		}else if(!noListEdit){
			domConstruct.destroy(this.fileInputs[i]);
			this.fileInputs.splice(i,1);
			this._renumberInputs();
		}
		if(this.fileListId){
			domConstruct.destroy("file_"+name);
		}
	},

	destroy: function(){
		// summary:
		//		Destroys uploader button
		if(this.uploaderType == "flash" && !this.flashMovie){
			this._cons.push(connect.connect(this, "onLoad", this, "destroy"));
			return;
		}
		array.forEach(this._subs, connect.unsubscribe, dojo);
		array.forEach(this._cons, connect.disconnect, dojo);
		if(this.scrollConnect){
			connect.disconnect(this.scrollConnect);
		}
		if(this.uploaderType == "flash"){
			this.flashObject.destroy();
			delete this.flashObject;
		}else{
			domConstruct.destroy(this._fileInput);
			domConstruct.destroy(this._formNode);
		}
		this.inherited(arguments);
	},

	/*************************
	 *	   Private Events	 *
	 *************************/
	_displayProgress: function(/*Boolean or Number */ display){
		// summary:
		//		Shows and updates the built-in progress bar.

		if(display === true){
			if(this.uploaderType == "flash"){
				domStyle.set(this.insideNode,"top", "-2500px");
			}else{
				domStyle.set(this.insideNode,"display", "none");
			}
			domStyle.set(this.progNode,"display","");
		}else if(display === false){
			domStyle.set(this.insideNode,{
				display: "",
				top: "0"
			});
			domStyle.set(this.progNode,"display","none");
		}else{
			var w = display * this.fhtml.nr.w;
			domStyle.set(this.progNode, "width", w + "px");
		}
	},
	_animateProgress: function(){
		// summary:
		//		Internal. Animated the built-in progress bar
		this._displayProgress(true);
		var _uploadDone = false;
		var c = connect.connect(this, "_complete", function(){
			connect.disconnect(c);
			_uploadDone = true;
		});
		var w = 0;
		var interval = setInterval(lang.hitch(this, function(){
			w+=5;
			if(w>this.fhtml.nr.w){
				w = 0;
				_uploadDone = true;
			}
			this._displayProgress(w/this.fhtml.nr.w);

			if(_uploadDone){
				clearInterval(interval);
				setTimeout(lang.hitch(this, function(){
					this._displayProgress(false);
				}), 500);
			}

		}),50);
	},

	_error: function(evt){
		//var type = evtObject.type ? evtObject.type.toUpperCase() : "ERROR";
		//var msg = evtObject.msg ? evtObject.msg : evtObject;
		if(typeof(evt)=="string"){
			evt = new Error(evt);
		}
		this.onError(evt);
	},

	_addToFileList: function(){
		// summary:
		//		Internal only. If there is a file list, adds a file to it.
		//		If you need to use a function such as this, connect to
		//		onChange and update outside of this widget.

		if(this.fileListId){
			var str = '';
			array.forEach(this.fileList, function(d){
				// have to use tables because of IE. Grumble.
				str += '<table id="file_'+d.name+'" class="fileToUpload"><tr><td class="fileToUploadClose"></td><td class="fileToUploadName">'+d.name+'</td><td class="fileToUploadSize">'+(d.size ? Math.ceil(d.size*.001) +"kb" : "")+'</td></tr></table>'
			}, this);
			dom.byId(this.fileListId).innerHTML = str;
		}
	},

	_change: function(dataArray){
		// summary:
		//		Internal. Updates uploader selection
		if(has("ie")){
			//IE6 uses the entire path in the name, which isn't terrible, but much different
			// than everything else
			array.forEach(dataArray, function(f){
				f.name = f.name.split("\\")[f.name.split("\\").length-1];
			});
		}
		if(this.selectMultipleFiles){
			this.fileList = this.fileList.concat(dataArray);
		}else{
			if(this.fileList[0]){
				this.removeFile(this.fileList[0].name, true);
			}
			this.fileList = dataArray;
		}
		this._addToFileList();
		this.onChange(dataArray);
		if(this.uploadOnChange){
			if(this.uploaderType == "html"){
				this._buildFileInput();
			}
			this.upload();
		}else if(this.uploaderType == "html" && this.selectMultipleFiles){
			this._buildFileInput();
			this._connectInput();
		}
	},

	_complete: function(dataArray){
		// summary:
		//		Internal. Handles tasks after files have finished uploading

		dataArray = lang.isArray(dataArray) ? dataArray : [dataArray];

		// Yes. Yes I do have to do three loops here. ugh.
		//
		// Check if one of the files had an error
		array.forEach(dataArray, function(f){
			if(f.ERROR){ this._error(f.ERROR); }
		}, this);

		// Have to be set them all too 100%, because
		// onProgress does not always fire
		array.forEach(this.fileList, function(f){
			f.bytesLoaded = 1;
			f.bytesTotal = 1;
			f.percent = 100;
			this._progress(f);
		}, this);
		// we're done. remove files.
		array.forEach(this.fileList, function(f){
			this.removeFile(f.name, true);
		}, this);

		this.onComplete(dataArray);

		this.fileList = [];
		this._resetHTML();
		this.set("disabled", false);


		if(this.restoreProgDisplay){
			// using timeout so prog shows on screen for at least a short time
			setTimeout(lang.hitch(this, function(){
				domStyle.set(manager.byId(this.progressWidgetId).domNode,
					this.restoreProgDisplay == "none" ? "display" : "visibility",
					this.restoreProgDisplay
				);
			}), 500);
		}

	},

	_progress: function(dataObject){
		// summary:
		//		Internal. Calculate progress
		var total = 0;
		var loaded = 0;
		for(var i = 0; i < this.fileList.length; i++){
			var f = this.fileList[i];
			if(f.name == dataObject.name){
				f.bytesLoaded = dataObject.bytesLoaded;
				f.bytesTotal = dataObject.bytesTotal;
				f.percent = Math.ceil(f.bytesLoaded / f.bytesTotal * 100);
				this.log(f.name, "percent:", f.percent)
			}
			loaded += Math.ceil(.001 * f.bytesLoaded);
			total += Math.ceil(.001 * f.bytesTotal);
		}
		var percent = Math.ceil(loaded / total * 100);
		if(this.progressWidgetId){
			manager.byId(this.progressWidgetId).update({progress:percent+"%"});
		}
		if(this.showProgress){
			this._displayProgress(percent * .01);
		}
		this.onProgress(this.fileList);

	},
	_getDisabledAttr: function(){
		// summary:
		//		Internal. To get disabled use: widget.get("disabled");
		return this._disabled;
	},

	_setDisabledAttr: function(disabled){
		// summary:
		//		Internal. To set disabled use: widget.set("disabled", true | false);
		if(this._disabled == disabled){ return; }

		if(this.uploaderType == "flash"){
			if(!this.flashReady){
				var _fc = connect.connect(this, "onLoad", this, function(){
					connect.disconnect(_fc);
					this._setDisabledAttr(disabled);
				});
				return;
			}
			this._disabled = disabled;
			this.flashMovie.doDisable(disabled);
		}else{
			this._disabled = disabled;
			domStyle.set(this._fileInput, "display", this._disabled ? "none" : "");
		}
		domClass.toggle(this.domNode, this.disabledClass, disabled);
	},

	_onFlashBlur: function(){
		// summary:
		//		Internal. Detects when Flash movies reliquishes focus.
		//		We have to find all the tabIndexes in the doc and figure
		//		out whom to give focus to next.
		this.flashMovie.blur();
		if(!this.nextFocusObject && this.tabIndex){
			var nodes = query("[tabIndex]");
			for(var i = 0; i<nodes.length; i++){
				if(nodes[i].tabIndex >= Number(this.tabIndex)+1){
					this.nextFocusObject = nodes[i];
					break;
				}
			}
		}
		this.nextFocusObject.focus();
	},
	_disconnect: function(){
		// summary:
		//		Internal. Disconnects fileInput in favor of new one.
		array.forEach(this._cons, connect.disconnect, dojo);
	},

	/*************************
	 *			HTML		 *
	 *************************/
	uploadHTML: function(){
		// summary:
		//		Internal. You could use this, but you should use upload() or submit();
		//		which can also handle the post data.

		// NOTE on deferredUploading:
		//		This is not enabled for HTML. Workaround would be to force
		//		singleFile uploads.
		// TODO:
		//		Investigate removing fileInputs and resending form
		//		multiple times adding each fileInput
		//
		if(this.selectMultipleFiles){
			domConstruct.destroy(this._fileInput);
		}
		this._setHtmlPostData();
		if(this.showProgress){
			this._animateProgress();
		}
		var dfd = ioIframe.send({
			url: this.uploadUrl.toString(),
			form: this._formNode,
			handleAs: "json",
			error: lang.hitch(this, function(err){
				this._error("HTML Upload Error:" + err.message);
			}),
			load: lang.hitch(this, function(data, ioArgs, widgetRef){
				this._complete(data);
			})
		});
	},

	createHtmlUploader: function(){
		// summary:
		//		Internal. Fires of methods to build HTML Uploader.
		this._buildForm();
		this._setFormStyle();
		this._buildFileInput();
		this._connectInput();
		this._styleContent();
		domStyle.set(this.insideNode, "visibility", "visible");
		this.onReady();
	},

	_connectInput: function(){
		// summary:
		//		Internal. HTML Uploader connections. These get disconnected
		//		after upload or if multi upload.
		this._disconnect();
		this._cons.push(connect.connect(this._fileInput, "mouseover", this, function(evt){
			domClass.add(this.domNode, this.hoverClass);
			this.onMouseOver(evt);
		}));
		this._cons.push(connect.connect(this._fileInput, "mouseout", this, function(evt){
			setTimeout(lang.hitch(this, function(){
				domClass.remove(this.domNode, this.activeClass);
				domClass.remove(this.domNode, this.hoverClass);
				this.onMouseOut(evt);
				this._checkHtmlCancel("off");
			}), 0);
		}));
		this._cons.push(connect.connect(this._fileInput, "mousedown", this, function(evt){
			domClass.add(this.domNode, this.activeClass);
			domClass.remove(this.domNode, this.hoverClass);
			this.onMouseDown(evt);
		}));
		this._cons.push(connect.connect(this._fileInput, "mouseup", this, function(evt){
			domClass.remove(this.domNode, this.activeClass);
			this.onMouseUp(evt);
			this.onClick(evt);
			this._checkHtmlCancel("up");
		}));
		this._cons.push(connect.connect(this._fileInput, "change", this, function(){
			this._checkHtmlCancel("change");
			var name = this._fileInput.value;
			if(name){
				this._change([{
					name: name,
					type: "",
					size: 0
				}]);
			}else{
				// If input's value is empty it's been cleared so we emit an empty change record
				this._change([]);
			}
			
		}));
		if(this.tabIndex>=0){
			domAttr.set(this.domNode, "tabIndex", this.tabIndex);
		}
	},

	_checkHtmlCancel: function(mouseType){
		// summary:
		//		Internal. Check if the dialog was opened and canceled without file selection.
		if(mouseType == "change"){
			this.dialogIsOpen = false;
		}
		if(mouseType == "up"){
			this.dialogIsOpen = true;
		}
		if(mouseType == "off"){
			if(this.dialogIsOpen){
				this.onCancel();
			}
			this.dialogIsOpen = false;
		}
	},

	_styleContent: function(){
		// summary:
		//		Internal.Apply style to node
		var o = this.fhtml.nr;

		domStyle.set(this.insideNode, {
			width:o.w+"px",
			height:o.va == "middle"?o.h+"px":"auto",
			textAlign:o.ta,
			paddingTop:o.p[0]+"px",
			paddingRight:o.p[1]+"px",
			paddingBottom:o.p[2]+"px",
			paddingLeft:o.p[3]+"px"
		});

		try{
			domStyle.set(this.insideNode, "lineHeight", "inherit");
		}catch(e){
			// There are certain cases where IE refuses to set lineHeight.
			// For the life of me I cannot figure out the combination of
			// styles that IE doesn't like. Steaming... Pile...
		}

	},
	_resetHTML: function(){
		// summary:
		//		Internal. After upload, this is called to clear the form and build a new
		//		fileInput.
		if(this.uploaderType == "html" && this._formNode){
			this.fileInputs = [];
			query("*", this._formNode).forEach(function(n){
				domConstruct.destroy(n);
			});
			this.fileCount = 0;
			this._buildFileInput();
			this._connectInput();
		}
	},
	_buildForm: function(){
		// summary:
		//		Build the form that holds the fileInput

		if(this._formNode){ return; }

		if(has("ie") < 9 || (has("ie") && has("quirks"))){
			this._formNode = document.createElement('<form enctype="multipart/form-data" method="post">');
			this._formNode.encoding = "multipart/form-data";
			this._formNode.id = manager.getUniqueId("FileUploaderForm"); // needed for dynamic style
			this.domNode.appendChild(this._formNode);
		}else{
			this._formNode = domConstruct.create('form', {
				enctype:"multipart/form-data",
				method:"post",
				id:manager.getUniqueId("FileUploaderForm")
			}, this.domNode);
		}
	},

	_buildFileInput: function(){
		// summary:
		//		Build the fileInput field

		if(this._fileInput){
			this._disconnect();
			// FIXME:
			//	Just hiding it which works, but we lose
			//	reference to it and can't remove it from
			//	the upload list.
			this._fileInput.id = this._fileInput.id + this.fileCount;
			domStyle.set(this._fileInput, "display", "none");
		}
		this._fileInput = document.createElement('input');
		this.fileInputs.push(this._fileInput);
		// server will need to know this variable:
		var nm = this.htmlFieldName;
		var _id = this.id;
		if(this.selectMultipleFiles){
			nm += this.fileCount;
			_id += this.fileCount;
			this.fileCount++;
		}

		domAttr.set(this._fileInput, {
			id:this.id,
			name:nm,
			type:"file"
		});

		domClass.add(this._fileInput, "dijitFileInputReal");
		this._formNode.appendChild(this._fileInput);
		var real = domGeometry.getMarginBox(this._fileInput);
		domStyle.set(this._fileInput, {
			position:"relative",
			left:(this.fhtml.nr.w - real.w) + "px",
			opacity:0
		});
	},

	_renumberInputs: function(){
		if(!this.selectMultipleFiles){ return; }
		var nm;
		this.fileCount = 0;
		array.forEach(this.fileInputs, function(inp){
			nm = this.htmlFieldName + this.fileCount;
			this.fileCount++;
			domAttr.set(inp, "name", nm);
		}, this);
	},

	_setFormStyle: function(){
		// summary:
		//		Apply a dynamic style to the form and input
		var size = Math.max(2, Math.max(Math.ceil(this.fhtml.nr.w / 60), Math.ceil(this.fhtml.nr.h / 15)));
		// Now create a style associated with the form ID
		htmlStyles.insertCssRule("#" + this._formNode.id + " input", "font-size:" + size + "em");
		domStyle.set(this.domNode, {
			overflow:"hidden",
			position:"relative"
		});
		domStyle.set(this.insideNode, "position", "absolute");
	},

	_setHtmlPostData: function(){
		// summary:
		//		Internal.Apply postData to hidden fields in form
		if(this.postData){
			for(var nm in this.postData){
				domConstruct.create("input", {
					type: "hidden",
					name: nm,
					value: this.postData[nm]
				}, this._formNode);
			}
		}
	},

	/*************************
	 *			FLASH		 *
	 *************************/
	uploadFlash: function(){
		// summary:
		//		Internal. You should use upload() or submit();
		try{
			if(this.showProgress){
				this._displayProgress(true);
				var c = connect.connect(this, "_complete", this, function(){
					connect.disconnect(c);
					this._displayProgress(false);
				});
			}

			var o = {};
			for(var nm in this.postData){
				o[nm] = this.postData[nm];
			}
			this.flashMovie.doUpload(o);

		}catch(err){
			this._error("FileUploader - Sorry, the SWF failed to initialize." + err);
		}
	},

	createFlashUploader: function(){
		// summary:
		//		Internal. Creates Flash Uploader
		this.uploadUrl = this.uploadUrl.toString();
		if(this.uploadUrl){
			if(this.uploadUrl.toLowerCase().indexOf("http")<0 && this.uploadUrl.indexOf("/")!=0){
				// Appears to be a relative path. Attempt to
				// convert it to absolute, so it will better
				// target the SWF.
				var loc = window.location.href.split("/");
				loc.pop();
				loc = loc.join("/")+"/";
				this.uploadUrl = loc+this.uploadUrl;
				this.log("SWF Fixed - Relative loc:", loc, " abs loc:", this.uploadUrl);
			}else{
				this.log("SWF URL unmodified:", this.uploadUrl)
			}
		}else{
			console.warn("Warning: no uploadUrl provided.");
		}

		var w = this.fhtml.nr.w;
		var h = this.fhtml.nr.h;

		var args = {
			expressInstall:true,
			path: this.swfPath.uri || this.swfPath,
			width: w,
			height: h,
			allowScriptAccess:"always",
			allowNetworking:"all",
			vars: {
				uploadDataFieldName: this.flashFieldName,
				uploadUrl: this.uploadUrl,
				uploadOnSelect: this.uploadOnChange,
				deferredUploading:this.deferredUploading || 0,
				selectMultipleFiles: this.selectMultipleFiles,
				id: this.id,
				isDebug: this.isDebug,
				devMode:this.devMode,
				flashButton:embedFlashVars.serialize("fh", this.fhtml),
				fileMask:embedFlashVars.serialize("fm", this.fileMask),
				noReturnCheck: this.skipServerCheck,
				serverTimeout:this.serverTimeout
			},
			params: {
				scale:"noscale",
				wmode:"opaque",
				allowScriptAccess:"always",
				allowNetworking:"all"
			}

		};

		this.flashObject = new embedFlash(args, this.insideNode);
		this.flashObject.onError = lang.hitch(function(msg){
			this._error("Flash Error: " + msg);
		});
		this.flashObject.onReady = lang.hitch(this, function(){
			domStyle.set(this.insideNode, "visibility", "visible");
			this.log("FileUploader flash object ready");
			this.onReady(this);
		});
		this.flashObject.onLoad = lang.hitch(this, function(mov){
			this.flashMovie = mov;
			this.flashReady = true;

			this.onLoad(this);
		});
		this._connectFlash();

	},

	_connectFlash: function(){
		// summary:
		//		Subscribing to published topics coming from the
		//		Flash uploader.
		//
		//		Sacrificing some readability for compactness. this.id
		//		will be on the beginning of the topic, so more than
		//		one uploader can be on a page and can have unique calls.

		this._doSub("/filesSelected", "_change");
		this._doSub("/filesUploaded", "_complete");
		this._doSub("/filesProgress", "_progress");
		this._doSub("/filesError", "_error");
		this._doSub("/filesCanceled", "onCancel");
		this._doSub("/stageBlur", "_onFlashBlur");
		this._doSub("/up", "onMouseUp");
		this._doSub("/down", "onMouseDown");
		this._doSub("/over", "onMouseOver");
		this._doSub("/out", "onMouseOut");

		this.connect(this.domNode, "focus", function(){
			// TODO: some kind of indicator that the Flash button is in focus
			this.flashMovie.focus();
			this.flashMovie.doFocus();
		});
		if(this.tabIndex>=0){
			domAttr.set(this.domNode, "tabIndex", this.tabIndex);
		}
	},

	_doSub: function(subStr, funcStr){
		// summary:
		//		Internal. Shortcut for subscribes to Flash movie
		this._subs.push(connect.subscribe(this.id + subStr, this, funcStr));
	},

	/*************************************
	 *		DOM INSPECTION METHODS		 *
	 *************************************/

	urlencode: function(url){
		// Using symbols in place of URL chars that will break in Flash serialization.
		if(!url || url == "none"){
			return false;
		}
		return url.replace(/:/g,"||").replace(/\./g,"^^").replace("url(", "").replace(")","").replace(/'/g,"").replace(/"/g,"");
	},

	isButton: function(node){
		// testing if button for styling purposes
		var tn = node.tagName.toLowerCase();
		return tn == "button" || tn == "input";
	},

	getTextStyle: function(node){
		// getting font info
		var o = {};
		o.ff = domStyle.get(node, "fontFamily");
		if(o.ff){
			o.ff = o.ff.replace(", ", ","); // remove spaces. IE in Flash no likee
			o.ff = o.ff.replace(/\"|\'/g, "");
			o.ff = o.ff == "sans-serif" ? "Arial" : o.ff; // Flash doesn't know what sans-serif is
			o.fw = domStyle.get(node, "fontWeight");
			o.fi = domStyle.get(node, "fontStyle");
			o.fs = parseInt(domStyle.get(node, "fontSize"), 10);
			if(domStyle.get(node, "fontSize").indexOf("%") > -1){
				// IE doesn't convert % to px. For god sakes.
				var n = node;
				while(n.tagName){
					if(domStyle.get(n, "fontSize").indexOf("%") == -1){
						o.fs = parseInt(domStyle.get(n, "fontSize"), 10);
						break;
					}
					if(n.tagName.toLowerCase()=="body"){
						// if everyting is %, the the font size is 16px * the %
						o.fs = 16 * .01 * parseInt(domStyle.get(n, "fontSize"), 10);
					}
					n = n.parentNode;
				}
			}
			o.fc = new Color(domStyle.get(node, "color")).toHex();
			o.fc = parseInt(o.fc.substring(1,Infinity),16);
		}
		o.lh = domStyle.get(node, "lineHeight");
		o.ta = domStyle.get(node, "textAlign");
		o.ta = o.ta == "start" || !o.ta ? "left" : o.ta;
		o.va = this.isButton(node) ? "middle" : o.lh == o.h ? "middle" : domStyle.get(node, "verticalAlign");
		return o;
	},

	getText: function(node){
		// Get the text of the button. It's possible to use HTML in the Flash Button,
		// but the results are not spectacular.
		var cn = lang.trim(node.innerHTML);
		if(cn.indexOf("<") >- 1){
			cn = escape(cn);
		}
		return cn;
	},

	getStyle: function(node){
		// getting the style of a node. Using very abbreviated characters which the
		// Flash movie understands.
		var o = {};
		var dim = domGeometry.getContentBox(node);
		var pad = domGeometry.getPadExtents(node);
		o.p = [pad.t, pad.w-pad.l, pad.h-pad.t, pad.l];
		o.w = dim.w + pad.w;
		o.h = dim.h + pad.h;
		o.d = domStyle.get(node, "display");
		var clr = new Color(domStyle.get(node, "backgroundColor"));
		// if no color, Safari sets #000000 and alpha=0 since we don't support alpha,
		// it makes black - make it white
		o.bc = clr.a == 0 ? "#ffffff" : clr.toHex();
		o.bc = parseInt(o.bc.substring(1,Infinity),16);
		var url = this.urlencode(domStyle.get(node, "backgroundImage"));
		if(url){
			o.bi = {
				url:url,
				rp:domStyle.get(node, "backgroundRepeat"),
				pos: escape(domStyle.get(node, "backgroundPosition"))
			};
			if(!o.bi.pos){
				// IE does Xpx and Ypx, not "X% Y%"
				var rx = domStyle.get(node, "backgroundPositionX");
				var ry = domStyle.get(node, "backgroundPositionY");
				rx = (rx == "left") ? "0%" : (rx == "right") ? "100%" : rx;
				ry = (ry == "top") ? "0%" : (ry == "bottom") ? "100%" : ry;
				o.bi.pos = escape(rx+" "+ry);
			}
		}
		return lang.mixin(o, this.getTextStyle(node));
	},

	getTempNodeStyle: function(node, _class, isDijitButton){
		// This sets up a temp node to get the style of the hover, active, and disabled states
		var temp, style;
		if(isDijitButton){
			// backwards compat until dojo 1.5
			temp = domConstruct.place("<"+node.tagName+"><span>"+node.innerHTML+"</span></"+node.tagName+">", node.parentNode); //+" "+_class+"
			var first = temp.firstChild;
			domClass.add(first, node.className);
			domClass.add(temp, _class);
			style = this.getStyle(first);
		}else{
			temp = domConstruct.place("<"+node.tagName+">"+node.innerHTML+"</"+node.tagName+">", node.parentNode);
			domClass.add(temp, node.className);
			domClass.add(temp, _class);
			temp.id = node.id;
			style = this.getStyle(temp);
		}
		// dev note: comment out this line to see what the
		// button states look like to the FileUploader
		domConstruct.destroy(temp);
		return style;
	}
});

});

},
'dojo/io/iframe':function(){
define([
	"../_base/config", "../_base/json", "../_base/kernel", /*===== "../_base/declare", =====*/ "../_base/lang",
	"../_base/xhr", "../sniff", "../_base/window",
	"../dom", "../dom-construct", "../query", "require", "../aspect", "../request/iframe"
], function(config, json, kernel, /*===== declare, =====*/ lang, xhr, has, win, dom, domConstruct, query, require, aspect, _iframe){

// module:
//		dojo/io/iframe

kernel.deprecated("dojo/io/iframe", "Use dojo/request/iframe.", "2.0");

/*=====
var __ioArgs = declare(kernel.__IoArgs, {
	// method: String?
	//		The HTTP method to use. "GET" or "POST" are the only supported
	//		values.  It will try to read the value from the form node's
	//		method, then try this argument. If neither one exists, then it
	//		defaults to POST.
	// handleAs: String?
	//		Specifies what format the result data should be given to the
	//		load/handle callback. Valid values are: text, html, xml, json,
	//		javascript. IMPORTANT: For all values EXCEPT html and xml, The
	//		server response should be an HTML file with a textarea element.
	//		The response data should be inside the textarea element. Using an
	//		HTML document the only reliable, cross-browser way this
	//		transport can know when the response has loaded. For the html
	//		handleAs value, just return a normal HTML document.  NOTE: xml
	//		is now supported with this transport (as of 1.1+); a known issue
	//		is if the XML document in question is malformed, Internet Explorer
	//		will throw an uncatchable error.
	// content: Object?
	//		If "form" is one of the other args properties, then the content
	//		object properties become hidden form form elements. For
	//		instance, a content object of {name1 : "value1"} is converted
	//		to a hidden form element with a name of "name1" and a value of
	//		"value1". If there is not a "form" property, then the content
	//		object is converted into a name=value&name=value string, by
	//		using xhr.objectToQuery().
});
=====*/

/*=====
return kernel.io.iframe = {
	// summary:
	//		Deprecated, use dojo/request/iframe instead.
	//		Sends an Ajax I/O call using and Iframe (for instance, to upload files)

	create: function(fname, onloadstr, uri){
		// summary:
		//		Creates a hidden iframe in the page. Used mostly for IO
		//		transports.  You do not need to call this to start a
		//		dojo/io/iframe request. Just call send().
		// fname: String
		//		The name of the iframe. Used for the name attribute on the
		//		iframe.
		// onloadstr: String
		//		A string of JavaScript that will be executed when the content
		//		in the iframe loads.
		// uri: String
		//		The value of the src attribute on the iframe element. If a
		//		value is not given, then dojo/resources/blank.html will be
		//		used.
	},
	setSrc: function(iframe, src, replace){
		// summary:
		//		Sets the URL that is loaded in an IFrame. The replace parameter
		//		indicates whether location.replace() should be used when
		//		changing the location of the iframe.
	},
	doc: function(iframeNode){
		// summary:
		//		Returns the document object associated with the iframe DOM Node argument.
	}
};
=====*/


var mid = _iframe._iframeName;
mid = mid.substring(0, mid.lastIndexOf('_'));

var iframe = lang.delegate(_iframe, {
	// summary:
	//		Deprecated, use dojo/request/iframe instead.
	//		Sends an Ajax I/O call using and Iframe (for instance, to upload files)

	create: function(){
		return iframe._frame = _iframe.create.apply(_iframe, arguments);
	},

	// cover up delegated methods
	get: null,
	post: null,

	send: function(/*__ioArgs*/args){
		// summary:
		//		Function that sends the request to the server.
		//		This transport can only process one send() request at a time, so if send() is called
		//		multiple times, it will queue up the calls and only process one at a time.
		var rDfd;

		//Set up the deferred.
		var dfd = xhr._ioSetArgs(args,
			function(/*Deferred*/dfd){
				// summary:
				//		canceller function for xhr._ioSetArgs call.
				rDfd && rDfd.cancel();
			},
			function(/*Deferred*/dfd){
				// summary:
				//		okHandler function for xhr._ioSetArgs call.
				var value = null,
					ioArgs = dfd.ioArgs;
				try{
					var handleAs = ioArgs.handleAs;

					//Assign correct value based on handleAs value.
					if(handleAs === "xml" || handleAs === "html"){
						value = rDfd.response.data;
					}else{
						value = rDfd.response.text;
						if(handleAs === "json"){
							value = json.fromJson(value);
						}else if(handleAs === "javascript"){
							value = kernel.eval(value);
						}
					}
				}catch(e){
					value = e;
				}
				return value;
			},
			function(/*Error*/error, /*Deferred*/dfd){
				// summary:
				//		errHandler function for xhr._ioSetArgs call.
				dfd.ioArgs._hasError = true;
				return error;
			}
		);

		var ioArgs = dfd.ioArgs;

		var method = "GET",
			form = dom.byId(args.form);
		if(args.method && args.method.toUpperCase() === "POST" && form){
			method = "POST";
		}

		var options = {
			method: method,
			handleAs: args.handleAs === "json" || args.handleAs === "javascript" ? "text" : args.handleAs,
			form: args.form,
			query: form ? null : args.content,
			data: form ? args.content : null,
			timeout: args.timeout,
			ioArgs: ioArgs
		};

		if(options.method){
			options.method = options.method.toUpperCase();
		}

		if(config.ioPublish && kernel.publish && ioArgs.args.ioPublish !== false){
			var start = aspect.after(_iframe, "_notifyStart", function(data){
				if(data.options.ioArgs === ioArgs){
					start.remove();
					xhr._ioNotifyStart(dfd);
				}
			}, true);
		}
		rDfd = _iframe(ioArgs.url, options, true);

		ioArgs._callNext = rDfd._callNext;

		rDfd.then(function(){
			dfd.resolve(dfd);
		}).otherwise(function(error){
			dfd.ioArgs.error = error;
			dfd.reject(error);
		});

		return dfd;
	},

	_iframeOnload: win.global[mid + '_onload']
});

lang.setObject("dojo.io.iframe", iframe);

return iframe;
});

},
'dojox/embed/Flash':function(){
define([
	"dojo/_base/lang",
	"dojo/_base/unload",
	"dojo/_base/array",
	"dojo/query",
	"dojo/has",
	"dojo/dom",
	"dojo/on",
	"dojo/window",
	"dojo/string"
], function(lang,unload,array,query,has,dom,on,win,stringUtil) {

	// module:
	//		dojox/embed/Flash
	// summary:
	//		Base functionality to insert a flash movie into
	//		a document on the fly.
	// example:
	//	|	var movie=new Flash({ args }, containerNode);


	var fMarkup, fVersion;
	var minimumVersion = 9; // anything below this will throw an error (may overwrite)
	var keyBase = "dojox-embed-flash-", keyCount=0;
	var _baseKwArgs = {
		expressInstall: false,
		width: 320,
		height: 240,
		swLiveConnect: "true",
		allowScriptAccess: "sameDomain",
		allowNetworking:"all",
		style: null,
		redirect: null
	};

	function prep(kwArgs){
		kwArgs = lang.delegate(_baseKwArgs, kwArgs);

		if(!("path" in kwArgs)){
			console.error("dojox.embed.Flash(ctor):: no path reference to a Flash movie was provided.");
			return null;
		}

		if(!("id" in kwArgs)){
			kwArgs.id = (keyBase + keyCount++);
		}
		return kwArgs;
	}

	if(has('ie')) {
		fMarkup = function(kwArgs){
			kwArgs = prep(kwArgs);
			if(!kwArgs){ return null; }

			var p;
			var path = kwArgs.path;
			if(kwArgs.vars){
				var a = [];
				for(p in kwArgs.vars){
					a.push(encodeURIComponent(p) + '=' + encodeURIComponent(kwArgs.vars[p]));
				}
				kwArgs.params.FlashVars = a.join("&");
				delete kwArgs.vars;
			}
			var s = '<object id="' + stringUtil.escape(String(kwArgs.id)) + '" '
				+ 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '
				+ 'width="' + stringUtil.escape(String(kwArgs.width)) + '" '
				+ 'height="' + stringUtil.escape(String(kwArgs.height)) + '"'
				+ ((kwArgs.style)?' style="' + stringUtil.escape(String(kwArgs.style)) + '"':'')
				+ '>'
				+ '<param name="movie" value="' + stringUtil.escape(String(path)) + '" />';
			if(kwArgs.params){
				for(p in kwArgs.params){
					s += '<param name="' + stringUtil.escape(p) + '" value="' + stringUtil.escape(String(kwArgs.params[p])) + '" />';
				}
			}
			s += '</object>';
			return { id: kwArgs.id, markup: s };
		};

		fVersion = (function(){
			var testVersion = 10, testObj = null;
			while(!testObj && testVersion > 7){
				try {
					testObj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + testVersion--);
				}catch(e){ }
			}
			if(testObj){
				var v = testObj.GetVariable("$version").split(" ")[1].split(",");
				return {
					major: (v[0]!=null) ? parseInt(v[0]) : 0,
					minor: (v[1]!=null) ? parseInt(v[1]) : 0,
					rev: (v[2]!=null) ? parseInt(v[2]) : 0
				};
			}
			return { major: 0, minor: 0, rev: 0 };
		})();

		//	attach some cleanup for IE, thanks to deconcept :)
		unload.addOnWindowUnload(function(){
			console.warn('***************UNLOAD');
			var dummy = function(){};
			var objs = query("object").
				reverse().
				style("display", "none").
				forEach(function(i){
					for(var p in i){
						if((p != "FlashVars") && typeof i[p] == "function"){
							try{
								i[p] = dummy;
							}catch(e){}
						}
					}
				});
		});

	} else {
		//	*** Sane browsers branch ******************************************************************
		fMarkup = function(kwArgs){
			kwArgs = prep(kwArgs);
			if(!kwArgs){ return null; }

			var p;
			var path = kwArgs.path;
			if(kwArgs.vars){
				var a = [];
				for(p in kwArgs.vars){
					a.push(encodeURIComponent(p) + '=' + encodeURIComponent(kwArgs.vars[p]));
				}
				kwArgs.params.flashVars = a.join("&");
				delete kwArgs.vars;
			}
			var s = '<embed type="application/x-shockwave-flash" '
				+ 'src="' + stringUtil.escape(String(path)) + '" '
				+ 'id="' + stringUtil.escape(String(kwArgs.id)) + '" '
				+ 'width="' + stringUtil.escape(String(kwArgs.width)) + '" '
				+ 'height="' + stringUtil.escape(String(kwArgs.height)) + '"'
				+ ((kwArgs.style)?' style="' + stringUtil.escape(String(kwArgs.style)) + '" ':'')

				+ 'pluginspage="' + window.location.protocol + '//www.adobe.com/go/getflashplayer" ';
			if(kwArgs.params){
				for(p in kwArgs.params){
					s += ' ' + stringUtil.escape(p) + '="' + stringUtil.escape(String(kwArgs.params[p])) + '"';
				}
			}
			s += ' />';
			return { id: kwArgs.id, markup: s };
		};

		fVersion=(function(){
			var plugin = navigator.plugins["Shockwave Flash"];
			if(plugin && plugin.description){
				var v = plugin.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
				return {
					major: (v[0]!=null) ? parseInt(v[0]) : 0,
					minor: (v[1]!=null) ? parseInt(v[1]) : 0,
					rev: (v[2]!=null) ? parseInt(v[2]) : 0
				};
			}
			return { major: 0, minor: 0, rev: 0 };
		})();
	}


/*=====
var __flashArgs = {
	// path: String
	//		The URL of the movie to embed.
	// id: String?
	//		A unique key that will be used as the id of the created markup.  If you don't
	//		provide this, a unique key will be generated.
	// width: Number?
	//		The width of the embedded movie; the default value is 320px.
	// height: Number?
	//		The height of the embedded movie; the default value is 240px
	// minimumVersion: Number?
	//		The minimum targeted version of the Flash Player (defaults to 9)
	// style: String?
	//		Any CSS style information (i.e. style="background-color:transparent") you want
	//		to define on the markup.
	// params: Object?
	//		A set of key/value pairs that you want to define in the resultant markup.
	// vars: Object?
	//		A set of key/value pairs that the Flash movie will interpret as FlashVars.
	// expressInstall: Boolean?
	//		Whether or not to include any kind of expressInstall info. Default is false.
	// redirect: String?
	//		A url to redirect the browser to if the current Flash version is not supported.
};
=====*/

	//	the main entry point
	var Flash = function(/*__flashArgs*/ kwArgs, /*DOMNode*/ node){
		// summary:
		//		Create a wrapper object around a Flash movie; this is the DojoX equivilent
		//		to SWFObject.
		//
		// description:
		//		Creates a wrapper object around a Flash movie.  Wrapper object will
		//		insert the movie reference in node; when the browser first starts
		//		grabbing the movie, onReady will be fired; when the movie has finished
		//		loading, it will fire onLoad.
		//
		//		If your movie uses ExternalInterface, you should use the onLoad event
		//		to do any kind of proxy setup (see dojox.embed.Flash.proxy); this seems
		//		to be the only consistent time calling EI methods are stable (since the
		//		Flash movie will shoot several methods into the window object before
		//		EI callbacks can be used properly).
		//
		// kwArgs: __flashArgs
		//		The various arguments that will be used to help define the Flash movie.
		// node: DomNode
		//		The node where the embed object will be placed
		//
		// example:
		//		Embed a flash movie in a document using the new operator, and get a reference to it.
		//	|	var movie = new dojox.embed.Flash({
		//	|		path: "path/to/my/movie.swf",
		//	|		width: 400,
		//	|		height: 300
		//	|	}, myWrapperNode, "testLoaded");
		//
		// example:
		//		Embed a flash movie in a document without using the new operator.
		//	|	var movie = dojox.embed.Flash({
		//	|		path: "path/to/my/movie.swf",
		//	|		width: 400,
		//	|		height: 300,
		//	|		style: "position:absolute;top:0;left:0"
		//	|	}, myWrapperNode, "testLoaded");

		// File can only be run from a server, due to SWF dependency.
		if(location.href.toLowerCase().indexOf("file://")>-1){
			throw new Error("dojox.embed.Flash can't be run directly from a file. To instatiate the required SWF correctly it must be run from a server, like localHost.");
		}

		// available: Number
		//		If there is a flash player available, and if so what version.
		this.available = fVersion.major;

		// minimumVersion: Number
		//		The minimum version of Flash required to run this movie.
		this.minimumVersion = kwArgs.minimumVersion || minimumVersion;

		// id: String
		//		The id of the DOMNode to be used for this movie.  Can be used with dojo.byId to get a reference.
		this.id = null;

		// movie: FlashObject
		//		A reference to the movie itself.
		this.movie = null;

		// domNode: DOMNode
		//		A reference to the DOMNode that contains this movie.
		this.domNode = null;
		if(node){
			node = dom.byId(node);
		}
		// setTimeout Fixes #8743 - creating double SWFs
		// also allows time for code to attach to onError
		setTimeout(lang.hitch(this, function(){
			if(kwArgs.expressInstall || this.available && this.available >= this.minimumVersion){
				if(kwArgs && node){
					this.init(kwArgs, node);
				}else{
					this.onError("embed.Flash was not provided with the proper arguments.");
				}
			}else{
				if(!this.available){
					this.onError("Flash is not installed.");
				}else{
					this.onError("Flash version detected: "+this.available+" is out of date. Minimum required: "+this.minimumVersion);
				}
			}
		}), 100);
	};

	lang.extend(Flash, {
		onReady: function(/*HTMLObject*/ movie){
			// summary:
			//		Stub function for you to attach to when the movie reference is first
			//		pushed into the document.
		},
		onLoad: function(/*HTMLObject*/ movie){
			// summary:
			//		Stub function for you to attach to when the movie has finished downloading
			//		and is ready to be manipulated.
		},
		onError: function(msg){

		},
		_onload: function(){
			// summary:
			//	Internal. Cleans up before calling onLoad.
			clearInterval(this._poller);
			delete this._poller;
			delete this._pollCount;
			delete this._pollMax;
			this.onLoad(this.movie);
		},
		init: function(/*__flashArgs*/ kwArgs, /*DOMNode?*/ node){
			// summary:
			//		Initialize (i.e. place and load) the movie based on kwArgs.
			this.destroy();		//	ensure we are clean first.
			node = dom.byId(node || this.domNode);
			if(!node){ throw new Error("dojox.embed.Flash: no domNode reference has been passed."); }

			// vars to help determine load status
			var p = 0, testLoaded=false;
			this._poller = null; this._pollCount = 0; this._pollMax = 15; this.pollTime = 100;

			if(Flash.initialized){

				this.id = Flash.place(kwArgs, node);
				this.domNode = node;

				setTimeout(lang.hitch(this, function(){
					this.movie = this.byId(this.id, kwArgs.doc);
					this.onReady(this.movie);

					this._poller = setInterval(lang.hitch(this, function(){

						// catch errors if not quite ready.
						try{
							p = this.movie.PercentLoaded();
						}catch(e){
							console.warn("this.movie.PercentLoaded() failed", e, this.movie);
						}

						if(p == 100){
							// if percent = 100, movie is fully loaded and we're communicating
							this._onload();

						}else if(p==0 && this._pollCount++ > this._pollMax){
							// after several attempts, we're not past zero.
							clearInterval(this._poller);
							throw new Error("Building SWF failed.");
						}
					}), this.pollTime);
				}), 1);
			}
		},
		_destroy: function(){
			// summary:
			//		Kill the movie and reset all the properties of this object.
			try{
				this.domNode.removeChild(this.movie);
			}catch(e){}
			this.id = this.movie = this.domNode = null;
		},
		destroy: function(){
			// summary:
			//		Public interface for destroying all the properties in this object.
			//		Will also clean all proxied methods.
			if(!this.movie){ return; }

			//	remove any proxy functions
			var test = lang.delegate({
				id: true,
				movie: true,
				domNode: true,
				onReady: true,
				onLoad: true
			});
			for(var p in this){
				if(!test[p]){
					delete this[p];
				}
			}

			//	poll the movie
			if(this._poller){
				//	wait until onLoad to destroy
				on(this, "Load", this, "_destroy");
			} else {
				this._destroy();
			}
		},
		byId: function (movieName, doc){
			// summary:
			//		Gets Flash movie by id.
			// description:
			//		Probably includes methods for outdated
			//		browsers, but this should catch all cases.
			// movieName: String
			//		The name of the SWF
			// doc: Object
			//		The document, if not current window
			//		(not fully supported)
			// example:
			//	|	var movie = dojox.embed.Flash.byId("myId");

			doc = doc || document;
			if(doc.embeds[movieName]){
				return doc.embeds[movieName];
			}
			if(doc[movieName]){
				return doc[movieName];
			}
			if(window[movieName]){
				return window[movieName];
			}
			if(document[movieName]){
				return document[movieName];
			}
			return null;
		}
	});

	//	expose information through the constructor function itself.
	lang.mixin(Flash, {
		// summary:
		//		A singleton object used internally to get information
		//		about the Flash player available in a browser, and
		//		as the factory for generating and placing markup in a
		//		document.
		//
		// minSupported: Number
		//		The minimum supported version of the Flash Player, defaults to 8.
		// available: Number
		//		Used as both a detection (i.e. if(dojox.embed.Flash.available){ })
		//		and as a variable holding the major version of the player installed.
		// supported: Boolean
		//		Whether or not the Flash Player installed is supported by dojox.embed.
		// version: Object
		//		The version of the installed Flash Player; takes the form of
		//		{ major, minor, rev }.  To get the major version, you'd do this:
		//		var v=dojox.embed.Flash.version.major;
		// initialized: Boolean
		//		Whether or not the Flash engine is available for use.
		// onInitialize: Function
		//		A stub you can connect to if you are looking to fire code when the
		//		engine becomes available.  A note: DO NOT use this event to
		//		place a movie in a document; it will usually fire before DOMContentLoaded
		//		is fired, and you will get an error.  Use dojo.addOnLoad instead.
		minSupported : 8,
		available: fVersion.major,
		supported: (fVersion.major >= fVersion.required),
		minimumRequired: fVersion.required,
		version: fVersion,
		initialized: false,
		onInitialize: function(){
			Flash.initialized = true;
		},
		__ie_markup__: function(kwArgs){
			return fMarkup(kwArgs);
		},
		proxy: function(/*Flash*/ obj, /*Array|String*/ methods){
			// summary:
			//		Create the set of passed methods on the Flash object
			//		so that you can call that object directly, as opposed to having to
			//		delve into the internal movie to do this.  Intended to make working
			//		with Flash movies that use ExternalInterface much easier to use.
			//
			// example:
			//		Create "setMessage" and "getMessage" methods on foo.
			//	|	var foo = new Flash(args, someNode);
			//	|	dojo.connect(foo, "onLoad", lang.hitch(foo, function(){
			//	|		Flash.proxy(this, [ "setMessage", "getMessage" ]);
			//	|		this.setMessage("Flash.proxy is pretty cool...");
			//	|		console.log(this.getMessage());
			//	|	}));
			array.forEach((methods instanceof Array ? methods : [ methods ]), function(item){
				this[item] = lang.hitch(this, function(){
					return (function(){
						return eval(this.movie.CallFunction(
							'<invoke name="' + item + '" returntype="javascript">'
							+ '<arguments>'
							+ array.map(arguments, function(item){
								// FIXME:
								//		investigate if __flash__toXML will
								//		accept direct application via map()
								//		(e.g., does it ignore args past the
								//		first? or does it blow up?)
								return __flash__toXML(item);
							}).join("")
							+ '</arguments>'
							+ '</invoke>'
						));
					}).apply(this, arguments||[]);
				});
			}, obj);
		}
	});

	Flash.place = function(kwArgs, node){
		var o = fMarkup(kwArgs);
		node = dom.byId(node);
		if(!node){
			node = win.doc.createElement("div");
			node.id = o.id+"-container";
			win.body().appendChild(node);
		}
		if(o){
			node.innerHTML = o.markup;
			return o.id;
		}
		return null;
	}
	Flash.onInitialize();

	lang.setObject("dojox.embed.Flash", Flash);

	return Flash;
});

},
'dojox/embed/flashVars':function(){
define(["dojo"], function(dojo){

dojo.deprecated("dojox.embed.flashVars", "Will be removed in 2.0", "2.0");

var flashVars = {
	// summary:
	//		Handles flashvar serialization
	//		Converting complex objects into a simple, clear string that can be appended
	//		to the swf as a query: myMovie.swf?flashvars=foo.
	//		Note this needs to work with the SWF, which must know what variables to expect.
	//		Therefore this is something of an "internal" class - unless you know how to
	//		modify or create SWFs.
	//
	// description:
	//		JSON could be done, but Deft does not yet have a JSON parser, and quotes are
	//		very problematic since Flash cannot use eval(); JSON parsing was successful
	//		when it was fully escaped, but that made it very large anyway. flashvar
	//		serialization at most is 200% larger than JSON.
	//
	// See:
	//		Deft/common/flashVars.as
	//
	serialize: function(/* String */n, /*Object*/o){
		// summary:
		//		Key method. Serializes an object.
		// n: String
		//		The name for the object, such as: "button"
		// o: Object
		//		The object to serialize

		var esc = function(val){
			//	have to encode certain characters that indicate an object
			if(typeof val=="string"){
				val = val.replace(/;/g,"_sc_");
				val = val.replace(/\./g,"_pr_");
				val = val.replace(/\:/g,"_cl_");
				//val = escape(val);
			}
			return val;
		};
		var df = dojox.embed.flashVars.serialize;
		var txt = "";
		if(dojo.isArray(o)){
			for(var i=0;i<o.length;i++){
				txt += df(n+"."+i, esc(o[i]))+";";
			}
			return txt.replace(/;{2,}/g,";");
		}else if(dojo.isObject(o)){
			for(var nm in o){
				txt += df(n+"."+nm, esc(o[nm]))+";";
			}
			return txt.replace(/;{2,}/g,";");
		}
		// Dev note: important that there is no double semi-colons
		return n+":"+o; // String
	}
};

dojo.setObject("dojox.embed.flashVars", flashVars);

return flashVars;
});

},
'dojox/html/styles':function(){
define(["dojo/_base/lang", "dojo/_base/array", "dojo/_base/window", "dojo/_base/sniff"], 
	function(lang, ArrayUtil, Window, has) {
	// summary:
	//		Methods for creating and manipulating dynamic CSS Styles and Style Sheets
	// example:
	//	|		dojox.html.createStyle("#myDiv input", "font-size:24px");
	//		Creates Style #myDiv input, which can now be applied to myDiv, and
	//		the inner input will be targeted
	//	|		dojox.html.createStyle(".myStyle", "color:#FF0000");
	//		Now the class myStyle can be assigned to a node's className

	var dh = lang.getObject("dojox.html", true);
	var dynamicStyleMap = {};
	var pageStyleSheets = {};
	var titledSheets = [];

	dh.insertCssRule = function(/*String*/selector, /*String*/declaration, /*String?*/styleSheetName){
		// summary:
		//		Creates a style and attaches it to a dynamically created stylesheet
		// selector:
		//		A fully qualified class name, as it would appear in
		//		a CSS dojo.doc. Start classes with periods, target
		//		nodes with '#'. Large selectors can also be created
		//		like:
		// |	 "#myDiv.myClass span input"
		// declaration:
		//		A single string that would make up a style block, not
		//		including the curly braces. Include semi-colons between
		//		statements. Do not use JavaScript style declarations
		//		in camel case, use as you would in a CSS dojo.doc:
		//		| "color:#ffoooo;font-size:12px;margin-left:5px;"
		// styleSheetName:
		//		Name of the dynamic style sheet this rule should be
		//		inserted into. If is not found by that name, it is
		//		created. If no name is passed, the name "default" is
		//		used.

		var ss = dh.getDynamicStyleSheet(styleSheetName);
		var styleText = selector + " {" + declaration + "}";
		console.log("insertRule:", styleText);
		if(has("ie")){
			// Note: check for if(ss.cssText) does not work
			ss.cssText+=styleText;
			console.log("ss.cssText:", ss.cssText);
		}else if(ss.sheet){
			ss.sheet.insertRule(styleText, ss._indicies.length);
		}else{
			ss.appendChild(Window.doc.createTextNode(styleText));
		}
		ss._indicies.push(selector+" "+declaration);
		return selector; // String
	};

	dh.removeCssRule = function(/*String*/selector, /*String*/declaration, /*String*/styleSheetName){
		// summary:
		//		Removes a cssRule base on the selector and declaration passed
		//		The declaration is needed for cases of dupe selectors
		// description: Only removes DYNAMICALLY created cssRules. If you
		//		created it with dh.insertCssRule, it can be removed.

		var ss;
		var index=-1;
		var nm;
		var i;
		for(nm in dynamicStyleMap){
			if(styleSheetName && styleSheetName !== nm) {continue;}
			ss = dynamicStyleMap[nm];
			for(i=0;i<ss._indicies.length;i++){
				if(selector+" "+declaration === ss._indicies[i]){
					index = i;
					break;
				}
			}
			if(index>-1) { break; }
		}
		if(!ss){
			console.warn("No dynamic style sheet has been created from which to remove a rule.");
			return false;
		}
		if(index===-1){
			console.warn("The css rule was not found and could not be removed.");
			return false;
		}
		ss._indicies.splice(index, 1);
		if(has("ie")){
			// Note: check for if(ss.removeRule) does not work
			ss.removeRule(index);
		}else if(ss.sheet){
			ss.sheet.deleteRule(index);
		}
		return true; //Boolean
	};

	dh.modifyCssRule = function(selector, declaration, styleSheetName){
		// summary:
		//		Not implemented - it seems to have some merit for changing some complex
		//		selectors. It's not much use for changing simple ones like "span".
		//		For now, simply write a new rule which will cascade over the first.
		//
		//		Modifies an existing cssRule
	};

	dh.getStyleSheet = function(/*String?*/styleSheetName){
		// summary:
		//		Returns a style sheet based on the argument.
		//		Searches dynamic style sheets first. If no matches,
		//		searches document style sheets.
		// styleSheetName:
		//		A title or an href to a style sheet. Title can be
		//		an attribute in a tag, or a dynamic style sheet
		//		reference. Href can be the name of the file.
		//		If no argument, the assumed created dynamic style
		//		sheet is used.

		// try dynamic sheets first
		if(dynamicStyleMap[styleSheetName || "default"]){
			return dynamicStyleMap[styleSheetName || "default"];
		}
		if(!styleSheetName){
			// no arg is nly good for the default style sheet
			// and it has not been created yet.
			return false;
		}
		var allSheets = dh.getStyleSheets();
		// now try document style sheets by name
		if(allSheets[styleSheetName]){
			return dh.getStyleSheets()[styleSheetName];
		}
		// check for partial matches in hrefs (so that a fully
		//qualified name does not have to be passed)
		var nm;
		for ( nm in allSheets){
			if( allSheets[nm].href && allSheets[nm].href.indexOf(styleSheetName)>-1){
				return allSheets[nm];
			}
		}
		return false; //StyleSheet or false
	};

	dh.getDynamicStyleSheet = function(/*String?*/styleSheetName){
		// summary:
		//		Creates and returns a dynamically created style sheet
		//		used for dynamic styles
		// styleSheetName:
		//		The name given the style sheet so that multiple
		//		style sheets can be created and referenced. If
		//		no argument is given, the name "default" is used.

		if(!styleSheetName){ styleSheetName="default"; }
		if(!dynamicStyleMap[styleSheetName]){
			if(Window.doc.createStyleSheet){ //IE
				dynamicStyleMap[styleSheetName] = Window.doc.createStyleSheet();
				if(has("ie") < 9) {
					// IE9 calls this read-only. Loving the new browser so far.
					dynamicStyleMap[styleSheetName].title = styleSheetName;
				}
			}else{
				dynamicStyleMap[styleSheetName] = Window.doc.createElement("style");
				dynamicStyleMap[styleSheetName].setAttribute("type", "text/css");
				Window.doc.getElementsByTagName("head")[0].appendChild(dynamicStyleMap[styleSheetName]);
				console.log(styleSheetName, " ss created: ", dynamicStyleMap[styleSheetName].sheet);
			}
			dynamicStyleMap[styleSheetName]._indicies = [];
		}
		return dynamicStyleMap[styleSheetName]; //StyleSheet
	};

	dh.enableStyleSheet = function(/*String*/styleSheetName){
		// summary:
		//		Enables the style sheet with the name passed in the
		//		argument. Deafults to the default style sheet.
		//
		var ss = dh.getStyleSheet(styleSheetName);
		if(ss){
			if(ss.sheet){
				ss.sheet.disabled = false;
			}else{
				ss.disabled = false;
			}
		}
	};

	dh.disableStyleSheet = function(/* String */styleSheetName){
		// summary:
		//		Disables the dynamic style sheet with the name passed in the
		//		argument. If no arg is passed, defaults to the default style sheet.

		var ss = dh.getStyleSheet(styleSheetName);
		if(ss){
			if(ss.sheet){
				ss.sheet.disabled = true;
			}else{
				ss.disabled = true;
			}
		}
	};

	dh.activeStyleSheet = function(/*String?*/title){
		// summary:
		//		Getter/Setter
		// description:
		//		If passed a title, enables a that style sheet. All other
		//		toggle-able style sheets are disabled.
		//		If no argument is passed, returns currently enabled
		//		style sheet.

		var sheets = dh.getToggledStyleSheets();
		var i;
		if(arguments.length === 1){
			//console.log("sheets:", sheets);
			ArrayUtil.forEach(sheets, function(s){
				s.disabled = (s.title === title) ? false : true;
			});
		}else{
			for(i=0;i<sheets.length;i++){
				if(sheets[i].disabled === false){
					return sheets[i];
				}
			}
		}
		return true; //StyleSheet or Boolean - FIXME - doesn't make a lot of sense
	};

	dh.getPreferredStyleSheet = function(){
		// summary:
		//		Returns the style sheet that was initially enabled
		//		on document launch.
		//		TODO, does not work.
	};

	//	TODO: Sets of style sheets could be grouped according to
	//			an ID and used in sets, much like different
	//			groups of radio buttons. It would not however be
	//			according to W3C spec
	//
	dh.getToggledStyleSheets = function(){
		// summary:
		//		Searches HTML for style sheets that are "toggle-able" -
		//		can be enabled and disabled. These would include sheets
		//		with the title attribute, as well as the REL attribute.
		// returns:
		//		An array of all toggle-able style sheets
		var nm;
		if(!titledSheets.length){
			var sObjects = dh.getStyleSheets();
			for(nm in sObjects){
				if(sObjects[nm].title){
					titledSheets.push(sObjects[nm]);
				}
			}
		}
		return titledSheets; //Array
	};

	//TODO: Does not recursively search for @imports, so it will
	//		only go one level deep.
	dh.getStyleSheets = function(){
		// summary:
		//		Collects all the style sheets referenced in the HTML page,
		//		including any included via @import.
		// returns:
		//		An hash map of all the style sheets.
		if(pageStyleSheets.collected) {return pageStyleSheets;}
		var sheets = Window.doc.styleSheets;
		ArrayUtil.forEach(sheets, function(n){
			var s = (n.sheet) ? n.sheet : n;
			var name = s.title || s.href;
			if(has("ie")){
				// IE attaches a style sheet for VML - do not include this
				if(s.cssText.indexOf("#default#VML") === -1){
					if(s.href){
						// linked
						pageStyleSheets[name] = s;
					}else if(s.imports.length){
						// Imported via @import
						ArrayUtil.forEach(s.imports, function(si){
							pageStyleSheets[si.title || si.href] = si;
						});
					}else{
						//embedded within page
						pageStyleSheets[name] = s;
					}
				}
			}else{
				//linked or embedded
				pageStyleSheets[name] = s;
				pageStyleSheets[name].id = s.ownerNode.id;
				var rules = [];
				try {
					rules = s[s.cssRules?"cssRules":"rules"];
				} catch(err) {
					// issue a warning that stylesheet couldn't be loaded, but continue
					console.warn("Reading css rules from stylesheet "+s.href+" is forbidden due to same-origin policy. See http://www.w3.org/TR/CSP/#cascading-style-sheet-css-parsing",s);
				}
				ArrayUtil.forEach(rules, function(r){
					if(r.href){
						// imported
						pageStyleSheets[r.href] = r.styleSheet;
						pageStyleSheets[r.href].id = s.ownerNode.id;
					}
				});
			}
		});
		//console.log("pageStyleSheets:", pageStyleSheets);
		pageStyleSheets.collected = true;
		return pageStyleSheets; //Object
	};
	
	return dh;
});

},
'jimu/dijit/EditorChooseImage':function(){
define([
  "dojo",
  "dijit",
  "dijit/_editor/_Plugin",
  "jimu/dijit/ImageChooser",
  "dojo/_base/html",
  'dojo/_base/lang',
  "dojo/sniff",
  "dojo/i18n",
  "dojo/_base/connect",
  "dojo/_base/declare"
], function(
  dojo, dijit, _Plugin, ImageChooser, html, lang, has, i18n
) {
  dojo.experimental("dojox.editor.plugins.ChooseImage");

  var ChooseImage = dojo.declare("dojox.editor.plugins.ChooseImage", _Plugin, {
    iconClassPrefix: "editorIcon",
    useDefaultCommand: false,

    _initButton: function() {
      this.createFileInput();
      this.command = "chooseImage";

      var strings = i18n.getLocalization("dijit._editor", "commands");
      this.button = new dijit.form.Button({
        label: strings.insertImage,
        showLabel: false,
        iconClass: this.iconClassPrefix + " " + this.iconClassPrefix + "UploadImage",
        tabIndex: "-1",
        onClick: lang.hitch(this, this._chooseImage)
      });
      this.button.set("readOnly", false);

      this.editor.commands[this.command] = "Upload Image";
      this.inherited("_initButton", arguments);
      delete this.command;
    },

    updateState: function() {
      //change icon ,when "viewsource" dijit clicked
      var disabled = this.get("disabled");
      this.button.set("disabled",this.get("disabled"));
      if (true === disabled) {
        html.addClass(this.button, 'dijitButtonDisabled');
        this.imageChooser.disableChooseImage();
      } else {
        html.removeClass(this.button, 'dijitButtonDisabled');
        this.imageChooser.enableChooseImage();
      }
    },

    createFileInput: function() {
      var node = dojo.create('span', {
        innerHTML: "."
      }, document.body);
      this.imageChooser = new ImageChooser({
        showSelfImg: false,
        cropImage: false,
        format: [ImageChooser.GIF, ImageChooser.JPEG, ImageChooser.PNG]
      }, node);

      this.connect(this.imageChooser, "onImageChange", "insertTempImage");
      // this.connect(this.button, "onComplete", "onComplete");
    },

    _chooseImage: function () {
      var mask = this.imageChooser.mask;
      if (has('safari')) {
        // # First create an event
        var click_ev = document.createEvent("MouseEvents");
        // # initialize the event
        click_ev.initEvent("click", true /* bubble */, true /* cancelable */);
        // # trigger the evevnt/
        mask.dispatchEvent(click_ev);
      } else {
        mask.click();
      }
    },

    onComplete: function(data /*,ioArgs,widgetRef*/ ) {
      data = data[0];
      // Image is ready to insert
      var tmpImgNode = dojo.byId(this.currentImageId, this.editor.document);
      var file;
      // download path is mainly used so we can access a PHP script
      // not relative to this file. The server *should* return a qualified path.
      if (this.downloadPath) {
        file = this.downloadPath + data.name;
      } else {
        file = data.file;
      }

      tmpImgNode.src = file;
      dojo.attr(tmpImgNode, '_djrealurl', file);

      if (data.width) {
        tmpImgNode.width = data.width;
        tmpImgNode.height = data.height;
      }
    },

    insertTempImage: function(fileData) {
      // summary:
      //    inserting a "busy" image to show something is hapening
      //    during upload and download of the image.
      this.currentImageId = "img_" + (new Date().getTime());
      var iTxt = '<img id="' + this.currentImageId + '" src="' + fileData + '" />';
      this.editor.execCommand('inserthtml', iTxt);
    },

    destroy: function () {
      if (this.imageChooser) {
        this.imageChooser.destroy();
      }

      this.inherited(arguments);
    }
  });

  dojo.subscribe(dijit._scopeName + ".Editor.getPlugin", null, function(o) {
    if (o.plugin) {
      return;
    }
    switch (o.args.name) {
      case "chooseImage":
        o.plugin = new ChooseImage({
          url: o.args.url
        });
    }
  });

  /*jshint sub: true */
  _Plugin.registry["chooseImage"] = function(args){
    return new ChooseImage(args);
  };

  return ChooseImage;
});
},
'jimu/dijit/EditorTextColor':function(){
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
  "require",
  "dojo",
  "dijit",
  "dojo/_base/declare",
  "dijit/_editor/_Plugin",
  "dijit/form/DropDownButton"
], function (require, dojo, dijit, declare, _Plugin, DropDownButton) {
  //This is a pulg-in of arcgis-js-api/dijit/_editor/.
  //The template file is /arcgis-js-api/dijit/_editor/plugins/TextColor.js.

  // module:
  //		dijit/_editor/plugins/TextColor
  dojo.experimental("dijit.editor.plugins.EditorTextColor");
  var EditorTextColor = declare("dijit.editor.plugins.EditorTextColor", _Plugin, {
    // summary:
    //		This plugin provides dropdown color pickers for setting text color and background color
    // description:
    //		The commands provided by this plugin are:
    //
    //		- foreColor - sets the text color
    //		- hiliteColor - sets the background color

    // Override _Plugin.buttonClass to use DropDownButton (with ColorPalette) to control this plugin
    buttonClass: DropDownButton,

    // colorPicker: String|Constructor
    //		The color picker dijit to use, defaults to dijit/ColorPalette
    colorPicker: "jimu/dijit/ColorPalette",

    // useDefaultCommand: Boolean
    //		False as we do not use the default editor command/click behavior.
    useDefaultCommand: false,

    _initButton: function () {
      this.command = "editorTextColor";//name for plugin//this.name;
      this.hackCommand = "foreColor";//commands:https://developer.mozilla.org/en-us/docs/Web/API/Document/execCommand
      this.inherited(arguments);

      var recordUID = "",
        forceAttr = false;
      if (this.params.custom) {
        if(this.params.custom.recordUID){
          recordUID = this.params.custom.recordUID;
        }
        if(this.params.custom.forceAttr){
          forceAttr = this.params.custom.forceAttr;
        }
      }
      // Setup to lazy load ColorPalette first time the button is clicked
      var self = this;
      //button icon
      this.button.set("iconClass", this.iconClassPrefix + " " + this.iconClassPrefix + "ForeColor");
      this.button.set("title", this.getLabel(this.hackCommand));
      this.button.loadDropDown = function (callback) {
        function onColorPaletteLoad(ColorPalette) {
          self.button.dropDown = new ColorPalette({
            dir: self.editor.dir,
            ownerDocument: self.editor.ownerDocument,
            value: self.value,
            appearance: {
              showTransparent: false,
              showColorPalette: true,
              showCoustom: true,
              showCoustomRecord: true
            },
            recordUID: recordUID,
            onChange: function (color) {
              //Toggles the use of HTML tags or CSS for the generated markup
              self.editor.execCommand("useCSS", forceAttr);
              self.editor.execCommand("styleWithCSS", !forceAttr);

              self.editor.execCommand(self.hackCommand, color);
            }/*,
            onExecute: function () {
              self.editor.execCommand(self.hackCommand, this.get("value"));
            }*/
          });
          // self.button.onClick = function (evt) {
          //   console.log("---------------333333333");
          //   self.button.focus()
          // }
          callback();
        }

        if (typeof self.colorPicker === "string") {
          require([self.colorPicker], onColorPaletteLoad);
        } else {
          onColorPaletteLoad(self.colorPicker);
        }
      };
    },

    updateState: function () {
      // summary:
      //		Overrides _Plugin.updateState().  This updates the ColorPalette
      //		to show the color of the currently selected text.
      // tags:
      //		protected
      var _e = this.editor;
      var _c = this.hackCommand;
      if (!_e || !_e.isLoaded || !_c.length) {
        return;
      }

      var value;
      if (this.button) {
        var disabled = this.get("disabled");
        this.button.set("disabled", disabled);
        if (disabled) {
          return;
        }

        try {
          value = _e.queryCommandValue(_c) || "";
        } catch (e) {
          //Firefox may throw error above if the editor is just loaded, ignore it
          value = "";
        }
      }

      if (value === "") {
        value = "#000000";
      } else if (value === "transparent") {
        value = "rgba(0, 0, 0, 0)";
      }
      this.value = value;

      var dropDown = this.button.dropDown;
      if (dropDown && dropDown.getColor && value !== dropDown.getColor()) {
        dropDown.refreshRecords();
        dropDown.setColor(value);
      }
    }
  });

  dojo.subscribe(dijit._scopeName + ".Editor.getPlugin", null, function (o) {
    if (o.plugin) {
      return;
    }
    switch (o.args.name) {
      case "editorTextColor":
        o.plugin = new EditorTextColor();
    }
  });
  return EditorTextColor;
});
},
'jimu/dijit/EditorBackgroundColor':function(){
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
  "require",
  "dojo",
  "dijit",
  "dojo/_base/declare",
  "dijit/_editor/_Plugin",
  "dijit/form/DropDownButton"
], function (require, dojo, dijit, declare, _Plugin, DropDownButton) {
  //This is a pulg-in of arcgis-js-api/dijit/_editor/.
  //The template file is /arcgis-js-api/dijit/_editor/plugins/TextColor.js.

  // module:
  //		dijit/_editor/plugins/BackgroundColor
  dojo.experimental("dijit.editor.plugins.EditorBackgroundColor");
  var EditorBackgroundColor = declare("dijit.editor.plugins.EditorBackgroundColor", _Plugin, {
    // summary:
    //		This plugin provides dropdown color pickers for setting text color and background color
    // description:
    //		The commands provided by this plugin are:
    //
    //		- foreColor - sets the text color
    //		- hiliteColor - sets the background color

    // Override _Plugin.buttonClass to use DropDownButton (with ColorPalette) to control this plugin
    buttonClass: DropDownButton,

    // colorPicker: String|Constructor
    //		The color picker dijit to use, defaults to dijit/ColorPalette
    colorPicker: "jimu/dijit/ColorPalette",

    // useDefaultCommand: Boolean
    //		False as we do not use the default editor command/click behavior.
    useDefaultCommand: false,

    _initButton: function () {
      this.command = "editorBackgroundColor";//name for plugin//this.name;
      this.hackCommand = "hiliteColor";//commands:https://developer.mozilla.org/en-us/docs/Web/API/Document/execCommand
      this.inherited(arguments);

      var recordUID = "",
        forceAttr = false;
      if (this.params.custom) {
        if(this.params.custom.recordUID){
          recordUID = this.params.custom.recordUID;
        }
      }
      // Setup to lazy load ColorPalette first time the button is clicked
      var self = this;
      //button icon
      this.button.set("iconClass", this.iconClassPrefix + " " + this.iconClassPrefix + "HiliteColor");
      this.button.set("title", this.getLabel(this.hackCommand));
      this.button.loadDropDown = function (callback) {
        function onColorPaletteLoad(ColorPalette) {
          self.button.dropDown = new ColorPalette({
            dir: self.editor.dir,
            ownerDocument: self.editor.ownerDocument,
            value: self.value,
            appearance: {
              showTransparent: true,
              showColorPalette: true,
              showCoustom: true,
              showCoustomRecord: true
            },
            recordUID: recordUID,
            onChange: function (color) {
              //Toggles the use of HTML tags or CSS for the generated markup
              self.editor.execCommand("useCSS", forceAttr);
              self.editor.execCommand("styleWithCSS", !forceAttr);

              self.editor.execCommand(self.hackCommand, color);
            },
            onExecute: function () {
              self.editor.execCommand(self.hackCommand, this.get("value"));
            }
          });
          callback();
        }

        if (typeof self.colorPicker === "string") {
          require([self.colorPicker], onColorPaletteLoad);
        } else {
          onColorPaletteLoad(self.colorPicker);
        }
      };
    },

    updateState: function () {
      // summary:
      //		Overrides _Plugin.updateState().  This updates the ColorPalette
      //		to show the color of the currently selected text.
      // tags:
      //		protected
      var _e = this.editor;
      var _c = this.hackCommand;
      if (!_e || !_e.isLoaded || !_c.length) {
        return;
      }

      var value;
      if (this.button) {
        var disabled = this.get("disabled");
        this.button.set("disabled", disabled);
        if (disabled) {
          return;
        }

        try {
          value = _e.queryCommandValue(_c) || "";
        } catch (e) {
          //Firefox may throw error above if the editor is just loaded, ignore it
          value = "";
        }
      }

      if (value === "") {
        value = "#000000";
      } else if (value === "transparent") {
        value = "rgba(0, 0, 0, 0)";
      }
      this.value = value;

      var dropDown = this.button.dropDown;
      if (dropDown && dropDown.getColor && value !== dropDown.getColor()) {
        dropDown.refreshRecords();
        dropDown.setColor(value);
      }
    }
  });

  dojo.subscribe(dijit._scopeName + ".Editor.getPlugin", null, function (o) {
    if (o.plugin) {
      return;
    }
    switch (o.args.name) {
      case "editorBackgroundColor":
        o.plugin = new EditorBackgroundColor();
    }
  });
  return EditorBackgroundColor;
});
},
'widgets/Splash/setting/_build-generate_module':function(){
define(["dojo/text!./Setting.html",
"dojo/text!./css/style.css",
"dojo/i18n!./nls/strings"], function(){});
},
'url:widgets/Splash/setting/ColorPickerEditor.html':"<div class=\"colorPickerEditor\">\r\n  <div class=\"colorPicker\" data-dojo-attach-point=\"colorPicker\"></div>\r\n  <span class=\"trans\">${nls.transparency}</span>\r\n  <div class=\"sliderbar\" data-dojo-attach-point=\"sliderBar\"></div>\r\n  <input type=\"text\" data-dojo-type=\"dijit/form/NumberSpinner\" value=\"0\"\r\n         data-dojo-attach-point=\"spinner\" data-dojo-props=\"smallDelta:10,intermediateChanges:true,constraints: {min:0,max:100}\">\r\n  <span >%</span>\r\n</div>\r\n\r\n",
'url:widgets/Splash/setting/BackgroundSelector.html':"<div>\r\n  <div class=\"titles\">${nls.background}</div>\r\n\r\n  <div class=\"unit-item\">\r\n    <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"colorFillBtn\" data-dojo-props=\"group:'background'\"></div>\r\n    <label class=\"\">${nls.colorFill}</label>\r\n  </div>\r\n  <div class=\"hide indent\" data-dojo-attach-point=\"colorFillOptions\">\r\n    <div class=\"colorPicker\" data-dojo-attach-point=\"backgroundColorPickerEditor\"></div>\r\n  </div>\r\n\r\n  <div class=\"unit-item\">\r\n    <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"imageFillBtn\" data-dojo-props=\"group:'background'\"></div>\r\n    <label class=\"\">${nls.imageFill}</label>\r\n  </div>\r\n  <div class=\"hide indent\" data-dojo-attach-point=\"imageFillOptions\">\r\n    <div class=\"clearFix\">\r\n      <div class=\"jimu-float-leading\">\r\n        <div class=\"image-chooser-base\" data-dojo-attach-point=\"imageChooser\"></div>\r\n      </div>\r\n      <div class=\"file-name jimu-float-leading\" data-dojo-attach-point=\"fileName\">${nls.noFileChosen}</div>\r\n    </div>\r\n\r\n    <div class=\"hide clearFix types\" data-dojo-attach-point=\"fillsType\">\r\n      <div class=\"unit-item fillstype jimu-float-leading\" data-dojo-attach-point=\"sizeFill\">\r\n        <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"fill\" data-dojo-props=\"group:'fillStyle'\"></div>\r\n        <label class=\"\">${nls.sizeFill}</label>\r\n      </div>\r\n      <div class=\"unit-item fillstype jimu-float-leading hide\" data-dojo-attach-point=\"sizeFit\">\r\n        <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"fit\" data-dojo-props=\"group:'fillStyle'\"></div>\r\n        <label class=\"\">${nls.sizeFit}</label>\r\n      </div>\r\n      <div class=\"unit-item fillstype jimu-float-leading\" data-dojo-attach-point=\"sizeStretch\">\r\n        <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"stretch\" data-dojo-props=\"group:'fillStyle'\"></div>\r\n        <label class=\"\">${nls.sizeStretch}</label>\r\n      </div>\r\n      <div class=\"unit-item fillstype jimu-float-leading hide\" data-dojo-attach-point=\"sizeCenter\">\r\n        <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"center\" data-dojo-props=\"group:'fillStyle'\"></div>\r\n        <label class=\"\">${nls.sizeCenter}</label>\r\n      </div>\r\n      <div class=\"unit-item fillstype jimu-float-leading\" data-dojo-attach-point=\"sizeTile\">\r\n        <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-attach-point=\"tile\" data-dojo-props=\"group:'fillStyle'\"></div>\r\n        <label class=\"\">${nls.sizeTile}</label>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>",
'url:widgets/Splash/setting/SizeSelector.html':"<div class=\"size-selector clearFix\">\r\n  <div class=\"titles\">${nls.size}</div>\r\n  <div class=\"sizes jimu-float-leading\">\r\n    <div class=\"size-box-container\">\r\n      <div class=\"size-box percent25\" data-dojo-attach-point=\"percent25\"></div>\r\n      25%\r\n    </div>\r\n    <div class=\"size-box-container\">\r\n      <div class=\"size-box percent50\" data-dojo-attach-point=\"percent50\"></div>\r\n      50%\r\n    </div>\r\n    <div class=\"size-box-container\">\r\n      <div class=\"size-box percent75\" data-dojo-attach-point=\"percent75\"></div>\r\n      75%\r\n    </div>\r\n    <div class=\"size-box-container\">\r\n      <div class=\"size-box percent100\" data-dojo-attach-point=\"percent100\"></div>\r\n      100%\r\n    </div>\r\n    <div class=\"size-box-container\">\r\n      <div class=\"size-box custom\" data-dojo-attach-point=\"custom\"></div>\r\n      ${nls.custom}\r\n    </div>\r\n  </div>\r\n  <div data-dojo-attach-point=\"wh\" class=\"wh jimu-float-leading hide\">\r\n    <div class=\"wh-item\">\r\n      <div class=\"lable\">${nls.width}</div>\r\n      <div class=\"inputs\">\r\n        <input type=\"text\" class=\"text-box\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"width\">\r\n        <span class=\"unit\">px</span>\r\n      </div>\r\n    </div>\r\n    <div class=\"wh-item\">\r\n      <div class=\"lable\">${nls.height}</div>\r\n      <div class=\"inputs\">\r\n        <input type=\"text\" class=\"text-box\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"height\">\r\n        <span class=\"unit\">px</span>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n",
'url:widgets/Splash/setting/AlignSelector.html':"<div class=\"align-selector clearFix\">\r\n  <div class=\"titles\">${nls.contentAlign}</div>\r\n  <div class=\"aligns jimu-float-leading\">\r\n    <div class=\"align-box-container\">\r\n      <div class=\"align-box top\" data-dojo-attach-point=\"top\" title=\"${nls.alignTop}\"></div>${nls.alignTop}\r\n    </div>\r\n    <div class=\"align-box-container\">\r\n      <div class=\"align-box middle\" data-dojo-attach-point=\"middle\" title=\"${nls.alignMiddle}\"></div>${nls.alignMiddle}\r\n    </div>\r\n  </div>\r\n</div>",
'url:widgets/Splash/setting/Setting.html':"<div style=\"width:100%;height: 100%;\">\r\n  <div class=\"instruction\" data-dojo-attach-point=\"instructionNode\">\r\n    <span class=\"instruction-inner\">${nls.instruction}</span>\r\n  </div>\r\n  <!-- tabs -->\r\n  <div class=\"tabs\" data-dojo-attach-point=\"tabsContainer\">\r\n    <div class=\"content-tab\" data-dojo-attach-point=\"contentTab\">\r\n      <div class=\"tab-description\">${nls.contentDescription}</div>\r\n      <div class=\"editor-container\" data-dojo-attach-point=\"editorContainer\">\r\n        <div data-dojo-attach-point=\"editor\"></div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"appearance-tab\" data-dojo-attach-point=\"appearanceTab\">\r\n      <div class=\"tab-description\">${nls.appearanceDescription}</div>\r\n      <div>\r\n        <div data-dojo-attach-point=\"sizeSelector\"></div>\r\n      </div>\r\n      <div>\r\n        <div data-dojo-attach-point=\"alignSelector\"></div>\r\n      </div>\r\n      <div>\r\n        <div data-dojo-attach-point=\"backgroundSelector\"></div>\r\n      </div>\r\n      <div>\r\n        <div class=\"titles\">${nls.buttonColor}</div>\r\n        <div class=\"colorPicker\" data-dojo-attach-point=\"buttonColorPickerEditor\"></div>\r\n      </div>\r\n      <div>\r\n        <div class=\"titles\">${nls.buttonText}</div>\r\n        <input class=\"jimu-input buttonText\" type=\"text\" value=\"${nls.ok}\" data-dojo-attach-point=\"buttonText\" data-dojo-attach-event=\"blur:_onButtonTextBlur\">\r\n      </div>\r\n      <div>\r\n        <div class=\"titles\">${nls.confirmLabelColor}</div>\r\n        <div class=\"colorPicker\" data-dojo-attach-point=\"confirmColorPickerEditor\"></div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"options-tab\" data-dojo-attach-point=\"optionsTab\">\r\n      <div class=\"tab-description\">${nls.optionsDescription}</div>\r\n      <div class=\"splash-footer\" data-dojo-attach-point=\"splashFooterNode\">\r\n        <div class=\"require-list\">\r\n          <div class=\"require-item\" data-dojo-attach-point=\"noRequireConfirmSplash\">\r\n            <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-props=\"group:'requireItem'\"></div>\r\n            <label class=\"jimu-leading-margin025\">${nls.noRequireConfirm}</label>\r\n          </div>\r\n          <div data-dojo-attach-point=\"showOption\"></div>\r\n          <div class=\"require-item\" data-dojo-attach-point=\"requireConfirmSplash\">\r\n            <div data-dojo-type=\"jimu/dijit/RadioBtn\" data-dojo-props=\"group:'requireItem'\"></div>\r\n            <label class=\"jimu-leading-margin025\">${nls.requireConfirm}</label>\r\n          </div>\r\n          <div class=\"confirm-container\" data-dojo-attach-point=\"confirmContainer\">\r\n            <div class=\"confirm-text\">\r\n              <span class=\"spinner-label jimu-ellipsis\" title=\"${nls.confirmLabel}\">${nls.confirmLabel}</span>\r\n              <input class=\"jimu-input jimu-float-trailing\" type=\"text\" value=\"${nls.defaultConfirmText}\" data-dojo-attach-point=\"confirmText\" data-dojo-attach-event=\"blur:_onConfirmTextBlur\">\r\n            </div>\r\n            <div data-dojo-attach-point=\"confirmOption\"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>",
'url:widgets/Splash/setting/css/style.css':".jimu-widget-splash-setting{margin:0; padding:0; font-size:14px; position: absolute; overflow-y: hidden; top: 0; bottom: 0; left: 0; right: 0; letter-spacing: 0.38px;}.jimu-widget-splash-setting .instruction {margin-bottom: 10px;}.jimu-widget-splash-setting .tabs {font-family: \"Avenir Light\"; color: #000000; height: 100%;}.jimu-widget-splash-setting .tabs .tab-description {margin: 10px 0;}.jimu-widget-splash-setting .tabs .jimu-radio-checked .jimu-radio-inner {width: 6px; height: 6px; margin: 4px; border-radius: 50%; background-color: #24B5CC;}.jimu-widget-splash-setting .tabs .jimu-radio{border: 1px solid #ccc; vertical-align: top;}.jimu-widget-splash-setting .jimu-tab>.control>.tab{background-color: #fff; border-top: 0; border-left: 0; border-right: 0; border-bottom: 1px solid #dedede; color:#898989; font-family: \"Avenir Medium\"; font-size: 14px;}.jimu-widget-splash-setting .jimu-tab>.control>.tab.jimu-state-selected {border-bottom: 3px solid #24b5cc; font-family: \"Avenir Heavy\"; color: #000000;}.jimu-widget-splash-setting .tabs .titles {font-weight: bold; font-family: \"Avenir Medium\"; font-size: 14px; margin: 20px 0 10px 0;}.jimu-widget-splash-setting .tabs .hide{display: none;}.jimu-widget-splash-setting .tabs .indent{margin-left: 20px; margin-top: 10px;}.jimu-widget-splash-setting .tabs .unit-item{margin: 15px 5px 5px 5px; line-height: 18px; height: 18px; vertical-align: middle;}.jimu-widget-splash-setting .tabs .clearFix {*overflow: hidden; *zoom: 1;}.jimu-widget-splash-setting .tabs .clearFix:after {display: table; content: \"\"; width: 0; clear: both;}.jimu-widget-splash-setting .tabs .view{height: 100%; overflow-y: auto;}.jimu-widget-splash-setting .tabs .jimu-tab>.jimu-viewstack{padding-bottom: 30px;}.jimu-widget-splash-setting .tabs .colorPickerEditor {}.jimu-widget-splash-setting .tabs .colorPickerEditor .jimu-color-picker{display: inline-block; width: 30px; height: 30px;}.jimu-widget-splash-setting .tabs .colorPickerEditor .dijitSpinner.dijitNumberTextBox.dijitValidationTextBox{width:66px; height:30px;}.jimu-widget-splash-setting .dijitSliderImageHandleH{top: -7px;}.jimu-widget-splash-setting .dijitSliderImageHandle.dijitSliderImageHandleH{background-image: url(\"../../images/sliderball.png\"); background-position: 0 0;}.jimu-widget-splash-setting .tabs .dijitSliderThumbHover{background-image: url(\"../../images/sliderball_hover.png\"); background-position: 0 0;}.jimu-widget-splash-setting .dijitSlider .dijitSliderProgressBarH,.jimu-widget-splash-setting .dijitSlider .dijitSliderLeftBumper{border-color: #24b5cc; background-color: #24b5cc; background-image: -webkit-linear-gradient(top, #24b5cc 0px, #24b5cc 1px, rgba(255, 255, 255, 0) 2px); background-image: -o-linear-gradient(top, #24b5cc 0px, #24b5cc 1px, rgba(255, 255, 255, 0) 2px); background-image: linear-gradient(top, #24b5cc 0px, #24b5cc 1px, rgba(255, 255, 255, 0) 2px);}.jimu-widget-splash-setting .dijitSlider .dijitSliderRemainingBarH,.jimu-widget-splash-setting .dijitSlider .dijitSliderRightBumper{border-color: #d7d7d7; background-color: #d7d7d7;}.jimu-widget-splash-setting .tabs .colorPickerEditor .trans{font-family: \"Avenir Light\"; font-size: 12px; padding: 0 10px 0 20px; letter-spacing: 0.33px;}.jimu-widget-splash-setting .tabs .sliderbar {width: 80px;}.jimu-widget-splash-setting .content-tab{}.jimu-widget-splash-setting .content-tab .editor-container{}.jimu-widget-splash-setting .content-tab .editor-container .dijitEditorIFrameContainer textarea {resize: none;}.jimu-widget-splash-setting .appearance-tab{overflow-y: auto; height: 490px;}.jimu-widget-splash-setting .appearance-tab .size-selector .size-box-container{display: inline-block; text-align: center; margin: 0 10px 0 0; width: 80px; -o-text-overflow: ellipsis; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}.jimu-widget-splash-setting .appearance-tab .size-selector .size-box{width:80px; height:60px; background: no-repeat; margin-bottom: 5px;}.jimu-widget-splash-setting .appearance-tab .size-selector .percent25{background: url(\"../../images/percent25.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .percent25.selected{background: url(\"../../images/percent25_selected.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .percent50{background: url(\"../../images/percent50.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .percent50.selected{background: url(\"../../images/percent50_selected.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .percent75{background: url(\"../../images/percent75.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .percent75.selected{background: url(\"../../images/percent75_selected.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .percent100{background: url(\"../../images/percent100.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .percent100.selected{background: url(\"../../images/percent100_selected.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .custom{background: url(\"../../images/custom.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .custom.selected{background: url(\"../../images/custom_selected.svg\") center center no-repeat;;}.jimu-widget-splash-setting .appearance-tab .size-selector .custom-label{vertical-align: top; line-height: 20px;}.jimu-rtl .jimu-widget-splash-setting .appearance-tab .sizes>:first-child{margin-right: 0;}.jimu-widget-splash-setting .appearance-tab .size-selector .wh{margin: 0 14px;}.jimu-widget-splash-setting .appearance-tab .size-selector .wh .wh-item{display: inline-block; margin-right: 10px;}.jimu-widget-splash-setting .appearance-tab .size-selector .wh .wh-item .lable{font-family: \"Avenir Medium\"; font-size: 12px; color: #353535; margin:0 0 5px 0; width: 96px; -o-text-overflow: ellipsis; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}.jimu-widget-splash-setting .appearance-tab .size-selector .wh .inputs{width:96px; border: 1px solid #d9dde0;}.jimu-widget-splash-setting .appearance-tab .size-selector .wh .inputs .text-box{width: 70px; border: none;}.jimu-widget-splash-setting .appearance-tab .size-selector .wh .inputs .unit{color: #898989; letter-spacing: 0;}.jimu-widget-splash-setting .appearance-tab .align-selector .align-box-container{display: inline-block; text-align: center; margin: 0 10px; width:50px; -o-text-overflow: ellipsis; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}.jimu-widget-splash-setting .appearance-tab .align-selector .align-box{width:40px; height:36px; background: no-repeat; margin: 0 5px 5px 5px;}.jimu-widget-splash-setting .appearance-tab .align-selector .top{background: url(\"../../images/top.svg\") center center no-repeat; border: none;}.jimu-widget-splash-setting .appearance-tab .align-selector .top.selected{background: url(\"../../images/top_selected.svg\") center center no-repeat; border: 1px #24B5CC solid;}.jimu-widget-splash-setting .appearance-tab .align-selector .middle{background: url(\"../../images/middle.svg\") center center no-repeat; border: none;}.jimu-widget-splash-setting .appearance-tab .align-selector .middle.selected{background: url(\"../../images/middle_selected.svg\") center center no-repeat; border: 1px #24B5CC solid;}.jimu-widget-splash-setting .appearance-tab .jimu-image-chooser{height:30px; width:124px; background: #24B5CC; border: 1px solid #24B5CC;}.jimu-widget-splash-setting .appearance-tab .file-name{font-size: 12px; line-height: 33px; height: 33px; color: #000000; margin: 0 20px 0 20px;}.jimu-widget-splash-setting .appearance-tab .types>:first-child{margin-left: 0;}.jimu-rtl .jimu-widget-splash-setting .appearance-tab .types>:first-child{margin-right: 0;}.jimu-widget-splash-setting .appearance-tab .fillstype{margin: 10px 20px 0 20px;}.jimu-widget-splash-setting .appearance-tab .buttonText{width: 290px; margin-bottom: 10px;}.jimu-widget-splash-setting .instruction span{color: #596679;}.jimu-widget-splash-setting .editor-container{position: absolute; top: 34px; bottom: 165px; left: 0; right: 0; border: 1px solid #d2dae2; background-color: #fafafc;}.jimu-widget-splash-setting .editor-container .dijitEditorIFrameContainer{position: relative; width: 100%; overflow: hidden;}.jimu-widget-splash-setting .editor-container .dijitEditorIFrameContainer {padding-top: 0;}.jimu-widget-splash-setting .editor-container .uploaderInsideNode embed {display: none;}.jimu-widget-splash-setting .splash-footer{color: #596679; height: 155px; margin-top: 20px;}.jimu-widget-splash-setting .splash-footer .require-continue{position: absolute; top: 0;}.jimu-widget-splash-setting .splash-footer .require-item{margin-bottom: 10px;}.jimu-widget-splash-setting .splash-footer .option-text{display: none; margin: 10px 0 15px 23px;}.jimu-widget-splash-setting .splash-footer .confirm-container{display: none; margin-left: 20px; margin-bottom: 10px;}.jimu-widget-splash-setting .splash-footer .confirm-text,.jimu-widget-splash-setting .splash-footer .confirm-option{width: 100%; margin-top: 10px;}.jimu-widget-splash-setting .splash-footer .spinner-label{line-height: 30px; margin-right: 10px; display: inline-block;}.jimu-widget-splash-setting .splash-footer .set-background,.jimu-widget-splash-setting .splash-footer .set-background *{vertical-align: middle;}.jimu-widget-splash-setting .splash-footer input{width: 755px; color: #7989a0;}.jimu-widget-splash-setting .dojoxEditorUploadNorm.dijitButtonDisabled {background: #ccc url(../../css/images/uploadImageIcon_disabled.gif) no-repeat 2px 2px;}",
'*now':function(r){r(['dojo/i18n!*preload*widgets/Splash/setting/nls/Setting*["ar","bs","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]']);}
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
    "dojo/_base/lang",
    'dojo/_base/html',
    'dojo/on',
    'dojo/aspect',
    'dojo/cookie',
    'dojo/sniff',
    'dojo/query',
    './ColorPickerEditor',
    './BackgroundSelector',
    './SizeSelector',
    './AlignSelector',
    'dijit/registry',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/Editor',
    'jimu/utils',
    'jimu/BaseWidgetSetting',
    "jimu/dijit/CheckBox",
    'jimu/dijit/TabContainer',
    'jimu/dijit/LoadingShelter',
    'dojo/Deferred',
    'dojo/NodeList-manipulate',
    "jimu/dijit/RadioBtn",
    'dijit/_editor/plugins/LinkDialog',
    'dijit/_editor/plugins/ViewSource',
    'dijit/_editor/plugins/FontChoice',
    'dojox/editor/plugins/Preview',
    'dijit/_editor/plugins/TextColor',
    'dojox/editor/plugins/ToolbarLineBreak',
    'dijit/ToolbarSeparator',
    'dojox/editor/plugins/FindReplace',
    'dojox/editor/plugins/PasteFromWord',
    'dojox/editor/plugins/InsertAnchor',
    'dojox/editor/plugins/Blockquote',
    'dojox/editor/plugins/UploadImage',
    'jimu/dijit/EditorChooseImage',
    'jimu/dijit/EditorTextColor',
    'jimu/dijit/EditorBackgroundColor'
  ],
  function(declare, lang, html, on, aspect, cookie, has, query,
           ColorPickerEditor, BackgroundSelector, SizeSelector, AlignSelector,
           registry, _WidgetsInTemplateMixin,
           Editor, utils, BaseWidgetSetting, CheckBox, TabContainer, LoadingShelter, Deferred) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-splash-setting',
      _defaultSize: {mode: "wh", wh: {w: 600, h: 264}},
      _defaultColor: '#485566',
      _defaultConfirmColor: "#ffffff",
      _defaultTransparency: 0,

      postMixInProperties: function() {
        this.nls = lang.mixin(this.nls, window.jimuNls.common);
      },
      postCreate: function() {
        //LoadingShelter
        this.shelter = new LoadingShelter({
          hidden: true
        });
        this.shelter.placeAt(this.domNode);
        this.shelter.startup();

        this.tab = new TabContainer({
          tabs: [{
            title: this.nls.content,
            content: this.contentTab
          }, {
            title: this.nls.appearance,
            content: this.appearanceTab
          }, {
            title: this.nls.options,
            content: this.optionsTab
          }],
          selected: this.nls.content
        });
        this.tab.placeAt(this.tabsContainer);
        this.tab.startup();
        //the editor of first page, need to calculate scroll bar
        this.own(on(this.tab, 'tabChanged', lang.hitch(this, function(title) {
          if (title === this.nls.content) {
            this.resize();
          }
        })));

        this.inherited(arguments);
      },
      initContentTab: function() {
        var head = document.getElementsByTagName('head')[0];
        var tcCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/TextColor.css";
        var tcCss = query('link[href="' + tcCssHref + '"]', head)[0];
        if (!tcCss) {
          utils.loadStyleLink("editor_plugins_resources_TextColor", tcCssHref);
        }
        var epCssHref = window.apiUrl + "dojox/editor/plugins/resources/editorPlugins.css";
        var epCss = query('link[href="' + epCssHref + '"]', head)[0];
        if (!epCss) {
          utils.loadStyleLink("editor_plugins_resources_editorPlugins", epCssHref);
        }
        var pfCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/PasteFromWord.css";
        var pfCss = query('link[href="' + pfCssHref + '"]', head)[0];
        if (!pfCss) {
          utils.loadStyleLink("editor_plugins_resources_PasteFromWord", pfCssHref);
        }

        this.initEditor();
      },
      initAppearanceTab: function() {
        this.sizeSelector = new SizeSelector({nls: this.nls}, this.sizeSelector);

        this.backgroundSelector = new BackgroundSelector({nls: this.nls}, this.backgroundSelector);
        this.backgroundSelector.startup();

        this.alignSelector = new AlignSelector({nls: this.nls}, this.alignSelector);
        this.alignSelector.startup();

        this.buttonColorPicker = new ColorPickerEditor({nls: this.nls}, this.buttonColorPickerEditor);
        this.buttonColorPicker.startup();

        this.confirmColorPicker = new ColorPickerEditor({nls: this.nls}, this.confirmColorPickerEditor);
        this.confirmColorPicker.startup();
      },
      initOptionsTab: function() {
        this.own(on(this.requireConfirmSplash, 'click', lang.hitch(this, function() {
          this.set('requireConfirm', true);
        })));
        this.own(on(this.noRequireConfirmSplash, 'click', lang.hitch(this, function() {
          this.set('requireConfirm', false);
        })));
        this.own(this.watch('requireConfirm', lang.hitch(this, this._changeRequireConfirm)));
        this.own(aspect.before(this, 'getConfig', lang.hitch(this, this._beforeGetConfig)));
        this.showOption = new CheckBox({
          label: this.nls.optionText,
          checked: false
        }, this.showOption);
        this.showOption.startup();
        html.addClass(this.showOption.domNode, 'option-text');
        this.confirmOption = new CheckBox({
          label: this.nls.confirmOption,
          checked: false
        }, this.confirmOption);
        this.confirmOption.startup();
        html.addClass(this.confirmOption.domNode, 'confirm-option');
      },

      startup: function() {
        this.inherited(arguments);
        this.shelter.show();
        if (!this.config.splash) {
          this.config.splash = {};
        }

        this.initContentTab();
        this.initAppearanceTab();
        this.initOptionsTab();

        this.setConfig(this.config);

        this.resize();
      },

      initEditor: function() {
        this.editor = new Editor({
          plugins: [
            'bold', 'italic', 'underline',
            utils.getEditorTextColor("splash3d"), utils.getEditorBackgroundColor("splash3d"),
            '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
            '|', 'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent'
          ],
          extraPlugins: [
            '|', 'createLink', 'unlink', 'pastefromword', '|', 'undo', 'redo',
            '|', 'chooseImage', '|', 'viewsource', 'toolbarlinebreak',
            {
              name: "dijit._editor.plugins.FontChoice",
              command: "fontName",
              custom: "Arial;Comic Sans MS;Courier New;Garamond;Tahoma;Times New Roman;Verdana".split(";")
            },
            'fontSize', 'formatBlock'
          ],
          style: "font-family:Verdana;"
        }, this.editor);
        html.setStyle(this.editor.domNode, {
          width: '100%',
          height: '100%'
        });
        this.editor.startup();

        var instrBox = html.getMarginBox(this.instructionNode);
        var footerBox = html.getMarginBox(this.splashFooterNode);

        html.setStyle(this.editorContainer, {
          top: instrBox.h + 8 + 'px',
          bottom: footerBox.h + 10 + 10 + 'px'
        });

        if (has('ie') !== 8) {
          this.editor.resize({
            w: '100%',
            h: '100%'
          });
        } else {
          var box = html.getMarginBox(this.editorContainer);
          this.editor.resize({
            w: box.w,
            h: box.h
          });
        }
      },

      setConfig: function(config) {
        this.config = config;

        this._setWidthForOldVersion().then(lang.hitch(this, function() {
          this.editor.set('value', config.splash.splashContent || this.nls.defaultContent);
          this.set('requireConfirm', config.splash.requireConfirm);
          this.showOption.setValue(config.splash.showOption);
          this.confirmOption.setValue(config.splash.confirmEverytime);
          html.setAttr(
            this.confirmText,
            'value',
            utils.stripHTML(config.splash.confirm.text || this.nls.defaultConfirmText)
          );
          this.confirmColorPicker.setValues({
            "color": config.splash.confirm.color || this._defaultConfirmColor,
            "transparency": config.splash.confirm.transparency || this._defaultTransparency
          });

          this.sizeSelector.setValue(config.splash.size || this._defaultSize);
          if ("undefined" !== typeof config.splash.image) {
            this.imageChooser.setDefaultSelfSrc(config.splash.image);
          }

          this.alignSelector.setValue(config.splash.contentVertical);

          this.backgroundSelector.setValues(config);

          this.buttonColorPicker.setValues({
            "color": config.splash.button.color || this._defaultColor,
            "transparency": config.splash.button.transparency || this._defaultTransparency
          });
          html.setAttr(
            this.buttonText, 'value',
            utils.stripHTML(config.splash.button.text || this.nls.ok)
          );

          this.shelter.hide();
          this.resize();
          setTimeout(lang.hitch(this, function () {
            this.resize();
          }), 200);
        }));
      },

      _beforeGetConfig: function() {
        var isFirstKey = this._getCookieKey();
        cookie(isFirstKey, true, {
          expires: 1000,
          path: '/'
        });
      },

      _getCookieKey: function() {
        return 'isfirst_' + encodeURIComponent(utils.getAppIdFromUrl());
      },

      getConfig: function() {
        this.config.splash.splashContent = this._getEditorValue();
        this.config.splash.size = this.sizeSelector.getValue();

        this.config.splash.requireConfirm = this.get('requireConfirm');
        this.config.splash.showOption = this.showOption.getValue();
        this.config.splash.confirmEverytime = this.confirmOption.getValue();

        if (this.get('requireConfirm')) {
          this.config.splash.confirm.text = utils.stripHTML(this.confirmText.value || "");
        } else {
          this.config.splash.confirm.text = "";
        }
        var confirmColor = this.confirmColorPicker.getValues();
        if (confirmColor) {
          this.config.splash.confirm.color = confirmColor.color;
          this.config.splash.confirm.transparency = confirmColor.transparency;
        }

        this.config.splash.background = this.backgroundSelector.getValues();

        this.config.splash.button = {};
        var btnColor = this.buttonColorPicker.getValues();
        if (btnColor) {
          this.config.splash.button.color = btnColor.color;
          this.config.splash.button.transparency = btnColor.transparency;
        }
        this.config.splash.button.text = utils.stripHTML(this.buttonText.value || "");

        this.config.splash.contentVertical = this.alignSelector.getValue();
        return this.config;
      },

      _changeRequireConfirm: function() {
        var _selectedNode = null;

        if (this.get('requireConfirm')) {
          _selectedNode = this.requireConfirmSplash;
          html.setStyle(this.confirmContainer, 'display', 'block');
          html.setStyle(this.showOption.domNode, 'display', 'none');
        } else {
          _selectedNode = this.noRequireConfirmSplash;
          html.setStyle(this.showOption.domNode, 'display', 'block');
          html.setStyle(this.confirmContainer, 'display', 'none');
        }

        var _radio = registry.byNode(query('.jimu-radio', _selectedNode)[0]);
        _radio.check(true);
      },

      destroy: function() {
        var head = document.getElementsByTagName('head')[0];
        query('link[id^="editor_plugins_resources"]', head).remove();

        this.inherited(arguments);
      },
      _onConfirmTextBlur: function() {
        this.confirmText.value = utils.stripHTML(this.confirmText.value || "");
      },
      _onButtonTextBlur: function() {
        this.buttonText.value = utils.stripHTML(this.buttonText.value || "");
      },
      _getEditorValue: function() {
        var contentVal = this.editor.get('value');
        if (contentVal === "") {
          contentVal = "<p></p>";
        }
        return contentVal;
      },
      //for old version update
      _setWidthForOldVersion: function() {
        var def = new Deferred();
        var size = this.config.splash.size;
        var isOldVersion = ("wh" === size.mode && typeof size.wh !== "undefined" && null === size.wh.h);
        if (true === isOldVersion) {
          return utils.getEditorContentHeight(this.config.splash.splashContent, this.domNode, {
            "contentWidth": 600 - 40,
            "contentMarginTop": 20,//contentMarginTop
            "footerHeight": 88 + 10//contentMarginBottom
          }).then(
            lang.hitch(this, function(h) {
              size.wh.h = h;
              return h;
            }));
        } else {
          def.resolve();
          return def;
        }
      },
      _selectItem: function(name) {
        var _radio = this[name];
        if (_radio && _radio.check) {
          _radio.check(true);
        }
      },

      resize: function() {
        var wapperBox = html.getContentBox(this.editorContainer);
        var iFrame = query('.dijitEditorIFrameContainer', this.editorContainer)[0];
        var headBox;
        if (this.editor && this.editor.header) {
          headBox = html.getContentBox(this.editor.header);
        }
        if (iFrame && wapperBox && headBox) {
          html.setStyle(iFrame, 'height', wapperBox.h - headBox.h - 4 + "px");
        }
      }
    });
  });