import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

export interface ContentRouteProps extends RouteConfigComponentProps {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export enum LoadingState {
	Loading = 'loading',
	Loaded = 'loaded',
	Error = 'error',
}
