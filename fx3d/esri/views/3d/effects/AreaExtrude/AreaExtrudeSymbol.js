//>>built
define(["esri/core/declare","esri/views/3d/support/PromiseLightweight"],function(f,g){return f(g.Promise,{constructor:function(){this.symbol=symbol;for(var c=0,d=!1,e=function(b,a){a&&(this.childGraphics3DSymbols[b]=a,validSymbols++);c--;!this.isRejected()&&d&&1>c&&(0<validSymbols?this.resolve():this.reject())},b=0;b<numSymbolLayers;b++){var a=symbolLayers.getItemAt(b);!1!==a.enable&&(context.layerOrder=layerOrder+(1-(1+b)/numSymbolLayers),context.layerOrderDelta=1/numSymbolLayers,(a=Graphics3DSymbolLayerFactory.make(a,
context,a._ignoreDrivers))&&(c++,this.childGraphics3DSymbolPromises[b]=a,a.then(e.bind(this,b,a),e.bind(this,b,null))))}context.layerOrder=layerOrder;d=!0;!this.isRejected()&&1>c&&(0<validSymbols?this.resolve():this.reject())},destroy:function(){this.isFulfilled()||this.reject()}})});