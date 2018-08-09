import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
	state: {
		//全局query状态
		storeQueryState: false,
		//全局借出列表
		storeLendList:[],
		//全局归还列表
		storeRepayList:[],
    loginInfo: {
      userName: "",
      userId: null
    }
  },
  mutations: {
    updateLendList(state, newData) {
      state.storeLendList = newData
    },
		updateRepayList(state, newData) {
			state.storeRepayList = newData
		},
    updateLoginInfo(state, newData) {
      state.loginInfo = newData
    },
		updateQueryState(state, newData) {
			state.storeQueryState = newData
		}
  }
	//getters,
	//actions,
	//mutations,
})
