document.addEventListener('DOMContentLoaded', function() {
    
    var currentYear = new Date().getFullYear();
    console.log("Calendario cargado");
    var calendarEl = document.getElementById('calendar');
    var selectedTutor = "";

    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        initialView: 'timeGridWeek',
        selectable: true,
        editable: true,
        allDaySlot: false,
        slotMinTime: "06:00:00",
        slotMaxTime: "18:00:00",
        slotDuration: "01:00:00",
        slotLabelInterval: "01:00",
        slotEventOverlap: false,

        validRange: {
            start: `${currentYear}-01-01`,
            end: `${currentYear}-12-31`,
        },
        initialDate: `${currentYear}-01-01`,
        

        slotLabelContent: function (args) {
            const startHour = args.date.getHours();
            const startMinute = args.date.getMinutes().toString().padStart(2, '0');
            const endHour = (startHour + 1) % 24;
            const endMinute = startMinute;
        
            const start = `${startHour.toString().padStart(2, '0')}:${startMinute}`;
            const end = `${endHour.toString().padStart(2, '0')}:${endMinute}`;
            return { html: `${start} - ${end}` };
        },

        datesSet: function(info) {
            const currentWeekStart = info.start;
            const currentWeekEnd = info.end;
            const startClassDate = new Date('2024-02-11');
            const endClassDate = new Date('2024-10-19');
            
            let title = info.view.title;
            
            if (currentWeekStart >= startClassDate && currentWeekStart <= endClassDate) {
                const msPerWeek = 7 * 24 * 60 * 60 * 1000;
                const weekNumber = Math.floor((currentWeekStart - startClassDate) / msPerWeek) + 1;
                title += ` (Semana ${weekNumber})`;
            }
        
            document.querySelector('.fc-toolbar-title').textContent = title;
        },
        
        contentHeight: 'auto',
    });
    function loadTutorSchedule(tutor) {
        let events = [];
        const startDate = new Date('2024-02-11');
        const endDate = new Date('2024-10-26');
        const dayOfWeekMapping = {
            'Lunes': 1,
            'Martes': 2,
            'Miércoles': 3,
            'Jueves': 4,
            'Viernes': 5
        };

        switch (tutor) {
            case 'Tutor 1':
                events = [
                    { title: 'TERCERO B', startTime: '08:00:00', endTime: '09:00:00', dayOfWeek: 'Viernes' },
                    { title: 'TERCERO C', startTime: '10:00:00', endTime: '11:00:00', dayOfWeek: 'Viernes' }
                ];
                break;
            case 'Tutor 2':
                events = [
                    { title: 'TERCERO A', startTime: '09:00:00', endTime: '10:00:00', dayOfWeek: 'Jueves' },
                    { title: 'CUARTO B', startTime: '11:00:00', endTime: '12:00:00', dayOfWeek: 'Jueves' }
                ];
                break;
            case 'Tutor 3':
                events = [
                    { title: 'QUINTO A', startTime: '12:00:00', endTime: '13:00:00', dayOfWeek: 'Lunes' }
                ];
                break;
            default:
                break;
        }

        events.forEach(function(event) {
            const start = new Date(startDate);
            const end = new Date(startDate);
            while (start.getDay() !== dayOfWeekMapping[event.dayOfWeek]) {
                start.setDate(start.getDate() + 1);
                end.setDate(end.getDate() + 1);
            }

            while (start <= endDate) {
                calendar.addEvent({
                    
                    title: event.title,
                    start: new Date(start.getFullYear(), start.getMonth(), start.getDate(), ...event.startTime.split(':')),
                    end: new Date(end.getFullYear(), end.getMonth(), end.getDate(), ...event.endTime.split(':')),
                });

                start.setDate(start.getDate() + 7);
                end.setDate(end.getDate() + 7);
            }
        });
        calendar.render();
    }

    document.getElementById("acceptButton").addEventListener("click", function () {
        const tutorSelect = document.getElementById("tutorSelect");
        if (tutorSelect) {
            selectedTutor = tutorSelect.value;
        } else {
            console.log("El elemento tutorSelect no se encuentra en el DOM.");
        }

        if (selectedTutor) {
            var events = calendar.getEvents();
            events.forEach(function (event) {
                event.remove();
            });

            calendarEl.style.display = "block";
            loadTutorSchedule(selectedTutor);
        }
    });

    let selectedEvent = null;
    let originalEventColor = null;

    calendar.on('eventClick', function(info) {
        if (selectedEvent) {
            selectedEvent.setProp('backgroundColor', originalEventColor);
            selectedEvent.setProp('borderColor', originalEventColor);
        }

        originalEventColor = info.event.backgroundColor;
        info.event.setProp('backgroundColor', '#005f8a');
        info.event.setProp('borderColor', '#003d56');
        selectedEvent = info.event;
    });
    
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.fc-event') && !event.target.closest('#deleteButton')) {
            if (selectedEvent) {
                selectedEvent.setProp('backgroundColor', originalEventColor);
                selectedEvent.setProp('borderColor', originalEventColor);
                selectedEvent = null;
            }
        }
    });
    
    document.getElementById("deleteButton").addEventListener("click", function () {
        if (selectedEvent) {
            document.getElementById('modalMessage').textContent = `¿Estás seguro de que deseas eliminar la clase "${selectedEvent.title}"?`;
            document.getElementById('deleteModal').style.display = 'block';
        }
    });


    document.getElementById("addButton").addEventListener("click", function () {
        document.getElementById('addClassModal').style.display = 'block';
    });

    function validateClass(grado, grupo, hora, dia) {
        const events = calendar.getEvents();
        let maxHours = 1;
        
        if (grado === "quinto") {
            maxHours = 2;
        }
        
        const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        if (!validDays.includes(dia)) {
            alert("El día seleccionado no es válido. Selecciona un día entre Lunes y Viernes.");
            return false;
        }
        let totalHours = 0;
        events.forEach(event => {
            const eventDay = event.start.toLocaleString('es-ES', { weekday: 'long' });
            if (event.title.includes(grado) && event.title.includes(grupo) && eventDay === dia && event.start.getHours() === new Date(`2024-02-11T${hora}`).getHours()) {
                totalHours++;
            }
        });

        if (totalHours >= maxHours) {
            alert("Ya existe el máximo de horas para este grupo y grado.");
            return false;
        }
        
        return true;
    }
    
    document.getElementById("confirmAddClass").addEventListener("click", function () {
        const grado = document.getElementById("gradoSelect").value;
        const grupo = document.getElementById("grupoSelect").value;
        const hora = document.getElementById("horaSelect").value;
        const dia = document.getElementById("diaSelect").value;
    
        const dayOfWeekMapping = {
            'Lunes': 1,
            'Martes': 2,
            'Miércoles': 3,
            'Jueves': 4,
            'Viernes': 5
        };
        const selectedDay = dayOfWeekMapping[dia];
        
        if (validateClass(grado, grupo, hora, dia)) {
            const eventTitle = `${grado.toUpperCase()} ${grupo}`;
            const startTime = `2024-02-11T${hora}`;
            const startDate = new Date(startTime);
            while (startDate.getDay() !== selectedDay) {
                startDate.setDate(startDate.getDate() + 1);
            }
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Sumar 1 hora a la hora de inicio    
            calendar.addEvent({
                title: eventTitle,
                start: startDate,
                end: endDate,
            });
            document.getElementById('addClassModal').style.display = 'none';
        }
    });
    
    document.getElementById("cancelAddClass").addEventListener("click", function () {
        document.getElementById('addClassModal').style.display = 'none';
        selectedTutor = "";
        selectedEvent = null;
        originalEventColor = null;
        calendarEl.style.display = "none";
    });

    document.getElementById("closeAddClassModal").addEventListener("click", function () {
        document.getElementById('addClassModal').style.display = 'none';
    });
    
    window.addEventListener("click", function (event) {
        if (event.target === document.getElementById('addClassModal')) {
            document.getElementById('addClassModal').style.display = 'none';
        }
    });
    
    const deleteModal = document.getElementById('deleteModal');
    const closeModal = document.querySelector('.close');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    
    confirmDelete.addEventListener('click', function () {
        const eventsToRemove = calendar.getEvents().filter(event => event.title === selectedEvent.title);
        eventsToRemove.forEach(function (event) {
            event.remove();
        });
    
        selectedEvent = null;
        deleteModal.style.display = 'none';
    });
    
    cancelDelete.addEventListener('click', function () {
        deleteModal.style.display = 'none';
    });
    
    closeModal.addEventListener('click', function () {
        deleteModal.style.display = 'none';
    });
    
    window.addEventListener('click', function (event) {
        if (event.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
});