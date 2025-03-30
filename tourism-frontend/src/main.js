import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Global styles
import './assets/styles/main.scss';

// Create Vue app
const app = createApp(App);

// Use plugins
app.use(router);
app.use(store);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err);
  console.error('Info:', info);
  // Could also send to error tracking service like Sentry
};

// Mount the app
app.mount('#app');