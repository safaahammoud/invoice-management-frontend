<template>
    <v-app>
        <div class="nav-bar">
            navbar

            <nuxt-link to="/login">Login</nuxt-link>
            <nuxt-link to="/signup">sign up</nuxt-link>
            <nuxt-link to="/invoices">invoices</nuxt-link>
        </div>

        <slot />
    </v-app>
</template>

<script setup lang="ts">

</script>
<style scoped>
.nav-bar {
    display: flex;
    justify-content: space-around;
}
</style>