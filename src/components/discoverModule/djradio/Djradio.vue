
<script setup lang="ts">
import useGlobalProperties from '@/hooks/useGlobalProperties'
import { reactive } from 'vue'
const Axios = useGlobalProperties('Axios')
// 电台种类
interface Cate {
  id: number
  name: string
  picWebUrl: string
}
interface Catelist {
  categories: Array<Cate>
}
let radioCategories = reactive({
  data: []
} as {
  data: Array<Cate>
})
Axios.get('/dj/catelist').then((data: Catelist) => {
  radioCategories.data = data.categories
}).catch((reson: string) => {
  throw reson
})
// 推荐节目
interface Programs {
  mainSong: {
    id: number
    name: string
  }
  radio: {
    id: number
    name: string
    category: string
    lastProgramId: number
  }
  coverUrl: string
}
interface RadioProgram {
  programs: Array<Programs>
}
let radioProgram = reactive({
  data: [],
  hover: -1,
  enter(index: number) {
    radioProgram.hover = index
  },
  leave() {
    radioProgram.hover = -1
  }
} as {
  data: Array<Programs>
  hover: number
  enter: Function
  leave: Function
})
Axios.get('/program/recommend').then((data: RadioProgram) => {
  radioProgram.data = data.programs
}).catch((reson: string) => {
  throw reson
})
// 节目排行榜
interface RankList {
  program: Programs
}
let programRank = reactive({
  data: [],
  hover: -1,
  enter(index: number) {
    programRank.hover = index
  },
  leave() {
    programRank.hover = -1
  }
} as {
  data: Array<RankList>
  hover: number
  enter: Function
  leave: Function
})
Axios.get('/dj/program/toplist?limit=10').then((data: { toplist: Array<RankList> }) => {
  programRank.data = data.toplist
}).catch((reson: string) => {
  throw reson
})
// 下五栏：音乐推荐...
interface DJradio {
  id: number
  name: string
  picUrl: string
  rcmdtext: string
}
interface DJradiolist {
  djRadios: Array<DJradio>
}
let djRadios = reactive({
  type: [2, 6, 3, 2001, 11],
  name: ['音乐推荐', '生活', '感情', '翻唱', '知识'],
  data: []
} as {
  type: Array<number>
  name: Array<string>
  data: Array<DJradio[]>
})
const getRadioList = (type: number) => {
  Axios.get('/dj/recommend/type?type=' + type).then((data: DJradiolist) => {
    let dj = data.djRadios.slice(0, 4)
    djRadios.data.push(dj)
  }).catch((reson: string) => {
    throw reson
  })
}
djRadios.type.forEach((type: number) => {
  getRadioList(type)
})
</script>
<template>
  <div class="con">
    <!-- 分类 -->
    <div class="radio-box relative">
      <ul class="radio-ul fillHeight flex flex-warp">
        <li v-for="catCov in radioCategories.data" :key="catCov.id">
          <router-link :to="'?id=' + catCov.id" class="fillHeight fillWidth text-decoration-none">
            <div class="catCover"
              :style="'background: url(' + catCov.picWebUrl + ') no-repeat; background-position: 0 0;'"></div>
            <p class="cat-name">{{ catCov.name }}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 两栏 -->
    <div class="raditop flex">
      <div class="blk">
        <div class="u-titl">
          <h3>
            <router-link to="/discover/djradio/recommend" class="til-txt text-decoration-none">推荐节目</router-link>
          </h3>
          <router-link to="/discover/djradio/recommend" class="more text-decoration-none">更多 ></router-link>
        </div>
        <ul class="r-playlist">
          <li v-for="(program, index) in radioProgram.data" class="fillWidth flex flex-item-center pointer"
            :class="{ backg: index % 2 == 0 }" @mouseover="radioProgram.enter(index)" @mouseleave="radioProgram.leave()"
            :key="program.mainSong.id">
            <a class="r-pl-cover relative pointer">
              <img :src="program.coverUrl + '?param=40y40'" class="absolute" width="40" height="40" loading="lazy" />
              <i v-show="index == radioProgram.hover" class="icon"></i>
            </a>
            <div class="cnt">
              <h3 class="f-thide">
                <router-link :to="'/program?id=' + program.mainSong.id" class="program text-decoration-none">{{
                    program.mainSong.name
                }}</router-link>
              </h3>
              <p>
                <router-link :to="'/djradio?id=' + program.radio.lastProgramId" class="detail text-decoration-none">{{
                    program.radio.name
                }}</router-link>
              </p>
            </div>
            <router-link :to="'/discover/djradio/category?id=' + program.radio.id" class="tag">{{ program.radio.category
            }}</router-link>
          </li>
        </ul>
      </div>
      <div class="blk">
        <div class="u-titl">
          <h3>
            <router-link to="/discover/djradio/rank" class="til-txt text-decoration-none">节目排行榜</router-link>
          </h3>
          <router-link to="/discover/djradio/rank" class="more text-decoration-none">更多 ></router-link>
        </div>
        <ul class="r-playlist">
          <li v-for="(program, index) in programRank.data" class="fillWidth flex flex-item-center pointer"
            :class="{ backg: index % 2 == 0 }" @mouseover="programRank.enter(index)" @mouseleave="programRank.leave()"
            :key="program.program.mainSong.id">
            <a class="r-pl-cover relative pointer">
              <img :src="program.program.coverUrl + '?param=40y40'" class="absolute" width="40" height="40" />
              <i v-show="index == programRank.hover" class="icon"></i>
            </a>
            <div class="cnt">
              <h3 class="f-thide">
                <router-link :to="'/program?id=' + program.program.radio.lastProgramId"
                  class="program text-decoration-none">{{ program.program.mainSong.name }}</router-link>
              </h3>
              <p>
                <router-link :to="'?id=' + program.program.radio.id" class="detail text-decoration-none">{{
                    program.program.radio.name
                }}</router-link>
              </p>
            </div>
            <router-link :to="'/discover/djradio/category?id=' + program.program.radio.id" class="tag">{{
                program.program.radio.category
            }}</router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- 下五栏 -->
    <div v-for="(radio, index) in djRadios.name" class="radimore" :key="radio">
      <div class="u-titl">
        <h3>
          <span>
            <router-link :to="'djradio/categroy?id=' + djRadios.type[index]" class="text-decoration-none til-txt">{{
                radio
            }}</router-link>.&nbsp;电台
          </span>
        </h3>
        <router-link :to="'/categroy?id=' + djRadios.type[index]" class="more text-decoration-none">更多 ></router-link>
      </div>
      <ul class="rdilist flex flex-warp">
        <li v-for="item in djRadios.data[index]" class="flex" :key="item.id">
          <router-link :to="'?id=' + item.id" class="cvr">
            <img :src="item.picUrl + '?param=120y120'" width="120" height="120" loading="lazy" />
          </router-link>
          <div class="txt">
            <h3>
              <router-link :to="'?id=' + item.id" class="text-decoration-none til-txt">{{ item.name }}</router-link>
            </h3>
            <p>{{ item.rcmdtext }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <router-view></router-view>
</template>
<style scoped>
.con {
  padding: 40px;
  margin: 0 auto;
  width: 900px;
}

/* 头部 */
.radio-box {
  height: 194px;
  margin-bottom: 20px;
}

.radio-ul {
  justify-content: space-between;
}

.radio-ul li {
  width: 70px;
  height: 72px;
  list-style: none;
  margin: 0 15px;
}

.radio-ul li:hover {
  border-radius: 3px;
  background: #eee;
}

.catCover {
  width: 48px;
  height: 48px;
  margin: 0 auto;
}

.cat-name {
  color: #666;
  text-align: center;
}

/* 两栏 */
.raditop {
  margin-top: 10px;
  justify-content: space-between;
}

.blk {
  width: 426px;
  height: 643px;
}

.u-titl {
  height: 40px;
  border-bottom: 2px solid #c20c0c;
}

.u-titl h3 {
  float: left;
  font-size: 24px;
  font-weight: normal;
}

.u-titl .more {
  float: right;
  margin-top: 14px;
}

.u-titl h3 .til-txt {
  color: #000;
}

.u-titl .more {
  color: #666;
}

.u-titl .more::after {
  clear: both;
}

.r-playlist {
  height: 600px;
  border: 1px solid #e2e2e2;
  border-top: none;
}

.r-playlist li {
  list-style: none;
  height: 40px;
  padding: 10px 0;
  line-height: 40px;
}

.r-playlist .backg {
  background: #f5f5f5;
}

.r-playlist li:hover {
  background: #eee;
}

.r-playlist .tag {
  margin-left: 10px;
  height: 18px;
  padding: 0 6px;
  color: #999;
  border: 1px solid #999;
  font-size: 12px;
  line-height: 18px;
  text-decoration: none;
}

.r-playlist .tag:hover {
  color: #666;
  border: 1px solid #666;
}

.r-playlist li .r-pl-cover {
  position: absolute;
  width: 40px;
  height: 40px;
  margin-left: 20px;
}

.r-playlist li .r-pl-cover .icon {
  position: absolute;
  margin: 9px;
  width: 22px;
  height: 22px;
  background: url("../../../assets/img/iconall.png") no-repeat 0 -85px;
}

.r-playlist li .cnt {
  width: 254px;
  margin: 1px 0 0 70px;
  line-height: 20px;
}

.r-playlist li .cnt h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}

.r-playlist li .cnt h3 .program {
  color: #333;
}

.r-playlist li .cnt .detail {
  color: #999;
}

.radimore {
  margin-top: 35px;
}

.rdilist {
  justify-content: space-between;
}

.rdilist li {
  width: 435px;
  height: 120px;
  padding: 20px 0;
  list-style: none;
}

.rdilist li:nth-child(1),
.rdilist li:nth-child(2) {
  border-bottom: 1px solid #e7e7e7;
}

.rdilist li .cvr {
  /* margin-right: -200px; */
  width: 120px;
  height: 120px;
}

.rdilist li .txt {
  width: 295px;
  height: 64px;
  margin-left: 20px;
}

.rdilist li .txt h3 {
  margin: 16px 0 20px;
  font-size: 18px;
}

.rdilist li .txt h3 .til-txt {
  color: #000;
}

.rdilist li .txt p {
  margin-bottom: 6px;
  line-height: 20px;
  color: #999;
}
</style>