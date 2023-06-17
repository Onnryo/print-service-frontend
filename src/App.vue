<template>
  <the-header></the-header>
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue';
import { useAppStore } from './stores/AppStore'
import { mapStores } from 'pinia'

export default {
  components: {
    TheHeader
  },
  created() {
    this.appStore.reauth()
  },
  computed: {
    ...mapStores(useAppStore),
    isAuth() {
      return this.appStore.isAuthenticated
    }
  },
  watch: {
    isAuth(curValue, oldValue) {
      if (!curValue && curValue !== oldValue) {
        this.$router.replace('/auth');
      }
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
  background-color: #f8f8f8; /* Off-white background color */
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>