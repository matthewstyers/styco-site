# Styco-site dev environment install

## Prerequisites
- Install [homebrew](http://brew.sh/) and [homebrew cask](http://caskroom.io/) on your Mac.

## Installation steps
### 1. Install [Docker Toolbox](https://www.docker.com/docker-toolbox) with Homebrew Cask
```bash
brew cask install dockertoolbox
```

You shouldn't have to do anything once it's done installing, other than maybe enter your password.

**What's happening now?**
_Docker toolbox installs several docker-related command line tools we'll be using. Installing with homebrew cask will all insure that Docker Toolbox's only dependency, [VirtualBox](https://www.virtualbox.org/), is also downloaded._
### 2. Create a VM with docker-machine
```bash
docker-machine create --driver virtualbox --virtualbox-memory 2048 dev
```

**What's happening now?**
_Docker-machine allows you to quickly create a VM (virtual machine) with VirtualBox. The easiest way to explain the VM is that it's a fully functional computer inside your computer, which we will use to run a docker container. With this command, we're basically saying "Hey, Docker-Machine, use VirtualBox to spin up a small Linux computer, and go ahead and give it a little extra RAM, because we're gonna need it."_

### 3. Check your dev machine's ip address
```bash
docker-machine ip dev
```
**The IP address that's returned is where you'll point your browser to see your container in action.**

### 4. Move to the VM's environment
```bash
eval "$(docker-machine env dev)"
```

**What's happening now?**
_This command switches our terminal environment to use our new VM. Basically, we're telling our terminal that when we do something like, say, build a docker container, we actually want to do it inside our VM._


### 5. Clone the styco-site repo from Github
- point your terminal to where you're going to keep the source code locally, using `cd` and stuff, then,

```bash
git clone https://github.com/matthewstyers/styco-site.git
```

**What's happening now?**
_We're making a trackable copy of the source code on our local (host) machine. This source code also includes the instructions docker needs to build our container._

### 6. Get/create environment variables
- If you have access to the styers.co `.env` file, move it into the project root (the folder you just cloned from github).
- If you don't have access, simply rename the file in the project root called 'env-sample' to '.env'

### 7. Build your Docker container
- `cd styco-site` to get into the folder with the source code, then,
```bash
docker-compose up
```
 **What's Happening now**
_Docker is building a container (a light-weight, self-contained 'ecosystem' where our code lives) inside our VM. It's basically mimicking the production environment, so that when the code gets pushed up to its 'live' home, we don't have to worry about whether or not it will work. It's also creating a 'volume' (shared folder) for the source code, so we can edit the code on our computer and then see those changes in real time without having to rebuild the container._

Once the entire script finishes running, you should see something along the lines of
```bash
------------------------------------------------
KeystoneJS Started:
Styers.co is ready on port 5000
------------------------------------------------
```
at the end of your output. Point your browser to the IP you received in step 4, and you should see a working copy of styers.co in your browser.

## Tips
- use `ctrl + c` to kill your container, and `docker-compose up` to restart it.
- If you close your terminal session (or switch tabs), you'll need to re-run steps 3-4.
- use `docker-machine stop dev` to shut down your VM at the end of a session and `docker-machine start dev` to start it back up.
- Your ip address may change when you stop/start your machine.

## TODO
- [ ] move remaining static content to db
- [ ] prep for public hosting on docker hub
- [ ] complete redis config
- [ ] work out lingering nodemon issues
- [ ] config + docs for CircleCI
