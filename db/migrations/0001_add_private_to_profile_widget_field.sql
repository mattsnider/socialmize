-- Adding the `private` field to `profile_widget_field`
ALTER TABLE `profile_widget_field` ADD COLUMN `private` enum('false','true') NOT NULL DEFAULT 'false';