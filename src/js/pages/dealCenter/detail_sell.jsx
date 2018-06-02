import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserInfoBlock from './component/UserInfoBlock';
import DealInfoTable from './component/DealInfoTable';
import DealInfoDetailBlock from './component/DealInfoDetailBlock';
import ajax from 'utils/request';


class DealCenterDetailSell extends Component {

	static displayName = 'DealCenterDetailSell';

	constructor(props){
		super(props);
		this.state = {
			info: {}
		};
		this.getDetail = this.getDetail.bind(this);
		this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
	}

	componentDidMount(){
		const { ad_id } = this.props.location.query;
		if (!ad_id) return;
		this.getDetail(ad_id);
	}

	componentWillReceiveProps(nextProps){
		const { ad_id } = this.props.location.query;
		const { ad_id:nextAdId } = nextProps.location.query;

		if (nextAdId && (ad_id != nextAdId)){
			this.getDetail(nextAdId);
		}
	}

	handleInfoUpdate(){ 
		const { ad_id } = this.props.location.query;
		this.getDetail(ad_id);
	}			
 
	getDetail(id){
		ajax.get('/api/pc/ggs/gg_info',{id})
			.then((response) => {
				const { error, data } = response;
				if (error == 0) {
					this.setState({info: data.ad || {}});
				}
			});
	}

	render(){
		const { ad_id } = this.props.location.query;
		const { info } = this.state;

		return (
			<div className="detail-content">
				<UserInfoBlock 
					info={info}
					user_id={info.user_id}
					onInfoUpdate={this.handleInfoUpdate}
					username={info.username}						
				/>
				<div className="detail-info-body clearfix">
					<DealInfoDetailBlock 
						info={info}
						type="sell"
						ad_id={ad_id}
					/>
					<DealInfoTable 
						ad_type={info.ad_type}
						coin_type={info.coin_type}
						user_id={info.user_id}
						isSelf={window.OTC.id == info.user_id}
						type="sell"
					/>
				</div>
			</div>
		)
		
	}
}

export default DealCenterDetailSell;