-- Bloque académico lectivo para el año 2024
INSERT INTO anio_electivo (Id_Bloque_electivo, Fecha_inicio, Fecha_fin) VALUES
(1, '2024-02-05', '2024-04-05'),
(2, '2024-04-08', '2024-06-07'),
(3, '2024-08-05', '2024-10-04'),
(4, '2024-10-07', '2024-12-06');

-- Insertar datos de personal
INSERT INTO persona (Id_persona, Nombre, Segundo_nombre, Apellido1, Apellido2, Tipo_identificacion, Numero_documento, Direccion, Celular, Cargo,usuario,pass_word) VALUES
(1, 'Laura', 'Andrea', 'Gómez', 'Martínez', 'CC', '12345678', 'Calle 10 #5-50', '3001234567', 'Docente','lau','$2b$10$gIsYZ91vzUfT20fl5AwF..IaDFv09ud9zoHNIC4O8uNInhSB97SZm'),
(2, 'Carlos', 'Eduardo', 'Pérez', 'López', 'CC', '87654321', 'Calle 15 #7-80', '3012345678', 'Docente','carlos','$2b$10$gIsYZ91vzUfT20fl5AwF..IaDFv09ud9zoHNIC4O8uNInhSB97SZm'),
(3, 'Marta', 'Isabel', 'Rodríguez', 'Castro', 'CC', '23456789', 'Carrera 7 #11-25', '3023456789', 'admin','Marta','$2b$10$gIsYZ91vzUfT20fl5AwF..IaDFv09ud9zoHNIC4O8uNInhSB97SZm');

-- Instituciones educativas
INSERT INTO institucion (Id_institucion, codigo,Nombre, Rector, Localidad, Barrio, Direccion) VALUES
(1, '108001000085','CENTRO DE EDUCACION BASICA # 201', 'ELISA ISABEL GUERRERO ARRIETA', 'NORTE RIOMAR', 'LAS NUBES', 'IND VIA CIRCUNVALAR ENTRADA TRANSELCA'),
(2, '108001001812','ESCUELA NORMAL SUPERIOR DEL DISTRITO DE BARRANQUILLA', 'ADIS MIRANDA DE IGLESIAS', 'NORTE RIOMAR', 'ROSARIO', 'CL 47 44 100');


-- Aulas en cada institución
INSERT INTO aula (Id_Aula, Grupo, GrupoT, Jornada, Grado, GradoT, Id_persona, Id_institucion,año) VALUES
(1, 301, 'A', 'Mañana', 3, 'Tercero', 1, 1,2024),
(2, 401, 'B', 'Tarde', 4, 'Cuarto', 2, 2,2024),
(3, 501, 'A', 'Mañana', 5, 'Quinto', 1, 1,2023),
(4, 402, 'B', 'Tarde', 4, 'Cuarto', 2, 1, 2024),
(5, 501, 'A', 'Mañana', 5, 'Quinto', 3, 2, 2024),
(6, 502, 'B', 'Tarde', 5, 'Quinto', 3, 2, 2024),
(7, 601, 'A', 'Mañana', 6, 'Sexto', 1, 1, 2024),
(8, 602, 'B', 'Tarde', 6, 'Sexto', 1, 1, 2024),
(9, 701, 'A', 'Mañana', 7, 'Séptimo', 2, 2, 2024),
(10, 702, 'B', 'Tarde', 7, 'Séptimo', 2, 2, 2024),
(11, 801, 'A', 'Mañana', 8, 'Octavo', 3, 1, 2024),
(12, 802, 'B', 'Tarde', 8, 'Octavo', 3, 1, 2024),
(13, 901, 'A', 'Mañana', 9, 'Noveno', 1, 2, 2024),
(14, 902, 'B', 'Tarde', 9, 'Noveno', 1, 2, 2024),
(15, 1001, 'A', 'Mañana', 10, 'Décimo', 2, 2, 2024),
(16, 1002, 'B', 'Tarde', 10, 'Décimo', 2, 2, 2024),
(17, 1101, 'A', 'Mañana', 11, 'Once', 3, 1, 2024),
(18, 1102, 'B', 'Tarde', 11, 'Once', 3, 1, 2024),
(19, 201, 'A', 'Mañana', 2, 'Segundo', 1, 2, 2024),
(20, 202, 'B', 'Tarde', 2, 'Segundo', 1, 2, 2024);

