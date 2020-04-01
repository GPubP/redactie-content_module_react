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
export interface ContentSchema {
	uuid: string;
	meta: {
		label: string;
		description: string;
		contentType: {
			meta: {
				label: string;
			};
		};
		theme: string;
		lastEditor: string;
		status: string;
		published: boolean;
		createdAt: string;
		lastModified: string;
	};
}

export interface ContentsSchema {
	data: ContentSchema[];
}
