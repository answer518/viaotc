import Mock from 'mockjs';

const Random = Mock.Random;
//全局配置
Mock.setup({
    timeout: '200-600'
});

Mock.mock('/api/ad?type=btc', { 
		'error': 0, 
		'msg': 'ok', 
		'data': { 
			'sell|5': [{
				name: Random.cname(),
				avatar: '',
				ad_info_url: '',
				location: '中国',
				transaction: Random.float(30000, 55000, 3, 5),
				currency: 'CNY',
				min_sum: Random.integer(20, 80),
				max_sum: Random.integer(200, 1000),
				payment_type: Random.integer(1, 3),
				release_time: Random.integer(10, 90),
			}],
			'buy|5': [{
				name: Random.cname(),
				avatar: '',
				ad_info_url: '',
				location: '中国',
				transaction: Random.float(40000, 50000, 3, 5),
				currency: 'CNY',
				min_sum: Random.integer(20, 60),
				max_sum: Random.integer(100, 1200),		
				payment_type: Random.integer(1, 3),
				release_time: Random.integer(30, 100),	
			}]

		} 
});

Mock.mock('/api/ad?type=etc', { 
		'error': 0, 
		'msg': 'ok', 
		'data': { 
			'sell|5': [{
				name: Random.cname(),
				avatar: '',
				ad_info_url: '',
				location: '中国',
				transaction: Random.float(30000, 55000, 3, 5),
				currency: 'CNY',
				min_sum: Random.integer(20, 80),
				max_sum: Random.integer(200, 1000),
				payment_type: Random.integer(1, 3),
				release_time: Random.integer(10, 90),
			}],
			'buy|5': [{
				name: Random.cname(),
				avatar: '',
				ad_info_url: '',
				location: '中国',
				transaction: Random.float(40000, 50000, 3, 5),
				currency: 'CNY',
				min_sum: Random.integer(20, 60),
				max_sum: Random.integer(100, 1200),		
				payment_type: Random.integer(1, 3),
				release_time: Random.integer(30, 100),	
			}]

		} 
});

Mock.mock('/api/ad?type=ltc', { 
		'error': 0, 
		'msg': 'ok', 
		'data': { 
			'sell|5': [{
				name: Random.cname(),
				avatar: '',
				ad_info_url: '',
				location: '中国',
				transaction: Random.float(30000, 55000, 3, 5),
				currency: 'CNY',
				min_sum: Random.integer(20, 80),
				max_sum: Random.integer(200, 1000),
				payment_type: Random.integer(1, 3),
				release_time: Random.integer(10, 90),
			}],
			'buy|5': [{
				name: Random.cname(),
				avatar: '',
				ad_info_url: '',
				location: '中国',
				transaction: Random.float(40000, 50000, 3, 5),
				currency: 'CNY',
				min_sum: Random.integer(20, 60),
				max_sum: Random.integer(100, 1200),		
				payment_type: Random.integer(1, 3),
				release_time: Random.integer(30, 100),	
			}]

		} 
});

Mock.mock('/api/ad?type=eth', { 
		'error': 0, 
		'msg': 'ok', 
		'data': { 
			'sell|5': [{
				name: Random.cname(),
				avatar: '',
				ad_info_url: '',
				location: '中国',
				transaction: Random.float(30000, 55000, 3, 5),
				currency: 'CNY',
				min_sum: Random.integer(20, 80),
				max_sum: Random.integer(200, 1000),
				payment_type: Random.integer(1, 3),
				release_time: Random.integer(10, 90),
			}],
			'buy|5': [{
				name: Random.cname(),
				avatar: '',
				ad_info_url: '',
				location: '中国',
				transaction: Random.float(40000, 50000, 3, 5),
				currency: 'CNY',
				min_sum: Random.integer(20, 60),
				max_sum: Random.integer(100, 1200),		
				payment_type: Random.integer(1, 3),
				release_time: Random.integer(30, 100),	
			}]

		} 
});

Mock.mock('/api/coins', { 
    'error': 0,
    'msg': 'ok',
    'data': [
    	{
    		'type': 'btc',
            'dispaly_name': 'btc/usdt',
            'price': '647372.11',
            'percent': '4.2',
            'up': 1, // 1涨;-1跌;0平
            'currency': 'RMB' //货币    		
    	},
    	{
    		'type': 'etc',
            'dispaly_name': 'etc/usdt',
            'price': '22.11',
            'percent': '0.2',
            'up': -1, // 1涨;-1跌;0平
            'currency': 'RMB' //货币    		
    	},
    	{
    		'type': 'ltc',
            'dispaly_name': 'ltc/usdt',
            'price': '23.11',
            'percent': '5',
            'up': 1, // 1涨;-1跌;0平
            'currency': 'RMB' //货币    		
    	},
    	{
    		'type': 'eth',
            'dispaly_name': 'eth/usdt',
            'price': '34.23',
            'percent': '1.5',
            'up': 1, // 1涨;-1跌;0平
            'currency': 'RMB' //货币        		
    	}
    ]
})

Mock.mock('/api/ad?type=btc&page=1&limit=10', {
		'error': 0, 
		'msg': 'ok', 
		'data|5': [{
			name: Random.cname(),
			avatar: '',
			ad_info_url: '',
			location: '中国',
			transaction: Random.float(30000, 55000, 3, 5),
			currency: 'CNY',
			min_sum: Random.integer(20, 80),
			max_sum: Random.integer(200, 1000),
			payment_type: Random.integer(1, 3),
			release_time: Random.integer(10, 90)
		}]
})