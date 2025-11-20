(function () {
    const menu = document.createElement("div");
    menu.id = "toneMenu";
    menu.innerHTML = `
      <button id="menuBtn">⋮</button>
      <ul id="toneOptions" style="display:none;">
        <li data-tone="professional">Professional</li>
        <li data-tone="formal">Formal</li>
        <li data-tone="casual">Casual</li>
      </ul>
    `;
    document.body.appendChild(menu);
  
    const menuBtn = menu.querySelector("#menuBtn");
    const toneOptions = menu.querySelector("#toneOptions");
    menuBtn.addEventListener("click", () => {
      toneOptions.style.display =
        toneOptions.style.display === "none" ? "block" : "none";
    });
  
    toneOptions.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", () => {
        const tone = item.getAttribute("data-tone");
        window.postMessage({ type: "toneSelected", tone: tone }, "*");
        toneOptions.style.display = "none";
      });
    });
  })();
  