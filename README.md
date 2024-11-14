# POR HACER EN ESTE BRANCH
## importante
1. vista que permita enviar las asistencias de 1 dia
2. vista de crud para aula
3. vista de crud para horario

## en progreso
- limitaciones segun rol (considerar el rol de administrador)

# Academy-Tracking
# Proyecto Final - IST7111 Bases de Datos

### Descripción General
Este proyecto es el desarrollo de un sistema de gestión de datos y aplicación web basado en una base de datos relacional para la Fundación Foreign Language for Kids Empowerment (FLAKE), cuyo objetivo es introducir el inglés en las instituciones públicas de Barranquilla. El sistema está orientado a facilitar el ingreso, gestión y análisis de información en múltiples entidades de una institución educativa.

### Objetivos del Proyecto
1. Crear un modelo entidad-relación y convertirlo a un modelo relacional basado en los requerimientos del proyecto.
2. Desarrollar scripts para implementar el modelo en una base de datos relacional.
3. Implementar una aplicación web con un framework de Python o JavaScript que gestione el ingreso y actualización de datos cumpliendo con las reglas de negocio.

### Entregables
1. **Modelo E-R:** Propuesta de negocio inicial modelada.
2. **Modelo Relacional:** Conversión del modelo entidad-relación a relacional.
3. **Script de Base de Datos:** Implementación del modelo en la base de datos asignada.
4. **Población de Datos:** Script que inserta datos de prueba en las tablas para validar las reglas de negocio.
5. **Aplicación Web:** Desarrollo de una aplicación para la gestión de datos.
6. **Presentación del Proyecto:** Exposición de la tecn- ogía y retos encontrados.

### Requerimientos Técnicos
- **Lenguaje de Programación:** Python y/o JavaScript.
- **Framework:** Flask.
- **Motor de Base de Datos:** PosrgreSQL.
  
### Roles y Funciones en el Sistema
1. **Administrador:** Control total sobre el sistema.
2. **Asistente Administrativo:** Acceso limitado para gestionar operaciones diarias.
3. **Consulta:** Solo acceso a reportes.
4. **Tutor:** Acceso para gestionar asistencia y notas de estudiantes.

### Estructura de Datos y Funcionalidades
- **Instituciones y Aulas:** Gestión de instituciones educativas y sus aulas asociadas.
- **Estudiantes:** Registro de estudiantes con datos personales y académicos.
- **Horario:** Configuración de horarios según los grados y aulas.
- **Docentes:** Gestión de docentes responsables de la instrucción directa.
- **Evaluaciones:** Asignación y registro de evaluaciones según los bloques lectivos.
  
### Reglas de Negocio
1. **Gestión de Periodo Académico:** Solo el periodo académico en curso debe estar activo.
2. **Evaluaciones por Bloque:** Cada bloque lectivo tiene una evaluación con una ponderación del 25%.
3. **Criterios de Calificación:** Las notas son numéricas de 0 a 5.
4. **Horarios Flexibles:** Posibilidad de ajustar los horarios de cada aula.

