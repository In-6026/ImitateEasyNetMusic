import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: "",
    component: () => import('../components/Index.vue'),
    redirect: '/discover',
    children: [
      {
        path: 'discover', name: 'discover', component: () => import('../components/discoverModule/Discover.vue'),
        children: [
          { path: '', name: 'rec-recommend', component: () => import('../components/discoverModule/recommend/Recommend.vue') },
          { path: 'toplist', name: 'rec-toplist', component: () => import('../components/discoverModule/toplist/Toplist.vue') },
          { path: 'playlist', name: 'rec-playlist', component: () => import('../components/discoverModule/playlist/Playlist.vue') },
          {
            path: 'djradio', name: 'rec-djradio', component: () => import('../components/discoverModule/djradio/Djradio.vue'),
            children: [
              { path: 'rank', name: 'rank', component: () => import('../components/discoverModule/djradio/Rank.vue') },
              { path: 'category', name: 'djcategory', component: () => import('../components/discoverModule/djradio/Category.vue') }
            ]
          },
          {
            path: 'artist', name: 'rec-artist', component: () => import('../components/discoverModule/artist/Artist.vue'),
            children: [
              { path: '', name: 'art-recommend', component: () => import('../components/discoverModule/artist/Recommend.vue') },
              { path: 'signed', name: 'art-signed', component: () => import('../components/discoverModule/artist/Signed.vue') },
              { path: 'category', name: 'art-artcategory', component: () => import('../components/discoverModule/artist/Category.vue') }
            ]
          },
          { path: 'album', name: 'rec-album', component: () => import('../components/discoverModule/album/Album.vue') }
        ]
      },
      {
        path: 'my', name: 'my', component: () => import('../components/myModule/My.vue'), redirect: '/my/playlist',
        children: [
          { path: 'playlist', name: 'myplaylist', component: () => import('../components/myModule/Playlist.vue') },
          { path: 'artist', name: 'myartist', component: () => import('../components/myModule/Artist.vue') },
          { path: 'mv', name: 'mymv', component: () => import('../components/myModule/MV.vue') },
          { path: 'radio', name: 'myradio', component: () => import('../components/myModule/Radio.vue') },
        ]
      },
      { path: 'effect', name: 'effect', component: () => import('../components/effectModule/Effect.vue') },
      // { path: 'immersion', name: 'immersion', component: () => import('../components/immersionModule/Immersion.vue') },
      { path: 'song', name: 'song', component: () => import('../components/song/Song.vue') },
      { path: 'program', name: 'program', component: () => import('../components/publicModule/Program.vue') },
      { path: 'playlist', name: 'publicplaylist', component: () => import('../components/publicModule/Playlist.vue') },
      { path: 'album', name: 'publicalbum', component: () => import('../components/publicModule/Album.vue') },
      { path: 'search', name: 'publicsearch', component: () => import('../components/publicModule/Search.vue') },
      { path: '/immersion', name: 'immersion', component: () => import('../components/immersionModule/Immersion.vue') },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router