document.querySelector(".menu-btn")?.addEventListener("click", () => {
  document.querySelector(".nav-inner")?.classList.toggle("open");
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    document.querySelector(".nav-inner")?.classList.remove("open");
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const open = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((faq) => faq.classList.remove("open"));
    if (!open) item.classList.add("open");
  });
});

document.querySelector("[data-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  const text = button.textContent;
  button.textContent = "Request Sent!";
  button.style.background = "#27ae60";
  setTimeout(() => {
    button.textContent = text;
    button.style.background = "";
  }, 2400);
});
