# Aoi Tori Callout 图标与写法

这是当前主题的完整 Callout 使用指南。所有图标随 `theme.css`
提供，无需安装额外插件、复制 SVG 或启用 CSS snippet。默认图标 **22 px**，默认带 **28
px 圆形底托**；底托使用当前类型颜色的轻淡混合，深浅色分别适配。

## 最简单的写法

```markdown
> [!aoi-tori] 把这一页轻轻留住有些话还没有说完，先让它停在这里。
```

`aoi-tori` 默认是
**落羽**。三种羽毛不是随机切换，也不是同一个名称对应三个图标；选择不同名称即可固定图形。

## 主题专属图标速查

![十五种原创图标示意，非应用截图](../assets/callout-icons.svg)

统一记作
**`aoi-` + 英文物件或意象**。新笔记优先使用下表的推荐写法；兼容别名效果相同，不必批量修改旧笔记。

| 图标         | 推荐写法               | 兼容别名          | 颜色 | 适合用途                           |
| ------------ | ---------------------- | ----------------- | ---- | ---------------------------------- |
| 落羽         | `[!aoi-tori]`          | `[!aoi-feather]`  | 蓝   | 留存、感想、珍藏段落；主题默认羽毛 |
| 轻羽         | `[!aoi-feather-light]` | —                 | 蓝   | 轻量旁注、刚出现的念头             |
| 墨羽         | `[!aoi-feather-ink]`   | —                 | 蓝   | 更醒目的留存标记                   |
| 二重奏       | `[!aoi-duet]`          | `[!second-voice]` | 柔紫 | 两个观点、回应、第二种解释         |
| 长笛         | `[!aoi-flute]`         | `[!flute]`        | 蓝   | 想法展开、音乐笔记                 |
| 双簧管       | `[!aoi-oboe]`          | `[!oboe]`         | 柔紫 | 内省、另一声部、音乐笔记           |
| 小号         | `[!aoi-trumpet]`       | —                 | 蓝   | 清楚表达、练习要点                 |
| 大号         | `[!aoi-tuba]`          | `[!tuba]`         | 蓝   | 基础、总结、低音声部               |
| 上低音号     | `[!aoi-euphonium]`     | `[!euphonium]`    | 蓝   | 整理、承接、音乐笔记               |
| 青鸟         | `[!aoi-bluebird]`      | —                 | 蓝   | 放飞、转折、展望                   |
| 微开的窗     | `[!aoi-window]`        | —                 | 蓝   | 观察、旁注、换一个视角             |
| 换气         | `[!aoi-breath]`        | —                 | 蓝   | 暂存、停顿、尚未完成               |
| 余响         | `[!aoi-resonance]`     | —                 | 蓝   | 读后感、回顾、余韵                 |
| 童话书页     | `[!aoi-storybook]`     | —                 | 蓝   | 阅读、故事、记忆                   |
| 错落脚步     | `[!aoi-steps]`         | —                 | 蓝   | 练习日志、小进展、过程             |
| 普通音乐符号 | `[!aoi-music]`         | —                 | 柔紫 | 泛用音乐记录；保留原来的音符选项   |

前十五种为主题原创 SVG，最后一种使用 Obsidian 内置的
`lucide-music-2`。大号采用宽腹转阀式，上低音号采用修长活塞式的代表外形，二者不再只是同形缩放；小尺寸下仍建议写明标题。

`aoi-tori` 为兼容旧笔记继续代表羽毛；真正的鸟形是 `aoi-bluebird`。`second-voice`
保留语法兼容，但图标从普通音符更新为二重奏；想保留普通音符请使用 `aoi-music`。

## 三种羽毛直接比较

```markdown
> [!aoi-feather-light] 轻羽更轻的线稿。

> [!aoi-tori] 落羽弯曲羽轴与略带色块的羽片，默认推荐。

> [!aoi-feather-ink] 墨羽实心剪影，更有重量。
```

## 完整可复制示例

```markdown
> [!aoi-duet] 另一个声音同一个问题，也可以从稍远一点的地方再看一次。

> [!aoi-flute] 向外展开留出空间，让这个念头继续生长。

> [!aoi-oboe] 尚未说完写下暂时不容易表达的部分。

> [!aoi-trumpet] 清楚地响起把分散的念头收拢成一句话。

> [!aoi-tuba] 基础与总结放下可以反复使用的结论。

> [!aoi-euphonium] 承接下一段把零散材料组织起来。

> [!aoi-bluebird] 向远处留住相遇，也允许故事继续向前。

> [!aoi-window] 再看一次暂时移开原来的判断。

> [!aoi-breath] 下一句话之前先停一下，还没想清楚的部分也可以留下。

> [!aoi-resonance] 余响记录读完之后仍然留在心里的感受。

> [!aoi-storybook] 故事的这一页让现实与想象放在相邻的两页。

> [!aoi-steps] 一点一点向前今天完成了一件很小的事。

> [!aoi-music] 再听一次普通音符也可以安静地留在这里。
```

