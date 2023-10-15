import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2';

export const useMainStore = defineStore('mainStore', () => {
  const user = ref();

  async function checkUser(dni) {
    // Make Request

    return true;
  }

  async function confirmAppointment(){
    Swal.fire({
      icon:'success',
      title:'Cita Agendada!',
      timer: 2000,
    })
  }

  return { checkUser, user, confirmAppointment }
})
