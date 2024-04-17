<template>
  <v-form
    :model-value="isFormValid"
    @update:model-value="updateValidity"
    @submit.prevent="validateForm"
  >
    <v-text-field
      v-model="formValue.username"
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
      :loading="false"
      block
    >
      Log In
    </v-btn>
  </v-form>
</template>
  
<script setup lang="ts">
import regexExpressions from '@/consts/regex-expressions.const';
import { useAuthStore } from '@/store/auth';
import type { FieldErrorAPI } from '@/types/field-error.type';

definePageMeta({
  layout: 'auth',
  requiresAuth: false,
});

const router = useRouter();
const loginForm = ref();
const visible = ref<boolean>(false);
const formValue = ref({
  username: '',
  password: '',
});
const validationRules = ref({
  required: (value: any) => !!value || 'Field is required',
  email: (v: string) => (!v?.trim() || regexExpressions.EMAIL.test(v)) || 'Field must be an email',
});

const isFormValid = ref(false);

const updateValidity = (isValid: boolean | null) => isFormValid.value = Boolean(isValid);

const showSnackbar = ref(false);
const errors = ref<FieldErrorAPI[]>([]);
const { authenticateUser } = useAuthStore();
const { isAuthenticated } = storeToRefs(useAuthStore())

const validateForm = async () => {
  if(isFormValid) {
    const { username, password } = formValue.value;

    await authenticateUser({ username, password });

    if(isAuthenticated.value) {
      router.push('/invoices');
    }
  }
};
</script>
