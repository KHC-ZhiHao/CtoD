<br>
<p align="center"><img style="max-width: 300px" src="./logo.png"></p>
<h1 align="center">CtoD</h1>
<h3 align="center">Chat To Data</h3>

<p align="center">
    <a href="https://www.npmjs.com/package/ctod">
        <img src="https://img.shields.io/npm/v/ctod.svg">
    </a>
    <a href="https://github.com/KHC-ZhiHao/ctod">
        <img src="https://img.shields.io/github/stars/KHC-ZhiHao/ctod.svg?style=social">
    </a>
    <br>
</p>

<br>

## Online Playground

[Chat Of Requirement(織語)](https://cor.metalsheep.com/) 是為了 CtoD 建構的展示工具，你可以在這個工具中建構你與調適你的模板。

## 摘要

本工具是利用聊天機器人能夠讀懂自然語言的特性，將我們的需求與資料透過口語化的方式交付給他處理，並要求回應可序列化格式，例如：JSON。

在對話過程中，本工具採用 [yup](https://github.com/jquense/yup) 來驗證請求與回復資料是否符合預期，以確保一致性，只要保持這個互動模式，就可以利用在 API 串接或是自動化系統上。

我們還附帶支援 `OpenAI` 的相關服務。

## 安裝

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

> 關於型態定義，這裡有個有趣的議題，必須將 input 與 output 優先宣告才能讓型態正常運作。

```ts
import { ChatBroker, OpenAI, templates } from 'ctod'

const broker = new ChatBroker({
    /** 驗證輸入資料 */
    input: yup => {
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
    install: () => {},
    /** 定義發送請求的接口 */
    request: async(messages) => {
        const openai = new OpenAI(API_KEY)
        const chat = openai.createChat()
        const { text } = await chat.talk(messages)
        return text
    }
    /** 組裝與定義我們要向機器人發出的請求 */
    question: async({ indexs, question }) => {
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

##  Plugin

雖然 Broker 本身已經能夠處理大部分的事務，但透過 Plugin 可以協助改善複雜的流程，幫助專案工程化。

每次發送請求時，Broker 會觸發一系列的生命週期，你可以從[原始碼](./lib/broker/chat.ts)中了解每個生命週期的參數與行為，並對其行為進行加工。

現在，假設我們想要設計一個插件，它會在每次對話結束時將訊息備份到伺服器上：

```ts
import axios from 'axios'
import { ChatBroker, ChatBrokerPlugin } from 'ctod'
const backupPlugin = new ChatBrokerPlugin({
    name: 'backup-plugin',
    // 定義參數為 sendUrl
    params: yup => {
        return {
            sendUrl: yup.string().required()
        }
    },
    // 現階段你可以在執行過程中接收到資訊，資訊結構由這裡定義。
    receiveData: yup => {
        return {
            character: yup.string().required()
        }
    },
    onInstall({ params, attach, receive }) {
        const store = new Map()
        // 假設我們有更多的自訂義資訊需要被傳遞進來，可以在 start 階段透過 plugins[key].send({ ... }) 傳遞
        // 可以從 Applications 分類中的 請機器人角色扮演 觀看案例
        receive(({ id, context }) => {
            store.get(id).context = context
        })
        // 第一次對話的時候初始化資料
        attach('start', async({ id }) => {
            store.set(id, {
                messages: [],
                context: null
            })
        })
        // 每次對話完畢後把對話存入狀態
        attach('talkAfter', async({ id, lastUserMessage }) => {
            store.get(id).messages.push(lastUserMessage)
        })
        // 結束對話後備份資料
        attach('done', async({ id }) => {
            await axios.post(params.sendUrl, store.get(id))
            store.delete(id)
        })
    }
})

const broker = new ChatBroker({
    // ...
    plugins: {
        backup: backupPlugin.use({
            sendUrl: 'https://api/backup'
        })
    },
    // 以下方案也可以運行
    // plugins: () => {
    //     return {
    //         backup: backupPlugin.use({
    //             sendUrl: 'https://api/backup'
    //         })
    //     }
    // },
    // ...
})
```

## Examples

[基礎用法 - 藥物查詢功能](./examples/chat-demo.ts)

[進階用法 - 請 AI COSPLAY](./examples//plugin-demo.ts)

## Version History

### 0.3.0

為了支援更多平台與自建服務，我們捨棄了完全為了 ChatGPT 客制化的接口，這樣也能完整保持 Broker 與 Plugin 的一致性。
