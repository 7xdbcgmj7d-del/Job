# AI Job Copilot AI_DESIGN.md

> 文档目的：定义 AI Job Copilot 中 AI 能力的产品角色、能力边界、输入输出结构、Prompt 模板、错误处理和后续评测方式，作为后续 Codex 开发 AI 匹配分析能力的依据。

---

## 1. AI 在产品中的角色

### 1.1 AI 的核心定位

AI Job Copilot 中的 AI 不是聊天机器人，也不是单纯的文案生成工具，而是嵌入求职流程中的“求职决策辅助系统”。

AI 的核心作用是帮助用户完成以下判断：

```text
这个岗位到底要求什么？
我的简历和这个岗位匹不匹配？
这个岗位值不值得优先投？
我的简历应该怎么改？
面试前我应该重点准备什么？
面试后我应该如何复盘？
```

### 1.2 AI 不替用户做最终决定

AI 的角色是辅助判断，而不是替用户做决定。

产品表达上应避免：

```text
你必须投递这个岗位
你不应该投递这个岗位
这个岗位一定适合你
```

更推荐表达为：

```text
建议优先投递
建议优化简历后投递
不建议优先投递
该建议仅供参考，请结合个人实际情况判断
```

### 1.3 AI 嵌入的主要流程

AI 应嵌入用户已有求职路径，而不是独立做一个泛聊天入口。

当前 MVP 优先嵌入：

```text
添加岗位：招聘截图识别 / JD 信息提取
岗位页：JD 与简历匹配分析
首页：AI 今日建议
简历页：AI 简历体检 / 针对岗位优化
面试页：AI 面试准备 / AI 复盘
```

### 1.4 AI 结果必须转化为行动建议

AI 输出不应只是信息摘要，而应指导用户下一步动作。

例如：

```text
低价值输出：
这个岗位主要要求产品设计、数据分析和沟通能力。

高价值输出：
该岗位匹配度 78/100，建议优化简历后投递。投递前建议补充数据分析案例，并强化 AI 项目的评测集和 Bad Case 优化过程。
```

### 1.5 产品设计原则

AI 能力设计遵循以下原则：

```text
少管理，多决策
少配置，多建议
少图表，多行动
少入口，多闭环
少填表，多确认
少登录，先可用
```

---

## 2. AI 能力边界

### 2.1 AI 可以做什么

AI 可以帮助用户完成以下任务：

| 能力 | 说明 |
|---|---|
| 招聘截图识别 | 从招聘截图中提取公司、职位、JD 原文等信息 |
| JD 解析 | 提取岗位职责、必备技能、加分项、隐含要求和风险点 |
| 简历匹配分析 | 根据 JD 和简历判断匹配度、优势、短板和投递建议 |
| 简历优化建议 | 针对岗位指出简历中应强化、补充或改写的内容 |
| 面试问题生成 | 根据 JD 和简历生成高频问题、项目深挖问题和 AI PM 相关问题 |
| 面试复盘分析 | 根据面试记录和反馈归因失败原因，并给出下次优化动作 |
| 首页行动建议 | 基于岗位、简历、面试状态聚合下一步建议 |

### 2.2 AI 不应该做什么

AI 不应该承担以下能力：

```text
替用户自动投递岗位
替用户伪造简历经历
替用户生成虚假项目数据
替用户编造面试经历
承诺求职结果
对岗位成功率做确定性保证
在缺少信息时强行给出高置信判断
```

### 2.3 能力边界说明

AI 输出依赖用户输入的 JD 和简历内容。如果输入信息不完整，AI 应提示用户补充，而不是强行分析。

示例：

```text
如果 JD 缺失：
无法准确分析岗位要求，请补充岗位 JD 或上传更清晰的招聘截图。

如果简历缺失：
无法判断简历匹配度，请先选择或粘贴一份简历。

如果 JD 过短：
当前 JD 信息较少，分析结果可能不完整，建议补充完整岗位描述。
```

