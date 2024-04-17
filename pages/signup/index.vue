<template>
  <v-form
    ref="signupFormRef"
    @submit.enter.prevent="validateForm"
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
      @paste.prevent
      @blur="checkPasswordMatch(
        formValue.password,
        formValue.confirmPassword,
      )"
      @click:append-inner="visible = !visible"
    />

    <span>{{ label }}</span>  

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
</template>
  
<script setup lang="ts">
import { gql, useMutation } from '@urql/vue';

import regexExpressions from '@/consts/regex-expressions.const';
import { useSnackBarStore } from '@/store/snack-bar-store';
import type { FieldErrorAPI } from '@/types/field-error.type';
import passwordValidations from '@/utils/password-validations.util';

definePageMeta({
  layout: 'auth'
});

const { showSnackbar } = useSnackBarStore();
const router = useRouter();
const signupFormRef = ref();
const visible = ref<boolean>(false);
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
  passwordComplexity: (password: string) => {
    const {
      hasMinChars,
      hasDigit,
      hasLowercase,
      hasSpecialChar,
      hasUppercase,
    } = passwordValidations;

    if (!hasMinChars(password)) {
        return 'Password must be at least 8 characters';
    } else if (!hasDigit(password)) {
      return 'Password must contain at least one digit';
    } else if (!hasLowercase(password)) {
      return 'Password must contain at least one lowercase character';
    } else if (!hasSpecialChar(password)) {
      return 'Password must contain at least one special character';
    } else if(!hasUppercase(password)) {
      return 'Password must contain at least one uppercase character';
    }

    return '';
  }
});
const label = ref('');
//TODO: Add on blur
const checkPasswordMatch = (password: string, confirmPassword: string) => {
  const areIdentical = passwordValidations.arePasswordsIdentical(password, confirmPassword);

  if(areIdentical) {
    label.value = '';
  } else {
    label.value = 'Passwords do not match';
  }
}

const clearForm = () => {
  formValue.value = {
    username: '',
    password: '',
    confirmPassword: '',
  }
}

const validateForm = async () => {
  const { valid: isFormValid } = await signupFormRef.value.validate();
  
  const arePasswordsIdentical = passwordValidations.arePasswordsIdentical(
    formValue.value.password,
    formValue.value.confirmPassword,
  );


  if(isFormValid && arePasswordsIdentical) {
      const { username, password } = formValue.value;

      const finalresult = await signUpUser({
        createUserInput: {
          username,
          password,
        }})      
        
      const data = finalresult.data?.registerUser;

      if(data?.errors?.length) {
        const formattedErrorMessage = (data?.errors as FieldErrorAPI[]).join('\n');

        showSnackbar(formattedErrorMessage);
      } else if(data?.user) {
        showSnackbar('User created successfully')
        clearForm();

        router.push('/invoices');
      }
  } else {
    showSnackbar('form is not valid')
  }
};
</script>