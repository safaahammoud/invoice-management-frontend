<template>
  <v-form ref="loginForm">
    <v-text-field
      v-model="formValue.email"
      :rules="[
          validationRules.required,
          validationRules.email,
      ]"
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      type="email"
    />

    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
      Password

      <a
        class="text-caption text-decoration-none text-blue"
        href="#"
        rel="noopener noreferrer"
        target="_blank"
      >
        Forgot login password?</a>
    </div>

    <v-text-field
      v-model="formValue.password"
      :rules="[validationRules.required]"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
    />

    <v-btn
      class="mb-8"
      color="blue"
      size="large"
      variant="tonal"
      type="submit"
      block
      @click="validateForm"
    >
      Log In
    </v-btn>
  </v-form>
</template>
  
<script setup lang="ts">
import regexExpressions from '@/consts/regex-expressions.const';

definePageMeta({
  layout: 'auth'
});
const loginForm = ref();
const visible = ref<boolean>(false);
const formValue = ref({
  email: '',
  password: '',
});
const validationRules = ref({
  required: (value: any) => !!value || 'Field is required',
  email: (v: string) => (!v?.trim() || regexExpressions.EMAIL.test(v)) || 'Field must be an email',
});

const validateForm = () => {
  const { valid:isFormValid } = loginForm.value.validate();

  if(isFormValid) {
      //TODO: api request here
  }
};
</script>
