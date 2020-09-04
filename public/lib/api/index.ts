import Core from '@redactie/redactie-core';

import TenantContext from '../context/TenantContext/TenantContext';

import { registerContentDetailCompartment } from './registerContentDetailCompartment';

export const registerContentAPI = (): void =>
	Core.modules.exposeModuleApi('content-module', {
		registerContentDetailCompartment,
		contentTenantContext: TenantContext,
	});
