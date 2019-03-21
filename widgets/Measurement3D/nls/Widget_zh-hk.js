// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

define({"esri/widgets/DirectLineMeasurement3D/nls/DirectLineMeasurement3D":{title:"\u6e2c\u91cf",hint:"\u6309\u4e00\u4e0b\u5834\u666f\u4f86\u653e\u7f6e\u7b2c\u4e00\u500b\u9ede\uff0c\u4ee5\u958b\u59cb\u6e2c\u91cf",unsupported:"\u50c5 SceneView \u652f\u63f4 3D \u76f4\u7dda\u6e2c\u91cf\u3002",distance:"\u8ddd\u96e2",direct:"\u65b9\u5411",horizontal:"\u6c34\u5e73",vertical:"\u5782\u76f4",unit:"\u55ae\u4f4d",newMeasurement:"\u65b0\u6e2c\u91cf",units:{metric:"\u516c\u5236",imperial:"\u82f1\u5236",kilometers:"\u516c\u91cc",
meters:"\u516c\u5c3a",miles:"\u82f1\u91cc",inches:"\u82f1\u540b",feet:"\u82f1\u544e",yards:"\u78bc","nautical-miles":"\u6d77\u6d6c","us-feet":"\u82f1\u544e (\u7f8e\u5236)","degrees-minutes-seconds":"DMS",degrees:"\u5ea6"},_localized:{}},"esri/core/nls/Units":{measures:{length:"\u9577\u5ea6",area:"\u9762\u7a4d",volume:"\u9ad4\u7a4d",angle:"\u89d2\u5ea6"},units:{millimeters:{singular:"\u516c\u91d0",plural:"\u516c\u91d0",abbr:"mm"},centimeters:{singular:"\u516c\u5206",plural:"\u516c\u5206",abbr:"cm"},
decimeters:{singular:"\u516c\u5bf8",plural:"\u516c\u5bf8",abbr:"dm"},meters:{singular:"\u516c\u5c3a",plural:"\u516c\u5c3a",abbr:"m"},kilometers:{singular:"\u516c\u91cc",plural:"\u516c\u91cc",abbr:"km"},inches:{singular:"\u82f1\u540b",plural:"\u82f1\u540b",abbr:"in"},feet:{singular:"\u82f1\u544e",plural:"\u82f1\u544e",abbr:"ft"},yards:{singular:"\u78bc",plural:"\u78bc",abbr:"yd"},miles:{singular:"\u82f1\u91cc",plural:"\u82f1\u91cc",abbr:"mi"},"nautical-miles":{singular:"\u6d77\u6d6c",plural:"\u6d77\u6d6c",
abbr:"nm"},"us-feet":{singular:"\u82f1\u544e (\u7f8e\u5236)",plural:"\u82f1\u544e (\u7f8e\u5236)",abbr:"ft"},"square-millimeters":{singular:"\u5e73\u65b9\u516c\u91d0",plural:"\u5e73\u65b9\u516c\u91d0",abbr:"mm\u00b2"},"square-centimeters":{singular:"\u5e73\u65b9\u516c\u5206",plural:"\u5e73\u65b9\u516c\u5206",abbr:"cm\u00b2"},"square-decimeters":{singular:"\u5e73\u65b9\u516c\u5bf8",plural:"\u5e73\u65b9\u516c\u5bf8",abbr:"dm\u00b2"},"square-meters":{singular:"\u5e73\u65b9\u516c\u5c3a",plural:"\u5e73\u65b9\u516c\u5c3a",
abbr:"m\u00b2"},"square-kilometers":{singular:"\u5e73\u65b9\u516c\u91cc",plural:"\u5e73\u65b9\u516c\u91cc",abbr:"km\u00b2"},"square-inches":{singular:"\u5e73\u65b9\u82f1\u540b",plural:"\u5e73\u65b9\u82f1\u540b",abbr:"in\u00b2"},"square-feet":{singular:"\u5e73\u65b9\u82f1\u544e",plural:"\u5e73\u65b9\u82f1\u544e",abbr:"ft\u00b2"},"square-yards":{singular:"\u5e73\u65b9\u78bc",plural:"\u5e73\u65b9\u78bc",abbr:"yd\u00b2"},"square-miles":{singular:"\u5e73\u65b9\u82f1\u91cc",plural:"\u5e73\u65b9\u82f1\u91cc",
abbr:"mi\u00b2"},"square-us-feet":{singular:"\u5e73\u65b9\u82f1\u544e (\u7f8e\u5236)",plural:"\u5e73\u65b9\u82f1\u544e (\u7f8e\u5236)",abbr:"ft\u00b2"},acres:{singular:"\u82f1\u755d",plural:"\u82f1\u755d",abbr:"\u82f1\u755d"},ares:{singular:"are",plural:"\u516c\u755d",abbr:"a"},hectares:{singular:"\u516c\u9803",plural:"\u516c\u9803",abbr:"ha"},liters:{singular:"\u516c\u5347",plural:"\u516c\u5347",abbr:"l"},"cubic-millimeters":{singular:"\u7acb\u65b9\u516c\u91d0",plural:"\u7acb\u65b9\u516c\u91d0",
abbr:"mm\u00b3"},"cubic-centimeters":{singular:"\u7acb\u65b9\u516c\u5206",plural:"\u7acb\u65b9\u516c\u5206",abbr:"cm\u00b3"},"cubic-decimeters":{singular:"\u7acb\u65b9\u516c\u5bf8",plural:"\u7acb\u65b9\u516c\u5bf8",abbr:"dm\u00b3"},"cubic-meters":{singular:"\u7acb\u65b9\u516c\u5c3a",plural:"\u7acb\u65b9\u516c\u5c3a",abbr:"m\u00b3"},"cubic-kilometers":{singular:"\u7acb\u65b9\u516c\u91cc",plural:"\u7acb\u65b9\u516c\u91cc",abbr:"km\u00b3"},"cubic-inches":{singular:"\u7acb\u65b9\u82f1\u540b",plural:"\u7acb\u65b9\u82f1\u540b",
abbr:"in\u00b3"},"cubic-feet":{singular:"\u7acb\u65b9\u82f1\u544e",plural:"\u7acb\u65b9\u82f1\u544e",abbr:"ft\u00b3"},"cubic-yards":{singular:"\u7acb\u65b9\u78bc",plural:"\u7acb\u65b9\u78bc",abbr:"yd\u00b3"},"cubic-miles":{singular:"\u7acb\u65b9\u82f1\u91cc",plural:"\u7acb\u65b9\u82f1\u91cc",abbr:"mi\u00b3"},radians:{singular:"\u5f27\u5ea6",plural:"\u5f27\u5ea6",abbr:""},degrees:{singular:"\u5ea6",plural:"\u5ea6",abbr:"\u00b0"}},_localized:{}},"esri/widgets/AreaMeasurement3D/nls/AreaMeasurement3D":{title:"\u6e2c\u91cf",
hint:"\u6309\u4e00\u4e0b\u5834\u666f\u4f86\u653e\u7f6e\u7b2c\u4e00\u500b\u9ede\uff0c\u4ee5\u958b\u59cb\u6e2c\u91cf",unsupported:"\u50c5 SceneView \u652f\u63f4 3D \u9762\u7a4d\u6e2c\u91cf\u3002",perimeterLength:"\u5468\u908a",area:"\u9762\u7a4d",unit:"\u55ae\u4f4d",notApplicable:"\u7121",newMeasurement:"\u65b0\u6e2c\u91cf",units:{metric:"\u516c\u5236",imperial:"\u82f1\u5236","square-kilometers":"\u5e73\u65b9\u516c\u91cc","square-meters":"\u5e73\u65b9\u516c\u5c3a","square-miles":"\u5e73\u65b9\u82f1\u91cc",
"square-inches":"\u5e73\u65b9\u82f1\u540b","square-feet":"\u5e73\u65b9\u82f1\u544e","square-yards":"\u5e73\u65b9\u78bc","square-us-feet":"\u5e73\u65b9\u82f1\u544e (\u7f8e\u5236)",acres:"\u82f1\u755d",ares:"\u516c\u755d",hectares:"\u516c\u9803"},_localized:{}},"widgets/Measurement3D/nls/strings":{_widgetLabel:"\u91cf\u6e2c",newMeasurement:"\u65b0\u6e2c\u91cf",distance:"\u8ddd\u96e2",area:"\u9762\u7a4d",slice:"\u5207\u7247",measureDistance:"\u6e2c\u91cf\u8ddd\u96e2",measureArea:"\u6e2c\u91cf\u9762\u7a4d",
sliceObjects:"\u5207\u7247\u7269\u4ef6",hint:"\u5148\u9078\u64c7\u6e2c\u91cf\u5de5\u5177\u958b\u59cb\u57f7\u884c",_localized:{}}});