import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import VueJwtDecode from 'vue-jwt-decode'

let timer

export const useAppStore = defineStore('app', () => {
  const userId = ref(null)
  const username = ref(null)
  const role = ref(null)
  const token = ref(null)
  const didDeauth = ref(false)
  const didExpire = ref(false)
  const isAuthenticated = computed(() => !!token.value && !didExpire.value)

  async function login(payload) {
    try {
      const res = await axios.post('https://localhost:4000/login', payload, {
        withCredentials: true
      })

      if (res.status !== 200) {
        throw new Error()
      }

      const accessToken = res.data.accessToken
      const decoded = VueJwtDecode.decode(accessToken)
      const jwtid = decoded.id
      const jwtusername = decoded.username
      const jwtrole = decoded.role
      const jwtexpiration = decoded.exp * 1000

      localStorage.setItem('token', accessToken)
      localStorage.setItem('userId', jwtid)
      localStorage.setItem('username', jwtusername)
      localStorage.setItem('tokenExpiration', jwtexpiration)

      const expiresIn = +jwtexpiration - new Date().getTime()
      timer = setTimeout(deauth, expiresIn)

      didDeauth.value = false
      didExpire.value = false
      userId.value = jwtid
      username.value = jwtusername
      role.value = jwtrole
      token.value = accessToken
    } catch (err) {
      const error = new Error(err || 'Failed to authenticate. Check your login data.')
      throw error
    }
  }

  async function signup(payload) {
    try {
      const res = await axios.post('https://localhost:4000/signup', payload, {
        withCredentials: true
      })

      if (res.status !== 200) {
        throw new Error()
      }
    } catch (err) {
      const error = new Error(
        err.response.data.message || 'Failed to authenticate. Check your login data.'
      )
      throw error
    }
  }

  async function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('tokenExpiration')

    clearTimeout(timer)

    token.value = null
    userId.value = null

    await axios.get('https://localhost:4000/logout', { withCredentials: true })
  }

  async function reauth() {
    return new Promise((resolve, reject) => {
      clearTimeout(timer)

      axios
        .get('https://localhost:4000/refresh', { withCredentials: true })
        .then((res) => {
          const accessToken = res.data.accessToken
          const decoded = VueJwtDecode.decode(accessToken)
          const jwtid = decoded.id
          const jwtusername = decoded.username
          const jwtrole = decoded.role
          const jwtexpiration = decoded.exp * 1000

          localStorage.setItem('token', accessToken)
          localStorage.setItem('userId', jwtid)
          localStorage.setItem('username', jwtusername)
          localStorage.setItem('tokenExpiration', jwtexpiration)

          const expiresIn = +jwtexpiration - new Date().getTime()
          timer = setTimeout(deauth, expiresIn)

          didDeauth.value = false
          didExpire.value = false
          userId.value = jwtid
          username.value = jwtusername
          role.value = jwtrole
          token.value = accessToken

          resolve()
        })
        .catch((error) => {
          didExpire.value = true
          logout()
          reject()
        })
    })
  }

  function deauth() {
    didDeauth.value = true
    reauth()
  }

  return {
    userId,
    username,
    token,
    role,
    didDeauth,
    isAuthenticated,
    login,
    signup,
    logout,
    reauth,
    deauth
  }
})
