-- phpMyAdmin SQL Dump
-- Database: `food_marcket`
-- JSR Fruit & Vegetable Company Full Schema & Seed Data

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+05:30";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `food_marcket` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `food_marcket`;

-- --------------------------------------------------------
-- Table structure for table `admin`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT 'Admin JSR',
  `mobile` varchar(15) DEFAULT '911234567890',
  `alternet_number` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT 'jsrveges@gmail.com',
  `password` varchar(100) DEFAULT 'admin123',
  `company_name` varchar(255) DEFAULT 'JSR Fruit & Vegetable Company',
  `company_logo` text DEFAULT NULL,
  `address` text DEFAULT 'Bemetara, Raipur & Nearby Areas, Chhattisgarh',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin` (`admin_id`, `name`, `mobile`, `email`, `password`, `company_name`, `address`) VALUES
(1, 'JSR Admin', '911234567890', 'jsrveges@gmail.com', 'admin123', 'JSR Fruit & Vegetable Company', 'Bemetara, Chhattisgarh, India');

-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL UNIQUE,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `status`) VALUES
(1, 'Fresh Vegetables', 'vegetables', 'Direct from our farm to your home fresh vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', 1),
(2, 'Fresh Fruits', 'fruits', 'Sweet, juicy and pesticide free fresh fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80', 1),
(3, 'Fresh Mushroom', 'mushroom', 'Hygienically cultivated oyster and button mushrooms', 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80', 1),
(4, 'Farm Fresh', 'farm-fresh', 'Organic greens and harvest fresh seasonal items', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80', 1);

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `unit` varchar(50) NOT NULL DEFAULT '1 kg',
  `weight_options` text DEFAULT NULL, -- JSON array of weight options e.g. ["200 gm", "500 gm", "1 kg"]
  `image` text NOT NULL,
  `gallery` text DEFAULT NULL, -- JSON array of image URLs
  `stock` int(11) NOT NULL DEFAULT 100,
  `rating` decimal(3,1) NOT NULL DEFAULT 4.8,
  `reviews_count` int(11) NOT NULL DEFAULT 128,
  `is_best_seller` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_prod_cat` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `original_price`, `unit`, `weight_options`, `image`, `gallery`, `stock`, `rating`, `reviews_count`, `is_best_seller`, `is_featured`, `status`) VALUES
