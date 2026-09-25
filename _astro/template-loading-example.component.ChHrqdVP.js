import{Gt as e,Y as t,_t as n,at as r,jt as i,pt as a,qt as o,vt as s}from"./common.25e7-6ky.js";import{P as c,t as l}from"./public-api.waqTmbx1.js";function u(e,t){e&1&&(s(0,`div`,2),a(1,`div`)(2,`div`)(3,`div`)(4,`div`),n())}var d=class a{constructor(){this.cities=[{id:1,name:`New York`,avatar:`//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x`},{id:2,name:`London`,avatar:`//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15`},{id:3,name:`Beijing`,avatar:`//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15`},{id:4,name:`New Delhi`,avatar:`//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x`},{id:5,name:`Paris`,avatar:`//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15`}]}ngOnInit(){}static{this.ɵfac=function(e){return new(e||a)}}static{this.ɵcmp=r({type:a,selectors:[[`ng-template-loading-example`]],decls:6,vars:2,consts:[[`bindLabel`,`name`,`bindValue`,`name`,3,`loading`,`items`],[`ng-loadingspinner-tmp`,``],[1,`lds-ellipsis`]],template:function(r,a){r&1&&(s(0,`p`),o(1,`Custom loading spinner using `),s(2,`b`),o(3,`ng-loadingspinner-tmp`),n()(),s(4,`ng-select`,0),e(5,u,5,0,`ng-template`,1),n()),r&2&&(t(4),i(`loading`,!0)(`items`,a.cities))},dependencies:[l,c],styles:[`.lds-ellipsis[_ngcontent-%COMP%] {
  display: inline-block;
  position: relative;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.lds-ellipsis[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {
  position: absolute;
  top: 14px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c2c2c2;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(1) {
  left: -9px;
  animation: _ngcontent-%COMP%_lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2) {
  left: -10px;
  animation: _ngcontent-%COMP%_lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(3) {
  left: 2px;
  animation: _ngcontent-%COMP%_lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(4) {
  left: 24px;
  animation: _ngcontent-%COMP%_lds-ellipsis3 0.6s infinite;
}

@keyframes _ngcontent-%COMP%_lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes _ngcontent-%COMP%_lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes _ngcontent-%COMP%_lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}`],changeDetection:1})}};export{d as TemplateLoadingExampleComponent};