import { MySecurityRightModel } from '@redactie/roles-rights-module';

import { CONTENT_TYPE_CRUD_RIGHT_KEYS, DEFAULT_CRUD_RIGHTS } from '../../content.const';
import { CRUDSecurityRights } from '../../content.types';

export const getMySecurityRightsByContentTypeId = (
	contentTypeId: string,
	mySecurityRights: MySecurityRightModel[] = []
): CRUDSecurityRights => {
	return mySecurityRights
		.filter(
			mySecurityRight =>
				mySecurityRight.attributes.type === 'content-type' &&
				mySecurityRight.attributes.reference === contentTypeId
		)
		.reduce((acc, mySecurityRight) => {
			return Object.keys(CONTENT_TYPE_CRUD_RIGHT_KEYS).reduce(
				(rights, mySecurityRightKey) => {
					return {
						...rights,
						// Only check for right when it is not already true
						// We can not remove the security right once it is set
						[mySecurityRightKey]: !rights[
							mySecurityRightKey as keyof CRUDSecurityRights
						]
							? mySecurityRight.attributes.key.startsWith(
									CONTENT_TYPE_CRUD_RIGHT_KEYS[
										mySecurityRightKey as keyof typeof CONTENT_TYPE_CRUD_RIGHT_KEYS
									]
							  )
							: rights[mySecurityRightKey as keyof CRUDSecurityRights],
					};
				},
				acc
			);
		}, DEFAULT_CRUD_RIGHTS);
};
