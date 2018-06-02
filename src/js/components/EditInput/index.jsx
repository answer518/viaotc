import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

class EditInput extends Component {

	constructor(props){
		super(props);
		this.state = {
			value: props.value || ''
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSureClick = this.handleSureClick.bind(this);
		this.handleCancelClick = this.handleCancelClick.bind(this);
	}

	static propTypes = {
		edit: PropTypes.bool
	};

	static defaultProps = {
		edit: false
	};

	componentWillReceiveProps(nextProps){
		if (this.props.value !== nextProps.value){
			this.setState({value: nextProps.value});
		}
	}

	handleInputChange(e){
		this.setState({
			value: e.target.value
		})
	}

	handleSureClick(){
		if (this.state.value == '') return;
		const { onClick } = this.props; 
		onClick && onClick(this.state.value);
	}

	handleCancelClick(){
		const { value, onCancel } = this.props;
		this.setState({value});
		onCancel && onCancel();
	}

	render(){
		const { edit, className, error='' } = this.props;
		const { value } = this.state;

		const cls = classNames({
			'edit-input-wrap': true,
			[className]: className
		})

		return (	
			<div className={cls}>
				{
					edit ? 
					<div className="inline">
						<input 
							type="text" 
							value={value}
							onChange={this.handleInputChange}
						/>
						<div 
							className="edit-icon sure inline"
							onClick={this.handleSureClick}
						></div>
						<div 
							className="edit-icon cancel inline"
							onClick={this.handleCancelClick}
						>
						</div>
						{error && <span style={{marginLeft: '10px', fontSize: '12px;', color: '#f04134', lineHeight: '32px'}}>{error}</span>}
					</div>: 
					<span>{value}</span> 
				}
			</div>
		)
		
	}
}

export default EditInput