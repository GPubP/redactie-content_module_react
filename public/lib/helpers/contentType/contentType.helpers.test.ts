import { ContentTypeSchema } from '../../api/api.types';
import { ContentTypeCompartment, ContentTypeFieldSchema } from '../../services/contentTypes';

import { default as contentTypeHelpers } from './contentType.helpers';
import { DEFAULT_COMPARTMENTS } from './contentType.helpers.const';
import { compartmentMockOne, compartmentMockTwo, fieldsMock } from './contentType.helpers.mocks';

describe('Content type helpers', () => {
	describe('getCompartments', () => {
		it('should return an empty array when the argument content type is undefined', () => {
			let contentType;
			const compartments = contentTypeHelpers.getCompartments(
				(contentType as unknown) as ContentTypeSchema
			);
			expect(compartments).toEqual([]);
		});

		it('should return the default compartments when the content type has no compartments', () => {
			const contentType = {
				compartments: undefined,
			};
			const compartments = contentTypeHelpers.getCompartments(
				(contentType as unknown) as ContentTypeSchema
			);
			expect(compartments).toEqual(DEFAULT_COMPARTMENTS);
		});

		it('should return the content type compartments', () => {
			const contentType = {
				compartments: [compartmentMockOne],
			};
			const compartments = contentTypeHelpers.getCompartments(
				contentType as ContentTypeSchema
			);
			expect(compartments).toEqual(contentType.compartments);
		});
	});

	describe('getFieldsByCompartment', () => {
		it('should return an empty array when the argument field is not an array', () => {
			let contentTypeFields;
			const fields = contentTypeHelpers.getFieldsByCompartment(
				(contentTypeFields as unknown) as ContentTypeFieldSchema[],
				compartmentMockOne
			);
			expect(fields).toEqual([]);
		});

		it('should return an empty array when the argument compartment is undefined', () => {
			let contentTypeFields;
			let compartment;
			const fields = contentTypeHelpers.getFieldsByCompartment(
				(contentTypeFields as unknown) as ContentTypeFieldSchema[],
				(compartment as unknown) as ContentTypeCompartment
			);
			expect(fields).toEqual([]);
		});

		describe('Fields with compartment', () => {
			it('should return a list with fields filtered by the compartment and sorted by position', () => {
				const fields = contentTypeHelpers.getFieldsByCompartment(
					fieldsMock as ContentTypeFieldSchema[],
					compartmentMockOne
				);
				expect(fields).toEqual([
					{
						name: 'field_mockOne_1',
						compartment: {
							uuid: compartmentMockOne.uuid,
							position: 1,
						},
					},
					{
						name: 'field_mockOne_2',
						compartment: {
							uuid: compartmentMockOne.uuid,
							position: 2,
						},
					},
					{
						name: 'field_mockOne_3',
						compartment: {
							uuid: compartmentMockOne.uuid,
							position: 3,
						},
					},
				]);
			});
		});

		describe('Fields without compartment', () => {
			it('should return a list with fields filtered by the compartment and sorted by position', () => {
				const fields = contentTypeHelpers.getFieldsByCompartment(
					fieldsMock as ContentTypeFieldSchema[],
					DEFAULT_COMPARTMENTS[0]
				);
				expect(fields).toEqual([
					{
						name: 'field_default_4',
					},
					{
						name: 'field_default_7',
					},
				]);
			});
		});
	});

	describe('getFieldsByCompartments', () => {
		it('should return an empty array when the argument fields is not an array', () => {
			let contentTypeFields;
			const fields = contentTypeHelpers.getFieldsByCompartments(
				(contentTypeFields as unknown) as ContentTypeFieldSchema[],
				[compartmentMockOne, compartmentMockTwo]
			);
			expect(fields).toEqual([]);
		});

		it('should return an empty array when the argument compartments is not an array', () => {
			const contentTypeFields: ContentTypeFieldSchema[] = [];
			let compartments;
			const fields = contentTypeHelpers.getFieldsByCompartments(
				contentTypeFields,
				(compartments as unknown) as ContentTypeCompartment[]
			);
			expect(fields).toEqual([]);
		});

		it('should return a list with fields filtered by the compartments and sorted by position', () => {
			const fields = contentTypeHelpers.getFieldsByCompartments(
				fieldsMock as ContentTypeFieldSchema[],
				[DEFAULT_COMPARTMENTS[0], compartmentMockOne, compartmentMockTwo]
			);
			// console.log([DEFAULT_COMPARTMENTS[0], compartmentMockOne, compartmentMockTwo]);
			// console.log(fields);
			expect(fields).toEqual([
				{
					name: 'field_default_4',
				},
				{
					name: 'field_default_7',
				},
				{
					name: 'field_mockOne_1',
					compartment: {
						uuid: compartmentMockOne.uuid,
						position: 1,
					},
				},
				{
					name: 'field_mockOne_2',
					compartment: {
						uuid: compartmentMockOne.uuid,
						position: 2,
					},
				},
				{
					name: 'field_mockOne_3',
					compartment: {
						uuid: compartmentMockOne.uuid,
						position: 3,
					},
				},
				{
					name: 'field_mockTwo_5',
					compartment: {
						uuid: compartmentMockTwo.uuid,
						position: 1,
					},
				},
				{
					name: 'field_mockTwo_6',
					compartment: {
						uuid: compartmentMockTwo.uuid,
						position: 2,
					},
				},
			]);
		});
	});
});
