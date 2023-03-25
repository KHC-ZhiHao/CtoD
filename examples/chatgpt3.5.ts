import { flow } from 'power-helper'
import { prompt } from 'inquirer'
import { ChatGPT35 } from '../lib/index'

/**
 * @zh 這裡示範如何透過 ChatGPT35 持續對話
 * @en Here is a demonstration of how to use ChatGPT35Broker to obtain the best index from the user's queries.
 * @test npx ts-node ./examples/chatgpt3.5.ts
 */

flow.run(async() => {
    const { apiKey } = await prompt([
        {
            type: 'input',
            name: 'apiKey',
            message: 'Please enter API key.',
            default: ''
        }
    ])
    if (!apiKey) {
        throw new Error('Unable to find API key.')
    }
    let bot = new ChatGPT35()
    let talk = bot.chat.bind(bot)
    bot.setConfiguration(apiKey)
    await flow.asyncWhile(async({ count, doBreak }) => {
        if (count >= 99) {
            return doBreak()
        }
        const { text } = await prompt([
            {
                type: 'input',
                name: 'text',
                message: 'Please enter what you want to say.',
                default: ''
            }
        ])
        const response = await talk(text)
        talk = response.nextTalk
        console.log('AI:', response.result.text)
    })
})
