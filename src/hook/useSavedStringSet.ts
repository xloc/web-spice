import { useLocalStorage } from "@vueuse/core"
import { ref, watch } from "vue";

export const useSavedStringSet = (name: string) => {
  const storage = useLocalStorage(name, [] as string[]);
  const nameSet = ref<Set<string>>(new Set(storage.value));

  watch(() => nameSet, () => {
    storage.value = Array.from(nameSet.value);
  }, { deep: true });


  return nameSet;
}