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
      console.log(payload)
      const formData = new FormData()
      formData.append('title', payload.title)
      if (!!payload.notes) formData.append('notes', payload.notes)
      if (!!payload.cost) formData.append('cost', payload.cost)
      if (!!payload.eta) formData.append('eta', payload.eta)
      formData.append('quantity', payload.quantity)
      formData.append('fileId', payload.file.id)
      formData.append('requestId', payload.file.requestId)

      const res = await axios.post('https://localhost:4000/parts', formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${appStore.token}`,
          'Content-Type': 'multipart/form-data' // Important: Set the content type to 'multipart/form-data'
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

  async function removePart(payload) {}

  function fetchParts() {
    parts.value = []
    return new Promise(async (resolve, reject) => {
      try {
        const url = 'https://localhost:4000/parts'

        const res = await axios.get(url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${appStore.token}` }
        })

        if (res.status !== 200) {
          throw new Error()
        }

        //console.log(res.data)

        parts.value = res.data
        resolve() // Resolve the promise
      } catch (err) {
        console.log(err)
        reject(new Error(err || 'Failed to fetch parts.')) // Reject the promise
      }
    })
  }

  async function partById(partId) {
    if (!parts.value.length) {
      try {
        await fetchParts()
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    const partIndex = parts.value.findIndex((part) => part.id === Number(partId))

    if (partIndex !== -1) {
      return parts.value[partIndex]
    } else {
      throw new Error('Unauthorized.')
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
