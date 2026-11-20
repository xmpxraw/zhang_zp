<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  branch: { type: Object, required: true },
  focusKey: { type: Number, default: 0 },
  focusName: { type: String, default: '' }
})
const emit = defineEmits(['open'])

const NODE_H = 64
const V_GAP = 28
const H_GAP = 18
const CW = 126
const CW_COUPLE = 182
const PAD_L = 44
const PAD_T = 18

const wrapEl = ref(null)
const canvasEl = ref(null)
const boxH = ref(240)

let nodes = []
let treeW = 0
let treeH = 0
let cssW = 0
let cssH = 0
let view = { s: 1, tx: 0, ty: 0 }
let fitS = 1
let minS = 0.3
let userMoved = false
let highlight = ''
let highlightUntil = 0
let raf = 0
let ro = null
let active = new Map()
let pinch = null
let tap = { t: 0, x: 0, y: 0 }
let downPt = null

const C = {
  line: '#c9ac7e',
  border: '#b08d57',
  ink: '#2e2a22',
  ink2: '#6f6555',
  gold: '#96794c',
  cardTop: '#fffdf8',
  cardBot: '#f9f4e8',
  divider: '#dfcba8'
}

function cardW(n) {
  return n.spouse ? CW_COUPLE : CW
}

function measure(n) {
  const kids = n.children || []
  if (!kids.length) {
    n._w = cardW(n)
  } else {
    let sum = 0
    kids.forEach((k, i) => {
      sum += measure(k) + (i ? H_GAP : 0)
    })
    n._leafW = sum
    n._w = Math.max(cardW(n), sum)
  }
  return n._w
}

function place(n, left, depth) {
  n._x = left + (n._w - cardW(n)) / 2 + PAD_L
  n._y = depth * (NODE_H + V_GAP) + PAD_T
  n._depth = depth
  nodes.push(n)
  const kids = n.children || []
  if (kids.length) {
    const start = left + (n._w - n._leafW) / 2
    let cur = start
    kids.forEach((k) => {
      place(k, cur, depth + 1)
      cur += k._w + H_GAP
    })
  }
}

function build() {
  nodes = []
  measure(props.branch.root)
  place(props.branch.root, 0, 0)
  treeW = props.branch.root._w + PAD_L + 16
  const maxDepth = Math.max(...nodes.map((n) => n._depth))
  treeH = (maxDepth + 1) * (NODE_H + V_GAP) - V_GAP + PAD_T * 2
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawCard(ctx, n) {
  const w = cardW(n)
  const x = n._x
  const y = n._y
  const g = ctx.createLinearGradient(0, y, 0, y + NODE_H)
  g.addColorStop(0, C.cardTop)
  g.addColorStop(1, C.cardBot)
  roundRect(ctx, x, y, w, NODE_H, 6)
  ctx.fillStyle = g
  ctx.fill()
  ctx.lineWidth = 1
  ctx.strokeStyle = C.border
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (n.spouse) {
    const half = w / 2
    ctx.beginPath()
    ctx.moveTo(x + half, y + 8)
    ctx.lineTo(x + half, y + NODE_H - 8)
    ctx.strokeStyle = C.divider
    ctx.stroke()
    drawPerson(ctx, n.name, n.yr, x + half / 2, y + NODE_H / 2)
    drawPerson(ctx, n.spouse.name, n.spouse.yr, x + half * 1.5, y + NODE_H / 2)
  } else {
    drawPerson(ctx, n.name, n.yr, x + w / 2, y + NODE_H / 2)
  }

  if (highlight === n.name && Date.now() < highlightUntil) {
    roundRect(ctx, x - 3, y - 3, w + 6, NODE_H + 6, 9)
    ctx.lineWidth = 2.5
    ctx.strokeStyle = 'rgba(176,141,87,.75)'
    ctx.stroke()
  }
}

function drawPerson(ctx, name, yr, cx, cy) {
  ctx.fillStyle = C.ink
  ctx.font = '600 16px "Songti SC","Noto Serif SC",SimSun,serif'
  ctx.fillText(name, cx, yr ? cy - 9 : cy)
  if (yr) {
    ctx.fillStyle = C.ink2
    ctx.font = '11px "Songti SC","Noto Serif SC",SimSun,serif'
    ctx.fillText(yr, cx, cy + 11)
  }
}

function drawLinks(ctx) {
  ctx.strokeStyle = C.line
  ctx.lineWidth = 1
  nodes.forEach((n) => {
    const kids = n.children || []
    if (!kids.length) return
    const cx = n._x + cardW(n) / 2
    const fromY = n._y + NODE_H
    const busY = fromY + V_GAP / 2
    ctx.beginPath()
    ctx.moveTo(cx, fromY)
    ctx.lineTo(cx, busY)
    ctx.stroke()

    const xs = kids.map((k) => k._x + cardW(k) / 2)
    ctx.beginPath()
    ctx.moveTo(Math.min(cx, ...xs), busY)
    ctx.lineTo(Math.max(cx, ...xs), busY)
    ctx.stroke()

    kids.forEach((k, i) => {
      ctx.beginPath()
      ctx.moveTo(xs[i], busY)
      ctx.lineTo(xs[i], k._y)
      ctx.stroke()
    })
  })
}

function drawGens(ctx) {
  const labels = props.branch.gens || []
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = C.gold
  ctx.font = '11px "Songti SC","Noto Serif SC",SimSun,serif'
  const byDepth = new Map()
  nodes.forEach((n) => {
    const cur = byDepth.get(n._depth)
    if (!cur || n._x < cur._x) byDepth.set(n._depth, n)
  })
  byDepth.forEach((first, depth) => {
    const label = labels[depth]
    if (!label) return
    const x = Math.max(12, first._x - 22)
    ;[...label].forEach((ch, i) => ctx.fillText(ch, x, first._y + i * 15))
  })
}

function draw() {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)
  ctx.save()
  ctx.translate(view.tx, view.ty)
  ctx.scale(view.s, view.s)
  drawLinks(ctx)
  nodes.forEach((n) => drawCard(ctx, n))
  drawGens(ctx)
  ctx.restore()
}

