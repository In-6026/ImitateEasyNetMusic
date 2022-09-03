
<script setup lang="ts">
import useGlobalProperties from '@/hooks/useGlobalProperties';
import useCurrentInstance from '@/hooks/useCurrentInstance';
import { reactive, } from 'vue';
const Axios = useGlobalProperties('Axios');

const $route = useCurrentInstance()?.$route;
const $router = useCurrentInstance()?.$router;

// 热门新碟
interface Album {
    id: number
    name: string
    picUrl: string
    artist: {
        id: number
        name: string
    }
}
interface Albums {
    total: number
    albums: Array<Album>
}
let newestAlbum = reactive({
    data: [],
    hover: -1
} as {
    data: Array<Album>
    hover: number
})
Axios.get('/album/newest').then((data: Albums) => {
    newestAlbum.data = data.albums.slice(0, 10);
}).catch((reson: string) => {
    throw reson;
})
//监听路由
$router?.afterEach((to) => {
    console.log('album')
    let area = to?.query.area as string || 'ALL';
    let active = parseInt(to?.query.index as string) || 1;
    albumArea.navigation(area, active)
    albumArea.turn(active);
    getTypeAlbum();
})
// 新碟类型
let albumArea = reactive({
    data: [],
    hover: -1,
    area: 'ALL',
    active: 1,
    total: 0,
    arr: [2, 3, 4, 5, 6, 7, 8],
    navigation(area: string, active: number) {
        albumArea.area = area;
        albumArea.active = active;
    },
    turn(index: number) {
        index == 0
            ? albumArea.active++
            : index == -1 ? albumArea.active-- : albumArea.active = index;
        albumArea.arr = [];
        if (albumArea.active > 5 && albumArea.active < albumArea.total - 4) {
            for (let i = albumArea.active - 3; i <= albumArea.active + 3; i++) {
                albumArea.arr.push(i);
            }
        } else if (albumArea.active <= 5) {
            albumArea.arr = [2, 3, 4, 5, 6, 7, 8];
        } else {
            for (let i = albumArea.total - 7; i < albumArea.total; i++) {
                albumArea.arr.push(i);
            }
        }
    }
} as {
    data: Array<Album>
    hover: number
    area: string
    active: number
    total: number
    arr: Array<number>
    navigation: Function
    turn: Function
})
//获取新碟
const getTypeAlbum = () => {
    const url = `/album/new?area=${albumArea.area}&limit=35&offset=${(albumArea.active - 1) * 35}`;
    Axios.get(url).then((data: Albums) => {
        albumArea.data = data.albums;
        albumArea.total = Math.ceil(data.total / 35);
    }).catch((reson: string) => {
        throw reson;
    })
}
//初始化typeAlbum
albumArea.navigation(
    $route?.query.area as string || 'ALL',
    parseInt($route?.query.index as string) || 1
);
getTypeAlbum();
</script>
<template>
    <div class="album-con">
        <div class="head">
            <h3>
                <span>热门新碟</span>
            </h3>
        </div>
        <ul class="album-ul flex flex-warp">
            <li v-for="(item, index) in newestAlbum.data" :key="item.id">
                <div
                    @mouseover="newestAlbum.hover = index"
                    @mouseleave="newestAlbum.hover = -1"
                    class="a-cover relative"
                >
                    <img
                        :src="item.picUrl + '?param=130y130'"
                        width="130"
                        height="130"
                        loading="lazy"
                    />
                    <router-link :to="'/album?id=' + item.id" class="block msk absolute"></router-link>
                    <a v-show="newestAlbum.hover == index" class="absolute icon-ply pointer"></a>
                </div>
                <p class="fillWidth dec">
                    <router-link
                        :to="'/album?id=' + item.id"
                        class="text-decoration-none pointer al-n"
                    >{{ item.name }}</router-link>
                </p>
                <p class="fillWidth f-thide">
                    <span>
                        <router-link
                            :to="'/artist?id=' + item.artist.id"
                            class="text-decoration-none pointer ar-n"
                        >{{ item.artist.name }}</router-link>
                    </span>
                </p>
            </li>
        </ul>
        <div class="head flex">
            <h3>
                <span>全部新碟</span>
            </h3>
            <div class="flex">
                <router-link to="/discover/album?area=ALL&index=1" class="href pointer">全部</router-link>
                <span>|</span>
                <router-link to="/discover/album?area=ZH&index=1" class="href pointer">华语</router-link>
                <span>|</span>
                <router-link to="/discover/album?area=EA&index=1" class="href pointer">欧美</router-link>
                <span>|</span>
                <router-link to="/discover/album?area=KR&index=1" class="href pointer">韩国</router-link>
                <span>|</span>
                <router-link to="/discover/album?area=JP&index=1" class="href pointer">日本</router-link>
            </div>
        </div>
        <ul class="album-ul flex flex-warp">
            <li v-for="(item, index) in albumArea.data" :key="item.id">
                <div
                    @mouseover="albumArea.hover = index"
                    @mouseleave="albumArea.hover = -1"
                    class="a-cover relative"
                >
                    <img
                        :src="item.picUrl + '?param=130y130'"
                        width="130"
                        height="130"
                        loading="lazy"
                    />
                    <router-link :to="'/album?id=' + item.id" class="block msk absolute"></router-link>
                    <a v-show="albumArea.hover == index" class="absolute icon-ply pointer"></a>
                </div>
                <p class="fillWidth dec">
                    <router-link
                        :to="'/album?id=' + item.id"
                        class="text-decoration-none pointer al-n"
                    >{{ item.name }}</router-link>
                </p>
                <p class="fillWidth f-thide">
                    <span>
                        <router-link
                            :to="'/artist?id=' + item.artist.id"
                            class="text-decoration-none pointer ar-n"
                        >{{ item.artist.name }}</router-link>
                    </span>
                </p>
            </li>
        </ul>
        <!-- page turn machine -->
        <div class="page-turning fillWidth flex flex-item-center">
            <router-link
                :to="'?area=' + albumArea.area + '&index=' + (albumArea.active - 1)"
                @click="albumArea.turn(-1)"
                class="prev"
            >上一页</router-link>
            <router-link
                :to="'?area=' + albumArea.area + '&index=1'"
                @click="albumArea.turn(1)"
                class="page"
                :class="{ active: albumArea.active == 1 }"
            >1</router-link>
            <span v-show="albumArea.active > 5">...</span>

            <router-link
                v-for="item in albumArea.arr"
                :to="'?area=' + albumArea.area + '&index=' + item"
                @click="albumArea.turn(item)"
                class="page"
                :class="{ active: albumArea.active == item }"
                :key="'al_' + item"
            >{{ item }}</router-link>

            <span v-show="albumArea.active < albumArea.total - 4">...</span>
            <router-link
                :to="'?area=' + albumArea.area + '&index=' + albumArea.total"
                @click="albumArea.turn(albumArea.total)"
                class="page"
                :class="{ active: albumArea.active == albumArea.total }"
            >{{ albumArea.total }}</router-link>
            <router-link
                :to="'?area=' + albumArea.area + '&index=' + (albumArea.active + 1)"
                @click="albumArea.turn(0)"
                class="next"
            >下一页</router-link>
        </div>
    </div>
