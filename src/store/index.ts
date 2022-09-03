import { createStore } from "vuex"
import StoreOptions from './common'

import User from './modules/User'
import Player from './modules/Player'

interface State {
    isLogin: boolean
}
const Store = {
    state(): State {
        return {
            isLogin: false
        }
    },
    mutations: {
        setUserLoginState(state, TF: boolean) {
            state.isLogin = TF
        }
    },
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        User,
        Player
    }
} as StoreOptions<State>

export default createStore(Store)