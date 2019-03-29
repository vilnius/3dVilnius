// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/html dojo/_base/config dojo/cookie dojo/Deferred dojo/promise/all dojo/request/xhr ./utils ./WidgetManager ./shared/utils ./tokenUtils ./portalUtils ./appConfigResourceUtils ./portalUrlUtils ./AppStateManager esri/identity/IdentityManager esri/core/urlUtils".split(" "),function(B,c,v,C,w,x,m,t,y,g,D,p,h,l,E,f,F,z,A){var r=null,u;u=B(null,{urlParams:null,appConfig:null,rawAppConfig:null,configFile:null,_configLoaded:!1,portalSelf:null,
constructor:function(a,b){this._removeHash(a);this.urlParams=a||{};this.widgetManager=D.getInstance();c.mixin(this,b)},loadConfig:function(){console.time("Load Config");return this._tryLoadConfig().then(c.hitch(this,function(a){var b=this.checkConfig(a);if(b)throw b;this.rawAppConfig=c.clone(a);F.getInstance().setRawAppConfig(this.rawAppConfig);a=this._upgradeAppConfig(a);this._processAfterTryLoad(a);this.appConfig=a;if(this.urlParams.id)return this.loadWidgetsManifest(a).then(c.hitch(this,function(){return this._upgradeAllWidgetsConfig(a)})).then(c.hitch(this,
function(a){return this.insertAppIdtoResourceUrlofAppConfig(a,this.urlParams.id)})).then(c.hitch(this,function(){this._configLoaded=!0;a.title&&(document.title=window.isBuilder?g.stripHTML(a.title)+" - Web AppBuilder for ArcGIS":g.stripHTML(a.title));this._readAndSetSharedTheme(a);return this.getAppConfig()}));h.setPortalUrl(a.portalUrl);return this._proesssWebTierAndSignin(a).then(c.hitch(this,function(){if(this.urlParams.appid){if(window.appInfo.isRunInPortal){var b=f.getStandardPortalUrl(a.portalUrl),
b=l.getPortal(b);return g.checkEssentialAppsLicense(this.urlParams.appid,b,h.isInBuilderWindow()).then(c.hitch(this,function(){return this._getAppConfigFromTemplateAppId(a.portalUrl,this.urlParams.appid).then(c.hitch(this,function(a){this._tryUpdateAppConfigByLocationUrl(a);return this._processInPortalAppProtocol(a)}))}),c.hitch(this,function(a){console.error(a);throw Error(window.jimuNls.essentialAppsLicenseErrorForApp);}))}return this._processNotInPortalAppProtocol(a).then(c.hitch(this,function(a){return this._getAppDataAddTemplateDataFromTemplateAppId(a.portalUrl,
this.urlParams.appid).then(c.hitch(this,function(b){b.appData.appConfig&&(a=b.appData.appConfig);a._appData=b.appData;a.templateConfig=b.templateData;a.isTemplateApp=!0;return a}))}))}return this._processNotInPortalAppProtocol(a)})).then(c.hitch(this,function(a){this._processAfterTryLoad(a);this.appConfig=a;return a.map.itemId?a:l.getDefaultWebScene(a.portalUrl).then(function(b){a.map.itemId=b;return a})})).then(c.hitch(this,function(a){return this.loadWidgetsManifest(a)})).then(c.hitch(this,function(a){return a._appData?
a._appData.values&&a._appData.values.webmap?l.getPortal(a.portalUrl).getItemById(a._appData.values.webmap).then(c.hitch(this,function(b){return g.template.mergeTemplateAppConfigToAppConfig(a,a._appData,b)})):g.template.mergeTemplateAppConfigToAppConfig(a,a._appData):a})).then(c.hitch(this,function(){return this._upgradeAllWidgetsConfig(a)})).then(c.hitch(this,function(a){return a._wabAppId?this.processResourceInAppConfigForConfigLoader(a,this.urlParams):a.appItemId&&-1<window.JSON.stringify(a).indexOf("${itemId}")?
this.insertAppIdtoResourceUrlofAppConfig(a,a.appItemId):a})).then(c.hitch(this,function(){this.appConfig=a;this._configLoaded=!0;a.title&&(document.title=g.stripHTML(a.title));this._readAndSetSharedTheme(a);return this.getAppConfig()}))}),c.hitch(this,function(a){this.showError(a)}))},processResourceInAppConfigForConfigLoader:function(a,b){var d=a.portalUrl,e=a.appItemId,n=b.appid,k=new m,q=c.clone(a);this.insertAppIdtoResourceUrlofAppConfig(q,n).then(function(){if("config"===b.mode){var c=this.getResourceUrlsOfAppConfig(a).result;
0!==c.length?l.getItemResources(d,n).then(function(a){if(0===a.length)return c=c.map(function(a){return{resUrl:a}}),E.AddResourcesToItemForAppSave(d,c,e,n).then(function(){k.resolve(q)},function(a){console.warn("Add resource to template based app error:"+a.message||a);k.resolve(q)});k.resolve(q)},function(a){console.warn("Get resource of template based item error:"+a.message||a);k.resolve(q)}):k.resolve(q)}else k.resolve(q)}.bind(this),function(a){console.warn("Insert appId to resource url of appConfig error:"+
a.message||a);k.resolve(q)});return k},getResourceUrlsOfAppConfig:function(a){var b={test:function(a){return/^https?:\/\/(.)+\/sharing\/rest\/content\/items/.test(a)},func:c.hitch(this,function(a){return a.value})};return g.processItemResourceOfAppConfig(a,b)},insertAppIdtoResourceUrlofAppConfig:function(a,b){function d(a){return/^https?:\/\/(.)+\/sharing\/rest\/content\/items/.test(a)}function e(a,b){var e=b.obj,d=b.key,c={obj:e,key:d};"number"===typeof b.i?(c.i=b.i,c.value=e[d][b.i]):c.value=e[d];
b=c;a=k.processItemIdAndTokenOfResources(b.value,a);e=b.obj;d=b.key;"number"===typeof b.i?e[d][b.i]=a:e[d]=a;return!0}var n=a.portalUrl,k=this;return l.getPortal(n).getItemById(b).then(c.hitch(this,function(k){k={test:d,func:c.hitch(this,e,{appId:b,isPublic:"public"===k.access,portalUrl:n})};return g.processItemResourceOfAppConfig(a,k).appConfig}))},processItemIdAndTokenOfResources:function(a,b){0<a.indexOf("${itemId}")&&(a=a.replace("${itemId}",b.appId));/(\?|\&)token=.+/.test(a)&&(a=a.replace(/(\?|\&)token=.+/,
""));b.isPublic||(b=h.getPortalCredential(b.portalUrl))&&(a+="?token\x3d"+b.token);return a},getAppConfig:function(){var a=c.clone(this.appConfig);a.getConfigElementById=function(a){return g.getConfigElementById(this,a)};a.getConfigElementsByName=function(a){return g.getConfigElementsByName(this,a)};a.visitElement=function(a){g.visitElement(this,a)};this._addAuthorizedCrossOriginDomains(this.portalSelf,a);return a},_addAuthorizedCrossOriginDomains:function(a,b){a&&a.authorizedCrossOriginDomains&&
h.addAuthorizedCrossOriginDomains(a.authorizedCrossOriginDomains);b&&b.authorizedCrossOriginDomains&&h.addAuthorizedCrossOriginDomains(b.authorizedCrossOriginDomains)},checkConfig:function(a){return(a=this._getRepeatedId(a))?"repeated id:"+a:null},processProxy:function(a){var b=g.getEsriConfigRequestObject();b.alwaysUseProxy=a.httpProxy&&a.httpProxy.useProxy&&a.httpProxy.alwaysUseProxy;b.proxyUrl="";b.proxyRules=[];a.httpProxy&&a.httpProxy.useProxy&&a.httpProxy.url&&(b.proxyUrl=a.httpProxy.url);a.httpProxy&&
a.httpProxy.useProxy&&a.httpProxy.rules&&v.forEach(a.httpProxy.rules,function(a){A.addProxyRule(a)})},addNeedValues:function(a){this._processNoUriWidgets(a);this._processEmptyGroups(a);this._addElementId(a);this._processWidgetJsons(a)},showError:function(a){C.create("div",{"class":"app-error",innerHTML:g.sanitizeHTML(a.message)},document.body)},_tryLoadConfig:function(){if(this.urlParams.config)return this.configFile=this.urlParams.config,y(this.configFile,{handleAs:"json",headers:{"X-Requested-With":null}}).then(c.hitch(this,
function(a){h.setPortalUrl(a.portalUrl);return this.urlParams.token?h.registerToken(this.urlParams.token).then(function(){return a}):a}));if(this.urlParams.id){window.appInfo.isRunInPortal=!0;var a=f.getPortalUrlFromLocation(),b=new m;h.setPortalUrl(a);var d;this.urlParams.token?d=h.registerToken(this.urlParams.token):(d=new m,d.resolve());d.then(c.hitch(this,function(){var e=l.getPortal(a);e.loadSelfInfo().then(c.hitch(this,function(d){this.portalSelf=d;d.allSSL&&"http:"===window.location.protocol?
(window.location.href=f.setHttpsProtocol(window.location.href),b.reject()):this._processSignIn(a).then(c.hitch(this,function(){this._getAppConfigFromAppId(a,this.urlParams.id).then(c.hitch(this,function(a){return g.checkEssentialAppsLicense(this.urlParams.id,e,h.isInBuilderWindow()).then(c.hitch(this,function(){this._tryUpdateAppConfigByLocationUrl(a);return this._processInPortalAppProtocol(a)}),c.hitch(this,function(a){console.error(a);throw Error(window.jimuNls.essentialAppsLicenseErrorForApp);
}))})).then(function(a){b.resolve(a)},function(a){b.reject(a)})}))}))}),c.hitch(this,function(a){this.showError(a)}));return b}this.configFile="config.json";return y(this.configFile,{handleAs:"json"}).then(c.hitch(this,function(a){h.setPortalUrl(a.portalUrl);return this.urlParams.token?h.registerToken(this.urlParams.token).then(function(){return a}):a}))},_upgradeAppConfig:function(a){var b=window.wabVersion,d=a.wabVersion;if(b===d)return a;var e=this.versionManager.getVersionIndex(d),c=this.versionManager.getVersionIndex(b);
if(e>c)throw Error("Bad version number, "+d);a=this.versionManager.upgrade(a,d,b);a.wabVersion=b;a.isUpgraded=!0;return a},_upgradeAllWidgetsConfig:function(a){var b=new m,d=[];if(!a.isUpgraded)return b.resolve(a),b;delete a.isUpgraded;p.visitElement(a,c.hitch(this,function(a){a.uri&&(a.config?(a=this.widgetManager.tryLoadWidgetConfig(a),d.push(a)):a.version=a.manifest.version)}));t(d).then(c.hitch(this,function(){b.resolve(a)}),function(a){b.reject(a)});return b},_processAfterTryLoad:function(a){this._setPortalUrl(a);
this._tryUpdateAppConfigByLocationUrl(a);this._processUrlParams(a);this.addNeedValues(a);this.processProxy(a);z.tokenValidity=10080;return a},_readAndSetSharedTheme:function(a){a.theme.sharedTheme||(a.theme.sharedTheme={useHeader:!1,useLogo:!1},a.theme.sharedTheme.isPortalSupport=this.portalSelf.portalProperties&&this.portalSelf.portalProperties.sharedTheme?!0:!1);a.theme.sharedTheme.useHeader&&(a.theme.sharedTheme.isPortalSupport&&this.portalSelf.portalProperties?(a.theme.customStyles={mainBackgroundColor:this.portalSelf.portalProperties.sharedTheme.header.background},
a.titleColor=this.portalSelf.portalProperties.sharedTheme.header.text):console.error("Portal does not support sharedTheme."));a.theme.sharedTheme.useLogo&&(a.theme.sharedTheme.isPortalSupport&&this.portalSelf.portalProperties?(a.logo=this.portalSelf.portalProperties.sharedTheme.logo.small?this.portalSelf.portalProperties.sharedTheme.logo.small:"images/app-logo.png",!a.logoLink&&this.portalSelf.portalProperties.sharedTheme.logo.link&&(a.logoLink=this.portalSelf.portalProperties.sharedTheme.logo.link)):
(console.error("Portal does not support sharedTheme, use default logo."),a.logo="images/app-logo.png"))},_tryUpdateAppConfigByLocationUrl:function(a){if(!(this.urlParams.config&&-1<this.urlParams.config.indexOf("arcgis.com/sharing/rest/content/items/"))){var b=f.getPortalUrlFromLocation(),b=f.getStandardPortalUrl(b);f.isOnline(b)&&(b=f.updateUrlProtocolByOtherUrl(b,a.portalUrl),a.map.portalUrl&&f.isSamePortalUrl(a.portalUrl,a.map.portalUrl)&&(a.map.portalUrl=b),a.portalUrl=b,a.httpProxy&&a.httpProxy.url&&
(a.httpProxy.url=f.getPortalProxyUrl(b)))}},_processWidgetJsons:function(a){p.visitElement(a,function(a,d){d.isWidget&&a.uri&&g.processWidgetSetting(a)})},_processNoUriWidgets:function(a){var b=0;p.visitElement(a,function(a,c){c.isWidget&&!a.uri&&(b++,a.placeholderIndex=b)})},_processEmptyGroups:function(a){var b=0;a.widgetOnScreen.groups&&v.forEach(a.widgetOnScreen.groups,function(a){if(!a.widgets||a.widgets&&0===a.widgets.length)b++,a.placeholderIndex=b})},_addElementId:function(a){var b=0,c;p.visitElement(a,
function(a){if(a.id){a.id=a.id.replace(/\//g,"_");var d=a.id.lastIndexOf("_");-1<d&&(c=a.id.substr(d+1),b=Math.max(b,c))}});p.visitElement(a,function(a){a.id||(b++,a.id=a.uri?a.uri.replace(/\//g,"_")+"_"+b:"_"+b)})},_setPortalUrl:function(a){if(a.portalUrl){var b=f.getPortalUrlFromLocation(),c=f.isOnline(b);f.isSamePortalUrl(a.portalUrl,b)||c||(window.appInfo.isRunInPortal=!1)}else window.isXT&&x("wab_portalurl")?a.portalUrl=x("wab_portalurl"):(window.appInfo.isRunInPortal=!0,a.portalUrl=f.getPortalUrlFromLocation())},
_changePortalUrlProtocol:function(a,b){a.portalUrl=f.setProtocol(a.portalUrl,b);a.map.portalUrl&&(a.map.portalUrl=f.setProtocol(a.map.portalUrl,b));a.httpProxy&&(a.httpProxy.url=f.setProtocol(a.httpProxy.url,b),a.httpProxy&&a.httpProxy.rules&&v.forEach(a.httpProxy.rules,c.hitch(this,function(a){a.proxyUrl=f.setProtocol(a.proxyUrl,b)})))},_processInPortalAppProtocol:function(a){var b=new m,d=l.getPortal(a.portalUrl),e=c.hitch(this,function(c){if("https:"===window.location.protocol)this._changePortalUrlProtocol(a,
"https");else{if(c){window.location.href=f.setHttpsProtocol(window.location.href);b.reject();return}this._changePortalUrlProtocol(a,"http")}this._checkLocale();b.resolve(a)});d.loadSelfInfo().then(c.hitch(this,function(b){this.portalSelf=b;"private"===b.access?(b=0===a.portalUrl.toLowerCase().indexOf("https://"),e(b)):e(b.allSSL)}),c.hitch(this,function(a){b.reject(a)}));return b},_processNotInPortalAppProtocol:function(a){var b=new m;a.portalUrl?l.getPortal(a.portalUrl).loadSelfInfo().then(c.hitch(this,
function(c){this.portalSelf=c;var d="https:"===window.location.protocol;(c.allSSL||d)&&this._changePortalUrlProtocol(a,"https");0!==a.portalUrl.toLowerCase().indexOf("https://")||d||h.isInConfigOrPreviewWindow()?b.resolve(a):(window.location.href=f.setHttpsProtocol(window.location.href),b.reject())}),c.hitch(this,function(a){b.reject(a)})):b.resolve(a);return b},_proesssWebTierAndSignin:function(a){var b=new m,d=!1,e=a.portalUrl;this._processWebTier(a).then(c.hitch(this,function(a){d=a;return l.getPortal(e).loadSelfInfo()})).then(c.hitch(this,
function(a){this.portalSelf=a;return this._processSignIn(e,d)})).then(c.hitch(this,function(){b.resolve()}),function(a){b.reject(a)});return b},_processWebTier:function(a){var b=new m,d=a.portalUrl;a.isWebTier?(h.addAuthorizedCrossOriginDomains([d]),h.isWebTierPortal(d).then(c.hitch(this,function(){var c=h.getPortalCredential(d);c&&c.ssl&&"http:"===window.location.protocol&&!h.isInConfigOrPreviewWindow()?window.location.href=f.setHttpsProtocol(window.location.href):b.resolve(a.isWebTier)}),c.hitch(this,
function(a){b.reject(a)}))):b.resolve(!1);return b},_processSignIn:function(a,b){var d=new m,e=l.getPortal(a),n=f.getSharingUrl(a);window.appInfo.isRunInPortal?(b=z.checkSignInStatus(n),b.always(c.hitch(this,function(){d.resolve()}))):(h.isInBuilderWindow()||h.isInConfigOrPreviewWindow()||!this.portalSelf.supportsOAuth||!this.rawAppConfig.appId||b||h.registerOAuthInfo(a,this.rawAppConfig.appId),b=z.checkSignInStatus(n),b.always(c.hitch(this,function(){h.xtGetCredentialFromCookie(a);e.loadSelfInfo().then(c.hitch(this,
function(a){this.portalSelf=a;this._checkLocale();d.resolve()}))})));return d},_checkLocale:function(){if(!h.isInConfigOrPreviewWindow()){var a=this.portalSelf.user&&this.portalSelf.user.culture||w.locale,a=a.toLowerCase();!this.urlParams.locale&&g.isLocaleChanged(w.locale,a)&&(x("wab_app_locale",a),window.location.reload())}},_getAppConfigFromTemplateAppId:function(a,b){var d=l.getPortal(a);return this._getWabAppIdAndDataFromTemplateAppId(a,b).then(c.hitch(this,function(b){var e=b.appId,k=b.appData;
return t([this._getAppConfigFromAppId(a,e),d.getItemData(k.source)]).then(c.hitch(this,function(a){var b;k.appConfig?(b=k.appConfig,delete k.appConfig):b=a[0];b=this._upgradeAppConfig(b);a=a[1];b._appData=k;b._wabAppId=e;b.templateConfig=a;b.isTemplateApp=!0;return b}))}))},_getAppDataAddTemplateDataFromTemplateAppId:function(a,b){var c=l.getPortal(a);return c.getItemData(b).then(function(a){return c.getItemData(a.source).then(function(b){return{appData:a,templateData:b}})})},_getWabAppIdAndDataFromTemplateAppId:function(a,
b){var d=new m,e=l.getPortal(a);e.getItemData(b).then(c.hitch(this,function(a){e.getItemById(a.source).then(c.hitch(this,function(b){b=A.urlToObject(b.url);d.resolve({appId:b.query.id,appData:a})}))}),function(a){d.reject(a)});return d},_getAppConfigFromAppId:function(a,b){return l.getPortal(a).getItemData(b)},_removeHash:function(a){for(var b in a)a[b]&&(a[b]=a[b].replace("#",""))},loadWidgetsManifest:function(a){function b(b,c,e){function k(c){return b.loadWidgetManifest(c).then(function(a){return a},
function(b){console.log("Widget failed to load, it is removed.",c.name);b.stack?console.error(b.stack):console.log(b);d(a,c)})}return c.itemId?l.getPortal(e).getItemById(c.itemId).then(function(b){var e;e=g.isEsriDomain(b.url)?!0:h.getPortalCredential(a.portalUrl)?!0:!1;if(e)return c.uri=g.widgetJson.getUriFromItem(b),k(c);console.log("Widget is not useable, it is removed.",c.name);d(a,c)}):k(c)}function d(a,b){function c(c){a[c]&&a[c].widgets&&(a[c].widgets=a[c].widgets.filter(function(a){if(b)return a.id!==
b.id;a.uri&&!a.manifest&&console.error("Widget is removed because it is not loaded successfully.",a.uri);return a.manifest}));a[c]&&a[c].groups&&a[c].groups.forEach(function(a){a.widgets&&(a.widgets=a.widgets.filter(function(a){if(b)return a.id!==b.id;a.uri&&!a.manifest&&console.error("Widget is removed because it is not loaded successfully.",a.uri);return a.manifest}))})}c("widgetOnScreen");c("widgetPool")}var e=[],f=new m;a._buildInfo&&a._buildInfo.widgetManifestsMerged?this._loadMergedWidgetManifests().then(c.hitch(this,
function(d){p.visitElement(a,c.hitch(this,function(c){c.widgets||!c.uri&&!c.itemId||(c.uri&&d[c.uri]?(this._addNeedValuesForManifest(d[c.uri],c.uri),g.widgetJson.addManifest2WidgetJson(c,d[c.uri])):e.push(b(this.widgetManager,c,a.portalUrl)))}));t(e).then(function(){f.resolve(a)})})):(p.visitElement(a,c.hitch(this,function(c){c.widgets||!c.uri&&!c.itemId||e.push(b(this.widgetManager,c,a.portalUrl))})),t(e).then(function(){f.resolve(a)}));setTimeout(function(){f.isResolved()||(d(a),f.resolve(a))},
6E4);return f},_addNeedValuesForManifest:function(a,b){c.mixin(a,g.getUriInfo(b));g.addManifestProperies(a);g.processManifestLabel(a,w.locale)},_loadMergedWidgetManifests:function(){return y(window.appInfo.appPath+"widgets/widgets-manifest.json",{handleAs:"json"})},_getRepeatedId:function(a){var b=[],c;p.visitElement(a,function(a){if(0<b.indexOf(a.id))return c=a.id,!0;b.push(a.id)});return c},_processUrlParams:function(a){var b=this.urlParams.itemid||this.urlParams.webmap;b&&a.map.itemId!==b&&(a.map.mapOptions&&
g.deleteMapOptions(a.map.mapOptions),a.map.itemId=b);this.urlParams.mode&&(a.mode=this.urlParams.mode);a.map.mapOptions||(a.map.mapOptions={});this.urlParams.scale&&(a.map.mapOptions.scale=this.urlParams.scale);if(this.urlParams.level||this.urlParams.zoom)a.map.mapOptions.zoom=this.urlParams.level||this.urlParams.zoom}});u.getInstance=function(a,b){null===r?r=new u(a,b):(r.urlParams=a,r.options=b);return r};return u});