import { useSnackBarStore } from "@/store/snack-bar-store";
import { cacheExchange } from "@urql/exchange-graphcache";
import { Client, debugExchange, fetchExchange, mapExchange } from "@urql/vue";

export const urqlClient = new Client({
    url: 'http://localhost:3001/graphql',
    exchanges: [
        cacheExchange({}),
        debugExchange,
        mapExchange({
            onError(error) {
                let { showSnackbar } = useSnackBarStore();

                showSnackbar(error.message)
            }
        }),
        fetchExchange,
    ],
    fetchOptions: () => {
        const token = useCookie('token');

        return {
            headers: { authorization: token.value ? `Bearer ${ token.value }` : '' }
        }
    }
});