<br>

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

## Summary

This tool utilizes the natural language processing capability of chatbots to deliver our requirements and data in a conversational manner and request a response in a serializable format, such as JSON.

During the conversation, [yup](https://github.com/jquense/yup) is used to validate whether the request and response data meet expectations to ensure consistency. As long as this interaction mode is maintained, it can be used in API integration or automation systems.

We also provide some basic integration solutions for chatbots. Currently, ChatGPT3 and ChatGPT3.5 are supported.

# Installation

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

```ts
import { ChatGPT35Broker, templates } from 'ctod'

const API_KEY = 'openai api key'
const broker = new ChatGPT35Broker({
    /** Validate input data */
    scheme: yup => {
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
    assembly: async({ indexs, question }) => {
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

## Examples

1. [How to continue the conversation with ChatGPT35 chatbot](./examples/chatgpt3.5.ts)

2. [How to integrate machine responses using ChatGPT35Broker](./examples/chatgpt3.5-broker.ts)
