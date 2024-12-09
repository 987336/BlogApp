import { createApp } from 'vue'; // For Vue 3
import App from './App.vue';
import router from './router';
import store from './store'; // Import the store
import Toast, { POSITION } from 'vue-toastification';
import '@fortawesome/fontawesome-free/css/all.css'; // Import Font Awesome CSS
import 'vue-toastification/dist/index.css'; // Import default styles

const app = createApp(App);
// Use Toastification
app.use(Toast, {
    position: POSITION.TOP_RIGHT, // Adjust the position as needed
  });
  app.use(store); // Use the store
app.use(router);
app.mount('#app');
