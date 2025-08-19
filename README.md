## Adding more images

Add the images in a folder in docs

Create the toc file using: `node src/buildToc.js`

## Demo files

Files are available at the following URL https://demo-dataset.image-js.org/

It is possible to load all the files at once using 'file-collection'

```js
const url = 'https://demo-dataset.image-js.org/';
const fileCollection = new FileCollection();
await fileCollection.appendWebSource(url);
```

There is a 'toc' file that could be placed in a menu:

- https://demo-dataset.image-js.org/toc.json

This toc file contains 'source' that could be a props of a react component.

```js
import { FileCollection } from 'file-collection';

const source = {
  baseURL: 'https://demo-dataset.image-js.org/',
  entries: [
    {
      relativePath: 'cats/cats-eyes-2944820_1280.jpg',
    },
  ],
};
const fileCollection = new FileCollection();
await fileCollection.appendSource(source);
const files = [...fileCollection];

const arrayBuffer = await files[0].arrayBuffer();

console.log(files);
console.log(arrayBuffer.byteLength);
```
