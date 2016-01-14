-- phpMyAdmin SQL Dump
-- version 4.2.8
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-01-2016 a las 06:27:52
-- Versión del servidor: 5.6.20
-- Versión de PHP: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `encuesta`
--
DROP DATABASE `encuesta`;
CREATE DATABASE IF NOT EXISTS `encuesta` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `encuesta`;

DELIMITER $$
--
-- Funciones
--
DROP FUNCTION IF EXISTS `getNextcustomseq`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `getNextcustomseq`(`sSeqname` VARCHAR(50), `sSeqGroup` VARCHAR(10)) RETURNS varchar(20) CHARSET utf8
BEGIN
	DECLARE nLast_Val INT;    
    set nLast_Val = (select seq_val from _sequence where seq_name = sSeqname And seq_group = sSeqGroup);
    IF nLast_Val Is Null Then
		Set nLast_Val = 1;
        Insert into _sequence (seq_name, seq_group, seq_val)
        values (sSeqname,sSeqGroup,nLast_Val);
	else
		set nLast_Val = nLast_Val +1 ;
		UPDATE _sequence 
SET 
    seq_val = nLast_Val
WHERE
    seq_name = sSeqname
        AND seq_group = sSeqGroup; 
	End If;
    set @ret = (select concat(sSeqGroup,'',lpad(nLast_Val,4,'0')));
RETURN @ret;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_sequence`
--
-- Creación: 13-12-2015 a las 20:56:40
--

DROP TABLE IF EXISTS `_sequence`;
CREATE TABLE IF NOT EXISTS `_sequence` (
  `seq_name` varchar(50) NOT NULL,
  `seq_group` varchar(10) NOT NULL,
  `seq_val` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `_sequence`
--

INSERT INTO `_sequence` (`seq_name`, `seq_group`, `seq_val`) VALUES
('SM', 'SM', 2),
('T', '0001', 1),
('Txt', 'T', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `custom_autonums`
--
-- Creación: 13-12-2015 a las 21:45:16
--

DROP TABLE IF EXISTS `custom_autonums`;
CREATE TABLE IF NOT EXISTS `custom_autonums` (
`id` int(11) NOT NULL,
  `seq_1` varchar(20) DEFAULT NULL,
  `seq_2` varchar(20) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `custom_autonums`
--

INSERT INTO `custom_autonums` (`id`, `seq_1`, `seq_2`) VALUES
(1, '1', ''),
(2, '15', '15');

--
-- Disparadores `custom_autonums`
--
DROP TRIGGER IF EXISTS `custom_autonums_bi`;
DELIMITER //
CREATE TRIGGER `custom_autonums_bi` BEFORE INSERT ON `custom_autonums`
 FOR EACH ROW BEGIN	
	SET new.seq_2 = new.seq_1;
/*	SET new.seq_1 = getNextCustomSeq("seq_1","001");*/
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbalumasig`
--
-- Creación: 12-01-2016 a las 02:11:07
--

