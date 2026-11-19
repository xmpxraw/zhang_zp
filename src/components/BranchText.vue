<script setup>
import { computed } from 'vue'

const props = defineProps({ branch: { type: Object, required: true } })
const emit = defineEmits(['goto', 'jump'])

const levels = computed(() => {
  const out = []
  const walk = (node, depth, parent) => {
    if (!out[depth]) out[depth] = []
    out[depth].push({ node, parent })
    ;(node.children || []).forEach((child) => walk(child, depth + 1, node))
  }
  walk(props.branch.root, 0, null)
  const labels = props.branch.textGens || props.branch.gens
  return out.map((list, depth) => ({ label: labels[depth] || '', people: list }))
})

const yearOf = (node) => node.yrFull || node.yr || ''
const spouseYear = (node) => (node.spouse ? node.spouse.yrFull || node.spouse.yr || '' : '')
</script>

<template>
  <section class="tb">
    <h2>{{ branch.title }}</h2>
    <div v-for="(level, i) in levels" :key="i" class="tg">
      <div class="gl">{{ level.label }}</div>
      <div>
        <div
          v-for="entry in level.people"
          :id="`p-${entry.node.name}`"
          :key="entry.node.name"
          class="pe"
        >
          <div class="h">
            <span class="n" title="在图谱中查看" @click="emit('goto', entry.node.name)">
              {{ entry.node.name }}
            </span>
            <span v-if="yearOf(entry.node)" class="y">{{ yearOf(entry.node) }}</span>
          </div>

          <div v-if="entry.parent" class="r">
            <b>父母</b>
            <span class="lk" @click="emit('jump', entry.parent.name)">{{ entry.parent.name }}</span>
            <template v-if="entry.parent.spouse"> · {{ entry.parent.spouse.name }}</template>
          </div>

          <div v-if="entry.node.spouse" class="r">
            <b>配偶</b>{{ entry.node.spouse.name }}<template v-if="spouseYear(entry.node)">　{{ spouseYear(entry.node) }}</template>
          </div>

          <div v-if="entry.node.children && entry.node.children.length" class="r">
            <b>子女</b>
            <template v-for="(child, idx) in entry.node.children" :key="child.name">
              <span class="lk" @click="emit('jump', child.name)">{{ child.name }}</span>
              <template v-if="idx < entry.node.children.length - 1">、</template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