function scheduleDraw() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    draw()
  })
}

function computeFit(initial) {
  const pad = 24
  fitS = Math.min(1, (cssW - pad * 2) / treeW)
  minS = 0.02
  if (!initial) return
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 700
  const s = Math.max(fitS, isTouch ? 0.72 : fitS)
  view.s = s
  const root = props.branch.root
  const rootCx = root._x + cardW(root) / 2
  if (treeW * s > cssW) {
    view.tx = cssW / 2 - rootCx * s
    view.ty = 16
  } else {
    view.tx = (cssW - treeW * s) / 2
    view.ty = Math.max(12, (cssH - treeH * s) / 2)
  }
  clampView()
}

function clampView() {
  const sw = treeW * view.s
  const sh = treeH * view.s
  const marginX = Math.min(40, cssW * 0.15)
  if (sw <= cssW) view.tx = (cssW - sw) / 2
  else view.tx = Math.min(marginX, Math.max(cssW - sw - marginX, view.tx))
  if (sh <= cssH) view.ty = (cssH - sh) / 2
  else view.ty = Math.min(marginX, Math.max(cssH - sh - marginX, view.ty))
}

function resize() {
  const wrap = wrapEl.value
  const canvas = canvasEl.value
  if (!wrap || !canvas) return
  cssW = wrap.clientWidth
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 700
  const baseFit = Math.min(1, (cssW - 48) / treeW)
  const s0 = Math.max(baseFit, isTouch ? 0.72 : baseFit)
  cssH = Math.round(Math.min(Math.max(treeH * s0 + 24, 220), 780))
  boxH.value = cssH
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  canvas.style.width = cssW + 'px'
  canvas.style.height = cssH + 'px'
  const first = !userMoved
  computeFit(first)
  if (!first) clampView()
  scheduleDraw()
}

function zoomAt(px, py, factor) {
  const s2 = Math.min(4, Math.max(minS, view.s * factor))
  if (s2 === view.s) return
  const k = s2 / view.s
  view.tx = px - (px - view.tx) * k
  view.ty = py - (py - view.ty) * k
  view.s = s2
  userMoved = true
  clampView()
  scheduleDraw()
}

