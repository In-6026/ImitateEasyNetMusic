<template>
  <div class="player-case flex fillWidth" @mousemove.capture="dragProgressIcon($event)"
    @mouseleave="stopDragProgressIcon()" @mouseup="stopDragProgressIcon()" ref="player">
    <div class="playerconsole-warp flex">
      <!-- 左右暂停播放键 -->
      <div class="player-btn flex flex-item-center">
        <i @click="playLast()" class="previous smallPlayBtn"></i>
        <i @click="controlPlayback()" class="largePlayBtn"
          :class="{ play: Player.isPlaying(), pause: !Player.isPlaying() }"></i>
        <i @click="playNext()" class="next smallPlayBtn"></i>
      </div>
      <!-- 音乐封面 -->
      <div class="music-cover">
        <!-- <img src="../../assets/img/default_album.jpg" class="fillHeight fillWidth no-select" /> -->
        <img :src="store.state.Player.current.backgroundPic + '?param=34y34'" class="fillHeight fillWidth no-select" />
      </div>
      <!-- 音乐信息&进度条 -->
      <div class="progress-bar fillHeight">
        <div class="music-info flex">
          <a class="music-name no-select">{{ store.state.Player.current.name }}</a>
          <span class="musician-info no-select">
            <!-- 音乐人名压迫用/分割 -->
            <a v-for="(ar, i) in store.state.Player.current.author" :key="ar?.id">
              {{ ar?.name }}<em v-if="i < store.state.Player.current.author?.length - 1">/</em></a>
          </span>
          <a class="music-link"></a>
        </div>
        <!-- 进度条 -->
        <div class="process-info fillWidth flex relative noselect">
          <div @mousedown="changeProgressByClick($event)" class="process-line">
            <div class="process-ready fillHeight" :style="'width:' + processCtrl.preload + 'px;'">
              <div class="process-already fillHeight" :style="'width:' + processCtrl.alreadyPlay + 'px;'">
              </div>
            </div>
          </div>
          <span class="process-icon pointer noselect" @mousedown="startDragProgressIcon($event)"
            :style="'left:' + processCtrl.alreadyplayIcon + 'px;'"></span>
          <span class="process-duration">{{ formatAlreadyPlay() }}/{{ formatDuration() }}</span>
        </div>
      </div>
      <!-- 音乐画中画歌词&收藏&分享 -->
      <div class="music-btn-group flex">
        <a class="btn-group paint-lyrics-inPic"></a>
        <a class="btn-group collect-music"></a>
        <a class="btn-group share-music"></a>
      </div>
      <!-- 音量&循环播放&歌单 -->
      <div class="music-list-control flex">
        <!-- 音量条 -->
        <div @mousemove.capture="dragVolumeIcon($event)" @mouseup="stopDragVolume()" @mouseleave="stopDragVolume()"
          v-show="!hideVolumeKey" class="volume-case">
          <div class="volume-line" :style="'height:' + volumeCtrl.lineHeight + 'px;'"></div>
          <div @mousedown="startDragVolume($event)" class="volume-line-icon pointer"
            :style="'bottom:' + volumeCtrl.iconBottom + 'px;'"></div>
        </div>
        <a @click="ifHideVolumeLine()" class="volume-icon btn-group"></a>
        <a @click="changePlayMode()" class="btn-group"
          :class="{ cycle: ifPlayModeIs(0), singalCycle: ifPlayModeIs(1), shufflePlay: ifPlayModeIs(2) }"></a>
        <span @click="openClosePlayList()" class="music-list-panel relative btn-group">
          <a class="music-list-icon">{{ store.state.Player.list?.length }}</a>
        </span>
      </div>
    </div>
    <div class="player-control">
      <i @click="changePlayerClock()" class="pointer playerControl"
        :class="{ clock: playerClock, solveClock: !playerClock }"></i>
    </div>
  </div>
  <PlayListPanel v-show="ifClosePlayList" />
