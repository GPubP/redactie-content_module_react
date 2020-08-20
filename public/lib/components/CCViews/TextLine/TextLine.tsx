import { ViewFieldProps } from '@redactie/form-renderer-module';
import React, { FC, ReactElement } from 'react';

import { TextHTMLTypes } from './TextLine.const';

const CCTextLineView: FC<ViewFieldProps> = ({ value }) => {
	const { text, textHTMLType } = value;

	if (!text || !textHTMLType) {
		return null;
	}

	const renderTextHTMLElement = (): ReactElement | null => {
		switch (textHTMLType) {
			case TextHTMLTypes.H1:
				return <h1>{text}</h1>;
			case TextHTMLTypes.H2:
				return <h2>{text}</h2>;
			case TextHTMLTypes.H3:
				return <h3>{text}</h3>;
			case TextHTMLTypes.H4:
				return <h4>{text}</h4>;
			case TextHTMLTypes.H5:
				return <h5>{text}</h5>;
			case TextHTMLTypes.H6:
				return <h6>{text}</h6>;
			case TextHTMLTypes.P:
				return <p>{text}</p>;
			case TextHTMLTypes.DIV:
				return <div>{text}</div>;
			default:
				return null;
		}
	};

	return <>{renderTextHTMLElement()}</>;
};

export default CCTextLineView;
