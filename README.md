# wait-for-me
> Return a function you can await for (promisify), from a function which signature is (args..., err)

## Why

Most async functions of nodejs framework have this signature ([fs](https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback)
, databases such [mongo](http://mongodb.github.io/node-mongodb-native/2.0/api/)).

## Syntax

It returns a function that encapsule the given function into a Promise.

```js
const read = waitForMe(fs.readFile);
const insert = waitForMe(db.insert, db); // context (`this`) is needed sometimes
```

## then/catch

You can use it with with classic `then/catch` syntax, eg:

```js
import waitForMe from 'wait-for-me';
const read = waitForMe(fs.readFile);

read('/etc/passwd')
  .then(data => sendEmail(data))
  .catch(err => console.error(`Couldn't access /etc/passwd: ${err.message}`))
```

## async/await

Or you can use it with the `async/await` keywords (you need Babel for now to
handle them), eg: 

```js
import fs from 'fs';
import waitForMe from 'wait-for-me';
const read = waitForMe(fs.readFile);

try {
  const data = await read('/etc/passwd')
  sendEmail(data);
} catch(err) {
  console.error(`Couldn't access passwd: ${err.message}`);
}
```

Generally, the async/await notation is cleaner, especially if you have
several of them:

```js
...
const get = waitForMe(request.get, request);
const tweet = waitForMe(client.post, client);

try {
  // get the content of an image
  // then post the image to twitter
  // then post a tweet using the image
  
  const result = await get({ url: src, encoding: null });
  const media = await tweet('media/upload', { media: result.body });
  const t = await tweet('statuses/update', { status: 'Yep', media_ids: media.media_id_string });
  console.log('Tweet OK!');
} catch(error) {
  console.error(error);
}
```

All those functions are async but it's like there are not!

## Promise

The project does not include any polyfill for `Promise`.
If you are using a plain `nodejs` process, you won't need it, it's handled
natively.
