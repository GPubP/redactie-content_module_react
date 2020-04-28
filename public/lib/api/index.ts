import Core from '@redactie/redactie-core';

import { registerContentDetailCompartment } from './registerContentDetailCompartment';

export const registerContentAPI = (): void =>
	Core.modules.exposeModuleApi('content-module', {
		registerContentDetailCompartment,
	});
