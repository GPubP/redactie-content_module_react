import { MySecurityRightModel } from '@redactie/roles-rights-module';
import { useEffect, useState } from 'react';

import { CRUDSecurityRights } from '../../content.types';
import { getMySecurityRightsByContentTypeId } from '../../helpers';
import { ContentModel } from '../../store/content';

const useMyContentTypesRights = (
	contentItems: ContentModel[],
	mySecurityRights: MySecurityRightModel[]
): Record<string, CRUDSecurityRights> => {
	const [securityRightsMap, setSecurityRightsMap] = useState<Record<string, CRUDSecurityRights>>(
		{}
	);

	useEffect(() => {
		if (!Array.isArray(mySecurityRights) || !Array.isArray(contentItems)) {
			return;
		}

		const newSecurityRightsMap = contentItems.reduce((acc, contenItem) => {
			const contentTypeId = contenItem.meta?.contentType?._id;
			const contentId = contenItem._id;
			if (!contentId || !contentTypeId || acc[contentId]) {
				return acc;
			}

			acc[contentId] = getMySecurityRightsByContentTypeId(contentTypeId, mySecurityRights);
			return acc;
		}, {} as Record<string, CRUDSecurityRights>);

		setSecurityRightsMap(newSecurityRightsMap);
	}, [contentItems, mySecurityRights]);

	return securityRightsMap;
};

export default useMyContentTypesRights;
