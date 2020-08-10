import React, { FC } from 'react';

import { PublishedStatusProps } from './PublishedStatus.types';

import './PublishedStatus.scss';

const PublishedStatus: FC<PublishedStatusProps> = ({ published }) => {
	return (
		<div className="published-status row middle-xs">
			{published ? (
				<div className="published-status__online col-xs-12">
					<span className="published-status__dot u-margin-right-xs"></span>Online
				</div>
			) : (
				<div className="published-status__offline col-xs-12">
					<span className="published-status__dot u-margin-right-xs"></span>Offline
				</div>
			)}
		</div>
	);
};

export default PublishedStatus;
