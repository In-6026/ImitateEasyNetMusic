<script setup lang="ts">
import useCurrentInstance from '../../hooks/useCurrentInstance'
import { reactive } from 'vue'

const $route = useCurrentInstance()?.$route
const $router = useCurrentInstance()?.$router

const menu = reactive({
  itemPath: [
    'rec-recommend',
    'rec-toplist',
    'rec-playlist',
    'rec-djradio',
    'rec-artist',
    'rec-album'
  ],
  itmes: [
    { name: '推荐', href: '' },
    { name: '排行榜', href: '/toplist' },
    { name: '歌单', href: '/playlist' },
    { name: '主播电台', href: '/djradio' },
    { name: '歌手', href: '/artist' },
    { name: '新碟上架', href: '/album' }
  ],
  index: 0,
  initItem() {
    const currentPath = $route?.matched[2]
      ? ($route?.matched[2].name as string)
      : 'rec-recommend'
    menu.index = menu.itemPath.indexOf(currentPath)
  },
  changeItem(index: number) {
    menu.index = index
  }
})
//为原地刷新
menu.initItem()
//为间接跳转
$router?.afterEach(to => {
  //子菜单调位
  const name = to?.matched[2] ? (to?.matched[2].name as string) : ''
  menu.changeItem(menu.itemPath.indexOf(name))
})
</script>
<template>
  <div class="menu-child-container">
    <div class="menu-children">
      <ul class="menu-child-list flex flex-item-center">
        <li v-for="(item, index) in menu.itmes" class="fillHeight" :key="item.name">
          <router-link :to="'/discover' + item.href" class="href">
            <em @click="menu.changeItem(index)" class="fillHeight text-center"
              :class="{ menuChildActive: index === menu.index }">{{ item.name }}</em>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
  <!-- <Recommend v-if="menu.index == 0" /> -->
  <router-view></router-view>
</template>
<style lang="less" scoped>
.menu-child-container {
  width: 100%;
  height: auto;
  background: #c20c0c;
  border-bottom: 1px solid #a40011;
}

.menu-children {
  width: 1100px;
  height: auto;
  margin: auto;
}

.menu-child-list {
  padding-left: 255px;

  li {
    height: 100px;
    list-style: none;
    color: #fff;
    height: 34px;
    line-height: 34px;
    margin: 0 17px;

    .href {
      color: #fff;

      em {
        display: inline-block;
        font-style: normal;
        height: 20px;
        line-height: 20px;
        border-radius: 20px;
        padding: 0 13px;
      }

      :hover,
      .menuChildActive {
        background: #9b0909;
      }
    }
  }
}
</style>