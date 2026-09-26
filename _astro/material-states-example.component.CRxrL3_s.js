import{$t as e,Qt as t,Y as n,Zt as r,_t as i,at as a,it as o,jt as s,qt as c,rt as l,vt as u}from"./common.25e7-6ky.js";import{_ as d,m as f,t as p,u as m}from"./public-api.waqTmbx1.js";var h=class h{constructor(){this.cities=[{id:1,name:`New York`},{id:2,name:`London`},{id:3,name:`Paris`},{id:4,name:`Tokyo`},{id:5,name:`New Delhi`}],this.selectedOutline=this.cities[1],this.selectedFill=this.cities[1],this.selectedOutlineDisabled=this.cities[0],this.selectedFillDisabled=this.cities[0]}static{this.ɵfac=function(e){return new(e||h)}}static{this.ɵcmp=a({type:h,selectors:[[`ng-material-states-example`]],decls:20,vars:12,consts:[[1,`form-row`],[1,`form-group`,`col-md-6`],[`for`,`material-outline-clearable`],[`id`,`material-outline-clearable`,`appearance`,`outline`,`bindLabel`,`name`,`placeholder`,`Select city`,3,`ngModelChange`,`items`,`clearable`,`ngModel`],[`for`,`material-fill-clearable`],[`id`,`material-fill-clearable`,`appearance`,`fill`,`bindLabel`,`name`,`placeholder`,`Select city`,3,`ngModelChange`,`items`,`clearable`,`ngModel`],[`for`,`material-outline-disabled`],[`id`,`material-outline-disabled`,`appearance`,`outline`,`bindLabel`,`name`,`placeholder`,`Select city`,3,`ngModelChange`,`items`,`disabled`,`ngModel`],[`for`,`material-fill-disabled`],[`id`,`material-fill-disabled`,`appearance`,`fill`,`bindLabel`,`name`,`placeholder`,`Select city`,3,`ngModelChange`,`items`,`disabled`,`ngModel`]],template:function(a,d){a&1&&(u(0,`p`),c(1,`Disabled and clearable states for outline and fill appearances (Material theme).`),i(),u(2,`div`,0)(3,`div`,1)(4,`label`,2),c(5,`Outline clearable`),i(),u(6,`ng-select`,3),o(),t(`ngModelChange`,function(e){return r(d.selectedOutline,e)||(d.selectedOutline=e),e}),i()(),u(7,`div`,1)(8,`label`,4),c(9,`Fill clearable`),i(),u(10,`ng-select`,5),o(),t(`ngModelChange`,function(e){return r(d.selectedFill,e)||(d.selectedFill=e),e}),i()()(),u(11,`div`,0)(12,`div`,1)(13,`label`,6),c(14,`Outline disabled`),i(),u(15,`ng-select`,7),o(),t(`ngModelChange`,function(e){return r(d.selectedOutlineDisabled,e)||(d.selectedOutlineDisabled=e),e}),i()(),u(16,`div`,1)(17,`label`,8),c(18,`Fill disabled`),i(),u(19,`ng-select`,9),o(),t(`ngModelChange`,function(e){return r(d.selectedFillDisabled,e)||(d.selectedFillDisabled=e),e}),i()()()),a&2&&(n(6),s(`items`,d.cities)(`clearable`,!0),e(`ngModel`,d.selectedOutline),l(),n(4),s(`items`,d.cities)(`clearable`,!0),e(`ngModel`,d.selectedFill),l(),n(5),s(`items`,d.cities)(`disabled`,!0),e(`ngModel`,d.selectedOutlineDisabled),l(),n(4),s(`items`,d.cities)(`disabled`,!0),e(`ngModel`,d.selectedFillDisabled),l())},dependencies:[m,f,d,p],styles:[`[_nghost-%COMP%]     :root {
  --%NS%ng-select-highlight: #3f51b5;
  --%NS%ng-select-primary-text: rgba(0, 0, 0, 0.87);
  --%NS%ng-select-primary-light-text: rgba(255, 255, 255, 0.87);
  --%NS%ng-select-secondary-text: rgba(0, 0, 0, 0.54);
  --%NS%ng-select-secondary-light-text: rgba(255, 255, 255, 0.54);
  --%NS%ng-select-disabled-text: rgba(0, 0, 0, 0.38);
  --%NS%ng-select-divider: rgba(0, 0, 0, 0.12);
  --%NS%ng-select-bg: #ffffff;
  --%NS%ng-select-underline: rgba(0, 0, 0, 0.42);
  --%NS%ng-select-marked: rgba(0, 0, 0, 0.04);
  --%NS%ng-select-disabled-value-text: rgba(0, 0, 0, 0.26);
  --%NS%ng-select-fill-bg: rgba(0, 0, 0, 0.06);
  --%NS%ng-select-fill-disabled-bg: rgba(0, 0, 0, 0.02);
}
[_nghost-%COMP%]     .ng-select {
  padding-bottom: 1.25em;
}
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container:after {
  border-bottom-color: transparent;
  background-image: linear-gradient(to right, var(--%NS%ng-select-underline, rgba(0, 0, 0, 0.42)) 0%, var(--%NS%ng-select-underline, rgba(0, 0, 0, 0.42)) 33%, transparent 0%);
  background-size: 4px 1px;
  background-repeat: repeat-x;
}
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container.ng-appearance-fill {
  background-color: var(--%NS%ng-select-fill-disabled-bg, rgba(0, 0, 0, 0.02));
}
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container.ng-appearance-fill:after {
  background-image: linear-gradient(to right, var(--%NS%ng-select-underline, rgba(0, 0, 0, 0.42)) 0%, var(--%NS%ng-select-underline, rgba(0, 0, 0, 0.42)) 33%, transparent 0%);
  background-size: 4px 1px;
  background-repeat: repeat-x;
  border-bottom: none;
}
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container.ng-appearance-outline .ng-notched-outline, [_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container.ng-appearance-outline:hover .ng-notched-outline {
  --%NS%ng-select-outline-width: 1px;
  color: var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
}
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container.ng-appearance-outline .ng-notched-outline-leading, 
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container.ng-appearance-outline .ng-notched-outline-notch, 
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container.ng-appearance-outline .ng-notched-outline-trailing {
  border-style: dotted;
}
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-value {
  color: var(--%NS%ng-select-disabled-text, rgba(0, 0, 0, 0.38));
}
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-placeholder {
  color: var(--%NS%ng-select-disabled-text, rgba(0, 0, 0, 0.38));
}
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-arrow-wrapper .ng-arrow, 
[_nghost-%COMP%]     .ng-select.ng-select-disabled .ng-clear-wrapper {
  color: var(--%NS%ng-select-disabled-text, rgba(0, 0, 0, 0.38));
}
[_nghost-%COMP%]     .ng-select.ng-select-focused .ng-select-container:after {
  border-color: var(--%NS%ng-select-highlight, #3f51b5);
  border-width: 2px;
}
[_nghost-%COMP%]     .ng-select.ng-select-focused .ng-select-container.ng-appearance-outline .ng-notched-outline, [_nghost-%COMP%]     .ng-select.ng-select-focused .ng-select-container.ng-appearance-outline:hover .ng-notched-outline {
  --%NS%ng-select-outline-width: 2px;
  color: var(--%NS%ng-select-highlight, #3f51b5);
}
[_nghost-%COMP%]     .ng-select.ng-select-focused .ng-select-container.ng-appearance-fill:after {
  border-color: var(--%NS%ng-select-highlight, #3f51b5);
  border-width: 0 0 2px;
}
[_nghost-%COMP%]     .ng-select.ng-select-focused .ng-select-container .ng-value-container .ng-placeholder {
  transform: translateY(-1.28125em) scale(0.75) perspective(100px) translateZ(0.001px);
  color: var(--%NS%ng-select-highlight, #3f51b5);
}
[_nghost-%COMP%]     .ng-select.ng-select-focused .ng-select-container .ng-arrow-wrapper .ng-arrow {
  color: var(--%NS%ng-select-highlight, #3f51b5);
}
[_nghost-%COMP%]     .ng-select .ng-has-value .ng-placeholder, [_nghost-%COMP%]     .ng-select.ng-select-filtered .ng-select-container .ng-placeholder {
  display: initial;
}
[_nghost-%COMP%]     .ng-select .ng-has-value .ng-placeholder, [_nghost-%COMP%]     .ng-select.ng-select-opened .ng-placeholder {
  transform: translateY(-1.28125em) scale(0.75) perspective(100px) translateZ(0.001px);
}
[_nghost-%COMP%]     .ng-select.ng-select-opened .ng-select-container.ng-appearance-outline .ng-notched-outline-notch {
  border-top-width: 0;
}
[_nghost-%COMP%]     .ng-select .ng-select-container {
  color: var(--%NS%ng-select-primary-text, rgba(0, 0, 0, 0.87));
  align-items: baseline;
  min-height: 51.5px;
}
[_nghost-%COMP%]     .ng-select .ng-select-container:after {
  border-bottom: thin solid var(--%NS%ng-select-underline, rgba(0, 0, 0, 0.42));
  content: "";
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  transition: border-color 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline {
  padding: 0 0.5em;
  min-height: 60px;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline:after {
  display: none;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline:hover .ng-notched-outline {
  --%NS%ng-select-outline-width: 2px;
  color: var(--%NS%ng-select-primary-text, rgba(0, 0, 0, 0.87));
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline {
  --%NS%ng-select-outline-width: 1px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100% - 0.5em);
  display: flex;
  pointer-events: none;
  color: var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  transition: color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline-leading, 
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline-notch, 
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline-trailing {
  box-sizing: border-box;
  height: 100%;
  border: 0 solid currentColor;
  transition: border-width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline-leading {
  border-width: var(--%NS%ng-select-outline-width) 0 var(--%NS%ng-select-outline-width) var(--%NS%ng-select-outline-width);
  border-radius: 5px 0 0 5px;
  width: 0.5em;
  flex-shrink: 0;
}
[_nghost-%COMP%]     [dir=rtl] .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline-leading {
  border-width: var(--%NS%ng-select-outline-width) var(--%NS%ng-select-outline-width) var(--%NS%ng-select-outline-width) 0;
  border-radius: 0 5px 5px 0;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline-notch {
  border-width: var(--%NS%ng-select-outline-width) 0;
  flex-shrink: 0;
  max-width: calc(100% - 1em);
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline-trailing {
  border-width: var(--%NS%ng-select-outline-width) var(--%NS%ng-select-outline-width) var(--%NS%ng-select-outline-width) 0;
  border-radius: 0 5px 5px 0;
  flex-grow: 1;
}
[_nghost-%COMP%]     [dir=rtl] .ng-select .ng-select-container.ng-appearance-outline .ng-notched-outline-trailing {
  border-width: var(--%NS%ng-select-outline-width) 0 var(--%NS%ng-select-outline-width) var(--%NS%ng-select-outline-width);
  border-radius: 5px 0 0 5px;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline.ng-has-value .ng-notched-outline-notch {
  border-top-width: 0;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-placeholder {
  padding: 0 0.25em;
  z-index: 1;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-value {
  padding-left: 0.25em;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-outline .ng-value-container .ng-input {
  top: 1.28125em;
  bottom: auto;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-fill {
  background-color: var(--%NS%ng-select-fill-bg, rgba(0, 0, 0, 0.06));
  border-radius: 4px 4px 0 0;
  padding: 0 0.75em;
  min-height: 56px;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-fill:after {
  border-bottom: thin solid var(--%NS%ng-select-underline, rgba(0, 0, 0, 0.42));
  content: "";
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  transition: border-color 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-fill:hover:after {
  border-bottom-color: var(--%NS%ng-select-primary-text, rgba(0, 0, 0, 0.87));
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-fill .ng-placeholder {
  padding: 0 0.25em;
  background-color: transparent;
  z-index: 1;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-fill .ng-value-container {
  padding-top: 0.5625em;
  border-top-width: 1.09375em;
}
[_nghost-%COMP%]     .ng-select .ng-select-container.ng-appearance-fill .ng-value {
  padding-left: 0.25em;
}
[_nghost-%COMP%]     .ng-select .ng-select-container .ng-value-container {
  align-items: stretch;
  padding: 0.4375em 0;
  border-top: 0.84375em solid transparent;
}
[_nghost-%COMP%]     .ng-select .ng-select-container .ng-value-container .ng-placeholder {
  position: absolute;
  color: var(--%NS%ng-select-secondary-text, rgba(0, 0, 0, 0.54));
  transform-origin: left 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
[_nghost-%COMP%]     [dir=rtl] .ng-select .ng-select-container .ng-value-container .ng-placeholder {
  transform-origin: right 0;
}
[_nghost-%COMP%]     .ng-select .ng-select-container .ng-value-container .ng-input {
  bottom: 0.4375em;
}
[_nghost-%COMP%]     .ng-select.ng-select-single .ng-select-container.ng-appearance-fill .ng-arrow-wrapper {
  bottom: 15px;
}
[_nghost-%COMP%]     .ng-select.ng-select-single .ng-select-container.ng-appearance-fill .ng-clear-wrapper {
  bottom: 12px;
}
[_nghost-%COMP%]     .ng-select.ng-select-single .ng-select-container.ng-appearance-outline .ng-arrow-wrapper {
  bottom: 17px;
}
[_nghost-%COMP%]     .ng-select.ng-select-single .ng-select-container.ng-appearance-outline .ng-clear-wrapper {
  bottom: 14px;
}
[_nghost-%COMP%]     .ng-select.ng-select-single .ng-select-container .ng-arrow-wrapper {
  align-self: flex-end;
  bottom: 9px;
}
[_nghost-%COMP%]     .ng-select.ng-select-single .ng-select-container .ng-clear-wrapper {
  align-self: flex-end;
  bottom: 7px;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple.ng-select-disabled .ng-select-container .ng-value-container .ng-value {
  background-color: var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  color: var(--%NS%ng-select-disabled-value-text, rgba(0, 0, 0, 0.26));
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple.ng-select-disabled .ng-appearance-fill:after, [_nghost-%COMP%]     .ng-select.ng-select-multiple.ng-select-disabled .ng-appearance-fill:hover:after {
  background-image: linear-gradient(to right, var(--%NS%ng-select-underline, rgba(0, 0, 0, 0.42)) 0%, var(--%NS%ng-select-underline, rgba(0, 0, 0, 0.42)) 33%, transparent 0%);
  background-size: 4px 1px;
  background-repeat: repeat-x;
  border-bottom: none;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple.ng-select-disabled .ng-appearance-outline .ng-notched-outline, [_nghost-%COMP%]     .ng-select.ng-select-multiple.ng-select-disabled .ng-appearance-outline:hover .ng-notched-outline {
  --%NS%ng-select-outline-width: 1px;
  color: var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple.ng-select-disabled .ng-appearance-outline .ng-notched-outline-leading, 
[_nghost-%COMP%]     .ng-select.ng-select-multiple.ng-select-disabled .ng-appearance-outline .ng-notched-outline-notch, 
[_nghost-%COMP%]     .ng-select.ng-select-multiple.ng-select-disabled .ng-appearance-outline .ng-notched-outline-trailing {
  border-style: dotted;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-appearance-fill.ng-has-value .ng-arrow-wrapper, 
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-appearance-fill.ng-has-value .ng-clear-wrapper {
  border-top: none;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-appearance-fill .ng-arrow-wrapper {
  top: 2px;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-appearance-fill .ng-clear-wrapper {
  top: 6px;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-appearance-outline.ng-has-value .ng-arrow-wrapper, 
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-appearance-outline.ng-has-value .ng-clear-wrapper {
  border-top: none;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-appearance-outline .ng-arrow-wrapper {
  top: 0;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-appearance-outline .ng-clear-wrapper {
  top: 4px;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value {
  background-color: var(--%NS%ng-select-highlight, #3f51b5);
  border-radius: 2px;
  color: var(--%NS%ng-select-bg, #ffffff);
  padding: 2px 5px;
  margin: 0 0.4375em 0.4375em 0;
}
[_nghost-%COMP%]     [dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value {
  margin: 0 0 0.4375em 0.4375em;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled {
  background-color: var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  color: var(--%NS%ng-select-disabled-value-text, rgba(0, 0, 0, 0.26));
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-label {
  font-size: 14px;
  font-weight: 500;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon {
  color: var(--%NS%ng-select-secondary-light-text, rgba(255, 255, 255, 0.54));
  padding-right: 5px;
}
[_nghost-%COMP%]     [dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon {
  padding-left: 5px;
  padding-right: 0;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon:hover {
  color: var(--%NS%ng-select-primary-light-text, rgba(255, 255, 255, 0.87));
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-input {
  line-height: 1.375em;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-has-value {
  align-items: center;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-has-value .ng-value-container {
  padding-bottom: 0;
  padding-top: 0.1875em;
}
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-has-value .ng-clear-wrapper, 
[_nghost-%COMP%]     .ng-select.ng-select-multiple .ng-select-container.ng-has-value .ng-arrow-wrapper {
  border-top: 0.84375em solid transparent;
}
[_nghost-%COMP%]     .ng-select .ng-clear-wrapper {
  color: var(--%NS%ng-select-secondary-text, rgba(0, 0, 0, 0.54));
}
[_nghost-%COMP%]     .ng-select .ng-clear-wrapper:hover {
  color: var(--%NS%ng-select-primary-text, rgba(0, 0, 0, 0.87));
}
[_nghost-%COMP%]     .ng-select .ng-clear-wrapper:focus {
  color: var(--%NS%ng-select-primary-text, rgba(0, 0, 0, 0.87));
  outline: none;
}
[_nghost-%COMP%]     .ng-select .ng-arrow-wrapper {
  bottom: 2px;
}
[_nghost-%COMP%]     .ng-select .ng-arrow-wrapper .ng-arrow {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  margin: 0 4px;
  color: var(--%NS%ng-select-secondary-text, rgba(0, 0, 0, 0.54));
}
[_nghost-%COMP%]     .ng-select .ng-spinner-zone {
  top: 3px;
}
[_nghost-%COMP%]     .ng-dropdown-panel {
  background: var(--%NS%ng-select-bg, #ffffff);
}
[_nghost-%COMP%]     .ng-dropdown-panel.ng-select-top {
  box-shadow: 0 -5px 5px -3px rgba(0, 0, 0, 0.2), 0 -8px 10px 1px rgba(0, 0, 0, 0.14), 0 -3px 14px 2px var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
}
[_nghost-%COMP%]     .ng-dropdown-panel.ng-select-right {
  box-shadow: 0 -5px 5px -3px rgba(0, 0, 0, 0.2), 0 -8px 10px 1px rgba(0, 0, 0, 0.14), 0 -3px 14px 2px var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  margin-left: 4px;
}
[_nghost-%COMP%]     .ng-dropdown-panel.ng-select-bottom {
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
}
[_nghost-%COMP%]     .ng-dropdown-panel.ng-select-left {
  box-shadow: 0 -5px 5px -3px rgba(0, 0, 0, 0.2), 0 -8px 10px 1px rgba(0, 0, 0, 0.14), 0 -3px 14px 2px var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  margin-right: 4px;
}
[_nghost-%COMP%]     .ng-dropdown-panel.multiple .ng-option.selected {
  background: var(--%NS%ng-select-bg, #ffffff);
}
[_nghost-%COMP%]     .ng-dropdown-panel.multiple .ng-option.marked {
  background: var(--%NS%ng-select-marked, rgba(0, 0, 0, 0.04));
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-header {
  border-bottom: 1px solid var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  padding: 0 16px;
  line-height: 3em;
  min-height: 3em;
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-footer {
  border-top: 1px solid var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  padding: 0 16px;
  line-height: 3em;
  min-height: 3em;
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup {
  user-select: none;
  cursor: pointer;
  line-height: 3em;
  height: 3em;
  padding: 0 16px;
  color: var(--%NS%ng-select-secondary-text, rgba(0, 0, 0, 0.54));
  font-weight: 500;
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-marked {
  background: var(--%NS%ng-select-marked, rgba(0, 0, 0, 0.04));
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-disabled {
  cursor: default;
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-selected {
  background: var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  color: var(--%NS%ng-select-highlight, #3f51b5);
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {
  line-height: 3em;
  min-height: 3em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 16px;
  text-decoration: none;
  position: relative;
  color: var(--%NS%ng-select-primary-text, rgba(0, 0, 0, 0.87));
  text-align: left;
}
[_nghost-%COMP%]     [dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {
  text-align: right;
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {
  background: var(--%NS%ng-select-marked, rgba(0, 0, 0, 0.04));
  color: var(--%NS%ng-select-primary-text, rgba(0, 0, 0, 0.87));
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected {
  background: var(--%NS%ng-select-divider, rgba(0, 0, 0, 0.12));
  color: var(--%NS%ng-select-highlight, #3f51b5);
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-disabled {
  color: var(--%NS%ng-select-disabled-text, rgba(0, 0, 0, 0.38));
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child {
  padding-left: 32px;
}
[_nghost-%COMP%]     [dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child {
  padding-right: 32px;
  padding-left: 0;
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label {
  padding-right: 5px;
}
[_nghost-%COMP%]     [dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label {
  padding-left: 5px;
  padding-right: 0;
}
[_nghost-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label {
  font-size: 80%;
  font-weight: 400;
  color: var(--%NS%ng-select-disabled-text, rgba(0, 0, 0, 0.38));
}`],changeDetection:1})}};export{h as MaterialStatesExampleComponent};