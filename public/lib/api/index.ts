import Core from '@redactie/redactie-core';
import { TenantContext } from '@redactie/utils';

import { getViewPropsByCT } from '../helpers/getViewPropsByCT';

import { ContentAPI } from './api.types';
import { registerContentDetailAction } from './registerContentDetailAction';
import { registerContentDetailCompartment } from './registerContentDetailCompartment';
import { registerContentDetailTab } from './registerContentDetailTab';
import { store } from './store';
import { components } from './components';

export const registerContentAPI = (): void => {
	const api: ContentAPI = {
		registerContentDetailCompartment,
		registerContentDetailAction,
		registerContentDetailTab,
		getViewPropsByCT,
		store,
		components,
		contentTenantContext: TenantContext,
	};

	Core.modules.exposeModuleApi('content-module', api);
};
