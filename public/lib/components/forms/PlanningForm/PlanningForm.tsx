import React, { FC, ReactElement } from 'react';

import { CompartmentProps } from '../../../api/api.types';

const PlanningForm: FC<CompartmentProps> = ({
	contentValue,
	value,
	onChange,
}): ReactElement | null => {
	/**
	 * METHODS
	 */

	/**
	 * RENDER
	 */
	return <div>Planning form</div>;
};

export default PlanningForm;
