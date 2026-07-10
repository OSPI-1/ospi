export const linePositionLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

export const historyCopy = {
  title: "本地记录",
  emptyState: "暂无记录。",
  clearButtonTitle: "清空记录",
  clearDataNote: "清除浏览器数据可能导致历史记录丢失。",
  liuyao: {
    originalLabel: "本卦",
    changedLabel: "变卦",
    movingLabel: "动爻",
    lineValuesLabel: "原始爻值"
  },
  meihua: {
    modeLabel: "方式",
    numberMode: "数字起卦",
    timeMode: "时间起卦",
    originalLabel: "本卦",
    mutualLabel: "互卦",
    changedLabel: "变卦",
    movingLabel: "动爻",
    numberInputLabel: "输入数字",
    timeInputLabel: "采用时间",
    timeZoneLabel: "浏览器时区",
    legacyInputFallback: "旧记录未保存完整起卦输入"
  },
  bazi: {
    historyDateTimeLabel: "输入",
    historyGenderLabel: "性别",
    historyPillarsLabel: "四柱",
    historyElementsLabel: "五行",
    historyLegacyInput: "旧记录未保存完整输入信息",
    historyLegacyGender: "未填写",
    historyLocationLabel: "地点校正",
    historySolarTimeLabel: "真太阳时",
    historyNotUsed: "未采用",
    historyNotPerformed: "未进行",
    historyPerformed: "已进行",
    historyUsed: "已采用",
    historyNoElements: "未保存五行统计"
  }
};

export const moduleCardCopy = {
  ctaLabel: "进入模块"
};

export const routeCopy = {
  loading: "正在加载模块…",
  loadErrorTitle: "模块暂时无法加载",
  loadErrorDescription: "请重新加载页面后再试。当前输入和本地记录不会上传。",
  reloadButton: "重新加载页面"
};

export const aboutCopy = {
  eyebrow: "项目说明",
  title: "边界与使用方式",
  items: [
    "网站只展示传统文化中的结构、符号和反思提示。",
    "所有结果都应被理解为娱乐参考，不应用于医学、法律、投资、婚恋、职业等现实决策。",
    "本地历史记录仅保存在当前浏览器中，清空后不会恢复。",
    "第一版不提供登录、付费、后台、云端存储或 AI 断语。"
  ]
};

export const liuyaoFormCopy = {
  title: "自下而上输入六爻",
  helper: "内部顺序保持初爻到上爻，页面按传统卦象从上爻到初爻展示。",
  validationError: "请完整选择六爻，且每一爻只能是 6、7、8、9。",
  fallbackError: "起卦失败，请检查输入。",
  resetButton: "全部重置",
  allYoungYangButton: "全部少阳",
  allYoungYinButton: "全部少阴",
  submitButton: "生成卦象",
  yinLabel: "阴",
  yangLabel: "阳",
  movingLabel: "动爻",
  stableLabel: "静爻",
  movingHint: "变化",
  random: {
    title: "三枚硬币模拟",
    description: "在当前浏览器中为每一爻独立模拟三枚硬币，正面计 3、反面计 2；结果仅用于文化学习与娱乐参考。",
    button: "随机起卦",
    success:
      "已在浏览器本地模拟六次三枚硬币结果，初爻先生成，上爻最后生成。你可以继续手动调整后再排卦。"
  },
  positionLabels: linePositionLabels,
  valueOptions: {
    6: {
      name: "老阴",
      description: "阴爻，动爻，变为阳爻"
    },
    7: {
      name: "少阳",
      description: "阳爻，静爻，保持阳爻"
    },
    8: {
      name: "少阴",
      description: "阴爻，静爻，保持阴爻"
    },
    9: {
      name: "老阳",
      description: "阳爻，动爻，变为阴爻"
    }
  }
};

export const meihuaFormCopy = {
  title: "选择起卦方式",
  modes: {
    number: "数字起卦",
    time: "时间起卦"
  },
  submitButton: "生成卦象",
  resetButton: "重置当前模式",
  fallbackError: "起卦失败，请检查输入。",
  number: {
    title: "数字起卦输入",
    rule:
      "第一个数字决定上卦，第二个数字决定下卦；均按 8 取余，余 0 按 8。动爻数字按 6 取余，余 0 按 6。",
    movingFallback: "动爻数字可留空；留空时使用前两个数字之和计算动爻。",
    privacy: "数字只在当前浏览器中参与计算，不会上传。",
    movingPlaceholder: "可选，留空则前两数相加"
  },
  time: {
    title: "浏览器本地时间",
    rule: "时间起卦沿用现有规则，并使用页面显示的浏览器本地日期和时间。",
    privacy: "不使用定位、不换算真太阳时，日期时间不会上传。",
    useCurrentButton: "使用当前时间",
    currentTimeFilled: "已填入浏览器当前本地时间，请确认后再生成卦象。",
    selectedTimeLabel: "采用时间",
    timeZoneLabel: "浏览器时区",
    timeZoneFallback: "浏览器本地时区（未提供 IANA 名称）",
    emptyPreview: "请先选择完整的日期和时间。"
  },
  errors: {
    firstRequired: "请输入第一个数字。",
    secondRequired: "请输入第二个数字。",
    positiveInteger: "{field}必须是正整数。",
    greaterThanZero: "{field}必须大于 0。",
    maxValue: "{field}不能超过 999999。",
    dateRequired: "请选择完整日期。",
    timeRequired: "请选择完整时间。",
    invalidDateTime: "日期或时间无效，请重新选择。"
  }
};

