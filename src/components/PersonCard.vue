<script setup>
const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 }
})
const emit = defineEmits(['open'])
</script>

<template>
  <div
    class="card"
    :class="{ cp: node.spouse }"
    :data-depth="depth"
    :data-id="node.name"
    tabindex="0"
    title="查看文字详情"
    @click="emit('open', node.name)"
    @keydown.enter.prevent="emit('open', node.name)"
    @keydown.space.prevent="emit('open', node.name)"
  >
    <template v-if="node.spouse">
      <div class="p">
        <span class="nm">{{ node.name }}</span>
        <span v-if="node.yr" class="yr">{{ node.yr }}</span>
      </div>
      <div class="p">
        <span class="nm">{{ node.spouse.name }}</span>
        <span v-if="node.spouse.yr" class="yr">{{ node.spouse.yr }}</span>
      </div>
    </template>
    <template v-else>
      <span class="nm">{{ node.name }}</span>
      <span v-if="node.yr" class="yr">{{ node.yr }}</span>
    </template>
  </div>
</template>
