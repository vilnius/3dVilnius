// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
require({cache:{"dijit/_WidgetsInTemplateMixin":function(){define(["dojo/_base/array","dojo/aspect","dojo/_base/declare","dojo/_base/lang","dojo/parser"],function(m,k,l,d,h){return l("dijit._WidgetsInTemplateMixin",null,{_earlyTemplatedStartup:!1,contextRequire:null,_beforeFillContent:function(){if(/dojoType|data-dojo-type/i.test(this.domNode.innerHTML)){var t=this.domNode;this.containerNode&&!this.searchContainerNode&&(this.containerNode.stopParser=!0);h.parse(t,{noStart:!this._earlyTemplatedStartup,
template:!0,inherited:{dir:this.dir,lang:this.lang,textDir:this.textDir},propsThis:this,contextRequire:this.contextRequire,scope:"dojo"}).then(d.hitch(this,function(f){this._startupWidgets=f;for(var d=0;d<f.length;d++)this._processTemplateNode(f[d],function(f,e){return f[e]},function(f,e,d){return e in f?f.connect(f,e,d):f.on(e,d,!0)});this.containerNode&&this.containerNode.stopParser&&delete this.containerNode.stopParser}));if(!this._startupWidgets)throw Error(this.declaredClass+": parser returned unfilled promise (probably waiting for module auto-load), unsupported by _WidgetsInTemplateMixin.   Must pre-load all supporting widgets before instantiation.");
}},_processTemplateNode:function(d,f,h){return f(d,"dojoType")||f(d,"data-dojo-type")?!0:this.inherited(arguments)},startup:function(){m.forEach(this._startupWidgets,function(d){d&&!d._started&&d.startup&&d.startup()});this._startupWidgets=null;this.inherited(arguments)}})})},"esri/layers/GraphicsLayer":function(){define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/tsSupport/assignHelper ../core/tsSupport/generatorHelper ../core/tsSupport/awaiterHelper ../core/promiseUtils ../core/accessorSupport/decorators ./Layer ./mixins/ScaleRangeLayer ../support/GraphicsCollection ../symbols/support/ElevationInfo".split(" "),
function(m,k,l,d,h,t,f,q,n,e,b,p,u){return function(e){function b(a){a=e.call(this)||this;a.elevationInfo=null;a.graphics=new p.default;a.screenSizePerspectiveEnabled=!0;a.type="graphics";return a}l(b,e);b.prototype.destroy=function(){this.removeAll()};b.prototype.add=function(a){this.graphics.add(a);return this};b.prototype.addMany=function(a){this.graphics.addMany(a);return this};b.prototype.removeAll=function(){this.graphics.removeAll();return this};b.prototype.remove=function(a){this.graphics.remove(a)};
b.prototype.removeMany=function(a){this.graphics.removeMany(a)};b.prototype.on=function(a,g){return this.inherited(arguments)};b.prototype.importLayerViewModule=function(a){return f(this,void 0,void 0,function(){return t(this,function(g){switch(a.type){case "2d":return[2,q.create(function(a){return m(["../views/2d/layers/GraphicsLayerView2D"],a)})];case "3d":return[2,q.create(function(a){return m(["../views/3d/layers/GraphicsLayerView3D"],a)})]}return[2]})})};b.prototype.graphicChanged=function(a){this.emit("graphic-update",
a)};d([n.property({type:u})],b.prototype,"elevationInfo",void 0);d([n.property(p.graphicsCollectionProperty)],b.prototype,"graphics",void 0);d([n.property({type:["show","hide"]})],b.prototype,"listMode",void 0);d([n.property()],b.prototype,"screenSizePerspectiveEnabled",void 0);d([n.property({readOnly:!0})],b.prototype,"type",void 0);return b=d([n.subclass("esri.layers.GraphicsLayer")],b)}(n.declared(b.ScaleRangeLayer(e)))})},"widgets/3DFx/VizCards/VizCards":function(){define("dojo/Evented dojo/_base/declare dojo/_base/array dojo/_base/Color dojo/_base/lang dojo/_base/html dojo/dom-class dojo/dom-construct dojo/dom-style dojo/number dojo/on dojo/query dojox/gfx dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./templates/VizCards.html".split(" "),
function(m,k,l,d,h,t,f,q,n,e,b,p,u,v,x,a){return k("VizCards",[v,x,m],{declaredClass:"esri.widgets.VizCards",templateString:a,css:{root:"esri-viz-cards",content:"content"},constructor:function(a,c){this.rtl=!1;this.options={view:null,features:[],vizField:null,displayField:null,color:"#ff0000",showPercent:!1};h.mixin(this.options,a);this.domNode=c;this._currentSelectedCardNode=null},postCreate:function(){this.inherited(arguments);0<p(".dj_rtl").length&&(this.rtl=!0);this.own(b(this.contentNode,"click",
h.hitch(this,this._clickCard)))},startup:function(){this.inherited(arguments);this._updateCards()},destroy:function(){this.view=null;this.inherited(arguments)},clear:function(){this.containerNode.innerHTML=""},update:function(a){h.mixin(this.options,a);this._updateCards()},selectCard:function(a){var c=this.domNode.id+"_card_"+a;this.unselectCards();if(c=p("#"+c,this.domNode)[0])f.add(c,"selected"),this._currentSelectedCardNode=c;var c=t.getContentBox(this.containerNode).w,g=180*a-c/2+90;this.rtl&&
(g=180*(this.options.features.length-a)-c/2-90);0>g&&(g=0);this.containerNode.scrollLeft=g},unselectCards:function(){this._currentSelectedCardNode&&(f.remove(this._currentSelectedCardNode,"selected"),this._currentSelectedCardNode=null)},_getTotal:function(){var a=this.options.vizField,c=0;l.forEach(this.options.features,function(g){c+=g.attributes[a]});return c},_updateCards:function(){var a=this.contentNode;n.set(a,"color",this.options.color);var c=this.options.features,b=this._getTotal();a.innerHTML=
"";var w=0;this.rtl&&(w=180*c.length);this.containerNode.scrollLeft=w;n.set(a,"width",180*c.length+"px");for(var w=c.length,d=null,r,h,k=null,p=this.options.showPercent&&400>=w,l=0;l<w;l++){d=c[l];r=d.attributes;d=r[this.options.vizField];h=e.format(d);k||(k=Math.floor(150/h.length+3),10>k&&(k=10),60<k&&(k=60));var m=r[this.options.displayField];null!==d&&(r=q.create("div",{id:this.domNode.id+"_card_"+l},a),f.add(r,"card"),m=q.create("div",{innerHTML:l+1+". "+m},r),f.add(m,"header"),h=q.create("div",
{innerHTML:h},r),p?(f.add(h,"value"),h=parseInt(d/b*100,10),m=h+"%",0<d&&1>h&&(m="\x3c1%"),r=q.create("div",{},r),f.add(r,"area"),d=q.create("div",{},r),f.add(d,"chart"),r=q.create("div",{innerHTML:m},r),f.add(r,"pct"),this._createChart(d,h)):(f.add(h,"valueBig"),n.set(h,"fontSize",k+"px")))}},_createChart:function(a,c){var g=t.getContentBox(a),b=Math.min(g.w,g.h),g=b/2,e=b/2,f=g-3;a=u.createSurface(a,b,b);a.clear();a.createCircle({cx:g,cy:e,r:f}).setStroke({width:6,color:d.fromArray([255,255,255,
.15]),cap:"round"});0<c&&(100<=c&&(c=99),b=360*c/100,c=!1,180<=b&&(c=!0),b=this._getEndPoint(f,b,g,e),e-=f,a.createPath().moveTo(g,e).arcTo(f,f,0,c,!0,b.x,b.y).setStroke({width:6,color:this.options.color,cap:"round"}))},_getEndPoint:function(a,c,b,d){var g=c;0<c&&90>c?g+=270:90<c&&(g=c-90);c=g*Math.PI/180;return{x:b+Math.cos(c)*a,y:d+Math.sin(c)*a}},_clickCard:function(a){a=a.target||a.srcElement;if(!f.contains(a,"card"))for(;a&&a.parentNode&&(a=a.parentNode,!f.contains(a,"card")););if(a){var c=a.id.replace(this.domNode.id+
"_card_",""),c=parseInt(c,10);isNaN(c)||null==c||(f.contains(a,"selected")?(this.unselectCards(),this.emit("selection",{})):(this.unselectCards(),f.add(a,"selected"),this._currentSelectedCardNode=a,this.emit("selection",{data:this.options.features[c]})))}}})})},"dojox/gfx":function(){define(["dojo/_base/lang","./gfx/_base","./gfx/renderer!"],function(m,k,l){k.switchTo(l);return k})},"dojox/gfx/_base":function(){define("dojo/_base/kernel dojo/_base/lang dojo/_base/Color dojo/_base/sniff dojo/_base/window dojo/_base/array dojo/dom dojo/dom-construct dojo/dom-geometry".split(" "),
function(m,k,l,d,h,t,f,q,n){var e=k.getObject("dojox.gfx",!0),b=e._base={};e._hasClass=function(a,g){return(a=a.getAttribute("className"))&&0<=(" "+a+" ").indexOf(" "+g+" ")};e._addClass=function(a,g){var c=a.getAttribute("className")||"";(!c||0>(" "+c+" ").indexOf(" "+g+" "))&&a.setAttribute("className",c+(c?" ":"")+g)};e._removeClass=function(a,g){var c=a.getAttribute("className");c&&a.setAttribute("className",c.replace(new RegExp("(^|\\s+)"+g+"(\\s+|$)"),"$1$2"))};b._getFontMeasurements=function(){var a=
{"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,small:0,medium:0,large:0,"x-large":0,"xx-large":0},g,c;d("ie")&&(c=h.doc.documentElement.style.fontSize||"",c||(h.doc.documentElement.style.fontSize="100%"));var b=q.create("div",{style:{position:"absolute",left:"0",top:"-100px",width:"30px",height:"1000em",borderWidth:"0",margin:"0",padding:"0",outline:"none",lineHeight:"1",overflow:"hidden"}},h.body());for(g in a)b.style.fontSize=g,a[g]=16*Math.round(12*b.offsetHeight/16)/12/1E3;
d("ie")&&(h.doc.documentElement.style.fontSize=c);h.body().removeChild(b);return a};var p=null;b._getCachedFontMeasurements=function(a){if(a||!p)p=b._getFontMeasurements();return p};var u=null,v={};b._getTextBox=function(a,g,c){var b,d,f=arguments.length,e;u||(u=q.create("div",{style:{position:"absolute",top:"-10000px",left:"0",visibility:"hidden"}},h.body()));b=u;b.className="";d=b.style;d.borderWidth="0";d.margin="0";d.padding="0";d.outline="0";if(1<f&&g)for(e in g)e in v||(d[e]=g[e]);2<f&&c&&(b.className=
c);b.innerHTML=a;b.getBoundingClientRect?(d=b.getBoundingClientRect(),d={l:d.left,t:d.top,w:d.width||d.right-d.left,h:d.height||d.bottom-d.top}):d=n.getMarginBox(b);b.innerHTML="";return d};b._computeTextLocation=function(a,g,c,d){var b={};switch(a.align){case "end":b.x=a.x-g;break;case "middle":b.x=a.x-g/2;break;default:b.x=a.x}b.y=a.y-c*(d?.75:1);return b};b._computeTextBoundingBox=function(a){if(!e._base._isRendered(a))return{x:0,y:0,width:0,height:0};var g;g=a.getShape();var c=a.getFont()||e.defaultFont;
a=a.getTextWidth();c=e.normalizedLength(c.size);g=b._computeTextLocation(g,a,c,!0);return{x:g.x,y:g.y,width:a,height:c}};b._isRendered=function(a){for(a=a.parent;a&&a.getParent;)a=a.parent;return null!==a};var x=0;b._getUniqueId=function(){var a;do a=m._scopeName+"xUnique"+ ++x;while(f.byId(a));return a};b._fixMsTouchAction=function(a){a.rawNode.style.touchAction="none"};k.mixin(e,{defaultPath:{type:"path",path:""},defaultPolyline:{type:"polyline",points:[]},defaultRect:{type:"rect",x:0,y:0,width:100,
height:100,r:0},defaultEllipse:{type:"ellipse",cx:0,cy:0,rx:200,ry:100},defaultCircle:{type:"circle",cx:0,cy:0,r:100},defaultLine:{type:"line",x1:0,y1:0,x2:100,y2:100},defaultImage:{type:"image",x:0,y:0,width:0,height:0,src:""},defaultText:{type:"text",x:0,y:0,text:"",align:"start",decoration:"none",rotated:!1,kerning:!0},defaultTextPath:{type:"textpath",text:"",align:"start",decoration:"none",rotated:!1,kerning:!0},defaultStroke:{type:"stroke",color:"black",style:"solid",width:1,cap:"butt",join:4},
defaultLinearGradient:{type:"linear",x1:0,y1:0,x2:100,y2:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultRadialGradient:{type:"radial",cx:0,cy:0,r:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultPattern:{type:"pattern",x:0,y:0,width:0,height:0,src:""},defaultFont:{type:"font",style:"normal",variant:"normal",weight:"normal",size:"10pt",family:"serif"},getDefault:function(){var a={};return function(b){var c=a[b];if(c)return new c;c=a[b]=new Function;c.prototype=
e["default"+b];return new c}}(),normalizeColor:function(a){return a instanceof l?a:new l(a)},normalizeParameters:function(a,b){var c;if(b){var d={};for(c in a)c in b&&!(c in d)&&(a[c]=b[c])}return a},makeParameters:function(a,b){var c=null;if(!b)return k.delegate(a);var d={};for(c in a)c in d||(d[c]=k.clone(c in b?b[c]:a[c]));return d},formatNumber:function(a,b){var c=a.toString();if(0<=c.indexOf("e"))c=a.toFixed(4);else{var d=c.indexOf(".");0<=d&&5<c.length-d&&(c=a.toFixed(4))}return 0>a?c:b?" "+
c:c},makeFontString:function(a){return a.style+" "+a.variant+" "+a.weight+" "+a.size+" "+a.family},splitFontString:function(a){var b=e.getDefault("Font");a=a.split(/\s+/);if(!(5>a.length)){b.style=a[0];b.variant=a[1];b.weight=a[2];var c=a[3].indexOf("/");b.size=0>c?a[3]:a[3].substring(0,c);var d=4;0>c&&("/"==a[4]?d=6:"/"==a[4].charAt(0)&&(d=5));d<a.length&&(b.family=a.slice(d).join(" "))}return b},cm_in_pt:72/2.54,mm_in_pt:7.2/2.54,px_in_pt:function(){return e._base._getCachedFontMeasurements()["12pt"]/
12},pt2px:function(a){return a*e.px_in_pt()},px2pt:function(a){return a/e.px_in_pt()},normalizedLength:function(a){if(0===a.length)return 0;if(2<a.length){var b=e.px_in_pt(),c=parseFloat(a);switch(a.slice(-2)){case "px":return c;case "pt":return c*b;case "in":return 72*c*b;case "pc":return 12*c*b;case "mm":return c*e.mm_in_pt*b;case "cm":return c*e.cm_in_pt*b}}return parseFloat(a)},pathVmlRegExp:/([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,pathSvgRegExp:/([A-DF-Za-df-z])|([-+]?\d*[.]?\d+(?:[eE][-+]?\d+)?)/g,
equalSources:function(a,b){return a&&b&&a===b},switchTo:function(a){var b="string"==typeof a?e[a]:a;b&&(t.forEach("Group Rect Ellipse Circle Line Polyline Image Text Path TextPath Surface createSurface fixTarget".split(" "),function(a){e[a]=b[a]}),"string"==typeof a?e.renderer=a:t.some(["svg","vml","canvas","canvasWithEvents","silverlight"],function(a){return e.renderer=e[a]&&e[a].Surface===e.Surface?a:null}))}});return e})},"dojox/gfx/renderer":function(){define(["./_base","dojo/_base/lang","dojo/_base/sniff",
"dojo/_base/window","dojo/_base/config"],function(m,k,l,d,h){var t=null;l.add("vml",function(d,h,k){k.innerHTML='\x3cv:shape adj\x3d"1"/\x3e';d="adj"in k.firstChild;k.innerHTML="";return d});return{load:function(f,q,n){function e(){q(["dojox/gfx/"+b],function(d){m.renderer=b;t=d;n(d)})}if(t&&"force"!=f)n(t);else{var b=h.forceGfxRenderer;f=!b&&(k.isString(h.gfxRenderer)?h.gfxRenderer:"svg,vml,canvas,silverlight").split(",");for(var p,u;!b&&f.length;)switch(f.shift()){case "svg":"SVGAngle"in d.global&&
(b="svg");break;case "vml":l("vml")&&(b="vml");break;case "silverlight":try{l("ie")?(p=new ActiveXObject("AgControl.AgControl"),p.IsVersionSupported("1.0"))&&(u=!0):navigator.plugins["Silverlight Plug-In"]&&(u=!0)}catch(v){u=!1}finally{p=null}u&&(b="silverlight");break;case "canvas":d.global.CanvasRenderingContext2D&&(b="canvas")}"canvas"===b&&!1!==h.canvasEvents&&(b="canvasWithEvents");h.isDebug&&console.log("gfx renderer \x3d "+b);"svg"==b&&"undefined"!=typeof window.svgweb?window.svgweb.addOnLoad(e):
e()}}}})},"widgets/3DFx/_build-generate_module":function(){define(["dojo/text!./Widget.html","dojo/text!./css/style.css","dojo/i18n!./nls/strings"],function(){})},"url:widgets/3DFx/VizCards/templates/VizCards.html":'\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"${css.root}" role\x3d"presentation"\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"contentNode" class\x3d"${css.content}"\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',"url:widgets/3DFx/Widget.html":'\x3cdiv\x3e\r\n  \x3ccanvas class\x3d"labelCanvas" data-dojo-attach-point\x3d"labelCanvas"\x3e\x3c/canvas\x3e\r\n  \x3cdiv class\x3d"panelBottom"\x3e\r\n    \x3c!--Panel Container --\x3e\r\n    \x3cdiv class\x3d"panelContainer"\x3e\r\n      \x3c!-- Panel Inner --\x3e\r\n      \x3cdiv class\x3d"panelInner"\x3e\r\n        \x3c!-- Panel Content --\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"panelMsgBlock"\x3e\x3c/div\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"panelContent" class\x3d"panelContent"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3c!-- Panel Footer --\x3e\r\n    \x3cdiv class\x3d"panelFooter" data-dojo-attach-point\x3d"footerNode" class\x3d"jimu-main-background"\x3e\r\n      \x3cdiv class\x3d"panelFooterContent"\x3e\r\n        \x3cdiv class\x3d"btnPlay" data-dojo-attach-point\x3d"btnPlay" data-dojo-attach-event\x3d"onclick:_toggleVizTimer"\x3e\x3c/div\x3e\r\n        \x3cdiv class\x3d"panelTitle" data-dojo-attach-point\x3d"titleNode"\x3eTitle\x3c/div\x3e\r\n        \x3cdiv class\x3d"panelPages"\x3e\r\n          \x3cul class\x3d"pages" data-dojo-attach-point\x3d"pages"\x3e\r\n          \x3c/ul\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"btnClose" data-dojo-attach-point\x3d"btnClose" data-dojo-attach-event\x3d"onclick:_close"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
"url:widgets/3DFx/css/style.css":".esri-viz-cards {position: absolute; width: 100%; height: 100%; overflow-x: auto; overflow-y: hidden;}.esri-viz-cards .content {margin: 0; padding: 0; width: auto; height: 100%; white-space: nowrap; overflow: visible;}.esri-viz-cards .card {position: relative; float: left; width: 150px; height: 100%; margin-left: 10px; margin-right: 20px; overflow: hidden; text-overflow: ellipsis; cursor: pointer; display: block;}.dj_rtl .esri-viz-cards .card {float: right;}.esri-viz-cards .card.selected {color: #ffffff;}.esri-viz-cards .header {position: absolute; width: 100%; height: 20px; line-height: 20px; font-size: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.25); overflow: hidden; text-overflow: ellipsis;}.esri-viz-cards .card.selected .header {border-bottom: 1px solid #ffffff;}.esri-viz-cards .value {position: absolute; top: 20px; width: 100%; height: 17px; line-height: 17px; font-size: 12px; overflow: hidden; text-overflow: ellipsis;}.esri-viz-cards .valueBig {position: absolute; top: 20px; width: 100%; height: 60px; line-height: 60px; font-size: 20px; overflow: hidden; text-overflow: ellipsis;}.esri-viz-cards .area {position: absolute; left: 30px; top: 37px; width: 80px; height: 70px; display: block;}.esri-viz-cards .chart {position: absolute; width: 100%; height: 100%; display: block;}.esri-viz-cards .pct {position: absolute; top: 50%; margin-top: -15px; width: 100%; height: 30px; line-height: 30px; font-size: 20px; text-align: center; overflow: hidden; text-overflow: ellipsis;}.esri-viz-cards::-webkit-scrollbar {width: 6px; height: 6px; background-color: rgba(255, 255, 255, 0.25);}.esri-viz-cards::-webkit-scrollbar-thumb {background-color: rgba(255, 255, 255, 0.5);}.esri-viz-cards {scrollbar-base-color: #000000; scrollbar-3dlight-color: #000000; scrollbar-highlight-color: #000000; scrollbar-track-color: #707070; scrollbar-arrow-color: #606060; scrollbar-shadow-color: #000000; scrollbar-dark-shadow-color: #000000; scrollbar-face-color: #606060;}.jimu-widget-viz {color: #ffffff; background-color: rgba(0,0,0,0.8); left: 0px !important; right: 0px !important; bottom: 0px; height: 160px !important; display: block; z-index: 100 !important; overflow: hidden;}.jimu-widget-viz .labelCanvas {position: absolute; top: -50px; height: 50px;}.jimu-widget-viz .panelBottom {position: absolute; width: 100%; height: 160px; left: 0px; top: 0px; color: #ffffff; padding: 0px;}.jimu-widget-viz .panelFooter {position: absolute; bottom: 0px; left: 0px; right: 0px; height: 40px; line-height: 40px; overflow: hidden; background-color: #393939; background-color: rgba(0, 0, 0, 0.25); border-bottom: 1px solid #353535; border-bottom: 1px solid rgba(0, 0, 0, 0.3);}.jimu-widget-viz .panelFooterContent {position: absolute; left: 10px; right: 24px; top: 8px; height: 24px; line-height: 24px; overflow-x: hidden; overflow-y: hidden; display: inline-block; white-space: nowrap; width: auto;}.jimu-rtl .jimu-widget-viz .panelFooterContent {position: absolute; left: 24px; right: 10px;}.jimu-widget-viz .panelTitle {float: left; margin-left: 10px; font-size: 14px;}.jimu-rtl .jimu-widget-viz .panelTitle {float: right; margin-right: 10px;}.jimu-widget-viz .panelPages {float: right;}.jimu-rtl .jimu-widget-viz .panelPages {float: left;}.jimu-widget-viz .pages {list-style-type: none; height: 24px; margin: auto; padding: 2px; display: block; cursor: pointer;}.jimu-widget-viz .pages li {width: 20px; height: 20px; display: inline-block; background: url(images/dot.png); margin: 0;}.jimu-widget-viz .pages li:hover {background: url(images/doton.png);}.jimu-widget-viz .pages li.active {background: url(images/doton.png);}.jimu-widget-viz .btnPlay {float: left; width: 24px; height: 24px; display: block; cursor: pointer; background-image: url('images/play.png'); background-repeat: no-repeat; background-position: center center; background-size: 24px;}.jimu-rtl .jimu-widget-viz .btnPlay {float: right;}.jimu-widget-viz .playing {background-image: url('images/pause.png'); background-repeat: no-repeat; background-position: center center; background-size: 24px;}.jimu-widget-viz .btnClose {position: absolute; left: auto; right: 0px; width: 24px; height: 40px; line-height: 40px; text-align: center; display: block; cursor: pointer; background-image: url('images/x.png'); background-repeat: no-repeat; background-position: center center; background-size: 18px;}.jimu-rtl .jimu-widget-viz .btnClose {position: absolute; left: 0px; right: auto;}.jimu-widget-viz .panelContainer {position: absolute; width: 100%; height: 120px; overflow: hidden; display: block;}.jimu-widget-viz .panelInner {position: absolute; top: 3px; left: 0px; right: 0px; height: 117px; display: block; overflow: hidden;}.jimu-widget-viz .loading {background-image: url('images/loading.gif'); background-repeat: no-repeat; background-position: center 10px;}",
"*now":function(m){m(['dojo/i18n!*preload*widgets/3DFx/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","vi","uk","zh-hk","zh-tw","ROOT"]'])}}});
define("dojo/_base/declare dojo/_base/Color dojo/_base/html dojo/_base/lang dojo/_base/array dojo/_base/xhr dojo/Deferred dojo/dom dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/number dojo/on dojo/query dojo/json dijit/_WidgetsInTemplateMixin esri/request esri/Graphic esri/layers/GraphicsLayer esri/geometry/Point esri/geometry/support/webMercatorUtils esri/symbols/PictureMarkerSymbol esri/symbols/PointSymbol3D esri/symbols/ObjectSymbol3DLayer esri/tasks/QueryTask esri/tasks/support/Query jimu/BaseWidget jimu/dijit/Message jimu/utils jimu/dijit/LoadingShelter fx3d/layers/FxLayer ./VizCards/VizCards dojo/domReady!".split(" "),function(m,
k,l,d,h,t,f,q,n,e,b,p,u,v,x,a,g,c,D,w,E,r,F,G,H,I,J,z,K,y,A,B,C){return m([z,g],{baseClass:"jimu-widget-viz",name:"3DFx",postCreate:function(){this.inherited(arguments);this.vizFeatures=[];this.vizMax=0;this.vizCards=null;this.vizPage=0;this._featuresLoadedDfd=new f;this._sortedFeatures={}},startup:function(){this.inherited(arguments);this.loadingCover=new A({hidden:!0});this.loadingCover.placeAt(this.sceneView.map.id);this.loadingCover.startup();this._getStyleColor();var a=this._getStyleColor();
this.panelMsgBlock.innerHTML="";a.then(d.hitch(this,function(a){a&&(this.config.color=a);this.config.vizLayer&&0!==this.config.vizFields.length?(this.loadingCover.show(),c(this.config.vizLayer.url+"/query",{query:{f:"json",returnGeometry:!1,returnCountOnly:!0,where:"1\x3d1"},callbackParamName:"callback"}).then(d.hitch(this,function(a){a.data.count?400<a.data.count?this.config.showPercent=!1:this.panelMsgBlock.innerHTML="":this.panelMsgBlock.innerHTML="";this._initUI();this._initLayers();this._initViz()}))):
this.panelMsgBlock.innerHTML="\x3cp align\x3d'center'\x3e"+this.nls.viz_error+"\x3c/p\x3e"}))},onOpen:function(){this.inherited(arguments);this.loadingCover.hidden&&this.loadingCover.show();this._styleSync();this._showLayers()},onClose:function(){this._hideLayers();this._stopVizTimer();this.loadingCover.hide();this.vizCards&&this.vizCards.unselectCards();this.inherited(arguments)},onDeActive:function(){},destroy:function(){this._stopVizTimer();this._removeFxLayer();this._sortedFeatures={};this._featuresLoadedDfd=
null;this.loadingCover.destroy();this.inherited(arguments)},_close:function(){this.widgetManager.closeWidget(this.id)},_styleSync:function(){if(this.appConfig.theme.customStyles){var a=this.appConfig.theme.customStyles.mainBackgroundColor;p.set(this.footerNode,"backgroundColor",a);this.vizCards&&p.set(this.vizCards.contentNode,"color",a);this.config.color=a;this._updatePath();this.fxLayer&&this.fxLayer.set("renderingInfo",this._getRenderingInfo())}else this._updateUI(this.appConfig.theme.styles[0])},
onAppConfigChanged:function(a,b,c){this.appConfig=a;if("closed"!=this.state)switch(b){case "styleChange":this._styleSync()}},setPosition:function(a,b){if("BoxTheme"===this.appConfig.theme.name||"DartTheme"===this.appConfig.theme.name||"LaunchpadTheme"===this.appConfig.theme.name)this.inherited(arguments);else{this.position={left:"0px",right:"0px",bottom:"0px",height:"140px"};var c=y.getPositionStyle(this.position);c.position="absolute";b=this.sceneView.map.id;l.place(this.domNode,b);l.setStyle(this.domNode,
c);this.started&&this.resize();"TabTheme"===this.appConfig.theme.name&&(c=this.widgetManager.getControllerWidgets()[0],this.widgetManager.minimizeWidget(c.id))}},_updatePath:function(){this.vizCards&&this.vizCards.update({color:this._getColor()})},_updateUI:function(a){this._getStyleColor(a).then(d.hitch(this,function(){this.fxLayer&&(this._updatePath(),this.fxLayer.set("renderingInfo",this._getRenderingInfo()))}))},_getStyleColor:function(a){return y.getStyleColorInTheme(a)},_initUI:function(){this.vizCards=
new C({view:this.sceneView,showPercent:this.config.showPercent},this.panelContent);this.vizCards.on("selection",d.hitch(this,this._featureSelection));this.vizCards.startup();"global"===this.sceneView.viewingMode?p.set(this.btnPlay,"display","block"):p.set(this.btnPlay,"display","none")},_initLayers:function(){this.sceneView.map.findLayerById(this.config.vizLayer.id).when().then(d.hitch(this,function(a){this.vizLayer=a;this.vizLayerVisibility=a.visible;this.vizLayer.visible=!1;this._addFxLayer()}))},
_getColor:function(){if(this.config.cycleColors){var a=this.vizPage,b=this.config.colors.length;return this.config.colors[a-Math.floor(a/b)*b]}return this.config.color},_getColors:function(){var a=this._getColor(),b=k.fromString("#ffffff"),a=k.fromString(a),c=k.blendColors(a,b,.3),b=k.blendColors(a,b,.8);return[a.toRgb(),c.toRgb(),b.toRgb()]},_getRenderingInfo:function(){var a=this._getColors(),b;switch(this.config.vizType){case "PointExtrude":b={visible:!0,repeat:1,animationInterval:this.config.interval/
1E3,shapeType:"Cylinder",radius:this.config.maxWidth,height:this.config.maxHeight,transparency:100,bottomColor:a[0],topColors:[a[0],a[1]]};break;case "Pulse":b={visible:!0,repeat:1E3,animationInterval:this.config.interval/1E3,shapeType:"Circle",radius:this.config.maxWidth,transparency:80,solidColor:a[0],haloColor:a[1]};break;case "Bounce":b={visible:!0,repeat:1E3,animationInterval:this.config.interval/1E3,dashHeight:this.config.maxHeight,radius:100,transparency:100,haloColors:a};break;case "GridSurface":b=
{visible:!0,repeat:1,animationInterval:this.config.interval/1E3,width:this.config.maxWidth,height:this.config.maxHeight,transparency:60,colors:[a[0],a[1],a[2]]};break;case "Fireball":case "JetTrail":b={visible:!0,repeat:1E3,animationInterval:this.config.interval/1E3,radius:30,transparency:90,colors:[a[0],a[0]]};break;case "AreaExtrude":b={visible:!0,repeat:1,animationInterval:this.config.interval/1E3,height:this.config.maxHeight,transparency:100,bottomColor:a[0],topColors:[a[0],a[1]]}}"JetTrail"==
this.config.vizType&&(b.showEndPoints=this.config.showJetTrailEndPoints);return b},_removeFxLayer:function(){this.fxLayer&&(this.fxLayer.remove(),this.fxLayer=null)},_addFxLayer:function(){this._removeFxLayer();var a=this._getRenderingInfo(),b=[];h.forEach(this.config.vizFields,function(a){b.push(a.field)});this.fxLayer=new B(this.config.vizLayer.url,{vizType:this.config.vizType,vizFields:b,displayField:this.config.displayField,renderingInfo:a});this.fxLayer.on("all-features-loaded",d.hitch(this,
this._allFeaturesLoaded));this.fxLayer.on("selected-feature-from-globe",d.hitch(this,this._selectedFeatureFromGlobe));this.fxLayer.on("abandon-selected-feature",d.hitch(this,this._abandonSelectedFeature));this.fxLayer.on("fx3d-ready",function(){this.loadingCover.hide()}.bind(this));this.fxLayer.watch("visible",d.hitch(this,function(a,b,c,d){!1===a&&this._stopVizTimer()}));this.sceneView.map.add(this.fxLayer)},_selectedFeatureFromGlobe:function(a){this.fxLayer&&this.fxLayer.hideLabel();this._featuresLoadedDfd.then(function(){if(a.selectedFeature){var b=
this._getFeatureIndex(a.selectedFeature);this.vizCards&&this.vizCards.selectCard(b)}}.bind(this))},_abandonSelectedFeature:function(a){this.vizCards&&this.vizCards.unselectCards()},_allFeaturesLoaded:function(a){this._featuresLoadedDfd.resolve();this.vizFeatures=a.graphics;this._setVizPage(0,!0)},_showLayers:function(){this.vizLayer&&(this.vizLayer.visible=!1);this.fxLayer&&(this.fxLayer.visible=!0);this.loadingCover.hide()},_hideLayers:function(){this.vizLayer&&(this.vizLayer.visible=this.vizLayerVisibility);
this.fxLayer&&(this.fxLayer.visible=!1)},_initViz:function(){this._initVizPages()},_initVizPages:function(){var a=this.pages;a.innerHTML="";if(1<this.config.vizFields.length){for(var b=0;b<this.config.vizFields.length;b++){var c=this.config.vizFields[b],c=e.create("li",{id:this.id+"-page"+b,title:c.label||c.alias},a);v(c,"click",d.hitch(this,this._setVizPage,b))}n.add("page0","active")}this.vizPage=0},_setVizPage:function(a,b){this.loadingCover.hidden&&this.loadingCover.show();this._featuresLoadedDfd.then(function(){var c=
this.id+"-page"+this.vizPage,d=this.id+"-page"+a;q.byId(c)&&n.remove(c,"active");this.vizPage=a;q.byId(d)&&n.add(d,"active");setTimeout(function(){this._processViz(b)}.bind(this),300)}.bind(this))},_toggleVizTimer:function(){this.playing?this._stopVizTimer():this._startVizTimer()},_startVizTimer:function(){this._stopVizTimer();this.vizTimer=setInterval(d.hitch(this,this._doViz),10*this.config.interval);this.fxLayer&&(this.fxLayer.visible=!0,this.fxLayer.startSpinning());this.playing=!0;n.add(this.btnPlay,
"playing")},_stopVizTimer:function(){this.vizTimer&&(clearInterval(this.vizTimer),this.vizTimer=null);this.fxLayer&&this.fxLayer.pauseSpinning();this.playing=!1;this.btnPlay&&n.remove(this.btnPlay,"playing")},_doViz:function(){var a=this.vizPage+1;a>=this.config.vizFields.length&&(a=0);this._setVizPage(a)},_processViz:function(a){var b=this.config.vizFields[this.vizPage],c=b.field,d=this.config.displayField;this.titleNode.innerHTML=b.label||b.alias;if(this.fxLayer&&!0!==a){var e=this._getRenderingInfo();
this.fxLayer.when().then(function(){this.fxLayer.switchVizField(c,e)}.bind(this))}a=this._sortedFeatures[c];a||(a=h.filter(this.vizFeatures,function(a){return null!=a.attributes[c]?!0:!1}),0<a.length&&(a.sort(function(a,b){return a.attributes[c]<b.attributes[c]?1:a.attributes[c]>b.attributes[c]?-1:0}),h.forEach(a,function(a,b){a.attributes.index=b}),this.vizMax=a[0].attributes[c]),this._sortedFeatures[c]=a);this.filteredFeatures=a;d={features:a,vizField:c,displayField:d,color:this._getColor()};this.vizCards.update(d);
this.loadingCover.hide()},_featureSelection:function(a){a.data?(a=a.data,this.playing&&this._stopVizTimer(),this.fxLayer&&this.fxLayer.showLabel(a)):this.fxLayer&&this.fxLayer.hideLabel()},_getFeatureIndex:function(a){var b=this.config.displayField,c=a.attributes[b],d=0;h.some(this.filteredFeatures,function(a){if(a.attributes[b]===c)return!0;d+=1});return d}})});