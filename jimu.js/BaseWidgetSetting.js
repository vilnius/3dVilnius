// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define(["dojo/_base/declare","dojo/_base/lang","dojo/on","dijit/_WidgetBase","dijit/_TemplatedMixin"],function(a,b,c,d,e){return a([d,e],{templateString:"\x3cdiv\x3e\x3c/div\x3e",postCreate:function(){this.own(c(window,"resize",b.hitch(this,this._onWindowResize)))},getConfig:function(){},resize:function(){},_onWindowResize:function(){this.resize()}})});