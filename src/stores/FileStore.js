import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAppStore } from './AppStore'

export const useFileStore = defineStore('file', () => {
  const appStore = useAppStore()
  const files = ref([])

  const isEmpty = computed(() => !files.value.length)

  async function createfile(payload) {
    try {
      const fileFormData = new FormData()

      // Append each file to the FormData
      payload.files.forEach((file) => {
        console.log(file.file)
        fileFormData.append(`files`, file.file)
      })

      const res = await axios.post(
        `https://localhost:4000/files/${payload.requestId}`,
        fileFormData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${appStore.token}`,
            'Content-Type': 'multipart/form-data' // Important: Set the content type to 'multipart/form-data'
          }
        }
      )

      if (res.status !== 200) {
        throw new Error()
      }
    } catch (err) {
      console.log(err)
      const error = new Error(err || 'Failed to submit file.')
      throw error
    }
  }

  async function removefile(payload) {}

  function fetchfiles() {
    files.value = []
    return new Promise(async (resolve, reject) => {
      try {
        if (appStore.role !== 'ADMIN') {
          reject(new Error('Unauthorized'))
        }
        const url = 'https://localhost:4000/files'

        const res = await axios.get(url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${appStore.token}` }
        })

        if (res.status !== 200) {
          throw new Error()
        }
        console.log(res.data)

        files.value = res.data
        files.value.forEach((file) => {
          file.parts = []
        })
        resolve() // Resolve the promise
      } catch (err) {
        console.log(err)
        reject(new Error(err || 'Failed to fetch files.')) // Reject the promise
      }
    })
  }

  async function fetchParts(fileId) {
    try {
      console.log(999)
      const res = await axios.get(`https://localhost:4000/files/${fileId}/parts`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })
      console.log(1000)
      if (res.status != 200) {
        throw new Error()
      }

      return res.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async function fileById(fileId) {
    console.log(fileId)
    if (!files.value.length) {
      try {
        await fetchfiles()
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    const fileIndex = files.value.findIndex((file) => file.id === Number(fileId))
    console.log(files.value)

    if (fileIndex !== -1) {
      try {
        const parts = await fetchParts(fileId)
        console.log(parts)
        files.value[fileIndex].parts = parts
        console.log(files.value[fileIndex].parts)
      } catch (error) {
        console.log(error)
        throw error
      }

      return files.value[fileIndex]
    } else {
      throw new Error('Unauthorized.')
    }
  }

  return {
    files,
    isEmpty,
    createfile,
    removefile,
    fetchfiles,
    fileById
  }
})
