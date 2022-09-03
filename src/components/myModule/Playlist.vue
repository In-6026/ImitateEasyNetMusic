
<template>
    <h2 v-show="playListCtrl.id === ''">未选择歌单</h2>
    <div v-show="playListCtrl.id !== ''" class="tl-info">
        <div class="tl-head flex fillWidth">
            <div class="tl-h-cover">
                <img v-if="playListCtrl.listdesc?.coverImgUrl"
                    :src="playListCtrl.listdesc?.coverImgUrl + '?param=150y150'" width="200" height="200" />
            </div>
            <div class="tl-h-info">
                <div class="tl-name">
                    <h2>{{ playListCtrl.listdesc?.name }}</h2>
                </div>
                <div v-if="playListCtrl.listdesc?.creator" class="tl-update flex flex-item-center">
                    <router-link :to="'/user/home?id=' + playListCtrl.listdesc?.creator?.userId"
                        class="createor-cover pointer">
                        <img v-if="playListCtrl.listdesc?.creator?.avatarUrl"
                            :src="playListCtrl.listdesc?.creator?.avatarUrl + '?param=35y35'" width="35" height="35" />
                    </router-link>
                    <span class="creator-nkname fillHeight">
                        <router-link :to="'/user/home?id=' + playListCtrl.listdesc?.creator?.userId"
                            class="text-decoration-none">{{ playListCtrl.listdesc?.creator?.nickname }}</router-link>
                    </span>
                    <span class="tl-update-info block">{{
                            playListCtrl.turnToLocalTime(playListCtrl.listdesc?.createTime)
                    }}创建</span>
                </div>
                <div class="tl-btn-group flex">
                    <a @click="playMymusicMultiple()" class="ply-case pointer">
                        <i class="flex">
                            <em class="ply block"></em>
                            播放
                        </i>
                    </a>
                    <a class="ad-to-ply pointer"></a>
                    <a class="tl-was-save pointer">
                        <i class="block">({{ playListCtrl.listdesc?.subscribedCount || '收藏' }})</i>
                    </a>
                    <a class="share-case pointer">
                        <i class="block">({{ playListCtrl.listdesc?.shareCount || '分享' }})</i>
                    </a>
                    <a class="download-case pointer">
                        <i class="block">下载</i>
                    </a>
                    <a class="comment-case pointer">
                        <i class="block">({{ playListCtrl.listdesc?.commentCount || '评论' }})</i>
                    </a>
                </div>
                <div v-show="playListCtrl.listdesc?.tags?.length" class="tags">
                    <b>标签：</b>
                    <router-link v-for="tag in playListCtrl.listdesc?.tags" :key="tag"
                        :to="'/discover/playlist/?cat=' + tag">
                        <i>{{ tag }}</i>
                    </router-link>
                </div>
                <div v-show="playListCtrl.listdesc?.description" class="desc">
                    <p :class="{ open: playListCtrl.ifOpen, close: !playListCtrl.ifOpen }">
                        <b>介绍:</b>
                        {{ playListCtrl.listdesc?.description }}
                    </p>
                    <div class="all" @click="playListCtrl.ifOpen = !playListCtrl.ifOpen">
                        <a class="pointer text-decoration-none">
                            展开
                            <i :class="{ open: playListCtrl.ifOpen, close: !playListCtrl.ifOpen }"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="pl-head flex flex-item-center">
        <h3>
            <span>歌曲列表</span>
        </h3>
        <label>369首歌</label>
    </div>
    <table class="list-table">
        <thead class="fillWidth">
            <tr class="fillWidth">
                <th>
                    <div class="wp1"></div>
                </th>
                <th>
                    <div class="wp2">歌曲标题</div>
                </th>
                <th>
                    <div class="wp3">时长</div>
                </th>
                <th>
                    <div class="wp4">歌手</div>
                </th>
                <th>
                    <div class="wp5">专辑</div>
                </th>
            </tr>
        </thead>
        <tbody v-if="playListCtrl.listdesc?.tracks" class="fillWidth">
            <tr v-for="(track, index) in  playListCtrl.listdesc?.tracks" class="fillWidth"
                @mouseover="playListCtrl.trackHover = track.id" @mouseleave="playListCtrl.trackHover = 0"
                :class="{ background: index % 2 == 0 }" :key="track.id">
                <td>
                    <div class="wp1 wp flex flex-item-center">
                        <span class="index">{{ index + 1 }}</span>
                        <span @click="playMymusicSingle(track)" class="index-icon pointer">&nbsp;</span>
                    </div>
                </td>
                <td>
                    <div class="wp2 flex flex-item-center">
                        <a>{{ track.name }}</a>
                        <i v-if="track.mv" class="block"></i>
                    </div>
                </td>
                <td>
                    <div class="wp3">
                        <span v-show="!(playListCtrl.trackHover == track.id)">{{
                                playListCtrl.trunMusicDuation(track.dt)
                        }}</span>
                        <div v-show="playListCtrl.trackHover == track.id" class="btn-grup flex flex-item-center">
                            <i class="addtoply pointer"></i>
                            <i class="collect pointer"></i>
                            <i class="share pointer"></i>
                            <i class="download pointer"></i>
                            <i class="delet pointer"></i>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="wp4">
                        <a v-for="(ar, index) in track.ar" class="text-decoration-none" :key="ar.id">
                            {{ ar.name }}
                            <em v-if="(index + 1) != track.ar.length">/</em>
                        </a>
                    </div>
                </td>
                <td>
                    <div class="wp5">
                        <a class="text-decoration-none">{{ track.al.name }}
                        </a>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <Commentarea />
