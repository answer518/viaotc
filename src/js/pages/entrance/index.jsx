import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class Entrance extends Component {

	static displayName = 'Entrance';

	constructor(props){
		super(props)
	}

	static propTypes = {

	}

	render(){
		const { children, location } = this.props;

		const bgCls = classNames({
			'common-bg': true,
			'area-bg': true,
			'register-area-bg': location.pathname == "/app/entrance/register"
		});

		const child = React.cloneElement(children, {
			actions: this.props.actions
		})

		return (
			<div className="entrace-area">
				<div className={bgCls}></div>
				<div className="common-bg area-bite"></div>
				{child}
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

export default connect(mapStateToProps, mapDispatchToProps)(Entrance);