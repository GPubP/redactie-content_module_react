import Core from '@redactie/redactie-core';
import { TenantContext } from '@redactie/utils';

import { getViewPropsByCT } from '../helpers/getViewPropsByCT';

import { registerContentDetailAction } from './registerContentDetailAction';
import { registerContentDetailCompartment } from './registerContentDetailCompartment';
import { registerContentDetailTab } from './registerContentDetailTab';
import { store } from './store';

export const registerContentAPI = (): void =>
	Core.modules.exposeModuleApi('content-module', {
		registerContentDetailCompartment,
		registerContentDetailAction,
		registerContentDetailTab,
		getViewPropsByCT,
		store,
		contentTenantContext: TenantContext,
	});
