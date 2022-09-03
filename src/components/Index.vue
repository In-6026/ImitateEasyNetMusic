
<template>
    <div class="menu-container fillWidth bg-black">
        <div class="menubar flex flex-item-center">
            <h1 class="logo">
                <router-link to="/"></router-link>
            </h1>
            <ul class="fillHeight flex">
                <router-link v-for="(item, index) in menu.items" :to="item.href" class="block turn"
                    :key="item.name + index">
                    <li @click="menu.changeItem(index)" class="menuItem fillHeight pointer relative"
                        :class="{ menuItemAvtive: index === menu.menuIndex }">
                        <span class="fillWidth fillHeight block" :class="{ menuSubIcon: index === 3 }">{{
                                item.name
                        }}</span>
                    </li>
                </router-link>
            </ul>
            <div class="menu-search flex">
                <i class="menu-ser-icon"></i>
                <input type="text" v-model="searchKey" @keyup.enter="searchMusic()" placeholder="音乐/视频/电台/用户"
                    class="ser-Inp" />
            </div>
            <a class="menu-creator-center" href="#">创作者中心</a>
            <div @mouseover="userInfo.showSetCard = true" @mouseleave="userInfo.showSetCard = false"
                class="menu-headPic pointer relative">
                <div class="menu-headPci-box">
                    <a v-if="!store.state.isLogin" @click="login()" class="login">登录</a>
                    <img v-if="store.state.isLogin" :src="store.state.User?.profile?.avatarUrl + '?param=30y30'"
                        class="fillHeight" alt="头像" />
                </div>
                <div v-if="store.state.isLogin" v-show="userInfo.showSetCard" class="set-list absolute">
                    <ul class="list-none fillWidth">
                        <li>
                            <router-link :to="'/user/home?id=' + store.state.User.id" class="item block">
                                <i class="icn my"></i>
                                <em>我的主页</em>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/msg" class="item block">
                                <i class="icn msg"></i>
                                <em>我的消息</em>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/user/updata" class="item block">
                                <i class="icn set"></i>
                                <em>个人设置</em>
                            </router-link>
                        </li>
                        <li @click="logOut()">
                            <router-link to="/" class="item block">
                                <i class="icn out"></i>
                                <em>退出</em>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div v-if="loginState.showCard" class="showLoginCard absolute">
        <div class="loginCardTitle relative flex flex-item-center">
            <p>登录</p>
            <i @click="loginState.quitLogin()" class="pointer"></i>
        </div>
        <div class="login-body">
            <!-- 等待状态下展示 -->
            <div v-if="loginState.state === 801" class="fillWidth flex">
                <div class="lg-hint"></div>
                <div class="lg-qrcode">
                    <div class="qr-txt">扫码登录</div>
                    <div class="qr relative">
                        <div class="f-link absolute fillWidth fillHeight" :style="loginState.btn">
                            <p>二维码已失效</p>
                            <a @click="login()" class="fresh-qr-btn block pointer">点击刷新</a>
                        </div>
                        <div class="f-link absolute fillWidth fillHeight" :style="loginState.qr">
                            <img :src="loginState.qrcodeBase64" class="fillWidth fillHeight" />
                        </div>
                    </div>
                    <p class="absolute qr-btm-txt">
                        使用&nbsp;
                        <a class="download-link text-decoration-none pointer" href="/download">网易云音乐</a>&nbsp;扫码登录
                    </p>
                </div>
            </div>
            <!-- 扫码状态下展示 -->
            <div v-if="loginState.state === 802" class="fillHeight login-waitting">
                <img src="../assets/img/waitLogin.png" width="140" height="140" />
                <h3>扫描成功</h3>
                <p>请在手机上确认登录</p>
            </div>
        </div>

        <div class="other-lg fillWidth">
            <a class="block other-btn fillHeight pointer">选择其他登录模式</a>
        </div>
    </div>

    <router-view></router-view>

    <div style="margin-bottom: 100px; border-top: 1px solid rgb(210,210,210);"></div>
    <Playbar />
</template>

<script setup lang="ts">
import Playbar from './publicModule/Playbar.vue';
import useCurrentInstance from '../hooks/useCurrentInstance';
import useGlobalProperties from '../hooks/useGlobalProperties';
import { useStore } from 'vuex'
import { reactive, ref } from 'vue';
import Storage from '../utils/Storage';

const store = useStore()
const Axios = useGlobalProperties('Axios');
const mitter = useGlobalProperties('mitter');
const Player = useGlobalProperties('Player');

