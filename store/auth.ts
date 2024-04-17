import { gql } from "@urql/vue";
import { defineStore } from "pinia";

import { urqlClient } from "@/consts/urqlClient";
import type { UserPayload } from "@/types/user-payload.type";

const SIGNIN_QUERY = gql`
  mutation ($loginUserInput: CreateUserInput!) {
    loginUser(loginUserInput: $loginUserInput) {
      errors {
        field,
        message,
      },
      access_token
    }
  }
`

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
    }),
    actions: {
        async authenticateUser({ username, password }: UserPayload) {
          const result = await urqlClient.mutation(SIGNIN_QUERY, {
            loginUserInput: { username, password }
          });          

          const accessToken = result.data?.loginUser?.access_token;
  
          if(accessToken) {
              const token = useCookie('token');

              token.value = accessToken;
              
              this.isAuthenticated = true;
          }
        },
        logoutUser() {
            const token = useCookie('token');

            token.value = null;
            this.isAuthenticated = false;
        }
    }
})