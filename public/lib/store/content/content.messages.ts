import { AlertMessage } from '../../content.types';
import { ContentSchema } from '../../services/content';

export const getAlertMessages = (
	data: ContentSchema
): Record<string, Record<string, AlertMessage>> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt een nieuw content item '${data.meta.label}' aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken voor '${data.meta.label}' mislukt`,
		},
		errorSlug: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken voor '${data.meta.label}' mislukt. De opgegeven slug is reeds in gebruik.`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `U hebt een nieuwe revisie van ${data.meta.label} bewaard`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren nieuwe revisie van '${data.meta.label}' is mislukt`,
		},
		errorSlug: {
			title: 'Bewaren mislukt',
			message: `Bewaren nieuwe revisie van '${data.meta.label}' mislukt. De opgegeven slug is reeds in gebruik.`,
		},
	},
	publish: {
		success: {
			title: 'Status gewijzigd: gepubliceerd',
			message: `U hebt een nieuwe revisie van '${data.meta.label}' gepubliceerd`,
		},
		error: {
			title: 'Status wijzigen naar gepubliceerd mislukt',
			message: `Publiceren nieuwe revisie van '${data.meta.label}' is mislukt`,
		},
	},
});
