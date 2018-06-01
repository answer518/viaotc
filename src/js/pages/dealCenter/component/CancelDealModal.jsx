import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormButton from 'pages/component/FormButton';
import ajax from 'utils/request';
import { getErrorMsg } from 'utils/util';

class CancelDealModal extends Component {

	static displayName = 'CancelDealModal';

	constructor(props){
		super(props);
		this.state = {
			timeStamp: Date.now(),
			error: ''
		};		
		this.cancelDeal = this.cancelDeal.bind(this);
	}

	static defaultProps = {
		tip: '请您确认是否要取消本次交易'
	};

	cancelDeal(){
		const { order_id, onSuccess } = this.props;
		ajax.post('/api/orders/cancel', {order_id})
			.then((response) => {
				const { error, msg } = response;
				if(error == 0){
					onSuccess && onSuccess();
				} else {
					const errorMsg = getErrorMsg(msg);
					this.setState({timeStamp: Date.now(), error: errorMsg});
				}
			})		
	}

	render(){
		const { text, tip } = this.props;
		const { timeStamp, error } = this.state;

		return (
			<div className="deal-tip deal-cancel-tip">
				<div className="warn tip-icon"></div>
				<div style={{marginBottom: '50px'}}>{tip}</div>
				<div style={{height: '80px', backgroundColor: '#fff'}}>	
					<FormButton
						text={text}
						className="submit-btn-wrap"
						isDisabled={false}
						errorTime={timeStamp}
						error={error}
						onSubmit={this.cancelDeal}
					/>
				</div>
			</div>
		)
		
	}
}

export default CancelDealModal