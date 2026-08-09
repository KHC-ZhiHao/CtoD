import { ChatBrokerPlugin } from '../core/plugin.js';
import { z } from 'zod';
declare const _default: ChatBrokerPlugin<() => {
    retry: z.ZodDefault<z.ZodNumber>;
    printWarn: z.ZodDefault<z.ZodBoolean>;
}, () => {}>;
export default _default;
