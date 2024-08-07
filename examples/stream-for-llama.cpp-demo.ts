// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../lib/shims.d.ts" />

import { Llama3Cpp } from '../lib/index'
import { flow } from 'power-helper'

flow.run(async() => {
    const llama3Cpp = new Llama3Cpp()
    const completion = llama3Cpp.createCompletion()
    completion.setConfig({
        baseUrl: 'http://localhost:12333'
    })
    completion.talkStream({
        messages: [
            {
                role: 'user',
                content: '你是誰'
            }
        ],
        onEnd: () => {
            console.log('Is Done!')
        },
        onError: (error) => {
            console.log('Error', error)
        },
        onWarn: (warn) => {
            console.log('Warn', warn)
        },
        onMessage: (e) => {
            console.log(e.message)
        }
    })
})
