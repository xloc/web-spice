import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
import { createPinia } from 'pinia'


const app = createApp(App)

app.use(VueMonacoEditorPlugin, {
  paths: {
    // You can change the CDN config to load other versions
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  },
})

app.use(createPinia())

app.mount('#app')
