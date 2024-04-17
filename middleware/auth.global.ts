import { useAuthStore } from "@/store/auth";

export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie('token');
    const { isAuthenticated } = storeToRefs(useAuthStore());
  
    if(to?.meta.requiresAuth && !token?.value) {
        return navigateTo('/login')       
    }
    
    if(token.value) {
        isAuthenticated.value = true;
    }

    if((to?.name === 'login' && token.value) || to.path === '/') {
        return navigateTo('/invoices')
    }
});