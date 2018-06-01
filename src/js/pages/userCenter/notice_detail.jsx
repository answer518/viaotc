import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { getBaseUrl } from 'utils/util';

class NoticeDetail extends Component {

	static displayName = 'NoticeDetail';

	constructor(props){
		super(props)
	}

	static propTypes = {

	}

	render(){

		return (
			<div className="user-center-notice-detail user-center-notice-content">
				<div className="user-center-notice-head">
					【ViaOTC】人民币交易   注册有礼
					{/*<Link className="back" to="/app/userCenter/notice">返回列表</Link>*/}
				</div>
				<div className="user-center-notice-detail-body">
					<div className="user-center-notice-detail-content">
						<h2>尊敬的用户：</h2>
						<p style={{marginBottom: '40px'}}>ViaOTC交易平台正式开通法币交易BTC、BCC、ETH、ETC、LTC、DASH，上线伊始平台将对新注册用户发放奖励。</p>
						<p>活动期间平台将对新注册用户随机赠送 BTC、BCC、ETH、ETC、LTC、DASH，价值10 ~ 10000元不等。</p>
						<p>平台每日送出总值 1BTC ，先到先得，送完为止。</p>
						<p style={{marginBottom: '40px'}}>活动奖品将于活动结束后三个工作日内统一发放到用户账户。</p>
						<p>ViaOTC官方QQ1群：191444807</p>
						<p>ViaOTC官方微信2群：</p>
						<div className="wechat-img">
							<img src={`${getBaseUrl()}/www/service.jpg`}/> 
						</div>
						<p>ViaOTC</p> 
						<p>2018年1月1日</p>
					</div>
				</div>
			</div>
		)
		
	}
}

export default NoticeDetail