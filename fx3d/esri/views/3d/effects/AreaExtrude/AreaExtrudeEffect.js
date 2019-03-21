//>>built
define("dojo/_base/lang dojo/_base/array esri/core/declare esri/core/lang esri/views/3d/webgl-engine/lib/Util esri/views/3d/layers/graphics/Graphics3DSymbolCommonCode esri/core/libs/earcut/earcut ../../webgl-engine-extensions/VertexBufferLayout ../../webgl-engine-extensions/GLVertexArrayObject ../../webgl-engine-extensions/GLXBO ../../webgl-engine-extensions/GLVerTexture ../../support/fx3dUtils ../../support/fx3dUnits ../Effect ./AreaExtrudeMaterial ./AreaExtrudeGeometry".split(" "),function(p,q,
u,m,v,B,C,w,x,r,D,k,t,y,z,A){var h,n=v.VertexAttrConstants;return window.WebGLRenderingContext,u([y],{declaredClass:"esri.views.3d.effects.AreaExtrude.AreaExtrudeEffect",effectName:"AreaExtrude",constructor:function(b){this.orderId=2;this._polygonIndex=this._polygonIdNum=0;this._polygonNormals=[];this._vertexNums=this._indexNums=0;this._renderObjects={};this._maxDist=0;this._needsAllLoaded=!1},_initRenderingInfo:function(){this.renderingInfo.height=1E4;this.renderingInfo.topColors=[[128,100,253],
[160,162,140],[255,100,128]];this._colorBarDirty=!0;this.renderingInfo.bottomColor=[0,255,0];this._shapeDirty=this._vacDirty=this._renderingInfoDirty=!0;this.inherited(arguments)},_doRenderingInfoChange:function(b){this.inherited(arguments);for(var a in b)b.hasOwnProperty(a)&&this.renderingInfo.hasOwnProperty(a)&&(m.endsWith(a.toLowerCase(),"info")?k.isInforAttrChanged(this.renderingInfo[a],b[a])&&(this._renderingInfoDirty=!0):m.endsWith(a.toLowerCase(),"color")?b[a]instanceof Array&&3==b[a].length&&
(this.renderingInfo[a]=[b[a][0]/255,b[a][1]/255,b[a][2]/255]):m.endsWith(a.toLowerCase(),"colors")?b[a]instanceof Array&&(this.renderingInfo[a]=b[a],this._colorBarDirty=!0,this._renderingInfoDirty=!0):"height"===a.toLowerCase()||"transparency"===a.toLowerCase()?(this._clampScope(b,a),"height"==a&&this._heightUnit?(this.renderingInfo[a]=t.toMeters(this._heightUnit,b[a],this._view.viewingMode),this._updateDefaultLabelHeight()):this.renderingInfo[a]=b[a]):typeof b[a]==typeof this.renderingInfo[a]&&(this.renderingInfo[a]=
b[a]))},_updateDefaultLabelHeight:function(){this._layer._labelDefaultHeight={flag:1,min:this._scopes.height[0],max:this.renderingInfo.height}},setContext:function(b){this.inherited(arguments);this._effectConfig&&p.isArray(this._effectConfig.renderingInfo)&&(this._heightUnit=null,q.forEach(this._effectConfig.renderingInfo,function(a){"height"===a.name.toLowerCase()&&(this._heightUnit=a.unit,this.renderingInfo.height=t.toMeters(this._heightUnit,this.renderingInfo.height,this._view.viewingMode),this._updateDefaultLabelHeight())}.bind(this)))},
destroy:function(){this._resetBuffers()},_resetBuffers:function(){for(var b in this._renderObjects)this._dispose(this._renderObjects[b].vbo),this._dispose(this._renderObjects[b].ibo),this._dispose(this._renderObjects[b].vao);this._renderObjects={}},_initVertexLayout:function(){this._vertexAttrConstants=[n.POSITION,n.AUXPOS1,n.AUXPOS2];this._vertexBufferLayout=new w(this._vertexAttrConstants,[3,2,2],[5126,5126,5126])},_initRenderContext:function(){if(this.inherited(arguments),this._vacDirty)if(this._initVertexLayout(),
this._vacDirty=!1,this._isAddingGeometry)for(var b in this._renderObjects)this._unBindBuffer(this._renderObjects[b].vao,this._renderObjects[b].vbo,this._renderObjects[b].ibo),this._renderObjects[b].vao&&(this._renderObjects[b].vao._initialized=!1);else this._resetBuffers();return this._localBindsCallback||(this._localBindsCallback=this._localBinds.bind(this)),this._buildAreaGeometries()},_buildAreaGeometries:function(){var b=this._isAddingGeometry?this._addedGraphics:this._allGraphics();if(0<b.length){var a=
this._vertexBufferLayout.getStride();this._isAddingGeometry||(this._polygonIdNum=0,this._indexNums=0,this._vertexNums=0);for(var e=[],f=0;f<b.length;f++){var c=b[f];if(null!=c.geometry){var g=c.geometry.rings;g&&0!==g.length&&(e.push(new A(c,this._polygonIdNum,a)),this._polygonIdNum++)}}for(b=0;b<e.length;b++)this.waitForGeometry(e[b]);return this._resetAddGeometries(),!0}return!1},waitForGeometry:function(b){var a=this;b&&b.then(function(){for(var e=b.createBuffers(a._wgs84SpatialReference,a.view.renderSpatialReference),
f=0;f<e.length;f++){var c=e[f];c&&(a._renderObjects[c.origin.id]||(a._renderObjects[c.origin.id]={vbo:new r(a._gl,!0,a._vertexBufferLayout),ibo:new r(a._gl,!1),vao:a._vaoExt?new x(a._gl,a._vaoExt):null,offset:0,origin:c.origin.vec3,buffers:[]}));var g=a._renderObjects[c.origin.id];g.vbo.addData(!0,c.vertices);for(var d=c.indices,l=0;l<d.length;l++)d[l]+=g.offset;g.ibo.addData(!0,c.indices);g.offset+=c.vertexNum;g.buffers.push(c);a._maxDist<c.dist&&(a._maxDist=c.dist);1E5<a._maxDist&&(a._maxDist=1E5);
g.vao&&(g.vao._initialized=!1)}a._polygonIndex+=e.length})},_initPolygonNormalVerTexture:function(){var b=this._allGraphics();if(0<b.length){var a=this._gl.getParameter(3379),e=b.length,f=k.nextHighestPowerOfTwo(e);f>a&&(f=a,console.warn("Too many graphics, and extra features will be discarded."));var c=Math.ceil(e/f),c=k.nextHighestPowerOfTwo(c);c>a&&(c=a,console.warn("Too many graphics, and extra features will be discarded."));this._vizFieldVerTextures[this._vizFieldDefault].setData(f,c,new Float32Array(f*
c*4));var g,d,l,h;return q.forEach(this._vizFields,function(a){var e=new Float32Array(f*c*4);(d=b[0].attributes[a])||(d=0);(!d||"number"!=typeof d||0>d)&&(d=0);l=h=d;for(var k=0;k<b.length;k++)g=b[k].attributes,d=g[a],(!d||"number"!=typeof d||0>d)&&(d=0),e[4*k]=d,h<d&&(h=d),l>d&&(l=d);this._vizFieldVerTextures[a].setData(f,c,e);this._vizFieldMinMaxs[a].min=l;this._vizFieldMinMaxs[a].max=h;this._updateVizFieldMinMaxToLayer()}.bind(this)),vec2d.set2(f,c,this._vizFieldVerTextureSize),!0}return!1},_loadShaders:function(){return this.inherited(arguments),
this._material||(this._material=new z({pushState:this._pushState.bind(this),restoreState:this._restoreState.bind(this),gl:this._gl,viewingMode:this._view.viewingMode,shaderSnippets:this._shaderSnippets})),this._material.loadShaders()},_initColorBar:function(){if(!this._colorBarDirty)return!0;this._colorBarTexture||(this._colorBarTexture=this._gl.createTexture());var b=this._gl.getParameter(32873);this._gl.bindTexture(3553,this._colorBarTexture);this._gl.pixelStorei(37440,!0);this._gl.texParameteri(3553,
10240,9728);this._gl.texParameteri(3553,10241,9728);this._gl.texParameteri(3553,10242,33071);this._gl.texParameteri(3553,10243,33071);var a=k.createColorBarTexture(32,1,this.renderingInfo.topColors);return this._gl.texImage2D(3553,0,6408,6408,5121,a),this._gl.generateMipmap(3553),this._gl.bindTexture(3553,b),0===this._gl.getError()},_localBinds:function(b,a){b.bind(this._material._program);this._vertexBufferLayout.enableVertexAttribArrays(this._gl,this._material._program);a.bind()},_bindBuffer:function(b,
a,e){b?(b._initialized||b.initialize(this._localBindsCallback,[a,e]),b.bind()):this._localBinds(a,e)},_unBindBuffer:function(b,a,e){b?b.unbind():(a.unbind(),this._vertexBufferLayout.disableVertexAttribArrays(this._gl,this._material._program),e.unbind())},render:function(b,a){if(this.inherited(arguments),this._layer.visible&&this.ready&&this._bindPramsReady()){this._hasSentReady||(this._layer.emit("fx3d-ready"),this._hasSentReady=!0);this._material.bind(p.mixin({},{ie:this._vizFieldVerTextures[this._vizFieldDefault],
io:this._vizFieldVerTextures[this._vizFields[this._currentVizPage]],le:this._vizFieldVerTextureSize,mp:this.renderingInfo.animationInterval,ei:[this._scopes.height[0],this.renderingInfo.height],eo:this.renderingInfo.transparency,sl:this.renderingInfo.bottomColor,ss:this._vizFieldMinMaxs[this._vizFieldDefault].min>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min?this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min:this._vizFieldMinMaxs[this._vizFieldDefault].min,oi:this._vizFieldMinMaxs[this._vizFieldDefault].max>
this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max?this._vizFieldMinMaxs[this._vizFieldDefault].max:this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max,im:this._colorBarTexture,me:this._maxDist},b),a);for(var e in this._renderObjects)h=this._renderObjects[e],this._bindBuffer(h.vao,h.vbo,h.ibo),this._gl.drawElements(4,h.ibo.getNum(),5125,0);this._material.release(a);this._unBindBuffer(h.vao,h.vbo,h.ibo)}}})});