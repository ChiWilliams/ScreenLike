async function manageQueryBox() {
  const wrapper = document.createElement('div');
  const shadow = wrapper.attachShadow({ mode: 'open' });
  const cssUrl = browser.runtime.getURL('content-scripts/approval-popup.css');

  // fetch the CSS file
  const response = await fetch(cssUrl);
  const cssText = await response.text();
  //Apply CSS to shadow dom
  const style = document.createElement('style');
  style.textContent = cssText;
  shadow.appendChild(style);

  shadow.innerHTML += `
    <body>
      <dialog id="approvalPopup">
        <div>
          Dialog content
          <p>Is opening this tab a good idea?!</p>
          <button id="queryYes">Yes</button> 
          <button id="queryNo">No</button>
          <button id="queryMaybe">I don't know</button>
        </div>
      </dialog>
    </body>
  `;

  // Add the dialog to the page
  document.body.appendChild(wrapper);

  // Show the dialog
  const dialog = shadow.querySelector('dialog');
  dialog.showModal();

  
  // Yes button is clicked
  // Return a Promise that resolves when the user clicks one of the buttons
  return new Promise((resolve) => {
    shadow.getElementById('queryYes').addEventListener('click', () => {
      dialog.close();
      resolve({approved: "true"});  // Resolve with a result
    });

    shadow.getElementById('queryNo').addEventListener('click', () => {
      dialog.close();
      resolve({approved: "false"});  // Resolve with a result
    });

    shadow.getElementById('queryMaybe').addEventListener('click', () => {
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