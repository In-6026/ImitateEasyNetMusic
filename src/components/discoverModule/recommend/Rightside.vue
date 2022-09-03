
<template>
    <div class="r-con relative">
        <div v-if="!store.state.isLogin" class="my-info-withoutlogin fillWidth">
            <p class="note">登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
            <a href="#" class="login-btn block pointer">用户登录</a>
        </div>
        <div v-if="store.state.isLogin" class="my-info-haslogin fillWidth">
            <div class="my-cover fillWidth flex">
                <router-link :to="'/user/home?id=' + store.state.User?.id" class="cover">
                    <img :src="store.state.User.profile?.avatarUrl + '?param=80y80'" width="80" height="80" />
                </router-link>
                <div class="text-op">
                    <h4>
                        <router-link :to="'/user/home?id' + store.state.User?.id" class="text-decoration-none">{{
                                store.state.User.profile?.nickname
                        }}</router-link>
                    </h4>
                    <p>
                        <a>{{ store.state.User?.details?.level }}</a>
                        <i></i>
                    </p>
                    <div @click="dailySigninCtrl.signin()" class="sigin flex pointer">
                        <i class="block" :class="{ Isig: dailySigninCtrl.isSig, InoSig: !dailySigninCtrl.isSig }">{{
                                dailySigninCtrl.isSig ? '已签到' : '签到'
                        }}</i>
                        <a class="block" :class="{ Asig: dailySigninCtrl.isSig, AnoSig: !dailySigninCtrl.isSig }"></a>
                    </div>
                </div>
            </div>
            <ul class="flex list-none">
                <li>
                    <router-link :to="'/user/event?id=' + store.state.User?.id">
                        <strong>{{ store.state.User.details?.profile?.eventCount }}</strong>
                        <span>动态</span>
                    </router-link>
                </li>
                <li class="line"></li>
                <li>
                    <router-link :to="'/user/follows?id=' + store.state.User?.id">
                        <strong>{{ store.state.User.details?.profile?.follows }}</strong>
                        <span>关注</span>
                    </router-link>
                </li>
                <li class="line"></li>
                <li>
                    <router-link :to="'/user/fans?id=' + store.state.User?.id">
                        <strong>{{ store.state.User.details?.profile?.followeds }}</strong>
                        <span>粉丝</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="n-singer">
            <h3>
                <span>入驻歌手</span>
                <router-link to="/discover/artist/signed" class="text-decoration-none pointer">查看全部 ></router-link>
            </h3>
            <ul class="singer-list list-none">
                <li v-for="artist in artists" :key="artist.id" class="list-none">
                    <router-link :to="'/user/home?id=29879272' + artist.id"
                        class="singer-item flex fillWidth fillHeight">
                        <div class="singer-pic pointer">
                            <img :src="artist.picUrl + '?param=62y62'" class="fillWidth fillHeight" />
                        </div>
                        <div class="ifo">
                            <h4>
                                <span class="pointer">{{ artist.name }}</span>
                            </h4>
                            <p>{{ artist.alias.length ? artist.alias.join(' ') : '音乐人' }}</p>
                        </div>
                    </router-link>
                </li>
            </ul>
            <div class="block">
                <router-link to="/recreit" class="aply-singer-btn pointer block">申请成为网易音乐人</router-link>
            </div>
            <div class="hot-dj">
                <h3>热门主播</h3>
                <ul>
                    <li v-for="dj in djList" :key="dj.id" class="dj-li list-none flex">
                        <router-link :to="'/user/home?id=' + dj.id" class="dj-li-cover text-decoration-none ponter">
                            <img :src="dj.picUrl + '?param=40y40'" class="fillHeight fillWidth" />
                        </router-link>
                        <div class="dj-info">
                            <p>
                                <router-link :to="'/user/home?id=' + dj.id"
                                    class="dj-name pointer txt text-decoration-none">{{ dj.name }}</router-link>
                            </p>
                            <p class="txt">{{ dj.rcmdText }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import useGlobalProperties from '../../../hooks/useGlobalProperties';
import { useStore } from 'vuex';
import Storage from '../../../utils/Storage';

const store = useStore();
const Axios = useGlobalProperties("Axios");

interface Artists {
    artists: Array<{
        id: number
        name: string
        picUrl: string
        alias: Array<string>
    }>
}
let artists = ref()
Axios.get('/top/artists?offset=0&limit=5').then((data: Artists) => {
    artists.value = data.artists
}).catch((reson: string) => {
    throw reson;
})
interface DJ {
    data: {
        list: Array<{
            id: number
            name: string
            picUrl: string
            rcmdText: string
        }>
    }
}
let djList = ref()
Axios.get('/dj/paygift?limit=5&offset=0').then((data: DJ) => {
    djList.value = data.data.list;
}).catch((reson: string) => {
    throw reson;
})

//签到
const dailySigninCtrl = reactive({
    isSig: false,
    signin() {
        Axios.get('/daily_signin').then((data: { code: number }) => {
            if (data.code == 200) {//签到成功
                Storage.set('daily_signin', {
                    type: true,
                    update: new Date().getTime()
                });
                dailySigninCtrl.isSig = true;
            } else {
                alert('签到失败')
            }
        })
    }
})
const sigInfo = Storage.get('daily_signin');
if (sigInfo.type && (new Date().getTime()) - sigInfo.update  < 24 * 60 * 60 * 1000) {
    dailySigninCtrl.isSig = true;
}

</script>

<style lang="less">
.r-con {
    width: 250px;
}

.my-info-withoutlogin {
    height: 126px;
    background: url("../../../assets/img/index.png") no-repeat 0 0;
}

.my-info-haslogin {
    height: 165px;
    margin-top: 20px;
    background: url("../../../assets/img/index.png") no-repeat 0 -270px;

    .my-cover {
        height: 90px;

        .cover {
            width: 80px;
            height: 80px;
            margin-left: 20px;
            padding: 2px;
            background: #fff;
            border: 1px solid #dadada;
        }

        .text-op {
            width: 115px;
            margin-left: 18px;
            padding-top: 3px;

            h4 {
                overflow: hidden;

                a {
                    width: auto;
                    max-width: 100%;
                    color: #000;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                }
            }

            p {
                display: flex;
                width: 100%;
                margin-top: 5px;

                a {
                    display: block;
                    height: 17px;
                    padding-left: 25px;
                    line-height: 18px;
                    color: #999;
                    background: url("../../../assets/img/icon2.png") no-repeat -130px -64px;
                    font: normal italic bold 12px/18px Avenir, Helvetica, Arial,
                        sans-serif;
                }

                i {
                    display: block;
                    width: 8px;
                    height: 17px;
                    background: url("../../../assets/img/icon2.png") no-repeat -192px -64px;
                }
            }

            .sigin {
                margin-top: 15px;

                i {
                    color: #bebebe;
                    padding: 0 15px 0 20px;
                    height: 31px;
                    line-height: 31px;
                    text-align: center;
                    background: url("../../../assets/img/button2.png") no-repeat;
                }

                a {
                    padding: 0 5px 0 0;
                    text-decoration: none;
                    height: 31px;
                    color: #bebebe;
                    background: url("../../../assets/img/button2.png") no-repeat
                }

                .Isig {
                    background-position: 0 -305px;
                }

                .Asig {
                    background-position: right -346px;
                }

                .InoSig {
                    background-position: 0 -386px;
                }

                .AnoSig {
                    background-position: right -427px;
                }
            }
        }
    }

    ul {
        margin-top: 22px;
        justify-content: space-between;
        padding: 0 25px;

        .line {
            background-color: #e4e4e4;
            width: 1px;
        }

        li {
            height: 40px;

            a {
                display: block;
                color: #666;
                text-decoration: none;

                strong {
                    display: block;

                    white-space: nowrap;
                    font-size: 20px;
                }

                span {
                    margin-left: 2px;
                }

                &:hover {
                    color: lightskyblue;
                }
            }
        }
    }
}

.note {
    color: #666;
    width: 205px;
    margin: 0 auto;
    padding: 16px 0;
    line-height: 22px;
}

.login-btn {
    color: #fff;
    width: 100px;
    height: 31px;
    margin: 0 auto;
    line-height: 31px;
    text-align: center;
    text-decoration: none;
    text-shadow: 0 1px 0 #8a060b;
    background: url("../../../assets/img/index.png") no-repeat 0 -195px;

    &:hover {
        background-position: -110px -195px;
    }
}

.n-singer {
    margin-top: 15px;

    h3 {
        height: 23px;
        margin: 0 20px;
        border-bottom: 1px solid #ccc;

        span {
            color: #333;
        }

        a {
            float: right;
            color: #666;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}

.singer-list {
    margin: 6px 0 14px 20px;

    li {
        margin-top: 14px;
        width: 210px;
        height: 62px;
        background: #fafafa;
        border: 1px solid #ddd;

        &:hover {
            border: 1px solid #ccc;
            background: #f7f7f7;
        }
    }
}

.singer-item {
    color: #333;
    text-decoration: none;

    .singer-pic {
        width: 62px;
        height: 62px;
        margin-right: 15px;
    }

    .ifo {
        h4 {
            margin-top: 8px;

            span {
                font-weight: bold;
            }
        }

        p {
            margin-top: 8px;
        }
    }
}

.aply-singer-btn {
    color: #333;
    height: 31px;
    width: 210px;
    line-height: 31px;
    margin: 20px auto 30px auto;
    padding: 0 5px 0 0;
    border-radius: 4px;
    white-space: nowrap;
    text-align: center;
    border: 1px solid #bbb;
    text-decoration: none;

    &:hover {
        background: linear-gradient(to bottom, rgb(239, 239, 239), #fff);
    }
}

.hot-dj {
    ul {
        margin: 20px 0 0 20px;

        .dj-li {
            width: 210px;
            height: 50px;

            .dj-li-cover {
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }
        }
    }
}

.dj-info {
    width: 160px;
    line-height: 21px;

    .txt {
        color: #333;
        line-height: 21px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
    }

    .dj-name {
        max-width: 88%;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>