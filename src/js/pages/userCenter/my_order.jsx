import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Table, Modal } from 'antd';
import { Link } from 'react-router';
import CoinTypeSelect from 'pages/component/CoinTypeSelect';
import TypeSelect from 'pages/component/TypeSelect';
import AppealForm from 'pages/component/AppealForm';
import ajax from 'utils/request';
import { adTypeMap, statusMap } from 'utils/util';

const urlMap = {
	0: 'doing_orders',
	1: 'finished_orders',
	2: 'canceled_orders',
	3: 'appealing_orders'	
};

const types =[{
	name: '类型',
	id: ''
},{
	name: '购买',
	id: 'buy'
},{
	name: '出售',
	id: 'sell'
}];

class MyOrder extends Component {

	static displayName = 'MyOrder';

	constructor(props){
		super(props);
		this.state = {
			orders: [],
			order_status: 0,
			page: 1,
			coin_type: '',			
			page_size: 10, 
			total: 0,
			loading: false,
			appealVisible: false,
			currentOrderId: ''
		};
		this.getMyOrders = this.getMyOrders.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleAppeal = this.handleAppeal.bind(this);
		this.appealCancel = this.appealCancel.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		//this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);		
	};

	static defaultProps = {
		tabs: [{
			name: '进行中的交易',
			id: 0
		},{
			name: '已完成的交易',
			id: 1
		}, {
			name: '已取消的交易',
			id: 2
		},{
			name: '申诉中的交易',
			id: 3
		}]
	};

	componentDidMount(){
		this.getMyOrders();
	}

	createColumns(order_status){
		const { coin_type } = this.state;

		const columns = [{
			title: '订单编号', 
			dataIndex: 'order_num',
			key: 'order_num',
			width: 120
		},{
			title: <CoinTypeSelect 
					width={65}
					onChange={this.handleSelectChange} 
					value={coin_type}
			/>,
			dataIndex: 'coin_type',
			key: 'coin_type',
			render: (text) => {
				return text.toUpperCase()
			}
		},{
			title: '类型',
			dataIndex: 'ad_type',
			key: 'ad_type',
			render: (text) => {
				return adTypeMap[text]
			}
		},{
			title: '交易额',
			dataIndex: 'amount',
			key: 'amount'
		},{
			title: '价格',
			dataIndex: 'coin_price',
			key: 'coin_price'
		},{
			title: '交易总额',
			dataIndex: 'currency_amount',
			key: 'currency_amount'
		},{
			title: '手续费',
			dataIndex: 'fee',
			key: 'fee'
		},{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (text) => {
				return statusMap[text]
			}
		}];

		const operate = [{
			title: '操作',
			dataIndex: 'operate',
			key: 'operate',
			width: 150,
			render: (text, record) => {
				const { id, ad_type } = record;
				
				return (<div className="operate-list">
							<Link className="operate-list-item" to={`/app/dealCenter/deal/${ad_type}?order_id=${id}`}>进入交易</Link>
							<span className="operate-list-item" onClick={this.showAppeal.bind(this, id)}>申诉</span>
						</div>)
			}
		}];

		const checkOperate = [{
			title: '操作',
			dataIndex: 'operate',
			key: 'operate',
			width: 150,
			render: (text, record) => {
				const { id, ad_type } = record;

				return (<div className="operate-list">
							<Link className="operate-list-item" to={`/app/dealCenter/deal/${ad_type}?order_id=${id}`}>查看</Link>
						</div>)
			}
		}];		

		return order_status === 0 ? columns.slice().concat(operate) : columns.slice().concat(checkOperate);
	}

	handleTabChange(id){
		this.setState({order_status: id}, () => { 
			this.getMyOrders(true);
		});
	}

	handlePageChange(page, pageSize){
		this.setState({page}, () => {
			this.getMyOrders();
		});
	}

	handleSelectChange(value){
		this.setState({coin_type: value}, () => {
			this.getMyOrders(true);
		});
	}

	// handleTypeSelectChange(value){
	// 	this.setState({type: value}, () => { 
	// 		this.getMyOrders(true);
	// 	});
	// }	

	getMyOrders(pageReset){
		const { order_status, page, coin_type } = this.state;
		const url = `/api/pc/orders/${urlMap[order_status]}`;
		const finalPage = pageReset ? 1 : page;
 		
 		this.setState({loading: true});

		ajax.get(url, {page: finalPage, coin_type})
			.then((response) => {
				const { error, data } = response;
				this.setState({loading: false});
				if (error == 0){
					const { orders, page_size, total } = data;
					const _orders = orders.map(order => {
						const { ad_type, order_user_id } = order;
						if (order_user_id === window.OTC.id) {
							order.ad_type = ad_type == 'sell' ? 'buy' : 'sell';
						}
						return order
					})
					this.setState({orders: _orders, page_size, total});
				}
			})		
	}


	showAppeal(id){
		this.setState({appealVisible: true, currentOrderId: id});
	}

	handleAppeal(){
		this.setState({appealVisible: false}, () => {
			this.getMyOrders();
		});
	}

	appealCancel(){
		this.setState({appealVisible: false});
	}

	renderTabs(){
		const { tabs } = this.props;
		const { order_status } = this.state;

		return tabs.map((tab, i) => {
			const { name, id } = tab;
			const cls = classNames({
				'tabs-item': true,
				'tabs-item-active': order_status === id
			});

			return (<div 
						className={cls}
						key={i}
						onClick={this.handleTabChange.bind(this, id)}
					>{name}</div>)
		});
	}

	rowKey(record, index){
		return `${index}-${record.id}-${record.order_num}`;
	}

	render(){

		const { orders, order_status, page, total, page_size, loading, appealVisible, currentOrderId } = this.state;
		const columns = this.createColumns(order_status);

		return (
			<div className="order-info-content">
				<div className="order-info-content-head">
					<h1>我的订单</h1>
					<div className="tabs-wrap clears">
						{this.renderTabs()}
					</div>
				</div>
				<div className="order-info-content-body">
					<Table
						rowKey={this.rowKey}
						dataSource={orders}
						columns={columns}
						loading={loading} 
						pagination={{size: 'small', current: page, pageSize: page_size, total, onChange: this.handlePageChange}}
					/>
				</div>
				<Modal
					title="申诉说明"
					width={580}
					visible={appealVisible}
					className="deal-modal deal-appeal-modal"
					onCancel={this.appealCancel}
					footer={null}
				>
					{appealVisible && <AppealForm 
						url="/api/pc/appeal/do_appeal"
						action="/api/pc/appeal/upload_img"
						order_id={currentOrderId}
						onSuccess={this.handleAppeal}
					/>}
				</Modal>	
				<Modal
					title="提示"
				>

				</Modal>					
			</div>	
		)
		
	}
}

export default MyOrder