### 2.4 风险控制原则

AI 输出需要避免以下风险：

| 风险 | 处理方式 |
|---|---|
| 过度鼓励投递 | Prompt 中要求识别硬性门槛和风险点 |
| 只看关键词误判 | 要求区分关键词匹配和真实能力匹配 |
| 建议太空泛 | 要求 suggestions 必须具体可执行 |
| 忽略硬性要求 | 年限、学历、语言、算法、建模等要求必须识别 |
| 生成不可展示文本 | 要求输出严格 JSON，前端结构化展示 |
| 用户误以为 AI 结论绝对正确 | 页面展示“AI 建议仅供参考” |

---

## 3. AI 匹配分析输入输出

### 3.1 功能名称

AI 匹配分析

### 3.2 功能目标

帮助用户判断某个岗位是否值得优先投递，并明确投递前需要优化的简历内容和面试准备方向。

### 3.3 输入

AI 匹配分析至少需要以下输入：

```ts
{
  jobTitle: string;
  company?: string;
  jobDescription: string;
  resumeTitle?: string;
  resume: string;
  userGoal?: string;
}
```

字段说明：

| 字段 | 是否必填 | 说明 |
|---|---|---|
| jobTitle | 是 | 岗位名称 |
| company | 否 | 公司名称 |
| jobDescription | 是 | 岗位 JD 原文 |
| resumeTitle | 否 | 简历版本名称 |
| resume | 是 | 用户简历内容 |
| userGoal | 否 | 用户目标方向，如 AI PM / 产品经理 / 运营 |

### 3.4 输出

AI 匹配分析需要输出结构化结果，至少包含：

```text
匹配分
匹配等级
投递建议
投递建议理由
JD 解析结果
匹配优势
明显短板
简历优化建议
简历改写方向
面试准备问题
```

### 3.5 输出展示原则

前端不应直接展示大段模型原文，而应卡片化展示：

```text
顶部摘要卡片：
- 匹配分
- 匹配等级
- 投递建议

下方详情卡片：
- JD 解析
- 匹配优势
- 明显短板
- 优化建议
- 面试准备问题
```

### 3.6 输出决策枚举

匹配等级：

```ts
"high" | "medium" | "low"
```

投递建议：

```ts
"recommend" | "conditional" | "not_recommend"
```

前端展示映射：

| 原始值 | 用户展示 |
|---|---|
| high | 高匹配 |
| medium | 中匹配 |
| low | 低匹配 |
| recommend | 建议优先投递 |
| conditional | 建议优化后投递 |
| not_recommend | 不建议优先投递 |

---

## 4. AIMatchResult 数据结构

### 4.1 TypeScript 类型定义

```ts
export type AIMatchLevel = "high" | "medium" | "low";

export type AIDecision = "recommend" | "conditional" | "not_recommend";

export type AIMatchResult = {
  jobId?: string;
  resumeId?: string;
  score: number;
  level: AIMatchLevel;
  decision: AIDecision;
  decisionReason: string;
  jdSummary: {
    responsibilities: string[];
    requiredSkills: string[];
    bonusSkills: string[];
    hiddenRequirements: string[];
    risks: string[];
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  resumeRewriteTips: string[];
  interviewQuestions: string[];
  createdAt: string;
};
```

### 4.2 字段说明

| 字段 | 类型 | 说明 |
|---|---|---|
| jobId | string | 关联岗位 ID，可选 |
| resumeId | string | 关联简历 ID，可选 |
| score | number | 匹配分，0-100 |
| level | AIMatchLevel | 匹配等级 |
| decision | AIDecision | 投递建议 |
| decisionReason | string | 投递建议理由 |
| jdSummary.responsibilities | string[] | 岗位核心职责 |
| jdSummary.requiredSkills | string[] | 必备技能 |
| jdSummary.bonusSkills | string[] | 加分项 |
| jdSummary.hiddenRequirements | string[] | 隐含要求 |
| jdSummary.risks | string[] | 风险点 |
| strengths | string[] | 简历与岗位匹配优势 |
| weaknesses | string[] | 明显短板 |
| suggestions | string[] | 求职动作建议 |
| resumeRewriteTips | string[] | 简历修改建议 |
| interviewQuestions | string[] | 面试准备问题 |
| createdAt | string | 分析生成时间 |

