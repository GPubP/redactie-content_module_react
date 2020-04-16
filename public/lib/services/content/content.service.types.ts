import { ContentTypeSchema } from '../contentTypes';

export type ModuleValue = {
	[key: string]: any;
};

export interface ContentSchema {
	uuid?: string;
	meta: {
		label: string;
		slug: {
			[key: string]: string;
		};
		description?: string;
		contentType: ContentTypeSchema;
		theme?: string;
		lastEditor?: string;
		status?: string;
		published?: boolean;
		createdAt?: string;
		lastModified?: string;
	};
	modulesData?: {
		[key: string]: ModuleValue;
	};
	fields: {
		[key: string]: any;
	};
}

export interface ContentsSchema {
	data: ContentSchema[];
}

export interface ContentCreateSchema {
	meta: {
		label: string;
		slug: {
			[key: string]: string;
		};
		contentType: string;
		status: ContentStatus;
	};
	modulesData?: {
		[key: string]: ModuleValue;
	};
	fields: {
		[key: string]: any;
	};
}

export enum ContentStatus {
	DRAFT = 'DRAFT',
}
