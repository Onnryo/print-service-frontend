import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAppStore } from './AppStore'
import { useFileStore } from './FileStore'

export const useRequestStore = defineStore('request', () => {
  const appStore = useAppStore()
  const fileStore = useFileStore()
  const requests = ref([])
  const status = ref(['Pending', 'In Progress', 'Complete', 'Canceled'])

  const isEmpty = computed(() => !requests.value.length)

  async function createRequest(payload) {
    try {
      const formData = new FormData()
      formData.append('title', payload.title)
      formData.append('body', payload.body)
      formData.append('link', payload.link)
      formData.append('userId', appStore.userId)

      const res = await axios.post('https://localhost:4000/requests', formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${appStore.token}`,
          'Content-Type': 'multipart/form-data' // Important: Set the content type to 'multipart/form-data'
        }
      })

      if (res.status !== 200) {
        throw new Error()
      }

      payload.requestId = res.data.id
      await fileStore.createFile(payload)
    } catch (err) {
      console.log(err)
      const error = new Error(err || 'Failed to submit request.')
      throw error
    }
  }

  async function removeRequest(payload) {
    // Implement the logic to remove a request
  }

  async function fetchRequests() {
    try {
      const url =
        appStore.role === 'ADMIN'
          ? 'https://localhost:4000/requests'
          : `https://localhost:4000/users/${appStore.userId}/requests`

      const res = await axios.get(url, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })

      if (res.status !== 200) {
        throw new Error()
      }

      requests.value = res.data
      requests.value.forEach((request) => {
        request.comments = []
        request.files = []
      })
    } catch (err) {
      console.log(err)
      throw new Error(err || 'Failed to fetch requests.')
    }
  }

  async function fetchComments(requestId) {
    try {
      const res = await axios.get(`https://localhost:4000/requests/${requestId}/comments`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })

      if (res.status !== 200) {
        throw new Error()
      }

      return res.data
    } catch (error) {
      throw error
    }
  }

  async function fetchFiles(requestId) {
    try {
      const res = await axios.get(`https://localhost:4000/requests/${requestId}/files`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })

      if (res.status !== 200) {
        throw new Error()
      }

      return res.data
    } catch (error) {
      throw error
    }
  }

  async function requestById(requestId) {
    if (!requests.value.length) {
      await fetchRequests()
    }

    const request = requests.value.find((request) => request.id === parseInt(requestId))

    if (request) {
      try {
        const [comments, files] = await Promise.all([
          fetchComments(requestId),
          fetchFiles(requestId)
        ])
        request.comments = comments
        request.files = files
      } catch (error) {
        console.log(error)
        throw error
      }

      return request
    } else {
      throw new Error('Request not found.')
    }
  }

  async function createComment(payload) {
    payload.userId = appStore.userId

    const request = requests.value.find((request) => request.id === payload.requestId)

    if (request) {
      try {
        const res = await axios.post(
          'https://localhost:4000/comments',
          {
            text: payload.text,
            userId: payload.userId,
            requestId: payload.requestId
          },
          { withCredentials: true, headers: { Authorization: `Bearer ${appStore.token}` } }
        )

        if (res.status !== 200) {
          throw new Error()
        }

        const comment = res.data
        request.comments.push(comment)
      } catch (err) {
        console.log(err)
        const error = new Error(err || 'Failed to submit comment.')
        throw error
      }
    }
  }

  function filteredRequests(filterText, filterStatus) {
    const filterTextLower = filterText.toLowerCase()
    const filterStatusLower = filterStatus.toLowerCase()

    return requests.value.filter((request) => {
      const titleMatch = !filterText || request.title.toLowerCase().includes(filterTextLower)
      const statusMatch = !filterStatus || request.status.toLowerCase() === filterStatusLower

      return titleMatch && statusMatch
    })
  }

  return {
    requests,
    status,
    isEmpty,
    createRequest,
    removeRequest,
    fetchRequests,
    requestById,
    createComment,
    filteredRequests
  }
})
