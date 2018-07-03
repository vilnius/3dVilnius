//>>built
require({cache:{"url:fx3d/views/3d/effects/Pulse/PulseMaterial.xml":'\x3c?xml version\x3d"1.0" encoding\x3d"UTF-8"?\x3e\x3c!-- Copyright @ 2017 Esri. All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions. --\x3e\x3csnippets\x3e\x3csnippet name\x3d"pulseFS"\x3e\x3c![CDATA[\r\n#ifdef GL_ES\r\nprecision mediump float;\r\n#endif\r\nuniform vec3 pi;uniform vec4 ls;uniform vec4 ip;uniform vec4 im;uniform vec3 io;uniform float lm;uniform vec3 se;varying vec2 hg;varying vec3 dh;varying vec3 hc;varying vec4 gg;const vec3 a\x3dvec3(1.0,1.0,1.0);const vec3 b\x3dvec3(1.0,1.0,1.0);const vec3 c\x3dvec3(0.4,0.4,0.4);void main(){vec3 d\x3dnormalize(hc-io);vec3 e\x3dnormalize(dh);vec3 f\x3dnormalize(reflect(d,e));float g\x3dmax(dot(f,pi),.001);vec3 h\x3dc*im.rgb*im.w*pow(g,16.0);vec3 i\x3da*ip.rgb*ip.w*clamp(dot(e,pi),.0,1.0);vec3 j\x3db*ls.rgb*ls.w;vec3 k\x3dvec3(j+i+h);float l\x3dabs(hg.x-0.5)/0.5;gl_FragColor\x3d(1.0-l)*vec4(se,1.0)+l*gg;gl_FragColor*\x3dvec4(k,1.0);float m\x3dlm*0.01;gl_FragColor.w\x3dm;}]]\x3e\x3c/snippet\x3e\x3csnippet name\x3d"pulseVS"\x3e\x3c![CDATA[attribute vec3 $position;attribute vec3 $auxpos1;uniform mat4 pe;uniform mat4 il;uniform bool op;uniform float ol;uniform sampler2D el;uniform sampler2D es;uniform vec2 lo;uniform float pm;uniform vec2 mp;uniform float ps;uniform vec2 ss;uniform bool sp;uniform sampler2D li;varying vec3 dh;varying vec3 hc;varying vec2 hg;varying vec4 gg; $lonlat2position  $translationMat  $linearInterpolator  $localTrans  $expoEaseOut const float a\x3d0.0;const float b\x3d1.0;const float c\x3d2.0;const float d\x3d3.0;void main(void){float e\x3dfract($auxpos1.x/lo.x);float f\x3dfloor($auxpos1.x/lo.y)/lo.y;float g\x3d(texture2D(el,vec2(e,f))).r;float h\x3d(texture2D(es,vec2(e,f))).r;float i\x3dmod(ps,pm);float j\x3dgetExpoEaseOutValue(i,g,h,pm);if(sp) j\x3dh;float k\x3dgetLinearValue(ss,j);if(op){float l\x3d200000.0;if($auxpos1.y\x3d\x3da||$auxpos1.y\x3d\x3dd){l\x3dgetScope(mp,k);}else if($auxpos1.y\x3d\x3db||$auxpos1.y\x3d\x3dc){l\x3d1.25*getScope(mp,k);}if($auxpos1.y\x3d\x3da) hg\x3dvec2(0.0,0.0);else if($auxpos1.y\x3d\x3dd) hg\x3dvec2(0.0,1.0);else if($auxpos1.y\x3d\x3db) hg\x3dvec2(1.0,0.0);else if($auxpos1.y\x3d\x3dc) hg\x3dvec2(1.0,1.0);float m\x3d$auxpos1.z*2.0*PI;vec3 n\x3dvec3(l*cos(m),l*sin(m),0.0);vec3 o,p;mat4 q\x3dmat4(1.0);\r\n#ifdef GLOBAL\r\nmat4 r\x3dgetTransMat($position);q\x3dtoRotationMat(r);o\x3d(r*vec4(n,1.0)).xyz;vec4 s\x3dvec4(0.0,0.0,1.0,0.0);p\x3d(q*s).xyz;\r\n#else\r\no\x3dwgs84ToWebMerc($position);o+\x3dn;p\x3dvec3(1.0,0.0,1.0);\r\n#endif\r\ngl_Position\x3dpe*il*vec4(o,1.0);dh\x3dnormalize(p);hc\x3do;gg\x3dtexture2D(li,vec2(k,0.5));}else{float t\x3dgetScope(mp,k);mat4 r\x3dgetTransMat($position);float u\x3d($auxpos1.y-ol/2.0)*(20.0/ol);float v\x3d($auxpos1.z-ol/2.0)*(20.0/ol);float w\x3dexp(-0.0831*(u*u+v*v));float x\x3datan(u,v);u\x3dw*cos(2.0*x);v\x3dw*sin(2.0*x);float y\x3dsqrt(u*u+v*v)*getScope(mp,k);vec3 o\x3d(r*vec4(t*($auxpos1.y/ol-0.5),t*($auxpos1.z/ol-0.5),y,1.0)).xyz;vec3 p\x3dnormalize(o);gl_Position\x3dpe*il*vec4(o,1.0);dh\x3dp;hc\x3do;hg\x3d$auxpos1.yz/(ol-1.0);}}]]\x3e\x3c/snippet\x3e\x3c/snippets\x3e'}});
define(["dojo/text!./PulseMaterial.xml","esri/core/declare","esri/views/3d/webgl-engine/lib/GLSLShader","../../webgl-engine-extensions/GLSLProgramExt","../../support/fx3dUtils"],function(g,h,d,k,l){return h(null,{declaredClass:"esri.views.3d.effects.Pulse.PulseMaterial",constructor:function(a){this._gl=a.gl;this._shaderSnippets=a.shaderSnippets;this._program=null;this._viewingMode=a.viewingMode;this._pushState=a.pushState;this._restoreState=a.restoreState},destroy:function(){this._program&&(this._program.dispose(),
delete this._program,this._program=null)},_addDefines:function(a,b){var c="";if(null!=b)if(Array.isArray(b))for(var e=0,d=b.length;e<d;e++)var f=b[e],c=c+("#define "+f+"\n");else for(f in b)c+="#define "+f+"\n";return this._shaderSnippets.defines+"\n"+c+a},loadShaders:function(){if(this._shaderSnippets){void 0!==this._shaderSnippets.pulseVS&&void 0!==this._shaderSnippets.pulseFS||this._shaderSnippets._parse(g);var a=[];"global"==this._viewingMode?a.push("GLOBAL"):a.push("LOCAL");var a=this._addDefines(this._shaderSnippets.pulseVS,
a),a=new d(35633,a,this._gl),b=new d(35632,this._shaderSnippets.pulseFS,this._gl);this._program=new k([a,b],this._gl)}return this._initResources()},getProgram:function(){return this._program},_initResources:function(){return!0},bind:function(a,b){this._program.use();this._program.uniformMatrix4fv("pe",a.proj);this._program.uniformMatrix4fv("il",a.view);this._program.uniform1i("op",a.op);this._program.uniform1f("ol",a.ol);this._program.uniform3fv("io",a.camPos);this._program.uniform3fv("pi",a.lightingData.direction);
this._program.uniform4fv("ls",a.lightingData.ambient);this._program.uniform4fv("ip",a.lightingData.diffuse);this._program.uniform4fv("im",a.lightingData.specular);this._oldTex=this._gl.getParameter(32873);var c=b._activeTextureUnit;c>b.parameters.maxVertexTextureImageUnits-1-3&&(console.warn("Many textures are binded now, 3DFx lib may be work abnormally."),c=0);a.el.bind(c+1);this._program.uniform1i("el",c+1);a.es.bind(c+2);this._program.uniform1i("es",c+2);this._program.uniform2fv("lo",a.lo);this._program.uniform2fv("ss",
[a.ss,a.si]);this._program.uniform2fv("mp",a.mp);this._program.uniform1f("pm",a.pm);this._program.uniform1f("lm",a.lm);this._gl.activeTexture(33984+c+3);this._gl.bindTexture(3553,a.li);this._program.uniform1i("li",c+3);this._program.uniform1f("ps",a.time);this._program.uniform1i("sp",a.reachedRepeatLimit);this._program.uniform3fv("se",a.se);1!=b._depthTestEnabled&&(this._pushState(["setDepthTestEnabled",b._depthTestEnabled]),b.setDepthTestEnabled(!0));519!=b._depthFunction&&(this._pushState(["setDepthFunction",
b._depthFunction]),b.setDepthFunction(519));0!=b._depthWriteEnabled&&(this._pushState(["setDepthWriteEnabled",b._depthWriteEnabled]),b.setDepthWriteEnabled(!1));1!=b._polygonCullingEnabled&&(this._pushState(["setFaceCullingEnabled",b._polygonCullingEnabled]),b.setFaceCullingEnabled(!0));1028!=b._cullFace&&(this._pushState(["setCullFace",b._cullFace]),b.setCullFace(1028));1!=b._blendEnabled&&(this._pushState(["setBlendingEnabled",b._blendEnabled]),b.setBlendingEnabled(!0));this._pushState(["setBlendFunctionSeparate",
[b._blendFunctionState.srcRGB,b._blendFunctionState.dstRGB,b._blendFunctionState.srcAlpha,b._blendFunctionState.dstAlpha]]);b.setBlendFunction(770,771)},release:function(a){this._gl.activeTexture(33984+a._activeTextureUnit+1);this._gl.bindTexture(3553,this._oldTex);this._restoreState(a);this._gl.useProgram(null)}})});