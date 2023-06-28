<template>
  <base-card>
    <template v-slot:title>
      <h2 class="card-title-text">File Details</h2>
    </template>
    <div class="file-details" v-if="file">
      <div class="file-header">
        <h1>{{ file.name }}</h1>
        <div class="file-header-button-list">
          <base-button @click="showRequest">Request</base-button>
          <base-button @click="createPart">Create Part</base-button>
          <base-button @click="downloadFile">Download</base-button>
        </div>
      </div>
      <hr class="file-divider" />
      <div class="file-metadata">
        <div class="file-metadata-group">
          <p class="file-property">Created At:</p>
          <p class="file-value">{{ file.createdAt }}</p>
        </div>
        <div class="file-metadata-group">
          <p class="file-property">Updated At:</p>
          <p class="file-value">{{ file.updatedAt }}</p>
        </div>
      </div>
      <div class="part-list" v-if="file.parts.length">
        <hr class="file-divider" />
        <p class="file-property">Parts:</p>
        <div
          class="part-card"
          v-for="part in file.parts"
          :key="part.id"
          @click="showPartDetails(part.id)"
        >
          <div class="part-header">
            <h2 class="part-title">{{ part.title }}</h2>
            <p class="part-status">{{ part.status }}</p>
          </div>
          <p class="part-notes">{{ truncateText(part.notes, 100) }}</p>
          <div class="part-details">
            <p>
              <span class="label">Estimated Cost:</span>
              ${{ (part.cost * part.quantity).toFixed(2) }}
            </p>
            <p><span class="label">Estimated Time:</span> {{ part.eta }}</p>
          </div>
        </div>
      </div>
    </div>
  </base-card>
</template>

<script>
import { useFileStore } from '../stores/FileStore'
import { useAppStore } from '../stores/AppStore'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      file: null
    }
  },
  created() {
    this.fetchFileDetails()
  },
  computed: {
    ...mapStores(useFileStore),
    ...mapStores(useAppStore),
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'Could not load files.'
    }
  },
  methods: {
    async fetchFileDetails() {
      try {
        this.isLoading = true
        this.file = await this.fileStore.fileById(this.$route.params.id)
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error || new Error('Failed to fetch file')
      } finally {
        this.isLoading = false
      }
    },
    showRequest() {
      this.$router.push('/requests/' + this.file.requestId)
    },
    createPart() {
      this.$router.push('/files/' + this.file.id + '/builder')
    },
    downloadFile() {
      const url = `https://localhost:4000/files/${this.file.id}/download`
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
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)["']?/
          const matches = fileNameRegex.exec(contentDisposition)
          const fileName = matches && matches[1] ? matches[1] : 'download'
          link.href = URL.createObjectURL(blob)
          link.download = fileName.slice(1, -1)
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

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.file-header-button-list {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.file-details {
  padding: 20px;
}

.file-request-id {
  color: #888;
  font-size: 14px;
}

.file-metadata {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.file-metadata-group {
  display: flex;
  width: 15em;
  flex-direction: column;
}

.file-property {
  font-weight: bold;
  margin-right: 5px;
  align-self: flex-start;
}

.file-value {
  color: #333;
}

.file-divider {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
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
