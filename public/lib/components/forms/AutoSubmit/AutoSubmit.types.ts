import { FormikValues } from 'formik';

export interface AutoSubmitProps {
	delay?: number;
	onChange: (values: FormikValues) => void;
	initialValues?: { [key: string]: any };
	submitForm?: () => void;
	values?: { [key: string]: any };
}
