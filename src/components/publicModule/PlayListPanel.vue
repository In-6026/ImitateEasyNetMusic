<template>
    <div class="play-list">
        <div class="play-list-bg fillWidth relative pointer">
            <h4>
                播放列表(
                <span>306</span>)
            </h4>
            <a class="collect-all flex flex-item-center">
                <span class="collect-all-icon"></span>
                收藏全部
            </a>
            <a class=" absolute remove-from-list pointer flex flex-item-center">
                <span class="remove-icon"></span>
                删除
            </a>
            <p class="lyric-title">Confession</p>
        </div>
        <div class="list-container">
            <div class="play-list-mask"></div>
            <!-- <img class="play-list-image-bg" /> -->
            <div class="play-list-items">
                <ul @wheel.capture="scrollPlayList($event)" class="fillWidth"
                    :style="'margin-top:' + scorllInfo.listTop + 'px;'">
                    <li v-for="(item, index) in store.state.Player.list" @mouseover="showIconInPlayList(index)"
                        @mouseleave="hideIconInPlayList()" class="fillWidth flex flex-item-center list-none"
                        @click="play(index)" :key="item.name + index">
                        <div class="playing-icon-case-in-list fillHeight flex flex-item-center">
                            <div :class="{ playingIconInList: ifShowPLIcon(index) }" v-show="ifShowPLIcon(index)">
                            </div>
                        </div>
                        <div class="music-name-in-list fillHeight">{{ item.name }}</div>
                        <div class="musicInListControl flex flex-item-center"
                            :class="{ showIconInPlayList: ifShowPLIcon(index), hideIconInPlayList: !ifShowPLIcon(index) }">
                            <i class="collection-icon"></i>
                            <i class="share-icon"></i>
                            <i class="download-icon"></i>
                            <i class="del-from-list-icon"></i>
                        </div>
                        <div class="music-author-case">
                            <a v-for="ar in item.author" class="music-author pointer" :key="ar.id">{{ ar.name }}</a>
                        </div>
                        <div class="music-duration">{{ item.duration }}</div>
                        <div class="music-link-in-play-list">
                            <a href="#" class="music-link-icon"></a>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="play-list-scroll-case">
                <span class="scroll-thum"
                    :style="'height:' + scorllInfo.height + 'px;top:' + scorllInfo.top + 'px;'"></span>
            </div>
            <div class="lyric-container-mask"></div>
            <div class="lyric-container" :style="'top:' + lrcTop() + 'px;'">
                <p v-for="(lrc, index) in store.state.Player.current.lyric" :key="lrc[0]"
                    :class="{ color: lrcCur(index) }">{{ lrc[1] }}
                </p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, } from 'vue'
import { useStore } from 'vuex';
import useGlobalProperties from '../../hooks/useGlobalProperties';

const store = useStore();
const mitter = useGlobalProperties('mitter');

//音乐列表
//音乐播放列表里的按钮的显示/隐藏
let needShowPLIconIndex = ref(-1)
const showIconInPlayList = (index: number) => {
    needShowPLIconIndex.value = index
}
const hideIconInPlayList = (): void => { needShowPLIconIndex.value = -1 }
const ifShowPLIcon = (index: number): boolean => index === needShowPLIconIndex.value;
//音乐列表滚动条

