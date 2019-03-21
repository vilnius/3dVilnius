//>>built
define("dojo/_base/lang dojo/_base/array esri/core/declare esri/core/lang esri/views/3d/webgl-engine/lib/Util esri/core/libs/gl-matrix-2/vec3f64 esri/core/libs/gl-matrix-2/vec2f64 esri/core/libs/gl-matrix-2/vec3 esri/core/libs/gl-matrix-2/vec2 ../../webgl-engine-extensions/VertexBufferLayout ../../webgl-engine-extensions/GLVertexArrayObject ../../webgl-engine-extensions/GLXBO ../../webgl-engine-extensions/GLVerTexture ../../support/fx3dUtils ../../support/fx3dUnits ../Effect ./FireballMaterial".split(" "),
function(m,B,G,v,C,h,H,q,n,I,D,r,J,f,g,E,K){h=(C.assert,h.vec3f64);q=q.vec3;var L=H.vec2f64;n=n.vec2;var t=h.create(),u=h.create(),F=h.create(),M=C.VertexAttrConstants;return G([E],{declaredClass:"esri.views.3d.effects.Fireball.FireballEffect",effectName:"Fireball",constructor:function(b){m.hitch(this,b);this.orderId=2;this._pathIdNum=0;this._tmpPoints=[];this.localOriginFactory=E.createLocalOriginFactory();this._renderObjects={};this._needsAllLoaded=!0},_initRenderingInfo:function(){this.renderingInfo.radius=
40;this.renderingInfo.width=50;this.renderingInfo.height=50;this.renderingInfo.colors=[f.rgbNames.cadetblue,f.rgbNames.yellowgreen,f.rgbNames.lightpink,f.rgbNames.orangered,f.rgbNames.green,f.rgbNames.indianred];this._renderingInfoDirty=this._colorBarDirty=!0;this._curveType=1;this._shapeDirty=this._vacDirty=!0;this.inherited(arguments)},_doRenderingInfoChange:function(b){this.inherited(arguments);for(var a in b)b.hasOwnProperty(a)&&this.renderingInfo.hasOwnProperty(a)&&(v.endsWith(a.toLowerCase(),
"info")?f.isInforAttrChanged(this.renderingInfo[a],b[a])&&(this._renderingInfoDirty=!0):v.endsWith(a.toLowerCase(),"colors")?b[a]instanceof Array&&(this.renderingInfo[a]=b[a],this._colorBarDirty=!0,this._renderingInfoDirty=!0):"radius"===a.toLowerCase()||"width"===a.toLowerCase()||"height"===a.toLowerCase()||"transparency"===a.toLowerCase()?(this._clampScope(b,a),"radius"==a&&this._radiusUnit?this.renderingInfo[a]=g.toMeters(this._radiusUnit,b[a],this._view.viewingMode):"width"==a&&this._widthUnit?
this.renderingInfo[a]=g.toMeters(this._widthUnit,b[a],this._view.viewingMode):"height"==a&&this._heightUnit?this.renderingInfo[a]=g.toMeters(this._heightUnit,b[a],this._view.viewingMode):this.renderingInfo[a]=b[a]):typeof b[a]==typeof this.renderingInfo[a]&&(this.renderingInfo[a]=b[a]))},setContext:function(b){this.inherited(arguments);this._effectConfig&&m.isArray(this._effectConfig.renderingInfo)&&(this._radiusUnit=null,this._widthUnit=null,this._heightUnit=null,B.forEach(this._effectConfig.renderingInfo,
function(a){"radius"===a.name.toLowerCase()?(this._radiusUnit=a.unit,this.renderingInfo.radius=g.toMeters(this._radiusUnit,this.renderingInfo.radius,this._view.viewingMode)):"width"===a.name.toLowerCase()?(this._widthUnit=a.unit,this.renderingInfo.width=g.toMeters(this._widthUnit,this.renderingInfo.width,this._view.viewingMode)):"height"===a.name.toLowerCase()&&(this._heightUnit=a.unit,this.renderingInfo.height=g.toMeters(this._heightUnit,this.renderingInfo.height,this._view.viewingMode))}.bind(this)),
this._aroundVerticesTexture=new J(this._gl),this._aroundVerticesTextureSize=L.create())},destroy:function(){this._resetXBOs();this._dispose("_aroundVerticesTexture");this._dispose("_vao");this._dispose("_particleVAO")},_resetXBOs:function(){this._dispose("_vbo");this._dispose("_ibo");this._dispose("_particleVBO")},_initVertexLayout:function(){this._vertexAttrConstants=[M.AUXPOS1];this._vertexBufferLayout=new I(this._vertexAttrConstants,[3],[5126])},_initRenderContext:function(){return this.inherited(arguments),
this._vacDirty&&(this._initVertexLayout(),this._resetXBOs(),this._vacDirty=!1,this._vao&&(this._vao.unbind(),this._vao._initialized=!1),this._particleVAO&&(this._particleVAO.unbind(),this._particleVAO._initialized=!1)),this._vbo||(this._vbo=new r(this._gl,!0,this._vertexBufferLayout)),this._particleVBO||(this._particleVBO=new r(this._gl,!0,this._vertexBufferLayout)),this._ibo||(this._ibo=new r(this._gl,!1)),this._vaoExt&&(this._vao=new D(this._gl,this._vaoExt),this._particleVAO=new D(this._gl,this._vaoExt)),
this._localBindsCallback||(this._localBindsCallback=this._localBinds.bind(this)),1===this._curveType?this._buildAroundPathGeometries():0===this._curveType&&this._buildAlongPathGeometries()},_buildAroundPathGeometries:function(){var b=this._allGraphics();if(0<b.length){var a,d,e,c,l,g,p,k,h,m=0,x=[],n=[],w=0,r=0,z=1,y=[];this._isAddingGeometry||(this._pathIdNum=0,this._tmpPoints=[]);var v=this._vertexBufferLayout.getStride();return B.forEach(b,function(b,A){if(null!=b.geometry)for(g=b.geometry.paths,
p=0;p<g.length;p++)if(!(2>g[p].length)){c=e=0;a=g[p][0];a[2]||(a[2]=40.11);d=g[p][g[p].length-1];d[2]||(d[2]=40.11);q.set(t,a[0],a[1],a[2]);"global"===this._view.viewingMode?f.wgs84ToSphericalEngineCoords(t,0,t,0):"local"===this._view.viewingMode&&f.wgs84ToWebMerc(t,0,t,0);q.set(u,d[0],d[1],d[2]);"global"===this._view.viewingMode?f.wgs84ToSphericalEngineCoords(u,0,u,0):"local"===this._view.viewingMode&&f.wgs84ToWebMerc(u,0,u,0);q.subtract(F,t,u);c=q.length(F);"global"===this._view.viewingMode?e=1E3>=
c?32:1E4>=c?24:5E5>=c?18:1E6>=c?40:Math.floor(1E-5*c):"local"===this._view.viewingMode&&(e=1E3>=c?48:1E4>=c?42:1E5>=c?32:1E6>=c?24:2E6>=c?36:Math.floor(6E-6*c));e=2*e+1;for(k=0;k<e;k++)l=v*(k+w),x[0+l]=this._pathIdNum,x[1+l]=A+0,x[2+l]=k,k<e-1&&(m=2*(k+w-A),n[m+0]=k+w+0,n[m+1]=k+w+0+1);w+=e;z=Math.max(1,Math.floor(e/20));for(h=0;h<z;h++)l=v*(h+r),y[0+l]=this._pathIdNum,y[1+l]=A+0,y[2+l]=18*h;r+=z;this._pathIdNum++;this._tmpPoints.push([a[0],a[1],a[2]]);this._tmpPoints.push([d[0],d[1],d[2]])}}.bind(this)),
this._vbo.addData(this._isAddingGeometry,new Float32Array(x)),this._ibo.addData(this._isAddingGeometry,new Uint32Array(n)),this._particleVBO.addData(this._isAddingGeometry,new Float32Array(y)),this._vao&&(this._vao._initialized=!1),this._particleVAO&&(this._particleVAO._initialized=!1),this._resetAddGeometries(),this._initAroundVerticesTexture()}return!1},_buildAlongPathGeometries:function(){return!1},_initAroundVerticesTexture:function(){if(2*this._pathIdNum!==this._tmpPoints.length)return!1;var b=
this._gl.getParameter(3379),a=2*this._pathIdNum,d=f.nextHighestPowerOfTwo(a);d>b&&(d=b,console.warn("Too many graphics, and some data will be discarded."));a=Math.ceil(a/d);a=f.nextHighestPowerOfTwo(a);a>b&&(a=b,console.warn("Too many graphics, and some data will be discarded."));for(var e=new Float32Array(d*a*4),c=0;c<this._pathIdNum;c++)b=8*c,e[0+b]=c,e[1+b]=this._tmpPoints[2*c][0],e[2+b]=this._tmpPoints[2*c][1],e[3+b]=this._tmpPoints[2*c][2],e[4+b]=c,e[5+b]=this._tmpPoints[2*c+1][0],e[6+b]=this._tmpPoints[2*
c+1][1],e[7+b]=this._tmpPoints[2*c+1][2];return this._aroundVerticesTexture.setData(d,a,e),n.set(this._aroundVerticesTextureSize,d,a),!0},_initColourMap:function(){this._colourMapTexture||(this._colourMapTexture=this._gl.createTexture());var b=new Image;b.src=f.spriteImg;var a=this;return b.onload=function(){var d=a._gl.getParameter(a._gl.TEXTURE_BINDING_2D);a._gl.bindTexture(3553,a._colourMapTexture);a._gl.pixelStorei(37440,!0);a._gl.texParameteri(3553,10240,9728);a._gl.texParameteri(3553,10241,
9728);a._gl.texParameteri(3553,10242,33071);a._gl.texParameteri(3553,10243,33071);a._gl.texImage2D(3553,0,6408,6408,5121,b);a._gl.generateMipmap(3553);a._gl.bindTexture(3553,d)},0===this._gl.getError()},_loadShaders:function(){return this.inherited(arguments),this._material||(this._material=new K({pushState:this._pushState.bind(this),restoreState:this._restoreState.bind(this),gl:this._gl,viewingMode:this._view.viewingMode,shaderSnippets:this._shaderSnippets})),this._material.loadShaders()},_initColorBar:function(){if(!this._colorBarDirty)return!0;
this._colorBarTexture||(this._colorBarTexture=this._gl.createTexture());var b=this._gl.getParameter(32873);this._gl.bindTexture(3553,this._colorBarTexture);this._gl.pixelStorei(37440,!0);this._gl.texParameteri(3553,10240,9728);this._gl.texParameteri(3553,10241,9728);this._gl.texParameteri(3553,10242,33071);this._gl.texParameteri(3553,10243,33071);var a=f.createColorBarTexture(32,1,this.renderingInfo.colors);return this._gl.texImage2D(3553,0,6408,6408,5121,a),this._gl.generateMipmap(3553),this._gl.bindTexture(3553,
b),0===this._gl.getError()},_localBinds:function(b,a){b.bind(this._material._program);this._vertexBufferLayout.enableVertexAttribArrays(this._gl,this._material._program);a&&a.bind()},_bindBuffer:function(b,a,d){b?(b._initialized||b.initialize(this._localBindsCallback,[a,d]),b.bind()):this._localBinds(a,d)},_unBindBuffer:function(b,a,d){b?b.unbind():(a.unbind(),this._vertexBufferLayout.disableVertexAttribArrays(this._gl,this._material._program),d&&d.unbind())},render:function(b,a){this.inherited(arguments);
this._layer.visible&&this.ready&&this._bindPramsReady()&&(this._hasSentReady||(this._layer.emit("fx3d-ready"),this._hasSentReady=!0),this._material.bind(m.mixin({},{mp:this._aroundVerticesTexture,sm:this._aroundVerticesTextureSize,lm:this._colourMapTexture,ls:this._vizFieldVerTextures[this._vizFields[this._currentVizPage]],es:this._vizFieldVerTextureSize,le:this.renderingInfo.animationInterval,pe:this.renderingInfo.radius,li:this.renderingInfo.transparency,ii:this._vizFieldMinMaxs[this._vizFieldDefault].min>
this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min?this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min:this._vizFieldMinMaxs[this._vizFieldDefault].min,il:this._vizFieldMinMaxs[this._vizFieldDefault].max>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max?this._vizFieldMinMaxs[this._vizFieldDefault].max:this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max,me:this._colorBarTexture},b),a),this._material.bindBoolean("drawPath",!0),this._material.blend(!0,
a),this._bindBuffer(this._vao,this._vbo,this._ibo),this._gl.drawElements(1,this._ibo.getNum(),5125,0),this._unBindBuffer(this._vao,this._vbo,this._ibo),this._material.bindBoolean("drawPath",!1),this._material.blend(!1,a),this._bindBuffer(this._particleVAO,this._particleVBO,null),this._gl.drawArrays(0,0,this._particleVBO.getNum()),this._material.release(a),this._unBindBuffer(this._particleVAO,this._particleVBO,null))}})});