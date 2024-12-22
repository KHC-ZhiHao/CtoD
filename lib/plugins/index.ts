import Retry from './retry'
import PrintLog from './print-log'
import Limiter from './limiter'
import Role from './role'

/**
 * @zh 一個基於印出 log 的 plugin。
 * @en A plugin based on printing log.
 */

export const PrintLogPlugin = PrintLog

/**
 * @zh 當解析失敗時，會自動重試的對話。
 * @en A conversation that will automatically retry when parsing fails.
 */

export const RetryPlugin = Retry

/**
 * @zh 限制使用流量，這個 plugin 可以有效讓所有對話不會再限制內同時發送，可用於在開發過程中遭遇伺服器因頻率過高而阻擋請求。
 * @en Limit the use of traffic. This plugin can effectively prevent all conversations from being sent at the same time within the limit, and can be used when the server blocks requests due to high frequency during development.
 */

export const LimiterPlugin = Limiter.plugin

/**
 * @zh 排程系統將全域託管，有什麼必要設定可以來更動它的狀態，例如：關閉排程。
 * @en The scheduling system will be globally hosted. What is necessary to set can come to change its status, for example: close the schedule.
 */
export const LimiterPluginGlobState = Limiter

/**
 * @zh 設定角色扮演。
 * @en Set role play.
 */

export const RolePlugin = Role
