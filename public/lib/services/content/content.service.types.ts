import { ContentTypeSchema } from '../contentTypes';

export interface ContentSchema {
	uuid: string;
	meta: {
		label: string;
		description: string;
		contentType: ContentTypeSchema;
		theme: string;
		lastEditor: string;
		status: string;
		published: boolean;
		createdAt: string;
		lastModified: string;
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
		contentType: string;
		status: ContentStatus;
	};
	fields: {
		[key: string]: any;
	};
}

export enum ContentStatus {
	DRAFT = 'DRAFT',
}
