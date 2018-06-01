import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Modal, message } from 'antd';
import { beforeUpload, getErrorMsg, getUploadUrl } from 'utils/util';
import classNames from 'classnames';
import axios from 'axios';

class FormUploadItem extends Component {

	static displayName = 'FormUploadItem';

	constructor(props){
		super(props);
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleUploadChange(info){
		const { onChange } = this.props;
		const { fileList } = info;
		const lastFileList = fileList.slice(-1);
		if (!lastFileList || !lastFileList[0]) return;
		
	    if (info.file.status === 'done') {
	      if (lastFileList[0].response.error == 0){
	      	const image_url = lastFileList[0].response.data.image_url;
	      	onChange && onChange(image_url);
	      	message.success(`${info.file.name}上传成功`);
	      }	else {
	      	message.error(`${info.file.name}上传失败, ${getErrorMsg(lastFileList[0].response.msg||'')}`);
	      }	
	    } else if (info.file.status === 'error') {
	      message.error(`${info.file.name}上传失败`);
	    }	 	    	
	}	

	handleCancel(){

	}

	render(){
		const { onChange, name, text, action, data, className, value } = this.props;
		const cls = classNames({
			[className]: className
		});

		return (
			<div className={cls}>
				<Upload
				  	accept='image/png, image/jpeg'
				  	showUploadList={false}				
					name={name}
					action={getUploadUrl(action)}
					data={data}
					onChange={this.handleUploadChange}
					beforeUpload={beforeUpload}
					showUploadList={false}
					withCredentials={true}
				>
					{value ? <img src={`${window.OTC.upload_url}${value}`} style={{width: '170px',height: '107px'}}/> :
					<div className="upload-box">
						<div className="upload-add"></div>
						{text}
					</div>}
				</Upload>		
			</div>
		)
		
	}
}

export default FormUploadItem