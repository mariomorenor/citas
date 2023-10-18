<template>
    <div class="row mt-3">
        <div class="col">
            <h1 class="border-bottom rounded">Solicitud Cita Médica</h1>
        </div>
    </div>
    <div class="row">
        <div class="col-12 col-md-4">
            <div class="form-group">
                <o-field label="Usuario">
                    <o-input v-model="store.user.name" readonly></o-input>
                </o-field>
            </div>
            <div class="form-group">
                <o-field label="Correo">
                    <o-input v-model="store.user.email" readonly></o-input>
                </o-field>
            </div>
            <div class="text-center d-none d-md-block">
                <img src="../assets/images/doc.png" alt="" class="w-75">
                <div class="badge bg-primary">
                    Dra. Paula Benitez
                </div>
            </div>
        </div>
        <div class="col-12 col-md-8">
            <FullCalendar ref="calendarEL" :options="calendarOptions" />
        </div>
        <div class="col-12 text-center d-md-none">
            <img src="../assets/images/doc.png" alt="" class="w-75">
            <div class="badge bg-primary">
                Dra. Paula Benitez
            </div>

        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <footer class="p-3">
                <small class="fw-lighter">Desarrollado en DTI - PUCESD por <br> Ing. Jonathan Moreno</small>
            </footer>
        </div>
    </div>

    <o-modal v-model:active="activeModal" scroll="clip" :canCancel="['escape', 'x', 'button']">
        <div class="card">
            <div class="card-header">
                <h2>Confirmación de Cita</h2>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <o-field label="Fecha">
                                <o-input readonly v-model="selectedDate.date"></o-input>
                            </o-field>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6">

                        <div class="form-group">
                            <o-field label="Hora Inicio">
                                <o-input readonly v-model="selectedDate.timeStart"></o-input>
                            </o-field>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <o-field label="Hora Fin">
                                <o-input readonly v-model="selectedDate.timeEnd"></o-input>
                            </o-field>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p><span class="fw-bold">¿Seguro de Confirmar la Cita?</span> Una vez realizada la acción no se
                            podrá deshacer.</p>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <o-button variant="primary" @click="setAppointment()">Confirmar</o-button>
                <o-button variant="danger" @click="activeModal = false">Cancelar</o-button>
            </div>
        </div>
    </o-modal>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import TimeGridPlugin from '@fullcalendar/timegrid'
import esLocale from '@fullcalendar/core/locales/es'
import { onBeforeMount, ref } from 'vue'

import { useMainStore } from '../stores/mainStore'

import moment from 'moment'

import { useRouter } from 'vue-router'

import Swal from 'sweetalert2'

const router = useRouter()

onBeforeMount(() => {
    if (!store.user.name) {
        router.replace('/');
    }
})


const store = useMainStore();


const activeModal = ref(false);
const selectedDate = ref({
    date: "",
    timeStart: "",
    timeEnd: ""
});

const calendarEL = ref();

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin],
    initialView: 'dayGridWeek',
    locale: esLocale,
    headerToolbar: {
        left: "dayGridMonth,dayGridWeek",
        center: "title",
        right: "today,prev,next"
    },
    views: {
        dayGridMonth: {
            titleFormat: {
                year: 'numeric', month: 'short'
            }
        }
    },
    // height: 'auto',

    selectable: true,
    unselectAuto: true,
    selectConstraint: "businessHours",
    allDaySlot: false,
    slotMinTime: "08:00",
    slotMaxTime: "18:00",
    validRange: {
        start: moment().format('Y-MM-DD')
    },
    businessHours: [
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "08:00",
            endTime: "13:00"
        },
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "15:00",
            endTime: "18:00"
        },
    ],
    dateClick: (arg) => {
        const cal = arg.view.calendar;
        if (cal.view.type != 'timeGrid') {
            cal.changeView('timeGrid', arg.date)
            return
        }

    },
    select: (arg) => {
        const cal = arg.view.calendar;
        cal.unselect();

        selectedDate.value.date = moment(arg.start).format('Y-MM-DD')
        selectedDate.value.timeStart = moment(arg.start).format('HH:mm')
        selectedDate.value.timeEnd = moment(arg.start).add(30, 'm').format('HH:mm')
        activeModal.value = true;
    },
    events: store.getAppointments
}

async function setAppointment() {
    activeModal.value = false
    Swal.fire({
        icon: 'info',
        title:'Generando Cita...',
        allowOutsideClick:false,
        showConfirmButton:false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
    const event = {
        start: moment(`${selectedDate.value.date} ${selectedDate.value.timeStart}`).tz("UTC").format('Y-MM-DD HH:mm'),
        end: moment(`${selectedDate.value.date} ${selectedDate.value.timeEnd}`).tz("UTC").format('Y-MM-DD HH:mm'),
        user: store.user.name,
        email: store.user.email
    }
    const result = await store.setAppointment(event)

    if (result.code == 200) {
        Swal.fire({
            icon: 'success',
            title: 'Cita Agendada!',
            timer: 2000,
        });
        console.log(calendarEL.value);
        const cal = calendarEL.value.calendar
        cal.refetchEvents();

        console.log(cal);

    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Ocurrió un problema',
            timer: 2000
        })
    }


}

</script>