</template>

<script lang="ts" setup>
import Commentarea from './Commentarea.vue';
import useCurrentInstance from '../../hooks/useCurrentInstance';
import useGlobalProperties from '../../hooks/useGlobalProperties';
import { useStore } from 'vuex';
import { reactive } from 'vue'
import Song from '../../publicInterface/Song';
import mitter from '@/utils/mitter';

const store = useStore()
const Axios = useGlobalProperties('Axios')
const $route = useCurrentInstance()?.$route
const $router = useCurrentInstance()?.$router


interface ListInfo {
    id: string
    name: string
    coverImgUrl: string
    userId: number
    createTime: number
    trackCount: number//歌曲数量
    privacy: number //是否隐私
    playCount: 21807770,
    subscribedCount: number //收藏数量
    shareCount: number
    commentCount: number
    description: string //介绍
    tags: Array<string>
    creator: {
        defaultAvatar: boolean
        avatarUrl: string
        userId: string
        nickname: string
        userType: number
        identityIconUrl: string //类型图标
    }
    trackIds: Array<{
        id: string //歌曲id
        uid: number //作者的id
    }>
    tracks: Array<{
        id: string
        name: string
        tns: Array<string>
        dt: number //时长（ms）
        ar: Array<{ //歌手信息
            id: string
            name: string
        }>
        al: {//专辑
            id: string
            name: string
            picUrl: string
        }
        mv: number //mv id
    }>
}
const playListCtrl = reactive({
    id: '',
    ismyCreate: true,//用于区分自己创建的和收藏的歌单
    ifOpen: false, //用于展开/收起歌单描述
    trackHover: 0, //被hover的歌曲
    listdesc: {},
    turnToLocalTime(timestamp: number): string {
        const date = new Date(timestamp).toLocaleDateString().split('/');
        return date[0] + '年' + date[1] + '月' + date[2] + '日';
    },
    trunMusicDuation(ms: number): string {
        const second = ms / 1000;
        return Math.floor(second / 60) + ":" + Math.ceil(second % 60);
    }
} as {
    id: string
    ismyCreate: boolean
    ifOpen: boolean
    trackHover: number
    listdesc: ListInfo
    // eslint-disable-next-line no-unused-vars
    turnToLocalTime: (timestamp: number) => string
    // eslint-disable-next-line no-unused-vars
    trunMusicDuation: (ms: number) => string
})