</template>
<style lang="less" scoped>
@img: "../../../assets/img/";
.album-con {
    width: 900px;
    height: auto;
    margin: 0 auto;
    padding: 40px;

    .head {
        width: 900px;
        height: 40px;
        border-bottom: 2px solid #c20c0c;
        h3 {
            font: normal normal normal 24px/40px "Microsoft Yahei", Arial,
                Helvetica, sans-serif;
        }
        div {
            height: 16px;
            margin: 16px 0 0 20px;
            .href {
                color: #666;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
            span {
                margin: 0 10px;
                color: #c7c7c7;
            }
        }
    }
    .album-ul {
        margin-top: 20px;
        justify-content: space-between;
        li {
            list-style: none;
            margin: 0 23px 30px 0px;
            .a-cover {
                width: 130px;
                height: 130px;
                .msk {
                    top: 0;
                    left: 0;
                    width: 153px;
                    height: 130px;
                    background: url("@{img}coverall.png") no-repeat 0 -845px;
                }
                .icon-ply {
                    right: 10px;
                    bottom: 5px;
                    width: 28px;
                    height: 28px;
                    background: url("@{img}iconall.png") no-repeat 0 -140px;
                    &:hover {
                        background-position: 0 -170px;
                    }
                }
            }
            .dec,
            .f-thide {
                width: 130px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: normal;
            }
            .dec {
                height: 20px;
                font-size: 14px;
                line-height: 20px;
                margin: 8px 0 3px;
                .al-n {
                    color: #000;
                }
            }
            .f-thide {
                .ar-n {
                    color: #999;
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
            color: #000;
            text-decoration: none;
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