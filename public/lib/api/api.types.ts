import { FormSchema } from '@redactie/form-renderer-module';
import { SiteResponse } from '@redactie/sites-module';
import { LoadingState, TenantContextValue } from '@redactie/utils';
import { FormikValues } from 'formik';
import { Context } from 'react';

import { ContentInfoTooltip } from '../components/ContentInfoTooltip';
import { ContentSelectProps } from '../components/Fields/ContentSelect/ContentSelect.types';
import { PagingSchema } from '../content.types';
import { CONTENT_STATUS_API_MAP, contentApiService, ModuleValue } from '../services/content';
import {
	ContentTypeFieldSchema,
	ContentTypeSchema,
} from '../services/contentTypes/contentTypes.service.types';
import { ExternalActionOptions } from '../store/api/externalActions';
import {
	ExternalCompartmentAfterSubmitFn,
	ExternalCompartmentBeforeSubmitFn,
	ExternalCompartmentOptions,
} from '../store/api/externalCompartments';
import { ExternalTabOptions } from '../store/api/externalTabs';
import { ContentFacade, ContentModel } from '../store/content';
import { ContentTypeModel } from '../store/contentTypes';
import { ExternalActionProps } from '../views/ContentDetail/ContentDetail.types';
import { ExternalTabProps } from '../views/ContentDetailExternal/ContentDetailExternal.types';

import { registerContentDetailTab } from './registerContentDetailTab';
export { CompartmentProps } from '../views/ContentForm/ContentForm.types';
export {
	ModuleSettings,
	ModuleValue,
} from '../store/api/externalCompartments/externalCompartments.model';
export { ContentSchema, ContentStatus } from '../services/content/content.service.types';

export {
	ContentModel,
	ContentInfoTooltip,
	ContentTypeModel,
	ContentTypeSchema,
	ContentTypeFieldSchema,
	ExternalActionOptions,
	ExternalActionProps,
	ExternalCompartmentOptions,
	ExternalCompartmentAfterSubmitFn,
	ExternalCompartmentBeforeSubmitFn,
	CONTENT_STATUS_API_MAP,
	ExternalTabProps,
	ExternalTabOptions,
	contentApiService,
	ContentSelectProps,
};

export interface ContentAPI {
	store: {
		content: {
			facade: Pick<ContentFacade, 'getContentItem' | 'getContentItemBySlug' | 'getContent'>;
			service: typeof contentApiService;
		};
	};
	hooks: {
		useContent: () => [LoadingState, ContentModel[], PagingSchema | null | undefined];
	};

	ContentInfoTooltip: typeof ContentInfoTooltip;
	registerContentDetailCompartment: <M = ModuleValue>(
		name: string,
		options: ExternalCompartmentOptions<M>
	) => void;
	getViewPropsByCT: (
		contentType: ContentTypeSchema,
		values: FormikValues
	) => {
		schema: FormSchema;
		values: FormikValues;
	};
	getCTUrlPattern: (
		contentType: ContentTypeSchema,
		activeLanguage: string,
		moduleConfigName: string,
		site?: SiteResponse
	) => string;
	registerContentDetailAction: (name: string, options: ExternalActionOptions) => void;
	registerContentDetailTab: typeof registerContentDetailTab;
	contentTenantContext: Context<TenantContextValue>;
}
