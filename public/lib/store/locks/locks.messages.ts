import { AlertMessage } from '../../content.types';
import { ContentSchema } from '../../services/content';

export const getAlertMessages = (
	data: ContentSchema
): Record<string, Record<string, AlertMessage>> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt een nieuwe revisie van ${data.meta.label} aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken nieuwe revisie van ${data.meta.label} mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `U hebt een nieuwe revisie van ${data.meta.label} bewaard`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren nieuwe versie van ${data.meta.label} is mislukt`,
		},
	},
	publish: {
		success: {
			title: 'Status gewijzigd: gepubliceerd',
			message: `U hebt een nieuwe revisie van ${data.meta.label} gepubliceerd`,
		},
		error: {
			title: 'Status wijzigen naar gepubliceerd mislukt',
			message: `Publiceren nieuwe revisie van ${data.meta.label} is mislukt`,
		},
	},
});
