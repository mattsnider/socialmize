import ssh, sys

password = sys.argv[1]

s = ssh.Connection(host = 'sextans.dreamhost.com', username = 'mesnider', password = password)
results = s.execute('./updateCam')

for result in results:
	print result