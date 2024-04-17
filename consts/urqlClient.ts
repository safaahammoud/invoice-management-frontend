import { cacheExchange } from "@urql/exchange-graphcache";
import { Client, debugExchange, fetchExchange } from "@urql/vue";

export const urqlClient = new Client({
    url: 'http://localhost:3001/graphql',
    exchanges: [
        cacheExchange({}),
        debugExchange,
        fetchExchange,
    ],
});