import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { Select } from 'antd';
import CoinTypeSelect from 'pages/component/CoinTypeSelect';

const Option = Select.Option;

class DealListCommonHead extends Component {

	static displayName = 'DealListCommonHead';

	constructor(props){
		super(props);
		this.state = {
			country: 'china',
			pay_way: '3',
			pay_type: 'cny'
		};
	}

	static propTypes = {
		activeTab: PropTypes.string //决定高亮项
	};

	static defaultProps = {
		tabs: [
			{name: '出售', to: '/app/dealCenter/sellList', id: 'sell'},
			{name: '购买', to: '/app/dealCenter/buyList', id: 'buy'}
		]
	};

	componentWillReceiveProps(nextProps){
		if (!isEqual(this.props.param, nextProps.param)){
			this.setState((prev) => {
				return {...prev, ...nextProps.param}
			})
		}
	}

	handleChange(type, value){
		const { onChange } = this.props;
		onChange && onChange({[type]: value});
	}

	renderTabs(){
		const { tabs, activeTab } = this.props;
		return tabs.map((tab, i) => {
			const { name, to, id } = tab;
			const cls = classNames({
				'deal-center-list-item': true,
				'deal-center-list-active': activeTab === id
			});
			return (<Link to={to} className={cls} key={i}>{name}</Link>)
		});
	}	

	render(){	
		const { coin_type, currency, pay_method, country } = this.props;
		
		return (
			<div className="deal-center-list-head">
				<div className="deal-center-list-head-content">
					<div className="deal-center-list-type clearfix">
						{this.renderTabs()}
					</div>
					<div className="deal-center-list-filters">
						<div className="deal-center-list-filter">
							<div className="deal-center-list-filter-label">地区:</div>
							<div className="deal-center-list-filter-content">
								<Select
									value={country}
									onChange={this.handleChange.bind(this, 'country')}
								>
									<Option value="china">中国</Option>
								</Select>
							</div>
						</div>
						<div className="deal-center-list-filter">
							<div className="deal-center-list-filter-label">交易币种:</div>
							<div className="deal-center-list-filter-content">
								<CoinTypeSelect 
									all={false}
									value={coin_type}
									onChange={this.handleChange.bind(this, 'coin_type')}
								/>
							</div>
						</div>				
						<div className="deal-center-list-filter">
							<div className="deal-center-list-filter-label">支付币种:</div>
							<div className="deal-center-list-filter-content">
								<Select
									value={currency}
									onChange={this.handleChange.bind(this, 'currency')}
								>
									<Option value="CNY">CNY</Option>
								</Select>
							</div>
						</div>	
						<div className="deal-center-list-filter">
							<div className="deal-center-list-filter-label">付款方式:</div>
							<div className="deal-center-list-filter-content">
								<Select
									value={pay_method}
									onChange={this.handleChange.bind(this, 'pay_method')}
									style={{width: 120}}
								>
									<Option value="">不限</Option>
									<Option value="bank_transfer">国内银行转账</Option>
									<Option value="alipay">支付宝</Option>
									<Option value="weixin">微信</Option>
								</Select>
							</div>
						</div>																
					</div>
				</div>
			</div>
		)
		
	}
}

export default DealListCommonHead