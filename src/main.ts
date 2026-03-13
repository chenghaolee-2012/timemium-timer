import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// Check if ipcRenderer is available
if ((window as any).ipcRenderer) {
  (window as any).ipcRenderer.on('main-process-message', (_event: any, message: any) => {
    console.log(message)
  })
}
