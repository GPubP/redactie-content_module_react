import Core from '@redactie/redactie-core';
import React, { FC } from 'react';

import { RenderChildRoutesProps } from './RenderChildRoutes.types';

const RenderChildRoutes: FC<RenderChildRoutesProps> = ({ routes, guardsMeta, extraOptions }) => {
	return (
		<>
			{Core.routes.render(
				routes?.map(route => ({
					...route,
					guardOptions: {
						...route.guardOptions,
						meta: guardsMeta,
					},
				})),
				extraOptions
			)}
		</>
	);
};

export default RenderChildRoutes;
