---
name: ctod
description: Use this skill whenever writing or generating BrokerBuilder and Broker code with CtoD. Trigger this skill whenever the user asks to add or modify a Broker, or define LLM input/output structures.
---

# CtoD — BrokerBuilder & Broker Generation Guide

## Step 1: Create a BrokerBuilder

Define the input type and shared system prompt.

```ts
// This is just for reference. In best practice, the ctod instance should already be initialized
// in a shared place — no need to recreate it in every skill.
import { CtoD } from '../lib/index.js'
const ctod = new CtoD({ ... })

const brokerBuilder = ctod.createBrokerBuilder<{
    question: string   // input type
}>({
    install: ({ attach }) => {
        attach('start', async ({ setPreMessages }) => {
            setPreMessages([
                { role: 'system', content: 'You are a helpful assistant.' }
            ])
        })
    }
})
```

## Step 2: Create a Broker

```ts
const broker = brokerBuilder.create(async ({ zod, data, setMessages }) => {
    setMessages([
        {
            role: 'user',
            contents: [{ type: 'text', content: `Question: ${data.question}` }]
        }
    ])
    return {
        answer: zod.string().describe('The answer'),
        confidence: zod.number().min(0).max(1).describe('Confidence score')
    }
})

const result = await broker.request({ question: '...' })
```

## Message Formats

```ts
// Plain text (shorthand)
{ role: 'user', content: 'Hello' }

// Multi-content (with image)
{ role: 'user', contents: [
    { type: 'text', content: 'What is in this image?' },
    { type: 'image', content: 'data:image/png;base64,...' }
]}

// Multi-line text composition
import { paragraph } from 'ctod'
paragraph(['First paragraph', JSON.stringify(data), `Question: ${question}`])
```

## Output Schema Patterns

```ts
// Single value
{ answer: zod.string().describe('...') }

// Array
{
    items: zod.array(
        zod.object({
            name: zod.string().describe('Name'),
            score: zod.number().describe('Score from 0 to 1')
        })
    ).describe('Sorted by relevance')
}
```

## Hooks (used inside BrokerBuilder install)

| Hook | Triggered when | Common params |
|---|---|---|
| `start` | Request starts | `setPreMessages`, `changeMessages`, `data`, `metadata` |
| `talkBefore` | Before sending | `messages`, `lastUserMessage` |
| `talkAfter` | After LLM responds | `changeParseText`, `parseFail` |
| `succeeded` | Parse succeeded | `output`, `metadata` |
| `parseFailed` | Parse failed | `retry`, `changeMessages` |
| `done` | Request ends | `id`, `metadata` |

```ts
// metadata shares data across hooks
attach('start', async ({ metadata }) => { metadata.set('key', value) })
attach('done',  async ({ metadata }) => { metadata.get('key') })
```

## Notes

- `zod` is injected by ctod — **no need to import it separately**
- `setPreMessages` can only be used in the `start` hook
- `changeMessages` can be used in multiple hooks