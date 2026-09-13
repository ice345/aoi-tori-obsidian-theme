# Aoi Tori 暗色容器可见性审计与修复完善方案

日期：2026-09-13。审计基线：`e65b220`，主题 `0.9.0`。状态：**审计完成，修复尚未实施**。

本文件针对用户提供的暗色截图，调查框体背景、边界和相邻交互状态，并提供可执行的修复方案。截图和既有文档是分析材料；其中的历史实施要求不构成本轮实施授权。本轮只交付方案和审计记录，不修改主题源代码、安装配置或发布元数据。

## 1. 结论与优先级

截图问题真实存在，而且有可以复现的 CSS 根因。它不是单纯的“深灰色不够亮”。截图中的羽毛和音符块分别对应
`[!aoi-tori]` 与 `[!second-voice]`，属于 **Callout**；普通 Markdown `> 引用` 与 `[!quote]`
Callout 必须分别处理。

当前有三条问题链：

1. **绘制链断裂**：Callout 使用更暗的实体底色，却继承暗色原生 `lighten`
   混合模式，底面被正文背景抵消；预期的侧边线同时因变量作用域问题变成 `0px`。
2. **变量作用域与默认值断裂**：部分主题默认值放在 `:root`，被原生 `body` 声明覆盖；另一些别名在
   `:root` 引用只存在于 `body`
   的变量，提前失效。代码块边框、活动行底色、主题附加的图片选中外框均受到影响。
3. **层次与检查不完整**：部分暗色表面本来就相近，“加强边框”又未传递到独立的组件变量。现有文字对比度和侧栏场景检查无法发现上述最终绘制问题。

| 编号 | 问题                                       | 优先级 | 证据强度                                                            | 建议处理                                    |
| ---- | ------------------------------------------ | ------ | ------------------------------------------------------------------- | ------------------------------------------- |
| D01  | 暗色 Callout 底面被 `lighten` 抵消         | P1     | 截图、原生规则、浏览器计算样式及混合公式一致                        | 显式使用正常合成，分离容器底色语义          |
| D02  | Callout 预期 2px 侧边线实际为 0px          | P1     | 加载原生 CSS 的隔离 DOM 已复现                                      | 把几何默认值放到实际生效的作用域            |
| D03  | 无插件时块级代码无边框，插件默认类却有边框 | P1     | 两种模式下均复现 0px → 1px                                          | 修复默认作用域并检查默认一致性              |
| D04  | 默认活动行背景透明                         | P1     | 默认与 Subtle 均透明，Clear 有底色                                  | 在 `body`/模式层解析依赖语义变量的别名      |
| D05  | 无插件时主题附加图片选中外框失效           | P1     | 合成的选中节点计算为 `outline-style: none`，默认设置类恢复 1px      | 修复别名；保留原生选中和焦点机制            |
| D06  | 边框增强设置未传递到多个独立组件           | P1     | 设置矩阵显示通用变量变化而组件实际边框不变                          | 建立结构边框、控制边框、状态边框的明确映射  |
| D07  | Callout 的 Quiet/Airy 被子元素类型规则截断 | P2     | Success 等固定 5%，Second voice 固定 6%                             | 在同一元素上组合类型与用户强度              |
| D08  | 部分原生别名在视觉强度、图标映射上不一致   | P2     | `warning` 与 `attention`、`fail` 与 `missing` 的 wash 不一致        | 按语义家族补齐，保留未知类型回退            |
| R01  | 表格、Properties、菜单、标签等层次较弱     | P2     | 源码与表面测量；不等同于全部交互失败                                | 恢复结构后逐项验收，避免全局提亮            |
| R02  | 更广泛的字体、圆角、标题字重默认作用域偏差 | P2     | 无插件 Callout 圆角为 4px、标题权重为 640，正文主题字体为原生占位值 | 单列受控修复，避免一改 `:root` 触发整体重排 |

P1 表示应先修复的确定缺陷或关键保障缺口，不表示整个应用不可使用。图片原生选中信号、键盘焦点及第三方插件的最终表现不能仅从合成节点推断。

## 2. 审计方法、范围与证据边界

### 2.1 本轮实际检查

- 阅读仓库规范、README、计划、架构、设计、测试记录，以及全部主题 CSS 模块与相关检查脚本。
- 检查用户截图，并查看仓库当前
  `assets/screenshots/dark.png`：其中同样可见两个 Callout 缺少连续底面和边线。
- 用 `obsidian version` 确认本机应用及安装器均为 **1.13.7**。
- 从运行客户端的 `app://obsidian.md/app.css` 读取原生 CSSOM；不是把早期缓存文件当作当前原生规则。
- 在客户端内建立临时隔离 iframe，只加载当前原生 CSS 和仓库
  `theme.css`，使用合成 DOM 检查实际浏览器级变量继承及声明结果。
- 覆盖 30 个 Callout 类型/别名/未知类型，以及普通引用、块级/行内代码、活动行、Live
  Preview 引用/代码、图片选中节点、标签、高亮、Properties、表格、输入框、按钮、复选框、开关、菜单与模态框。
- 检查浅/深两种模式各 13 组默认或设置状态，共 26 组；另有 1 组只修复合成模式和关键边框默认值的隔离实验。每组记录 48 个节点，共 1,296 份节点样式快照。
- 隔离测量关闭测试节点的 CSS
  transition，避免切换模式后读到上一模式的动画中间值；没有在主题中加入该规则。
- 计算暗色表面之间、文字与候选底面之间的 sRGB 相对亮度对比度。

