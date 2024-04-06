<template>
  <div class="login-wrapper">
    <v-card
      class="pa-12 pb-8"
      elevation="8"
      width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>
      
      <slot />

      <v-card-text class="text-center">  
        <nuxt-link v-if="currentRouteName === 'login'" to="/signup" >Sign up now</nuxt-link>
        <nuxt-link v-else-if="currentRouteName === 'signup'" to="/login" >login</nuxt-link>

        <v-icon icon="mdi-chevron-right"></v-icon>
      </v-card-text>
    </v-card>
  </div>
</template>
  
<script setup lang="ts">
const { name: currentRouteName } = useRoute();
</script>
  
<style scoped>
.login-wrapper {
  padding: 1rem;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10rem;
}
</style>