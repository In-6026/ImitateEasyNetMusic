
class Player {
    src: string | undefined
    gain: number
    offset: number //0 --- 1
    audio: HTMLMediaElement | undefined
    source: MediaElementAudioSourceNode | undefined
    gainNode: GainNode | undefined
    audioCtx: AudioContext | undefined
    analyser: AnalyserNode | undefined
    dataArray: Uint8Array | undefined
    //10个滤波器
    biquadFilter1: BiquadFilterNode | undefined
    biquadFilter2: BiquadFilterNode | undefined
    biquadFilter3: BiquadFilterNode | undefined
    biquadFilter4: BiquadFilterNode | undefined
    biquadFilter5: BiquadFilterNode | undefined
    biquadFilter6: BiquadFilterNode | undefined
    biquadFilter7: BiquadFilterNode | undefined
    biquadFilter8: BiquadFilterNode | undefined
    biquadFilter9: BiquadFilterNode | undefined
    biquadFilter10: BiquadFilterNode | undefined
    biquadFilterGain: [number, number, number, number, number, number, number, number, number, number]
    fade: boolean //控制淡入淡出,true允许,false...
    hallEcho: boolean //控制礼堂回响
    hallEchoAudio: HTMLMediaElement | undefined
    hallEchoSource: MediaElementAudioSourceNode | undefined
    hallEchoGainNode: GainNode | undefined

    soundAround: boolean //控制空间环绕
    panner: PannerNode | undefined
    soundAroundTimer: any

    constructor() {
        this.src = undefined
        this.gain = 1
        this.offset = 0
        this.audio = undefined
        this.source = undefined
        this.gainNode = undefined
        this.audioCtx = undefined
        this.analyser = undefined
        this.dataArray = undefined
        //10个滤波器
        this.biquadFilter1 = undefined
        this.biquadFilter2 = undefined
        this.biquadFilter3 = undefined
        this.biquadFilter4 = undefined
        this.biquadFilter5 = undefined
        this.biquadFilter6 = undefined
        this.biquadFilter7 = undefined
        this.biquadFilter8 = undefined
        this.biquadFilter9 = undefined
        this.biquadFilter10 = undefined
        this.biquadFilterGain = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.fade = false
        this.hallEcho = false
        this.hallEchoAudio = undefined
        this.hallEchoSource = undefined
        this.hallEchoGainNode = undefined

        this.soundAround = false
        this.panner = undefined
        this.soundAroundTimer = undefined
    }

