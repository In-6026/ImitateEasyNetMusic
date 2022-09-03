import { createApp } from 'vue';
import App from './App.vue';

import router from './routes/router';

import Axios from './utils/Axios';
import Player from './utils/Player';
import mitter from './utils/mitter';

import store from './store';
const app = createApp(App);

app.config.globalProperties.Axios = Axios;
app.config.globalProperties.Player = Player;
app.config.globalProperties.mitter = mitter;

app.use(router);
app.use(store);

app.mount('#app');



