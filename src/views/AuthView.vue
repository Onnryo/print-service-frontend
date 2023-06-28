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
          <FormKit type="text" id="username" v-model.trim="username" />
        </div>
        <div class="form-control" v-show="isEmailVisible">
          <label for="email">E-Mail</label>
          <FormKit type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <FormKit type="password" id="password" v-model.trim="password" />
        </div>
        <div class="form-control" v-show="isRepassVisible">
          <label for="repassword">Re-enter Password</label>
          <FormKit type="password" id="repassword" v-model.trim="repassword" />
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
      return this.mode === 'login' ? 'Login' : 'Signup'
    },
    switchModeButtonCaption() {
      return this.mode === 'login' ? 'Signup instead' : 'Login instead'
    },
    isUsernameValid() {
      const usernameRegex = new RegExp(/.{5,}$/, 'gm')
      return usernameRegex.test(this.username)
    },
    isValidEmail() {
      const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm')
      return emailRegex.test(this.email)
    },
    isValidPassword() {
      const passwordRegex = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+{}|\\"',./<>?[\]:;`=-])[A-Za-z\d~!@#$%^&*()_+{}|\\"',./<>?[\]:;`=-]{8,}$/,
        'gm'
      )
      return passwordRegex.test(this.password)
    }
  },
  methods: {
    async submitForm() {
      this.formIsValid = true
      this.formInvalidMessage = ''

      const isLoginMode = this.mode === 'login'
      const isSignupMode = this.mode === 'signup'
      const isForgotPassMode = this.mode === 'forgotPass'

      if (isLoginMode && (this.username === '' || this.password === '')) {
        this.formIsValid = false
        this.formInvalidMessage = 'Invalid Username or Password!'
        return
      }

      if (isSignupMode && !this.isUsernameValid) {
        this.formIsValid = false
        this.formInvalidMessage = 'Username must be at least 5 characters!'
        return
      }

      if ((isSignupMode || isForgotPassMode) && !this.isValidEmail) {
        this.formIsValid = false
        this.formInvalidMessage = 'Invalid Email!'
        return
      }

      if (isSignupMode && !this.isValidPassword) {
        this.formIsValid = false
        this.formInvalidMessage =
          'Password must be 8 characters long with at least one uppercase, one lowercase, one number and one special character.'
        return
      }

      if (isSignupMode && this.password !== this.repassword) {
        this.formIsValid = false
        this.formInvalidMessage = 'Passwords do not match!'
        return
      }

      this.isLoading = true

      const actionPayload = {
        username: this.username,
        email: this.email,
        password: this.password
      }

      try {
        if (isLoginMode) {
          await this.appStore.login(actionPayload)
          const redirectUrl = '/' + (this.$route.query.redirect || '')
          this.$router.replace(redirectUrl)
        } else {
          await this.appStore.signup(actionPayload)
          this.clearForm()
          this.switchAuthMode()
        }
      } catch (err) {
        this.error = err.message || 'Failed to authenticate, try later.'
      }

      this.isLoading = false
    },
    clearForm() {
      this.username = ''
      this.email = ''
      this.password = ''
      this.repassword = ''
    },
    switchAuthMode() {
      this.mode = this.mode === 'login' ? 'signup' : 'login'
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