</template>
<script setup lang="ts">
import PlayListPanel from './PlayListPanel.vue'
import { onUnmounted, reactive, ref, } from 'vue'
import { useStore } from 'vuex'
import useGlobalProperties from '../../hooks/useGlobalProperties'
import Storage from '../../utils/Storage'
import Song from '../../publicInterface/Song'

const Axios = useGlobalProperties('Axios')
const Player = useGlobalProperties('Player')
const mitter = useGlobalProperties('mitter')
const store = useStore()

const formatAlreadyPlay = () => fixDuration(store.state.Player.current.offset * store.state.Player.current?.duration)
const formatDuration = () => fixDuration(store.state.Player.current?.duration)
const fixDuration = (time: number): string => {
  if (isNaN(time)) return '00:00'
  const T = Math.floor(time)
  const M = Math.floor(T / 60)
  const S = T % 60
  return M > 9
    ? S > 9 ? `${M}:${S}` : `${M}:0${S}`
    : S > 9 ? `0${M}:${S}` : `0${M}:0${S}`
}

store.commit('initPlaylist', Storage.get('playlist'))
const staticCurr = Storage.get('currentsong')

store.commit('setCurrentInfo', {
  id: staticCurr?.id || '',
  name: staticCurr?.name || '',
  backgroundPic: staticCurr?.backgroundPic ? staticCurr?.backgroundPic : require('../../assets/img/default_album.jpg'),
  author: staticCurr?.author || [],
  duration: staticCurr?.duration
})

const initSrc = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    Axios.get('/song/url?id=' + store.state.Player.current.id).then((data: {
      data: Array<{
        url: string
      }>
    }) => {
      store.commit('setCurrentInfo', {
        src: data.data[0].url
      })
      Player.setSrc(store.state.Player.current.src)
      getLyric().then((res: string) => {
        resolve(res + ' 播放器准备就绪~~')
      }).catch((reson: string) => {
        throw reson
      })
    }).catch((reson: string) => {
      reject('/song/url ' + reson)
    })
  })
}
const getLyric = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    Axios.get('/lyric?id=' + store.state.Player.current.id).then((data: {
      lrc: {
        lyric: string
      }
    }) => {
      let lrcArr = data.lrc.lyric.split('\n')
      lrcArr.pop()
      let lrcArr2 = lrcArr.map((lrc: string) => {
        const mat = lrc.match(/^\[([0-9:.].+?)\]/)
        if (!mat) return
        const t = mat[1].split(':')
        const time = parseFloat(t[0]) * 60 + parseFloat(t[1])
        const txt = lrc.replace(mat[0], '')
        return [time, txt]
      })
      store.commit('setCurrentInfo', {
        lyric: lrcArr2
      })
      resolve('获取歌词成功')
    }).catch((reson: string) => {
      reject('获取歌词失败')
      throw '获取歌词失败: ' + reson
    })
  })
}
initSrc().then((msg) => {
  console.log(msg)
}).catch((reson) => {
  throw reson
})

////播放详情表的开关
let ifClosePlayList = ref(false)
const openClosePlayList = () => {
  ifClosePlayList.value = !ifClosePlayList.value
}


//控制播放，由playbar中的播放按钮出发的播放
const controlPlayback = () => {
  if (Player.isPlaying()) {
    Player.pause()
    cancelAnimationFrame(drawID.value)
    mitter.emit('stopMovePlayProgress')
    return
  }
  playByClick()
}
//由playbar中的上一曲按钮出发的播放
const playLast = () => {
  store.commit('setLastCurrent')
  mitterCallPlay()
  store.commit('findCurrentIndex')
}
//由playbar中的下一曲按钮出发的播放
const playNext = () => {
  store.commit('setNextCurrent')
  mitterCallPlay()
  store.commit('findCurrentIndex')
}
//通过其他页面中的playicon触发的播放
const mitterCallPlay = () => {
  Player.destory().then(() => {
    return initSrc()
  }).then(() => {
    playByClick()
  })
}

