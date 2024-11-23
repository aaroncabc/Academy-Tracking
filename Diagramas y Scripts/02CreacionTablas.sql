CREATE TABLE Anio_lectivo
(
 Id_Bloque_electivo int NOT NULL,
 Fecha_inicio       date NOT NULL,
 Fecha_fin          date NOT NULL,
 CONSTRAINT PK_9 PRIMARY KEY ( Id_Bloque_electivo ));

CREATE TABLE Persona
(
 Id_persona            int NOT NULL,
 Nombre                char(50) NOT NULL,
 Segundo_nombre        char(50) NULL,
 apellido1             char(50) NOT NULL,
 apellido2             char(50) NOT NULL,
 Tipo_identificacion   char(50) NOT NULL,
 Numero_documento      char(50) NOT NULL,  -- Cambié "Numero documento" a "Numero_documento"
 Direccion             char(50) NOT NULL,
 Celular               char(50) NOT NULL,
 Cargo                 char(50) NOT NULL,
 usuario               char(50) NOT NULL,
 pass_word              char(200) NOT NULL,
 CONSTRAINT PK_4 PRIMARY KEY ( Id_persona )
);

CREATE TABLE Institucion
(
 Id_institucion SERIAL int NOT NULL,
 Codigo         char(50) NOT NULL,
 Nombre         char(200) NOT NULL,
 Rector         char(200) NOT NULL,
 Localidad      char(100) NOT NULL,
 Barrio         char(100) NOT NULL,
 Direccion      char(100) NOT NULL,
 CONSTRAINT PK_2 PRIMARY KEY ( Id_institucion )
);

CREATE TABLE AsistenciaTutor
(
 ID_AT   int NOT NULL,
 Asistio bool NOT NULL,
 Motivo  varchar(500) NULL,
 Id_Aula int NOT NULL,
 CONSTRAINT PK_8 PRIMARY KEY ( ID_AT ),
 CONSTRAINT FK_5 FOREIGN KEY ( Id_Aula ) REFERENCES Aula ( Id_Aula )
);

CREATE TABLE Aula
(
 Id_Aula        int NOT NULL,
 Grupo          int NOT NULL,
 GrupoT         char(50) NULL,
 Jornada        char(50) NOT NULL,
 Grado          int NOT NULL,
 GradoT         char(50) NOT NULL,
 Id_persona     int NOT NULL,
 Id_institucion int NOT NULL,
 Año            int NOT NULL,
 CONSTRAINT PK_3 PRIMARY KEY ( Id_Aula ),
 CONSTRAINT FK_9 FOREIGN KEY ( Id_persona ) REFERENCES Persona ( Id_persona ),
 CONSTRAINT FK_10 FOREIGN KEY ( Id_institucion ) REFERENCES Institucion ( Id_institucion )
);

CREATE TABLE Estudiantes
(
 Id_Std                  int NOT NULL,
 Nombre                  char(50) NOT NULL,
 Segundo_nombre          char(50) NULL,
 apellido1               char(50) NOT NULL,
 apellido2               char(50) NOT NULL,
 Tipo_Identificacion     char(50) NOT NULL,  -- Cambié "Tipo_Identicficacion" a "Tipo_Identificacion"
 Numero_identificacion   char(50) NOT NULL,
 Genero                  char(50) NOT NULL,
 Estrato                 int NOT NULL,
 F_nacimiento            date NOT NULL,
 Id_Salon                int NOT NULL,
 CONSTRAINT PK_1 PRIMARY KEY ( Id_Std ),
 CONSTRAINT FK_1 FOREIGN KEY ( Id_Salon ) REFERENCES Aula ( Id_Aula )
);

CREATE TABLE Notas
(
 Id_Notas           int NOT NULL,
 Nota_1             float4 NOT NULL,
 Nota_2             float4 NOT NULL,
 Nota_3             float4 NOT NULL,
 Nota_4             float4 NOT NULL,
 Id_Estudiante      int NOT NULL,
 CONSTRAINT PK_5 PRIMARY KEY ( Id_Notas ),
 CONSTRAINT FK_2 FOREIGN KEY ( Id_Estudiante ) REFERENCES Estudiantes ( Id_Std ),
);

CREATE TABLE Horario
(
 Id_H               int NOT NULL,
 Hora_i             time NOT NULL,
 Hora_f             time NOT NULL,
 Dia_I              char(1) NOT NULL,
 Dia_text           char(50) NOT NULL,
 Id_Aula            int NOT NULL,
 CONSTRAINT PK_6 PRIMARY KEY ( Id_H ),
 CONSTRAINT FK_8 FOREIGN KEY ( Id_Aula ) REFERENCES Aula ( Id_Aula )
);

CREATE TABLE Asistencia
(
 ID_Asis int NOT NULL,
 Id_Std  int NOT NULL,
 Fecha   date NOT NULL,
 Asistio bool NOT NULL,
 Id_Aula int NOT NULL,
 CONSTRAINT PK_7 PRIMARY KEY ( ID_Asis ),
 CONSTRAINT FK_3 FOREIGN KEY ( Id_Std ) REFERENCES Estudiantes ( Id_Std ),
 CONSTRAINT FK_4 FOREIGN KEY ( Id_Aula ) REFERENCES Aula ( Id_Aula )
);
