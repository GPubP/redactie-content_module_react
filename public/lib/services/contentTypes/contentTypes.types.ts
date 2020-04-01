export interface FieldType {
	uuid: string;
	data: {
		componentName: string;
	};
}

export interface ContentTypeFieldSchema {
	name: string;
	label: string;
	fieldType: FieldType;
	module: string;
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
	validationSchema: {
		[key: string]: any;
	};
	errorMessages: {
		[key: string]: {
			[key: string]: string;
		};
	};
}
