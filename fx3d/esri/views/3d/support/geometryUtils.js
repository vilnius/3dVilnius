//>>built
define("esri/views/3d/layers/graphics/Graphics3DSymbolCommonCode esri/core/libs/gl-matrix-2/vec3f64 esri/core/libs/gl-matrix-2/mat4f64 esri/core/libs/gl-matrix-2/vec3 esri/core/libs/gl-matrix-2/mat4 esri/views/3d/webgl-engine/lib/Util esri/views/3d/support/mathUtils".split(" "),function(p,q,r,m,n,t,u){var l=q.vec3f64;m=m.vec3;var v=r.mat4f64;n=n.mat4;var w=t.logWithBase;return{getOrigin:function(c,h,b,a){if(!(0>=c.length)){var e=l.create();p.chooseOrigin(c,b,a,e);p.subtractCoordinates(c,0,h,e);var g,
d=0,f=l.fromValues(c[d],c[d+1],c[d+2]),k=l.create(this.bbMin);for(b=0;b<h;b++)for(d=3*b,a=0;3>a;a++)g=c[d+a],g<f[a]?f[a]=g:g>k[a]&&(k[a]=g);a=l.create();m.lerp(a,f,k,.5);for(b=f=0;b<h;b++)d=3*b,k=c[d]-a[0],g=c[d+1]-a[1],d=c[d+2]-a[2],d=k*k+g*g+d*d,d>f&&(f=d);f=Math.sqrt(f);b=v.create();n.translate(b,b,e);c=u.maxScale(b);m.transformMat4(a,a,b);e=0;b=f*c*10/1E4;1<b&&(e=Math.ceil(w(b,2)));c=1E4*Math.pow(2,e);b=Math.round(a[0]/c);h=Math.round(a[1]/c);a=Math.round(a[2]/c);e=e+"_"+b+"_"+h+"_"+a;return{vec3:l.fromValues(b*
c,h*c,a*c),id:e}}}}});