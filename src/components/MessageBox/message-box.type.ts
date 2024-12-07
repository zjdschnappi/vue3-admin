import type { AppContext, CSSProperties, Component, VNode } from "vue"

type MessageType = "" | "success" | "warning" | "info" | "error"

export type Action = "confirm" | "close" | "cancel"
export type MessageBoxType = "" | "alert" | "confirm"
export type MessageBoxData = MessageBoxInputData & Action
export interface MessageBoxInputData {
  value: string
  action: Action
}

export interface MessageBoxInputValidator {
  (value: string): boolean | string
}

export declare interface MessageBoxState {
  autofocus: boolean
  innerMessage: string
  type: MessageType
  icon: string | Component
  customClass: string
  customStyle: CSSProperties

  showConfirmButton: boolean
  showCancelButton: boolean
  action: Action
  dangerouslyUseHTMLString: boolean
  confirmButtonText: string
  cancelButtonText: string
  confirmButtonLoading: boolean
  cancelButtonLoading: boolean
  // confirmButtonLoadingIcon: string | Component
  // cancelButtonLoadingIcon: string | Component
  confirmButtonClass: string
  confirmButtonDisabled: boolean
  cancelButtonClass: string
  // editorErrorMessage: string

  beforeClose: null | ((action: Action, instance: MessageBoxState, done: () => void) => void)
  callback: null | Callback
  distinguishCancelAndClose: boolean
  modalFade: boolean
  modalClass: string
  // refer to: https://github.com/ElemeFE/element/commit/2999279ae34ef10c373ca795c87b020ed6753eed
  // seemed ok for now without this state.
  // isOnComposition: false, // temporary remove
  validateError: boolean
  zIndex: number
}

export type Callback = ((value: string, action: Action) => any) | ((action: Action) => any)

/** Options used in MessageBox */
export interface ElMessageBoxOptions {
  /**
   * auto focus when open message-box
   */
  autofocus?: boolean

  /** Callback before MessageBox closes, and it will prevent MessageBox from closing */
  beforeClose?: (action: Action, instance: MessageBoxState, done: () => void) => void

  /** Custom class name for MessageBox */
  customClass?: string

  /** Custom inline style for MessageBox */
  customStyle?: CSSProperties

  /** MessageBox closing callback if you don't prefer Promise */
  callback?: Callback

  /** Text content of cancel button */
  cancelButtonText?: string

  /** Text content of confirm button */
  confirmButtonText?: string

  /** Loading Icon content of cancel button */
  cancelButtonLoadingIcon?: string | Component

  /** Loading Icon content of confirm button */
  confirmButtonLoadingIcon?: string | Component

  /** Custom class name of cancel button */
  cancelButtonClass?: string

  /** Custom class name of confirm button */
  confirmButtonClass?: string

  /** Whether to align the content in center */
  center?: boolean

  /** Whether MessageBox can be drag */
  draggable?: boolean

  /** Draggable MessageBox can overflow the viewport */
  overflow?: boolean

  /** Content of the MessageBox */
  message?: string | VNode | (() => VNode)

  /** Title of the MessageBox */
  title?: string | ElMessageBoxOptions

  /** Message type, used for icon display */
  type?: MessageType

  /** Message box type */
  boxType?: MessageBoxType

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean

  /** Whether to distinguish canceling and closing */
  distinguishCancelAndClose?: boolean

  /** Whether to show a cancel button */
  showCancelButton?: boolean

  /** Whether to show a confirm button */
  showConfirmButton?: boolean

  /** Whether to show a close button */
  showClose?: boolean

  /** Whether to use round button */
  roundButton?: boolean

  /** Whether MessageBox can be closed by clicking the mask */
  closeOnClickModal?: boolean

  /** Whether MessageBox can be closed by pressing the ESC */
  closeOnPressEscape?: boolean

  /** Whether to close MessageBox when hash changes */
  closeOnHashChange?: boolean

  /** Custom element to append the message box to */
  appendTo?: HTMLElement | string
}

export type ElMessageBoxShortcutMethod = ((
  message: ElMessageBoxOptions["message"],
  options?: ElMessageBoxOptions,
  appContext?: AppContext | null
) => Promise<MessageBoxData>) &
  ((
    message: ElMessageBoxOptions["message"],
    title: ElMessageBoxOptions["title"],
    options?: ElMessageBoxOptions,
    appContext?: AppContext | null
  ) => Promise<MessageBoxData>)

export interface IElMessageBox {
  _context: AppContext | null

  /** Show a message box */
  // (message: string, title?: string, type?: string): Promise<MessageBoxData>

  /** Show a message box */
  (options: ElMessageBoxOptions, appContext?: AppContext | null): Promise<MessageBoxData>

  /** Show an alert message box */
  alert: ElMessageBoxShortcutMethod

  /** Show a confirm message box */
  confirm: ElMessageBoxShortcutMethod

  /** Close current message box */
  close(): void
}
