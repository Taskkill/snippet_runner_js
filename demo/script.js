// user defined function
function run() {
  // const origLog = console.log.bind(console);
  const output = document.getElementById('console-output');
  output.innerHTML = '';

  const source = document.getElementById('snippet').textContent;
  try {
    window.snippet_js.evaluate(source, {
      console: {
        log() {
          for (let line of arguments) {
            // console.log("Fake console: " + line);
            output.innerHTML += line + "<br>";
          }
        },
        error() {
          for (let line of arguments) {
            output.innerHTML += `<span style="color:red">${line} </span><br>`;
          }
        },
        dir(object) {
          console.dir(object);
        }
      }
    }, {
      'alert': null,
      'prompt': null,
      'console': null,
      'setTimeout': null,
      'setInterval': null,
      'Promise': null
    });
  } catch (Ex) {
    output.innerHTML += `<span style="color:red; font-weight:bold;">${Ex} </span><br>`;
  }
};

function runTerminal() {
  const output = document.getElementById('console-output');

  const source = document.getElementById('terminal').value;
  try {
    window.snippet_js.commit(source, {
      console: {
        log() {
          for (let line of arguments) {
            // console.log("Fake console: " + line);
            document.getElementById('console-output').innerHTML += line + "<br>";
          }
        },
        error() {
          for (let line of arguments) {
            document.getElementById('console-output').innerHTML += `<span style="color:red">${line} </span><br>`;
          }
        },
        dir(object) {
          console.dir(object);
        }
      }
    }, {
      'alert': null,
      'prompt': null,
      'console': null,
      'setTimeout': null,
      'setInterval': null,
      'Promise': null
    });
  } catch (Ex) {
    output.innerHTML += `<span style="color:red; font-weight:bold;">${Ex} </span><br>`;
  }

  document.getElementById('terminal').value = '';
}
