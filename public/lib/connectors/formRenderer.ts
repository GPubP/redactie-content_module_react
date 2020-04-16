import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';

const formsAPI: FormsAPI | null = Core.modules.getModuleAPI('forms-module') as FormsAPI | null;

export const getForm: () => FormsAPI['Form'] | undefined = () => formsAPI?.Form;
