import { PagingSchema } from '../../content.types';
import { ContentTypeSchema } from '../contentTypes';

export type ModuleValue = Record<string, any>;

export interface ContentSchema {
	_id?: string;
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
		lastEditor?: {
			firstname?: string;
			lastname?: string;
		};
		status: string;
		published?: boolean;
		created?: string;
		lastModified?: string;
		activeLanguages: string[];
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
		description?: string;
		activeLanguages: string[];
		label: string;
		slug: Record<string, string>;
		contentType: string;
		status: ContentStatus;
		published: boolean;
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

export interface ValidateSlugPayload {
	id?: string;
	slug: string;
	language: string;
}
