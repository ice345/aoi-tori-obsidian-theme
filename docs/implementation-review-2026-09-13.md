# Aoi Tori 最新实现复审与下一轮修复要求

复审日期：2026-09-13。对照文件：`docs/aesthetic-audit-2026-09-11.md`，尤其是 §12 的 T00–T09 与 V01–V14。

## 1. 结论与范围

**视觉方向可以保留；当前实现尚不能按“全部验收完成”交付。建议做一轮有边界的修复和回归，无需重新设计整套主题。**

已落实的部分包括：左侧水彩青白、右侧淡粉紫白、中央中性桥接与不透明阅读纸面；dark
mode 独立的低彩度冷灰色面；深色引用 2%/4%/6% 强度；默认 Duet 与旧侧栏选项的映射；关闭渐变时 HR 的实色底；默认侧栏文字加深；未打包官方图像。这些总体符合交接方向。

本轮检查的是当前工作区。大量修改尚未提交，`git diff HEAD`
同时包含早期工作，因此下文区分“当前仍存在的问题”和“新增行”，不把所有问题都说成此次新引入的回归。

证据来源：当前源码、构建产物、项目脚本、既有最终截图 `90-final-light.png` /
`91-final-dark.png`、隔离浏览器 CSS 级联测试。截图位于
`.analysis/palette-preview/`，属于前一轮留下的证据，不是本轮重新拍摄的 Obsidian 实机画面。本轮没有重新执行 Obsidian 编辑交互、Style
Settings 插件安装重置或 Windows 高对比实机测试。

## 2. R1 — P2：Soft 侧栏文字绕过新对比度修复，高对比选项也未兜底

位置：`src/settings/style-settings.css:695`，相关映射 `src/tokens/semantic-light.css:156`。

### 问题与复现

默认导航文字已改为 `--aoi-ink-muted-side: #516577`，但 `body.theme-light.aoi-sidebar-contrast-soft`
将 `--nav-item-color` 重新指定为
`--aoi-ink-faint: #627686`。这是现存设置覆盖没有随新色面一起完成验收，不应仅因默认值通过就关闭此项。

复现组合：Light → Duet → Sidebar contrast = Soft → Sky = Clear。浏览器按当前生成 CSS 渲染
`.nav-file-title`，实际颜色为 `rgb(98,118,134)`。再加 `aoi-high-contrast` 后，该颜色仍然不变。

| 背景                              | Soft 文字对比度 |
| --------------------------------- | --------------- |
| 左侧未叠加 wash：`#EAF4F4`        | 4.21:1          |
| 右侧未叠加 wash：`#F5EFF4`        | 4.16:1          |
| 左侧最大 wash 合成背景：`#DEEDF1` | 3.93:1          |
| 右侧最大 wash 合成背景：`#EBE4EC` | 3.78:1          |

这低于项目为普通导航文字设定的 4.5:1 下限。右侧普通底色已经不足，不仅仅是渐变边缘的问题。主题 High
contrast 只调整 `--text-muted`、`--text-faint` 等变量，无法修正直接引用 primitive 的导航文字。

### 如何修复

1. 在 primitives 中定义经测量的 light 侧栏 Soft 文字候选，再通过设置映射到导航语义变量；不要直接复用原来的 faint。也可调整 Soft 的视觉差异来源，例如字重或层级，但保留普通文字的最低对比度。
2. 同时检查 Cloud/Mist/Aqua 与 Sky 三档。较深的 Aqua 背景可能比 Duet 更严格，不要只按右侧 Duet 的一组数值定案。
3. 高对比需求应明确覆盖导航、标签和其他独立文字 token。确保主题 High contrast、Light contrast =
   High、系统 `prefers-contrast: more` 与 Soft 组合时能加强导航文字；不要期待更改 `--text-muted`
   会自动传导到所有独立别名。
4. 验收必须读取最终元素的 computed `color` 与其真实背景合成值，而不是只计算新 primitive 自己。

通过标准：普通导航文字在支持的浅色侧栏设置与最大 wash 下均 ≥4.5:1；高对比开关不会保留 Soft 的低对比文字；hover/active/focus 状态也分别核对。

## 3. R2 — P2：forced-colors 回退的 CSS 优先级没有闭合

位置：`src/tokens/accessibility.css:90–102`；冲突来源包括
`src/workspace/shell.css:14`、`src/editor/content.css:76` 与旧侧栏设置。

### 两个独立的级联问题

