import ky from 'ky';

import { SearchParams } from './api.service.types';

export type KyInstance = typeof ky;

// Create ky instance with defaults
const api: KyInstance = ky.create({
	prefixUrl: '/v1/proxy/sites-engine',
});

export const parseSearchParams = (searchParams: SearchParams): URLSearchParams => {
	return new URLSearchParams(
		(Object.keys(searchParams) as Array<keyof typeof searchParams>).map(key => {
			return [key, searchParams[key]?.toString() as string];
		})
	);
};

export default api;
