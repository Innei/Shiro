import{p as N}from"./chunk-4BMEZGHF-CPJj9f2Z.js";import{_ as i,g as B,s as U,a as q,b as V,q as Z,p as j,l as C,c as H,C as J,G as K,I as Q,d as X,y as Y,E as tt}from"./mermaid.core-DXMC9S04.js";import{p as et}from"./radar-MK3ICKWK-CIT_og4A.js";import"./isEmpty-C2NQZFK9.js";import{o as at}from"./ordinal-Cboi1Yqb.js";import{d as z}from"./arc-B-Pz5mTM.js";import{d as rt}from"./pie-Cqub-64Z.js";import"./index-CaQNHPqR.js";import"./owner-EYyAWlgp.js";import"./line-D5asVbEF.js";import"./array-BKyUJesY.js";import"./path-CbwjOpE9.js";import"./_baseUniq-C0asizYL.js";import"./_basePickBy-DzHu_GpB.js";import"./has-CVu40qOM.js";import"./clone-lQlUZaTE.js";import"./init-Gi6I4Gst.js";var it=tt.pie,D={sections:new Map,showData:!1},f=D.sections,w=D.showData,ot=structuredClone(it),st=i(()=>structuredClone(ot),"getConfig"),nt=i(()=>{f=new Map,w=D.showData,Y()},"clear"),lt=i(({label:t,value:e})=>{f.has(t)||(f.set(t,e),C.debug(`added new section: ${t}, with value: ${e}`))},"addSection"),ct=i(()=>f,"getSections"),pt=i(t=>{w=t},"setShowData"),dt=i(()=>w,"getShowData"),G={getConfig:st,clear:nt,setDiagramTitle:j,getDiagramTitle:Z,setAccTitle:V,getAccTitle:q,setAccDescription:U,getAccDescription:B,addSection:lt,getSections:ct,setShowData:pt,getShowData:dt},gt=i((t,e)=>{N(t,e),e.setShowData(t.showData),t.sections.map(e.addSection)},"populateDb"),mt={parse:i(async t=>{const e=await et("pie",t);C.debug(e),gt(e,G)},"parse")},ut=i(t=>`
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
`,"getStyles"),ft=ut,ht=i(t=>{const e=[...t.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,n)=>n.value-o.value);return rt().value(o=>o.value)(e)},"createPieArcs"),St=i((t,e,F,o)=>{C.debug(`rendering pie chart
`+t);const n=o.db,y=H(),T=J(n.getConfig(),y.pie),$=40,s=18,d=4,c=450,h=c,S=K(e),l=S.append("g");l.attr("transform","translate("+h/2+","+c/2+")");const{themeVariables:a}=y;let[A]=Q(a.pieOuterStrokeWidth);A??=2;const _=T.textPosition,g=Math.min(h,c)/2-$,W=z().innerRadius(0).outerRadius(g),I=z().innerRadius(g*_).outerRadius(g*_);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+A/2).attr("class","pieOuterCircle");const E=n.getSections(),v=ht(E),M=[a.pie1,a.pie2,a.pie3,a.pie4,a.pie5,a.pie6,a.pie7,a.pie8,a.pie9,a.pie10,a.pie11,a.pie12],p=at(M);l.selectAll("mySlices").data(v).enter().append("path").attr("d",W).attr("fill",r=>p(r.data.label)).attr("class","pieCircle");let b=0;E.forEach(r=>{b+=r}),l.selectAll("mySlices").data(v).enter().append("text").text(r=>(r.data.value/b*100).toFixed(0)+"%").attr("transform",r=>"translate("+I.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),l.append("text").text(n.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const x=l.selectAll(".legend").data(p.domain()).enter().append("g").attr("class","legend").attr("transform",(r,m)=>{const u=s+d,P=u*p.domain().length/2,R=12*s,L=m*u-P;return"translate("+R+","+L+")"});x.append("rect").attr("width",s).attr("height",s).style("fill",p).style("stroke",p),x.data(v).append("text").attr("x",s+d).attr("y",s-d).text(r=>{const{label:m,value:u}=r.data;return n.getShowData()?`${m} [${u}]`:m});const O=Math.max(...x.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),k=h+$+s+d+O;S.attr("viewBox",`0 0 ${k} ${c}`),X(S,c,k,T.useMaxWidth)},"draw"),vt={draw:St},Mt={parser:mt,db:G,renderer:vt,styles:ft};export{Mt as diagram};
