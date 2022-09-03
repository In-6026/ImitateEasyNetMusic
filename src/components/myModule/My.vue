
<script setup lang="ts">
import useGlobalProperties from '../../hooks/useGlobalProperties';
import useCurrentInstance from '../../hooks/useCurrentInstance';
import { useStore } from 'vuex';
import { reactive } from 'vue';
import Storage from '../../utils/Storage';

const store = useStore();

const proxy = useCurrentInstance();
const $route = proxy?.$route;
const $router = proxy?.$router;

const Axios = useGlobalProperties('Axios');
const mitter = useGlobalProperties('mitter');

const login = () => {
    mitter.emit('login-handle')
}

let userInfo = reactive({
    isLogin: false,
    djRadioCount: 0,
    mvCount: 0,
    artistCount: 0,

} as {
    isLogin: boolean
    djRadioCount: number
    mvCount: number
    artistCount: number
})

//获取用户信息 , 歌单，收藏，mv, dj 数量
Axios.get('/user/subcount').then((date: {
    djRadioCount: number
    mvCount: number
    artistCount: number
}) => {
    userInfo.mvCount = date.mvCount;
    userInfo.artistCount = date.artistCount;
    userInfo.djRadioCount = date.djRadioCount;
}).catch((reson: string) => {
    throw reson;
})

interface PlayList {
    creator: {
        userId: string
        nickname: string
    }
    id: string
    name: string
    trackCount: number
    coverImgUrl: string
}
const playListCtrl = reactive({
    myCreate: [],
    closeMyCreate: false,
    myCollect: [],
    closeMyCollect: false,
    actived: 3,
    showBtnGroup: -1,
    async getList() {
        return new Promise((resolve, reject) => {
            //获取歌单
            const url = `/user/playlist?uid=${Storage.get('userInfo')}`;
            Axios.get(url).then((data: {
                more: boolean
                playlist: Array<PlayList>
            }) => {
                data.playlist?.forEach((i, index) => {
                    if (i.creator.userId == Storage.get('userInfo')) {
                        playListCtrl.myCreate.push(i);
                    } else {
                        playListCtrl.myCollect.push(i);
                    }
                    if ($route?.path === '/my/playlist' && $route?.query.id == i.id) {
                        playListCtrl.actived = index + 3;
                    }
                    if (index === data.playlist.length - 1) {
                        resolve(playListCtrl.myCollect);
                    }
                });
            }).catch((reson: string) => {
                reject(`获取用户歌单失败: ${reson}`);
            })
        })
    },
    turn() {
        switch ($route?.path) {
            case '/my/playlist':
                !$route?.query.id ? $router?.push("?id=" + playListCtrl.myCreate[0].id) : null;
                break;
            case '/my/artist':
                playListCtrl.actived = 0;
                break;
            case '/my/mv':
                playListCtrl.actived = 1;
                break;
            case '/my/radio':
                playListCtrl.actived = 2;
                break;
            default:
                break;
        }
    }
} as {
    myCreate: Array<PlayList>
    closeMyCreate: boolean
    myCollect: Array<PlayList>
    closeMyCollect: boolean
    actived: number
    showBtnGroup: number
    getList: Function
    turn: Function
})
playListCtrl.getList().then(() => {
    playListCtrl.turn();
}).catch((reson: string) => {
    throw reson;
})
</script>

<template>
    <p class="line"></p>
    <div v-if="!store.state.isLogin" class="my-con">
        <div class="withoutLogin">
            <a @click="login()" class="block pointer"></a>
        </div>
    </div>
    <div v-if="store.state.isLogin" class="hasLogin flex">
        <div class="left">
            <h2 @click="playListCtrl.actived = 0" class="my-sub pointer"
                :class="{ active: playListCtrl.actived === 0 }">
                <router-link to="/my/artist">我的歌手({{ userInfo.artistCount }})</router-link>
            </h2>
            <h2 @click="playListCtrl.actived = 1" class="my-sub pointer"
                :class="{ active: playListCtrl.actived === 1 }">
                <router-link to="/my/mv">我的视频({{ userInfo.mvCount }})</router-link>
            </h2>
            <h2 @click="playListCtrl.actived = 2" class="my-sub pointer"
                :class="{ active: playListCtrl.actived === 2 }">
                <router-link to="/my/radio">我的电台({{ userInfo.djRadioCount }})</router-link>
            </h2>
            <div class="create-playlist pointer">
                <h2 @click="playListCtrl.closeMyCreate = !playListCtrl.closeMyCreate">
                    <a>
                        <i>新建</i>
                    </a>
                    <span class="r-tle">
                        <i :class="{ open: !playListCtrl.closeMyCreate, close: playListCtrl.closeMyCreate }"></i>
                        创建的歌单
                        <span>({{ playListCtrl.myCreate.length }})</span>
                    </span>
                </h2>
                <ul v-show="!playListCtrl.closeMyCreate" class="list-none">
                    <li v-for="(list, index) in playListCtrl.myCreate" @click="playListCtrl.actived = 3 + index"
                        @mouseover="playListCtrl.showBtnGroup = 3 + index" @mouseleave="playListCtrl.showBtnGroup = -1"
                        class="relative pointer fillWidth" :class="{ active: playListCtrl.actived === 3 + index }"
                        :key="list.id">
                        <div class="flex li-con">
                            <router-link :to="'/my/playlist?id=' + list.id" class="block cover">
                                <img :src="list.coverImgUrl + '?param=40y40'" width="40" height="40" />
                            </router-link>
                            <router-link :to="'/my/playlist?id=' + list.id" class="txt block">
                                <p>{{ list.name }}</p>
                                <p>{{ list.trackCount }}首</p>
                            </router-link>
                        </div>
                        <div v-show="playListCtrl.showBtnGroup == 3 + index" class="btn-group absolute">
                            <i class="delet"></i>
                            <i class="edit"></i>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="save-playlist pointer">
                <h2 @click="playListCtrl.closeMyCollect = !playListCtrl.closeMyCollect">
                    <span class="r-tle">
                        <i :class="{ open: !playListCtrl.closeMyCollect, close: playListCtrl.closeMyCollect }"></i>
                        收藏的歌单
                        <span>({{ playListCtrl.myCollect.length }})</span>
                    </span>
                </h2>
                <ul v-show="!playListCtrl.closeMyCollect" class="list-none">
                    <li v-for="(list, index) in playListCtrl.myCollect"
                        @click="playListCtrl.actived = 3 + playListCtrl.myCreate.length + index"
                        @mouseover="playListCtrl.showBtnGroup = 3 + playListCtrl.myCreate.length + index"
                        @mouseleave="playListCtrl.showBtnGroup = -1" class="relative pointer fillWidth"
                        :class="{ active: playListCtrl.actived === 3 + playListCtrl.myCreate.length + index }"
                        :key="list.id">
                        <div class="flex li-con">
                            <router-link :to="'/my/playlist?id=' + list.id" class="block cover">
                                <img :src="list.coverImgUrl + '?param=40y40'" width="40" height="40" />
                            </router-link>
                            <router-link :to="'/my/playlist?id=' + list.id" class="txt block">
                                <p>{{ list.name }}</p>
                                <p>
                                    {{ list.trackCount }}首
                                    <span>by</span>
                                    {{ list.creator.nickname }}
                                </p>
                            </router-link>
                        </div>
                        <div v-show="playListCtrl.showBtnGroup == 3 + playListCtrl.myCreate.length + index"
                            class="btn-group absolute">
                            <i class="delet"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="less">
