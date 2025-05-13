import{d as Qt}from"./index-YMUjaDx4.js";import{d as I}from"./owner-EYyAWlgp.js";import{t as Zt,m as $t,a as te,i as ee,b as se,c as Lt,d as Ft,e as ie,f as ne,g as re,h as ae,j as ce,k as oe,l as le,n as Mt,o as Vt,p as Pt,s as Ot,q as Rt,r as ue,u as de,v as fe}from"./advancedFormat-C2vmCJ7B.js";import{d as he}from"./customParseFormat-BaIv5slM.js";import{a as me,s as ke,m as ye,n as pe,b as ge,c as be,g as U,d as Te,l as ht,i as xe,p as ve,u as _e}from"./index-B9sAYRAZ.js";import{s as ut}from"./isEmpty-C2NQZFK9.js";import{l as we}from"./linear-BCDOKQmc.js";import"./index-CaQNHPqR.js";import"./floating-ui.react-dom-DtNc5yOO.js";import"./index-DknxroSg.js";import"./index-D9cSuHcM.js";import"./useQuery-CaZMl5Q8.js";import"./viewport-CmXhBg3S.js";import"./use-is-dark-CZw0E0it.js";import"./dom-BowoBODo.js";import"./helper-CB7ordUq.js";import"./lodash-Dv8b12-_.js";import"./StyledButton-Sm4mkRH1.js";import"./index-BZQyBDE5.js";import"./proxy-BY0eS7VU.js";import"./provider-ttcw9hgE.js";import"./spring-C80N1tKa.js";import"./use-is-unmounted-CQcoZtgO.js";import"./use-event-callback-D-ihFmfO.js";import"./use-drag-controls-wDZLQxOI.js";import"./visual-element-BWPUV8Sy.js";import"./index-CbtsY2H5.js";import"./init-Gi6I4Gst.js";var pt=function(){var t=function(p,i,u,d){for(u=u||{},d=p.length;d--;u[p[d]]=i);return u},s=[6,8,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,30,32,33,35,37],n=[1,25],r=[1,26],a=[1,27],h=[1,28],f=[1,29],F=[1,30],O=[1,31],R=[1,9],E=[1,10],A=[1,11],N=[1,12],M=[1,13],V=[1,14],v=[1,15],tt=[1,16],et=[1,18],st=[1,19],it=[1,20],nt=[1,21],rt=[1,22],at=[1,24],ct=[1,32],m={trace:function(){},yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,dateFormat:19,inclusiveEndDates:20,topAxis:21,axisFormat:22,tickInterval:23,excludes:24,includes:25,todayMarker:26,title:27,acc_title:28,acc_title_value:29,acc_descr:30,acc_descr_value:31,acc_descr_multiline_value:32,section:33,clickStatement:34,taskTxt:35,taskData:36,click:37,callbackname:38,callbackargs:39,href:40,clickStatementDebug:41,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",19:"dateFormat",20:"inclusiveEndDates",21:"topAxis",22:"axisFormat",23:"tickInterval",24:"excludes",25:"includes",26:"todayMarker",27:"title",28:"acc_title",29:"acc_title_value",30:"acc_descr",31:"acc_descr_value",32:"acc_descr_multiline_value",33:"section",35:"taskTxt",36:"taskData",37:"click",38:"callbackname",39:"callbackargs",40:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[34,2],[34,3],[34,3],[34,4],[34,3],[34,4],[34,2],[41,2],[41,3],[41,3],[41,4],[41,3],[41,4],[41,2]],performAction:function(i,u,d,c,k,e,S){var l=e.length-1;switch(k){case 1:return e[l-1];case 2:this.$=[];break;case 3:e[l-1].push(e[l]),this.$=e[l-1];break;case 4:case 5:this.$=e[l];break;case 6:case 7:this.$=[];break;case 8:c.setWeekday("monday");break;case 9:c.setWeekday("tuesday");break;case 10:c.setWeekday("wednesday");break;case 11:c.setWeekday("thursday");break;case 12:c.setWeekday("friday");break;case 13:c.setWeekday("saturday");break;case 14:c.setWeekday("sunday");break;case 15:c.setDateFormat(e[l].substr(11)),this.$=e[l].substr(11);break;case 16:c.enableInclusiveEndDates(),this.$=e[l].substr(18);break;case 17:c.TopAxis(),this.$=e[l].substr(8);break;case 18:c.setAxisFormat(e[l].substr(11)),this.$=e[l].substr(11);break;case 19:c.setTickInterval(e[l].substr(13)),this.$=e[l].substr(13);break;case 20:c.setExcludes(e[l].substr(9)),this.$=e[l].substr(9);break;case 21:c.setIncludes(e[l].substr(9)),this.$=e[l].substr(9);break;case 22:c.setTodayMarker(e[l].substr(12)),this.$=e[l].substr(12);break;case 24:c.setDiagramTitle(e[l].substr(6)),this.$=e[l].substr(6);break;case 25:this.$=e[l].trim(),c.setAccTitle(this.$);break;case 26:case 27:this.$=e[l].trim(),c.setAccDescription(this.$);break;case 28:c.addSection(e[l].substr(8)),this.$=e[l].substr(8);break;case 30:c.addTask(e[l-1],e[l]),this.$="task";break;case 31:this.$=e[l-1],c.setClickEvent(e[l-1],e[l],null);break;case 32:this.$=e[l-2],c.setClickEvent(e[l-2],e[l-1],e[l]);break;case 33:this.$=e[l-2],c.setClickEvent(e[l-2],e[l-1],null),c.setLink(e[l-2],e[l]);break;case 34:this.$=e[l-3],c.setClickEvent(e[l-3],e[l-2],e[l-1]),c.setLink(e[l-3],e[l]);break;case 35:this.$=e[l-2],c.setClickEvent(e[l-2],e[l],null),c.setLink(e[l-2],e[l-1]);break;case 36:this.$=e[l-3],c.setClickEvent(e[l-3],e[l-1],e[l]),c.setLink(e[l-3],e[l-2]);break;case 37:this.$=e[l-1],c.setLink(e[l-1],e[l]);break;case 38:case 44:this.$=e[l-1]+" "+e[l];break;case 39:case 40:case 42:this.$=e[l-2]+" "+e[l-1]+" "+e[l];break;case 41:case 43:this.$=e[l-3]+" "+e[l-2]+" "+e[l-1]+" "+e[l];break}},table:[{3:1,4:[1,2]},{1:[3]},t(s,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:n,13:r,14:a,15:h,16:f,17:F,18:O,19:R,20:E,21:A,22:N,23:M,24:V,25:v,26:tt,27:et,28:st,30:it,32:nt,33:rt,34:23,35:at,37:ct},t(s,[2,7],{1:[2,1]}),t(s,[2,3]),{9:33,11:17,12:n,13:r,14:a,15:h,16:f,17:F,18:O,19:R,20:E,21:A,22:N,23:M,24:V,25:v,26:tt,27:et,28:st,30:it,32:nt,33:rt,34:23,35:at,37:ct},t(s,[2,5]),t(s,[2,6]),t(s,[2,15]),t(s,[2,16]),t(s,[2,17]),t(s,[2,18]),t(s,[2,19]),t(s,[2,20]),t(s,[2,21]),t(s,[2,22]),t(s,[2,23]),t(s,[2,24]),{29:[1,34]},{31:[1,35]},t(s,[2,27]),t(s,[2,28]),t(s,[2,29]),{36:[1,36]},t(s,[2,8]),t(s,[2,9]),t(s,[2,10]),t(s,[2,11]),t(s,[2,12]),t(s,[2,13]),t(s,[2,14]),{38:[1,37],40:[1,38]},t(s,[2,4]),t(s,[2,25]),t(s,[2,26]),t(s,[2,30]),t(s,[2,31],{39:[1,39],40:[1,40]}),t(s,[2,37],{38:[1,41]}),t(s,[2,32],{40:[1,42]}),t(s,[2,33]),t(s,[2,35],{39:[1,43]}),t(s,[2,34]),t(s,[2,36])],defaultActions:{},parseError:function(i,u){if(u.recoverable)this.trace(i);else{var d=new Error(i);throw d.hash=u,d}},parse:function(i){var u=this,d=[0],c=[],k=[null],e=[],S=this.table,l="",o=0,y=0,C=2,x=1,_=e.slice.call(arguments,1),T=Object.create(this.lexer),w={yy:{}};for(var J in this.yy)Object.prototype.hasOwnProperty.call(this.yy,J)&&(w.yy[J]=this.yy[J]);T.setInput(i,w.yy),w.yy.lexer=T,w.yy.parser=this,typeof T.yylloc>"u"&&(T.yylloc={});var K=T.yylloc;e.push(K);var Jt=T.options&&T.options.ranges;typeof w.yy.parseError=="function"?this.parseError=w.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Kt(){var Y;return Y=c.pop()||T.lex()||x,typeof Y!="number"&&(Y instanceof Array&&(c=Y,Y=c.pop()),Y=u.symbols_[Y]||Y),Y}for(var L,q,P,kt,X={},ot,W,It,lt;;){if(q=d[d.length-1],this.defaultActions[q]?P=this.defaultActions[q]:((L===null||typeof L>"u")&&(L=Kt()),P=S[q]&&S[q][L]),typeof P>"u"||!P.length||!P[0]){var yt="";lt=[];for(ot in S[q])this.terminals_[ot]&&ot>C&&lt.push("'"+this.terminals_[ot]+"'");T.showPosition?yt="Parse error on line "+(o+1)+`:
`+T.showPosition()+`
Expecting `+lt.join(", ")+", got '"+(this.terminals_[L]||L)+"'":yt="Parse error on line "+(o+1)+": Unexpected "+(L==x?"end of input":"'"+(this.terminals_[L]||L)+"'"),this.parseError(yt,{text:T.match,token:this.terminals_[L]||L,line:T.yylineno,loc:K,expected:lt})}if(P[0]instanceof Array&&P.length>1)throw new Error("Parse Error: multiple actions possible at state: "+q+", token: "+L);switch(P[0]){case 1:d.push(L),k.push(T.yytext),e.push(T.yylloc),d.push(P[1]),L=null,y=T.yyleng,l=T.yytext,o=T.yylineno,K=T.yylloc;break;case 2:if(W=this.productions_[P[1]][1],X.$=k[k.length-W],X._$={first_line:e[e.length-(W||1)].first_line,last_line:e[e.length-1].last_line,first_column:e[e.length-(W||1)].first_column,last_column:e[e.length-1].last_column},Jt&&(X._$.range=[e[e.length-(W||1)].range[0],e[e.length-1].range[1]]),kt=this.performAction.apply(X,[l,y,o,w.yy,P[1],k,e].concat(_)),typeof kt<"u")return kt;W&&(d=d.slice(0,-1*W*2),k=k.slice(0,-1*W),e=e.slice(0,-1*W)),d.push(this.productions_[P[1]][0]),k.push(X.$),e.push(X._$),It=S[d[d.length-2]][d[d.length-1]],d.push(It);break;case 3:return!0}}return!0}},b=function(){var p={EOF:1,parseError:function(u,d){if(this.yy.parser)this.yy.parser.parseError(u,d);else throw new Error(u)},setInput:function(i,u){return this.yy=u||this.yy||{},this._input=i,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var i=this._input[0];this.yytext+=i,this.yyleng++,this.offset++,this.match+=i,this.matched+=i;var u=i.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),i},unput:function(i){var u=i.length,d=i.split(/(?:\r\n?|\n)/g);this._input=i+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var c=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var k=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===c.length?this.yylloc.first_column:0)+c[c.length-d.length].length-d[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[k[0],k[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(i){this.unput(this.match.slice(i))},pastInput:function(){var i=this.matched.substr(0,this.matched.length-this.match.length);return(i.length>20?"...":"")+i.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var i=this.match;return i.length<20&&(i+=this._input.substr(0,20-i.length)),(i.substr(0,20)+(i.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var i=this.pastInput(),u=new Array(i.length+1).join("-");return i+this.upcomingInput()+`
`+u+"^"},test_match:function(i,u){var d,c,k;if(this.options.backtrack_lexer&&(k={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(k.yylloc.range=this.yylloc.range.slice(0))),c=i[0].match(/(?:\r\n?|\n).*/g),c&&(this.yylineno+=c.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:c?c[c.length-1].length-c[c.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+i[0].length},this.yytext+=i[0],this.match+=i[0],this.matches=i,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(i[0].length),this.matched+=i[0],d=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var e in k)this[e]=k[e];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var i,u,d,c;this._more||(this.yytext="",this.match="");for(var k=this._currentRules(),e=0;e<k.length;e++)if(d=this._input.match(this.rules[k[e]]),d&&(!u||d[0].length>u[0].length)){if(u=d,c=e,this.options.backtrack_lexer){if(i=this.test_match(d,k[e]),i!==!1)return i;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(i=this.test_match(u,k[c]),i!==!1?i:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var u=this.next();return u||this.lex()},begin:function(u){this.conditionStack.push(u)},popState:function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},pushState:function(u){this.begin(u)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(u,d,c,k){switch(c){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),28;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),30;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 40;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 38;case 21:this.popState();break;case 22:return 39;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 37;case 26:return 4;case 27:return 19;case 28:return 20;case 29:return 21;case 30:return 22;case 31:return 23;case 32:return 25;case 33:return 24;case 34:return 26;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return"date";case 43:return 27;case 44:return"accDescription";case 45:return 33;case 46:return 35;case 47:return 36;case 48:return":";case 49:return 6;case 50:return"INVALID"}},rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],inclusive:!0}}};return p}();m.lexer=b;function g(){this.yy={}}return g.prototype=m,m.Parser=g,new g}();pt.parser=pt;const Ce=pt;I.extend(de);I.extend(he);I.extend(fe);let B="",xt="",vt,_t="",Q=[],Z=[],wt={},Ct=[],mt=[],H="",Et="";const Wt=["active","done","crit","milestone"];let Dt=[],$=!1,St=!1,At="sunday",gt=0;const Ee=function(){Ct=[],mt=[],H="",Dt=[],dt=0,Tt=void 0,ft=void 0,D=[],B="",xt="",Et="",vt=void 0,_t="",Q=[],Z=[],$=!1,St=!1,gt=0,wt={},ve(),At="sunday"},De=function(t){xt=t},Se=function(){return xt},Ae=function(t){vt=t},Ie=function(){return vt},Le=function(t){_t=t},Fe=function(){return _t},Me=function(t){B=t},Ve=function(){$=!0},Pe=function(){return $},Oe=function(){St=!0},Re=function(){return St},Be=function(t){Et=t},Ne=function(){return Et},We=function(){return B},Ye=function(t){Q=t.toLowerCase().split(/[\s,]+/)},ze=function(){return Q},qe=function(t){Z=t.toLowerCase().split(/[\s,]+/)},je=function(){return Z},Xe=function(){return wt},Ue=function(t){H=t,Ct.push(t)},Ge=function(){return Ct},He=function(){let t=Bt();const s=10;let n=0;for(;!t&&n<s;)t=Bt(),n++;return mt=D,mt},Yt=function(t,s,n,r){return r.includes(t.format(s.trim()))?!1:t.isoWeekday()>=6&&n.includes("weekends")||n.includes(t.format("dddd").toLowerCase())?!0:n.includes(t.format(s.trim()))},Je=function(t){At=t},Ke=function(){return At},zt=function(t,s,n,r){if(!n.length||t.manualEndTime)return;let a;t.startTime instanceof Date?a=I(t.startTime):a=I(t.startTime,s,!0),a=a.add(1,"d");let h;t.endTime instanceof Date?h=I(t.endTime):h=I(t.endTime,s,!0);const[f,F]=Qe(a,h,s,n,r);t.endTime=f.toDate(),t.renderEndTime=F},Qe=function(t,s,n,r,a){let h=!1,f=null;for(;t<=s;)h||(f=s.toDate()),h=Yt(t,n,r,a),h&&(s=s.add(1,"d")),t=t.add(1,"d");return[s,f]},bt=function(t,s,n){n=n.trim();const a=/^after\s+(?<ids>[\d\w- ]+)/.exec(n);if(a!==null){let f=null;for(const O of a.groups.ids.split(" ")){let R=j(O);R!==void 0&&(!f||R.endTime>f.endTime)&&(f=R)}if(f)return f.endTime;const F=new Date;return F.setHours(0,0,0,0),F}let h=I(n,s.trim(),!0);if(h.isValid())return h.toDate();{ht.debug("Invalid date:"+n),ht.debug("With date format:"+s.trim());const f=new Date(n);if(f===void 0||isNaN(f.getTime())||f.getFullYear()<-1e4||f.getFullYear()>1e4)throw new Error("Invalid date:"+n);return f}},qt=function(t){const s=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return s!==null?[Number.parseFloat(s[1]),s[2]]:[NaN,"ms"]},jt=function(t,s,n,r=!1){n=n.trim();const h=/^until\s+(?<ids>[\d\w- ]+)/.exec(n);if(h!==null){let E=null;for(const N of h.groups.ids.split(" ")){let M=j(N);M!==void 0&&(!E||M.startTime<E.startTime)&&(E=M)}if(E)return E.startTime;const A=new Date;return A.setHours(0,0,0,0),A}let f=I(n,s.trim(),!0);if(f.isValid())return r&&(f=f.add(1,"d")),f.toDate();let F=I(t);const[O,R]=qt(n);if(!Number.isNaN(O)){const E=F.add(O,R);E.isValid()&&(F=E)}return F.toDate()};let dt=0;const G=function(t){return t===void 0?(dt=dt+1,"task"+dt):t},Ze=function(t,s){let n;s.substr(0,1)===":"?n=s.substr(1,s.length):n=s;const r=n.split(","),a={};Ht(r,a,Wt);for(let f=0;f<r.length;f++)r[f]=r[f].trim();let h="";switch(r.length){case 1:a.id=G(),a.startTime=t.endTime,h=r[0];break;case 2:a.id=G(),a.startTime=bt(void 0,B,r[0]),h=r[1];break;case 3:a.id=G(r[0]),a.startTime=bt(void 0,B,r[1]),h=r[2];break}return h&&(a.endTime=jt(a.startTime,B,h,$),a.manualEndTime=I(h,"YYYY-MM-DD",!0).isValid(),zt(a,B,Z,Q)),a},$e=function(t,s){let n;s.substr(0,1)===":"?n=s.substr(1,s.length):n=s;const r=n.split(","),a={};Ht(r,a,Wt);for(let h=0;h<r.length;h++)r[h]=r[h].trim();switch(r.length){case 1:a.id=G(),a.startTime={type:"prevTaskEnd",id:t},a.endTime={data:r[0]};break;case 2:a.id=G(),a.startTime={type:"getStartDate",startData:r[0]},a.endTime={data:r[1]};break;case 3:a.id=G(r[0]),a.startTime={type:"getStartDate",startData:r[1]},a.endTime={data:r[2]};break}return a};let Tt,ft,D=[];const Xt={},ts=function(t,s){const n={section:H,type:H,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:s},task:t,classes:[]},r=$e(ft,s);n.raw.startTime=r.startTime,n.raw.endTime=r.endTime,n.id=r.id,n.prevTaskId=ft,n.active=r.active,n.done=r.done,n.crit=r.crit,n.milestone=r.milestone,n.order=gt,gt++;const a=D.push(n);ft=n.id,Xt[n.id]=a-1},j=function(t){const s=Xt[t];return D[s]},es=function(t,s){const n={section:H,type:H,description:t,task:t,classes:[]},r=Ze(Tt,s);n.startTime=r.startTime,n.endTime=r.endTime,n.id=r.id,n.active=r.active,n.done=r.done,n.crit=r.crit,n.milestone=r.milestone,Tt=n,mt.push(n)},Bt=function(){const t=function(n){const r=D[n];let a="";switch(D[n].raw.startTime.type){case"prevTaskEnd":{const h=j(r.prevTaskId);r.startTime=h.endTime;break}case"getStartDate":a=bt(void 0,B,D[n].raw.startTime.startData),a&&(D[n].startTime=a);break}return D[n].startTime&&(D[n].endTime=jt(D[n].startTime,B,D[n].raw.endTime.data,$),D[n].endTime&&(D[n].processed=!0,D[n].manualEndTime=I(D[n].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),zt(D[n],B,Z,Q))),D[n].processed};let s=!0;for(const[n,r]of D.entries())t(n),s=s&&r.processed;return s},ss=function(t,s){let n=s;U().securityLevel!=="loose"&&(n=Qt.sanitizeUrl(s)),t.split(",").forEach(function(r){j(r)!==void 0&&(Gt(r,()=>{window.open(n,"_self")}),wt[r]=n)}),Ut(t,"clickable")},Ut=function(t,s){t.split(",").forEach(function(n){let r=j(n);r!==void 0&&r.classes.push(s)})},is=function(t,s,n){if(U().securityLevel!=="loose"||s===void 0)return;let r=[];if(typeof n=="string"){r=n.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let h=0;h<r.length;h++){let f=r[h].trim();f.charAt(0)==='"'&&f.charAt(f.length-1)==='"'&&(f=f.substr(1,f.length-2)),r[h]=f}}r.length===0&&r.push(t),j(t)!==void 0&&Gt(t,()=>{_e.runFunc(s,...r)})},Gt=function(t,s){Dt.push(function(){const n=document.querySelector(`[id="${t}"]`);n!==null&&n.addEventListener("click",function(){s()})},function(){const n=document.querySelector(`[id="${t}-text"]`);n!==null&&n.addEventListener("click",function(){s()})})},ns=function(t,s,n){t.split(",").forEach(function(r){is(r,s,n)}),Ut(t,"clickable")},rs=function(t){Dt.forEach(function(s){s(t)})},as={getConfig:()=>U().gantt,clear:Ee,setDateFormat:Me,getDateFormat:We,enableInclusiveEndDates:Ve,endDatesAreInclusive:Pe,enableTopAxis:Oe,topAxisEnabled:Re,setAxisFormat:De,getAxisFormat:Se,setTickInterval:Ae,getTickInterval:Ie,setTodayMarker:Le,getTodayMarker:Fe,setAccTitle:be,getAccTitle:ge,setDiagramTitle:pe,getDiagramTitle:ye,setDisplayMode:Be,getDisplayMode:Ne,setAccDescription:ke,getAccDescription:me,addSection:Ue,getSections:Ge,getTasks:He,addTask:ts,findTaskById:j,addTaskOrg:es,setIncludes:Ye,getIncludes:ze,setExcludes:qe,getExcludes:je,setClickEvent:ns,setLink:ss,getLinks:Xe,bindFunctions:rs,parseDuration:qt,isInvalidDate:Yt,setWeekday:Je,getWeekday:Ke};function Ht(t,s,n){let r=!0;for(;r;)r=!1,n.forEach(function(a){const h="^\\s*"+a+"\\s*$",f=new RegExp(h);t[0].match(f)&&(s[a]=!0,t.shift(1),r=!0)})}const cs=function(){ht.debug("Something is calling, setConf, remove the call")},Nt={monday:le,tuesday:oe,wednesday:ce,thursday:ae,friday:re,saturday:ne,sunday:ie},os=(t,s)=>{let n=[...t].map(()=>-1/0),r=[...t].sort((h,f)=>h.startTime-f.startTime||h.order-f.order),a=0;for(const h of r)for(let f=0;f<n.length;f++)if(h.startTime>=n[f]){n[f]=h.endTime,h.order=f+s,f>a&&(a=f);break}return a};let z;const ls=function(t,s,n,r){const a=U().gantt,h=U().securityLevel;let f;h==="sandbox"&&(f=ut("#i"+s));const F=h==="sandbox"?ut(f.nodes()[0].contentDocument.body):ut("body"),O=h==="sandbox"?f.nodes()[0].contentDocument:document,R=O.getElementById(s);z=R.parentElement.offsetWidth,z===void 0&&(z=1200),a.useWidth!==void 0&&(z=a.useWidth);const E=r.db.getTasks();let A=[];for(const m of E)A.push(m.type);A=ct(A);const N={};let M=2*a.topPadding;if(r.db.getDisplayMode()==="compact"||a.displayMode==="compact"){const m={};for(const g of E)m[g.section]===void 0?m[g.section]=[g]:m[g.section].push(g);let b=0;for(const g of Object.keys(m)){const p=os(m[g],b)+1;b+=p,M+=p*(a.barHeight+a.barGap),N[g]=p}}else{M+=E.length*(a.barHeight+a.barGap);for(const m of A)N[m]=E.filter(b=>b.type===m).length}R.setAttribute("viewBox","0 0 "+z+" "+M);const V=F.select(`[id="${s}"]`),v=Zt().domain([$t(E,function(m){return m.startTime}),te(E,function(m){return m.endTime})]).rangeRound([0,z-a.leftPadding-a.rightPadding]);function tt(m,b){const g=m.startTime,p=b.startTime;let i=0;return g>p?i=1:g<p&&(i=-1),i}E.sort(tt),et(E,z,M),Te(V,M,z,a.useMaxWidth),V.append("text").text(r.db.getDiagramTitle()).attr("x",z/2).attr("y",a.titleTopMargin).attr("class","titleText");function et(m,b,g){const p=a.barHeight,i=p+a.barGap,u=a.topPadding,d=a.leftPadding,c=we().domain([0,A.length]).range(["#00B9FA","#F95002"]).interpolate(ee);it(i,u,d,b,g,m,r.db.getExcludes(),r.db.getIncludes()),nt(d,u,b,g),st(m,i,u,d,p,c,b),rt(i,u),at(d,u,b,g)}function st(m,b,g,p,i,u,d){const k=[...new Set(m.map(o=>o.order))].map(o=>m.find(y=>y.order===o));V.append("g").selectAll("rect").data(k).enter().append("rect").attr("x",0).attr("y",function(o,y){return y=o.order,y*b+g-2}).attr("width",function(){return d-a.rightPadding/2}).attr("height",b).attr("class",function(o){for(const[y,C]of A.entries())if(o.type===C)return"section section"+y%a.numberSectionStyles;return"section section0"});const e=V.append("g").selectAll("rect").data(m).enter(),S=r.db.getLinks();if(e.append("rect").attr("id",function(o){return o.id}).attr("rx",3).attr("ry",3).attr("x",function(o){return o.milestone?v(o.startTime)+p+.5*(v(o.endTime)-v(o.startTime))-.5*i:v(o.startTime)+p}).attr("y",function(o,y){return y=o.order,y*b+g}).attr("width",function(o){return o.milestone?i:v(o.renderEndTime||o.endTime)-v(o.startTime)}).attr("height",i).attr("transform-origin",function(o,y){return y=o.order,(v(o.startTime)+p+.5*(v(o.endTime)-v(o.startTime))).toString()+"px "+(y*b+g+.5*i).toString()+"px"}).attr("class",function(o){const y="task";let C="";o.classes.length>0&&(C=o.classes.join(" "));let x=0;for(const[T,w]of A.entries())o.type===w&&(x=T%a.numberSectionStyles);let _="";return o.active?o.crit?_+=" activeCrit":_=" active":o.done?o.crit?_=" doneCrit":_=" done":o.crit&&(_+=" crit"),_.length===0&&(_=" task"),o.milestone&&(_=" milestone "+_),_+=x,_+=" "+C,y+_}),e.append("text").attr("id",function(o){return o.id+"-text"}).text(function(o){return o.task}).attr("font-size",a.fontSize).attr("x",function(o){let y=v(o.startTime),C=v(o.renderEndTime||o.endTime);o.milestone&&(y+=.5*(v(o.endTime)-v(o.startTime))-.5*i),o.milestone&&(C=y+i);const x=this.getBBox().width;return x>C-y?C+x+1.5*a.leftPadding>d?y+p-5:C+p+5:(C-y)/2+y+p}).attr("y",function(o,y){return y=o.order,y*b+a.barHeight/2+(a.fontSize/2-2)+g}).attr("text-height",i).attr("class",function(o){const y=v(o.startTime);let C=v(o.endTime);o.milestone&&(C=y+i);const x=this.getBBox().width;let _="";o.classes.length>0&&(_=o.classes.join(" "));let T=0;for(const[J,K]of A.entries())o.type===K&&(T=J%a.numberSectionStyles);let w="";return o.active&&(o.crit?w="activeCritText"+T:w="activeText"+T),o.done?o.crit?w=w+" doneCritText"+T:w=w+" doneText"+T:o.crit&&(w=w+" critText"+T),o.milestone&&(w+=" milestoneText"),x>C-y?C+x+1.5*a.leftPadding>d?_+" taskTextOutsideLeft taskTextOutside"+T+" "+w:_+" taskTextOutsideRight taskTextOutside"+T+" "+w+" width-"+x:_+" taskText taskText"+T+" "+w+" width-"+x}),U().securityLevel==="sandbox"){let o;o=ut("#i"+s);const y=o.nodes()[0].contentDocument;e.filter(function(C){return S[C.id]!==void 0}).each(function(C){var x=y.querySelector("#"+C.id),_=y.querySelector("#"+C.id+"-text");const T=x.parentNode;var w=y.createElement("a");w.setAttribute("xlink:href",S[C.id]),w.setAttribute("target","_top"),T.appendChild(w),w.appendChild(x),w.appendChild(_)})}}function it(m,b,g,p,i,u,d,c){if(d.length===0&&c.length===0)return;let k,e;for(const{startTime:x,endTime:_}of u)(k===void 0||x<k)&&(k=x),(e===void 0||_>e)&&(e=_);if(!k||!e)return;if(I(e).diff(I(k),"year")>5){ht.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const S=r.db.getDateFormat(),l=[];let o=null,y=I(k);for(;y.valueOf()<=e;)r.db.isInvalidDate(y,S,d,c)?o?o.end=y:o={start:y,end:y}:o&&(l.push(o),o=null),y=y.add(1,"d");V.append("g").selectAll("rect").data(l).enter().append("rect").attr("id",function(x){return"exclude-"+x.start.format("YYYY-MM-DD")}).attr("x",function(x){return v(x.start)+g}).attr("y",a.gridLineStartPadding).attr("width",function(x){const _=x.end.add(1,"day");return v(_)-v(x.start)}).attr("height",i-b-a.gridLineStartPadding).attr("transform-origin",function(x,_){return(v(x.start)+g+.5*(v(x.end)-v(x.start))).toString()+"px "+(_*m+.5*i).toString()+"px"}).attr("class","exclude-range")}function nt(m,b,g,p){let i=se(v).tickSize(-p+b+a.gridLineStartPadding).tickFormat(Lt(r.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d"));const d=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(r.db.getTickInterval()||a.tickInterval);if(d!==null){const c=d[1],k=d[2],e=r.db.getWeekday()||a.weekday;switch(k){case"millisecond":i.ticks(Rt.every(c));break;case"second":i.ticks(Ot.every(c));break;case"minute":i.ticks(Pt.every(c));break;case"hour":i.ticks(Vt.every(c));break;case"day":i.ticks(Mt.every(c));break;case"week":i.ticks(Nt[e].every(c));break;case"month":i.ticks(Ft.every(c));break}}if(V.append("g").attr("class","grid").attr("transform","translate("+m+", "+(p-50)+")").call(i).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),r.db.topAxisEnabled()||a.topAxis){let c=ue(v).tickSize(-p+b+a.gridLineStartPadding).tickFormat(Lt(r.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d"));if(d!==null){const k=d[1],e=d[2],S=r.db.getWeekday()||a.weekday;switch(e){case"millisecond":c.ticks(Rt.every(k));break;case"second":c.ticks(Ot.every(k));break;case"minute":c.ticks(Pt.every(k));break;case"hour":c.ticks(Vt.every(k));break;case"day":c.ticks(Mt.every(k));break;case"week":c.ticks(Nt[S].every(k));break;case"month":c.ticks(Ft.every(k));break}}V.append("g").attr("class","grid").attr("transform","translate("+m+", "+b+")").call(c).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}function rt(m,b){let g=0;const p=Object.keys(N).map(i=>[i,N[i]]);V.append("g").selectAll("text").data(p).enter().append(function(i){const u=i[0].split(xe.lineBreakRegex),d=-(u.length-1)/2,c=O.createElementNS("http://www.w3.org/2000/svg","text");c.setAttribute("dy",d+"em");for(const[k,e]of u.entries()){const S=O.createElementNS("http://www.w3.org/2000/svg","tspan");S.setAttribute("alignment-baseline","central"),S.setAttribute("x","10"),k>0&&S.setAttribute("dy","1em"),S.textContent=e,c.appendChild(S)}return c}).attr("x",10).attr("y",function(i,u){if(u>0)for(let d=0;d<u;d++)return g+=p[u-1][1],i[1]*m/2+g*m+b;else return i[1]*m/2+b}).attr("font-size",a.sectionFontSize).attr("class",function(i){for(const[u,d]of A.entries())if(i[0]===d)return"sectionTitle sectionTitle"+u%a.numberSectionStyles;return"sectionTitle"})}function at(m,b,g,p){const i=r.db.getTodayMarker();if(i==="off")return;const u=V.append("g").attr("class","today"),d=new Date,c=u.append("line");c.attr("x1",v(d)+m).attr("x2",v(d)+m).attr("y1",a.titleTopMargin).attr("y2",p-a.titleTopMargin).attr("class","today"),i!==""&&c.attr("style",i.replace(/,/g,";"))}function ct(m){const b={},g=[];for(let p=0,i=m.length;p<i;++p)Object.prototype.hasOwnProperty.call(b,m[p])||(b[m[p]]=!0,g.push(m[p]));return g}},us={setConf:cs,draw:ls},ds=t=>`
  .mermaid-main-font {
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }
`,fs=ds,Ys={parser:Ce,db:as,renderer:us,styles:fs};export{Ys as diagram};
