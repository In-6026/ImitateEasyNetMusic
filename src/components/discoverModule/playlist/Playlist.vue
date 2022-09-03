
<template>
  <!-- head -->
  <div class="pl-con relative">
    <div class="pl-title">
      <h3 class="flex flex-item-center">
        <span>{{ typeCtrl.cat }}</span>
        <a @click="typeCtrl.open = !typeCtrl.open" class="pointer block">
          <i class="flex flex-item-center fillHeight">
            选择分类
            <em></em>
          </i>
        </a>
      </h3>
    </div>
    <!-- order card -->
    <div v-show="typeCtrl.open" class="cateListBox absolute">
      <div class="hd">
        <i></i>
      </div>
      <div class="bd">
        <h3 class="pointer">
          <router-link to="?cat=全部" @click="getPlayList('全部'); typeCtrl.close()" class="block text-decoration-none">
            <em>全部风格</em>
          </router-link>
        </h3>
        <dl v-for="(cat, index) in catList.categorieArr" class="f-cb flex flex-warp" :key="cat">
          <dt>
            <i :class="'u-ic' + (index + 1)"></i>
            <em>{{ cat }}</em>
          </dt>
          <dd>
            <div v-for="item in catList.sub.filter(i => i.category === index)" :key="item.name">
              <router-link :to="'?cat=' + item.name" @click="getPlayList(item.name); typeCtrl.close()"
                class="text-decoration-none">{{ item.name }}</router-link>
              <span>|</span>
            </div>
          </dd>
        </dl>
      </div>
      <div class="ft"></div>
    </div>
    <!-- body -->
    <ul class="m-cvrlist flex flex-warp">
      <li v-for="album in  typeCtrl.data" :key="album.id">
        <div class="relative cover">
          <img :src="album.coverImgUrl + '?param=140y140'" loading="lazy" class="fillWidth fillHeight" />
          <a class="msk absolute fillWidth fillHeight"></a>
          <div class="bottom absolute fillWidth">
            <a class="absolute icon-ply pointer"></a>
            <span class="icon-headset"></span>
            <span class="nb">{{ fixsubscribedCount(album.subscribedCount) }}2896万</span>
          </div>
        </div>
        <p class="dec txt">
          <a class="pointer">{{ album.name }}</a>
        </p>
        <p class="auth">
          <span class="s-fc">by</span>
          <a class="nm txt pointer">{{ album.creator.nickname }}</a>
          <img :src="authorIcon(album.creator.userType, album.creator.vipType)" width="13" height="13" loading="lazy" />
        </p>
      </li>
    </ul>
    <!-- page turn machine -->
    <div class="page-turning fillWidth flex flex-item-center">
      <a @click="typeCtrl.turn(-1)" class="prev">上一页</a>
      <a @click="typeCtrl.turn(1)" class="page" :class="{ active: typeCtrl.active == 1 }">1</a>
      <span v-if="typeCtrl.active > 5">...</span>

      <a v-for="item in typeCtrl.arr" @click="typeCtrl.turn(item)" class="page"
        :class="{ active: typeCtrl.active == item }" :key="'pt_' + item">{{ item }}</a>

      <span v-if="typeCtrl.active < typeCtrl.total - 4">...</span>
      <a @click="typeCtrl.turn(typeCtrl.total)" class="page" :class="{ active: typeCtrl.active == typeCtrl.total }">{{
          typeCtrl.total
      }}</a>
      <a @click="typeCtrl.turn(0)" class="next">下一页</a>
    </div>
  </div>
</template>


<script setup lang="ts">
import useGlobalProperties from '../../../hooks/useGlobalProperties'
import useCurrentInstance from '../../../hooks/useCurrentInstance'
import { reactive } from 'vue'
const Axios = useGlobalProperties('Axios')

const $route = useCurrentInstance()?.$route

interface CatData {
  sub: Array<{
    name: string
    category: number
  }>
  categories: {
    "0": string
    "1": string
    "2": string
    "3": string
    "4": string
  }
  categorieArr: Array<string>
}
let catList = reactive({} as CatData)
catList.categorieArr = []
Axios.get('/playlist/catlist').then((data: CatData) => {
  catList.sub = data.sub
  catList.categories = data.categories
  for (let i in catList.categories) {
    // @ts-ignore
    const item = catList.categories[i]
    catList.categorieArr.push(item)
  }
}).catch((reson: string) => {
  throw reson
})

