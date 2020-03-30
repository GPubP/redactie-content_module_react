import { ModuleRouteConfig } from '@redactie/redactie-core';

export interface ContentRouteProps {
	basePath: string;
	routes: ModuleRouteConfig[];
}

export enum LoadingState {
	Loading = 'loading',
	Loaded = 'loaded',
	Error = 'error',
}
