# zhang_zp · 张氏族谱

Vue 3 + Vite 单页应用：图谱 / 文字双视图、按分支筛选、PC 与手机自适应。
图谱用 Canvas 绘制，支持滚轮 / 双指缩放（不设最小比例限制）、拖动平移、双击还原；点击卡片跳文字。

在线地址（GitHub Pages，主）：https://xmpxraw.github.io/zhang_zp/

在线地址（surge，备）：https://zhang-zupu.surge.sh

直链示例（图谱 + 只看文枢支）：
https://xmpxraw.github.io/zhang_zp/#v=tree&b=wenshu

> hash 参数：`v=tree|text` 切视图，`b=<分支key>` 筛分支（`qingxin` / `hanxian` / `qunlin` / `qiupeng` / `wenshu`），省略即全部。

## 命令

```bash
npm install      # 安装依赖
npm run dev      # 本地开发（http://localhost:5173）
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
npm run pages    # 构建并发布到 GitHub Pages（推 gh-pages 分支）
npm run prod     # 构建并发布到 surge（zhang-zupu.surge.sh）
```

GitHub Pages 源：仓库 Settings → Pages → Deploy from a branch → `gh-pages` / root，首次配置后在推送 `gh-pages` 时自动发布。

surge 首次发布前需登录一次：

```bash
npx surge login
```

## 目录

```
index.html            # 入口
vite.config.js        # base './'，产物可直接静态托管
src/
  main.js
  App.vue             # 视图切换、分支筛选、hash 同步、卡片↔文字互跳
  style.css           # 全站样式与响应式断点
  data/branches.js    # 族谱数据（唯一数据源）
  components/
    TopBar.vue        # 顶栏：标题 / 视图切换 / 分支筛选
    TreeView.vue      # 图谱视图（main / a / b 三组网格）
    BranchCanvas.vue  # 单支 Canvas 渲染：布局、连线、缩放与拖动
    TextView.vue      # 文字视图分组
    BranchText.vue    # 谱牒式条目
```

## 文档

- `族谱整理-2026-11-18.md` — 完整资料整理
- `族谱大纲-生图版.md` — 生图用大纲与提示词
- `族谱图.html` — 早期单文件版本（已被 Vue 版取代，保留备查）

## 约定

本族后代一律冠「张」姓；嫁入配偶只写本名；同辈长者在前（姐前弟后、兄前妹后）。
