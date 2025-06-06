# Setting up a Raspberry Pi in kiosk mode on a touchscreen

> **Warning**: [Goose chasing](https://www.urbandictionary.com/define.php?term=goose%20chase) ahead!!!  
The below 'manual' is by no means fool-proof as there are wildly different versions of RPi devices and OS'es abound.

**Goal**: Start a somewhat recent Raspberry Pi device with browser in kiosk mode on the local (DSI) touchscreen display to show the wiim-now-playing app.

Which type of Raspberry Pi should I use? [See the Raspberry Pi requirements.](RPi-Requirements.md)

> For setting up a headless Raspberry Device see: [Setting up a Raspberry Pi in headless mode](RPi-Headless.md)

## Usage scenarios

**Scenario 1**: You want to have a passive screen on your desk or near your stereo, that when something catches your ears you want to know what it is that is playing now.

**Scenario 2**: You work from home, having some nice tunes playing to keep you company/focussed. Then suddenly you are interrupted, like someone calling, and you want to mute/pause the WiiM device immediately.  
I.e. faster than reaching for your phone, opening the WiiM Home app and pause. Or reach for your amp and turn down the volume.

**Scenario 3**: You are going through some playlists while hanging back. Then you're not into one song and want to skip quickly. Or you want to play that song again.

## **The 'works-on-my-machine' short-hand-guide:**

1. Prepare a Raspberry Pi with an attached touchscreen.  
   Make sure you know how to activate the screen before anything else.  
   Test with a regular RPi OS to see if the screen works (both video and touch).
2. Prepare a Raspberry Pi OS (Bullseye - legacy) sd-card without a desktop.  
   Make sure you can see a command prompt on the touchscreen.
3. Install the 'Lite' version with LXDE (see the blockdev.io link) is advised.  
   Note: LightDM apparently does not like autologin and the Fat version is overkill.
4. Add the chromium-browser with minimal desktop dependencies (LXDE).
5. Whole lot of Googling to fix 'this-and-that'.  

For a more step-by-step process read below.

## 1. Prepare a Raspberry Pi with a touchscreen

First, make sure that your touchscreen works properly i.e. you have an image output and the touch input works.

1. Connect you Raspberry Pi to the touchscreen by following the instructions of the manufacturer.
2. Grab a copy of [Raspberry Pi OS](https://www.raspberrypi.com/software/), with the desktop, to check whether your RPi works with the screen attached. Use the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) to download and write the OS to an SD card and insert the card into you RPi.
3. If the screen displays the Raspberry Pi OS Desktop, you are good to go.  
   If it doesn't display a desktop, please follow the manufacturers manual in order to activate the screen. You may need additional drivers for screen output.  
   Please take note of the instructions to enable the display as you will need them again later.

## 2. Prepare an SD card with Raspberry Pi OS Lite

Depending on the previous results you could use the latest version of RPi OS, Bookworm (February 2024). However it may not play very nice with some touchscreens. Read the screen manufacturers documentation to see if it can be enabled on the latest OS version.

Otherwise try the legacy version (Bullseye) or older. Reverting to Bullseye seems a safe option if you run into trouble.

1. Use the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) to download a version of Raspberry Pi OS **Lite**. As we won't be needing a full desktop environment.
2. Choose your SD card, the one you've previously used to test your screen. After selecting the SD card to use, it will ask you whether you would like to apply customisations. Choose Edit Settings:  
   ![Settings](../assets/Screenshot%202024-02-13%20234421.png)
3. In the General tab set the hostname of your RPi. Keep it short, simple and unique, you'll thank yourself later. In the example below I've used _wnp.local_, feel free to name it anyway you like.  
   Please also set a username and password as you will need those to connect to and setup later.  
   ![Settings](../assets/Screenshot%202024-02-13%20235651.png)  
   Also, if you are going to use WiFi, this is the moment to tell the RPi those details.
4. In the Services tab select Enable SSH and use the default 'use password authentication'. Please remember the username and password you've set in the General tab!  
   ![Settings](../assets/Screenshot%202024-02-14%20000706.png)  
5. Now press Save and Click Yes to apply the customisations. Now create the SD card and wait for it to finish.
6. After finishing put the SD card in your RPi.

## 3. Configure your Raspberry Pi OS through SSH

After powering up the RPi with Raspberry Pi OS Lite you'll find yourself at a command prompt or a blank screen. Just let it settle a bit as during the first startup, after you've created the new SD card, the OS will need to prepare itself which will take some time.

Note: you can also connect a keyboard/mouse/computerscreen to the Raspbery Pi in order to conduct the next steps. But, presuming you already have a computer on which you've prepared the SD card, might as well use that to connect over SSH.

1. Start a command prompt. In these examples I am using PowerShell 7 on Windows 11. On a Mac you can use the Terminal.
2. At the command prompt type ``ssh username@servername.local``. Where ``username`` is **your username** that you've defined in the previous steps. And ``servername`` is the name you've set as your **hostname**.  
   In the example below I've used _caspar@wnp.local_.
   ![Settings](../assets/Screenshot%202024-02-14%20002224.png)  
3. At the first time connecting it will ask if you want to continue. Type ``yes`` and press Enter.
4. Every time we will connect to the RPi this question will no longer be asked. You can then use your password directly to connect:  
   ![Settings](../assets/Screenshot%202024-02-14%20002718.png)  
5. After connecting to your RPi over SSH you'll be greeted with a command prompt from the RPi server, like:  

   ```bash
   username@server:~ $
   ```

   Again, the username and servername are the ones you've defined earlier.  
   Congrats! It is working.

### Configure the RPi with sudo raspi-config

First we will configure and update the Raspberry Pi itself.

1. At the command prompt type:

   ```bash
   sudo raspi-config
   ```

2. You'll be greeted by the Software Configuration Tool menu:  
   ![Settings](../assets/2024-02-14.png)  
   _Use the arrow keys on your keyboard to navigate this menu_
3. From the menu select **1 System Options** > **S5 Boot / Auto Login**.  
   Select **B2 Console Autologin** to automatically login at the command prompt on startup.
4. Whether you need to set anything from **2 Display Options** or **3 Interface Options** is up to your specific hardware. Normally you would not need to set anything here. The same goes for options 4 and 5.  
   _However I've had one instance that I needed to set the 'WLAN Country' (under the Localisation Options) 2 times before it remembered it correctly and accepted the WiFi connection._
5. Under **6 Advanced Options** you may want to use **A1 Expand Filesystem**, in order for the entire capacity of the SD card to be recognised after reboot.
6. Choose **8 Update** to get all of the latest updates to the system, while you're at it.
7. Finally select Finish (arrow right key) and press Enter.

Maybe now is a good time to do a reboot of the RPi. Type at the command prompt:

```bash
sudo reboot
```

And wait for the Raspberry Pi to return to the command prompt, before you reconnect over ssh with.

```powershell
ssh username@server.local
```

### Configure the touchscreen

At this step you still may not have an image on your touchscreen display. Please have a look at the manufacturers documentation in order to enable the display through the command prompt. You may need to configure some drivers of config files.

In my example I'm using a Raspberry Pi 4 with the official Raspberry Pi touchscreen. And if you're familiar with those, the screen output is upside-down by default. So let's rectify that. For this we refer to [Changing the screen orientation](https://www.raspberrypi.com/documentation/accessories/display.html#changing-the-screen-orientation) documentation by Raspberry Pi.

1. Connect to the Raspberry Pi over SSH: ``ssh username@servername.local``
2. Start editing the cmdline.txt file by typing at the command prompt:  

   ```bash
   sudo nano /boot/firmware/cmdline.txt
   ```

3. At the end of the line add:

   ```bash
    video=DSI-1:800x480@60,rotate=180
   ```

   **NOTE: there is a space before video= and after anything that is already on that line!**  
   _We will use rotate=180 to put the display the right way up._

4. Use CTRL+X -> Y to confirm -> Enter to confirm the filename.  
   The display rotation change should now have been set.
5. However the touch input should also be rotated. Type the following to edit the config.txt file:

   ```bash
   sudo nano /boot/firmware/config.txt
   ```

6. Find the line that says ``display_auto_detect=1``. Add a # in front to comment out that line.  
   Then add a line that says ``dtoverlay=vc4-kms-dsi-7inch,invx,invy``. So that it looks like this:  
   ![alt text](../assets/Screenshot%202024-02-14%20012500.png)
7. Then use CTRL+X -> Y to confirm -> Enter to confirm the filename.
8. In order for these changes to take effect we need to do a reboot:

   ```bash
   sudo reboot
   ```

Wait for the RPi to reboot. It may start upside-down first, but it will right itself eventually...

![Touchscreen rotated](../assets/IMG_3691.jpg)

**Success!**

## 4. Add the wiim-now-playing solution to the RPi

In order to host the wiim-now-playing solution we will need to install Node.js and NPM first! Do not use the default ``apt install`` method as it will install a very old version of Node.js, without NPM.

### Update all packages

Now that the Raspberry Pi is running it is a good idea to do an update of all the installed packages, and possibly any firmware.

1. Make an SSH connection to the RPi.
2. Run the following commands in sequence:

   ```bash
   sudo apt update
   sudo apt upgrade
   ```

   _If any new packages are found, install them! It may take a while at the first time._  
   _You may run these commands again, directly after or at any moment later, to make sure everything has been updated._  
   _Optionally, you also may do a restart of the Raspberry Pi with a ```sudo reboot``` after the upgrade of the packages is done_

### Installing Node.js LTS version

Refer to the <https://deb.nodesource.com/> installation instructions instead as it will install the latest LTS version (20.x) of Node.js.

1. Make an SSH connection to the RPi.
2. Run the following commands in sequence:

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
   sudo apt-get install -y nodejs
   ```

   _This will configure and install Node.js automatically on the device_

3. After the installation is done you can check whether the correct version of node and npm are installed. Running:  
   ``node -v`` should say version 20-something.  
   ``npm -v`` should say version 10-something.  
   _Higher is good, lower is bad._

### Installing Git

Installing the wiim-now-playing app can be as simple as downloading the zip from Github (using curl). Then unzip to a folder, run ``npm install`` and ``node server/index.js``. If so, skip the following Git steps, you're good to go. although you may miss the option to ```git pull``` any updates released afterwards.

In this case we'll be using Git to clone the wiim-now-playing repo in order to always be able to get the latest version easily.

1. Make an SSH connection to the RPi.
2. Git could already be installed with your Raspberry Pi OS.  
   Run the following command to install and make sure:  

   ```bash
   sudo apt install git
   ```

3. You can check wich version of Git you have gotten now:  
   ``git -v`` should tell you which version you have. Version 2.30-something or higher is fine.

### Install wiim-now-playing using Git

Now that we are sure that we have Git and Node.js available we can get the wiim-now-playing sources from Github and install it.

1. Make an SSH connection to the RPi.
2. Make sure that you are in your home folder. You can tell by the command prompt line showing a ~ (tilde) sign, like ``user@server:~ $``.  
   If not, then use ``cd ~`` to go to your home folder.  
   _If your are so inclined to put the files anywhere else, feel free to do so._
3. Run the following command to clone the wiim-now-playing repo:  

   ```bash
   git clone https://github.com/cvdlinden/wiim-now-playing.git
   ```

4. Then go into the wiim-now-playing folder using: ``cd wiim-now-playing/``.
5. Using ``ls -la`` will give you the contents of the folder. It should contain a bunch of files and folders, that correspond to the Github repo.
6. Before starting the wiim-now-playing app you need to tell it once to get all of the dependencies, using:  

   ```bash
   npm install
   ```

   _It may tell you about some vulnerabilities. Those can be ignored for now as they seem to not be infuential currently. Fixing those will break the app though._  
   _If it tells you there are errors, then please follow the instructions._

7. Now we can start the wiim-now-playing app in order to test if it works. Use:  

   ```bash
   node server/index.js
   ```

8. If you are lucky it will start without question.  
   If not, check the next chapter!

### Enable Node.js to run on port 80

By default Raspberry Pi Os (Debian) does not like claiming port 80, the default WWW server port, as a non-root user. In order to claim port 80 as a non-root/sudo user, use ([found here](https://stackoverflow.com/questions/60372618/nodejs-listen-eacces-permission-denied-0-0-0-080)):

```shell
sudo apt install libcap2-bin 
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
```

Now you can try and run the wiim-now-playing app by using:

```bash
node server/index.js
```

If this doesn't work then please change the port variable in ./server/index.js, using ``nano wiim-now-playing/server/index.js``.  
Good candidates for alternative ports are: 8000, 8080, 5000 or 3000. See what works best for you.

### Test the wiim-now-playing app

The Raspberry Pi will not show any app yet on its screen, as we haven't configured it yet. However if you've started node correctly it will tell you it is running on 'localhost:80'.

1. Open up a browser on your computer.
2. Use the following address to see the app: ``servername.local``  
   Where servername is the hostname you set earlier. For example ``wnp.local``.
3. You should now see the app working:  
   ![Touchscreen rotated](../assets/2024-02-14%20(1).png)  
   Obviously you need to tell the Wiim device to play something first, use your WiiM Home app for that.

### Updating the app through Git

If there's a new version of the app you can easily update it through Git.

1. Make an SSH connection to the RPi.
2. Go into the wiim-now-playing folder: ``cd wiim-now-playing/``
3. Use the ``git pull`` command to get the latest version of the app.  
   It will tell you whether you already are up-to-date or automatically download the latest version/additions.
4. You can then go to the app settings and reload the UI to check the latest UI changes.  
   But for a proper update do a reboot (either ``sudo reboot`` or a 'Reboot Server' through the app).

Hint: Read up on git and its commands to get a grip on what else it can do, like skipping back to an earlier version or a different branch. Although definitely not required.

## 5. Autostart the wiim-now-playing app on boot

Whenever the RPi reboots, i.e. due to the intentional or unintentional loss of power, we would like to start the server/app automatically at startup. There are several methods for this to happen. Here's my version.

1. Make an SSH connection to the RPi.
2. We will use crontab to make the app start at every reboot. Use:  

   ```bash
   sudo crontab -e
   ```

   _If this is the first time it will ask which editor to use. My preference is the default, nano._

3. In the crontab text file add the following lines at the end:  

   ```bash
   # Start node on (re)boot
   @reboot su username -c "/usr/bin/node /home/username/wiim-now-playing/server/index.js" &
   ```

   _**NOTE!** Replace the 'username' with **your** username! Right after su **and** in /home/username/..._  
   _If you've placed the wiim-now-playing app in a different folder then ammend the last part to reflect the correct folder!_  
   _Note that the & at the end is required!_

4. Use CTRL+X -> Y to confirm -> Enter to confirm the filename.  
   The change will now be implemented.

5. You can check the changes by doing another ```sudo crontab -e```. You can see your edits at the end of the text.  
   Exit out of Nano like the first time.

To make sure, do a reboot (``sudo reboot``), wait for the RPi to come back up completely, open up a browser and point it to the RPi (i.e. ``servername.local``). It should now show you the wiim-now-playing app after each reboot.

If not, then redo the ``sudo crontab -e`` command to check if the rule you've set is correct.

Note: If the app looks garbled in the browser, please refresh your browser window i.e. clear your cache. If the issues persist, be patient and wait for things to settle. And/or try a power cycle of the Raspberry Pi by unplugging the powercord of the RPi completely, wait a while and then plug it back in.

Note: In the RPi commandline you can use ``top`` or ``htop`` to see if there is a node process running. It should be on _top_ of the list.

## 6. Showing the app on the touchscreen (Kiosk mode)

Now that we've configured the RPi and the wiim-now-playing app (server part) to run every time the RPi (re)boots, we would like to show the client on the touchscreen as well. What else is the point of having the touchscreen attached? Currently there's not a lot to show for on the screen itself. Just a command prompt at this point.

To add the same output as in the browser on the touchscreen, please follow the [Enable Kiosk mode on a Raspberry Pi](RPi-Kiosk.md) instructions next.
