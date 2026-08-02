---
title: Aoi Tori Visual Test
aliases:
  - 青い鳥主题视觉测试
tags:
  - aoi-tori
  - visual-review
status: phase-2-review
review-date: 2026-08-02
approved: false
rating: 4
---

# Aoi Tori Visual Test

中文、日文、English mixed
typography：一段安静的夏日阅读，用留白、深墨靛与清透蓝建立距离。静かな夏の空、二つの声、そして少しずつ近づく旋律。The
interface should remain calm, legible, and unmistakably document-first.

## Heading level two / 二级标题

### Heading level three / 三級見出し

#### Heading level four

##### Heading level five

###### Heading level six

## Links

- Internal link: [[Aoi-Tori-Visual-Test]]
- Long unresolved filename:
  [[这是一个用于测试文件浏览器和链接布局的非常非常长的中文文件名称—夏日与青鸟的距离]]
- External link: [Obsidian](https://obsidian.md/)
- Unresolved link: [[Aoi Tori 未创建的页面]]

## Lists and tasks

1. Warm paper reading surface
2. Cool mist-blue panels
   1. Powder-blue hover
   2. Cobalt focus and active state
3. Sparse sakura and gray-violet counter-voice

- Blue should remain selective.
- 白色不是单一冷白。
- 夏空の彩度は上限であり、画面全体の塗りではない。

- [x] Phase 1 image analysis complete
- [x] Engineering baseline passes
- [ ] Visual review in real Obsidian
- [ ] Mobile and touch review

## Quote

> Distance is expressed through breathing room, thin boundaries, and two nearby colors that never
> fully collapse into one another.

## Callouts and semantic states

> [!info] Information / 信息 Sky blue and clear cyan support neutral information without replacing
> body text.

> [!tip] Success / 成功 The core quality gate passed before visual implementation began.

> [!warning] Warning / 警告 Gold orange is decorative. Functional warnings use a darker accessible
> warning color.

> [!danger] Error / 错误 Destructive and error states stay semantically red rather than becoming
> sakura pink.

> [!example] Second voice / 第二声音 Sakura and gray violet appear in small, deliberate passages.

## Inline code and code block

Use `--interactive-accent` for the primary action and preserve `:focus-visible`.

```css
.review-target:focus-visible {
  outline: 2px solid var(--background-modifier-border-focus);
  outline-offset: 2px;
}
```

## Table

| Role            | Light mode      | Dark mode       | Essential text |
| --------------- | --------------- | --------------- | -------------- |
| Reading surface | Warm paper      | Night surface   | Yes            |
| Secondary panel | Mist blue       | Night canvas    | No             |
| Link and focus  | Deep cobalt     | Light cobalt    | Yes            |
| Gold point      | Decorative only | Decorative only | No             |

## Mathematics

Inline rhythm: $d(t)=\sin(t)+\frac{1}{2}\sin(2t)$.

$$
\text{distance} \rightarrow \text{breath} \rightarrow \text{approach}
$$

## Image interaction

Select the original local test image below with mouse and keyboard. Verify hover, selected outline,
action buttons, resize controls, Space lightbox, focus-visible, and that the image never shifts when
the outline appears.

![[Aoi-Tori-Test-Image.svg|640]]

## Long paragraph

Aoi Tori should remain a reading environment before it becomes an illustration. The large pale
surfaces carry the quietness of watercolor paper, while a small number of deep cobalt anchors show
where attention and action belong. Sakura and gray violet stay close to the blue voice without
turning headings into a rainbow, and the warm gold point remains too rare to carry required
meaning. 在中文、日文和英文连续混排时，正文必须保持稳定的字重、行高和段落节奏；即使窗口变窄、侧栏展开、设置窗口独立打开，文字也不应该被过亮的蓝色或过强的面板阴影压住。

---

Final review markers: ==selection highlight==, **strong text**, _emphasis_, ~~deleted text~~, and a
footnote reference.[^review]

[^review]: This note is test-vault content and is not part of the installable theme package.
