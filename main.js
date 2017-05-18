(function() {
  // expose control object to global scope
  let terminal = null;
  window.snippet_js = {
    evaluate(source, traps, allowed) {
      runInSandbox(source, traps, allowed);
    },
    resetTerminal() {
      terminal = null;
    },
    commit(source, traps = {}, allowed = {}) {
      if (terminal === null) {
        terminal = runSandboxTerminal(source, traps, allowed);
        terminal.next(source);
        return;
      }
      terminal.next(source);
    }
  };

  function runInSandbox(source, traps = {}, allowed = {}) {
    const err = traps.console.error || console.error;

    // alowing eval for myself
    allowed['eval'] = null;

    const scope = new Proxy({
      source: source
    }, {
      has(target, propName) {
        if (propName in traps)
          return true;

        if (propName in allowed)
          return false;

        if (propName in window) {
          err("Error - DO NOT USE: '" + propName + "' IT IS RESTRICTED GLOBAL VARIABLE");
          throw "ERROR USE OF PROTECTED GLOBAL VARIABLES";
        }

        if (propName in target) return true;

        // check if var or function variable infected current function's scope
        let searchedVar;
        try {
          eval(`searchedVar = ${propName}`);
        } catch (Ex) {
          // searched for var not in global scope, not supplied from upper scope
          // this var doesn't exist - throw Exception and log error
          err("ERROR - VARIABLE " + propName + " was not declared!")
          throw "Undeclared variable use Exception";
        }

        if (typeof searchedVar === 'function') return false;

        return true;
      },
      set(target, propName, value) {
        if (traps[propName])
          traps[propName] = value;
        else
          target[propName] = value;
        return true;
      },
      get(target, propName) {
        if (traps[propName])
          return traps[propName];
        return target[propName];
      }
    });

    with(scope) {
      eval(source);
    }
  }

  function* runSandboxTerminal(source, traps = {}, allowed = {}) {
    const err = traps.console.error || console.error;

    // alowing eval for myself
    allowed['eval'] = null;
    const target = {
      source: source
    };

    const scope = new Proxy(target, {
      has(target, propName) {

        if (propName in traps)
          return true;

        if (propName in allowed)
          return false;

        if (propName in window) {
          err("Error - DO NOT USE: '" + propName + "' IT IS RESTRICTED GLOBAL VARIABLE");
          throw "ERROR USE OF PROTECTED GLOBAL VARIABLES";
        }

        if (propName in target) return true;

        // check if var or function variable infected current function's scope
        let searchedVar;
        try {
          eval(`searchedVar = ${propName}`);
        } catch (Ex) {
          // searched for var not in global scope, not supplied from upper scope
          // this var doesn't exist - throw Exception and log error
          err("ERROR - VARIABLE " + propName + " was not declared!")
          throw "Undeclared variable use Exception";
        }

        if (typeof searchedVar === 'function') return false;

        return true;
      },
      set(target, propName, value) {
        if (traps[propName])
          traps[propName] = value;
        else
          target[propName] = value;
        return true;
      },
      get(target, propName) {
        if (traps[propName])
          return traps[propName];
        return target[propName];
      }
    });

    while (true) {
      with(scope) {
        eval(source);
      }
      target.source = yield;
    }
  }
})();
