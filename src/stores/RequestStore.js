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
        resolve() // Resolve the promise
      } catch (err) {
        console.log(err)
        reject(new Error(err || 'Failed to fetch requests.')) // Reject the promise
      }
    })
  }
  function requestById(requestId) {
    if (!requests.value.length) {
      return new Promise((resolve, reject) => {
        fetchRequests()
          .then(() => {
            const request = requests.value.find((request) => request.id === Number(requestId))
            resolve(request)
          })
          .catch((err) => {
            console.log(err)
            reject(new Error(err || 'Failed to fetch requests.')) // Reject the promise
          })
      })
    } else {
      const request = requests.value.find((request) => request.id === Number(requestId))
      return Promise.resolve(request)
    }
  }

  return { requests, status, isEmpty, createRequest, removeRequest, fetchRequests, requestById }
})
