export interface GeneralConfig {
	guideline: string;
	hidden: boolean;
	max: number;
	min: number;
	multilanguage: boolean;
	required: boolean;
}

export interface FieldType {
	uuid: string;
	data: {
		componentName: string;
		module: string;
	};
}

export interface DataType {
	_id: string;
	meta: {
		createdAt: string;
		deleted: boolean;
		lastModified: string;
		created: string;
	};
	data: {
		label: string;
		type: string;
		semanticType: string;
	};
	uuid: string;
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
	dataType: DataType;
	config?: {
		required: boolean;
		[key: string]: any;
	};
	generalConfig: GeneralConfig;
	defaultValue: string;
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
