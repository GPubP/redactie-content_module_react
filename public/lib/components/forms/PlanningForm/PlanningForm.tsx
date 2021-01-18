import { CardBody } from '@acpaas-ui/react-components';
import React, { FC, ReactElement } from 'react';

import { CompartmentProps } from '../../../api/api.types';

const PlanningForm: FC<CompartmentProps> = (): ReactElement | null => {
	/**
	 * RENDER
	 */
	return <CardBody>Planning form</CardBody>;
};

export default PlanningForm;
