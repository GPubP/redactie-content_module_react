import { Operator, Preset, Validation, Validator } from '@redactie/form-renderer-module';

export interface GeneralConfig {
	guideline: string;
	hidden: boolean;
	max: number;
	min: number;
	multilanguage: boolean;
	required: boolean;
}

export interface FieldType {
	_id: string;
	uuid: string;
	data: {
		componentName: string;
		module: string;
		generalConfig: {
			defaultGuideline?: string;
			defaultLabel?: string;
		};
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

export interface ContentTypeFieldCompartmentRef {
	uuid: string;
	position: number;
}

export interface ContentTypeFieldSchema {
	uuid: string;
	label: string;
	module: string;
	name: string;
	config?: {
		[key: string]: any;
	};
	defaultValue?: string;
	validators: Validator[];
	operators: Operator[];
	validation?: Validation;
	generalConfig: GeneralConfig;
	dataType: DataType;
	fieldType: FieldType;
	preset?: Preset;
	compartment: ContentTypeFieldCompartmentRef;
}

export interface ContentTypeCompartment {
	uuid: string;
	label: string;
	removable: boolean;
}

export interface ContentTypeSchema {
	_id: string;
	uuid: string;
	meta: {
		label: string;
		description: string;
	};
	fields: ContentTypeFieldSchema[];
	compartments: ContentTypeCompartment[];
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
