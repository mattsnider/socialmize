#!/bin/bash

suffix=$(date +%F)
mysqldump -upma -pgreen-00FF00 -h mysql.mattsnider.com cameleon | gzip > ~/cameleon.mattsnider.com/db/backup/$suffix.sql.gz