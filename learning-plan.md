# WhatsApp Sales English Learning Plan

生成日期：2026-06-17

## 数据依据

本计划基于 `scripts/export_whatsapp_messages.py` 从本地 `wacli` 数据库导出的聊天记录，由 AI 助手分析后整理。Python 脚本只负责读取和增量导出聊天内容，不负责生成学习建议。

本次导出包含 32,462 条有文本内容的 WhatsApp 消息，时间范围为 2026-03-07 到 2026-06-17。其中客户消息 18,306 条，我方消息 14,156 条。

## 你的核心英语场景

按聊天记录频率，你最需要优先掌握这些销售沟通场景：

| 优先级 | 场景 | 高频内容 |
|---|---|---|
| 1 | 产品细节 | cap, bottle, pump, sprayer, inner plug, liner, zamak, metal |
| 2 | 颜色和 Logo | color, black, gold, silver, logo, finish, shiny, matte, label |
| 3 | 价格报价 | price, cost, quote, quotation, USD, unit price |
| 4 | 生产交期 | production, ready, finish, days, week, lead time, mass production |
| 5 | 物流清关 | shipping, freight, forwarder, warehouse, tracking number, customs clearance |
| 6 | 付款单据 | payment, balance, invoice, PI, receipt, packing list |
| 7 | 跟进确认 | check, confirm, update, status, progress, let me know |

## 30 天学习安排

### 第 1 周：产品词汇和基础回复

目标：看到客户说产品细节时能马上理解，并能用简单句回复。

每天练习：
- 背 15 个产品词：cap, bottle, pump, sprayer, inner plug, liner, finish, logo, sample, mold。
- 抄写 5 句标准回复。
- 用真实产品替换句子里的空白信息。

本周必须掌握：
- The cap can be made in black, silver, or gold.
- We can make samples first for your confirmation.
- Please confirm the final quantity before we proceed.
- Let me check with our factory and get back to you soon.

### 第 2 周：报价、模具和数量

目标：能清楚回复价格、MOQ、模具费、报价有效期。

每天练习：
- 写 3 条报价消息。
- 把 `price/cost/quote/quotation/unit price/mold cost/MOQ` 放进完整句子。
- 对客户的 “What is the price?” 写 3 种不同回复。

本周必须掌握：
- The EXW unit price is USD __ per piece.
- The mold cost is USD __, and it needs to be paid before mold making.
- The price is valid for 10 days.
- The price will be a little higher because the quantity is lower.

### 第 3 周：生产进度、催单和延误解释

目标：能处理客户问进度、催交期、要求更新的情况。

每天练习：
- 写 1 条正常进度更新。
- 写 1 条延误解释。
- 写 1 条安抚客户的回复。

本周必须掌握：
- The goods are currently in production.
- It should be ready for shipment next week.
- I understand this is urgent. I will push the factory and update you as soon as possible.
- Reprocessing will take about __ days.

### 第 4 周：付款、单据、物流和清关

目标：能处理付款凭证、尾款、发票、装箱单、货代、物流单号、清关问题。

每天练习：
- 写 2 条付款相关回复。
- 写 2 条物流相关回复。
- 把 `invoice/packing list/balance/payment receipt/freight forwarder/tracking number/customs clearance` 放进句子。

本周必须掌握：
- Please send me the payment receipt after payment.
- I will send you the invoice and packing list today.
- The goods have arrived at the freight forwarder's warehouse.
- I will send you the tracking number once it is available.
- Your forwarder needs to handle customs clearance.

## 每天 15 分钟训练法

1. 读 10 个高频业务词。
2. 抄写 5 句销售回复。
3. 用真实订单信息替换价格、数量、交期、物流方式。
4. 从手册里挑 3 个客户问题，直接写英文回复。
5. 发送 WhatsApp 前检查三点：动作是否清楚、时间是否清楚、语气是否礼貌。

## 需要改掉的表达习惯

| 旧表达 | 问题 | 建议替换 |
|---|---|---|
| pls wait | 太生硬 | Please give me a moment to check. |
| pls check it | 太随意 | Please check it when you have time. |
| Thank you a lot | 不够自然 | Thanks a lot. / Thank you very much. |
| How many would you like? | 可以，但不够商务 | Could you please confirm the quantity you need? |
| I will send you today | 缺少宾语 | I will send it to you today. |
| OK, no problem | 可用但过度重复 | Sure, I will arrange it accordingly. |

## 每周复盘

每周运行一次：

```bash
python3 scripts/export_whatsapp_messages.py --db /home/fxzou/.wacli/wacli.db
```

然后把新增导出的聊天记录交给 AI 助手分析，让助手更新：
- 新增高频客户问题
- 新增高频业务词汇
- 你写得不自然的英文
- 下周重点练习内容

