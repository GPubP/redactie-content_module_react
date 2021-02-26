import { MySecurityRightModel } from '@redactie/roles-rights-module';

import { CONTENT_TYPE_CRUD_RIGHT_KEYS } from '../../content.const';

import { getMySecurityRightsByContentTypeId } from './getMySecurityRightsByContentTypeId';

describe('getMySecurityRightsByContentTypeId', () => {
	const contentTypeId = '123';

	it('should not give the user access to a content type when he has no rights', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, []);
		expect(result).toEqual({
			read: false,
			create: false,
			update: false,
			delete: false,
		});
	});

	it('should not give the user access when the security right type is set to module', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, ([
			{
				attributes: {
					key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.read}_content_type_name`,
					type: 'module',
					reference: contentTypeId,
				},
			},
		] as unknown) as MySecurityRightModel[]);
		expect(result).toEqual({
			read: false,
			create: false,
			update: false,
			delete: false,
		});
	});

	it('should not give the user access when the security right key is not using the right format', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, ([
			{
				attributes: {
					key: `some_other_key_content_type_name`,
					type: 'content-type',
					reference: contentTypeId,
				},
			},
		] as unknown) as MySecurityRightModel[]);
		expect(result).toEqual({
			read: false,
			create: false,
			update: false,
			delete: false,
		});
	});

	it('should not give the user access when the reference does not match a content type id', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, ([
			{
				attributes: {
					key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.read}_content_type_name`,
					type: 'content-type',
					reference: 'some_unknown_reference',
				},
			},
		] as unknown) as MySecurityRightModel[]);
		expect(result).toEqual({
			read: false,
			create: false,
			update: false,
			delete: false,
		});
	});

	it('should give the user the permission to read when he has the rights', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, ([
			{
				attributes: {
					key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.read}_content_type_name`,
					type: 'content-type',
					reference: contentTypeId,
				},
			},
		] as unknown) as MySecurityRightModel[]);
		expect(result).toEqual({
			read: true,
			create: false,
			update: false,
			delete: false,
		});
	});

	it('should give the user the permission to create when he has the rights', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, ([
			{
				attributes: {
					key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.create}_content_type_name`,
					type: 'content-type',
					reference: contentTypeId,
				},
			},
		] as unknown) as MySecurityRightModel[]);
		expect(result).toEqual({
			read: false,
			create: true,
			update: false,
			delete: false,
		});
	});

	it('should give the user the permission to update when he has the rights', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, ([
			{
				attributes: {
					key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.update}_content_type_name`,
					type: 'content-type',
					reference: contentTypeId,
				},
			},
		] as unknown) as MySecurityRightModel[]);
		expect(result).toEqual({
			read: false,
			create: false,
			update: true,
			delete: false,
		});
	});

	it('should give the user the permission to delete when he has the rights', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, ([
			{
				attributes: {
					key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.delete}_content_type_name`,
					type: 'content-type',
					reference: contentTypeId,
				},
			},
		] as unknown) as MySecurityRightModel[]);
		expect(result).toEqual({
			read: false,
			create: false,
			update: false,
			delete: true,
		});
	});
});
