
<script lang="ts" setup>
import useCurrentInstance from '@/hooks/useCurrentInstance';
import Axios from '@/utils/Axios';
import { reactive, } from 'vue'
const $route = useCurrentInstance()?.$route;
const $router = useCurrentInstance()?.$router;

$router?.afterEach((to) => {
    manager.fillName(to);
    manager.initParam(to);
    if (to?.query.initial) {
        manager.initial = to?.query.initial as string;
    }
    manager.getSinger();
});
interface Singer {
    id: number
    name: string
    picUrl: string
}

const manager = reactive({
    singer: [],
    id: '',
    name: '',
    type: '',
    area: '',
    initial: '热门',
    initialList: ['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '其他'],
    fillName(route: any) {
        const area = ['华语', '欧美', '日本', '韩国', '其他']
        const type = ['男歌手', '女歌手', '组合/乐队']
        manager.name = area[
            ~~(route?.query.id?.at(0) as string) - 1
        ] + type[
            ~~(route?.query.id?.at(-1) as string) - 1
            ];
    },
    initParam(route: any) {
        manager.id = route?.query.id as string || '1001'
        manager.type = route?.query.type as string || '-1'
        manager.area = route?.query.area as string || '-1'
        if (!route?.query.initail) {
            manager.initial = '热门'
        }
    },
    getSinger() {
        let url = `/artist/list?type=${manager.type}&area=${manager.area}&limit=100&offset=0`;
        if (manager.initial === '热门') {
            url += `&initial=-1`;
        } else if (manager.initial === '其他') {
            url += `&initial=0`;
        } else {
            url += `&initial=${manager.initial}`;
        }
        Axios.get(url).then((data: any) => {
            manager.singer = data.artists;
        }).catch((reson: string) => {
            throw reson;
        })
    }
} as {
    singer: Array<Singer>
    id: string
    name: string
    type: string
    area: string
    initial: string
    fillName: Function
    initialList: Array<string>
    initParam: Function
    getSinger: Function
})
manager.initParam($route);
manager.fillName($route);
manager.getSinger();
</script>
<template>
    <div class="head">
        <h3>
            <span>{{ manager.name }}</span>
        </h3>
    </div>
    <ul class="ini-ul flex list-none">
        <li v-for="ini in manager.initialList" class="fillHeight" :key="ini">
            <router-link
                :to="'/discover/artist/category?id=' + manager.id + '&type=' + manager.type + '&area=' + manager.area + '&initial=' + ini"
                class="ini text-decoration-none block"
                :class="{ active: ini === manager.initial }"
            >{{ ini }}</router-link>
        </li>
    </ul>

    <ul class="sgr-ul flex flex-warp list-none">
        <li v-for="singer in manager.singer.slice(0, 10)" :key="singer.id">
            <div class="relative">
                <img :src="singer.picUrl + '?param=130y130'" width="130" height="130" />
                <router-link
                    :to="'/musician?id=' + singer.id"
                    class="msk absolute fillWidth fillHeight"
                ></router-link>
            </div>
            <p>
                <router-link
                    :to="'/musician?id=' + singer.id"
                    class="name text-decoration-none"
                >{{ singer.name }}</router-link>
            </p>
        </li>
    </ul>

    <ul class="hot-sgr-ellipse flex flex-warp fillWidth">
        <li
            v-for="singer in manager.singer.slice(10)"
            class="list-none flex flex-item-center"
            :key="singer.id"
        >
            <router-link
                :to="'/musician?id=' + singer.id"
                class="text-decoration-none name-e fillHeight"
            >{{ singer.name }}</router-link>
            <router-link :to="'/user/home?id=' + singer.id" class="icon block"></router-link>
        </li>
    </ul>
</template>

<style lang="less" scoped>
@img: "../../../assets/img/";
.head {
    height: 40px;
    border-bottom: 2px solid #c20c0c;
    h3 {
        float: left;
        span {
            font: normal normal normal 24px/31px "Microsoft Yahei", Arial,
                Helvetica, sans-serif;
        }
    }
    .href {
        float: right;
        color: #666;
        margin-top: 14px;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
        &::after {
            clear: both;
        }
    }
}
.ini-ul {
    height: 24px;
    margin-top: 20px;
    justify-content: space-between;
    li {
        .ini {
            color: #000;
            height: 24px;
            font-size: 14px;
            padding: 0 5px;
            border-radius: 2px;
            line-height: 24px;
        }
        .active {
            color: #fff;
            background: #c20c0c;
        }
    }
}
.sgr-ul {
    margin-top: 20px;
    justify-content: space-between;
    li {
        width: 130px;
        height: 154px;
        padding-bottom: 30px;
        div {
            width: 130px;
            height: 130px;
            .msk {
                top: 0;
                left: 0;
                background: url("@{img}coverall.png") no-repeat 0 -680px;
            }
        }
        p {
            margin-top: 8px;
            .name {
                color: #000;
                max-width: 80%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: normal;
            }
        }
    }
}

.hot-sgr-ellipse {
    border-top: 1px dashed gray;
    li {
        width: 20%;
        height: 30px;
        .name-e {
            max-width: 105px;
            line-height: 30px;
            color: #000;
        }
        .icon {
            width: 17px;
            height: 18px;
            margin-left: 2px;
            background: url("@{img}icon.png") no-repeat 0 -740px;
        }
    }
}
</style>