interface PList {
  id: number
  name: string
  coverImgUrl: string
  description: string
  subscribedCount: number
  specialType: number
  creator: {
    userId: number
    defaultAvatar: boolean
    avatarUrl: string
    nickname: string
    vipType: number
    userType: number
  }
}
interface PLData {
  playlists: Array<PList>
  total: number
}
let typeCtrl = reactive({
  open: false,
  cat: '全部',
  data: [],
  total: 0,
  active: 1,
  arr: [2, 3, 4, 5, 6, 7, 8],
  turn(index: number) {
    index == 0
      ? typeCtrl.active++
      : index == -1 ? typeCtrl.active-- : typeCtrl.active = index
    if (typeCtrl.active > 5 && typeCtrl.active < typeCtrl.total - 4) {
      typeCtrl.arr = []
      for (let i = typeCtrl.active - 3; i <= typeCtrl.active + 3; i++) {
        typeCtrl.arr.push(i)
      }
    } else if (typeCtrl.active <= 5) {
      typeCtrl.arr = [2, 3, 4, 5, 6, 7, 8]
    } else {
      typeCtrl.arr = []
      for (let i = typeCtrl.total - 7; i < typeCtrl.total; i++) {
        typeCtrl.arr.push(i)
      }
    }
    getPlayList(typeCtrl.cat)
  },
  close() {
    typeCtrl.open = false
  }
} as {
  open: boolean
  cat: string
  data: Array<PList>
  total: number
  active: number
  arr: Array<number>
  turn: Function
  close: Function
})

typeCtrl.cat = $route?.query.cat ? $route?.query.cat as string : '全部'

const getPlayList = (cat: string) => {
  if (cat !== typeCtrl.cat) { typeCtrl.cat = cat }
  const url = `/top/playlist?limit=35&cat=${cat}&offset=${(typeCtrl.active - 1) * 35}`
  Axios.get(url).then((data: PLData) => {
    typeCtrl.data = data.playlists
    typeCtrl.total = Math.ceil(data.total / 35)
  }).catch((reson: string) => {
    throw reson
  })
}
getPlayList(typeCtrl.cat)
const fixsubscribedCount = (count: number): number | string => {
  const base = 100000
  return count > base ? Math.ceil(count * 10 / base) + '万' : count
}
const authorIcon = (u: number, v: number) => {
  let type = {
    musician: 'musician.png',
    talent: 'talent.png',
    certifaction: 'bigv.png'
  }
  if (u == 4) return require('../../../assets/img/' + type.musician)
  if (u == 200) return require('../../../assets/img/' + type.talent)
  if (v == 11) return require('../../../assets/img/' + type.certifaction)
  return ''
}
</script>

<style lang="less">
/* head */
.pl-con {
  padding: 40px;
  width: 980px;
  height: auto;
  margin: 0 auto;

  .pl-title {
    height: 40px;
    border-bottom: 2px solid #c20c0c;
  }
}

.pl-title {
  h3 {
    span {
      height: 40px;
      font: normal normal normal 24px/40px "Microsoft Yahei", Arial, Helvetica,
        sans-serif;
    }

    a {
      width: 91px;
      height: 31px;
      padding: 0 5px 0 0;
      margin: 5px 0 auto 12px;
      background: url("../../../assets/img/button2.png") no-repeat right -100px;

      i {
        color: #0c73c2;
        padding: 0 10px 0 15px;
        font: normal normal normal 12px/31px "Microsoft Yahei", Arial, Helvetica,
          sans-serif;
        background: url("../../../assets/img/button2.png") no-repeat 0 -59px;

        em {
          display: block;
          width: 8px;
          height: 5px;
          margin-left: 5px;
          background: url("../../../assets/img/icon.png") no-repeat -70px -543px;
        }
      }
    }
  }
}



