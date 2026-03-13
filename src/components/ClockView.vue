<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const now = ref(new Date())
let timer: number | null = null

const hours = ref('')
const minutes = ref('')
const seconds = ref('')
const dateStr = ref('')
const weekDay = ref('')

const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

function updateTime() {
  now.value = new Date()
  hours.value = String(now.value.getHours()).padStart(2, '0')
  minutes.value = String(now.value.getMinutes()).padStart(2, '0')
  seconds.value = String(now.value.getSeconds()).padStart(2, '0')
  
  const year = now.value.getFullYear()
  const month = String(now.value.getMonth() + 1).padStart(2, '0')
  const day = String(now.value.getDate()).padStart(2, '0')
  dateStr.value = `${year}年${month}月${day}日`
  
  weekDay.value = weekDays[now.value.getDay()]
}

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="clock-view">
    <div class="time-container">
      <div class="time">
        <span class="hour">{{ hours }}</span>
        <span class="separator">:</span>
        <span class="minute">{{ minutes }}</span>
        <span class="separator">:</span>
        <span class="second">{{ seconds }}</span>
      </div>
      <div class="date">
        <span class="date-text">{{ dateStr }}</span>
        <span class="weekday">{{ weekDay }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clock-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #000000;
  color: #fff;
  padding: 20px;
}

.time-container {
  text-align: center;
}

.time {
  font-size: 12vw;
  font-weight: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.02em;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.hour, .minute, .second {
  display: inline-block;
  min-width: 1.8em;
  text-align: center;
}

.second {
  color: #e94560;
}

.separator {
  animation: blink 1s infinite;
  margin: 0 0.02em;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.date {
  margin-top: 15px;
  font-size: 3vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0.9;
}

.date-text {
  font-weight: 300;
}

.weekday {
  font-size: 0.6em;
  color: #a0a0a0;
}
</style>
