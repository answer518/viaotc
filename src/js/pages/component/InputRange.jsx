import React, { Component, PropTypes } from 'react';
import { isEqual } from 'lodash';

class InputRange extends Component {

    static displayName = "InputRange";

    constructor(props) {
      super(props);
      this.state = {
        min: props.value[0] || '',
        max: props.value[1] || ''
      };
      this.handleMinChange = this.handleMinChange.bind(this);
      this.handleMaxChange = this.handleMaxChange.bind(this);
    }

    static defaultProps = {
        divide: '~'
    };

    componentWillReceiveProps(nextProps){
        const { onChange } = nextProps;
        if (!isEqual(this.props.value, nextProps.value)){
            this.setState({min: nextProps.value[0], max: nextProps.value[1]});
        }

        if (this.props.coinType !== nextProps.coinType){
            onChange && onChange([nextProps.value[0], nextProps.value[1]]);
        }
    }

    handleMinChange(e){
        const { onChange } = this.props;
        onChange && onChange([e.target.value, this.state.max]);
    }

    handleMaxChange(e){
        const { onChange } = this.props;
        onChange && onChange([this.state.min, e.target.value]);
    }

    render(){
        const { divide } = this.props;
        const { min, max } = this.state;

        return (
            <div className="input-range-wrap cleafix">
                <input
                    type="text"
                    value={min}
                    onChange={this.handleMinChange}
                />
                <div className="divide-text relate">{divide}</div>
                <input
                    type="text"
                    value={max}
                    onChange={this.handleMaxChange}
                />
            </div>
        )

    }

}

export default InputRange