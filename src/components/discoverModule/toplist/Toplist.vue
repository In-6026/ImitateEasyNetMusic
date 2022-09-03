
<template>
  <div class="tl-con flex">
    <div class="tl">
      <div class="tl-warp fillWidth">
        <h2 class="tle">云音乐特色榜</h2>
        <ul>
          <li v-for="(speacial, index) in toplist?.slice(0, 4)" class="list-none pointer fillWidth tl-li"
            :class="{ tlLiActive: 'spe' + index === musiclistActive.index }" @click="getMusicListInfo('spe', index)"
            :key="speacial.id">
            <router-link :to="'?id=' + speacial.id" class="fillWidth fillHeight block con">
              <div class="fillWidth flex tl-box">
                <div class="tl-cover">
                  <img :src="speacial.coverImgUrl + '?param=40y40'" loading="lazy" />
                </div>
                <div class="tl-l-txt">
                  <p class="tl-l-name">
                    <router-link :to="'?id=' + speacial.id" class="text-decoration-none name">{{
                        speacial.name
                    }}</router-link>
                  </p>
                  <p class="tl-freq">{{ speacial.updateFrequency }}</p>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
        <h2 class="tle">全球媒体榜</h2>
        <ul>
          <li v-for="(global, index) in toplist?.slice(4)" class="list-none pointer fillWidth tl-li"
            :class="{ tlLiActive: 'glo' + index === musiclistActive.index }" @click="getMusicListInfo('glo', index)"
            :key="global.id">
            <router-link :to="'?id=' + global.id" class="fillWidth fillHeight block con">
              <div class="fillWidth flex tl-box">
                <div class="tl-cover">
                  <img :src="global.coverImgUrl + '?param=40y40'" loading="lazy" />
                </div>
                <div class="tl-l-txt">
                  <p class="tl-l-name">
                    <router-link :to="'?id=' + global.id" class="text-decoration-none name">{{
                        global.name
                    }}</router-link>
                  </p>
                  <p class="tl-freq">{{ global.updateFrequency }}</p>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="tl-info">
      <div class="tl-head">
        <div class="tl-h-cover">
          <img :src="musiclistActive.coverImgUrl + '?param=150y150'" width="150" height="150" />
        </div>
        <div class="tl-h-info">
          <div class="tl-name">
            <h2>{{ musiclistActive.name }}</h2>
          </div>
          <div class="tl-update flex">
            <i class="tl-update-icon block"></i>
            <span class="tl-update-info block">最近更新：{{ turnToLocalTime(musiclistActive.updateTime) }}({{
                musiclistActive.updateFrequency
            }})</span>
          </div>
          <div class="tl-btn-group flex">
            <a @click="playToplistAll()" class="ply-case pointer">
              <i class="flex">
                <em class="ply block"></em>
                播放
              </i>
            </a>
            <a class="ad-to-ply pointer"></a>
            <a class="tl-was-save pointer">
              <i class="block">({{ musiclistActive.bookedCount }})</i>
            </a>
            <a class="share-case pointer">
              <i class="block">({{ musiclistActive.shareCount }})</i>
            </a>
            <a class="download-case pointer">
              <i class="block">下载</i>
            </a>
            <a class="comment-case pointer">
              <i class="block">({{ musiclistActive.commentCount }})</i>
            </a>
          </div>
        </div>
      </div>
      <Musiclist />
      <Commentarea />
    </div>
  </div>
</template>


<script setup lang="ts">
import Musiclist from './Musiclist.vue'
import Commentarea from './Commentarea.vue'
import useGlobalProperties from '../../../hooks/useGlobalProperties'
import useCurrentInstance from '../../../hooks/useCurrentInstance'
import { reactive, ref, } from 'vue'

import Songs from '../../../publicInterface/Songs'

const $route = useCurrentInstance()?.$route
const Axios = useGlobalProperties("Axios")
const mitter = useGlobalProperties('mitter')

interface ListInfo {
  id: string
  name: string
  playCount: number
  trackCount: number
  updateTime: number
  coverImgUrl: string
  updateFrequency: string
  subscribedCount: number
}
interface Toplist {
  list: Array<ListInfo>
}
let toplist = ref()
let musiclistActive = reactive({
  id: '',
  name: '',
  coverImgUrl: '',
  playCount: 0,
  trackCount: 0,
  updateTime: 0,
  shareCount: 0,
  commentCount: 0,
  bookedCount: 0,
  updateFrequency: '刚刚更新',
  index: 'spe0',
})

