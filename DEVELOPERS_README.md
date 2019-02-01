# Developers Readme

This documentation outlines how to develop Alpine locally. You only need this document if you're working on Alpine core.
Currently, you can code on Alpine and test your results by writing your feature and generating a new Alpine project.
However, this won't always work because when your new project is created and installed, Alpine may be pulled from NPMJS,
or you might have another version of Alpine locally installed. The best way to reference your local version of Alpine is
by explicitly installing it by filename. 

## Local development steps

### WARNING: PENDING TESTING

You'll first link Alpine so you can access it from your terminal. Then, you'll first need to install 
`rollup-plugin-alpine`. This plugin should depend on your local Alpine. For some reason, `cd alpine && npm link` is not 
sufficient and you'll have to install it explicitly by filename.

Once this is done, you can generate your new project. Then you'll have to install Alpine and rollup-plugin-alpine manually
in that new project as well.

```
cd /path/to/your/local/alpine
npm link

cd /path/to/your/local/rollup-plugin-alpine
npm install /path/to/your/local/alpine

cd ~
alpine new newproject
npm install /path/to/your/local/alpine
npm install /path/to/your/local/rollup-plugin-alpine
```

