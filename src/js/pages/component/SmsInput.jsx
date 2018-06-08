import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, message } from 'antd';
import CountDownButton from 'components/countDownButton';
import ajax from 'utils/request';
import { empty, getErrorMsg } from 'utils/util';

class SmsInput extends Component {

	static displayName = 'SmsInput';

	constructor(props){
		super(props);
		this.state = {
			timeStamp: Date.now()
		};
		this.getSmsCode = this.getSmsCode.bind(this);
	};

	static defaultProps = {
		canGet: true,
		sms_action: 0
	};

	getSmsCode(){
		const { param, onSmsIdChange, onSmsError, canGet, sms_action } = this.props;
		if (!canGet) return;
		ajax.post('/api/pc/sms/send', {
			sms_action,
			...param
		})
		.then((response) => {
			const { error, data, msg } = response;

			if (error == 0){
				onSmsIdChange && onSmsIdChange(data.sms_id);
				return ;
			}
			
			const errorMsg = getErrorMsg(msg);
			message.warn(errorMsg);
			// 与后端协商error=2, 继续60秒倒计时; 否则，倒计时重置
			error != 2 && this.setState({timeStamp: Date.now()});
			onSmsError && onSmsError(Date.now());
		});		
	}

	render(){
		const { value, onChange, placeholder, canGet } = this.props; 
		const { timeStamp } = this.state;

		return (
			<div className="sms-input">
				<Input 
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					maxLength="6"
				/>
				<div className="area-code-button">
					<CountDownButton
						timeStamp={timeStamp}
						onClick={canGet ? this.getSmsCode : empty}
					/>
				</div>				
			</div>
		)
		
	}
}

export default SmsInput
