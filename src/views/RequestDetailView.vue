<template>
  <base-card>
    <div class="request-details" v-if="request">
      <!-- Request Header -->
      <div class="request-header">
        <h1>{{ request.title }}</h1>
        <p class="request-user-id">{{ request.userId }}</p>
      </div>

      <hr class="request-divider" />

      <!-- Request Metadata -->
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

      <hr class="request-divider" />

      <!-- Request Body -->
      <div class="request-body">{{ request.body }}</div>

      <!-- Request Link -->
      <p class="request-link">
        <a :href="request.link" target="_blank">{{ request.link }}</a>
      </p>

      <div class="file-buttons">
    <base-button v-for="file in request.files" :key="file.id" @click="downloadFile(file.id)">
      {{ file.name }}
    </base-button>
  </div>

      <hr class="request-divider" />

      <!-- Comments -->
      <p v-if="!request.comments.length">No Comments...</p>
      <div v-else class="request-comment-list" ref="commentList">
        <p
          v-for="(comment, index) in request.comments"
          :key="getCommentKey(comment, index)"
          class="request-comment"
          :class="{
            'comment-received': comment.userId !== appStore.userId,
            'comment-sent': comment.userId === appStore.userId
          }"
        >
          {{ comment.text }}
        </p>
      </div>

      <!-- Comment Form -->
      <form class="comment-form" @submit.prevent="submitComment">
        <div class="form-group">
          <input
            type="text"
            class="comment-input"
            placeholder="New Comment..."
            v-model.trim="commentMessage"
          />
          <button type="submit" class="comment-submit">Send</button>
        </div>
      </form>
    </div>
  </base-card>
</template>

<script>
import { useRequestStore } from '../stores/RequestStore'
import { useAppStore } from '../stores/AppStore'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      commentMessage: '',
      request: null
    }
  },
  created() {
    // Fetch request data
    this.isLoading = true
    this.requestStore
      .requestById(this.$route.params.id)
      .then((req) => {
        this.request = req
        this.errorMessage = ''
        this.isLoading = false
        console.log(this.request)
      })
      .catch((error) => {
        this.errorMessage = !error || error === '' ? new Error('Failed to fetch request') : error
        this.isLoading = false
        console.log(this.errorMessage)
      })
  },
  computed: {
    ...mapStores(useRequestStore),
    ...mapStores(useAppStore),
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'Could not load request.'
    }
  },
  mounted() {
    // Scroll to the bottom of the comment list
    this.scrollToBottom()
  },
  watch: {
    'request.comments'(newComments) {
      // Scroll to the bottom of the comment list when new comments are added
      this.scrollToBottom()
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
          link.download = fileName.slice(1,-1) // Get the file name from the response header
          link.click()
        })
        .catch((error) => {
          console.error(error)
          // Handle the error if necessary
        })
    },
    submitComment() {
      if (this.commentMessage) {
        console.log(this.commentMessage)

        // Create new comment
        const payload = {
          text: this.commentMessage,
          requestId: Number(this.$route.params.id)
        }
        this.requestStore.createComment(payload)

        // Scroll to the bottom of the comment list and clear the input
        this.scrollToBottom()
        this.commentMessage = null
      }
    },
    getCommentKey(comment, index) {
      return comment.id !== null ? comment.id : `temp-${index}`
    },
    getCommentBackgroundColor(comment) {
      console.log(comment.userId)
      if (!comment) return 'lightgrey'
      if (comment.userId === this.appStore.userId) {
        return 'lightblue'
      } else {
        return 'lightgrey'
      }
    },
    scrollToBottom() {
      // Scroll to the bottom of the comment list
      this.$nextTick(() => {
        const commentList = this.$refs.commentList
        commentList.scrollTop = commentList.scrollHeight
      })
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

.file-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.file-buttons > base-button {
  padding: 8px 16px;
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
  width: 15em;
  flex-direction: column; /* Updated: Change flex-direction to column */
}

.request-property {
  font-weight: bold;
  margin-right: 5px;
  align-self: flex-start;
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

.request-comment-list {
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

.request-comment {
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
