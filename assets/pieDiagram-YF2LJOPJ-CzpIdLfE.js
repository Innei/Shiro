import{p as B}from"./chunk-TMUBEWPD-BkKsDzsW.js";import{B as U,p as j,q,s as V,g as Z,c as H,b as J,_ as i,l as C,v as K,d as Q,C as X,G as Y,I as tt,j as et}from"./mermaid.core-Bc37ecyd.js";import{p as at}from"./gitGraph-YCYPL57B-CubUW0SW.js";import"./isEmpty-C1jPZ8p9.js";import{o as rt}from"./ordinal-Cboi1Yqb.js";import{d as z}from"./arc-CychXGKA.js";import{d as it}from"./pie-B18eeAV2.js";import"./index-C8FCQPJD.js";import"./owner-Cr2WHyze.js";import"./StyledButton-KUTxOzSd.js";import"./proxy-Xh8nU2Wj.js";import"./line-DunZT52S.js";import"./array-BKyUJesY.js";import"./path-CbwjOpE9.js";import"./_baseUniq-Cr4PoKqM.js";import"./_basePickBy-CyWLllq_.js";import"./has-BgM3CcEf.js";import"./clone-BRQVr5N1.js";import"./init-Gi6I4Gst.js";var G=U.pie,D={sections:new Map,showData:!1,config:G},u=D.sections,w=D.showData,ot=structuredClone(G),st=i(()=>structuredClone(ot),"getConfig"),nt=i(()=>{u=new Map,w=D.showData,K()},"clear"),lt=i(({label:t,value:e})=>{u.has(t)||(u.set(t,e),C.debug(`added new section: ${t}, with value: ${e}`))},"addSection"),ct=i(()=>u,"getSections"),pt=i(t=>{w=t},"setShowData"),dt=i(()=>w,"getShowData"),F={getConfig:st,clear:nt,setDiagramTitle:j,getDiagramTitle:q,setAccTitle:V,getAccTitle:Z,setAccDescription:H,getAccDescription:J,addSection:lt,getSections:ct,setShowData:pt,getShowData:dt},gt=i((t,e)=>{B(t,e),e.setShowData(t.showData),t.sections.map(e.addSection)},"populateDb"),mt={parse:i(async t=>{const e=await at("pie",t);C.debug(e),gt(e,F)},"parse")},ft=i(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),ut=ft,ht=i(t=>{const e=[...t.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,n)=>n.value-o.value);return it().value(o=>o.value)(e)},"createPieArcs"),vt=i((t,e,W,o)=>{C.debug(`rendering pie chart
`+t);const n=o.db,y=Q(),T=X(n.getConfig(),y.pie),$=40,s=18,d=4,l=450,h=l,v=Y(e),c=v.append("g");c.attr("transform","translate("+h/2+","+l/2+")");const{themeVariables:a}=y;let[A]=tt(a.pieOuterStrokeWidth);A??=2;const _=T.textPosition,g=Math.min(h,l)/2-$,I=z().innerRadius(0).outerRadius(g),M=z().innerRadius(g*_).outerRadius(g*_);c.append("circle").attr("cx",0).attr("cy",0).attr("r",g+A/2).attr("class","pieOuterCircle");const b=n.getSections(),S=ht(b),O=[a.pie1,a.pie2,a.pie3,a.pie4,a.pie5,a.pie6,a.pie7,a.pie8,a.pie9,a.pie10,a.pie11,a.pie12],p=rt(O);c.selectAll("mySlices").data(S).enter().append("path").attr("d",I).attr("fill",r=>p(r.data.label)).attr("class","pieCircle");let E=0;b.forEach(r=>{E+=r}),c.selectAll("mySlices").data(S).enter().append("text").text(r=>(r.data.value/E*100).toFixed(0)+"%").attr("transform",r=>"translate("+M.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(n.getDiagramTitle()).attr("x",0).attr("y",-(l-50)/2).attr("class","pieTitleText");const x=c.selectAll(".legend").data(p.domain()).enter().append("g").attr("class","legend").attr("transform",(r,m)=>{const f=s+d,R=f*p.domain().length/2,L=12*s,N=m*f-R;return"translate("+L+","+N+")"});x.append("rect").attr("width",s).attr("height",s).style("fill",p).style("stroke",p),x.data(S).append("text").attr("x",s+d).attr("y",s-d).text(r=>{const{label:m,value:f}=r.data;return n.getShowData()?`${m} [${f}]`:m});const P=Math.max(...x.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),k=h+$+s+d+P;v.attr("viewBox",`0 0 ${k} ${l}`),et(v,l,k,T.useMaxWidth)},"draw"),St={draw:vt},Pt={parser:mt,db:F,renderer:St,styles:ut};export{Pt as diagram};
