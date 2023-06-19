import { FileCollection } from 'file-collection';

const source = {
  baseURL: 'https://image-js.github.io/image-dataset-demo/',
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

console.log(files)
console.log(arrayBuffer.byteLength)