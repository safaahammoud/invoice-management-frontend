<template>
    <v-app>
        <div class="nav-bar">
            <v-icon icon="mdi-cash-multiple" />

            <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-avatar color="red" size="large">
                            <span class="text-h5">{{ user.initials }}</span>
                        </v-avatar>
                    </v-btn>
                </template>

                <v-card>
                    <v-card-text>
                        <div class="mx-auto text-center">
                            <v-avatar color="red">
                                <span class="text-h5">{{ user.initials }}</span>
                            </v-avatar>

                            <h3>{{ user.fullName }}</h3>

                            <p class="text-caption mt-1">
                                {{ user.email }}
                            </p>
                          
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
const user = computed(() => ({ //TODO: Add getCurrentUser query
    initials: 'N/A',
    fullName: '',
    email: ''
}))

const logout = async () => {
    await logoutUser();

    router.push({ name: 'login' })
}
</script>

<style scoped>
.nav-bar {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
}
</style>