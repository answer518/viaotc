import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class StepStatus extends Component {

	static displayName = 'StepStatus';

	constructor(props){
		super(props);
	}

	renderSteps(){
		const { steps, activeStep } = this.props;
		const stepItems = [];

		for(let i = 0; i < steps; i++) {
			const index = i+1;
			const cls = classNames({
				'step-status-item': true,
				'step-status-item-active': activeStep === index || activeStep > index
			});
			stepItems.push(<div className={cls} key={i}>{index}</div>);
		}
		return stepItems;
	}

	render(){

		return (
			<div className="step-status">
				<div className="step-status-items">
					{this.renderSteps()}
				</div>
			</div>
		)
		
	}
}

export default StepStatus