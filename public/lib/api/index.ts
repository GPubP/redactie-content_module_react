import Core from '@redactie/redactie-core';

import * as API from './api';

export const registerContentAPI = (): void => {
	Core.modules.exposeModuleApi('content-module', API);
};

export { API };