const scorllInfo = reactive({
    listTop: 0,
    height: 260 * 9 / (store.state.Player.list.length < 9 ? 9 : store.state.Player.list.length),//防止歌曲数目小于9
    top: 0,
});
mitter.on('resize-playlistpanel-thumb', () => {
    scorllInfo.height = 260 * 9 / (store.state.Player.list.length < 9 ? 9 : store.state.Player.list.length);//防止歌曲数目小于9
});
//音乐列表滚动
const scrollPlayList = (event: WheelEvent): void => {
    //滚动条
    let offset: number = 10;
    const scrollThumbMaxTop: number = 260 - scorllInfo.height;
    if (event.deltaY < 0) {
        offset *= -1;//判断滚动方向：上/下
    }
    let top = scorllInfo.top + offset;
    if (top < 0) {
        scorllInfo.top = 0;
    } else if (top > scrollThumbMaxTop) {
        scorllInfo.top = scrollThumbMaxTop;
    } else {
        scorllInfo.top = top;
    }

    //播放列表
    let marginTop: number;
    const minMarginTop: number = (9 - store.state.Player.list.length) * 28;
    const scrollToListRatio: number = 28 * store.state.Player.list.length / 260;//滚动条滚动1，列表应该滚动scrollToListRatio
    if (event.deltaY > 0) {
        marginTop = scorllInfo.listTop - scrollToListRatio * 10;
    } else {
        marginTop = scorllInfo.listTop + scrollToListRatio * 10;
    }
    if (marginTop > 0) {
        scorllInfo.listTop = 0
    } else if (marginTop < minMarginTop) {
        scorllInfo.listTop = minMarginTop
    } else {
        scorllInfo.listTop = marginTop
    }
}
//歌词列表
const lrcTop = () => {
    const current = store.state.Player.current.duration * store.state.Player.current.offset;
    const lrc = store.state.Player.current.lyric;
    for (let i = 0; i < lrc.length; i++) {
        if (lrc[i][0] <= current && current < lrc[i + 1][0]) {
            return 100 - i * 32;
        }
    }
    return 100;
}
const lrcCur = (i: number): boolean => {
    const current = store.state.Player.current.duration * store.state.Player.current.offset;
    const lrc = store.state.Player.current.lyric;
    if (lrc[i][0] <= current && current < lrc[i + 1][0]) {
        return true;
    }
    return false;
}
const play = (index: number) => {
    store.commit('setSelectCurrent', index);
    store.commit('findCurrentIndex');
    mitter.emit('mitter-call-play');
}
</script>
<style lang="less">
.play-list {
    position: fixed;
    left: 50%;
    bottom: 47px;
    width: 986px;
    height: 301px;
    margin-left: -493px;

    .play-list-bg {
        height: 41px;
        background: url("../../assets/img/playlist_bg.png") no-repeat 0 0;

        h4 {
            position: absolute;
            left: 25px;
            top: 0;
            height: 39px;
            line-height: 39px;
            font-size: 14px;
            color: #e2e2e2;
        }

        .collect-all {
            position: absolute;
            left: 398px;
            top: 12px;
            height: 15px;
            color: #e2e2e2;
            line-height: 16px;

            .collect-all-icon {
                display: block;
                width: 16px;
                height: 16px;
                margin: 0px 6px 0 0;
                background: url("../../assets/img/playlist.png") no-repeat -24px 0px;
            }
        }

        .remove-from-list {
            left: 490px;
            top: 12px;
            height: 15px;
            color: #e2e2e2;
            line-height: 16px;

            .remove-icon {
                display: block;
                height: 16px;
                margin: 0px 6px 0 0;
                width: 13px;
                background: url("../../assets/img/playlist.png") no-repeat -51px 0;
            }
        }

        .lyric-title {
            position: absolute;
            left: 595px;
            top: 0;
            width: 346px;
            text-align: center;
            height: 39px;
            line-height: 39px;
            color: #fff;
            font-size: 14px;

            .close-play-list {
                position: absolute;
                top: 6px;
                right: 8px;
                width: 30px;
                height: 30px;
                overflow: hidden;
                text-indent: -999px;
                cursor: pointer;
                background: url("../../assets/img/playlist.png") no-repeat -195px 9px;
            }
        }
    }

    .list-container {
        position: absolute;
        left: 0;
        top: 41px;
        padding: 0 5px;
        width: 976px;
        height: 260px;
        overflow: hidden;
        opacity: 0.85;
        background: url("../../assets/img/playlist_bg.png") repeat-y -1014px 0;

        .play-list-image-bg {
            position: absolute;
            left: 2px;
            top: -1px;
            z-index: 1;
            width: 980px;
            height: auto;
            opacity: 0.2;
            filter: Alpha(opacity=20);
        }

        .play-list-mask {
            position: absolute;
            left: 2px;
            top: 0;
            z-index: 2;
            width: 558px;
            height: 260px;
        }

        .play-list-items {
            position: absolute;
            left: 2px;
            top: 0;
            z-index: 4;
            height: 260px;
            width: 553px;
            overflow: hidden;

            ul {
                min-height: 28px;
                height: auto;
                transition: margin-top 0.1s linear;

                li {
                    /* height: 28px; */
                    line-height: 28px;

                    &:hover {
                        background: rgba(0, 0, 0, 0.9);
                    }

                    .playing-icon-case-in-list {
                        width: 10px;
                        padding-left: 10px;
                        line-height: 28px;
                        overflow: hidden;
                        cursor: pointer;

                        .showIconInPlayList {
                            height: 23px;
                        }

                    }
                }
            }
        }
    }
}


