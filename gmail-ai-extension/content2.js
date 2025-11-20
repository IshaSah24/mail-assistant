console.log("Content script loaded");

const getEmailContent = () => {
  // Get the email body content from the compose window
  const selectors = [
    ".h7",
    ".a3s.aiL",
    ".gmail_quote",
    'role=["presentation"]',
  ];

  for (const selector of selectors) {
    const emailBody = document.querySelector(selector);
    if (emailBody) {
      console.log("Email body found with selector:", selector);
      return emailBody.innerText.trim();
    }
  }
  return "";
};

const findToolbar = () => {
  // Reply, dialog
  toolbar = document.querySelector(".btC, .gU.Up");
  if (toolbar) {
    // console.log("Reply toolbar found");
    // toolbar.appendChild(document.getElementById("ai-cstm-btn"));

    return toolbar;
  } else {
    console.log("toolbar not found");
    return null;
  }
};

const makeBtn = () => {
  if (document.getElementById("ai-cstm-btn")) {
    return document.getElementById("ai-cstm-btn");
  }

  const btn = document.createElement("div");
  btn.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  btn.innerText = "Ask Ai";

  btn.setAttribute("role", "button");
  btn.setAttribute("data-tooltip", "Ask AI");

  btn.classList.add(".ai-cstm-btn");

  /*calling  the backend api
  --------------------------- */
  btn.addEventListener("click", async () => {
    try {
      btn.innerHTML = "Asking..";
      btn.disabled = true;
  
      const emailContent = getEmailContent();
  
      const response = await fetch("http://localhost:5000/api/create/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent, tone: "professional" }),
      });
  
      if (!response.ok) {
        console.log("Error from server:", response.statusText);
        alert(`Error from server: ${response.statusText}`);
        btn.innerHTML = "Ask Ai";
        btn.disabled = false;
        return;
      }
  
      // <- parse JSON so \n becomes a real newline character in the JS string
      const json = await response.json();
      // server returns { response: "..." }
      const aiText = json.response ?? "";
  
      // --- SAFELY escape any HTML to avoid XSS  if  ai  generates  any sctripts ---
      const escapeHtml = (s) =>
        s
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
  
      const safe = escapeHtml(aiText);
  
      // convert newlines into HTML <br> for contenteditable
      const formatted = safe.replace(/\r\n|\r|\n/g, "<br>");
  
      // find compose box
      const composeBox = document.querySelector(
        ".Am.aiL.aO9.Al.editable.LW-avf.tS-tW"
      );
  
      if (composeBox) {
        composeBox.focus();
        // insert with a little spacing before the AI text
        document.execCommand("insertHTML", false, `<br><br>${formatted}`);
      }
  
      btn.innerHTML = "Ask Ai";
      btn.disabled = false;
  
      console.log("AI Response:", aiText);
    } catch (err) {
      console.log("Error getting email content", err);
      btn.innerHTML = "Ask Ai";
      btn.disabled = false;
    }
  });
  

  // Object.assign(btn.style, {
  //   marginLeft: "8px",
  //   width: '58px',
  //   border: "none",
  //   borderRadius: "4px",
  //   padding: "6px 12px",
  //   backgroundColor: "#1a73e8",
  //   color: "#fff",
  //   cursor: "pointer",
  //   fontSize: "14px",
  //   fontWeight: "500",
  //   boxShadow: "0 1px 2px rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)",
  //   transition: "background-color 0.3s ease",
  // });

  btn.onmouseover = () => (btn.style.backgroundColor = "#1669c1");
  btn.onmouseout = () => (btn.style.backgroundColor = "#1a73e8");
  // btn.onclick = () => alert("AI Assist Clicked!");

  return btn;
};

const injectButton = () => {
  // 1. the button  can  allready  exist  then we have to  revove it first  then  add it again
  // 2. will find the  right place to  add the button by  selecting the  right element

  const btn = makeBtn();
  const toolbar = findToolbar();

  console.log("toolbar", toolbar);
  console.log("btn", btn);

  toolbar.insertBefore(btn, toolbar.firstChild);
};
// Tracking user's activity ... using MutationObserver with  observer obj
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);

    const hasComposeNode = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDH, .btC, [role="dialog"], [role="region"]') ||
          (node.querySelector &&
            node.querySelector('.aDH, .btC, [role="dialog"], [role="region"]')))
    );

    if (hasComposeNode) {
      console.log("user clicked");
      setTimeout(() => {
        // letting  the ui load first
        injectButton();
      }, 200);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// console.log("");
