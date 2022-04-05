import { object, Schema, string } from 'yup';

export const STATUS_VALIDATION_SCHEMA = (allowedWorkflowStates: string[]): Schema<unknown> =>
	object().shape({
		status: string().required(),
		workflowState: string()
			.oneOf(allowedWorkflowStates, 'Selecteer een geldige status')
			.required('Selecteer een geldige status'),
	});
