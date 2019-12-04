//>>built
require({cache:{"url:fx3d/views/3d/effects/PointExtrude/PointExtrudeMaterial.xml":'\x3c?xml version\x3d"1.0" encoding\x3d"UTF-8"?\x3e\x3c!-- Copyright @ 2019 Esri. All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions. --\x3e\x3csnippets\x3e\x3csnippet name\x3d"pointExtrudeFS"\x3e\x3c![CDATA[\r\n#ifdef GL_ES\r\nprecision mediump float;\r\n#endif\r\nuniform float mp;uniform vec3 im;uniform vec4 ls;uniform vec4 ii;uniform vec4 ie;uniform vec3 camPos;varying vec4 gg;varying vec3 gc;varying vec3 cg;const vec3 a\x3dvec3(1.0,1.0,1.0);const vec3 b\x3dvec3(1.0,1.0,1.0);const vec3 c\x3dvec3(0.2,0.2,0.2);void main(){vec3 d\x3dnormalize(cg-camPos);vec3 e\x3dnormalize(gc);vec3 f\x3dnormalize(reflect(d,e));float g\x3dmax(dot(f,im),.001);vec3 h\x3dc*ie.rgb*ie.w*pow(g,18.0);vec3 i\x3da*ii.rgb*ii.w*clamp(dot(e,im),.0,1.0);vec3 j\x3db*ls.rgb*ls.w;vec3 k\x3dvec3(j+i+h);gl_FragColor.xyz\x3dgg.xyz*k;float l\x3dmp*0.01;gl_FragColor.w\x3dl;}]]\x3e\x3c/snippet\x3e\x3csnippet name\x3d"pointExtrudeVS"\x3e\x3c![CDATA[attribute vec3 $position;attribute vec3 $auxpos1;attribute vec3 $normal;attribute vec3 $auxpos2;uniform mat4 el;uniform mat4 viewMat;uniform sampler2D pl;uniform sampler2D ms;uniform float lm;uniform vec3 lo;uniform vec3 origin;uniform vec3 camPos;uniform sampler2D li;uniform vec3 is;uniform float oe;uniform float lp;uniform vec2 il;uniform vec2 ss;uniform bool op;uniform float ei;uniform vec4 em;varying vec4 gg;varying vec3 gc;varying vec3 cg; $linearInterpolator  $lonlat2position  $translationMat  $localTrans  $quintEaseOut const float a\x3d1.0;const float b\x3d0.0;vec4 matchPixelCenter(vec4 c,vec2 d){vec2 e\x3dvec2(.500123)+.5*c.xy/c.w;vec2 f\x3dfloor(e*d);vec2 g\x3dvec2(1.0)/d;vec2 h\x3d(((vec2(.5)+f)*g)*2.0-vec2(1.0))*c.w;return vec4(h.x,h.y,c.z,c.w);}void main(void){float i\x3dfract($auxpos2.x/il.x);float j\x3dfloor($auxpos2.x/il.y)/il.y;float k\x3d(texture2D(pl,vec2(i,j))).r;float l\x3d(texture2D(ms,vec2(i,j))).r;float m\x3dmod(oe,lm);float n\x3dgetQuintEaseInOutValue(m,k,l,lm);if(op){n\x3dl;}float o\x3dgetLinearValue(ss,n);float p\x3d$auxpos2.y*lp*2.0*PI;vec3 q\x3dvec3(lo.x*cos(p),lo.x*sin(p),0.0);bool r\x3dfalse;if($auxpos2.z\x3d\x3da){r\x3dtrue;}else if($auxpos2.z\x3d\x3db){r\x3dfalse;}vec3 s\x3dlo.x*$position+$auxpos1;vec3 t\x3d(viewMat*vec4($auxpos1,1.0)).xyz;vec3 u;mat4 v\x3dmat4(1.0);\r\n#ifdef GLOBAL\r\nu\x3dnormalize(s+origin);\r\n#else\r\nu\x3dvec3(0.0,0.0,1.0);\r\n#endif\r\nvec3 w\x3d(viewMat*vec4(s,1.0)).xyz;gc\x3dnormalize(w-t);if(r){gg\x3dtexture2D(li,vec2(o,0.5));s+\x3d(u*getScope(lo.yz,o));}else{gg\x3dvec4(is,1.0);}vec3 x\x3dvec3(1.0,0.0,0.0);float y\x3d1.0;float z\x3d1.0;float A\x3dabs(dot(u,normalize(camPos-s)));float B\x3d0.00001;w\x3d(viewMat*vec4(s,1.0)).xyz;if(A\x3e.01){float C\x3dsqrt(1.0-A*A)/A;float D\x3d(1.0-C/em[2]);if(z\x3e0.0){w*\x3dD;}else{w/\x3dD;}}w+\x3dx;vec4 E\x3del*vec4(w,1.0);E.z-\x3dz*B*E.w;gl_Position\x3dmatchPixelCenter(E,em.zw);gc\x3dnormalize(u+gc*0.5);cg\x3dw;}]]\x3e\x3c/snippet\x3e\x3c/snippets\x3e'}});
define("dojo/text!./PointExtrudeMaterial.xml esri/core/declare ../../webgl-engine-extensions/GLSLShader ../../webgl-engine-extensions/GLSLProgramExt ../../support/fx3dUtils ../Materials".split(" "),function(g,h,e,k,m,l){return h([l],{declaredClass:"esri.views.3d.effects.PointExtrude.PointExtrudeMaterial",constructor:function(a){this._gl=a.gl;this._shaderSnippets=a.shaderSnippets;this._program=null;this._pushState=a.pushState;this._restoreState=a.restoreState;this._viewingMode=a.viewingMode},destroy:function(){this._program&&
(this._program.dispose(),delete this._program,this._program=null)},_addDefines:function(a,b){var c="";if(null!=b)if(Array.isArray(b))for(var d=0,e=b.length;d<e;d++)var f=b[d],c=c+("#define "+f+"\n");else for(f in b)c+="#define "+f+"\n";return this._shaderSnippets.defines+"\n"+c+a},loadShaders:function(){if(this._shaderSnippets){null!=this._shaderSnippets.pointExtrudeVS&&null!=this._shaderSnippets.pointExtrudeFS||this._shaderSnippets._parse(g);var a=[];"global"==this._viewingMode?a.push("GLOBAL"):
a.push("LOCAL");var a=this._addDefines(this._shaderSnippets.pointExtrudeVS,a),a=new e(35633,a,this._gl),b=new e(35632,this._shaderSnippets.pointExtrudeFS,this._gl);this._program=new k([a,b],this._gl)}return this._initResources()},_initResources:function(){return!0},bind:function(a,b){this._program.use();this._program.uniformMatrix4fv("el",a.proj);this._program.uniform4fv("em",a.viewport);this._program.uniform3fv("im",a.lightingData.direction);this._program.uniform4fv("ls",a.lightingData.ambient);
this._program.uniform4fv("ii",a.lightingData.diffuse);this._program.uniform4fv("ie",a.lightingData.specular);this._oldTex=this._gl.getParameter(32873);var c=this.getOldActiveUnit(b);a.pl.bind(c+1);this._program.uniform1i("pl",c+1);a.ms.bind(c+2);this._program.uniform1i("ms",c+2);this._program.uniform2fv("il",a.il);this._program.uniform2f("ss",a.ss,a.io);this._program.uniform3fv("lo",a.lo);this._gl.activeTexture(33984+c+3);this._gl.bindTexture(3553,a.li);this._program.uniform1i("li",c+3);this._program.uniform1f("lm",
a.lm);this._program.uniform1f("mp",a.mp);this._program.uniform3fv("is",a.is);this._program.uniform1f("oe",a.time);this._program.uniform1i("op",a.reachedRepeatLimit);this._program.uniform1f("lp",a.lp);this._program.uniform1f("ei",a.zoom);1!=b._depthTestEnabled&&(this._pushState(["setDepthTestEnabled",b._depthTestEnabled]),b.setDepthTestEnabled(!0));1!=b._polygonCullingEnabled&&(this._pushState(["setFaceCullingEnabled",b._polygonCullingEnabled]),b.setFaceCullingEnabled(!0));1029!=b._cullFace&&(this._pushState(["setCullFace",
b._cullFace]),b.setCullFace(1029));1!=b._blendEnabled&&(this._pushState(["setBlendingEnabled",b._blendEnabled]),b.setBlendingEnabled(!0))},bindVec3f:function(a,b,c,d){this._program.uniform3f(a,b,c,d)},bindVec3fv:function(a,b){this._program.uniform3fv(a,b)},bindMat4:function(a,b){this._program.uniformMatrix4fv(a,b)},release:function(a){this._gl.activeTexture(33984+a._activeTextureUnit+1);this._gl.bindTexture(3553,this._oldTex);this._restoreState(a);this._gl.useProgram(null)}})});