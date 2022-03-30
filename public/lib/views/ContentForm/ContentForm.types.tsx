import { FormSchema } from '@redactie/form-renderer-module';
import { StateMachineContext, StateMachineEvent } from '@redactie/redactie-workflows';
import { NavigateFn } from '@redactie/utils';
import { WorkflowDetailModel } from '@redactie/workflows-module';
import { WorkflowDetailResponse } from '@redactie/workflows-module/dist/lib/services/workflows';
import { FormikProps, FormikValues } from 'formik';
import { FC, ReactElement } from 'react';
import { StateMachine } from 'xstate';

import { ModuleSettings, ModuleValue } from '../../api/api.types';
import { ContentRouteProps } from '../../content.types';
import { ContentSchema } from '../../services/content/content.service.types';
import {
	ContentTypeSchema,
	ErrorMessagesSchema,
	ValidateSchema,
} from '../../services/contentTypes/contentTypes.service.types';
import { ContentCompartmentModel } from '../../store/ui/contentCompartments';

export interface FormRendererProps {
	schema: FormSchema;
	validationSchema: ValidateSchema;
	errorMessages: ErrorMessagesSchema;
}

export interface ContentFormMatchProps {
	siteId: string;
	contentTypeId: string;
	compartment: string;
	contentId: string;
}

export interface ContentFormRouteProps<T> extends ContentRouteProps<T> {
	contentType: ContentTypeSchema;
	contentItemDraft: ContentSchema;
	contentItem: ContentSchema;
	hasChanges: boolean;
	isCreating?: boolean;
	showPublishedStatus?: boolean;
	showDeleteButton?: boolean;
	onCancel: () => void;
	onDelete: () => Promise<void>;
	onSubmit: (
		content: ContentSchema,
		activeCompartment: ContentCompartmentModel,
		compartments: ContentCompartmentModel[]
	) => Promise<void>;
	onStatusClick: () => void;
	onUpdatePublication: (
		content: ContentSchema,
		compartments: ContentCompartmentModel[]
	) => Promise<void>;
	workflow: WorkflowDetailResponse;
}

export type CtTypeSettings = Pick<
	ContentTypeSchema,
	'valueSyncMap' | 'fields' | 'validateSchema' | 'errorMessages'
> & { includeWorkingTitle: boolean };

export interface CompartmentProps<
	M = ModuleValue,
	S = ModuleSettings | CtTypeSettings | ContentTypeSchema | undefined
> {
	contentType: ContentTypeSchema;
	contentValue: ContentSchema | undefined;
	contentItem: ContentSchema | undefined;
	settings: S;
	value: M; // module data section
	isValid: boolean;
	isCreating: boolean;
	formikRef?: (instance: FormikProps<FormikValues> | null) => void;
	onChange: (e: M) => void; // Boolean for validation result (maybe?)
	updateContent: (e: ContentSchema) => void; // For edge cases where content item must be changed. Boolean for validation
	updateContentMeta: (e: ContentSchema['meta']) => void; // For edge cases where meta must be changed. Boolean for validation
	workflow?: WorkflowDetailModel;
	machine?: StateMachine<StateMachineContext, any, StateMachineEvent> | undefined;
	allowedTransitions?: string[];
	activeLanguage?: string;
}

export interface AlertState {
	type: 'danger' | 'warning';
	title: string;
	message: ReactElement;
	confirm?: boolean;
	confirmLabel?: string;
	cancel?: boolean;
	cancelLabel?: string;
	containerId?: string;
	actions?: FC<{
		navigate: NavigateFn;
		siteId: string;
		contentId: string;
		contentTypeId: string;
	}>;
}
