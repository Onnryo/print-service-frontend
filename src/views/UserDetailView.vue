<template>
  <base-card>
    <template v-slot:title>
      <h2 class="card-title-text">User Details</h2>
    </template>
    <div class="user-details" v-if="user">
      <div class="user-header">
        <h1>{{ user.username }}</h1>
        <div class="user-header-button-list">
          <base-button @click="clearBalance">Clear Balance</base-button>
          <base-button class="warning-button" @click="deleteUser">Delete User</base-button>
        </div>
      </div>
      <hr class="user-divider" />
      <div class="user-metadata">
        <div class="user-metadata-group">
          <p class="user-property">Balance:</p>
          <p class="user-value">{{ user.balance }}</p>
        </div>
        <div class="user-metadata-group">
          <p class="user-property">Role:</p>
          <p class="user-value">{{ user.role }}</p>
        </div>
        <div class="user-metadata-group">
          <p class="user-property">Created At:</p>
          <p class="user-value">{{ user.createdAt }}</p>
        </div>
        <div class="user-metadata-group">
          <p class="user-property">Updated At:</p>
          <p class="user-value">{{ user.updatedAt }}</p>
        </div>
      </div>
      <div class="request-list" v-if="user.requests.length">
        <hr class="user-divider" />
        <p class="user-property">Requests:</p>
        <div
          class="request-card"
          v-for="request in user.requests"
          :key="request.id"
          @click="showRequestDetails(request.id)"
        >
          <div class="request-header">
            <h2 class="request-title">{{ request.title }}</h2>
            <p class="request-status">{{ request.status }}</p>
          </div>
          <p class="request-body">{{ truncateText(request.body, 100) }}</p>
          <div class="request-details">
            <p>
              <span class="label">Estimated Cost:</span>
              ${{ request.estimated_cost }}
            </p>
            <p><span class="label">Estimated Time:</span> {{ request.estimated_time }}</p>
          </div>
        </div>
      </div>
    </div>
  </base-card>
</template>

<script>
import { useUserStore } from '../stores/UserStore'
import { useAppStore } from '../stores/AppStore'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      user: null
    }
  },
  created() {
    console.log(parseInt(this.$route.params.id), this.appStore.userId)
    this.fetchUserDetails()
  },
  computed: {
    ...mapStores(useUserStore),
    ...mapStores(useAppStore),
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'Could not load users.'
    }
  },
  methods: {
    async fetchUserDetails() {
      try {
        this.isLoading = true
        this.user = await this.userStore.userById(this.$route.params.id)
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error || new Error('Failed to fetch user')
      } finally {
        this.isLoading = false
      }
    },
    showRequest() {
      this.$router.push('/requests/' + this.user.requestId)
    },
    deleteUser() {
      this.$router.push('/users/' + this.user.id + '/builder')
    },
    clearBalance() {
      const url = `https://localhost:4000/users/${this.user.id}/download`
      axios
        .get(url, {
          responseType: 'blob',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${this.appStore.token}`
          }
        })
        .then((response) => {
          const blob = new Blob([response.data])
          const link = document.createElement('a')
          const contentDisposition = response.headers['content-disposition']
          const userNameRegex = /username[^;=\n]*=((['"]).*?\2|[^;\n]*)["']?/
          const matches = userNameRegex.exec(contentDisposition)
          const userName = matches && matches[1] ? matches[1] : 'download'
          link.href = URL.createObjectURL(blob)
          link.download = userName.slice(1, -1)
          link.click()
        })
        .catch((error) => {
          console.error(error)
          // Handle the error if necessary
        })
    },
    truncateText(text, length) {
      if (text.length <= length) {
        return text
      } else {
        return text.substr(0, length) + '...'
      }
    },
    showRequestDetails(requestId) {
      this.$router.push(`/requests/${requestId}`)
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.user-header-button-list {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.user-details {
  padding: 20px;
}

.user-request-id {
  color: #888;
  font-size: 14px;
}

.user-metadata {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Specify two columns with equal width */
  gap: 10px; /* Add gap between columns */
  margin-bottom: 10px;
}

.user-metadata-group {
  display: flex;
  flex-direction: column;
}

.user-property {
  font-weight: bold;
  margin-right: 5px;
  align-self: flex-start;
}

.user-value {
  color: #333;
}

.user-divider {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
}

.request-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 0;
}

.request-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.3s;
}

.request-card:hover {
  transform: scale(1.02);
  background-color: rgba(0, 0, 0, 0.05);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.request-title {
  font-size: 20px;
  font-weight: bold;
}

.request-status {
  font-weight: bold;
  color: #888;
}

.request-body {
  margin-bottom: 10px;
}

.request-details {
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
}

.warning-button {
  background-color: #f44336;
  color: #fff;
}

.warning-button:hover {
  background-color: #d32f2f;
}

.warning-button:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.5);
}
</style>
