<template>
  <base-card>
    <template v-slot:title>
      <h2 class="card-title-text">Part Details</h2>
    </template>
    <div class="part-details" v-if="part">
      <div class="part-header">
        <h1>{{ part.quantity }}x {{ part.title }}</h1>
        <div class="part-header-button-list">
          <base-button @click="showFile">File</base-button>
          <base-button @click="showRequest">Request</base-button>
        </div>
      </div>
      <hr class="part-divider" />
      <div class="part-metadata">
        <div class="part-metadata-group">
          <p class="part-property">Estimated Cost:</p>
          <p class="part-value">${{ (part.cost * part.quantity).toFixed(2) }}</p>
        </div>
        <div class="part-metadata-group">
          <p class="part-property">Estimated Time:</p>
          <p class="part-value">{{ part.eta }}</p>
        </div>
      </div>
      <div class="part-metadata">
        <div class="part-metadata-group">
          <p class="part-property">Status:</p>
          <p class="part-value">{{ part.status }}</p>
        </div>
        <div class="part-metadata-group">
          <p class="part-property">Status History:</p>
          <p class="part-value">{{ part.status_history }}</p>
        </div>
      </div>
      <div class="part-metadata">
        <div class="part-metadata-group">
          <p class="part-property">Created At:</p>
          <p class="part-value">{{ part.createdAt }}</p>
        </div>
        <div class="part-metadata-group">
          <p class="part-property">Updated At:</p>
          <p class="part-value">{{ part.updatedAt }}</p>
        </div>
      </div>
      <hr class="part-divider" />
      <div class="part-notes">{{ part.notes }}</div>
    </div>
  </base-card>
</template>

<script>
import { usePartStore } from '../stores/PartStore'
import { useAppStore } from '../stores/AppStore'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      part: null
    }
  },
  created() {
    this.fetchPartDetails()
  },
  computed: {
    ...mapStores(usePartStore),
    ...mapStores(useAppStore),
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'Could not load parts.'
    }
  },
  methods: {
    async fetchPartDetails() {
      try {
        this.isLoading = true
        this.part = await this.partStore.partById(this.$route.params.id)
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error || new Error('Failed to fetch part')
      } finally {
        this.isLoading = false
      }
    },
    showFile() {
      this.$router.push('/files/' + this.part.fileId)
    },
    showRequest() {
      this.$router.push('/requests/' + this.part.requestId)
    },
    truncateText(text, length) {
      if (text.length <= length) {
        return text
      } else {
        return text.substr(0, length) + '...'
      }
    },
    showPartDetails(partId) {
      this.$router.push(`/parts/${partId}`)
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

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.part-header-button-list {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.part-details {
  padding: 20px;
}

.part-metadata {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.part-metadata-group {
  display: flex;
  width: 15em;
  flex-direction: column;
}

.part-property {
  font-weight: bold;
  margin-right: 5px;
  align-self: flex-start;
}

.part-value {
  color: #333;
}

.part-divider {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
}

.part-notes {
  margin-bottom: 10px;
}

.part-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 0;
}

.part-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.3s;
}

.part-card:hover {
  transform: scale(1.02);
  background-color: rgba(0, 0, 0, 0.05);
}

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.part-title {
  font-size: 20px;
  font-weight: bold;
}

.part-status {
  font-weight: bold;
  color: #888;
}

.part-notes {
  margin-bottom: 10px;
}

.part-details {
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
}
</style>
