<br>

<h1 align="center">CtoD</h1>
<h3 align="center">Chat To Data Tool</h3>

<br>

## 摘要

本工具是利用聊天機器人能夠讀懂自然語言的特性，將我們的需求與資料透過口語化的方式交付給他處理，並要求回應可序列化格式，例如：JSON。

在對話過程中，本工具採用 [yup](https://github.com/jquense/yup) 來驗證請求與回復資料是否符合預期，以確保一致性，只要保持這個互動模式，就可以利用在 API 串接或是自動化系統上。

我們還附帶了一些基礎的串接機器人方案，目前支援 `ChatGPT3` 與 `ChatGPT3.5`。

# 安裝

npm:

```bash
npm install ctod
```

yarn:

```bash
yarn add ctod
```

## 快速開始

這個例子示範如何將藥物索引與客戶需求傳遞給聊天機器人，並返回最適合的結果，開發人員可以利用索引結果去資料庫搜尋最適合的藥物給消費者：

```ts
import { ChatGPT35Broker, templates } from 'ctod'

const API_KEY = 'openai api key'
const broker = new ChatGPT35Broker({
    /** 驗證輸入資料 */
    scheme: yup => {
        return {
            indexs: yup.array(yup.string()).required(),
            question: yup.string().required()
        }
    },
    /** 驗證輸出資料 */
    output: yup => {
        return {
            indexs: yup.array(yup.object({
                name: yup.string().required(),
                score: yup.number().required()
            })).required()
        }
    },
    /** 初始化系統，通常來植入或掛鉤生命週期 */
    install: ({ bot }) => {
        bot.setConfiguration(API_KEY)
    },
    /** 組裝與定義我們要向機器人發出的請求 */
    assembly: async({ indexs, question }) => {
        return templates.requireJsonResponse([
            '我有以下索引',
            `${JSON.stringify(indexs)}`,
            `請幫我解析"${question}"可能是哪個索引`,
            '且相關性由高到低排序並給予分數，分數由 0 ~ 1'
        ], {
            indexs: {
                desc: '由高到低排序的索引',
                example: [
                    {
                        name: '索引名稱',
                        score: '評比分數，數字顯示'
                    }
                ]
            }
        })
    }
})

broker.request({
    indexs: ['胃痛', '腰痛', '頭痛', '喉嚨痛', '四肢疼痛'],
    question: '喝咖啡，吃甜食，胃食道逆流'
}).then(e => {
    console.log('輸出結果：', e.indexs)
    /*
        [
            {
                name: '胃痛',
                score: 1
            },
            {
                name: '喉嚨痛',
                score: 0.7
            },
            ...
        ]
     */
})
```

## Examples

1. [如何利用 ChatGPT35 持續聊天機器人對話](./examples/chatgpt3.5.ts)

2. [如何利用 ChatGPT35Broker 來整合機器人回應](./examples/chatgpt3.5-broker.ts)
