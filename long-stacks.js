require('clarify');
const formatter = require('./format');
const chain = require('stack-chain');
const asyncWrap = process.binding('async_wrap');

const traces = new WeakMap();
const chainOptions = { extend: false, filter: true, slice: 2 };
let currentStack = [];

asyncWrap.setupHooks({ init, pre, post });
asyncWrap.enable();

function init (uid, provider, parentUid, parentHandle) {
  const stack = chain.callSite(chainOptions);
  const lastTrace = currentStack[currentStack.length - 1];
  stack.push.apply(stack,
    parentUid === null ? lastTrace : traces.get(parentHandle));
  traces.set(this, stack);
}

function pre (uid) {
  currentStack = currentStack.concat(traces.get(this));
}

function post (uid) {
  currentStack.pop();
}

Error.prepareStackTrace = function prepareStackTrace (err, stack) {
  if (currentStack) stack.push.apply(stack, currentStack);
  return formatter(err, stack);
};

