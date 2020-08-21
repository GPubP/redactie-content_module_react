import { Button } from '@acpaas-ui/react-components';
import { ViewFieldProps } from '@redactie/form-renderer-module';
import React, { FC, useMemo } from 'react';

const CCLinkView: FC<ViewFieldProps> = ({ value = {} }) => {
	const { text, url } = value;
	const isExternal = useMemo(
		() =>
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
				url
			),
		[url]
	);
	const buttonProps = useMemo(() => {
		if (isExternal) {
			return {
				iconLeft: 'external-link',
				type: 'primary',
			};
		}
		return {
			type: 'primary',
		};
	}, [isExternal]);

	if (!url) {
		return null;
	}

	return <div className="u-margin-bottom">{<Button {...buttonProps}>{text || url}</Button>}</div>;
};

export default CCLinkView;
