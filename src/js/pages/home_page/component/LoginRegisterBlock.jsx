import React, { PropTypes, Component } from 'react';
import LoginForm from './LoginForm';

class LoginRegisterBlock extends Component {

	static displayName = 'LoginRegisterBlock';

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="login-register-block">
				<LoginForm />
			</div>
		)
	}
}

export default LoginRegisterBlock;