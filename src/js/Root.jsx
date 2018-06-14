import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/header';
import Navigation from 'components/navigation';
import Footer from 'components/footer';
import FloatEMail from 'components/float-email';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';


class Root extends Component {

	static displayName = 'Root';

	constructor(props){
		super(props)
	}

	static childContextTypes = {
		is_logged:PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		])
	}

	componentDidMount(){

	}

	componentWillReceiveProps(nextProps){
		const { pathname } = nextProps.location;
		const { is_logged } = nextProps.globalState;

		if (/^\/app\/entrance\/?\w*/.test(pathname) || pathname === '/' || pathname === '/app' || pathname === '/app/entrance/login') return; //登录相关页面均不用处理
		if ((/^\/app\/userCenter\/?\w*/.test(pathname) || /^\/app\/assetManage\/?\w*/.test(pathname)) && is_logged != 1){
			browserHistory.push('/app/entrance/login');
			return;
		}
	}

	getChildContext(){
		return {is_logged: this.props.globalState.is_logged}
	}

	render(){
		const { location } = this.props;

		return (
			<div className="root">
				<Header />
				<Navigation location={location}/>
				<div className="main">
					{this.props.children}
				</div>
				<FloatEMail />
				<Footer />			
			</div>
		)
		
	}
}

//export default Root;

function mapStateToProps(state) {
  return {globalState: state}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(globalAction, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);