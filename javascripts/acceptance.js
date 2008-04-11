var Acceptance=(function(){var i=function(a){a.apply(w)};i.reattach=function(){var n=0;for(var a in j){if(j[a]._0())++n}return n};var j={};var k=function(a){return j[a]||(j[a]=new B(a))};var l=/^\-?(0|[1-9]\d*)(\.\d+)?(e[\+\-]?\d+)?$/i;var m=/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/i;var p=function(a){return a?false:(String(a).strip()=='')};var q=function(a){return l.test(String(a))};var r=function(a){return!p(a)||['must not be blank']};var t=function(b){b=$(b);if(!b)return null;var c=b.ancestors().find(function(a){return a.match('label')});if(c)return c;var d=b.id;if(!d)return null;return $$('label[for='+d+']')[0]||null};var u=function(a){var b=$(a).serialize(true);for(var c in b){if(b[c]instanceof Array)b[c]=b[c][0]}return b};var v=function(a,b){var c,d,f=a[0];switch(true){case a.all(function(e){return e.match('[type=radio]')}):c=a.find(function(e){return e.value==b});if(!c)return;a.each(function(e){e.checked=false});c.checked=true;break;case f.match('[type=checkbox]'):f.checked=!!(b===true||b==f.value);break;case f.match('select'):d=$A(f.options);c=d.find(function(o){return o.value==b});if(!c)return;d.each(function(o){o.selected=false});c.selected=true;break;case f.match('input'):case f.match('[type=hidden]'):case f.match('textarea'):f.value=String(b);break}};var w={form:function(a){return k(a)._1||null},when:function(a){return k(a)._2||null},before:function(a){return k(a)._3||null},displayErrorsIn:function(e){return function(b){if(typeof e=='string')e=$$(e)[0];if(!e)return;var n=b.length;if(n==0)return e.update('');var c=(n==1)?'was':'were',s=(n==1)?'':'s';var d='<div class="error-explanation">';d+='<p>There '+c+' '+n+' error'+s+' with the form</p>';d+='<ul>';b.each(function(a){d+='<li>'+a.message+'</li>'});d+='</ul>';d+='</div>';e.update(d)}},displayResponseIn:function(b){return function(a){if(typeof b=='string')b=$$(b)[0];if(!b)return;b.update(a.responseText)}},EMAIL_FORMAT:m};var x=Class.create({initialize:function(a){this._4=a},requires:function(a,b){var c=this._4._5(a);if(b)this._4._6[a]=b;return c._1},validates:function(a){this._4._7.push(a);return this},submitsUsingAjax:function(){this._4._8=true;return this}});x.prototype.expects=x.prototype.requires;FormDSLMethods=['requires','expects','validates','submitsUsingAjax'];var y=Class.create({initialize:function(a){this._9=a},toBeChecked:function(c){var d=this._9;this._9._10(function(a){var b=d._11[0];return(a==b.value&&b.checked)||[c||'must be checked']});return this},toBeNumeric:function(b){this._9._10(function(a){return q(a)||[b||'must be a number']});return this},toBeOneOf:function(b,c){this._9._10(function(a){return b.include(a)||[c||'is not valid']});return this},toBeNoneOf:function(b,c){this._9._10(function(a){return!b.include(a)||[c||'is not valid']});return this},toBePresent:function(b){this._9._10(function(a){return!p(a)||[b||'must not be blank']});return this},toConfirm:function(c,d){this._9._10(function(a,b){return a==b.get(c)||[d||'must be confirmed',c]});return this},toHaveLength:function(b,c){var d=b.minimum,e=b.maximum;this._9._10(function(a){return(typeof b=='number'&&a.length!=b&&[c||'must contain exactly '+b+' characters'])||(d!==undefined&&a.length<d&&[c||'must contain at least '+d+' characters'])||(e!==undefined&&a.length>e&&[c||'must contain no more than '+e+' characters'])||true});return this},toHaveValue:function(b,c){var d=b.minimum,e=b.maximum;this._9._10(function(a){if(!q(a))return[c||'must be a number'];a=Number(a);return(d!==undefined&&a<d&&[c||'must be at least '+d])||(e!==undefined&&a>e&&[c||'must not be greater than '+e])||true});return this},toMatch:function(b,c){this._9._10(function(a){return b.test(a)||[c||'is not valid']});return this}});FormDSLMethods.each(function(b){y.prototype[b]=function(){var a=this._9._4._1;return a[b].apply(a,arguments)}});var z=Class.create({initialize:function(a){this._4=a},isValidated:function(b,c){this._4.subscribe(function(a){b.call(c||null,a._12._13())})},responseArrives:function(a,b){if(b)a=a.bind(b);this._4._14.push(a)}});var A=Class.create({initialize:function(a){this._4=a},isValidated:function(a){this._4._15.push(a)}});var B=Class.create({initialize:function(a){this._16=[];this._17=this._17.bindAsEventListener(this);this._18=a;this._6={};this._0();this._19={};this._7=[];this._15=[];this._14=[];this._1=new x(this);this._2=new z(this);this._3=new A(this)},subscribe:function(a,b){this._16.push({_20:a,_21:b||null})},notifyObservers:function(){var b=$A(arguments);this._16.each(function(a){a._20.apply(a._21,b)})},_0:function(){if(this._22())return false;this._23={};this._24={};this._25={};this._4=$(this._18);if(!this._22())return false;this._4.observe('submit',this._17);for(var a in this._19)this._19[a]._0();return true},_22:function(){return this._4&&this._4.match('body form')},_5:function(a){return this._19[a]||(this._19[a]=new C(this,a))},_17:function(c){var d=this._26();if(this._8||!d)Event.stop(c);if(!this._8||!d)return;var e=this._4;new Ajax.Request(e.action,{method:e.method||'post',parameters:this._27,onSuccess:function(b){this._14.each(function(a){a(b)})}.bind(this)})},_28:function(c){if(this._23[c])return this._23[c];if(!this._4)return[];return this._23[c]=this._4.descendants().findAll(function(a){var b=a.match('input, textarea, select');return b&&(c?(a.name==c):true)})},_29:function(a){if(a.name)a=a.name;return this._24[a]||(this._24[a]=t(this._28(a)[0]))},_30:function(d){if(this._25[d])return this._25[d];if(this._6[d])return this._25[d]=this._6[d];var e=this._29(d);var f=((e||{}).innerHTML||d).stripTags().strip();f=f.replace(/(\w)[_-](\w)/g,'$1 $2').replace(/([a-z])([A-Z])/g,function(c,a,b){return a+' '+b.toLowerCase()});return this._25[d]=f.charAt(0).toUpperCase()+f.substring(1)},_31:function(){return this._27=u(this._4)},_32:function(){this._12=new E(this);var b=this._31(),c,d;this._15.each(function(a){a(b)});for(c in b)v(this._28(c),b[c]);b=new D(b);for(c in this._19)this._19[c]._33(b.get(c),b);this._7.each(function(a){a(b,this._12)},this);var e=this._12._34();for(c in this._23)[this._28(c),[this._29(c)]].invoke('each',function(a){if(!a)return;a[e.include(c)?'addClassName':'removeClassName']('invalid')});this.notifyObservers(this)},_26:function(){this._32();return this._12._35()==0}});var C=Class.create({initialize:function(a,b){this._4=a;this._36=b;this._37=[];this._1=new y(this);this._0()},_0:function(){this._11=this._4._28(this._36)},_10:function(a){this._37.push(a)},_33:function(e,f){var g=[],h=this._37.length?this._37:[r],e=e||'';h.each(function(a){var b=a(e,f),c,d;if(b!==true){c=b[0];d=b[1]||this._36;this._4._12.register(this._36);this._4._12.add(d,c)}},this);return g.length?g:true}});var D=Class.create({initialize:function(b){this.get=function(a){return b[a]===undefined?null:b[a]}}});var E=Class.create({initialize:function(e){var f={},g=[];Object.extend(this,{register:function(a){f[a]=f[a]||[]},add:function(a,b){this.register(a);f[a].push(b)},addToBase:function(a){g.push(a)},_35:function(){var n=g.length;for(var a in f)n+=f[a].length;return n},_13:function(){var b,c=g.map(function(a){return{field:null,message:a}});for(var d in f){b=e._30(d);f[d].each(function(a){c.push({field:d,message:b+' '+a})})}return c},_34:function(){var a=[];for(var b in f)a.push(b);return a}})}});return i})();