# TraditionalArtsWebsite 项目交接文档

> 本文档用于将当前项目交接给新的 AI 对话。所有结论均以当前代码、当前配置和当前测试结果为准；代码变化后，本文件可能需要同步更新。本文不包含认证凭据、密钥或用户个人数据。

## 1. 项目概览

- 项目名称：TraditionalArtsWebsite
- 产品名称：玄览
- 产品定位：中国传统术数文化学习、娱乐参考与个人反思工具。
- 当前模块：八字、六爻、梅花易数。
- GitHub 仓库：https://github.com/OSPI-1/ospi
- 正式网站：https://ospi-nine.vercel.app/
- 当前发布版本：v1.0.0
- 当前部署形态：Vercel 托管的纯静态网站。

产品不是现实决策或确定性预测工具。所有结果页都应保留统一免责声明：

内容仅供传统文化学习、娱乐参考与个人反思，不构成医学、法律、投资、婚恋、职业等现实决策建议。请勿将相关结果作为重大决策依据。

## 2. 技术栈与依赖

- React 19
- TypeScript 5.7 配置目标，实际锁定工具链版本以 package-lock.json 为准
- Vite 6
- Tailwind CSS 4，通过 @tailwindcss/vite 接入
- Vitest 4
- lucide-react：图标
- lunar-typescript：八字使用的历法计算库
- react-dom

Node.js engines：

    ^20.19.0 || >=22.12.0

当前 package.json scripts：

- dev：启动 Vite 开发服务器。
- build：执行 tsc -b，然后执行 vite build。
- test：执行一次性 Vitest 测试。
- preview：预览生产构建。
- verify：依次执行 test、build 和 scripts/verify-build.mjs。

项目不需要数据库、后端、登录、环境变量或第三方统计脚本。

## 3. 目录结构

重要目录和文件职责如下：

    src/
      App.tsx                         Hash 路由、路由懒加载、页面元信息和错误边界入口
      main.tsx                        React 挂载入口
      components/                    全站公共布局、结果容器、历史和状态组件
      data/                           八卦、六十四卦、干支、五行和集中化文案
      features/bazi/                  八字表单、engine、类型、结果展示
      features/liuyao/                六爻表单、随机起卦、engine、结果展示
      features/meihua/                梅花表单、engine、结果展示
      hooks/                          页面元信息等 React hook
      routes/                         首页、三个模块页、关于页和 404 页
      styles/                         全局 CSS、Tailwind 入口和视觉 token
      tests/                          数据完整性、路由和三个 engine 测试
      utils/                          日期、输入辅助和 localStorage 工具
    public/
      favicon.svg                     站点图标
      site.webmanifest                站点 manifest
    scripts/
      verify-build.mjs                生产 dist 结构及本地路径检查
    index.html                        HTML 入口、lang、viewport、默认元信息
    package.json                      脚本、依赖和 Node.js engines
    package-lock.json                 依赖锁定文件
    vite.config.ts                    React、Tailwind 和 Vitest 配置
    tsconfig.json                     TypeScript 配置
    README.md                         项目定位、运行和发布前说明
    DEPLOYMENT.md                     构建、预览、Vercel 和回滚说明

node_modules、dist 和 tsconfig.tsbuildinfo 属于本地生成物，均不应提交。

## 4. 路由与页面

项目使用 Hash 路由，不使用 React Router 或 BrowserRouter。有效路径：

- #/：首页，展示产品定位和三个模块入口。
- #/bazi：八字页面。
- #/liuyao：六爻页面。
- #/meihua：梅花易数页面。
- #/about：说明与边界页面。
- 其他 Hash 路径：NotFoundPage，显示 404 和可用页面链接。

App.tsx 中的八字、六爻、梅花和关于页使用 React.lazy 与 dynamic import。首页和 404 页面同步可用。路由变化监听 hashchange，保持现有 URL 形式。

## 5. 八字模块现状

已实现：

