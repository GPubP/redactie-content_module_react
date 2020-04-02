export interface FieldType {
	uuid: string;
	data: {
		componentName: string;
		module: string;
	};
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
	uuid: string;
	meta: {
		label: string;
		description: string;
	};
	fields: ContentTypeFieldSchema[];
	validateSchema: ValidateSchema;
	errorMessages: ErrorMessagesSchema;
}

export interface ValidateSchema {
	[key: string]: any;
}

export interface ErrorMessagesSchema {
	[key: string]: {
		[key: string]: string;
	};
}
