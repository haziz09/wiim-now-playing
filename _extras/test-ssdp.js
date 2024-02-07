// ===========================================================================
// test-ssdp.js

/**
 * This script will test SSDP discovery.
 * 
 * It will try and find all UPnP devices on the current network.
 */

const SSDP = require('node-ssdp').Client;
const ssdpClient = new SSDP({ explicitSocketBind: true }); // explicitSocketBind enabled to make it work on Windows 11

ssdpClient.on("response", (respSSDP, code, rinfo) => {
    console.log("Device found ----------------------------------");
    console.log("IP:", rinfo.address);
    console.log("LOCATION:", respSSDP.LOCATION);
    console.log("ST:", respSSDP.ST);
    // console.log("Found:", respSSDP, code, rinfo);
});

// Start a search
ssdpClient.search('ssdp:all'); // Search all devices

// Wait a minute for results to come in...
setTimeout(function () {
    console.log('Done!');
}, 5 * 1000);
