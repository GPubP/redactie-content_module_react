export const fieldTypeSingle = {
	name: 'fieldTypeSingle',
	label: 'field type single',
	fieldType: {
		data: {
			module: 'core',
			componentName: 'text',
			generalConfig: {
				defaultGuideline: 'field type multiple default guideline',
				defaultLabel: 'field type multiple default label',
			},
		},
	},
	dataType: {
		data: {
			type: 'string',
		},
	},
	config: {},
	generalConfig: {
		max: 1,
		guideline: 'field type single guideline',
		hidden: false,
	},
	defaultValue: '',
};
export const fieldTypeMultiple = {
	...fieldTypeSingle,
	fieldType: {
		...fieldTypeSingle.fieldType,
		data: {
			...fieldTypeSingle.fieldType.data,
			generalConfig: {
				...fieldTypeSingle.fieldType.data.generalConfig,
				defaultGuideline: 'field type multiple default guideline',
				defaultLabel: 'field type multiple default label',
			},
		},
	},
	name: 'fieldTypeMultiple',
	label: 'field type multiple',
	generalConfig: {
		...fieldTypeSingle.generalConfig,
		max: 2,
		guideline: 'field type multiple guideline',
	},
};
export const presetSingle = {
	name: 'presetSingle',
	label: 'preset single',
	fieldType: {
		data: {
			module: 'core',
			componentName: 'fieldGroup',
		},
	},
	dataType: {
		data: {
			type: 'object',
		},
	},
	config: {
		fields: [fieldTypeSingle],
	},
	generalConfig: {
		max: 1,
		guideline: 'preset single guideline',
		hidden: false,
	},
	defaultValue: {},
	preset: {
		data: {
			name: 'presetName',
		},
	},
};
export const presetMultiple = {
	...presetSingle,
	name: 'presetMultiple',
	label: 'preset multiple',
	generalConfig: {
		...presetSingle.generalConfig,
		max: 2,
		guideline: 'preset multiple guideline',
	},
};
