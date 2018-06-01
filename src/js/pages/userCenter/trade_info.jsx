import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, message } from 'antd';
import CoinTypeSelect from 'pages/component/CoinTypeSelect';
import TypeSelect from 'pages/component/TypeSelect';
import TradeOpreate from 'pages/component/TradeOperate';
import DeleteOrderModal from './component/DeleteOrderModal';
import { Link } from 'react-router';
import { map } from 'lodash';
import ajax from 'utils/request';
import { adTypeMap, tradeStatusMap } from 'utils/util';

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

let statusList = map(tradeStatusMap, ((v, k) => {
	return {name: v, id: k}
}));
statusList.unshift({name: '状态', id: ''});
 

class TradeInfo extends Component {

	static displayName = 'TradeInfo';

	constructor(props){
		super(props);
		this.state = {
			page: 1,
			ads: [],
			page_size: 10,
			total: 0,
			coin_type: '', 
			type: '',
			visible: false,
			auth_status: '',
			loading: false,
			deleteVisible: false,
			status: '',
			id: 0
		};
		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
		this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
	};

	static propTypes = {

	};

	componentDidMount(){
		this.getMyTradeInfo();
	}

	handleCancel(){
		this.setState({visible: false});
	}

	handlePageChange(page, pageSize){
		this.setState({page}, () => {
			this.getMyTradeInfo();
		});
	}	

	handleSelectChange(value){
		this.setState({coin_type: value}, () => {
			this.getMyTradeInfo(true);
		});
	}

	handleTypeSelectChange(value){
		this.setState({type: value}, () => {
			this.getMyTradeInfo(true);
		});
	}

	handleStatusChange(value){
		this.setState({status: value}, () => {
			this.getMyTradeInfo(true);
		});		
	}

	handleDelete(id){
		this.setState({deleteVisible: true, id});
	}

	handleDeleteCancel(){
		this.setState({deleteVisible: false}); 
	}

	handleDeleteSuccess(){
		this.getMyTradeInfo();
		this.setState({deleteVisible: false}); 
	}

	handleActive(id){
		ajax.get('/api/ggs/activate', {id})
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					message.success('您的广告已激活成功');
					this.getMyTradeInfo();
				} else {
					const { auth_status='', funds_password } = data;
					const newAuthStatus = auth_status === '' ? 10 : auth_status;
					this.setState({visible: true, auth_status: newAuthStatus});
				}
			})
	}

	getMyTradeInfo(pageReset){
		const { page, coin_type, type, status } = this.state;
		const finalPage = pageReset ? 1 : page;
		this.setState({loading: true});

		ajax.get('/api/ggs/my_ggs', {page: finalPage, coin_type, type, status})
			.then((response) => {
				const { error, data } = response;
				this.setState({loading: false});
				if (error == 0) {
					const { Ads, page, page_size, total } = data;
					this.setState({ads: Ads, page_size, page, total});
				}
			}) 
	}

	rowKey(record, index){
		return `${index}-${record.ad_num}`
	}

	getColumns(){
		const { coin_type, type, status } = this.state;

		return [{
			title: '广告编号',
			dataIndex: 'ad_num',
			key: 'ad_num',
			width: 120
		},{
			title: <CoinTypeSelect 
					width={65}
					onChange={this.handleSelectChange} 
					value={coin_type}
			/>,
			dataIndex: 'coin_type',
			key: 'coin_type'
		},{
			title: <TypeSelect 
				width={65}
				onChange={this.handleTypeSelectChange} 
				types={types}
				value={type}
			/>,
			dataIndex: 'ad_type',
			key: 'ad_type',
			render: (text) => {
				return adTypeMap[text]
			}
		}, {
			title: '交易限额',
			dataIndex: 'min_amount',
			key: 'min_amount',
			render: (text, record) => {
				return <span>{text}-{record.max_amount}</span>
			}
		},{
			title: '国家',
			dataIndex: 'country',
			key: 'country',
			render: (text) => {
				return '中国'
			}
		},{
			title: '价格',
			dataIndex: 'price',
			key: 'price'
		},{
			title: '溢价率',
			dataIndex: 'premium',
			key: 'premium',
			render: (text) => {
				return `${text}%`
			}
		},{
			title: <TypeSelect 
				width={80}
				onChange={this.handleStatusChange}
				types={statusList}
				value={status}
			/>,
			dataIndex: 'status',
			key: 'status',
			render: (text) => {
				return tradeStatusMap[text]
			}
		},{
			title: '操作',
			dataIndex: 'operate',
			key: 'operate',
			width: 200,
			render: (text, record) => {
				const { status, id } = record;
				return <TradeOpreate 
							{...record}
							onDelete={this.handleDelete.bind(this, id)}
							onActive={this.handleActive.bind(this, id)}
						/>
			}
		}]
	}

	renderActiveTip(auth_status){
		switch(String(auth_status)){
			case '-1': 
				return {msg: '未进行身份认证', to: '/app/userCenter/identityAuth', text: '去认证'}
			break;
			case '0':
				return {msg: '身份认证信息未审核', to: '/app/userCenter/identityAuth', text: '查看'}
			break;	
			case '2':
				return {msg: '被拒绝', to: '/app/userCenter/identityAuth', text: '查看'}
			break;
			case '10':
				return {msg: '未设置资金密码', to: '/app/userCenter/fundPassword', text: '去设置'}
			break;	
			default:
				return {msg: '', text: '', to: ''}
		}
	}

	render(){
		const { ads, page, page_size, total, visible, auth_status, loading, deleteVisible, id } = this.state;
		const columns = this.getColumns();
		const { msg, to, text } = this.renderActiveTip(auth_status);

		return (
			<div className="order-info-content">
				<div className="order-info-content-head">
					<h1>广告</h1>
				</div>
				<div className="order-info-content-body">
					<Table
						rowKey={this.rowKey}
						dataSource={ads}
						columns={columns}
						loading={loading}
						pagination={{size: 'small', current: page, pageSize: page_size, total, onChange: this.handlePageChange}}
					/>
				</div>
				<Modal 
					className="deal-modal"
					title="激活状态"
					visible={visible}
					footer={null}
					width={600}
					onCancel={this.handleCancel}
				>
					<div className="active-tip">
						<span>{msg}</span>
						<Link to={to}>{text}</Link>
					</div>
				</Modal>
				<Modal 
					className="deal-modal"
					title="确认删除"
					visible={deleteVisible}
					onCancel={this.handleDeleteCancel}
					width={600}
					footer={null}
				>
					<DeleteOrderModal 
						tip="请您确认是否要删除广告"
						id={id}
						onSuccess={this.handleDeleteSuccess}
					/>
				</Modal>
			</div>	
		)
		
	}
}

export default TradeInfo