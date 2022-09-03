<template>
  <div class="ar-con">
    <div class="head">
      <h3>
        <span>我的歌手</span>({{ artist.count }})
      </h3>
    </div>
    <div v-for="art in artist.list" class="art fillWidth flex" :key="art.id">
      <div class="cover">
        <router-link :to="'/artist?id=' + art.id">
          <img :src="art.picUrl + '?param=80y80'" width="80" height="80" />
        </router-link>
      </div>
      <div class="txt">
        <h4>
          <router-link :to="'/artist?id=' + art.id" class="pointer text-decoration-none">{{ art.name }}
          </router-link>
        </h4>
        <p>{{ art.albumSize }}个专辑</p>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import useGlobalProperties from '../../hooks/useGlobalProperties'
import { reactive } from 'vue'

const Axios = useGlobalProperties('Axios')

interface Artist {
  id: number
  info: string
  name: string
  albumSize: number
  picUrl: string
}

const artist = reactive({
  list: [],
  count: 0,
  getList() {
    Axios.get('/artist/sublist').then((data: {
      data: Array<Artist>
      count: number
    }) => {
      artist.list = data.data
      artist.count = data.count
    }).catch((reson: string) => {
      throw reson
    })
  }
} as {
  list: Array<Artist>
  count: number
  getList: Function
})
artist.getList()
</script>

<style lang="less" scoped>
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

  .art {
    height: 80px;
    padding: 10px 0;
    border-bottom: 1px solid rgb(221, 221, 221);

    .cover {
      width: 80px;
      height: 80px;
      margin-right: 15px;
    }

    .txt {
      height: 47px;

      h4 {
        height: 21px;
        margin: 10px 0px;
        line-height: 21px;

        a {
          font-size: 16px;
          color: rgb(51, 51, 51);
        }
      }

      p {
        height: 16px;
        color: rgb(102, 102, 102);
      }
    }
  }
}
</style>