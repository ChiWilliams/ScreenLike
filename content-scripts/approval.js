async function manageQueryBox() {
  const dialog = document.createElement('dialog');
  dialog.style = "all: revert"
  dialog.innerHTML = `
    <p>Is opening this tab a good idea?!</p>
    <button id="queryYes">Yes</button> 
    <button id="queryNo">No</button>
    <button id="queryMaybe">I don't know</button>
  `;


  // Add the dialog to the page
  document.body.appendChild(dialog);

  // Show the dialog
  dialog.showModal();
  
  // Yes button is clicked
  // Return a Promise that resolves when the user clicks one of the buttons
  return new Promise((resolve) => {
    document.getElementById('queryYes').addEventListener('click', () => {
      dialog.close();
      resolve({approved: "true"});  // Resolve with a result
    });

    document.getElementById('queryNo').addEventListener('click', () => {
      dialog.close();
      resolve({approved: "false"});  // Resolve with a result
    });

    document.getElementById('queryMaybe').addEventListener('click', () => {
      dialog.close();
      resolve({approved: "nan"});  // Resolve with a result
    });
  });

}

// Listen for messages from the background script
browser.runtime.onMessage.addListener(async (message) => {
  console.log(message);
    if (message.command === "showApprovalPopup") {
      let output = await manageQueryBox();
      return output;
      }
    }
  );