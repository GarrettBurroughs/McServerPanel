# McServerPanel
A simple, lightweight and open source web console for monitoring and controlling Minecraft servers

### Inspiration
The initial inspiration came from this project after I found no easy solution for managing my small minecraft server for me and my friends
that was free and open source. There are a variety of different automated scripts for installing different minecraft versions, but none that
allowed for easy managment through a web interface. The goal of this project is to allow for an easier mechanism of controlling a small minecraft
server rather than constantly sshing into the host machine and navigating through the command line. 

## How It Works
This project is primarily written in Javascript using a Nodejs backend and Vue for the client side.
The server is run using node's `child_process` library to run the server startup scripts on the host machine.

## Features
 - View console messages 
 - Execute console commands
 - Start/Stop Server
 - Create a new server based on official released JARs
 - Create a custom server based on a modded JAR
 - Easily switch between servers
 
### Planned Features
 - Edit server configuration files
 - Create schedule jobs 
 - Backup and Delete servers
 - Security Features 

