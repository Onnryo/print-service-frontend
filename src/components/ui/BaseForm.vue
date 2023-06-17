<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Processing..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <slot></slot>
        <p v-if="!formIsValid">{{ formInvalidMessage }}</p>
        <slot name="actions">
          <base-button>{{ submitButtonCaption }}</base-button>
          <base-button type="button" mode="flat" @click="switchAuthMode">{{
            switchModeButtonCaption
          }}</base-button>
        </slot>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
    data() {
    return {
      username: '',
      email: '',
      password: '',
      repassword: '',
      formIsValid: true,
      formInvalidMessage: '',
      mode: 'login',
      isLoading: false,
      error: null
    }
  },
  computed: {
    //...mapStores(useAppStore),
    isEmailVisible() {
      return this.mode === 'signup' || this.mode === 'forgotPass'
    },
    isRepassVisible() {
      return this.mode === 'signup'
    },
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'Login'
      } else {
        return 'Signup'
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'Signup instead'
      } else {
        return 'Login instead'
      }
    }
  },
  methods: {
    async submitForm() {
      this.formIsValid = true
      this.formInvalidMessage = ''

        // ...Form validation (passed by props?)

      this.isLoading = true

      try {
        // ...Connect to DB
        }
      } catch (err) {
        this.error = err.message || 'Failed to authenticate, try later.'
      }

      this.isLoading = false
    },
    clearForm() {

    },
    handleError() {
      this.error = null
    }
  }
}
}
</script>
<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
<style scoped></style>
