const html = `<!DOCTYPE html><html><head>
<style>
html,body{
  margin:0;
  padding0;
}</style></head><body>
<img style="max-width:100%" src="https://images.unsplash.com/photo-1535026863073-a1548986abeb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c315a1440ad485512983e51b479e648d&auto=format&fit=crop&w=800&q=60">
</body>
</html>`;
iframe.contentWindow.document.open();
iframe.contentWindow.document.write(html);
iframe.contentWindow.document.close();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

btn.addEventListener("click", () => {
  img.src = imgurl.value;
  console.log(imgurl.value);
  console.log("TEST");
});
