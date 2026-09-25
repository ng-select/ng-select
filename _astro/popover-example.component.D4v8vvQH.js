import{$t as e,Qt as t,Y as n,Zt as r,_t as i,at as a,it as o,jt as s,pt as c,qt as l,rt as u,vt as d,xn as f}from"./common.25e7-6ky.js";import{_ as p,k as m,m as h,t as g,u as _}from"./public-api.waqTmbx1.js";import{t as v}from"./data.service.QFSF9W0I.js";var y=class y{constructor(){this.dataService=f(v),this.people=m(this.dataService.getPeople())}static{this.ɵfac=function(e){return new(e||y)}}static{this.ɵcmp=a({type:y,selectors:[[`ng-popover-example`]],decls:36,vars:4,consts:[[1,`alert`,`alert-warning`],[`href`,`https://developer.mozilla.org/en-US/docs/Web/API/Popover_API`,`target`,`_blank`],[1,`clipped-box`],[`bindLabel`,`name`,`placeholder`,`Select a person`,3,`ngModelChange`,`items`,`ngModel`],[1,`alert`,`alert-info`],[`href`,`https://caniuse.com/mdn-api_htmlelement_showpopover`,`target`,`_blank`]],template:function(a,f){a&1&&(d(0,`div`,0)(1,`strong`)(2,`code`),l(3,`popover`),i(),l(4,` is deprecated and has no effect.`),i(),l(5,` The dropdown panel now always renders in an Angular CDK overlay, and the CDK uses the browser's native `),d(6,`a`,1),l(7,`Popover API top layer`),i(),l(8,` automatically wherever it is supported. Remove the input from your templates.
`),i(),d(9,`p`),l(10,` Because the panel renders in the top layer, it can never be clipped by `),d(11,`code`),l(12,`overflow: hidden`),i(),l(13,` containers and never ends up behind another element's stacking context — including native dialogs and Bootstrap modals:
`),i(),d(14,`h6`),l(15,`Inside a container with `),d(16,`code`),l(17,`overflow: hidden`),i()(),d(18,`div`,2)(19,`ng-select`,3),o(),t(`ngModelChange`,function(e){return r(f.selected1,e)||(f.selected1=e),e}),i()(),c(20,`br`),d(21,`h6`),l(22,`Another clipped container — same behavior, no inputs required`),i(),d(23,`div`,2)(24,`ng-select`,3),o(),t(`ngModelChange`,function(e){return r(f.selected2,e)||(f.selected2=e),e}),i()(),c(25,`br`),d(26,`div`,4),l(27,` In browsers without the `),d(28,`a`,5),l(29,`Popover API`),i(),l(30,`, the panel falls back to the CDK overlay container (`),d(31,`code`),l(32,`z-index: 1000`),i(),l(33,`). If something on your page still paints above it, raise the container in your global styles: `),d(34,`code`),l(35,`.cdk-overlay-container { z-index: 1056; }`),i()()),a&2&&(n(19),s(`items`,f.people()),e(`ngModel`,f.selected1),u(),n(5),s(`items`,f.people()),e(`ngModel`,f.selected2),u())},dependencies:[g,_,h,p],styles:[`.clipped-box[_ngcontent-%COMP%] {
  padding: 10px;
  height: 80px;
  border: 1px solid #999;
  overflow: hidden;
}

.alert-info[_ngcontent-%COMP%] {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
}
.alert-info[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {
  padding-left: 1.2rem;
}
.alert-info[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  color: #0c5460;
}`],changeDetection:1})}};export{y as PopoverExampleComponent};