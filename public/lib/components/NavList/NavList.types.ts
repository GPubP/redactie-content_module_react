import { NavLinkProps } from 'react-router-dom';

export interface NavListItem {
	label: string;
	to: NavLinkProps['to'];
}

export interface NavListProps {
	items: NavListItem[];
}
