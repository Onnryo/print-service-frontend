<template>
  <base-card>
    <div class="request-details" v-if="request">
      <div class="request-header">
        <h1>{{ request.title }}</h1>
        <p class="request-user-id">{{ request.userId }}</p>
      </div>
      <hr class="request-divider" />
      <div class="request-body">{{ request.body }}</div>
      <p class="request-link">
        <a :href="request.link" target="_blank">{{ request.link }}</a>
      </p>
      <div class="request-metadata">
        <div class="request-metadata-group">
          <p class="request-property">Estimated Cost:</p>
          <p class="request-value">{{ request.estimated_cost }}</p>
        </div>
        <div class="request-metadata-group">
          <p class="request-property">Estimated Time:</p>
          <p class="request-value">{{ request.estimated_time }}</p>
        </div>
      </div>
      <div class="request-metadata">
        <div class="request-metadata-group">
          <p class="request-property">Status:</p>
          <p class="request-value">{{ request.status }}</p>
        </div>
        <div class="request-metadata-group">
          <p class="request-property">Status History:</p>
          <p class="request-value">{{ request.status_history }}</p>
        </div>
      </div>
      <div class="request-metadata">
        <div class="request-metadata-group">
          <p class="request-property">Created At:</p>
          <p class="request-value">{{ request.createdAt }}</p>
        </div>
        <div class="request-metadata-group">
          <p class="request-property">Updated At:</p>
          <p class="request-value">{{ request.updatedAt }}</p>
        </div>
      </div>
    </div>
    <base-spinner v-if="isLoading"></base-spinner>
    <p v-if="!request">{{ messageContents }}</p>
  </base-card>
</template>

<script>
import { useRequestStore } from '../stores/RequestStore'
import { mapStores } from 'pinia'

export default {
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      request: null
    }
  },
  created() {
    this.isLoading = true
    this.requestStore
      .requestById(this.$route.params.id)
      .then((req) => {
        this.request = req
        this.errorMessage = ''
        this.isLoading = false
      })
      .catch((error) => {
        this.errorMessage = !error || error === '' ? new Error('Failed to fetch request') : error
        this.isLoading = false
        console.log(this.errorMessage)
      })
  },
  computed: {
    ...mapStores(useRequestStore),
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'Could not load request.'
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

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.request-details {
  padding: 20px;
}

.request-user-id {
  color: #888;
  font-size: 14px;
}

.request-body {
  margin-bottom: 10px;
  white-space: pre-wrap;
}

.request-link {
  margin-bottom: 10px;
}

.request-link a {
  color: #0366d6;
}

.request-metadata {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.request-metadata-group {
  display: flex;
}

.request-property {
  font-weight: bold;
  margin-right: 5px;
}

.request-value {
  color: #333;
}

.base-spinner {
  margin: 20px auto;
  text-align: center;
}

.request-divider {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
}

/* Add more styles as needed */
</style>