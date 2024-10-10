

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
  console.log(message);
    if (message.command === "showApprovalPopup") {
      // Show your approval popup here. This is a basic example:
      return new Promise(resolve => {
        let approved = confirm("Is opening this tab a good idea?");
        resolve({ approved: approved});
      });
    }
});