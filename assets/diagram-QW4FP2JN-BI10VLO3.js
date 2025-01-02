import{p as w}from"./chunk-TMUBEWPD-BkKsDzsW.js";import{B,s as S,g as F,p as z,q as P,b as W,c as D,_ as i,l as v,C as x,D as T,v as _,G as A,j as E}from"./mermaid.core-Bc37ecyd.js";import{p as N}from"./gitGraph-YCYPL57B-CubUW0SW.js";import"./index-C8FCQPJD.js";import"./owner-Cr2WHyze.js";import"./StyledButton-KUTxOzSd.js";import"./proxy-Xh8nU2Wj.js";import"./isEmpty-C1jPZ8p9.js";import"./line-DunZT52S.js";import"./array-BKyUJesY.js";import"./path-CbwjOpE9.js";import"./_baseUniq-Cr4PoKqM.js";import"./_basePickBy-CyWLllq_.js";import"./has-BgM3CcEf.js";import"./clone-BRQVr5N1.js";var C={packet:[]},h=structuredClone(C),L=B.packet,Y=i(()=>{const t=x({...L,...T().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),G=i(()=>h.packet,"getPacket"),I=i(t=>{t.length>0&&h.packet.push(t)},"pushWord"),M=i(()=>{_(),h=structuredClone(C)},"clear"),u={pushWord:I,getPacket:G,getConfig:Y,clear:M,setAccTitle:S,getAccTitle:F,setDiagramTitle:z,getDiagramTitle:P,getAccDescription:W,setAccDescription:D},O=1e4,j=i(t=>{w(t,u);let e=-1,o=[],n=1;const{bitsPerRow:s}=u.getConfig();for(let{start:a,end:r,label:p}of t.blocks){if(r&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);for(e=r??a,v.debug(`Packet block ${a} - ${e} with label ${p}`);o.length<=s+1&&u.getPacket().length<O;){const[m,c]=q({start:a,end:r,label:p},n,s);if(o.push(m),m.end+1===n*s&&(u.pushWord(o),o=[],n++),!c)break;({start:a,end:r,label:p}=c)}}u.pushWord(o)},"populate"),q=i((t,e,o)=>{if(t.end===void 0&&(t.end=t.start),t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);return t.end+1<=e*o?[t,void 0]:[{start:t.start,end:e*o-1,label:t.label},{start:e*o,end:t.end,label:t.label}]},"getNextFittingBlock"),H={parse:i(async t=>{const e=await N("packet",t);v.debug(e),j(e)},"parse")},K=i((t,e,o,n)=>{const s=n.db,a=s.getConfig(),{rowHeight:r,paddingY:p,bitWidth:m,bitsPerRow:c}=a,b=s.getPacket(),l=s.getDiagramTitle(),g=r+p,d=g*(b.length+1)-(l?0:r),k=m*c+2,f=A(e);f.attr("viewbox",`0 0 ${k} ${d}`),E(f,d,k,a.useMaxWidth);for(const[$,y]of b.entries())R(f,y,$,a);f.append("text").text(l).attr("x",k/2).attr("y",d-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),R=i((t,e,o,{rowHeight:n,paddingX:s,paddingY:a,bitWidth:r,bitsPerRow:p,showBits:m})=>{const c=t.append("g"),b=o*(n+a)+a;for(const l of e){const g=l.start%p*r+1,d=(l.end-l.start+1)*r-s;if(c.append("rect").attr("x",g).attr("y",b).attr("width",d).attr("height",n).attr("class","packetBlock"),c.append("text").attr("x",g+d/2).attr("y",b+n/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(l.label),!m)continue;const k=l.end===l.start,f=b-2;c.append("text").attr("x",g+(k?d/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(l.start),k||c.append("text").attr("x",g+d).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(l.end)}},"drawWord"),U={draw:K},X={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J=i(({packet:t}={})=>{const e=x(X,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),gt={parser:H,db:u,renderer:U,styles:J};export{gt as diagram};