### 4.3 数据结构设计理由

使用结构化 JSON，而不是大段自然语言，原因是：

```text
方便前端卡片展示
方便保存到岗位记录
方便岗位列表展示匹配分
方便首页生成 AI 今日建议
方便后续评测和 Bad Case 归因
方便后续 Prompt 迭代
```

### 4.4 数据校验规则

前端或服务端应进行基础校验：

```text
score 必须为 0-100 的整数
level 必须是 high / medium / low
recommendation 必须是 recommend / conditional / not_recommend
strengths 至少 1 条，建议 3 条
weaknesses 至少 1 条，建议 3 条
suggestions 至少 1 条，建议 3 条
interviewQuestions 至少 3 条，建议 5 条
```

如果模型返回结果不符合结构，应进入错误处理或兜底解析流程。

---

## 5. Prompt 模板

## 5.1 AI 匹配分析 Prompt

```text
你是一名 AI 产品经理求职辅导专家，擅长根据岗位 JD 和候选人简历判断匹配度，并给出具体、真实、可执行的求职建议。

请根据以下岗位 JD 和候选人简历，输出严格 JSON。

重要要求：
1. 只能输出 JSON，不要输出 Markdown，不要输出解释性废话。
2. score 为 0-100 的整数。
3. level 只能是 high、medium、low。
4. decision 只能是 recommend、conditional、not_recommend。
5. strengths 至少 3 条，必须结合简历真实内容。
6. weaknesses 至少 3 条，必须指出关键短板。
7. suggestions 至少 3 条，必须具体可执行。
8. resumeRewriteTips 至少 3 条，必须说明简历应该怎么改。
9. interviewQuestions 至少 5 个，问题要贴合 JD 和简历。
10. 如果 JD 中有硬性年限、算法、建模、英文、学历、行业经验等要求，必须在 risks 中明确指出。
11. 不要过度鼓励用户投递，要根据真实匹配情况判断。
12. 如果岗位虽然包含“AI 产品”关键词，但实际更偏算法建模或模型训练，需要降低非算法背景候选人的匹配度。

请按照以下 JSON 格式输出：

{
  "score": 82,
  "level": "medium",
  "decision": "conditional",
  "decisionReason": "建议投递，但需要先强化数据分析和 AI 项目评测表达。",
  "jdSummary": {
    "responsibilities": [],
    "requiredSkills": [],
    "bonusSkills": [],
    "hiddenRequirements": [],
    "risks": []
  },
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "resumeRewriteTips": [],
  "interviewQuestions": []
}

岗位名称：
{{jobTitle}}

公司名称：
{{company}}

岗位 JD：
{{jobDescription}}

简历名称：
{{resumeTitle}}

候选人简历：
{{resume}}

用户目标方向：
{{userGoal}}
```

---

## 5.2 JD 解析 Prompt

```text
你是一名招聘 JD 分析助手，请从以下岗位 JD 中提取结构化信息。

只输出 JSON，不要输出 Markdown。

请输出：
{
  "company": "",
  "jobTitle": "",
  "responsibilities": [],
  "requiredSkills": [],
  "bonusSkills": [],
  "hiddenRequirements": [],
  "risks": [],
  "rawJD": ""
}

要求：
1. company 和 jobTitle 如果无法识别，可以留空。
2. rawJD 保留原始 JD 主要内容。
3. risks 中必须识别硬性年限、学历、语言、算法、建模、行业经验等要求。
4. 不要编造 JD 中没有的信息。

岗位 JD：
{{jobDescription}}
```

---

## 5.3 招聘截图识别 Prompt

