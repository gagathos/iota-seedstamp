# iota-seedstamp

CLI tool to generate and attach addresses for a seed

## What's a seedstamp?

A seedstamp is simply a JSON array of addresses generated by your seed. You can provide this to external services instead of the seed itself, which means you will keep control over your funds and identity.

## What can I do with this?

This tool is useful after a snapshot if you have a seed that has many different addresses with balances on it. The current [public wallet](https://github.com/iotaledger/wallet) will only show balances from addresses that contain transactions, and a snapshot wipes out all the transactions.

Using the command `node stamp.js -a` you can create transactions for each address and attach them to the tangle.

You can also generate a JSON file containing the address array. This may be a way to provide addresses to a third party service without providing your actual seed. For instance, if there were a subscription service to get notifications about any transactions to your addresses, you could provide your addresses in this format.

There are no known uses for this format yet, but to generate it you smiply have to do `node stamp.js > filename.json`

We hope to provide a proof-of-concept app which accepts this format in the near future.

## How do I use this?

Requires: npm, node

First install by cloning the repo and running `npm install` in the directory.

`node stamp.js [options]`

```
Options:

    -c, --num-addresses [addresses]  Number of addresses to generate (default: 15)
    -r, --random                     Shuffle the addresses out of order in output (Should increase security in some way)
    -a, --attach                     Attach the addresses so they show up in wallet
    -h, --host [host]                IRI API Hostname (default: https://field.carriota.com)
    -p, --port [port]                IRI API Port # (default: 443)
    --help                       output usage information
```
Note that the API endpoint must have POW enabled in order to use the `-a` option.

## Is this safe?

By making this super simple, we are hoping it will be easy to see that nothing is done with your seed aside from generate addresses from it.  If you're still nervous, you can turn off your internet and run it (though the `-a` option will not work) to ensure your seed doesn't get anywhere.
