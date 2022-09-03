
<template>
  <p class="line"></p>
  <div class="contain">
    <div class="musicInfo">
      <h3>{{ store.state.Player.current.name }}</h3>
      <div class="processLine fillWidth">
        <div class="line fillWidth"></div>
        <div class="processIcon" :style="'left:' + processCtrl.iconInLeft + 'px;'"></div>
        <i class="iconIn" :style="'left:' + processCtrl.iconInLeft + 'px;'"></i>
        <i class="iconOut" :style="'left:' + processCtrl.iconOutLeft + 'px;'"></i>
      </div>
      <div class="time fillWidth">
        <span class="currentTime">{{ formatAlreadyPlay() }}</span>
        <span class="duration">{{ formatDuration() }}</span>
      </div>
      <p class="lyric-1">{{ Lyric() }}</p>
    </div>
    <canvas id="canvasOuter" class="canvasOuter" width="800" height="800"></canvas>
  </div>
</template>
<script setup lang="ts">
import mitter from '../../utils/mitter'
import { useStore } from 'vuex'
import { reactive, onMounted } from 'vue'

const store = useStore()

const fixDuration = (time: number): string => {
  if (isNaN(time)) return '00:00'
  const T = Math.floor(time)
  const M = Math.floor(T / 60)
  const S = T % 60
  return M > 9
    ? S > 9 ? `${M}:${S}` : `${M}:0${S}`
    : S > 9 ? `0${M}:${S}` : `0${M}:0${S}`
}
const formatAlreadyPlay = () => fixDuration(store.state.Player.current.offset * store.state.Player.current.duration)
const formatDuration = () => fixDuration(store.state.Player.current.duration)

let canvas2: HTMLCanvasElement, canvas2Ctx: CanvasRenderingContext2D

onMounted(() => {
  try {
    canvas2 = document.getElementById('canvasOuter') as HTMLCanvasElement
    if (canvas2.getContext) {
      canvas2Ctx = canvas2.getContext('2d') as CanvasRenderingContext2D

      canvas2Ctx.strokeStyle = '#fff'
      canvas2Ctx.lineWidth = 1
    }
  } catch (err) {
    throw '你的浏览器不支持canvas ' + err
  }
})

const processCtrl = reactive({
  timer: undefined,
  iconInLeft: store.state.Player.current.offset * 300,
  iconOutLeft: store.state.Player.current.offset * 300 - 8,
  prcILeftL: store.state.Player.current.offset * 300 - 16 + 'px',
  prcILeftS: store.state.Player.current.offset * 300 - 11 + 'px',
} as {
  timer: any
  iconInLeft: number
  iconOutLeft: number
  prcILeftL: string
  prcILeftS: string
})
mitter.on('startMovePlayProgress', () => {
  processCtrl.timer = setInterval(() => {
    processCtrl.iconInLeft = store.state.Player.current.offset * 300
    processCtrl.iconOutLeft = store.state.Player.current.offset * 300 - 8
    processCtrl.prcILeftS = processCtrl.iconInLeft - 11 + 'px'
    processCtrl.prcILeftL = processCtrl.iconInLeft - 16 + 'px'
  }, 1000)
})
mitter.on('draw', () => {
  const dataArray = store.state.Player.current.dataArray
  canvas2Ctx.clearRect(0, 0, 800, 800)
  canvas2Ctx.beginPath()
  //画外
  for (let i = 0; i < 512; i++) {
    const angle = i * Math.PI / 128
    const [startX, startY] = [200 * Math.cos(angle) + 400, 200 * Math.sin(angle) + 400]
    const [endX, endY] = [(dataArray[i] + 100) * Math.cos(angle) + 400, (dataArray[i] + 100) * Math.sin(angle) + 400]

    canvas2Ctx.lineTo(startX, startY)
    canvas2Ctx.lineTo(endX, endY)
  }
  canvas2Ctx.stroke()
})
mitter.on('stopMovePlayProgress', () => {
  clearInterval(processCtrl.timer)
})
const Lyric = (): string => {
  const lrc = store.state.Player.current.lyric
  const currentTime = store.state.Player.current.offset * store.state.Player.current.duration
  for (let i = 0; i < lrc.length; i++) {
    if (lrc[i][0] <= currentTime && currentTime < lrc[i + 1][0]) return lrc[i][1]
  }
  return ''
}
</script>
<style lang="less" scoped>
body {
  width: 100%;
  height: 100%;
}

.contain {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../../assets/img/Tom1.png') no-repeat center;
  background-size: cover;

  .play-btn-group {
    position: fixed;
    width: 100px;
    height: auto;
    list-style: none;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    color: #fff;

    li {
      cursor: pointer;
      border-radius: 5px;
      padding: 10px 20px;

      &:hover {
        background: rgba(0, 0, 0, 0.7);
      }
    }
  }

  .canvasOuter {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .musicInfo {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 400px;
    height: 400px;
    border-radius: 200px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 6;

    h3 {
      font-size: 20px;
      color: #fff;
      width: 300px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      margin: 130px 50px 0 50px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      /*要在第几行处隐藏，单行超出便省略就把3改成1*/
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: 'Times New Roman', Times, serif;
    }

    .processLine {
      position: relative;
      height: 30px;
      margin-top: 15px;
      border-radius: 1px;

      .line {
        position: absolute;
        top: 14px;
        height: 2px;
        border-radius: 1px;
        background-color: #fff;
      }

      .processIcon {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 30px;
        height: 30px;
        margin: auto;
        border-radius: 100%;
        background-color: rgba(225, 225, 225, 0.6);
        animation: ProcessIconSize 0.8s linear 0s infinite alternate-reverse;
        transition: left 1s;
      }

      .iconIn {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: #fff;
        z-index: 5;
        transition: left 1s;
      }

      .iconOut {
        position: absolute;
        // left: -8px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 16px;
        height: 16px;
        border: 4px solid;
        border-radius: 100%;
        border-top-color: white;
        border-bottom-color: white;
        border-left-color: rgba(225, 225, 225, 0);
        border-right-color: rgba(225, 225, 225, 0);
        z-index: 4;
        animation: ProcessIconOut 1.6s linear 0s infinite;
        transition: left 1s;
      }

      @keyframes ProcessIconSize {
        from {
          left: v-bind('processCtrl.prcILeftL');
          width: 40px;
          height: 40px;
        }

        to {
          left: v-bind('processCtrl.prcILeftS');
          // left: -11px;
          width: 30px;
          height: 30px;
        }
      }

      @keyframes ProcessIconOut {
        form {
          transform: rotateZ(0deg);
        }

        to {
          transform: rotateZ(360deg);
        }
      }
    }

    .time {
      margin-top: 15px;
      text-align: center;

      span {
        color: #fff;
        font-size: 15px;
      }

      .currentTime {
        margin-right: 10px;
      }
    }

    .lyric-1 {
      color: #fff;
    }

    .lyric-2 {
      color: #aaa;
    }

    .lyric-1,
    .lyric-2 {
      width: 300px;
      height: 25px;
      line-height: 25px;
      margin: 10px 50px;
      text-align: center;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      /*要在第几行处隐藏，单行超出便省略就把3改成1*/
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>