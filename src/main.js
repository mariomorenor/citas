import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Oruga 
import Oruga from '@oruga-ui/oruga-next';

// import Oruga Bootstrap theme config
import { bootstrapConfig } from '@oruga-ui/theme-bootstrap'

// import Bootstrap and Oruga styling
import '@oruga-ui/theme-bootstrap/dist/bootstrap.css'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Oruga, bootstrapConfig);

app.mount('#app');
