<template>
    <v-snackbar
        v-model="show"
        :timeout="timeoutInMilliSeconds"
        multi-line
    >
        {{ message }}

        <template v-slot:actions>
            <v-btn
                color="red"
                variant="text"
                @click="show = false"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackBarStore } from '@/store/snack-bar-store';

const { show, message } = storeToRefs(useSnackBarStore());

const timeoutInMilliSeconds = ref(4000);
</script>
