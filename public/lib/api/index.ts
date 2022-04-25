import Core from '@redactie/redactie-core';
import { TenantContext } from '@redactie/utils';

import { ContentInfoTooltip } from '../components/ContentInfoTooltip';
import { getCTUrlPattern, getViewPropsByCT } from '../helpers';

import { ContentAPI } from './api.types';
import { hooks } from './hooks';
import { registerContentDetailAction } from './registerContentDetailAction';
import { registerContentDetailCompartment } from './registerContentDetailCompartment';
import { registerContentDetailTab } from './registerContentDetailTab';
import { store } from './store';

const API: ContentAPI = {
	registerContentDetailCompartment,
	registerContentDetailAction,
	registerContentDetailTab,
	getViewPropsByCT,
	getCTUrlPattern,
	store,
	hooks,
	ContentInfoTooltip,
	contentTenantContext: TenantContext,
};

export const registerContentAPI = (): void => {
	Core.modules.exposeModuleApi('content-module', API);
};

export { API };
