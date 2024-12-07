import { getCurrentInstance, inject, unref } from "vue"
import { type MaybeRef, computedEager } from "@vueuse/core"

import type { InjectionKey, Ref } from "vue"

export type ElIdInjectionContext = {
  prefix: number
  current: number
}

const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10000),
  current: 0
}

export const ID_INJECTION_KEY: InjectionKey<ElIdInjectionContext> = Symbol("elIdInjection")

export const useIdInjection = (): ElIdInjectionContext => {
  return getCurrentInstance() ? inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection
}

export const useId = (deterministicId?: MaybeRef<string>): Ref<string> => {
  const idInjection = useIdInjection()

  // NOTE: Here we use `computedEager` to calculate the id value immediately, avoiding inconsistent id generation due to the lazy feature of `computed` when server rendering.
  const idRef = computedEager(
    () => unref(deterministicId) || `i-message-box-id-${idInjection.prefix}-${idInjection.current++}`
  )

  return idRef
}
