import { Alert } from '@acpaas-ui/react-components';
import { is } from 'ramda';
import React, { FC } from 'react';

import { LockModel } from '../../store/locks';

export const LockMessage: FC<{ lock: LockModel; className?: string }> = ({ lock, className }) => {
	return (
		<Alert
			className={className}
			type="warning"
			title="Item wordt bewerkt door een collega"
			closable={false}
		>
			Dit content item wordt momenteel bewerkt door{' '}
			<b>{is(Object, lock.meta.lastEditor) ? `${lock.meta.lastEditor?.firstname} ${lock.meta.lastEditor?.lastname}` : 'een collega'}</b>. <br />
			Je kan wachten of de collega vragen om de bewerk pagina te verlaten van dit content
			item.
		</Alert>
	);
};
