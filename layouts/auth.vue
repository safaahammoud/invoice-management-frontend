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
        <nuxt-link to="/signup" >Sign up now</nuxt-link> |
        <nuxt-link to="/login" >login</nuxt-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.login-wrapper {
  padding: 1rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top left, $burgundy-dark, $burgundy-light);
  
  .v-card {
    height: 90%;
  }
}

@media screen and (min-width: 767px) {
  .login-wrapper {
    .v-card {
      height: 60%;
    }
  }
}
</style>