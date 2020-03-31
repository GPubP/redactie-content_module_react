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
		title: string;
		description: string;
		type: string;
		theme: string;
		publicationDate: Date;
		author: string;
		status: string;
		online: boolean;
		createdAt: string;
		lastModified: string;
	};
}

export interface ContentsSchema {
	data: ContentSchema[];
}
