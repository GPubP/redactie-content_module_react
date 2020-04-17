import Core from '@redactie/redactie-core';

import { registerContenDetailCompartment } from './registerContentDetailCompartment';

export const registerContentAPI = () =>
	Core.modules.exposeModuleApi('content-module', {
		registerContenDetailCompartment,
	});
