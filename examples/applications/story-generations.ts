import { flow, array } from 'power-helper'
import { ImagesGenerations } from '../../lib/service/images-generations'
import { definedOutputDir, getKey } from '../utils'
import { ChatGPT35Broker, plugins, templates } from '../../lib/index'

/**
 * @invoke npx ts-node ./examples/applications/story-generations.ts
 */

const styles = ['Adventure', 'Romance', 'Horror', 'Science Fiction', 'Suspense', 'Comedy', 'Inspirational', 'Epic', 'Philosophical', 'Historical', 'Supernatural', 'Crime', 'Family', 'Classic', 'Fairy Tale', 'Animal', 'Science', 'War', 'Fantasy', 'Social', 'Romantic', 'Short Story', 'Novel', 'Narrative Poem', 'Lyric Poem', 'Epic Poem', 'Variations', 'Memoir', 'Autobiography', 'Fantasy Fiction', 'Political', 'Romantic Comedy', 'Science Fiction Adventure', 'Crime Thriller', 'Pure Love', 'Mythology', 'Supernatural Fiction', 'Horror Comedy', 'Epic Fantasy', 'Surrealism', 'Satire', 'Dystopian Fiction', 'Humorous Poetry', 'Philosophical Fiction', 'Suspense Thriller', 'Historical Epic', 'Romantic Suspense', 'Humor', 'Science Fiction Romance', 'Historical Romance']
const ends = ['Happy ending', 'Tragic ending', 'Open ending', 'Bittersweet ending', 'Ambiguous ending', 'Surprise ending', 'Cathartic ending', 'Redemptive ending', 'Moral ending', 'Ironic ending', 'Deus ex machina', 'Twist ending', 'Epiphany ending', 'Mystery ending', 'Hopeful ending', 'Pessimistic ending', 'Revenge ending', 'Enigmatic ending', 'Metaphorical ending', 'Reflective ending', 'Satisfying ending', 'Unresolved ending', 'Transformation ending', 'Resolution ending', 'Sacrificial ending', 'Indeterminate ending', 'Existential ending', 'Nihilistic ending', 'Tragicomedy ending', 'Inconclusive ending', 'Climactic ending', 'Peripeteia ending', 'Prophetic ending', 'Heartwarming ending', 'Disillusioned ending', 'Sardonic ending', 'Revelatory ending', 'Comedic ending', 'Dramatic ending', 'Fateful ending', 'Introspective ending', 'Reconciling ending', 'Uplifting ending', 'Chaotic ending', 'Fatalistic ending', 'Epilogue ending', 'Foreboding ending', 'Satirical ending', 'Surreal ending']

const genImage = async (params: {
    style: string
    title: string
    apiKey: string
    outline: string
}) => {
    const bot = new ImagesGenerations()
    bot.setConfiguration(params.apiKey)
    bot.setConfig({
        n: 1,
        size: '512x512'
    })
    const result = await bot.create(`is a ${params.style} style story, subject is ${params.title}, ${params.outline}`)
    return result.data.map(e => e.b64_json)
}

const genStory = async (params: {
    apiKey: string
    style: string
    ending: string
}) => {
    const broker = new ChatGPT35Broker({
        input: yup => {
            return {
                ending: yup.string().required(),
                style: yup.string().required()
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
            attach('parseFailed', async({ count, retry, response, changeMessages }) => {
                if (count <= 5) {
                    console.log(`回傳錯誤，正在重試: ${count} 次`)
                    changeMessages([response.newMessages[0]])
                    retry()
                }
            })
        },
        question: async ({ style, ending }) => {
            return templates.requireJsonResponse([
                `生成一個 ${style} 風格的故事，必須是 ${ending} 結局`,
                '內容請豐富精彩有深度，而且有起承轉合，符合電影的三段結構，約300~400字',
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
    const style = array.randomPick(styles)
    const ending = array.randomPick(ends)
    try {
        const result = await genStory({
            style,
            ending,
            apiKey
        })
        const dir = definedOutputDir(`.output/stores/${result.zhTwTitle}`)
        dir.write('story.json', result)
        dir.write('story-config.json', {
            style,
            ending
        })
        for (let i = 0; i < 2; i++) {
            const images = await genImage({
                style,
                apiKey,
                title: result.enUsTitle,
                outline: result.enUsOutline
            })
            dir.write(`cover-${i}.png`, images[0])
        }
    } catch (error: any) {
        console.error('Error:', error?.response?.data?.error?.message ?? error)
    }
})
