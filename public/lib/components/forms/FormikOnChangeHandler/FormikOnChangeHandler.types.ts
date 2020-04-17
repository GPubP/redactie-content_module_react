import { FormikValues } from 'formik';

export interface FormikOnChangeHandlerProps {
	onChange: (values: FormikValues) => void;
	initialValues?: { [key: string]: any };
	values?: { [key: string]: any };
}
