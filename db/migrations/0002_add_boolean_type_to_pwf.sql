-- adding the `boolean` value to `type` for the `profile_widget_field`

ALTER TABLE `profile_widget_field` MODIFY COLUMN `type` enum('autocomplete', 'boolean', 'daterange','image','list','portrait','textarea','text','select','datetime') NOT NULL;
ALTER TABLE `profile_widget_field` MODIFY COLUMN `data_table` enum('boolean', 'daterange','datetime','select','text','textarea') NOT NULL;

CREATE TABLE `profile_widget_field_boolean` (
  `created` datetime NOT NULL,
  `ikey` varchar(75) NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `profile_widget_field_id` mediumint(8) unsigned NOT NULL,
  `searchable_id` int(11) unsigned NOT NULL,
  `value` enum('true', 'false') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `normal` (`profile_widget_field_id`,`searchable_id`),
  KEY `profile_widget_field_text_searchable_fk` (`searchable_id`),
  KEY `profile_widget_field_text_pwf_fk` (`profile_widget_field_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;