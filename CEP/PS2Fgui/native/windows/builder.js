"use strict";

const electron = require("electron");
const fs = require("fs-extra");
const path = require("path");

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const appName = "com.pq.ps2fgui";

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({ width: 550, height: 500 });

	// and load the index.html of the app.
	mainWindow.loadURL("file://" + __dirname + "/../../" + appName + "/index.html");

	mainWindow.webContents.on("did-finish-load", installPlugin);

	// Emitted when the window is closed.
	mainWindow.on("closed", function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

function installPlugin() {
	let baseBath;
	let installPath;

	if (process.platform === "darwin") {
		// 测试不能加载插件
		// baseBath = process.env['HOME'] + '/Library/Application Support/Adobe/'
		baseBath = "/Library/Application Support/Adobe/";
	} else {
		baseBath = process.env["USERPROFILE"] + "/AppData/Roaming/Adobe/";
	}

	installPath = baseBath + "CEP/extensions/" + appName + "/";
	movePlugin(installPath);
}

function movePlugin(installPath) {
	fs.emptyDir(installPath, function (mkdirErr) {
		// path exists unless there was an error
		fs.copy(
			path.join(__dirname + '/../../', appName),
			path.resolve(installPath),
			function (err) {
				let message = "loaded";
				if (err) {
					console.error(err);
					message = err;
				}
				mainWindow.webContents.send("status", message);
				mainWindow.close();
			}
		);
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
	app.quit();
});

app.on("activate", function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