- 装饰去除规则使用
  `:where(...)`，特异性为零，输给常态侧栏及 HR 规则。即使媒体查询成立，也不保证主题自身的
  `background-image: none` 和 HR `CanvasText` 获胜。
- 新增表面回退使用 `body.theme-light`，特异性为 `(0,1,1)`；Cloud/Mist/Aqua 的
  `body.theme-light.aoi-sidebar-*` 是
  `(0,2,1)`。旧选项仍可把左右表面 token 覆盖为主题颜色。后写规则并不自动胜过更高特异性的规则。

本轮在隔离页面中仅将生成 CSS 的 `@media (forced-colors: active)` 替换为
`@media all`，检查媒体成立时的作者级联。结果：默认场景表面 token 是 Canvas，但侧栏和 HR 仍有渐变；Cloud 场景右侧 token 是
`#F5F8F7`；Cloud 加关闭水彩开关后渐变消失，但 HR 仍是 `rgb(184,222,232)`，不是系统 CanvasText。

**边界：这是作者 CSS 规则失效的直接证据，不等于 Windows 实机会显示上述彩色像素。真实 forced-colors 下浏览器另有强制绘制处理，可能掩盖该问题。不要把这项测试记录成已完成 Windows 高对比验证。**

### 如何修复

1. 给媒体查询内的侧栏、Properties、引用、Callout、HR 去装饰规则配置能胜过常态和设置开关的限定选择器。HR 实色系统回退还必须胜过两个关闭渐变开关的
   `background-color`。
2. 让系统表面 token 的声明能胜过全部旧侧栏选项。例如用有限范围的 `body.theme-light:is(...)`
   明确覆盖旧选项，或者降低这些设置选择器的特异性；后者需要完整的设置回归。
3. 同步检查导航、当前状态与独立文字 token 的系统颜色映射，不要只改三个背景变量。
4. 不引入 `!important`；不要用 `forced-color-adjust: none` 保留品牌颜色来绕过系统模式。

通过标准：两种主题 × Duet/Cloud/Mist/Aqua
× 两个渐变关闭开关，在媒体模式下均得到预期系统语义与无装饰背景。保留一项独立 Windows 高对比人工验收，包括 HR、选中项、按钮和键盘焦点。

## 4. R3 — P2：当前完整质量门禁失败，不只是旧 Markdown 格式问题

新增错误位置：`src/tokens/primitives.css:25`。

`npm run check` 的实际结果：build 成功，随后 CSS lint 因 `comment-empty-line-before`
失败并停止。新加入侧栏文字说明的注释前缺少空行。因此后续 audit、contrast、manifest 不会在这一条总命令中执行。

单独运行 `npm run format:check` 还发现 `.omp/config.yml` 与 `checkout-diff.md`
两项格式问题。它们不应被主题修复任务顺手整体重写。

修复要求：

1. 只修 primitives 新注释前的空行。
2. 明确 `.omp/config.yml` 和 `checkout-diff.md`
   是项目受管文件还是本地工作材料。受管则按归属处理；本地材料则给出有说明的精确忽略规则。不要为通过检查扩大忽略到源码或所有文档。
3. 重新运行完整 `npm run check`，保留实际输出；在它成功之前不能写“门禁全绿”。
4. 发布包任务依赖质量门禁，必须在修复后另行验证，不以普通 build 成功代替发布包成功。

## 5. 对比度测试需要补强：44 组通过不能代表设置组合通过

涉及 `scripts/check-contrast.mjs` 与 `docs/contrast-pairs.json`。

目前脚本按正则提取变量，支持六位 hex 与直接 var 别名，不理解 selector、媒体查询、级联和颜色合成。新增最大 wash 背景是手工存入 primitives 的预计算值，不能证明它始终等于实际渐变绘制值。此轮这些默认值本身不是计算错误；问题是覆盖范围与未来漂移风险。

下一轮实现要求：

- 保留现有静态检查作为基础，不要删除已有对比度配对。
- 增加独立的实际 CSS 场景测试，使用当前构建产物，明确记录 body
  class、元素、最终文字颜色、背景及 wash 强度。
- 普通对比度至少覆盖 light/dark、四种侧栏选项、三档 Sky、三档 Sidebar
  contrast，以及主题/系统高对比组合。可生成矩阵，但须在结果中显示失败场景。
- 从实际 surface/wash/strength 推导背景极值；如保留预计算 token，要增加“推导值与预计算值一致”的断言。
- 不要把整个 `style-settings.css`
  追加到现有静态 sources 中冒充场景测试。正则会把不同主题、互斥设置中的同名变量混在一起，失去场景含义。