-- Horarios de clases para cada bloque lectivo y aula
INSERT INTO horario (Id_H, Hora_i, Hora_f, Dia_I, Dia_text, Id_Aula) VALUES
(1, '08:00:00', '08:45:00', 'L', 'Lunes', 1),
(2, '08:45:00', '09:30:00', 'L', 'Lunes', 2),
(3, '09:00:00', '10:40:00', 'M', 'Martes', 3);  -- Bloque de dos horas para quinto grado

-- Estudiantes en Aula 1 (Tercero)
INSERT INTO estudiantes (Id_Std, Nombre, Segundo_nombre, Apellido1, Apellido2, Tipo_Identicficacion, Numero_identificacion, Genero, Estrato, F_nacimiento, Id_Salon) VALUES
(1, 'Ana', 'Maria', 'Lopez', 'Ramirez', 'TI', '123123123', 'Femenino', 3, '2012-05-10', 1),
(2, 'Miguel', 'Angel', 'Ramos', 'Gutierrez', 'TI', '234234234', 'Masculino', 2, '2012-07-12', 1),
(3, 'Sofia', 'Elena', 'Mora', 'Cruz', 'TI', '345345345', 'Femenino', 3, '2012-09-20', 1),
(4, 'Daniel', 'Felipe', 'Montoya', 'Ruiz', 'TI', '456456456', 'Masculino', 1, '2012-03-18', 1),

-- Estudiantes en Aula 2 (Cuarto)

(5, 'Luis', 'Fernando', 'González', 'Torres', 'TI', '321321321', 'Masculino', 2, '2013-08-15', 2),
(6, 'Maria', 'Jose', 'Pineda', 'Perez', 'TI', '654654654', 'Femenino', 3, '2013-10-05', 2),
(7, 'Jose', 'Alejandro', 'Quintero', 'Vargas', 'TI', '987987987', 'Masculino', 4, '2013-12-01', 2),
(8, 'Laura', 'Isabel', 'Díaz', 'Morales', 'TI', '789789789', 'Femenino', 2, '2013-11-11', 2),

-- Estudiantes en Aula 3 (Quinto)

(9, 'Jorge', 'Alberto', 'Martínez', 'Hernández', 'TI', '231231231', 'Masculino', 4, '2011-10-20', 3),
(10, 'Paula', 'Andrea', 'Castaño', 'Gomez', 'TI', '123987456', 'Femenino', 3, '2011-03-25', 3),
(11, 'Camilo', 'Andrés', 'Moreno', 'Rivera', 'TI', '345678901', 'Masculino', 5, '2011-06-14', 3),
(12, 'Sara', 'Juliana', 'Vega', 'Ortega', 'TI', '789123456', 'Femenino', 2, '2011-09-30', 3),
(13, 'Carlos', 'Andres', 'Mejia', 'Lopez', 'TI', '111222333', 'Masculino', 4, '2013-01-01', 6),
(14, 'Luisa', 'Fernanda', 'Garcia', 'Castillo', 'TI', '444555666', 'Femenino', 3, '2013-02-15', 6),
(15, 'Andres', 'David', 'Perez', 'Romero', 'TI', '777888999', 'Masculino', 2, '2013-03-20', 6),
(16, 'Claudia', 'Patricia', 'Rojas', 'Diaz', 'TI', '333444555', 'Femenino', 1, '2013-05-10', 6),
(17, 'Juan', 'Sebastian', 'Cruz', 'Gomez', 'TI', '666777888', 'Masculino', 2, '2013-06-15', 6),

