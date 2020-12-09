import { ViewFieldProps } from '@redactie/form-renderer-module';
import React, { FC } from 'react';

import { TEXT_HTML_TYPES } from './TextBox.const';

const CCTextBoxView: FC<ViewFieldProps> = ({ value = {} }) => {
	const { text, textType: TextComponent } = value;

	if (!text || !TextComponent) {
		return null;
	}

	if (!TEXT_HTML_TYPES.includes(TextComponent)) {
		return null;
	}

	return (
		<div className="u-margin-bottom">
			<TextComponent>{text}</TextComponent>
		</div>
	);
};

export default CCTextBoxView;
