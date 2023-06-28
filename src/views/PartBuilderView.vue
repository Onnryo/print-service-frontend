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
      id="part-creation"
      :form-class="submitted ? 'hide' : 'show'"
      submit-label="Submit"
      @submit="submitForm"
      :actions="false"
      #default="{ value }"
    >
      <h1>New Part!</h1>
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
        name="notes"
        label="Notes"
        placeholder="(optional)"
        help="Please provide filament and print settings."
        v-model="notes"
      />
      <FormKit
        type="number"
        name="quantity"
        label="Quantity"
        placeholder="1"
        validation="required"
        v-model="quantity"
      />
      <FormKit
        type="number"
        name="cost"
        label="Estimated Cost"
        placeholder="0.00"
        :step="0.01"
        :precision="2"
        help="Total cost for n count."
        v-model="cost"
      />
      <FormKit type="number" name="hours" label="Hours" placeholder="0" v-model="hours" />
      <FormKit type="number" name="minutes" label="Minutes" placeholder="0" v-model="minutes" />

      <FormKit type="submit" label="Create" />
    </FormKit>
    <div v-if="submitted">
      <h2>Part Creation Successful!</h2>
    </div>
  </div>
</template>

<script>
import { usePartStore } from '../stores/PartStore'
import { useFileStore } from '../stores/FileStore'
import { useAppStore } from '../stores/AppStore'
import { mapStores } from 'pinia'

export default {
  data() {
    return {
      file: null,
      title: '',
      notes: '',
      cost: null,
      hours: null,
      minutes: null,
      quantity: 1,
      submitted: false,
      isLoading: false,
      error: null
    }
  },
  computed: {
    ...mapStores(usePartStore),
    ...mapStores(useFileStore),
    ...mapStores(useAppStore),
    eta() {
      let eta = null
      if (!!this.hours && !!this.minutes) eta = this.hours + ':' + this.minutes
      else if (!!this.hours && !this.minutes) eta = this.hours + ':00'
      else if (!this.hours && !!this.minutes) eta = '00:' + this.minutes
      return eta
    }
  },
  created() {
    this.isLoading = true
    this.fileStore
      .fileById(this.$route.params.id)
      .then((req) => {
        this.file = req
        const fileName = this.file.name
        const fileNameWithoutExtension = fileName.includes('.')
          ? fileName.split('.').slice(0, -1).join('.')
          : fileName
        this.title = fileNameWithoutExtension
        this.errorMessage = ''
        this.isLoading = false
      })
      .catch((error) => {
        this.errorMessage = !error || error === '' ? new Error('Failed to fetch file') : error
        this.isLoading = false
        console.log(this.errorMessage)
      })
  },
  methods: {
    async submitForm() {
      this.isLoading = true

      const actionPayload = {
        title: this.title,
        notes: this.notes,
        cost: this.cost,
        eta: this.eta,
        quantity: this.quantity,
        file: this.file
      }

      try {
        await this.partStore.createPart(actionPayload)
        const redirectUrl = `/${this.$route.query.redirect || 'files/' + this.$route.params.id}`
        this.$router.replace(redirectUrl)
      } catch (err) {
        this.error = err.message || 'Failed to create part.'
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
  margin: 1em 1em 1em 1em;
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
