
<template>
    <p class="line"></p>
    <div class="tl-btn-group flex">
        <a class="ply-case pointer">
            <i class="flex">
                <em class="ply block"></em>
                播放
            </i>
        </a>
        <a class="ad-to-ply pointer"></a>
        <a class="tl-was-save pointer">
            <i class="block">收藏</i>
        </a>
        <a class="share-case pointer">
            <i class="block">分享</i>
        </a>
        <a class="download-case pointer">
            <i class="block">下载</i>
        </a>
        <a class="comment-case pointer">
            <i class="block">评论</i>
        </a>
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
        <tbody v-if="playListCtrl?.list.length" class="fillWidth">
            <tr v-for="(track, index) in  playListCtrl?.list" class="fillWidth"
                @mouseover="playListCtrl.trackHover = track.id" @mouseleave="playListCtrl.trackHover = '0'"
                :class="{ background: index % 2 == 0 }" :key="track.id">
                <td>
                    <div class="wp1 wp flex flex-item-center">
                        <span class="index">{{ index + 1 }}</span>
                        <span class="index-icon pointer">&nbsp;</span>
                    </div>
                </td>
                <td>
                    <div class="wp2 flex flex-item-center">
                        <a class="m-name">{{ track.name }}</a>
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
                        <a>{{ track.al.name }}</a>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
import useGlobalProperties from '../../hooks/useGlobalProperties';
import useCurrentInstance from '../../hooks/useCurrentInstance';
import { reactive } from 'vue';

const proxy = useCurrentInstance();
const $route = proxy?.$route;

const Axios = useGlobalProperties('Axios');

const playListCtrl = reactive({
    id: $route?.query?.id,
    trackHover: '',
    list: [],
    trunMusicDuation(ms: number): string {
        const second = ms / 1000;
        return Math.floor(second / 60) + ":" + Math.ceil(second % 60);
    }
} as {
    id: string
    trackHover: string
    list: Array<{
        id: string
        name: string
        tns: Array<string>
        dt: number //时长（ms）
        ar: Array<{ //歌手信息
            id: number
            name: string
        }>
        al: {//专辑
            id: number
            name: string
        }
        mv: number //mv id
    }>
    trunMusicDuation: Function
})

Axios.get('/album?id=' + playListCtrl.id).then((data: any) => {
    playListCtrl.list = data.songs;
}).catch((reson: string) => {
    throw 'playlistVue: ' + reson;
})
</script>

<style lang="less">
@img : '../../assets/img/';

.tl-btn-group {
    width: 980px;
    margin: 40px auto;

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
        background: url("@{img}button2.png") no-repeat right -1020px;

        i {
            background: url("@{img}button2.png") no-repeat 0 -977px;
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

.list-table {
    width: 980px;
    margin: 40px auto;
    min-height: 39px;
    height: auto;

    thead {
        height: 38px;

        tr {
            height: 38px;

            th {
                height: 38px;
                background: url('@{img}table.png') repeat-x 0 0;


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
            background: url('@{img}table.png') no-repeat 0 -151px;
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
                        background: url('@{img}table.png') no-repeat 0 -103px;
                    }
                }

                .btn-grup {
                    padding: 0;
                    justify-content: space-between;

                    .addtoply {
                        width: 13px;
                        height: 13px;
                        background: url('@{img}icon.png') no-repeat 0 -700px;
                    }

                    .collect,
                    .share,
                    .download,
                    .delet {
                        width: 18px;
                        height: 16px;
                        background: url('@{img}table.png') no-repeat;
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