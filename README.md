# wait-for-me
> Return a function you can await for (promisify), from a function which signature is `(args..., err)`.

## Why

Most async functions of nodejs framework have this signature ([fs](https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback)
, or databases such [mongo](http://mongodb.github.io/node-mongodb-native/2.0/api/) or [NeDB](https://github.com/louischatriot/nedb)).

When you start coding some async stuff without Promises (because the function 
does not handle it and just have a callback as argument), you end up with a lot
of callbacks inside others callbacks, a lot of `if` to handle the arguments
`(err, result)`, a lot of repetitions, a lot of indentations, and the code is
just ugly, let's face it.

Promisifying those async functions allows you to think more easily with the
processes that's going on and generally to have a cleaner code, way more logic
when you read it (you don't need to have to think about contexts embedded into
others contexts, then what-if else etc.).

Just check the examples below if you're not sure that fits your needs.

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

## Origin

I started a project with callbacks hell, then wanted to promisify them instead.
Few days before, I saw a conversation about that involving [@RReverser](https://twitter.com/RReverser)
who suggests this [approach](https://gist.github.com/RReverser/79afe3bfacbe054264d6).

I really liked it, very clean code. I just added the context option for me but 
all credits goes to him.

You can find other projects promisifying function but I found them more
complicated, doing more stuff, having polyfill or other thing I didn't want.

I just wanted to promisify some function I pock, in a nodejs process, that's it.
