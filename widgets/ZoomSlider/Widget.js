// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
require({cache:{"widgets/ZoomSlider/_build-generate_module":function(){define(["dojo/text!./css/style.css","dojo/i18n!./nls/strings"],function(){})},"url:widgets/ZoomSlider/css/style.css":".jimu-widget-zoom{border: 0; font-size: 14px;}.jimu-widget-zoom .esri-zoom.esri-widget{background-color: transparent;}.jimu-widget-zoom .esri-zoom .esri-widget{width: 32px; height: 32px; border: 1px solid rgba(0, 0, 0, 0.3); border-radius: 0 !important; -webkit-border-radius: 0 !important; -moz-border-radius: 0 !important; -o-border-radius: 0 !important; background-color: #fff; opacity: 0.8; color: rgba(0, 0, 0, 0.8);}.jimu-widget-zoom .esri-icon-plus, .jimu-widget-zoom .esri-icon-minus{line-height: 32px;}.jimu-widget-zoom .esri-zoom .esri-widget:hover{opacity: 1;}.jimu-widget-zoom .esri-zoom-out{border-top: 0 !important;}.LaunchpadTheme .jimu-widget-zoom .esri-widget-button:last-child{margin-top: 5px;}",
"*now":function(a){a(['dojo/i18n!*preload*widgets/ZoomSlider/nls/Widget*["ar","bs","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]'])}}});
define(["dojo/_base/declare","jimu/BaseWidget","esri/widgets/Zoom","esri/widgets/Zoom/ZoomViewModel"],function(a,b,c,d){return a([b],{name:"ZoomSlider",baseClass:"jimu-widget-zoom",templateString:"\x3cdiv\x3e\x3cdiv data-dojo-attach-point\x3d'zoomDiv'\x3e\x3c/div\x3e\x3c/div\x3e",postCreate:function(){this.inherited(arguments);this.zoom=new c({container:this.zoomDiv,viewModel:new d({view:this.sceneView})})},destroy:function(){this.zoom&&this.zoom.destroy();this.inherited(arguments)}})});