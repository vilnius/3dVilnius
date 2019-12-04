//>>built
define("require exports esri/config esri/core/tsSupport/declareExtendsHelper esri/core/tsSupport/decorateHelper esri/core/tsSupport/assignHelper esri/core/Accessor esri/core/Error esri/core/Evented esri/core/Handles esri/core/Logger esri/core/Promise esri/core/promiseUtils esri/core/accessorSupport/decorators esri/geometry/support/WKIDUnitConversion ./GraphicsManager esri/views/3d/layers/graphics/Graphics3DVerticalScale".split(" "),function(J,K,v,w,f,L,x,p,y,z,A,B,q,e,C,D,E){function r(c){var b,a,
d;(c&&("object"==typeof c?(b=c.wkid,a=c.wkt):"number"==typeof c?b=c:"string"==typeof c&&(a=c)),b)?d=t.values[t[b]]:a&&-1!==a.search(/^PROJCS/i)&&(c=F.exec(a))&&c[1]&&(d=parseFloat(c[1].split(",")[1]));return d}function G(c,b){b=b||c.extent;c=c.width;var a=r(b&&b.spatialReference);return b&&c?b.width/c*(a||H)*I*v.screenDPI:0}var u=A.getLogger("esri.layers.graphics.controllers.SnapshotController"),I=39.37,H=6378137*Math.PI/180,F=/UNIT\[([^\]]+)\]\]$/i,t=C;return function(c){function b(a){a=c.call(this)||
this;return a.type="snapshot",a._gManager=null,a._verticalScale=null,a._handles=new z,a._source=null,a._started=!1,a._pendingQueries=new Map,a.extent=null,a.hasAllFeatures=!1,a.hasFeatures=!1,a.layer=null,a.layerView=null,a.maxPageSize=null,a.defaultReturnZ=void 0,a.defaultReturnM=void 0,a.pageSize=null,a.paginationEnabled=!1,a}return w(b,c),b.prototype.initialize=function(){var a=this,d=this.layer.when(function(){return a._verifyCapabilities()}).then(function(){return a._init()});this.addResolvingPromise(d)},
b.prototype.destroy=function(){this.cancelQuery();this._gManager&&(this._gManager.destroy(),this._gManager=null);this._handles.destroy();this._pendingQueries=this._handles=null},Object.defineProperty(b.prototype,"updating",{get:function(){return!!(this._pendingQueries&&0<this._pendingQueries.size)},enumerable:!0,configurable:!0}),Object.defineProperty(b.prototype,"graphics",{set:function(a){var d=this._get("graphics");d!==a&&(this._handles.remove("graphics"),a&&(this._collectionChanged({added:a.toArray(),
removed:d&&d.toArray()}),this._handles.add(a.on("change",this._collectionChanged.bind(this)),"graphics")),this._set("graphics",a))},enumerable:!0,configurable:!0}),b.prototype.cancelQuery=function(){var a=this;this._pendingQueries&&(this._pendingQueries.forEach(function(d,b){d.isFulfilled()||d.cancel(Error(a._cancelErrorMsg))}),this._pendingQueries.clear(),this.notifyChange("updating"))},b.prototype.refresh=function(){this.isResolved()&&this._started&&this._queryFeatures()},b.prototype.startup=function(){this._started||
(this._started=!0,this._resolutionParams=this._getResolutionParams(),this._queryFeatures())},b.prototype.update=function(){this.startup()},b.prototype._init=function(){var a=this.layer;this.paginationEnabled=!!a.get("capabilities.query.supportsPagination");this._source=a.source;var d=a.maxRecordCount||4E3;this.pageSize=null==this.maxPageSize?d:Math.min(d,this.maxPageSize);this._gManager=new D({graphics:this.graphics,objectIdField:a.objectIdField});this._verticalScale=new E({sourceSpatialReference:a.spatialReference,
destSpatialReference:this.layerView.view.spatialReference});this._setupStateWatchers()},b.prototype._getResolutionParams=function(){var a,d=this.layer,b=d.get("capabilities.query.supportsQuantization");if("polyline"===d.geometryType||"polygon"===d.geometryType){var c=r(this.layerView.view.spatialReference);null!=c&&(a=this._featureResolution.scale,c=this._featureResolution.value/c,a=d.maxScale?d.maxScale:d.minScale?Math.min(a,d.minScale):Math.min(a,G(this.layerView.view,d.fullExtent)),a*=c/this._featureResolution.scale)}return a?
{maxAllowableOffset:b?null:a,quantizationParameters:b?{mode:"view",originPosition:"upperLeft",tolerance:a,extent:d.fullExtent}:null}:null},b.prototype._setupStateWatchers=function(){var a=this;this._handles.add([this.watch("extent",this.refresh.bind(this)),this.layer.watch("outFields",function(d,b){d&&b?-1===b.indexOf("*")&&(d.sort(),b.sort(),JSON.stringify(d)!==JSON.stringify(b)&&a.refresh()):a.refresh()}),this.layer.watch("definitionExpression, historicMoment",this.refresh.bind(this)),this.layer.on("edits",
this._editsHandler.bind(this))])},b.prototype._createQueryParams=function(){var a=this.layer,d=this.layerView,b=a.createQuery();b.outSpatialReference=d.view.spatialReference;b.geometry=this.extent;a=a.capabilities&&a.capabilities.data;return a&&a.supportsZ&&null==b.returnZ&&null!=this.defaultReturnZ&&(b.returnZ=this.defaultReturnZ),a&&a.supportsM&&null==b.returnM&&null!=this.defaultReturnM&&(b.returnM=this.defaultReturnM),b.set(this._resolutionParams),this.paginationEnabled&&(b.start=0,b.num=this.pageSize),
b},b.prototype._queryFeatures=function(){this.cancelQuery();this.hasAllFeatures=this.hasFeatures=!1;this._gManager.beginPagedUpdate();this.emit("query-start");this._executeQuery(this._createQueryParams())},b.prototype._executeQuery=function(a){var b=this,g=this._source.queryFeatures(a),c=this._gManager.createIntentToAdd();this._querySetup(c,g);g.then(this._processFeatureSet.bind(this,a,c))["catch"](function(a){return b._queryError(c,a)}).then(function(){return b._queryTeardown(c)},function(){return b._queryTeardown(c)})},
b.prototype._hydrate=function(a,b,g){if(a){var d=a.translate[0],c=a.translate[1],e=a.scale[0],f=a.scale[1],m=function(a,b,d){return"esriGeometryPoint"===a?function(a){a.x=b(a.x);a.y=d(a.y)}:"polyline"===a||"polygon"===a?function(a){var c,g,e,f,h,k,n,l=a.rings||a.paths;a=0;for(c=l.length;a<c;a++)for(f=l[a],g=0,e=f.length;g<e;g++)h=f[g],0<g?(k+=h[0],n+=h[1]):(k=h[0],n=h[1]),h[0]=b(k),h[1]=d(n)}:"extent"===a?function(a){a.xmin=b(a.xmin);a.ymin=d(a.ymin);a.xmax=b(a.xmax);a.ymax=d(a.ymax)}:"multipoint"===
a?function(a){var g,c,f,e,k=a.points;a=0;for(g=k.length;a<g;a++)c=k[a],0<a?(f+=c[0],e+=c[1]):(f=c[0],e=c[1]),c[0]=b(f),c[1]=d(e)}:void 0}(b,function(a){return a*e+d},function(a){return c-a*f});a=0;for(b=g.length;a<b;a++)g[a].geometry&&m(g[a].geometry)}},b.prototype._processFeatureSet=function(a,b,c){c.transform&&this._hydrate(c.transform,c.geometryType,c.features);var d=c.exceededTransferLimit,g=c.features,f=this._maxFeatures[this.layer.geometryType]||0,e=g?g.length:0,m=this._gManager.numGraphics+
e,l=m>=f;l&&(u.warn('Feature limit exceeded on layer "',this.layer.title,'". Not all features are shown.'),(f=m-f)&&g.splice(e-f,f));a=!(!d||!this.paginationEnabled||l)&&this._queryNextPage(a);return this._verticalScale.adjust(g),g&&this._gManager.addPage(g,b),this.hasFeatures=!0,a||(this._gManager.endPagedUpdate(),this.hasAllFeatures=!d,this.emit("query-end",{success:!0})),c},b.prototype._queryNextPage=function(a){return a.start+=this.pageSize,this._executeQuery(a),!0},b.prototype._queryError=function(a,
b){if(b&&"cancel"===b.dojoType&&!this.hasFeatures?this._gManager.revertPagedUpdate():this._gManager.endPagedUpdate(),this.emit("query-end",{success:!1}),b&&"cancel"===b.dojoType)return q.reject(b);a=new p("snapshotcontroller:tile-request-failed","Failed to query for features",{error:b});return u.error(a),q.reject(a)},b.prototype._querySetup=function(a,b){this._pendingQueries.set(a,b);this.notifyChange("updating")},b.prototype._queryTeardown=function(a){this._gManager.removeIntent(a);this._pendingQueries["delete"](a);
this.notifyChange("updating")},b.prototype._processRefetch=function(a,b){(b=b.features)&&this._gManager.add(b,a)},b.prototype._refetchError=function(a,b){},b.prototype._verifyCapabilities=function(){if(!this.layer.get("capabilities.operations.supportsQuery"))throw new p("graphicscontroller:query-capability-required","Service requires query capabilities to be used as a feature layer",{layer:this.layer});},b.prototype._collectionChanged=function(a){var b=a.added;if(b)for(var c=0;c<b.length;c++)b[c].layer=
this.layer,b[c].sourceLayer=this.layer;if(b=a.removed)for(c=0;c<b.length;c++)b[c].layer=null,b[c].sourceLayer=null},b.prototype._editsHandler=function(a){var b=this,c=function(a){return a.objectId},f=a.deletedFeatures.map(c);this._gManager["delete"](f);a=a.addedFeatures.concat(a.updatedFeatures).map(c);if(a.length){c=this._createQueryParams();c.objectIds=a;var c=this._source.queryFeatures(c),e=this._gManager.createIntentToAdd(a);this._querySetup(e,c);c.then(this._processRefetch.bind(this,e))["catch"](this._refetchError.bind(this,
e)).then(function(){return b._queryTeardown(e)},function(){return b._queryTeardown(e)})}},f([e.shared("SnapshotController: query cancelled")],b.prototype,"_cancelErrorMsg",void 0),f([e.property({readOnly:!0})],b.prototype,"type",void 0),f([e.shared({value:.25,scale:945})],b.prototype,"_featureResolution",void 0),f([e.shared({point:16E3,multipoint:8E3,polyline:4E3,polygon:4E3,multipatch:4E3})],b.prototype,"_maxFeatures",void 0),f([e.property()],b.prototype,"_pendingQueries",void 0),f([e.property({dependsOn:["_pendingQueries"]})],
b.prototype,"updating",null),f([e.property()],b.prototype,"graphics",null),f([e.property()],b.prototype,"extent",void 0),f([e.property()],b.prototype,"hasAllFeatures",void 0),f([e.property()],b.prototype,"hasFeatures",void 0),f([e.property()],b.prototype,"layer",void 0),f([e.property()],b.prototype,"layerView",void 0),f([e.property()],b.prototype,"maxPageSize",void 0),f([e.property()],b.prototype,"defaultReturnZ",void 0),f([e.property()],b.prototype,"defaultReturnM",void 0),f([e.property()],b.prototype,
"pageSize",void 0),f([e.property()],b.prototype,"paginationEnabled",void 0),b=f([e.subclass("esri.layers.graphics.controllers.SnapshotController")],b)}(e.declared(x,B.EsriPromise,y))});