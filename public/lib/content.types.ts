import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { ContextHeaderTab, FilterItem, LoadingState } from '@redactie/utils';

import { ContentStatus, ContentTypeSchema } from './api/api.types';
import { PublishedStatuses } from './components';
import { ContentModel } from './store/content';
import { ExternalTabValue } from './views/ContentDetailExternal';

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

export interface OverviewQueryParams {
	skip: number | null | undefined;
	limit: number | null | undefined;
	sparse: boolean | null | undefined;
	sort: string | null | undefined;
	direction: number | null | undefined;
	search: string | null | undefined;
	contentTypes: string[] | null | undefined;
	publishedFrom: string | null | undefined;
	publishedTo: string | null | undefined;
	status: ContentStatus | null | undefined;
	published: PublishedStatuses | null | undefined;
	creator: string | null | undefined;
}

export interface Tab extends ContextHeaderTab {
	id?: string;
	type: TabTypes;
	containerId: ALERT_CONTAINER_IDS;
	standalone?: boolean;
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

export enum CRUDActions {
	create = 'create',
	read = 'read',
	update = 'update',
	delete = 'delete',
}

export enum ALERT_CONTAINER_IDS {
	contentEdit = 'content-edit',
	contentDetail = 'content-detail',
	contentCreate = 'content-create',
	contentRemove = 'content-remove',
}

export enum TabTypes {
	'INTERNAL',
	'EXTERNAL',
}

export interface ContentExternalRouteParams {
	siteUuid: string;
	contentId: string;
}

export interface ContentDetailExternalRouteProps<Params = ContentExternalRouteParams>
	extends RouteConfigComponentProps<Params> {
	readonly allowedPaths?: string[];
	readonly contentItem: ContentModel;
	readonly contentType: ContentTypeSchema;
	readonly contentItemLoading: LoadingState;
	onCancel: () => void;
	onSubmit: (data: ExternalTabValue, tab: Tab, cb?: () => void) => void;
}
