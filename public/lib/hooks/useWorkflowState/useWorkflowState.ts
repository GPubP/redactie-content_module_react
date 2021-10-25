import { WorkflowDetailModel, WorkflowPopulatedTransition } from '@redactie/workflows-module';
import { useMemo } from 'react';

import { ContentSchema } from '../../..';

export const useWorkflowState = (
	contentItem: ContentSchema | undefined,
	workflow: WorkflowDetailModel | undefined
): WorkflowPopulatedTransition['from'] | null => {
	return useMemo(() => {
		const workflowStateName = contentItem?.meta.workflowState;
		const transition = workflowStateName
			? (workflow?.data
					.transitions as WorkflowPopulatedTransition[])?.find(
					(transition: WorkflowPopulatedTransition) =>
						[transition.from?.data.systemName, transition.to?.data.systemName].includes(
							workflowStateName
						)
			  )
			: null;

		if (!transition) {
			return null;
		}

		if (transition.from.data.systemName === workflowStateName) {
			return transition.from;
		}

		return transition.to;
	}, [contentItem, workflow]);
};
