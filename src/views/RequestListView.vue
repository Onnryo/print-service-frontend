<template>
  <base-card>
    <h1>{{ isAdmin ? 'User Requests' : 'My Requests' }}</h1>
    <section>
      <div class="filters">
        <input
          v-model="filterText"
          type="text"
          placeholder="Search by title"
          class="filter-input"
        />
        <select v-model="filterStatus" class="status-dropdown">
          <option value="">All</option>
          <option v-for="statusOption in statusOptions" :value="statusOption">
            {{ statusOption }}
          </option>
        </select>
        <!-- Add more filter inputs for other properties as needed -->
      </div>
      <base-spinner v-if="isLoading"></base-spinner>
      <div v-else>
        <div class="request-list" v-if="filteredRequests.length">
          <div
            class="request-card"
            v-for="request in filteredRequests"
            :key="request.id"
            @click="showRequestDetails(request.id)"
          >
            <div class="request-header">
              <h2 class="request-title">{{ request.title }}</h2>
              <p class="request-status">{{ request.status }}</p>
            </div>
            <p class="request-body">{{ truncateText(request.body, 100) }}</p>
            <div class="request-details">
              <p><span class="label">Estimated Cost:</span> {{ request.estimated_cost }}</p>
              <p><span class="label">Estimated Time:</span> {{ request.estimated_time }}</p>
            </div>
            <div class="new-comment-indicator" v-if="request.hasNewComment"></div>
          </div>
        </div>
        <p v-else>{{ messageContents }}</p>
      </div>
    </section>
  </base-card>
</template>

<script>
import { useAppStore } from '../stores/AppStore'
import { useRequestStore } from '../stores/RequestStore'
import { mapStores } from 'pinia'

export default {
  data() {
    return {
      isLoading: false,
      filterText: '',
      filterStatus: ''
      // Add more filter properties for other properties as needed
    }
  },
  created() {
    this.isLoading = true;
    this.requestStore.fetchRequests()
      .finally(() => {
        this.isLoading = false;
      });
  },
  computed: {
    ...mapStores(useAppStore),
    ...mapStores(useRequestStore),
    isAdmin() {
      return this.appStore.role === 'ADMIN'
    },
    statusOptions() {
      return this.requestStore.status;
    },
    filteredRequests() {
      return this.requestStore.filteredRequests(this.filterText, this.filterStatus);
    },
    messageContents() {
      return this.requestStore.error ? this.requestStore.error : 'You have not submitted any requests!';
    }
  },
  methods: {
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
