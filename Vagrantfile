# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
	config.vm.box = "Centos"
	config.vm.box_url = "http://box.puphpet.com/centos64-x64-vbox43.box"
	config.vm.network :private_network, ip: "10.1.33.7"
	config.vm.provision :shell, :path => "bin/install.sh"

  #this sets the same setup as prod.
	config.vm.synced_folder ".", "/opt/production/"

  #proxy ngnix replies
  config.vm.network "forwarded_port", guest: 80, host: 8080

	#config.ssh.username = "vagrant"
	#config.ssh.password = "vagrant"
	#config.vm.provider "virtualbox" do |vb|
	#	vb.gui = true
	#end
end
