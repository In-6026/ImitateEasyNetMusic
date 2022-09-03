
<template>
  <div class="l-con">
    <div class="recommend m-width">
      <div class="head flex relative">
        <a href="/discover/playlist" class="nav-to-playlist pointer">热门推荐</a>
        <div class="tab">
          <router-link to="/discover/playlist?cat=华语">华语</router-link>
          <span>|</span>
          <router-link to="/discover/playlist?cat=流行">流行</router-link>
          <span>|</span>
          <router-link to="/discover/playlist?cat=摇滚">摇滚</router-link>
          <span>|</span>
          <router-link to="/discover/playlist?cat=民谣">民谣</router-link>
          <span>|</span>
          <router-link to="/discover/playlist?cat=电子">电子</router-link>
        </div>
        <span class="more absolute">
          <router-link to="/discover/playlist/">更多</router-link>
          <i>&nbsp;</i>
        </span>
      </div>
      <ul class="recommend-daily-con fillWidth flex flex-warp">
        <li v-for="item in recommendDaily" :key="item.id">
          <div class="recommend-con relative">
            <img :src="item.picUrl + '?param=140y140'" class="fillWidth fillHeight" :alt="item.name" />
            <router-link :to="'/playlist?id=' + item.id" class="rec-link absolute fillWidth fillHeight"
              :title="item.name"></router-link>
            <div class="fillWidth rec-bottom absolute flex">
              <a @click="playHotRecAll(item)" class="rec-botm-play-all pointer absolute"></a>
              <i class="rec-botm-type-icon"></i>
              <span class="rec-botm-play-count">{{ playCount(item.playCount) }}</span>
            </div>
          </div>
          <router-link :to="'/playlist?id=' + item.id" class="rec-textinfo fillWidth">{{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="new-public m-width">
      <div class="head flex relative">
        <router-link to="/discover/album" class="nav-to-playlist pointer">新碟上架</router-link>
        <span class="more absolute">
          <router-link to="/discover/album/">更多</router-link>
          <i>&nbsp;</i>
        </span>
      </div>
      <div class="n-disk relative flex fillWidth">
        <a @click="leftRoll()" class="last absolute icon-hw"></a>
        <div class="roll relative flex">
          <ul class="absolute flex" :class="{ hiden: roll.center }">
            <li v-for="(item, index) in newestAlbumEP" :key="item.id">
              <div @mouseover="IconHover = index" @mouseleave="IconHover = -1" class="na-con relative">
                <img :src="item.picUrl + '?param=100y100'" class="fillWidth fillHeight" />
                <router-link :to="'/album?id=' + item.id" class="mask absolute fillWidth fillHeight">
                </router-link>
                <a @click="playAlbum(item)" class="icon-play absolute pointer" v-show="index == IconHover"></a>
              </div>
              <p class="f-third">
                <router-link :to="'/album?id=' + item.id" class="aut">{{ item.name }}</router-link>
              </p>
              <p class="f-third">
                <a class="art">{{ item.artist.name }}</a>
              </p>
            </li>
          </ul>
          <ul class="absolute flex" :class="{ hiden: !roll.center }">
            <li v-for="(item, index) in newestAlbumLP" :key="item.id">
              <div @mouseover="IconHover = index" @mouseleave="IconHover = -1" class="na-con relative">
                <img :src="item.picUrl + '?param=100y100'" class="fillWidth fillHeight" />
                <router-link :to="'/album?id=' + item.id" class="mask absolute fillWidth fillHeight">
                </router-link>
                <a @click="playAlbum(item)" class="icon-play absolute pointer" v-show="index == IconHover"></a>
              </div>
              <p class="f-third">
                <router-link :to="'/album?id=' + item.id" class="aut">{{ item.name }}</router-link>
              </p>
              <p class="f-third">
                <a class="art">{{ item.artist.name }}</a>
              </p>
            </li>
          </ul>
        </div>
        <a @click="rightRoll()" class="next absolute icon-hw"></a>
      </div>
    </div>
    <div class="rank m-width">
      <div class="head flex relative">
        <router-link to="/discover/toplist" class="nav-to-playlist pointer">榜单</router-link>
        <span class="more absolute">
          <router-link to="/discover/toplist">更多</router-link>
          <i>&nbsp;</i>
        </span>
      </div>
      <div class="rank-con flex">
        <dl v-for="(rankInfo, rankIndex) in rank.songs" class="fillHeight" :key="rank.id[rankIndex]">
          <dt class="top flex">
            <div class="cover relative">
              <img :src="rank.picUrl[rankIndex] + '?param=80y80'" class="fillWidth fillHeight relative" />
              <router-link :to="'/discover/toplist?id=' + rank.id[rankIndex]" class="absolute fillWidth fillHeight"
                :title="rank.name[rankIndex]"></router-link>
            </div>
            <div class="title">
              <router-link :to="'/discover/toplist?id=' + rank.id[rankIndex]">
                <h3 class="pointer">{{ rank.name[rankIndex] }}</h3>
              </router-link>
              <div class="icons flex">
                <a @click="multiple.play(rankInfo)" title="播放"></a>
                <a title="收藏"></a>
              </div>
            </div>
          </dt>
          <dd>
            <ol>
              <li @mouseover="rank.iconCtrl[rankIndex] = songIndex" @mouseleave="rank.iconCtrl[rankIndex] = -1"
                v-for="(songInfo, songIndex) in rankInfo.songs" :key="songInfo.id" class="flex flex-item-center">
                <span class="r-m-index fillHeight" :class="{ RMIndexTop3: songIndex < 3 }">{{ songIndex
                    + 1
                }}</span>
                <p class="r-m-name pointer fillHeight"
                  :class="{ startW: !((rank.iconCtrl[rankIndex] === songIndex)), hoverW: rank.iconCtrl[rankIndex] === songIndex }">
                  {{ songInfo.name }}</p>
                <div class="r-m-icons flex flex-item-center" v-show="rank.iconCtrl[rankIndex] === songIndex">
                  <a @click="single.play(songInfo)"></a>
                  <a @click="single.push(songInfo)"></a>
                  <a></a>
                </div>
              </li>
            </ol>
            <div class="r-more">
              <router-link :to="'/discover/toplist?id=' + rank.id[rankIndex]" class="pointer">查看更多>
              </router-link>
              <div style="clear: both;"></div>
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useGlobalProperties from '../../../hooks/useGlobalProperties'
import { reactive, ref } from 'vue'
import Song from '../../../publicInterface/Song'
import Songs from '../../../publicInterface/Songs'
const Axios = useGlobalProperties("Axios")
const mitter = useGlobalProperties('mitter')

//热门推荐歌单
interface SingleInfo {
  id: string
  type: number
  name: string
  picUrl: string
  playCount: number
  trackCount: number
}
interface RecommenData {
  result: Array<SingleInfo>
}
let recommendDaily = ref()
Axios.get("/personalized?limit=8").then((data: RecommenData): void => {
  recommendDaily.value = data.result
}).catch((reson: string) => {
  throw `获取热门推荐失败: ${reson}`
})
const playCount = (count: number): string => {
  return count > 100000 ? (count / 10000).toFixed(0) + '万' : count + ''
}
interface AlbumArtist {
  id: string
  name: string
}
interface NewestAlbumInfo {
  id: string
  name: string
  picUrl: string
  artist: Array<AlbumArtist>
}
interface NewestAlbums {
  albums: Array<NewestAlbumInfo>
}
let newestAlbumEP = ref()
let newestAlbumLP = ref()
Axios.get("/album/newest").then((data: NewestAlbums): void => {
  newestAlbumEP.value = data.albums.slice(0, 5)
  newestAlbumLP.value = data.albums.slice(5, 10)
}).catch((reson: string) => {
  throw reson
})
let IconHover = ref(-1)
let roll = reactive({
  center: true
})
let leftRoll = () => {
  roll.center = !roll.center
}
let rightRoll = () => {
  roll.center = !roll.center
}
//榜单
interface Rank {
  id: Array<string>
  iconCtrl: Array<number>
  name: Array<string>
  picUrl: Array<string>
  songs: Array<Songs>
}
const rank = reactive({
  id: ['19723756', '3779629', '2884035'],
  iconCtrl: [-1, -1, -1],
  name: ['飙升榜', '新歌榜', '原创榜'],
  picUrl: ['https://p4.music.126.net/pcYHpMkdC69VVvWiynNklA==/109951166952713766.jpg'
    , 'https://p2.music.126.net/wVmyNS6b_0Nn-y6AX8UbpQ==/109951166952686384.jpg'
    , 'https://p2.music.126.net/iFZ_nw2V86IFk90dc50kdQ==/109951166961388699.jpg'],
  songs: []
} as Rank)
for (let id of rank.id) {
  Axios.get('/playlist/track/all?id=' + id + '&limit=10&offset=0').then((data: Songs): void => {
    rank.songs.push(data)
  }).catch((reson: string): void => {
    throw reson
  })
}
const playHotRecAll = (listInfo: Song) => {
  Axios.get('/playlist/track/all?id=' + listInfo.id + '&limit=10&offset=0').then((data: Songs) => {
    multiple.play(data)
  }).catch((reson: string) => {
    throw `获取《${listInfo.name}》失败：${reson}`
  })
}
const playAlbum = (album: NewestAlbumInfo) => {
  Axios.get('/album?id=' + album.id).then((data: Songs) => {
    multiple.play(data)
  }).catch((reson: string) => {
    throw `获取${album.name}失败: ${reson}`
  })
}
const single = reactive({
  play(song: Song) {
    mitter.emit('single-play', song)
  },
  push(song: Song) {
    mitter.emit('single-push', song)
  },
})
const multiple = reactive({
  play(list: Songs) {
    mitter.emit('multiple-play', list.songs)
  }
})

</script>

<style lang="less">
@img: "../../../assets/img/";

.l-con {
  width: 729px;
  height: auto;
  box-sizing: border-box;
  padding: 20px 20px 40px;
}

.m-width {
  width: 689px;
}

.recommend {
  height: 523px;
}

.head {
  height: 33px;
  padding: 0 10px 0 34px;
  border-bottom: 2px solid #c10d0c;
  background: url("@{img}index.png") no-repeat -225px -156px;

  .nav-to-playlist {
    text-decoration: none;
    color: #333;
    font: normal normal normal 20px/28px "Microsoft Yahei", Arial, Helvetica,
      sans-serif;
  }

  .tab {
    margin: 7px 0 0 20px;

    a {
      color: #666;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    span {
      color: #ccc;
      margin: 0 10px;
    }
  }

  .more {
    right: 0;
    margin-top: 9px;

    a {
      color: #666;
      font-size: 12px;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-left: 4px;
      vertical-align: middle;
      background: url("@{img}index.png") no-repeat 0 -240px;
    }
  }
}

.recommend-daily-con {
  margin: 20px 0 0 0px;
  justify-content: space-between;

  li {
    display: block;
    width: 140px;
    height: 204px;
    list-style: none;
    overflow: hidden;
  }
}

.recommend-con {
  width: 140px;
  height: 140px;

  .rec-link {
    top: 0;
    left: 0;
    background: url("@{img}coverall.png") no-repeat 0 0;
  }
}

.rec-bottom {
  left: 0;
  bottom: 0;
  height: 27px;
  background: url("@{img}coverall.png") no-repeat 0 -537px;
}

.rec-botm-play-all {
  display: block;
  width: 16px;
  height: 17px;
  top: 5px;
  right: 10px;
  background: url("@{img}iconall.png") no-repeat 0 0;

  &:hover {
    background-position: -20px -60px;
  }
}

.rec-botm-type-icon {
  display: block;
  width: 14px;
  height: 11px;
  background-position: 0 -24px;
  margin: 9px 5px 9px 10px;
  background: url("@{img}iconall.png") no-repeat 0 -24px;
}

.rec-botm-play-count {
  margin: 7px 0 0 0;
  color: #ccc;
}

.rec-textinfo {
  display: block;
  color: #000;
  text-decoration: none;
  margin: 8px 0 3px;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
}

.new-public {
  width: 689px;
  margin: 0 0 35px;
}

.n-disk {
  zoom: 1;
  width: 687px;
  height: 186px;
  padding-left: 16px;
  box-sizing: border-box;
  margin: 20px 0 37px;
  border: 1px solid #d3d3d3;
}

.icon-hw {
  top: 71px;
  width: 17px;
  height: 17px;
  cursor: pointer;
}

.last {
  left: 4px;
  background: url("@{img}index.png") no-repeat -260px -75px;

  &:hover {
    background-position: -280px -75px;
  }
}

.next {
  right: 4px;
  background: url("@{img}index.png") no-repeat -300px -75px;

  &:hover {
    background-position: -320px -75px;
  }
}

.roll {
  width: 687px;
  height: 180px;
  overflow: hidden;

  ul {
    top: 0px;
    margin: 28px 0 0 0;
    overflow: hidden;
    transition: all 0.3s;

    li {
      display: inline;
      width: 118px;
      height: 150px;
      list-style: none;
      margin-left: 11px;
      background: url("@{img}index.png") no-repeat -260px 100px;
    }
  }
}

.center {
  left: 0px;
  width: 645px;
}

.right {
  right: 0px;
  width: 0px;
}

.left {
  left: 0px;
  width: 0px;
}

.na-con {
  margin-bottom: 7px;
  width: 645px;
  width: 100px;
  height: 100px;
}

.mask {
  top: 0;
  left: 0;
  width: 118px;
  height: 100px;
  background: url("@{img}coverall.png") no-repeat 0px -570px;
}

.icon-play {
  right: 10px;
  bottom: 5px;
  width: 16px;
  height: 17px;
  background: url("@{img}iconall.png") no-repeat 0px -60px;
}

.icon-play:hover {
  background-position: -20px -60px;
}

.f-third {
  width: 90%;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;

  a {
    cursor: pointer;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .art {
    color: #666;
  }

  .aut {
    color: #000;
  }
}

.rank-con {
  height: 472px;
  margin-top: 20px;
  padding-left: 1px;
  background: url("@{img}index_bill.png") no-repeat 0 0;

  dl {
    flex: 1;
  }

  .top {
    height: 100px;
    padding: 8px 0 0 19px;

    .title {
      width: 116px;
      margin: 6px 0 0 10px;
    }
  }

  .cover {
    width: 80px;
    height: 80px;

    a {
      top: 0;
      left: 0;
      background: url("@{img}coverall.png") no-repeat -145px -57px;
    }
  }
}

.top .title .icons {
  margin-top: 10px;
}

.top .title a {
  color: #000;
  text-decoration: none;
}

.top .title a:hover {
  text-decoration: underline;
}

.top .title .icons a {
  display: block;
  width: 22px;
  height: 22px;
  margin-right: 10px;
  cursor: pointer;
}

.top .title .icons a:nth-child(1) {
  background: url("@{img}index.png") no-repeat -267px -205px;
}

.top .title .icons a:nth-child(1):hover {
  background-position: -267px -235px;
}

.top .title .icons a:nth-child(2) {
  background: url("@{img}index.png") no-repeat -300px -205px;
}

.top .title .icons a:nth-child(2):hover {
  background-position: -300px -235px;
}

.rank-con ol {
  height: 319px;
  margin-left: 15px;
  line-height: 32px;
}

.rank-con ol li {
  height: 32px;
  list-style: none;
}

.r-m-index {
  width: 35px;
  margin-left: -35px;
  text-align: center;
  font-size: 16px;
}

.RMIndexTop3 {
  color: #c10d0c;
}

.r-m-name {
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  text-decoration: none;
  margin-right: 6px;
}

.startW {
  width: 170px;
}

.hoverW {
  width: 88px;
}

.r-m-icons {
  width: 82px;

  a {
    display: block;
    cursor: pointer;
    width: 17px;
    height: 17px;
    margin-right: 10px;

    &:nth-child(1) {
      background: url("@{img}index.png") no-repeat -267px -268px;

      &:hover {
        background-position: -267px -288px;
      }
    }

    &:nth-child(2) {
      width: 13px;
      height: 13px;
      background: url("@{img}icon.png") no-repeat 0px -700px;

      &:hover {
        background-position: -22px -700px;
      }
    }

    &:nth-child(3) {
      background: url("@{img}index.png") no-repeat -297px -268px;

      &:hover {
        background-position: -297px -288px;
      }
    }
  }
}

.r-more {
  height: 32px;
  margin-right: 32px;
  line-height: 32px;

  a {
    float: right;
    color: #000;
    height: 32px;
    line-height: 32px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>