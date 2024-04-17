<template>
  <v-form ref="signupFormRef" @submit.prevent="validateForm">
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

    <v-text-field
      v-model="formValue.password"
      :rules="[
          validationRules.required,
      ]"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
    />

    <v-text-field
      v-model="formValue.confirmPassword"
      :rules="[
          validationRules.required,
      ]"
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
      color="primary"
      size="large"
      variant="tonal"
      block
      type="submit"
      :loading="fetching"
    >
      Sign up
    </v-btn>
  </v-form>

  <v-snackbar
      v-model="showSnackbar"
      multi-line
    >
      <ul
        v-for="error in errors"
        :key="error.field"
      >
        <li>{{ error.message }}</li>
      </ul>

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>
  
<script setup lang="ts">
import { gql, useMutation } from '@urql/vue';

import regexExpressions from '@/consts/regex-expressions.const';
import type { FieldErrorAPI } from '@/types/field-error.type';

definePageMeta({
  layout: 'auth'
});

const router = useRouter();
const signupFormRef = ref();
const showSnackbar = ref(false);
const visible = ref<boolean>(false);
const errors = ref<FieldErrorAPI[]>([]);
const REGISTER_MUT = gql`
  mutation ($createUserInput: CreateUserInput!) {
    registerUser(createUserInput: $createUserInput) {
      errors {
        field,
        message,
      },
      user {
        id
      }
    }
  }
`
const { executeMutation: signUpUser, fetching } = useMutation(REGISTER_MUT);
const formValue = ref({
  username: '',
  password: '',
  confirmPassword: '',
});
const validationRules = ref({
  required: (value: any) => !!value || 'Field is required',
  email: (v: string) => (!v?.trim() || regexExpressions.EMAIL.test(v)) || 'Field must be an email',
});

const validateForm = async () => {
  const { valid: isFormValid } = await signupFormRef.value.validate();

  if(isFormValid) {
      const { username, password } = formValue.value;

      const finalresult = await signUpUser({
        createUserInput: {
          username,
          password,
        }})      
        
      if(finalresult.data?.registerUser?.errors?.length) {
        errors.value = finalresult.data?.registerUser?.errors;

        showSnackbar.value = true;
      } else if(finalresult.data?.registerUser?.user) {
        router.push('/invoices');
      }
  }
};
</script>