-- Aula 7
(18, 'Diana', 'Marcela', 'Hernandez', 'Torres', 'TI', '888999000', 'Femenino', 4, '2013-07-01', 7),
(19, 'Pedro', 'Julian', 'Martinez', 'Gonzalez', 'TI', '123456789', 'Masculino', 3, '2013-08-01', 7),
(20, 'Valeria', 'Sofia', 'Lopez', 'Castro', 'TI', '987654321', 'Femenino', 2, '2013-09-15', 7),
(21, 'Diego', 'Fernando', 'Ramos', 'Ramirez', 'TI', '456789123', 'Masculino', 1, '2013-10-20', 7),
(22, 'Camila', 'Andrea', 'Cruz', 'Mora', 'TI', '654321987', 'Femenino', 2, '2013-11-30', 7),

-- Repite para las aulas 8 a 20 (5 estudiantes por aula).
(23, 'Julian', 'Andres', 'Mora', 'Lopez', 'TI', '991122334', 'Masculino', 3, '2013-01-15', 8),
(24, 'Santiago', 'Alberto', 'Perez', 'Gomez', 'TI', '112233445', 'Masculino', 2, '2013-02-10', 8),
(25, 'Isabela', 'Maria', 'Diaz', 'Cruz', 'TI', '223344556', 'Femenino', 3, '2013-03-25', 8),
(26, 'Gabriela', 'Sofia', 'Torres', 'Rojas', 'TI', '334455667', 'Femenino', 1, '2013-04-18', 8),
(27, 'Esteban', 'David', 'Rojas', 'Hernandez', 'TI', '445566778', 'Masculino', 2, '2013-05-22', 8),

-- Aula 9
(28, 'Laura', 'Camila', 'Gonzalez', 'Torres', 'TI', '556677889', 'Femenino', 2, '2013-06-12', 9),
(29, 'Jorge', 'Luis', 'Martinez', 'Vargas', 'TI', '667788990', 'Masculino', 1, '2013-07-04', 9),
(30, 'Andrea', 'Paola', 'Diaz', 'Rivera', 'TI', '778899001', 'Femenino', 3, '2013-08-16', 9),
(31, 'Victor', 'Hugo', 'Lopez', 'Ramirez', 'TI', '889900112', 'Masculino', 2, '2013-09-08', 9),
(32, 'Daniela', 'Sofia', 'Rodriguez', 'Garcia', 'TI', '990011223', 'Femenino', 4, '2013-10-30', 9),

-- Aula 10
(33, 'Samuel', 'David', 'Cruz', 'Hernandez', 'TI', '101122334', 'Masculino', 3, '2013-01-20', 10),
(34, 'Nicolas', 'Andres', 'Gomez', 'Diaz', 'TI', '112233446', 'Masculino', 2, '2013-03-25', 10),
(35, 'Lucia', 'Fernanda', 'Torres', 'Mora', 'TI', '223344557', 'Femenino', 4, '2013-05-14', 10),
(36, 'Cristian', 'Felipe', 'Perez', 'Ramirez', 'TI', '334455668', 'Masculino', 1, '2013-07-09', 10),
(37, 'Elena', 'Victoria', 'Moreno', 'Rojas', 'TI', '445566779', 'Femenino', 3, '2013-09-23', 10),

-- Aula 11
(38, 'Diego', 'Emmanuel', 'Garcia', 'Castillo', 'TI', '556677891', 'Masculino', 3, '2013-02-11', 11),
(39, 'Valentina', 'Sofia', 'Lopez', 'Gomez', 'TI', '667788902', 'Femenino', 4, '2013-04-17', 11),
(40, 'Adriana', 'Paula', 'Martinez', 'Diaz', 'TI', '778899013', 'Femenino', 2, '2013-06-03', 11),
(41, 'Sebastian', 'Gabriel', 'Ramirez', 'Rojas', 'TI', '889900124', 'Masculino', 1, '2013-07-18', 11),
(42, 'Angela', 'Maria', 'Vega', 'Rivera', 'TI', '990011235', 'Femenino', 3, '2013-08-24', 11),

