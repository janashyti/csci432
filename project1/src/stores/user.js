import { defineStore } from 'pinia'
import {ref, computed } from 'vue'
 
export const useUserStore = defineStore('user', () => {
    const firstName = ref('')
    const lastName = ref('')
    const userName = ref('')
    const email = ref('')
    const token = ref('')
 
    const wholeName = computed(() => firstName.value + ' ' + lastName.value)
 
    function setUser(fName, lName, uName, uemail, utoken) {
        firstName.value = fName ?? ''
        lastName.value = lName ?? ''
        userName.value = uName ?? ''
        email.value = uemail ?? ''
        token.value = utoken ?? ''
    }

    function $reset() {
        firstName.value = ''
        lastName.value = ''
        userName.value = ''
        email.value = ''
        token.value = ''
    }
 
    return { firstName, lastName, userName, email, token, wholeName, setUser, $reset }
})