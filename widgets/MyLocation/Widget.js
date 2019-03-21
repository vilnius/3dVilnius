// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

require({cache:{"esri/layers/GraphicsLayer":function(){define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/tsSupport/assignHelper ../core/promiseUtils ../core/accessorSupport/decorators ./Layer ./mixins/ScaleRangeLayer ../support/GraphicsCollection ../symbols/support/ElevationInfo".split(" "),function(t,v,g,b,l,k,f,p,u,m,n){return function(d){function a(a){a=d.call(this)||this;a.elevationInfo=null;a.graphics=new m.default;a.screenSizePerspectiveEnabled=
!0;a.type="graphics";return a}g(a,d);a.prototype.destroy=function(){this.removeAll()};a.prototype.add=function(a){this.graphics.add(a);return this};a.prototype.addMany=function(a){this.graphics.addMany(a);return this};a.prototype.removeAll=function(){this.graphics.removeAll();return this};a.prototype.remove=function(a){this.graphics.remove(a)};a.prototype.removeMany=function(a){this.graphics.removeMany(a)};a.prototype.importLayerViewModule=function(a){switch(a.type){case "2d":return k.create(function(a){return t(["../views/2d/layers/GraphicsLayerView2D"],
a)});case "3d":return k.create(function(a){return t(["../views/3d/layers/GraphicsLayerView3D"],a)})}};a.prototype.graphicChanged=function(a){this.emit("graphic-update",a)};b([f.property({type:n})],a.prototype,"elevationInfo",void 0);b([f.property(m.graphicsCollectionProperty)],a.prototype,"graphics",void 0);b([f.property({type:["show","hide"]})],a.prototype,"listMode",void 0);b([f.property()],a.prototype,"screenSizePerspectiveEnabled",void 0);b([f.property({readOnly:!0})],a.prototype,"type",void 0);
return a=b([f.subclass("esri.layers.GraphicsLayer")],a)}(f.declared(p,u))})},"esri/widgets/Locate":function(){define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper dojo/i18n!../nls/common dojo/i18n!./Locate/nls/Locate ../core/accessorSupport/decorators ./Widget ./Locate/LocateViewModel ./support/widget".split(" "),function(t,v,g,b,l,k,f,p,u,m){return function(n){function d(a){a=n.call(this)||this;a.geolocationOptions=null;a.goToLocationEnabled=null;a.goToOverride=
null;a.graphic=null;a.iconClass="esri-icon-north-navigation";a.label=k.widgetLabel;a.scale=null;a.useHeadingEnabled=null;a.view=null;a.viewModel=new u;return a}g(d,n);d.prototype.cancelLocate=function(){};d.prototype.locate=function(){};d.prototype.render=function(){var a,b,d=this.get("viewModel.state"),e="locating"===d,q=(a={},a["esri-disabled"]="disabled"===d,a["esri-hidden"]="feature-unsupported"===d,a);a=(b={},b["esri-icon-loading-indicator"]=e,b["esri-rotating"]=e,b["esri-icon-locate"]=!e,b);
b="locating"===d?l.cancel:k.title;return m.tsx("div",{bind:this,class:this.classes("esri-locate esri-widget--button esri-widget",q),hidden:"feature-unsupported"===d,onclick:this._locate,onkeydown:this._locate,role:"button",tabIndex:0,"aria-label":b,title:b},m.tsx("span",{"aria-hidden":"true",class:this.classes("esri-icon",a)}),m.tsx("span",{class:"esri-icon-font-fallback-text"},k.title))};d.prototype._locate=function(){var a=this.viewModel;"locating"===a.state?a.cancelLocate():a.locate()};b([f.aliasOf("viewModel.geolocationOptions")],
d.prototype,"geolocationOptions",void 0);b([f.aliasOf("viewModel.goToLocationEnabled")],d.prototype,"goToLocationEnabled",void 0);b([f.aliasOf("viewModel.goToOverride")],d.prototype,"goToOverride",void 0);b([f.aliasOf("viewModel.graphic")],d.prototype,"graphic",void 0);b([f.property()],d.prototype,"iconClass",void 0);b([f.property()],d.prototype,"label",void 0);b([f.aliasOf("viewModel.scale")],d.prototype,"scale",void 0);b([f.aliasOf("viewModel.useHeadingEnabled")],d.prototype,"useHeadingEnabled",
void 0);b([f.aliasOf("viewModel.view")],d.prototype,"view",void 0);b([f.property({type:u}),m.renderable("viewModel.state"),m.vmEvent(["locate","locate-error"])],d.prototype,"viewModel",void 0);b([f.aliasOf("viewModel.cancelLocate")],d.prototype,"cancelLocate",null);b([f.aliasOf("viewModel.locate")],d.prototype,"locate",null);b([m.accessibleHandler()],d.prototype,"_locate",null);return d=b([f.subclass("esri.widgets.Locate")],d)}(f.declared(p))})},"esri/widgets/Locate/LocateViewModel":function(){define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper dojo/i18n!./nls/Locate ../../PopupTemplate ../../core/Error ../../core/geolocationUtils ../../core/Handles ../../core/promiseUtils ../../core/watchUtils ../../core/accessorSupport/decorators ../Popup/actions ../support/GeolocationPositioning".split(" "),
function(t,v,g,b,l,k,f,p,u,m,n,d,a,w){var h={title:l.currentLocation,fieldInfos:[{fieldName:"timestamp",label:l.timestamp,format:{dateFormat:"short-date-short-time"}},{fieldName:"latitude",label:l.latitude,format:{places:4,digitSeparator:!0}},{fieldName:"longitude",label:l.longitude,format:{places:4,digitSeparator:!0}},{fieldName:"accuracy",label:l.accuracy,format:{places:0,digitSeparator:!0}},{fieldName:"altitude",label:l.altitude,format:{places:0,digitSeparator:!0}},{fieldName:"altitudeAccuracy",
label:l.altitudeAccuracy,format:{places:0,digitSeparator:!0}},{fieldName:"heading",label:l.heading,format:{places:0,digitSeparator:!0}},{fieldName:"speed",label:l.speed,format:{places:0,digitSeparator:!0}}],actions:[a.removeSelectedFeature.clone()],content:[{type:"fields"}]};return function(e){function q(r){var c=e.call(this,r)||this;c._handles=new u;c.locate=c.locate.bind(c);c.graphic&&(c.graphic.popupTemplate=new k(h));c._handles.add(n.on(c,"view.popup","trigger-action",function(r){return a.triggerAction({event:r,
view:c.view})}));return c}g(q,e);q.prototype.destroy=function(){this._handles.destroy();this._handles=null;this._cancelLocate()};Object.defineProperty(q.prototype,"state",{get:function(){return this._geolocationUsable?this.get("view.ready")?this._locating?"locating":"ready":"disabled":"feature-unsupported"},enumerable:!0,configurable:!0});q.prototype.locate=function(){var a=this;if("disabled"===this.state)return m.reject(new f("locate:disabled-state","Cannot locate when disabled."));if("feature-unsupported"===
this.state)return m.reject(new f("locate:feature-unsupported-state","Cannot locate in unsecure domain."));this._cancelLocate();this.notifyChange("state");var c=p.getCurrentPosition(this.geolocationOptions).then(function(r){return a._setPosition(r)}).then(function(r){a.view.graphics.remove(a.graphic);a.graphic&&(a.graphic=a.graphic.clone(),a.view.graphics.push(a.graphic));a.emit("locate",{position:r});return r}),e=!1;c.catch(function(r){a.emit("locate-error",{error:r})}).then(function(){a._locating=
null;a.notifyChange("state");e=!0});e||(this._locating=c,this.notifyChange("state"));return c};q.prototype.cancelLocate=function(){this._cancelLocate()};q.prototype._cancelLocate=function(){var a=this._locating;a&&a.cancel();this._locating=null};b([d.property({dependsOn:["view.ready"],readOnly:!0})],q.prototype,"state",null);b([d.property()],q.prototype,"locate",null);b([d.property()],q.prototype,"cancelLocate",null);return q=b([d.subclass("esri.widgets.Locate.LocateViewModel")],q)}(d.declared(w))})},
"esri/core/geolocationUtils":function(){define("require exports ./tsSupport/assignHelper ../config ./Error ./has ./Logger ./promiseUtils ../geometry/Point ../geometry/support/webMercatorUtils ../portal/Portal ../tasks/GeometryService ../tasks/support/ProjectParameters".split(" "),function(t,v,g,b,l,k,f,p,u,m,n,d,a){function w(r,c){if(!c)return p.resolve(r);var e=c.spatialReference;return e.isWGS84?p.resolve(r):e.isWebMercator?p.resolve(m.geographicToWebMercator(r)):h().then(function(c){if(!c)return p.reject(new l("geometry-service:missing-url",
"Geometry service URL is missing"));c=new d({url:c});var b=new a({geometries:[r],outSR:e});return c.project(b).then(function(a){return a[0]})})}function h(){if(b.geometryServiceUrl)return p.resolve(b.geometryServiceUrl);var a=n.getDefault();return a.load().catch(function(a){}).then(function(){return a.get("helperServices.geometry.url")})}Object.defineProperty(v,"__esModule",{value:!0});var e=f.getLogger("esri.core.geolocationUtils"),q={maximumAge:0,timeout:15E3,enableHighAccuracy:!0};v.supported=
function(){var a=k("esri-geolocation");a||e.warn("geolocation-unsupported","Geolocation unsupported.");a&&((a=k("esri-secure-context"))||e.warn("insecure-context","Geolocation requires a secure origin."));return a};v.getCurrentPosition=function(a){a||(a=q);var c=p.create(function(c,e){navigator.geolocation.getCurrentPosition(c,e,a)});return p.timeout(c,15E3,void 0)};v.positionToPoint=function(a){var c=a.position;a=a.view;var e=c&&c.coords||{},e={accuracy:e.accuracy,altitude:e.altitude,altitudeAccuracy:e.altitudeAccuracy,
heading:e.heading,latitude:e.latitude,longitude:e.longitude,speed:e.speed},c=c?{coords:e,timestamp:c.timestamp}:c;c=(c=c&&c.coords)?new u({longitude:c.longitude,latitude:c.latitude,z:c.altitude||null,spatialReference:{wkid:4326}}):null;return w(c,a)}})},"esri/widgets/support/GeolocationPositioning":function(){define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../Graphic ../../core/Accessor ../../core/Error ../../core/Evented ../../core/geolocationUtils ../../core/promiseUtils ../../core/accessorSupport/decorators ../../symbols/PictureMarkerSymbol ./GoTo".split(" "),
function(t,v,g,b,l,k,f,p,u,m,n,d,a){return function(a){function h(){var e=null!==a&&a.apply(this,arguments)||this;e._geolocationUsable=!0;e._iconPath=t.toUrl("../../images/support/sdk_gps_location.png");e.geolocationOptions=null;e.goToLocationEnabled=!0;e.graphic=new l({symbol:new d({url:e._iconPath,width:21,height:21})});e.scale=null;e.useHeadingEnabled=!0;e.view=null;return e}g(h,a);h.prototype.initialize=function(){u.supported()||(this._geolocationUsable=!1)};h.prototype.destroy=function(){this._clear();
this.view=null};h.prototype._clear=function(){this.view&&this.view.graphics.remove(this.graphic)};h.prototype._getScaleWithinConstraints=function(a,b){return b?"2d"===b.type?(b=b.constraints,Math.min(b.effectiveMinScale,Math.max(b.effectiveMaxScale,a))):a:a};h.prototype._getScale=function(a){var e=this.scale;return this._getScaleWithinConstraints("number"===typeof e?e:2500,a)};h.prototype._getHeading=function(a,b){b=b.spatialReference;a=a.coords&&a.coords.heading;if(!(!b||!b.isWebMercator&&!b.isWGS84||
"number"!==typeof a||0>a||360<a))return a};h.prototype._addHeading=function(a){var b=a.heading,e=a.target;(a=a.view)&&"number"===typeof b&&("3d"===a.type?e.heading=b:"2d"===a.type&&(e.rotation=360-b))};h.prototype._animatePoint=function(a,b,r){if(!this.goToLocationEnabled)return m.resolve(b);var c=this.view,e=this.useHeadingEnabled?this._getHeading(b,c):void 0;a={target:a,scale:r};this._addHeading({heading:e,target:a,view:c});return this.callGoTo({target:a}).then(function(){return b})};h.prototype._setPosition=
function(a){var b=this;return u.positionToPoint({position:a,view:this.view}).then(function(e){var c=b.graphic,d=a.coords,d={timestamp:a.timestamp,accuracy:d.accuracy,altitude:d.altitude,altitudeAccuracy:d.altitudeAccuracy,heading:d.heading,latitude:d.latitude,longitude:d.longitude,speed:d.speed};c&&(c.geometry=e,c.attributes=d);c=b._getScale(b.view);return b._animatePoint(e,a,c)}).catch(function(){return m.reject(new f("positioning:invalid-point","Cannot position invalid point"))})};b([n.property()],
h.prototype,"geolocationOptions",void 0);b([n.property()],h.prototype,"goToLocationEnabled",void 0);b([n.property()],h.prototype,"graphic",void 0);b([n.property()],h.prototype,"scale",void 0);b([n.property()],h.prototype,"useHeadingEnabled",void 0);b([n.property()],h.prototype,"view",void 0);return h=b([n.subclass("esri.widgets.support.GeolocationPositioning")],h)}(n.declared(k,p,a))})},"widgets/MyLocation/_build-generate_module":function(){define(["dojo/text!./css/style.css","dojo/i18n!./nls/strings"],
function(){})},"url:widgets/MyLocation/css/style.css":'.jimu-widget-mylocation {background-color: #fff; opacity: 0.8; color: rgba(0, 0, 0, 0.8);}.jimu-widget-mylocation:hover {opacity: 1;}.jimu-widget-mylocation.nohttps:hover{opacity: 0.8;}.jimu-widget-mylocation.onCenter {background-color: #000;}.jimu-widget-mylocation .esri-locate-node {display: none;}.jimu-widget-mylocation .place-holder {width: 32px; height: 32px; background-color: #666; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: pointer; border: 1px solid rgba(0, 0, 0, 0.3); text-align: center; line-height: 30px; font-size: 14px; background-position: center center; background-repeat: no-repeat;}.jimu-widget-mylocation .place-holder:before {font-family: \'Themefont\'; content: "\\a907";}.jimu-widget-mylocation .place-holder.locating:before {content: "";}.jimu-widget-mylocation .place-holder.locating {background-image: url("images/loading_black.gif"); background-repeat: no-repeat; background-position: center;}.jimu-widget-mylocation .place-holder.nohttps{color: #bcbcbc;}.jimu-widget-mylocation .place-holder.tracking:before {content: "\\a913" !important; color: rgba(255, 255, 255, 0.8);}.jimu-widget-mylocation .place-holder {background-color: rgba(0, 0, 0, 0);}.jimu-widget-mylocation.onCenter .place-holder {color: #fff;}.jimu-widget-mylocation.onLocate .place-holder {background-color: rgba(0, 0, 0, 0.4);}',
"*now":function(t){t(['dojo/i18n!*preload*widgets/MyLocation/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","vi","uk","zh-hk","zh-tw","ROOT"]'])}}});
define("dojo/_base/declare jimu/BaseWidget dojo/_base/html dojo/on dojo/when dojo/_base/lang esri/layers/GraphicsLayer esri/widgets/Locate esri/widgets/Locate/LocateViewModel esri/symbols/PictureMarkerSymbol esri/geometry/Point esri/geometry/SpatialReference esri/geometry/support/webMercatorUtils esri/tasks/support/ProjectParameters esri/Graphic esri/config jimu/utils".split(" "),function(t,v,g,b,l,k,f,p,u,m,n,d,a,w,h,e,q){t=t([v],{name:"MyLocation",baseClass:"jimu-widget-mylocation",startup:function(){this.inherited(arguments);
this.placehoder=g.create("div",{"class":"place-holder",title:this.label},this.domNode);this.isNeedHttpsButNot=q.isNeedHttpsButNot();!0===this.isNeedHttpsButNot?(console.log("LocateButton::navigator.geolocation requires a secure origin."),g.addClass(this.domNode,"nohttps"),g.addClass(this.placehoder,"nohttps"),g.setAttr(this.placehoder,"title",this.nls.httpNotSupportError)):window.navigator.geolocation?this.own(b(this.placehoder,"click",k.hitch(this,this.onLocationClick))):g.setAttr(this.placehoder,
"title",this.nls.browserError)},onLocationClick:function(){g.hasClass(this.domNode,"onCenter")||g.hasClass(this.domNode,"locating")?(g.removeClass(this.domNode,"onCenter"),g.removeClass(this.placehoder,"tracking"),this._destroyGeoLocate()):(this._createGeoLocate(),this.geoLocate.viewModel.locate(),g.addClass(this.placehoder,"locating"))},onLocate:function(a){g.removeClass(this.placehoder,"locating");this.graphicsLayer.removeAll();this.geoLocate.viewModel.tracking&&g.addClass(this.placehoder,"tracking");
if(a.error)this.onLocateError(a.error);else g.addClass(this.domNode,"onCenter"),this.neverLocate=!1,this._pointMarkerManualy(a)},onLocateError:function(a){console.error(a.error);g.removeClass(this.placehoder,"locating");g.removeClass(this.domNode,"onCenter");g.removeClass(this.placehoder,"tracking")},_createGeoLocate:function(){var a=this.config.locateButton,c={maximumAge:0,timeout:15E3,enableHighAccuracy:!0};a.geolocationOptions&&k.mixin(c,a.geolocationOptions);this.graphicsLayer=new f;this.sceneView.map.add(this.graphicsLayer);
var e=g.create("div",{"class":"esri-locate-node"},this.domNode);this.geoLocate=new p({viewModel:new u({view:this.sceneView,graphicsLayer:this.graphicsLayer,geolocationOptions:c,locationSymbolEnabled:a.highlightLocation,scale:a.scale,tracking:a.useTracking,clearOnTrackingStopEnabled:!1}),container:e,visible:!1});this.geoLocate.startup();this.geoLocate.own(b(this.geoLocate.viewModel,"locate",k.hitch(this,this.onLocate)));this.geoLocate.own(b(this.geoLocate.viewModel,"locate-error",k.hitch(this,this.onLocateError)))},
_destroyGeoLocate:function(){this.graphicsLayer&&(this.graphicsLayer.removeAll(),this.sceneView.map.remove(this.graphicsLayer));this.geoLocate&&(this.geoLocate.viewModel.graphicsLayer.removeAll(),this.geoLocate.destroy());this.geoLocate=null},destroy:function(){this._destroyGeoLocate();this.inherited(arguments)},_pointMarkerManualy:function(a){"undefined"!==typeof this.config.locateButton.highlightLocation&&!1!==this.config.locateButton.highlightLocation&&(this.highlightSymbol=new m({url:this.folderUrl+
"css/images/sdk_gps_location.png",size:28,width:28,height:28,xoffset:14,yoffset:14}),a=new n({longitude:a.position.coords.longitude,latitude:a.position.coords.latitude,spatialReference:new d({wkid:4326})}),this._project(a).then(k.hitch(this,function(a){a=new h({geometry:a[0],symbol:this.highlightSymbol});this.config.locateButton.highlightLocation&&this.graphicsLayer.add(a)}),k.hitch(this,function(a){this.onLocateError(a)})))},_project:function(b){var c=this.sceneView.spatialReference;if(b.spatialReference.equals(c))return l([b]);
if(a.canProject(b,c))return l([a.project(b,c)]);var d=new w;d.geometries=[b];d.outSR=c;return e.geometryService.project(d)}});t.inPanel=!1;t.hasUIFile=!1;return t});