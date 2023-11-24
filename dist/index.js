!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ctod=t():e.ctod=t()}(this||("undefined"!=typeof window?window:global),(()=>(()=>{"use strict";var e={37:function(e,t,n){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},r.apply(this,arguments)},o=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},a=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(o)throw o.error}}return a},u=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0}),t.ChatBroker=void 0;var s=n(15),c=n(470),l=n(87),f=function(){function e(e){var t;this.hook=new c.Hook,this.plugins={},this.installed=!1,this.log=new c.Log(null!==(t=e.name)&&void 0!==t?t:"no name"),this.params=e,this.translator=new l.Translator(r(r({},e),{parsers:[s.TextParser.JsonMessage()]}))}return e.prototype._install=function(){if(!1===this.installed){this.installed=!0;var e={log:this.log,attach:this.hook.attach.bind(this.hook),attachAfter:this.hook.attachAfter.bind(this.hook),translator:this.translator};if(this.params.install(e),this.params.plugins)for(var t in this.plugins="function"==typeof this.params.plugins?this.params.plugins():this.params.plugins,this.plugins)this.plugins[t].instance._params.onInstall(r(r({},e),{params:this.plugins[t].params,receive:this.plugins[t].receive}))}},e.prototype.request=function(e){return o(this,void 0,void 0,(function(){var t,n,r,s,l,f,p,h=this;return i(this,(function(d){switch(d.label){case 0:return this._install(),t=c.flow.createUuid(),n=null,r={},[4,this.translator.compile(e)];case 1:for(p in s=d.sent(),l=[{role:"user",content:s.prompt}],f=function(e){r[e]={send:function(n){return h.plugins[e].send({id:t,data:n})}}},this.plugins)f(p);return[4,this.hook.notify("start",{id:t,data:e,plugins:r,messages:l,setPreMessages:function(e){l=u(u([],a(e),!1),[{role:"user",content:s.prompt}],!1)},changeMessages:function(e){l=e}})];case 2:return d.sent(),[4,c.flow.asyncWhile((function(r){var a=r.count,u=r.doBreak;return o(h,void 0,void 0,(function(){var r,o,s,c,f,p;return i(this,(function(i){switch(i.label){case 0:if(a>=10)return[2,u()];r="",o="",s=!1,c=(null===(p=l.filter((function(e){return"user"===e.role})).slice(-1)[0])||void 0===p?void 0:p.content)||"",i.label=1;case 1:return i.trys.push([1,8,,15]),[4,this.hook.notify("talkBefore",{id:t,data:e,messages:l,lastUserMessage:c})];case 2:return i.sent(),[4,this.params.request(l)];case 3:return r=i.sent(),o=r,[4,this.hook.notify("talkAfter",{id:t,data:e,response:r,messages:l,parseText:o,lastUserMessage:c,changeParseText:function(e){o=e}})];case 4:return i.sent(),[4,this.translator.parse(o)];case 5:return n=i.sent().output,[4,this.hook.notify("succeeded",{id:t,output:n})];case 6:return i.sent(),[4,this.hook.notify("done",{id:t})];case 7:return i.sent(),u(),[3,15];case 8:return(f=i.sent()).isParserError?[4,this.hook.notify("parseFailed",{id:t,error:f.error,count:a,response:r,messages:l,lastUserMessage:c,parserFails:f.parserFails,retry:function(){s=!0},changeMessages:function(e){l=e}})]:[3,12];case 9:return i.sent(),!1!==s?[3,11]:[4,this.hook.notify("done",{id:t})];case 10:throw i.sent(),f;case 11:return[3,14];case 12:return[4,this.hook.notify("done",{id:t})];case 13:throw i.sent(),f;case 14:return[3,15];case 15:return[2]}}))}))}))];case 3:return d.sent(),[2,n]}}))}))},e}();t.ChatBroker=f},15:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.TextParser=void 0;var a=i(n(959)),u=function(){function e(e){this.params=e}return e.JsonMessage=function(){var t=this;return new e({name:"JsonMessage",handler:function(e){return r(t,void 0,void 0,(function(){var t,n,r;return o(this,(function(o){try{return[2,JSON.parse(e)]}catch(o){return t=/{(?:[^{}]|(?:{[^{}]*}))*}/,n=(null===(r=e.match(t))||void 0===r?void 0:r[0])||"",[2,a.default.parse(n)]}return[2]}))}))}})},Object.defineProperty(e.prototype,"name",{get:function(){return this.params.name},enumerable:!1,configurable:!0}),e.prototype.read=function(e){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.params.handler(e)];case 1:return[2,t.sent()]}}))}))},e}();t.TextParser=u},241:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ChatBrokerPlugin=void 0;var r=n(470),o=function(){function e(e){this._event=new r.Event,this._params=e}return e.prototype.use=function(e){var t=this;return{instance:this,params:e,send:function(e){t._event.emit("receive",e)},receive:function(e){t._event.on("receive",e)},__receiveData:null}},e}();t.ChatBrokerPlugin=o},87:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0}),t.Translator=void 0;var a=n(293),u=function(){function e(e){this.params=e}return Object.defineProperty(e.prototype,"__schemeType",{get:function(){return null},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"__outputType",{get:function(){return null},enumerable:!1,configurable:!0}),e.prototype.compile=function(e){return r(this,void 0,void 0,(function(){var t,n;return o(this,(function(r){switch(r.label){case 0:return t=(0,a.validate)(e,this.params.input),[4,this.params.question(t)];case 1:return n=r.sent(),[2,{scheme:t,prompt:n}]}}))}))},e.prototype.parse=function(e){return r(this,void 0,void 0,(function(){var t,n,r,u,s,c,l,f,p,h;return o(this,(function(o){switch(o.label){case 0:t=void 0,n="",r=[],o.label=1;case 1:o.trys.push([1,8,9,10]),u=i(this.params.parsers),s=u.next(),o.label=2;case 2:if(s.done)return[3,7];c=s.value,o.label=3;case 3:return o.trys.push([3,5,,6]),[4,c.read(e)];case 4:return t=o.sent(),n=c.name,[3,6];case 5:return l=o.sent(),t=void 0,r.push({name:c.name,error:l}),[3,6];case 6:return s=u.next(),[3,2];case 7:return[3,10];case 8:return f=o.sent(),p={error:f},[3,10];case 9:try{s&&!s.done&&(h=u.return)&&h.call(u)}finally{if(p)throw p.error}return[7];case 10:try{return[2,{output:(0,a.validate)(t,this.params.output),parserName:n,parserFails:r}]}catch(e){throw{isParserError:!0,error:e,parserFails:r}}return[2]}}))}))},e}();t.Translator=u},620:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.ctod=t.templates=t.plugins=t.ChatBrokerPlugin=t.ChatBroker=t.Translator=t.TextParser=t.OpenAI=void 0;var a=i(n(218)),u=i(n(298)),s=i(n(87)),c=n(616),l=n(15),f=n(37),p=n(241);t.OpenAI=c.OpenAI,t.TextParser=l.TextParser,t.Translator=s.Translator,t.ChatBroker=f.ChatBroker,t.ChatBrokerPlugin=p.ChatBrokerPlugin,t.plugins=a,t.templates=u,t.ctod={OpenAI:t.OpenAI,plugins:t.plugins,templates:t.templates,ChatBroker:t.ChatBroker,Translator:t.Translator,TextParser:t.TextParser,ChatBrokerPlugin:t.ChatBrokerPlugin},e.exports=t.ctod,e.exports.ctod=t.ctod,t.default=t.ctod},218:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.RolePlugin=t.LimiterPluginGlobState=t.LimiterPlugin=t.RetryPlugin=t.PrintLogPlugin=void 0;var o=r(n(894)),i=r(n(829)),a=r(n(626)),u=r(n(1));t.PrintLogPlugin=i.default,t.RetryPlugin=o.default,t.LimiterPlugin=a.default.plugin,t.LimiterPluginGlobState=a.default,t.RolePlugin=u.default},626:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(241),a=n(470),u={limit:3,interval:6e4},s={event:new a.Event,schedule:null,waitTimes:[],waitQueue:[]};t.default={event:s.event,config:u,closeSchedule:function(){s.schedule&&(s.schedule.close(),s.schedule=null)},plugin:new i.ChatBrokerPlugin({name:"limiter",params:function(){return{}},receiveData:function(){return{}},onInstall:function(e){var t=this,n=e.attach;null==s.schedule&&(s.schedule=new a.Schedule,s.schedule.add("calc queue",1e3,(function(){return r(t,void 0,void 0,(function(){var e,t;return o(this,(function(n){return e=Date.now(),s.waitTimes=s.waitTimes.filter((function(t){return e-t<u.interval})),s.waitTimes.length!==u.limit?(t=s.waitQueue.shift())&&(s.waitTimes.push(Date.now()),s.event.emit("run",{id:t})):s.waitTimes[0]&&s.event.emit("waitTimeChange",{waitTime:Math.floor(60-(e-s.waitTimes[0])/1e3)}),[2]}))}))})),s.schedule.play()),n("talkBefore",(function(){return r(t,void 0,void 0,(function(){var e;return o(this,(function(t){return e=a.flow.createUuid(),s.waitQueue.push(e),[2,new Promise((function(t){s.event.on("run",(function(n,r){var o=n.id,i=r.off;o===e&&(i(),t())}))}))]}))}))}))}})}},829:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(241);t.default=new i.ChatBrokerPlugin({name:"print-log",params:function(e){return{detail:e.boolean().required().default(!1)}},receiveData:function(){return{}},onInstall:function(e){var t=this,n=e.params,i=e.log,a=e.attach;a("talkBefore",(function(e){var a=e.lastUserMessage,u=e.messages;return r(t,void 0,void 0,(function(){return o(this,(function(e){return i.print("Send:",{color:"green"}),n.detail?i.print("\n"+JSON.stringify(u,null,4)):i.print("\n"+a),[2]}))}))})),a("talkAfter",(function(e){var n=e.parseText;return r(t,void 0,void 0,(function(){return o(this,(function(e){return i.print("Receive:",{color:"cyan"}),i.print("\n"+n),[2]}))}))})),a("succeeded",(function(e){var n=e.output;return r(t,void 0,void 0,(function(){return o(this,(function(e){i.print("Output:",{color:"yellow"});try{i.print("\n"+JSON.stringify(n,null,4))}catch(e){i.print("\n"+n)}return[2]}))}))}))}})},894:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(241);t.default=new i.ChatBrokerPlugin({name:"retry",params:function(e){return{retry:e.number().required().default(1),printWarn:e.boolean().required().default(!0)}},receiveData:function(){return{}},onInstall:function(e){var t=this,n=e.log,i=e.attach,a=e.params;i("parseFailed",(function(e){var i=e.count,u=e.retry,s=e.response,c=e.changeMessages;return r(t,void 0,void 0,(function(){return o(this,(function(e){return i<=a.retry&&(a.printWarn&&n.print("Is Failed, Retry ".concat(i," times.")),c(s.newMessages.slice(0,-1)),u()),[2]}))}))}))}})},1:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},i=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(o)throw o.error}}return a},a=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0});var u=n(241);t.default=new u.ChatBrokerPlugin({name:"role",params:function(e){return{role:e.string().required()}},receiveData:function(){return{}},onInstall:function(e){var t=this,n=e.attach,u=e.params;n("start",(function(e){var n=e.messages,s=e.changeMessages;return r(t,void 0,void 0,(function(){return o(this,(function(e){return s(a([{role:"user",content:"你現在是".concat(u.role,"。")},{role:"assistant",content:"沒問題，我現在是".concat(u.role,"，有什麼可以幫你的嗎？")}],i(n),!1)),[2]}))}))}))}})},203:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},i=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(o)throw o.error}}return a},a=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAIChat=void 0;var u=n(470),s=function(){function e(e){this.config={n:1,model:"gpt-3.5-turbo",temperature:1,maxTokens:void 0,forceJsonFormat:!0},this.openai=e}return e.prototype.setConfig=function(e){Object.assign(this.config,e)},e.prototype.moderations=function(e){var t,n;return r(this,void 0,void 0,(function(){var r;return o(this,(function(o){switch(o.label){case 0:return[4,this.openai._axios.post("https://api.openai.com/v1/moderations",{input:e},{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(this.openai._apiKey)}})];case 1:return r=o.sent(),[2,{isSafe:!1===(null===(n=null===(t=r.data.results)||void 0===t?void 0:t[0])||void 0===n?void 0:n.flagged),result:r.data}]}}))}))},e.prototype.talk=function(e){var t,n;return void 0===e&&(e=[]),r(this,void 0,void 0,(function(){var r,i,a,s,c;return o(this,(function(o){switch(o.label){case 0:return r=u.json.jpjs(e),i=["gpt-4-1106-preview","gpt-3.5-turbo-1106"].includes(this.config.model),[4,this.openai._axios.post("https://api.openai.com/v1/chat/completions",{model:this.config.model,n:this.config.n,messages:r,response_format:!1===i||!1===this.config.forceJsonFormat?void 0:{type:"json_object"},temperature:this.config.temperature},{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(this.openai._apiKey)}})];case 1:return a=o.sent(),s=a.data.choices||[],c=(null===(t=s[0])||void 0===t?void 0:t.message)||{role:"assistant",content:""},r.push(c),[2,{id:null==a?void 0:a.data.id,text:c.content,newMessages:r,isDone:"stop"===(null===(n=s[0])||void 0===n?void 0:n.finish_reason),apiReseponse:a.data}]}}))}))},e.prototype.keepTalk=function(e,t){return void 0===t&&(t=[]),r(this,void 0,void 0,(function(){var n,r=this;return o(this,(function(o){switch(o.label){case 0:return[4,this.talk(a(a([],i(t),!1),[{role:"user",content:Array.isArray(e)?e.join("\n"):e}],!1))];case 1:return[2,{result:n=o.sent(),nextTalk:function(e){return r.keepTalk(e,n.newMessages)}}]}}))}))},e}();t.OpenAIChat=s},919:function(e,t){var n=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},r=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAICompletion=void 0;var o=function(){function e(e){this.config={n:1,maxTokens:2048,temperature:1},this.openai=e}return e.prototype.setConfig=function(e){Object.assign(this.config,e)},e.prototype.run=function(e){var t,o;return n(this,void 0,void 0,(function(){var n,i;return r(this,(function(r){switch(r.label){case 0:return[4,this.openai._axios.post("https://api.openai.com/v1/completions",{model:"text-davinci-003",n:this.config.n,prompt:Array.isArray(e)?e.join("\n"):e,max_tokens:this.config.maxTokens,temperature:this.config.temperature},{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(this.openai._apiKey)}})];case 1:return n=r.sent(),i=n.data.choices||[],[2,{id:n.data.id,text:(null===(t=i[0])||void 0===t?void 0:t.text)||"",isDone:"stop"===(null===(o=i[0])||void 0===o?void 0:o.finish_reason),apiReseponse:n.data}]}}))}))},e}();t.OpenAICompletion=o},725:function(e,t){var n=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},r=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAIImagesGeneration=void 0;var o=function(){function e(e){this.config={model:"dall-e-2",size:"1024x1024"},this.openai=e}return e.prototype.setConfig=function(e){Object.assign(this.config,e)},e.prototype.create=function(e){return n(this,void 0,void 0,(function(){return r(this,(function(t){switch(t.label){case 0:return[4,this.openai._axios.post("https://api.openai.com/v1/images/generations",{prompt:e,n:1,size:this.config.size,model:this.config.model,response_format:"b64_json"},{timeout:3e5,headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(this.openai._apiKey)}})];case 1:return[2,t.sent().data]}}))}))},e}();t.OpenAIImagesGeneration=o},616:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAI=void 0;var a=n(710),u=n(919),s=n(203),c=n(725),l=i(n(167)),f=function(){function e(e){void 0===e&&(e=""),this._axios=l.default.create(),this._apiKey="",this._apiKey=e}return e.createChatRequest=function(t,n){var i=this;return void 0===n&&(n={}),function(a){return r(i,void 0,void 0,(function(){var r,i;return o(this,(function(o){switch(o.label){case 0:return r=new e(t),(i=r.createChat()).setConfig(n),[4,i.talk(a)];case 1:return[2,o.sent().text]}}))}))}},e.prototype.setAxios=function(e){this._axios=e},e.prototype.setConfiguration=function(e){this._apiKey=e},e.prototype.createChat=function(){return new s.OpenAIChat(this)},e.prototype.createVision=function(){return new a.OpenAIVision(this)},e.prototype.createCompletion=function(){return new u.OpenAICompletion(this)},e.prototype.createImagesGeneration=function(){return new c.OpenAIImagesGeneration(this)},e}();t.OpenAI=f},710:function(e,t){var n=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},r=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAIVision=void 0;var o=function(){function e(e){this.config={model:"gpt-4-vision-preview",maxTokens:void 0,temperature:1},this.openai=e}return e.prototype.setConfig=function(e){Object.assign(this.config,e)},e.prototype.view=function(e){var t;return n(this,void 0,void 0,(function(){var n,o,i;return r(this,(function(r){switch(r.label){case 0:return[4,this.openai._axios.post("https://api.openai.com/v1/chat/completions",{model:this.config.model,n:1,messages:e,max_tokens:this.config.maxTokens,temperature:this.config.temperature},{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(this.openai._apiKey)}})];case 1:return n=r.sent(),o=n.data.choices||[],i=(null===(t=o[0])||void 0===t?void 0:t.message)||{role:"assistant",content:""},[2,{id:null==n?void 0:n.data.id,text:i.content,apiReseponse:n.data}]}}))}))},e}();t.OpenAIVision=o},298:function(e,t,n){var r=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(o)throw o.error}}return a},o=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.requireJsonResponseWithHandlebars=t.requireJsonResponse=void 0;var a=i(n(97)),u=n(470);t.requireJsonResponse=function(e,t){return o(o([],r(Array.isArray(e)?e:[e]),!1),["Please respond using the following JSON format and minify the JSON without including any explanation: ","{",Object.entries(t).map((function(e){var t=r(e,2),n=t[0],o=t[1];return["/* ".concat(o.desc," */"),'"'.concat(n,'": ').concat(JSON.stringify(o.example))].join("\n")})).join(",\n"),"}"],!1).join("\n")},t.requireJsonResponseWithHandlebars=function(e,n,r){var o=a.default.create();return o.registerHelper("DATA",(function(e){return JSON.stringify(e)})),o.registerHelper("ENV",(function(e){return this.__envs&&e?this.__envs[e]:""})),o.registerHelper("INPUT",(function(){return JSON.stringify(u.record.omit(this,["__envs"]))})),o.registerHelper("JOIN",(function(e){return Array.isArray(e)?e.join():JSON.stringify(e)})),o.compile((0,t.requireJsonResponse)(n,r))(e)}},293:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.validate=t.definedValidateSchema=void 0;var a=i(n(609));t.definedValidateSchema=function(e){return e},t.validate=function(e,t){return a.object(t(a)).required().validateSync(e||{})}},167:e=>{e.exports=require("axios")},97:e=>{e.exports=require("handlebars")},959:e=>{e.exports=require("json5")},470:e=>{e.exports=require("power-helper")},609:e=>{e.exports=require("yup")}},t={};return function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}(620)})()));