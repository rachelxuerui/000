const tooltip = document.getElementById("tooltip");
document.querySelectorAll(".cell img").forEach(img => {
  img.addEventListener("mousemove", e => {
    tooltip.textContent = img.dataset.name;
    tooltip.style.left = e.pageX + 10 + "px";
    tooltip.style.top = e.pageY + 10 + "px";
    tooltip.style.opacity = 1;
  });
  img.addEventListener("mouseleave", () => {
    tooltip.style.opacity = 0;
  });
});