    setSrc(src: string) {
        this.src = src
        this.offset = 0
        if (this.audio) this.audio.currentTime = 0
    }
    init() {
        this.audio = new Audio()
        this.audio.crossOrigin = 'anonymous'
        if (this.src) {
            this.audio.src = (<string>this.src)
        }
    }
    async play() {
        return new Promise((resolve, reject) => {
            this.init()
            try {
                this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext || (window as any).mozAudioContext || (window as any).msAudioContext)()
            } catch (e) {
                throw new Error("您的浏览器不支持！")
            }
            this.source = this.audioCtx?.createMediaElementSource((<HTMLMediaElement>this.audio))
            this.gainNode = this.audioCtx?.createGain()
            this.analyser = this.audioCtx.createAnalyser()
            this.analyser.fftSize = 1024
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)

            //创建10个滤波器
            this.createBiquadFilters().then(() => {
                this.source?.connect(this.biquadFilter1 as BiquadFilterNode)
                this.biquadFilter1?.connect(this.biquadFilter2 as BiquadFilterNode)
                this.biquadFilter2?.connect(this.biquadFilter3 as BiquadFilterNode)
                this.biquadFilter3?.connect(this.biquadFilter4 as BiquadFilterNode)
                this.biquadFilter4?.connect(this.biquadFilter5 as BiquadFilterNode)
                this.biquadFilter5?.connect(this.biquadFilter6 as BiquadFilterNode)
                this.biquadFilter6?.connect(this.biquadFilter7 as BiquadFilterNode)
                this.biquadFilter7?.connect(this.biquadFilter8 as BiquadFilterNode)
                this.biquadFilter8?.connect(this.biquadFilter9 as BiquadFilterNode)
                this.biquadFilter9?.connect(this.biquadFilter10 as BiquadFilterNode)
                if (this.soundAround) {
                    this.mountSoundAround()
                    this.biquadFilter10?.connect((<PannerNode>this.panner))
                    this.panner?.connect((<GainNode>this.gainNode))
                } else {
                    this.biquadFilter10?.connect((<GainNode>this.gainNode))
                }
                (<GainNode>this.gainNode).connect(this.analyser as AnalyserNode);
                (<AnalyserNode>this.analyser).connect((<AudioContext>this.audioCtx).destination)
                if (this.fade) {//如果淡入淡出
                    (<GainNode>this.gainNode).gain.value = 0
                } else {
                    (<GainNode>this.gainNode).gain.value = this.gain
                }
                this.audio?.play()
                if (this.fade) {//如果淡入淡出 
                    this.gainNode?.gain.linearRampToValueAtTime(this.gain, (<AudioContext>this.audioCtx).currentTime + 2)
                }
                if (this.hallEcho) {
                    if (this.hallEchoAudio) {
                        this.hallEchoAudio.play()
                    } else {
                        this.mountHallEcho()
                    }
                }
                resolve(this.audio)
            })
        })
    }

    async canPlay() {
        return new Promise((resolve) => {
            this.audio?.addEventListener('canplay', () => resolve(this.audio))
        })
    }
    isPlaying() {
        return this.audio?.paused === undefined ? false : !this.audio?.paused
    }
    getOffset() {
        return (<HTMLAudioElement>this.audio)?.currentTime / (<HTMLAudioElement>this.audio)?.duration || 0
    }
    getPreload() {
        if (this.audio?.buffered.length) {
            return this.audio.buffered.end(0)
        }
    }
    pause() {
        if (!this.src) return
        if (this.fade) {
            this.gainNode?.gain.linearRampToValueAtTime(0, (<AudioContext>this.audioCtx).currentTime + 0.7)
            setTimeout(() => {
                this.source?.disconnect(0)
                this.gainNode?.disconnect(0)
                this.offset = (<number>this.audio?.currentTime)
                this.audio?.pause()
            }, 700)
        } else {
            this.source?.disconnect(0)
            this.gainNode?.disconnect(0)
            this.offset = (<number>this.audio?.currentTime)
            this.audio?.pause()
        }
        this.hallEchoAudio?.pause()
        this.destorySoundAround()
    }
    next(src: string) {
        (<HTMLAudioElement>this.audio).src = src
    }
    last(src: string) {
        (<HTMLAudioElement>this.audio).src = src
    }
    setOffset(offset: number) {
        this.offset = offset
        if (this.audio) (<HTMLAudioElement>this.audio).currentTime = this.offset * this.audio.duration
        if (this.hallEchoAudio) this.hallEchoAudio.currentTime = this.offset * (<HTMLMediaElement>this.audio).duration + 0.05
    }
    setGainValue(value: number) {
        this.gain = value
        if (this.gainNode) this.gainNode.gain.value = this.gain
        if (!this.hallEchoGainNode) return
        if (this.gain >= 0.2) {
            this.hallEchoGainNode.gain.value = this.gain + 0.1
        } else {
            this.hallEchoGainNode.gain.value = 0
        }
    }

    async createBiquadFilters() {
        return new Promise((resolve) => {
            this.biquadFilter1 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter2 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter3 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter4 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter5 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter6 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter7 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter8 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter9 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())
            this.biquadFilter10 = (<BiquadFilterNode>this.audioCtx?.createBiquadFilter())

            this.biquadFilter1.type = "peaking"
            this.biquadFilter1.frequency.value = 31
            this.biquadFilter1.Q.value = 1
            this.biquadFilter1.gain.value = this.biquadFilterGain[0]

            this.biquadFilter2.type = "peaking"
            this.biquadFilter2.frequency.value = 62
            this.biquadFilter2.Q.value = 1
            this.biquadFilter2.gain.value = this.biquadFilterGain[1]

            this.biquadFilter3.type = "peaking"
            this.biquadFilter3.frequency.value = 125
            this.biquadFilter3.Q.value = 1
            this.biquadFilter3.gain.value = this.biquadFilterGain[2]

            this.biquadFilter4.type = "peaking"
            this.biquadFilter4.frequency.value = 250
            this.biquadFilter4.Q.value = 1
            this.biquadFilter4.gain.value = this.biquadFilterGain[3]

            this.biquadFilter5.type = "peaking"
            this.biquadFilter5.frequency.value = 500
            this.biquadFilter5.Q.value = 1
            this.biquadFilter5.gain.value = this.biquadFilterGain[4]

            this.biquadFilter6.type = "peaking"
            this.biquadFilter6.frequency.value = 1000
            this.biquadFilter6.Q.value = 1
            this.biquadFilter6.gain.value = this.biquadFilterGain[5]

            this.biquadFilter7.type = "peaking"
            this.biquadFilter7.frequency.value = 2000
            this.biquadFilter7.Q.value = 1
            this.biquadFilter7.gain.value = this.biquadFilterGain[6]

            this.biquadFilter8.type = "peaking"
            this.biquadFilter8.frequency.value = 4000
            this.biquadFilter8.Q.value = 1
            this.biquadFilter8.gain.value = this.biquadFilterGain[7]

            this.biquadFilter9.type = "peaking"
            this.biquadFilter9.frequency.value = 8000
            this.biquadFilter9.Q.value = 1
            this.biquadFilter9.gain.value = this.biquadFilterGain[8]

            this.biquadFilter10.type = "peaking"
            this.biquadFilter10.frequency.value = 16000
            this.biquadFilter10.Q.value = 1
            this.biquadFilter10.gain.value = this.biquadFilterGain[9]
            resolve('createBiquadFilters')
        })
    }
    setBiquadFilters(gain: number, index: number) {
        switch (index) {
            case 0:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter1) return
                this.biquadFilter1.gain.value = this.biquadFilterGain[index]
                break
            case 1:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter2) return
                this.biquadFilter2.gain.value = this.biquadFilterGain[index]
                break
            case 2:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter3) return
                this.biquadFilter3.gain.value = this.biquadFilterGain[index]
                break
            case 3:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter4) return
                this.biquadFilter4.gain.value = this.biquadFilterGain[index]
                break
            case 4:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter5) return
                this.biquadFilter5.gain.value = this.biquadFilterGain[index]
                break
            case 5:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter6) return
                this.biquadFilter6.gain.value = this.biquadFilterGain[index]
                break
            case 6:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter7) return
                this.biquadFilter7.gain.value = this.biquadFilterGain[index]
                break
            case 7:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter8) return
                this.biquadFilter8.gain.value = this.biquadFilterGain[index]
                break
            case 8:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter9) return
                this.biquadFilter9.gain.value = this.biquadFilterGain[index]
                break
            case 9:
                this.biquadFilterGain[index] = gain
                if (!this.biquadFilter10) return
                this.biquadFilter10.gain.value = this.biquadFilterGain[index]
                break
            default:
                break
        }
    }

    setFade(value: boolean) {
        this.fade = value
    }
    setHallEchoType(value: boolean) {
        this.hallEcho = value
        if (!this.hallEcho) {
            return this.destoryHallEcho()
        }
        this.mountHallEcho()
    }
    mountHallEcho() {
        this.destoryHallEcho()
        if (this.audioCtx) {
            this.hallEchoAudio = new Audio() as HTMLMediaElement
            this.hallEchoAudio.crossOrigin = 'anonymous'
            if (this.src) {
                this.hallEchoAudio.src = this.src
            }
            this.hallEchoSource = this.audioCtx.createMediaElementSource(this.hallEchoAudio)
            this.hallEchoGainNode = this.audioCtx.createGain()

            if (this.gain > 0.2) {
                this.hallEchoGainNode.gain.value = this.gain + 0.1
            } else {
                this.hallEchoGainNode.gain.value = 0
            }

            this.hallEchoSource?.connect(this.hallEchoGainNode)
            this.hallEchoGainNode.connect(this.audioCtx.destination)
            if (this.isPlaying()) {
                setTimeout(() => {
                    (<HTMLMediaElement>this.hallEchoAudio).currentTime = (<HTMLMediaElement>this.audio).currentTime + 0.05
                    this.hallEchoAudio?.play()
                }, 50)
            }
        }
    }
    destoryHallEcho() {
        this.hallEchoSource?.disconnect(0)
        this.hallEchoGainNode?.disconnect(0)
        this.hallEchoAudio?.pause()
        this.hallEchoAudio = this.hallEchoSource = this.hallEchoGainNode = undefined
    }

    setSoundAroundType(value: boolean) {
        this.soundAround = value
        if (!this.soundAround) {
            return this.destorySoundAround()
        }
        this.mountSoundAround()
        this.biquadFilter10?.disconnect(0)
        this.biquadFilter10?.connect(this.panner as PannerNode)
        this.panner?.connect(this.gainNode as GainNode)
    }
    mountSoundAround() {
        this.destorySoundAround()
        if (this.audioCtx) {
            this.panner = this.audioCtx.createPanner()
            this.panner.positionX.value = 0
            this.panner.positionY.value = 0
            this.panner.positionZ.value = 0
            let index = 0
            this.soundAroundTimer = setInterval(() => {
                (<PannerNode>this.panner).positionX.value = Math.sin(index);
                (<PannerNode>this.panner).positionY.value = 0;
                (<PannerNode>this.panner).positionZ.value = Math.cos(index)
                index += 1 / 100
            }, 16)
        }
    }
    destorySoundAround() {
        this.panner?.disconnect(0)
        this.panner = undefined
        clearInterval(this.soundAroundTimer)
        if (this.biquadFilter10 && this.isPlaying()) {
            this.biquadFilter10.connect((<GainNode>this.gainNode))
        }
    }
    getDataArray() {
        this.analyser?.getByteTimeDomainData(this.dataArray as Uint8Array)
        return this.dataArray
    }
    async destory() {
        return new Promise((resolve) => {
            if (!this.audio?.paused) {
                this.audio?.pause()
            }
            if (!this.hallEchoAudio?.paused) {
                this.hallEchoAudio?.pause()
            }
            this.offset = 0
            this.src = this.audio = this.audioCtx = this.gainNode = this.source = this.src = this.hallEchoAudio = this.hallEchoSource = this.hallEchoGainNode = undefined
            resolve('destory')
        })
    }
}
export default new Player()