const initToplistInfo = async () => {
  return new Promise((resolve) => {
    Axios.get("/toplist").then((data: Toplist): void => {
      toplist.value = data.list
      let queryId: string
      if ($route?.query.id) {
        queryId = $route?.query.id as string
      } else {
        queryId = '19723756'
        musiclistActive.index = 'spe0'
      }
      toplist.value.forEach((item: ListInfo, index: number) => {
        if ((item.id).toString() === queryId) {
          index < 4
            ? getMusicListInfo('spe', index)
            : getMusicListInfo('glo', index - 4)
          resolve('initToplistInfo')
          return
        }
      })
    }).catch((reson: string) => {
      throw reson
    })
  })
}
const getMusicListInfo = (name: string, index: number): void => {
  let i = index
  if (name === 'glo') {
    i = i + 4
  }
  musiclistActive.index = name + index
  musiclistActive.id = toplist.value[i].id
  musiclistActive.name = toplist.value[i].name
  musiclistActive.playCount = toplist.value[i].playCount
  musiclistActive.trackCount = toplist.value[i].trackCount
  musiclistActive.updateTime = toplist.value[i].updateTime
  musiclistActive.coverImgUrl = toplist.value[i].coverImgUrl
  musiclistActive.updateFrequency = toplist.value[i].updateFrequency
  supplement()
}
//榜单信息不够，需要补充commentCount和shareCount
const supplement = () => {
  Axios.get('/playlist/detail/dynamic?id=' + musiclistActive.id).then((data: {
    shareCount: number
    bookedCount: number
    commentCount: number
  }) => {
    musiclistActive.bookedCount = data.bookedCount
    musiclistActive.shareCount = data.shareCount
    musiclistActive.commentCount = data.commentCount
  }).catch((reson: string) => {
    throw reson
  })
}
initToplistInfo().then(() => {
  supplement()
})
const turnToLocalTime = (timestamp: number): string => {
  const date = new Date(timestamp).toLocaleDateString().split('/')
  if (date[1].length < 2) {
    date[1] = '0' + date[1]
  }
  return date[1] + '月' + date[2] + '日'
}

const playToplistAll = () => {
  Axios.get('/playlist/track/all?id=' + musiclistActive.id).then((data: Songs) => {
    mitter.emit('multiple-play', data.songs)
  }).catch((reson: string) => {
    throw `获取歌单《${musiclistActive.name}》歌曲数百${reson}`
  })
}
</script>

<style lang="less">
.tl-con {
  width: 980px;
  min-height: 700px;
  margin: 0 auto;
  border-width: 0 1px;
  border: 1px solid #d3d3d3;
  background: url("../../../assets/img/wrap3.png") repeat-y center 0;

  .tl {
    width: 240px;

    .tl-warp {
      margin-top: 40px;
      overflow: hidden;

      .tle {
        font-size: 14px;
        padding: 0 10px 12px 15px;
      }

      .tl-li {
        padding: 10px 0 10px 20px;
        height: 42px;

        &:hover {
          background: #eee;
        }

        .con {
          text-decoration: none;
          color: #000;
        }

        .tl-box {
          padding-left: 50px;

          .tl-cover {
            width: 40px;
            height: 40px;
            margin-left: -50px;
            overflow: hidden;
          }

          .tl-l-txt {
            width: 150px;
            height: 100%;
            margin-left: 10px;

            .tl-l-name {
              margin: 2px 0 8px 0;
              height: 16px;

              .name {
                color: #000;
              }
            }

            .tl-freq {
              height: 16px;
            }
          }
        }
      }

      .tlLiActive {
        background: #ddd;
      }
    }
  }

  .tl-info {
    width: 740px;

    .tl-head {
      padding: 40px;
      height: 158px;

      .tl-h-cover {
        float: left;
        padding: 3px;
        width: 150px;
        height: 150px;
        margin: 0 -220px 0 0;
        border: 1px solid #ccc;
      }

      .tl-h-info {
        float: right;
        width: 473px;
        height: 114px;

        &::after {
          clear: both;
        }

        .tl-name {
          margin: 16px 0 4px;

          h2 {
            font: normal normal normal 20px/24px "Microsoft Yahei",
              Arial, Helvetica, sans-serif;
          }
        }

        .tl-update {
          margin: 0 0 20px;

          .tl-update-icon {
            margin: 9px 0 0 3px;
            width: 13px;
            height: 13px;
            background: url("../../../assets/img/icon.png") no-repeat -18px -682px;
          }

          .tl-update-info {
            color: #666;
            margin-left: 5px;
            line-height: 33px;
          }
        }

        .tl-btn-group {
          margin: auto -10px 25px auto;

          a {
            text-decoration: none;
          }
        }

        .ply-case {
          padding: 0 5px 0 0;
          height: 31px;
          min-width: 66px;
          background: url("../../../assets/img/button2.png") no-repeat right -428px;

          i {
            padding: 0 7px 0 8px;
            height: 31px;
            color: #fff;
            font: normal normal normal 12px/31px Arial, Helvetica,
              sans-serif;
            background: url("../../../assets/img/button2.png") no-repeat 0 -387px;

            &:hover {
              background-position: 0 -469px;
            }
          }

          .ply {
            width: 20px;
            height: 18px;
            margin: 6px 2px 2px 0;
            background: url("../../../assets/img/button2.png") no-repeat 0 -1622px;
          }
        }

        .ad-to-ply {
          margin: 0px 0px auto -3px;
          width: 31px;
          height: 31px;
          padding: 0 5px 0 0;
          background: url("../../../assets/img/button2.png") no-repeat 0 -1588px;

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
          background: url("../../../assets/img/button2.png") no-repeat right -1192px;

          i {
            color: #bebebe;
            background: url("../../../assets/img/button2.png") no-repeat 0 -1149px;
          }
        }

        .share-case,
        .download-case,
        .comment-case {
          background: url("../../../assets/img/button2.png") no-repeat right -1020px;
        }

        .share-case {
          i {
            background: url("../../../assets/img/button2.png") no-repeat 0 -1225px;
          }
        }

        .download-case {
          i {
            background: url("../../../assets/img/button2.png") no-repeat 0 -2761px;
          }
        }

        .comment-case {
          i {
            background: url("../../../assets/img/button2.png") no-repeat 0 -1465px;
          }
        }
      }
    }
  }
}
</style>