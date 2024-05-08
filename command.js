const { spawn } = require("child_process");

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    const child = spawn("bash", ["-c", command]); // Use 'bash -c' for shell execution

    let output = "";
    let error = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim()); // Trim trailing whitespace
      } else {
        reject(new Error(`Command failed with exit code ${code}:\n${error}`));
      }
    });

    child.on("error", (err) => {
      reject(new Error(`Error spawning child process: ${err.message}`));
    });
  });
}

module.exports = executeCommand;