```text
你是一名招聘截图信息提取助手，请从用户上传的招聘截图中提取岗位信息。

只输出 JSON，不要输出 Markdown。

请输出：
{
  "company": "",
  "jobTitle": "",
  "jobDescription": "",
  "location": "",
  "salaryRange": "",
  "sourceUrl": "",
  "confidence": 0,
  "missingFields": []
}

要求：
1. company、jobTitle、jobDescription 是最重要字段。
2. 如果无法识别某个字段，留空并加入 missingFields。
3. confidence 为 0-100 的整数，表示整体识别置信度。
4. 不要编造截图中没有的信息。
5. jobDescription 尽量保留完整岗位描述、职责和要求。
```

---

## 5.4 面试准备 Prompt

```text
你是一名产品经理面试官，请根据候选人简历和岗位 JD，预测面试中可能被问到的问题，并给出准备方向。

只输出 JSON，不要输出 Markdown。

请输出：
{
  "businessQuestions": [],
  "projectDeepDiveQuestions": [],
  "aiProductQuestions": [],
  "dataAnalysisQuestions": [],
  "behaviorQuestions": [],
  "preparationTips": []
}

要求：
1. 问题必须贴合岗位 JD 和简历内容。
2. 如果候选人有 AI 项目经历，必须覆盖评测集、Bad Case、Prompt、模型选择、产品闭环等问题。
3. preparationTips 必须具体可执行。

岗位 JD：
{{jobDescription}}

候选人简历：
{{resume}}

面试轮次：
{{interviewRound}}
```

---

## 5.5 面试复盘 Prompt

```text
你是一名产品经理面试复盘教练，请根据用户的面试记录、面试反馈、岗位 JD 和简历，分析本次面试表现，并给出下次优化建议。

只输出 JSON，不要输出 Markdown。

请输出：
{
  "performanceIssues": [],
  "failureReasons": [],
  "nextActions": [],
  "questionsToReview": [],
  "resumeOrProjectImprovements": []
}

要求：
1. failureReasons 可以包括：简历不匹配、经验不足、项目表达不清楚、AI 能力体现不足、数据能力不足、沟通表达不足、岗位理解不足。
2. nextActions 必须具体可执行。
3. 不要编造用户没有提供的面试反馈。

岗位 JD：
{{jobDescription}}

候选人简历：
{{resume}}

面试记录：
{{interviewNotes}}

用户自评：
{{selfReview}}

面试反馈：
{{interviewFeedback}}
```

---

## 6. 错误处理

### 6.1 输入为空

| 场景 | 处理方式 |
|---|---|
| JD 为空 | 提示：请先粘贴岗位 JD 或上传招聘截图 |
| 简历为空 | 提示：请先选择或粘贴一份简历 |
| 岗位名称为空 | 允许继续分析，但提示结果可能不完整 |
| 公司名称为空 | 允许继续分析 |

### 6.2 AI 服务异常

| 场景 | 处理方式 |
|---|---|
| API Key 未配置 | 提示：AI 服务暂未配置，请稍后再试 |
| 请求超时 | 提示：AI 分析超时，请稍后重试 |
| 网络错误 | 提示：网络异常，请检查网络后重试 |
| 服务端错误 | 提示：AI 分析失败，请稍后重试 |

### 6.3 模型返回非 JSON

如果模型返回非 JSON：

1. 前端或服务端尝试提取 JSON 片段。
2. 如果提取失败，返回错误提示。
3. 不展示原始混乱文本给用户。

用户提示文案：

```text
AI 返回结果格式异常，请重新生成分析。
```

### 6.4 字段缺失

如果模型返回 JSON 但字段不完整：

- 缺失数组字段时，使用空数组兜底
- 缺失 decisionReason 时，使用默认文案
- 缺失 score 时，不展示匹配分，提示结果不完整
- 缺失 level 或 decision 时，根据 score 做简单映射

score 映射规则：

```text
score >= 85 → high / recommend
70 <= score < 85 → medium / conditional
score < 70 → low / not_recommend
```

