//>>built
define(["esri/core/declare","esri/views/3d/support/PromiseLightweight"],function(f,c){return f(c["default"]||c.PromiseLightweight,{constructor:function(){this.symbol=symbol;for(var d=0,c=!1,e=function(b,a){a&&(this.childGraphics3DSymbols[b]=a,validSymbols++);d--;!this.isRejected()&&c&&1>d&&(0<validSymbols?this.resolve():this.reject())},b=0;b<numSymbolLayers;b++){var a=symbolLayers.getItemAt(b);!1!==a.enable&&(context.layerOrder=layerOrder+(1-(1+b)/numSymbolLayers),context.layerOrderDelta=1/numSymbolLayers,
(a=Graphics3DSymbolLayerFactory.make(a,context,a._ignoreDrivers))&&(d++,this.childGraphics3DSymbolPromises[b]=a,a.then(e.bind(this,b,a),e.bind(this,b,null))))}context.layerOrder=layerOrder;c=!0;!this.isRejected()&&1>d&&(0<validSymbols?this.resolve():this.reject())},destroy:function(){this.isFulfilled()||this.reject()}})});