# Wokvibe 官网（静态站点）

Wokvibe iOS 应用的产品介绍网站，包含产品首页、隐私政策和服务政策（条款）。纯静态实现，无后端、无构建步骤，任何静态托管（GitHub Pages、Vercel、Netlify、Nginx、OSS/CDN）可直接部署。

## 线上地址

- 仓库：<https://github.com/CLChua/wokvibe-web>
- 站点（GitHub Pages，main 分支根目录自动部署）：<https://clchua.github.io/wokvibe-web/>

推送代码到 `main` 分支后，Pages 会自动重新构建发布，无需其他操作。

## 本地预览

```sh
python3 -m http.server 8747
# 打开 http://localhost:8747/
```

（直接双击 index.html 用 file:// 打开也可以正常运行。）

## 目录结构

```
index.html        产品介绍（双语）
privacy.html      隐私政策（双语）
terms.html        服务政策/条款（双语）
assets/
  css/main.css    设计令牌 + 全部样式
  js/i18n.js      中英切换（localStorage 记忆 + 浏览器语言自动检测）
  js/main.js      GSAP 动效（首页；含 prefers-reduced-motion 与无帧环境兜底）
  js/doc.js       政策页目录高亮
  vendor/gsap/    gsap.min.js + ScrollTrigger.min.js（自托管 3.13.0，免费商用）
  img/            品牌与食物图片（自 Wokvibe App 资产目录只读复制并压缩）
  fonts/          Archivo Black（SIL OFL 许可，用于展示型标题）
```

## 双语机制

页面内同时包含两份文案（`.lang-en` / `.lang-zh`），由 `<html data-lang>` 驱动 CSS 显隐：

- 首次访问按浏览器语言自动选择（`zh*` → 中文，其余 → 英文）；
- 手动切换写入 `localStorage("wokvibe-lang")`，跨页面、跨会话保持；
- `<html lang>`、`<title>`、`meta description` 随语言同步更新；
- 无 JS 时优雅降级为英文。

## 动效

遵循 Wokvibe 品牌动效语言（GAZE FIRST / SOFT BOUNCE / ONE BEAT AHEAD）：

- 首页标题行级遮罩入场、吉祥物软弹浮动、装饰形状视差；
- 品牌词与食物画廊双跑马灯（离开视口自动暂停）；
- 滚动批量 reveal、健康环形图绘制、进度条生长；
- 完整支持 `prefers-reduced-motion`；若浏览器处于无法绘制帧的状态（后台标签页等），有兜底逻辑直接展示全部内容，保证内容永不依赖动画完成。

## 上线前必须替换的占位符

代码中已用 `TODO` / `PLACEHOLDER` 注释标出：

1. **App Store 链接**：`index.html` 中所有 `href="#"` 的下载按钮（搜索 `TODO: replace`）。
2. **运营主体**：`privacy.html` / `terms.html` 中的 "Wokvibe Team (placeholder)"。
3. **联系邮箱**：`privacy@wokvibe.app`、`support@wokvibe.app`、`legal@wokvibe.app`。
4. **生效日期**：两份政策中的 "2026 年 9 月 17 日 / September 17, 2026"。
5. **管辖法律**：`terms.html` 第 16 节为占位表述，上线前请律师确认。
6. **事实核对**：价格（$2.99 / 30 次）、3 次免费试用、积分不过期等描述需与最终上架版本一致。

## 素材与许可

- GSAP：`assets/vendor/gsap/`，遵循 GreenSock 标准许可（自 Webflow 收购后全部插件免费商用）。
- Archivo Black 字体：Google Fonts / Fontsource，SIL Open Font License。
- 图片：复制自 Wokvibe App 的 `Assets.xcassets`（仅复制，未改动 App 项目）。
