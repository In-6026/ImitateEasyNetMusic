<script setup lang="ts">
import useCurrentInstance from '../../hooks/useCurrentInstance'
import useGlobalProperties from '../../hooks/useGlobalProperties'
import { reactive } from 'vue'

const $route = useCurrentInstance()?.$route
const $router = useCurrentInstance()?.$router
const Axios = useGlobalProperties('Axios')


interface MusicList {
  id: number
  name: string
  ar: Array<{
    id: number
    name: string
  }>
  al: {
    picUrl: string
  }
  dt: number
}
interface TopList {
  songs: Array<MusicList>
}
let musicListCtrl = reactive({
  id: '',
  hover: -1,
  list: [],
  trackCount: 0,
  initList(route: any) {
    musicListCtrl.id = route?.query.id ? route?.query.id : '19723756'
    Axios.get(`/playlist/track/all?id=${musicListCtrl.id}&offset=0`).then((data: TopList) => {
      musicListCtrl.list = data.songs
      musicListCtrl.trackCount = data.songs.length
    }).catch((reson: string) => {
      throw reson
    })
  },
  turnDuation(date: number): string {
    const second = date / 1000
    return Math.floor(second / 60) + ":" + Math.floor(second % 60)
  }
} as {
  id: string
  hover: number
  list: Array<MusicList>
  trackCount: number
  initList: Function
  turnDuation: Function
})
$router?.afterEach((to) => {
  musicListCtrl.initList(to)
})
musicListCtrl.initList($route)
const showBtnGroup = (index: number) => {
  musicListCtrl.hover = index
}
const hideBtnGroup = () => {
  musicListCtrl.hover = -1
}
</script>

<template>
  <div class="ml-con">
    <div class="ml-head">
      <h3>
        <span>歌曲列表</span>
      </h3>
      <span class="m-count">
        <span>{{ musicListCtrl.trackCount }}</span>
        首歌
      </span>
    </div>
    <table class="tl-table fillWidth">
      <thead>
        <tr>
          <th class="w1"></th>
          <th class="w2">
            <div class="wp">标题</div>
          </th>
          <th class="w3">
            <div class="wp">时长</div>
          </th>
          <th class="w4">
            <div class="wp">歌手</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(musicinfo, index) in musicListCtrl.list" @mouseover="showBtnGroup(index)"
          @mouseleave="hideBtnGroup()" :class="{ topThree: index <= 2, aftThree: index > 2, listBack: !(index % 2) }"
          :key="musicinfo.id">
          <td>
            <div class="hd">
              <span>{{ index + 1 }}</span>
            </div>
          </td>
          <td class="info">
            <div>
              <div class="flex flex-item-center">
                <router-link v-if="index <= 2" :to="'/song?id=' + musicinfo.id">
                  <img :src="musicinfo?.al?.picUrl + '?param=50y50'" class="i-pic" loading="lazy" />
                </router-link>
                <span class="ply-icon pointer"></span>
                <router-link :to="'/song?id=' + musicinfo.id" class="text-decoration-none music-name">{{ musicinfo.name
                }}</router-link>
              </div>
            </div>
          </td>
          <td class="time-btngrp">
            <span :class="{ hiden: index === musicListCtrl.hover }">{{ musicListCtrl.turnDuation(musicinfo.dt) }}</span>
            <div class="btn-group flex flex-item-center hide" :class="{ hiden: !(index === musicListCtrl.hover) }">
              <a class="addto"></a>
              <span class="save"></span>
              <span class="share"></span>
              <span class="download"></span>
            </div>
          </td>
          <td class="fillHeight artists">
            <span v-for="(artist, index) in musicinfo.ar" :key="artist.id">
              <router-link :to="'/discover/artist?id=' + artist.id" class="text-decoration-none">{{ artist.name }}
              </router-link>
              <em v-if="index < musicinfo.ar.length - 1">/</em>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang="less">
@img: '../../assets/img/';

.ml-con {
  padding: 0 30px 40px 40px;
  min-height: 100px;
  height: auto;

  .ml-head {
    height: 33px;
    border-bottom: 2px solid #c20c0c;

    h3 {
      float: left;
      font: normal normal normal 20px/28px "Microsoft Yahei", Arial,
        Helvetica, sans-serif;
    }

    .m-count {
      color: #666;
      margin-left: 20px;
      line-height: 35px;
    }
  }

  .tl-table {
    border: 1px solid #d9d9d9;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;

    th {
      height: 38px;
      text-align: left;
      background: url("@{img}table.png") repeat-x 0 0;
    }

    .w1 {
      width: 77px;
    }

    .w3 {
      width: 91px;
    }

    .w4 {
      width: 26%;
    }

    .w2,
    .w3,
    .w4 {
      .wp {
        height: 18px;
        line-height: 18px;
        padding: 8px 10px;
        background-position: 0 -56px;
        background: url("@{img}table.png") no-repeat 0 -56px;
      }
    }

    .topThree {
      height: 73px;
    }

    .aftThree {
      height: 30px;
      overflow: hidden;
    }

    .listBack {
      background: #f3f3f3;
    }

    .hd {
      text-align: center;
    }

    .info {
      padding: 10px 6px 10px 10px;

      .i-pic {
        width: 50px;
        height: 50px;
      }

      .ply-icon {
        width: 17px;
        height: 17px;
        margin-left: 8px;
        background: url("@{img}table.png") no-repeat 0 -103px;
      }

      .music-name {
        width: 70%;
        color: #333;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .time-btngrp {
      padding: 6px 5px;

      .btn-group {
        justify-content: space-around;

        span {
          width: 18px;
          height: 16px;
        }

        .addto {
          width: 13px;
          height: 13px;
          background: url("@{img}icon.png") no-repeat 0 -700px;
        }

        .save {
          background: url("@{img}table.png") no-repeat 0 -174px;
        }

        .share {
          background: url("@{img}table.png") no-repeat 0 -195px;
        }

        .download {
          background: url("@{img}table.png") no-repeat -81px -174px;
        }
      }
    }

    .artists {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      span {
        a {
          color: #333;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>