- 公历出生日期输入。
- 出生时间输入。
- 可选性别字段。
- 日期和时间输入校验由 BaziForm 负责。
- 结果输入摘要。
- 计算假设说明。
- 使用 lunar-typescript 的 Solar.fromYmdHms，再通过 getLunar().getEightChar() 得到四柱。
- 输出年柱、月柱、日柱、时柱。
- 输出金、木、水、火、土五行统计。
- 输出 dominantElements 和基础文化说明。
- 保存八字历史记录。

当前计算边界：

- 输入是公历日期。
- 使用用户填写的当地民用时间。
- 不输入出生地点。
- 不做经度校正。
- 不计算真太阳时。
- 性别保存用于记录，但不参与基础四柱计算。
- 不做复杂流派差异处理。

尚未实现：

- 大运、流年。
- 真太阳时和地点经度修正。
- 农历输入。
- 十神、藏干、纳音、神煞、空亡、十二长生。
- 日主强弱、喜用神和五行补救建议。
- 现实层面的财富、健康、婚恋、职业或寿命判断。

禁止直接重写四柱计算路径或手写历法规则。固定样例和 lunar-typescript 行为必须由测试保护。

## 6. 六爻模块现状

已实现：

- 手动选择六次爻值。
- 三枚硬币本地随机模拟。
- 随机生成顺序为初爻到上爻。
- 随机结果先填充表单，不自动提交。
- 用户可以继续修改随机结果。
- 六爻值 6、7、8、9 的状态选择。
- 计算本卦、变卦、上卦、下卦和动爻。
- 展示六条爻线、动爻摘要、变化方向和文化反思提示。
- 保存六个原始爻值及卦象摘要到本地历史。

随机实现位于 features/liuyao/randomYao.ts：

- 优先使用 crypto.getRandomValues。
- 浏览器不支持时使用集中封装的 Math.random 后备逻辑。
- 随机源可以注入测试。
- 组件和 engine 不应再增加第二套随机实现。

尚未实现：

- 纳甲。
- 世应。
- 六亲。
- 用神。
- 复杂断语或确定性吉凶判断。
- 服务器随机、账号同步或远程记录。

## 7. 梅花易数模块现状

已实现：

- 数字起卦模式。
- 时间起卦模式。
- 第一个数字取上卦，第二个数字取下卦。
- 第三个数字可作为动爻数字；为空时使用前两个数字之和。
- 数字起卦按 8 取余，余 0 按 8；动爻按 6 取余，余 0 按 6。
- 时间模式使用浏览器本地日期和时间。
- 输出上卦、下卦、本卦、互卦、变卦和动爻。
- 互卦按六爻从下往上计算：下卦取第 2、3、4 爻，上卦取第 3、4、5 爻。
- 保存数字输入、时间输入、时区、动爻来源和卦象信息。

尚未实现：

- 体用体系。
- 五行生克判断。
- 复杂流派差异处理。
- 确定性吉凶断语。
- 农历时间起卦。
- 真太阳时和地理位置。

不要在表单或结果页中偷偷改变 engine 已验证的取余规则。

## 8. 核心数据约定

### 8.1 爻序

所有三爻和六爻数组都从下往上排列：

- lines[0] 是初爻。
- lines[1] 是二爻。
- lines[2] 是三爻。
- 六爻中 lines[5] 是上爻。

页面为了符合传统卦象视觉会反向展示，但不能改变传给 engine 的数组顺序。

### 8.2 boolean 和 0/1

在 bagua.ts、engine 的核心阴阳逻辑中：

- true = 阳爻。
- false = 阴爻。

兼容结果字段 originalLines、changedLines 和 MeihuaBinaryLine/LiuyaoBinaryLine 使用数字：

- 1 = 阳爻。
- 0 = 阴爻。

originalYinYangLines 和 changedYinYangLines 是优先使用的 boolean 字段。不要在核心计算中混用两种表示。

### 8.3 upper 和 lower

