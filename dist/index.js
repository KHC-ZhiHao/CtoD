!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ctod=t():e.ctod=t()}(this||("undefined"!=typeof window?window:global),(()=>(()=>{"use strict";var e={177:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ChatBroker=void 0;const r=n(306),a=n(572),o=n(235),s=n(165);t.ChatBroker=class{__hookType;log;hook=new a.Hook;params;plugins={};installed=!1;translator;event=new a.Event;constructor(e){this.log=new a.Log(e.name??"no name"),this.params=e,this.translator=new o.Translator({...e,parsers:[r.TextParser.JsonMessage()]})}_install(){if(!1===this.installed){this.installed=!0;const e={log:this.log,attach:this.hook.attach.bind(this.hook),attachAfter:this.hook.attachAfter.bind(this.hook),translator:this.translator};if(this.params.plugins){this.plugins="function"==typeof this.params.plugins?this.params.plugins():this.params.plugins;for(let t in this.plugins)this.plugins[t].instance._params.onInstall({...e,params:this.plugins[t].params,receive:this.plugins[t].receive})}this.params.install?.(e)}}async cancel(e){e?this.event.emit("cancel",{requestId:e}):this.event.emit("cancelAll",{})}requestWithId(e){this._install();let t=a.flow.createUuid(),n=null,r=!1,o=!1,i=[this.event.on("cancel",(({requestId:e})=>{e===t&&c()})),this.event.on("cancelAll",(()=>{c()}))],l=()=>i.forEach((e=>e.off())),c=()=>{!1===r&&(o&&n&&n(),r=!0,l())},u=e=>{n=e},p=async()=>{let i=this.translator.getValidate(),l=null,c={},p=await this.translator.compile(e,{schema:i}),h=[{role:"user",content:p.prompt}];for(let e in this.plugins)c[e]={send:n=>this.plugins[e].send({id:t,data:n})};return await this.hook.notify("start",{id:t,data:e,schema:i,plugins:c,messages:h,setPreMessages:e=>{const t=e.map((e=>({...e,content:Array.isArray(e.content)?e.content.join("\n"):e.content})));h=[...t,{role:"user",content:p.prompt}]},changeMessages:e=>{h=e}}),await a.flow.asyncWhile((async({count:a,doBreak:c})=>{if(a>=10)return c();let p="",d="",f=!1,m=h.filter((e=>"user"===e.role)).slice(-1)[0]?.content||"";try{await this.hook.notify("talkBefore",{id:t,data:e,messages:h,lastUserMessage:m});const g=this.params.request(h,{count:a,schema:i,onCancel:u,isRetry:f});if(r)n&&n();else try{o=!0,p=await g,d=p}finally{o=!1}!1===r&&(await this.hook.notify("talkAfter",{id:t,data:e,response:p,messages:h,parseText:d,lastUserMessage:m,parseFail:e=>{throw new s.ParserError(e,[])},changeParseText:e=>{d=e}}),l=(await this.translator.parse(d)).output,await this.hook.notify("succeeded",{id:t,output:l})),await this.hook.notify("done",{id:t}),c()}catch(e){if(!(e instanceof s.ParserError))throw await this.hook.notify("done",{id:t}),e;if(await this.hook.notify("parseFailed",{id:t,error:e.error,count:a,response:p,messages:h,lastUserMessage:m,parserFails:e.parserFails,retry:()=>{f=!0},changeMessages:e=>{h=e}}),!1===f)throw await this.hook.notify("done",{id:t}),e}})),l};return{id:t,request:(async()=>{try{return await p()}finally{l()}})()}}async request(e){const{request:t}=this.requestWithId(e);return await t}}},306:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.TextParser=void 0;const a=r(n(865));class o{params;static JsonMessage(){return new o({name:"JsonMessage",handler:async e=>{try{return JSON.parse(e)}catch(t){const n=/{(?:[^{}]|(?:{[^{}]*}))*}/,r=e.match(n)?.[0]||"";return a.default.parse(r)}}})}constructor(e){this.params=e}get name(){return this.params.name}async read(e){return await this.params.handler(e)}}t.TextParser=o},198:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ChatBrokerPlugin=void 0;const r=n(572);t.ChatBrokerPlugin=class{_event=new r.Event;_params;constructor(e){this._params=e}use(e){return{instance:this,params:e,send:e=>{this._event.emit("receive",e)},receive:e=>{this._event.on("receive",e)},__receiveData:null}}}},235:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Translator=void 0;const r=n(357),a=n(165);t.Translator=class{params;constructor(e){this.params=e}get __schemeType(){return null}get __outputType(){return null}async compile(e,t){const n=(0,r.validate)(e,this.params.input),a=await this.params.question(n,t);return{scheme:n,prompt:Array.isArray(a)?a.join("\n"):a}}getValidate(){return{input:this.params.input,output:this.params.output}}async parse(e){let t,n="",o=[];for(let r of this.params.parsers)try{t=await r.read(e),n=r.name}catch(e){t=void 0,o.push({name:r.name,error:e})}try{return{output:(0,r.validate)(t,this.params.output),parserName:n,parserFails:o}}catch(e){throw new a.ParserError(e,o)}}}},665:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var a=Object.getOwnPropertyDescriptor(t,n);a&&!("get"in a?!t.__esModule:a.writable||a.configurable)||(a={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,a)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),a=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return a(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.ctod=t.Translator=t.ChatBrokerPlugin=t.ChatBroker=t.TextParser=t.Llama3Cpp=t.OpenAI=t.defineYupSchema=t.validateToJsonSchema=t.templates=t.plugins=void 0,t.plugins=o(n(374)),t.templates=o(n(854));var s=n(357);Object.defineProperty(t,"validateToJsonSchema",{enumerable:!0,get:function(){return s.validateToJsonSchema}}),Object.defineProperty(t,"defineYupSchema",{enumerable:!0,get:function(){return s.defineYupSchema}});var i=n(984);Object.defineProperty(t,"OpenAI",{enumerable:!0,get:function(){return i.OpenAI}});var l=n(887);Object.defineProperty(t,"Llama3Cpp",{enumerable:!0,get:function(){return l.Llama3Cpp}});var c=n(306);Object.defineProperty(t,"TextParser",{enumerable:!0,get:function(){return c.TextParser}});var u=n(177);Object.defineProperty(t,"ChatBroker",{enumerable:!0,get:function(){return u.ChatBroker}});var p=n(198);Object.defineProperty(t,"ChatBrokerPlugin",{enumerable:!0,get:function(){return p.ChatBrokerPlugin}});var h=n(235);Object.defineProperty(t,"Translator",{enumerable:!0,get:function(){return h.Translator}});const d=o(n(374)),f=o(n(854)),m=n(984),g=n(887),y=n(235),_=n(306),v=n(177),b=n(198),w=n(357);t.ctod={OpenAI:m.OpenAI,Llama3Cpp:g.Llama3Cpp,plugins:d,templates:f,ChatBroker:v.ChatBroker,Translator:y.Translator,TextParser:_.TextParser,ChatBrokerPlugin:b.ChatBrokerPlugin,defineYupSchema:w.defineYupSchema,validateToJsonSchema:w.validateToJsonSchema},e.exports=t.ctod,e.exports.ctod=t.ctod,t.default=t.ctod},374:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.RolePlugin=t.LimiterPluginGlobState=t.LimiterPlugin=t.RetryPlugin=t.PrintLogPlugin=void 0;const a=r(n(92)),o=r(n(354)),s=r(n(270)),i=r(n(724));t.PrintLogPlugin=o.default,t.RetryPlugin=a.default,t.LimiterPlugin=s.default.plugin,t.LimiterPluginGlobState=s.default,t.RolePlugin=i.default},270:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const r=n(198),a=n(572),o={limit:3,interval:6e4},s={event:new a.Event,schedule:null,waitTimes:[],waitQueue:[]};t.default={event:s.event,config:o,closeSchedule:()=>{s.schedule&&(s.schedule.close(),s.schedule=null)},plugin:new r.ChatBrokerPlugin({name:"limiter",params:()=>({}),receiveData:()=>({}),onInstall({attach:e}){null==s.schedule&&(s.schedule=new a.Schedule,s.schedule.add("calc queue",1e3,(async()=>{const e=Date.now();if(s.waitTimes=s.waitTimes.filter((t=>e-t<o.interval)),s.waitTimes.length!==o.limit){let e=s.waitQueue.shift();e&&(s.waitTimes.push(Date.now()),s.event.emit("run",{id:e}))}else s.waitTimes[0]&&s.event.emit("waitTimeChange",{waitTime:Math.floor(60-(e-s.waitTimes[0])/1e3)})})),s.schedule.play()),e("talkBefore",(async()=>{const e=a.flow.createUuid();return s.waitQueue.push(e),new Promise((t=>{s.event.on("run",(({id:n},{off:r})=>{n===e&&(r(),t())}))}))}))}})}},354:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const r=n(198);t.default=new r.ChatBrokerPlugin({name:"print-log",params:e=>({detail:e.boolean().default(!1)}),receiveData:()=>({}),onInstall({params:e,log:t,attach:n}){n("talkBefore",(async({lastUserMessage:n,messages:r})=>{t.print("Send:",{color:"green"}),e.detail?t.print("\n"+JSON.stringify(r,null,4)):t.print("\n"+n)})),n("talkAfter",(async({parseText:e})=>{t.print("Receive:",{color:"cyan"}),t.print("\n"+e)})),n("succeeded",(async({output:e})=>{t.print("Output:",{color:"yellow"});try{t.print("\n"+JSON.stringify(e,null,4))}catch(n){t.print("\n"+e)}}))}})},92:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const r=n(198);t.default=new r.ChatBrokerPlugin({name:"retry",params:e=>({retry:e.number().required().default(1),printWarn:e.boolean().required().default(!0)}),receiveData:()=>({}),onInstall({log:e,attach:t,params:n}){t("parseFailed",(async({count:t,retry:r,messages:a,changeMessages:o})=>{t<=n.retry&&(n.printWarn&&e.print(`Is Failed, Retry ${t} times.`),o(a),r())}))}})},724:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const r=n(198);t.default=new r.ChatBrokerPlugin({name:"role",params:e=>({role:e.string().required()}),receiveData:()=>({}),onInstall({attach:e,params:t}){e("start",(async({messages:e,changeMessages:n})=>{n([{role:"user",content:`你現在是${t.role}。`},{role:"assistant",content:`沒問題，我現在是${t.role}，有什麼可以幫你的嗎？`},...e])}))}})},129:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Llama3CppCompletion=void 0;const r=n(572),a=n(4);class o{core;streamAbortControllers=[];constructor(e){this.core=e}createAbortController(){const e=new AbortController,t=r.flow.createUuid();return this.streamAbortControllers.push({id:t,controller:e}),{signal:e.signal,controllerId:t}}removeAbortController(e){this.streamAbortControllers=this.streamAbortControllers.filter((t=>t.id!==e))}async stream(e){const{signal:t,controllerId:n}=this.createAbortController(),r=()=>{this.removeAbortController(n),e.onEnd()};fetch(`${this.core.config.baseUrl}/${e.path}`,{method:"POST",body:JSON.stringify(e.data),signal:t,headers:{"Content-Type":"application/json",...this.core.config.headers}}).then((async t=>{if(t.body){let n=t.body.getReader(),a=!1,o="";for(;!a;){const{value:t,done:r}=await n.read();if(t){o+=new TextDecoder("utf-8").decode(t);const n=o.split("\n\n");o=n.pop()||"",n.forEach((t=>{if(t.includes("[DONE]")&&(a=!0),t.startsWith("data:"))try{const n=JSON.parse(t.replace("data: ",""));e.onMessage(n)}catch(t){e.onWarn(t)}}))}r&&(a=!0)}r()}else e.onError(new Error("Body not found."))})).catch((t=>{t instanceof Error&&t.message.includes("The user aborted a request")?r():e.onError(t)}))}async fetch(e){const{signal:t,controllerId:n}=this.createAbortController();try{return{data:(await this.core.core._axios.post(`${this.core.config.baseUrl}/${e.path}`,e.data,{signal:t,headers:{"Content-Type":"application/json",...this.core.config.headers}})).data}}finally{this.removeAbortController(n)}}cancel(){this.streamAbortControllers.forEach((e=>e.controller.abort())),this.streamAbortControllers=[]}export(){return{cancel:this.cancel.bind(this)}}}t.Llama3CppCompletion=class{core;config={baseUrl:"",headers:{},autoConvertTraditionalChinese:!0};constructor(e){this.core=e}setConfig(e){this.config={...this.config,...e}}completion(e){const t=[];for(let{role:n,content:r}of e.messages)"system"===n&&t.push(`<|start_header_id|>system<|end_header_id|>\n\n${r}\n\n`),"user"===n&&t.push(`<|start_header_id|>user<|end_header_id|>\n\n${r?.replaceAll("\n","\\n")??""}`),"assistant"===n&&t.push("<|start_header_id|>assistant<|end_header_id|>\n\n"+r);const n=e.messages.at(-1)||"",r=new o(this);return{...r.export(),run:async()=>{const o=await r.fetch({path:"completion",data:{...e.options||{},prompt:this.config.autoConvertTraditionalChinese?(0,a.sify)(t.join("\n")):t.join("\n")}}),s=this.config.autoConvertTraditionalChinese?(0,a.tify)(o.data.content):o.data.content;return{message:s,fullMessage:`${n}${s}`}}}}completionStream(e){const t=[];for(let{role:n,content:r}of e.messages)"system"===n&&t.push(`<|start_header_id|>system<|end_header_id|>\n\n${r}\n\n`),"user"===n&&t.push(`<|start_header_id|>user<|end_header_id|>\n\n${r?.replaceAll("\n","\\n")??""}`),"assistant"===n&&t.push("<|start_header_id|>assistant<|end_header_id|>\n\n"+r);const n=new o(this);return n.stream({path:"completion",onEnd:e.onEnd||(()=>null),onMessage:t=>{e.onMessage({message:this.config.autoConvertTraditionalChinese?(0,a.tify)(t.content):t.content})},onWarn:e.onWarn||(()=>null),onError:e.onError||(()=>null),data:{...e.options||{},prompt:this.config.autoConvertTraditionalChinese?(0,a.sify)(t.join("\n")):t.join("\n"),stream:!0}}),n.export()}talk(e){const t=new o(this);return{...t.export(),run:async()=>{const n=(await t.fetch({path:"v1/chat/completions",data:{...e.options||{},response_format:e.response_format,messages:e.messages.map((e=>({role:e.role,content:this.config.autoConvertTraditionalChinese?(0,a.sify)(e.content):e.content})))}})).data.choices[0].message.content||"";return{message:this.config.autoConvertTraditionalChinese?(0,a.tify)(n):n}}}}talkStream(e){const t=new o(this);return t.stream({path:"v1/chat/completions",onEnd:e.onEnd||(()=>null),onMessage:t=>{let n=t.choices[0].delta.content;n&&e.onMessage({message:this.config.autoConvertTraditionalChinese?(0,a.tify)(n):n})},onWarn:e.onWarn||(()=>null),onError:e.onError||(()=>null),data:{...e.options||{},stream:!0,messages:e.messages.map((e=>({role:e.role,content:this.config.autoConvertTraditionalChinese?(0,a.sify)(e.content):e.content})))}}),t.export()}}},887:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.Llama3Cpp=void 0;const a=r(n(938)),o=n(4),s=n(357),i=n(129);class l{_axios=a.default.create();static createChatRequest(e){return async(t,{schema:n,onCancel:r})=>{const a=(new l).createCompletion(),i="function"==typeof e.config?await e.config():e.config;a.setConfig(i);let c=(0,s.validateToJsonSchema)(n.output);a.config.autoConvertTraditionalChinese&&(c=JSON.parse((0,o.sify)(JSON.stringify(c))));const{run:u,cancel:p}=a.talk({options:e.talkOptions,messages:t,response_format:{type:"json_object",schema:c}});r(p);const{message:h}=await u();return h}}setAxios(e){this._axios=e}createCompletion(){return new i.Llama3CppCompletion(this)}}t.Llama3Cpp=l},228:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAIChat=void 0;const r=n(572);t.OpenAIChat=class{openai;config={n:1,model:"gpt-4o",temperature:1,maxTokens:void 0,forceJsonFormat:!0};constructor(e){this.openai=e}setConfig(e){Object.assign(this.config,e)}async moderations(e){const t=await this.openai._axios.post("https://api.openai.com/v1/moderations",{input:e},{headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.openai._apiKey}`}});return{isSafe:!1===t.data.results?.[0]?.flagged,result:t.data}}async talk(e=[],t){const n=r.json.jpjs(e),a=["gpt-4-turbo-preview","gpt-4-turbo","gpt-4o","gpt-4o-mini","gpt-3.5-turbo-1106"].includes(this.config.model);let o;a&&this.config.forceJsonFormat&&(o={type:"json_object"}),a&&this.config.forceJsonFormat&&t?.jsonSchema&&(o={type:"json_schema",json_schema:t.jsonSchema});const s=await this.openai._axios.post("https://api.openai.com/v1/chat/completions",{model:this.config.model,n:this.config.n,messages:n,response_format:o,temperature:this.config.temperature},{signal:t?.abortController?.signal,headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.openai._apiKey}`}}),i=s.data.choices||[],l=i[0]?.message||{role:"assistant",content:""};return n.push(l),{id:s?.data.id,text:l.content,newMessages:n,isDone:"stop"===i[0]?.finish_reason,apiReseponse:s.data}}talkStream(e){const t=new AbortController;return fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.openai._apiKey}`},body:JSON.stringify({model:this.config.model,stream:!0,messages:e.messages}),signal:t.signal}).then((async t=>{const n=t.body?.pipeThrough(new TextDecoderStream).getReader();if(!n)throw new Error("Can not get reader");for(;;){const{value:t,done:r}=await n.read();if(r)break;const a=t.split("\n");for(let t of a)if(0!==t.length&&!t.startsWith(":")){if("data: [DONE]"===t){e.onEnd();break}try{const n=JSON.parse(t.substring(6)).choices[0].delta.content;e.onMessage(n)}catch(t){e.onWarn(t)}}}})).catch((t=>{"AbortError"===t.name?e.onEnd():e.onError(t)})),{cancel:()=>t.abort()}}async keepTalk(e,t=[]){const n=await this.talk([...t,{role:"user",content:Array.isArray(e)?e.join("\n"):e}]);return{result:n,nextTalk:e=>this.keepTalk(e,n.newMessages)}}}},11:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAIImagesGeneration=void 0,t.OpenAIImagesGeneration=class{openai;config={model:"dall-e-2",size:"1024x1024"};constructor(e){this.openai=e}setConfig(e){Object.assign(this.config,e)}async create(e){return(await this.openai._axios.post("https://api.openai.com/v1/images/generations",{prompt:e,n:1,size:this.config.size,model:this.config.model,response_format:"b64_json"},{timeout:3e5,headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.openai._apiKey}`}})).data}}},984:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAI=void 0;const a=r(n(938)),o=n(38),s=n(228),i=n(11),l=n(357);class c{_axios=a.default.create();_apiKey="";static createChatRequest(e,t={},n){return async(r,{onCancel:a})=>{const o=new c("string"==typeof e?e:await e()),s=o.createChat(),i=new AbortController;n&&n.axios&&o.setAxios(n.axios),s.setConfig("function"==typeof t?await t():t),a((()=>i.abort()));const{text:l}=await s.talk(r,{abortController:i});return l}}static createChatRequestWithJsonSchema(e){return async(t,{schema:n,onCancel:r})=>{const a=new c("string"==typeof e.apiKey?e.apiKey:await e.apiKey()),o=a.createChat(),s=new AbortController;e.config&&o.setConfig("function"==typeof e.config?await e.config():e.config),e.axios&&a.setAxios(e.axios),r((()=>s.abort()));const i=(0,l.validateToJsonSchema)(n.output),{text:u}=await o.talk(t,{abortController:s,jsonSchema:{name:"data",strict:!0,schema:i}});return u}}constructor(e=""){this._apiKey=e}setAxios(e){this._axios=e}setConfiguration(e){this._apiKey=e}createChat(){return new s.OpenAIChat(this)}createVision(){return new o.OpenAIVision(this)}createImagesGeneration(){return new i.OpenAIImagesGeneration(this)}}t.OpenAI=c},38:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OpenAIVision=void 0,t.OpenAIVision=class{openai;config={model:"gpt-4-vision-preview",maxTokens:void 0,temperature:1};constructor(e){this.openai=e}setConfig(e){Object.assign(this.config,e)}async view(e){const t=await this.openai._axios.post("https://api.openai.com/v1/chat/completions",{model:this.config.model,n:1,messages:e,max_tokens:this.config.maxTokens,temperature:this.config.temperature},{headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.openai._apiKey}`}}),n=t.data.choices||[],r=n[0]?.message||{role:"assistant",content:""};return{id:t?.data.id,text:r.content,apiReseponse:t.data}}}},854:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.requireJsonResponseWithJsonSchema=t.requireJsonResponseWithHandlebars=t.requireJsonResponse=void 0;const a=r(n(156)),o=n(572);t.requireJsonResponse=(e,t)=>[...Array.isArray(e)?e:[e],"Please respond using the following JSON format and minify the JSON without including any explanation: ","{",Object.entries(t).map((([e,t])=>[`/* ${t.desc} */`,`"${e}": ${JSON.stringify(t.example)}`].join("\n"))).join(",\n"),"}"].join("\n"),t.requireJsonResponseWithHandlebars=(e,n,r)=>{const s=a.default.create();return s.registerHelper("DATA",(function(e){return JSON.stringify(e)})),s.registerHelper("ENV",(function(e){return this.__envs&&e?this.__envs[e]:""})),s.registerHelper("INPUT",(function(){return JSON.stringify(o.record.omit(this,["__envs"]))})),s.registerHelper("JOIN",(function(e){return Array.isArray(e)?e.join():JSON.stringify(e)})),s.compile((0,t.requireJsonResponse)(n,r))(e)},t.requireJsonResponseWithJsonSchema=(e,t)=>[...Array.isArray(e)?e:[e],"Please provide JSON data according to the following JSON Schema format:",JSON.stringify(t)].join("\n")},165:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ParserError=void 0,t.ParserError=class{isParserError=!0;parserFails=[];error;constructor(e,t){this.error=e,this.parserFails=t}}},357:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var a=Object.getOwnPropertyDescriptor(t,n);a&&!("get"in a?!t.__esModule:a.writable||a.configurable)||(a={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,a)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),a=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return a(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.validateToJsonSchema=t.defineYupSchema=t.validate=t.definedValidateSchema=void 0;const s=o(n(622)),i=n(250);t.definedValidateSchema=function(e){return e},t.validate=function(e,t){return s.object(t(s)).required().validateSync(e||{})},t.defineYupSchema=e=>e(s),t.validateToJsonSchema=e=>{const t=e=>{if(e.default&&delete e.default,e.properties)for(let n in e.properties)e.properties[n].default&&delete e.properties[n].default,t(e.properties[n]);e.items&&t(e.items)},n=e=>{if("object"===e.type){e.additionalProperties=!1;for(const t in e.properties)n(e.properties[t])}else"array"===e.type&&n(e.items)},r=(0,i.convertSchema)(s.object(e(s)));return t(r),n(r),r}},250:e=>{e.exports=require("@sodaru/yup-to-json-schema")},938:e=>{e.exports=require("axios")},4:e=>{e.exports=require("chinese-conv")},156:e=>{e.exports=require("handlebars")},865:e=>{e.exports=require("json5")},572:e=>{e.exports=require("power-helper")},622:e=>{e.exports=require("yup")}},t={};return function n(r){var a=t[r];if(void 0!==a)return a.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}(665)})()));