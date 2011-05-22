from __future__ import with_statement
from os import path
from datetime import datetime

#from core import setup_env

from fabric.api import local, cd, run as remote_run, env, settings, get
from fabric.contrib.console import confirm
from fabric.decorators import hosts

ROOT_DIR = path.abspath(path.dirname(__file__))
REMOTE_DIRS = ['petfriends.mattsnider.com', 'socialmize.mattsnider.com']

def prod():
	env.user = 'mesnider'
	env.hosts = ['sextans.dreamhost.com']

def update_local_repo():
	with cd(ROOT_DIR):
		local('git pull origin master')

def push_repo_changes():
	with cd(ROOT_DIR):
		local('git push origin master')

def update_remote():
	for dir in REMOTE_DIRS:
		with cd(dir):
			remote_run('git pull origin master')

def push():
	"""
	Pushes local changes to remote repositories on dreamhost.
	"""
#	update_local_repo()
#	test()
	push_repo_changes()
	update_remote()