<script setup>
import PersonCard from './PersonCard.vue'

defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 }
})
const emit = defineEmits(['open'])
</script>

<template>
  <div class="node">
    <PersonCard :node="node" :depth="depth" @open="emit('open', $event)" />
    <ul v-if="node.children && node.children.length">
      <li v-for="child in node.children" :key="child.name">
        <TreeNode :node="child" :depth="depth + 1" @open="emit('open', $event)" />
      </li>
    </ul>
  </div>
</template>
