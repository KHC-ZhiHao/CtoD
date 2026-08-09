import { ChatBrokerPlugin } from '../core/plugin.js';
import { z } from 'zod';
declare const _default: ChatBrokerPlugin<() => {
    role: z.ZodString;
}, () => {}>;
export default _default;
