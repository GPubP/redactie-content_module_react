import { FieldSchema } from '@redactie/form-renderer-module';
import { FormikProps, FormikValues } from 'formik';

export type DateTimeFieldProps = { form: FormikProps<FormikValues>; fieldSchema: FieldSchema };
