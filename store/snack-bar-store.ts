import { defineStore } from "pinia";

export const useSnackBarStore = defineStore('SnackBarStore', {
    state: () => ({
        show: false,
        message: '',
    }),
    actions: {
        showSnackbar(message: string) {
            this.show = true;
            this.message = message;
        }
    }
})