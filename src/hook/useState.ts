import { shallowRef } from 'vue'
import { createGlobalState } from '@vueuse/core'

import { Circuit } from '../model/Circuit'

export const useState = createGlobalState(
  () => {
    const circuit = shallowRef<Circuit>()
    return { circuit }
  }
)