<template>
  <div class="ar-con">
    <div class="head">
      <h3>
        <span>我的歌手</span>({{ radios.count }})
      </h3>
    </div>
    <div class="fillWidth">
      <ul class="list-none">
        <li v-for="rd in radios.list" @mouseover="radios.hover = rd.id" @mouseleave="radios.hover = -1"
          class="radio flex flex-item-center" :key="rd.id">
          <router-link :to="'/djradio?id=' + rd.id" class="block">
            <img :src="rd.dj.avatarUrl + '?param=50y50'" width="50" height="50" />
          </router-link>
          <div class="txt">
            <h3>
              <router-link :to="'/djradio?id=' + rd.id" class="text-decoration-none block">{{ rd.name }}
              </router-link>
            </h3>
            <p class="flex">by
              <router-link :to="'/user/home?id=' + rd.dj.userId" class="text-decoration-none block">
                {{ rd.dj.nickname }}</router-link>
            </p>
          </div>
          <div class="btn-group flex flex-item-center fillHeight">
            <i v-show="radios.hover == rd.id" class="share block"></i>
            <i v-show="radios.hover == rd.id" class="delet block"></i>
          </div>
          <div class="count">{{ rd.dj.djStatus }}期</div>
        </li>
      </ul>
    </div>
  </div>

</template>

<script lang="ts" setup>
import useGlobalProperties from '../../hooks/useGlobalProperties'
import { reactive } from 'vue'

const Axios = useGlobalProperties('Axios')

interface Artist {
  dj: {
    userId: number
    nickname: string
    djStatus: number
    avatarUrl: string
  }
  id: number
  name: string
}

const radios = reactive({
  list: [],
  count: 0,
  hover: -1,
  getList() {
    Axios.get('/dj/sublist').then((data: {
      djRadios: Array<Artist>
      count: number
    }) => {
      radios.list = data.djRadios
      radios.count = data.count
    }).catch((reson: string) => {
      throw reson
    })
  }
} as {
  list: Array<Artist>
  count: number
  hover: number
  getList: Function
})

radios.getList()
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

  .radio {
    width: 100%;
    height: 50px;
    padding: 10px 0;
    border-bottom: 1px solid #e7e7e7;

    .txt {
      width: 488px;
      height: 50px;
      margin-left: 10px;

      a {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        font-size: 14px;
      }

      h3 {
        height: 24px;
        line-height: 24px;

        a {
          max-width: 488px;
          color: #333;
        }
      }

      p {
        height: 24px;
        line-height: 24px;

        a {
          max-width: 483px;
          padding-left: 5px;
          color: #999;
        }
      }
    }

    .btn-group {
      width: 57px;
      justify-content: space-around;

      i {
        width: 16px;
        height: 14px;
        background: url('../../assets/img/icon2.png') no-repeat;
      }

      .delet {
        background-position: -90px 0;
      }

      .share {
        background-position: -130px 0;
      }
    }

    .count {
      max-width: 40px;
      overflow: visible;
      white-space: nowrap;
      margin-left: 10px;
      color: #999;

    }
  }
}
</style>