const getList = () => {
    const url = `/playlist/detail?id=${playListCtrl.id}&s=0`;
    Axios.get(url).then((data: {
        playlist: ListInfo
    }) => {
        playListCtrl.listdesc = data.playlist;
        playListCtrl.ismyCreate = playListCtrl.listdesc?.creator?.userId === store.state.User?.id;
    }).catch((reson: string) => {
        throw reson;
    })
}
$router?.afterEach((to) => {
    playListCtrl.id = to?.query.id as string || '';
    getList();
})
playListCtrl.id = $route?.query.id as string || '';
getList();

const playMymusicSingle = (song: Song) => {
    console.log(song);
    mitter.emit('single-play', song);
}
const playMymusicMultiple = () => {
    mitter.emit('multiple-play', playListCtrl.listdesc.tracks);
}
</script>

<style lang="less">
@img: "../../assets/img/";

.tl-info {
    width: 660px;
    height: auto;
    margin: 40px;

    .tl-head {
        min-height: 158px;
        height: auto;

        .tl-h-cover {
            padding: 3px;
            width: 200px;
            height: 200px;
            border: 1px solid #ccc;
        }

        .tl-h-info {
            width: 473px;
            min-height: 114px;
            height: auto;
            margin-left: 20px;

            &::after {
                clear: both;
            }

            .tl-name {
                margin: 0 0 4px;

                h2 {
                    font: normal normal normal 20px/24px "Microsoft Yahei",
                        Arial, Helvetica, sans-serif;
                }
            }

            .tl-update {
                margin: 10px 0 20px;

                .createor-cover {
                    width: 35px;
                    height: 35px;
                    margin-right: 10px;
                }

                .creator-nkname {
                    max-width: 210px;
                    line-height: 35px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;

                    a {
                        color: #0c73c2;
                    }
                }

                .tl-update-info {
                    color: #666;
                    margin-left: 15px;
                    line-height: 33px;
                }
            }

            .tl-btn-group {
                margin: auto -10px 25px auto;

                a {
                    text-decoration: none;
                }

                .ply-case {
                    padding: 0 5px 0 0;
                    height: 31px;
                    min-width: 66px;
                    background: url("@{img}button2.png") no-repeat right -428px;

                    i {
                        padding: 0 7px 0 8px;
                        height: 31px;
                        color: #fff;
                        font: normal normal normal 12px/31px Arial, Helvetica,
                            sans-serif;
                        background: url("@{img}button2.png") no-repeat 0 -387px;

                        &:hover {
                            background-position: 0 -469px;
                        }

                        .ply {
                            width: 20px;
                            height: 18px;
                            margin: 6px 2px 2px 0;
                            background: url("@{img}button2.png") no-repeat 0 -1622px;
                        }
                    }
                }

                .ad-to-ply {
                    margin: 0px 0px auto -3px;
                    width: 31px;
                    height: 31px;
                    padding: 0 5px 0 0;
                    background: url("@{img}button2.png") no-repeat 0 -1588px;

                    &:hover {
                        background-position: -40px -1588px;
                    }
                }

                .tl-was-save,
                .share-case,
                .download-case,
                .comment-case {
                    margin-left: 6px;
                    height: 31px;
                    padding: 0 5px 0 0;

                    i {
                        color: black;
                        min-width: 28px;
                        padding: 0 2px 0 28px;
                        font: normal normal normal 12px/31px Arial, Helvetica,
                            sans-serif;
                    }
                }

                .tl-was-save {
                    background: url("@{img}button2.png") no-repeat right -1192px;

                    i {
                        color: #bebebe;
                        background: url("@{img}button2.png") no-repeat 0 -1149px;
                    }
                }

                .share-case,
                .download-case,
                .comment-case {
                    background: url("@{img}button2.png") no-repeat right -1020px;
                }

                .share-case {
                    i {
                        background: url("@{img}button2.png") no-repeat 0 -1225px;
                    }
                }

                .download-case {
                    i {
                        background: url("@{img}button2.png") no-repeat 0 -2761px;
                    }
                }

                .comment-case {
                    i {
                        background: url("@{img}button2.png") no-repeat 0 -1465px;
                    }
                }
            }

            .tags {
                margin: 25px 0 5px;
                line-height: 22px;

                b {
                    color: #666;
                }

                a {
                    display: inline-block;
                    margin-right: 10px;
                    padding: 0 10px 0 0;
                    color: #777;
                    line-height: 22px;
                    text-decoration: none;
                    text-shadow: 0 1px #fdfdfd;
                    background: url("@{img}button2.png") no-repeat right -27px;

                    i {
                        display: inline-block;
                        padding: 0 3px 0 13px;
                        height: 22px;
                        line-height: 22px;
                        background: url("@{img}button2.png") no-repeat 0 0;
                    }
                }
            }

            .desc {
                margin-top: 4px;

                p {
                    line-height: 18px;
                    color: #666;

                    b {
                        display: inline-block;
                        font-weight: normal;
                    }
                }

                .close {
                    max-height: 54px;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .open {
                    height: auto;
                }

                .all {
                    a {
                        float: right;
                        color: #0c73c2;

                        i {
                            display: inline-block;
                            width: 11px;
                            height: 8px;
                            background: url("../../assets/img/icon.png") no-repeat;
                        }

                        .open {
                            background-position: -45px -520px;
                        }

                        .close {
                            background-position: -65px -520px;
                        }
                    }
                }
            }
        }
    }
}

.pl-head {
    height: 33px;
    margin-top: 40px;
    box-sizing: border-box;
    border-bottom: 2px solid #c20c0c;
    color: #666;

    h3 {
        padding-left: 40px;
        font: normal normal normal 20px/28px "Microsoft Yahei", Arial, Helvetica,
            sans-serif;
    }

    label {
        margin: 9px 0 0 20px;
    }
}

.list-table {
    width: 740px;
    min-height: 39px;
    height: auto;

    thead {
        height: 38px;

        tr {
            height: 38px;

            th {
                height: 38px;
                background: url('../../assets/img/table.png') repeat-x 0 0;


            }

            div {

                padding: 8px 10px;
            }

        }
    }

    div {
        text-align: left;
        box-sizing: border-box;
        color: #666;
    }

    .wp1 {
        width: 68px;

    }

    .wp2 {
        width: 300px;

        a {
            max-width: 270px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        i {
            width: 23px;
            height: 17px;
            margin-left: 3px;
            background: url('../../assets/img/table.png') no-repeat 0 -151px;
        }
    }

    .wp3 {
        width: 108px;
    }

    .wp4 {
        width: 102px;

        a {
            color: #333;
        }
    }

    .wp5 {
        width: 146px;

        a {
            color: #333;
        }
    }

    tbody {
        .background {
            background: #f7f7f7;
        }

        tr {
            div {

                padding: 6px 10px;
            }

            .m-name {
                color: #000;
            }

            td {
                div {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .wp {
                    justify-content: space-around;

                    .index {
                        width: 25px;
                        color: #999;
                    }

                    .index-icon {
                        width: 17px;
                        height: 17px;
                        background: url('../../assets/img/table.png') no-repeat 0 -103px;
                    }
                }

                .btn-grup {
                    padding: 0;
                    justify-content: space-between;

                    .addtoply {
                        width: 13px;
                        height: 13px;
                        background: url('../../assets/img/icon.png') no-repeat 0 -700px;
                    }

                    .collect,
                    .share,
                    .download,
                    .delet {
                        width: 18px;
                        height: 16px;
                        background: url('../../assets/img/table.png') no-repeat;
                    }

                    .collect {
                        background-position: 0 -174px;
                    }

                    .share {
                        background-position: 0 -195px;
                    }

                    .download {
                        background-position: -81px -174px;
                    }

                    .delet {
                        background-position: 0 -217px;
                    }
                }
            }



        }
    }
}
</style>