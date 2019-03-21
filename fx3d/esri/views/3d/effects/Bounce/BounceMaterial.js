//>>built
require({cache:{"url:fx3d/views/3d/effects/Bounce/BounceMaterial.xml":'\x3c?xml version\x3d"1.0" encoding\x3d"UTF-8"?\x3e\x3c!-- Copyright @ 2019 Esri. All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions. --\x3e\x3csnippets\x3e\x3csnippet name\x3d"bounceFS"\x3e\x3c![CDATA[\r\n#ifdef GL_ES\r\nprecision mediump float;\r\n#endif\r\nuniform float me;uniform vec3 pl;uniform vec4 ss;uniform vec4 ls;uniform vec4 po;uniform vec3 im;uniform float ee;uniform sampler2D lp;varying vec4 gh;varying vec3 gc;varying vec3 dc;void main(void){float a\x3dme*0.01;gl_FragColor.rgb\x3dgh.rgb;gl_FragColor.a\x3d1.0;gl_FragColor\x3dtexture2D(lp,gl_PointCoord)*gl_FragColor;gl_FragColor.a*\x3da*0.8;if(gl_FragColor.r\x3c\x3d1e-6\x26\x26gl_FragColor.g\x3c\x3d1e-6\x26\x26gl_FragColor.b\x3c\x3d1e-6){gl_FragColor.rgb\x3dvec3(0.1,0.1,0.1);gl_FragColor.a*\x3d0.1;}}]]\x3e\x3c/snippet\x3e\x3csnippet name\x3d"bounceVS"\x3e\x3c![CDATA[attribute vec3 $position;attribute vec2 $auxpos1;uniform mat4 le;uniform mat4 ei;uniform sampler2D pi;uniform vec2 se;uniform float ee;uniform float eo;uniform vec2 pm;uniform sampler2D ip;uniform vec3 em;varying vec4 gh;varying vec3 gc;varying vec3 dc;varying vec3 dh; $linearInterpolator  $lonlat2position  $translationMat  $localTrans  $bounceEaseOut void main(void){float a\x3dfract($auxpos1.y/se.x);float b\x3dfloor($auxpos1.y/se.y)/se.y;float c\x3d(texture2D(pi,vec2(a,b))).r;float d\x3dgetLinearValue(pm,c);float e\x3dmod(eo,ee);float f\x3dgetBounceEaseOutValue(e,0.0,c,ee);float g\x3dgetLinearValue(pm,f);vec3 h,i;mat4 j\x3dmat4(1.0);\r\n#ifdef GLOBAL\r\nmat4 k\x3dgetTransMat($position);h\x3dk[3].xyz;j\x3dtoRotationMat(k);vec4 l\x3dvec4(0.0,0.0,1.0,0.0);i\x3d(j*l).xyz;\r\n#else\r\nh\x3dwgs84ToWebMerc($position);i\x3dvec3(0.0,0.0,1.0);\r\n#endif\r\ngc\x3dnormalize(i);h+\x3d(i*abs($auxpos1.x)*em.z*g);if($auxpos1.x\x3c0.0){gl_PointSize\x3dgetScope(em.xy,d);}else{gl_PointSize\x3dgetScope(em.xy,d)*0.4;}gl_Position\x3dle*ei*vec4(h,1.0);dc\x3dh;gh\x3dtexture2D(ip,vec2(g,0.5));}]]\x3e\x3c/snippet\x3e\x3csnippet name\x3d"timeInfoBounceFS"\x3e\x3c![CDATA[\r\n#ifdef GL_ES\r\nprecision mediump float;\r\n#endif\r\nuniform float me;uniform vec3 pl;uniform vec4 ss;uniform vec4 ls;uniform vec4 po;uniform vec3 im;uniform bool drawFlyPath;uniform float ee;uniform sampler2D lp;varying vec4 gh;varying vec3 gc;varying vec3 dc;varying vec4 dh; $quintEaseOut void main(void){float a\x3dme*0.01;gl_FragColor.rgb\x3dgh.rgb;gl_FragColor.a\x3d1.0;if(drawFlyPath){float b\x3dgetQuintEaseInOutValue(dh.x,0.0,dh.z-1.0,ee);if(dh.y\x3eb){gl_FragColor.a\x3d0.0;discard;}}else{gl_FragColor\x3dtexture2D(lp,gl_PointCoord)*gl_FragColor;gl_FragColor.a*\x3da;}if(gl_FragColor.r\x3c\x3d1e-6\x26\x26gl_FragColor.g\x3c\x3d1e-6\x26\x26gl_FragColor.b\x3c\x3d1e-6){gl_FragColor.rgb\x3dvec3(0.1,0.1,0.1);}}]]\x3e\x3c/snippet\x3e\x3csnippet name\x3d"timeInfoBounceVS"\x3e\x3c![CDATA[ $defines attribute vec3 $position;attribute vec2 $auxpos1;uniform mat4 le;uniform mat4 ei;uniform sampler2D pi;uniform vec2 se;uniform float ee;uniform float eo;uniform vec2 pm;uniform sampler2D ip;uniform bool drawFlyPath;uniform vec3 em;uniform float currentIndex;varying vec4 gh;varying vec3 gc;varying vec3 dc;varying vec4 dh; $linearInterpolator  $lonlat2position  $translationMat  $localTrans  $bounceEaseOut void main(void){float a\x3dfract($auxpos1.y/se.x);float b\x3dfloor($auxpos1.y/se.y)/se.y;float c\x3d(texture2D(pi,vec2(a,b))).r;float d\x3dgetLinearValue(pm,c);float e\x3dmod(eo,ee);float f\x3dgetBounceEaseOutValue(e,0.0,c,ee);float g\x3dgetLinearValue(pm,f);vec3 h,i;if(drawFlyPath){h\x3d$position;gc\x3dnormalize(h);}else{mat4 j\x3dmat4(1.0);\r\n#ifdef GLOBAL\r\nmat4 k\x3dgetTransMat($position);h\x3dk[3].xyz;j\x3dtoRotationMat(k);vec4 l\x3dvec4(0.0,0.0,1.0,0.0);i\x3d(j*l).xyz;\r\n#else\r\nh\x3dwgs84ToWebMerc($position);i\x3dvec3(0.0,0.0,1.0);\r\n#endif\r\ngc\x3dnormalize(i);if(currentIndex\x3d\x3d$auxpos1.y){h+\x3d(i*abs($auxpos1.x)*em.z*g);}else{h+\x3d(i*abs($auxpos1.x)*em.z*d);}if($auxpos1.x\x3c0.0){gl_PointSize\x3dgetScope(em.xy,d);}else{gl_PointSize\x3dgetScope(em.xy,d)*0.4;}}if(drawFlyPath){dh\x3dvec4(e,$auxpos1.x,$auxpos1.y,0.0);}gl_Position\x3dle*ei*vec4(h,1.0);dc\x3dh;gh\x3dtexture2D(ip,vec2(d,0.5));}]]\x3e\x3c/snippet\x3e\x3c/snippets\x3e'}});
define(["dojo/text!./BounceMaterial.xml","esri/core/declare","../../webgl-engine-extensions/GLSLShader","../../webgl-engine-extensions/GLSLProgramExt","../../support/fx3dUtils"],function(g,h,d,k,l){return h(null,{declaredClass:"esri.views.3d.effects.Bounce.BounceMaterial",constructor:function(a){this._gl=a.gl;this._shaderSnippets=a.shaderSnippets;this._program=null;this._pushState=a.pushState;this._restoreState=a.restoreState;this._srcAlpha=770;this._dstAlpha=771;this._viewingMode=a.viewingMode;"local"==
a.viewingMode&&(this._srcAlpha=770,this._dstAlpha=771)},destroy:function(){this._program&&(this._program.dispose(),delete this._program,this._program=null)},_addDefines:function(a,b){var c="";if(null!=b)if(Array.isArray(b))for(var e=0,d=b.length;e<d;e++)var f=b[e],c=c+("#define "+f+"\n");else for(f in b)c+="#define "+f+"\n";return this._shaderSnippets.defines+"\n"+c+a},loadShaders:function(a){if(this._shaderSnippets){var b="bounceVS",c="bounceFS";a&&(b="timeInfoBounceVS",c="timeInfoBounceFS");null!=
this._shaderSnippets[b]&&null!=this._shaderSnippets[c]||this._shaderSnippets._parse(g);a=[];"global"==this._viewingMode?a.push("GLOBAL"):a.push("LOCAL");b=this._addDefines(this._shaderSnippets[b],a);b=new d(35633,b,this._gl);c=new d(35632,this._shaderSnippets[c],this._gl);this._program=new k([b,c],this._gl)}return this._initResources()},getProgram:function(){return this._program},_initResources:function(){return!0},bind:function(a,b){this._program.use();this._program.uniformMatrix4fv("le",a.proj);
this._program.uniformMatrix4fv("ei",a.view);this._program.uniform3fv("im",a.camPos);this._program.uniform3fv("pl",a.lightingData.direction);this._program.uniform4fv("ss",a.lightingData.ambient);this._program.uniform4fv("ls",a.lightingData.diffuse);this._program.uniform4fv("po",a.lightingData.specular);this._oldTex=this._gl.getParameter(32873);var c=b._activeTextureUnit;c>b.parameters.maxVertexTextureImageUnits-1-3&&(console.warn("Many textures are binded now, 3DFx lib may be work abnormally."),c=
0);a.pi.bind(c+1);this._program.uniform1i("pi",c+1);this._program.uniform2fv("se",a.se);this._program.uniform2fv("pm",[a.pm,a.il]);this._gl.activeTexture(33984+c+2);this._gl.bindTexture(3553,a.ip);this._program.uniform1i("ip",c+2);this._gl.activeTexture(33984+c+3);this._gl.bindTexture(3553,a.lp);this._program.uniform1i("lp",c+3);this._program.uniform3fv("em",a.em);this._program.uniform1f("ee",a.ee);this._program.uniform1f("me",a.me);this._program.uniform1f("eo",a.time);1!=b._depthTestEnabled&&(this._pushState(["setDepthTestEnabled",
b._depthTestEnabled]),b.setDepthTestEnabled(!0));0!=b._depthWriteEnabled&&(this._pushState(["setDepthWriteEnabled",b._depthWriteEnabled]),b.setDepthWriteEnabled(!1))},bindBoolean:function(a,b){this._program.uniform1i(a,b)},bindFloat:function(a,b){this._program.uniform1f(a,b)},blend:function(a,b){a?(1!=b._blendEnabled&&(this._pushState(["setBlendingEnabled",b._blendEnabled]),b.setBlendingEnabled(!0)),this._pushState(["setBlendFunctionSeparate",[b._blendFunctionState.srcRGB,b._blendFunctionState.dstRGB,
b._blendFunctionState.srcAlpha,b._blendFunctionState.dstAlpha]]),b.setBlendFunction(this._srcAlpha,this._dstAlpha)):0!=b._blendEnabled&&(this._pushState(["setBlendingEnabled",b._blendEnabled]),b.setFaceCullingEnabled(!1))},release:function(a){this._gl.activeTexture(33984+a._activeTextureUnit+1);this._gl.bindTexture(3553,this._oldTex);this._restoreState(a);this._gl.useProgram(null)}})});