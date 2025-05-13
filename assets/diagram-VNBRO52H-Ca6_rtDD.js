import{p as w}from"./chunk-4BMEZGHF-CPJj9f2Z.js";import{_ as n,s as B,g as S,q as F,p as z,a as P,b as W,C as v,G as D,d as T,y as E,D as _,E as A,l as x}from"./mermaid.core-DXMC9S04.js";import{p as N}from"./radar-MK3ICKWK-CIT_og4A.js";import"./index-CaQNHPqR.js";import"./owner-EYyAWlgp.js";import"./isEmpty-C2NQZFK9.js";import"./line-D5asVbEF.js";import"./array-BKyUJesY.js";import"./path-CbwjOpE9.js";import"./_baseUniq-C0asizYL.js";import"./_basePickBy-DzHu_GpB.js";import"./has-CVu40qOM.js";import"./clone-lQlUZaTE.js";var C={packet:[]},h=structuredClone(C),L=A.packet,Y=n(()=>{const t=v({...L,..._().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),G=n(()=>h.packet,"getPacket"),I=n(t=>{t.length>0&&h.packet.push(t)},"pushWord"),M=n(()=>{E(),h=structuredClone(C)},"clear"),u={pushWord:I,getPacket:G,getConfig:Y,clear:M,setAccTitle:W,getAccTitle:P,setDiagramTitle:z,getDiagramTitle:F,getAccDescription:S,setAccDescription:B},O=1e4,q=n(t=>{w(t,u);let e=-1,o=[],i=1;const{bitsPerRow:s}=u.getConfig();for(let{start:a,end:r,label:p}of t.blocks){if(r&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);for(e=r??a,x.debug(`Packet block ${a} - ${e} with label ${p}`);o.length<=s+1&&u.getPacket().length<O;){const[b,c]=H({start:a,end:r,label:p},i,s);if(o.push(b),b.end+1===i*s&&(u.pushWord(o),o=[],i++),!c)break;({start:a,end:r,label:p}=c)}}u.pushWord(o)},"populate"),H=n((t,e,o)=>{if(t.end===void 0&&(t.end=t.start),t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);return t.end+1<=e*o?[t,void 0]:[{start:t.start,end:e*o-1,label:t.label},{start:e*o,end:t.end,label:t.label}]},"getNextFittingBlock"),K={parse:n(async t=>{const e=await N("packet",t);x.debug(e),q(e)},"parse")},R=n((t,e,o,i)=>{const s=i.db,a=s.getConfig(),{rowHeight:r,paddingY:p,bitWidth:b,bitsPerRow:c}=a,m=s.getPacket(),l=s.getDiagramTitle(),g=r+p,d=g*(m.length+1)-(l?0:r),k=b*c+2,f=D(e);f.attr("viewbox",`0 0 ${k} ${d}`),T(f,d,k,a.useMaxWidth);for(const[y,$]of m.entries())U(f,$,y,a);f.append("text").text(l).attr("x",k/2).attr("y",d-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),U=n((t,e,o,{rowHeight:i,paddingX:s,paddingY:a,bitWidth:r,bitsPerRow:p,showBits:b})=>{const c=t.append("g"),m=o*(i+a)+a;for(const l of e){const g=l.start%p*r+1,d=(l.end-l.start+1)*r-s;if(c.append("rect").attr("x",g).attr("y",m).attr("width",d).attr("height",i).attr("class","packetBlock"),c.append("text").attr("x",g+d/2).attr("y",m+i/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(l.label),!b)continue;const k=l.end===l.start,f=m-2;c.append("text").attr("x",g+(k?d/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(l.start),k||c.append("text").attr("x",g+d).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(l.end)}},"drawWord"),X={draw:R},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J=n(({packet:t}={})=>{const e=v(j,t);return`
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
	`},"styles"),dt={parser:K,db:u,renderer:X,styles:J};export{dt as diagram};
