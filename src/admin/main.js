import {createApp} from 'vue';
import App from './app';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styl/admin.styl';

const index = createApp(App);
index.mount('#app');