(1, 1, 'Green Chilli', 'green-chilli', 'Fresh spicy green chillies handpicked directly from our local farm.', 60.00, 70.00, '250g', '["250g", "500g", "1 kg"]', 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80"]', 150, 4.9, 86, 1, 1, 1),
(2, 1, 'Tomato', 'tomato', 'Plump, ripe and naturally sun-grown red tomatoes, ideal for cooking and fresh salads.', 25.00, 30.00, '1 kg', '["500 gm", "1 kg", "2 kg"]', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"]', 350, 4.8, 142, 1, 1, 1),
(3, 1, 'Cucumber', 'cucumber', 'Crisp and hydrating green cucumbers harvested at peak freshness.', 30.00, 35.00, '1 kg', '["500 gm", "1 kg"]', 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80"]', 200, 4.7, 75, 1, 1, 1),
(4, 1, 'Capsicum', 'capsicum', 'Bright, shiny green bell peppers with a crisp crunch and mild sweet flavor.', 40.00, 50.00, '250g', '["250 gm", "500 gm", "1 kg"]', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80"]', 180, 4.8, 64, 0, 1, 1),
(5, 1, 'Cauliflower', 'cauliflower', 'Firm, snow-white cauliflower heads carefully selected and packed hygienically.', 35.00, 45.00, 'piece', '["1 piece", "2 piece"]', 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80"]', 90, 4.6, 52, 0, 1, 1),
(6, 1, 'Lady Finger', 'lady-finger', 'Tender and slender fresh lady fingers (okra) rich in dietary fiber.', 35.00, 45.00, '250g', '["250 gm", "500 gm", "1 kg"]', 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80"]', 140, 4.7, 61, 0, 1, 1),
(7, 1, 'Bottle Gourd', 'bottle-gourd', 'Light green, tender bottle gourd (lauki) perfect for wholesome curries and fresh juices.', 30.00, 40.00, '1 kg', '["1 kg", "2 kg"]', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80"]', 110, 4.7, 49, 0, 1, 1),
(8, 1, 'Brinjal', 'brinjal', 'Glossy purple eggplants with creamy flesh, ideal for roasting, stuffing, and curries.', 30.00, 38.00, '500g', '["500 gm", "1 kg"]', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"]', 130, 4.8, 58, 0, 1, 1),
(9, 1, 'Carrot', 'carrot', 'Crunchy orange carrots, sweet and rich in vitamin A, hand-harvested daily.', 30.00, 40.00, '1 kg', '["500 gm", "1 kg", "2 kg"]', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80"]', 220, 4.9, 93, 0, 1, 1),
(10, 3, 'Fresh Oyster Mushroom', 'fresh-oyster-mushroom', 'Premium farm grown Fresh Oyster Mushroom, 100% organic, pesticide free, high protein superfood with earthy texture.', 60.00, 67.00, '200 gm', '["200 gm", "500 gm", "1 kg"]', 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"]', 160, 5.0, 128, 1, 1, 1),
(11, 1, 'Potato', 'potato', 'Farm-fresh golden potatoes with smooth skins, great for roasting, boiling, and curries.', 20.00, 25.00, '1 kg', '["1 kg", "2 kg", "5 kg"]', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"]', 500, 4.8, 115, 1, 1, 1),
(12, 1, 'Onion', 'onion', 'Crisp and pungent red onions sourced from high quality harvest crops.', 22.00, 28.00, '1 kg', '["1 kg", "2 kg", "5 kg"]', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80"]', 450, 4.7, 102, 1, 1, 1),
(13, 2, 'Shimla Royal Apple', 'shimla-apple', 'Sweet, juicy and crunchy royal red apples sourced directly from Himachal orchards.', 120.00, 140.00, '1 kg', '["500 gm", "1 kg", "2 kg"]', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"]', 120, 4.9, 118, 1, 1, 1),
(14, 2, 'Farm Robusta Banana', 'farm-banana', 'Naturally ripened nutrient-rich bananas, perfect daily breakfast energy.', 45.00, 55.00, '1 Dozen', '["6 pcs", "1 Dozen", "2 Dozen"]', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80"]', 250, 4.8, 95, 1, 1, 1),
(15, 2, 'Nagpur Sweet Orange', 'nagpur-orange', 'Juicy Nagpur oranges packed with vitamin C and citrus refreshment.', 80.00, 95.00, '1 kg', '["1 kg", "2 kg"]', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80"]', 140, 4.7, 82, 0, 1, 1),
(16, 2, 'Ruby Pomegranate (Anar)', 'pomegranate', 'Deep red pomegranate pearls loaded with antioxidants and sweet juice.', 140.00, 165.00, '1 kg', '["500 gm", "1 kg"]', 'https://images.unsplash.com/photo-1541344999736-83eca872f241?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1541344999736-83eca872f241?auto=format&fit=crop&w=600&q=80"]', 90, 4.9, 74, 1, 1, 1),
(17, 2, 'Sweet Farm Papaya', 'sweet-papaya', 'Golden orange ripe sweet papaya, aids digestion and skin health.', 50.00, 60.00, '1 piece', '["1 piece (~1kg)", "2 piece"]', 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80"]', 80, 4.8, 67, 0, 1, 1),
(18, 2, 'Fresh Allahabad Guava', 'fresh-guava', 'Crunchy white pulp sweet guavas freshly picked from farm trees.', 60.00, 75.00, '1 kg', '["500 gm", "1 kg"]', 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=600&q=80"]', 110, 4.7, 53, 0, 1, 1),
(19, 3, 'Fresh White Button Mushroom', 'white-button-mushroom', 'Tender white button mushrooms, perfect for soups, pizzas, and curries.', 50.00, 60.00, '200 gm', '["200 gm", "400 gm"]', 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80"]', 140, 4.8, 91, 1, 1, 1),
(20, 3, 'Organic Milky Mushroom', 'milky-mushroom', 'Thick, fleshy milky mushrooms with high protein and delicate mushroom aroma.', 75.00, 90.00, '250 gm', '["250 gm", "500 gm"]', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"]', 70, 4.9, 42, 0, 1, 1),
(21, 4, 'Crisp Hydroponic Spinach (Palak)', 'hydroponic-spinach', 'Clean, soil-free hydroponic spinach leaves rich in iron and folates.', 25.00, 35.00, '250g', '["250g", "500g"]', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80"]', 130, 4.8, 67, 1, 1, 1),
(22, 4, 'Aromatic Fresh Coriander (Dhaniya)', 'fresh-coriander', 'Fragrant, lush green coriander sprigs for garnishing and chutney.', 15.00, 20.00, '100g', '["100g", "250g"]', 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80"]', 200, 4.9, 85, 1, 1, 1),
(23, 4, 'Refreshing Farm Mint (Pudina)', 'fresh-mint', 'Pungent garden mint leaves for refreshing mocktails and cooling raitas.', 15.00, 20.00, '100g', '["100g", "200g"]', 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80"]', 120, 4.7, 48, 0, 1, 1),
(24, 4, 'Organic Farm Ginger (Adrak)', 'fresh-ginger', 'Spicy, fibrous organic ginger roots fresh from soil harvesting.', 35.00, 45.00, '250g', '["250g", "500g", "1 kg"]', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80', '["https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80"]', 160, 4.8, 73, 1, 1, 1);

-- --------------------------------------------------------
-- Table structure for table `orders`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL UNIQUE,
  `customer_name` varchar(100) NOT NULL,
  `customer_mobile` varchar(15) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `delivery_address` text NOT NULL,
  `city` varchar(100) DEFAULT 'Bemetara',
  `pincode` varchar(10) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'COD',
  `status` enum('Pending','Confirmed','Packed','Out for Delivery','Delivered','Cancelled') NOT NULL DEFAULT 'Processing',
  `order_date` datetime NOT NULL DEFAULT current_timestamp(),
  `tracking_steps` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `orders` (`id`, `order_number`, `customer_name`, `customer_mobile`, `delivery_address`, `city`, `pincode`, `subtotal`, `delivery_fee`, `discount`, `total_amount`, `payment_method`, `status`, `order_date`) VALUES
(1, '#ORD1256', 'Ravi Verma', '9827112345', 'Ward No 4, Main Road, Bemetara', 'Bemetara', '491335', 650.00, 0.00, 0.00, 650.00, 'COD', 'Delivered', '2024-06-06 10:30:00'),
(2, '#ORD1255', 'Neha Patel', '9827122345', 'Civil Lines, Near Circuit House, Raipur', 'Raipur', '492001', 320.00, 0.00, 0.00, 320.00, 'COD', 'Processing', '2024-06-06 09:15:00'),
(3, '#ORD1254', 'Suresh Yadav', '9827132345', 'Shankar Nagar, Sector 2, Raipur', 'Raipur', '492007', 515.00, 0.00, 0.00, 515.00, 'COD', 'Delivered', '2024-06-05 18:40:00'),
(4, '#ORD1253', 'Kavita Sahu', '9827142345', 'Kisan Para, Bemetara', 'Bemetara', '491335', 280.00, 0.00, 0.00, 280.00, 'COD', 'Pending', '2024-06-05 14:10:00'),
(5, '#ORD1252', 'Aman Tiwari', '9827152345', 'Samta Colony, Raipur', 'Raipur', '492001', 730.00, 0.00, 0.00, 730.00, 'COD', 'Delivered', '2024-06-05 11:20:00');

-- --------------------------------------------------------
-- Table structure for table `order_items`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `product_image` text DEFAULT NULL,
  `weight_unit` varchar(50) NOT NULL DEFAULT '1 kg',
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `item_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_item` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `weight_unit`, `unit_price`, `quantity`, `item_total`) VALUES
(1, 1, 10, 'Fresh Oyster Mushroom', 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80', '200 gm', 60.00, 1, 60.00),
(2, 1, 2, 'Farm Fresh Tomato', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', '1 kg', 25.00, 2, 50.00),
(3, 1, 3, 'Fresh Cucumber', 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80', '1 kg', 20.00, 1, 20.00);

-- --------------------------------------------------------
-- Table structure for table `delivery_pincodes`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `delivery_pincodes`;
CREATE TABLE `delivery_pincodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pincode` varchar(10) NOT NULL UNIQUE,
  `area_name` varchar(150) NOT NULL,
  `city` varchar(100) NOT NULL,
  `delivery_charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estimated_delivery` varchar(100) NOT NULL DEFAULT 'Same Day / Next Morning',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `delivery_pincodes` (`id`, `pincode`, `area_name`, `city`, `delivery_charge`, `estimated_delivery`, `status`) VALUES
(1, '491335', 'Bemetara Central & Suburbs', 'Bemetara', 0.00, 'Under 2 Hours', 1),
(2, '492001', 'Raipur City Center, Civil Lines', 'Raipur', 0.00, 'Same Day Evening', 1),
(3, '492007', 'Shankar Nagar, Pandri', 'Raipur', 0.00, 'Same Day Evening', 1),
(4, '490006', 'Durg / Bhilai Region', 'Durg', 20.00, 'Next Morning Delivery', 1);

-- --------------------------------------------------------
-- Table structure for table `coupons`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL UNIQUE,
  `discount_type` enum('flat','percentage') NOT NULL DEFAULT 'flat',
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) NOT NULL DEFAULT 100.00,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `status`) VALUES
(1, 'JSR10', 'flat', 10.00, 100.00, 1),
(2, 'FREESHIP', 'flat', 25.00, 150.00, 1),
(3, 'SAVE20', 'percentage', 20.00, 300.00, 1);

-- --------------------------------------------------------
-- Table structure for table `customers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(15) NOT NULL UNIQUE,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `otp` varchar(10) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  `address` text DEFAULT NULL,
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `total_spend` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `customers` (`id`, `name`, `mobile`, `email`, `password`, `address`, `total_orders`, `total_spend`) VALUES
(1, 'Rakesh Sahu', '9827011111', 'rakesh.sahu@gmail.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvDk3YjW5mYVpXjK5jPz0VpP4vC7Dhe', 'Ward 10, Bemetara', 8, 3420.00),
(2, 'Anita Verma', '9827022222', 'anita.verma@gmail.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvDk3YjW5mYVpXjK5jPz0VpP4vC7Dhe', 'Civil Lines, Raipur', 6, 2150.00),
(3, 'Manish Patel', '9827033333', 'manish.patel@gmail.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvDk3YjW5mYVpXjK5jPz0VpP4vC7Dhe', 'Station Road, Raipur', 4, 1800.00),
(4, 'Pooja Sahu', '9827044444', 'pooja.sahu@gmail.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvDk3YjW5mYVpXjK5jPz0VpP4vC7Dhe', 'Subhash Nagar, Bemetara', 5, 2420.00),
(5, 'Sandeep Kumar', '9827055555', 'sandeep.k@gmail.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvDk3YjW5mYVpXjK5jPz0VpP4vC7Dhe', 'Kalyan Samiti, Raipur', 3, 1310.00);

-- --------------------------------------------------------
-- Table structure for table `customer_addresses`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `customer_addresses`;
CREATE TABLE `customer_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL DEFAULT 'Home',
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address_line` text NOT NULL,
  `landmark` varchar(150) DEFAULT NULL,
  `city` varchar(100) NOT NULL DEFAULT 'Bemetara',
  `pincode` varchar(10) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `type` enum('Home','Work','Other') NOT NULL DEFAULT 'Home',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_cust_addr` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `company_settings`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `company_settings`;
CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(150) NOT NULL DEFAULT 'JSR Fruit & Vegetable Company',
  `logo` mediumtext DEFAULT NULL,
  `tagline` varchar(255) DEFAULT '100% Farm Fresh Fruits, Vegetables & Mushrooms Direct to Your Doorstep',
  `phone` varchar(20) DEFAULT '+91 98270 12345',
  `alternate_phone` varchar(20) DEFAULT '+91 78980 54321',
  `email` varchar(100) DEFAULT 'care@jsrvegetables.com',
  `address` text DEFAULT 'Main Market Road, Near Krishi Mandi',
  `city` varchar(100) DEFAULT 'Bemetara',
  `state` varchar(100) DEFAULT 'Chhattisgarh',
  `pincode` varchar(10) DEFAULT '491335',
  `gst_number` varchar(50) DEFAULT '22AAAAA0000A1Z5',
  `free_delivery_above` decimal(10,2) DEFAULT 300.00,
  `announcement_text` varchar(255) DEFAULT '⚡ Super Fast Delivery across Bemetara, Raipur & Durg | Order before 6 PM for same-day delivery!',
  `whatsapp` varchar(20) DEFAULT '+919827012345',
  `facebook` varchar(255) DEFAULT 'https://facebook.com',
  `instagram` varchar(255) DEFAULT 'https://instagram.com',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `company_settings` (`id`, `company_name`, `tagline`, `phone`, `alternate_phone`, `email`, `address`, `city`, `state`, `pincode`, `gst_number`, `free_delivery_above`, `announcement_text`, `whatsapp`) VALUES
(1, 'JSR Fruit & Vegetable Company', '100% Farm Fresh Fruits, Vegetables & Mushrooms Direct to Your Doorstep', '+91 98270 12345', '+91 78980 54321', 'care@jsrvegetables.com', 'Main Market Road, Near Krishi Mandi', 'Bemetara', 'Chhattisgarh', '491335', '22AAAAA0000A1Z5', 300.00, '⚡ Super Fast Delivery across Bemetara, Raipur & Durg | Order before 6 PM for same-day delivery!', '+919827012345');

-- --------------------------------------------------------
-- Table structure for table `advertisements`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `advertisements`;
CREATE TABLE `advertisements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `badge` varchar(50) DEFAULT 'Special Offer',
  `image` text NOT NULL,
  `target_link` varchar(255) DEFAULT '/products',
  `position` enum('hero','sidebar','strip','popup') NOT NULL DEFAULT 'hero',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `advertisements` (`id`, `title`, `subtitle`, `badge`, `image`, `target_link`, `position`, `status`, `display_order`) VALUES
(1, 'Fresh Harvest Direct from Farm', 'Hand-picked organic green veggies, crispy salads & pure quality delivered under 2 hours', 'Today Special', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80', '/products?category=vegetables', 'hero', 1, 1),
(2, 'Premium Fresh Oyster Mushroom', 'High in protein, 100% naturally grown in temperature-controlled bio-farms in Bemetara', 'New Arrival', 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=1200&q=80', '/products?category=mushrooms', 'hero', 1, 2),
(3, 'Juicy Seasonal Fruits Feast', 'Naturally ripened mangoes, apples, papayas & pomegranates with maximum natural sweetness', 'Up to 30% Off', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80', '/products?category=fruits', 'strip', 1, 3);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

