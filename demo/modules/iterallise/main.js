(() => {
  'use strict';

  function buildFun(fnStr) {
    let fn;
    eval('fn = ' + fnStr);
    return fn;
  }

  function onmessage(message) {
    if (message.data.init) {
      const gener = buildFun(message.data.gener);
      const initVal = message.data.value;

      iter = gener(initVal);
    } else {
      let value = message.data.value;
      let next = iter.next(value);
      const ID = message.data.ID;

      this.postMessage({
        result: next.value,
        done: next.done,
        ID,
        ID
      });
    }
  }

  const source = `
    'use strict';
    let iter;
    ${buildFun.toString()}
    this.onmessage = ${onmessage.toString()}
  `;

  const getWorkerURL = script =>
    window.URL.createObjectURL(createTextFile(script));

  const createTextFile = content =>
    new Blob([content], {
      type: 'text/plain'
    });

  window.Iterallise = function Iterallise(gener, initValue) {
    let ID = Number.MIN_SAFE_INTEGER;
    let done = false;
    const worker = new Worker(getWorkerURL(source));

    worker.postMessage({
      gener: gener.toString(),
      value: initValue,
      init: true
    });

    return {
      next: value => {
        if (done) {
          return Promise.resolve(undefined);
        }

        let __resolve;
        let __reject;

        let handler = function(message) {
          if (message.data.ID === this.ID) {
            worker.removeEventListener('message', handler);
            done = message.data.done;
            __resolve(message.data.result);
          }
        }.bind({ ID: ID });

        worker.addEventListener('message', handler);

        worker.postMessage({
          value: value,
          ID: ID++
        });

        if (ID === Number.MAX_SAFE_INTEGER) {
          ID = Number.MIN_SAFE_INTEGER;
        }

        return new Promise((resolve, reject) => {
          __resolve = resolve;
          __reject = reject;
        });
      },
      done: done
    };
  };
})();