- upper = 上卦。
- lower = 下卦。
- 六爻中 lower 由 lines[0] 到 lines[2] 组成。
- 六爻中 upper 由 lines[3] 到 lines[5] 组成。
- getGua64(upper, lower) 的第一个参数永远是上卦，第二个参数永远是下卦。

### 8.4 六爻 6/7/8/9

- 6：老阴，阴爻，动爻，变为阳爻。
- 7：少阳，阳爻，静爻。
- 8：少阴，阴爻，静爻。
- 9：老阳，阳爻，动爻，变为阴爻。

### 8.5 八卦固定约定

先天数：

- 乾 qian = 1
- 兑 dui = 2
- 离 li = 3
- 震 zhen = 4
- 巽 xun = 5
- 坎 kan = 6
- 艮 gen = 7
- 坤 kun = 8

三爻 lines：

- 乾：[true, true, true]
- 兑：[true, true, false]
- 离：[true, false, true]
- 震：[true, false, false]
- 巽：[false, true, true]
- 坎：[false, true, false]
- 艮：[false, false, true]
- 坤：[false, false, false]

### 8.6 历史兼容

历史记录使用宽松的 HistoryItem<T>，payload 按模块保存。HistoryList 会检查字段类型，对旧记录缺少的新字段使用兼容文案，不把对象直接渲染成 [object Object]。

旧字段和兼容层必须保留：

- 六爻的 originalLines、changedLines。
- 梅花的 originalLines、changedLines。
- 旧 trigram/hexagram 导出。
- 旧历史记录缺少 mode、输入详情或新摘要字段时的显示回退。

## 9. 权威数据文件

- src/data/bagua.ts：8 个八卦、符号、三爻结构、五行、方位和文化说明。八卦权威来源。
- src/data/gua64.ts：64 卦名称、upper、lower、文化含义和反思提示。六十四卦权威来源。
- src/data/ganzhi.ts：十天干、十二地支、五行和阴阳属性。八字干支映射权威来源。
- src/data/fiveElements.ts：五行本体、生克关系、基础说明和统计工具。保留旧兼容导出，但 baziEngine 使用 ganzhi.ts 的干支映射。
- src/data/disclaimers.ts：免责声明和隐私说明。
- src/data/moduleCopy.ts：首页和三个模块的定位、背景文案。
- src/data/uiCopy.ts：表单、结果、历史和通用 UI 文案。
- src/data/pageMeta.ts：路由 title 和 description。
- src/data/trigrams.ts：旧八卦导出兼容层，读取新 bagua 数据。
- src/data/hexagrams.ts：旧六十四卦导出兼容层，读取新 gua64 数据。

不要在页面组件中维护第二套八卦、六十四卦、干支或五行映射。

## 10. 公共组件

- AppLayout：站点外壳、品牌、导航、页脚免责声明。
- ModuleCard：首页模块入口卡片。
- ResultPanel：结果页通用容器，可显示 title、summary、meta，并默认显示一个免责声明。
- Disclaimer：从 disclaimers.ts 读取正文，支持 default、compact、result variant。
- HistoryList：读取、展示和清空 localStorage 历史记录，同时兼容三种模块和旧 payload。
- RouteLoadingFallback：路由懒加载状态。
- RouteLoadError：路由加载失败状态，提供重新加载和返回首页。
- AppErrorBoundary：捕获页面渲染错误并显示 RouteLoadError。
- RouteFocusManager：路由切换后把焦点移到 main-content。
- LineDiagram：通用爻线视觉辅助组件。

## 11. 三个 engine 的职责与保护规则

### baziEngine.ts

职责：调用 lunar-typescript 得到四柱，拆分天干地支，并从 ganzhi.ts 统计五行。

禁止随意修改：

- Solar.fromYmdHms 和 getLunar().getEightChar() 路径。
- 四柱输出字段 year、month、day、hour。
- elementCounts、dominantElements、notes、assumption 字段。
- 当前公历、当地民用时间和无地点校正的 MVP 假设。

