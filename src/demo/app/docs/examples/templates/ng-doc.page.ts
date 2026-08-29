import { NgDocPage } from '@ng-doc/core';
import { TemplateClearExampleComponent } from '@examples/template-clear-example/template-clear-example.component';
import { TemplateCollapseExampleComponent } from '@examples/template-collapse-example/template-collapse-example.component';
import { TemplateDisplayExampleComponent } from '@examples/template-display-example/template-display-example.component';
import { TemplateHeaderFooterExampleComponent } from '@examples/template-header-footer-example/template-header-footer-example.component';
import { TemplateLabelExampleComponent } from '@examples/template-label-example/template-label-example.component';
import { TemplateLoadingExampleComponent } from '@examples/template-loading-example/template-loading-example.component';
import { TemplateOptgroupExampleComponent } from '@examples/template-optgroup-example/template-optgroup-example.component';
import { TemplateOptionExampleComponent } from '@examples/template-option-example/template-option-example.component';
import { TemplatePlaceholderExampleComponent } from '@examples/template-placeholder-example/template-placeholder-example.component';
import { TemplateSearchExampleComponent } from '@examples/template-search-example/template-search-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const TemplatesPage: NgDocPage = {
	title: 'Templates',
	mdFile: './index.md',
	order: 6,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		TemplateLabelExampleComponent,
		TemplatePlaceholderExampleComponent,
		TemplateOptionExampleComponent,
		TemplateOptgroupExampleComponent,
		TemplateHeaderFooterExampleComponent,
		TemplateDisplayExampleComponent,
		TemplateSearchExampleComponent,
		TemplateLoadingExampleComponent,
		TemplateClearExampleComponent,
		TemplateCollapseExampleComponent,
	},
};

export default TemplatesPage;
