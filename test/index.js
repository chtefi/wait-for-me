import fs from 'fs';
import { expect } from 'chai';

import waitForMe from '../index.js';

describe('the waitForMe function', () => {
  it('should wait for me', async () => {
    const fn = waitForMe((args, cb) => {
      cb(args > 0 ? 'should be 0' : null, args === 0);
    });

    let result;

    // then
    result = await fn(0);
    expect(result).to.be.true;

    // catch
    result = async () => { await fn(2); };
    expect(result).to.throw;

    // read a file
    const read = waitForMe(fs.readFile);
    const content = await read('./index.js');
    expect(content).to.have.length.above(0);
  });

  it('should wait for me, with then/catch', async () => {
    const fn = waitForMe((args, cb) => {
      cb(args > 0 ? 'should be 0' : null, args === 0);
    });

    let result;

    result = () => {
      fn(2)
        .then(result => result)
        .catch(err => err);
    };
    expect(result).to.throw;

    result = await fn(0);
    expect(result).to.be.true;
  });
});