/**这些是和全局有关 */
mitter.on('login-handle', () => {
    login();
});
if (typeof Storage.get('gain') == 'number') {//初始化音量
    const gain = Storage.get('gain');
    store.commit('setGainValue', gain);
    Player.setGainValue(gain);
} else {
    Storage.set('gain', 1);
    store.commit('setGainValue', 1);
    Player.setGainValue(1);
}

//初始化均衡器
const eqIndex = Storage.get('eqs') || 0;
const biquadFilterGain = Storage.get('biquadFilterGain') as Array<number>;
store.commit('setEqualizerIndex', eqIndex);//定位，现在在用哪个均衡效果,若没有则选自定义均衡效果
if (biquadFilterGain?.length) {
    biquadFilterGain.forEach((value: number, i: number) => {//遍历设置各个频率的增益值
        if (eqIndex === 0) {//如果现在是自定义均衡效果的话那就要为其初始化
            store.commit('setCustomEquailzerEffect', {
                index: i,
                value: value
            });
        }
        store.commit('setBiquadFilterGain', {//还要为当前效果设置增益值
            index: i,
            value: value
        });
        Player.setBiquadFilters(value, i);//挂到播放器上
    });
}
//初始化淡入淡出
const fade = Storage.get('fade') || false;
store.commit('setFade', fade);
Storage.set('fade', fade);
Player.setFade(store.state.Player.soundEffect.fade);
//初始化，礼堂回响
const hallEcho = Storage.get('hallEcho') || false;
store.commit('setHallEcho', hallEcho);
Storage.set('hallEcho', hallEcho);
Player.setHallEchoType(store.state.Player.soundEffect.hallEcho);
//初始化空间环绕
const ssoundAround = Storage.get('soundAround') || false;
store.commit('setSoundAround', ssoundAround);
Storage.set('soundAround', store.state.Player.soundEffect.soundAround);
Player.setSoundAroundType(store.state.Player.soundEffect.soundAround);

/**自此开始是与此页有关 */
//关于展示头像hover后的那个卡片
let userInfo = reactive({
    showSetCard: false,
} as {
    showSetCard: boolean
})

const proxy = useCurrentInstance();
const $route = proxy?.$route;
const $router = proxy?.$router;


let searchKey = ref('');
const searchMusic = () => {
    $router?.replace({
        path: '/search',
        query: {
            string: searchKey.value
        }
    });
}

const menuPath = $route?.matched[1].name as string;

const menu = reactive({
    itemPath: ['discover', 'my', 'effect', 'immersion'],
    menuIndex: 0,
    items: [
        { name: '发现音乐', href: '/discover' },
        { name: "我的音乐", href: '/my' },
        { name: "效果", href: '/effect' },
        { name: "音频可视化", href: '/immersion' }
    ],
    changeItem(index: number) {
        menu.menuIndex = index;//重选菜单项
    },
    initItem() {
        let findIndex = menu.itemPath.indexOf(menuPath);
        menu.menuIndex = findIndex === -1 ? 0 : findIndex;
    }
});
menu.initItem();
interface LoginForm {
    data: {
        code: number
        account: {
            id: number
            userName: string
            type: number
            status: number
            whitelistAuthority: number,
            createTime: number
            tokenVersion: number
            ban: number
            baoyueVersion: number
            donateVersion: number
            vipType: number
            anonimousUser: boolean
            paidFee: boolean
        }
        profile: {
            userId: number
            userType: number
            nickname: string
            avatarImgId: number
            avatarUrl: string
            backgroundImgId: number
            backgroundUrl: string
            signature: string
            createTime: number
            userName: string
            accountType: number
            shortUserName: string
            birthday: number
            authority: number
            gender: number
            accountStatus: number
            province: number
            city: number
            authStatus: number
        }
    }
}
//登录卡
const loginState = reactive({
    showCard: false,
    unikey: '',
    qrcodeBase64: '',
    qr: 'z-index=9;',
    btn: 'z-index=10;',
    timer: null,
    state: 800,
    showBtn() {
        loginState.state = 800;
        loginState.qr = 'z-index: 9; opacity: 0.4;';
        loginState.btn = 'z-index: 10;';
    },
    showQr() {
        loginState.qr = 'z-index: 10;';
        loginState.btn = 'z-index: 9;';
    },
    quitLogin() {
        loginState.showCard = false;
        clearInterval(loginState.timer)
    },
    result: null
} as {
    showCard: boolean
    unikey: string
    qrcodeBase64: string
    qr: string
    btn: string
    timer: any
    state: 800 | 801 | 802 | 803
    showBtn: Function
    showQr: Function
    quitLogin: Function
    result: LoginForm | null
});
async function checkStatus(key: string) {
    const res = await Axios({
        method: 'GET',
        url: `/login/qr/check?key=${key}&timerstamp=${Date.now()}`,
        withCredentials: true,
    })
    return res
}
async function getLoginStatus() {
    const res = await Axios({
        method: 'GET',
        url: `/login/status?timerstamp=${Date.now()}`,
        withCredentials: true,
    })
    //获取登录各个阶段的信息，期待登录成功后将信息存入vuex
    if (res?.data?.account) {
        localStorage.setItem('userInfo', JSON.stringify(res.data?.account?.id));
        store.commit('setUserLoginState', true);
        store.commit('setUserId', res.data?.account?.id);
        store.commit('setUserAccount', res.data?.account);
        store.commit('setUserProfile', res.data?.profile);
    }
}
async function login() {
    clearInterval(loginState.timer)
    loginState.showCard = true //把登陆卡打开
    getLoginStatus() //查看登录状态
    const res = await Axios({
        method: 'GET',
        url: `/login/qr/key?timerstamp=${Date.now()}`,
        withCredentials: true,
    })
    const key = res.data.unikey //获取密钥
    const res2 = await Axios({
        method: 'GET',
        url: `/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`,
        withCredentials: true,
    })
    loginState.qrcodeBase64 = res2.data.qrimg  //获取二维码
    loginState.showQr();

    loginState.timer = setInterval(async () => {  //检查二维码过期
        const statusRes = await checkStatus(key)
        loginState.state = statusRes.code;
        if (statusRes.code === 800) {  //过期
            loginState.showBtn();
            clearInterval(loginState.timer)
        }
        if (statusRes.code === 802) { //扫码
            console.log("log ok : ", statusRes)
        }
        if (statusRes.code === 803) {  //登录
            // 这一步会返回cookie
            clearInterval(loginState.timer)
            loginState.showCard = false;
            await getLoginStatus()
            location.reload();
        }
    }, 3000)
}

