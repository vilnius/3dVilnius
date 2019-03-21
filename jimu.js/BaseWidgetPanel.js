// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/html dijit/_WidgetBase dijit/_Container ./dijit/LoadingIndicator ./BaseWidgetFrame ./utils".split(" "),function(h,e,d,f,k,l,g,m,n){return h([k,l],{baseClass:"jimu-panel jimu-container",started:!1,state:"closed",windowState:"normal",moveTopOnActive:!0,openAnimation:null,closeAnimation:null,animationDuration:0,startup:function(){this.inherited(arguments);this.loadAllWidgetsInOrder();this.started=!0},loadAllWidgetsInOrder:function(){var a=
this.getAllWidgetConfigs(),a=Array.isArray(this.config.widgets)?this.config.widgets:[this.config];d.forEach(a,function(a){var c,b;!1!==a.visible&&(b=new g,c=this.createFrame(a),this.addChild(c),c.setLoading(b),this.widgetManager.loadWidget(a).then(e.hitch(this,function(a){c.setWidget(a);a.startup()})))},this)},getAllWidgetConfigs:function(){var a=[];return a=Array.isArray(this.config.widgets)?this.config.widgets:[this.config]},getWidgetById:function(a){for(var b=this.getChildren(),c=0;c<b.length;c++)if(b[c].getWidget()&&
b[c].getWidget().id===a)return b[c].getWidget()},createFrame:function(a){return new m},setPosition:function(a,b){this.position=a;var c=n.getPositionStyle(this.position);c.position="absolute";b||(b="map"===a.relativeTo?this.sceneView.map.id:window.jimuConfig.layoutId);this.started?this.resize():this.openAnimation&&(c.display="none");f.place(this.domNode,b);f.setStyle(this.domNode,c)},getPosition:function(){return this.position},setState:function(a){this.state=a},setWindowState:function(a){this.windowState=
a},resize:function(){this.getChildren().forEach(function(a){a.resize()})},onPositionChange:function(a){this.setPosition(a)},onOpen:function(){d.forEach(this.getChildren(),function(a){a.getWidget()&&this.widgetManager.openWidget(a.getWidget())},this)},onClose:function(){d.forEach(this.getChildren(),function(a){a.getWidget()&&this.widgetManager.closeWidget(a.getWidget())},this)},onMaximize:function(){d.forEach(this.getChildren(),function(a){a.getWidget()&&this.widgetManager.maximizeWidget(a.getWidget())},
this)},onMinimize:function(){d.forEach(this.getChildren(),function(a){a.getWidget()&&this.widgetManager.minimizeWidget(a.getWidget())},this)},onNormalize:function(){d.forEach(this.getChildren(),function(a){a.getWidget()&&this.widgetManager.normalizeWidget(a.getWidget())},this)},onActive:function(){},onDeActive:function(){},updateConfig:function(a){this._updateConfig(a)},reloadWidget:function(a){this.isWidgetInPanel(a)&&(this._updateConfig(a),this.getChildren().forEach(function(b){b.getWidget()&&b.getWidget().id===
a.id&&(b.getWidget().destroy(),b.setLoading(new g),this.widgetManager.loadWidget(a).then(e.hitch(this,function(a){b.setWidget(a);a.startup();"closed"===this.state&&this.widgetManager.closeWidget(a)})))},this))},isWidgetInPanel:function(a){return d.some(this.getAllWidgetConfigs(),function(b){if(a.id===b.id)return!0})?!0:!1},_updateConfig:function(a){if(Array.isArray(this.config.widgets)){for(var b=-1,c=0;c<this.config.widgets.length;c++)this.config.widgets[c].id===a.id&&(b=c);0<b&&(this.config.widgets[b]=
a)}else this.config=a},destroy:function(){this.getChildren().forEach(function(a){try{a.domNode&&a.destroy()}catch(b){console.error("destroy widget frame error."+b.stack)}});this.inherited(arguments)}})});