### liuyaoEngine.ts

职责：解析 6/7/8/9，生成本卦和变卦，计算动爻及原始/变化爻线。

禁止随意修改：

- lines 从初爻到上爻的方向。
- 6/7/8/9 的阴阳和动爻规则。
- lower/upper 切分和 getGua64 参数顺序。
- originalLines、changedLines、originalYinYangLines、changedYinYangLines 等页面兼容字段。
- 不在 engine 中重新加入随机逻辑。

### meihuaEngine.ts

职责：执行数字或浏览器时间起卦，生成上卦、下卦、互卦、变卦和动爻。

禁止随意修改：

- 数字对 8、动爻对 6 的现有取余规则。
- 时间模式的浏览器本地时间规则。
- 互卦的六爻索引。
- getGua64 的 upper/lower 参数方向。
- 结果字段和历史页面所依赖的 originalLines、changedLines 等字段。

## 12. localStorage 历史记录

storage.ts 使用：

- key：traditional-arts-history
- 最大数量：10 条。
- 新记录插入最前面。
- 超过 10 条时保留最近 10 条。
- id 使用 crypto.randomUUID()。
- createdAt 使用 ISO 时间字符串。
- clearHistory() 删除整个 key。
- JSON 解析失败或不是数组时返回空数组。

通用结构：

    {
      id: string,
      module: "bazi" | "liuyao" | "meihua",
      title: string,
      createdAt: string,
      payload: object
    }

八字 payload 当前包含 result 字段，以及 mode、solarDate、birthTime、gender、genderAffectsCalculation、locationCorrection、trueSolarTime。

六爻 payload 当前包含 result 字段，以及 inputLines、movingLineCount、movingPositions、movingSummary。

梅花数字模式保存 firstNumber、secondNumber、movingNumber、movingNumberSource；时间模式保存 usedDateTime、timeZone、localTimeLabel。历史记录不上传服务器。

## 13. 路由加载、错误、元信息和无障碍

- App.tsx 顶层定义 lazy 页面，避免在 render 内创建 lazy。
- Suspense 使用 RouteLoadingFallback。
- AppErrorBoundary 捕获页面加载或渲染错误。
- 未知 Hash 路径进入 NotFoundPage，不回退到首页。
- useDocumentMeta 根据 route 更新 document.title 和唯一 description。
- index.html 提供 lang、charset、viewport、默认 title/description、favicon 和 manifest。
- AppLayout 提供“跳到主要内容”链接。
- main 使用 id="main-content" 和 tabIndex=-1。
- 导航使用 aria-current="page"。
- 加载状态使用 role="status" 和 aria-live。
- 错误状态使用 role="alert"，错误标题可聚焦，并提供返回首页。
- 表单和结果组件使用现有 focus-ring；不要删除 focus-visible 焦点样式。

## 14. 测试、构建与验证

常用命令：

    npm ci
    npm run test
    npm run build
    npm run verify

当前验证基线：

- 5 个测试文件。
- 85 项测试全部通过。
- verify 包含 test、build 和 dist 自检。
- build 使用 tsc -b 和 vite build。
- scripts/verify-build.mjs 检查 dist/index.html、JS、CSS、favicon、manifest，并拒绝 source map、源码目录、.env 和本地开发路径。

数据完整性测试覆盖八卦 8 条、六十四卦 64 条、五行 5 条、天干 10 条、地支 12 条，以及 legacy trigrams/hexagrams 兼容导出。

## 15. Git、GitHub 和 Vercel 流程

当前独立仓库：

- 本地仓库根目录：当前独立项目目录。
- 分支：main。
- origin：https://github.com/OSPI-1/ospi.git
- GitHub 仓库：https://github.com/OSPI-1/ospi
- 正式网站：https://ospi-nine.vercel.app/

最近提交：

- 2285275 docs: add production deployment details
- 8de8674 chore: correct Node.js engine range
- d1fa3e7 feat: complete traditional arts website MVP

