import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import { Popover, Modal, Form, Input, Select, Uploader, Button } from 'antd';
import AddPaymentForm from './component/AddPaymentForm';
import ajax from 'utils/request';
import moment from 'moment';
import './my_payment.less';
let warnIcon = require('src/img/warn.png')

class MyPayment extends Component {

    static displayName = 'MyPayment';

    constructor(props){
        super(props);
        this.state = {
            realname: '',
            payments: [],
            showAddModal: false,
            showRemoveModal: false,
            timeStamp: Date.now(),
            error: '',
            removeID: '',
            fields: {
                pay_method: {
                    value: 'alipay'
                },
                funds_password: {
                    value: ''
                },
                bank_account: {
                    value: ''
                },
                account_branch: {
                    value: ''
                },
                bank_card_num: {
                    value: ''
                },
                re_bank_card_num: {
                    value: ''
                },
                alipay_account: {
                    value: ''
                },
                alipay_qrcode: {
                    value: ''
                },
                weixin_account: {
                    value: ''
                },
                weixin_qrcode: {
                    value: ''
                }
            }
        };
        this.handleShowAddModal = this.handleShowAddModal.bind(this);
        this.handleRemovePayment = this.handleRemovePayment.bind(this);
    };

    componentDidMount(){
        this.getMyPayments();
        this.getUserInfo();
    }

    handleShowAddModal(){
        this.setState({
            showAddModal: true
        })
    }

    handleShowRemoveModal(id){
        this.setState({
            removeID: id,
            showRemoveModal: true
        })
    }

    handleRemovePayment(){
        const pay_id = this.state.removeID;
        ajax.post('/api/pc/pay/delete_pay', {pay_id}).then((response) => {
            const { error, data } = response;
            if (error == 0) {
                this.setState({
                    showAddModal: false,
                    showRemoveModal: false
                })
                this.getMyPayments();
            }
        })
    }

    handleAddPaymentSuccess(){
        this.setState({
            showAddModal: false,
            showRemoveModal: false
        })
        this.getMyPayments();
    }

    handleCancelModal(){
        this.setState({
            showAddModal: false,
            showRemoveModal: false
        })
    }

    handleFormChange(changedFields){
        this.setState({
          fields: { ...this.state.fields, ...changedFields }
        });     
    }

    getUserInfo(){
        ajax.get('/api/pc/user/info').then((response) => {
            const { error, data } = response;
            if (error == 0){
                const { realname } = data.userinfo;
                this.setState({realname});
            }
        })
        
    }

    getMyPayments(){
        ajax.get('/api/pc/pay/get_pay_infos').then((response) => {
            const { code, data } = response;
            if (code == 0){
                const { alipay, weixin, bank_transfer } = data;
                const payments = [];
                if (alipay != null && alipay.length > 0) {
                    payments.push(...alipay.map(e => {return {pay_method: 'alipay', ...e}}))
                }
                if (weixin != null && weixin.length > 0) {
                    payments.push(...weixin.map(e => {return {pay_method: 'weixin', ...e}}))
                }
                if (bank_transfer != null && bank_transfer.length > 0) {
                    payments.push(...bank_transfer.map(e => {return {pay_method: 'bank_transfer', ...e}}))
                }
                this.setState({payments});
            }
        })
    }

    renderPaymentCards () {
        const { payments, realname } = this.state;

        return (
            payments.map((pay, i) => {
                const { id, pay_method, pay_name, account, qrcode, bank_account, account_branch, bank_card_num} = pay;

                if (pay_method === 'bank_transfer') {
                    return (
                        <div className="my-payments-card" key={i}>
                            <div className="my-payments-card-head">
                                <div className="my-payments-card-icon my-payments-card-icon-bank"></div>
                                <div className="my-payments-card-title">银行卡</div>
                                <div className="my-payments-card-btn-delete" onClick={this.handleShowRemoveModal.bind(this, id)}>删除</div>
                            </div>
                            <div className="my-payments-card-body">
                                <table>
                                    <tbody>
                                        <tr><td className="label">姓&emsp;&emsp;名：</td><td>{realname}</td></tr>
                                        <tr><td className="label">开&ensp;户&ensp;行：</td><td>{bank_account}</td></tr>
                                        <tr><td className="label">开户支行：</td><td>{account_branch}</td></tr>
                                        <tr><td className="label">卡&emsp;&emsp;号：</td><td>{bank_card_num}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className="my-payments-card" key={i}>
                            <div className="my-payments-card-head">
                                <div className={`my-payments-card-icon my-payments-card-icon-${pay_method}`}></div>
                                <div className="my-payments-card-title">{pay_name}</div>
                                <div className="my-payments-card-btn-delete" onClick={this.handleShowRemoveModal.bind(this, id)}>删除</div>
                            </div>
                            <div className={`my-payments-card-body my-payments-card-body-${pay_method}`}>
                                <table>
                                    <tbody>
                                        <tr><td className="label">姓&emsp;&emsp;名：</td><td>{realname}</td></tr>
                                        <tr><td className="label">账&emsp;&emsp;号：</td><td>
                                            {account}
                                            {
                                            qrcode ?
                                            <Popover content={<img src={qrcode} />} title="收款二维码">
                                                <span className={`my-payments-card-qrcode my-payments-card-qrcode-${pay_method}`}></span>
                                            </Popover>
                                            : ''
                                            }
                                        </td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }
            })
        )
    }

    render(){
        const { showAddModal, showRemoveModal, realname, fields, error, timeStamp } = this.state;
        return (
            <div className="order-info-content">
                <div className="order-info-content-head">
                    <h1>支付方式</h1>
                </div>
                <div className="order-info-content-body clearfix" style={{padding: '40px 0 0 40px', height: '630px', overflow: 'auto'}}>
                    { this.renderPaymentCards() }
                    <div className="my-payments-card my-payments-card-add" onClick={this.handleShowAddModal.bind(this)}>
                        <div className="my-payments-card-add-icon"></div>
                        <div className="my-payments-card-add-text">添加支付方式</div>
                    </div>
                </div> 
                <Modal
                    visible={showAddModal}
                    title="添加支付方式"
                    footer = {null}
                    width = {800}
                    onCancel={this.handleCancelModal.bind(this)}
                    wrapClassName = 'payment-form'
                >
                    <AddPaymentForm
                        realname={realname}
                        timeStamp={timeStamp}
                        error={error}
                        fields={fields}
                        onSuccess={this.handleAddPaymentSuccess.bind(this)}
                        onChange={this.handleFormChange.bind(this)}
                    />
                </Modal>
                <Modal
                    visible={showRemoveModal}
                    title="确认删除"
                    footer = {null}
                    width = {800}
                    onCancel={this.handleCancelModal.bind(this)}
                    wrapClassName = 'adres-modal cashout-modal'
                >
                    <div className="clearfix">
                        <img src= {warnIcon} alt="" className="success"/>
                        <div className ='success-tip'>请你确认是否删除该支付方式</div>
                    </div>
                    <div className="submit-btn-wrap" >
                        <Button type="primary" className="submit-btn" onClick={this.handleRemovePayment.bind(this)}>确定</Button>
                    </div>
                </Modal>
            </div>  
        )
    }
}

export default MyPayment