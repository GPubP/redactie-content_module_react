import { ContentTypeSchema } from './contentTypes.types';

export const getContentType = (id: string): Promise<ContentTypeSchema> => {
	return Promise.resolve({
		uuid: '169004f2-dbdb-4166-92c6-565781f019ca',
		meta: {
			label: 'Nieuws',
			description: 'Content type voor nieuws berichten',
		},
		fields: [
			{
				name: 'titel',
				label: 'Titel',
				module: 'core',
				fieldType: {
					uuid: '12c7df0d-5e9a-4eaa-b2f5-6adacdfebf0f',
					data: {
						componentName: 'text',
					},
				},
			},
		],
		validationSchema: {},
		errorMessages: {},
	});
};
