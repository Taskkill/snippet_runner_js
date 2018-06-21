(function() {
  window.snippet_js = {
    evaluate: ( source, traps ) => run_in_sandbox(source, traps),
  }

  function run_in_sandbox ( source, traps = {} ) {
    const err = traps.console.error || console.error
    const scope = new Proxy(
    {
      source,
    },
    {
      has( target, prop_name ) {
        if (prop_name in traps) {
          return true
        }

        let searched_var
        try {
          eval(`searched_var = ${prop_name}`)
        } catch (Ex) {
          err(`ReferenceError: ${prop_name} was not declared`)
          throw `Undeclared variable use Exception`
        }
        
        return ! typeof searched_var === 'function'
      },

      set( target, prop_name, value ) {
        if (traps[prop_name])
          traps[prop_name] = value
        else
          target[prop_name] = value
        
        return true
      },

      get: ( target, prop_name ) =>
        traps[prop_name] ? traps[prop_name] : target[prop_name],
    })

    with (scope) {
      eval(source)
    }
  }
})()
