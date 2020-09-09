import { ContentTypeFieldSchema } from '../../services/contentTypes';

import { parseFields } from './parseFields';
import {
	fieldTypeMultiple,
	fieldTypeSingle,
	presetMultiple,
	presetSingle,
} from './parseFields.mock';

describe('parseFields', () => {
	describe('FieldType', () => {
		describe('Single', () => {
			it('should parse a content type single field to a FieldSchema', () => {
				const fields = parseFields([fieldTypeSingle] as ContentTypeFieldSchema[]);
				expect(fields[0]).toEqual({
					name: fieldTypeSingle.name,
					label: fieldTypeSingle.label,
					module: fieldTypeSingle.fieldType.data.module,
					type: fieldTypeSingle.fieldType.data.componentName,
					view: '',
					dataType: fieldTypeSingle.dataType.data.type,
					fields: [],
					config: {
						...fieldTypeSingle.config,
						...fieldTypeSingle.generalConfig,
						fieldType: fieldTypeSingle.fieldType,
						dataType: fieldTypeSingle.dataType,
						description: fieldTypeSingle.generalConfig.guideline,
					},
				});
			});
		});

		describe('should parse a content type multiple field to a FieldSchema', () => {
			const fields = parseFields([fieldTypeMultiple] as ContentTypeFieldSchema[]);

			expect(fields[0]).toEqual({
				name: fieldTypeMultiple.name,
				module: 'core',
				label: fieldTypeMultiple.label,
				type: 'repeater',
				dataType: 'array',
				config: {
					max: 2,
					guideline: fieldTypeMultiple.generalConfig.guideline,
					defaultGuideline: fieldTypeMultiple.generalConfig.defaultGuideline,
					defaultLabel: fieldTypeMultiple.generalConfig.defaultLabel,
					hidden: fieldTypeMultiple.generalConfig.hidden,
					description: fieldTypeMultiple.generalConfig.guideline,
				},
				fields: [
					{
						name: 'value',
						label: fieldTypeMultiple.generalConfig.defaultLabel,
						module: fieldTypeMultiple.fieldType.data.module,
						type: fieldTypeMultiple.fieldType.data.componentName,
						view: '',
						dataType: fieldTypeMultiple.dataType.data.type,
						fields: [],
						config: {
							max: 2,
							guideline: fieldTypeMultiple.generalConfig.guideline,
							defaultGuideline: fieldTypeMultiple.generalConfig.defaultGuideline,
							defaultLabel: fieldTypeMultiple.generalConfig.defaultLabel,
							hidden: false,
							description: fieldTypeMultiple.generalConfig.defaultGuideline,
							preset: undefined,
							fieldType: fieldTypeMultiple.fieldType,
							dataType: fieldTypeMultiple.dataType,
						},
					},
				],
			});
		});
	});

	describe('Preset', () => {
		describe('Single', () => {
			it('should parse a content type single preset to a FieldSchema', () => {
				const fields = parseFields(([presetSingle] as unknown) as ContentTypeFieldSchema[]);

				expect(fields[0]).toEqual({
					name: presetSingle.name,
					label: presetSingle.label,
					module: presetSingle.fieldType.data.module,
					type: presetSingle.fieldType.data.componentName,
					view: presetSingle.preset.data.name,
					dataType: presetSingle.dataType.data.type,
					fields: [
						{
							name: fieldTypeSingle.name,
							label: fieldTypeSingle.label,
							module: fieldTypeSingle.fieldType.data.module,
							type: fieldTypeSingle.fieldType.data.componentName,
							view: '',
							dataType: fieldTypeSingle.dataType.data.type,
							fields: [],
							config: {
								max: fieldTypeSingle.generalConfig.max,
								guideline: fieldTypeSingle.generalConfig.guideline,
								defaultGuideline: fieldTypeSingle.generalConfig.defaultGuideline,
								defaultLabel: fieldTypeSingle.generalConfig.defaultLabel,
								hidden: fieldTypeSingle.generalConfig.hidden,
								description: fieldTypeSingle.generalConfig.guideline,
								preset: undefined,
								fieldType: fieldTypeSingle.fieldType,
								dataType: fieldTypeSingle.dataType,
							},
						},
					],
					config: {
						fields: presetSingle.config.fields,
						max: presetSingle.generalConfig.max,
						guideline: presetSingle.generalConfig.guideline,
						defaultGuideline: presetSingle.generalConfig.defaultGuideline,
						defaultLabel: presetSingle.generalConfig.defaultLabel,
						hidden: presetSingle.generalConfig.hidden,
						description: presetSingle.generalConfig.guideline,
						preset: presetSingle.preset,
						fieldType: presetSingle.fieldType,
						dataType: presetSingle.dataType,
					},
				});
			});
		});
		describe('Multiple', () => {
			it('should parse a content type multiple preset to a FieldSchema', () => {
				const fields = parseFields(([
					presetMultiple,
				] as unknown) as ContentTypeFieldSchema[]);

				expect(fields[0]).toEqual({
					name: presetMultiple.name,
					module: presetMultiple.fieldType.data.module,
					label: presetMultiple.label,
					type: 'repeater',
					dataType: 'array',
					config: {
						fields: presetMultiple.config.fields,
						max: presetMultiple.generalConfig.max,
						guideline: presetMultiple.generalConfig.guideline,
						defaultGuideline: presetMultiple.generalConfig.defaultGuideline,
						defaultLabel: presetMultiple.generalConfig.defaultLabel,
						hidden: presetMultiple.generalConfig.hidden,
						description: presetMultiple.generalConfig.guideline,
					},
					fields: [
						{
							name: 'value',
							label: null,
							module: presetMultiple.fieldType.data.module,
							type: presetMultiple.fieldType.data.componentName,
							view: presetMultiple.preset.data.name,
							dataType: presetMultiple.dataType.data.type,
							fields: [
								{
									name: fieldTypeSingle.name,
									label: fieldTypeSingle.label,
									module: fieldTypeSingle.fieldType.data.module,
									type: fieldTypeSingle.fieldType.data.componentName,
									view: '',
									dataType: fieldTypeSingle.dataType.data.type,
									fields: [],
									config: {
										max: fieldTypeSingle.generalConfig.max,
										guideline: fieldTypeSingle.generalConfig.guideline,
										defaultGuideline:
											fieldTypeSingle.generalConfig.defaultGuideline,
										defaultLabel: fieldTypeSingle.generalConfig.defaultLabel,
										hidden: fieldTypeSingle.generalConfig.hidden,
										description: fieldTypeSingle.generalConfig.guideline,
										preset: undefined,
										fieldType: fieldTypeSingle.fieldType,
										dataType: fieldTypeSingle.dataType,
									},
								},
							],
							config: {
								fields: presetMultiple.config.fields,
								max: presetMultiple.generalConfig.max,
								guideline: presetMultiple.generalConfig.guideline,
								defaultGuideline: presetMultiple.generalConfig.defaultGuideline,
								defaultLabel: presetMultiple.generalConfig.defaultLabel,
								hidden: presetMultiple.generalConfig.hidden,
								preset: presetMultiple.preset,
								fieldType: presetMultiple.fieldType,
								dataType: presetMultiple.dataType,
							},
						},
					],
				});
			});
		});
	});
});