DROP TABLE IF EXISTS `tbalumasig`;
CREATE TABLE IF NOT EXISTS `tbalumasig` (
`codigo_AlumAsig` int(11) NOT NULL,
  `Codigo_Alumnos` int(11) NOT NULL,
  `Codigo_Asignaturas` int(11) NOT NULL,
  `Periodo_Alumno` varchar(10) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbalumasig`
--

INSERT INTO `tbalumasig` (`codigo_AlumAsig`, `Codigo_Alumnos`, `Codigo_Asignaturas`, `Periodo_Alumno`) VALUES
(1, 16511975, 4101111, '20153'),
(2, 16511975, 4101121, '20161'),
(3, 16511975, 4101141, '20161'),
(4, 16511975, 4101261, '20161'),
(5, 16511975, 4102111, '20161'),
(6, 16511975, 4102121, '20161'),
(7, 16511975, 4103121, '20161');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbalumnos`
--
-- Creación: 08-01-2016 a las 02:51:16
--

DROP TABLE IF EXISTS `tbalumnos`;
CREATE TABLE IF NOT EXISTS `tbalumnos` (
  `Codigo_Alumnos` int(11) NOT NULL,
  `Nombre_Alumnos` varchar(100) CHARACTER SET latin1 NOT NULL,
  `perfil_usuario` int(5) NOT NULL,
  `carrera_Alumnos` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbalumnos`
--

INSERT INTO `tbalumnos` (`Codigo_Alumnos`, `Nombre_Alumnos`, `perfil_usuario`, `carrera_Alumnos`) VALUES
(16511975, 'Luis Flores', 2, 41);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbasignaturas`
--
-- Creación: 05-01-2016 a las 01:54:10
--

DROP TABLE IF EXISTS `tbasignaturas`;
CREATE TABLE IF NOT EXISTS `tbasignaturas` (
  `Codigo_Asignaturas` int(11) NOT NULL,
  `Nombre_Asignaturas` varchar(150) NOT NULL,
  `Semestre_Asignatura` int(11) DEFAULT NULL,
  `Carrera_Asignatura` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbasignaturas`
--

INSERT INTO `tbasignaturas` (`Codigo_Asignaturas`, `Nombre_Asignaturas`, `Semestre_Asignatura`, `Carrera_Asignatura`) VALUES
(0, '', NULL, NULL),
(4100006, 'CAPACITACIÓN PARA SERVICIO COMUNITARIO', 6, 41),
(4100107, 'PROYECTO I DE SERVICIO COMUNITARIO', 7, 41),
(4100208, 'PROYECTO II DE SERVICIO COMUNITARIO', 8, 41),
(4101111, 'ACTIVIDAD DE FORMACIÓN CULTURAL I', 1, 41),
(4101112, 'ACTIVIDAD DE FORMACIÓN CULTURAL II', 2, 41),
(4101121, 'LENGUAJE Y COMUNICACIÓN', 1, 41),
(4101122, 'INGLES I', 2, 41),
(4101141, 'MATEMATICAS I', 1, 41),
(4101223, 'INGLES II', 3, 41),
(4101224, 'INFORMÁTICA', 4, 41),
(4101232, 'GEOMETRÍA DESCRIPTIVA', 2, 41),
(4101233, 'ESTRUCTURAS I', 3, 41),
(4101235, 'ARQUITECTURA E IMPACTO AMBIENTAL', 5, 41),
(4101236, 'METODOLOGÍA DE LA INVESTIGACIÓN II', 6, 41),
(4101242, 'MATEMÁTICAS II', 2, 41),
(4101243, 'MATEMÁTICAS III', 3, 41),
(4101252, 'TALLER DE DISEÑO II', 2, 41),
(4101253, 'TALLER DE DISEÑO III', 3, 41),
(4101261, 'TALLER DE DISEÑO I (INTEGRAL) 4', 1, 41),
(4101324, 'ACONDICIONAMIENTO AMBIENTAL', 4, 41),
(4101333, 'ELECTIVA I (MARQUETERÍA)', 3, 41),
(4101334, 'ELECTIVA II (TOPOGRAFÍA PARA ARQ.)', 4, 41),
(4101335, 'ELECTIVA III (AUTOCAD 2D)', 5, 41),
(4101336, 'ELECTIVA IV (AUTOCAD 3D)', 6, 41),
(4101337, 'ELECTIVA V (SEMINARIO SOBRE LOS VALORES SOCIALES DEL ARQUITECTO Y DISEÑADOR)', 7, 41),
(4101338, 'ELECTIVA VI (SEMINARIO DE TESIS)', 8, 41),
(4101339, 'ELECTIVA VII (EXPEDIENTE PROFESIONAL)', 9, 41),
(4101347, 'PROYECTO DE ESTRUCTURAS', 7, 41),
(4101354, 'TALLER DE DISEÑO IV', 4, 41),
(4101355, 'TALLER DE DISEÑO V', 5, 41),
(4101356, 'TALLER DE DISEÑO VI', 6, 41),
(4101357, 'TALLER DE DISEÑO VII', 7, 41),
(4101358, 'TALLER DE DISEÑO VIII', 8, 41),
(4101379, 'TALLER DE DISEÑO IX (TRABAJO DE GRADO)', 9, 41),
(4101437, 'PASANTÌAS I', 7, 41),
(4101438, 'CONSERV. Y RESTAURACIÓN DE MONUMENTOS', 8, 41),
(4102111, 'EDUCACIÓN, SALUD FÍSICA Y DEPORTE I', 1, 41),
(4102112, 'EDUCACIÓN, SALUD FÍSICA Y DEPORTE II', 2, 41),
(4102121, 'ACTIVIDAD DE ORIENTACIÓN', 1, 41),
(4102232, 'DIBUJO', 2, 41),
(4102233, 'TEORÍA DE LA FORMA', 3, 41),
(4102334, 'HISTORIA DE LA ARQUITECTURA I', 4, 41),
(4102335, 'HISTORIA DE LA ARQUITECTURA II', 5, 41),
(4102336, 'HISTORIA DE LA ARQUITECTURA III', 6, 41),
(4102337, 'HISTORIA DE LA ARQUITECTURA IV', 7, 41),
(4102338, 'HISTORIA DE LA TECNOLOGÍA', 8, 41),
(4102339, 'ÉTICA Y DEONTOLOGÍA PROFESIONAL', 9, 41),
(4103121, 'METODOLOGÍA DE LA INVESTIGACIÓN I', 1, 41),
(4103334, 'ESTRUCTURAS II', 4, 41),
(4103335, 'CONSTRUCCIÓN II', 5, 41),
(4103336, 'CONSTRUCCIÓN III', 6, 41),
(4103337, 'URBANISMO', 7, 41),
(4104334, 'CONSTRUCCIÓN I', 4, 41),
(4104335, 'ESTRUCTURAS III', 5, 41),
(4104336, 'ESTRUCTURAS IV', 6, 41),
(4113610, 'TALLER DE DISEÑO X (TRABAJO DE GRADO)', 10, 41),
(4200006, 'CAPACITACIÓN PARA SERVICIO COMUNITARIO', 6, 42),
(4200107, 'PROYECTO I DE SERVICIO COMUNITARIO', 7, 42),
(4200208, 'PROYECTO II DE SERVICIO COMUNITARIO', 8, 42),
(4201111, 'ACTIVIDAD DE FORMACIÓN CULTURAL I', 1, 42),
(4201112, 'ACTIVIDAD DE FORMACIÓN CULTURAL II', 2, 42),
(4201121, 'LENGUAJE Y COMUNICACIÓN', 1, 42),
(4201122, 'INGLES I', 2, 42),
(4201123, 'INGLES II', 3, 42),
(4201133, 'ESTADÍSTICA', 3, 42),
(4201141, 'MATEMATICAS I', 1, 42),
(4201221, 'INTRODUCCION INGENIERÍA CIVIL', 1, 42),
(4201224, 'LABORATORIO DE FÍSICA', 4, 42),
(4201227, 'CONSTRUCCIÓN', 7, 42),
(4201232, 'ALGEBRA LINEAL', 2, 42),
(4201233, 'INFORMÁTICA', 3, 42),
(4201235, 'GEOLOGÍA', 5, 42),
(4201236, 'METODOLOGÍA DE LA INVESTIGACIÓN II', 6, 42),
(4201239, 'PUENTES', 9, 42),
(4201241, 'QUIMICA', 1, 42),
(4201242, 'MATEMATICAS II', 2, 42),
(4201243, 'MATEMÁTICAS III', 3, 42),
(4201244, 'MATEMÁTICAS IV', 4, 42),
(4201323, 'DIBUJO DE PROYECTOS', 3, 42),
(4201324, 'MECÁNICA DE FLUIDOS I', 4, 42),
(4201326, 'ADMINISTRACIÓN E INSPECCIÓN DE OBRAS', 6, 42),
(4201327, 'ELECTIVA IV (CARGA DE VIENTO)', 7, 42),
(4201328, 'ELECTIVA V (AVALÚOS)', 8, 42),
(4201329, 'HIGIENE Y SEGURIDAD INDUSTRIAL', 9, 42),
(4201333, 'MECÁNICA ESTÁTICA', 3, 42),
(4201335, 'ELECTIVA II (INS. ELECTRO-MECÁNICAS)', 5, 42),
(4201336, 'ELECTIVA III (EVALUACIÓN DE IMPACTO AMBIENTAL Y SOCIOCULTURAL)', 6, 42),
(4201337, 'CONCRETO II', 7, 42),
(4201338, 'TÉCNICAS DE CONSTRUCCIÓN', 8, 42),
(4201339, 'ELECTIVA VI (SISMOS)', 9, 42),
(4201344, 'MATERIALES DE CONSTRUCCIÓN', 4, 42),
(4201345, 'RESISTENCIA DE MATERIALES II', 5, 42),
(4201346, 'ESTRUCTURA I', 6, 42),
(4201347, 'ESTRUCTURA II', 7, 42),
(4201348, 'FUNDACIONES Y MUROS', 8, 42),
(4201449, 'PROYECTO DE INVESTIGACIÓN', 9, 42),
(4202111, 'EDUCACIÓN SALUD FÍSICA Y DEPORTES I', 1, 42),
(4202112, 'EDUCACIÓN, SALUD FÍSICA Y DEPORTES II', 2, 42),
(4202121, 'ACTIVIDAD DE ORIENTACIÓN', 1, 42),
(4202232, 'FÍSICA I', 2, 42),
(4202243, 'FÍSICA II', 3, 42),
(4202324, 'ELECTIVA I (SANEAMIENTO AMBIENTAL)', 4, 42),
(4202328, 'CONCRETO PRETENSADO', 8, 42),
(4202334, 'RESISTENCIA DE MATERIALES I', 4, 42),
(4202335, 'VÍAS DE COMUNICACIÓN I', 5, 42),
(4202336, 'INSTALACIONES SANITARIAS', 6, 42),
(4202337, 'HIDROLÓGICA', 7, 42),
(4202339, 'ÉTICA Y DEONTOLOGÍA PROFESIONAL', 9, 42),
(4202344, 'TOPOGRAFÍA', 4, 42),
(4202345, 'MECÁNICA DE FLUIDOS II', 5, 42),
(4202347, 'PAVIMENTOS', 7, 42),
(4202348, 'ACUEDUCTOS, CLOACAS Y DRENAJE', 8, 42),
(4203121, 'METODOLOGÍA DE LA INVESTIGACIÓN I', 1, 42),
(4203232, 'GEOMETRÍA DESCRIPTIVA', 2, 42),
(4203336, 'VÍAS DE COMUNICACIÓN II', 6, 42),
(4203337, 'MANTENIMIENTO', 7, 42),
(4203345, 'MECÁNICA DE SUELOS', 5, 42),
(4203348, 'PROYECTO ESTRUCTURA ACERO Y MADERA', 8, 42),
(4204232, 'DIBUJO', 2, 42),
(4204336, 'CONCRETO I', 6, 42),
(4214610, 'TRABAJO DE GRADO', 10, 42),
(4214810, 'PASANTÌAS', 10, 42);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbcarrera`
--
-- Creación: 05-01-2016 a las 01:28:54
--

DROP TABLE IF EXISTS `tbcarrera`;
CREATE TABLE IF NOT EXISTS `tbcarrera` (
  `Codigo_Carrera` int(10) NOT NULL,
  `Nombre_Carrera` varchar(150) NOT NULL,
  `Status_Carrera` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbcarrera`
--

INSERT INTO `tbcarrera` (`Codigo_Carrera`, `Nombre_Carrera`, `Status_Carrera`) VALUES
(41, 'ARQUITECTURA', 1),
(42, 'INGENIERIA  CIVIL ', 1),
(43, 'INGENIERIA ELÉCTRICA', 1),
(44, 'INGENIERIA  ELECTRONICA ', 1),
(45, 'INGENIERIA  INDUSTRIAL ', 1),
(46, 'INGENIERIA  DE  MANTENIMIENTO  MECANICO ', 1),
(47, 'INGENIERIA DE SISTEMAS', 1),
(48, 'INGENIERIA DE DISEÑO INDUSTRIAL ', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbcuestionario`
--
-- Creación: 23-11-2015 a las 02:38:25
--

DROP TABLE IF EXISTS `tbcuestionario`;
CREATE TABLE IF NOT EXISTS `tbcuestionario` (
`Codigo_Cuestionario` int(10) NOT NULL,
  `Nombre_Cuestionario` varchar(150) NOT NULL,
  `Status_cuestionario` binary(1) NOT NULL DEFAULT '0',
  `Comentarios_cuestionario` varchar(150) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbcuestionario`
--

INSERT INTO `tbcuestionario` (`Codigo_Cuestionario`, `Nombre_Cuestionario`, `Status_cuestionario`, `Comentarios_cuestionario`) VALUES
(1, 'qwevvv zsg werwdf', 0x30, 'qweqw  asfda  asdad'),
(2, 'etwes', 0x31, 'rhrthfghfg'),
(3, '', 0x30, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbcuestionario2`
--
-- Creación: 15-12-2015 a las 03:44:47
--

DROP TABLE IF EXISTS `tbcuestionario2`;
CREATE TABLE IF NOT EXISTS `tbcuestionario2` (
  `Codigo_Preguntas` varchar(10) NOT NULL,
  `Codigo_cuestionario` int(11) DEFAULT NULL,
  `pregunta_cuestionario2` varchar(45) DEFAULT NULL,
  `tipo_cuestionario2` int(11) DEFAULT NULL,
  `orden_cuestionario2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbcuestionario2`
--

INSERT INTO `tbcuestionario2` (`Codigo_Preguntas`, `Codigo_cuestionario`, `pregunta_cuestionario2`, `tipo_cuestionario2`, `orden_cuestionario2`) VALUES
('SM-0001', 1, 'dyisdrjdtyu', 2, 0),
('SM0002', 2, 'zejzdfzdfgz', 2, 0),
('T-0001', 1, 'w35yaerysr', 1, 0),
('T-0002', 1, 'dtidtjcghid', 1, 0),
('T0003', 2, 'asfsgdfg', 1, 0),
('T0004', 2, 'xdfhgxdfg', 1, 0);

--
-- Disparadores `tbcuestionario2`
--
DROP TRIGGER IF EXISTS `tbcuestionario2_BI`;
DELIMITER //
CREATE TRIGGER `tbcuestionario2_BI` BEFORE INSERT ON `tbcuestionario2`
 FOR EACH ROW BEGIN

 IF new.tipo_cuestionario2 = 1 Then
		SET new.Codigo_Preguntas = getNextCustomSeq("Txt","T");
	elseif new.tipo_cuestionario2 = 2 Then
		SET new.Codigo_Preguntas = getNextCustomSeq("SM","SM");
	End If;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbcuestionario3`
--
-- Creación: 12-01-2016 a las 02:42:02
--

DROP TABLE IF EXISTS `tbcuestionario3`;
CREATE TABLE IF NOT EXISTS `tbcuestionario3` (
`Codigo_cuestionario3` int(11) NOT NULL,
  `Codigo_cuestionario` int(10) DEFAULT NULL,
  `Codigo_Asignatura` int(10) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbcuestionario3`
--

INSERT INTO `tbcuestionario3` (`Codigo_cuestionario3`, `Codigo_cuestionario`, `Codigo_Asignatura`) VALUES
(1, 1, 4101111),
(2, 1, 4101121),
(3, 2, 4101261),
(4, 2, 4103121);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbprofesores`
--
-- Creación: 22-11-2015 a las 17:17:04
--

DROP TABLE IF EXISTS `tbprofesores`;
CREATE TABLE IF NOT EXISTS `tbprofesores` (
  `Codigo_Profesores` int(11) NOT NULL,
  `Nombre_Profesores` varchar(100) NOT NULL,
  `Apellido_Profesores` varchar(100) NOT NULL,
  `Status_Profesores` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbprofesores`
--

INSERT INTO `tbprofesores` (`Codigo_Profesores`, `Nombre_Profesores`, `Apellido_Profesores`, `Status_Profesores`) VALUES
(7924705, 'GIUSEPPE LUIGI', 'ZABATTA GALGANO', 1),
(18866847, 'AGUILAR AGUIAR', 'GISSEL DANIELA', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbusuarios`
--
-- Creación: 15-11-2015 a las 21:02:50
--

DROP TABLE IF EXISTS `tbusuarios`;
CREATE TABLE IF NOT EXISTS `tbusuarios` (
  `Codigo_Usuarios` varchar(30) NOT NULL,
  `Codigo_Display` varchar(100) NOT NULL,
  `Codigo_Pass` varchar(11) NOT NULL,
  `Codigo_Status` tinyint(1) NOT NULL,
  `perfil_usuario` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbusuarios`
--

INSERT INTO `tbusuarios` (`Codigo_Usuarios`, `Codigo_Display`, `Codigo_Pass`, `Codigo_Status`, `perfil_usuario`) VALUES
('q1', 'pruebas', 'q1', 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `_sequence`
--
ALTER TABLE `_sequence`
 ADD PRIMARY KEY (`seq_name`);

--
-- Indices de la tabla `custom_autonums`
--
ALTER TABLE `custom_autonums`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `seq_1` (`seq_1`), ADD UNIQUE KEY `seq_2` (`seq_2`);

--
-- Indices de la tabla `tbalumasig`
--
ALTER TABLE `tbalumasig`
 ADD PRIMARY KEY (`codigo_AlumAsig`), ADD KEY `fg_idx` (`Codigo_Alumnos`);

--
-- Indices de la tabla `tbalumnos`
--
ALTER TABLE `tbalumnos`
 ADD PRIMARY KEY (`Codigo_Alumnos`);

--
-- Indices de la tabla `tbasignaturas`
--
ALTER TABLE `tbasignaturas`
 ADD PRIMARY KEY (`Codigo_Asignaturas`);

--
-- Indices de la tabla `tbcarrera`
--
ALTER TABLE `tbcarrera`
 ADD PRIMARY KEY (`Codigo_Carrera`);

--
-- Indices de la tabla `tbcuestionario`
--
ALTER TABLE `tbcuestionario`
 ADD PRIMARY KEY (`Codigo_Cuestionario`), ADD UNIQUE KEY `Codigo_Cuestionario` (`Codigo_Cuestionario`);

--
-- Indices de la tabla `tbcuestionario2`
--
ALTER TABLE `tbcuestionario2`
 ADD PRIMARY KEY (`Codigo_Preguntas`);

--
-- Indices de la tabla `tbcuestionario3`
--
ALTER TABLE `tbcuestionario3`
 ADD PRIMARY KEY (`Codigo_cuestionario3`);

--
-- Indices de la tabla `tbprofesores`
--
ALTER TABLE `tbprofesores`
 ADD PRIMARY KEY (`Codigo_Profesores`);

--
-- Indices de la tabla `tbusuarios`
--
ALTER TABLE `tbusuarios`
 ADD PRIMARY KEY (`Codigo_Usuarios`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `custom_autonums`
--
ALTER TABLE `custom_autonums`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `tbalumasig`
--
ALTER TABLE `tbalumasig`
MODIFY `codigo_AlumAsig` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de la tabla `tbcuestionario`
--
ALTER TABLE `tbcuestionario`
MODIFY `Codigo_Cuestionario` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `tbcuestionario3`
--
ALTER TABLE `tbcuestionario3`
MODIFY `Codigo_cuestionario3` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
