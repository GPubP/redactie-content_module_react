import Core, { ModuleRouteConfig, Routes } from '@redactie/redactie-core';

// TODO export sites api typings
const sitesAPI: { routes: Routes } = Core.modules.getModuleAPI('sites-module') as {
	routes: Routes;
};

export const registerRoutes = (routes: ModuleRouteConfig): any | false =>
	sitesAPI ? sitesAPI.routes.register(routes) : false;
