console.log("Content script loaded");

let selectedTone = "neutral";

const getEmailContent = () => {
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

  const wrapper = document.createElement("div");
  wrapper.id = "ai-cstm-btn";
  wrapper.style.display = "inline-flex";
  wrapper.style.alignItems = "center";
  wrapper.style.borderRadius = "24px";
  wrapper.style.minWidth = "0px";
  wrapper.style.overflow = "hidden"; 
  wrapper.style.marginRight = "6px"; 

  const btn = document.createElement("div");
  btn.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  btn.innerText = "✨AI";
  btn.style.minWidth = "0px";
  btn.setAttribute("role", "button");
  btn.setAttribute("data-tooltip", "Ask AI");
  btn.style.borderRight = "1px solid rgba(255,255,255,0.3)";

  const dotsBtn = document.createElement("div");
  dotsBtn.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  dotsBtn.innerHTML = "&#8942;";
  dotsBtn.style.fontSize = "16px";
  dotsBtn.style.minWidth = "0px";
  dotsBtn.style.display = "flex";
  dotsBtn.style.justifyContent = "center";
  dotsBtn.style.alignItems = "center";
  dotsBtn.style.cursor = "pointer";

  // -------------------
  // Dropdown menu (same as before)
  // -------------------
  const menu = document.createElement("div");
  menu.style.position = "absolute";
  menu.style.display = "none";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #ccc";
  menu.style.borderRadius = "6px";
  menu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
  menu.style.minWidth = "120px";
  menu.style.zIndex = "99999";
  menu.style.padding = "4px 0";

  const toneOptions = [
    { label: "Professional", value: "professional" },
    { label: "Casual", value: "casual" },
    { label: "Friendly", value: "friendly" },
  ];

  toneOptions.forEach(({ label, value }) => {
    const item = document.createElement("div");
    item.innerText = label;
    item.style.padding = "6px 12px";
    item.style.cursor = "pointer";
    item.style.fontSize = "13px";
    item.addEventListener(
      "mouseover",
      () => (item.style.background = "#f1f3f4")
    );
    item.addEventListener("mouseout", () => (item.style.background = "#fff"));
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedTone = value;
      console.log("Tone selected:", selectedTone);
      Array.from(menu.children).forEach((n) => (n.style.background = "#fff"));
      item.style.background = "#e8eaed";
      menu.style.display = "none";
    });
    if (value === selectedTone) item.style.background = "#e8eaed";
    menu.appendChild(item);
  });

  dotsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === "none" ? "block" : "none";
    const rect = dotsBtn.getBoundingClientRect();
    menu.style.left = `${rect.left}px`;
    menu.style.top = `${rect.bottom + window.scrollY + 6}px`;
  });

  document.addEventListener("click", () => (menu.style.display = "none"));
  document.body.appendChild(menu);

  // -------------------
  // Button click (same logic as before)
  // -------------------
  btn.addEventListener("click", async () => {
    try {
      btn.innerHTML = "Asking..";
      btn.disabled = true;

      const emailContent = getEmailContent();

      const response = await fetch(
        "http://localhost:5000/api/create/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailContent, tone: selectedTone }),
        }
      );

      if (!response.ok) {
        console.log("Error from server:", response.statusText);
        alert(`Error from server: ${response.statusText}`);
        btn.innerHTML = "Ask Ai";
        btn.disabled = false;
        return;
      }

      const json = await response.json();
      const aiText = json.response ?? "";
      const escapeHtml = (s) =>
        s
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");

      const safe = escapeHtml(aiText);
      const formatted = safe.replace(/\r\n|\r|\n/g, "<br>");
      const composeBox = document.querySelector(
        ".Am.aiL.aO9.Al.editable.LW-avf.tS-tW"
      );

      if (composeBox) {
        composeBox.focus();
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

  // -------------------
  // Assemble wrapper
  // -------------------
  wrapper.appendChild(btn);
  wrapper.appendChild(dotsBtn);

  return wrapper;
};

const injectButton = () => {
  const btn = makeBtn();
  const toolbar = findToolbar();

  console.log("toolbar", toolbar);
  console.log("btn", btn);

  toolbar.insertBefore(btn, toolbar.firstChild);
};
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
        injectButton();
      }, 200);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