## 6. 验收记录与兼容性资料尚需收敛

这是证据缺口，不代表对应交互已经损坏。

- `docs/TESTING.md` 的 Phase 6 引用说明仍写 2%
  wash，而当前 dark 默认已是 4%。旧截图和测量可能对应中途版本，不能作为最终默认值的验收证据。应重测引用最终默认和三档设置，更新数据及截图版本。
- `docs/TESTING.md:72`
  仍列 forced-colors 与两个关闭渐变开关未验证，PLANS 的后续段落又记录已进行媒体模拟/关闭开关检查。应合并为一张最终矩阵，区分旧版、当前版、模拟、实机和未测。
- 新增 `.workspace-ribbon.mod-left::before`、macOS 右侧 toggle 特例、vault profile、中央
  `.view-content` 背景和侧栏 leaf 透明规则，应补到 `docs/obsidian-dom.md`
  的当前版本风险记录。该文件目前主要保留 1.13.4 证据，没有相应 Phase 6 新选择器记录。
- 中央 `.view-content`
  统一实色、侧栏 leaf 透明可能影响非 Markdown 视图。需要实际回归 Canvas、Graph、PDF/Bases、侧栏搜索/反链，以及可用的自定义视图。尚未发现确定破坏，不应预先重写它们。
- 补测插件首次安装、恢复默认、旧 Cloud/Mist/Aqua 切到 Duet、禁用插件；无插件默认值与插件 Reset 后须一致。
- 窗口与布局至少覆盖浅/深、两侧栏/单侧/均隐藏、双笔记分屏、pop-out、窄窗口和 phone-class。桌面 mobile
  emulator 不能替代真实手机手势与安全区验收。

每项记录至少包含：测试日期、Obsidian/插件版本、源码或生成 CSS 的哈希、配置、步骤、实际结果、截图位置、通过/失败/未测。

## 7. 美学方面建议保留什么、可继续调整什么

从既有最终截图看，左右色温关系已清楚，中间阅读区保持安静，深色也避免了原先大面积海军蓝。**不建议为了更像官网，把正文纸面也铺上完整彩色渐变。**
当前“左右柔和色面＋中间中性桥接”是原方案允许的实现。

可选微调：

- 浅色 Properties 的逐行紫色 key 底较醒目。若日常笔记中它比正文更抢眼，可在无选中状态下先比较降低背景强度的版本；图标和文字保留少量第二声部颜色即可。属于审美偏好，不是功能缺陷。
- 深色左右差异应保持克制，不必追求浅色模式相同的可见强度。
- 羽毛与音乐 Callout 已有合适载体；蓝鸟图标未确认注册时继续暂缓是合理行为，不属于漏修。优先完成可读性与设置回归，再考虑一个可关闭的局部装饰入口。
- 官方元素仍按原报告的素材来源与独立发布边界处理，不把海报、人物截图、官网图片直接塞入发布主题来增加辨识度。

## 8. 本轮实际检查结果与交接顺序

| 检查                                                 | 结果                                          |
| ---------------------------------------------------- | --------------------------------------------- |
| 临时路径重新构建并与根目录 theme.css 比较            | 成功，字节一致，93,645 bytes                  |
| `npm run check`                                      | 失败，停在 primitives.css:25 的 CSS lint      |
| `npm run audit`                                      | 通过，14 个 source CSS 文件                   |
| `npm run contrast`                                   | 配置中的 44 组全部通过；不包含设置矩阵        |
| `npm run validate:manifest`                          | 通过                                          |
| `npm run format:check`                               | 失败，`.omp/config.yml`、`checkout-diff.md`   |
| 隔离浏览器级联检查                                   | 复现 R1 与 R2；不等同于 Obsidian/Windows 实机 |
| 最新 Obsidian 全量人工回归、真实手机、Windows 高对比 | 本轮未执行                                    |

建议依次执行：R3 最小格式修复 → R1 设置与高对比文字修复 →
R2 系统颜色回退修复 → 补设置矩阵 → 当前版本 Obsidian 交互回归 → 更新记录 → 再讨论可选装饰。

本轮不修改主题源码；新增本报告并更新 PLANS 的复审状态。完整检查曾重新生成
`theme.css`，已与检查前的临时构建副本确认一致。隔离测试材料放在被忽略的
`.analysis/review-2026-09-13/`。
