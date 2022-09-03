<template>
  <p class="line"></p>
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
            <span @click="play(index)" class="index-icon pointer">&nbsp;</span>
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
import useGlobalProperties from '../../hooks/useGlobalProperties'
import useCurrentInstance from '../../hooks/useCurrentInstance'
import { reactive } from 'vue'
import Song from '../../publicInterface/Song'

const proxy = useCurrentInstance()
const $route = proxy?.$route
const $router = proxy?.$router

const Axios = useGlobalProperties('Axios')
const mitter = useGlobalProperties('mitter')

const playListCtrl = reactive({
  id: $route?.query?.id,
  trackHover: '',
  list: [],
  trunMusicDuation(ms: number): string {
    const second = ms / 1000
    return Math.floor(second / 60) + ":" + Math.ceil(second % 60)
  }
} as {
  id: string
  trackHover: string
  list: Array<Song>
  trunMusicDuation: Function
})

function Init(string: string) {
  Axios.get('/cloudsearch?keywords=' + string).then((data: any) => {
    playListCtrl.list = data.result.songs
  }).catch((reson: string) => {
    throw 'playlistVue: ' + reson
  })
}
Init($route?.query.string as string)
$router?.afterEach((to) => {
  Init(to.query.string as string)
})

const play = (index: number) => {
  mitter.emit('single-play', playListCtrl.list[index])
}
</script>

<style lang="less">
@img : '../../assets/img/';

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