function centerOn(name, scale) {
  const n = nodes.find((x) => x.name === name)
  if (!n) return
  if (scale) view.s = Math.min(4, Math.max(minS, scale))
  const cx = n._x + cardW(n) / 2
  const cy = n._y + NODE_H / 2
  view.tx = cssW / 2 - cx * view.s
  view.ty = cssH / 2 - cy * view.s
  userMoved = true
  clampView()
  scheduleDraw()
}

function hitTest(clientX, clientY) {
  const rect = canvasEl.value.getBoundingClientRect()
  const x = (clientX - rect.left - view.tx) / view.s
  const y = (clientY - rect.top - view.ty) / view.s
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]
    if (x >= n._x && x <= n._x + cardW(n) && y >= n._y && y <= n._y + NODE_H) return n
  }
  return null
}

function onPointerDown(e) {
  const canvas = canvasEl.value
  canvas.setPointerCapture?.(e.pointerId)
  active.set(e.pointerId, { x: e.clientX, y: e.clientY })
  downPt = { x: e.clientX, y: e.clientY }
  if (active.size === 2) {
    const [a, b] = [...active.values()]
    pinch = {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      s: view.s
    }
  }
}

function onPointerMove(e) {
  if (!active.has(e.pointerId)) return
  const prev = active.get(e.pointerId)
  active.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (active.size === 1) {
    view.tx += e.clientX - prev.x
    view.ty += e.clientY - prev.y
    userMoved = true
    clampView()
    scheduleDraw()
  } else if (active.size === 2 && pinch) {
    const [a, b] = [...active.values()]
    const dist = Math.hypot(a.x - b.x, a.y - b.y)
    const rect = canvasEl.value.getBoundingClientRect()
    const midX = (a.x + b.x) / 2 - rect.left
    const midY = (a.y + b.y) / 2 - rect.top
    const target = Math.min(4, Math.max(minS, (pinch.s * dist) / (pinch.dist || 1)))
    const k = target / view.s
    view.tx = midX - (midX - view.tx) * k
    view.ty = midY - (midY - view.ty) * k
    view.s = target
    userMoved = true
    clampView()
    scheduleDraw()
  }
}

function onPointerUp(e) {
  const wasSingle = active.size === 1
  active.delete(e.pointerId)
  if (active.size < 2) pinch = null
  if (wasSingle && downPt) {
    const moved = Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y)
    if (moved < 8) handleTap(e.clientX, e.clientY)
    downPt = null
  }
}

function handleTap(cx, cy) {
  const now = Date.now()
  const isDouble = now - tap.t < 300 && Math.hypot(cx - tap.x, cy - tap.y) < 30
  tap = { t: now, x: cx, y: cy }
  if (isDouble) {
    view.s = view.s > fitS * 1.4 ? fitS : Math.min(4, Math.max(1, fitS * 1.6))
    clampView()
    scheduleDraw()
    return
  }
  const n = hitTest(cx, cy)
  if (n) emit('open', n.name)
}

function onWheel(e) {
  e.preventDefault()
  const rect = canvasEl.value.getBoundingClientRect()
  zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 0.89)
}

function onDblClick(e) {
  const rect = canvasEl.value.getBoundingClientRect()
  const factor = view.s > fitS * 1.4 ? fitS / view.s : Math.min(3, 1.6 / view.s)
  zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor)
}

function onResize() {
  resize()
}

onMounted(() => {
  build()
  resize()
  ro = new ResizeObserver(() => resize())
  ro.observe(wrapEl.value)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('resize', onResize)
  if (raf) cancelAnimationFrame(raf)
})

watch(
  () => props.focusKey,
  async () => {
    await nextTick()
    if (!props.focusName) return
    wrapEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    highlight = props.focusName
    highlightUntil = Date.now() + 1800
    centerOn(props.focusName, Math.max(1, view.s))
    setTimeout(() => scheduleDraw(), 1900)
  }
)
</script>

<template>
  <div class="branch">
    <h2>{{ branch.title }}</h2>
    <div ref="wrapEl" class="canvas-wrap" :style="{ height: boxH + 'px' }">
      <canvas
        ref="canvasEl"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @wheel="onWheel"
        @dblclick="onDblClick"
      />
    </div>
    <p class="canvas-hint">双指 / 滚轮缩放 · 拖动查看 · 双击还原</p>
  </div>
</template>
