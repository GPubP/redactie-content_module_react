import { PagingSchema } from '../../content.types';
import { ContentTypeSchema } from '../contentTypes';

export type ModuleValue = Record<string, any>;

export interface ContentHistorySummaryStatus {
	uuid: string;
	isLatestVersion: boolean;
	type?: ContentStatusKeys;
}
export interface ContentHistorySummary {
	draft: ContentHistorySummaryStatus;
	pendingReview: ContentHistorySummaryStatus;
	pendingPublish: ContentHistorySummaryStatus;
	scheduled: ContentHistorySummaryStatus;
	scheduledUnpublish: ContentHistorySummaryStatus;
	published: boolean;
	lastEdit: string;
}

export interface ContentSchema {
	_id?: string;
	uuid?: string;
	meta: {
		label: string;
		slug: Record<string, string>;
		site: string;
		description?: string;
		contentType: ContentTypeSchema;
		historySummary?: ContentHistorySummary;
		theme?: string;
		lastEditor?: {
			firstname?: string;
			lastname?: string;
		};
		status: string;
		workflowState: string;
		published?: boolean;
		created?: string;
		lastModified?: string;
		activeLanguages: string[];
		firstPublished?: string;
		publishTime?: string | null;
		unpublishTime?: string | null;
	};
	modulesData?: Record<string, ModuleValue>;
	fields: Record<string, any>;
}

export interface ContentUpdateSchema extends Omit<ContentSchema, 'meta'> {
	meta: Omit<ContentSchema['meta'], 'contentType'> & {
		contentType: {
			_id: string;
			uuid: string;
		};
	};
}

export interface ContentsSchema {
	data: ContentSchema[];
	paging: PagingSchema;
}

export interface ContentCreateSchema {
	meta: {
		description?: string;
		activeLanguages: string[];
		label: string;
		slug: Record<string, string>;
		contentType: string;
		status: string;
		workflowState: string;
		published: boolean;
		site: string;
		publishTime?: string | null;
		unpublishTime?: string | null;
	};
	modulesData?: Record<string, ModuleValue>;
	fields: Record<string, any>;
}

export enum ContentStatus {
	NEW = 'NEW',
	DRAFT = 'DRAFT',
	PENDING_REVIEW = 'PENDING_REVIEW',
	PENDING_PUBLISH = 'PENDING_PUBLISH',
	SCHEDULED = 'SCHEDULED',
	PUBLISHED = 'PUBLISHED',
	UNPUBLISHED = 'UNPUBLISHED',
}

export enum ContentSystemNames {
	NEW = 'nieuw',
	DRAFT = 'werkversie',
	PENDING_REVIEW = 'klaar-voor-nakijken',
	PENDING_PUBLISH = 'klaar-voor-publicatie',
	PUBLISHED = 'gepubliceerd',
	UNPUBLISHED = 'gearchiveerd',
}

export enum ContentExtraFilterStatus {
	ALL = 'ALL',
}

export type ContentStatusKeys =
	| ContentStatus.DRAFT
	| ContentStatus.SCHEDULED
	| ContentStatus.PENDING_PUBLISH
	| ContentStatus.PENDING_REVIEW
	| ContentStatus.PUBLISHED
	| ContentStatus.UNPUBLISHED;

export interface ValidateSlugPayload {
	id?: string;
	slug: string;
	language: string;
}

export type ValidationSchema = Record<string, any>;

export interface ModuleSettings {
	uuid?: string;
	label: string;
	name: string;
	module?: string;
	config: Record<string, any>;
	validationSchema?: ValidationSchema;
}
