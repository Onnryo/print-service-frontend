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
      // Axios POST /login {username, email, password}
      const res = await axios.post(
        'https://localhost:4000/login',
        {
          username: payload.username,
          password: payload.password
        },
        { withCredentials: true }
      )

      if (res.status != 200) {
        throw new Error()
      }

      // Decode jwt payload
      const accessToken = res.data.accessToken
      const decoded = VueJwtDecode.decode(accessToken)
      const jwtid = decoded.id
      const jwtusername = decoded.username
      const jwtrole = decoded.role
      const jwtexpiration = decoded.exp * 1000

      // // Fetch user details
      // const userRes = await axios.get('https://localhost:4000/users/' + id, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`
      //   },
      //   withCredentials: true
      // })

      // const email = userRes.data.email
      // const balance = userRes.data.balance
      // console.log(userRes)

      // Store session details in local storage
      localStorage.setItem('token', accessToken)
      localStorage.setItem('userId', jwtid)
      localStorage.setItem('username', jwtusername)
      localStorage.setItem('tokenExpiration', jwtexpiration)

      // Set deauth timer
      const expiresIn = +jwtexpiration - new Date().getTime()
      timer = setTimeout(deauth, expiresIn)

      // Update state with session details
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
      // Axios POST /login {username, email, password}
      const res = await axios.post(
        'https://localhost:4000/signup',
        {
          username: payload.username,
          email: payload.email,
          password: payload.password
        },
        { withCredentials: true }
      )

      if (res.status != 200) {
        throw new Error()
      }
    } catch (err) {
      console.log(err)
      const error = new Error(
        err.response.data.message || 'Failed to authenticate. Check your login data.'
      )
      throw error
    }
  }
  async function logout() {
    // Remove session details from local storage
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('tokenExpiration')

    // Clear deauth timer
    clearTimeout(timer)

    // Revert state
    token.value = null
    userId.value = null

    const res = await axios.get('https://localhost:4000/logout', { withCredentials: true })
  }
  async function reauth() {
    return new Promise((resolve, reject) => {
      clearTimeout(timer)
      // Attempt to reauth with refresh token
      axios
        .get('https://localhost:4000/refresh', { withCredentials: true })
        .then((res) => {
          const accessToken = res.data.accessToken
          const decoded = VueJwtDecode.decode(accessToken)
          const jwtid = decoded.id
          const jwtusername = decoded.username
          const jwtrole = decoded.role
          const jwtexpiration = decoded.exp * 1000

          // Store session details in local storage
          localStorage.setItem('token', accessToken)
          localStorage.setItem('userId', jwtid)
          localStorage.setItem('username', jwtusername)
          localStorage.setItem('tokenExpiration', jwtexpiration)

          // Set deauth timer
          const expiresIn = +jwtexpiration - new Date().getTime()
          timer = setTimeout(deauth, expiresIn)

          // Update state with session details
          didDeauth.value = false
          didExpire.value = false
          userId.value = jwtid
          username.value = jwtusername
          role.value = jwtrole
          token.value = accessToken
          console.log('Reauthed!', userId.value)
          resolve()
        })
        .catch((error) => {
          console.log('Reauth Failed :(', error)
          didExpire.value = true
          logout()
          reject()
        })
    })
  }
  function deauth() {
    didDeauth.value = true
    console.log('Attempting to Reauth...')
    reauth()
  }

  return { userId, token, didDeauth, isAuthenticated, login, signup, logout, reauth, deauth }
})
