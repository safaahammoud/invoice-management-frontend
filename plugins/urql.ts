import { urqlClient } from '@/consts/urqlClient';

import urql from '@urql/vue';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(urql, urqlClient);
})
