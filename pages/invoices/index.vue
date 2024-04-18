<template>
    <div class="flex-wrapper">
      <FormAddInvoice @success="onAddInvoice"/>
    </div>

    <div>
      <div class="search-wrapper">
        <div class="search-input">
          <span id="searchInputLabel">Search invoices</span>
        
          <v-text-field
              aria-labelledby="searchInputLabel"
              append-inner-icon="mdi-magnify"
              placeholder="Search ..."
              @keyup="searchInvoices"
          ></v-text-field>
        </div>
      </div>
    </div>

    <v-data-table-server
        v-model:items-per-page="currentItemsPerPage"
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
      
      <template #item.status="{ item: { status } }">
        <InvoiceStatus :status-code="status" />
      </template>
      
      <template #item.dateIssued="{ item: { dateIssued } }">
          {{ formatDate(dateIssued) }}
      </template>
      
      <template #item.dueDate="{ item: { dueDate } }">
          {{ formatDate(dueDate) }}
      </template>
      
      <template #item.actions="{ item }">
        <v-menu
          @update:modelValue="setCurrentItem(item)"
        >
          <template #activator="{ props }">
            <v-icon v-bind="props" icon="mdi-dots-vertical" />
          </template>

          <div class="actions">
            <v-btn @click="onClickUpdate(item.id)" prepend-icon="mdi-pen">
                Update Status
            </v-btn>
          </div>  
        </v-menu>  
      </template>

      <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination
            :length="totalPages"
            @update:model-value="onPageChange"
          ></v-pagination>

          <span>
            Total {{ totalItems }}
          </span>
        </div>
      </template>
    </v-data-table-server>

    <Teleport to="body">
      <FormUpdateStatus
        v-if="isUpdateDialogOpen"
        :is-open="isUpdateDialogOpen"        
        :current-status="currentSelectedInvoice.status"
        @on-close="isUpdateDialogOpen = false"
        @on-send="onUpdateInvoiceStatus"
      />
    </Teleport>
</template>

<script setup lang="ts">
import { gql, useMutation, useQuery } from '@urql/vue';
import type { VDataTable } from 'vuetify/components';

import { useSnackBarStore } from '@/store/snack-bar-store';
import type { Invoice } from '@/types/Invoice.type';
import type { Pagination } from '@/types/pagination.type';
import debounce from '@/utils/debounce.util';

definePageMeta({
  requiresAuth: true,
})

const { showSnackbar } = useSnackBarStore();

/*
  Typing Issue: Replaced VDataTableHeaders with VDataTable['$props']['headers']
  since VDataTableHeaders is showing error with title prop doesnt exist although it exists as per documentation
*/
const headers = ref<VDataTable['$props']['headers']>([
  { title: 'Reference Number', key: 'referenceNumber', align: 'end',  },
  { title: 'Amount', key: 'amount', align: 'end' },
  { title: 'Date Issued', key: 'dateIssued', align: 'center' },
  { title: 'Due Date', key: 'dueDate', align: 'center' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: '', key: 'actions', align: 'center' },
]);
const currentItemsPerPage = ref(5);
const serverItems = ref([]);
const totalItems = ref(0);
const isUpdateDialogOpen = ref(false);
const currentSelectedInvoice = ref();
const currentPage = ref<number>(1);
const searchTermInput = ref<string>('');
const totalPages = ref(0);
const toUpdateInvoiceId = ref(0);

const QUERY_INVOICES = gql`
  query ($currentPage: Int, $itemsPerPage: Int!, $searchTerm: String) {
    invoices(currentPage: $currentPage, itemsPerPage: $itemsPerPage, searchTerm: $searchTerm)
  }
`
const { executeQuery: fetchInvoicesQuery, fetching: isFetching } = useQuery({
  query: QUERY_INVOICES,
  variables: {
    currentPage,
    itemsPerPage: currentItemsPerPage,
    searchTerm: searchTermInput,
  },
  requestPolicy: 'network-only'
})
const MUTATION_UPDATE_INVOICES = gql`
  mutation ($updateInvoiceInput: UpdateInvoiceInput!) {
    updateInvoice(updateInvoiceInput: $updateInvoiceInput) {
      status
      note
    }
  }
`
const { executeMutation: updateInvoicesMutation, fetching: isUpdating } = useMutation(MUTATION_UPDATE_INVOICES)
const loading = computed(() => isFetching.value);

const onClickUpdate = (id: number) => {
  toUpdateInvoiceId.value = id;
  isUpdateDialogOpen.value = true;
}

const onUpdateInvoiceStatus = async ($event) => {
  await updateInvoicesMutation({updateInvoiceInput:{ id: toUpdateInvoiceId.value, ...$event }})
    .catch((err) => console.log(err))
  
    loadItems();
    isUpdateDialogOpen.value = false;
    
    showSnackbar('Updated Successfully!');
}

const onAddInvoice = async () => {
    loadItems()
  
    isUpdateDialogOpen.value = false;

    showSnackbar('Added New Invoice Successfully!')
}

const setCurrentItem = (item: Invoice) => {
  currentSelectedInvoice.value = item;
}

const onPageChange = (page = 1) => {
  loadItems({ page, itemsPerPage: currentItemsPerPage.value, searchTerm: searchTermInput.value }) 
}

const loadItems = async ($event: Pagination = { page: 1, itemsPerPage: 5, searchTerm: '' }) => {
  const { page, itemsPerPage, searchTerm } = $event;

  currentPage.value = page || 1;
  currentItemsPerPage.value = itemsPerPage || 5;
  searchTermInput.value = searchTerm || '';

  const { data: { value: result } } = (
    await fetchInvoicesQuery({
      currentPage: currentPage.value,
      itemsPerPage: currentItemsPerPage.value,
      searchTerm,
    })
  );
  
  const { data = [], totalCount = 0, pageCount = 0 } = result?.invoices ?? {};

  serverItems.value = data || [];
  totalItems.value = totalCount || 0;
  totalPages.value = pageCount || 0;
}

const searchInvoices = debounce(async (event: Event) => {
  const searchTerm: string = (event.target as HTMLInputElement).value;
  
  loadItems({ searchTerm });
});
</script>

<style lang="scss" scoped>
.flex-wrapper {
  display: flex;
  justify-content: end;
}

.search-wrapper {
  display: flex;
  justify-content: center;

  .search-input {
    width: 70%;
    display: flex;
    flex-direction: column;
    margin-bottom: 5rem;
  }
}
</style>