//退出登录
const logOut = () => {
    Axios.get('/logout').then((data:any) => {
        console.log(data, ' 退出成功');
    }).catch((reson: string) => {
        throw reson + ' 退出失败';
    });
    location.reload();
}
</script>

<style lang="less">
.line {
    height: 5px;
    background: #c20c0c;
    border-bottom: 1px solid #a40011;
}

.qrcodezIndexF {
    z-index: 9;
}

.qrcodezIndexB {
    z-index: 9;
}

.menu-container {
    height: 70px;

    .menubar {
        width: 950px;
        height: 70px;
        margin: 0 auto;

        .logo {
            height: 69px;
            width: 176px;
            background: url("../assets/img/topbar.png") no-repeat 0px 0px;
        }

        .turn {
            text-decoration: none;
            color: #fff;

            .menuItem {
                list-style: none;
                font: normal normal 14px/70px Arial, Helvetica, sans-serif;
                text-align: center;
                padding: 0 20px;
            }
        }
    }
}

.menuItem:hover {
    background: black;
}

.menuItemAvtive {
    background: black;

    &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-top: 7px solid #000;
        border-left: 7px solid #000;
        border-right: 7px solid #000;
        border-bottom: 7px solid #c20c0c;
        left: 0;
        right: 0;
        bottom: 0px;
        margin: 0 auto;
        background: #a40011;
    }
}

.menuSubIcon::after {
    content: "";
    position: absolute;
    top: 21px;
    left: 105px;
    width: 28px;
    height: 19px;
    background: url("../assets/img/topbar.png") no-repeat -192px 0px;
}

.menu-search {
    width: 158px;
    height: 32px;
    margin: 19px 0 19px 75px;
    border-radius: 16px;
    background: #fff;

    .menu-ser-icon {
        width: 30px;
        height: 30px;
        margin-top: 3px;
        background: url("../assets/img/topbar.png") no-repeat 0px -101px;
    }

    .ser-Inp {
        box-sizing: border-box;
        border: none;
        outline: 0;
        width: calc(100% - 32px);
        height: 16px;
        margin: 9px 0px;
        font: normal normal unset 12px/16px Arial, Helvetica, sans-serif;
    }
}

.menu-creator-center {
    margin-left: 12px;
    color: #ccc;
    width: 90px;
    height: 32px;
    border-radius: 20px;
    text-align: center;
    line-height: 32px;
    border: 1px solid #4f4f4f;
    text-decoration: none;

    &:hover {
        color: #fff;
        border: 1px solid #fff;
    }
}

