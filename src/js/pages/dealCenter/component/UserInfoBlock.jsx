import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import ajax from 'utils/request';
import { getAvatar } from 'utils/util';

class UserInfoBlock extends Component {

	static displayName = 'UserInfoBlock';

	constructor(props){
		super(props);
		this.handleTrust = this.handleTrust.bind(this);
		this.handleShield = this.handleShield.bind(this);
	}

	static propTypes = {

	};

	handleTrust(){
		const { onInfoUpdate, user_id } = this.props;
		ajax.post('/api/trust/do_trust', {trust_id: user_id})
			.then((response) => {
				if (response.error == 0) {
					onInfoUpdate && onInfoUpdate();
				}
			});
	}

	handleShield(){
		const { onInfoUpdate, user_id } = this.props;
		ajax.post('/api/shield/do_shield', {shield_id: user_id})
			.then((response) => {
				if (response.error == 0) {
					onInfoUpdate && onInfoUpdate();
				}
			});
	}

	render(){
		const { info={}, username, user_id } = this.props; //聊天的话，取对方的username
		const { country='', auth_status, phone='', email='', order_times='', trusted_num, is_trusted, is_shielded } = info;
		const isSelf = window.OTC.id == user_id;

		const trustCls = classNames({
			'disabled': is_trusted || isSelf
		});
		const shieldCls = classNames({
			'disabled': is_shielded || isSelf
		});

		return (
			<div className="user-info-block clearfix">
				<div className="user-info-item">
					<img src={getAvatar(info.avatar)} className="icon inline-middle"/>
					<div className="info inline-middle">
						<div className="basic-info">
							<span className="name">{username}</span>
							<span className="from">From：{country || 'CHINA'}</span>
						</div>
						<div className="verifiy-info clearfix">
							{auth_status == 1 && <div className="verifiy-info-item">
								<span className="user-auth auth-icon"></span>
								<span className="auth-text">身份认证</span>
							</div>}
							{phone == 1 && <div className="verifiy-info-item">
								<span className="phone-auth auth-icon"></span>
								<span className="auth-text">手机认证</span>
							</div>}
							{email == 1 && <div className="verifiy-info-item">
								<span className="email-auth auth-icon"></span>
								<span className="auth-text">邮箱认证</span>
							</div>}
						</div>
					</div>
				</div>
				<div className="deal-info-item clearfix">
					<div className="deal-info-detail">
						<p className="title">交易次数</p>
						<div className="number">{order_times || 0}</div>
					</div>
					{/*<div className="deal-info-detail">
						<p className="title">交易总量</p>
						<div className="number">276</div>
					</div>*/}
					<div className="deal-info-detail">
						<p className="title">信任人数</p>
						<div className="number">{trusted_num || 0}</div>
					</div>
				</div>
				<div className="deal-info-operation">
					<Button
						type="primary"
						style={{marginRight: '20px'}}
						onClick={this.handleTrust}
						disabled={is_trusted || isSelf}
						className={trustCls}
					>{is_trusted ? '已信任' : '信任'}</Button>
					<Button
						className={shieldCls}
						onClick={this.handleShield}
						disabled={is_shielded || isSelf}
					>{is_shielded ? '已屏蔽' : '屏蔽'}</Button>
				</div>
			</div>
		)

	}
}

export default UserInfoBlock