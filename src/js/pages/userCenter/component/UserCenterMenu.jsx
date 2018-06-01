import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

class UserCenterMenu extends Component {

	static displayName = 'UserCenterMenu';

	constructor(props){
		super(props)
	};

	static propTypes = {

	};

	static defaultProps = {
		menus: [{
			name: '我的订单',
			link: 'userCenter/order'
		},{
			name: '交易信息',
			link: 'userCenter/deal'
		},{
			name: '我的工单',
			link: 'userCenter/workOrder'
		},{
			name: '我的消息',
			link: 'userCenter/news'
		},{
			name: '安全设置',
			link: 'userCenter/security'
		},{
			name: '身份信息',
			link: 'userCenter/identity'
		}]
	};

	render(){

		return (
			<div className="user-center-menu">
				
			</div>
		)
		
	}
}

export default UserCenterMenu