-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2023 at 04:34 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lsp-system`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Author` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `rack_Number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `Title`, `Author`, `subject`, `image_url`, `rack_Number`) VALUES
(2, 'poor dad rich dad', 'Tokosaki', 'economics', '1683404960341.jpg', 1),
(3, 'atomic habbits', 'Tokosaki', 'economics', '1683406521541.jpg', 1),
(4, 'poor dad rich dad', 'Tokosaki', 'economics', '1683406636816.jpg', 1),
(5, 'poor dad rich dad', 'Tokosaki', 'economics', '1683415029342.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0->normal user\r\n1->admin user',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0-> in-active\r\n1-> active',
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `token`) VALUES
(5, 'Nader Saeed', 'nader.saeed@gmail.com', '$2b$10$Sqfo.8q3w93C0WcFXHQggOBd4NXtow7UBDYaZex0v129dDyURmJlq', 0, 0, ''),
(6, 'Ziad Ahmed', 'ziad.ahmed.2020012@gmail.com', '$2b$10$mkpouyzvYIhDFKbsXE9u8ORh07HCnIGLR6YK3qHxQwqPiorECDJ4u', 1, 42, ''),
(7, 'fatma saed', 'fatma_saeed@gmail.com', '$2b$10$c0XbHDk34PXjgX9phLNcbONRWrSC1Jd0zRdcrayrO29ctHNZtT94m', 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `user_borrow_book`
--

CREATE TABLE `user_borrow_book` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `books_id` int(11) NOT NULL,
  `borrow_request` tinyint(1) NOT NULL COMMENT '0->requested\r\n1->cancel requested'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_borrow_book`
--

INSERT INTO `user_borrow_book` (`id`, `users_id`, `books_id`, `borrow_request`) VALUES
(1, 6, 2, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_borrow_book`
--
ALTER TABLE `user_borrow_book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `books_constrain_id` (`books_id`),
  ADD KEY `user_constrain_id` (`users_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_borrow_book`
--
ALTER TABLE `user_borrow_book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_borrow_book`
--
ALTER TABLE `user_borrow_book`
  ADD CONSTRAINT `books_constrain_id` FOREIGN KEY (`books_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_constrain_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
