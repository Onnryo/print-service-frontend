<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="username">Username</label>
          <input type="text" id="username" v-model.trim="username" />
        </div>
        <div class="form-control" v-if="isEmailVisible">
          <label for="email">E-Mail</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <div class="form-control" v-if="isRepassVisible">
          <label for="repassword">Re-enter Password</label>
          <input type="password" id="repassword" v-model.trim="repassword" />
        </div>
        <p v-if="!formIsValid">{{ formInvalidMessage }}</p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{
          switchModeButtonCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
import { useAppStore } from '../stores/AppStore'
import { mapStores } from 'pinia'

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
    ...mapStores(useAppStore),
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

      // TODO: On blur of username input, send request to db to check if username is available and display invalid if not

      const usernameRegex = new RegExp(/.{5,}$/, 'gm')
      const isUsernameValid = usernameRegex.test(this.username)
      const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm')
      const isValidEmail = emailRegex.test(this.email)
      const passwordRegex = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+{}|\\"',./<>?[\]:;`=-])[A-Za-z\d~!@#$%^&*()_+{}|\\"',./<>?[\]:;`=-]{8,}$/,
        'gm'
      )
      const isValidPassword = passwordRegex.test(this.password)

      if (this.mode === 'login') {
        if (this.username === '' || this.password === '') {
          this.formIsValid = false
          this.formInvalidMessage = 'Invalid Username or Password!'
          return
        }
      } else if (this.mode === 'signup') {
        if (!isUsernameValid) {
          this.formIsValid = false
          this.formInvalidMessage = 'Username must be at least 5 characters!'
          return
        }
        if (!isValidEmail) {
          this.formIsValid = false
          this.formInvalidMessage = 'Invalid Email!'
          return
        }
        if (!isValidPassword) {
          this.formIsValid = false
          this.formInvalidMessage =
            'Password must be 8 characters long with at least one uppercase, one lowercase, one number and one special character.'
          return
        } else if (this.password !== this.repassword) {
          this.formIsValid = false
          this.formInvalidMessage = 'Passwords do not match!'
          return
        }
      } else if (this.mode === 'forgotPass') {
        if (!isValidEmail) {
          this.formIsValid = false
          this.formInvalidMessage = 'Invalid Email!'
          return
        }
      }

      this.isLoading = true

      const actionPayload = {
        username: this.username,
        email: this.email,
        password: this.password
      }

      try {
        if (this.mode === 'login') {
          await this.appStore.login(actionPayload)
        } else {
          await this.appStore.signup(actionPayload)
        }
        const redirectUrl = '/' + (this.$route.query.redirect || '')
        this.$router.replace(redirectUrl)
      } catch (err) {
        this.error = err.message || 'Failed to authenticate, try later.'
      }

      this.isLoading = false
    },
    switchAuthMode() {
      if (this.mode === 'login') {
        this.mode = 'signup'
      } else {
        this.mode = 'login'
      }
    },
    handleError() {
      this.error = null
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
