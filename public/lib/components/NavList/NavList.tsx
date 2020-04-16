import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { NavListProps } from './NavList.types';

const NavList: FC<NavListProps> = ({ items }) => {
	return (
		<ul className="m-nav-list">
			{items.map(({ label, to }, index) => (
				<li key={`nav-list-${index}`}>
					<NavLink activeClassName="is-active" to={to}>
						{label}
					</NavLink>
				</li>
			))}
		</ul>
	);
};

export default NavList;
