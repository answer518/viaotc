export const router = {
	path: '/',
	component: require('../Root').default,
	indexRoute: {
		component: require('../pages/home_page/index').default
	},
	childRoutes: [{
		path: 'app',
		indexRoute: { 
			component: require('../pages/home_page/index').default
		},
		//login about
		childRoutes: [{
			path: 'entrance',
			component: require('../pages/entrance/index').default,
			indexRoute: {
				component: require('../pages/entrance/login').default
			},
			childRoutes: [{
				path: 'login',
				component: require('../pages/entrance/login').default
			},{
	 			path: 'register',
	 			component: require('../pages/entrance/register').default				
			},{
				path: 'forgot',
				childRoutes: [{
					path: 'step1',
					component: require('../pages/entrance/forgot/index').default			
				},{
					path: 'step2',
					component: require('../pages/entrance/forgot/step2').default				
				},{
					path: 'step3',
					component: require('../pages/entrance/forgot/step3').default			
				}]
			}]
		},{
			path: 'dealCenter',
			indexRoute: {
				component: require('../pages/dealCenter/sell_list').default
			},		
			childRoutes: [{
				path: 'publish',
				component: require('../pages/dealCenter/publish').default,
				childRoutes: [{
					path: 'buy',
					component: require('../pages/dealCenter/publish_buy').default,
				},{
					path: 'sell',
					component: require('../pages/dealCenter/publish_sell').default,					
				}]				
			},{
				path: 'detail',
				indexRoute: {
					component: require('../pages/dealCenter/detail_buy').default
				},
				childRoutes: [{
					path: 'buy',
					component: require('../pages/dealCenter/detail_buy').default
				},{
					path: 'sell',
					component: require('../pages/dealCenter/detail_sell').default
				}]
			},{
				path: 'deal',
				indexRoute: {
					component: require('../pages/dealCenter/deal_buy').default
				},
				childRoutes: [{
					path: 'buy',
					component: require('../pages/dealCenter/deal_buy').default
				},{
					path: 'sell',
					component: require('../pages/dealCenter/deal_sell').default
				}]								
			},{
				path: 'sellList',
				component: require('../pages/dealCenter/sell_list').default
			},{
				path: 'buyList',
				component: require('../pages/dealCenter/buy_list').default
			}]			
		},{
			path: 'assetManage', 
			indexRoute: {
				component: require('../pages/assertManage/index').default
			},			
			childRoutes: [{
				path: 'cashIn',
				component: require('../pages/assertManage/cashIn').default
			},{
				path: 'cashOut',
				component: require('../pages/assertManage/cashOut').default
			}, {
				path: 'cashAdres',
				component: require('../pages/assertManage/cashAdres').default
			}, {
				path: 'cashIdentify',
				component: require('../pages/assertManage/cashIdentify').default
				}
			]
		},{
			path: 'userCenter',
			component: require('../pages/userCenter/index').default,
			indexRoute: {
				component: require('../pages/userCenter/my_order').default
			},			
			childRoutes: [{
					path: 'tradeInfo',
					component: require('../pages/userCenter/trade_info').default
				},{
					path: 'workOrder',
					component: require('../pages/userCenter/work_order').default
				},{
					path: 'myMessage',
					component: require('../pages/userCenter/my_message').default
				},{
					path: 'secureSetting',
					component: require('../pages/userCenter/secure_setting').default
				},{
					path: 'identityInfo',
					component: require('../pages/userCenter/identity_info').default
				},{
					path: 'myPayment',
					component: require('../pages/userCenter/my_payment').default
			}]
		},
		{
			path: 'protocol',
			component: require('../pages/protocol').default
		},
		{
			path: 'viaOtcFee',
			component: require('../pages/viaotcfee').default
		},		
		// {
		// 	path: 'userCenter/account',
		// 	childRoutes: [{
		// 		path: 'notice',
		// 		component: require('../pages/userCenter/notice').default
		// 	},{
		// 		path: 'noticeDetail',
		// 		component: require('../pages/userCenter/notice_detail').default	
		// 	},{
		// 		path: 'verifyEmail',
		// 		component: require('../pages/userCenter/verify_email').default
		// 	},{
		// 		path: 'modifyPassword',
		// 		component: require('../pages/userCenter/modify_password').default
		// 	},{
		// 		path: 'fundPassword',
		// 		component: require('../pages/userCenter/set_password').default
		// 	},{
		// 		path: 'resetFundPassword',
		// 		component: require('../pages/userCenter/reset_password').default
		// 	},{
		// 		path: 'settingGa',
		// 		component: require('../pages/userCenter/setting_ga').default
		// 	},{
		// 		path: 'dealIdentifiy',
		// 		component: require('../pages/userCenter/deal_identifiy').default
		// 	},{
		// 		path: 'identityAuth',
		// 		component: require('../pages/userCenter/identity_auth').default
		// 	},{
		// 		path: 'userGuide',
		// 		component: require('../pages/userCenter/user_guide').default
		// 	}]
		// },
		{
			path: 'userCenter/notice',
			component: require('../pages/userCenter/notice').default 
		},{
			path: 'userCenter/noticeDetail',
			component: require('../pages/userCenter/notice_detail').default				
		},{
			path: 'userCenter/verifyEmail',
			component: require('../pages/userCenter/verify_email').default
		},{
			path: 'userCenter/modifyPassword',
			component: require('../pages/userCenter/modify_password').default
		},{
			path: 'userCenter/fundPassword',
			component: require('../pages/userCenter/set_password').default
		},{ 
			path: 'userCenter/resetFundPassword',
			component: require('../pages/userCenter/reset_password').default
		},{
			path: 'userCenter/settingGa',
			component: require('../pages/userCenter/setting_ga').default
		},{
			path: 'userCenter/dealIdentifiy',
			component: require('../pages/userCenter/deal_identifiy').default
		},{
			path: 'userCenter/identityAuth',
			component: require('../pages/userCenter/identity_auth').default
		},{
			path: 'userCenter/userGuide',
			component: require('../pages/userCenter/user_guide').default
		}]	
	},{
		path: '*',
		component: require('../pages/404.jsx').default	 
	}]
};
