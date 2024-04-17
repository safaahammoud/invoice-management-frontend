import { useAuthStore } from "@/store/auth";

export default defineNuxtRouteMiddleware((to) => {
    const { isAuthenticated } = storeToRefs(useAuthStore());
    const token = useCookie('token'); //TODO: see httpOnly
    
    if(token.value) {
        isAuthenticated.value = true;
    }

    if(to?.name === 'login' && token.value) {
        return navigateTo('/')
    }

    if(to?.meta.requiresAuth && !token?.value) {
        return abortNavigation();        
    }
});