mitter.on('single-play', (song: Song) => {
  playSingle(song)
})
mitter.on('single-push', (song: Song) => {
  pushSingle(song)
})
mitter.on('multiple-play', (list: Array<Song>) => {
  playMultiple(list)
})
//由播放列表板里点击等..导致播放
mitter.on('mitter-call-play', () => {
  mitterCallPlay()
})
function playSingle(song: Song) {
  store.commit('setCurrentInfo', {
    id: song.id,
    name: song.name,
    backgroundPic: song.al.picUrl,
    author: song.ar,
    offset: 0,
    duration: 0,
    loaded: 0,
  })
  mitterCallPlay()
  store.commit('findCurrentIndex')//每播放一首歌就要重置一次当前音乐在播放列表中的位置，为了播放下一首定位
  if (store.state.Player.index === -1) { //没有这首歌就添加
    pushSingle(song)
  }
}
function pushSingle(song: Song) {
  store.commit('pushToPlayList', {
    id: song.id,
    name: song.name,
    author: song.ar,
    duration: song.dt / 1000,
    backgroundPic: song.al.picUrl
  })
  Storage.set('playlist', store.state.Player.list)
  mitter.emit('resize-playlistpanel-thumb')
}
function playMultiple(list: Array<Song>) {
  const curr = list[0]
  store.commit('setCurrentInfo', {
    id: curr.id,
    name: curr.name,
    backgroundPic: curr.al.picUrl,
    author: curr.ar,
    offset: 0,
    duration: curr.dt / 1000,
    loaded: 0,
  })
  mitterCallPlay()
  const formatL = list.map(L => {
    return {
      id: L.id,
      name: L.name,
      author: L.ar,
      duration: L.dt / 1000,
      backgroundPic: L.al.picUrl,
    }
  })
  store.commit('initPlaylist', formatL)
  Storage.set('playlist', store.state.Player.list)
  mitter.emit('resize-playlistpanel-thumb')
}

let drawID = ref(0)
const mitterCallDraw = () => {
  store.commit('setDataArray', Player.getDataArray())
  mitter.emit('draw')
  drawID.value = requestAnimationFrame(mitterCallDraw)
}
const playByClick = () => {
  mitter.emit('startMovePlayProgress')//控制可视化页的进度条
  Player.play().then((audio: HTMLAudioElement) => {
    store.commit('setDataArray', Player.getDataArray())//初始化一下
    store.commit('findCurrentIndex')//每播放一首歌就要重置一次当前音乐在播放列表中的位置，为了播放下一首定位
    Storage.set('currentsong', store.state.Player.current)
    audio.addEventListener('timeupdate', () => {
      if (processCtrl.ifAllowDragProgressIcon) return //如果正在拖拽就暂时不按播放进度来控制进度条
      processCtrl.preload = Player.getPreload()//预加载进度
      store.commit('setCurrentInfo', {
        offset: Player.getOffset()
      })
      processCtrl.alreadyPlay = Player.getOffset() * 466
      processCtrl.alreadyplayIcon = processCtrl.alreadyPlay - 11
      mitterCallDraw()
    })
    audio.addEventListener('ended', () => {//播放完
      Player.destory().then(() => {
        store.commit('setNextCurrent')//下一首
        Storage.set('currentsong', store.state.Player.current)
        initSrc().then(() => {
          playByClick()
        })
      })
    })
  }).catch((reson: string) => {//当mp3过期时就会reject error
    console.error('mp3过期:' + reson)
    initSrc().then(() => {
      playByClick()
    })
  })
  Player.canPlay().then((audio: HTMLAudioElement) => {
    store.commit("setCurrentInfo", {
      duration: audio?.duration
    })
    Player.setOffset(store.state.Player.current.offset)
    Player.setGainValue(store.state.Player.gain)
  })
}


//控制歌曲进度条
const processCtrl = reactive({
  preload: 0,
  alreadyPlay: 0,
  alreadyplayIcon: -11,
  noteStartXposition: 0,
  ifAllowDragProgressIcon: false,
})

