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

		const { funds_password_status, auth_status, pay_status } = this.props.globalState;
		this.state = {
			redirect : false
		}
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
		
		if (this.state.redirect) {
			browserHistory.push({
				pathname : '/app/userCenter/dealIdentifiy',
				query: {
		          	type: '1'
		        }
			})
		}
	}

	componentDidMount() {
	}

	jumpPage(link){
		const { id } = this.props.location.query;
		if (id) return; 
		browserHistory.push(link);
	}

	renderDealTabs(){
		const { blocks, router } = this.props;

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
				{
					!this.state.redirect &&  
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
				}
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