import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAppStore } from './AppStore'

export const useRequestStore = defineStore('request', () => {
  const appStore = useAppStore()
  const requests = ref([])

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
        { withCredentials: true, headers: { Authorization: `Bearer ${appStore.token}`} }
      )
      if (res.status != 200) {
        throw new Error()
      }

      console.log(res.data)
    } catch (err) {
      console.log(err)
      const error = new Error(err || 'Failed to submit request.')
      throw error
    }
  }

  async function removeRequest(payload) {}

  async function fetchRequests(payload) {}

  return { requests, createRequest, removeRequest, fetchRequests }
})
