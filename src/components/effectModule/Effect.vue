<template>
    <p class="line"></p>
    <div class="fillWidth flex flex-warp">
        <div class="sound-effect s-con">
            <div class="title fillWidth">
                <h2>音效</h2>
            </div>
            <h3 class="sec-title">均衡效果</h3>
            <div class="se-cards-box flex flex-warp">
                <a v-for="(name, index) in store.state.Player.equalizer.names" @click="selectEQ(index)"
                    :class="{ active: eqIndex(index) }" :key="name">{{ name }}</a>
            </div>
            <h3 class="sec-title">场景效果</h3>
            <div class="se-cards-box flex flex-warp">
                <a @click="SoundAround.switch()" :class="{ active: SoundAround.isOpen() }">空间环绕</a>
                <a @click="HallEcho.switch()" :class="{ active: HallEcho.isOpen() }">礼堂回响</a>
            </div>
            <h3 class="sec-title">其他效果</h3>
            <div class="se-cards-box flex flex-warp">
                <a @click="Fade.switch()" :class="{ active: Fade.isFade() }">淡出淡入</a>
            </div>
        </div>
        <div class="equalizer s-con">
            <div class="title fillWidth">
                <h2>均衡器</h2>
                <span>
                    <i @click="controlEqualizer()" class="pointer"
                        :class="{ open: store.state.Player.equalizer.open }">{{
                                store.state.Player.equalizer.open
                                    ? 'ON'
                                    : 'OFF'
                        }}</i>
                </span>
            </div>
            <div id="equalizer" class="eq-con flex fillWidth">
                <div v-show="!store.state.Player.equalizer.open" class="mask fillWidth fillHeight"></div>
                <div class="eq-ctrl fillHeight flex">
                    <div class="rangeCase">
                        <label>31</label>
                        <input type="range" :value="BFGainValue(0)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(0) + '%, #fff ' + BFGainValue(0) + '%)'"
                            index="0" />
                    </div>
                    <div class="rangeCase">
                        <label>62</label>
                        <input type="range" :value="BFGainValue(1)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(1) + '%, #fff ' + BFGainValue(1) + '%)'"
                            index="1" />
                    </div>
                    <div class="rangeCase">
                        <label>125</label>
                        <input type="range" :value="BFGainValue(2)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(2) + '%, #fff ' + BFGainValue(2) + '%)'"
                            index="2" />
                    </div>
                    <div class="rangeCase">
                        <label>250</label>
                        <input type="range" :value="BFGainValue(3)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(3) + '%, #fff ' + BFGainValue(3) + '%)'"
                            index="3" />
                    </div>
                    <div class="rangeCase">
                        <label>500</label>
                        <input type="range" :value="BFGainValue(4)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(4) + '%, #fff ' + BFGainValue(4) + '%)'"
                            index="4" />
                    </div>
                    <div class="rangeCase">
                        <label>1K</label>
                        <input type="range" :value="BFGainValue(5)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(5) + '%, #fff ' + BFGainValue(5) + '%)'"
                            index="5" />
                    </div>
                    <div class="rangeCase">
                        <label>2K</label>
                        <input type="range" :value="BFGainValue(6)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(6) + '%, #fff ' + BFGainValue(6) + '%)'"
                            index="6" />
                    </div>
                    <div class="rangeCase">
                        <label>4K</label>
                        <input type="range" :value="BFGainValue(7)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(7) + '%, #fff ' + BFGainValue(7) + '%)'"
                            index="7" />
                    </div>
                    <div class="rangeCase">
                        <label>8K</label>
                        <input type="range" :value="BFGainValue(8)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(8) + '%, #fff ' + BFGainValue(8) + '%)'"
                            index="8" />
                    </div>
                    <div class="rangeCase">
                        <label>16K</label>
                        <input type="range" :value="BFGainValue(9)"
                            :style="'background:linear-gradient(90deg, #c20c0c ' + BFGainValue(9) + '%, #fff ' + BFGainValue(9) + '%)'"
                            index="9" />
                    </div>
                </div>
            </div>
            <div class="x-axis flex">
                <p>-12db</p>
                <p>0db</p>
                <p>+12db</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, } from 'vue'
import { useStore } from 'vuex'
import useGlobalProperties from '../../hooks/useGlobalProperties'
import Storage from '../../utils/Storage'

const store = useStore()

//控制均衡器的
const BFGainValue = (i: number): number => 50 * store.state.Player.biquadFilterGain[i] / 12 + 50
const eqIndex = (i: number): boolean => store.state.Player.equalizer.index === i

const Player = useGlobalProperties('Player')

