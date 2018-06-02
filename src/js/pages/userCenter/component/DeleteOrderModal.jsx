import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormButton from 'pages/component/FormButton';
import ajax from 'utils/request';
import { getErrorMsg } from 'utils/util';

class DeleteOrderModal extends Component {

	static displayName = 'DeleteOrderModal';

	constructor(props){
		super(props);
		this.state = {
			timeStamp: Date.now(),
			error: ''
		};		
		this.deleteOrder = this.deleteOrder.bind(this);
	}

	static defaultProps = {
		tip: '请您确认是否要删除订单' 
	};

	deleteOrder(){
		const { id, onSuccess } = this.props;

		ajax.get('/api/pc/ggs/delete', {id})
			.then((response) => {
				const { error, msg } = response;
				if(error == 0){ 
					onSuccess && onSuccess();
				} else {
					const errorMsg = getErrorMsg(msg);
					this.setState({timeStamp: Date.now(), error: errorMsg});
				}
			});				
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
						onSubmit={this.deleteOrder}
					/>
				</div>
			</div>
		)
		
	}
}

export default DeleteOrderModal