// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

define(["./basePortalUrlUtils"],function(l){function f(a,c){function b(e,c){var b,d,f,g,h="widgetOnScreen"===e;if(a[e]){if(a[e].groups)for(b=0;b<a[e].groups.length;b++)if(f=a[e].groups[b],c(f,{index:b,isWidget:!1,groupId:f.id,isThemeWidget:!1,isOnScreen:h}),a[e].groups[b].widgets)for(d=0;d<a[e].groups[b].widgets.length;d++)g=a[e].groups[b].widgets[d],c(g,{index:d,isWidget:!0,groupId:f.id,isThemeWidget:g.uri&&-1<g.uri.indexOf("themes/"+a.theme.name),isOnScreen:h});if(a[e].widgets)for(b=0;b<a[e].widgets.length;b++)g=
a[e].widgets[b],c(a[e].widgets[b],{index:b,isWidget:!0,groupId:e,isThemeWidget:g.uri&&-1<g.uri.indexOf("themes/"+a.theme.name),isOnScreen:h})}}b("widgetOnScreen",c);b("widgetPool",c)}var d={},k="inPanel hasLocale hasStyle hasConfig hasUIFile hasSettingPage hasSettingUIFile hasSettingLocale hasSettingStyle keepConfigAfterMapSwitched isController hasVersionManager isThemeWidget supportMultiInstance mirrorIconForRTL".split(" ");d.visitElement=f;d.getConfigElementById=function(a,c){var b;if("map"===c)return a.map;
f(a,function(a){if(a.id===c)return b=a,!0});return b};d.getConfigElementByLabel=function(a,c){var b;if("map"===c)return a.map;f(a,function(a){if(a.label||a.name===c)return b=a,!0});return b};d.getConfigElementsByName=function(a,c){var b=[];if("map"===c)return[a.map];f(a,function(a){a.name===c&&b.push(a)});return b};d.getWidgetNameFromUri=function(a){a=a.split("/");a.pop();return a.pop()};d.getAmdFolderFromUri=function(a){a=a.split("/");a.pop();return a.join("/")+"/"};d.widgetProperties=k;d.processWidgetProperties=
function(a){"undefined"===typeof a.properties.isController&&(a.properties.isController=!1);"undefined"===typeof a.properties.isThemeWidget&&(a.properties.isThemeWidget=!1);"undefined"===typeof a.properties.hasVersionManager&&(a.properties.hasVersionManager=!1);"undefined"===typeof a.properties.mirrorIconForRTL&&(a.properties.mirrorIconForRTL=!1);k.forEach(function(c){"undefined"===typeof a.properties[c]&&(a.properties[c]=!0)})};d.getControllerWidgets=function(a){var c=[];a.visitElement(function(a){a.isController&&
c.push(a)});return c};d.isHostedService=function(a){var c=l.getServerByUrl(a);return(new RegExp(c+"/[^/]+/[^/]+/rest/services","gi")).test(a)};return d});