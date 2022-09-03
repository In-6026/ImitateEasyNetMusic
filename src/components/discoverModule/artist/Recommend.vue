<script lang="ts" setup>
import useGlobalProperties from '@/hooks/useGlobalProperties'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import { reactive } from 'vue'
const Axios = useGlobalProperties('Axios')
const $router = useCurrentInstance()?.$router
interface Singer {
  id: number
  name: string
  picUrl: string
}
const manager = reactive({
  recommendSinger: [],
  hotSinger: [],
  getSingerInfo() {
    Axios.get('/top/artists?offset=0&limit=110').then((data: { artists: Array<Singer> }) => {
      manager.recommendSinger = data.artists.slice(0, 10)
      manager.hotSinger = data.artists.slice(10)
    }).catch((reson: string) => {
      throw reson
    })
  }
} as {
  recommendSinger: Array<Singer>
  hotSinger: Array<Singer>
  getSingerInfo: Function
})
manager.getSingerInfo()
const toSigned = () => {
  $router?.push('artist/signed')
}
</script>
<template>
  <div class="head">
    <h3>
      <span>入驻歌手</span>
    </h3>
    <a @click="toSigned()" class="href pointer">更多 ></a>
  </div>
  <ul class="hot-sgr-detail list-none flex flex-warp">
    <li v-for="singer in manager.recommendSinger" :key="singer.name">
      <div class="u-cover relative">
        <img :src="singer.picUrl + '?param=130y130'" width="130" height="130" />
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

  <div class="head">
    <h3>
      <span>热门歌手</span>
    </h3>
  </div>
  <ul class="hot-sgr-detail list-none flex flex-warp">
    <li v-for="singer in manager.hotSinger.slice(0, 10)" :key="singer.name">
      <div class="u-cover relative">
        <img :src="singer.picUrl + '?param=130y130'" width="130" height="130" />
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
  <ul class="hot-sgr-ellipse flex flex-warp fillWidth">
    <li v-for="singer in manager.hotSinger.slice(10)" class="list-none flex flex-item-center" :key="singer.id">
      <router-link :to="'/artist?id=' + singer.id" class="text-decoration-none name-e fillHeight">{{ singer.name }}
      </router-link>
      <router-link :to="'/user/home?id=' + singer.id" class="icon block"></router-link>
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

.hot-sgr-ellipse {
  border-top: 1px dashed gray;

  li {
    width: 20%;
    height: 30px;

    .name-e {
      max-width: 105px;
      line-height: 30px;
      color: #000;
    }

    .icon {
      width: 17px;
      height: 18px;
      margin-left: 2px;
      background: url("@{img}icon.png") no-repeat 0 -740px;
    }
  }
}
</style>