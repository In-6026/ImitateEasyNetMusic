<template>
    <div class="ar-con">
        <div class="head">
            <h3>
                <span>我的视频</span>({{ videoInfo.count }})
            </h3>
        </div>
        <div class="fillWidth">
            <ul class="fillWidth list-none flex flex-warp">
                <li v-for="video in videoInfo.list" :key="video.vid">
                    <router-link :to="'/mv?id=' + video.vid">
                        <div class="relative fillWidth">
                            <img :src="video.coverUrl + '?param=159y90'" width="159" height="90" />
                            <p class="playtime absolute">
                                <i></i>
                                {{ videoInfo.formatPlayTime(video.playTime) }}
                            </p>
                            <p class="duration absolute">{{ videoInfo.formatDuration(video.durationms) }}</p>
                        </div>
                    </router-link>
                    <h4 class="flex flex-item-center">
                        <i class="block pointer"></i>
                        <router-link :to="'/mv?id=' + video.vid" class="text-decoration-none">{{ video.title }}
                        </router-link>
                    </h4>
                    <h5 class="fillWidth">
                        <router-link v-for="(cor, index) in video?.creator" :to="'/artist?id=' + cor.userId"
                            class="text-decoration-none block" :key="cor.userId">
                            {{ cor.userName }}<em v-if="(index + 1) != video?.creator.length">/</em>
                        </router-link>
                    </h5>
                </li>
            </ul>
        </div>
    </div>

</template>

<script lang="ts" setup>
import useGlobalProperties from '../../hooks/useGlobalProperties';
import { reactive } from 'vue'

const Axios = useGlobalProperties('Axios')

interface Artist {
    vid: number
    title: string
    playTime: number
    coverUrl: string
    durationms: number
    creator: Array<{
        userId: number
        userName: string
    }>
}

const videoInfo = reactive({
    list: [],
    count: 0,
    getList() {
        Axios.get('/mv/sublist').then((data: {
            data: Array<Artist>
            count: number
        }) => {
            videoInfo.list = data.data
            videoInfo.count = data.count
        }).catch((reson: string) => {
            throw reson;
        })
    },
    formatDuration(ms: number): string {
        const seconds = ms / 1000;
        const min = Math.floor(seconds / 60)
        const sec = Math.ceil(seconds % 60)
        return min > 10 ? `${min}:${sec}` : `0${min}:${sec}`;
    },
    formatPlayTime(times: number): string {
        return times > 1_0000 ? (times / 1_0000).toFixed(1) + '万' : times + '';
    }
} as {
    list: Array<Artist>
    count: number
    getList: Function
    formatDuration: Function
    formatPlayTime: Function
})
videoInfo.getList();
</script>

<style lang="less">
.ar-con {
    width: 660px;
    margin: 40px;

    .head {
        height: 40px;
        border-bottom: 2px solid rgb(194, 12, 12);

        h3 {
            font: normal normal normal 24px/40px "Microsoft Yahei", Arial, Helvetica, sans-serif;
        }
    }

    li {
        padding-top: 10px;
        width: 159px;

        div {
            height: 90px;

            p {
                height: 20px;
                line-height: 20px;
                color: rgb(255, 255, 255);
                text-shadow: rgb(0 0 0 / 40%) -2px 1px;
            }

            .playtime {
                top: 0px;
                right: 0px;
                padding-right: 5px;
                box-sizing: border-box;
                text-align: right;

                i {
                    display: inline-block;
                    width: 15px;
                    height: 10px;
                    margin-right: 2px;
                    background: url('../../assets/img/icon2.png') no-repeat -60px -310px;
                }
            }

            .duration {
                bottom: 0px;
                left: 0px;
                padding-left: 5px;
            }
        }

        h4 {
            height: 21px;
            margin: 7px 0;
            font-size: 14px;
            font-weight: normal;

            i {
                width: 26px;
                height: 16px;
                margin-right: 4px;
                background: url('../../assets/img/icon2.png') -270px -480px;
            }

            a {
                color: black;
                max-width: 129px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow-wrap: normal;
            }
        }

        h5 {
            a {
                color: #333;
                max-width: 159px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow-wrap: normal;
            }
        }
    }
}
</style>