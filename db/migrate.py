import MySQLdb, os, glob, re, sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

from migrate_db import *

PATH = 'migrations'

CREATE_TABLE_SQL = """
 CREATE TABLE `%s`.`%s` (
`id` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`execute_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
`script_name` VARCHAR( 60 ) NOT NULL
) ENGINE = InnoDB
"""

# find the migration # from the script name
def _get_number(filename):
	m = re.search('\d+', filename)
	return m.group(0)

# find the last run script in the DB
conn = MySQLdb.connect (host = HOST_NAME,
						user = USER_NAME,
						passwd = USER_PASS,
						db = DATABASE)

cursor = conn.cursor()

cursor.execute("SHOW TABLES LIKE '%s'" % TABLE_NAME)

if not cursor.fetchone():
	cursor.execute(CREATE_TABLE_SQL % (DATABASE, TABLE_NAME))

cursor.execute('SELECT `script_name` FROM `%s` ORDER BY `id` DESC' % TABLE_NAME)
rs = cursor.fetchone()

if rs:
	last_script_num = int(_get_number(rs[0]))
	process_scripts = False
else:
	last_script_num = 0
	process_scripts = True

# order the files by their migration #
fileset = []
sortset = []
filemap = {}

for filename in glob.glob( os.path.join(BASE_DIR, PATH, '*.sql') ):
	key = _get_number(filename)

	if int(key) > last_script_num:
		sortset.append(key)
		filemap[key] = filename

sortset.sort()
#print sortset

rx = re.compile(r'\n(.*?);', re.DOTALL)

try:
	#iterate over the files after the last migration script run
	for key in sortset:
		filename = filemap[key]
		# execute queries from file
		file = open(filename,"r")
		filename = filename[len(os.path.join(BASE_DIR, PATH)) + 1:]
		print filename
		sql = file.read()
		file.close()
	#	print sql

		stmts = rx.findall(sql)

		for stmt in stmts:
			cursor.execute(stmt)

		cursor.close()
		# notify database that migration was run
		cursor = conn.cursor()
#		print "INSERT INTO `%s` (`script_name`) VALUES ('%s')" % (TABLE_NAME, filename)
		cursor.execute( "INSERT INTO `%s`.`%s` (`script_name`) VALUES ('%s');" % (DATABASE, TABLE_NAME, filename) )
		cursor.execute("commit")
except Exception as e:
	sys.stderr.write('%s\n' % e)
	exit()

cursor.close()
conn.close()