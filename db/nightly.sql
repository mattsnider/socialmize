# clean up outdated notifications
UPDATE `notification` SET `status`="deleted" WHERE `type`="news" AND `related_id` IN (SELECT `id` FROM `news` WHERE `expires` < NOW());