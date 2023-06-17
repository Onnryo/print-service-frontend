<template>
  <header class="header-container">
    <h1 class="header-title">
      <router-link to="/" class="header-link">Print Service</router-link>
    </h1>
    <nav class="nav-container">
      <ul class="nav-list">
        <li v-if="isLoggedIn" class="nav-item">
          <router-link
            to="/requests/submission"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/requests/submission' }"
          >
            New Request
          </router-link>
        </li>
        <li v-else class="nav-item">
          <router-link to="/auth" class="nav-link">Login</router-link>
        </li>
        <li v-if="isLoggedIn" class="nav-item">
          <button class="header-button header-button-logout" @click="logout">Logout</button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { useAppStore } from '../../stores/AppStore'
import { mapStores } from 'pinia'

export default {
  computed: {
    ...mapStores(useAppStore),
    isLoggedIn() {
      return this.appStore.isAuthenticated
    }
  },
  methods: {
    logout() {
      this.appStore.logout()
      this.$router.replace('/auth')
    }
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #0066cc; /* Light blue background color */
  color: #ffffff; /* White text color */
}

.header-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.nav-container {
  margin-left: 1rem;
}

.nav-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: inline-block;
  margin-right: 1rem;
}

.header-link,
.nav-link,
.header-button-logout {
  color: #ffffff; /* White text color */
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
}

.header-link {
  font-size: 2rem;
}

.nav-link {
  font-size: 1rem;
}

.header-link:hover,
.nav-link:hover,
.nav-link-active {
  color: #f0f0f0b0; /* Off-white text color on hover */
}

.header-button,
.nav-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #0088cc; /* Darker blue background color */
  color: #ffffff; /* White text color */
  text-decoration: none;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.header-button:hover,
.nav-link:hover,
.nav-link-active {
  background-color: #0066cc; /* Lighter blue background color on hover */
}

.header-button-logout {
  background-color: #004792; /* Darker logout button color */
}
</style>