import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import CoinAmountList from 'pages/component/CoinAmountList';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';
import ajax from 'utils/request';
import './index.less'; 

class Navigation extends Component {

	static displayName = 'Navigation';

	constructor(props){
		super(props);
		this.gotoPublish = this.gotoPublish.bind(this);
		this.goToIndex = this.goToIndex.bind(this);
	}

	static defaultProps = { 
		menus: [{
			name: '首页',
			to: '/app'
		},{
			name: '交易中心',
			to: '/app/dealCenter'
		},{
			name: '资产管理',
			to: '/app/assetManage'
		},{
			name: '用户中心',
			to: '/app/userCenter'
		}]
	};

	static contextTypes = {
		is_logged:PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		])
	};

	gotoPublish(){
		const { is_logged } = this.context;

		ajax.get('/api/pc/auth/authinfo')
			.then((response) => {
				return response;
			}).then((response) => {
				const { data: {authinfo : { status }} } = response;
				if (is_logged == 1) {
					this.props.actions.updateAuthStatus(status);
					if(status == 1) {
						browserHistory.push('/app/dealCenter/publish/buy');
					} else {
						browserHistory.push({
							pathname : '/app/userCenter/dealIdentifiy'
						})
					}
				} else {
					browserHistory.push('/app/entrance/login');
				}
			})
	}

	goToIndex(){
		browserHistory.push('/app');
	}

	renderLinks(){
		const { menus } = this.props;
		const path = this.props.location.pathname;
		return menus.map((menu, i) => {
			const { name, to } = menu;
			const className = i === 0 && (path === '/' || path === '/app') ? 'active' : '';

			return (
				<li key={i}>
					<Link
						to={to}
						activeClassName="active"
						className={className}
						onlyActiveOnIndex={i === 0} //只有完全匹配才高亮
					>{name}</Link>
				</li>
			)
		});
	}

	render(){
		
		const { is_logged } = this.context;

		return (
			<div className="navigation">
				<div className="navigation-content clearfix">
					<div className="logo" onClick={this.goToIndex}>
						<div className="logo-img"></div>
						<span className="text"></span>
					</div>
					<ul className="menu clearfix">
						{this.renderLinks()}														
					</ul>
					<div className="operate-block clearfix">
						<div 
							className="post-btn"
							onClick={this.gotoPublish}
						>
							<div className="edit-img"></div>
							<span>发布广告</span>
						</div>
						{is_logged == 1 && <CoinAmountList />}
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
    return {globalState: state}
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(globalAction, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);