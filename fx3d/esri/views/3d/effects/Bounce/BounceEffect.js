//>>built
define("dojo/_base/lang dojo/_base/array esri/core/declare esri/core/lang esri/views/3d/webgl-engine/lib/Util esri/core/libs/gl-matrix-2/vec3f64 esri/core/libs/gl-matrix-2/vec2f64 esri/core/libs/gl-matrix-2/vec3 esri/core/libs/gl-matrix-2/vec2 ../../webgl-engine-extensions/VertexBufferLayout ../../webgl-engine-extensions/GLVertexArrayObject ../../webgl-engine-extensions/GLXBO ../../webgl-engine-extensions/GLVerTexture ../../support/fx3dUtils ../../support/fx3dUnits ../../support/interpolationUtils ../Effect ./BounceMaterial".split(" "),
function(w,N,O,k,P,Q,R,h,A,S,E,B,T,f,x,F,U,V){var u,C,G;k=Q.vec3f64;h=h.vec3;var W=R.vec2f64;A=A.vec2;var q=k.create(),r=k.create(),v=k.create(),n=k.create(),H=k.create(),I=k.create(),J=k.create(),K=k.create(),L=k.create(),X=k.fromValues(0,0,1),p=0,D=-1,y=0,M=P.VertexAttrConstants;return O([U],{declaredClass:"esri.views.3d.effects.Bounce.BounceEffect",effectName:"Bounce",constructor:function(b){w.hitch(this,b);this.orderId=2;this._pointsNum=15;this._cachedFlyPaths={};this._cachedPulses={};this._timeAwareFids=
[];this._needsAllLoaded=!0;this._layer.timeInfo instanceof Object?(this._hasTimeInfo=!0,this._needsRenderPath=!1):this._hasTimeInfo=!1;this._hasTimeInfo=!1},_initRenderingInfo:function(){this.renderingInfo.radius=30;this.renderingInfo.dashHeight=1E5;this.renderingInfo.haloColors=[f.rgbNames.cadetblue,f.rgbNames.yellowgreen,f.rgbNames.lightpink,f.rgbNames.orangered,f.rgbNames.green,f.rgbNames.indianred];this._shapeDirty=this._vacDirty=this._renderingInfoDirty=this._colorBarDirty=!0;this.inherited(arguments)},
_doRenderingInfoChange:function(b){this.inherited(arguments);for(var a in b)b.hasOwnProperty(a)&&this.renderingInfo.hasOwnProperty(a)&&(f.endsWith(a.toLowerCase(),"info")?f.isInforAttrChanged(this.renderingInfo[a],b[a])&&(this._renderingInfoDirty=!0):f.endsWith(a.toLowerCase(),"color")?b[a]instanceof Array&&3==b[a].length&&(this.renderingInfo[a]=[b[a][0]/255,b[a][1]/255,b[a][2]/255]):f.endsWith(a.toLowerCase(),"colors")?b[a]instanceof Array&&(this.renderingInfo[a]=b[a],this._colorBarDirty=!0,this._renderingInfoDirty=
!0):"radius"===a.toLowerCase()||"dashHeight"===a.toLowerCase()||"transparency"===a.toLowerCase()?(this._clampScope(b,a),"radius"==a&&this._radiusUnit?this.renderingInfo[a]=x.toMeters(this._radiusUnit,b[a],this._view.viewingMode):"dashHeight"==a&&this._dashHeightUnit?(this.renderingInfo[a]=x.toMeters(this._dashHeightUnit,b[a],this._view.viewingMode),this._updateDefaultLabelHeight()):this.renderingInfo[a]=b[a]):typeof b[a]==typeof this.renderingInfo[a]&&(this.renderingInfo[a]=b[a]))},_updateDefaultLabelHeight:function(){var b=
this._pointsNum*this.renderingInfo.dashHeight;this._layer._labelDefaultHeight={flag:0,min:b,max:b}},setContext:function(b){this.inherited(arguments);this._effectConfig&&w.isArray(this._effectConfig.renderingInfo)&&(this._radiusUnit=null,this._dashHeightUnit=null,N.forEach(this._effectConfig.renderingInfo,function(a){"radius"===a.name.toLowerCase()?(this._radiusUnit=a.unit,this.renderingInfo.radius=x.toMeters(this._radiusUnit,this.renderingInfo.radius,this._view.viewingMode)):"dashHeight"===a.name.toLowerCase()&&
(this._dashHeightUnit=a.unit,this.renderingInfo.dashHeight=x.toMeters(this._dashHeightUnit,this.renderingInfo.dashHeight,this._view.viewingMode),this._updateDefaultLabelHeight())}.bind(this)),this._aroundVerticesTexture=new T(this._gl),this._aroundVerticesTextureSize=W.create())},destroy:function(){this._resetXBOs();this._dispose("_aroundVerticesTexture");this._dispose("_vao");this._dispose("_pulseVAO")},_resetXBOs:function(){this._dispose("_vbo");this._dispose("_ibo");this._dispose("_pulseVBO");
p=0;D=-1;y=u=0;this._needsRenderPath=!1},_initVertexLayout:function(){this._vertexAttrConstants=[M.POSITION,M.AUXPOS1];this._vertexBufferLayout=new S(this._vertexAttrConstants,[3,2],[5126,5126])},_initRenderContext:function(){return this.inherited(arguments),this._vacDirty&&(this._initVertexLayout(),this._resetXBOs(),this._vacDirty=!1,this._vao&&(this._vao.unbind(),this._vao._initialized=!1),this._pulseVAO&&(this._pulseVAO.unbind(),this._pulseVAO._initialized=!1)),this._pulseVBO||(this._pulseVBO=
new B(this._gl,!0,this._vertexBufferLayout)),this._hasTimeInfo?(this._vbo||(this._vbo=new B(this._gl,!0,this._vertexBufferLayout)),this._ibo||(this._ibo=new B(this._gl,!1)),this._vaoExt&&(this._vao=new E(this._gl,this._vaoExt)),this._buildTimeAwareAroundPathGeometries()):(this._vaoExt&&(this._pulseVAO=new E(this._gl,this._vaoExt)),this._buildVerticalGeometries())},_buildTimeAwareAroundPathGeometries:function(){var b,a,d=this._allGraphics();if(d.sort(function(c,d){return b=c.attributes[this._layer.timeInfo.startTimeField],
a=d.attributes[this._layer.timeInfo.startTimeField],b===a?0:b<a?1:b>a?-1:0}.bind(this)),this._cachedFlyPaths={},this._timeAwareFids=[],1<d.length){for(var c,e,z,g,l,k,p,t=[],m=0,u=d.length-1;m<u;m++)if(null!=d[m].geometry){c=d[m].geometry;c.altitude||(c.altitude=40.11);e=d[m+1].geometry;e.altitude||(e.altitude=40.11);h.set(q,c.longitude,c.latitude,c.altitude);"global"===this._view.viewingMode?f.wgs84ToSphericalEngineCoords(q,0,q,0):"local"===this._view.viewingMode&&f.wgs84ToWebMerc(q,0,q,0);h.set(r,
e.longitude,e.latitude,e.altitude);"global"===this._view.viewingMode?f.wgs84ToSphericalEngineCoords(r,0,r,0):"local"===this._view.viewingMode&&f.wgs84ToWebMerc(r,0,r,0);0==m&&this._initPulseGeometries(m,d[m]);h.subtract(v,q,r);c=h.length(v);"global"===this._view.viewingMode?z=5E5>=c?18:1E6>=c?40:Math.floor(1E-5*c):"local"===this._view.viewingMode&&(z=1E6>=c?10:2E6>=c?18:Math.floor(6E-6*c));c*=.6;h.lerp(n,q,r,.5);"global"===this._view.viewingMode?(p=h.length(n),h.normalize(n,n),h.scale(n,n,p+c)):"local"===
this._view.viewingMode&&(h.scale(L,X,c),h.add(n,L,n));h.normalize(v,v);h.scale(H,v,c);h.add(I,n,H);h.scale(J,v,-c);h.add(K,n,J);this._cachedFlyPaths[d[m].attributes.FID]={vertices:null,indices:null};t=F.getPoints(z,q,q,I,n);t.pop();t=t.concat(F.getPoints(z,n,K,r,r));c=t.length;e=[];g=[];l=0;for(k=c;l<k;l++)e.push(t[l][0],t[l][1],t[l][2],l,c),l<k-1&&0===(1&l)&&(g.push(l,l+1),l+1===c-2&&g.push(l+1,l+2));this._cachedFlyPaths[d[m].attributes.FID].vertices=new Float32Array(e);this._cachedFlyPaths[d[m].attributes.FID].indices=
new Uint32Array(g);this._timeAwareFids.push(d[m].attributes.FID);this._initPulseGeometries(m+1,d[m+1])}return this._resetAddGeometries(),!0}return 1==d.length&&(this._initPulseGeometries(0,d[0]),this._resetAddGeometries(),!0)},_initPulseGeometries:function(b,a){if(a.geometry){var d,c,e=a.geometry,f=this._vertexBufferLayout.getStride(),g=new Float32Array(this._pointsNum*f);for(d=0;d<this._pointsNum;d++)c=f*d,g[c+0]=e.longitude,g[c+1]=e.latitude,g[c+2]=null==e.altitude?40.11:40.11+e.altitude,g[c+3]=
d==this._pointsNum-1?-this._pointsNum-1:d+1,g[c+4]=b;this._cachedPulses[a.attributes.FID]={vertices:g}}},_buildVerticalGeometries:function(){var b=this._allGraphics();if(0<b.length){for(var a,d=this._vertexBufferLayout.getStride(),c=new Float32Array(b.length*d*this._pointsNum),e=0,f=0,g=0,f=0;f<b.length;f++)if(a=b[f].geometry)for(g=0;g<this._pointsNum;g++)e=(f*this._pointsNum+g)*d,c[e+0]=a.longitude,c[e+1]=a.latitude,c[e+2]=null==a.altitude?40.11:40.11+a.altitude,c[e+3]=g==this._pointsNum-1?-this._pointsNum-
1:g+1,c[e+4]=f;return this._pulseVBO.addData(!1,c),this._pulseVAO&&(this._pulseVAO._initialized=!1),this._resetAddGeometries(),!0}return!1},_initAroundVerticesTexture:function(){if(2*this._pathIdNum!==this._tmpPoints.length)return!1;var b=this._gl.getParameter(3379),a=2*this._pathIdNum,d=f.nextHighestPowerOfTwo(a);d>b&&(d=b,console.warn("Too many graphics, and some data will be discarded."));a=Math.ceil(a/d);a=f.nextHighestPowerOfTwo(a);a>b&&(a=b,console.warn("Too many graphics, and some data will be discarded."));
for(var c=new Float32Array(d*a*4),e=0;e<this._pathIdNum;e++)b=8*e,c[0+b]=e,c[1+b]=this._tmpPoints[2*e][0],c[2+b]=this._tmpPoints[2*e][1],c[3+b]=this._tmpPoints[2*e][2],c[4+b]=e,c[5+b]=this._tmpPoints[2*e+1][0],c[6+b]=this._tmpPoints[2*e+1][1],c[7+b]=this._tmpPoints[2*e+1][2];return this._aroundVerticesTexture.setData(d,a,c),A.set(this._aroundVerticesTextureSize,d,a),!0},_loadShaders:function(){return this.inherited(arguments),this._material||(this._material=new V({pushState:this._pushState.bind(this),
restoreState:this._restoreState.bind(this),gl:this._gl,viewingMode:this._view.viewingMode,shaderSnippets:this._shaderSnippets})),this._material.loadShaders(this._hasTimeInfo)},_initColourMap:function(){this._colourMapTexture||(this._colourMapTexture=this._gl.createTexture());var b=new Image;b.src=f.spriteImg;var a=this;return b.onload=function(){var d=a._gl.getParameter(a._gl.TEXTURE_BINDING_2D);a._gl.bindTexture(3553,a._colourMapTexture);a._gl.pixelStorei(37440,!0);a._gl.texParameteri(3553,10240,
9728);a._gl.texParameteri(3553,10241,9728);a._gl.texParameteri(3553,10242,33071);a._gl.texParameteri(3553,10243,33071);a._gl.texImage2D(3553,0,6408,6408,5121,b);a._gl.generateMipmap(3553);a._gl.bindTexture(3553,d)},0===this._gl.getError()},_initColorBar:function(){if(!this._colorBarDirty)return!0;this._colorBarTexture||(this._colorBarTexture=this._gl.createTexture());var b=this._gl.getParameter(32873);this._gl.bindTexture(3553,this._colorBarTexture);this._gl.pixelStorei(37440,!0);this._gl.texParameteri(3553,
10240,9728);this._gl.texParameteri(3553,10241,9728);this._gl.texParameteri(3553,10242,33071);this._gl.texParameteri(3553,10243,33071);var a=f.createColorBarTexture(32,1,this.renderingInfo.haloColors);return this._gl.texImage2D(3553,0,6408,6408,5121,a),this._gl.generateMipmap(3553),this._gl.bindTexture(3553,b),0===this._gl.getError()},render:function(b,a){this.inherited(arguments);this._layer.visible&&this.ready&&this._bindPramsReady()&&(this._hasSentReady||(this._layer.emit("fx3d-ready"),this._hasSentReady=
!0),this._hasTimeInfo?this._renderWithTimeInfo(b,a):this._renderWithoutTimeInfo(b,a))},_renderWithTimeInfo:function(b,a){this._material.bind(w.mixin({},{mo:this._vizFieldVerTextures[this._vizFields[this._currentVizPage]],pl:this._vizFieldVerTextureSize,ii:this._colourMapTexture,ei:this.renderingInfo.animationInterval,si:this.renderingInfo.transparency,is:this._vizFieldMinMaxs[this._vizFieldDefault].min>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min?this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min:
this._vizFieldMinMaxs[this._vizFieldDefault].min,mi:this._vizFieldMinMaxs[this._vizFieldDefault].max>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max?this._vizFieldMinMaxs[this._vizFieldDefault].max:this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max,lo:this._colorBarTexture,li:[this._scopes.radius[0],this.renderingInfo.radius,this.renderingInfo.dashHeight]},b));p=Math.floor(this.time/this.renderingInfo.animationInterval);this._repeatCount=Math.floor(p/this._timeAwareFids.length);
p%=this._timeAwareFids.length;this._repeatCount>this.renderingInfo.repeat&&(p=this._timeAwareFids.length-1);p!=D&&(0==(1&p)?(G=this._cachedPulses[this._timeAwareFids[u++]],this._pulseVBO.addData(!0,G.vertices),y=u-1):0<u&&(C=this._cachedFlyPaths[this._timeAwareFids[u-1]],this._vbo.addData(!1,C.vertices),this._ibo.addData(!1,C.indices),y=-1),D=p);this._material.bindBoolean("drawFlyPath",!1);this._material.bindFloat("currentIndex",y);this._material.blend(!0,a);this._pulseVBO.bind(this._material.getProgram());
this._gl.drawArrays(0,0,this._pulseVBO.getNum());this._pulseVBO.unbind();1==(1&p)&&(this._material.bindBoolean("drawFlyPath",!0),this._material.blend(!1,a),this._vbo.bind(this._material.getProgram()),this._ibo.bind(),this._gl.drawElements(1,this._ibo.getNum(),5125,0),this._ibo.unbind(),this._vbo.unbind());this._material.release()},_localPulseBinds:function(){this._pulseVBO.bind(this._material._program);this._vertexBufferLayout.enableVertexAttribArrays(this._gl,this._material._program)},_bindPulseBuffer:function(){this._pulseVAO?
(this._pulseVAO._initialized||this._pulseVAO.initialize(this._localPulseBinds.bind(this)),this._pulseVAO.bind()):this._localPulseBinds()},_unBindPulseBuffer:function(){this._pulseVAO?this._pulseVAO.unbind():(this._pulseVBO.unbind(),this._vertexBufferLayout.disableVertexAttribArrays(this._gl,this._material._program))},_renderWithoutTimeInfo:function(b,a){this._material.bind(w.mixin({},{mo:this._vizFieldVerTextures[this._vizFields[this._currentVizPage]],pl:this._vizFieldVerTextureSize,ii:this._colourMapTexture,
ei:this.renderingInfo.animationInterval,si:this.renderingInfo.transparency,is:this._vizFieldMinMaxs[this._vizFieldDefault].min>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min?this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min:this._vizFieldMinMaxs[this._vizFieldDefault].min,mi:this._vizFieldMinMaxs[this._vizFieldDefault].max>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max?this._vizFieldMinMaxs[this._vizFieldDefault].max:this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max,
lo:this._colorBarTexture,li:[this._scopes.radius[0],this.renderingInfo.radius,this.renderingInfo.dashHeight]},b),a);this._material.blend(!0,a);this._bindPulseBuffer();this._gl.drawArrays(0,0,this._pulseVBO.getNum());this._material.release(a);this._unBindPulseBuffer()}})});