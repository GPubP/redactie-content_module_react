import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { NavListProps } from './NavList.types';
import './NavList.scss';

const NavList: FC<NavListProps> = ({ items }) => {
	return (
		<ul className="m-nav-list">
			{items.map(({ label, to, hasError }, index) => (
				<li key={`nav-list-${index}`} className={hasError ? 'm-nav-list__item--error' : ''}>
					<NavLink activeClassName="is-active" to={to}>
						{label}
						{hasError && '*'}
					</NavLink>
				</li>
			))}
		</ul>
	);
};

export default NavList;
