import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

let timer

export const useAppStore = defineStore('app', () => {
  const userId = ref(null)
  const token = ref(null)
  const didDeauth = ref(false)
  const isAuthenticated = computed(() => !!token.value)
  async function login(payload) {
    didDeauth.value = false
    userId.value = 'u1'
    token.value = 'Bearer'
    console.log(payload)
    // Axios POST /login {username, email, password}
    // If 200, parse accessToken from json body (update backed to also supply {username, email, role, balance} on login)
    // Decode jwt payload
    // Calculate expiration datetime
    // Store session details in local storage
    localStorage.setItem('token', 'u1');
    localStorage.setItem('userId', 'Bearer');
    localStorage.setItem('tokenExpiration', new Date().getTime() + (3600 * 1000));
    // Do something with refreshToken cookie?
    // Set deauth timer
    // Update state with session details
  }
  async function signup(payload) {
    console.log(payload)
    // Axios POST /login {username, email, password}
    // If 200, redirect to login
  }
  function logout() {
    // Remove session details from local storage
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('tokenExpiration')

    // Clear deauth timer
    clearTimeout(timer)

    // Revert state
    token.value = null
    userId.value = null
  }
  function reauth() {
    // Retrieve session details from local storage
    token.value = localStorage.getItem('token')
    userId.value = localStorage.getItem('userId')
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    // Exit if token is expired withing next 10 secs
    const expiresIn = +tokenExpiration - new Date().getTime()
    if (expiresIn < 10000) {
      // Attempt to reauth with refresh token
      return
    }

    // Set deauth timer
    timer = setTimeout(deauth, expiresIn)
  }
  function deauth() {
    logout()
    didDeauth.value = true
  }

  return { userId, token, didDeauth, isAuthenticated, login, signup, logout, reauth, deauth }
})
