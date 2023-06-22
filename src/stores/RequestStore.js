import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAppStore } from './AppStore'

export const useRequestStore = defineStore('request', () => {
  const appStore = useAppStore()
  const requests = ref([])
  const status = ref(['Pending', 'In Progress', 'Complete', 'Canceled'])

  const isEmpty = computed(() => !requests.value.length)

  async function createRequest(payload) {
    try {
      console.log({
        title: payload.title,
        body: payload.body,
        link: payload.link,
        userId: appStore.userId,
        token: appStore.token
      })
      const res = await axios.post(
        'https://localhost:4000/requests',
        {
          title: payload.title,
          body: payload.body,
          link: payload.link,
          userId: appStore.userId
        },
        { withCredentials: true, headers: { Authorization: `Bearer ${appStore.token}` } }
      )
      if (res.status != 200) {
        throw new Error()
      }
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
            : 'https://localhost:4000/requests'
            //: `https://localhost:4000/users/${appStore.userId}/requests`

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
        requests.value[requestIndex].comments = comments
        console.log(123, requests.value[requestIndex])
      } catch (error) {
        console.log(error)
        throw error
      }

      return requests.value[requestIndex]
    } else {
      throw new Error('Unauthorized.')
    }

    // if (!requests.value.length) {
    //   fetchRequests()
    //     .then(() => {
    //       const comments = fetchComments(requestId)
    //       const requestIndex = requests.value.findIndex(
    //         (request) => request.id === Number(requestId)
    //       )
    //       requests.value[requestIndex].comments = comments
    //       return requests.value[requestIndex]
    //     })
    //     .catch((error) => {})
    // }

    // if (!requests.value.length) {
    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       const url =
    //         appStore.role === 'ADMIN'
    //           ? 'https://localhost:4000/requests'
    //           : `https://localhost:4000/users/${appStore.userId}/requests`

    //       const res = await axios.get(url, {
    //         withCredentials: true,
    //         headers: { Authorization: `Bearer ${appStore.token}` }
    //       })

    //       if (res.status !== 200) {
    //         throw new Error()
    //       }

    //       console.log(requests.value)

    //       requests.value = res.data
    //       console.log(requests.value)

    //       const requestIndex = requests.value.findIndex(
    //         (request) => request.id === Number(requestId)
    //       )
    //       if (requestIndex !== -1) {
    //         try {
    //           console.log(`https://localhost:4000/requests/${requestId}/comments`)
    //           const commentRes = await axios.get(
    //             `https://localhost:4000/requests/${requestId}/comments`,
    //             { withCredentials: true, headers: { Authorization: `Bearer ${appStore.token}` } }
    //           )

    //           if (commentRes.status != 200) {
    //             throw new Error()
    //           }

    //           console.log(commentRes.data)
    //           requests.value[requestIndex].comments = commentRes.data
    //           const request = requests.value[requestIndex]
    //           resolve(request)
    //         } catch (err) {
    //           console.log(err)
    //           const request = requests.value[requestIndex]
    //           resolve(request)
    //         }
    //       } else {
    //         reject(new Error('Unauthorized.'))
    //       }
    //     } catch (err) {
    //       console.log(err)
    //       reject(new Error(err || 'Failed to fetch requests.')) // Reject the promise
    //     }
    //   })
    // } else {
    //   const request = requests.value.find((request) => request.id === Number(requestId))
    //   return Promise.resolve(request)
    // }
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
