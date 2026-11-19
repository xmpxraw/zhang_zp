<script setup>
import { computed, nextTick, ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  view: { type: String, required: true },
  branchKey: { type: String, required: true },
  branches: { type: Array, required: true }
})
const emit = defineEmits(['update:view', 'update:branchKey'])

const chipsEl = ref(null)
const hasMore = ref(false)
const atEnd = ref(false)

const options = computed(() => [
  { key: 'all', title: '全部' },
  ...props.branches.map((b) => ({ key: b.key, title: b.title }))
])

function updateMask() {
  const el = chipsEl.value
  if (!el) return
  hasMore.value = el.scrollWidth - el.clientWidth > 4
  atEnd.value = hasMore.value && el.scrollLeft > el.scrollWidth - el.clientWidth - 4
}

onMounted(() => {
  updateMask()
  window.addEventListener('resize', updateMask)
  chipsEl.value?.addEventListener('scroll', updateMask, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', updateMask))
watch(options, () => nextTick(updateMask))
</script>

<template>
  <header class="top">
    <div class="bar">
      <h1>张氏族谱</h1>
      <div class="seg" role="group" aria-label="视图切换">
        <button
          type="button"
          :aria-pressed="view === 'tree'"
          @click="emit('update:view', 'tree')"
        >图谱</button>
        <button
          type="button"
          :aria-pressed="view === 'text'"
          @click="emit('update:view', 'text')"
        >文字</button>
      </div>
    </div>
    <nav
      ref="chipsEl"
      class="chips"
      :class="{ more: hasMore, end: atEnd }"
      aria-label="分支筛选"
    >
      <button
        v-for="opt in options"
        :key="opt.key"
        type="button"
        class="chip"
        :aria-pressed="branchKey === opt.key"
        @click="emit('update:branchKey', opt.key)"
      >{{ opt.title }}</button>
    </nav>
  </header>
</template>
