import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ajax from 'utils/request';

class TradeOperate extends Component {

	static displayName = 'TradeOperate';

	constructor(props){
		super(props);
	};

	render(){ 
		const myId = window.OTC.id;
		const { status, id, onDelete, onActive, ad_type, ad_user_id, order_user_id } = this.props; 
		// const sellerId = ad_type == 'sell' ? ad_user_id : order_user_id;
		// const type = sellerId == myId ? 'sell' : 'buy';

		return (
			<div className="operate-list">
				{status == 0 && <div className="operate-container">
					<Link className="operate-list-item" to={`/app/dealCenter/publish/${ad_type}?id=${id}`}>修改</Link>		
					<span className="operate-list-item" onClick={onDelete}>删除</span>					
				</div>}
				{
					status == 1 && <div className="operate-container">
						<Link className="operate-list-item" to={`/app/dealCenter/publish/${ad_type}?id=${id}`}>修改</Link>		
						<span className="operate-list-item" onClick={onDelete}>删除</span>						
					</div>
				}
				{
					(status > 1 && status < 5) && <div className="operate-container">
						<Link className="operate-list-item" to={`/app/dealCenter/detail/${ad_type}?ad_id=${id}`}>查看</Link>
					</div>
				}
			</div>
		)
		
	}
}

export default TradeOperate;