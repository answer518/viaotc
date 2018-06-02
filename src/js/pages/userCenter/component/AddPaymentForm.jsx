import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Button } from 'antd';
import FormUploadItem from 'pages/component/FormUploadItem.jsx';
import FormButton from 'pages/component/FormButton';
const FormItem = Form.Item;
const Option = Select.Option;
import MD5 from 'md5';
import {formatPhone} from 'utils/util'
import ajax from 'utils/request';
import './AddPaymentForm.less';
let successIcon = require('src/img/success_icon.png')

const options = {
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return {...props.fields};
  }
};

class AddPaymentForm extends Component {

    static displayName = 'AddPaymentForm';

    constructor(props){
        super(props);
        this.state = {
            payment: 'bank_transfer',
            funds_password: '', 
            bank_account: '', 
            account_branch: '', 
            bank_card_num: '', 
            account: '', 
            qrcode: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.validReBankCardNum = this.validReBankCardNum.bind(this);
    };

    componentDidMount(){
    }

    componentWillUmount(){
        this.props.form.resetFields();
    }

    validReBankCardNum (rule, value, callback) {
        const reValue = value;
        const { getFieldValue } = this.props.form;
        const firstValue = getFieldValue('bank_card_num');
        if (reValue !== firstValue) {
            return callback('两次输入的银行卡号不同！')
        }
        callback();
    }

    handleChangeType () {
        this.props.form.resetFields()
    }

    handleSubmit (e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { alipay_account, weixin_account, alipay_qrcode, weixin_qrcode, pay_method, funds_password, ...other } = values;
            let param;
            if (pay_method === 'alipay') {
                param = {account: alipay_account, qrcode: alipay_qrcode, pay_method, funds_password: MD5(funds_password), ...other}
            } else if (pay_method === 'weixin') {
                param = {account: weixin_account, qrcode: weixin_qrcode, pay_method, funds_password: MD5(funds_password), ...other}
            } else {
                param = {pay_method, funds_password: MD5(funds_password), ...other}
            }
            if (!err) {
                ajax.post('/api/pc/pay/add_pay', param).then(
                    d => {
                        if(d.error){
                            this.setState(d.msg)
                        }else{
                            this.props.onSuccess && this.props.onSuccess()
                        }
                    }
                )
            }
        });
    }

    render(){
        const { form, error, timeStamp, fields, realname } = this.props;
        const { getFieldDecorator, getFieldsValue, getFieldError } = form;
        const { pay_method, bank_account, account_branch, bank_card_num, account, qrcode, funds_password } = fields;

        return (
            <div className="clearfix">
                <FormItem className="form-item">
                    <label>姓名：</label>
                    <div className="form-item-content inset-content">{realname}</div>
                </FormItem>
                <FormItem className="form-item">
                    <label>支付方式：</label>
                    <div className="form-item-content inset-content">
                        {
                            getFieldDecorator('pay_method', {
                                rules: [{required: true, message: '请输入支付方式！'}]
                            })(
                                <Select placeholder="请输入支付方式" onChange={this.handleChangeType}>
                                    <Option value="alipay">支付宝</Option>
                                    <Option value="weixin">微信支付</Option>
                                    <Option value="bank_transfer">银行转账</Option>
                                </Select>
                            )
                        }
                    </div>
                </FormItem>
                {
                    pay_method.value === 'bank_transfer' ?
                    <div>
                        <FormItem className="form-item">
                            <label>开户银行：</label>
                            <div className="form-item-content inset-content">
                                {
                                    getFieldDecorator('bank_account', {
                                        rules: [{required: true, message: '请输入开户银行！'}]
                                    })(<Input placeholder="请输入开户银行"/>)
                                }
                            </div>
                        </FormItem>
                        <FormItem className="form-item">
                            <label>开户支行：</label>
                            <div className="form-item-content inset-content">
                                {
                                    getFieldDecorator('account_branch', {
                                        rules: [{required: true, message: '请输入开户支行！'}]
                                    })(<Input placeholder="请输入开户支行"/>)
                                }
                            </div>
                        </FormItem>
                        <FormItem className="form-item">
                            <label>银行卡号：</label>
                            <div className="form-item-content inset-content">
                                {
                                    getFieldDecorator('bank_card_num', {
                                        rules: [{required: true, message: '请输入银行卡号！'}]
                                    })(<Input placeholder="请输入银行卡号"/>)
                                }
                            </div>
                        </FormItem>
                        <FormItem className="form-item">
                            <label>确认卡号：</label>
                            <div className="form-item-content inset-content">
                                {
                                    getFieldDecorator('re_bank_card_num', {
                                        rules: [
                                            {required: true, message: '请确认银行卡号！'},
                                            this.validReBankCardNum
                                        ]
                                    })(<Input placeholder="请确认银行卡号"/>)
                                }
                            </div>
                        </FormItem>
                    </div> : ''
                }
                {
                    pay_method.value === 'alipay' ?
                    <div>
                        <FormItem className="form-item">
                            <label>支付宝账号：</label>
                            <div className="form-item-content inset-content">
                                {
                                    getFieldDecorator('alipay_account', {
                                        rules: [{required: true, message: '请输入支付宝账号！'}]
                                    })(<Input placeholder="请输入支付宝账号"/>)
                                }
                            </div>
                        </FormItem>
                        <FormItem className="form-item">
                            <label>上传收款二维码：</label>
                            <div className="form-item-content inset-content">
                                {
                                    getFieldDecorator('alipay_qrcode', {
                                        rules: [{required: true, message: '支付宝收款二维码未上传'}]
                                    })(
                                        <FormUploadItem 
                                            name="alipay"
                                            text="支付宝收款二维码"
                                            action='/api/pc/pay/upload_img'
                                            data={{type: 'alipay'}}
                                            uploadImg={qrcode}                                  
                                        />
                                    )
                                }
                            </div>
                        </FormItem>
                    </div> : ''
                }
                {
                    pay_method.value === 'weixin' ?
                    <div>
                        <FormItem className="form-item">
                            <label>微信账号：</label>
                            <div className="form-item-content inset-content">
                                {
                                    getFieldDecorator('weixin_account', {
                                        rules: [{required: true, message: '请输入微信账号！'}]
                                    })(<Input placeholder="请输入微信账号"/>)
                                }
                            </div>
                        </FormItem>
                        <FormItem className="form-item">
                            <label>上传收款二维码：</label>
                            <div className="form-item-content inset-content">
                                {
                                    getFieldDecorator('weixin_qrcode', {
                                        rules: [{required: true, message: '微信收款二维码未上传'}]
                                    })(
                                        <FormUploadItem 
                                            name="weixin"
                                            text="微信收款二维码"
                                            action='/api/pc/pay/upload_img'
                                            data={{type: 'weixin'}}
                                            uploadImg={qrcode}
                                        />
                                    )
                                }
                            </div>
                        </FormItem>
                    </div> : ''
                }
                <FormItem className="form-item">
                    <label>资金密码：</label>
                    <div className="form-item-content inset-content">
                        {
                            getFieldDecorator('funds_password', {
                                rules: [{required: true, message: '请输入资金密码！'}]
                            })(<Input type="password" placeholder="请输入资金密码"/>)
                        }
                    </div>
                </FormItem>
                <div className="submit-btn-wrap" >
                    <Button type="primary" className="submit-btn" onClick={this.handleSubmit}>确定</Button>
                </div>
            </div>
        )
    }
}

export default Form.create(options)(AddPaymentForm)