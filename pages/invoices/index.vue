<template>
    <div class="btn-wrapper">
      <FormAddInvoice/>
    </div>

    <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="name"
        @update:options="loadItems"
    >
      <template #item.amount="{ item: { amount, currencySymbol } }">
        {{ amount }} {{ currencySymbol }}
      </template>
      
      <template #item.actions="{ item }">
        <v-menu
          @update:modelValue="setCurrentItem(item)"
        >
          <template #activator="{ props }">
            <v-icon v-bind="props" icon="mdi-dots-vertical" />
          </template>

          <div class="actions">
            <v-btn @click="onClickUpdate" prepend-icon="mdi-pen">
                Update Status
            </v-btn>
          </div>  
        </v-menu>  
        
      </template>
    </v-data-table-server>

    <Teleport to="body">
      <UpdateStatus
        v-if="isOpen"
        :is-open="isOpen"        
        :current-status="currentSelectedInvoice.status"
        @close="isOpen = false"
      />
    </Teleport>
</template>

<script setup lang="ts">
import type { FetchAllInvoicesQuery, Invoice } from '@/types/Invoice.type';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_API_BACKEND_URL;
const invoices = ref<Invoice[]>([
  {
    number: '123',
    dateIssued: '2024-04-03',
    dueDate: '2024-04-03',
    status: 'pending',
    amount: 1200,
    currencySymbol: '$'
  },
  {
    number: '342',
    dateIssued: '2024-04-03',
    dueDate: '2024-04-03',
    status: 'paid',
    amount: 2000,
    currencySymbol: '$'
  },
  {
    number: '11',
    dateIssued: '2024-04-03',
    dueDate: '2024-04-03',
    status: 'financed',
    amount: 3000,
    currencySymbol: '$'
  },
]);
const itemsPerPage = ref(5);
const headers = ref([
  { title: 'Number', key: 'number', align: 'end' },
  { title: 'Amount', key: 'amount', align: 'end' },
  { title: 'Date Issued', key: 'dateIssued', align: 'center' },
  { title: 'Due Date', key: 'dueDate', align: 'center' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: '', key: 'actions', align: 'center' },
]);
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const currentSelectedInvoice = ref();
const isOpen = ref(false);
const onClickUpdate = () => {
  isOpen.value = true;
}
const setCurrentItem = (item: Invoice) => {
  currentSelectedInvoice.value = item;
}

const fetchAllInvoices = async (query: FetchAllInvoicesQuery | null = null) => {
  let url: string = '';
  let page: number = 1;
  let search: string = '';

  if (query) {
      page = query?.page || 1;
      search = query?.search || '';
  }

  if (search) {
      url = `${backendUrl}search/shows?q=${search}`;
  } else {
      url = `${backendUrl}shows?page=${page}`;
  }

  loading.value = true;
  //TODO: when api is done
  return axios.get<{ items: any, total: number }[]>(url);
}

const loadItems = async ({ page = 1, itemsPerPage = 5 }) => {
  loading.value = true;

  const { data } = (
    await fetchAllInvoices({ page, itemsPerPage })
      .finally(() => loading.value = false)
  );

  serverItems.value = data.items;
  totalItems.value = data.total;
}
</script>

<style scoped>
.btn-wrapper {
  display: flex;
  justify-content: end;
}
</style>