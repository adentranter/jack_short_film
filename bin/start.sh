#restart to ensure new config
sudo cp /opt/production/bin/ngnix.conf /etc/nginx/conf.d/default.conf
sudo service nginx restart

#npm install
cd /opt/production/
npm install

#start node
sudo node /opt/production/server.js
