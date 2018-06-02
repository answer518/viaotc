import React, { Component } from 'react'
import "./index.less"
import { Select, Spin ,Modal} from 'antd'
import { getUrlParam, getBaseUrl } from 'utils/util'
import axios from 'utils/request'
import CashAdresForm from './cashAdres_form';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

const Option = Select.Option;

class CashAdres extends Component {

	static displayName = 'CashAdres';

	constructor(props) {
		super(props);
		this.state = {
			data:[],
			type:'',
			loading:true,
			coinTypeList:[],
			selectType:'btc',
			adresList:[],
			modalVisible:false
		};
		this.selectChange = this.selectChange.bind(this);
		this.showModal = this.showModal.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSuccess = this.handleSuccess.bind(this);
	}

	componentDidMount(){
		this.getCoinType()
		this.getAddress()
	}

	showModal(){
		this.setState({
			modalVisible:true
		})
	}

	handleCancel(){
		this.setState({
			modalVisible:false
		})
	}

	handleSuccess(){
		this.setState({
			modalVisible:false
		}, () => {
			this.getAddress();
		});
	}

	delete(id){
		this.setState({
			loading:true
		})
		axios.get('/api/pc/withdraw_addr/delete',{addr_id:id}).then(
			d => {
				if(String(d.error) =='0'){
					this.getAddress()
				}else{
					Modal.error({
						title: '提示',
						content: '删除失败',
					});
				}
			}
		)
	}

	getCoinType(){
		axios.get('/api/pc/market/coin_type',{}).then(
			d => {
				this.getAddress(d.data[0])
				this.setState({
					coinTypeList:d.data,
					//selectType:d.data[0]
				})
			}
		)
	}

	getAddress(){
		const coin_type = this.state.selectType;

		if(coin_type){
			this.setState({
				loading:true
			});
			axios.get('/api/pc/withdraw_addr',{coin_type}).then(
				d => {
					this.setState({
						adresList:d.data.addrs,
						loading:false
					})
				}
			)
		}

	}


	selectChange(value){
		//获取该币种下的地址数据，更新数据
		this.setState({
			selectType:value
		},()=>{
			this.getCoinType()
		})

	}

	renderSelect(){
		let {coinTypeList} = this.state;
		return(
			coinTypeList.map((item,i)=>
				<Option value= {item} key ={item}>{item}</Option>
			)
		)
	}

	renderAddressList(){
		let {adresList} = this.state
		return (
			adresList.map((item,i)=>
				<div className ="adres-item" key = {item.id}>
					<div className = "item-header">
						<div className = "left-name fl">
							{item.remark}
						</div>
						<div className="right-delete fr" onClick = {this.delete.bind(this,item.id)}>
							<span className = "delete-img"></span>
							<span style={{display:'inline-block',verticalAlign:'center'}}>删除</span>
						</div>
					</div>
					<div className = "adres-body">
						<div className = "money-type">
							地址:
						</div>
						<div className="address">
							{item.addr}
						</div>
					</div>
				</div>
			)
		)
	}



	render(){
		const { ga_status } = this.props.globalState;
		let {selectType,modalVisible} = this.state;
 
		return (
			<div>
				<div className = "cashAdres-container">
					<div className = "cash-title">
						<span className="left-title">地址管理</span>
						<div className="right-operation fr">
							<Select  style={{ width: 100 }} onChange={this.selectChange} value = {selectType}>
								{this.renderSelect()}
							</Select>
						</div>
					</div>
					<Spin spinning={this.state.loading}>
						<div className = "cashAdres-content clearfix">
							{this.renderAddressList()}
							<div className ="adres-item">
								<div className = "adres-body add-body" onClick={this.showModal}>
									<div className="adres-add">
										<img src={`${getBaseUrl()}/www/add.jpg`} alt=""/>
									</div>
									<div className="add-tip" onClick={this.showModal}>添加{selectType.toUpperCase()}常用提币地址</div>
								</div>
							</div>
						</div>
					</Spin>
				</div>
				<Modal
					visible={modalVisible}
					title="添加常用提币地址"
					footer = {null}
					width = {800}
					onCancel={this.handleCancel}
					wrapClassName = 'adres-modal'
				>
					{modalVisible && <CashAdresForm param = {{coin_type:selectType}} onSuccess = {this.handleSuccess} ga_status={ga_status} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(CashAdres);