.my-con {
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    padding: 40px;

    .withoutLogin {
        width: 900px;
        height: 277px;
        overflow: hidden;
        margin: 104px auto;
        background: url("../../assets/img/mymusic.png") no-repeat 0 0;

        a {
            width: 167px;
            height: 45px;
            margin: 201px 0 0 482px;
            background: rgba(0, 0, 0, 0);

            &:hover {
                background: url("../../assets/img/mymusic.png") no-repeat 0 -277px;
            }
        }
    }
}

.hasLogin {
    width: 980px;
    height: auto;
    margin: 0 auto;
    border-left: 1px solid #d3d3d3;
    border-right: 1px solid #d3d3d3;
    background: url("../../assets/img/wrap3.png") repeat-y center 0;

    .left {
        width: 240px;
        padding: 40px 0 50px 0;

        .my-sub {
            height: 36px;
            line-height: 36px;

            &:hover {
                background: #eee;
            }

            a {
                padding: 0 5px 2px 35px;
                display: block;
                width: 100%;
                height: 100%;
                color: #000;
                text-decoration: none;
                font-family: simsun, \5b8b\4f53;
            }
        }

        .active {
            background: #eee;
        }

        .save-playlist,
        .create-playlist {
            margin-top: 8px;

            h2 {
                padding: 0 10px 12px 15px;
                font-size: 14px;
                color: #000;
                font-family: simsun, \5b8b\4f53;

                a {
                    float: right;
                    width: 52px;
                    height: 22px;
                    background: url("../../assets/img/button.png") no-repeat 0 -96px;

                    i {
                        display: inline-block;
                        line-height: 22px;
                        overflow: hidden;
                        padding-left: 20px;
                        color: #515151;
                        font-size: 12px;
                        font-weight: normal;
                        font-style: normal;
                        text-align: left;
                    }

                    &::after {
                        clear: both;
                    }
                }

                .r-tle {
                    i {
                        display: inline-block;
                        vertical-align: middle;
                        margin: 0 2px 0 5px;
                        cursor: pointer;
                        font-size: 0;
                        height: 0;
                        line-height: 0;
                        font-style: normal;
                        text-align: left;
                    }

                    .open {
                        border-color: #ccc transparent transparent;
                        border-style: solid dashed dashed;
                        border-width: 8px 7px 0;
                    }

                    .close {
                        border: 8px solid #ccc;
                        border-color: transparent transparent transparent #ccc;
                        border-style: dashed dashed dashed solid;
                        margin-right: 0;
                    }

                    span {
                        display: inline-block;
                        width: 10px;
                    }
                }
            }

            ul {
                li {
                    box-sizing: border-box;
                    height: 54px;
                    padding: 6px 0 6px 20px;

                    &:hover {
                        background: #eee;
                    }

                    .li-con {
                        .cover {
                            width: 40px;
                            height: 40px;
                        }

                        .txt {
                            width: 150px;
                            color: #000;
                            margin-left: 5px;
                            overflow: hidden;
                            text-decoration: none;

                            p {
                                width: 80%;
                                margin-top: 2px;
                                margin-bottom: 8px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                word-wrap: normal;

                                &:nth-child(2) {
                                    color: #999;
                                }
                            }
                        }
                    }

                    .btn-group {
                        right: 0;
                        bottom: 7px;
                        width: 46px;
                        height: 14px;

                        i {
                            float: right;
                            margin-right: 10px;
                            width: 13px;
                            height: 14px;
                            background: url("../../assets/img/icon.png") no-repeat;
                        }

                        .edit {
                            background-position: 0 -270px;
                        }

                        .delet {
                            background-position: 0 -284px;
                        }

                        &::after {
                            clear: both;
                        }
                    }
                }

                .active {
                    background: #eee;
                }
            }
        }
    }

    .right {
        width: 740px;
        overflow: hidden;
    }
}
</style>