<script setup>
import { computed } from 'vue'
import BranchTree from './BranchTree.vue'

const props = defineProps({
  branches: { type: Array, required: true },
  filterKey: { type: String, default: 'all' }
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
      <BranchTree
        v-for="branch in group.items"
        :key="`${branch.key}-${filterKey}`"
        :branch="branch"
        @open="emit('open', $event)"
      />
    </div>
    <p class="hint">点击卡片查看文字详情</p>
  </main>
</template>
