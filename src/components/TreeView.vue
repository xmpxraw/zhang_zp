<script setup>
import { computed } from 'vue'
import BranchCanvas from './BranchCanvas.vue'

const props = defineProps({
  branches: { type: Array, required: true },
  filterKey: { type: String, default: 'all' },
  focusKey: { type: Number, default: 0 },
  focusName: { type: String, default: '' }
})
const emit = defineEmits(['open'])

const visible = computed(() =>
  props.filterKey === 'all'
    ? props.branches
    : props.branches.filter((b) => b.key === props.filterKey)
)

const groupList = computed(() =>
  ['main', 'a', 'b'].map((id) => ({
    id,
    items: visible.value.filter((b) => b.group === id)
  })).filter((g) => g.items.length)
)
</script>

<template>
  <main class="tree-view">
    <div
      v-for="group in groupList"
      :key="group.id"
      class="grid"
      :class="`grid-${group.id}`"
    >
      <BranchCanvas
        v-for="branch in group.items"
        :key="`${branch.key}-${filterKey}`"
        :branch="branch"
        :focus-key="focusKey"
        :focus-name="focusName"
        @open="emit('open', $event)"
      />
    </div>
    <p class="hint">点击卡片查看文字详情</p>
  </main>
</template>
