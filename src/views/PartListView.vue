<template>
  <base-card>
    <h1>All Parts</h1>
    <section>
      <div class="filters">
        <input v-model="filterText" type="text" placeholder="Search by title" class="filter-input">
        <select v-model="filterStatus" class="status-dropdown">
          <option value="">All</option>
          <option v-for="statusOption in statusOptions" :value="statusOption">{{ statusOption }}</option>
        </select>
        <!-- Add more filter inputs for other properties as needed -->
      </div>
      <base-spinner v-if="isLoading"></base-spinner>
      <div v-else>
        <div class="part-list" v-if="filteredParts.length">
          <div class="part-card" v-for="part in filteredParts" :key="part.id" @click="showPartDetails(part.id)">
            <div class="part-header">
              <h2 class="part-title">{{ part.title }}</h2>
              <p class="part-status">{{ part.status }}</p>
            </div>
            <p class="part-notes">{{ truncateText(part.notes, 100) }}</p>
            <div class="part-details">
              <p><span class="label">Estimated Cost:</span> ${{ calculateEstimatedCost(part) }}</p>
              <p><span class="label">Estimated Time:</span> {{ part.eta }}</p>
            </div>
          </div>
        </div>
        <p v-else>{{ messageContents }}</p>
      </div>
    </section>
  </base-card>
</template>

<script>
import { useAppStore } from '../stores/AppStore'
import { usePartStore } from '../stores/PartStore'
import { mapStores } from 'pinia'

export default {
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      filterText: '',
      filterStatus: ''
      // Add more filter properties for other properties as needed
    }
  },
  created() {
    this.isLoading = true
    this.fetchPartData()
  },
  computed: {
    ...mapStores(useAppStore),
    ...mapStores(usePartStore),
    isAdmin() {
      return this.appStore.role === 'ADMIN'
    },
    statusOptions() {
      return this.partStore.status
    },
    filteredParts() {
      const filterTextLower = this.filterText.toLowerCase();
      const filterStatusLower = this.filterStatus.toLowerCase();
      // Add more filter properties for other properties as needed

      return this.partStore.parts.filter((part) => {
        const titleMatch = !this.filterText || part.title.toLowerCase().includes(filterTextLower);
        const statusMatch = !this.filterStatus || part.status.toLowerCase() === filterStatusLower;
        // Add more filter conditions for other properties as needed

        return titleMatch && statusMatch; // Add more filter conditions as needed
      });
    },
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'You have not submitted any parts!'
    }
  },
  methods: {
    truncateText(text, length) {
      if (text.length <= length) {
        return text;
      } else {
        return text.substr(0, length) + '...';
      }
    },
    showPartDetails(partId) {
      this.$router.push(`/parts/${partId}`);
    },
    calculateEstimatedCost(part) {
      return (part.cost * part.quantity).toFixed(2);
    },
    fetchPartData() {
      this.partStore.fetchParts()
        .then(() => {
          this.errorMessage = '';
          this.isLoading = false;
        })
        .catch((error) => {
          this.errorMessage = error || 'Failed to fetch parts';
          this.isLoading = false;
        });
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
