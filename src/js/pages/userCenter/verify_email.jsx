import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class VerifyEmail extends Component {

	static displayName = 'VerifyEmail';

	constructor(props){
		super(props)
	};

	static propTypes = {

	};

	render(){
		
		const { getFieldDecorator } = this.props.form; 

		return (
			<div className="form-block">
				<div className="form-block-head">
					邮箱验证
				</div>
				<div className="form-container verify-form">
					<FormItem className="form-item">
						<label>输入邮箱：</label>
						<div className="form-item-content">
							{
								getFieldDecorator('email', {

								})(<Input placeholder="请输入邮箱"/>)
							}
						</div>
					</FormItem>
					<FormItem className="form-item" style={{marginBottom: '21px'}}>
						<label>邮箱验证码：</label>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('emailcode', {

								})(<Input placeholder="请输入验证码"/>)
							}
							<Button type="primary">点击获取</Button>
						</div>
					</FormItem>		
					<FormItem className="form-item form-text">
						<label>手机号：</label> 
						<div className="form-item-content">
							185****3050
						</div>
					</FormItem>		
					<FormItem className="form-item">
						<label>短信验证码：</label>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('smscode', {

								})(<Input placeholder="请输入短信验证码"/>)
							}
							<Button type="primary">点击获取</Button>
						</div>
					</FormItem>		
					<FormItem className="form-item" style={{marginBottom: '40px'}}>
						<label>谷歌双重验证码：</label>
						<div className="form-item-content">
							{
								getFieldDecorator('googlecode', {

								})(<Input placeholder="确认双重验证码"/>)
							}
						</div>
					</FormItem>	
					<div className="submit-btn-wrap">
						<Button type="primary" className="submit-btn">确定</Button>
					</div>															
				</div>
			</div>
		)
		
	}
}

export default Form.create()(VerifyEmail)