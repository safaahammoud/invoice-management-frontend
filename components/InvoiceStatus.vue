<template>
    <div
        :class="{
            'text-success': props.statusCode === InvoiceStatus.Paid,
            'text-orange': props.statusCode === InvoiceStatus.Pending,
            'text-blue': props.statusCode === InvoiceStatus.Financed,
        }">
        {{ statusTitle }}
    </div>
</template>

<script setup lang="ts">
import { statuses } from '@/consts/statuses.const';
import { InvoiceStatus } from '@/enums/InvoiceStatus.enum';

const props = defineProps<{
    statusCode: string;
}>();

let statusTitle = computed(() => (
    statuses.find((status) => status.value === props.statusCode)?.title || '')
);

</script>
