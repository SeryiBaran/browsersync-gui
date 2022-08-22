window.addEventListener("DOMContentLoaded", () => {
  const { contextBridge, ipcRenderer } = require("electron");

  const dirBtn = document.getElementById("dirBtn");
  const dirTxt = document.getElementById("dirTxt");
  const paramsForm = document.getElementById("paramsForm");
  const submitBtn = document.getElementById("submitBtn");
  const portInput = document.getElementById("portInput");
  const filesInput = document.getElementById("filesInput");
  const exitBtn = document.getElementById("exitBtn");

  let dirPath = "";

  function checkValid() {
    return (
      dirPath !== "" &&
      dirPath !== undefined &&
      portInput.value !== "" &&
      filesInput.value !== ""
    );
  }

  dirBtn.addEventListener("click", () => {
    ipcRenderer.invoke("dialog:openDirectory").then((result) => {
      dirTxt.innerText = result;
      dirPath = result;
      if (checkValid()) {
        submitBtn.removeAttribute("disabled", false);
      } else {
        submitBtn.setAttribute("disabled", true);
      }
    });
  });

  paramsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkValid()) return;
    ipcRenderer.invoke("startBrs", {
      dir: dirPath,
      port: +portInput.value,
      files: filesInput.value,
    });
    submitBtn.setAttribute("disabled", true);
  });

  exitBtn.addEventListener("click", () => {
    ipcRenderer.invoke("quit-app");
  });
});
