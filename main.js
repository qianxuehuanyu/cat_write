const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const $ = require('Jquery');
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loadLogo

function createWindow() {
    // Create the browser window.
    loadLogo = new BrowserWindow({
        minwidth: 800,
        minheight: 600,
        transparent: true,
        frame: false,
        title: "qxhy",
        show: false
    });
    loadLogo.once('ready-to-show', () => {
        loadLogo.show()
    });

    // and load the index.html of the app.
    loadLogo.loadURL(`file://${__dirname}/loading.html`, {postData: {value: "123123"}});

    fs.readFile("ini.json", function (err, data) {
        if (err) {
            fs.open("ini.json", 'w+', function (err, fd) {
                console.log(err, fd);
            });
        }
    });


    //Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    //mainWindow.on('closed', function () {
    //  // Dereference the window object, usually you would store windows
    //  // in an array if your app supports multi windows, this is the time
    //  // when you should delete the corresponding element.
    //  mainWindow = null
    //});


    var dddtime = 0;
    var ddd = setInterval(function () {
        dddtime++;
        if (dddtime > 2) {
            loadLogo.setProgressBar(1);
            clearInterval(ddd);
            setTimeout(function () {
                loadLogo.setProgressBar(0);
                mainWindow = new BrowserWindow({
                    minWidth: 1200,
                    minHeight: 600,
                    transparent: true,
                    title: "qxhy",
                    backgroundColor: "#FFFFFFFF",
                    autoHideMenuBar: true,
                    resizable: true,
                    show: false,
                    darkTheme: true
                });
                mainWindow.center();
                loadLogo.close();

                //Open the DevTools.
                mainWindow.webContents.openDevTools();

                mainWindow.once('ready-to-show', () => {
                    mainWindow.show()
                });
                mainWindow.loadURL(url.format({
                    pathname: path.join(__dirname, 'index.html'),
                    protocol: 'file:',
                    slashes: true
                }));
                // Emitted when the window is closed.
                mainWindow.on('closed', function () {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    mainWindow = null
                });
            }, 300);
        } else {
            loadLogo.setProgressBar(dddtime * 0.2)
        }
    }, 1000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('before-quit', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q

});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// In main process.
//数据通信主进程发和收
const {ipcMain} = require('electron');
ipcMain.on('asynchronous-message', (event, arg) => {
    if (arg === 1) {
        fs.readFile("ini.json", function (err, data) {
            if (!err) {
                event.sender.send('asynchronous-reply', data)
            }
        });
    } else {
        fs.writeFile("ini.json", arg, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("111");
            }
        });
    }
});

ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg);  // prints "ping"
    event.returnValue = 'pong'
});