## 原生 Callout 仍然可用

主题没有用艺术图标替换警告、错误或成功等功能语义。所有类型同样采用默认 22
px 图标和圆形底托。下面列出当前主题及 Obsidian 原生映射，不需要另记一套主题前缀。

| 写法           | 别名                   | 图标（主题或原生 ID）                       |
| -------------- | ---------------------- | ------------------------------------------- |
| `[!note]`      | —                      | 笔记 `lucide-notebook-pen`                  |
| `[!abstract]`  | `summary`、`tldr`      | 摘要 `lucide-clipboard-list`（原生）        |
| `[!info]`      | —                      | 信息 `lucide-info`                          |
| `[!todo]`      | —                      | 待办 `lucide-list-checks`                   |
| `[!tip]`       | `hint`                 | 提示 `lucide-lightbulb`                     |
| `[!important]` | —                      | 重要 `lucide-flame`（原生，保留独立强调色） |
| `[!success]`   | `check`、`done`        | 成功 `lucide-circle-check`                  |
| `[!question]`  | `help`、`faq`          | 疑问 `lucide-circle-help`                   |
| `[!warning]`   | `caution`、`attention` | 警告 `lucide-triangle-alert`                |
| `[!failure]`   | `fail`、`missing`      | 失败 `lucide-circle-x`                      |
| `[!danger]`    | `error`                | 错误 `lucide-circle-x`                      |
| `[!bug]`       | —                      | 缺陷 `lucide-bug`                           |
| `[!example]`   | —                      | 示例 `lucide-flask-conical`                 |
| `[!quote]`     | `cite`                 | 引用 `lucide-quote`                         |

普通 Markdown 引用 `> 一段文字` 不会自动变成羽毛 Callout。只有 `[!aoi-tori]`
等明确类型才使用对应艺术图标。

## 标题、折叠与嵌套

类型名称后可以直接写中文标题，不必把类型翻译成中文。不写标题时，Obsidian 会以类型名称生成默认标题；主题不修改笔记文本。

```markdown
> [!aoi-breath]- 默认折叠展开后才能看到这段内容。

> [!aoi-window]+ 默认展开，可折叠点击标题区域可收起。

> [!aoi-duet] 两种声音第一个观点。
>
> > [!aoi-oboe] 回应第二个观点。
```

`+` 和 `-` 紧跟闭合方括号；不加符号时是普通 Callout。多段内容之间的空行也应带 `>`。嵌套层级增加一层
`>`。使用英文半角方括号、感叹号和连字符；推荐小写类型名。

## 兼容性与迁移

- Reading 和 Live
  Preview 使用 Obsidian 原生 Callout；Source 模式显示 Markdown 源码，不保证渲染图标。
- 新名称统一加
  `aoi-`，减少与其他主题、插件自定义类型的冲突。早期预览里的四个裸乐器名称继续作为别名；新笔记建议写带前缀版本。
- 自定义类型可直接输入；纯 CSS 主题不能承诺它们自动出现在原生类型选择菜单中，也不会注册全局图标到其他插件。
- 切换到其他主题后，Markdown 内容和折叠语法仍保留，但这些主题专属类型可能回退为默认 Callout。
- 其他 CSS snippets 或 Callout 插件可能覆盖颜色、图标和尺寸；先检查这些覆盖，再判断主题是否生效。
- `theme.css`
  已包含 SVG 字符串，不需要把本仓库的概念图文件夹安装进 Vault。Publish 或其他渲染器需单独加载兼容样式，不等于桌面主题自动同步过去。
- 手机、弹出窗口和不同版本的完整实际交互验收范围见
  [TESTING.md](TESTING.md)。不要把独立比较页当成真实 Obsidian 客户端截图。

语法依据：[Obsidian 官方 Callout 文档](https://obsidian.md/help/callouts)。主题原创图形遵循本仓库许可；美学研究和历史候选见
[设计研究](concepts/callout-icons-2026-09-14/README.md)。