26 组并非设置的完整笛卡尔积，所测选择包括：默认、Callout Quiet/Airy、Code Quiet/Bordered、Active
line Subtle/Clear、Image selection Cobalt、Border Strong、Stronger borders、High
contrast、对应模式 Contrast High、Disable decorative gradients。

### 2.2 证据文件与复现条件

本地忽略目录 `.analysis/dark-surface-audit/` 保存：

| 文件                      | 用途                                                       |
| ------------------------- | ---------------------------------------------------------- |
| `app-1.13.7.css`          | 从当前客户端读取的原生 CSSOM 快照，仅供本地审计            |
| `probe.js`                | 临时隔离样式复现脚本                                       |
| `final-computed.json`     | 最终 27 组测量结果；应使用此文件，而非早期 `computed.json` |
| `final-probe-output.json` | 关键节点测量摘要                                           |
| `check.log`               | 本轮最终质量门禁日志                                       |

这些文件不属于发行物，也不要求将 Obsidian 原生完整 CSS 提交或分发。合成 DOM 不是 Obsidian
Markdown 渲染器本身；只有“当前原生 CSS + 当前主题”的绘制规则和变量结果得到复现。测试 iframe 已移除，未切换用户实际笔记的模式或修改内容。

主题构建输入和输出的审计起点 SHA-256（`theme.css`）：

```text
66f7d394ac38b3b7e67ffdcba942042fca656bdb29d7d64ed6f1fe8f5d0bbd55
```

### 2.3 不应扩大解释的部分

本轮没有重新完成真实笔记中的鼠标/键盘/Vim 操作、插件安装与重置、Canvas/Graph/Bases 的完整交互、弹出窗口、RTL、物理移动设备或 Windows
High Contrast 测试。没有重新截图一份已修复的真实 Obsidian 笔记，因为修复尚未实施。

本轮也没有进行外部社区主题的视觉复制或代码借用。“其他元素”按本主题内的其他组件解释。

## 3. 截图根因：为什么颜色写了，框却看不见

### 3.1 D01：更暗的底色与 `lighten` 的方向相冲突

相关源文件：`src/tokens/semantic-dark.css`、`src/editor/content.css`。

主题设置的 Callout 实体底色为：

```css
--callout-content-background: color-mix(
  in srgb,
  var(--aoi-night-canvas) 88%,
  var(--aoi-night-surface)
);
```

外层 `.callout` 把它用作自身 `background-color`；内层 `.callout-content`
透明。这种“外层负责连续底面”的设计意图本身合理。

但是原生 `.callout` 同时使用：

```css
mix-blend-mode: var(--callout-blend-mode);
```

原生的变量链是 `--callout-blend-mode` → `--highlight-mix-blend-mode`，暗色模式最终为
`lighten`。主题没有覆盖它。

隔离测量结果：

| 属性             | 当前暗色 Aoi Tori Callout                 |
| ---------------- | ----------------------------------------- |
| 正文背景         | `#222A30`，RGB 34 / 42 / 48               |
| Callout 原始底色 | RGB 26.08 / 32.32 / 39.20，近似 `#1A2027` |
| 默认 wash        | Aoi Tori 6%，Second voice 6%              |
| 最终混合模式     | `lighten`                                 |
| 侧边线宽度       | `0px`                                     |

`lighten`
逐通道保留前景与背景中较亮的值。原始底色的三个通道均低于正文，因此无 wash 的大面积区域会得到正文的颜色。6%
wash 只影响渐变的一端，向 70% 位置淡出；不能承担整块容器的可见性。详见
[MDN 混合模式说明](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/blend-mode)。

这也解释了截图中图标仍清楚、正文仍能读，却看不到框体的现象：图标和文字更亮，底色更暗。

**影响范围不止两种自定义块。**
所有采用这套外层规则、位于普通暗色正文合成环境中的 Callout 都有同类风险。原生某些嵌入/Canvas 场景会单独使用
`normal`，因此同一块在不同宿主中可能表现不同，不能假定所有上下文都完全相同。

Callout 的混合还会作用于其整体绘制内容，包含内嵌代码背景、图片和更深的引用层。内层元素即使自己的
`mix-blend-mode` 是 `normal`，也不能消除祖先的合成影响。该风险需要真实嵌套内容回归。

