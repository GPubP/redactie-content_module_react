import { date, object, Schema } from 'yup';

export const PLANNING_VALIDATION_SCHEMA = (publishTime: string): Schema<unknown> =>
	object().shape({
		publishTime: date()
			.min(new Date().toISOString(), 'Publicatiedatum moet in de toekomst liggen')
			.nullable(true),
		unpublishTime: date()
			.min(
				publishTime ? publishTime : new Date().toISOString(),
				`Archiveringsdatum moet ${
					publishTime ? 'na de publicatiedatum liggen' : 'in de toekomst liggen'
				}`
			)
			.nullable(true),
	});
