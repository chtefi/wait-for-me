// From @RReverser
// https://gist.github.com/RReverser/79afe3bfacbe054264d6

// context was added to handle certain use cases where the context matters,
// and instead of using .bind(xxx) in the caller

export default function waitForMe(fn, context) {
  return (...args) => new Promise((resolve, reject) => {
    fn.call(
      context,
      ...args,
      (error, ...cbArgs) => error ? reject(error) : resolve(...cbArgs)
    );
  });
}
