<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const isRunning = ref(false)
const remainingTime = ref(0)
let timer: number | null = null
const isSetMode = ref(true)

const displayTime = computed(() => {
  const totalSeconds = Math.floor(remainingTime.value / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
})

const isFinished = computed(() => {
  return !isSetMode.value && remainingTime.value <= 0 && !isRunning.value
})

function setTime() {
  const totalSeconds = hours.value * 3600 + minutes.value * 60 + seconds.value
  if (totalSeconds > 0) {
    remainingTime.value = totalSeconds * 1000
    isSetMode.value = false
  }
}

function start() {
  if (remainingTime.value <= 0) return
  isRunning.value = true
  const endTime = Date.now() + remainingTime.value
  timer = window.setInterval(() => {
    remainingTime.value = Math.max(0, endTime - Date.now())
    if (remainingTime.value <= 0) {
      pause()
    }
  }, 100)
}

function pause() {
  isRunning.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function reset() {
  pause()
  hours.value = 0
  minutes.value = 0
  seconds.value = 0
  remainingTime.value = 0
  isSetMode.value = true
}

function addTime(type: 'hours' | 'minutes' | 'seconds', amount: number) {
  if (type === 'hours') {
    hours.value = Math.max(0, Math.min(23, hours.value + amount))
  } else if (type === 'minutes') {
    minutes.value = Math.max(0, Math.min(59, minutes.value + amount))
  } else {
    seconds.value = Math.max(0, Math.min(59, seconds.value + amount))
  }
}

function setCommonTime(minutesValue: number) {
  hours.value = 0
  seconds.value = 0
  if (minutesValue >= 60) {
    hours.value = Math.floor(minutesValue / 60)
    minutesValue = minutesValue % 60
  }
  minutes.value = minutesValue
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="countdown-view">
    <div class="countdown-display" :class="{ finished: isFinished }">
      <template v-if="isSetMode">
        <div class="time-input-group">
          <div class="input-column">
            <button class="adj-btn" @click="addTime('hours', 1)">+</button>
            <div class="input-value">{{ String(hours).padStart(2, '0') }}</div>
            <button class="adj-btn" @click="addTime('hours', -1)">-</button>
            <span class="label">时</span>
          </div>
          <span class="separator">:</span>
          <div class="input-column">
            <button class="adj-btn" @click="addTime('minutes', 1)">+</button>
            <div class="input-value">{{ String(minutes).padStart(2, '0') }}</div>
            <button class="adj-btn" @click="addTime('minutes', -1)">-</button>
            <span class="label">分</span>
          </div>
          <span class="separator">:</span>
          <div class="input-column">
            <button class="adj-btn" @click="addTime('seconds', 1)">+</button>
            <div class="input-value">{{ String(seconds).padStart(2, '0') }}</div>
            <button class="adj-btn" @click="addTime('seconds', -1)">-</button>
            <span class="label">秒</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="time-display">
          <span class="time-hours">{{ displayTime.hours }}</span>
          <span class="separator">:</span>
          <span class="time-minutes">{{ displayTime.minutes }}</span>
          <span class="separator">:</span>
          <span class="time-seconds">{{ displayTime.seconds }}</span>
        </div>
        <div v-if="isFinished" class="finished-message">时间到！</div>
      </template>
    </div>
    
    <div class="controls">
      <template v-if="isSetMode">
        <div class="common-times">
          <div class="time-row">
            <button class="time-btn" @click="setCommonTime(1)">1分钟</button>
            <button class="time-btn" @click="setCommonTime(5)">5分钟</button>
            <button class="time-btn" @click="setCommonTime(10)">10分钟</button>
            <button class="time-btn" @click="setCommonTime(15)">15分钟</button>
          </div>
          <div class="time-row">
            <button class="time-btn" @click="setCommonTime(20)">20分钟</button>
            <button class="time-btn" @click="setCommonTime(25)">25分钟</button>
            <button class="time-btn" @click="setCommonTime(30)">30分钟</button>
            <button class="time-btn" @click="setCommonTime(60)">60分钟</button>
          </div>
        </div>
        <button class="btn btn-start" @click="setTime">
          <img src="/icons/timer_start.svg" alt="开始" />
          <span>开始倒计时</span>
        </button>
      </template>
      <template v-else>
        <button class="btn btn-start" @click="start" :disabled="isRunning || isFinished">
          <img src="/icons/timer_start.svg" alt="开始" />
          <span>开始</span>
        </button>
        <button class="btn btn-pause" @click="pause" :disabled="!isRunning">
          <img src="/icons/pause.svg" alt="暂停" />
          <span>暂停</span>
        </button>
        <button class="btn btn-reset" @click="reset">
          <img src="/icons/timer_off.svg" alt="重置" />
          <span>重置</span>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.countdown-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #000000;
  color: #fff;
  padding: 20px;
}

.countdown-display {
  text-align: center;
  margin-bottom: 40px;
}

.countdown-display.finished {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.time-input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.input-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.input-value {
  font-size: 8vw;
  font-weight: 200;
  min-width: 1.5em;
  text-align: center;
}

.label {
  font-size: 1.2em;
  color: #a0a0a0;
}

.adj-btn {
  width: 80px;
  height: 60px;
  font-size: 2em;
  border: none;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.adj-btn:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.95);
}

.time-display {
  font-size: 15vw;
  font-weight: 200;
  display: flex;
  align-items: baseline;
  justify-content: center;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.time-hours, .time-minutes, .time-seconds {
  display: inline-block;
  min-width: 1.2em;
  text-align: center;
}

.separator {
  margin: 0 0.02em;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.finished-message {
  font-size: 4em;
  color: #e94560;
  margin-top: 20px;
  text-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  max-width: 800px;
  margin: 0 auto;
}

.controls .common-times {
  flex: 1;
  min-width: 400px;
  margin: 0;
}

.controls .btn-start {
  flex-shrink: 0;
}

.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1.2em;
  transition: all 0.2s ease;
  gap: 10px;
}

.btn img {
  width: 40px;
  height: 40px;
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

.btn-reset {
  background: #ef4444;
  color: #fff;
}

.btn-reset:active:not(:disabled) {
  transform: scale(0.95);
  background: #dc2626;
}

.common-times {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.time-btn {
  flex: 1;
  min-width: 100px;
  padding: 12px 15px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  font-size: 1em;
  font-family: inherit;
  transition: all 0.2s ease;
  text-align: center;
}

.time-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.time-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}
</style>
