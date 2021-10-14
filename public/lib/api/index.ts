import Core from '@redactie/redactie-core';
import { TenantContext } from '@redactie/utils';

import { registerContentDetailAction } from './registerContentDetailAction';
import { registerContentDetailCompartment } from './registerContentDetailCompartment';
import { registerContentDetailTab } from './registerContentDetailTab';

export const registerContentAPI = (): void =>
	Core.modules.exposeModuleApi('content-module', {
		registerContentDetailCompartment,
		registerContentDetailAction,
		registerContentDetailTab,
		contentTenantContext: TenantContext,
	});
