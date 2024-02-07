// ===========================================================================
// ssdp.js
//

/**
 * SSDP functionality module.
 * The processes are asynchronous and take a wile, so wait for results to come in.
 * @module
 */

// Use SSDP module
const SSDP = require('node-ssdp').Client

// Other modules
const lib = require("./lib.js"); // Generic functionality
const upnp = require("./upnpClient.js"); // UPNP Client functionality
const log = require("debug")("lib:ssdp");

/**
 * This function starts a scan for devices and handles the reponse(s) by returning the result to the devices array.
 * @param {array} deviceList - The array of found device objects.
 * @param {object} serverSettings - The server settings object.
 * @returns {undefined}
 */
const scan = (deviceList, serverSettings) => {
    log("Scanning for devices with SSDP...");

    // Reset the already found device list by emptying the array first
    deviceList.length = 0;

    // Create client
    const ssdpClient = new SSDP({ explicitSocketBind: true }); // explicitSocketBind enabled to make it work on Windows 11

    // Event listener on responses from device discovery
    ssdpClient.on("response", (respSSDP, code, rinfo) => {
        log("Fetching:", respSSDP.LOCATION);

        if (deviceList.some((d) => { return d.location === respSSDP.LOCATION })) {
            log("Device already found!");
            // No need to add this device
        }
        else {
            log("New device found. Get the device description...");
            // Check the device description
            // TODO: Move to upnpClient.js? -> Do proper async
            const client = upnp.createClient(respSSDP.LOCATION);
            client.getDeviceDescription(function (err, deviceDesc) {
                if (err) { log("Error", err); }
                else {

                    // Get the device's AVTransport service description
                    client.getServiceDescription('AVTransport', function (err, serviceDesc) {
                        if (err) { log("Error", err); }
                        else {

                            const device = {
                                location: respSSDP.LOCATION,
                                ...deviceDesc,
                                actions: serviceDesc.actions,
                                ssdp: respSSDP
                            };
                            deviceList.push(device);
                            log("Total devices found:", deviceList.length);
                            log("New device found:", {
                                "friendlyName": device.friendlyName,
                                "manufacturer": device.manufacturer,
                                "modelName": device.modelName,
                                "location": device.location
                            });

                            // Do we need to set the default selected device?
                            // If it is a WiiM device and no other has been selected, then yes.
                            if (!serverSettings.selectedDevice.location &&
                                (device.manufacturer.includes("Linkplay") || device.modelName.includes("WiiM"))) {
                                serverSettings.selectedDevice = {
                                    "friendlyName": device.friendlyName,
                                    "manufacturer": device.manufacturer,
                                    "modelName": device.modelName,
                                    "location": device.location,
                                    "actions": Object.keys(device.actions)
                                    // "actions": Object.keys(serviceDesc.actions)
                                };
                                lib.saveSettings(serverSettings); // Make sure the settings are stored
                            };

                        };
                    });

                };
            });

        };

    });

    // Start a search
    // ssdpClient.search('ssdp:all'); // Search all devices
    // ssdpClient.search("urn:schemas-upnp-org:device:MediaRenderer"); // Search for MediaRenderer devices
    ssdpClient.search("urn:schemas-upnp-org:service:AVTransport:1"); // Search for AVTransport enabled devices

    // OpenHome. Discovery works, but talking to devices is different! -> TODO
    // There is an npm package: https://www.npmjs.com/package/openhome-devices-manager
    // ssdpClient.search("urn:av-openhome-org:service:Product:1"); // Search for OpenHome devices
    // ssdpClient.search("urn:av-openhome-org:service:Product:2"); // Search for OpenHome devices

}

module.exports = {
    scan
}