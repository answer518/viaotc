import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import FormButton from 'pages/component/FormButton';
import MD5 from 'md5';
import ajax from 'utils/request';
import { getErrorMsg } from 'utils/util';

const FormItem = Form.Item;

class FundPasswordForm extends Component {

	static displayName = 'FundPasswordForm';

	constructor(props){
		super(props);
		this.state = {
			timeStamp: Date.now(),
			error: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	static propTypes = {
		url: PropTypes.string,
		param: PropTypes.object
	};

	handleSubmit(e){
		e.preventDefault();
		const { url, param, onSuccess } = this.props;

	   	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			const { funds_password } = values;
      			ajax.post(url, {...param, funds_password: MD5(funds_password)})
      				.then((response) => {
      					const { error, msg } = response;
      					if (error == 0){
							onSuccess && onSuccess();
      					} else {
      						const errorMsg = getErrorMsg(msg);
      						this.setState({error: errorMsg, timeStamp: Date.now()})
      					}
      				})
      		}	
      	})	
	}

	render(){
		const { style, text } = this.props;
		const { timeStamp, error } = this.state;
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { funds_password } = getFieldsValue();

		return (
			<div className="form-container">
				<input type="password" style={{display: 'none'}} name="funds_password"/>
				<div className="custon-form-item" style={style}>
					<label>资金密码：</label>
					<FormItem>
						{ 
							getFieldDecorator('funds_password',{
								rules: [{required: true, message: '请输入资金密码'}]
							})(<Input placeholder="请输入资金密码" type="password" name="funds_password"/>)
						}	
					</FormItem>									
				</div>
				<div style={{height: '80px', backgroundColor: '#fff'}}>
					<FormButton
						text={text}
						className="submit-btn-wrap"
						isDisabled={!funds_password}
						errorTime={timeStamp}
						error={error}
						onSubmit={this.handleSubmit}
					/>
				</div>
			</div>
		)
		
	}
}

export default Form.create()(FundPasswordForm)