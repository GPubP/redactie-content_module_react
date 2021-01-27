import { ViewFieldProps } from '@redactie/form-renderer-module';
import React, { createElement, FC } from 'react';

import { TEXT_HTML_TYPES } from './TextLine.const';

const CCTextLineView: FC<ViewFieldProps> = ({ value = {} }) => {
	const { text, textType } = value;

	if (!text || !textType) {
		return null;
	}

	if (!TEXT_HTML_TYPES[textType]) {
		return null;
	}

	const htmlType = TEXT_HTML_TYPES[textType];

	return (
		<div className="u-margin-bottom">
			{createElement(htmlType.el, { className: htmlType.class }, text)}
		</div>
	);
};

export default CCTextLineView;
