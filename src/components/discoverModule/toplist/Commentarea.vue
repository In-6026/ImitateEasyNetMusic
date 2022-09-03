
<script setup lang="ts">
import useGlobalProperties from '../../../hooks/useGlobalProperties';
import useCurrentInstance from '../../../hooks/useCurrentInstance';
import { reactive, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';

const Axios = useGlobalProperties('Axios');
const store= useStore();
const $route = useCurrentInstance()?.$route;
const $router = useCurrentInstance()?.$router;

interface Comments {
    user: {
        userId: number
        nickname: string
        avatarUrl: string
    }
    commentId: number
    content: string
    timeStr: string
    likedCount: number
    beReplied: Array<{
        user: {
            userId: number
            nickname: string
        }
        beRepliedCommentId: number
        content: string
    }>
}

let comments = reactive({
    id: '',
    hot: [],
    new: [],
    count: 0,
    offset: 0,
    async initId(route: any) {
        return new Promise((resolve) => {
            comments.id = route?.query.id || '19723756';
            resolve('');
        })
    },
    async checkId(route: any) {
        return new Promise((resolve) => {
            if (route.query.id && comments.id !== route.query.id) {
                comments.id = route.query.id
                pageTurning.turn(1)
                resolve(true)
                return
            }
            resolve(false)
        })
    },
    async getHotComments() {
        return new Promise((resolve) => {
            const url = `/comment/new?type=2&id=${comments.id}&sortType=2&pageSize=15`;
            Axios.get(url).then((data: {
                data: {
                    comments: Array<Comments>
                    totalCount: number
                }
            }) => {
                comments.hot = data.data?.comments;
                comments.count = data.data?.totalCount;
                resolve('getHotComments')
            }).catch((reson: string) => {
                throw reson;
            });
        })
    },
    async getNewComments() {
        return new Promise((resolve) => {
            const url = `/comment/playlist?id=${comments.id}&limit=20&offset=${comments.offset * 20}`;
            Axios.get(url).then((data: {
                comments: Array<Comments>
                total: number
            }) => {
                comments.new = data.comments;
                comments.count = data.total;
                resolve('getNewComments')
            }).catch((reson: string) => {
                throw reson;
            });
        })
    }
} as {
    id: string
    hot: Array<Comments>
    new: Array<Comments>
    count: number
    offset: number
    initId: Function
    checkId: Function
    getHotComments: Function
    getNewComments: Function
})

$router?.afterEach((to) => {
    comments.checkId(to).then((data: boolean) => {
        if (data) {
            comments.getHotComments();
        }
        comments.getNewComments().then(() => {
            pageTurning.init();
        })
    })
})

comments.initId($route).then(() => {
    return comments.getHotComments();
}).then(() => {
    return comments.getNewComments();
}).then(() => {
    pageTurning.init();
})
const turnTimeStr = (str: string): string => {
    if (!str.includes('-')) {
        return str;
    }
    let arr = str.split('-')
    arr[0] += '年';
    arr[1] += '月';
    arr.length == 3 ? arr[2] += '日' : null;
    return arr.join('');
}
let inputCommentText = ref('');

let pageTurning = reactive({
    total: 0,
    active: 1,
    arr: [] as Array<number>,
    init() {
        pageTurning.total = Math.ceil(comments.count / 20);
        pageTurning.arr = [];
        if (pageTurning.total >= 9) {
            pageTurning.arr = [2, 3, 4, 5, 6, 7, 8]
        } else {
            for (let i = 2; i < pageTurning.total; i++) {
                pageTurning.arr.push(i)
            }
        }
    },
    turn(index: number) {
        index == -1
            ? pageTurning.active-- : index == 0 ? pageTurning.active++ : pageTurning.active = index;
        const ac = pageTurning.active;
        comments.offset = ac - 1;
        comments.getNewComments();
        if (pageTurning.total <= 9) return;
        pageTurning.arr = [];
        if (ac > 5 && ac < pageTurning.total - 4) {
            for (let i = ac - 3; i <= ac + 3; i++) {
                pageTurning.arr.push(i);
            }
        } else if (index <= 5) {
            pageTurning.arr = [2, 3, 4, 5, 6, 7, 8];
        } else if (index >= pageTurning.total - 4) {
            for (let i = pageTurning.total - 7; i < pageTurning.total; i++) {
                pageTurning.arr.push(i)
            }
        }
    }
});
watchEffect(() => {
    pageTurning.total = Math.ceil(comments.count / 20);
});
</script>
<template>
    <div class="comment-con">
        <div class="comment-head flex">
            <h3 class="txt">
                <span>评论</span>
            </h3>
            <span class="com-count">
                共
                <label>{{ comments.count }}</label>条评论
            </span>
        </div>
        <div class="input-comment flex">
            <div class="userPic">
                <img :src="store.state.User?.profile?.avatarUrl + '?param=50y50'" class="fillWidth fillHeight" />
            </div>
            <div class="com-ipt-box">
                <div class="relative com-inp">
                    <i class="blobk inp-area-arrows absolute"></i>
                    <textarea
                        v-model.trim="inputCommentText"
                        class="inp-area fillWidth absolute"
                        placeholder="评论"
                    ></textarea>
                </div>
                <div class="com-btns fillWidth">
                    <i class="meme pointer"></i>
                    <i class="eit pointer"></i>
                    <a class="sub pointer block text-decoration-none">评论</a>
                    <span
                        :class="{ comOverWarn: inputCommentText.length > 140 }"
                    >{{ 140 - inputCommentText.length }}</span>
                </div>
            </div>
        </div>
        <div>
            <h3 v-if="comments.offset === 0" class="com-titl">精彩评论</h3>
            <div v-if="comments.offset === 0">
                <div v-for="item in comments.hot" class="com-item flex" :key="item.user.userId">
                    <div class="u-head">
                        <a>
                            <img :src="item.user.avatarUrl + '?param=50y50'" loading="lazy" />
                        </a>
                    </div>
                    <div class="cntwarp">
                        <div>
                            <a href="#" class="c-u-name">{{ item.user.nickname }}</a>
                            : {{ item.content }}
                        </div>
                        <div class="operation">
                            <div class="time">{{ turnTimeStr(item.timeStr) }}</div>
                            <div class="op-btn flex">
                                <span class="dlt" :class="{ hiden: true }">删除</span>
                                <a class="like flex">
                                    <i class="like-icon block"></i>
                                    ({{ item.likedCount }})
                                </a>|
                                <a class="reply">回复</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br v-if="comments.offset === 0" />
            <br v-if="comments.offset === 0" />
            <h3 v-if="comments.offset === 0" class="com-titl">最新评论({{ comments.count }})</h3>
            <div v-for="item in comments.new" class="com-item flex" :key="item.user.userId">
                <div class="u-head">
                    <a>
                        <img :src="item.user.avatarUrl + '?param=50y50'" />
                    </a>
                </div>
                <div class="cntwarp">
                    <div>
                        <a href="#" class="c-u-name">{{ item.user.nickname }}</a>
                        : {{ item.content }}
                    </div>
                    <div class="operation">
                        <div class="rep" v-if="item.beReplied[0]">
                            <a
                                :href="'user/home?id=' + item.beReplied[0].user.userId"
                            >{{ item.beReplied[0].user.nickname }}:</a>
                            <span>{{ item.beReplied[0].content }}</span>
                        </div>
                        <div class="time">{{ turnTimeStr(item.timeStr) }}</div>
                        <div class="op-btn flex">
                            <span class="dlt" :class="{ hiden: true }">删除</span>
                            <a class="like flex">
                                <i class="like-icon block"></i>
                                ({{ item.likedCount }})
                            </a>|
                            <a class="reply">回复</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-turning fillWidth flex flex-item-center">
                <a @click="pageTurning.turn(-1)" class="prev">上一页</a>
                <a
                    @click="pageTurning.turn(1)"
                    class="page"
                    :class="{ active: pageTurning.active == 1 }"
                >1</a>
                <span v-if="pageTurning.active > 5">...</span>

                <a
                    v-for="item in pageTurning.arr"
                    @click="pageTurning.turn(item)"
                    class="page"
                    :class="{ active: pageTurning.active == item }"
                    :key="'pt_' + item"
                >{{ item }}</a>

                <span v-if="pageTurning.active < pageTurning.total - 4">...</span>
                <a
                    @click="pageTurning.turn(pageTurning.total)"
                    class="page"
                    :class="{ active: pageTurning.active == pageTurning.total }"
                >{{ pageTurning.total }}</a>
                <a @click="pageTurning.turn(0)" class="next">下一页</a>
            </div>
        </div>
    </div>
</template>
<style lang="less">
.comment-con {
    padding: 0 30px 40px 40px;
    min-height: 400px;
    height: auto;
    .comment-head {
        height: 33px;
        border-bottom: 2px solid #c20c0c;
        .txt {
            height: 29px;
            font: normal normal normal 20px/29px "Microsoft Yahei", Arial,
                Helvetica, sans-serif;
        }
        .com-count {
            margin: 9px 0 0 20px;
        }
    }
    .input-comment {
        height: 98px;
        margin: 20px 0;
        .userPic {
            width: 50px;
            height: 50px;
            margin-right: -100px;
            background: #666;
        }
        .com-ipt-box {
            width: 596px;
            margin-left: 112px;
            .com-inp {
                height: 63px;
                .inp-area-arrows {
                    z-index: 1;
                    top: 12px;
                    left: -6px;
                    width: 12px;
                    height: 12px;
                    border: 1px solid #cdcdcd;
                    transform: rotateZ(45deg);
                }
                .inp-area {
                    z-index: 2;
                    resize: none;
                    height: 50px;
                    padding: 5px 6px 6px;
                    border: 1px solid #cdcdcd;
                    border-radius: 2px;
                    box-sizing: content-box;
                    font: normal normal normal 12px/19px Arial, Helvetica,
                        sans-serif;
                    outline: 0;
                }
            }
            .com-btns {
                margin-top: 10px;
                height: 25px;
                line-height: 25px;
                i {
                    float: left;
                    width: 18px;
                    height: 18px;
                    margin: 0 10px 0 0;
                    display: block;
                }
                .eit {
                    background: url("../../../assets/img/icon.png") no-repeat -60px -490px;
                }
                .meme {
                    background: url("../../../assets/img/icon.png") no-repeat -40px -490px;
                }
                span {
                    float: right;
                    margin-right: 10px;
                }
                a {
                    float: right;
                    width: 46px;
                    height: 25px;
                    color: #fff;
                    text-align: center;
                    font: normal normal normal 12px/25px Arial, Helvetica,
                        sans-serif;
                    background: url("../../../assets/img/button.png") no-repeat -84px -64px;
                }
                .comOverWarn {
                    color: red;
                }
            }
        }
    }
    .com-titl {
        height: 20px;
        border-bottom: 1px solid #cfcfcf;
    }
    .com-item {
        padding: 15px 0;
        border-top: 1px solid #ccc;
        .u-head {
            width: 50px;
            height: 50px;
        }
        .cntwarp {
            margin-left: 10px;
            .c-u-name {
                color: #0c73c2;
                line-height: 20px;
            }
            a {
                cursor: pointer;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
            .operation {
                height: 16px;
                width: 610px;
                margin-top: 15px;
                font: normal normal normal 12px/16px Arial, Helvetica,
                    sans-serif;
                .rep {
                    word-wrap: break-word;
                    padding: 8px 19px;
                    margin-bottom: 10px;
                    line-height: 20px;
                    background: #f4f4f4;
                    border: 1px solid #dedede;
                    a {
                        color: #0c73c2;
                        margin-right: 5px;
                    }
                }
                .time {
                    float: left;
                    .dlt {
                        margin-right: 10px;
                    }
                }
                .op-btn {
                    float: right;
                    .like {
                        margin-right: 10px;
                        .like-icon {
                            width: 15px;
                            height: 14px;
                            margin-right: 5px;
                            background: url("../../../assets/img/icon2.png")
                                no-repeat -150px 0;
                        }
                    }
                    .reply {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
    .page-turning {
        height: 26px;
        margin-top: 10px;
        justify-content: center;
        a {
            display: block;
            margin: 0 2px;
            cursor: pointer;
            line-height: 24px;
            border-radius: 2px;
            border: 1px solid #ccc;
        }
        .prev {
            width: 57px;
            height: 24px;
            padding-right: 10px;
            text-align: right;
            background: url("../../../assets/img/button.png") no-repeat 0 -560px;
        }
        .next {
            width: 57px;
            height: 24px;
            padding-left: 10px;
            text-align: left;
            background: url("../../../assets/img/button.png") no-repeat -75px -560px;
        }
        .page {
            height: 22px;
            padding: 0 8px;
        }
        .active {
            color: #fff;
            background: #c20c0c;
        }
    }
}
</style>