const selectEQ = (index: number) => {//选择均衡效果
    store.commit('setEqualizerIndex', index)//从新定位index
    const newEqWasSelect = store.state.Player.equalizer.values[index]
    Storage.set('biquadFilterGain', newEqWasSelect)//重新存储效果值
    Storage.set('eqs', store.state.Player.equalizer.index)//重新存储效果对应位置
    newEqWasSelect.forEach((value: number, index: number) => {//重新设置当前效果
        store.commit('setBiquadFilterGain', {
            index,
            value
        })
        Player.setBiquadFilters(value, index)//重新挂载到播放器
    })
}
const controlEqualizer = () => {
    if (store.state.Player.equalizer.open) {//如果开着把他关了
        store.commit('equalizerSwitch', 'close')
    } else {//如果关着，打开并连接上原来值
        store.commit('equalizerSwitch', 'open')
    }
}
onMounted(() => {
    const equalizer = document.getElementById('equalizer')
    const RANGEINP = equalizer?.querySelectorAll("input[type='range']") as NodeList
    for (let inp of RANGEINP) {
        inp.addEventListener('input', (e: Event) => {
            store.commit('setEqualizerIndex', 0)//手动改变的全部算自定义均衡效果
            const tag = e.target as HTMLInputElement
            const value = parseFloat(tag.value)
            const index = parseInt(tag.getAttribute('index') as string)
            tag.style.background = `linear-gradient(90deg, #c20c0c ${value}%, #fff ${value}%)`
            const gain = 24 * (value - 50) / 100
            store.commit('setCustomEquailzerEffect', {
                index: index,
                value: gain
            })
            store.commit('setBiquadFilterGain', {
                index: index,
                value: gain
            })
            Storage.reSetArray('biquadFilterGain', index, gain)
            Player.setBiquadFilters(gain, index)
        })
    }
})

//控制淡出淡入的
const Fade = reactive({
    switch() {
        store.commit('setFade')
        Storage.set('fade', store.state.Player.soundEffect.fade)
        Player.setFade(store.state.Player.soundEffect.fade)
    },
    isFade(): boolean {
        return store.state.Player.soundEffect.fade
    }
})
//控制礼堂回响
const HallEcho = reactive({
    switch() {
        store.commit('setHallEcho')
        Storage.set('hallEcho', store.state.Player.soundEffect.hallEcho)
        Player.setHallEchoType(store.state.Player.soundEffect.hallEcho)
    },
    isOpen(): boolean {
        return store.state.Player.soundEffect.hallEcho
    }
})
const SoundAround = reactive({
    switch() {
        store.commit('setSoundAround')
        Storage.set('soundAround', store.state.Player.soundEffect.soundAround)
        Player.setSoundAroundType(store.state.Player.soundEffect.soundAround)
    },
    isOpen(): boolean {
        return store.state.Player.soundEffect.soundAround
    }
})
</script>
<style lang="less" scoped>
.s-con {
    width: calc(50% - 30px);
    height: 500px;
    border-radius: 3px;
    background: rgb(45, 45, 45);
    box-shadow:
        -3.5px -3.5px 4.1px rgba(0, 0, 0, 0.039),
        5.3px 5.3px 26px rgba(0, 0, 0, 0.063),
        100px 100px 80px rgba(0, 0, 0, 0.07);

    .title {
        box-sizing: border-box;
        padding: 5px 20px;
        height: 30px;

        h2 {
            float: left;
            color: #fff;
        }

        span {
            display: block;
            float: right;
            width: 60px;
            height: 20px;
            margin: 5px auto;
            border-radius: 10px;
            border: 1px solid #fff;
            background: #fff;

            i {
                display: block;
                width: 40px;
                height: 20px;
                border-radius: 10px;
                background: #c20c0c;
                text-align: center;
                color: #fff;
                font: normal normal bold 12px/20px '微软雅黑';
                user-select: none;
                transition: margin 0.2s;
            }

            .open {
                margin-left: 20px;
            }

            &::after {
                clear: both;
            }
        }
    }
}

.sound-effect {
    margin: 20px 10px 20px 20px;

    .sec-title {
        margin: 10px 20px;
        color: #fff;
    }

    .se-cards-box {
        width: calc(100% - 30px);
        height: auto;
        margin: 5px auto;
        justify-content: flex-start;

        a {
            display: block;
            width: 100px;
            height: 30px;
            margin: 0 5px 10px 5px;
            line-height: 30px;
            text-align: center;
            border-radius: 3px;
            cursor: pointer;
            color: #fff;
            border: 1px solid #c20c0c;

            &:hover {
                border: 1px solid #a10a0a;
                background: rgba(0, 0, 0, 0.07);
            }
        }

        .active {
            color: #c20c0c;
            border: 1px solid #fff;
        }
    }
}

.equalizer {
    margin-top: 20px;

    .x-axis {
        width: 640px;
        border: 1px solid #fff;
        border-radius: 3px;
        height: 0px;
        background: #fff;
        margin: 10px auto auto 40px;

        p {
            flex: 1;
            color: #fff;
            font-size: 12px;

            &:nth-child(1) {
                text-align: left;
            }

            &:nth-child(2) {
                text-align: center;
            }

            &:nth-child(3) {
                text-align: right;
            }
        }
    }

    .eq-con {
        position: relative;
        height: 400px;
        box-sizing: border-box;
        margin-top: 10px;

        .mask {
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(125, 125, 125, 0.7);
        }

        .eq-ctrl {
            width: 100%;
            flex-direction: column;
            justify-content: space-around;

            .rangeCase {
                width: calc(100%-40px);
                height: 30px;

                label {
                    display: inline-block;
                    width: 30px;
                    height: 100%;
                    font-size: 14px;
                    line-height: 30px;
                    margin-right: 10px;
                    text-align: right;
                    color: #fff;
                }

                input {
                    padding: 0;
                    margin: 6px 0;
                    box-sizing: border-box;
                }

                input[type=range] {
                    -webkit-appearance: none;
                    width: 640px;
                    border: 1px solid #fff;
                    border-radius: 3px;
                    height: 6px;
                }

                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 15px;
                    height: 22px;
                    background: url("../../assets/img/iconall.png") no-repeat -3px -250px;
                }
            }
        }
    }
}
</style>