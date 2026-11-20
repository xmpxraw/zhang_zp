<script setup>
import { computed } from 'vue'
import BranchText from './BranchText.vue'

const props = defineProps({
  branches: { type: Array, required: true },
  filterKey: { type: String, default: 'all' }
})
const emit = defineEmits(['goto', 'jump'])

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
  <main class="text-view">
    <div
      v-for="group in groupList"
      :key="group.id"
      class="tgrid"
      :class="`tgrid-${group.id}`"
    >
      <BranchText
        v-for="branch in group.items"
        :key="branch.key"
        :branch="branch"
        @goto="emit('goto', $event)"
        @jump="emit('jump', $event)"
      />
    </div>
  </main>
</template>
