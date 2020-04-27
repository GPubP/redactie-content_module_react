export interface FieldType {
	uuid: string;
	data: {
		componentName: string;
		module: string;
	};
}
interface ModuleSettings {
	uuid: string;
	label: string;
	name: string;
	module?: string;
	config: any;
	validationSchema?: any;
}

export interface ContentTypeFieldSchema {
	name: string;
	label: string;
	fieldType: FieldType;
	config?: {
		[key: string]: any;
	};
}

export interface ContentTypeSchema {
	_id: string;
	uuid: string;
	meta: {
		label: string;
		description: string;
	};
	fields: ContentTypeFieldSchema[];
	modulesConfig?: ModuleSettings[];
	validateSchema: ValidateSchema;
	errorMessages: ErrorMessagesSchema;
}

export interface ContentTypePaging {
	total: number;
	moreResults: boolean;
	limit: number;
	skip: number;
}

export interface ContentTypesSchema {
	data: ContentTypeSchema[];
	paging: ContentTypePaging;
}

export interface ValidateSchema {
	[key: string]: any;
}

export interface ErrorMessagesSchema {
	[key: string]: {
		[key: string]: string;
	};
}
