select persona.nombre, aula.grupo,estudiantes.nombre, nota_1,nota_2,nota_3,nota_4

from persona
inner join aula on (persona.id_persona=aula.id_persona)
inner join estudiantes on (estudiantes.id_salon=aula.id_aula)
inner join notas on (notas.id_estudiante=estudiantes.id_std)

where (persona.nombre = :nombre_profesor) and (:grupo IS NULL OR aula.grupo = :grupo)