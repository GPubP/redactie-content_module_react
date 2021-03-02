import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { ContextHeaderTab, FilterItem } from '@redactie/utils';

export interface ContentRouteProps<
	Params extends {
		[K in keyof Params]?: string;
	} = {}
> extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface PagingSchema {
	total: number;
	moreResults: boolean;
	limit: number;
	skip: number;
}

export interface OverviewFilterItem extends FilterItem {
	key?: string;
	value: string;
	valuePrefix?: string;
	filterKey: string;
	formvalue?: any;
}

export interface Tab extends ContextHeaderTab {
	id?: string;
}

export interface AlertMessage {
	title: string;
	message: string;
}

export interface CRUDSecurityRights {
	read: boolean;
	create: boolean;
	update: boolean;
	delete: boolean;
}
