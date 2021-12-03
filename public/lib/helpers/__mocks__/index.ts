import { ContentTypeSchema } from '../../api/api.types';
import { FilterFormState } from '../../components';

export const MOCK_FILTER_FORM_STATE: FilterFormState = {
	contentType: [],
	creator: '',
	published: '',
	publishedFrom: '',
	publishedTo: '',
	search: '',
	status: '',
};

const generateMockContentTypes = (amount = 4): ContentTypeSchema[] => {
	return Array.from(Array(amount)).map((value, i) => ({
		_id: `${i}`,
		uuid: `${i}`,
		compartments: [],
		fields: [],
		valueSyncMap: {},
		meta: {
			label: `ct-${i}`,
			description: `ct-${i} description`,
			canBeFiltered: true,
			status: 'DRAFT',
		},
		errorMessages: {},
		validateSchema: {},
	}));
};

export const MOCK_CONTENT_TYPES = generateMockContentTypes();
