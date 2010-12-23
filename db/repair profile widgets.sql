# SHOW INDEX FROM profile_widget_field_what_makes_matt_awesome;
# SHOW TABLE STATUS FROM cameleon LIKE 'profile_widget_field_available_days'
	

# drop foreign keys from tables
ALTER TABLE profile_widget_field_current_status DROP FOREIGN KEY profile_widget_field_city_fk;
ALTER TABLE profile_widget_field_current_status DROP FOREIGN KEY profile_widget_field_city_pwf_fk;
ALTER TABLE profile_widget_field_current_status DROP FOREIGN KEY profile_widget_field_city_searchable_fk;

# drop keys from tables
DROP INDEX profile_widget_field_attend_test_select_fk ON profile_widget_field_test_select;
DROP INDEX profile_widget_field_attend_pwf_fk ON profile_widget_field_test_select;
DROP INDEX profile_widget_field_attend_searchable_fk ON profile_widget_field_test_select;

# fix table structure
#manual
ALTER TABLE `profile_widget_field_test_select` ENGINE = InnoDB;
ALTER TABLE `pwf_test_select` ENGINE = InnoDB;

# add keys and foreign keys back
ALTER TABLE 	   `profile_widget_field_test_select`
		   ADD KEY `profile_widget_field_test_select_searchable_fk` (`searchable_id`), 
	ADD CONSTRAINT `profile_widget_field_test_select_searchable_fk` FOREIGN KEY (`searchable_id`) REFERENCES `searchable` (`id`);
ALTER TABLE 	   `profile_widget_field_test_select`
		   ADD KEY `profile_widget_field_test_select_pwf_fk` (`profile_widget_field_id`), 
	ADD CONSTRAINT `profile_widget_field_test_select_pwf_fk` FOREIGN KEY (`profile_widget_field_id`) REFERENCES `profile_widget_field` (`id`);
ALTER TABLE 	   `profile_widget_field_test_select`
		   ADD KEY `profile_widget_field_test_select_fk` (`what_makes_matt_awesome_id`), 
	ADD CONSTRAINT `profile_widget_field_test_select_fk` FOREIGN KEY (`what_makes_matt_awesome_id`) REFERENCES `pwf_what_makes_matt_awesome` (`id`);