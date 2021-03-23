import { Link as AUILink } from '@acpaas-ui/react-components';
import { ViewFieldProps } from '@redactie/form-renderer-module';
import classnames from 'classnames';
import React, { FC, useMemo } from 'react';

import { LinkPropsObject } from './Link.types';

const CCLinkView: FC<ViewFieldProps> = ({ value = {} }) => {
	const { text, url, target, className } = value;
	const style = value.style || '';
	const isExternal = useMemo(
		() =>
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
				url
			),
		[url]
	);

	const linkProps = useMemo(() => {
		const linkPropsObject: LinkPropsObject = {
			type: 'primary',
			target,
			href: url,
			className,
		};

		if (style === 'button') {
			linkPropsObject.className = classnames(linkPropsObject.className, 'a-button');
		}

		if (isExternal) {
			linkPropsObject.className = classnames(linkPropsObject.className, 'has-icon-left');
		}

		return linkPropsObject;
	}, [className, isExternal, style, target, url]);

	if (!url) {
		return null;
	}

	switch (style) {
		case 'button':
			return (
				<AUILink {...linkProps}>
					{isExternal && <span className="fa fa-external-link" aria-hidden="true" />}
					{text || url}
				</AUILink>
			);
		case 'link':
			return (
				<AUILink {...linkProps}>
					{isExternal && <span className="fa fa-external-link" aria-hidden="true" />}
					{text || url}
				</AUILink>
			);
		default:
			return <span>{text || url}</span>;
	}
};

export default CCLinkView;
