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
      fileStore.createfile(payload)
    } catch (err) {
      console.log(err)
      const error = new Error(err || 'Failed to submit request.')
      throw error
    }
  }

  async function removeRequest(payload) {}

  function fetchRequests() {
    requests.value = []
    return new Promise(async (resolve, reject) => {
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

        //console.log(res.data)

        requests.value = res.data
        requests.value.forEach((request) => {
          request.comments = []
          request.files = []
        })
        resolve() // Resolve the promise
      } catch (err) {
        console.log(err)
        reject(new Error(err || 'Failed to fetch requests.')) // Reject the promise
      }
    })
  }

  async function fetchComments(requestId) {
    try {
      const res = await axios.get(`https://localhost:4000/requests/${requestId}/comments`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })

      if (res.status != 200) {
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

      if (res.status != 200) {
        throw new Error()
      }

      return res.data
    } catch (error) {
      throw error
    }
  }

  async function requestById(requestId) {
    if (!requests.value.length) {
      try {
        await fetchRequests()
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    const requestIndex = requests.value.findIndex((request) => request.id === Number(requestId))

    if (requestIndex !== -1) {
      try {
        const comments = await fetchComments(requestId)
        const files = await fetchFiles(requestId)
        requests.value[requestIndex].comments = comments
        requests.value[requestIndex].files = files
        console.log(requests.value[requestIndex])
      } catch (error) {
        console.log(error)
        throw error
      }

      return requests.value[requestIndex]
    } else {
      throw new Error('Unauthorized.')
    }
  }

  async function createComment(payload) {
    payload.userId = appStore.userId
    console.log(payload)
    const requestIndex = requests.value.findIndex((request) => request.id === payload.requestId)
    console.log(requestIndex)
    if (requestIndex !== -1) {
      requests.value[requestIndex].comments.push(payload)
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

        if (res.status != 200) {
          throw new Error()
        }

        console.log(res.data)
        const commentIndex = requests.value[requestIndex].comments.findIndex(
          (comment) => comment.text === payload.text
        )
        requests.value[requestIndex].comments[commentIndex] = res.data
      } catch (err) {
        console.log(err)
        const error = new Error(err || 'Failed to submit comment.')
        throw error
      }
    }
  }

  return {
    requests,
    status,
    isEmpty,
    createRequest,
    removeRequest,
    fetchRequests,
    requestById,
    createComment
  }
})
