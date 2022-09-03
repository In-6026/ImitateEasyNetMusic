
<script setup lang="ts">
import useCurrentInstance from '@/hooks/useCurrentInstance'

import { reactive, } from 'vue'

const $route = useCurrentInstance()?.$route
const $router = useCurrentInstance()?.$router
let categoryCtrl = reactive({
  cats: [
    { name: '华语', area: 7, ids: [1001, 1002, 1003] },
    { name: '欧美', area: 96, ids: [2001, 2002, 2003] },
    { name: '日本', area: 8, ids: [3001, 3002, 3003] },
    { name: '韩国', area: 16, ids: [4001, 4002, 4003] },
    { name: '其它', area: 0, ids: [5001, 5002, 5003] },
  ],
  active: 1,
  turn(index: number) {
    categoryCtrl.active = index
  },
  initActive(route: any) {
    const match = route?.matched[3]?.path.split('/').at(-1)
    if (match && match === 'signed') {
      categoryCtrl.turn(2)
      return
    } else if (match && match === 'category') {
      categoryCtrl.turn(
        ~~(route?.query.id as string)
      )
      return
    }
    categoryCtrl.turn(1)
  }
})
categoryCtrl.initActive($route)
$router?.afterEach((to) => {
  categoryCtrl.initActive(to)
})
</script>
<template>
  <div class="art-con flex">
    <div class="left-side">
      <div class="left-warp">
        <h2>推荐</h2>
        <ul class="flex flex-warp">
          <li>
            <router-link to="/discover/artist" @click="categoryCtrl.turn(1)"
              :class="{ active: categoryCtrl.active == 1 }">推荐歌手</router-link>
          </li>
          <li>
            <router-link to="/discover/artist/signed" @click="categoryCtrl.turn(2)"
              :class="{ active: categoryCtrl.active == 2 }">入驻歌手</router-link>
          </li>
        </ul>
        <div v-for="cat in categoryCtrl.cats" class="blk" :key="cat.name">
          <h2>{{ cat.name }}</h2>
          <ul class="flex flex-warp">
            <li>
              <router-link @click="categoryCtrl.turn(cat.ids[0])" :class="{ active: categoryCtrl.active == cat.ids[0] }"
                :to="'/discover/artist/category?id=' + cat.ids[0] + '&type=1&area=' + cat.area">{{ cat.name }}男歌手
              </router-link>
            </li>
            <li>
              <router-link @click="categoryCtrl.turn(cat.ids[1])" :class="{ active: categoryCtrl.active == cat.ids[1] }"
                :to="'/discover/artist/category?id=' + cat.ids[1] + '&type=2&area=' + cat.area">{{ cat.name }}女歌手
              </router-link>
            </li>
            <li>
              <router-link @click="categoryCtrl.turn(cat.ids[2])" :class="{ active: categoryCtrl.active == cat.ids[2] }"
                :to="'/discover/artist/category?id=' + cat.ids[2] + '&type=3&area=' + cat.area">{{ cat.name }}组合/乐队
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="right-side">
      <div class="left-warp fillWidth">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@img: "../../../assets/img/";

#group() {
  h2 {
    height: 25px;
    padding-left: 14px;
    font: normal normal normal 16px/25px "Microsoft Yahei";
  }

  ul {
    margin: 0;
    padding: 0;

    li {
      margin-bottom: 2px;
      width: 160px;
      height: 29px;
      line-height: 29px;
      list-style: none;

      a {
        display: block;
        color: #333;
        height: 29px;
        padding-left: 27px;
        text-decoration: none;
        background: url("@{img}singer.png") no-repeat 0 -30px;

        &:hover {
          text-decoration: underline;
        }
      }

      .active {
        color: #c20c0c;
        background-position: 0 0;
      }
    }
  }
}

.art-con {
  width: 980px;
  margin: 0 auto;
  min-height: 700px;
  border-left: 1px solid #d3d3d3;
  border-right: 1px solid #d3d3d3;
  background: url("@{img}wrap2.png") repeat-y center 0;

  .left-side {
    width: 180px;

    .left-warp {
      padding: 0 10px 40px;
      margin-top: 51px;
      #group();
    }
  }

  .right-side {
    width: 799px;
    padding: 40px;

    .left-warp {
      width: 719px;
      margin: 0 auto;
      min-height: 700px;
    }
  }
}

.blk {
  margin: 5px 0 0;
  padding-top: 16px;
  border-top: 1px solid #d3d3d3;
  #group();
}
</style>