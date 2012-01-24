CREATE TABLE IF NOT EXISTS `orderslog` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `creator_id` int(10) unsigned NOT NULL,
  `date` date NOT NULL,
  `staff_id` int(10) unsigned NOT NULL,
  `summ_start` DOUBLE( 10, 2 ) UNSIGNED NOT NULL DEFAULT '0',
  `summ_income` DOUBLE( 10, 2 ) UNSIGNED NOT NULL DEFAULT '0',
  `summ_inkasso` DOUBLE( 10, 2 ) UNSIGNED NOT NULL DEFAULT '0',
  `summ_rest` DOUBLE( 10, 2 ) UNSIGNED NOT NULL DEFAULT '0',
  `inkasso_dst` TEXT NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `staff_id` (`staff_id`),
  KEY `creator_id` (`creator_id`),
  KEY `date` (`date`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin ;

ALTER TABLE `orderslog`
  ADD CONSTRAINT `staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `creator_id` FOREIGN KEY (`creator_id`) REFERENCES `accounts` (`id`);

-- applied --

-- TODO: Delete the table `customers` (has relations with table `orders`)