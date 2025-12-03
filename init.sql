-- Create the database
CREATE DATABASE IF NOT EXISTS dit312_6703466
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE dit312_6703466;

-- Create table: videogame
CREATE TABLE `videogame` (
  `id` INT(11) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `genre` VARCHAR(120) NOT NULL,
  `description` TEXT,
  `coverimage` VARCHAR(255) DEFAULT NULL,
  `platform` VARCHAR(120) NOT NULL,
  `year` INT(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample video games
INSERT INTO `videogame`
(`id`, `title`, `genre`, `description`, `coverimage`, `platform`, `year`)
VALUES
(1, 'The Legend of Zelda: Breath of the Wild', 'Action-Adventure',
'Open-world game developed by Nintendo featuring exploration and puzzle-solving.',
'https://example.com/images/zelda.jpg', 'Nintendo Switch', 2017),

(2, 'Elden Ring', 'RPG',
'A dark fantasy action RPG created by FromSoftware with an open world.',
'https://example.com/images/eldenring.jpg', 'PC / PS5 / Xbox', 2022),

(3, 'Minecraft', 'Sandbox',
'A block-building sandbox game where players create and explore infinite worlds.',
'https://example.com/images/minecraft.jpg', 'All Platforms', 2011),

(4, 'GTA V', 'Action',
'An open-world crime adventure game set in Los Santos with three main characters.',
'https://example.com/images/gtav.jpg', 'PC / PS / Xbox', 2013),

(5, 'Fortnite', 'Battle Royale',
'A fast-paced online battle royale game with building mechanics.',
'https://example.com/images/fortnite.jpg', 'PC / PS / Xbox / Switch', 2017);

-- Add primary key + auto-increment
ALTER TABLE `videogame`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `videogame`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
