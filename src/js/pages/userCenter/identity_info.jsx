import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Upload, message } from 'antd';
import { Link } from 'react-router';
import EditInput from 'components/EditInput';
import { beforeUpload, getErrorMsg, getUploadUrl } from 'utils/util';
import ajax from 'utils/request';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';


const uploadProps = {
  name: 'avatar',
  accept: 'image/png, image/jpeg',
  action: getUploadUrl('/api/pc/user/upload_avatar'),
  showUploadList: false,
  withCredentials: true,
  beforeUpload
};

class IdentityInfo extends Component {

	static displayName = 'IdentityInfo';

	constructor(props){
		super(props); 
		this.state = {
			userInfo: {},
			edit: false,
			error: ''
		};
		this.getUserInfo = this.getUserInfo.bind(this);
		this.startUserNameEdit = this.startUserNameEdit.bind(this);
		this.handleSetName = this.handleSetName.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleUploadChange = this.handleUploadChange.bind(this);
	};

	static propTypes = {

	}; 

	componentDidMount(){
		this.getUserInfo();
	}	

	getUserInfo(){
		ajax.get('/api/pc/user/info')
			.then((response) => {
				const { error, data } = response;
				if(error == 0){
					this.setState({userInfo: data.userinfo})
				}
			})
	}

	renderAuthStatus(){
		const { auth_status='' } = this.state.userInfo;
		switch(String(auth_status)) {
			case '-1':
				return <Link to="/app/userCenter/identityAuth">认证</Link>
			break;	
			case '0':
				return <span>待审核</span>
			break;	
			case '1':
				return <span className="success">已认证</span>
			break;
			case '2':
				return <Link to="/app/userCenter/identityAuth">审核拒绝</Link>
			break;
			default: return ''	
		}
	} 

	startUserNameEdit(){
		this.setState({edit: true, error: ''});
	}

	handleCancel(){
		this.setState({edit: false, error: ''});
	}

	handleSetName(value){
		if (this.props.globalState.username == value) {
			this.setState({edit: false});
			return;
		}
		ajax.post('/api/pc/user/set_username', {username: value})
			.then((response) => {
				const { error, msg } = response;
				if (error == 0){
					this.props.actions.changeUserName(value);
					this.setState({edit: false});
				} else {
					const errorMsg = getErrorMsg(msg);
					this.setState({error: errorMsg});
				}
			})
	}
 
	handleUploadChange(info){
		const { fileList } = info;
		const lastFileList = fileList.slice(-1);
		if (!lastFileList || !lastFileList[0]) return;

	    if (info.file.status === 'done') {
	      if (lastFileList[0].response.error == 0){
	      	this.props.actions.updateAvatar(lastFileList[0].response.data.image_url);
	      	message.success(`${info.file.name}上传成功`);
	      }	else {
	      	message.error(`${info.file.name}上传失败, ${getErrorMsg(lastFileList[0].response.msg||'')}`);
	      }	
	    } else if (info.file.status === 'error') {
	      message.error(`${info.file.name}上传失败`);
	    }	    	
	}

	render(){
		const { avatar, username } = this.props.globalState;
		const { edit, error } = this.state;
 		const { realname='', country='', uid='' } = this.state.userInfo;

		return (
			<div className="order-info-content">
				<div className="order-info-content-head">
					<h1>身份信息</h1>
				</div>
				<div className="order-info-content-body info-content">
					<div className="info-list sl">
						<span>当前头像：</span>
						<img src={avatar} className="user-img"/> 
						<div className="upload-wrap">
							<Upload 
								{...uploadProps}
								onChange={this.handleUploadChange}
							>
								<Button>上传图片</Button>
							</Upload>
						</div>
					</div>
					<div className="info-list" style={{padding: '19px 0', lineHeight: '32px'}}>
						<span className="label">个人昵称：</span>
						<EditInput 
							value={username} 
							className="inline"
							edit={edit}
							onClick={this.handleSetName}
							onCancel={this.handleCancel}
							error={error}
						/>
					</div>
					<div className="info-list">
						<span className="label">姓名：</span>
						<span>{realname}</span>
						<span className="fr auth-status">{this.renderAuthStatus()}</span>
					</div>		
					<div className="info-list">
						<span className="label">UID：</span>
						<span>{uid}</span>
					</div>		
					{/*<div className="info-list">
						<span>生日：</span>
						<span style={{marginLeft: '20px'}}>{realname}</span>
						<span className="fr" style={{color: '#14a23f'}}>已认证</span>
					</div>*/}		
					<div className="info-list">
						<span className="label">国籍：</span>
						<span>{country || 'china'}</span>
					</div>																				
				</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(IdentityInfo);