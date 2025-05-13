import{g as se,s as ie}from"./chunk-RZ5BOZE2-B77DZ1FS.js";import{_ as u,l as b,c as C,r as re,u as ae,Q as ne,j as V,y as le,a as oe,b as ce,g as he,s as ue,p as de,q as fe}from"./mermaid.core-DXMC9S04.js";var mt=function(){var t=u(function(w,l,c,a){for(c=c||{},a=w.length;a--;c[w[a]]=l);return c},"o"),e=[1,2],o=[1,3],r=[1,4],d=[2,4],i=[1,9],p=[1,11],g=[1,16],n=[1,17],T=[1,18],m=[1,19],R=[1,32],A=[1,20],f=[1,21],x=[1,22],L=[1,23],P=[1,24],B=[1,26],O=[1,27],N=[1,28],q=[1,29],Q=[1,30],Z=[1,31],tt=[1,34],et=[1,35],st=[1,36],it=[1,37],j=[1,33],S=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],rt=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],Ct=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],ft={trace:u(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,classDef:38,CLASSDEF_ID:39,CLASSDEF_STYLEOPTS:40,DEFAULT:41,style:42,STYLE_IDS:43,STYLEDEF_STYLEOPTS:44,class:45,CLASSENTITY_IDS:46,STYLECLASS:47,direction_tb:48,direction_bt:49,direction_rl:50,direction_lr:51,eol:52,";":53,EDGE_STATE:54,STYLE_SEPARATOR:55,left_of:56,right_of:57,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"classDef",39:"CLASSDEF_ID",40:"CLASSDEF_STYLEOPTS",41:"DEFAULT",42:"style",43:"STYLE_IDS",44:"STYLEDEF_STYLEOPTS",45:"class",46:"CLASSENTITY_IDS",47:"STYLECLASS",48:"direction_tb",49:"direction_bt",50:"direction_rl",51:"direction_lr",53:";",54:"EDGE_STATE",55:"STYLE_SEPARATOR",56:"left_of",57:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[52,1],[52,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:u(function(l,c,a,y,_,s,H){var h=s.length-1;switch(_){case 3:return y.setRootDoc(s[h]),s[h];case 4:this.$=[];break;case 5:s[h]!="nl"&&(s[h-1].push(s[h]),this.$=s[h-1]);break;case 6:case 7:this.$=s[h];break;case 8:this.$="nl";break;case 12:this.$=s[h];break;case 13:const z=s[h-1];z.description=y.trimColon(s[h]),this.$=z;break;case 14:this.$={stmt:"relation",state1:s[h-2],state2:s[h]};break;case 15:const pt=y.trimColon(s[h]);this.$={stmt:"relation",state1:s[h-3],state2:s[h-1],description:pt};break;case 19:this.$={stmt:"state",id:s[h-3],type:"default",description:"",doc:s[h-1]};break;case 20:var G=s[h],M=s[h-2].trim();if(s[h].match(":")){var nt=s[h].split(":");G=nt[0],M=[M,nt[1]]}this.$={stmt:"state",id:G,type:"default",description:M};break;case 21:this.$={stmt:"state",id:s[h-3],type:"default",description:s[h-5],doc:s[h-1]};break;case 22:this.$={stmt:"state",id:s[h],type:"fork"};break;case 23:this.$={stmt:"state",id:s[h],type:"join"};break;case 24:this.$={stmt:"state",id:s[h],type:"choice"};break;case 25:this.$={stmt:"state",id:y.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:s[h-1].trim(),note:{position:s[h-2].trim(),text:s[h].trim()}};break;case 29:this.$=s[h].trim(),y.setAccTitle(this.$);break;case 30:case 31:this.$=s[h].trim(),y.setAccDescription(this.$);break;case 32:case 33:this.$={stmt:"classDef",id:s[h-1].trim(),classes:s[h].trim()};break;case 34:this.$={stmt:"style",id:s[h-1].trim(),styleClass:s[h].trim()};break;case 35:this.$={stmt:"applyClass",id:s[h-1].trim(),styleClass:s[h].trim()};break;case 36:y.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 37:y.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 38:y.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 39:y.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 42:case 43:this.$={stmt:"state",id:s[h].trim(),type:"default",description:""};break;case 44:this.$={stmt:"state",id:s[h-2].trim(),classes:[s[h].trim()],type:"default",description:""};break;case 45:this.$={stmt:"state",id:s[h-2].trim(),classes:[s[h].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:e,5:o,6:r},{1:[3]},{3:5,4:e,5:o,6:r},{3:6,4:e,5:o,6:r},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],d,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:i,5:p,8:8,9:10,10:12,11:13,12:14,13:15,16:g,17:n,19:T,22:m,24:R,25:A,26:f,27:x,28:L,29:P,32:25,33:B,35:O,37:N,38:q,42:Q,45:Z,48:tt,49:et,50:st,51:it,54:j},t(S,[2,5]),{9:38,10:12,11:13,12:14,13:15,16:g,17:n,19:T,22:m,24:R,25:A,26:f,27:x,28:L,29:P,32:25,33:B,35:O,37:N,38:q,42:Q,45:Z,48:tt,49:et,50:st,51:it,54:j},t(S,[2,7]),t(S,[2,8]),t(S,[2,9]),t(S,[2,10]),t(S,[2,11]),t(S,[2,12],{14:[1,39],15:[1,40]}),t(S,[2,16]),{18:[1,41]},t(S,[2,18],{20:[1,42]}),{23:[1,43]},t(S,[2,22]),t(S,[2,23]),t(S,[2,24]),t(S,[2,25]),{30:44,31:[1,45],56:[1,46],57:[1,47]},t(S,[2,28]),{34:[1,48]},{36:[1,49]},t(S,[2,31]),{39:[1,50],41:[1,51]},{43:[1,52]},{46:[1,53]},t(rt,[2,42],{55:[1,54]}),t(rt,[2,43],{55:[1,55]}),t(S,[2,36]),t(S,[2,37]),t(S,[2,38]),t(S,[2,39]),t(S,[2,6]),t(S,[2,13]),{13:56,24:R,54:j},t(S,[2,17]),t(Ct,d,{7:57}),{24:[1,58]},{24:[1,59]},{23:[1,60]},{24:[2,46]},{24:[2,47]},t(S,[2,29]),t(S,[2,30]),{40:[1,61]},{40:[1,62]},{44:[1,63]},{47:[1,64]},{24:[1,65]},{24:[1,66]},t(S,[2,14],{14:[1,67]}),{4:i,5:p,8:8,9:10,10:12,11:13,12:14,13:15,16:g,17:n,19:T,21:[1,68],22:m,24:R,25:A,26:f,27:x,28:L,29:P,32:25,33:B,35:O,37:N,38:q,42:Q,45:Z,48:tt,49:et,50:st,51:it,54:j},t(S,[2,20],{20:[1,69]}),{31:[1,70]},{24:[1,71]},t(S,[2,32]),t(S,[2,33]),t(S,[2,34]),t(S,[2,35]),t(rt,[2,44]),t(rt,[2,45]),t(S,[2,15]),t(S,[2,19]),t(Ct,d,{7:72}),t(S,[2,26]),t(S,[2,27]),{4:i,5:p,8:8,9:10,10:12,11:13,12:14,13:15,16:g,17:n,19:T,21:[1,73],22:m,24:R,25:A,26:f,27:x,28:L,29:P,32:25,33:B,35:O,37:N,38:q,42:Q,45:Z,48:tt,49:et,50:st,51:it,54:j},t(S,[2,21])],defaultActions:{5:[2,1],6:[2,2],46:[2,46],47:[2,47]},parseError:u(function(l,c){if(c.recoverable)this.trace(l);else{var a=new Error(l);throw a.hash=c,a}},"parseError"),parse:u(function(l){var c=this,a=[0],y=[],_=[null],s=[],H=this.table,h="",G=0,M=0,nt=2,z=1,pt=s.slice.call(arguments,1),E=Object.create(this.lexer),Y={yy:{}};for(var St in this.yy)Object.prototype.hasOwnProperty.call(this.yy,St)&&(Y.yy[St]=this.yy[St]);E.setInput(l,Y.yy),Y.yy.lexer=E,Y.yy.parser=this,typeof E.yylloc>"u"&&(E.yylloc={});var yt=E.yylloc;s.push(yt);var te=E.options&&E.options.ranges;typeof Y.yy.parseError=="function"?this.parseError=Y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ee(v){a.length=a.length-2*v,_.length=_.length-v,s.length=s.length-v}u(ee,"popStack");function xt(){var v;return v=y.pop()||E.lex()||z,typeof v!="number"&&(v instanceof Array&&(y=v,v=y.pop()),v=c.symbols_[v]||v),v}u(xt,"lex");for(var D,F,k,gt,U={},lt,I,At,ot;;){if(F=a[a.length-1],this.defaultActions[F]?k=this.defaultActions[F]:((D===null||typeof D>"u")&&(D=xt()),k=H[F]&&H[F][D]),typeof k>"u"||!k.length||!k[0]){var Tt="";ot=[];for(lt in H[F])this.terminals_[lt]&&lt>nt&&ot.push("'"+this.terminals_[lt]+"'");E.showPosition?Tt="Parse error on line "+(G+1)+`:
`+E.showPosition()+`
Expecting `+ot.join(", ")+", got '"+(this.terminals_[D]||D)+"'":Tt="Parse error on line "+(G+1)+": Unexpected "+(D==z?"end of input":"'"+(this.terminals_[D]||D)+"'"),this.parseError(Tt,{text:E.match,token:this.terminals_[D]||D,line:E.yylineno,loc:yt,expected:ot})}if(k[0]instanceof Array&&k.length>1)throw new Error("Parse Error: multiple actions possible at state: "+F+", token: "+D);switch(k[0]){case 1:a.push(D),_.push(E.yytext),s.push(E.yylloc),a.push(k[1]),D=null,M=E.yyleng,h=E.yytext,G=E.yylineno,yt=E.yylloc;break;case 2:if(I=this.productions_[k[1]][1],U.$=_[_.length-I],U._$={first_line:s[s.length-(I||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(I||1)].first_column,last_column:s[s.length-1].last_column},te&&(U._$.range=[s[s.length-(I||1)].range[0],s[s.length-1].range[1]]),gt=this.performAction.apply(U,[h,M,G,Y.yy,k[1],_,s].concat(pt)),typeof gt<"u")return gt;I&&(a=a.slice(0,-1*I*2),_=_.slice(0,-1*I),s=s.slice(0,-1*I)),a.push(this.productions_[k[1]][0]),_.push(U.$),s.push(U._$),At=H[a[a.length-2]][a[a.length-1]],a.push(At);break;case 3:return!0}}return!0},"parse")},Zt=function(){var w={EOF:1,parseError:u(function(c,a){if(this.yy.parser)this.yy.parser.parseError(c,a);else throw new Error(c)},"parseError"),setInput:u(function(l,c){return this.yy=c||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:u(function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var c=l.match(/(?:\r\n?|\n).*/g);return c?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},"input"),unput:u(function(l){var c=l.length,a=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-c),this.offset-=c;var y=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),a.length-1&&(this.yylineno-=a.length-1);var _=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:a?(a.length===y.length?this.yylloc.first_column:0)+y[y.length-a.length].length-a[0].length:this.yylloc.first_column-c},this.options.ranges&&(this.yylloc.range=[_[0],_[0]+this.yyleng-c]),this.yyleng=this.yytext.length,this},"unput"),more:u(function(){return this._more=!0,this},"more"),reject:u(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:u(function(l){this.unput(this.match.slice(l))},"less"),pastInput:u(function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:u(function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:u(function(){var l=this.pastInput(),c=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+c+"^"},"showPosition"),test_match:u(function(l,c){var a,y,_;if(this.options.backtrack_lexer&&(_={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(_.yylloc.range=this.yylloc.range.slice(0))),y=l[0].match(/(?:\r\n?|\n).*/g),y&&(this.yylineno+=y.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:y?y[y.length-1].length-y[y.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],a=this.performAction.call(this,this.yy,this,c,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),a)return a;if(this._backtrack){for(var s in _)this[s]=_[s];return!1}return!1},"test_match"),next:u(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,c,a,y;this._more||(this.yytext="",this.match="");for(var _=this._currentRules(),s=0;s<_.length;s++)if(a=this._input.match(this.rules[_[s]]),a&&(!c||a[0].length>c[0].length)){if(c=a,y=s,this.options.backtrack_lexer){if(l=this.test_match(a,_[s]),l!==!1)return l;if(this._backtrack){c=!1;continue}else return!1}else if(!this.options.flex)break}return c?(l=this.test_match(c,_[y]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:u(function(){var c=this.next();return c||this.lex()},"lex"),begin:u(function(c){this.conditionStack.push(c)},"begin"),popState:u(function(){var c=this.conditionStack.length-1;return c>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:u(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:u(function(c){return c=this.conditionStack.length-1-Math.abs(c||0),c>=0?this.conditionStack[c]:"INITIAL"},"topState"),pushState:u(function(c){this.begin(c)},"pushState"),stateStackSize:u(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:u(function(c,a,y,_){switch(y){case 0:return 41;case 1:return 48;case 2:return 49;case 3:return 50;case 4:return 51;case 5:break;case 6:break;case 7:return 5;case 8:break;case 9:break;case 10:break;case 11:break;case 12:return this.pushState("SCALE"),17;case 13:return 18;case 14:this.popState();break;case 15:return this.begin("acc_title"),33;case 16:return this.popState(),"acc_title_value";case 17:return this.begin("acc_descr"),35;case 18:return this.popState(),"acc_descr_value";case 19:this.begin("acc_descr_multiline");break;case 20:this.popState();break;case 21:return"acc_descr_multiline_value";case 22:return this.pushState("CLASSDEF"),38;case 23:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 24:return this.popState(),this.pushState("CLASSDEFID"),39;case 25:return this.popState(),40;case 26:return this.pushState("CLASS"),45;case 27:return this.popState(),this.pushState("CLASS_STYLE"),46;case 28:return this.popState(),47;case 29:return this.pushState("STYLE"),42;case 30:return this.popState(),this.pushState("STYLEDEF_STYLES"),43;case 31:return this.popState(),44;case 32:return this.pushState("SCALE"),17;case 33:return 18;case 34:this.popState();break;case 35:this.pushState("STATE");break;case 36:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),25;case 37:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),26;case 38:return this.popState(),a.yytext=a.yytext.slice(0,-10).trim(),27;case 39:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),25;case 40:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),26;case 41:return this.popState(),a.yytext=a.yytext.slice(0,-10).trim(),27;case 42:return 48;case 43:return 49;case 44:return 50;case 45:return 51;case 46:this.pushState("STATE_STRING");break;case 47:return this.pushState("STATE_ID"),"AS";case 48:return this.popState(),"ID";case 49:this.popState();break;case 50:return"STATE_DESCR";case 51:return 19;case 52:this.popState();break;case 53:return this.popState(),this.pushState("struct"),20;case 54:break;case 55:return this.popState(),21;case 56:break;case 57:return this.begin("NOTE"),29;case 58:return this.popState(),this.pushState("NOTE_ID"),56;case 59:return this.popState(),this.pushState("NOTE_ID"),57;case 60:this.popState(),this.pushState("FLOATING_NOTE");break;case 61:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 62:break;case 63:return"NOTE_TEXT";case 64:return this.popState(),"ID";case 65:return this.popState(),this.pushState("NOTE_TEXT"),24;case 66:return this.popState(),a.yytext=a.yytext.substr(2).trim(),31;case 67:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),31;case 68:return 6;case 69:return 6;case 70:return 16;case 71:return 54;case 72:return 24;case 73:return a.yytext=a.yytext.trim(),14;case 74:return 15;case 75:return 28;case 76:return 55;case 77:return 5;case 78:return"INVALID"}},"anonymous"),rules:[/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[9,10],inclusive:!1},struct:{rules:[9,10,22,26,29,35,42,43,44,45,54,55,56,57,71,72,73,74,75],inclusive:!1},FLOATING_NOTE_ID:{rules:[64],inclusive:!1},FLOATING_NOTE:{rules:[61,62,63],inclusive:!1},NOTE_TEXT:{rules:[66,67],inclusive:!1},NOTE_ID:{rules:[65],inclusive:!1},NOTE:{rules:[58,59,60],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[31],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[30],inclusive:!1},CLASS_STYLE:{rules:[28],inclusive:!1},CLASS:{rules:[27],inclusive:!1},CLASSDEFID:{rules:[25],inclusive:!1},CLASSDEF:{rules:[23,24],inclusive:!1},acc_descr_multiline:{rules:[20,21],inclusive:!1},acc_descr:{rules:[18],inclusive:!1},acc_title:{rules:[16],inclusive:!1},SCALE:{rules:[13,14,33,34],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[48],inclusive:!1},STATE_STRING:{rules:[49,50],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[9,10,36,37,38,39,40,41,46,47,51,52,53],inclusive:!1},ID:{rules:[9,10],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,10,11,12,15,17,19,22,26,29,32,35,53,57,68,69,70,71,72,73,74,76,77,78],inclusive:!0}}};return w}();ft.lexer=Zt;function at(){this.yy={}}return u(at,"Parser"),at.prototype=ft,ft.Parser=at,new at}();mt.parser=mt;var Ue=mt,pe="TB",Ft="TB",Lt="dir",ht="state",bt="relation",Se="classDef",ye="style",ge="applyClass",K="default",Vt="divider",Mt="fill:none",Ut="fill: #333",jt="c",Ht="text",zt="normal",_t="rect",Et="rectWithTitle",Te="stateStart",_e="stateEnd",It="divider",Rt="roundedWithTitle",Ee="note",me="noteGroup",J="statediagram",be="state",De=`${J}-${be}`,Wt="transition",ve="note",ke="note-edge",Ce=`${Wt} ${ke}`,xe=`${J}-${ve}`,Ae="cluster",Le=`${J}-${Ae}`,Ie="cluster-alt",Re=`${J}-${Ie}`,Xt="parent",Kt="note",Oe="state",kt="----",Ne=`${kt}${Kt}`,Ot=`${kt}${Xt}`,Jt=u((t,e=Ft)=>{if(!t.doc)return e;let o=e;for(const r of t.doc)r.stmt==="dir"&&(o=r.value);return o},"getDir"),we=u(function(t,e){return e.db.getClasses()},"getClasses"),$e=u(async function(t,e,o,r){b.info("REF0:"),b.info("Drawing state diagram (v2)",e);const{securityLevel:d,state:i,layout:p}=C();r.db.extract(r.db.getRootDocV2());const g=r.db.getData(),n=se(e,d);g.type=r.type,g.layoutAlgorithm=p,g.nodeSpacing=i?.nodeSpacing||50,g.rankSpacing=i?.rankSpacing||50,g.markers=["barb"],g.diagramId=e,await re(g,n);const T=8;ae.insertTitle(n,"statediagramTitleText",i?.titleTopMargin??25,r.db.getDiagramTitle()),ie(n,T,J,i?.useMaxWidth??!0)},"draw"),je={getClasses:we,draw:$e,getDir:Jt},ut=new Map,$=0;function dt(t="",e=0,o="",r=kt){const d=o!==null&&o.length>0?`${r}${o}`:"";return`${Oe}-${t}${d}-${e}`}u(dt,"stateDomId");var Pe=u((t,e,o,r,d,i,p,g)=>{b.trace("items",e),e.forEach(n=>{switch(n.stmt){case ht:X(t,n,o,r,d,i,p,g);break;case K:X(t,n,o,r,d,i,p,g);break;case bt:{X(t,n.state1,o,r,d,i,p,g),X(t,n.state2,o,r,d,i,p,g);const T={id:"edge"+$,start:n.state1.id,end:n.state2.id,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:Mt,labelStyle:"",label:V.sanitizeText(n.description,C()),arrowheadStyle:Ut,labelpos:jt,labelType:Ht,thickness:zt,classes:Wt,look:p};d.push(T),$++}break}})},"setupDoc"),Nt=u((t,e=Ft)=>{let o=e;if(t.doc)for(const r of t.doc)r.stmt==="dir"&&(o=r.value);return o},"getDir");function W(t,e,o){if(!e.id||e.id==="</join></fork>"||e.id==="</choice>")return;e.cssClasses&&(Array.isArray(e.cssCompiledStyles)||(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(d=>{if(o.get(d)){const i=o.get(d);e.cssCompiledStyles=[...e.cssCompiledStyles,...i.styles]}}));const r=t.find(d=>d.id===e.id);r?Object.assign(r,e):t.push(e)}u(W,"insertOrUpdateNode");function qt(t){return t?.classes?.join(" ")??""}u(qt,"getClassesFromDbInfo");function Qt(t){return t?.styles??[]}u(Qt,"getStylesFromDbInfo");var X=u((t,e,o,r,d,i,p,g)=>{const n=e.id,T=o.get(n),m=qt(T),R=Qt(T);if(b.info("dataFetcher parsedItem",e,T,R),n!=="root"){let A=_t;e.start===!0?A=Te:e.start===!1&&(A=_e),e.type!==K&&(A=e.type),ut.get(n)||ut.set(n,{id:n,shape:A,description:V.sanitizeText(n,C()),cssClasses:`${m} ${De}`,cssStyles:R});const f=ut.get(n);e.description&&(Array.isArray(f.description)?(f.shape=Et,f.description.push(e.description)):f.description?.length>0?(f.shape=Et,f.description===n?f.description=[e.description]:f.description=[f.description,e.description]):(f.shape=_t,f.description=e.description),f.description=V.sanitizeTextOrArray(f.description,C())),f.description?.length===1&&f.shape===Et&&(f.type==="group"?f.shape=Rt:f.shape=_t),!f.type&&e.doc&&(b.info("Setting cluster for XCX",n,Nt(e)),f.type="group",f.isGroup=!0,f.dir=Nt(e),f.shape=e.type===Vt?It:Rt,f.cssClasses=`${f.cssClasses} ${Le} ${i?Re:""}`);const x={labelStyle:"",shape:f.shape,label:f.description,cssClasses:f.cssClasses,cssCompiledStyles:[],cssStyles:f.cssStyles,id:n,dir:f.dir,domId:dt(n,$),type:f.type,isGroup:f.type==="group",padding:8,rx:10,ry:10,look:p};if(x.shape===It&&(x.label=""),t&&t.id!=="root"&&(b.trace("Setting node ",n," to be child of its parent ",t.id),x.parentId=t.id),x.centerLabel=!0,e.note){const L={labelStyle:"",shape:Ee,label:e.note.text,cssClasses:xe,cssStyles:[],cssCompilesStyles:[],id:n+Ne+"-"+$,domId:dt(n,$,Kt),type:f.type,isGroup:f.type==="group",padding:C().flowchart.padding,look:p,position:e.note.position},P=n+Ot,B={labelStyle:"",shape:me,label:e.note.text,cssClasses:f.cssClasses,cssStyles:[],id:n+Ot,domId:dt(n,$,Xt),type:"group",isGroup:!0,padding:16,look:p,position:e.note.position};$++,B.id=P,L.parentId=P,W(r,B,g),W(r,L,g),W(r,x,g);let O=n,N=L.id;e.note.position==="left of"&&(O=L.id,N=n),d.push({id:O+"-"+N,start:O,end:N,arrowhead:"none",arrowTypeEnd:"",style:Mt,labelStyle:"",classes:Ce,arrowheadStyle:Ut,labelpos:jt,labelType:Ht,thickness:zt,look:p})}else W(r,x,g)}e.doc&&(b.trace("Adding nodes children "),Pe(e,e.doc,o,r,d,!i,p,g))},"dataFetcher"),Be=u(()=>{ut.clear(),$=0},"reset"),Dt="[*]",wt="start",$t=Dt,Pt="end",Bt="color",Gt="fill",Ge="bgFill",Ye=",";function vt(){return new Map}u(vt,"newClassesList");var Yt=u(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),ct=u(t=>JSON.parse(JSON.stringify(t)),"clone"),He=class{static{u(this,"StateDB")}constructor(t){this.clear(),this.version=t,this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}version;nodes=[];edges=[];rootDoc=[];classes=vt();documents={root:Yt()};currentDocument=this.documents.root;startEndCount=0;dividerCnt=0;static relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3};setRootDoc(t){b.info("Setting root doc",t),this.rootDoc=t,this.version===1?this.extract(t):this.extract(this.getRootDocV2())}getRootDoc(){return this.rootDoc}docTranslator(t,e,o){if(e.stmt===bt)this.docTranslator(t,e.state1,!0),this.docTranslator(t,e.state2,!1);else if(e.stmt===ht&&(e.id==="[*]"?(e.id=o?t.id+"_start":t.id+"_end",e.start=o):e.id=e.id.trim()),e.doc){const r=[];let d=[],i;for(i=0;i<e.doc.length;i++)if(e.doc[i].type===Vt){const p=ct(e.doc[i]);p.doc=ct(d),r.push(p),d=[]}else d.push(e.doc[i]);if(r.length>0&&d.length>0){const p={stmt:ht,id:ne(),type:"divider",doc:ct(d)};r.push(ct(p)),e.doc=r}e.doc.forEach(p=>this.docTranslator(e,p,!0))}}getRootDocV2(){return this.docTranslator({id:"root"},{id:"root",doc:this.rootDoc},!0),{id:"root",doc:this.rootDoc}}extract(t){let e;t.doc?e=t.doc:e=t,b.info(e),this.clear(!0),b.info("Extract initial document:",e),e.forEach(i=>{switch(b.warn("Statement",i.stmt),i.stmt){case ht:this.addState(i.id.trim(),i.type,i.doc,i.description,i.note,i.classes,i.styles,i.textStyles);break;case bt:this.addRelation(i.state1,i.state2,i.description);break;case Se:this.addStyleClass(i.id.trim(),i.classes);break;case ye:{const p=i.id.trim().split(","),g=i.styleClass.split(",");p.forEach(n=>{let T=this.getState(n);if(T===void 0){const m=n.trim();this.addState(m),T=this.getState(m)}T.styles=g.map(m=>m.replace(/;/g,"")?.trim())})}break;case ge:this.setCssClass(i.id.trim(),i.styleClass);break}});const o=this.getStates(),d=C().look;Be(),X(void 0,this.getRootDocV2(),o,this.nodes,this.edges,!0,d,this.classes),this.nodes.forEach(i=>{if(Array.isArray(i.label)){if(i.description=i.label.slice(1),i.isGroup&&i.description.length>0)throw new Error("Group nodes can only have label. Remove the additional description for node ["+i.id+"]");i.label=i.label[0]}})}addState(t,e=K,o=null,r=null,d=null,i=null,p=null,g=null){const n=t?.trim();if(this.currentDocument.states.has(n)?(this.currentDocument.states.get(n).doc||(this.currentDocument.states.get(n).doc=o),this.currentDocument.states.get(n).type||(this.currentDocument.states.get(n).type=e)):(b.info("Adding state ",n,r),this.currentDocument.states.set(n,{id:n,descriptions:[],type:e,doc:o,note:d,classes:[],styles:[],textStyles:[]})),r&&(b.info("Setting state description",n,r),typeof r=="string"&&this.addDescription(n,r.trim()),typeof r=="object"&&r.forEach(T=>this.addDescription(n,T.trim()))),d){const T=this.currentDocument.states.get(n);T.note=d,T.note.text=V.sanitizeText(T.note.text,C())}i&&(b.info("Setting state classes",n,i),(typeof i=="string"?[i]:i).forEach(m=>this.setCssClass(n,m.trim()))),p&&(b.info("Setting state styles",n,p),(typeof p=="string"?[p]:p).forEach(m=>this.setStyle(n,m.trim()))),g&&(b.info("Setting state styles",n,p),(typeof g=="string"?[g]:g).forEach(m=>this.setTextStyle(n,m.trim())))}clear(t){this.nodes=[],this.edges=[],this.documents={root:Yt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=vt(),t||le()}getState(t){return this.currentDocument.states.get(t)}getStates(){return this.currentDocument.states}logDocuments(){b.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}startIdIfNeeded(t=""){let e=t;return t===Dt&&(this.startEndCount++,e=`${wt}${this.startEndCount}`),e}startTypeIfNeeded(t="",e=K){return t===Dt?wt:e}endIdIfNeeded(t=""){let e=t;return t===$t&&(this.startEndCount++,e=`${Pt}${this.startEndCount}`),e}endTypeIfNeeded(t="",e=K){return t===$t?Pt:e}addRelationObjs(t,e,o){let r=this.startIdIfNeeded(t.id.trim()),d=this.startTypeIfNeeded(t.id.trim(),t.type),i=this.startIdIfNeeded(e.id.trim()),p=this.startTypeIfNeeded(e.id.trim(),e.type);this.addState(r,d,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),this.addState(i,p,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.currentDocument.relations.push({id1:r,id2:i,relationTitle:V.sanitizeText(o,C())})}addRelation(t,e,o){if(typeof t=="object")this.addRelationObjs(t,e,o);else{const r=this.startIdIfNeeded(t.trim()),d=this.startTypeIfNeeded(t),i=this.endIdIfNeeded(e.trim()),p=this.endTypeIfNeeded(e);this.addState(r,d),this.addState(i,p),this.currentDocument.relations.push({id1:r,id2:i,title:V.sanitizeText(o,C())})}}addDescription(t,e){const o=this.currentDocument.states.get(t),r=e.startsWith(":")?e.replace(":","").trim():e;o.descriptions.push(V.sanitizeText(r,C()))}cleanupLabel(t){return t.substring(0,1)===":"?t.substr(2).trim():t.trim()}getDividerId(){return this.dividerCnt++,"divider-id-"+this.dividerCnt}addStyleClass(t,e=""){this.classes.has(t)||this.classes.set(t,{id:t,styles:[],textStyles:[]});const o=this.classes.get(t);e?.split(Ye).forEach(r=>{const d=r.replace(/([^;]*);/,"$1").trim();if(RegExp(Bt).exec(r)){const p=d.replace(Gt,Ge).replace(Bt,Gt);o.textStyles.push(p)}o.styles.push(d)})}getClasses(){return this.classes}setCssClass(t,e){t.split(",").forEach(o=>{let r=this.getState(o);if(r===void 0){const d=o.trim();this.addState(d),r=this.getState(d)}r.classes.push(e)})}setStyle(t,e){const o=this.getState(t);o!==void 0&&o.styles.push(e)}setTextStyle(t,e){const o=this.getState(t);o!==void 0&&o.textStyles.push(e)}getDirectionStatement(){return this.rootDoc.find(t=>t.stmt===Lt)}getDirection(){return this.getDirectionStatement()?.value??pe}setDirection(t){const e=this.getDirectionStatement();e?e.value=t:this.rootDoc.unshift({stmt:Lt,value:t})}trimColon(t){return t&&t[0]===":"?t.substr(1).trim():t.trim()}getData(){const t=C();return{nodes:this.nodes,edges:this.edges,other:{},config:t,direction:Jt(this.getRootDocV2())}}getConfig(){return C().state}getAccTitle=oe;setAccTitle=ce;getAccDescription=he;setAccDescription=ue;setDiagramTitle=de;getDiagramTitle=fe},Fe=u(t=>`
defs #statediagram-barbEnd {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}
`,"getStyles"),ze=Fe;export{He as S,Ue as a,je as b,ze as s};
