import { ref, shallowRef } from 'vue'
import { createGlobalState } from '@vueuse/core'

import { Circuit, Device } from '../model/Circuit'

export const useState = createGlobalState(
  () => {
    const circuit = shallowRef<Circuit>()
    const devices = ref<Device[]>([])
    return { circuit, devices }
  }
)