// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define({"esri/widgets/DirectLineMeasurement3D/nls/DirectLineMeasurement3D":{title:"\u092e\u093e\u092a",hint:"\u0905\u092a\u0928\u093e \u092a\u0939\u0932\u093e \u092c\u093f\u0902\u0926\u0941 \u0932\u0917\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0926\u0943\u0936\u094d\u092f \u092e\u0947\u0902 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0915\u0947 \u092e\u093e\u092a\u0928\u093e \u092a\u094d\u0930\u093e\u0930\u0902\u092d \u0915\u0930\u0947\u0902",unsupported:"3D \u0921\u093e\u092f\u0930\u0947\u0915\u094d\u091f \u0932\u093e\u0907\u0928 \u092e\u093e\u092a\u0928 \u0938\u093f\u0930\u094d\u092b\u093c SceneView \u092e\u0947\u0902 \u0938\u092e\u0930\u094d\u0925\u093f\u0924 \u0939\u0948\u0964",
distance:"\u0926\u0942\u0930\u0940",direct:"\u0938\u0940\u0927\u093e",horizontal:"\u0915\u094d\u0937\u0948\u0924\u093f\u091c",vertical:"\u0932\u0902\u092c\u0935\u0924",unit:"\u0907\u0915\u093e\u0908",newMeasurement:"\u0928\u092f\u093e \u092e\u093e\u092a\u0928",units:{metric:"\u092e\u0940\u091f\u094d\u0930\u093f\u0915",imperial:"\u0907\u092e\u094d\u092a\u0940\u0930\u093f\u092f\u0932",kilometers:"\u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930",meters:"\u092e\u0940\u091f\u0930",miles:"\u092e\u0940\u0932",
inches:"\u0907\u0902\u091a",feet:"\u092b\u0941\u091f",yards:"\u0917\u091c","nautical-miles":"\u0938\u092e\u0941\u0926\u094d\u0930\u0940 \u092e\u0940\u0932","us-feet":"\u092b\u0940\u091f (US)","degrees-minutes-seconds":"DMS",degrees:"\u0921\u093f\u0917\u094d\u0930\u0940"},_localized:{}},"esri/core/nls/Units":{measures:{length:"\u0932\u0902\u092c\u093e\u0908",area:"\u0915\u094d\u0937\u0947\u0924\u094d\u0930",volume:"\u0906\u092f\u0924\u0928",angle:"\u0915\u094b\u0923"},units:{millimeters:{singular:"\u092e\u093f\u0932\u0940\u092e\u0940\u091f\u0930",
plural:"\u092e\u093f\u0932\u0940\u092e\u0940\u091f\u0930",abbr:"\u092e\u093f\u0932\u0940\u092e\u0940\u091f\u0930"},centimeters:{singular:"\u0938\u0947\u0902\u091f\u0940\u092e\u0940\u091f\u0930",plural:"\u0938\u0947\u0902\u091f\u0940\u092e\u0940\u091f\u0930",abbr:"\u0938\u0947\u092e\u0940"},decimeters:{singular:"\u0921\u0947\u0938\u0940\u092e\u0940\u091f\u0930",plural:"\u0921\u0947\u0938\u0940\u092e\u0940\u091f\u0930",abbr:"\u0921\u0947\u092e\u0940"},meters:{singular:"\u092e\u0940\u091f\u0930",plural:"\u092e\u0940\u091f\u0930",
abbr:"\u092e\u0940"},kilometers:{singular:"\u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930",plural:"\u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930",abbr:"\u0915\u093f\u092e\u0940"},inches:{singular:"\u0907\u0902\u091a",plural:"\u0907\u0902\u091a",abbr:"\u092d\u0940\u0924\u0930"},feet:{singular:"\u095e\u0941\u091f",plural:"\u092b\u0940\u091f",abbr:"\u092b\u0941\u091f"},yards:{singular:"\u092f\u093e\u0930\u094d\u0921",plural:"\u0917\u091c",abbr:"\u0917\u091c"},miles:{singular:"\u092e\u0940\u0932",
plural:"\u092e\u0940\u0932",abbr:"\u092e\u0940\u0932"},"nautical-miles":{singular:"\u0928\u0949\u091f\u093f\u0915\u0932 \u092e\u0940\u0932",plural:"\u0938\u092e\u0941\u0926\u094d\u0930\u0940 \u092e\u0940\u0932",abbr:"\u0928\u0948\u0928\u094b\u092e\u0940\u091f\u0930"},"us-feet":{singular:"\u095e\u0941\u091f (US)",plural:"\u095e\u0940\u091f (US)",abbr:"\u092b\u0941\u091f"},"square-millimeters":{singular:"\u0935\u0930\u094d\u0917 \u092e\u093f\u0932\u0940\u092e\u0940\u091f\u0930",plural:"\u0935\u0930\u094d\u0917 \u092e\u093f\u0932\u0940\u092e\u0940\u091f\u0930",
abbr:"mm\u00b2"},"square-centimeters":{singular:"\u0935\u0930\u094d\u0917 \u0938\u0947\u0902\u091f\u0940\u092e\u0940\u091f\u0930",plural:"\u0935\u0930\u094d\u0917 \u0938\u0947\u0902\u091f\u0940\u092e\u0940\u091f\u0930",abbr:"cm\u00b2"},"square-decimeters":{singular:"\u0935\u0930\u094d\u0917 \u0921\u0947\u0938\u0940\u092e\u0940\u091f\u0930",plural:"\u0935\u0930\u094d\u0917 \u0921\u0947\u0938\u0940\u092e\u0940\u091f\u0930",abbr:"dm\u00b2"},"square-meters":{singular:"\u0935\u0930\u094d\u0917 \u092e\u0940\u091f\u0930",
plural:"\u0935\u0930\u094d\u0917 \u092e\u0940\u091f\u0930",abbr:"m\u00b2"},"square-kilometers":{singular:"\u0935\u0930\u094d\u0917 \u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930",plural:"\u0935\u0930\u094d\u0917 \u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930",abbr:"km\u00b2"},"square-inches":{singular:"\u0935\u0930\u094d\u0917 \u0907\u0902\u091a",plural:"\u0935\u0930\u094d\u0917 \u0907\u0902\u091a",abbr:"in\u00b2"},"square-feet":{singular:"\u0935\u0930\u094d\u0917 \u095e\u0941\u091f",plural:"\u0935\u0930\u094d\u0917 \u092b\u0940\u091f",
abbr:"ft\u00b2"},"square-yards":{singular:"\u0935\u0930\u094d\u0917 \u0917\u095b",plural:"\u0935\u0930\u094d\u0917 \u0917\u095b",abbr:"yd\u00b2"},"square-miles":{singular:"\u0935\u0930\u094d\u0917 \u092e\u0940\u0932",plural:"\u0935\u0930\u094d\u0917 \u092e\u0940\u0932",abbr:"mi\u00b2"},"square-us-feet":{singular:"\u0935\u0930\u094d\u0917 \u095e\u0941\u091f (US)",plural:"\u0935\u0930\u094d\u0917 \u092b\u0940\u091f (US)",abbr:"ft\u00b2"},acres:{singular:"\u090f\u0915\u0921\u093c",plural:"\u090f\u0915\u0921\u093c",
abbr:"\u090f\u0915\u0921\u093c"},ares:{singular:"\u090f\u0915\u095c",plural:"\u090f\u0915\u095c",abbr:"\u090f"},hectares:{singular:"\u0939\u0947\u0915\u094d\u091f\u0947\u092f\u0930",plural:"\u0939\u0947\u0915\u094d\u091f\u0947\u092f\u0930",abbr:"\u0939\u0948\u0915\u094d\u091f\u0947\u092f\u0930"},liters:{singular:"\u0932\u0940\u091f\u0930",plural:"\u0932\u0940\u091f\u0930",abbr:"l"},"cubic-millimeters":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u092e\u093f\u0932\u0940\u092e\u0940\u091f\u0930",
plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u092e\u093f\u0932\u0940\u092e\u0940\u091f\u0930",abbr:"mm\u00b3"},"cubic-centimeters":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u0938\u0947\u0902\u091f\u0940\u092e\u0940\u091f\u0930",plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u0938\u0947\u0902\u091f\u0940\u092e\u0940\u091f\u0930",abbr:"cm\u00b3"},"cubic-decimeters":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u0921\u0947\u0938\u0940\u092e\u0940\u091f\u0930",plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u0921\u0947\u0938\u0940\u092e\u0940\u091f\u0930",
abbr:"dm\u00b3"},"cubic-meters":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u092e\u0940\u091f\u0930",plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u092e\u0940\u091f\u0930",abbr:"m\u00b3"},"cubic-kilometers":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930",plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930",abbr:"km\u00b3"},"cubic-inches":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u0907\u0902\u091a",
plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u0907\u0902\u091a",abbr:"in\u00b3"},"cubic-feet":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u095e\u0941\u091f",plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u095e\u0940\u091f",abbr:"ft\u00b3"},"cubic-yards":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u092f\u093e\u0930\u094d\u0921",plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u092f\u093e\u0930\u094d\u0921",abbr:"yd\u00b3"},"cubic-miles":{singular:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u092e\u0940\u0932",
plural:"\u0915\u094d\u092f\u0941\u092c\u093f\u0915 \u092e\u0940\u0932",abbr:"mi\u00b3"},radians:{singular:"\u0930\u0947\u0921\u093f\u092f\u0928",plural:"\u0930\u0947\u0921\u093f\u092f\u0928",abbr:""},degrees:{singular:"\u0905\u0902\u0936",plural:"\u0905\u0902\u0936",abbr:"\u00b0"}},_localized:{}},"esri/widgets/AreaMeasurement3D/nls/AreaMeasurement3D":{title:"\u092e\u093e\u092a",hint:"\u0905\u092a\u0928\u093e \u092a\u0939\u0932\u093e \u092c\u093f\u0902\u0926\u0941 \u0932\u0917\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0926\u0943\u0936\u094d\u092f \u092e\u0947\u0902 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0915\u0947 \u092e\u093e\u092a\u0928\u093e \u092a\u094d\u0930\u093e\u0930\u0902\u092d \u0915\u0930\u0947\u0902",
unsupported:"3D \u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u092e\u093e\u092a\u0928 \u0938\u093f\u0930\u094d\u092b\u093c SceneView \u092e\u0947\u0902 \u0938\u092e\u0930\u094d\u0925\u093f\u0924 \u0939\u0948\u0964",perimeterLength:"\u092a\u0930\u093f\u092e\u093e\u092a",area:"\u0915\u094d\u0937\u0947\u0924\u094d\u0930",unit:"\u0907\u0915\u093e\u0908",notApplicable:"\u0932\u093e\u0917\u0942 \u0928\u0939\u0940\u0902",newMeasurement:"\u0928\u092f\u093e \u092e\u093e\u092a\u0928",units:{metric:"\u092e\u0940\u091f\u094d\u0930\u093f\u0915",
imperial:"\u0907\u092e\u094d\u092a\u0940\u0930\u093f\u092f\u0932","square-kilometers":"\u0935\u0930\u094d\u0917 \u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930","square-meters":"\u0935\u0930\u094d\u0917 \u092e\u0940\u091f\u0930","square-miles":"\u0935\u0930\u094d\u0917 \u092e\u0940\u0932","square-inches":"\u0935\u0930\u094d\u0917 \u0907\u0902\u091a","square-feet":"\u0935\u0930\u094d\u0917 \u092b\u0940\u091f","square-yards":"\u0935\u0930\u094d\u0917 \u0917\u095b","square-us-feet":"\u0935\u0930\u094d\u0917 \u092b\u0940\u091f (US)",
acres:"\u090f\u0915\u0921\u093c",ares:"\u090f\u0915\u095c",hectares:"\u0939\u0947\u0915\u094d\u091f\u0947\u092f\u0930"},_localized:{}},"widgets/Measurement3D/nls/strings":{_widgetLabel:"\u092e\u093e\u092a",newMeasurement:"\u0928\u092f\u093e \u092e\u093e\u092a\u0928",distance:"\u0926\u0942\u0930\u0940",area:"\u0915\u094d\u0937\u0947\u0924\u094d\u0930",slice:"\u0938\u094d\u0932\u093e\u0907\u0938",measureDistance:"\u0926\u0942\u0930\u0940 \u0915\u094b \u092e\u093e\u092a\u0947\u0902",measureArea:"\u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u0915\u094b \u092e\u093e\u092a\u0947\u0902",
sliceObjects:"\u0938\u094d\u0932\u093e\u0907\u0938 \u0911\u092c\u094d\u091c\u0947\u0915\u094d\u091f",hint:"\u0906\u0930\u0902\u092d \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u092a\u0939\u0932\u0947 \u092e\u093e\u092a\u0928 \u091f\u0942\u0932 \u0915\u093e \u091a\u092f\u0928 \u0915\u0930\u0947\u0902",_localized:{}}});