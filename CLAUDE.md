# CLAUDE.md - X Article Converter

**继承自父目录**: `/Users/ray/1-Projects/VibeCodingSpace/CLAUDE.md`

---

## 项目上下文

**项目名称**: Markdown → X Articles 格式转换器
**技术栈**: 纯静态单页应用 (HTML + Vanilla JS + marked.js)
**核心功能**: Markdown 转 X Articles 兼容的富文本 HTML，可直接粘贴到 X Articles 编辑器

**设计参考**:
- UI/UX: `/tools/wechat-converter/` (双栏布局、响应式、主题切换)
- 转换逻辑: `/.claude/skills/x-article-publisher/scripts/parse_markdown.py`

---

## 项目架构

```
x-article-converter/
├── index.html          # 单页应用（HTML + CSS + JS）
└── CLAUDE.md           # 项目上下文（本文件）
```

**架构特点**:
- 零依赖服务器，浏览器直接打开即可使用
- CDN 引入 `marked.js` 解析 Markdown
- X 风格深色主题（默认）+ 浅色主题切换
- 响应式设计（桌面双栏 / 移动端 Tab 切换）

---

## 核心功能

### 1. Markdown 解析

使用 marked.js 将 Markdown 转换为 HTML，支持：
- H2/H3 标题
- 加粗、斜体
- 链接
- 有序/无序列表
- 引用块
- 行内代码

### 2. 表格转列表

X Articles 不支持 HTML 表格，自动转换：

```markdown
| 作者 | 文章 | 数据 |
|------|------|------|
| @sys | The Prison | 25K |

↓ 转换为 ↓

- **作者**: @sys · **文章**: The Prison · **数据**: 25K
```

### 3. 图片剥离

图片需要在 X Articles 编辑器中单独上传，Markdown 中的图片语法会被自动移除。

### 4. 剪贴板复制

使用 Clipboard API 将 HTML 作为富文本复制，粘贴到 X Articles 编辑器时保留格式。

---

## 与 wechat-converter 的区别

| 特性 | wechat-converter | x-article-converter |
|------|------------------|---------------------|
| **目标平台** | 微信公众号 | X Articles |
| **默认主题** | 浅色（蓝色调） | 深色（X 风格） |
| **内联样式** | 必须（微信剥离 CSS） | 不需要（X 支持语义 HTML） |
| **表格处理** | 保留表格 | 转换为列表 |
| **图片处理** | 保留 | 剥离（需单独上传） |
| **高亮卡片** | 智能识别 | 无（X 有自己的格式） |

---

## 使用方式

### 本地运行

```bash
open /Users/ray/1-Projects/VibeCodingSpace/tools/x-article-converter/index.html
```

### 工作流程

1. 粘贴 Markdown 内容到左侧输入框
2. 右侧实时预览 X Articles 效果
3. 点击「复制到 X Articles」
4. 在 X Articles 编辑器中 Cmd+V 粘贴
5. 手动上传图片（如有）

---

## 代码结构

```javascript
// 核心函数
convertTablesToLists(markdown)  // 表格 → 列表
stripImages(markdown)           // 移除图片语法
getXArticlesHtml()              // 生成可复制的 HTML
copyToClipboard()               // 复制到剪贴板
```

---

## 样式设计

### X 风格配色

```css
--primary: #1d9bf0;           /* X 蓝 */
--page-bg: #15202b;           /* 深色背景 */
--text-primary: #e7e9ea;      /* 主文字 */
--text-secondary: #8b98a5;    /* 次要文字 */
```

### 预览区样式

- H2: 23px, 800 weight
- H3: 20px, 700 weight
- 正文: 18px, 1.75 行高
- 链接: X 蓝色

---

## 继承的设计原则

### Good Taste 实践

✅ **单文件架构**: 零配置，直接打开使用
✅ **功能聚焦**: 只做 Markdown → X Articles 转换
✅ **平台适配**: 表格转列表、图片剥离

### 实用主义体现

✅ **参考成熟方案**: 复用 wechat-converter 的 UI 架构
✅ **错误降级**: Clipboard API 失败 → execCommand 兜底

---

## 后续优化方向

1. **代码块样式**: 目前使用 blockquote 模拟，可优化
2. **Vercel 部署**: 添加在线访问地址
3. **与 x-article-publisher Skill 集成**: 自动调用此工具

---

**最后更新**: 2026-01-18
