<template>
    <v-app>
        <div
            prominent
            class="nav-bar"
        >
            <v-icon icon="mdi-cash-multiple" />

            <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-avatar color="grey">
                            <v-icon icon="mdi-account-circle"></v-icon>
                        </v-avatar>
                    </v-btn>
                </template>

                <v-card>
                    <v-card-text>
                        <div class="mx-auto text-center">
                            <v-avatar color="red">
                                <v-icon icon="mdi-account-circle"></v-icon>
                            </v-avatar>

                            <h3>{{ user.email }}</h3>
                        
                            <v-divider class="my-3"></v-divider>

                            <v-btn
                                @click="logout"
                                variant="text"
                                rounded
                            >
                                Logout
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-menu>
        </div>

        <slot />
    </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';

const { logoutUser } = useAuthStore();
const router = useRouter();
const username = useCookie('username');
const user = computed(() => ({
    email: username.value || ''
}))

const logout = async () => {
    await logoutUser();

    router.push({ name: 'login' })
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.nav-bar {
    display: flex;
    padding: 1rem;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to top left, $burgundy-dark, $burgundy-light);
}
</style>