版本标签：

- v1.0.0：Traditional Arts Website MVP v1.0.0

标准流程：

1. 修改前确认当前目录是独立仓库，不能操作 workspace 根仓库。
2. 修改后运行 npm run verify。
3. 只提交实际修改文件。
4. 推送 main 到 origin。
5. Vercel 监听 main 推送并自动部署。
6. 生产网站通过浏览器或 HTTP 检查后，再考虑创建版本标签。

禁止 force push、修改旧提交、把 node_modules 或 dist 加入 Git、提交用户历史数据或认证信息。

## 16. 已知限制与技术债

- 项目仍是前端静态 MVP，没有后端同步和账号体系。
- 历史记录只存在单个浏览器，换设备不会同步。
- 八字依赖 lunar-typescript 的现有 API，未实现地点、真太阳时和复杂流派差异。
- 六爻没有纳甲、世应、六亲、用神。
- 梅花没有体用、五行生克和复杂解读。
- trigrams.ts、hexagrams.ts 和 fiveElements.ts 保留兼容导出，未来可以在确认所有引用后再评估清理。
- 业务文案和部分历史兼容逻辑仍集中在较大的 uiCopy.ts 与 HistoryList.ts 中。
- 当前测试是 Node 环境下的核心测试，不是完整浏览器端自动化测试。
- 生产部署依赖 Vercel 项目和 GitHub 权限，仓库本身不保存部署凭据。

## 17. 产品边界与禁用文案

产品只做传统文化结构观察、娱乐参考和个人反思，不做现实决策建议。

禁止出现或引入以下表达：

- 一定发财
- 必有灾祸
- 婚姻必败
- 必须辞职
- 必须投资
- 改运
- 化解
- 开运商品
- 准确率保证
- 命中注定
- 疾病诊断
- 寿命判断
- 喜用神推荐

不得增加医疗、法律、投资、婚恋、职业、考试或其他现实领域的指令性建议。

## 18. 推荐下一阶段路线

建议按低风险顺序推进：

1. 先做生产站点健康检查和文档维护，不改变已封版算法。
2. 补充浏览器级回归测试，覆盖各 Hash 页面、刷新、前进后退、历史记录和 404。
3. 修复或统一源码中文编码显示问题时，必须先确认不会改变文案语义，并重新运行完整测试。
4. 评估兼容层清理，只能在全量引用和旧字段兼容得到测试保护后进行。
5. 如要新增功能，先更新 Requirements、Roadmap 和对应 non-goals，再实施。
6. 任何高级术数功能必须单独规划、单独测试，并继续遵守产品边界。

不建议下一步直接加入数据库、登录、AI 解读或更多术数模块。

## 19. 新 AI 开始工作前的阅读清单

必须先阅读：

1. PROJECT_HANDOFF.md
2. README.md
3. DEPLOYMENT.md
4. package.json
5. vite.config.ts
6. tsconfig.json
7. src/App.tsx
8. src/features/bazi/baziEngine.ts
9. src/features/liuyao/liuyaoEngine.ts
10. src/features/liuyao/randomYao.ts
11. src/features/meihua/meihuaEngine.ts
12. src/data/bagua.ts
13. src/data/gua64.ts
14. src/data/ganzhi.ts
15. src/data/fiveElements.ts
16. src/utils/storage.ts
17. src/tests/baziEngine.test.ts
18. src/tests/liuyaoEngine.test.ts
19. src/tests/meihuaEngine.test.ts
20. src/tests/dataIntegrity.test.ts
21. src/tests/appRoutes.test.ts

开始修改前还应确认 git status、当前分支、最近提交和是否存在未提交变更。

## 20. 交接声明

本文档是当前代码状态的导航，不是独立于代码的第二套事实来源。所有结论必须以当前代码、当前测试和当前部署配置为准；任何算法、字段、路由、依赖、部署方式或产品边界变化，都应同步更新本文件。
