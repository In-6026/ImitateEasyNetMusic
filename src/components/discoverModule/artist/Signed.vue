
<script lang="ts" setup>
import useGlobalProperties from '@/hooks/useGlobalProperties'
import { reactive } from 'vue'
const Axios = useGlobalProperties('Axios')

interface Singer {
  id: number
  name: string
  picUrl: string
}
const manager = reactive({
  singer: [],
  getSingerInfo() {
    Axios.get('/top/artists?offset=0&limit=255')
      .then((data: { artists: Array<Singer> }) => {
        manager.singer = data.artists
      }).catch((reson: string) => {
        throw reson
      })
  }
} as {
  singer: Array<Singer>
  getSingerInfo: Function
})
manager.getSingerInfo()
</script>
<template>
  <div class="head">
    <h3>
      <span>入驻歌手</span>
    </h3>
  </div>
  <ul class="hot-sgr-detail list-none flex flex-warp">
    <li v-for="singer in manager.singer" :key="singer.name">
      <div class="u-cover relative">
        <img :src="singer.picUrl + '?param=130y130'" width="130" height="130" loading="lazy" />
        <router-link :to="'/artist?id=' + singer.id" class="msk absolute fillWidth fillHeight"></router-link>
      </div>
      <p class="fillWidth">
        <router-link :to="'/artist?id=' + singer.id" class="name text-decoration-none">{{ singer.name }}</router-link>
        <router-link :to="'/user/home?id=' + singer.id" class="u-icon">
          <i class="pointer fillWidth fillHeight block"></i>
        </router-link>
      </p>
    </li>
  </ul>
</template>
<style lang="less" scoped>
@img: "../../../assets/img/";

.head {
  height: 40px;
  border-bottom: 2px solid #c20c0c;

  h3 {
    float: left;

    span {
      font: normal normal normal 24px/31px "Microsoft Yahei", Arial,
        Helvetica, sans-serif;
    }
  }

  .href {
    float: right;
    color: #666;
    margin-top: 14px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &::after {
      clear: both;
    }
  }
}

.hot-sgr-detail {
  margin-top: 20px;
  justify-content: space-between;

  li {
    width: 130px;
    height: 154px;
    padding-bottom: 30px;

    .u-cover {
      width: 130px;
      height: 130px;

      .msk {
        top: 0;
        left: 0;
        background: url("@{img}coverall.png") no-repeat 0 -680px;
      }
    }

    p {
      margin-top: 8px;

      .name {
        float: left;
        color: #000;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      }

      .u-icon {
        float: right;
        width: 17px;
        height: 18px;

        &::after {
          clear: both;
        }

        i {
          background: url("@{img}icon.png") no-repeat 0 -740px;
        }
      }
    }
  }
}
</style>