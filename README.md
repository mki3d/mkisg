# MKI SEARCHING GAME
by mki1967@gmail.com

This is the version of MKI SEARCHING GAME that can be run as Chrome application offline.

<a target="_blank" href="https://chrome.google.com/webstore/detail/mki-searching-game/kdajlgfickgodlgkhehckmjlebelgoai">
Link for installation from Chrome Web Store
</a>

If you are using other browser, you can also clone this repository and 
play offline by opening the file: mkisg_app/index.html

### Github Page

GitHub Page for this project is at http://mki1967.github.io/mkisg-chrome/

## DESCRIPTION:

Searching in 3D stages.

You have to find and collect randomly scattered objects in a 3D stage.
After collecting the last token, you are transferred to another
randomly selected stage.
Sometimes it is hard to find all the tokens, since they can be anywhere.

### MKI3D

Now, the game contains stages directly designed with [MKI3D MODELLER](https://mki1967.github.io/mki3d/). 
In the Git repository of the game you can find them in the sub-directory: 
[`mkisg_app/mki3d/stages/`](https://github.com/mki1967/mkisg-chrome/tree/master/mkisg_app/mki3d/stages). 
If you want to design and play in your own stages then place them in that sub-directory and read the file 
   [`mkisg_app/mki3d/README.md`](https://github.com/mki1967/mkisg-chrome/blob/master/mkisg_app/mki3d/README.md)
for instructions how to update the index of stages.

To run the game with your stages on your computer you have to start a local http server and open it
in a web browser.
See the [Big list of http static server one-liners](https://gist.github.com/willurd/5720255).
On Chrome you can also use  
[Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?utm_source=chrome-app-launcher-info-dialog) 
for this purpose, 
or load the app as unpackaged extension on the page [`chrome://extensions/`](chrome://extensions/).



## GAME INSTRUCTIONS:

Find all the red tokens to finish each stage. 
To collect a token you have simply to approach it.
You can go through the walls. 
They only restrict visibility.

* use arrow keys and IJKL to move / rotate left-right or up-down
* use F to move forward
* use B or V to move backward
* use M to switch to MOVE mode
* use R to switch to ROTATE mode
* use SPACE to reset vertical orientation
* use the keys: S, N to toggle or change the sky-box
* use X to restart random stage
* use Q ask for the number of remaining tokens

The screen is divided into 3x3 sectors:
```
 +---------+---------+---------+
 | MOVE    | UP      | FORWARD |
 +---------+---------+---------+
 | LEFT    | UPRIGHT | RIGHT   |
 +---------+---------+---------+
 | ROTATE  | DOWN    | BACK    |
 +---------+---------+---------+
```
You can also activate actions by clicking sectors on the screen.
You stop actions by clicking on the screen.

You can travel within bounding box of the stage. 
The frame of this box is visible.
When you reach the bounding box, you are automatically 
switched to ROTATE mode. 
It is more suitable for regaining orientation.

Hints: 

* MOVE mode can be used for systematic scanning of the stage
  in the search for an object. 

* When you are close to the object, it is easier to
  navigate toward the object in the ROTATE mode.
