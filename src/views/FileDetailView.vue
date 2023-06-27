<template>
  <base-card>
    <div class="file-details" v-if="file">
      <!-- file Header -->
      <div class="file-header">
        <h1>{{ file.name }}</h1>
        <p class="file-request-id">{{ file.requestId }}</p>
      </div>

      <hr class="file-divider" />

      <!-- file Metadata -->
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

      <hr class="file-divider" />

      <div class="file-buttons">
        <base-button
          v-for="file in file.files"
          :key="file.id"
          @click="handleClick(file.id, $event)"
        >
          {{ file.name }}
        </base-button>
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
    // Fetch file data
    console.log(1)
    this.isLoading = true
    this.fileStore
      .fileById(this.$route.params.id)
      .then((req) => {
        console.log(2, req)
        this.file = req
        this.errorMessage = ''
        this.isLoading = false
        console.log(this.file)
      })
      .catch((error) => {
        this.errorMessage = !error || error === '' ? new Error('Failed to fetch file') : error
        this.isLoading = false
        console.log(this.errorMessage)
      })
  },
  computed: {
    ...mapStores(useFileStore),
    ...mapStores(useAppStore),
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'Could not load files.'
    }
  },
  methods: {
    downloadFile(fileId) {
      axios
        .get(`https://localhost:4000/files/${fileId}/download`, {
          responseType: 'blob', // Set the response type to 'blob' for file download
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${this.appStore.token}`
          }
        })
        .then((response) => {
          console.log(123, response)
          const blob = new Blob([response.data])
          const link = document.createElement('a')
          const contentDisposition = response.headers['content-disposition']
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)["']?/
          const matches = fileNameRegex.exec(contentDisposition)
          const fileName = matches && matches[1] ? matches[1] : 'download'
          link.href = URL.createObjectURL(blob)
          link.download = fileName.slice(1, -1) // Get the file name from the response header
          link.click()
        })
        .catch((error) => {
          console.error(error)
          // Handle the error if necessary
        })
    },
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

.file-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.file-buttons > base-button {
  padding: 8px 16px;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.file-details {
  padding: 20px;
}

.file-request-id {
  color: #888;
  font-size: 14px;
}

.file-body {
  margin-bottom: 10px;
  white-space: pre-wrap;
}

.file-link {
  margin-bottom: 10px;
}

.file-link a {
  color: #0366d6;
}

.file-metadata {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.file-metadata-group {
  display: flex;
  width: 15em;
  flex-direction: column; /* Updated: Change flex-direction to column */
}

.file-property {
  font-weight: bold;
  margin-right: 5px;
  align-self: flex-start;
}

.file-value {
  color: #333;
}

.base-spinner {
  margin: 20px auto;
  text-align: center;
}

.file-divider {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
}

.comment-form {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.comment-input {
  flex-grow: 1;
  /* Apply the desired styling for the input field */
  /* For example: */
  border: 1px solid #e4e4e4;
  padding: 0.5em;
  margin-right: 10px;
  border-radius: 25px;
}

.comment-submit {
  /* Apply the desired styling for the submit button */
  /* For example: */
  border: none;
  background-color: #0366d6;
  color: white;
  padding: 0.5em 1em;
  border-radius: 25px;
  cursor: pointer;
}

.file-comment-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 1em; /* Adjust padding as needed */
  overflow-y: auto;
  max-height: 300px; /* Adjust the max-height as needed */

  /* Media queries for scaling in portrait and landscape orientations */
  @media (orientation: portrait) {
    margin: 1em 0; /* Adjust margin as needed */
  }

  @media (orientation: landscape) {
    margin: 1em 10%; /* Adjust margin as needed */
  }

  /* Custom scrollbar styles */
  scrollbar-color: #ccc #f5f5f5; /* Adjust the colors as needed */
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
}

.file-comment {
  display: inline-block;
  padding: 8px 16px;
  margin: 8px;
  border-radius: 20px;
  max-width: 70%;
}

.comment-sent {
  background-color: #248bf5;
  color: white;
  align-self: flex-end;
}

.comment-received {
  background-color: #e5e5ea;
  align-self: flex-start;
}

/* Add more styles as needed */
</style>
