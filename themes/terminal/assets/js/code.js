document.querySelectorAll(".chroma code[data-lang]").forEach(function (block) {
  var pre = block.closest(".highlight");
  var text = block.innerText.split("\n").filter(Boolean).join("\n");
  var title = document.createElement("div");
  title.className = "code-title";
  title.textContent = block.dataset.lang;
  if (navigator.clipboard) {
    var btn = document.createElement("button");
    btn.className = "copy-button";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
      setTimeout(function () { btn.textContent = "Copy"; }, 1000);
    });
    title.appendChild(btn);
  }
  pre.insertBefore(title, pre.firstChild);
});
