import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAppStore } from './AppStore'

export const useUserStore = defineStore('user', () => {
  const appStore = useAppStore()
  const users = ref([])
  const role = ref(['ADMIN', 'USER'])

  const isEmpty = computed(() => !users.value.length)

  async function createUser(payload) {
    try {
      const userFormData = new FormData()

      // Append each user to the FormData
      payload.users.forEach((user) => {
        userFormData.append(`users`, user.user)
      })

      const res = await axios.post(
        `https://localhost:4000/users/${payload.requestId}`,
        userFormData,
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
      const error = new Error(err || 'Failed to submit user.')
      throw error
    }
  }

  async function removeUser(payload) {
    // Implement the logic to remove a user
  }

  async function fetchUsers() {
    users.value = []
    try {
      const url =
        appStore.role === 'ADMIN'
          ? 'https://localhost:4000/users'
          : `https://localhost:4000/users/${appStore.userId}`

      const res = await axios.get(url, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${appStore.token}` }
      })

      if (res.status !== 200) {
        throw new Error()
      }

      if (appStore.role === 'ADMIN') {
        users.value = res.data
      } else {
        users.value = []
        users.value.push(res.data)
      }
      
      users.value.sort((a, b) => a.id - b.id)
      users.value.forEach((user) => {
        user.requests = []
      })
    } catch (err) {
      console.log(err)
      throw new Error(err || 'Failed to fetch users.')
    }
  }

  async function fetchRequests(userId) {
    try {
      const res = await axios.get(`https://localhost:4000/users/${userId}/requests`, {
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

  async function userById(userId) {
    if (!users.value.length) {
      await fetchUsers()
    }

    const userIndex = users.value.findIndex((user) => user.id === Number(userId))

    if (userIndex !== -1) {
      try {
        const requests = await fetchRequests(userId)
        users.value[userIndex].requests = requests
      } catch (error) {
        console.log(error)
        throw error
      }

      return users.value[userIndex]
    } else {
      throw new Error('User not found.')
    }
  }

  function filteredUsers(filterText, filterRole) {
    const filterTextLower = filterText.toLowerCase()
    const filterRoleLower = filterRole.toLowerCase()
    console.log(filterRoleLower, )

    return users.value.filter((user) => {
      const usernameMatch = !filterText || user.username.toLowerCase().includes(filterTextLower)
      const roleMatch = !filterRole || user.role.toLowerCase() === filterRoleLower

      return usernameMatch && roleMatch
    })
  }

  return {
    users,
    isEmpty,
    createUser,
    removeUser,
    fetchUsers,
    userById,
    role,
    filteredUsers
  }
})
