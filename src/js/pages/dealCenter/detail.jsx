import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserInfoBlock from './component/UserInfoBlock';

class DealCenterDetail extends Component {

	static displayName = 'DealCenterDetail';

	constructor(props){
		super(props)
	}

	static propTypes = {

	}

	render(){

		return (
			<div 
				className="deal-center-detail center-content clearfix"
			>
				<div className="deal-info-detail">
					{this.props.children}
				</div>
				<div className="user-deal-info">
					<UserInfoBlock />
				</div>
			</div>
		)
		
	}
}

export default DealCenterDetail