-- Aula 12
(43, 'Eduardo', 'Luis', 'Diaz', 'Hernandez', 'TI', '101122346', 'Masculino', 2, '2013-09-10', 12),
(44, 'Sara', 'Isabel', 'Cruz', 'Garcia', 'TI', '112233458', 'Femenino', 3, '2013-10-22', 12),
(45, 'Jose', 'Alejandro', 'Perez', 'Mora', 'TI', '223344569', 'Masculino', 4, '2013-11-13', 12),
(46, 'Clara', 'Gabriela', 'Rojas', 'Torres', 'TI', '334455671', 'Femenino', 2, '2013-12-04', 12),
(47, 'Martin', 'Andres', 'Gomez', 'Diaz', 'TI', '445566782', 'Masculino', 1, '2013-01-30', 12);

-- Ejemplo de registros en AsistenciaTutor (si Asistio = TRUE, se toma asistencia de los estudiantes)
INSERT INTO asistenciaTutor (ID_AT, Asistio, Motivo, Id_Aula, Fecha) VALUES
(1, TRUE, NULL, 1, '2024-10-01'),  -- Clase regular para Aula 1, se tomará asistencia
(2, FALSE, 'Enfermedad del tutor', 2, '2024-10-01'),  -- Clase cancelada en Aula 2
(3, TRUE, NULL, 3, '2024-10-01'); -- Clase regular para Aula 3

-- Asistencia de los estudiantes en Aula 1 para el 2024-10-01 (AsistenciaTutor ID 1)
INSERT INTO asistencia (ID_Asis, Id_Std, Fecha, Asistio, Id_Aula) VALUES
(1, 1, '2024-10-01', TRUE, 1),  -- Ana Lopez asistió
(2, 2, '2024-10-01', FALSE, 1), -- Miguel Ramos no asistió
(3, 3, '2024-10-01', TRUE, 1),  -- Sofia Mora asistió
(4, 4, '2024-10-01', TRUE, 1);  -- Daniel Montoya asistió

-- Asistencia de los estudiantes en Aula 3 para el 2024-10-01 (AsistenciaTutor ID 3)
INSERT INTO asistencia (ID_Asis, Id_Std, Fecha, Asistio, Id_Aula) VALUES
(5, 9, '2024-10-01', TRUE, 3),  -- Jorge Martínez asistió
(6, 10, '2024-10-01', TRUE, 3), -- Paula Castaño asistió
(7, 11, '2024-10-01', FALSE, 3),-- Camilo Moreno no asistió
(8, 12, '2024-10-01', TRUE, 3); -- Sara Vega asistió

-- Notas para estudiantes en Aula 1 (Bloque lectivo 1)
INSERT INTO notas (Id_Notas, Nota_1, Nota_2, Nota_3, Nota_4, Id_Estudiante, Id_Bloque_electivo) VALUES
(1, 4.0, 3.5, 4.2, 4.8, 1),  -- Ana Lopez
(2, 3.0, 3.8, 3.7, 4.1, 2),  -- Miguel Ramos
(3, 4.5, 4.0, 3.9, 4.4, 3),  -- Sofia Mora
(4, 2.9, 3.1, 3.0, 3.5, 4),  -- Daniel Montoya

-- Notas para estudiantes en Aula 2 (Bloque lectivo 1)

(5, 3.5, 3.9, 4.2, 3.8, 5, 1),  -- Luis González
(6, 4.1, 4.0, 4.3, 4.5, 6, 1),  -- Maria Pineda
(7, 3.7, 3.4, 3.9, 4.0, 7, 1),  -- Jose Quintero
(8, 2.8, 3.5, 3.3, 3.7, 8, 1),  -- Laura Díaz

-- Notas para estudiantes en Aula 3 (Bloque lectivo 1)

(10, 4.0, 3.9, 4.2, 4.1, 10, 1), -- Paula Castaño
(11, 3.6, 3.8, 4.0, 4.3, 11, 1), -- Camilo Moreno
(12, 4.5, 4.3, 4.4, 4.7, 12, 1); -- Sara Vega