### 6.5 低置信度识别

招聘截图识别如果 confidence 较低，应提示用户检查结果：

```text
AI 识别结果可能不完整，请确认公司、职位和 JD 原文是否正确。
```

### 6.6 用户安全与隐私提示

涉及简历和 JD 时，应在设置页或分析入口提示：

```text
AI 分析会使用你输入的岗位 JD 和简历内容。请避免填写身份证号、银行卡号等敏感信息。AI 建议仅供参考。
```

---

## 7. 后续评测方式

### 7.1 评测目标

评测目标不是证明 AI 永远正确，而是持续发现问题并优化 Prompt 和产品展示。

重点评测：

```text
JD 核心要求识别是否准确
简历匹配度判断是否合理
是否指出关键短板
优化建议是否具体可执行
是否存在过度鼓励投递
是否识别硬性门槛和风险点
面试问题是否贴合岗位和简历
```

### 7.2 评测集文件

建议建立：

```text
evaluation/evaluation.xlsx
docs/EVALUATION.md
```

### 7.3 评测集字段

```text
ID
用户背景
目标岗位
岗位 JD
用户简历摘要
期望匹配等级
期望指出的优势
期望指出的短板
期望优化建议
AI 实际输出
人工评分
Bad Case 类型
优化方案
```

### 7.4 首批评测样本

首批样本数量：

```text
20 条
```

分类：

```text
5 条：高匹配岗位
5 条：中匹配岗位
5 条：低匹配岗位
5 条：容易误判岗位
```

### 7.5 评分标准

总分 100 分：

| 维度 | 分值 |
|---|---:|
| 是否准确识别 JD 核心要求 | 30 |
| 是否准确判断简历匹配度 | 30 |
| 是否指出关键短板 | 20 |
| 优化建议是否具体可执行 | 20 |

评分区间：

```text
90-100：优秀
70-89：可用
60-69：勉强可用
60 以下：Bad Case
```

### 7.6 Bad Case 分类

```text
关键词误判
忽略硬性年限要求
过度鼓励用户投递
建议太空泛
没有结合用户真实项目
忽略岗位方向差异
没有识别隐含能力要求
截图识别错误导致字段错填
AI 输出格式不稳定
```

### 7.7 评测后的迭代方式

每次评测后需要记录：

```text
发现了哪些 Bad Case
Bad Case 的原因是什么
是 Prompt 问题、输入问题还是展示问题
需要怎样优化 Prompt
是否需要调整前端字段或提示文案
优化后是否重新评测
```

### 7.8 最小评测闭环

```text
准备 20 条评测样本
↓
运行 AI 匹配分析
↓
人工评分
↓
记录 Bad Case
↓
优化 Prompt
↓
重新测试关键 Case
```

### 7.9 MVP 验收标准

MVP 阶段至少完成：

```text
20 条评测样本
至少 5 个 Bad Case 记录
至少 1 次 Prompt 迭代
一份 EVALUATION.md
一份 BAD_CASE.md
```

---

## 8. 后续 AI 能力演进

### 8.1 V1：单次 AI 匹配分析

```text
JD + 简历 → AI 匹配分析结果
```

### 8.2 V2：AI 结果回流业务流程

```text
AI 分析结果 → 岗位匹配分 → 首页今日建议 → 面试准备
```

### 8.3 V3：Prompt 版本迭代

```text
Bad Case → Prompt 优化 → 重新评测
```

### 8.4 V4：Agent Workflow

后续可以将单 Prompt 拆分为多个能力节点：

```text
JD Parser Agent
↓
Resume Parser Agent
↓
Match Agent
↓
Advice Agent
↓
Interview Prep Agent
```

拆分理由：

```text
降低单 Prompt 复杂度
提升每个节点可评测性
方便定位 Bad Case 原因
方便未来替换或优化单个能力
```

MVP 阶段不做 Agent Workflow，只保留为后续规划。
