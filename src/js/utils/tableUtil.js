import React from 'react';
import { Link } from 'react-router';

export const defaultFooter = (link, text="更多交易") => {
	return (<Link className="more-deal" to={link}>{text}</Link>)
};