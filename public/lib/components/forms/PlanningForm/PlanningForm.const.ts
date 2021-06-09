import { date, object } from 'yup';

export const PLANNING_VALIDATION_SCHEMA = object().shape({
	publishTime: date(),
	unpublishTime: date(),
});
