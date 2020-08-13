import { ContentTypeSchema } from '../contentTypes';

export type ModuleValue = Record<string, any>;

export interface PagingSchema {
	total: number;
	moreResults: boolean;
	limit: number;
	skip: number;
}

export interface ContentSchema {
	uuid?: string;
	meta: {
		label: string;
		slug: Record<string, string>;
		site: string;
		description?: string;
		contentType: ContentTypeSchema;
		historySummary?: {
			published: boolean;
		};
		theme?: string;
		lastEditor?: string;
		status: string;
		published?: boolean;
		created?: string;
		lastModified?: string;
	};
	modulesData?: Record<string, ModuleValue>;
	fields: Record<string, any>;
}

export interface ContentsSchema {
	data: ContentSchema[];
	paging: PagingSchema;
}

export interface ContentCreateSchema {
	meta: {
		label: string;
		slug: Record<string, string>;
		contentType: string;
		status: ContentStatus;
		site: string;
	};
	modulesData?: Record<string, ModuleValue>;
	fields: Record<string, any>;
}

export enum ContentStatus {
	DRAFT = 'DRAFT',
	PENDING = 'PENDING',
	SCHEDULED = 'SCHEDULED',
	PUBLISHED = 'PUBLISHED',
	UNPUBLISHED = 'UNPUBLISHED',
}
