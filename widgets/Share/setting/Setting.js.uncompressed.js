// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
require({cache:{
'widgets/Share/setting/_build-generate_module':function(){
define(["dojo/text!./Setting.html",
"dojo/text!./css/style.css",
"dojo/i18n!./nls/strings"], function(){});
},
'url:widgets/Share/setting/Setting.html':"<div>\r\n  <div class=\"title\">${nls.selectSocialNetwork}</div>\r\n  <div class=\"row\">\r\n    <div class=\"cb\" data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"email\"></div>\r\n    <div class=\"cb-label\">${nls.email}</div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"cb\" data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"facebook\"></div>\r\n    <div class=\"cb-label\">${nls.facebook}</div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"cb\" data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"twitter\"></div>\r\n    <div class=\"cb-label\">${nls.twitter}</div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"cb\" data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"googlePlus\"></div>\r\n    <div class=\"cb-label\">${nls.googlePlus}</div>\r\n  </div>\r\n\r\n  <div class=\"row hide use-org\" data-dojo-attach-point=\"useOrgUrlContent\">\r\n    <div class=\"cb\" data-dojo-type=\"jimu/dijit/CheckBox\" data-dojo-attach-point=\"useOrganizationUrl\"></div>\r\n    <div class=\"cb-label\">${nls.useOrganization}</div>\r\n  </div>\r\n</div>\r\n",
'url:widgets/Share/setting/css/style.css':".jimu-widget-share-setting {font-size: 14px;}.jimu-widget-share-setting .title{font-size: 16px;}.jimu-widget-share-setting .row {height: 30px; line-height: 30px; vertical-align: middle;}.jimu-widget-share-setting .cb {vertical-align: middle; margin: 0 5px;}.jimu-widget-share-setting .cb-label {display: inline-block; vertical-align: middle;}.jimu-widget-share-setting .hide {display: none}.jimu-widget-share-setting .use-org {margin-top: 30px;}",
'*now':function(r){r(['dojo/i18n!*preload*widgets/Share/setting/nls/Setting*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]']);}
}});
///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    "dojo/_base/lang",
    'dojo/_base/html',
    "jimu/utils",
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/portalUrlUtils',
    'jimu/dijit/CheckBox'
  ],
  function(declare, lang, html, jimuUtils, _WidgetsInTemplateMixin, BaseWidgetSetting, portalUrlUtils) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-share-setting',

      postMixInProperties: function() {
        this.inherited(arguments);
        this.nls.email = window.jimuNls.shareLink.shareEmail;
        this.nls.facebook = window.jimuNls.shareLink.shareFacebook;
        this.nls.googlePlus = window.jimuNls.shareLink.shareGooglePlus;
        this.nls.twitter = window.jimuNls.shareLink.shareTwitter;
      },

      startup: function() {
        this.inherited(arguments);
        if (!this.config) {
          this.config = {};
        }

        if (portalUrlUtils.isOnline(jimuUtils.getAppHref())) {
          html.removeClass(this.useOrgUrlContent, "hide");
        }

        this.setConfig(this.config);
      },

      setConfig: function(config) {
        this.config = config;

        this.email.setValue(true);
        this.facebook.setValue(true);
        this.twitter.setValue(true);
        this.googlePlus.setValue(true);
        if (config.socialMedias) {
          if (false === config.socialMedias.email) {
            this.email.setValue(false);
          }
          if (false === config.socialMedias.facebook) {
            this.facebook.setValue(false);
          }
          if (false === config.socialMedias.twitter) {
            this.twitter.setValue(false);
          }
          if (false === config.socialMedias.googlePlus) {
            this.googlePlus.setValue(false);
          }
        }

        this.useOrganizationUrl.setValue(false);
        if (config.useOrgUrl) {
          this.useOrganizationUrl.setValue(true);
        }
      },

      getConfig: function() {
        var socialMedias = {};
        socialMedias = lang.mixin(socialMedias, this.config.socialMedias);
        if (this.email) {
          socialMedias.email = this.email.getValue();
        }
        if (this.facebook) {
          socialMedias.facebook = this.facebook.getValue();
        }
        if (this.twitter) {
          socialMedias.twitter = this.twitter.getValue();
        }
        if (this.googlePlus) {
          socialMedias.googlePlus = this.googlePlus.getValue();
        }
        this.config.socialMedias = socialMedias;

        this.config.useOrgUrl = this.useOrganizationUrl.getValue();
        return this.config;
      }
    });
  });