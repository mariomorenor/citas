import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment-timezone';

export const useMainStore = defineStore('mainStore', () => {
  const user = ref({ name: '', email: '' });
  const server = ref("")

  server.value = import.meta.env.MODE == 'development' ? '/api' : 'https://unitec.pucesd.edu.ec'

  async function checkUser(dni) {

    const { data } = await axios.post(`${server.value}/medical/check-user`, {
      params: { dni }
    });
    if (data.result.code == 200) {
      user.value.name = data.result.result.nombre
      user.value.email = data.result.result.correo
    }
    console.log(data);
    return data.result;
  }

  async function getAppointments(info) {
    const { data } = await axios.post(`${server.value}/medical/get-appointments`, {
      params: {
        start: info.start,
        end: info.end
      }
    });

    const events = data.result.map((ev) => {
      
      return {
        id: ev.id,
        title: 'Reservado',
        start: moment.utc(ev.date_start).tz('America/Guayaquil').format('Y-MM-DD HH:mm'),
        end: moment.utc(ev.date_stop).tz('America/Guayaquil').format('Y-MM-DD HH:mm'),
        color: '#ce1c1c'
      }
    })

    return events
  }

  async function setAppointment(event) {
    const { data } = await axios.post(`${server.value}/medical/set-appointment`, {
      params: {
        ...event
      }
    });
    return data.result
    
  }



  return { checkUser, user, getAppointments, setAppointment }
})
