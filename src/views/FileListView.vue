<template>
  <base-card>
    <h1>Files</h1>
    <section>
      <div class="filters">
        <input
          v-model="filterText"
          type="text"
          placeholder="Search by title"
          class="filter-input"
        />
        <!-- Add unassigned and request title filter -->
      </div>
      <base-spinner v-if="isLoading"></base-spinner>
      <div v-else>
        <div class="file-list" v-if="filteredfiles.length">
          <div
            class="file-card"
            v-for="file in filteredfiles"
            :key="file.id"
            @click="showfileDetails(file.id)"
          >
            <div class="file-header">
              <h2 class="file-title">{{ file.name }}</h2>
              <p class="file-status">{{ file.requestId }}</p>
            </div>
          </div>
        </div>
        <p v-else>{{ messageContents }}</p>
      </div>
    </section>
  </base-card>
</template>

<script>
import { useFileStore } from '../stores/FileStore'
import { mapStores } from 'pinia'

export default {
  data() {
    return {
      isAdmin: false,
      isLoading: false,
      errorMessage: '',
      filterText: '',
      filterStatus: ''
      // Add more filter properties for other properties as needed
    }
  },
  created() {
    this.isLoading = true
    this.fileStore
      .fetchfiles()
      .then(() => {
        this.errorMessage = ''
        this.isLoading = false
      })
      .catch((error) => {
        this.errorMessage = !error || error === '' ? new Error('Failed to fetch files') : error
        this.isLoading = false
        console.log(!this.filteredfiles.length)
      })
  },
  computed: {
    ...mapStores(useFileStore),
    filteredfiles() {
      const filterTextLower = this.filterText.toLowerCase()
      // Add more filter properties for other properties as needed

      return this.fileStore.files.filter((file) => {
        const titleMatch = !this.filterText || file.name.toLowerCase().includes(filterTextLower)
        // Add more filter conditions for other properties as needed

        return titleMatch // Add more filter conditions as needed
      })
    },
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'You have not submitted any files!'
    }
  },
  methods: {
    showfileDetails(fileId) {
      this.$router.push(`/files/${fileId}`)
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
  margin-bottom: 20px;
}

.filters {
  margin-bottom: 10px;
}

.filter-input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 14px;
  outline: none;
}

.status-dropdown {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 14px;
  outline: none;
  background-color: #fff;
  color: #333;
}

.file-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 0;
}

.file-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.3s;
}

.file-card:hover {
  transform: scale(1.02);
  background-color: rgba(0, 0, 0, 0.05);
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.file-title {
  font-size: 20px;
  font-weight: bold;
}

.file-status {
  font-weight: bold;
  color: #888;
}

.file-body {
  margin-bottom: 10px;
}

.file-details {
  margin-bottom: 10px;
}

.new-comment-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff0000;
}

.label {
  font-weight: bold;
}
</style>
