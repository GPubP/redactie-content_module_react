export const fieldTypeSingle = {
	name: 'fieldTypeSingle',
	label: 'field type single',
	fieldType: {
		data: {
			module: 'core',
			componentName: 'text',
			generalConfig: {},
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
		defaultGuideline: 'field type single default guideline',
		defaultLabel: 'field type single default label',
		hidden: false,
	},
	defaultValue: '',
};
export const fieldTypeMultiple = {
	...fieldTypeSingle,
	name: 'fieldTypeMultiple',
	label: 'field type multiple',
	generalConfig: {
		...fieldTypeSingle.generalConfig,
		max: 2,
		guideline: 'field type multiple guideline',
		defaultGuideline: 'field type multiple default guideline',
		defaultLabel: 'field type multiple default label',
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
		defaultGuideline: 'preset single default guideline',
		defaultLabel: 'preset single default label',
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
		defaultGuideline: 'preset multiple default guideline',
		defaultLabel: 'preset multiple default label',
	},
};
