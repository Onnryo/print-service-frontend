<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: String,
      required: false,
      default: '/'
    }
  }
}
</script>

<style scoped>
button,
a {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #0088cc; /* Darker blue background color */
  color: #ffffff; /* White text color */
  text-decoration: none;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: #0066cc; /* Lighter blue background color on hover */
  border-color: #270041;
}

.flat {
  background-color: transparent;
  color: #3a0061;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #270041;
  color: #270041;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #edd2ff;
}
</style>
