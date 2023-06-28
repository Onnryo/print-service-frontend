import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAppStore } from './AppStore'
import { useFileStore } from './FileStore'

export const usePartStore = defineStore('part', () => {
  const appStore = useAppStore()
  const fileStore = useFileStore()
  const parts = ref([])
  const status = ref(['Pending', 'In Progress', 'Complete', 'Canceled', 'Failed'])

  const isEmpty = computed(() => !parts.value.length)

  async function createPart(payload) {
    try {
      const formData = new FormData()
      formData.append('title', payload.title)
      if (payload.notes) formData.append('notes', payload.notes)
      if (payload.cost) formData.append('cost', payload.cost)
      if (payload.eta) formData.append('eta', payload.eta)
      formData.append('quantity', payload.quantity)
      formData.append('fileId', payload.file.id)
      formData.append('requestId', payload.file.requestId)

      const res = await axios.post('https://localhost:4000/parts', formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${appStore.token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.status !== 200) {
        throw new Error()
      }
    } catch (err) {
      console.log(err)
      const error = new Error(err || 'Failed to create part.')
      throw error
    }
  }

  async function removePart(payload) {
    // Implement the logic to remove a part
  }

  async function fetchParts() {
    try {
      const url = 'https://localhost:4000/parts'

      const res = await axios.get(url, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })

      if (res.status !== 200) {
        throw new Error()
      }

      parts.value = res.data
    } catch (err) {
      console.log(err)
      throw new Error(err || 'Failed to fetch parts.')
    }
  }

  async function partById(partId) {
    if (!parts.value.length) {
      await fetchParts()
    }
    const part = parts.value.find((part) => part.id === parseInt(partId))
    if (part) {
      return part
    } else {
      throw new Error('Part not found.')
    }
  }

  return {
    parts,
    status,
    isEmpty,
    createPart,
    removePart,
    fetchParts,
    partById
  }
})
