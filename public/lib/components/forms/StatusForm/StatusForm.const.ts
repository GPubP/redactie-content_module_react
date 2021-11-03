import { object, ObjectSchema, string } from 'yup';

export const STATUS_VALIDATION_SCHEMA = (allowedWorkflowStates: string[]): ObjectSchema =>
	object().shape({
		status: string().required(),
		workflowState: string()
			.oneOf(allowedWorkflowStates, 'Selecteer een geldige status')
			.required('Selecteer een geldige status'),
	});
