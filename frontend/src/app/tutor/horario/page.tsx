'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useSession } from 'next-auth/react';

export default function HorarioTutor() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session,status} = useSession();
  useEffect(() => {
    if (status === 'loading') return; // Espera hasta que se cargue la sesión

    if (!session) {
      router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
    } else {
      router.push('/tutor/horario'); // Redirige a "/aulas" si la sesión existe
    }
  }, [session, status, router]);
  const id = session?.user?.name?.split(' ')[0];
  const rol = session?.user?.email?.trim();

  interface Evento {
    tutor: ReactNode;
    grupo: ReactNode;
    gradoT: ReactNode;
    diaSemana: string;
    grupoT: string;
    Institucion: string;
    hora_i: string;
    hora_f: string;
  }
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null); // Para almacenar el evento seleccionado'
  useEffect(() => {
    if (!id || status === 'loading' || !rol) return;
    async function fetchEventos() {
      try {
        //const url = session?.user?.email?.trim() === 'admin' ? 'http://localhost:5000/api/getAulasHorarioAll': 'http://localhost:5000/api/getAulasHorario?id_tutor='+id;
        //const  url = 'http://localhost:5000/api/getAulasHorarioAll';
        const url = rol === "admin" ? 'http://localhost:5000/api/getAulasHorarioAll' : `http://localhost:5000/api/getAulasHorario?id_tutor=${id}`;
        const response = await fetch(url);
        const data = await response.json();
        setEventos(data);
        console.log(id);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
        setLoading(false);
      }
    }

    fetchEventos();
  }, [id,status]);

  const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const horario: { [key: string]: {
      grupoT: string; Institucion: string; hora_i: string; hora_f: string; gradoT: string; grupo: string, tutor:string
}[] } = {
    L: [],
    M: [],
    X: [],
    J: [],
    V: [],
    S: [],
    D: [],
  };

  eventos.forEach(evento => {
    const { diaSemana, grupoT, Institucion, hora_i, hora_f ,gradoT,grupo,tutor } = evento;
    if (diasSemana.includes(diaSemana)) {
      horario[diaSemana].push({
          grupoT, Institucion, hora_i, hora_f, gradoT, grupo,tutor
      });
    } else {
      console.warn(`Día no válido: ${diaSemana}`);
    }
  });

  // Función que verifica si un evento se solapa con el bloque de una hora
  const checkSolapamiento = (horaBloque: number, horaInicio: string, horaFin: string) => {
    const horaInicioEvento = parseInt(horaInicio.split(':')[0]);
    const horaFinEvento = parseInt(horaFin.split(':')[0]);

    // Verificar si el evento se solapa con el bloque de hora
    return (
      (horaInicioEvento >= horaBloque && horaInicioEvento < horaBloque + 1) // El evento empieza dentro del bloque
    );
  };

  // Función para abrir el AlertDialog con los detalles del evento
  const openEventDetails = (evento: any) => {
    setSelectedEvent(evento);
    setOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Horario Semanal</h1>
      
      {loading ? (
        <p className="text-center text-lg">Cargando eventos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse shadow-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-6 py-4 text-left">Hora</th>
                {diasSemana.map((dia, index) => (
                  <th key={index} className="px-6 py-4 text-left">{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {Array.from({ length: 24 }, (_, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{i}:00</td>
                  {diasSemana.map((dia, index) => {
                    const eventosDia = horario[dia].filter(evento => checkSolapamiento(i, evento.hora_i, evento.hora_f));

                    return (
                      <td key={index} className="px-6 py-4">
                        {eventosDia.length > 0 ? (
                          eventosDia.map((evento, idx) => (
                            <Tooltip.Provider key={idx}>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <div
                                    className="bg-blue-100 p-2 rounded-md cursor-pointer hover:bg-blue-200 mb-2"
                                    onClick={() => openEventDetails(evento)} // Abre el dialog al hacer clic
                                  >
                                    <p className="text-sm font-medium">{evento.grupoT}</p>
                                    <p className="text-xs text-gray-500">{evento.Institucion}</p>
                                  </div>
                                </Tooltip.Trigger>
                                <Tooltip.Content className="bg-black text-white text-xs p-2 rounded-md shadow-md">
                                  {evento.hora_i} - {evento.hora_f}
                                  <Tooltip.Arrow className="fill-black" />
                                </Tooltip.Content>
                              </Tooltip.Root>
                            </Tooltip.Provider>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">Sin eventos</p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog de detalles del evento */}
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 w-96 p-6 bg-white rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <AlertDialog.Title className="text-xl font-semibold">Detalles del Evento</AlertDialog.Title>
            {selectedEvent && (
              <div className="mt-4">
                <p><strong>Codigo:</strong> {selectedEvent.grupo}</p>
                <p><strong>Grupo:</strong> {selectedEvent.grupoT}</p>
                <p><strong>Grado:</strong> {selectedEvent.gradoT}</p>
                <p><strong>Tutor:</strong> {selectedEvent.tutor}</p>
                <p><strong>Institución:</strong> {selectedEvent.Institucion}</p>
                <p><strong>Hora de Inicio:</strong> {selectedEvent.hora_i}</p>
                <p><strong>Hora de Fin:</strong> {selectedEvent.hora_f}</p>
              </div>
            )}
            {/* Botón de cerrar (cruz) */}
            <AlertDialog.Cancel asChild>
              <button 
                className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => setOpen(false)}
              >
                &times; {/* Este es el símbolo de la cruz */}
              </button>
            </AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
