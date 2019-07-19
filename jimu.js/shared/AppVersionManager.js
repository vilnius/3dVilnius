// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define(["./BaseVersionManager"],function(f){function e(){this.versions=[{version:"2.0beta",description:"The version for Developer Edition beta 2.0.",upgrader:function(a){return a},compatible:!0},{version:"2.0",description:"The version for Online 4.1.",upgrader:function(a){return a},compatible:!0},{version:"2.0.1",description:"The version for Developer Edition 2.0.",upgrader:function(a){var b=null,d=0,c=a.widgetOnScreen.widgets;if(c&&0<c.length)for(d=0;d<c.length;d++)b=c[d],"widgets/Viz/Widget"===
b.uri&&(b.uri="widgets/3DFx/Widget",b.name="3DFx");if((c=a.widgetPool.widgets)&&0<c.length)for(d=0;d<c.length;d++)b=c[d],"widgets/Viz/Widget"===b.uri&&(b.uri="widgets/3DFx/Widget",b.name="3DFx");return a},compatible:!0},{version:"2.1",description:"The version for Online 4.2.",upgrader:function(a){return a},compatible:!0},{version:"2.2",description:"The version for Online 4.3.",upgrader:function(a){return a},compatible:!0},{version:"2.3",description:"The version for Online 4.4.",upgrader:function(a){return a},
compatible:!0},{version:"2.4",description:"The version for Online 5.1.",upgrader:function(a){return a},compatible:!0},{version:"2.5",description:"The version for Online 5.2.",upgrader:function(a){return a},compatible:!0},{version:"2.6",description:"The version for Online 5.3.",upgrader:function(a){return a},compatible:!0},{version:"2.7",description:"The version for Online 5.4.",upgrader:function(a){(function(){function b(d){var c=0,b=0;if(a[d].widgets)for(c=0;c<a[d].widgets.length;c++)if("widgets/Environment/Widget"===
a[d].widgets[c].uri){a[d].widgets[c].uri="widgets/Daylight/Widget";break}if(a[d].groups)for(c=0;c<a[d].groups.length;c++)for(var e=a[d].groups[c],b=0;b<e.widgets.length;b++)if("widgets/Environment/Widget"===e.widgets[b].uri){e.widgets[b].uri="widgets/Daylight/Widget";break}}b("widgetOnScreen");b("widgetPool")})();return a},compatible:!0},{version:"2.8",description:"The version for Online 6.1.",upgrader:function(a){return a},compatible:!0},{version:"2.9",description:"The version for Online 6.2.",upgrader:function(a){return a},
compatible:!0},{version:"2.10",description:"The version for Online 6.3.",upgrader:function(a){return a},compatible:!0},{version:"2.11",description:"The version for Online 6.4.",upgrader:function(a){return a},compatible:!0},{version:"2.12",description:"The version for Online 7.1",upgrader:function(a){return a},compatible:!0}];this.isCompatible=function(a,b){a=this.getVersionIndex(a);b=this.getVersionIndex(b);for(a+=1;a<=b;a++)if(!1===this.versions[a].compatible)return!1;return!0}}e.prototype=new f;
return e.prototype.constructor=e});