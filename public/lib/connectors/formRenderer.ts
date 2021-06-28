import { CustomValidator, FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';

const formsAPI: FormsAPI | null = Core.modules.getModuleAPI('forms-module') as FormsAPI | null;

export const getViewRegistry: () => FormsAPI['viewRegistry'] | undefined = () =>
	formsAPI?.viewRegistry;
export const getFieldRegistery: () => FormsAPI['fieldRegistry'] | undefined = () =>
	formsAPI?.fieldRegistry;
export const getForm: () => FormsAPI['Form'] | undefined = () => formsAPI?.Form;
export const getView: () => FormsAPI['View'] | undefined = () => formsAPI?.View;
export const ErrorMessage = formsAPI?.ErrorMessage as FormsAPI['ErrorMessage'];
export const getCustomValidator = (): typeof CustomValidator | undefined =>
	formsAPI?.CustomValidator as typeof CustomValidator | undefined;
export const parseFields: FormsAPI['parseFields'] = (fields, options) =>
	formsAPI?.parseFields ? formsAPI.parseFields(fields, options) : [];
export const getValueSyncMap: FormsAPI['getValueSyncMap'] = fields =>
	formsAPI?.getValueSyncMap ? formsAPI.getValueSyncMap(fields) : {};
export const getFormRendererFieldTitle = (): FormsAPI['FormRendererFieldTitle'] =>
	formsAPI?.FormRendererFieldTitle as FormsAPI['FormRendererFieldTitle'];
export const useFormContext = formsAPI?.useFormContext as FormsAPI['useFormContext'];
