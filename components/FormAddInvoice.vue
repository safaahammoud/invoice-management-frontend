<template>
  <div class="pa-4 text-center">
    <v-dialog
      v-model="isAddInvoiceDialogOpen"
      max-width="600"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-plus"
          text="Add Invoice"
          variant="tonal"
          v-bind="activatorProps"
          @click="isAddInvoiceDialogOpen = true"
        ></v-btn>
      </template>

      <v-card title="Add Invoice">
        <v-card-text>
          <v-form ref="invoiceFormRef">
            <v-row dense>
              <v-col
                cols="12"
                md="4"
                sm="6"
              >
                <v-text-field
                  v-model="formValue.invoiceNumber"
                  :rules="[
                    validationRules.required,
                    validationRules.maxNumber,
                  ]"
                  label="Invoice number*"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
  
              <v-col
                cols="12"
                md="4"
                sm="6"
              >
                <v-text-field
                  v-model="formValue.amount"
                  :rules="[
                      validationRules.required,
                      validationRules.maxNumber,
                    ]"
                    label="Amount*"
                    type="number"
                    prefix="$"
                    required
                ></v-text-field>
              </v-col>
  
              <v-col
                cols="12"
                md="4"
                sm="6"
              >
                <v-menu
                  v-model:return-value="formValue.dueDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      color="primary"
                      v-model="formattedInvoiceDueDate"
                      append-inner-icon="mdi-calendar"
                      v-bind="props"
                      readonly
                    ></v-text-field>
                  </template>
                  
                  <v-date-picker
                    v-model="formValue.dueDate"
                    type="month"
                    no-title
                    scrollable
                    hide-header
                  />                  
                </v-menu>
              </v-col>
  
              <v-col
                cols="12"
                md="4"
                sm="6"
              >
                <v-menu
                  v-model:return-value="formValue.dateIssued"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      color="primary"
                      v-model="formattedInvoiceDateIssued"
                      append-inner-icon="mdi-calendar"
                      v-bind="props"
                      label="Date issued"
                      readonly
                    ></v-text-field>
                  </template>
                  
                  <v-date-picker
                    v-model="formValue.dateIssued"
                    type="month"
                    no-title
                    scrollable
                    hide-header
                  />                  
                </v-menu>
              </v-col>
            </v-row>
          </v-form>

          <div class="text-wrapper">
            <small class="text-caption text-medium-emphasis">*All fields are required</small>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text="Close"
            variant="plain"
            @click="onCloseDialog"
          />

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="validateForm"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useDate } from 'vuetify';

const formValue = ref({
  invoiceNumber: '',
  amount: '',
  dueDate: null,
  dateIssued: null,
});
const invoiceFormRef = ref();
let isAddInvoiceDialogOpen = ref<boolean>(false);
const validationRules = ref({
  required: (value: any) => !!value || 'Field is required',
  maxNumber: (value: number) => value <= Number.MAX_SAFE_INTEGER || 'Number field reached maximum value',
});

const formattedInvoiceDueDate = computed(() => formatInvoiceDate(formValue.value.dueDate));
const formattedInvoiceDateIssued = computed(() => formatInvoiceDate(formValue.value.dateIssued));

const validateForm = () => {
  const { valid:isFormValid } = invoiceFormRef.value.validate();

  if(isFormValid) {
    //TODO: api request here
    isAddInvoiceDialogOpen.value = false;
  }
};

const formatInvoiceDate = (date: Date | null): string => {
  const dateComp = useDate();
  const formattedDate = dateComp.format(date, 'fullDateWithWeekday');

  return formattedDate;
};

const onCloseDialog = () => {
  isAddInvoiceDialogOpen.value = false;
  invoiceFormRef.value.reset();
}
</script>

<style scoped>
.text-wrapper {
  display: flex;
  justify-content: end;
}
</style>