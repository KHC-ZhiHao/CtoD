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

[繁體中文說明](./README-TW.md)

## Online Playground

[Chat Of Requirement(織語)](https://cor.metalsheep.com/) is a display tool built for CtoD. You can use this tool to construct and adjust your templates.

## Summary

This tool utilizes the natural language processing capability of chatbots to deliver our requirements and data in a conversational manner and request a response in a serializable format, such as JSON.

During the conversation, [yup](https://github.com/jquense/yup) is used to validate whether the request and response data meet expectations to ensure consistency. As long as this interaction mode is maintained, it can be used in API integration or automation systems.

We also provide some basic integration solutions for chatbots. Currently, ChatGPT3 and ChatGPT3.5 are supported.

## Installation

npm:

```bash
npm install ctod
```

yarn:

```bash
yarn add ctod
```

## Quick Start

This example demonstrates how to pass drug indices and customer requirements to a chatbot and return the most suitable result. Developers can use the index results to search the database for the most suitable drug for the consumer:

> Regarding type definitions, there is an interesting issue here: the input and output must be declared first in order for the types to function properly.

```ts
import { ChatGPT35Broker, templates } from 'ctod'

const API_KEY = 'openai api key'
const broker = new ChatGPT35Broker({
    /** Validate input data */
    input: yup => {
        return {
            indexs: yup.array(yup.string()).required(),
            question: yup.string().required()
        }
    },
    /** Validate output data */
    output: yup => {
        return {
            indexs: yup.array(yup.object({
                name: yup.string().required(),
                score: yup.number().required()
            })).required()
        }
    },
    /** Initialize the system, usually by embedding or hooking into the life cycle */
    install: ({ bot }) => {
        bot.setConfiguration(API_KEY)
    },
    /** Assemble and define the request we want to send to the bot */
    question: async({ indexs, question }) => {
        return templates.requireJsonResponse([
            'I have the following indices',
            `${JSON.stringify(indexs)}`,
            `Please help me parse "${question}" to which index it might belong`,
            'and sort by relevance from high to low, giving a score of 0 to 1.'
        ], {
            indexs: {
                desc: 'Indices sorted in descending order',
                example: [
                    {
                        name: 'Index name',
                        score: 'Evaluation score displayed as a number'
                    }
                ]
            }
        })
    }
})


broker.request({
    indexs: ['stomach-ache', 'back-pain', 'headache', 'sore-throat', 'limb-pain'],
    question: 'drinking coffee, eating sweets, gastroesophageal reflux'
}).then(e => {
    console.log('output result:', e.indexs)
    /*
        [
            {
                name: 'stomach-ache',
                score: 1
            },
            {
                name: 'sore-throat',
                score: 0.7
            },
            ...
        ]
     */
})
```

### Examples

1. [How to continue the conversation with ChatGPT35 chatbot](./examples/chatgpt3.5.ts)

2. [How to integrate machine responses using ChatGPT35Broker](./examples/chatgpt3.5-broker.ts)

## Plugin

Although the Broker itself is capable of handling most tasks, plugins can help improve complex processes and facilitate project engineering.

Each time a request is sent, the Broker triggers a series of lifecycles. You can understand the parameters and behaviors of each lifecycle from the [source code](./lib/broker/35.ts) and modify its behavior.

Now, let's say we want to design a plugin that backs up messages to a server every time a conversation ends:

```ts
import axios from 'axios'
import { ChatGPT35Broker, Broker35Plugin } from 'ctod'

const backupPlugin = new Broker35Plugin({
    name: 'backup-plugin',
    // Define the 'sendUrl' parameter
    params: yup => {
        return {
            sendUrl: yup.string().required()
        }
    },
    // Define the structure of received data
    receiveData: yup => {
        return {
            character: yup.string().required()
        }
    },
    onInstall({ params, attach, receive }) {
        const store = new Map()
        // If there are more custom information to be passed, you can use plugins[key].send({ ... }) during the execution process
        // You can refer to the case of Role-playing as a Chatbot in the Applications section
        receive(({ id, context }) => {
            store.get(id).context = context
        })
        // Initialize data for the first conversation
        attach('talkFirst', async({ id }) => {
            store.set(id, {
                messages: [],
                context: null
            })
        })
        // Store the conversation after each conversation
        attach('talkAfter', async({ id, lastUserMessage }) => {
            store.get(id).messages.push(lastUserMessage)
        })
        // Backup data after the conversation ends
        attach('done', async({ id }) => {
            await axios.post(params.sendUrl, store.get(id))
            store.delete(id)
        })
    }
})

const broker = new ChatGPT35Broker({
    // ...
    plugins: [
        backupPlugin.use({
            sendUrl: 'https://api/backup'
        })
    ],
    // Alternatively, you can use the following approach
    // plugins: () => [
    //     backupPlugin.use({
    //         sendUrl: 'https://api/backup'
    //     })
    // ],
    // ...
})
```

### Examples

1. Print the execution flow: [Print Log Plugin](./lib/plugins/print-log.ts)
2. Limit the sending rate: [Limiter Plugin](./lib/plugins/limiter.ts)
3. Retry on failure: [Retry Plugin](./lib/plugins/retry.ts)

### Applications

Here are some application examples that you can refer to when designing your AI system.

> You can clone this project, add a .key file in the root directory, and paste your OpenAI Dev Key to quickly try out these examples.

[Interpret BBC News](./examples/applications/bbc-news-reader.ts)
[Role-playing as a Chatbot](./examples/applications/cosplay.ts)
[Story and Cover Generator]('./examples/applications/story-generations.ts')
[Conversation Generator]('./examples/applications/talk-generations.ts')

## Version History

### 0.1.x

We made significant changes to the plugin to facilitate data exchange.

#### ChatGPT35 Service

##### remove: getJailbrokenMessages

This approach is deprecated.

#### Broker

##### add: setPreMessages

Allows users to enter some messages before the conversation starts, ensuring that the primary question is included.

##### fix: hook

Modified the binding behavior. Now, the binding of the Broker takes priority over plugins.

##### change: assembly => question

To make it easier for users to understand, we renamed "assembly" to "question".

### 0.1.3

* Remove: max_token
* Add: model add 16k