const changeProgressByClick = (event: MouseEvent): void => {
  processCtrl.alreadyPlay = event.offsetX
  processCtrl.alreadyplayIcon = event.offsetX - 11
  store.commit('setCurrentInfo', {
    offset: event.offsetX / 466,
    duration: Player.audio?.duration
  })
  Player.canPlay().then((audio: HTMLAudioElement) => {
    store.commit('setCurrentInfo', {
      offset: event.offsetX / 466,
      duration: audio?.duration
    })
    processCtrl.preload = Player.getPreload()//预加载进度
    Player.setOffset(store.state.Player.current.offset)
    Player.setGainValue(store.state.Player.gain)
  })
  Player.setOffset(store.state.Player.current.offset)
  if (Player.isPlaying()) {//如果点之前就在放，那就接着放，否则...
    store.commit('setCurrentInfo', {
      duration: Player.audio?.duration
    })
    Player.audio?.addEventListener("timeupdate", () => {
      if (processCtrl.ifAllowDragProgressIcon) return //如果正在拖拽就暂时不按播放进度来控制进度条
      processCtrl.preload = Player.getPreload()//预加载进度
      store.commit('setCurrentInfo', {
        offset: Player.getOffset()
      })
      processCtrl.alreadyPlay = Player.getOffset() * 466
      processCtrl.alreadyplayIcon = processCtrl.alreadyPlay - 11
    })
  }
}


const startDragProgressIcon = (event: MouseEvent) => {//拖拽开始
  processCtrl.ifAllowDragProgressIcon = true
  processCtrl.noteStartXposition = event.clientX  //记住起始x位置
}
const dragProgressIcon = (event: MouseEvent): void => {//拖拽过程
  if (!processCtrl.ifAllowDragProgressIcon) return
  const newX = event.clientX - processCtrl.noteStartXposition
  if (processCtrl.alreadyplayIcon + newX < -11) {//左尽头
    processCtrl.ifAllowDragProgressIcon = false
    processCtrl.alreadyPlay = 0
    processCtrl.alreadyplayIcon = -11
    store.commit('setCurrentInfo', {
      offset: 0
    })
    Player.setOffset(0)
  } else if (processCtrl.alreadyplayIcon + newX > 455) {//右尽头
    processCtrl.ifAllowDragProgressIcon = false
    processCtrl.alreadyPlay = 466
    processCtrl.alreadyplayIcon = 455
    store.commit('setCurrentInfo', {
      offset: 1
    })
    Player.setOffset(1)
  } else {//中间部位
    processCtrl.alreadyPlay += newX
    processCtrl.alreadyplayIcon = processCtrl.alreadyPlay - 11
    processCtrl.noteStartXposition = event.clientX
    store.commit('setCurrentInfo', {
      offset: processCtrl.alreadyPlay / 466
    })
  }
}
const stopDragProgressIcon = () => {//拖拽结束
  if (!processCtrl.ifAllowDragProgressIcon) return
  Player.setOffset(store.state.Player.current?.offset)
  const hasPlayLine = 466 * store.state.Player?.current?.offset
  processCtrl.alreadyPlay = hasPlayLine
  processCtrl.alreadyplayIcon = processCtrl.alreadyPlay - 11
  processCtrl.ifAllowDragProgressIcon = false //鼠标离开icon，不再允许再拖拽
  processCtrl.noteStartXposition = 0 //重置x位置
}


