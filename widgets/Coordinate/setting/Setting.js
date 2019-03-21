// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

require({cache:{"widgets/Coordinate/setting/Edit":function(){define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/_base/array dijit/_WidgetsInTemplateMixin jimu/BaseWidgetSetting ./CameraUnits jimu/dijit/CheckBox dojo/text!./Edit.html jimu/SpatialReference/srUtils dijit/form/ValidationTextBox dijit/form/Select".split(" "),function(k,b,e,n,q,m,p,h,f,c){var d=[{value:"",label:"Default",selected:!0,disabled:!1},{value:"",label:"",selected:!0,disabled:!1},{value:"INCHES",label:"Inches",selected:!1,
disabled:!1},{value:"FOOT",label:"Foot",selected:!1,disabled:!1},{value:"YARDS",label:"Yards",selected:!1,disabled:!1},{value:"MILES",label:"Miles",selected:!1,disabled:!1},{value:"NAUTICAL_MILES",label:"Nautical_Miles",selected:!1,disabled:!1},{value:"MILLIMETERS",label:"Millimeters",selected:!1,disabled:!1},{value:"CENTIMETERS",label:"Centimeters",selected:!1,disabled:!1},{value:"METER",label:"Meter",selected:!1,disabled:!1},{value:"KILOMETERS",label:"Kilometers",selected:!1,disabled:!1},{value:"DECIMETERS",
label:"Decimeters",selected:!1,disabled:!1},{value:"",label:"",selected:!0,disabled:!1},{value:"DECIMAL_DEGREES",label:"Decimal_Degrees",selected:!1,disabled:!1},{value:"DEGREE_MINUTE_SECONDS",label:"Degree_Minutes_Seconds",selected:!1,disabled:!1},{value:"",label:"",selected:!0,disabled:!1},{value:"MGRS",label:"MGRS",selected:!1,disabled:!1},{value:"USNG",label:"USNG",selected:!1,disabled:!1}];return k([m,q],{baseClass:"jimu-coordinate-edit",templateString:f,currentWkid:null,version:null,enhanceVersion:10.1,
_config:null,postCreate:function(){this.inherited(arguments);this.transformForward=new h({label:this.nls.forward,checked:!1},this.transformForward);this.version<this.enhanceVersion?(e.setStyle(this.olderVersionDiv,"display","block"),e.setStyle(this.enhanceVersionDiv,"display","none")):(e.setStyle(this.olderVersionDiv,"display","none"),e.setStyle(this.enhanceVersionDiv,"display","block"));e.setStyle(this.transformDiv,"display","none");e.setStyle(this.transformForward.domNode,"display","none");this.wkid.set("missingMessage",
this.nls.warning);this.transformationWkid.set("missingMessage",this.nls.tfWarning);this.elevationUnits=new p({title:this.nls.elevationUnit,nls:this.nls},this.elevationUnitsNode);this.elevationUnits.startup();this.eyeAltUnits=new p({title:this.nls.eyeAltUnit,nls:this.nls},this.eyeAltUnitsNode);this.eyeAltUnits.startup()},setConfig:function(a){this._config=b.clone(a);c.loadResource().then(b.hitch(this,function(){a.wkid&&(this.wkid.set("value",parseInt(a.wkid,10)),this.currentWkid=parseInt(a.wkid,10),
this._adjustUnitOption());a.label&&(this.wkidLabel.innerHTML=a.label);a.outputUnit&&this.outputUnit.set("value",a.outputUnit);a.transformationWkid&&this.transformationWkid.set("value",parseInt(a.transformationWkid,10));a.transformationLabel&&(this.transformationLabel.innerHTML=a.transformationLabel);a.transformForward&&this.transformForward.setValue(a.transformForward);a.elevationUnit&&this.elevationUnits.setConfig(a.elevationUnit);a.eyeAltUnit&&this.eyeAltUnits.setConfig(a.eyeAltUnit)}),b.hitch(this,
function(a){console.error(a)}))},getConfig:function(){var a={wkid:c.standardizeWkid(this.wkid.get("value")),label:this.wkidLabel.innerHTML,outputUnit:this.outputUnit.get("value"),transformationWkid:parseInt(this.transformationWkid.get("value"),10),transformationLabel:this.transformationLabel.innerHTML,transformForward:this.transformForward.getValue(),elevationUnit:this.elevationUnits.getConfig(),eyeAltUnit:this.eyeAltUnits.getConfig()};a.outputUnit=a.outputUnit||c.getCSUnit(a.wkid);var b={sameSRWithMap:c.isSameSR(a.wkid,
this.sceneView.spatialReference.wkid),isGeographicCS:c.isGeographicCS(a.wkid),isGeographicUnit:c.isGeographicUnit(a.outputUnit),isProjectedCS:c.isProjectedCS(a.wkid),isProjectUnit:c.isProjectUnit(a.outputUnit),spheroidCS:c.isProjectedCS(a.wkid)?c.getGeoCSByProj(a.wkid):a.wkid,defaultUnit:c.getCSUnit(a.wkid),unitRate:c.getUnitRate(c.getCSUnit(a.wkid),a.outputUnit)};b.isGeographicUnit&&b.isProjectedCS&&(b.unitRate=1);a.options=b;return a},_removeGeoUnits:function(){n.forEach(c.getGeographicUnits(),
b.hitch(this,function(a){this.outputUnit.removeOption(a)}))},_removeProjUnits:function(){n.forEach(c.getProjectUnits(),b.hitch(this,function(a){this.outputUnit.removeOption(a)}))},_removeAllUnits:function(){for(var a=0,b=d.length;a<b;a++)this.outputUnit.removeOption(d[a].value)},_addAllUnits:function(){for(var a=0,c=d.length;a<c;a++){var e=b.clone(d[a]);e.label=this.nls[d[a].label];this.outputUnit.addOption(e)}},_adjustUnitOption:function(){if(this.currentWkid===this.sceneView.spatialReference.wkid){if(c.isWebMercator(this.currentWkid))return;
4326===this.currentWkid?this._removeProjUnits():c.isGeographicCS(this.currentWkid)?this._removeProjUnits():c.isProjectedCS(this.currentWkid)&&(this._removeGeoUnits(),this.outputUnit.removeOption("USNG"),this.outputUnit.removeOption("MGRS"))}else c.isGeographicCS(this.currentWkid)&&this._removeProjUnits();this._config.outputUnit&&this.outputUnit.set("value",this._config.outputUnit)},_isDefaultSR:function(){var a=this.wkid.get("value");return c.isSameSR(a,this.sceneView.spatialReference.wkid)},onWkidChange:function(a){var b=
"",d=parseInt(a,10);this.popup.disableButton(0);c.isValidWkid(d)?(b=c.getSRLabel(d),this.wkidLabel.innerHTML=b,c.isSameSpheroid(d,this.sceneView.spatialReference.wkid)?(this.transformationWkid.set("value",""),e.setStyle(this.transformDiv,"display","none")):e.setStyle(this.transformDiv,"display","block"),this.popup.enableButton(0)):a&&(this.wkid.set("value",""),this.wkidLabel.innerHTML=this.nls.cName);this.currentWkid!==d&&this.transformationWkid.set("value","");this.currentWkid=d;this._removeAllUnits();
this._addAllUnits();this._adjustUnitOption();this.outputUnit.closeDropDown()},ontfWkidChange:function(a){if(a){var b="",d="";a=parseInt(a,10);c.isValidTfWkid(a)?(b=a,d=c.getTransformationLabel(a),this.transformationLabel.innerHTML=d,e.setStyle(this.transformForward.domNode,"display","block")):(this.transformationLabel.innerHTML=this.nls.tName,e.setStyle(this.transformForward.domNode,"display","none"));this.transformationWkid.set("value",b)}else this.transformationLabel.innerHTML=this.nls.tName,e.setStyle(this.transformForward.domNode,
"display","none")}})})},"widgets/Coordinate/setting/CameraUnits":function(){define("dojo/_base/declare dojo/_base/html dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./CameraUnits.html dijit/form/Select".split(" "),function(k,b,e,n,q,m){return k([e,n,q],{templateString:m,postCreate:function(){this.inherited(arguments);this.titleNode.innerHTML=this.title;b.setAttr(this.titleNode,"title",this.title);b.setAttr(this.fieldset,"id",this.id);b.setAttr(this.metric,"name",
this.id);b.setAttr(this.metric,"id",this.id+"-metric");b.setAttr(this.metricLabel,"for",this.id+"-metric");b.setAttr(this.english,"name",this.id);b.setAttr(this.english,"id",this.id+"-english");b.setAttr(this.englishLabel,"for",this.id+"-english")},setConfig:function(b){b||(b="metric");this._selectItem(b)},getConfig:function(){var b="";this.metric.get("checked")?b="metric":this.english.get("checked")&&(b="english");return b},_selectItem:function(b){this[b]&&this[b].setChecked&&this[b].setChecked(!0)}})})},
"jimu/SpatialReference/srUtils":function(){define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred dojo/promise/all dojo/request esri/SpatialReference ./unitUtils".split(" "),function(k,b,e,n,q,m,p,h){var f=null,c=null,d=!1,a=k(null,function(){});k=require.toUrl("jimu");var r=m(k+"/SpatialReference/cs.json",{handleAs:"json"}),t=m(k+"/SpatialReference/transform.json",{handleAs:"json"});a.loadResource=function(){var a=new n;if(f&&c)return a.resolve(),a;q([r,t]).then(function(l){f=
l[0];c=l[1];d=!0;a.resolve()},function(l){console.error(l);d=!1;a.reject(l)});return a};a.getAllCSUnits=function(){if(d){var a=[];e.forEach(f.wkids,b.hitch(this,function(l){l=this.getCSUnit(l);-1===e.indexOf(a,l)&&a.push(l)}));return a}};a.convertUnit=function(a,b,c){if(d)return h.convertUnit(a,b,c)};a.getUnitRate=function(a,b){if(d)return h.getUnitRate(a,b)};a.isProjectUnit=function(a){if(d)return h.isProjectUnit(a)};a.isGeographicUnit=function(a){if(d)return h.isGeographicUnit(a)};a.getGeographicUnits=
function(){if(d)return h.getGeographicUnits()};a.getProjectUnits=function(){if(d)return h.getProjectUnits()};a.getCSUnit=function(a){if(d)return a=e.indexOf(f.wkids,a),f.units[a]};a.isSameSR=function(a,b){if(d)return a=this.indexOfWkid(a),b=this.indexOfWkid(b),f.labels[a]===f.labels[b]};a.isValidWkid=function(a){if(d)return-1<this.indexOfWkid(a)};a.getSRLabel=function(a){if(d&&this.isValidWkid(a))return a=this.indexOfWkid(a),f.labels[a]};a.indexOfWkid=function(a){if(d)return e.indexOf(f.wkids,a)};
a.isWebMercator=function(a){return p.prototype._isWebMercator?p.prototype._isWebMercator.apply({wkid:parseInt(a,10)},[]):(new p(parseInt(a,10))).isWebMercator()};a.standardizeWkid=function(a){return this.isWebMercator(a)?3857:parseInt(a,10)};a.isValidTfWkid=function(a){if(d)return-1<this.indexOfTfWkid(a)};a.getTransformationLabel=function(a){if(d)return this.isValidTfWkid(a)?(a=this.indexOfTfWkid(a),c.labels[a]):""};a.indexOfTfWkid=function(a){if(d)return e.indexOf(c.tfWkids,a)};a.isGeographicCS=
function(a){if(d)return this.isValidWkid(a)?(a=this.indexOfWkid(a),!f.projSR[a]):!1};a.isProjectedCS=function(a){if(d)return this.isValidWkid(a)?(a=this.indexOfWkid(a),f.projSR[a]):!1};a.getGeoCSByProj=function(a){if(d&&this.isProjectedCS(a))return a=this.indexOfWkid(a),f.spheroids[a]};a.getSpheroidStr=function(b){if(d)return this.isGeographicCS(b)?f.labels[this.indexOfWkid(b)]:this.isProjectedCS(b)?(b=a.getGeoCSByProj(b),f.labels[this.indexOfWkid(b)]):null};a.isSameSpheroid=function(a,b){if(d)return a=
this.getSpheroidStr(a),b=this.getSpheroidStr(b),a&&b&&a===b?!0:!1};return a})},"widgets/Coordinate/setting/_build-generate_module":function(){define(["dojo/text!./Setting.html","dojo/text!./css/style.css","dojo/i18n!./nls/strings"],function(){})},"url:widgets/Coordinate/setting/CameraUnits.html":'\x3cdiv class\x3d"unit-type"\x3e\r\n  \x3ctd class\x3d"display"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"titleNode" class\x3d"unit-label"\x3e\x3c/div\x3e\r\n  \x3c/td\x3e\r\n  \x3ctd class\x3d"units"\x3e\r\n    \x3cfieldset id\x3d"unit-type" data-dojo-attach-point\x3d"fieldset"\x3e\r\n      \x3cdiv class\x3d"unit-item" data-dojo-attach-point\x3d"metricNode"\x3e\r\n        \x3cinput data-dojo-type\x3d"dijit/form/RadioButton" name\x3d"" id\x3d"" data-dojo-attach-point\x3d"metric" checked\x3d"checked" /\x3e\r\n        \x3clabel data-dojo-attach-point\x3d"metricLabel" for\x3d"" title\x3d${nls.metric}\x3e${nls.metric}\x3c/label\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"unit-item" data-dojo-attach-point\x3d"englishNode"\x3e\r\n        \x3cinput data-dojo-type\x3d"dijit/form/RadioButton" name\x3d"" id\x3d"" data-dojo-attach-point\x3d"english" /\x3e\r\n        \x3clabel data-dojo-attach-point\x3d"englishLabel" for\x3d"" title\x3d${nls.english}\x3e${nls.english}\x3c/label\x3e\r\n      \x3c/div\x3e\r\n    \x3c/fieldset\x3e\r\n  \x3c/td\x3e\r\n\x3c/div\x3e',
"url:widgets/Coordinate/setting/Edit.html":'  \x3cdiv style\x3d"width:100%"\x3e\r\n    \x3cdiv class\x3d"output-wkid edit-module" data-dojo-attach-point\x3d"outputDiv"\x3e\r\n      \x3ctable cellspacing\x3d"0"\x3e\r\n        \x3ctbody\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd\x3e\r\n              \x3cdiv class\x3d"wkid-header"\x3e\r\n                \x3cspan\x3e${nls.output}\x3c/span\x3e\r\n                \x3ca href\x3d"https://developers.arcgis.com/javascript/jshelp/ref_coordsystems.html" target\x3d"blank"\x3eWKID\x3c/a\x3e\r\n              \x3c/div\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd\x3e\r\n              \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" required\x3d"true"\r\n            placeHolder\x3d"WKID" data-dojo-attach-event\x3d"onChange:onWkidChange"\r\n            data-dojo-attach-point\x3d"wkid" data-dojo-props\x3d\'style:{width:"100%"}\' /\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd\x3e\r\n              \x3cspan class\x3d"wkid-label" data-dojo-attach-point\x3d"wkidLabel"\x3e${nls.cName}\x3c/span\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n        \x3c/tbody\x3e\r\n      \x3c/table\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"display-units edit-module camera-units" data-dojo-attach-point\x3d"displayUnits"\x3e\r\n      \x3ctable cellspacing\x3d"0"\x3e\r\n        \x3ctbody\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd class\x3d"display"\x3e\r\n              \x3cspan title\x3d"${nls.units}"\x3e${nls.units}\x3c/span\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"units"\x3e\r\n              \x3cselect data-dojo-attach-point\x3d"outputUnit" data-dojo-props\x3d\'style:{width:"462px"}\' data-dojo-type\x3d"dijit/form/Select"\x3e\r\n                \x3coption value\x3d""\x3e${nls.Default}\x3c/option\x3e\r\n                \x3coption type\x3d"separator"\x3e\x3c/option\x3e\r\n                \x3coption value\x3d"INCHES"\x3e${nls.Inches}\x3c/option\x3e\r\n                \x3coption value\x3d"FOOT"\x3e${nls.Foot}\x3c/option\x3e\r\n                \x3coption value\x3d"YARDS"\x3e${nls.Yards}\x3c/option\x3e\r\n                \x3coption value\x3d"MILES"\x3e${nls.Miles}\x3c/option\x3e\r\n                \x3coption value\x3d"NAUTICAL_MILES"\x3e${nls.Nautical_Miles}\x3c/option\x3e\r\n                \x3coption value\x3d"MILLIMETERS"\x3e${nls.Millimeters}\x3c/option\x3e\r\n                \x3coption value\x3d"CENTIMETERS"\x3e${nls.Centimeters}\x3c/option\x3e\r\n                \x3coption value\x3d"METER"\x3e${nls.Meter}\x3c/option\x3e\r\n                \x3coption value\x3d"KILOMETERS"\x3e${nls.Kilometers}\x3c/option\x3e\r\n                \x3coption value\x3d"DECIMETERS"\x3e${nls.Decimeters}\x3c/option\x3e\r\n                \x3coption type\x3d"separator"\x3e\x3c/option\x3e\r\n                \x3coption value\x3d"DECIMAL_DEGREES"\x3e${nls.Decimal_Degrees}\x3c/option\x3e\r\n                \x3coption value\x3d"DEGREE_MINUTE_SECONDS"\x3e${nls.Degree_Minutes_Seconds}\x3c/option\x3e\r\n                \x3coption type\x3d"separator"\x3e\x3c/option\x3e\r\n                \x3coption value\x3d"MGRS"\x3e${nls.MGRS}\x3c/option\x3e\r\n                \x3coption value\x3d"USNG"\x3e${nls.USNG}\x3c/option\x3e\r\n              \x3c/select\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n        \x3c/tbody\x3e\r\n      \x3c/table\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"display-units edit-module camera-units"\x3e\r\n      \x3ctable cellspacing\x3d"0"\x3e\r\n        \x3ctbody\x3e\r\n          \x3ctr\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"elevationUnitsNode" class\x3d"camera-units"\x3e\x3c/div\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"eyeAltUnitsNode" class\x3d"camera-units"\x3e\x3c/div\x3e\r\n          \x3c/tr\x3e\r\n        \x3c/tbody\x3e\r\n      \x3c/table\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"enhanceVersionDiv"\x3e\r\n      \x3cdiv class\x3d"datum-wkid edit-module" data-dojo-attach-point\x3d"transformDiv"\x3e\r\n        \x3ctable cellspacing\x3d"0"\x3e\r\n          \x3ctbody\x3e\r\n            \x3ctr\x3e\r\n              \x3ctd\x3e\r\n                \x3cdiv class\x3d"wkid-header"\x3e\r\n                  \x3cspan\x3e${nls.datum}\x3c/span\x3e\r\n                  \x3ca href\x3d"http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000r8000000" target\x3d"blank"\x3eTFWKID\x3c/a\x3e\r\n                \x3c/div\x3e\r\n              \x3c/td\x3e\r\n            \x3c/tr\x3e\r\n            \x3ctr\x3e\r\n              \x3ctd\x3e\r\n                \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" required\x3d"true" placeHolder\x3d"${nls.tWKIDPlaceHolder}"\r\n              data-dojo-attach-point\x3d"transformationWkid" data-dojo-attach-event\x3d"onChange:ontfWkidChange" data-dojo-props\x3d\'style:{width:"100%"}\' /\x3e\r\n              \x3c/td\x3e\r\n            \x3c/tr\x3e\r\n            \x3ctr\x3e\r\n              \x3ctd\x3e\r\n                \x3cspan class\x3d"wkid-label" data-dojo-attach-point\x3d"transformationLabel"\x3e${nls.tName}\x3c/span\x3e\r\n              \x3c/td\x3e\r\n            \x3c/tr\x3e\r\n          \x3c/tbody\x3e\r\n        \x3c/table\x3e\r\n        \x3cdiv class\x3d"check" data-dojo-attach-point\x3d"transformForward"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"older-version" data-dojo-attach-point\x3d"olderVersionDiv"\x3e${nls.olderVersion}\x3c/div\x3e\r\n  \x3c/div\x3e',
"url:widgets/Coordinate/setting/Setting.html":'\x3cdiv class\x3d"jimu-widget-coordinate-setting"\x3e\r\n  \x3cdiv class\x3d"settings-section" data-dojo-attach-point\x3d"searchesSection"\x3e\r\n    \x3cp\x3e${nls.state}\x3c/p\x3e\r\n    \x3cdiv class\x3d"add-output-coordinate" data-dojo-attach-event\x3d"onclick: onAddClick"\x3e\r\n      \x3cspan class\x3d"add-output-coordinate-icon"\x3e\x3c/span\x3e\r\n      \x3cspan class\x3d"add-output-coordinate-label"\x3e${nls.add}\x3c/span\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"coordinate-table" data-dojo-attach-point\x3d"tableCoordinate"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"displayNumber" class\x3d"display-number"\x3e\r\n      \x3cdiv\x3e\r\n        \x3cspan class\x3d"spinner-label ops-label"\x3e${nls.spinnerLabel}\x3c/span\x3e\r\n        \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/NumberSpinner" value\x3d"3" data-dojo-attach-point\x3d"latLonDecimalPlaces" data-dojo-props\x3d"constraints: {min:0}"\x3e\r\n        \x3cspan class\x3d"demical-place"\x3e${nls.decimalPlace}\x3c/span\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"decimal-row"\x3e\r\n        \x3cspan class\x3d"decimal-label ops-label"\x3e${nls.eyeDecimalLabel}\x3c/span\x3e\r\n        \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/NumberSpinner" value\x3d"3" data-dojo-attach-point\x3d"eyeDecimalPlaces" data-dojo-props\x3d"constraints: {min:0}"\x3e\r\n        \x3cspan class\x3d"demical-place"\x3e${nls.decimalPlace}\x3c/span\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"separator"\x3e\r\n        \x3cdiv class\x3d"check" data-dojo-attach-point\x3d"separator"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv class\x3d"displayOrder clearFix"\x3e\r\n      \x3cspan class\x3d"jimu-float-leading displayOrderTips"\x3e${nls.displayOrderLonLatTips}\x3c/span\x3e\r\n      \x3cspan class\x3d"order"\x3e\r\n        \x3cdiv class\x3d"jimu-float-leading order-btn"\x3e\r\n          \x3cinput data-dojo-type\x3d"dijit/form/RadioButton" data-dojo-attach-point\x3d"lonLat" id\x3d"lonLat"/\x3e\r\n          \x3clabel for\x3d"lonLat"\x3e${nls.lonLatTips}\x3c/label\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"jimu-float-leading order-btn"\x3e\r\n          \x3cinput data-dojo-type\x3d"dijit/form/RadioButton" data-dojo-attach-point\x3d"latLon" id\x3d"latLon"/\x3e\r\n          \x3clabel for\x3d"latLon"\x3e${nls.latLonTips}\x3c/label\x3e\r\n        \x3c/div\x3e\r\n      \x3c/span\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
"url:widgets/Coordinate/setting/css/style.css":'.jimu-widget-coordinate-setting .clearFix {*overflow: hidden; *zoom: 1;}.jimu-widget-coordinate-setting .clearFix:after {display: table; content: ""; width: 0; clear: both;}.jimu-widget-coordinate-setting{margin:0; padding:0; font-size: 14px; padding-top: 20px; color: #596679;}.jimu-widget-coordinate-setting .dijitSelect{height: 30px; width: 100%;}.jimu-widget-coordinate-setting .dijitArrowButtonContainer{width: 17px;}.jimu-widget-coordinate-setting .zoom-scale-table{margin-top:12px;}.jimu-widget-coordinate-setting .settings-section p{font-size: 14px; margin-bottom: 20px;}.jimu-widget-coordinate-setting .add-output-coordinate{margin-bottom: 7px; cursor: pointer; display: inline-block;}.jimu-widget-coordinate-setting .add-output-coordinate-icon{background-image: url(images/add_icon.png); background-repeat: no-repeat; background-position: center; width: 14px; height: 14px; display: inline-block; vertical-align: middle;}.jimu-widget-coordinate-setting .add-output-coordinate-label{font-size: 14px; color: #518dca; margin-left: 10px; display: inline-block; height: 100%; text-decoration: underline;}.jimu-widget-coordinate-setting .wkid, .jimu-widget-coordinate-setting .transformationWkid,.jimu-widget-coordinate-setting .actions{width: 120px;}.jimu-widget-coordinate-setting .coordinate-table{height: 186px;}.jimu-widget-coordinate-setting .display-number,.jimu-widget-coordinate-setting .separator{margin-top: 10px;}.jimu-widget-coordinate-setting .display-number .decimal-row{margin-top: 8px;}.jimu-widget-coordinate-setting .display-number .ops-label{min-width: 150px; display: inline-block;}.jimu-widget-coordinate-setting .display-number .dijitNumberTextBox {width: 70px;}.jimu-coordinate-edit{width: 100%; font-size: 16px; color: #596679;}.jimu-coordinate-edit table{width: calc(100% - 2px) !important;}.jimu-coordinate-edit .wkid-header{margin: 0 0 10px;}.jimu-coordinate-edit .check{margin-top: 10px;}.jimu-coordinate-edit .label{font-size: 14px;}.jimu-coordinate-edit .wkid-label{font-size: 14px; font-style: italic; color: #a0acbf; width: 100%; display: inline-block; margin-top: 5px;}.jimu-coordinate-edit .edit-module{margin-bottom: 10px;}.jimu-coordinate-edit .edit-module:last-child{margin-bottom: 0;}.jimu-coordinate-edit .display-units .display{width: 20%; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}.jimu-coordinate-edit .older-version{font-size: 14px; font-style: italic; color: #e84b4b;}.jimu-widget-coordinate-setting{width:100%; height:100%;}.jimu-widget-coordinate-setting .displayOrder{margin-top: 16px;}.jimu-widget-coordinate-setting .displayOrder .displayOrderTips{margin-right: 10px;}.jimu-rtl .jimu-widget-coordinate-setting .displayOrder .displayOrderTips{margin-left: 10px; margin-right: auto;}.jimu-widget-coordinate-setting .displayOrder .order-btn{margin: 0 10px 0 10px;}.jimu-coordinate-edit .camera-units{}.jimu-coordinate-edit .camera-units .unit-type{margin: 10px 0;}.jimu-coordinate-edit .camera-units .unit-label{width: 20%; display: inline-block;}.jimu-coordinate-edit .camera-units .unit-type fieldset{display: inline-block;}.jimu-coordinate-edit .camera-units .unit-item{display: inline-block; margin-right: 10px;}.jimu-rtl .jimu-coordinate-edit .camera-units .unit-item{margin-right: auto; margin-left: 10px;}',
"*now":function(k){k(['dojo/i18n!*preload*widgets/Coordinate/setting/nls/Setting*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'])}}});
define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/on dojo/aspect dojo/query dojo/keys dojo/json esri/request jimu/BaseWidgetSetting dijit/_WidgetsInTemplateMixin jimu/dijit/SimpleTable jimu/dijit/Message jimu/dijit/Popup jimu/dijit/CheckBox jimu/dijit/LoadingShelter jimu/portalUtils ./Edit jimu/SpatialReference/srUtils jimu/dijit/RadioBtn dojo/NodeList-dom dijit/form/NumberSpinner dijit/form/NumberTextBox".split(" "),function(k,b,e,n,q,m,p,h,f,c,d,a,r,t,l,u,v,w,g){return k([c,d],{baseClass:"jimu-widget-coordinate-setting",
edit:null,popup:null,popupState:"",editTr:null,gsVersion:0,postCreate:function(){this.inherited(arguments);this.separator=new l({label:this.nls.separator,checked:!1},this.separator);this.shelter1=new u({hidden:!0});this.shelter1.placeAt(this.domNode);this.shelter1.startup();this.shelter2=new u({hidden:!0});this.shelter2.placeAt(this.domNode);this.shelter2.startup()},startup:function(){this.inherited(arguments);this.outputCoordinateTable=new a({autoHeight:!1,fields:[{name:"id",title:this.nls.id,type:"text",
unique:!0,hidden:!0,editable:!1},{name:"wkid",title:this.nls.wkid,type:"text","class":"wkid",hidden:!0,editable:!1},{name:"label",title:this.nls.label,type:"text",editable:!1},{name:"outputUnit",title:this.nls.output,type:"text",hidden:!0,editable:!1},{name:"transformationWkid",title:this.nls.transformationWkid,type:"text","class":"transformationWkid",editable:!1,hidden:!0},{name:"transformationLabel",title:this.nls.transformationLabel,type:"text",editable:!1,hidden:!0},{name:"transformForward",title:this.nls.transformForward,
type:"checkbox",editable:!1,hidden:!0},{name:"options",title:"options",type:"text",editable:!1,hidden:!0},{name:"elevationUnit",title:"elevationUnit",type:"text",editable:!1,hidden:!0},{name:"eyeAltUnit",title:"eyeAltUnit",type:"text",editable:!1,hidden:!0},{name:"actions",title:this.nls.actions,type:"actions","class":"actions",actions:["edit","up","down","delete"]}],selectable:!1});e.setStyle(this.outputCoordinateTable.domNode,"height","100%");this.outputCoordinateTable.placeAt(this.tableCoordinate);
this.outputCoordinateTable.startup();this.own(n(this.outputCoordinateTable,"actions-edit",b.hitch(this,"onEditClick")));this.setConfig(this.config);this._initOrderLonLatRadioBtns();this._getGeometryServiceVersion()},setConfig:function(a){this.config=a;this.outputCoordinateTable.clear();this.shelter1.show();g.loadResource().then(b.hitch(this,function(){if(a.spatialReferences&&a.spatialReferences.length){for(var b=[],d=a.spatialReferences.length,c=0;c<d;c++){var x=parseInt(a.spatialReferences[c].wkid,
10);b.push({id:c,wkid:g.standardizeWkid(x),label:a.spatialReferences[c].label,outputUnit:a.spatialReferences[c].outputUnit,elevationUnit:a.spatialReferences[c].elevationUnit,eyeAltUnit:a.spatialReferences[c].eyeAltUnit,transformationWkid:a.spatialReferences[c].transformationWkid,transformationLabel:a.spatialReferences[c].transformationLabel,transformForward:a.spatialReferences[c].transformForward,options:h.stringify(a.spatialReferences[c].options)})}this.outputCoordinateTable.addRows(b)}else this._addMapCoordinate()}),
b.hitch(this,function(a){console.error(a)})).always(b.hitch(this,function(){this.shelter1.hide()}));isFinite(parseInt(a.latLonDecimalPlaces,10))&&this.latLonDecimalPlaces.set("value",parseInt(a.latLonDecimalPlaces,10));isFinite(parseInt(a.eyeDecimalPlaces,10))&&this.eyeDecimalPlaces.set("value",parseInt(a.eyeDecimalPlaces,10));a.addSeparator&&this.separator.setValue(a.addSeparator)},_getGeometryServiceVersion:function(){this.shelter2.show();if(esriConfig.defaults.geometryService&&esriConfig.defaults.geometryService.url){var a=
esriConfig.defaults.geometryService.url,a=a.slice(0,a.indexOf("/Geometry/"));f({url:a,handleAs:"json",callbackParamName:"callback",content:{f:"json"}}).then(b.hitch(this,function(a){console.log(a);a&&a.currentVersion&&(this.gsVersion=parseFloat(a.currentVersion))}),b.hitch(this,function(a){console.error(a)})).always(b.hitch(this,function(){this.shelter2.hide()}))}else this.shelter2.hide(),new r({message:this.nls.getVersionError})},_addMapCoordinate:function(){var a=this.sceneView.spatialReference.wkid;
v.getUnits(this.appConfig.portalUrl).then(b.hitch(this,function(b){if(g.isValidWkid(a)){var c={wkid:g.standardizeWkid(a),label:g.getSRLabel(parseInt(a,10))};g.isProjectedCS(c.wkid)?c.outputUnit="english"===b?"FOOT":"METER":c.outputUnit=c.outputUnit||g.getCSUnit(c.wkid);b={sameSRWithMap:g.isSameSR(c.wkid,this.sceneView.spatialReference.wkid),isGeographicCS:g.isGeographicCS(c.wkid),isGeographicUnit:g.isGeographicUnit(c.outputUnit),isProjectedCS:g.isProjectedCS(c.wkid),isProjectUnit:g.isProjectUnit(c.outputUnit),
spheroidCS:g.isProjectedCS(c.wkid)?g.getGeoCSByProj(c.wkid):c.wkid,defaultUnit:g.getCSUnit(c.wkid),unitRate:g.getUnitRate(g.getCSUnit(c.wkid),c.outputUnit)};this.sceneView.spatialReference.isWebMercator&&(b.isGeographicUnit=!0,b.isProjectUnit=!1,b.unitRate=1,c.outputUnit="DECIMAL_DEGREES");c.options=h.stringify(b);this.outputCoordinateTable.addRow(c)}}))},_keepDefaultOnlyEdit:function(){var a=m("."+this.baseClass+" .body-section tr[rowid\x3drow1]")[0];m(".action-item",a).style("display","none");m(".row-edit-div",
a).style("display","block");q.after(this.outputCoordinateTable,"onBeforeRowUp",b.hitch(this,function(a){if(m(".body-section .simple-table-row")[1]===a)return!1}),!0)},onAddClick:function(){this.popupState="ADD";this._openEdit(this.nls.add,{})},onEditClick:function(a){var b=this.outputCoordinateTable.getRowData(a);this.popupState="EDIT";this.editTr=a;this._openEdit(this.nls.edit,b)},_openEdit:function(a,c){this.edit=new w({version:this.gsVersion,sceneView:this.sceneView,nls:this.nls});this.popup=new t({titleLabel:a,
autoHeight:!0,content:this.edit,container:"main-page",width:640,buttons:[{label:this.nls.ok,key:p.ENTER,disable:!0,onClick:b.hitch(this,"_onEditOk")},{label:this.nls.cancel,classNames:["jimu-btn-vacation"],key:p.ESCAPE}],onClose:b.hitch(this,"_onEditClose")});this.edit.setConfig(c||{});e.addClass(this.popup.domNode,"widget-setting-popup");this.edit.startup()},_onEditOk:function(){var a=this.edit.getConfig(),b=null;a.wkid=g.standardizeWkid(a.wkid);a.options=h.stringify(a.options);"ADD"===this.popupState?
b=this.outputCoordinateTable.addRow(a):"EDIT"===this.popupState&&(b=this.outputCoordinateTable.editRow(this.editTr,a));b.success?(this.popup.close(),this.popupState="",this.editTr=null):new r({message:a.wkid+this.nls[b.errorCode]})},_onEditClose:function(){this.popup=this.edit=null},getConfig:function(){for(var a=this.outputCoordinateTable.getData(),b=[],c=a.length,d=0;d<c;d++)delete a[d].id,a[d].options=h.parse(a[d].options),b.push(a[d]);this.config.spatialReferences=b;this.config.latLonDecimalPlaces=
this.latLonDecimalPlaces.get("value");this.config.eyeDecimalPlaces=this.eyeDecimalPlaces.get("value");this.config.addSeparator=this.separator.getValue();return this.config},_initOrderLonLatRadioBtns:function(){this.own(n(this.lonLat,"click",b.hitch(this,function(){this.config.displayOrderLonLat=!0})));this.own(n(this.latLon,"click",b.hitch(this,function(){this.config.displayOrderLonLat=!1})));this.config.displayOrderLonLat?(this.lonLat.set("checked",!0),this.config.displayOrderLonLat=!0):(this.latLon.set("checked",
!0),this.config.displayOrderLonLat=!1)}})});