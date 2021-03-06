# mkv-handler

A simple program to walk a user through various MKV operations. Wraps around [MKVToolNix](https://mkvtoolnix.download/index.html) and [subshift](https://github.com/ngerritsen/subshift#readme).

I am adding functionality to it as needed. As a result, this program is far from being a complete wrapper (and most likely will never reach that point).

Feel free to fork this repo and customize as desired as this program is just for my own personal use. For example, see [Issue #1](https://github.com/walterimaican/mkv-handler/issues/1).

# How to Use

This program currently calls various MKVToolNix executables (which means that you need to have these programs already available in your PATH). You will also need to have `subshift` available from the command line as well by running:

```
npm i -g subshift
```

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