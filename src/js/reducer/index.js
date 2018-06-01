import { ActionType } from '../actions/actionType';
import { getAvatar } from 'utils/util';

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  }
}

const initGlobal = {
	avatar: getAvatar(window.OTC.avatar),
	is_trusted: false,
	is_shielded: false,
	username: window.OTC.username || '',
	ga_status: window.OTC.ga_status || '0',
	funds_password_status: window.OTC.funds_password_status || '',
	auth_status: window.OTC.auth_status || '',
	pay_status: window.OTC.pay || false,
	phone: window.OTC.phone || '',
	is_logged: window.OTC.is_logged
};

const Global = createReducer(initGlobal, {
	[ActionType.CHANGE_USER_NAME](state, action){
		const { username } = action;
		return {
			...state,
			username
		}
	},
	[ActionType.UPDATE_AVATAR](state, action){
		const { avatar } = action;
		return {
			...state,
			avatar: getAvatar(avatar)
		}
	},
	[ActionType.USER_LOGOUT](state, action){
		return {
			...state,
			is_logged: '0'
		}
	},
	[ActionType.USER_LOGIN](state, action){
		return {
			...state,
			is_logged: '1'
		}
	},
	[ActionType.TRUST_PARTNER](state, action){
		return {
			...state,
			is_trusted: action.bool
		}
	},
	[ActionType.SHIELDED_PARTNER](state, action){
		return {
			...state,
			is_shielded: action.bool
		}
	},
	[ActionType.UPDATE_GA_STATSUS](state, action){
		return {
			...state,
			ga_status: action.ga_status
		}
	},
	[ActionType.UPDATE_FUND_PASSWORD](state, action){
		return {
			...state,
			funds_password_status: action.funds_password_status
		}
	}
});

export default Global