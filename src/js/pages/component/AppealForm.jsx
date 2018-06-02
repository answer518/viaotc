import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Upload, Input, Button, message } from 'antd';
import Textarea from 'pages/component/Textarea';
import { isEmpty } from 'lodash';
import FormButton from 'pages/component/FormButton';
import { beforeUpload, getErrorMsg, getUploadUrl } from 'utils/util';
import ajax from 'utils/request';

const FormItem = Form.Item;

class AppealForm extends Component {

	static displayName = 'AppealForm';

	constructor(props){
		super(props);
		this.state = {
			error: '',
			timeStamp: Date.now()
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	};

	handleChange({file}){
		if (isEmpty(file)) return;
	    if (file.status === 'done') {
	      if (file.response.error == 0){
	      	message.success(`${file.name}上传成功`);
	      }	else {
	      	message.error(`${file.name}上传失败, ${getErrorMsg(file.response.msg||'')}`);
	      }	
	    } else if (file.status === 'error') {
	      message.error(`${file.name}上传失败`);
	    }	 		
	}

	handleSubmit(e){
	    e.preventDefault();
	    const { url, order_id, onSuccess } = this.props;
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	const { reason, appeal_img={} } = values;
	      	const { fileList = [] } = appeal_img;
	      	let appealImgs = [];
	
	      	fileList.forEach((file) => {
	      		const { error, data } = file.response;
	      		if (error == 0){
	      			appealImgs.push(data.image_url); 
	      		}
	      	});
	 
	      	ajax.post(url, {order_id, reason, appeal_img: appealImgs.join(',')})
	     		.then((response) => {
	     			const { error, msg='' } = response;
	     			if (error == 0){
	     				onSuccess && onSuccess();
	     			} else {
	     				const errorMsg = getErrorMsg(msg)
	     				this.setState({timeStamp: Date.now(), error: errorMsg});
	     			}
	     		})
	      }
	    })
	}

	render(){
		const { action, order_id, form } = this.props;
		const { getFieldDecorator, getFieldsValue } = form;
		const { error, timeStamp } = this.state;
		const { reason='', appeal_img=[] } = getFieldsValue();

		return (
			<div className="appeal-form-wrap">
				<FormItem className="form-item">
					{
						getFieldDecorator('reason',{
							rules: [{required: true, message: '请输入申诉内容'}]
						})(<Textarea />)
					}
				</FormItem>
				<FormItem className="form-item">
					{
						getFieldDecorator('appeal_img',{

						})(<Upload 
							listType="picture"
							className="upload-btn inline"
							beforeUpload={beforeUpload}
							onChange={this.handleChange}
							action={getUploadUrl(action)} 
							data={{order_id}}
							name="appeal"	
							withCredentials={true}						
						>
							<div>
								{appeal_img.length > 2 ? null : <Button>上传附件</Button>}
								<span className="inline" style={{lineHeight: '32px', marginLeft: '13px'}}>支持格式jpg或png，大小不超过5M</span>
							</div>
						</Upload>)
					}
				</FormItem>		
				<FormButton
					className="submit-btn-wrap"
					isDisabled={!reason}
					onSubmit={this.handleSubmit}
					errorTime={timeStamp}
					error={error}
				/>		
			</div>
		)
		
	}
}

export default Form.create()(AppealForm);