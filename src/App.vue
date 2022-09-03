<template>
	<router-view></router-view>
</template>

<script setup lang="ts">
import useGlobalProperties from './hooks/useGlobalProperties'
import { useStore } from 'vuex'
import Storage from './utils/Storage'
const store = useStore()
const Axios = useGlobalProperties('Axios')
//检查用户是否登录
const checkIsLogin = async () => {
	return new Promise((resolve, reject) => {
		Axios.get('/login/refresh').then((data: { code: number }) => {
			store.commit('setUserLoginState', data?.code == 400 ? true : false)
			resolve(true)
		}).catch(() => {
			store.commit('setUserLoginState', false)
			reject(false)
		})

	})
}
async function getLoginStatus() {
	return new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: `/login/status?timerstamp=${Date.now()}`,
			withCredentials: true,
		}).then((data: {
			data: {
				id: string
				account: {
					id: string
				}
				profile: {}
			}
		}) => {
			const res = data.data
			if (res?.account) {
				Storage.set('userInfo', res?.account?.id)
				store.commit('setUserLoginState', true)
				store.commit('setUserId', res?.account?.id)
				store.commit('setUserAccount', res?.account)
				store.commit('setUserProfile', res?.profile)
			}
			resolve(true)
		}).catch((reson: string) => {
			reject(reson)
		})
		//获取登录各个阶段的信息，期待登录成功后将信息存入vuex
	})
}
checkIsLogin().then(() => {
	getLoginStatus()
})
// .then(() => {
// 	Axios.get('/user/detail?uid=' + store.state.User.id).then((data: any) => {
// 		store.dispatch('asyncSetUserDetails', data)
// 	})
// }).catch(() => {
// 	console.error('您还未登录~~')
// })
</script>
<style lang='less'>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

html,
body,
div,
span,
p,
img,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
a,
i,
table,
tr,
th,
tbody {
	padding: 0;
	margin: 0;
}

.fillHeight {
	height: 100%;
}

.fillWidth {
	width: 100%;
}

.bg-black {
	background-color: #242424;
}

.flex {
	display: flex;
}

.flex-warp {
	flex-wrap: wrap;
}

.flex-item-center {
	align-items: center;
}

.hiden {
	display: none;
}

.block {
	display: block;
}

.relative {
	position: relative;
}

.absolute {
	position: absolute;
}

.pointer {
	cursor: pointer;
}

.list-none {
	list-style: none;
}

.no-select {
	user-select: none;
}

.text-decoration-none {
	text-decoration: none;
}

.text-decoration-none:hover {
	text-decoration: underline;
}

.text-center {
	text-align: center;
}
</style>
