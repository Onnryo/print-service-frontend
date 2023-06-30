<template>
  <base-card>
    <h1>Users</h1>
    <section>
      <div class="filters">
        <input
          v-model="filterText"
          type="text"
          placeholder="Search by username"
          class="filter-input"
        />
        <select v-model="filterRole" class="role-dropdown">
          <option value="">All</option>
          <option v-for="roleOption in roleOptions" :value="roleOption">
            {{ roleOption }}
          </option>
        </select>
        <!-- Add unassigned and request title filter -->
      </div>
      <base-spinner v-if="isLoading"></base-spinner>
      <div v-else>
        <div class="user-list" v-if="hasFilteredUsers">
          <div
            class="user-card"
            v-for="user in filteredUsers"
            :key="user.id"
            @click="showUserDetails(user.id)"
          >
            <div class="user-header">
              <h2 class="user-title">{{ user.username }}</h2>
              <p class="user-id">{{ user.id }}</p>
            </div>
          </div>
        </div>
        <p v-else>{{ messageContents }}</p>
      </div>
    </section>
  </base-card>
</template>
<script>
import { useUserStore } from '../stores/UserStore'
import { useAppStore } from '../stores/AppStore'
import { mapStores } from 'pinia'

export default {
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      filterText: '',
      filterRole: ''
      // Add more filter properties for other properties as needed
    }
  },
  created() {
    if (this.appStore.role !== 'ADMIN') {
      this.$router.replace(`/users/${this.appStore.userId}`)
      return
    }
    this.isLoading = true
    this.userStore
      .fetchUsers()
      .then(() => {
        this.errorMessage = ''
        this.isLoading = false
      })
      .catch((error) => {
        this.errorMessage = error || 'Failed to fetch users'
        this.isLoading = false
      })
  },
  computed: {
    ...mapStores(useAppStore),
    ...mapStores(useUserStore),
    roleOptions() {
      return this.userStore.role;
    },
    filteredUsers() {
      return this.userStore.filteredUsers(this.filterText, this.filterRole);
    },
    hasFilteredUsers() {
      return this.filteredUsers.length > 0
    },
    messageContents() {
      return this.errorMessage ? this.errorMessage : 'You have not submitted any users!'
    }
  },
  methods: {
    showUserDetails(userId) {
      this.$router.push(`/users/${userId}`)
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

.role-dropdown {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 14px;
  outline: none;
  background-color: #fff;
  color: #333;
}

.user-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 0;
}

.user-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.3s;
}

.user-card:hover {
  transform: scale(1.02);
  background-color: rgba(0, 0, 0, 0.05);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.user-title {
  font-size: 20px;
  font-weight: bold;
}

.user-id {
  font-weight: bold;
  color: #888;
}

.user-body {
  margin-bottom: 10px;
}

.user-details {
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
