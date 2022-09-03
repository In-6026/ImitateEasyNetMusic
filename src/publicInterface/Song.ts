export default interface Song {
    // id: number  //1929346993,
    // name: string    //睡个好觉
    // ar: Array<{
    //     id: number  //1030001,
    //     name: string    //"周深"
    // }>
    // al: {
    //     id: number  //142040657,
    //     name: string    //睡个好觉
    //     picUrl: string  //https://p1.music.126.net/XcaXxGZ5_iaUlzUiSH17-A==/109951167165345393.jpg
    // }
    // dt: number
    id: string
    name: string
    tns: Array<string>
    dt: number //时长（ms）
    ar: Array<{ //歌手信息
        id: string
        name: string
    }>
    al: {//专辑
        id: string
        name: string
        picUrl: string
    }
    mv: number //mv id
}