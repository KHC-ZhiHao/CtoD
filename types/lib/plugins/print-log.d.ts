import { ChatBrokerPlugin } from '../core/plugin.js';
import { z } from 'zod';
declare const _default: ChatBrokerPlugin<() => {
    detail: z.ZodDefault<z.ZodBoolean>;
}, () => {}>;
export default _default;
