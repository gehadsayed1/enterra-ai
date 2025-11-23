import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/index'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  position: "bottom-right",
  timeout: 2500,
  closeOnClick: true,
  pauseOnHover: true,
};



const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Toast, options);
app.mount('#app')



