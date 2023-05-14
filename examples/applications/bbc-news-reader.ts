import axios from 'axios'
import { load } from 'cheerio'
import { prompt } from 'inquirer'
import { Log, flow } from 'power-helper'
import { ImagesGenerations } from '../../lib/service/images-generations'
import { definedOutputDir, getKey } from '../utils'
import { ChatGPT35Broker, plugins, templates } from '../../lib/index'

/**
 * @invoke npx ts-node ./examples/applications/bcc-news-reader.ts
 */

const genImage = async (params: {
    prompt: string
    apiKey: string
}) => {
    const bot = new ImagesGenerations()
    bot.setConfiguration(params.apiKey)
    bot.setConfig({
        n: 1,
        size: '512x512'
    })
    const result = await bot.create(params.prompt)
    return result.data.map(e => e.b64_json)
}

const genFocus = async (params: {
    apiKey: string
    title: string
    content: string
}) => {
    const broker = new ChatGPT35Broker({
        input: yup => {
            return {
                title: yup.string().required(),
                content: yup.string().required()
            }
        },
        output: yup => {
            return {
                coverPrompts: yup.array(yup.string().required()).required(),
                enUsTitle: yup.string().required(),
                zhTwTitle: yup.string().required(),
                enUsContent: yup.array(yup.string()).required(),
                zhTwContent: yup.array(yup.string()).required()
            }
        },
        plugins: [
            plugins.PrintLogPlugin.ver35.use({})
        ],
        install: ({ bot, attach }) => {
            bot.setConfiguration(params.apiKey)
            attach('parseFailed', async({ count, retry, response, changeMessages }) => {
                if (count <= 5) {
                    console.log(`回傳錯誤，正在重試: ${count} 次`)
                    changeMessages([response.newMessages[0]])
                    retry()
                }
            })
        },
        assembly: async ({ title, content }) => {
            return templates.requireJsonResponse([
                '以下是一篇來自BBC NEWs的新聞',
                '請你幫我濃縮成200字的摘要，新聞內容如下',
                title,
                content
            ], {
                coverPrompts: {
                    desc: '敘述一下新聞的場景，例如：「在一個雨天的夜晚，一個男人走在路上...」，給我3組不同的情境',
                    example: '[string, string, string]'
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
    const result = await broker.request({
        content: params.content,
        title: params.title
    })
    return result
}

const readNews = async(url: string) => {
    const response = await axios.get(url)
    const $ = load(response.data)
    let title = $('#main-heading').text()
    let contents: Array<{
        type: 'subtitle' | 'hr' | 'text' | 'image' | 'crosshead'
        text: string
    }> = []
    if (title) {
        $('#main-content *').each((index, el) => {
            let component = $(el).data('component')
            if (component === 'image-block') {
                let html = $(el).html() as string
                let src = html.match(/src=".*?"\s/g)
                if (src && src[0] && src[0].match(/_grey_line|white_line|transparent-nc|in_numbers|15C1D/) == null) {
                    contents.push({
                        type: 'image',
                        text: src[0].trim().replace('src="', '').slice(0, -1)
                    })
                }
            }
            if (component === 'crosshead-block') {
                contents.push({
                    type: 'crosshead',
                    text: $(el).text()
                })
            }
            if (component === 'text-block') {
                contents.push({
                    type: 'text',
                    text: $(el).text()
                })
            }
        })
    } else {
        $('.story-body__inner > *').each((index, el) => {
            if (el.attribs.class) {
                if (el.attribs.class.match('media-landscape') || el.attribs.class.match('media-with-caption')) {
                    let src = $(el).html()!.split('src="')[1]
                    if (src && src.match(/_grey_line|white_line|transparent-nc|in_numbers|15C1D/) == null) {
                        contents.push({
                            type: 'image',
                            text: src.split('"')[0].replace('/320/', '/624/')
                        })
                    }
                    return true
                }
                if (el.attribs.class.match('story-body__introduction')) {
                    contents.push({
                        type: 'text',
                        text: $(el).text().trim()
                    })
                    return true
                }
            }
            if (el.tagName === 'p') {
                contents.push({
                    type: 'text',
                    text: $(el).text().trim()
                })
            }
            if (el.tagName === 'h2') {
                contents.push({
                    type: 'subtitle',
                    text: $(el).text().trim()
                })
            }
            if (el.tagName === 'hr') {
                contents.push({
                    type: 'hr',
                    text: ''
                })
            }
        })
        title = $('.story-body__h1').text()
    }
    return {
        contents,
        title
    }
}

flow.run(async () => {
    const apiKey = await getKey()
    const { url } = await prompt([
        {
            type: 'input',
            name: 'url',
            message: '請輸入 bbc 新聞的網址.',
            default: ''
        }
    ])
    try {
        const log = new Log('BBC News')
        log.print('正在讀取新聞內容...')
        const result = await readNews(url)
        const content = result.contents.filter(e => e.type === 'text' || e.type === 'subtitle').map(e => e.text).join('\n')
        log.print('正在生成大綱...')
        const focus = await genFocus({
            title: result.title,
            content,
            apiKey
        })
        const dir = await definedOutputDir(`bcc-news/${result.title}`)
        dir.write('content.json', focus)
        log.print('正在生成封面...')
        for (let prompt of focus.coverPrompts) {
            try {
                const result = await genImage({
                    prompt,
                    apiKey
                })
                dir.write(`cover-${Date.now()}.png`, result[0], 'base64')
            } catch (error) {
                continue
            }
        }
    } catch (error: any) {
        console.error('Error:', error?.response?.data?.error?.message ?? error)
    }
})
