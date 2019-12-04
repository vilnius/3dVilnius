// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
require({cache:{"dijit/_WidgetsInTemplateMixin":function(){define(["dojo/_base/array","dojo/aspect","dojo/_base/declare","dojo/_base/lang","dojo/parser"],function(k,f,g,e,l){return g("dijit._WidgetsInTemplateMixin",null,{_earlyTemplatedStartup:!1,contextRequire:null,_beforeFillContent:function(){if(/dojoType|data-dojo-type/i.test(this.domNode.innerHTML)){var d=this.domNode;this.containerNode&&!this.searchContainerNode&&(this.containerNode.stopParser=!0);l.parse(d,{noStart:!this._earlyTemplatedStartup,
template:!0,inherited:{dir:this.dir,lang:this.lang,textDir:this.textDir},propsThis:this,contextRequire:this.contextRequire,scope:"dojo"}).then(e.hitch(this,function(d){this._startupWidgets=d;for(var e=0;e<d.length;e++)this._processTemplateNode(d[e],function(a,b){return a[b]},function(a,b,c){return b in a?a.connect(a,b,c):a.on(b,c,!0)});this.containerNode&&this.containerNode.stopParser&&delete this.containerNode.stopParser}));if(!this._startupWidgets)throw Error(this.declaredClass+": parser returned unfilled promise (probably waiting for module auto-load), unsupported by _WidgetsInTemplateMixin.   Must pre-load all supporting widgets before instantiation.");
}},_processTemplateNode:function(d,e,l){return e(d,"dojoType")||e(d,"data-dojo-type")?!0:this.inherited(arguments)},startup:function(){k.forEach(this._startupWidgets,function(d){d&&!d._started&&d.startup&&d.startup()});this._startupWidgets=null;this.inherited(arguments)}})})},"jimu/dijit/CheckBox":function(){define("dojo/_base/declare dijit/_WidgetBase dojo/_base/lang dojo/_base/html dojo/dom-class dojo/on dojo/Evented dojo/keys".split(" "),function(k,f,g,e,l,d,p,n){return k([f,p],{baseClass:"jimu-checkbox",
declaredClass:"jimu.dijit.CheckBox",checked:!1,status:!0,label:"",postCreate:function(){this.checkNode=e.create("div",{"class":"checkbox jimu-float-leading"},this.domNode);this.labelNode=e.create("div",{"class":"label jimu-float-leading",innerHTML:this.label||""},this.domNode);this.checked&&e.addClass(this.checkNode,"checked");this.status||e.addClass(this.domNode,"jimu-state-disabled");this.own(d(this.checkNode,"click",g.hitch(this,function(){this.status&&(this.checked?this.uncheck():this.check())})));
this.own(d(this.labelNode,"click",g.hitch(this,function(){this.checked&&this.status?this.uncheck():this.status&&this.check()})));this._udpateLabelClass();this._initSection508()},setLabel:function(a){this.label=a||"";this.labelNode.innerHTML=this.label;this._udpateLabelClass()},getLabel:function(){return this.label||""},_udpateLabelClass:function(){this.labelNode&&(this.labelNode.innerHTML?e.removeClass(this.labelNode,"not-visible"):e.addClass(this.labelNode,"not-visible"))},_initSection508:function(){"undefined"!==
typeof this.tabindex&&(e.setAttr(this.checkNode,"tabindex",this.tabindex),this.own(d(this.checkNode,"focus",g.hitch(this,function(){e.addClass(this.checkNode,"dijitCheckBoxFocused")}))),this.own(d(this.checkNode,"blur",g.hitch(this,function(){e.removeClass(this.checkNode,"dijitCheckBoxFocused")}))),this.own(d(this.checkNode,"keypress",g.hitch(this,function(a){a=a.charCode||a.keyCode;e.hasClass(this.checkNode,"dijitCheckBoxFocused")&&n.SPACE===a&&this.status&&(this.checked?this.uncheck():this.check())}))))},
setValue:function(a){this.status&&(!0===a?this.check():this.uncheck())},getValue:function(){return this.checked},setStatus:function(a){a=!!a;var b=this.status!==a;(this.status=a)?l.remove(this.domNode,"jimu-state-disabled"):l.add(this.domNode,"jimu-state-disabled");b&&this.emit("status-change",a)},getStatus:function(){return this.status},check:function(){this.status&&(this.checked=!0,e.addClass(this.checkNode,"checked"),this.onStateChange())},uncheck:function(a){if(this.status&&(this.checked=!1,e.removeClass(this.checkNode,
"checked"),!a))this.onStateChange()},onStateChange:function(){if(this.onChange&&g.isFunction(this.onChange))this.onChange(this.checked);this.emit("change",this.checked)},focus:function(){this.checkNode&&this.checkNode.focus&&this.checkNode.focus()}})})},"dijit/form/DateTextBox":function(){define(["dojo/_base/declare","../Calendar","./_DateTimeTextBox"],function(k,f,g){return k("dijit.form.DateTextBox",g,{baseClass:"dijitTextBox dijitComboBox dijitDateTextBox",popupClass:f,_selector:"date",maxHeight:Infinity,
value:new Date("")})})},"dijit/Calendar":function(){define("dojo/_base/array dojo/date dojo/date/locale dojo/_base/declare dojo/dom-attr dojo/dom-class dojo/dom-construct dojo/_base/kernel dojo/keys dojo/_base/lang dojo/on dojo/sniff ./CalendarLite ./_Widget ./_CssStateMixin ./_TemplatedMixin ./form/DropDownButton".split(" "),function(k,f,g,e,l,d,p,n,a,b,c,r,q,u,w,x,v){var h=e("dijit.Calendar",[q,u,w],{baseClass:"dijitCalendar",cssStateNodes:{decrementMonth:"dijitCalendarArrow",incrementMonth:"dijitCalendarArrow",
previousYearLabelNode:"dijitCalendarPreviousYear",nextYearLabelNode:"dijitCalendarNextYear"},setValue:function(a){n.deprecated("dijit.Calendar:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");this.set("value",a)},_createMonthWidget:function(){return new h._MonthDropDownButton({id:this.id+"_mddb",tabIndex:-1,onMonthSelect:b.hitch(this,"_onMonthSelect"),lang:this.lang,dateLocaleModule:this.dateLocaleModule},this.monthNode)},postCreate:function(){this.inherited(arguments);this.own(c(this.domNode,
"keydown",b.hitch(this,"_onKeyDown")),c(this.dateRowsNode,"mouseover",b.hitch(this,"_onDayMouseOver")),c(this.dateRowsNode,"mouseout",b.hitch(this,"_onDayMouseOut")),c(this.dateRowsNode,"mousedown",b.hitch(this,"_onDayMouseDown")),c(this.dateRowsNode,"mouseup",b.hitch(this,"_onDayMouseUp")))},_onMonthSelect:function(a){var h=new this.dateClassObj(this.currentFocus);h.setDate(1);h.setMonth(a);a=this.dateModule.getDaysInMonth(h);var b=this.currentFocus.getDate();h.setDate(Math.min(b,a));this._setCurrentFocusAttr(h)},
_onDayMouseOver:function(a){(a=d.contains(a.target,"dijitCalendarDateLabel")?a.target.parentNode:a.target)&&(a.dijitDateValue&&!d.contains(a,"dijitCalendarDisabledDate")||a==this.previousYearLabelNode||a==this.nextYearLabelNode)&&(d.add(a,"dijitCalendarHoveredDate"),this._currentNode=a)},_onDayMouseOut:function(a){!this._currentNode||a.relatedTarget&&a.relatedTarget.parentNode==this._currentNode||(a="dijitCalendarHoveredDate",d.contains(this._currentNode,"dijitCalendarActiveDate")&&(a+=" dijitCalendarActiveDate"),
d.remove(this._currentNode,a),this._currentNode=null)},_onDayMouseDown:function(a){(a=a.target.parentNode)&&a.dijitDateValue&&!d.contains(a,"dijitCalendarDisabledDate")&&(d.add(a,"dijitCalendarActiveDate"),this._currentNode=a)},_onDayMouseUp:function(a){(a=a.target.parentNode)&&a.dijitDateValue&&d.remove(a,"dijitCalendarActiveDate")},handleKey:function(h){var b=-1,c,m=this.currentFocus;switch(h.keyCode){case a.RIGHT_ARROW:b=1;case a.LEFT_ARROW:c="day";this.isLeftToRight()||(b*=-1);break;case a.DOWN_ARROW:b=
1;case a.UP_ARROW:c="week";break;case a.PAGE_DOWN:b=1;case a.PAGE_UP:c=h.ctrlKey||h.altKey?"year":"month";break;case a.END:m=this.dateModule.add(m,"month",1),c="day";case a.HOME:m=new this.dateClassObj(m);m.setDate(1);break;default:return!0}c&&(m=this.dateModule.add(m,c,b));this._setCurrentFocusAttr(m);return!1},_onKeyDown:function(a){this.handleKey(a)||(a.stopPropagation(),a.preventDefault())},onValueSelected:function(){},onChange:function(a){this.onValueSelected(a)},getClassForDate:function(){}});
h._MonthDropDownButton=e("dijit.Calendar._MonthDropDownButton",v,{onMonthSelect:function(){},postCreate:function(){this.inherited(arguments);this.dropDown=new h._MonthDropDown({id:this.id+"_mdd",onChange:this.onMonthSelect})},_setMonthAttr:function(a){var h=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,a);this.dropDown.set("months",h);this.containerNode.innerHTML=(6==r("ie")?"":"\x3cdiv class\x3d'dijitSpacer'\x3e"+this.dropDown.domNode.innerHTML+"\x3c/div\x3e")+"\x3cdiv class\x3d'dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'\x3e"+
h[a.getMonth()]+"\x3c/div\x3e"}});h._MonthDropDown=e("dijit.Calendar._MonthDropDown",[u,x,w],{months:[],baseClass:"dijitCalendarMonthMenu dijitMenu",templateString:"\x3cdiv data-dojo-attach-event\x3d'ondijitclick:_onClick'\x3e\x3c/div\x3e",_setMonthsAttr:function(a){this.domNode.innerHTML="";k.forEach(a,function(a,h){p.create("div",{className:"dijitCalendarMonthLabel",month:h,innerHTML:a},this.domNode)._cssState="dijitCalendarMonthLabel"},this)},_onClick:function(a){this.onChange(l.get(a.target,"month"))},
onChange:function(){}});return h})},"dijit/CalendarLite":function(){define("dojo/_base/array dojo/_base/declare dojo/cldr/supplemental dojo/date dojo/date/locale dojo/date/stamp dojo/dom dojo/dom-class dojo/dom-attr dojo/_base/lang dojo/on dojo/sniff dojo/string ./_WidgetBase ./_TemplatedMixin dojo/text!./templates/Calendar.html ./a11yclick ./hccss".split(" "),function(k,f,g,e,l,d,p,n,a,b,c,r,q,u,w,x){var v=f("dijit.CalendarLite",[u,w],{templateString:x,dowTemplateString:'\x3cth class\x3d"dijitReset dijitCalendarDayLabelTemplate" role\x3d"columnheader" scope\x3d"col"\x3e\x3cspan class\x3d"dijitCalendarDayLabel"\x3e${d}\x3c/span\x3e\x3c/th\x3e',
dateTemplateString:'\x3ctd class\x3d"dijitReset" role\x3d"gridcell" data-dojo-attach-point\x3d"dateCells"\x3e\x3cspan class\x3d"dijitCalendarDateLabel" data-dojo-attach-point\x3d"dateLabels"\x3e\x3c/span\x3e\x3c/td\x3e',weekTemplateString:'\x3ctr class\x3d"dijitReset dijitCalendarWeekTemplate" role\x3d"row"\x3e${d}${d}${d}${d}${d}${d}${d}\x3c/tr\x3e',value:new Date(""),datePackage:"",dayWidth:"narrow",tabIndex:"0",dayOffset:-1,currentFocus:new Date,_setSummaryAttr:"gridNode",baseClass:"dijitCalendar dijitCalendarLite",
_isValidDate:function(a){return a&&!isNaN(a)&&"object"==typeof a&&a.toString()!=this.constructor.prototype.value.toString()},_getValueAttr:function(){var a=this._get("value");if(a&&!isNaN(a)){var b=new this.dateClassObj(a);b.setHours(0,0,0,0);b.getDate()<a.getDate()&&(b=this.dateModule.add(b,"hour",1));return b}return null},_setValueAttr:function(a,b){"string"==typeof a&&(a=d.fromISOString(a));a=this._patchDate(a);if(this._isValidDate(a)&&!this.isDisabledDate(a,this.lang)){if(this._set("value",a),
this.set("currentFocus",a),this._markSelectedDates([a]),this._created&&(b||"undefined"==typeof b))this.onChange(this.get("value"))}else this._set("value",null),this._markSelectedDates([])},_patchDate:function(a){if(a||0===a)a=new this.dateClassObj(a),a.setHours(1,0,0,0);return a},_setText:function(a,b){for(;a.firstChild;)a.removeChild(a.firstChild);a.appendChild(a.ownerDocument.createTextNode(b))},_populateGrid:function(){var b=new this.dateClassObj(this.currentFocus);b.setDate(1);var b=this._patchDate(b),
c=b.getDay(),d=this.dateModule.getDaysInMonth(b),r=this.dateModule.getDaysInMonth(this.dateModule.add(b,"month",-1)),e=new this.dateClassObj,q=0<=this.dayOffset?this.dayOffset:g.getFirstDayOfWeek(this.lang);q>c&&(q-=7);if(!this.summary){var f=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,b);this.gridNode.setAttribute("summary",f[b.getMonth()])}this._date2cell={};k.forEach(this.dateCells,function(h,k){var m=k+q,g=new this.dateClassObj(b),f="dijitCalendar",t=0;m<c?(m=r-c+m+1,
t=-1,f+="Previous"):m>=c+d?(m=m-c-d+1,t=1,f+="Next"):(m=m-c+1,f+="Current");t&&(g=this.dateModule.add(g,"month",t));g.setDate(m);this.dateModule.compare(g,e,"date")||(f="dijitCalendarCurrentDate "+f);this.isDisabledDate(g,this.lang)?(f="dijitCalendarDisabledDate "+f,h.setAttribute("aria-disabled","true")):(f="dijitCalendarEnabledDate "+f,h.removeAttribute("aria-disabled"),h.setAttribute("aria-selected","false"));(t=this.getClassForDate(g,this.lang))&&(f=t+" "+f);h.className=f+"Month dijitCalendarDateTemplate";
f=g.valueOf();this._date2cell[f]=h;h.dijitDateValue=f;f=g.getDateLocalized?g.getDateLocalized(this.lang):g.getDate();this._setText(this.dateLabels[k],f);a.set(h,"aria-label",l.format(g,{selector:"date",formatLength:"long"}))},this)},_populateControls:function(){var a=new this.dateClassObj(this.currentFocus);a.setDate(1);this.monthWidget.set("month",a);var b=a.getFullYear()-1,c=new this.dateClassObj;k.forEach(["previous","current","next"],function(a){c.setFullYear(b++);this._setText(this[a+"YearLabelNode"],
this.dateLocaleModule.format(c,{selector:"year",locale:this.lang}))},this)},goToToday:function(){this.set("value",new this.dateClassObj)},constructor:function(a){this.dateModule=a.datePackage?b.getObject(a.datePackage,!1):e;this.dateClassObj=this.dateModule.Date||Date;this.dateLocaleModule=a.datePackage?b.getObject(a.datePackage+".locale",!1):l},_createMonthWidget:function(){return v._MonthWidget({id:this.id+"_mddb",lang:this.lang,dateLocaleModule:this.dateLocaleModule},this.monthNode)},buildRendering:function(){var a=
this.dowTemplateString,b=this.dateLocaleModule.getNames("days",this.dayWidth,"standAlone",this.lang),c=0<=this.dayOffset?this.dayOffset:g.getFirstDayOfWeek(this.lang);this.dayCellsHtml=q.substitute([a,a,a,a,a,a,a].join(""),{d:""},function(){return b[c++%7]});a=q.substitute(this.weekTemplateString,{d:this.dateTemplateString});this.dateRowsHtml=[a,a,a,a,a,a].join("");this.dateCells=[];this.dateLabels=[];this.inherited(arguments);p.setSelectable(this.domNode,!1);a=new this.dateClassObj(this.currentFocus);
this.monthWidget=this._createMonthWidget();this.set("currentFocus",a,!1)},postCreate:function(){this.inherited(arguments);this._connectControls()},_connectControls:function(){var a=b.hitch(this,function(a,h,d){this[a].dojoClick=!0;return c(this[a],"click",b.hitch(this,function(){this._setCurrentFocusAttr(this.dateModule.add(this.currentFocus,h,d))}))});this.own(a("incrementMonth","month",1),a("decrementMonth","month",-1),a("nextYearLabelNode","year",1),a("previousYearLabelNode","year",-1))},_setCurrentFocusAttr:function(a,
b){var c=this.currentFocus,h=this._getNodeByDate(c);a=this._patchDate(a);this._set("currentFocus",a);this._date2cell&&0==this.dateModule.difference(c,a,"month")||(this._populateGrid(),this._populateControls(),this._markSelectedDates([this.value]));a=this._getNodeByDate(a);a.setAttribute("tabIndex",this.tabIndex);(this.focused||b)&&a.focus();h&&h!=a&&(r("webkit")?h.setAttribute("tabIndex","-1"):h.removeAttribute("tabIndex"))},focus:function(){this._setCurrentFocusAttr(this.currentFocus,!0)},_onDayClick:function(a){a.stopPropagation();
a.preventDefault();for(a=a.target;a&&!a.dijitDateValue&&0!==a.dijitDateValue;a=a.parentNode);a&&!n.contains(a,"dijitCalendarDisabledDate")&&this.set("value",a.dijitDateValue)},_getNodeByDate:function(a){return(a=this._patchDate(a))&&this._date2cell?this._date2cell[a.valueOf()]:null},_markSelectedDates:function(a){function c(a,b){n.toggle(b,"dijitCalendarSelectedDate",a);b.setAttribute("aria-selected",a?"true":"false")}k.forEach(this._selectedCells||[],b.partial(c,!1));this._selectedCells=k.filter(k.map(a,
this._getNodeByDate,this),function(a){return a});k.forEach(this._selectedCells,b.partial(c,!0))},onChange:function(){},isDisabledDate:function(){},getClassForDate:function(){}});v._MonthWidget=f("dijit.CalendarLite._MonthWidget",u,{_setMonthAttr:function(a){var b=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,a),c=6==r("ie")?"":"\x3cdiv class\x3d'dijitSpacer'\x3e"+k.map(b,function(a){return"\x3cdiv\x3e"+a+"\x3c/div\x3e"}).join("")+"\x3c/div\x3e";this.domNode.innerHTML=c+"\x3cdiv class\x3d'dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'\x3e"+
b[a.getMonth()]+"\x3c/div\x3e"}});return v})},"dijit/form/DropDownButton":function(){define("dojo/_base/declare dojo/_base/kernel dojo/_base/lang dojo/query ../registry ../popup ./Button ../_Container ../_HasDropDown dojo/text!./templates/DropDownButton.html ../a11yclick".split(" "),function(k,f,g,e,l,d,p,n,a,b){return k("dijit.form.DropDownButton",[p,n,a],{baseClass:"dijitDropDownButton",templateString:b,_fillContent:function(){var a=this.srcNodeRef,b=this.containerNode;if(a&&b)for(;a.hasChildNodes();){var d=
a.firstChild;d.hasAttribute&&(d.hasAttribute("data-dojo-type")||d.hasAttribute("dojoType")||d.hasAttribute("data-"+f._scopeName+"-type")||d.hasAttribute(f._scopeName+"Type"))?(this.dropDownContainer=this.ownerDocument.createElement("div"),this.dropDownContainer.appendChild(d)):b.appendChild(d)}},startup:function(){this._started||(!this.dropDown&&this.dropDownContainer&&(this.dropDown=l.byNode(this.dropDownContainer.firstChild),delete this.dropDownContainer),this.dropDown&&d.hide(this.dropDown),this.inherited(arguments))},
isLoaded:function(){var a=this.dropDown;return!!a&&(!a.href||a.isLoaded)},loadDropDown:function(a){var b=this.dropDown,c=b.on("load",g.hitch(this,function(){c.remove();a()}));b.refresh()},isFocusable:function(){return this.inherited(arguments)&&!this._mouseDown}})})},"dijit/form/_DateTimeTextBox":function(){define("dojo/date dojo/date/locale dojo/date/stamp dojo/_base/declare dojo/_base/lang ./RangeBoundTextBox ../_HasDropDown dojo/text!./templates/DropDownBox.html".split(" "),function(k,f,g,e,l,
d,p,n){new Date("X");return e("dijit.form._DateTimeTextBox",[d,p],{templateString:n,hasDownArrow:!0,cssStateNodes:{_buttonNode:"dijitDownArrowButton"},_unboundedConstraints:{},pattern:f.regexp,datePackage:"",postMixInProperties:function(){this.inherited(arguments);this._set("type","text")},compare:function(a,b){var c=this._isInvalidDate(a),d=this._isInvalidDate(b);if(c||d)return c&&d?0:c?-1:1;a=this.format(a,this._unboundedConstraints);b=this.format(b,this._unboundedConstraints);c=this.parse(a,this._unboundedConstraints);
d=this.parse(b,this._unboundedConstraints);return a==b?0:k.compare(c,d,this._selector)},autoWidth:!0,format:function(a,b){return a?this.dateLocaleModule.format(a,b):""},parse:function(a,b){return this.dateLocaleModule.parse(a,b)||(this._isEmpty(a)?null:void 0)},serialize:function(a,b){a.toGregorian&&(a=a.toGregorian());return g.toISOString(a,b)},dropDownDefaultValue:new Date,value:new Date(""),_blankValue:null,popupClass:"",_selector:"",constructor:function(a){a=a||{};this.dateModule=a.datePackage?
l.getObject(a.datePackage,!1):k;this.dateClassObj=this.dateModule.Date||Date;this.dateClassObj instanceof Date||(this.value=new this.dateClassObj(this.value));this.dateLocaleModule=a.datePackage?l.getObject(a.datePackage+".locale",!1):f;this._set("pattern",this.dateLocaleModule.regexp);this._invalidDate=this.constructor.prototype.value.toString()},buildRendering:function(){this.inherited(arguments);this.hasDownArrow||(this._buttonNode.style.display="none");this.hasDownArrow||(this._buttonNode=this.domNode,
this.baseClass+=" dijitComboBoxOpenOnClick")},_setConstraintsAttr:function(a){a.selector=this._selector;a.fullYear=!0;var b=g.fromISOString;"string"==typeof a.min&&(a.min=b(a.min),this.dateClassObj instanceof Date||(a.min=new this.dateClassObj(a.min)));"string"==typeof a.max&&(a.max=b(a.max),this.dateClassObj instanceof Date||(a.max=new this.dateClassObj(a.max)));this.inherited(arguments);this._unboundedConstraints=l.mixin({},this.constraints,{min:null,max:null})},_isInvalidDate:function(a){return!a||
isNaN(a)||"object"!=typeof a||a.toString()==this._invalidDate},_setValueAttr:function(a,b,c){void 0!==a&&("string"==typeof a&&(a=g.fromISOString(a)),this._isInvalidDate(a)&&(a=null),a instanceof Date&&!(this.dateClassObj instanceof Date)&&(a=new this.dateClassObj(a)));this.inherited(arguments,[a,b,c]);this.value instanceof Date&&(this.filterString="");!1!==b&&this.dropDown&&this.dropDown.set("value",a,!1)},_set:function(a,b){if("value"==a){b instanceof Date&&!(this.dateClassObj instanceof Date)&&
(b=new this.dateClassObj(b));var c=this._get("value");if(c instanceof this.dateClassObj&&0==this.compare(b,c))return}this.inherited(arguments)},_setDropDownDefaultValueAttr:function(a){this._isInvalidDate(a)&&(a=new this.dateClassObj);this._set("dropDownDefaultValue",a)},openDropDown:function(a){this.dropDown&&this.dropDown.destroy();var b=l.isString(this.popupClass)?l.getObject(this.popupClass,!1):this.popupClass,c=this,d=this.get("value");this.dropDown=new b({onChange:function(a){c.set("value",
a,!0)},id:this.id+"_popup",dir:c.dir,lang:c.lang,value:d,textDir:c.textDir,currentFocus:this._isInvalidDate(d)?this.dropDownDefaultValue:d,constraints:c.constraints,filterString:c.filterString,datePackage:c.datePackage,isDisabledDate:function(a){return!c.rangeCheck(a,c.constraints)}});this.inherited(arguments)},_getDisplayedValueAttr:function(){return this.textbox.value},_setDisplayedValueAttr:function(a,b){this._setValueAttr(this.parse(a,this.constraints),b,a)}})})},"widgets/Daylight/_build-generate_module":function(){define(["dojo/text!./Widget.html",
"dojo/text!./css/style.css","dojo/i18n!./nls/strings"],function(){})},"url:dijit/templates/Calendar.html":'\x3cdiv class\x3d"dijitCalendarContainer dijitInline" role\x3d"presentation" aria-labelledby\x3d"${id}_mddb ${id}_year"\x3e\r\n\t\x3cdiv class\x3d"dijitReset dijitCalendarMonthContainer" role\x3d"presentation"\x3e\r\n\t\t\x3cdiv class\x3d\'dijitReset dijitCalendarArrow dijitCalendarDecrementArrow\' data-dojo-attach-point\x3d"decrementMonth"\x3e\r\n\t\t\t\x3cimg src\x3d"${_blankGif}" alt\x3d"" class\x3d"dijitCalendarIncrementControl dijitCalendarDecrease" role\x3d"presentation"/\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"decreaseArrowNode" class\x3d"dijitA11ySideArrow"\x3e-\x3c/span\x3e\r\n\t\t\x3c/div\x3e\r\n\t\t\x3cdiv class\x3d\'dijitReset dijitCalendarArrow dijitCalendarIncrementArrow\' data-dojo-attach-point\x3d"incrementMonth"\x3e\r\n\t\t\t\x3cimg src\x3d"${_blankGif}" alt\x3d"" class\x3d"dijitCalendarIncrementControl dijitCalendarIncrease" role\x3d"presentation"/\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"increaseArrowNode" class\x3d"dijitA11ySideArrow"\x3e+\x3c/span\x3e\r\n\t\t\x3c/div\x3e\r\n\t\t\x3cdiv data-dojo-attach-point\x3d"monthNode" class\x3d"dijitInline"\x3e\x3c/div\x3e\r\n\t\x3c/div\x3e\r\n\t\x3ctable cellspacing\x3d"0" cellpadding\x3d"0" role\x3d"grid" data-dojo-attach-point\x3d"gridNode"\x3e\r\n\t\t\x3cthead\x3e\r\n\t\t\t\x3ctr role\x3d"row"\x3e\r\n\t\t\t\t${!dayCellsHtml}\r\n\t\t\t\x3c/tr\x3e\r\n\t\t\x3c/thead\x3e\r\n\t\t\x3ctbody data-dojo-attach-point\x3d"dateRowsNode" data-dojo-attach-event\x3d"ondijitclick: _onDayClick" class\x3d"dijitReset dijitCalendarBodyContainer"\x3e\r\n\t\t\t\t${!dateRowsHtml}\r\n\t\t\x3c/tbody\x3e\r\n\t\x3c/table\x3e\r\n\t\x3cdiv class\x3d"dijitReset dijitCalendarYearContainer" role\x3d"presentation"\x3e\r\n\t\t\x3cdiv class\x3d"dijitCalendarYearLabel"\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"previousYearLabelNode" class\x3d"dijitInline dijitCalendarPreviousYear" role\x3d"button"\x3e\x3c/span\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"currentYearLabelNode" class\x3d"dijitInline dijitCalendarSelectedYear" role\x3d"button" id\x3d"${id}_year"\x3e\x3c/span\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"nextYearLabelNode" class\x3d"dijitInline dijitCalendarNextYear" role\x3d"button"\x3e\x3c/span\x3e\r\n\t\t\x3c/div\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
"url:dijit/form/templates/DropDownButton.html":'\x3cspan class\x3d"dijit dijitReset dijitInline"\r\n\t\x3e\x3cspan class\x3d\'dijitReset dijitInline dijitButtonNode\'\r\n\t\tdata-dojo-attach-event\x3d"ondijitclick:__onClick" data-dojo-attach-point\x3d"_buttonNode"\r\n\t\t\x3e\x3cspan class\x3d"dijitReset dijitStretch dijitButtonContents"\r\n\t\t\tdata-dojo-attach-point\x3d"focusNode,titleNode,_arrowWrapperNode,_popupStateNode"\r\n\t\t\trole\x3d"button" aria-haspopup\x3d"true" aria-labelledby\x3d"${id}_label"\r\n\t\t\t\x3e\x3cspan class\x3d"dijitReset dijitInline dijitIcon"\r\n\t\t\t\tdata-dojo-attach-point\x3d"iconNode"\r\n\t\t\t\x3e\x3c/span\r\n\t\t\t\x3e\x3cspan class\x3d"dijitReset dijitInline dijitButtonText"\r\n\t\t\t\tdata-dojo-attach-point\x3d"containerNode"\r\n\t\t\t\tid\x3d"${id}_label"\r\n\t\t\t\x3e\x3c/span\r\n\t\t\t\x3e\x3cspan class\x3d"dijitReset dijitInline dijitArrowButtonInner"\x3e\x3c/span\r\n\t\t\t\x3e\x3cspan class\x3d"dijitReset dijitInline dijitArrowButtonChar"\x3e\x26#9660;\x3c/span\r\n\t\t\x3e\x3c/span\r\n\t\x3e\x3c/span\r\n\t\x3e\x3cinput ${!nameAttrSetting} type\x3d"${type}" value\x3d"${value}" class\x3d"dijitOffScreen" tabIndex\x3d"-1"\r\n\t\tdata-dojo-attach-event\x3d"onclick:_onClick" data-dojo-attach-point\x3d"valueNode" aria-hidden\x3d"true"\r\n/\x3e\x3c/span\x3e\r\n',
"url:widgets/Daylight/Widget.html":'\x3cdiv\x3e\r\n\t\x3cdiv\x3e${nls.dragSunSliderText}\x3c/div\x3e\r\n\t\x3cdiv data-dojo-type\x3d"dijit/form/HorizontalSlider" data-dojo-attach-point\x3d"slider" data-dojo-props\x3d\'intermediateChanges:true,showButtons:false,minimum:0,maximum:23.99\' style\x3d"margin-top:10px;"\x3e\x3c/div\x3e\r\n\t\x3cdiv class\x3d"time-zone"\x3e\r\n\t\t\x3cdiv class\x3d"sun-time jimu-float-leading" data-dojo-attach-point\x3d"sunTime"\x3e\x3c/div\x3e\r\n\t\t\x3cselect data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"zoneSelect" class\x3d"jimu-float-trailing" style\x3d"width:40%;"\x3e\x3c/select\x3e\r\n\t\x3c/div\x3e\r\n\r\n\t\x3cinput type\x3d"text" data-dojo-attach-point\x3d"datePicker" constraints\x3d{selector:"date",formatLength:"long",fullYear:true} data-dojo-type\x3d"dijit/form/DateTextBox" required\x3d"true" autoWidth\x3d"true" style\x3d"margin-top:15px;width: 100%;"/\x3e\r\n\r\n\t\x3cdiv class\x3d"shadow-container" data-dojo-attach-point\x3d"shadowContainer"\x3e\r\n\t\t\x3cdiv class\x3d"shadowing-title"\x3e${nls.shadowing}\x3c/div\x3e\r\n\r\n\t\t\x3cdiv class\x3d"direct-shadow" data-dojo-attach-point\x3d"directShadowSection"\x3e\r\n\t\t\t\x3cdiv data-dojo-type\x3d"jimu/dijit/CheckBox" data-dojo-attach-point\x3d"cbxDirect"\x3e\x3c/div\x3e\r\n\t\t\x3c/div\x3e\r\n\r\n\t\t\x3c!-- \x3cdiv class\x3d"diffuse-shadow" data-dojo-attach-point\x3d"diffuseShadowSection"\x3e\r\n\t\t\t\x3cdiv data-dojo-type\x3d"jimu/dijit/CheckBox" data-dojo-attach-point\x3d"cbxDiffuse"\x3e\x3c/div\x3e\r\n\t\t\x3c/div\x3e --\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e',
"url:widgets/Daylight/css/style.css":".jimu-widget-daylight .time-zone{overflow: hidden; margin-top: 15px;}.jimu-widget-daylight .sun-time{width: 40%; height: 30px; line-height: 30px; padding-left: 10px; border:1px solid #ccc;}.jimu-rtl .jimu-widget-daylight .sun-time{padding-left: 0; padding-right: 10px;}.jimu-widget-daylight .shadowing-title{}.jimu-widget-daylight .shadow-container{margin-top: 40px;}.jimu-widget-daylight .direct-shadow{margin-top: 5px;}.jimu-widget-daylight .diffuse-shadow{margin-top: 5px;}",
"*now":function(k){k(['dojo/i18n!*preload*widgets/Daylight/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","vi","uk","zh-hk","zh-tw","ROOT"]'])}}});
define("dojo/_base/declare jimu/BaseWidget dijit/_WidgetsInTemplateMixin dojo/on dojo/_base/lang dojo/_base/html jimu/utils esri/core/watchUtils dijit/form/HorizontalSlider dijit/form/Select jimu/dijit/CheckBox dijit/form/DateTextBox".split(" "),function(k,f,g,e,l,d,p,n){return k([f,g],{baseClass:"jimu-widget-daylight",postCreate:function(){this.inherited(arguments);this.sceneView.when(l.hitch(this,this._init))},_init:function(){var a=this._getDateOfLighting();this._initDatePaker(a);this._initZoneSelect();
this._updateSliderUIByDate(a);a=this.sceneView.environment.lighting;this.own(e(a,"date-will-change",l.hitch(this,this._onDateWillChange)));this.own(e(this.zoneSelect,"change",l.hitch(this,this._onZoneSelectChanged)));this.own(e(this.datePicker,"change",l.hitch(this,this._onDatePickerChanged)));this.own(e(this.slider,"change",l.hitch(this,this._onSliderValueChanged)));var b=!1;void 0!==a.directShadowsEnabled?(b=!0,this.cbxDirect.setLabel(this.nls.directShadow+"\x26lrm;"),this.own(n.init(this.sceneView,
"environment.lighting.directShadowsEnabled",l.hitch(this,this._onWatchDirectShadows))),this.cbxDirect.onChange=l.hitch(this,this._onDirectShadowChange)):d.setStyle(this.directShadowSection,"display","none");b||d.setStyle(this.shadowContainer,"display","none")},_setDateOfLighting:function(a){this._getDateOfLighting().getTime()!==a.getTime()&&(this.sceneView.environment.lighting.date=a)},_initZoneSelect:function(){for(var a=this.sceneView.environment.lighting.positionTimezoneInfo,a=this.config.defaultTimeZone||
a.hours,b=[],c="",c=null,d=-12;12>=d;d++)c="GMT",0>d?c+=" ":0===d?c+=" ":0<d&&(c+="+"),c+=d,c={value:d+"",label:c},b.push(c);this.zoneSelect.addOption(b);this.zoneSelect.set("value",a+"")},_initDatePaker:function(a){this.datePicker.set("value",a)},_updateSliderUIByDate:function(a){var b=this._getTimeZoneByUI(),c=((a.getUTCHours()+b)%24+24)%24,d=a.getUTCMinutes(),e=a.getUTCSeconds(),b=this.slider.get("value"),c=c+d/60+e/3600;this._updateSunTimeUIByDate(a);b!==c&&this.slider.set("value",c)},_updateSunTimeUIByDate:function(a){var b=
new Date(a),c=this._getTimeZoneByUI();a=((a.getUTCHours()+c)%24+24)%24;b.setHours(a);b=p.localizeDate(b,{fullYear:!1,selector:"time",formatLength:"short"});this.sunTime.innerHTML=b},_getDateOfLighting:function(){return this.sceneView.environment.lighting.get("date")},_getDateByUI:function(){var a=this._getDateOfLighting(),a=new Date(a),b=this._getTimeZoneByUI(),c=this.slider.get("value"),b=((Math.floor(c)-b)%24+24)%24,c=60*(c-Math.floor(c)),d=c%1,c=c-d,d=Math.round(60*d),e=this.datePicker.get("value"),
f=e.getFullYear(),g=e.getMonth(),e=e.getDate();a.setUTCFullYear(f);a.setUTCMonth(g);a.setUTCDate(e);a.setUTCHours(b);a.setUTCMinutes(c);a.setUTCSeconds(d);return a},_getTimeZoneByUI:function(){return parseInt(this.zoneSelect.get("value"),10)},_getPositionTimeZone:function(){return this.sceneView.environment.lighting.positionTimezoneInfo.hours},_onDateWillChange:function(a){this._updateSliderUIByDate(a.date)},_onZoneSelectChanged:function(){this.slider.ignoreChangeEvent=!0;var a=this._getDateOfLighting();
this._updateSliderUIByDate(a)},_onDatePickerChanged:function(a){if(this.datePicker.isValid()){var b=this._getDateOfLighting(),b=new Date(b),c=a.getFullYear(),d=a.getMonth();a=a.getDate();b.setUTCFullYear(c);b.setUTCMonth(d);b.setUTCDate(a);this._setDateOfLighting(b)}},_onSliderValueChanged:function(){var a=this._getDateByUI();this._updateSunTimeUIByDate(a);var b=this.slider.ignoreChangeEvent;delete this.slider.ignoreChangeEvent;b||this._setDateOfLighting(a)},_onWatchDirectShadows:function(a){this.cbxDirect.setValue(a)},
_onWatchAmbientOcclusion:function(){},_onDirectShadowChange:function(){var a=this.cbxDirect.getValue();this.sceneView.environment.lighting.directShadowsEnabled=a},_onDiffuseShadowChange:function(){}})});