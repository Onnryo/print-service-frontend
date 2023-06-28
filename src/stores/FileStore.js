import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAppStore } from './AppStore'

export const useFileStore = defineStore('file', () => {
  const appStore = useAppStore()
  const files = ref([])

  const isEmpty = computed(() => !files.value.length)

  async function createFile(payload) {
    try {
      const fileFormData = new FormData()

      // Append each file to the FormData
      payload.files.forEach((file) => {
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

  async function removeFile(payload) {
    // Implement the logic to remove a file
  }

  async function fetchFiles() {
    files.value = []
    try {
      const url = 'https://localhost:4000/files'

      const res = await axios.get(url, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })

      if (res.status !== 200) {
        throw new Error()
      }

      files.value = res.data
      files.value.forEach((file) => {
        file.parts = []
      })
    } catch (err) {
      console.log(err)
      throw new Error(err || 'Failed to fetch files.')
    }
  }

  async function fetchParts(fileId) {
    try {
      const res = await axios.get(`https://localhost:4000/files/${fileId}/parts`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })

      if (res.status !== 200) {
        throw new Error()
      }

      return res.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async function fileById(fileId) {
    if (!files.value.length) {
      await fetchFiles()
    }

    const fileIndex = files.value.findIndex((file) => file.id === Number(fileId))

    if (fileIndex !== -1) {
      try {
        const parts = await fetchParts(fileId)
        files.value[fileIndex].parts = parts
      } catch (error) {
        console.log(error)
        throw error
      }

      return files.value[fileIndex]
    } else {
      throw new Error('File not found.')
    }
  }

  return {
    files,
    isEmpty,
    createFile,
    removeFile,
    fetchFiles,
    fileById
  }
})
