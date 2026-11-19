<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import TopBar from './components/TopBar.vue'
import TreeView from './components/TreeView.vue'
import TextView from './components/TextView.vue'
import { branches } from './data/branches.js'

const view = ref('tree')
const branchKey = ref('all')

function readHash() {
  const params = new URLSearchParams(location.hash.slice(1))
  view.value = params.get('v') === 'text' ? 'text' : 'tree'
  const b = params.get('b')
  branchKey.value = branches.some((x) => x.key === b) ? b : 'all'
}
function writeHash() {
  const q = 'v=' + view.value + (branchKey.value !== 'all' ? '&b=' + branchKey.value : '')
  history.replaceState(null, '', '#' + q)
}
onMounted(() => {
  readHash()
  writeHash()
})
watch([view, branchKey], writeHash)

function branchOf(name) {
  return branches.find((b) => findPerson(b.root, name))?.key || 'all'
}
function findPerson(node, name) {
  if (node.name === name) return true
  return (node.children || []).some((c) => findPerson(c, name))
}

function flash(el) {
  if (!el) return
  el.classList.add('hit')
  setTimeout(() => el.classList.remove('hit'), 1600)
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function gotoText(name) {
  view.value = 'text'
  if (branchKey.value !== 'all' && branchKey.value !== branchOf(name)) branchKey.value = 'all'
  await nextTick()
  await wait(60)
  const el = document.getElementById('p-' + name)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  flash(el)
}

async function gotoTree(name) {
  view.value = 'tree'
  if (branchKey.value !== 'all' && branchKey.value !== branchOf(name)) branchKey.value = 'all'
  await nextTick()
  await wait(160)
  const el = document.querySelector(`.card[data-id="${name}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  flash(el)
}

function jumpTo(name) {
  const el = document.getElementById('p-' + name)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  flash(el)
}

function setView(v) {
  if (v === view.value) return
  view.value = v
  window.scrollTo({ top: 0 })
}
function setBranch(key) {
  if (key === branchKey.value) return
  branchKey.value = key
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <TopBar
    :view="view"
    :branch-key="branchKey"
    :branches="branches"
    @update:view="setView"
    @update:branch-key="setBranch"
  />
  <TreeView
    v-if="view === 'tree'"
    :branches="branches"
    :filter-key="branchKey"
    @open="gotoText"
  />
  <TextView
    v-else
    :branches="branches"
    :filter-key="branchKey"
    @goto="gotoTree"
    @jump="jumpTo"
  />
</template>
