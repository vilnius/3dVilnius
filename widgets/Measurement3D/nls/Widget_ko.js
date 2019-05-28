// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define({"esri/widgets/DirectLineMeasurement3D/nls/DirectLineMeasurement3D":{title:"\uce21\uc815",hint:"\uccab \ubc88\uc9f8 \uc9c0\uc810\uc744 \ubc30\uce58\ud558\uae30 \uc704\ud574 \uc52c\uc744 \ud074\ub9ad\ud558\uc5ec \uce21\uc815 \uc2dc\uc791",unsupported:"\ub9f5 \ubdf0\uc5d0\uc11c \uc9c1\uc120 \uce21\uc815\uc774 \uc9c0\uc6d0\ub418\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",distance:"\uac70\ub9ac(Distance)",direct:"\uc9c1\uc811",horizontal:"\uc218\ud3c9",vertical:"\uc218\uc9c1",unit:"\ub2e8\uc704",newMeasurement:"\uc0c8 \uce21\uc815",
units:{metric:"\ubbf8\ud130\ubc95",imperial:"\uc601\uad6d\uc2dd",kilometers:"\ud0ac\ub85c\ubbf8\ud130",meters:"m",miles:"\ub9c8\uc77c",inches:"\uc778\uce58",feet:"\ud53c\ud2b8",yards:"\uc57c\ub4dc","nautical-miles":"\ud574\ub9ac","us-feet":"\ud53c\ud2b8(\ubbf8\uad6d)","degrees-minutes-seconds":"DMS",degrees:"\ub3c4"},_localized:{}},"esri/views/3d/interactive/measurementTools/support/nls/Units":{measures:{length:"\uae38\uc774",area:"\uc601\uc5ed",volume:"\ubd80\ud53c",angle:"\uac01\ub3c4"},units:{millimeters:{singular:"\ubc00\ub9ac\ubbf8\ud130",
plural:"\ubc00\ub9ac\ubbf8\ud130",abbr:"mm"},centimeters:{singular:"\uc13c\ud2f0\ubbf8\ud130",plural:"\uc13c\ud2f0\ubbf8\ud130",abbr:"cm"},decimeters:{singular:"\ub370\uc2dc\ubbf8\ud130",plural:"\ub370\uc2dc\ubbf8\ud130",abbr:"dm"},meters:{singular:"\ubbf8\ud130",plural:"\ubbf8\ud130",abbr:"m"},kilometers:{singular:"\ud0ac\ub85c\ubbf8\ud130",plural:"\ud0ac\ub85c\ubbf8\ud130",abbr:"km"},inches:{singular:"\uc778\uce58",plural:"\uc778\uce58",abbr:"in"},feet:{singular:"\ud53c\ud2b8",plural:"\ud53c\ud2b8",
abbr:"ft"},yards:{singular:"\uc57c\ub4dc",plural:"\uc57c\ub4dc",abbr:"yd"},miles:{singular:"\ub9c8\uc77c",plural:"\ub9c8\uc77c",abbr:"mi"},"nautical-miles":{singular:"\ud574\ub9ac",plural:"\ud574\ub9ac",abbr:"nm"},"us-feet":{singular:"\ud53c\ud2b8(\ubbf8\uad6d)",plural:"\ud53c\ud2b8(\ubbf8\uad6d)",abbr:"ft"},"square-millimeters":{singular:"\uc81c\uacf1\ubc00\ub9ac\ubbf8\ud130",plural:"\uc81c\uacf1\ubc00\ub9ac\ubbf8\ud130",abbr:"mm\u00b2"},"square-centimeters":{singular:"\uc81c\uacf1\uc13c\ud2f0\ubbf8\ud130",
plural:"\uc81c\uacf1\uc13c\ud2f0\ubbf8\ud130",abbr:"\uc81c\uacf1\uc13c\ud2f0\ubbf8\ud130"},"square-decimeters":{singular:"\uc81c\uacf1\ub370\uc2dc\ubbf8\ud130",plural:"\uc81c\uacf1\ub370\uc2dc\ubbf8\ud130",abbr:"dm\u00b2"},"square-meters":{singular:"\uc81c\uacf1\ubbf8\ud130",plural:"\uc81c\uacf1\ubbf8\ud130",abbr:"\uc81c\uacf1\ubbf8\ud130"},"square-kilometers":{singular:"\uc81c\uacf1\ud0ac\ub85c\ubbf8\ud130",plural:"\uc81c\uacf1\ud0ac\ub85c\ubbf8\ud130",abbr:"km\u00b2"},"square-inches":{singular:"\ud3c9\ubc29 \uc778\uce58",
plural:"\uc81c\uacf1\uc778\uce58",abbr:"in\u00b2"},"square-feet":{singular:"\ud3c9\ubc29 \ud53c\ud2b8",plural:"\uc81c\uacf1\ud53c\ud2b8",abbr:"ft\u00b2"},"square-yards":{singular:"\uc81c\uacf1 \uc57c\ub4dc",plural:"\uc81c\uacf1\uc57c\ub4dc",abbr:"\uc81c\uacf1\uc57c\ub4dc"},"square-miles":{singular:"\ud3c9\ubc29 \ub9c8\uc77c",plural:"\uc81c\uacf1\ub9c8\uc77c",abbr:"mi\u00b2"},"square-us-feet":{singular:"\uc81c\uacf1\ud53c\ud2b8(\ubbf8\uad6d)",plural:"\uc81c\uacf1\ud53c\ud2b8(\ubbf8\uad6d)",abbr:"ft\u00b2"},
acres:{singular:"\uc5d0\uc774\ucee4",plural:"\uc5d0\uc774\ucee4",abbr:"ac"},ares:{singular:"\uc544\ub974",plural:"\uc544\ub974",abbr:"a"},hectares:{singular:"\ud5e5\ud0c0\ub974",plural:"\ud5e5\ud0c0\ub974",abbr:"ha"},liters:{singular:"\ub9ac\ud130",plural:"\ub9ac\ud130",abbr:"l"},"cubic-millimeters":{singular:"\uc138\uc81c\uacf1\ubc00\ub9ac\ubbf8\ud130",plural:"\uc138\uc81c\uacf1\ubc00\ub9ac\ubbf8\ud130",abbr:"mm\u00b3"},"cubic-centimeters":{singular:"\uc138\uc81c\uacf1\uc13c\ud2f0\ubbf8\ud130",plural:"\uc138\uc81c\uacf1\uc13c\ud2f0\ubbf8\ud130",
abbr:"cm\u00b3"},"cubic-decimeters":{singular:"\uc138\uc81c\uacf1\ub370\uc2dc\ubbf8\ud130",plural:"\uc138\uc81c\uacf1\ub370\uc2dc\ubbf8\ud130",abbr:"dm\u00b3"},"cubic-meters":{singular:"\uc138\uc81c\uacf1\ubbf8\ud130",plural:"\uc138\uc81c\uacf1\ubbf8\ud130",abbr:"m\u00b3"},"cubic-kilometers":{singular:"\uc138\uc81c\uacf1\ud0ac\ub85c\ubbf8\ud130",plural:"\uc138\uc81c\uacf1\ud0ac\ub85c\ubbf8\ud130",abbr:"km\u00b3"},"cubic-inches":{singular:"\uc138\uc81c\uacf1\uc778\uce58",plural:"\uc138\uc81c\uacf1\uc778\uce58",
abbr:"in\u00b3"},"cubic-feet":{singular:"\uc138\uc81c\uacf1\ud53c\ud2b8",plural:"\uc138\uc81c\uacf1\ud53c\ud2b8",abbr:"ft\u00b3"},"cubic-yards":{singular:"\uc138\uc81c\uacf1\uc57c\ub4dc",plural:"\uc138\uc81c\uacf1\uc57c\ub4dc",abbr:"yd\u00b3"},"cubic-miles":{singular:"\uc138\uc81c\uacf1\ub9c8\uc77c",plural:"\uc138\uc81c\uacf1\ub9c8\uc77c",abbr:"mi\u00b3"},radians:{singular:"\ub77c\ub514\uc548",plural:"\ub77c\ub514\uc548",abbr:""},degrees:{singular:"\uac01\ub3c4",plural:"\ub3c4",abbr:"\u00b0"}},_localized:{}},
"widgets/Measurement3D/nls/strings":{_widgetLabel:"\uce21\uc815",_localized:{}}});