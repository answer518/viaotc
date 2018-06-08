
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;
import {formatPhone} from 'utils/util'
import axios from 'utils/request'
let successIcon = require('src/img/success_icon.png')

class CashOutModal extends Component {

	static displayName = 'CashOutForm';

	constructor(props){
		super(props);
		this.handleSubmit  = this.handleSubmit.bind(this);
		this.state = {
			remark:''
		}
	};

	static propTypes = {
		type: PropTypes.string //fund modify
	};

	static defaultProps = {
		adres:''
	};

	componentDidMount(){
	}

	handleSubmit (e){
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				axios.post('/api/pc/withdraw_addr/add_security_addr',values).then(
					d => {
						if(d.error){
							this.setState(d.msg)
						}else{
							this.props.onSuccess && this.props.onSuccess()
						}
					}
				)
			}
		});
	}

	render(){
		const { form, adres, onCancel } = this.props;
		const { getFieldDecorator } = form;
		let {remark} = this.state
		return (
			<div className="clearfix">
				<img src= {successIcon} alt="" className="success"/>
				<div className ='success-tip'>您的提币申请已提交成功，请您耐心等待审核。</div>
				<div className="set-adres">您的提币地址为新增地址，您可将：
					<span style={{color:'#3665ff'}}>{adres}</span>
					设为常用地址
				</div>
				<FormItem className="form-item">
					<label>地址备注：</label>
					<div className="form-item-content inset-content">
						{
							getFieldDecorator('remark', {
								rules: [{required: true, message: '请输入地址备注！'}]
							})(<Input placeholder="请输入地址备注"/>)
						}
					</div>
					<div className="has-error">{remark}</div>
				</FormItem>
				<div className="submit-btn-wrap" >
					<Button type="primary" className='cancel-btn' onClick={onCancel}>暂不</Button>
					<Button type="primary" className="submit-btn" onClick={this.handleSubmit}>确定</Button>
				</div>
			</div>
		)

	}
}

export default Form.create()(CashOutModal)
