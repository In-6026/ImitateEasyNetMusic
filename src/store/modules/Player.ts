import StoreOptions from '../common'


interface Current {
    id: string | undefined
    name: string | undefined
    backgroundPic: string | undefined
    author: Array<string>
    src: string | undefined
    offset: number
    duration: number
    loaded: number
    dataArray: Uint8Array | undefined
    lyric: Array<
        Array<string>
    >
}
interface State {
    list: Array<{
        id: string
        name: string
        author: []
        duration: number
        backgroundPic: string
    }>
    index: number
    gain: number
    biquadFilterGain: [number, number, number, number, number, number, number, number, number, number]//10个均衡器的值
    equalizer: {
        index: number
        open: boolean
        names: Array<string>
        values: Array<Array<number>>
    } //均衡器的索引值,哪个均衡器? 0 --> 20, -1代表没开 0代表自定义
    soundEffect: {
        fade: boolean //淡入淡出开关/true开...
        hallEcho: boolean  //礼堂回响
        soundAround: boolean//空间环绕
    }
    animationEffect: Array<string>
    playing: boolean
    current: Current
}
const Player: StoreOptions<State> = {
    state: () => ({
        list: [],
        index: 0, //在放哪首歌
        gain: 1, //音量
        biquadFilterGain: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//均衡器增益值
        equalizer: {
            index: 0,
            open: true,
            names: ['自定义', '民谣', '低音', '低音&高音', '蓝调', '古风', '乡村', '舞曲', '慢歌', '电音', '重金属', '说唱', '爵士', '现场', '中音', '流行', '摇滚', '柔和', '柔和低音', '柔和高音', '超重低音', 'ACG'],
            values: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 3, 0, 0, 1, 4, 5, 3, 0, 2],
                [6, 4, 6, 2, 0, 0, 0, 0, 0, 0],
                [6, 5, 6, 1, 0, 0, 1, 3, 4, 0],
                [2, 6, 4, 0, -2, -1, 2, 2, 1, 3],
                [4, 2, 2, 0, -1, 3, 4, 1, 1, 3],
                [4, 4, 3, 2, -1, -1, 0, 1, 3, 4],
                [0, 2, 3, 0, 0, 2, 3, 1, 0, 0],
                [4, 5, 7, 0, 1, 3, 4, 4, 3, 0],
                [2, 0, 0, 0, 0, 0, 0, 0, -1, 1],
                [5, 6, 5, 0, -1, 1, 0, 1, 4, 3],
                [2, 5, 4, -2, -2, -1, 2, 3, 1, 4],
                [5, 5, 4, 0, -2, 1, 3, 0, 3, 4],
                [3, 3, 1, 2, -1, -1, 0, 1, 2, 4],
                [5, 5, 6, 0, -1, 0, 3, 4, 6, 5],
                [-2, -3, -3, 0, 1, 4, 3, 2, -1, -2],
                [-1, -1, 0, 1, 4, 3, 1, 0, -1, 1],
                [4, 3, 3, 1, 0, -1, 0, 1, 2, 4],
                [0, 0, 0, 0, 0, 0, 0, -2, -2, 0],
                [3, 2, 1, 0, 0, 0, 0, -2, -2, -2],
                [-3, -1, 0, 0, 0, 0, 0, -1, 3, 2],
                [6, 5, 8, 2, 0, 0, 0, 0, 0, 0],
            ]
        },
        playing: false,
        soundEffect: {
            fade: false,
            hallEcho: false,
            soundAround: false,
        },
        animationEffect: [],
        current: {
            id: undefined,
            name: undefined,
            backgroundPic: undefined,
            author: [], //作者
            src: undefined,
            offset: 0,//偏移量0-1
            duration: 0,
            loaded: 0,//已经加载
            dataArray: undefined,
            lyric: []
        }
    }),
    mutations: {
        initPlaylist(state, list) {
            state.list = list;
        },
        pushToPlayList(state, music) {
            state.list.splice(state.list.findIndex(i => i.id == state.current?.id) + 1, 0, music);
        },
        setCurrentInfo(state, Info: Current) {
            const {
                id,
                name,
                backgroundPic,
                author,
                src,
                offset,
                duration,
                loaded,
                lyric
            } = { ...Info };
            id ? state.current.id = id : null;
            name ? state.current.name = name : null;
            backgroundPic ? state.current.backgroundPic = backgroundPic : null;
            author ? state.current.author = author : null;
            typeof src === 'string' ? state.current.src = src : null;
            typeof offset === 'number' ? state.current.offset = offset : null;
            typeof duration === 'number'
                ? duration > 10 * 60 * 1000 ? state.current.duration = duration / 1000 : state.current.duration = duration
                : null;
            typeof loaded === 'number' ? state.current.loaded = loaded : null;
            lyric ? state.current.lyric = lyric : null;
        },
        setGainValue(state, value: number) {
            state.gain = value;
        },
        findCurrentIndex(state) {
            state.index = state.list.findIndex((song: { id: string | undefined }) => song.id == state.current.id);
        },
        setNextCurrent(state) {
            const next = state.list[
                (state.index + 1) % state.list.length
            ];
            state.current.id = next.id;
            state.current.name = next.name;
            state.current.author = next.author;
            state.current.duration = next.duration;
            state.current.backgroundPic = next.backgroundPic;
            state.current.offset = 0;
            state.current.loaded = 0;
        },
        setLastCurrent(state) {
            const i = state.index == 0 ? state.list.length - 1 : state.index - 1;
            const last = state.list[i];
            state.current.id = last.id;
            state.current.name = last.name;
            state.current.author = last.author;
            state.current.duration = last.duration;
            state.current.backgroundPic = last.backgroundPic;
            state.current.offset = 0;
            state.current.loaded = 0;
        },
        setSelectCurrent(state, i: number) {
            const last = state.list[i];
            state.current.id = last.id;
            state.current.name = last.name;
            state.current.author = last.author;
            state.current.duration = last.duration;
            state.current.backgroundPic = last.backgroundPic;
            state.current.offset = 0;
            state.current.loaded = 0;
        },
        setDataArray(state, dataArray: Uint8Array) {
            state.current.dataArray = dataArray;
        },
        setBiquadFilterGain(state, Info: {
            index: number,
            value: number
        }) {
            const {
                index,
                value
            } = { ...Info };
            state.biquadFilterGain[index] = value;
        },
        equalizerSwitch(state, value: string) {
            if (value === 'open') {
                state.equalizer.open = true;
            } else {
                state.equalizer.open = false;
            }
        },
        setEqualizerIndex(state, index: number) {
            state.equalizer.index = index;
            if (state.equalizer.index == -1) {
                state.equalizer.open = false;
            }
        },
        setCustomEquailzerEffect(state, Info: {
            index: number
            value: number
        }) {
            const {
                index,
                value
            } = { ...Info };
            if (index == 0) {
                state.equalizer.values[0][index] = value;
            }
        },
        setFade(state, value: boolean = !state.soundEffect.fade) {
            state.soundEffect.fade = value;
        },
        setHallEcho(state, value: boolean = !state.soundEffect.hallEcho) {
            state.soundEffect.hallEcho = value;
        },
        setSoundAround(state, value: boolean = !state.soundEffect.soundAround) {
            state.soundEffect.soundAround = value;
        }
    }
}

export default Player