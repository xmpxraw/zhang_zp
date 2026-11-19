<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({ branch: { type: Object, required: true } })
const emit = defineEmits(['open'])

const wrapEl = ref(null)
const treeEl = ref(null)
const gens = ref([])
const scrollable = ref(false)

function offsetWithin(node, root) {
  let x = 0
  let y = 0
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return { x, y }
}

function placeGens() {
  const tree = treeEl.value
  if (!tree) return
  const out = []
  props.branch.gens.forEach((label, depth) => {
    if (!label) return
    const cards = [...tree.querySelectorAll(`.card[data-depth="${depth}"]`)]
    if (!cards.length) return
    const pos = cards.map((c) => offsetWithin(c, tree))
    const left = Math.min(...pos.map((p) => p.x))
    out.push({ label, top: pos[0].y, left: Math.max(0, left - 42) })
  })
  gens.value = out
}

async function layout() {
  const wrap = wrapEl.value
  const tree = treeEl.value
  if (!wrap || !tree) return

  tree.style.transform = ''
  wrap.style.height = ''
  wrap.style.overflowX = ''
  wrap.style.overflowY = ''
  wrap.style.justifyContent = ''
  scrollable.value = false

  await nextTick()

  const avail = wrap.clientWidth
  const natural = tree.offsetWidth
  if (!avail || !natural) return
  const raw = avail / natural

  if (raw < 1 && raw >= 0.45) {
    const s = Math.max(0.45, Math.floor(raw * 990) / 1000)
    wrap.style.justifyContent = 'center'
    tree.style.transform = `scale(${s})`
    await nextTick()
    wrap.style.height = Math.ceil(tree.offsetHeight * s) + 'px'
    wrap.style.overflowX = 'clip'
    wrap.style.overflowY = 'clip'
  } else {
    const box = natural - avail
    wrap.style.justifyContent = box > 4 ? 'flex-start' : 'center'
    if (box > 4) {
      scrollable.value = true
      wrap.style.overflowY = 'hidden'
      await nextTick()
      wrap.scrollLeft = box / 2
    }
  }

  await nextTick()
  placeGens()
}

onMounted(layout)
watch(() => props.branch.key, layout)

let timer
function onResize() {
  clearTimeout(timer)
  timer = setTimeout(layout, 160)
}
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

defineExpose({ layout })
</script>

<template>
  <div class="branch" :class="{ scrollable }">
    <h2>{{ branch.title }}</h2>
    <div ref="wrapEl" class="tree-wrap">
      <div ref="treeEl" class="tree">
        <TreeNode :node="branch.root" :depth="0" @open="emit('open', $event)" />
        <span
          v-for="g in gens"
          :key="g.label"
          class="gen"
          :style="{ top: g.top + 'px', left: g.left + 'px' }"
        >{{ g.label }}</span>
      </div>
    </div>
    <p class="swipe">左右滑动查看</p>
  </div>
</template>
