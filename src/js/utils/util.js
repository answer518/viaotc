import { isObject, keys } from 'lodash';

export function formatPhone(phone) {
	return String(phone).replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

export function formatNumber (str){
	var result='';
	str=str||'0';
	str=String(str);
	if(str.length <5){
		result=str;
	} else {
		// result=this.formatNumber(str.substr(0,str.length-3))+','+str.substr(str.length-3);
		result=(str+"").replace(/(\d)(?=(\d{3})+$)/g, "$1,");
	}
	if(result==-1){
		result='-';//-1转化成显示-,区分0代表请求失败还是真是0.
	}
	return result;
}
 
export const empty = () => { 

};
export function getUrlParam (paramKey) {
	//获取地址参数值
	var search = decodeURIComponent(location.search), val, params;
	if (search && search.length > 1) {
		search = search.slice(1);
		params = search.split('&');
		for (var i = 0; i < params.length; i++) {
			var param = params[i];
			if (param.split('=').length && String(param.split('=')[0]) === String(paramKey)) {
				val = String(param.split('=')[1])=='undefined'?'':String(param.split('=')[1]);
				break;
			}
		}
	}
	return val;
}
export const adTypeMap = {
	buy: '购买',
	sell: '出售'
};

export const statusMap = {
	0: '待支付',
	1: '已取消',
	2: '买家已付款',
	3: '交易完成',
	4: '申诉中',
	5: '申诉-解除冻结',
	6: '申诉-放行资产',
	7: '超时-系统取消'
};

export const tradeStatusMap = {
	1: '正常显示',
	4: '后台禁止',
	3: '已完成',
	2: '删除'
};

export const coinTips = {
	'usdt': [
		'请勿向上述地址充值任何非USDT资产，否则资产将不可找回。',
		'您充值至上述地址后，需要整个网络节点的确认，12次网络确认后到账，30次网络确认后可提币。',
		'最小充值金额：1 USDT ，小于最小金额的充值将不会上账。',
		'您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告等方式通知您。'		
	],
	'btc': [
		'请勿向上述地址充值任何非BTC资产，否则资产将不可找回。',
		'您充值至上述地址后，需要整个网络节点的确认，2次网络确认后到账，6次网络确认后可提币。',
		'最小充值金额：0.0001 BTC ，小于最小金额的充值将不会上账。',
		'您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告等方式通知您。',
		'请务必确认电脑及浏览器安全，防止信息被篡改或泄露。'
	],
	'bch': [
		'请勿向上述地址充值任何非BCC资产，否则资产将不可找回。',
		'您充值至上述地址后，需要整个网络节点的确认，2次网络确认后到账，6次网络确认后可提币。',
		'最小充值金额：0.01 BCC，小于最小金额的充值将不会上账。',
		'您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告等方式通知您。',
		'请务必确认电脑及浏览器安全，防止信息被篡改或泄露。'
	],
	'eth': [
		'请勿向上述地址充值任何非ETH资产，否则资产将不可找回。',
		'您充值至上述地址后，需要整个网络节点的确认，12次网络确认后到账，30次网络确认后可提币。',
		'最小充值金额：0.01 ETH，小于最小金额的充值将不会上账。',
		'ViaOTC目前不支持使用智能合约或区块奖励(Coinbase)的转账充值，智能合约或区块奖励的转账将不会上账，请您谅解。',
		'您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告等方式通知您。',
		'请务必确认电脑及浏览器安全，防止信息被篡改或泄露。'
	],
	'etc': [
		'请勿向上述地址充值任何非ETC资产，否则资产将不可找回。',
		'您充值至上述地址后，需要整个网络节点的确认，12次网络确认后到账，60次网络确认后可提币。',
		'最小充值金额：0.01 ETC，小于最小金额的充值将不会上账。',
		'ViaOTC目前不支持使用智能合约或区块奖励(Coinbase)的转账充值，智能合约或区块奖励的转账将不会上账，请您谅解。',
		'您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告等方式通知您。',
		'请务必确认电脑及浏览器安全，防止信息被篡改或泄露。'
	],
	'ltc': [
		'请勿向上述地址充值任何非LTC资产，否则资产将不可找回。',
		'您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账。',
		'最小充值金额：0.1 LTC ，小于最小金额的充值将不会上账。',
		'您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告等方式通知您。',
		'请务必确认电脑及浏览器安全，防止信息被篡改或泄露。'
	],
	'dash': [
		'请勿向上述地址充值任何非DASH资产，否则资产将不可找回。',
		'您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，6次网络确认后可提币。',
		'最小充值金额：0.005 DASH ，小于最小金额的充值将不会上账。',
		'您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告等方式通知您。',
		'请务必确认电脑及浏览器安全，防止信息被篡改或泄露。'
	]
};

export const dealStatus = {
	0: '资产已冻结，待买家付款',
	1: '买家已取消',
	2: '买家已付款，待卖家确认收款',
	3: '卖家已确认收款， 交易结束',
	4: '申诉中',
	5: '申诉结果-解除冻结',
	6: '申诉结果-放行资产',
	7: '超时，系统已自动取消'
};

export function getDaysInOneMonth(year, month){  
  month = parseInt(month, 10);  
  var d= new Date(year, month, 0);  
  return d.getDate();  
} 

export function beforeUpload(file) {
  const isJPGPNG = (file.type === 'image/jpeg' || file.type === 'image/png');
  if (!isJPGPNG) {
    message.error('只能上传JPG、PNG文件!');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('文件大小不能超过5M');
  }
  return isJPGPNG && isLt5M;
}

export function getErrorMsg(msg=''){

	let errorMsg = msg;

	if (isObject(msg)) {
		const msgKeys = keys(msg);
		errorMsg = msg[msgKeys[0]] || '';
	}

	return errorMsg;
}

export const payMethodMap = {
	alipay: '支付宝转账',
	weixin: '微信转账',
	bank_transfer: '国内银行转账'
};

//CharMode函数
function charMode(iN) {
    if (iN >= 48 && iN <= 57) //数字
        return 1;
    if (iN >= 65 && iN <= 90) //大写字母
        return 2;
    if (iN >= 97 && iN <= 122) //小写
        return 4;
    else
        return 8; //特殊字符
}

//bitTotal函数
function bitTotal(num) {
    var modes = 0;
    for (var i = 0; i < 4; i++) {
        if (num & 1) modes++;
        num >>>= 1;
    }
    return modes;
}

function passwordModes (password) {
    var modes = {
        hasNumber: false,
        hasLetter: false,
        hasSymbol: false
    };
    for (var i = 0; i < password.length; i++) {
        var mode = charMode(password.charCodeAt(i));
        if (mode === 1) {
            modes.hasNumber = true;
        } else if (mode === 2 || mode === 4) {
            modes.hasLetter = true;
        } else {
            modes.hasSymbol = true;
        }
    }
    return modes;
}

export const passwordStrength = (password, minLength=8) => {
    const len = password.length;
    const modes = passwordModes(password);

    if (password == null || password == '' || len < minLength){
        return 0;
    }

    if (len < 13) {
        if (!modes.hasSymbol) {
            return 0
        } else {
            return 1
        }
    } else if (len > 12 && len < 17) {
        if (!modes.hasSymbol) {
            return 1
        } else {
            return 2
        }
    } else {
        return 2
    }
};

export const getBaseUrl = () => { 
	return window.OTC.cdn_url || '';
};
 
export const getAvatar = (avatar) => { 
	return avatar ? `${window.OTC.upload_url || ''}${avatar}` : `${window.OTC.cdn_url || ''}/www/default.png`;
}

export const getUploadUrl = (url) => {
	return `${window.OTC.api_url || ''}${url}`
}

export const getRandom = (n,m) => {
  return Math.round(Math.random()*(m-n)+n);
}