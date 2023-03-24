<br>

<h1 align="center">CtoD</h1>
<h3 align="center">Chat To Data Library</h3>

<br>

這是一個將聊天機器人指令轉成資料的工具：

# 安裝

```
npm install ctod
```

## example

```ts
import { flow } from 'power-helper'
import { ChatGPT3Broker, templates } from 'ctod'

const API_KEY = '{{ your api key }}'

flow.run(async() => {
    const broker = new ChatGPT3Broker({
        scheme: yup => {
            return {
                indexs: yup.array(yup.string()).required(),
                question: yup.string().required()
            }
        },
        output: yup => {
            return {
                indexs: yup.array(yup.object({
                    name: yup.string().required(),
                    score: yup.number().required()
                })).required()
            }
        },
        install: ({ bot }) => {
            bot.setConfiguration(API_KEY)
        },
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
    const response = await broker.request({
        indexs: ['胃痛', '腰痛', '頭痛', '喉嚨痛', '四肢疼痛'],
        question: '喝咖啡，吃甜食，胃食道逆流T_T'
    })
    console.log('輸出結果：', response.indexs)
})
```