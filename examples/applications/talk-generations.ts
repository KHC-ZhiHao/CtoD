import { flow, array } from 'power-helper'
import { ImagesGenerations } from '../../lib/service/images-generations'
import { definedOutputDir, getKey } from '../utils'
import { ChatGPT35Broker, plugins, templates } from '../../lib/index'

/**
 * @invoke npx ts-node ./examples/applications/talk-generations.ts
 */

const situations = [
    {
        'en-US': 'Brainstorming session between marketing team',
        'zh-TW': '行銷團隊頭腦風暴會議'
    },
    {
        'en-US': 'Customer service representative handling a complaint',
        'zh-TW': '客服代表處理客訴'
    },
    {
        'en-US': 'Job interview for a software engineer position',
        'zh-TW': '軟體工程師職位面試'
    },
    {
        'en-US': 'Negotiation between a vendor and a client',
        'zh-TW': '供應商與客戶的談判'
    },
    {
        'en-US': 'Meeting between a designer and a developer',
        'zh-TW': '設計師與開發人員的會議'
    },
    {
        'en-US': 'Team huddle before a sports game',
        'zh-TW': '比賽前的團隊集合'
    },
    {
        'en-US': 'Consultation with a financial advisor',
        'zh-TW': '財務顧問諮詢'
    },
    {
        'en-US': 'Parent-teacher conference',
        'zh-TW': '家長教師會議'
    },
    {
        'en-US': 'Discussion between a doctor and a patient',
        'zh-TW': '醫生與病人的討論'
    },
    {
        'en-US': 'Debate between political candidates',
        'zh-TW': '政治候選人辯論'
    }
]

const tones = [
    {
        'en-US': 'Angry',
        'zh-TW': '憤怒'
    },
    {
        'en-US': 'Excited',
        'zh-TW': '興奮'
    },
    {
        'en-US': 'Bored',
        'zh-TW': '無聊'
    },
    {
        'en-US': 'Sad',
        'zh-TW': '悲傷'
    },
    {
        'en-US': 'Happy',
        'zh-TW': '快樂'
    },
    {
        'en-US': 'Confused',
        'zh-TW': '困惑'
    },
    {
        'en-US': 'Frustrated',
        'zh-TW': '挫敗'
    },
    {
        'en-US': 'Curious',
        'zh-TW': '好奇'
    },
    {
        'en-US': 'Nervous',
        'zh-TW': '緊張'
    },
    {
        'en-US': 'Relaxed',
        'zh-TW': '輕鬆'
    }
]

const styles = [
    {
        'en-US': 'Humorous',
        'zh-TW': '幽默'
    },
    {
        'en-US': 'Formal',
        'zh-TW': '正式'
    },
    {
        'en-US': 'Casual',
        'zh-TW': '隨意'
    },
    {
        'en-US': 'Professional',
        'zh-TW': '專業'
    },
    {
        'en-US': 'Friendly',
        'zh-TW': '友善'
    },
    {
        'en-US': 'Serious',
        'zh-TW': '嚴肅'
    },
    {
        'en-US': 'Sarcastic',
        'zh-TW': '諷刺'
    },
    {
        'en-US': 'Inquisitive',
        'zh-TW': '探究'
    },
    {
        'en-US': 'Persuasive',
        'zh-TW': '說服'
    },
    {
        'en-US': 'Encouraging',
        'zh-TW': '鼓勵'
    }
]

const genImage = async (params: {
    tone: string
    apiKey: string,
    style: string
    situation: string
}) => {
    const bot = new ImagesGenerations()
    bot.setConfiguration(params.apiKey)
    bot.setConfig({
        n: 1,
        size: '512x512'
    })
    const result = await bot.create(`two people ${params.tone} ${params.situation}, ${params.style}`)
    return result.data.map(e => e.b64_json)
}

const genTalk = async (params: {
    apiKey: string
    tone: string
    style: string
    situation: string
}) => {
    const broker = new ChatGPT35Broker({
        input: yup => {
            return {
                tone: yup.string().required(),
                style: yup.string().required(),
                situation: yup.string().required()
            }
        },
        output: yup => {
            return {
                enUsOutline: yup.string().required(),
                zhTwOutline: yup.string().required(),
                enUsTitle: yup.string().required(),
                zhTwTitle: yup.string().required(),
                enUsContent: yup.array(yup.string()).required(),
                zhTwContent: yup.array(yup.string()).required()
            }
        },
        plugins: {
            print: plugins.PrintLogPlugin.ver35.use({
                detail: false
            })
        },
        install: ({ bot, attach }) => {
            bot.setConfiguration(params.apiKey)
            attach('parseFailed', async ({ count, retry, response, changeMessages }) => {
                if (count <= 5) {
                    console.log(`回傳錯誤，正在重試: ${count} 次`)
                    changeMessages([response.newMessages[0]])
                    retry()
                }
            })
        },
        question: async ({ situation, style, tone }) => {
            return templates.requireJsonResponse([
                `幫我生成一組以${style}為出發點的對話`,
                `是兩個 ${tone} 的人進行，${situation}`,
                '有中英兩種版本，中文是繁體中文'
            ], {
                enUsOutline: {
                    desc: '故事簡述，請用英文呈現',
                    example: 'string'
                },
                zhTwOutline: {
                    desc: '故事簡述，請用中文呈現',
                    example: 'string'
                },
                enUsTitle: {
                    desc: '英文標題',
                    example: 'string'
                },
                zhTwTitle: {
                    desc: '中文標題',
                    example: 'string'
                },
                enUsContent: {
                    desc: '英文內容，每一段為一個元素',
                    example: 'string[]'
                },
                zhTwContent: {
                    desc: '中文內容，每一段為一個元素',
                    example: 'string[]'
                }
            })
        }
    })
    const result = await broker.request(params)
    return result
}

flow.run(async () => {
    const apiKey = await getKey()
    const tone = array.randomPick(tones)
    const style = array.randomPick(styles)
    const situation = array.randomPick(situations)
    try {
        const result = await genTalk({
            tone: tone['en-US'],
            situation: situation['en-US'],
            style: style['en-US'],
            apiKey
        })
        const images = await genImage({
            tone: tone['en-US'],
            situation: situation['en-US'],
            style: style['en-US'],
            apiKey
        })
        const dir = definedOutputDir(`.output/talks/${result.zhTwTitle}`)
        dir.write('content.json', result)
        for (let image of images) {
            dir.write(`cover-${Date.now()}.png`, image, 'base64')
        }
    } catch (error: any) {
        console.error('Error:', error?.response?.data?.error?.message ?? error)
    }
})
