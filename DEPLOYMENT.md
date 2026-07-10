# 部署说明

## 项目类型

这是一个 Vite + React + TypeScript 的纯静态网站，不需要数据库、后端服务、登录系统或环境变量。

## 构建前提

- Node.js ^20.19.0、^22.0.0 或 >=24.0.0
- npm
- 已提交且可信的 package-lock.json

## 构建与预览

在项目根目录执行：

    npm ci
    npm run verify
    npm run preview

其中：

- npm ci 按锁定版本安装依赖。
- npm run test 验证核心功能。
- npm run build 生成生产产物。
- node scripts/verify-build.mjs 检查 dist/ 的必要文件、静态资源和本地路径泄漏。
- npm run preview 用于本地检查生产构建。

生产文件目录为 dist/。不要手动修改 dist/ 内的文件，修复源文件后重新运行构建。

## 静态服务器要求

网站使用 Hash 路由，访问入口为 dist/index.html。静态服务器只需要托管 dist/ 目录，不需要额外配置服务端路由重写。

部署后应检查：

1. 首页、八字、六爻、梅花和关于页。
2. 未知 Hash 路径的 404 页面。
3. 直接刷新具体 Hash 路由。
4. 页面标题、描述、favicon 和免责声明。
5. 本地历史记录生成、刷新读取和清空。
6. 浏览器控制台和静态资源请求没有 404。

## 数据边界

用户输入和历史记录只保存在浏览器本地，不上传服务器。当前版本不需要配置 API key、token、域名或第三方统计脚本。

## 回滚

保留上一份经过 npm run verify 验证的 dist/ 产物即可回滚。正式发布前请由人工确认目标静态托管平台的访问权限和缓存策略。
