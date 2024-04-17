<template>
    <v-dialog
        v-model="isDialogOpen"
        :persistent="true"
        max-width="600"
    >
        <v-card title="Edit Invoice Status">
            <v-card-text>
                <v-row dense>
                    <v-col cols="12">
                        <h4>Invoice Summary</h4>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="12">
                        <v-select
                            v-model="status"
                            :items="statuses"
                            label="Status*"
                            required
                        />
                    </v-col>

                    <v-col cols="12">
                        <div class="mb-2">Message (optional)</div>

                        <v-textarea
                            v-model="note"
                            :counter="300"
                            class="mb-2"
                            rows="2"
                            variant="outlined"
                            persistent-counter
                        />
                    </v-col>
                </v-row>
            </v-card-text>
            
            <v-card-actions class="my-2 d-flex justify-end">
                <v-btn
                    class="text-none"
                    rounded="xl"
                    text="Cancel"
                    @click="emits('close')"
                />

                <v-btn
                    class="text-none"
                    color="primary"
                    rounded="xl"
                    text="Send"
                    variant="flat"
                    @click="emits('onSend', { status, note })"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean;
    currentStatus: string;
}>();

const note = ref<string>('');
const emits = defineEmits(['close', 'onSend']);

const currentStatus = ref('');
const statuses = ref(['pending', 'paid', 'financed']);

const isDialogOpen = computed(() => props.isOpen);
const status = computed<string>({
    get(): string {
        return currentStatus.value || props.currentStatus;
    },
    set(newValue: string) {
        currentStatus.value = props.currentStatus;

        if(newValue) {
            currentStatus.value = newValue;
        }
    }
});
</script>
