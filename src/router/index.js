import { createRouter, createWebHistory } from 'vue-router'
import CheckUser from '../views/CheckUserView.vue'
import Appointment from '../views/AppointmentView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'checkUser',
      component: CheckUser
    },
    {
      path:"/agenda",
      name:"appointment",
      component: Appointment
    }
    
  ]
})

export default router
