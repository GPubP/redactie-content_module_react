import Core from '@redactie/redactie-core';

// TODO export sites api typings
const sitesAPI: any = Core.modules.getModuleAPI('sites-module');

export const registerRoutes = (routes: any): any | false =>
	sitesAPI ? sitesAPI.routes.register(routes) : false;