.hideIconInPlayList {
    height: 0px;
}

.playingIconInList {
    width: 10px;
    height: 13px;
    background: url("../../assets/img/playlist.png") no-repeat -182px 0;
}

.music-name-in-list {
    color: #ccc;
    width: 256px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 10px;
    line-height: 28px;
    overflow: hidden;
    cursor: pointer;
}

.musicInListControl {
    /* height: 23px; */
    width: 100px;
    position: relative;
    padding-left: 10px;
    line-height: 28px;
    overflow: hidden;
    cursor: pointer;
}

.musicInListControl i {
    display: block;
    height: 16px;
    margin: auto 0 auto 9px;
    /* border: 1px solid; */
}

.collection-icon {
    width: 16px;
    background: url("../../assets/img/playlist.png") no-repeat -24px 0;

    &:hover {
        background-position: -24px -20px;
    }
}

.share-icon {
    width: 14px;
    background: url("../../assets/img/playlist.png") no-repeat 0px 0;

    &:hover {
        background-position: 0px -20px;
    }
}

.download-icon {
    width: 14px;
    background: url("../../assets/img/playlist.png") no-repeat -57px -50px;

    &:hover {
        background-position: -80px -50px;
    }
}

.del-from-list-icon {
    width: 13px;
    background: url("../../assets/img/playlist.png") no-repeat -51px 0;

    &:hover {
        background-position: -51px -20px;
    }
}

.music-author-case {
    width: 70px;
    padding-left: 10px;
    height: 28px;
    line-height: 28px;
    overflow: hidden;
}

.music-author {
    color: #ccc;
    float: left;
    padding-left: 10px;
    height: 28px;
    line-height: 28px;
    text-decoration: none;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /*要在第几行处隐藏，单行超出便省略就把3改成1*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        color: #fff;
        text-decoration: underline;
    }
}


.music-duration {
    width: 65px;
    color: #666;
    padding-left: 10px;
    height: 28px;
    line-height: 28px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
        color: #fff;
    }
}

.music-link-in-play-list {
    width: 37px;
    height: 28px;
    line-height: 28px;
    overflow: hidden;
    cursor: pointer;
}

.music-link-icon {
    display: block;
    width: 14px;
    height: 16px;
    overflow: hidden;
    margin: 7px 0 0 10px;
    background: url("../../assets/img/playlist.png") no-repeat -80px 0px;

    &:hover {
        background-position: -80px -20px;
    }
}

.play-list-scroll-case {
    position: absolute;
    left: 555px;
    top: -1px;
    z-index: 2;
    width: 6px;
    height: 260px;
    background: #000;
    opacity: 0.5;
}

.scroll-thum {
    position: absolute;
    display: block;
    left: 0;
    width: 4px;
    border-radius: 5px;
    cursor: pointer;
    background: #868686;
    border: 1px solid #a6a6a6;
    opacity: 0.8;
    transition: top 0.1s linear;
}

.lyric-container-mask {
    position: absolute;
    left: 560px;
    top: 0;
    z-index: 3;
    width: 420px;
    height: 250px;
    background: #121212;
    opacity: 0.01;
}

.lyric-container {
    position: absolute;
    right: 40px;
    z-index: 4;
    margin: 21px 0 20px 0;
    height: 219px;
    width: 354px;
    overflow: hidden;

    p {
        color: #989898;
        word-wrap: break-word;
        text-align: center;
        line-height: 32px;
        height: auto !important;
        // height: 32px;
        min-height: 32px;
        transition: color 0.7s linear;
    }

    .color {
        color: #fff;
    }
}

.lyric-scroll-case {
    position: absolute;
    top: -1px;
    /* left: 555px; */
    right: 2px;
    z-index: 2;
    width: 6px;
    height: 260px;
    background: #000;
    opacity: 0.5;
    filter: Alpha(opacity=50);
}

.lyric-scroll-thumb {
    position: absolute;
    right: 0;
    width: 4px;
    border-radius: 5px;
    cursor: pointer;
    background: #868686;
    border: 1px solid #a6a6a6;
    opacity: 0.8;
    filter: Alpha(opacity=80);
}
</style>