.cateListBox {
  left: 0;
  top: 75px;
  width: 720px;
  height: 413px;
  z-index: 10;

  .hd {
    // height: 32px;
    // background: url("../../../assets/img/sltlyr.png") no-repeat;
    width: 700px;
    padding: 0 10px 10px 10px;
    background: url("../../../assets/img/sltlyr.png") repeat-y -720px 0;

    i {
      position: absolute;
      top: 2px;
      left: 132px;
      width: 24px;
      height: 11px;
      display: inline-block;
      background: url("../../../assets/img/iconall.png") no-repeat -48px 0;
    }

    h3 {
      height: 37px;
      padding-left: 26px;
      border-bottom: 1px solid #e6e6e6;
      font-weight: normal;

      a {
        width: 75px;
        height: 26px;
        text-align: center;
        background: url("../../../assets/img/button.png") no-repeat 0 -64px;

        em {
          font: normal normal normal 12px/26px Arial, Helvetica, sans-serif;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .ft {
    height: 20px;
    background: url("../../../assets/img/sltlyr.png") no-repeat -1440px -12px;
  }
}






/* body */
.m-cvrlist {
  padding: 0;
  height: auto;
  justify-content: space-between;
  margin: 30px 0 0 -50px;

  li {
    list-style: none;
    display: block;
    margin: 0;
    width: 140px;
    height: 188px;
    overflow: hidden;
    padding: 0 0 30px 50px;
  }

  .cover {
    width: 140px;
    height: 140px;
  }

  .msk {
    top: 0;
    left: 0;
    background: url("../../../assets/img/coverall.png") no-repeat 0 0;
  }

  .bottom {
    left: 0;
    bottom: 0;
    height: 27px;
    background: url("../../../assets/img/coverall.png") no-repeat 0 -537px;

    .icon-ply {
      right: 10px;
      bottom: 5px;
      width: 16px;
      height: 17px;
      background: url("../../../assets/img/iconall.png") no-repeat 0 0;

      &:hover {
        background-position: 0 -60px;
      }
    }

    .icon-headset {
      width: 14px;
      height: 11px;
      margin: 9px 5px 9px 10px;
      background: url("../../../assets/img/iconall.png") no-repeat 0 -24px;
    }

    .nb {
      color: #ccc;
      margin: 7px 0 0 0;
    }
  }
}



.m-cvrlist {
  .dec {
    height: 20px;
    margin: 8px 0 3px;
    font-size: 14px;
    line-height: 20px;

    a:hover {
      text-decoration: underline;
    }
  }

  .txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
  }
}


.auth {
  height: 18px;
  line-height: 18px;
  align-items: center;

  .s-fc {
    color: #999;
  }

  .nm {
    color: #666;
    max-width: 76%;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    margin-left: 3px;
  }

}



/* page turn machine */
.f-cb {
  padding: 0;
  margin: 0;

  dt {
    display: flex;
    width: 70px;
    margin: 0 -100px 0 26px;
    border-right: 1px solid #e6e6e6;
  }

  i {
    display: block;
    margin-top: 8px;
    width: 23px;
    height: 23px;
    background: url("../../../assets/img/icon.png") no-repeat;
  }

  .u-ic1 {
    background-position: -20px -735px;
  }

  .u-ic3 {
    background-position: 0px -88px;
  }

  .u-ic2 {
    background-position: 0px -60px;
  }

  .u-ic4 {
    background-position: 0px -117px;
  }

  .u-ic5 {
    background-position: 0px -141px;
  }

  em {
    height: 40px;
    margin-left: 10px;
    font: normal normal bold 12px/40px Arial, Helvetica, sans-serif;
  }

  dd {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 115px);
    margin: 8px 0 0 115px;
    line-height: 24px;

    a {
      color: #333;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    span {
      margin: 0 10px;
      color: #e6e6e6;
    }

  }

}

.page-turning {
  height: 26px;
  margin-top: 10px;
  justify-content: center;

  a {
    display: block;
    margin: 0 2px;
    cursor: pointer;
    line-height: 24px;
    border-radius: 2px;
    border: 1px solid #ccc;
  }

  .prev {
    width: 57px;
    height: 24px;
    padding-right: 10px;
    text-align: right;
    background: url("../../../assets/img/button.png") no-repeat 0 -560px;
  }

  .next {
    width: 57px;
    height: 24px;
    padding-left: 10px;
    text-align: left;
    background: url("../../../assets/img/button.png") no-repeat -75px -560px;
  }

  .page {
    height: 22px;
    padding: 0 8px;
  }

}

.active {
  color: #fff;
  background: #c20c0c;
}
</style>