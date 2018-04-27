"use strict"

const IOTA = require('iota.lib.js')
const program = require('commander')
const readlineSync = require('readline-sync')
const semaphore = require('semaphore')(2)


program
  .version('1.0.0')
  .option('-c, --num-addresses [addresses]', 'Number of addresses to generate', 15)
  .option('-r, --random', 'Shuffle the addresses out of order in output', true)
  .option('-a, --attach', 'Attach the addresses so they show up in wallet', false)
  .option('-h, --host [host]', 'IRI API Hostname', 'https://field.carriota.com')
  .option('-p, --port [port]', 'IRI API Port #', 443)
  .parse(process.argv)
  
var seed = readlineSync.question('IOTA Seed: ', {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
})

const iota = program.attach ? new IOTA({host: program.host, port: program.port}) : new IOTA() // "No Connection" mode if we don't specify attach. Will work offline, for the paranoid.

iota.api.getNewAddress(seed, {index: 0, total: program.numAddresses}, (error, success) => {
  if(program.random && success){
    shuffle(success)
  }
  if(!program.attach){
    console.log(JSON.stringify(success)) //just output mode
  } else {  
    for(var i = 0; i < success.length; i++){
      console.log('attaching '+success[i])
      attachAddress(success[i])
    }
  }
})

/*
 * Puts an empty transaction so the address shows up in wallet. Great for recovering after snapshots! 
 */

function attachAddress (address) {
  semaphore.take(() => {
    iota.api.sendTransfer(seed, 3, 14, [{"address": address, "value": 0, "message": "", "tag": ""}], (error, transfers) => {
      semaphore.leave()
      if(transfers){
        console.log(address + ' - ' + transfers[0].hash)
      } else {
        console.log(error)
        console.log('trying again')
        attachAddress(address)
      }
    })
  })
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}