import{p as B}from"./chunk-RYO7GUH3-C1ApbpHi.js";import{A as U,p as j,q,s as H,g as V,c as Z,b as J,_ as i,l as C,t as K,d as Q,B as X,F as Y,H as tt,j as et}from"./mermaid.core-CNCQlSnA.js";import{p as at}from"./gitGraph-YCYPL57B-B6owdib-.js";import"./isEmpty-DrOE0CRk.js";import{o as rt}from"./ordinal-Cboi1Yqb.js";import{d as z}from"./arc-DEIJu9Le.js";import{d as it}from"./pie-D0ygHMOU.js";import"./index-DzXv2h3l.js";import"./owner-B8l3KTfh.js";import"./StyledButton-_Y_F-r2m.js";import"./proxy-eQ4Uy79O.js";import"./line-Ci9EUk7u.js";import"./array-BKyUJesY.js";import"./path-CbwjOpE9.js";import"./_baseUniq-CQvDY-0n.js";import"./_basePickBy-DHAxAhpL.js";import"./clone-D6aGXHSA.js";import"./init-Gi6I4Gst.js";var F=U.pie,D={sections:new Map,showData:!1,config:F},u=D.sections,w=D.showData,ot=structuredClone(F),st=i(()=>structuredClone(ot),"getConfig"),nt=i(()=>{u=new Map,w=D.showData,K()},"clear"),lt=i(({label:t,value:e})=>{u.has(t)||(u.set(t,e),C.debug(`added new section: ${t}, with value: ${e}`))},"addSection"),ct=i(()=>u,"getSections"),pt=i(t=>{w=t},"setShowData"),dt=i(()=>w,"getShowData"),G={getConfig:st,clear:nt,setDiagramTitle:j,getDiagramTitle:q,setAccTitle:H,getAccTitle:V,setAccDescription:Z,getAccDescription:J,addSection:lt,getSections:ct,setShowData:pt,getShowData:dt},gt=i((t,e)=>{B(t,e),e.setShowData(t.showData),t.sections.map(e.addSection)},"populateDb"),mt={parse:i(async t=>{const e=await at("pie",t);C.debug(e),gt(e,G)},"parse")},ft=i(t=>`
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
`,"getStyles"),ut=ft,ht=i(t=>{const e=[...t.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,n)=>n.value-o.value);return it().value(o=>o.value)(e)},"createPieArcs"),St=i((t,e,W,o)=>{C.debug(`rendering pie chart
`+t);const n=o.db,y=Q(),T=X(n.getConfig(),y.pie),$=40,s=18,d=4,l=450,h=l,S=Y(e),c=S.append("g");c.attr("transform","translate("+h/2+","+l/2+")");const{themeVariables:a}=y;let[A]=tt(a.pieOuterStrokeWidth);A??=2;const _=T.textPosition,g=Math.min(h,l)/2-$,M=z().innerRadius(0).outerRadius(g),O=z().innerRadius(g*_).outerRadius(g*_);c.append("circle").attr("cx",0).attr("cy",0).attr("r",g+A/2).attr("class","pieOuterCircle");const b=n.getSections(),v=ht(b),P=[a.pie1,a.pie2,a.pie3,a.pie4,a.pie5,a.pie6,a.pie7,a.pie8,a.pie9,a.pie10,a.pie11,a.pie12],p=rt(P);c.selectAll("mySlices").data(v).enter().append("path").attr("d",M).attr("fill",r=>p(r.data.label)).attr("class","pieCircle");let E=0;b.forEach(r=>{E+=r}),c.selectAll("mySlices").data(v).enter().append("text").text(r=>(r.data.value/E*100).toFixed(0)+"%").attr("transform",r=>"translate("+O.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(n.getDiagramTitle()).attr("x",0).attr("y",-(l-50)/2).attr("class","pieTitleText");const x=c.selectAll(".legend").data(p.domain()).enter().append("g").attr("class","legend").attr("transform",(r,m)=>{const f=s+d,I=f*p.domain().length/2,L=12*s,N=m*f-I;return"translate("+L+","+N+")"});x.append("rect").attr("width",s).attr("height",s).style("fill",p).style("stroke",p),x.data(v).append("text").attr("x",s+d).attr("y",s-d).text(r=>{const{label:m,value:f}=r.data;return n.getShowData()?`${m} [${f}]`:m});const R=Math.max(...x.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),k=h+$+s+d+R;S.attr("viewBox",`0 0 ${k} ${l}`),et(S,l,k,T.useMaxWidth)},"draw"),vt={draw:St},Pt={parser:mt,db:G,renderer:vt,styles:ut};export{Pt as diagram};
