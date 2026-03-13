<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const isRunning = ref(false)
const startTime = ref(0)
const elapsedTime = ref(0)
const lapTimes = ref<number[]>([])
let timer: number | null = null

const displayTime = computed(() => {
  const totalSeconds = Math.floor(elapsedTime.value / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const ms = Math.floor((elapsedTime.value % 1000) / 10)
  
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    ms: String(ms).padStart(2, '0')
  }
})

function start() {
  if (isRunning.value) return
  isRunning.value = true
  startTime.value = Date.now() - elapsedTime.value
  timer = window.setInterval(() => {
    elapsedTime.value = Date.now() - startTime.value
  }, 10)
}

function pause() {
  if (!isRunning.value) return
  isRunning.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function reset() {
  pause()
  elapsedTime.value = 0
  lapTimes.value = []
}

function lap() {
  if (!isRunning.value) return
  lapTimes.value.push(elapsedTime.value)
}

function formatLapTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10)
  
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="timer-view">
    <div class="timer-display">
      <span class="time-hours">{{ displayTime.hours }}</span>
      <span class="separator">:</span>
      <span class="time-minutes">{{ displayTime.minutes }}</span>
      <span class="separator">:</span>
      <span class="time-seconds">{{ displayTime.seconds }}</span>
      <span class="separator">.</span>
      <span class="time-ms">{{ displayTime.ms }}</span>
    </div>
    
    <div class="controls">
      <button class="btn btn-start" @click="start" :disabled="isRunning">
        <img src="/icons/timer_start.svg" alt="开始" />
        <span>开始</span>
      </button>
      <button class="btn btn-pause" @click="pause" :disabled="!isRunning">
        <img src="/icons/pause.svg" alt="暂停" />
        <span>暂停</span>
      </button>
      <button class="btn btn-lap" @click="lap" :disabled="!isRunning">
        <img src="/icons/timer.svg" alt="计次" />
        <span>计次</span>
      </button>
      <button class="btn btn-reset" @click="reset">
        <img src="/icons/timer_off.svg" alt="重置" />
        <span>重置</span>
      </button>
    </div>
    
    <div class="lap-times" v-if="lapTimes.length > 0">
      <div class="lap-header">计次记录</div>
      <div class="lap-list">
        <div class="lap-item" v-for="(lap, index) in lapTimes" :key="index">
          <span class="lap-number">第 {{ lapTimes.length - index }} 次</span>
          <span class="lap-time">{{ formatLapTime(lap) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timer-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #000000;
  color: #fff;
  padding: 20px;
  overflow-y: auto;
}

.timer-display {
  font-size: 10vw;
  font-weight: 200;
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin: 30px 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  flex-wrap: wrap;
}

.time-hours, .time-minutes, .time-seconds {
  display: inline-block;
  min-width: 1.2em;
  text-align: center;
}

.time-ms {
  font-size: 0.5em;
  color: #a0a0a0;
}

.separator {
  margin: 0 0.02em;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

.btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 60px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.2em;
  transition: all 0.2s ease;
  gap: 10px;
  padding: 0 20px;
}

.btn img {
  width: 24px;
  height: 24px;
  filter: invert(1) brightness(1);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-start {
  background: #22c55e;
  color: #fff;
}

.btn-start:active:not(:disabled) {
  transform: scale(0.95);
  background: #16a34a;
}

.btn-pause {
  background: #f59e0b;
  color: #fff;
}

.btn-pause:active:not(:disabled) {
  transform: scale(0.95);
  background: #d97706;
}

.btn-lap {
  background: #3b82f6;
  color: #fff;
}

.btn-lap:active:not(:disabled) {
  transform: scale(0.95);
  background: #2563eb;
}

.btn-reset {
  background: #ef4444;
  color: #fff;
}

.btn-reset:active:not(:disabled) {
  transform: scale(0.95);
  background: #dc2626;
}

.lap-times {
  width: 100%;
  max-width: 600px;
}

.lap-header {
  font-size: 1.5em;
  text-align: center;
  margin-bottom: 15px;
  color: #a0a0a0;
}

.lap-list {
  max-height: 300px;
  overflow-y: auto;
}

.lap-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
}

.lap-number {
  color: #a0a0a0;
}

.lap-time {
  font-family: monospace;
  font-size: 1.3em;
}
</style>
