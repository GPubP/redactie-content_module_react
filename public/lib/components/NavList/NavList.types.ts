import { NavLinkProps } from 'react-router-dom';

export interface NavListItem {
	label: string;
	to: NavLinkProps['to'];
	hasError?: boolean;
}

export interface NavListProps {
	items: NavListItem[];
}
