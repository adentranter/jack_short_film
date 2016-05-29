#become rootz
#:sudo -i

#disable firewall and whatnot.
chkconfig iptables off
service iptables stop

#install mysql
sudo yum -y install mysql mysql-server

#auto start
chkconfig --levels 235 mysqld on
/etc/init.d/mysqld start

#set password
mysqladmin -u root password "password"
#create db
mysql -u root -ppassword -e "CREATE database database1;"


#install node
curl --silent --location https://rpm.nodesource.com/setup | bash -
sudo yum -y install nodejs;

node --version

#setup ngnix repo
sudo yum -y install epel-release

#install ngnix
sudo yum -y install nginx
#ensure auto start ngnix
sudo chkconfig nginx on

