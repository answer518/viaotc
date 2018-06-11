import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import ajax from 'utils/request';

class DealCenterPublish extends Component {

	static displayName = 'DealCenterPublish';

	constructor(props){
		super(props);
		const { location, globalState} = this.props;
		const { funds_password_status, auth_status, pay_status } = globalState;

		// 发布购买广告
		// if(location.pathname === '/app/dealCenter/publish/buy') { 
		// 	this.state = {
		// 		redirect : auth_status != 1 || funds_password_status != 1 
		// 	}
		// } else {
		// 	this.state = {
		// 		redirect : auth_status != 1 || funds_password_status != 1 || pay_status !== true
		// 	}
		// }
	}

	static defaultProps = {
		blocks: [{
			type: 'buy',
			title: '发布购买广告',
			link: '/app/dealCenter/publish/buy'
		}, {
			type: 'sell',
			title: '发布出售广告',
			link: '/app/dealCenter/publish/sell'
		}]
	}

	componentWillMount() {
		
		// if (this.state.redirect) {
		// 	browserHistory.push({
		// 		pathname : '/app/userCenter/dealIdentifiy',
		// 		query: {
		//           	type: '1'
		//         }
		// 	})
		// }
	}

	componentDidMount() {
	}

	jumpPage(link){
		const { id } = this.props.location.query;
		if (id) return; 
		browserHistory.push(link);
	}

	renderDealTabs(){
		const { id } = this.props.location.query;
		const { blocks, router } = this.props;

		if (id) {
			return <div className="deal-block-title">
				<span>修改广告</span>				
			</div>
		}

		return blocks.map((block, i) => {
			const { type, title, link } = block;
			const cls = classNames({
				'deal-block-item': true,
				[type]: type,
				'deal-block-item-active': router.isActive(link)
			});

			return (
				<div 
					className={cls} 
					key={i}
					onClick={this.jumpPage.bind(this, link)}
				>
					<span>{title}</span>				
				</div>
			)
		});
	}

	render() {
		return (
			<div className="body-content">
				<div className="deal-block">
					<div className="deal-block-head">
						<div className="deal-block-tabs clearfix">
							{this.renderDealTabs()}
						</div>
					</div>
					<div className="deal-block-body">
						{this.props.children}
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

export default connect(mapStateToProps, mapDispatchToProps)(DealCenterPublish);