# jspm-unused

> Find unused files in a Jspm project

## Install

```shell
npm install -g jspm-unused
```

## Usage

```shell
jspm-unused app/app.js
```

This will print unused files on the console.

As there is one file per line, one can feed the output to another command.
For example, to remove unused files
```shell
rm `jspm-unused app/app.js`
```

You can set the DEBUG environment variable to get more informations
```shell
DEBUG=* jspm-unused app/app.js
```

## Related

- [webpack-unused](https://github.com/latentflip/webpack-unused) - Find unused files in a Webpack project
