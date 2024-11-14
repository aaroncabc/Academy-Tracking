import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function Salones() {
  const router = useRouter();
  const { id } = router.query;  // Obtenemos el ID de la escuela desde la URL
  const [salones, setSalones] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/salones?escuela=${id}`)
        .then((response) => response.json())
        .then((data) => setSalones(data));
    }
  }, [id]);

  return (
    <div>
      <h1>Salones de la escuela {id}</h1>
      <ul>
        {salones.map((salon) => (
          <li key={salon.id}>
            <span>{salon.nombre}</span> - <span>Capacidad: {salon.capacidad}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Salones;
