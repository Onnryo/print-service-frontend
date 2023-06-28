<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Submitting..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <FormKit
      type="form"
      id="request-creation"
      :form-class="submitted ? 'hide' : 'show'"
      submit-label="Submit"
      @submit="submitForm"
      :actions="false"
      #default="{ value }"
    >
      <h1>New Request!</h1>
      <hr />
      <FormKit
        type="text"
        name="title"
        label="Title"
        placeholder=""
        validation="required"
        v-model="title"
      />
      <FormKit
        type="textarea"
        name="body"
        label="Body"
        placeholder=""
        help="Describe your request. Include details of filament color, scaling adjustments, etc."
        validation="required"
        v-model="body"
      />
      <FormKit
        type="text"
        name="link"
        label="Link"
        placeholder="(optional)"
        help="Please provide link where you downloaded files from. Often it contians crucial instructions for printing and will make both our lives easier :)"
        v-model="link"
      />
      <FormKit
        type="file"
        label="Files"
        accept=".zip,.stl"
        multiple="true"
        validation="required"
        v-model="files"
      />

      <FormKit type="submit" label="Register" />
    </FormKit>
    <div v-if="submitted">
      <h2>Submission successful!</h2>
    </div>
  </div>
</template>

<script>
import { useRequestStore } from '../stores/RequestStore'
import { useAppStore } from '../stores/AppStore'
import { mapStores } from 'pinia'

export default {
  data() {
    return {
      title: '',
      body: '',
      link: '',
      files: null,
      submitted: false,
      isLoading: false,
      error: null
    }
  },
  computed: {
    ...mapStores(useRequestStore),
    ...mapStores(useAppStore)
  },
  methods: {
    async submitForm() {
      this.isLoading = true

      const actionPayload = {
        title: this.title,
        body: this.body,
        link: this.link,
        files: this.files
      }

      try {
        await this.requestStore.createRequest(actionPayload)
        const redirectUrl = '/' + (this.$route.query.redirect || '')
        this.$router.replace(redirectUrl)
      } catch (err) {
        this.error = err.message || 'Failed to submit request.'
      }

      this.isLoading = false
    },
    handleError() {
      this.error = null
    }
  }
}
</script>

<style scoped>
h1 {
  margin-top: 0;
}
hr {
  display: block;
  height: 1px;
  margin: 1.5em 0;
  border: 0;
  background-color: #e4e4e4;
}
.formkit-form {
  padding: 1.5em;
  border: 1px solid #e4e4e4;
  border-radius: 1em;
  margin: 1em;
}
.hide {
  display: none;
}
.formkit-input {
  /* Apply the desired styling for the input fields */
  /* For example: */
  border: 1px solid #e4e4e4;
  padding: 0.5em;
  margin: 0.5em 0;
}
</style>
