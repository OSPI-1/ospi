# TraditionalArtsWebsite

## 项目目标

构建一个中国传统术数文化网站 MVP，第一版包含八字、六爻、梅花易数三个模块，定位为传统文化学习、娱乐参考和个人反思工具。

## 当前状态

- 当前阶段：Active
- 负责人：User / Codex
- 最近更新：2026-07-09
- 技术栈：Vite + React + TypeScript + Tailwind CSS + Vitest

## 使用方式

```powershell
npm install
npm run dev
npm run test
npm run build
```

## 项目边界

所有结果页必须显示免责声明：内容仅供文化学习、娱乐参考，不构成医学、法律、投资、婚恋等现实决策建议。

第一版不做登录、付费、数据库、后台、AI 断语、现实决策建议、改运化解、复杂术数扩展、移动 App 或小程序。

## 文档导航

| Topic | Document |
| --- | --- |
| Requirements | `Requirements.md` |
| Architecture | `Architecture.md` |
| Plan and status | `Roadmap.md`, `Tasks.md`, `Todo.md` |
| History | `DevelopmentLog.md`, `Decisions.md`, `Release.md` |
| Learning | `Pitfalls.md`, `SOP.md`, `Review.md`, `PromptHistory.md` |
| Sources | `Resources.md` |

## 运行环境

项目已在 Node.js 24.18.0 与 npm 11.16.0 下完成验证。支持 Node.js ^20.19.0 或 >=22.12.0；项目不依赖环境变量。

## 发布前检查

执行 npm ci、npm run verify 和 npm run preview。

其中 npm run verify 会依次运行测试、生产构建和 dist 结构检查。构建产物位于 dist/，项目是使用 Hash 路由的纯静态网站。

## 数据与边界

- 八字、六爻、梅花易数是当前支持的三个模块。
- 历史记录只保存在当前浏览器的 localStorage，不会上传服务器。
- 内容仅供传统文化学习、娱乐参考与个人反思，不构成医学、法律、投资、婚恋、职业等现实决策建议。
- 当前版本不提供登录、数据库、后端、AI 解读、大运、流年、纳甲、世应、六亲或用神功能。
