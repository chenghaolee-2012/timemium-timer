<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ClockView from './components/ClockView.vue'
import TimerView from './components/TimerView.vue'
import CountdownView from './components/CountdownView.vue'

type ViewType = 'clock' | 'timer' | 'countdown'

const currentView = ref<ViewType>('clock')
const isFullscreen = ref(false)
const isMac = ref(false)

const views = [
  { id: 'clock' as ViewType, name: '时钟', icon: '/icons/clock.svg' },
  { id: 'timer' as ViewType, name: '计时器', icon: '/icons/timer.svg' },
  { id: 'countdown' as ViewType, name: '倒计时', icon: '/icons/alarm.svg' },
]

const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'clock': return ClockView
    case 'timer': return TimerView
    case 'countdown': return CountdownView
    default: return ClockView
  }
})

function switchView(viewId: ViewType) {
  currentView.value = viewId
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  isMac.value = navigator.platform.toLowerCase().includes('mac')
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <div class="app">
    <div class="drag-region"></div>
    <nav class="side-bar">
      <div class="nav-header" :class="{ 'mac-offset': isMac }">
        <img :src="'/icon.png'" alt="Timemium" class="app-icon" />
        <div class="app-title">
          <span>TIME</span>
          <span>MIUM</span>
        </div>
      </div>
      <div class="nav-items">
        <button 
          v-for="view in views" 
          :key="view.id"
          class="nav-item"
          :class="{ active: currentView === view.id }"
          @click="switchView(view.id)"
        >
          <img :src="view.icon" :alt="view.name" class="nav-icon" />
          <span class="nav-name">{{ view.name }}</span>
        </button>
      </div>
      <button class="nav-item fullscreen-btn" @click="toggleFullscreen">
        <img :src="'/icons/fullscreen.svg'" alt="全屏" class="nav-icon" />
        <span class="nav-name">{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
      </button>
    </nav>
    <div class="main-content">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #000000;
  color: #ffffff;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.drag-region {
  position: absolute;
  top: 0;
  left: 0;
  right: 120px;
  height: 40px;
  -webkit-app-region: drag;
  z-index: 100;
}

.side-bar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 120px;
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.nav-header.mac-offset {
  margin-top: 20px;
}

.app-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
}

.app-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75em;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.1em;
  line-height: 1.3;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 7px;
  margin-left: 7px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  width: 85px;
  height: 85px;
  border: none;
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 6px;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-icon {
  width: 32px;
  height: 32px;
  filter: invert(1) brightness(0.7);
}

.nav-item.active .nav-icon {
  filter: invert(1) brightness(1);
}

.nav-name {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.nav-item.active .nav-name {
  color: #fff;
  font-weight: 600;
}

.fullscreen-btn {
  height: 60px;
}

.main-content {
  flex: 1;
  overflow: hidden;
}
</style>