//控制音量条的展示
let hideVolumeKey = ref(true)
const ifHideVolumeLine = () => {
  hideVolumeKey.value = !hideVolumeKey.value
}
//控制音量条
const initG = Storage.get('gain') * 84
const volumeCtrl = reactive({
  lineHeight: initG,
  iconBottom: initG,
  noteStartYposition: 0,
  ifAllowDragProgressIcon: false,
})
const startDragVolume = (event: MouseEvent): void => {
  volumeCtrl.ifAllowDragProgressIcon = true
  volumeCtrl.noteStartYposition = event.clientY
}
const dragVolumeIcon = (event: MouseEvent): void => {
  if (!volumeCtrl.ifAllowDragProgressIcon) return
  const newY = event.clientY - volumeCtrl.noteStartYposition
  if (volumeCtrl.iconBottom - newY < 0) {//左尽头
    // volumeCtrl.ifAllowDragProgressIcon = false;
    volumeCtrl.lineHeight = 0
    volumeCtrl.iconBottom = volumeCtrl.lineHeight
    store.commit('setGainValue', 0)
    Player.setGainValue(0)
    Storage.set('gain', 0)
  } else if (volumeCtrl.iconBottom - newY > 84) {//右尽头
    volumeCtrl.lineHeight = 84
    volumeCtrl.iconBottom = volumeCtrl.lineHeight
    store.commit('setGainValue', 1)
    Player.setGainValue(1)
    Storage.set('gain', 1)
  } else {//中间部位
    volumeCtrl.lineHeight -= newY
    volumeCtrl.iconBottom = volumeCtrl.lineHeight
    volumeCtrl.noteStartYposition = event.clientY
    const value = volumeCtrl.lineHeight / 84
    store.commit('setGainValue', value)
    Player.setGainValue(value)
    Storage.set('gain', value)
  }
}
const stopDragVolume = (): void => {
  Player.setGainValue(volumeCtrl.lineHeight / 84)
  volumeCtrl.ifAllowDragProgressIcon = false
  volumeCtrl.noteStartYposition = 0
}
//控制循环播放/随机播放
let currentPlayMode = ref(0)
const changePlayMode = (): void => {
  currentPlayMode.value = (currentPlayMode.value + 1) % 3
}
const ifPlayModeIs = (index: number): boolean => index === currentPlayMode.value
//控制播放器的驻留
let playerClock = ref(true)
const changePlayerClock = () => {
  playerClock.value = !playerClock.value
}



