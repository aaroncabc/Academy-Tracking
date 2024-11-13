select p.nombre, aula.grupo,estudiantes.nombre, i.nombre, nota_1,nota_2,nota_3,nota_4
from institucion as i
inner join aula on (aula.id_institucion=i.id_institucion)
inner join persona as p on (aula.id_persona=p.id_persona)
inner join estudiantes on (aula.id_aula=estudiantes.id_salon)
inner join notas on (estudiantes.id_std=notas.id_estudiante)
WHERE 
    (:institucion IS NULL OR i.nombre = :institucion)
    AND (:profesor IS NULL OR p.nombre = :profesor)
    and (:grupo IS NULL OR aula.grupo = :grupo);