import Storage from "../../utils/Storage";
import StoreOptions from '../common'


interface Account {
    id: string
    userName: string
    type: number
    status: number
    whitelistAuthority: number,
    createTime: number
    tokenVersion: number
    ban: number
    baoyueVersion: number
    donateVersion: number
    vipType: number
    anonimousUser: boolean
    paidFee: boolean
}
interface Profile {
    userId: string
    userType: number
    nickname: string
    avatarImgId: string
    avatarUrl: string
    backgroundImgId: number
    backgroundUrl: string
    signature: string
    createTime: number
    userName: string
    accountType: number
    shortUserName: string
    birthday: number
    authority: number
    gender: number
    accountStatus: number
    province: number
    city: number
    authStatus: number
}
interface Details {
    level: number
    listenSongs: number//已听歌曲数目
    userPoint: {
        userId: number
        balance: number
        updateTime: number
        version: number
        status: number
        blockBalance: 0
    },
    mobileSign: boolean
    pcSign: boolean
    profile: {
        privacyItemUnlimit: {
            area: boolean
            college: boolean
            age: boolean
            villageAge: true
        },
        avatarDetail: null,
        description: string
        avatarImgIdStr: number
        backgroundImgIdStr: number
        userId: number
        vipType: number
        userType: number
        createTime: number
        experts: {},
        expertTags: null,
        djStatus: number
        accountStatus: number
        province: number
        city: number
        defaultAvatar: boolean
        backgroundImgId: number
        backgroundUrl: string
        nickname: string
        avatarUrl: string
        gender: 1 | 2
        avatarImgId: number
        mutual: boolean
        followed: boolean
        remarkName: null | string
        authStatus: number
        detailDescription: string
        birthday: number
        signature: string
        authority: number
        followeds: number
        follows: number
        blacklist: boolean
        eventCount: number
        allSubscribedCount: number
        playlistBeSubscribedCount: number
        avatarImgId_str: number
        followTime: null,
        followMe: boolean
        artistIdentity: Array<any>
        cCount: number
        inBlacklist: boolean
        sDJPCount: number
        playlistCount: number
        sCount: number
        newFollows: 0
    },
    peopleCanSeeMyPlayRecord: boolean
    bindings: Array<{
        expired: boolean
        url: string
        userId: number
        expiresIn: number
        refreshTime: number
        bindingTime: number
        tokenJsonStr: null
        id: string
        type: number
    }>
    adValid: boolean
    code: number
    createTime: number
    createDays: number
    profileVillageInfo: {
        title: string
        imageUrl: string
        targetUrl: string
    }
}
interface State {
    id: string | undefined
    account: Account | undefined
    profile: Profile | undefined
    details: Details | undefined
}

const User: StoreOptions<State> = {
    state: () => ({
        id: undefined,
        account: undefined,
        profile: undefined,
        details: undefined
    }),
    mutations: {
        setUserId(state, id: string | undefined) {
            state.id = id
        },
        setUserAccount(state, account: Account | undefined) {
            state.account = account
        },
        setUserProfile(state, profile: Profile | undefined) {
            state.profile = profile
        },
        setUserDetails(state, details: Details | undefined) {
            state.details = details
        }
    },
    actions: {
        async asyncSetUserDetails({commit}, details) {
            commit('setUserDetails', details)
        }
    }
}

export default User