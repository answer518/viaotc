import React, { Component } from 'react'
import propTypes from 'prop-types';
import Table from 'components/table'
import {Modal} from 'antd'
import "./index.less"
import {getUrlParam,formatNumber} from 'utils/util'
import axios from 'utils/request' 
import CashOutForm from  './cashOut_form'
import CashOutModal from './cashOut_modal'
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import FormButton from 'pages/component/FormButton';
import { browserHistory } from 'react-router';

class CashOut extends Component {

	static displayName = 'CashOut';

	constructor(props) {
		super(props);
		this.state = {
			coin_type:getUrlParam('coin_type'),
			adres:'',
			forceUpdateTime: Date.now(),
			showModal:false,
			cashOutVisible: false
		};
		this.cashOutSuccess = this.cashOutSuccess.bind(this);
		this.modalCancel = this.modalCancel.bind(this);
		this.handleCashOutOk = this.handleCashOutOk.bind(this);
		this.handleCashOutCancel = this.handleCashOutCancel.bind(this);
		this.handleSuccessTip = this.handleSuccessTip.bind(this);
		this.CashOutAppeal = this.CashOutAppeal.bind(this);
	}

	static propTypes = {

	};

	modalCancel(){
		this.setState({
			showModal:false
		})
	}

	cashOutSuccess(adres){
		this.setState({
			showModal:true,
			forceUpdateTime: Date.now(),
			adres:adres
		})
	}

	handleCashOutCancel(){
		this.setState({cashOutVisible: false});
	}

	handleCashOutOk(){
		this.setState({cashOutVisible: false});
		browserHistory.push('/app/assetManage');
	}

	handleSuccessTip(){
		this.setState({cashOutVisible: true});
	}

	CashOutAppeal(){
		this.setState({showModal: false});
		browserHistory.push('/app/assetManage');
	}

	cancle(id){
		axios.get('/api/pc/withdraw/cancle', {withdraw_id: id}).then(
			d => {
				if (String(d.error) == '0') {
					this.setState({
						forceUpdateTime: new Date().getTime()
					})
				} else {
					Modal.error({
						title: '提示',
						content: '删除失败',
					});
				}
			}
		)
	}

	rowKey(record, i){
		return i;
	}

	render(){
		let { coin_type, forceUpdateTime, adres, showModal, cashOutVisible } = this.state;
		const { ga_status } = this.props.globalState;
		let columns =[
			{
				title: '时间',
				dataIndex: 'create_time',
				key: 'create_time',
				render: (value) => {
					return Number(value) ? moment(Number(value) * 1000).format("YYYY-MM-DD HH:mm:ss") : '' 
				}				
			},
			{
				title: '提币地址',
				dataIndex: 'to_addr',
				key: 'to_addr'
			},
			{
				title: '提币数量',
				dataIndex: 'amount',
				key: 'amount'
			},
			{
				title: '手续费',
				dataIndex: 'fee',
				key: 'fee'
			},
			{
				title: '状态',
				dataIndex: 'status',
				render:(value,record)=>{
					switch (String(value)){
						case '0':
							return <span>未审核</span>;
							break;
						case '1':
							return <span>已取消</span>;
							break;
						case '2':
							return <span>汇款中</span>;
							break;
						case '3':
							return <span className ="status_fail">审核拒绝 </span>;
							break;
						case '4':
							return <span className ="status_success">完成 </span>;
							break;
					}
				}
			},
			{
				title: '操作',
				render:(value,record)=>{
					let disabled  = String(record.status) =='0'?false:true;
					return(
						<span className = "table-operation">
							<span className = {disabled?'table_disabled':''} onClick={disabled?()=>{}:this.cancle.bind(this,record.id)}>撤销</span>
						</span>
					)
				}
			}

		];
		return (
			<div >
				<div className = "cashIn-container">
					<div className = "cash-title">
						<span className="left-title">{coin_type.toUpperCase()}提币</span>
					</div>
					<div className = "cashOut-content">
						<CashOutForm 
							param = {{coin_type}}
							onSuccess = {this.cashOutSuccess} 
							ga_status={ga_status}
							onSuccessTip={this.handleSuccessTip}
						/>
					</div>
				</div>
				<Table
					columns = {columns}
					title = '提币记录' 
					url ='/api/pc/withdraw/records'
					tableKey ='records'
					param = {{coin_type}}
					forceUpdateTime = {forceUpdateTime}
					rowKey={this.rowKey}
				/>
				<Modal
					visible={showModal}
					title="提交申请已提交"
					footer = {null}
					width = {800}
					onCancel={this.modalCancel}
					wrapClassName = 'adres-modal cashout-modal'
				>
					<CashOutModal adres = {adres} onSuccess = {this.CashOutAppeal} onCancel={this.modalCancel}/>
				</Modal>
				<Modal
					title="提示"
					visible={cashOutVisible}
					className="deal-modal"
					onCancel={this.handleCashOutCancel}
					footer={null}
				>
					<div className="deal-tip deal-pay-tip">
						<div className="ok tip-icon"></div>
						<div style={{marginBottom: '30px'}}>
							<h4>您提币已成功！</h4>
						</div> 
						<div style={{height: '80px', backgroundColor: '#fff'}}>	
							<FormButton
								className="submit-btn-wrap"
								isDisabled={false}
								onSubmit={this.handleCashOutOk}
							/>
						</div>							
					</div>									
				</Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(CashOut);