export const baziInputCopy = {
  formTitle: "输入出生信息",
  dateLabel: "公历出生日期",
  timeLabel: "出生时间",
  genderLabel: "性别（可选）",
  genderUnspecified: "不填写",
  genderFemale: "女",
  genderMale: "男",
  genderNote: "性别字段当前仅用于记录，不参与基础四柱计算。",
  submitButton: "生成基础排盘",
  resetButton: "重置输入",
  fallbackError: "计算失败，请检查输入。",
  privacyNote: "输入仅在当前浏览器中参与计算，不上传出生信息。",
  assumptionsTitle: "本版计算假设",
  assumptions: [
    "日期采用公历，支持范围为 1900-01-01 至 2100-12-31。",
    "时间按用户填写的当地民用时间直接计算。",
    "当前版本不输入出生地点，不进行经度校正，也不计算真太阳时。",
    "不同命理流派的细节差异不在本版处理；结果只提供四柱、五行统计和基础文化说明。",
    "内容仅供传统文化学习、娱乐参考与个人反思，不构成现实决策建议。"
  ],
  timeBoundaryNotice: "出生时间不准确可能影响时柱；接近时辰交界时请自行核对。本版不反推出生时辰，也不自动纠正或猜测时间。",
  errors: {
    dateRequired: "请输入公历出生日期。",
    timeRequired: "请输入出生时间。",
    dateFormat: "请输入有效的公历日期。",
    dateRange: "日期需在 1900-01-01 至 2100-12-31 范围内。",
    timeFormat: "请输入有效的出生时间。",
    fallback: "计算失败，请检查输入。"
  },
  summaryTitle: "本次采用的输入",
  summaryDate: "公历日期",
  summaryTime: "民用时间",
  summaryGender: "性别记录",
  summaryGenderNotUsed: "不参与基础计算",
  summaryLocation: "出生地点校正",
  summaryLocationValue: "未进行",
  summarySolarTime: "真太阳时",
  summarySolarTimeValue: "未采用"
};

export const resultCopy = {
  bazi: {
    title: "八字基础结果",
    summary: "以下内容用于观察四柱和五行分布，不代表现实结论。",
    pillarsLabel: "四柱",
    pillarLabels: {
      year: "年柱",
      month: "月柱",
      day: "日柱",
      hour: "时柱"
    },
    elementOrder: ["金", "木", "水", "火", "土"] as const,
    elementsLabel: "五行统计",
    elementDistributionTitle: "五行分布",
    totalLabel: "合计",
    elementCountDescription: "当前基础计数，仅统计四个天干和四个地支的主五行。",
    dominantDescription: "按当前基础计数，本次四柱中数量相对较多的五行：",
    dominantTitle: "数量相对较多的五行",
    noDominantText: "暂无可用的相对较多五行数据",
    pillarStemLabel: "天干",
    pillarBranchLabel: "地支",
    unknownValue: "未识别",
    stemElementLabel: "天干五行",
    branchElementLabel: "地支五行",
    yinYangLabel: "阴阳",
    reflectionTitle: "基础文化说明",
    notesEmpty: "暂无基础文化说明。",
    attentionTitle: "注意事项",
    attentionText: "本结果用于文化学习、娱乐参考和个人反思，不生成现实命运判断或决策建议。",
    assumptionTitle: "计算说明"
  },
  liuyao: {
    title: "六爻基础结果",
    summary: "本卦用于观察当前结构，变卦用于观察动爻变化后的结构。",
    originalHexagramLabel: "本卦",
    changedHexagramLabel: "变卦",
    structureLabel: "六爻结构",
    movingLinesLabel: "动爻",
    movingCountText: "共 {count} 条动爻",
    movingPositionsText: "位置：{positions}",
    noMovingLines: "本次无动爻",
    noMovingExplanation: "变卦与本卦相同。",
    oldYinChange: "老阴：阴变阳",
    oldYangChange: "老阳：阳变阴",
    movingBadge: "动",
    changedBadge: "变",
    originalCultureTitle: "本卦文化含义",
    changedCultureTitle: "变卦文化含义",
    reflectionTitle: "反思提示"
  },
  meihua: {
    title: "梅花易数基础结果",
    summary: "上卦、下卦、互卦和变卦用于整理问题结构与变化线索。",
    upperLabel: "上卦",
    lowerLabel: "下卦",
    movingLineLabel: "动爻",
    movingHint: "用于观察变化发生的位置。",
    originalHexagramLabel: "本卦",
    mutualHexagramLabel: "互卦",
    changedHexagramLabel: "变卦",
    inputSummaryTitle: "起卦信息",
    modeLabel: "起卦方式",
    firstNumberLabel: "第一个数字",
    secondNumberLabel: "第二个数字",
    movingNumberLabel: "动爻数字",
    movingNumberFromSum: "由前两数之和计算",
    usedDateTimeLabel: "实际采用时间",
    timeZoneLabel: "浏览器时区",
    localTimeNote: "采用浏览器本地时间，不包含地理位置、真太阳时或农历换算。",
    unavailableTime: "未提供有效时间",
    upperLowerTitle: "上卦与下卦",
    structureLabel: "六爻结构",
    movingBadge: "动",
    changedBadge: "变",
    meaningTitle: "文化含义",
    hexagramReflectionTitle: "反思提示",
    mutualRuleTitle: "互卦说明",
    mutualRule:
      "互卦由本卦中间四爻组合：下卦取第 2、3、4 爻，上卦取第 3、4、5 爻，可作为观察结构关系的传统文化参考。",
    transformationTitle: "动爻变化",
    originalLineLabel: "本卦爻线",
    changedLineLabel: "变卦爻线",
    yangToYin: "阳变阴",
    yinToYang: "阴变阳",
    cultureTitle: "文化含义",
    reflectionTitle: "反思提示"
  },
  shared: {
    upperLowerText: "上卦 {upper}，下卦 {lower}",
    lineSuffix: "爻"
  }
};
