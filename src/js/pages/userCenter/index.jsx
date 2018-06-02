import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames';

// {
// 	name: '我的工单',
// 	to: '/userCenter/userAbout/workOrder'
// },
class UserAbout extends Component {

	static displayName = 'UserAbout';

	constructor(props){ 
		super(props)
	}

	static defaultProps = {
		tabs: [{
			name: '我的订单',
			to: '/app/userCenter',
			icon: 'order'
		},{
			name: '我的广告',
			to: '/app/userCenter/tradeInfo',
			icon: 'deal'
		},{
			name: '我的消息',
			to: '/app/userCenter/myMessage',
			icon: 'message'
		},{
			name: '安全设置',
			to: '/app/userCenter/secureSetting',
			icon: 'secure'
		},{
			name: '身份信息',
			to: '/app/userCenter/identityInfo',
			icon: 'user'
		},{
			name: '支付方式',
			to: '/app/userCenter/myPayment',
			icon: 'payment'
		}]
	};

	renderTabs(){
		const { tabs } = this.props;
		return tabs.map((tab, i) => {
			const { name, to, icon } = tab;
			const cls = classNames({
				'icon': true,
				[icon]: icon
			});

			return (<Link 
						to={to} 
						key={i} 
						activeClassName="tabs-item-active" 
						className="tabs-item"
						onlyActiveOnIndex={i === 0} 
					>
					<div className={cls}></div>
					{name}
					</Link>)
		});
	}

	render(){

		return (
			<div className="user-about-content clears">
				<div className="tabs-common tabs-vertical">
					{this.renderTabs()}
				</div>
				<div className="tabs-common tabs-content">
					{this.props.children}
				</div>
			</div>
		)
		
	}
}

export default UserAbout