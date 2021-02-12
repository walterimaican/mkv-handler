# mkv-handler

A simple program to walk a user through various MKV operations. Wraps around [MKVToolNix](https://mkvtoolnix.download/index.html) and [subshift](https://github.com/ngerritsen/subshift#readme).

I am adding functionality to it as needed. As a result, this program is far from being a complete wrapper (and most likely will never reach that point).

# How to Use

## Windows 64-bit Users

Download `mkvhandler.exe` and run on your command line.

## All Other Architectures

Modify the `pkg` script in `package.json` and run `npm run pkg`. See [pkg documentation](https://github.com/vercel/pkg#readme) for more details.

# For Developers

Install `Node.js`. For UNIX users, get [nvm](https://github.com/nvm-sh/nvm#installing-and-updating), for Windows users, get [nvm-windows](https://github.com/coreybutler/nvm-windows#install-nvm-windows).

To run:

```
npm start
```

To compile:

```
npm run pkg
```