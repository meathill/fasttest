import { createApp } from 'vue';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styl/admin.styl';
import router from './router';
import store from './store';

const index = createApp(App);
index
  .use(router)
  .use(store)
  .mount('#app');
