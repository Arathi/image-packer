import { createApp } from 'vue';

// import vant from 'vant';
// import 'vant/lib/index.css';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from './PackerApp.vue';

let app = createApp(App);
app.use(ElementPlus);

app.mount(
  (() => {
    const appNode = document.createElement('div');
    document.body.append(appNode);
    return appNode;
  })(),
);