import { MySecurityRightModel } from '@redactie/roles-rights-module';
import { useEffect, useState } from 'react';

import { CRUDSecurityRights } from '../../content.types';
import { getMySecurityRightsByContentTypeId } from '../../helpers';

const useMyContentTypeRights = (
	contentTypeId?: string,
	mySecurityRights: MySecurityRightModel[] = []
): CRUDSecurityRights | null => {
	const [contentTypeRights, setContentTypeRights] = useState<CRUDSecurityRights | null>(null);

	useEffect(() => {
		if (
			Array.isArray(mySecurityRights) &&
			mySecurityRights.length > 0 &&
			typeof contentTypeId === 'string'
		) {
			setContentTypeRights(
				getMySecurityRightsByContentTypeId(contentTypeId, mySecurityRights)
			);
		}
	}, [contentTypeId, mySecurityRights]);

	return contentTypeRights;
};

export default useMyContentTypeRights;
