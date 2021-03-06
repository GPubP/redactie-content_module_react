import { MySecurityRightModel } from '@redactie/roles-rights-module';

import { CONTENT_TYPE_CRUD_RIGHT_KEYS } from '../../content.const';

import { getMySecurityRightsByContentTypeId } from './getMySecurityRightsByContentTypeId';
const contentTypeId = '123';

const createRight = {
	attributes: {
		key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.create}_content_type_name`,
		type: 'content-type',
		reference: contentTypeId,
	},
} as MySecurityRightModel;
const readRight = {
	attributes: {
		key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.read}_content_type_name`,
		type: 'content-type',
		reference: contentTypeId,
	},
} as MySecurityRightModel;
const updateRight = {
	attributes: {
		key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.update}_content_type_name`,
		type: 'content-type',
		reference: contentTypeId,
	},
} as MySecurityRightModel;
const deleteRight = {
	attributes: {
		key: `${CONTENT_TYPE_CRUD_RIGHT_KEYS.delete}_content_type_name`,
		type: 'content-type',
		reference: contentTypeId,
	},
} as MySecurityRightModel;

describe('getMySecurityRightsByContentTypeId', () => {
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
		const result = getMySecurityRightsByContentTypeId(contentTypeId, [readRight]);
		expect(result).toEqual({
			read: true,
			create: false,
			update: false,
			delete: false,
		});
	});

	it('should give the user the permission to create when he has the rights', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, [createRight]);
		expect(result).toEqual({
			read: false,
			create: true,
			update: false,
			delete: false,
		});
	});

	it('should give the user the permission to update when he has the rights', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, [updateRight]);
		expect(result).toEqual({
			read: false,
			create: false,
			update: true,
			delete: false,
		});
	});

	it('should give the user the permission to delete when he has the rights', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, [deleteRight]);
		expect(result).toEqual({
			read: false,
			create: false,
			update: false,
			delete: true,
		});
	});

	it('should give the user the permissions to create, read, update and delete', () => {
		const result = getMySecurityRightsByContentTypeId(contentTypeId, [
			createRight,
			readRight,
			updateRight,
			deleteRight,
		]);
		expect(result).toEqual({
			read: true,
			create: true,
			update: true,
			delete: true,
		});
	});
});