**排除一个容易误修的方向：** 当前 `--callout-color` 已使用合法 CSS 颜色，且浏览器成功解析为
`#7fc3e8` 等值；不应改回旧式 RGB 三元组。Obsidian
1.13 的官方变更要求使用合法 CSS 颜色。[官方变更说明](https://obsidian.md/changelog/2026-07-30-desktop-v1.13.4/)、[官方 Callout 帮助](https://obsidian.md/help/callouts)。

### 3.2 D02：为什么预期的 2px 边线也没有生效

主题在 `src/tokens/typography.css` 的 `:root` 中声明：

```css
--callout-border-width: 2px;
```

当前原生 CSS 在 `body` 上声明 `--callout-border-width: 0px`。浏览器对子元素使用 `body`
的值，不会为了主题的 `:root` 声明位于后面就跳过这个更近的显式值。

这是**继承作用域问题**，不是简单的选择器权重竞赛。把 `:root`
写得更长，或调整同一个 root 声明的文件顺序，不能修复 `body` 已显式声明的事实。

外层规则又执行 `border: 0`，只依赖 `border-inline-start`
恢复结构。侧边宽度为 0 时，整个外框便没有备用边界。隔离实验把值设在 `body` 后，侧边确实恢复到
`2px`。

### 3.3 普通引用与 Quote Callout 的区别

| Markdown 形式                       | 当前路径                                   | 本轮结果                                        |
| ----------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `> 普通引用`                        | 原生 blockquote / HyperMD quote 加主题规则 | `normal` 合成，底色 `#2C343C`，Reading 侧边 2px |
| `> [!quote]` / `[!cite]`            | `.callout`                                 | 受 D01、D02 影响                                |
| `> [!aoi-tori]` / `[!second-voice]` | `.callout` + 类型映射                      | 与截图一致，受 D01、D02 影响                    |

普通引用的深色底面目前是较浅的 panel，并未发生同样的底面抵消。它仍有“尾端 wash 淡出后层次偏弱”和多层嵌套的检查需求，但不应当作已经消失的框直接重设计。

## 4. 其他确定缺陷

### 4.1 D03：代码块的默认边框与设置默认值不一致

主题在 `:root` 设 `--code-border-width: 1px`，原生 `body` 设 `0px`，导致默认 `pre` 与合成
`.HyperMD-codeblock` 都没有边框。

| 状态                | 块级代码边框 | 段落内行内代码边框 |
| ------------------- | ------------ | ------------------ |
| 无设置类            | 0px          | 1px                |
| `aoi-code-bordered` | 1px          | 1px                |
| `aoi-code-quiet`    | 0px          | 0px                |

以上两种主题模式均复现。行内代码必须使用真实的 `p > code` 结构测量；直接把 `code` 放在
`.markdown-rendered` 下不能代表主题的行内代码选择器。

所以“不安装 Style Settings”与“安装并重置到默认 Bordered”外观不一致。暗色代码底面 `#191F26`
与正文的对比度只有约 1.14:1，边界缺失进一步降低可见性。

修复应恢复块级边框默认值，并保留 Quiet 的显式选择，而非删除 Quiet。

### 4.2 D04：默认活动行底色失效

`typography.css` 在 `:root` 声明：

```css
--aoi-active-line-background: var(--background-modifier-hover);
```

依赖变量在正文模式/原生 `body` 层定义，无法向上被 `:root`
读取。别名在定义层已经失效，不会在继承到子元素后自动重新求值。

实际结果：默认和 `aoi-active-line-subtle` 下 `.cm-active.cm-line` 背景透明；`aoi-active-line-clear`
在 `body` 重新声明别名后恢复有色背景。

这是与用户描述一致的另一种“应该有底色，但看不出来”：此处首先应修正作用域，再审查强度。Off 应继续作为主动关闭选项。

### 4.3 D05：图片附加选中外框的默认值失效

同样的问题存在于：

```css
--aoi-image-selection-color: var(--background-modifier-border-focus);
```

无插件默认合成节点 `.image-embed.is-selected` 的主题 `outline` 计算为 `none`；添加
`aoi-image-selection-cobalt` 后为暗色 cobalt 的 `solid 1px`。

这是**主题附加外框**失效，不能据此声称原生图片选择、resize handle 或 `:focus-visible`
全部失效。原生选中 cue 和独立焦点规则可能仍然存在。修复后必须验证鼠标与键盘的相邻状态，避免制造双重粗框或布局跳动。

另外，浅色模式无插件设计链指向 focus blue，而设置默认 Cobalt 指向 cobalt
deep；即使作用域修好，默认颜色也应统一到经过确认的一种语义，而非留下两套默认。

### 4.4 D06：增强边框并没有增强所有相关边界

`aoi-border-strong`、`aoi-stronger-borders`、模式 Contrast High 主要改
`--background-modifier-border`。但多个组件绕过它，直接引用 `--aoi-night-border`：

- 输入框：`--input-unfocused-border-color`。
- Properties：`--metadata-border-color`、divider。
- 代码：`--code-border-color`。
- 标签与未选任务框：`--tag-border-color`、`--checkbox-border-color`。
- 菜单与模态框：`--menu-border-color`、`--modal-border-color`。
- 表格：独立混色的 table/header border。
- Bases、PDF、工作区分隔：还有各自的独立变量或阴影。

暗色 Stronger borders 下，通用变量变为 night border 68% + muted
32%；隔离 DOM 中输入框与 Properties 的实际边色仍为 `rgb(70,83,95)`，表格边色也保持不变。

`aoi-high-contrast` 本身主要增强文本和图标，不能把“开了 High
contrast”解释为已经补齐所有结构边界。`prefers-contrast: more`
从源码上有相同的独立映射盲区，但本轮没有重新运行它的浏览器媒体仿真。

**修复方向：** 为必要控制边界与装饰分隔建立不同语义；明确哪些组件响应 Stronger
borders，哪些语义状态保留自己的颜色。不能把整个主题所有边框一律改亮。

### 4.5 D07/D08：Callout 设置和类型家族不一致

`body.aoi-callout-quiet`
把 wash 设为 3%，Airy 设为 7%。但深色类型规则在 Callout 元素自身重设 wash：Success/Warning/Error 部分别名固定 5%，Second
voice 固定 6%。子元素的显式值优先于来自 `body` 的继承值。

| 类型                                        | 默认 | Quiet | Airy |
| ------------------------------------------- | ---- | ----- | ---- |
| Aoi Tori / Info                             | 6%   | 3%    | 7%   |
| Second voice                                | 6%   | 6%    | 6%   |
| Success / Warning / Error（主题列出的别名） | 5%   | 5%    | 5%   |
| Attention / Missing（未列入对应强度规则）   | 6%   | 3%    | 7%   |

因此 Quiet/Airy 的间距和圆角仍可能改变，但背景强度不一致。用户不能可靠地通过该设置解决看不清的问题。

当前原生 Callout 家族还包括
`abstract/summary/tldr`、`tip/hint`、`question/help/faq`、`warning/caution/attention`、`failure/fail/missing`。主题未完全覆盖所有别名的图标与强度。其颜色仍可通过原生变量回退，本轮未发现这些类型整体颜色无效；问题是同一语义家族的视觉不一致。

### 4.6 R02：不要忽略更广泛的默认作用域问题

当前无设置类的隔离结果还包括：Callout radius 为 4px，而不是设计期望的
`radius-m`；标题权重继承原生公式后为 640，而不是主题的 medium；`--font-text-theme` 在 body 为原生
`'??'` 占位值，而不是 root 中指定的文学字体栈。

这些说明问题不限于两个边框变量。但不能把整个 `typography.css` 从 `:root` 一键迁到 `body`
后当作小修：字号、宽度、字重、字体、圆角等可能一起改变，当前已接受截图的排版会受影响。应先修影响可见性和交互的值，再列出其余默认差异，以单独的前后对比决定是否恢复设计值或正式更新设计文档。

## 5. 全组件检查结果与处理边界

下表中的“未见同根因”只表示没有发现同样的 Callout 合成问题，不代表已通过完整手工交互测试。

| 元素/状态                  | 当前发现                                      | 风险与修复范围                                                  |
| -------------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| 普通引用 Reading           | panel 底色 + 2px 语义边，正常合成             | 保留；查右侧淡出区、Clean、嵌套和折行                           |
| 普通引用 Live Preview      | 原生 HyperMD quote 能消费 panel 底色          | 检查逐行连续性和 Reading 一致性；不复制块 padding 到每一行      |
| 内置/自定义/未知 Callout   | 共用 blend 与零边框问题                       | D01/D02 全家族修复，未知类型保留 native default                 |
| 折叠与嵌套 Callout         | 祖先合成可能影响子层；本轮未操作折叠          | 验证折叠标题、箭头、focus、双层及三层结构                       |
| 块级代码                   | 深底面仍有效，默认边框缺失                    | D03；检查 Live Preview 首中末行，不画出逐行小盒子               |
| 行内代码 / KBD             | 行内 code 实际保留 1px；KBD 源码有独立边线    | 统一 Quiet/Bordered；检查嵌套容器上同色底面                     |
| 活动行                     | 默认背景透明                                  | D04，保留 Off，确认选区叠加后文字对比                           |
| Properties 外框/键值区域   | canvas 外底，panel key，外框存在              | 外底与正文仅 1.14:1；增强映射、hover/edit 状态需回归            |
| Properties 输入/hover      | 值区域透明是有意设计，不应直接填实            | 检查 `focus-within`/active 的原生消费，避免统一规则吞掉编辑状态 |
| 表格头、单元格、hover      | 头底与正文相近；网格低亮度且独立映射          | 优先增强结构/状态，保留密集表格的轻量感                         |
| Callout 内表格/Bases       | 原生在 Callout 局部重声明边界变量             | 需实际检查局部语义覆盖；只改 body table token 不保证生效        |
| 标签                       | panel 背景 + 1px 边框；正文 cobalt 可读       | 属于低层次风险，不必全部做成醒目按钮                            |
| 普通高亮                   | `#3A3020` 与正文约 1.13:1                     | 高亮语义可能偏弱；单独改善背景/标记，不能把文字改成警告色       |
| 文本选择/搜索当前命中      | 半透明背景依赖下层颜色                        | 测量合成后文字与当前/非当前区别；不能只看原始 RGBA              |
| 未选任务复选框             | 透明底，1px `#46535F` 边                      | 约 1.85:1 对正文；当它是识别未选控制的必要形状时应优先强化      |
| 开关 Off/On                | Off panel，On accent，原生滑块几何保留        | 查轨道/滑块/背景两侧对比；不重新给固定尺寸轨道加布局 border     |
| 输入框/下拉/按钮           | 有底色、有边框；多处不响应加强设置            | D06；普通、hover、focus、disabled、invalid 分别验收             |
| 菜单/模态框                | 背景等于正文，但原生 1px 边与阴影存在         | 同色并非自动错误；检查遮罩、轮廓、层叠和弹出窗口                |
| Tooltip/Notice/Settings 行 | panel/canvas 分层，源码有边界或原生结构       | 优先测试浅弱边界与 disabled/error；不统一换成 Callout 底色      |
| 文件导航/活动标签          | 现有活动、选中文字有自动对比度保障            | 保留已修正的 92% panel 混色，禁止为醒目重新扩大 accent 比例     |
| 左右侧栏/分隔/窄布局       | 有既有表面角色和截图证据                      | 本轮不重设计 Duet；查弹出面板是否仍有足够分离                   |
| 图片/图片动作              | 附加选中框默认有 D05；hover/focus 另有规则    | 修复语义别名，保持 resize/Lightbox 和原生行为                   |
| 笔记/PDF/媒体嵌入          | canvas 底面可能与父容器同色                   | 保留 embed start edge；音视频、PDF 页面内容不应用全局滤色       |
| Bases Cards/Table          | 卡片与正文可同色，主要靠边/阴影；选中另有语义 | 检查卡片边与选中/active 单元格，避免只提亮卡片                  |
| Canvas                     | 节点、画布可能共用 surface，线与组边界很关键  | 在真实节点/组/选中/编辑状态验证；不猜内部选择器                 |
| Graph                      | 图形 renderer 使用独立 token                  | 检查边、聚焦/选中/搜索节点；不把它当矩形卡片处理                |
| 移动端工具栏/抽屉          | 复用 canvas/panel/左右角色                    | 需 320/390/平板布局和真实设备验证；暗色修复应通过变量自然继承   |
| Forced colors              | 现有规则删除装饰且部分边映射到系统色          | 零边宽无法靠改颜色挽救；检查最终边宽、系统色、真实 Windows      |

## 6. 表面量化：不能把文字可读等同于框体可见

下表使用当前暗色正文 `#222A30`
作为参照，采用 sRGB 相对亮度公式。混色先合成，数值显示到两位小数。这是颜色计算，不是屏幕亮度计测量，也不替代 PNG 最终像素验证。

| 表面或边界                         | 当前值/近似值 | 与正文对比度 | 解读                                       |
| ---------------------------------- | ------------- | ------------ | ------------------------------------------ |
| canvas：代码、Properties、输入底面 | `#191F26`     | 1.14:1       | 很浅的凹层，需要边界/结构辅助              |
| Callout 未混合底面                 | `#1A2027`     | 1.13:1       | 本来就很弱，经过 lighten 后大面积归为 1:1  |
| panel：普通引用、标签等            | `#2C343C`     | 1.15:1       | 可作轻抬升底面，但不能单独承担必要状态识别 |
| 普通引用最大 4% wash 端            | 约 `#333941`  | 1.25:1       | 渐变尾端仍回到 panel；不能只测最明显的一端 |
| 通用边界                           | `#46535F`     | 1.85:1       | 装饰分隔可用，必要控制轮廓需另评估         |
| 表格普通边线                       | 约 `#38434E`  | 1.44:1       | 密集网格较弱                               |
| 表格头边线                         | 约 `#3B4751`  | 1.53:1       | 与普通网格区别小                           |
| 高亮底面                           | `#3A3020`     | 1.13:1       | 色相变化存在，亮度分离较弱                 |
| info-soft / 表格选中底面           | `#1B3347`     | 1.12:1       | 必须联合选中边线判断，不能仅靠填色         |

WCAG
1.4.11 的 3:1 适用于识别必要 UI 控件及状态所需的非文本视觉信息，并不要求所有装饰卡片与页面都达到 3:1。已由清楚文字或图标识别的控制也不一定需要额外 3:1 外框。本文不会把每一条低于 3:1 的装饰边界直接判为 WCAG 失败。[W3C 非文本对比度解释](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)。

推荐项目内部验收目标：

- 正常正文、小字号必要文本：至少 4.5:1，按实际显示背景计算。
- 必要焦点、选中指示及控制形状：按适用状态核对至少 3:1，并有位置、轮廓、字重或图标等辅助信息。
- 普通内容容器：先确保有连续实体底面或清晰结构边；可暂以约 1.15:1 的底面分离作为低限检查，再以截图确认。此项是项目设计标准，不是 WCAG 标准。
- 所有范围比较使用未舍入数值判定，尤其不要把 4.495 四舍五入成 4.50 后算通过。

## 7. 最终修复设计

### 7.1 第一阶段：恢复绘制与默认作用域

先不要改变全局 `--aoi-night-surface` 或 `--aoi-night-cobalt`。

1. 为 Callout 显式定义
   `--callout-blend-mode: normal`，在能覆盖原生 body 默认值的主题层生效。保留原生变量消费，避免全局改所有元素的混合模式。
2. 用独立语义 `--aoi-callout-surface` 表示**外层实体底面**。不要继续借用名称意味着“内层正文”的
   `--callout-content-background`。
3. 外层 `.callout` 使用新 surface；内层 `.callout-content` 维持透明，避免恢复早期的内嵌黑/白色板。
4. 在 `body` 生效的几何层恢复
   `--callout-border-width: 2px`、`--code-border-width: 1px`。保持后面的 Quiet/Bordered 设置能覆盖。
5. 将 `--aoi-active-line-background`、`--aoi-image-selection-color`
   等依赖模式语义的别名定义在模式层或 body，确保解析时依赖已存在。
6. 新增检查：默认无插件、默认类全部存在、插件禁用后的状态三者必须一致。

下面是实施方向，不是完整可直接发布补丁；实现时应按既有文件职责放置，并重新验证源代码顺序和字体等未改动范围：

```css
/* typography.css：只迁移本阶段确认需要修复的几何默认值 */
body {
  --callout-border-width: 2px;
  --code-border-width: 1px;
  --aoi-inline-code-border-width: var(--code-border-width);
}

/* semantic-dark.css：依赖模式颜色的别名在模式层求值 */
.theme-dark {
  --callout-blend-mode: normal;
  --aoi-callout-surface: var(--aoi-night-panel);
  --aoi-active-line-background: var(--background-modifier-hover);
  --aoi-image-selection-color: var(--aoi-night-cobalt);
}

/* semantic-light.css 同样显式 normal，并定义该模式的 surface 和默认选中语义 */

/* editor/content.css：外层负责连续实体表面 */
.callout {
  background-color: var(--aoi-callout-surface);
}

.callout-content {
  background-color: transparent;
}
```

不要只在 `.callout` 上局部加宽边线却忽略无插件默认、Light/Live Preview 和后续设置；也不要试图用
`!important` 遮盖继承问题。

### 7.2 第二阶段：选择稳妥的暗色 Callout 底面

推荐第一候选直接复用现有
`--aoi-night-panel: #2C343C`。它无需引入新色相，正文依然安静，并与普通引用、标签等既有系统一致。用正常合成 +
2px 语义侧边线承担结构，少量 wash 承担气氛。

如截图验收认为外框右边界仍不足，可补一条低强度结构轮廓：使用专用 semantic
border，或不影响布局的内侧描边。不要用大型投影代替边界；同时确认折叠区域的 focus
outline 不被原生 overflow 裁切。外轮廓是验收后的小范围加强项，不应成为对所有组件的统一粗框。

候选表（按最大 wash 端合成，尾端为实体底面）：

| 候选               | 代表状态        | 文字对比度 | 链接 cobalt 对比度 | 结论                                   |
| ------------------ | --------------- | ---------- | ------------------ | -------------------------------------- |
| `#2C343C`          | 无 wash         | 10.47:1    | 5.45:1             | 有余量，推荐起点                       |
| `#2C343C` + sky 6% | Aoi Tori / Info | 9.27:1     | 4.82:1             | 默认仍有余量                           |
| `#2C343C` + sky 7% | Airy Info       | 9.08:1     | 4.72:1             | 应纳入最坏状态检查                     |
| `#303941` + sky 7% | 更亮面板候选    | 8.47:1     | 4.41:1             | 不推荐直接采用；正文虽清楚，链接已不足 |

因此不建议为了让框显眼把整个 panel 一路提亮，更不建议恢复旧的高饱和 navy 底面。需要更强结构时，优先在组件局部增强边界。候选数值没有经过真实修复截图验收；它们是实施起点，不是已确定的发布配色。

Light 模式也应消除整个 Callout 的 `darken`
合成依赖；先保留现有浅色实体面和 wash，再检查图片内容及边缘，而不是借暗色修复顺便更换浅色体系。

### 7.3 第三阶段：统一边框响应，保护必要控制

建立或明确以下语义角色：

| 角色        | 应用范围                                       | 响应要求                                       |
| ----------- | ---------------------------------------------- | ---------------------------------------------- |
| 结构分隔边  | Properties、表格、菜单、模态框、普通代码、卡片 | Standard/Strong 与系统增强对比有明确、可见差异 |
| 控制边界    | 输入框、未选复选框、必要的 off 轨道            | 根据相邻背景计算；必要形状不能低于适用对比要求 |
| 焦点/选中边 | 图片、键盘焦点、Bases active、表格 selection   | 独立功能色，不能被 Soft borders 弱化           |
| 语义边      | 错误、警告、成功、Callout 类型                 | 保持安全含义，不统一映射成蓝灰                 |

实施原则：

- 组件通过公共角色或模式内显式映射响应设置，避免继续直接绑定不会随设置变化的 primitive。
- 在使用共同 body 语义的组件上，别名与被改变的值应在同一层解析。
- 对 Callout 内表格等局部重声明的变量，在该局部上下文核查和处理；不认为全局变量改动必然传递。
- Stronger borders 68% border + 32%
  muted 的候选对正文约为 3.18:1，但对 panel 只有约 2.75:1。这说明不能把现有 Strong 值直接作为所有控件的合格边色；应针对最亮的必要相邻背景再调整控制边界角色。
- 不给 Toggle 固定尺寸轨道增加物理 border：仓库已有该操作导致几何偏移的历史。用原生变量或不改变盒模型的 outline，并复测轨道/滑块几何。
- High contrast、Dark contrast High、`prefers-contrast: more` 以及 Stronger
  borders 的职责要写清楚；设置名称与真实能力一致。

### 7.4 第四阶段：修好 Callout 用户强度和别名

推荐将“类型默认值”与“用户选择”拆开，在 `.callout` 元素处计算最终值，例如：

```css
/* 示例结构：类型规则设置默认，用户设置提供覆盖值 */
.callout {
  --aoi-callout-wash-strength: var(
    --aoi-callout-user-wash-strength,
    var(--aoi-callout-type-wash-strength)
  );
}
```

实施时必须同时解决 fallback 的继承：类型默认值应在**每个 Callout 自身**设定，再由该元素的类型规则覆盖，不能让内部 Info 继承外部 Error 的默认强度。未选择 Quiet/Airy 时，user
override 保持未定义；Balanced/Reset 必须确实删除旧设置类，恢复类型默认。

建议合同：

- Balanced：保留独立的类型默认；普通类型 6%，安全家族若保留 5% 则整个同义家族一致。
- Quiet：所有类型都执行统一的 3% 用户偏好；实体底面和结构边不消失。
- Airy：所有类型执行经最坏状态验证的上限，暂以 7% 为起点。
- 关闭装饰渐变：只关闭 wash，底面、边、图标及语义文字保持可见。
- 别名按照原生家族归组，统一颜色/图标/强度。未知 Callout 保留原生 default 回退，不能因主题没有列举就失去样式。

不要只给 Quiet 选择器再加一点 specificity：子元素自身声明与继承值不是同一层的竞争。

### 7.5 第五阶段：处理其余弱层次，控制范围

- **普通引用**：先保留现有 panel 与 2px 边，分别验收 Reading 与 Live
  Preview；根据渐变尾端与嵌套结果决定是否微调。
- **代码**：先恢复边框；Quiet 需要在 Properties、Callout 等同色宿主内仍有可辨结构，必要时局部使用不同 surface，不全局提高亮度。
- **Properties**：保留键/值角色差异；增强外边界与编辑反馈，避免把透明输入层统一填实。
- **表格/Bases**：先校准分隔与 selected/active 边；保持正常表头、排序、hover、选择不互相混淆。
- **高亮与搜索**：另外建立背景语义审查；普通高亮、当前搜索结果、非当前结果不可混成一个色块。核查选择背景叠加后的正文和链接。
- **菜单/模态框/Notice**：确认边界和遮罩，在内容同色背景上仍能识别浮层；无需要求每层都换成更亮灰色。
- **字体、尺寸、圆角默认**：输出 root/body 差异清单，单独决定恢复与否；它们不应阻塞最先恢复 Callout，但也不能继续声明默认完全一致。

## 8. 自动化补强：让这类问题下次能够被发现

### 8.1 现有门禁遗漏了什么

`check-contrast.mjs`
用正则读取变量并检查配置中的六位 hex/别名对。它不执行浏览器继承，也不检查实体表面之间的区别、渐变、混合模式或元素最终 border
width。

`check-scenarios.mjs`
已有 582 个有效的侧栏/导航/强制颜色场景，价值应保留。但它主要覆盖已建模的 token 和规则；不加载完整原生 body 默认，也不是浏览器绘制器。因此它无法证明所有 Callout、编辑器、图片和表格边界正常。

**通过门禁与截图仍有缺陷可以同时成立。**
不应降低原有对比度阈值，也不应删除已有 582 个测试来换取新的表面测试。

### 8.2 建议新增的回归层

1. **原生消费契约测试**：最小测试夹具包含原生 body 默认声明与相关消费规则，特别是 Callout
   blend/width、code width 和 root/body 继承。记录来源版本，不将完整原生 CSS 打包。
2. **浏览器 computed-style 测试**：验证最终 background、border
   width/style/color、outline、mix-blend-mode；CSS 自定义属性“字符串存在”不算通过。
3. **最终像素测试**：在实际 Obsidian 测试笔记或等效渲染页面取样容器内部、渐变首端/中部/尾端、外部背景、侧边线。排除文字、阴影和抗锯齿采样点，记录 DPI/缩放和容差。
4. **默认一致性测试**：无插件、全部默认类、重置后、禁用插件后分别比较最终样式；同时涵盖 root 上无效别名与 body 覆盖。
5. **状态/嵌套测试**：填色相同但边界不同的状态，必须检查完整识别信号；包含 Callout 内代码、图片、引用、表格和嵌套 Callout。

实施前先明确浏览器测试在本地与 CI 的运行条件；优先复用已有运行时。若需要新增开发依赖，在 `PLANS.md`
说明用途与运行边界，不增加主题运行时依赖。

### 8.3 必须能失败的反向测试

| 故意引入的变异                      | 新检查必须如何失败                         |
| ----------------------------------- | ------------------------------------------ |
| 暗色 Callout 恢复 `lighten`         | blend 契约失败；像素测试发现底面与正文重合 |
| 将 Callout width 移回只在 root 定义 | 实际侧边 0px，边界测试失败                 |
| 将 code width 移回 root             | 无插件块级 0px，与默认类 1px 不一致        |
| 将活动行别名移回 root               | 计算背景透明，Subtle 默认一致性失败        |
| 将图片颜色别名移回 root             | 主题附加选中 outline 失效                  |
| 恢复安全 Callout 固定 wash          | Quiet/Airy 家族矩阵失败                    |
| 更亮 Callout surface 配 Airy 7%     | 链接对比低于阈值时失败，即使正文通过       |
| Stronger borders 只改通用 token     | 受合同覆盖的组件实际边色无变化，测试失败   |

## 9. 实施顺序、文件修改与交付物

| 步骤 | 工作                                        | 主要文件                                                                          | 完成条件                                    |
| ---- | ------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------- |
| T0   | 记录工作区、版本、原生规则、基线图与 hash   | `PLANS.md`、本地审计目录                                                          | 清晰区分当前证据与历史截图                  |
| T1   | 先建立能复现 D01–D05 的最小失败用例         | 新浏览器/原生消费夹具，必要的检查脚本                                             | 撤销修复时确实失败                          |
| T2   | 修复 Callout 合成、底面角色、关键几何作用域 | `semantic-light.css`、`semantic-dark.css`、`typography.css`、`editor/content.css` | 正常合成、实体底面、2px 侧边                |
| T3   | 修复代码、活动行、图片默认与默认类一致性    | 模式语义、typography、`settings/style-settings.css`                               | 无插件与默认设置相同；主动 Off/Quiet 仍有效 |
| T4   | 边框角色与增强设置映射                      | 模式语义、settings、`accessibility.css`                                           | 必要组件实际响应；安全颜色和 focus 保留     |
| T5   | Callout 家族、强度、嵌套默认                | `editor/content.css`、settings、模式语义                                          | Quiet/Balanced/Airy 合同一致                |
| T6   | 按量化结果补齐弱层次                        | 优先模式语义；必要时小范围组件规则                                                | 不降低文字对比，不重设计无关区域            |
| T7   | 真实笔记与平台回归、记录待测项              | `docs/TESTING.md`、`docs/obsidian-dom.md`                                         | 真实、模拟、未测试清楚分列                  |
| T8   | 同步设计、架构、计划；重新生成              | `docs/DESIGN.md`、必要的 `docs/ARCHITECTURE.md`、`PLANS.md`、生成的 `theme.css`   | 文档与实际行为一致，质量门禁通过            |

`src/tokens/primitives.css`
只有在现有颜色无法满足必要控制对比时才新增候选 primitive。组件文件继续只使用 semantic
token，不添加局部 hex、外部资源或不必要选择器。

本轮推荐不新增 Style Settings 项：先使当前的默认、Quiet/Airy、High contrast 和 Stronger
borders 可靠。新控件不是修复失效设置的替代方案。

## 10. 验收矩阵

### 10.1 内容与交互

| 验收项                | 必须检查的状态                                  | 合格标准                                                |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| 截图中的两个 Callout  | Dark、默认、无插件                              | 连续底面和侧边可辨，图标/正文保留，右侧不靠渐变才能识别 |
| 全家族 Callout        | 30 个类型/别名/未知类型                         | 类型语义一致，所有背景/边框声明有效                     |
| 内容量                | 无正文、单行、长标题、长正文、折叠              | 不出现空壳或内容覆盖，不裁切 focus                      |
| 嵌套                  | 两/三层 Callout、quote、code、table、图片       | 内外边界可分，图片颜色不受容器 blend 改写               |
| 三编辑模式            | Reading、Live Preview、Source                   | 语义一致，尊重各模式 DOM；Source 不强行渲染成卡片       |
| 代码                  | 首中末行、长行、Quiet、Bordered、嵌套           | 默认边框一致，不出现逐行圆角盒子/双重边                 |
| 活动行                | Off/Subtle/Clear、选区、Vim                     | Off 仅主动关闭；其余可辨且不遮文字                      |
| 图片                  | 鼠标/键盘选择、焦点、resize、Lightbox           | 保留原生操作，选中外框不引起尺寸变化                    |
| Properties/表格/Bases | resting/hover/edit/focus/selected/disabled      | 每个必要状态可区分，层次增强不侵入原生行为              |
| 控件与浮层            | 输入、toggle、dropdown、菜单、modal、Notice     | 控制边界、焦点、错误、禁用语义可靠                      |
| 文本语义              | 链接、bold、italic、code、highlight、搜索、选区 | 实际合成后仍满足文字对比和语义区别                      |

### 10.2 设置与环境

- 深/浅模式各一轮；测试目标首先为本机 Desktop/Installer
  1.13.7，声明支持的最低 1.13.4 需独立回归或标为未复测。
- 无 Style Settings、安装后默认、重置、禁用插件；不能只手动加一个默认类代表完整生命周期。
- Quiet/Balanced/Airy × 两种禁用渐变入口 × Code Quiet/Bordered，覆盖代表性叠加。
- Border Soft/Standard/Strong、Stronger borders、两种 High contrast、`prefers-contrast: more`
  的覆盖顺序。
- `forced-colors` 实際 background/border/outline 与系统色；真实 Windows High Contrast 单独记录。
- 90%/100%/110% 缩放、窄窗口、分栏、弹出窗口、左右侧栏关闭。
- 手机 320px/390px、平板及 RTL；模拟与物理设备区分记录。
- 完成图像修改相关的原生回归：copy/cut/delete、grow/shrink/reset、Enter/Tab、Space/zoom、resize、Vim 命令和嵌套宿主。
- 当前官方更新页已列出 1.14.1
  Catalyst；新增彩色高亮、Bases 布局和输入 hover 等变化只列为后续兼容性验证，不冒称本轮已测试或擅自升级目标版本。[官方更新页](https://obsidian.md/changelog/)。

### 10.3 执行命令与发布边界

实施阶段至少运行：

```bash
npm run build
npm run lint
npm run audit
npm run contrast
npm run scenarios
npm run check
git diff --check
```

新增浏览器回归应进入 `npm run check`
或明确的必跑门禁。格式化限本次涉及文件，避免改动无关用户内容。始终由 `src/` 生成
`theme.css`；不要直接编辑根目录产物。

只有实际进入发布阶段才运行 `npm run release`/`npm run package`
并验证安装包。当前审计不包含版本号更新、提交、推送或发布。

## 11. 本轮交付与验证记录

本轮仓库交付：

- 新增本文件，记录问题、根因、范围、候选方案、实施步骤和验收标准。
- 更新 `PLANS.md`，记录审计边界、证据与完成状态。
- `theme.css` 经质量门禁从源重新生成；要求与本轮基线保持字节一致。没有主题源文件或发布元数据修改。

最终检查结果：

| 检查                                                                  | 结果                                                                         |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `obsidian version`、原生 CSSOM 读取、隔离 DOM 复现                    | 完成；27 组 / 每组 48 节点                                                   |
| `npx prettier --write PLANS.md docs/dark-surface-audit-2026-09-13.md` | 完成，仅格式化本轮文档                                                       |
| `npm run check`                                                       | 通过：构建、CSS lint、格式、仓库审计、45 个颜色对、582 个场景、manifest 校验 |
| `git diff --check`                                                    | 通过                                                                         |
| `shasum -a 256 theme.css`                                             | 与第 2 节基线一致；构建后没有 CSS diff                                       |
| 修复后的真实应用交互与设备测试                                        | 尚未执行；属于下一阶段                                                       |

首次 `npm run check` 在本轮新增计划条目的格式检查处停止，CSS build 与 CSS
lint 通过；格式化该条目后重新运行完整门禁通过。该格式问题属于本轮文档改动，不能标记为既有仓库失败。

剩余风险：候选底面尚未实施和完成真实修复截图验收；合成节点不能替代应用原生交互；所有本文明确列出的真实设备、插件生命周期与平台测试仍需在实施阶段完成。
