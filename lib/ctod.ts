import { ChatBroker, Message, Params as ChatBrokerParams, ChatBrokerHooks, RequestContext } from './broker/chat'
import { ChatBrokerPlugin } from './core/plugin'
import { Schema } from 'yup'
import * as Yup from 'yup'

type IO = any

export class CtoD<
    P extends ChatBrokerPlugin<IO, IO>,
    PS extends Record<string, ReturnType<P['use']>>
> {
    params
    constructor(params: {
        request: (messages: Message[], context: RequestContext) => Promise<string>
        plugins?: () => PS
    }) {
        this.params = params
    }

    createBrokerBuilder<I extends Record<string, any>>(params?: {
        install?: ChatBrokerParams<() => I, IO, ChatBrokerHooks<() => I, IO, P, PS>, P, PS>['install']
    }) {
        return {
            create: <O extends Record<string, Schema>>(install: (context: {
                id: string
                yup: typeof Yup
                data: I
                plugins: {
                    [K in keyof PS]: {
                        send: (data: PS[K]['__receiveData']) => void
                    }
                }
                setMessages: (messages: (Omit<Message, 'content'> & { content: string | string[] })[]) => void
                metadata: Map<string, any>
            }) => Promise<O>) => {
                return new ChatBroker<
                    () => I,
                    () => O,
                    P,
                    PS,
                    ChatBrokerHooks<() => I, () => O, P, PS>
                        >({
                            output: () => ({} as any),
                            install: (context) => {
                                params?.install?.(context)
                                context.attach('start', async({ id, plugins, data, metadata, changeMessages, changeOutputSchema }) => {
                                    const schema = await install({
                                        id,
                                        data: data as any,
                                        plugins,
                                        yup: Yup,
                                        setMessages: (messages) => {
                                            changeMessages(messages.map(e => {
                                                return {
                                                    role: e.role,
                                                    content: Array.isArray(e.content) ? e.content.join('\n') : e.content
                                                }
                                            }))
                                        },
                                        metadata
                                    })
                                    changeOutputSchema(() => schema)
                                })
                            },
                            plugins: this.params.plugins ? (() => this.params.plugins!()) : undefined,
                            request: this.params.request
                        })
            }
        }
    }
}