//离开后摧毁播放器
onUnmounted(() => {
  console.log('palyer has unmounted')
  Player.destory()
})
</script>
<style lang="less">
.player-case {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 53px;
  background: url("../../assets/img/playbar.png") repeat-x 0 0;

  * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .playerconsole-warp {
    width: 980px;
    height: 47px;
    margin: 0 auto;

    .player-btn {
      width: 137px;
      height: 42px;
      padding: 6px 0 0 0;

      i {
        margin-right: 8px;
        cursor: pointer;
      }

      .previous {
        background: url("../../assets/img/playbar.png") no-repeat 0px -130px;

        &:hover {
          background-position: -30px -130px;
        }
      }

      .smallPlayBtn {
        width: 28px;
        height: 28px;
        margin-top: 5px;
      }

      .largePlayBtn {
        width: 36px;
        height: 36px;
        margin-top: 5px;
      }

      .play {
        background: url("../../assets/img/playbar.png") no-repeat 0px -165px;

        &:hover {
          background-position: -40px -165px;
        }
      }

      .pause {
        background: url("../../assets/img/playbar.png") no-repeat 0px -204px;

        &:hover {
          background-position: -40px -204px;
        }
      }

      .next {
        background: url("../../assets/img/playbar.png") no-repeat -80px -130px;

        &:hover {
          background-position: -110px -130px;
        }
      }

    }

    .music-cover {
      margin: 12px 18px 0 0;
      width: 34px;
      height: 34px;
    }

    .progress-bar {
      margin-top: 5px;
      width: 581px;

      .music-name {
        text-decoration: none;
        color: #e8e8e8;
        max-width: 200px;
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;

      }

      .musician-info {
        color: #9b9b9b;
        margin-left: 15px;
        max-width: 220px;
        line-height: 28px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /*要在第几行处隐藏，单行超出便省略就把3改成1*/
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;


        a {
          color: #9b9b9b;
          text-decoration: none;
        }
      }

      .music-link {
        display: block;
        width: 15px;
        height: 15px;
        margin: 7px 0 0 13px;
        background: url("../../assets/img/playbar.png") no-repeat -110px -103px;

        &:hover {
          background-position: -130px -103px;
        }
      }
    }

    .process-info {
      height: 14px;

      .process-line {
        height: 9px;
        width: 466px;
        margin-right: 15px;
        background: url("../../assets/img/statbar.png") no-repeat right 1px;
        border-radius: 8px 8px 8px 8px/ 4px 4px 4px 4px;
        overflow: hidden;

        .process-ready {
          background: url("../../assets/img/statbar.png") no-repeat right -29px;

          .process-already {
            width: 0%;
            background: url("../../assets/img/statbar.png") no-repeat right -65px;
          }
        }
      }

      .process-icon {
        position: absolute;
        top: -7px;
        left: -11px;
        width: 22px;
        height: 22px;
        background: url("../../assets/img/iconall.png") no-repeat -2px -250px;

        &:hover {
          background-position: -2px -280px;
        }
      }

      .process-duration {
        height: 14px;
        font-size: 12px;
        line-height: 9px;
        color: #e8e8e8;
      }
    }

    .music-btn-group {
      width: 87px;
      height: 36px;
      margin-top: 2px;

      .btn-group {
        width: 25px;
        height: 25px;
        margin: 15px 2px 0 0;
        cursor: pointer;
      }

      .paint-lyrics-inPic {
        background: url("../../assets/img/paintLyricsInPic.png") no-repeat 0 0;

        &:hover {
          background-position: 0 -25px;
        }
      }

      .collect-music {
        background: url("../../assets/img/playbar.png") no-repeat -88px -163px;

        &:hover {
          background-position: -88px -189px;
        }
      }

      .share-music {
        background: url("../../assets/img/playbar.png") no-repeat -114px -163px;

        &:hover {
          background-position: -114px -189px;
        }
      }
    }

    .music-list-control {
      position: relative;
      width: 126px;
      margin-left: 13px;

      .volume-case {
        position: absolute;
        top: -107px;
        left: -4px;
        z-index: 5;
        width: 32px;
        height: 113px;
        background: url("../../assets/img/playbar.png") no-repeat 0px -502px;

        .volume-line {
          position: absolute;
          left: 13px;
          bottom: 10px;
          width: 18px;
          background: url("../../assets/img/playbar.png") no-repeat -39px -522px;
        }

        .volume-line-icon {
          position: absolute;
          width: 18px;
          height: 20px;
          left: 9px;
          background: url("../../assets/img/iconall.png") no-repeat -42px -252px;

          &:hover {
            background-position: -42px -282px;
          }
        }
      }

      .volume-icon {
        width: 25px;
        height: 25px;
        background: url("../../assets/img/playbar.png") no-repeat -4px -247px;

        &:hover {
          background-position: -33px -247px;
        }
      }

      .btn-group {
        width: 25px;
        height: 25px;
        margin: 15px 2px 0 0;
        cursor: pointer;
      }

      .cycle {
        background: url("../../assets/img/playbar.png") no-repeat -4px -342px;

        &:hover {
          background-position: -34px -342px;
        }
      }


      .singalCycle {
        background: url("../../assets/img/playbar.png") no-repeat -67px -342px;

        &:hover {
          background-position: -94px -342px;
        }
      }


      .shufflePlay {
        background: url("../../assets/img/playbar.png") no-repeat -67px -247px;

        &:hover {
          background-position: -94px -247px;
        }
      }

      .music-list-panel {
        width: 59px;
        height: 25px;
        background: url("../../assets/img/playbar.png") no-repeat -44px -68px;

        &:hover {
          background-position: -44px -98px;
        }

        .music-list-icon {
          height: 27px;
          line-height: 29px;
          width: 38px;
          padding-left: 25px;
          color: #666;
        }
      }
    }
  }

  .player-control {
    position: absolute;
    right: 15px;
    bottom: 46px;
    width: 52px;
    height: 21px;
    overflow: hidden;
    background: url("../../assets/img/playbar.png") no-repeat 0 -380px;

    .playerControl {
      display: block;
      width: 18px;
      height: 18px;
      margin: 6px auto 0 auto;
    }

    .clock {
      background: url("../../assets/img/playbar.png") no-repeat -102px -382px;

      &:hover {
        background-position: -102px -402px;
      }
    }

    .solveClock {
      background: url("../../assets/img/playbar.png") no-repeat -82px -382px;

      &:hover {
        background-position: -82px -402px;
      }
    }
  }
}
</style>