# snippet_runner_js
Simple JS code snippet runner

API:
``` js
window.snippet_js.evaluate( source : string, traps : object )
```

## source - string
it is standard javascript string containing your code

## traps - object
it should be object with defined properties, these properties, when used as variables in snippet code, will be trapped and your definitions will be used, for example:

``` js
snippet_js.evaluate(
  'console.log("hello world")',
  {
    console: {
      log(content) {
        // here you can do whatever you like with content
        alert(content)
      }
    }
  }
)
```
the above code snippet contains execution of `console.log`, but we redefined `console.log` for our snippet using `traps` object, thus in reality, `alert` will be called inside our trap as a result of evaluating snippet code

you can use traps to override virtually any variable

if not supplied by you, `traps` is empty object, such evaluation will be completely transparent, without overriding anything


## Exceptions
it can throw - because provided snippet code can be invalid, you better call `snippet_js.evaluate` inside try {} catch () {} clause

