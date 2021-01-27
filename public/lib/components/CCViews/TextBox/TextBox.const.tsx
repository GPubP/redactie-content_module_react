import React, { FC } from 'react';

export const TEXT_HTML_TYPES: Record<string, { el: string | FC<any>; class: string }> = {
	div: {
		el: 'div',
		class: '',
	},
	p: {
		el: 'p',
		class: '',
	},
	'p-small': {
		el: function PSmall({ children }) {
			return (
				<p>
					<small>{children}</small>
				</p>
			);
		},
		class: 'h6',
	},
	blockquote: {
		el: 'blockquote',
		class: '',
	},
	'alert-warning': {
		el: 'div',
		class: 'm-alert m-alert--warning',
	},
	code: {
		el: 'code',
		class: '',
	},
};