.menu-headPic {
    height: 45px;
    width: 45px;
    margin: 19px 0 0 20px;

    .menu-headPci-box {
        width: 30px;
        height: 30px;
        overflow: hidden;
        border-radius: 15px;

        .login {
            display: block;
            width: 28px;
            margin-top: 7px;
            color: #666;

            :hover {
                color: #787878;
            }
        }

        img {
            border-radius: 15px;
            width: auto;
        }
    }

    .set-list {
        z-index: 22;
        top: 38px;
        left: -64px;
        width: 158px;
        border: 1px solid #2b2b2b;
        border-radius: 4px;
        background: #2b2b2b;

        &::before {
            content: "";
            position: absolute;
            top: -5px;
            left: 74px;
            width: 10px;
            height: 10px;
            background: #2b2b2b;
            transform: rotateZ(45deg);
        }

        ul {
            margin: 0;
            padding: 0;

            li {
                width: 100%;
                box-sizing: border-box;

                .item {
                    &:hover {
                        background: #666;
                    }

                    color: #fff;
                    text-decoration: none;
                    display: flex;
                    height: 34px;
                    line-height: 34px;

                    i {
                        display: block;
                        margin: 7px 10px 0 20px;
                        width: 18px;
                        height: 18px;
                        background: url(../assets/img/toplist.png) no-repeat;
                    }

                    .my {
                        background-position: 0 -80px;
                    }

                    .msg {
                        background-position: -20px -120px;
                    }

                    .set {
                        background-position: 0 -140px;
                    }

                    .out {
                        background-position: 0 -200px;
                    }

                    em {
                        display: block;
                        width: 100px;
                        font: normal normal normal 12px/34px Arial, Helvetica,
                            sans-serif;
                    }
                }
            }
        }
    }
}

.showLoginCard {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 19998;
    width: 530px;
    height: 372px;
    border-radius: 4px;
    box-shadow: 0 5px 16px rgb(0 0 0 / 80%);
    border: none;
    background: #fff;

    .loginCardTitle {
        z-index: 10;
        border-bottom: 1px solid #191919;
        border-radius: 4px 4px 0 0;
        background: #2d2d2d;
        line-height: 38px;
        height: 38px;
        overflow: hidden;
        background: url("../assets/img/layer.png") repeat-x 0 -48px;

        p {
            padding-right: 45px;
            margin: 0;
            height: 38px;
            width: calc(100% - 20px);
            line-height: 38px;
            padding-left: 18px;
            border-radius: 3px 3px 0 0;
            font-weight: bold;
            font-size: 14px;
            color: #fff;
        }

        i {
            display: block;
            width: 10px;
            height: 10px;
            padding-right: 20px;
            background: url("../assets/img/layer.png") no-repeat 0 -94px;
        }
    }
}

.login-body {
    margin: 0 auto;
    padding: 38px 0 20px;
    text-align: center;

    .lg-hint {
        margin-left: 101px;
        width: 125px;
        height: 220px;
        background: url("../assets/img/qr_guide.png") no-repeat;
        background-size: contain;
    }

    .lg-qrcode {
        width: 200px;
        margin-left: 25px;

        .qr-txt {
            color: #333;
            font: normal normal 500 18px/24px arial, sans-serif;
            text-align: center;
        }
    }
}

.login-waitting {
    width: 140px;
    margin: 0 auto;
}

.qr {
    width: 130px;
    height: 130px;
    padding: 4px;
    margin: 13px auto;
}

.qr-btm-txt {
    width: 200px;
    font: normal normal normal 12px/17px arial, sans-serif;
    color: rgba(0, 0, 0, 0.4);
}

.f-link {
    top: 0;
    left: 0;
}

.f-link p {
    margin: 45px auto 6px;
    font: normal normal 500 12px/16px arial, sans-serif;
}

.fresh-qr-btn {
    margin: 0 auto;
    padding-right: 0;
    width: 64px;
    font: normal normal normal 12px/24px Arial, Helvetica, sans-serif;
    text-align: center;
    border-radius: 4px;
    background: linear-gradient(180deg, #81dd81 0%, #55a055 100%);
    border: 1px solid #5baf5b;
    box-shadow: inset 0 -1px 1px 1px rgb(185 230 185 / 31%);
    color: #fff;
}

.download-link {
    color: #0c73c2;
    font: normal normal normal 12px/17px arial, sans-serif;
    text-align: center;
}

.other-lg {
    height: 28px;
}

.other-btn {
    width: 118px;
    margin: 0 auto;
    font: normal normal normal 12px/28px arial, sans-serif;
    border: 1px solid #979797;
    border-radius: 15px;
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
}
</style>