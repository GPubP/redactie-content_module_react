import { ContentTypeSchema } from '../contentTypes';

export type ModuleValue = Record<string, any>;

export interface ContentSchema {
	uuid?: string;
	meta: {
		label: string;
		slug: Record<string, string>;
		description?: string;
		contentType: ContentTypeSchema;
		theme?: string;
		lastEditor?: string;
		status?: string;
		published?: boolean;
		createdAt?: string;
		lastModified?: string;
	};
	modulesData?: Record<string, ModuleValue>;
	fields: Record<string, any>;
}

export interface ContentsSchema {
	data: ContentSchema[];
}

export interface ContentCreateSchema {
	meta: {
		label: string;
		slug: Record<string, string>;
		contentType: string;
		status: ContentStatus;
	};
	modulesData?: Record<string, ModuleValue>;
	fields: Record<string, any>;
}

export enum ContentStatus {
	DRAFT = 'DRAFT',
}
