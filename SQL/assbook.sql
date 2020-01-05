-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 05-01-2020 a las 20:30:11
-- Versión del servidor: 10.1.37-MariaDB-0+deb9u1
-- Versión de PHP: 7.0.33-0+deb9u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `project1`
--
CREATE DATABASE IF NOT EXISTS `project1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `project1`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comment`
--

CREATE TABLE `comment` (
  `id` int(10) UNSIGNED NOT NULL,
  `text` varchar(1000) NOT NULL,
  `date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `postId` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post`
--

CREATE TABLE `post` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `image` varchar(100) DEFAULT NULL,
  `mood` tinyint(4) NOT NULL,
  `place` varchar(100) DEFAULT NULL,
  `lat` decimal(10,7) DEFAULT NULL,
  `lng` decimal(10,7) DEFAULT NULL,
  `totalLikes` int(11) NOT NULL DEFAULT '0',
  `creatorId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `avatar` varchar(100) NOT NULL DEFAULT 'img/profile.jpg',
  `oneSignalId` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_followers_user`
--

CREATE TABLE `user_followers_user` (
  `userId_1` int(10) UNSIGNED NOT NULL,
  `userId_2` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_like_post`
--

CREATE TABLE `user_like_post` (
  `likes` tinyint(4) NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `postId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `user_like_post`
--
DELIMITER $$
CREATE TRIGGER `user_changes_like` AFTER UPDATE ON `user_like_post` FOR EACH ROW IF(OLD.likes = 0 AND NEW.likes = 1) THEN
   UPDATE post SET totalLikes = totalLikes + 2 WHERE id = OLD.postId;
ELSEIF(OLD.likes = 1 AND NEW.likes = 0) THEN
   UPDATE post SET totalLikes = totalLikes - 2 WHERE id = OLD.postId;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `user_deletes_like` AFTER DELETE ON `user_like_post` FOR EACH ROW IF(OLD.likes = 0) THEN
   UPDATE post SET totalLikes = totalLikes + 1 WHERE id = OLD.postId;
ELSE
   UPDATE post SET totalLikes = totalLikes - 1 WHERE id = OLD.postId;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `user_likes_post` AFTER INSERT ON `user_like_post` FOR EACH ROW IF(NEW.likes = 0) THEN
   UPDATE post SET totalLikes = totalLikes - 1 WHERE id = NEW.postId;
ELSE
   UPDATE post SET totalLikes = totalLikes + 1 WHERE id = NEW.postId;
END IF
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postId` (`postId`),
  ADD KEY `userId` (`userId`) USING BTREE;

--
-- Indices de la tabla `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9e91e6a24261b66f53971d3f96b` (`creatorId`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- Indices de la tabla `user_followers_user`
--
ALTER TABLE `user_followers_user`
  ADD PRIMARY KEY (`userId_1`,`userId_2`),
  ADD KEY `IDX_26312a1e34901011fc6f63545e` (`userId_1`),
  ADD KEY `IDX_110f993e5e9213a7a44f172b26` (`userId_2`);

--
-- Indices de la tabla `user_like_post`
--
ALTER TABLE `user_like_post`
  ADD PRIMARY KEY (`userId`,`postId`),
  ADD KEY `FK_8711902eef9ac9548e96d0dc77c` (`postId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `post`
--
ALTER TABLE `post`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_94a85bb16d24033a2afdd5df060` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `FK_9e91e6a24261b66f53971d3f96b` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `user_followers_user`
--
ALTER TABLE `user_followers_user`
  ADD CONSTRAINT `FK_110f993e5e9213a7a44f172b264` FOREIGN KEY (`userId_2`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_26312a1e34901011fc6f63545e2` FOREIGN KEY (`userId_1`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `user_like_post`
--
ALTER TABLE `user_like_post`
  ADD CONSTRAINT `FK_8711902eef9ac9548e96d0dc77c` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a113d5dd8f498fd9a71ac9eb102` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
