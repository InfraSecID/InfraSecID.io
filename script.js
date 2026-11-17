// ============================================================================
// Portfolio Website Script — Theme Toggle, Typing Effect, Terminal & Filters
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeLabel");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  const typingTextEl = document.getElementById("typingText");
  const toastEl = document.getElementById("toast");
  const currentYearEl = document.getElementById("currentYear");

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // One CTA element serves desktop and mobile, avoiding duplicate links.
  const mobileCta = navLinks?.querySelector(".nav-mobile-cta");
  mobileCta?.remove();
  const hireLink = document.querySelector(".nav-hire-link");
  const mobileBreakpoint = window.matchMedia("(max-width: 960px)");

  function updateHireLink() {
    if (!hireLink) return;
    if (mobileBreakpoint.matches) {
      // The existing responsive stylesheet hides this link on mobile; inline
      // styles keep the single CTA visible in the header without overflowing it.
      hireLink.style.display = "inline-flex";
      hireLink.style.padding = "0.4rem 0.55rem";
      hireLink.style.fontSize = "clamp(0.65rem, 2.7vw, 0.78rem)";
      hireLink.style.whiteSpace = "nowrap";
    } else {
      hireLink.style.removeProperty("display");
      hireLink.style.removeProperty("padding");
      hireLink.style.removeProperty("font-size");
      hireLink.style.removeProperty("white-space");
    }
  }

  updateHireLink();
  if (mobileBreakpoint.addEventListener) {
    mobileBreakpoint.addEventListener("change", updateHireLink);
  } else {
    // Compatibility with older Android WebViews.
    mobileBreakpoint.addListener(updateHireLink);
  }

  // --------------------------------------------------------------------------
  // 1. Toast Notification Helper
  // --------------------------------------------------------------------------
  let toastTimeout;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 2. Dark / Light Theme Toggle (with localStorage persistence)
  // --------------------------------------------------------------------------
  function applyTheme(theme) {
    const safeTheme = theme === "light" ? "light" : "dark";
    htmlEl.setAttribute("data-theme", safeTheme);
    try {
      localStorage.setItem("portfolio_theme", safeTheme);
    } catch {
      // The theme still works when storage is disabled or unavailable.
    }
    if (themeLabel) {
      themeLabel.textContent = safeTheme === "dark" ? "Dark" : "Light";
    }
  }

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem("portfolio_theme") === "light" ? "light" : "dark";
  } catch {
    // Use the default theme in private browsing or restricted WebViews.
  }
  applyTheme(savedTheme);

  function toggleTheme() {
    const current = htmlEl.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    showToast(`Tema diubah ke mode ${next === "dark" ? "Dark (Gelap)" : "Light (Terang)"}`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu
  // --------------------------------------------------------------------------
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
      mobileMenuBtn.setAttribute("aria-label", isOpen ? "Tutup Menu" : "Buka Menu");
    });

    function closeMobileMenu() {
      navLinks.classList.remove("open");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      mobileMenuBtn.setAttribute("aria-label", "Buka Menu");
    }

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    hireLink?.addEventListener("click", closeMobileMenu);
    mobileBreakpoint.addEventListener?.("change", () => {
      if (!mobileBreakpoint.matches) closeMobileMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });
  }

  // --------------------------------------------------------------------------
  // 4. Multi-Role Typing Effect
  // --------------------------------------------------------------------------
  const roles = [
    "Linux System Administrator",
    "DevSecOps Engineer",
    "Cybersecurity / Bug Hunter",
    "Red Team Operator",
    "DevOps & Cloud Architect"
  ];

  if (typingTextEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function runTypingLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        charIdx--;
      } else {
        charIdx++;
      }
      typingTextEl.textContent = currentRole.substring(0, charIdx);

      let delay = isDeleting ? 40 : 85;
      if (!isDeleting && charIdx === currentRole.length) {
        delay = 1900;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 350;
      }
      setTimeout(runTypingLoop, delay);
    }

    runTypingLoop();
  }

  // --------------------------------------------------------------------------
  // 5. Interactive Hero Terminal
  // --------------------------------------------------------------------------
  const terminalForm = document.getElementById("terminalForm");
  const terminalInput = document.getElementById("terminalInput");
  const terminalBody = document.getElementById("terminalBody");
  const MAX_TERMINAL_ROWS = 100;

  function appendTerminalLine(cmd, htmlOutput) {
    if (!terminalBody) return;

    const cmdRow = document.createElement("div");
    cmdRow.className = "term-line";
    cmdRow.innerHTML = `<span class="term-prompt">hidayat@secops:~$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(cmdRow);

    if (htmlOutput) {
      const outRow = document.createElement("div");
      outRow.className = "term-output";
      outRow.innerHTML = htmlOutput;
      terminalBody.appendChild(outRow);
    }

    while (terminalBody.children.length > MAX_TERMINAL_ROWS) {
      terminalBody.firstElementChild.remove();
    }
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
      return map[ch];
    });
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = terminalInput.value.trim();
      if (!raw) return;
      terminalInput.value = "";
      const cmd = raw.toLowerCase();

      switch (cmd) {
        case "help":
          appendTerminalLine(raw, `<div>Perintah yang tersedia:</div>
             <div>• <code>whoami</code> — Ringkasan profil &amp; spesialisasi</div>
             <div>• <code>skills</code> — Daftar tech stack utama</div>
             <div>• <code>projects</code> — Lompat ke bagian Proyek &amp; Riset</div>
             <div>• <code>theme</code> — Ganti tema Dark / Light mode</div>
             <div>• <code>contact</code> — Informasi kontak &amp; kolaborasi</div>
             <div>• <code>clear</code> — Bersihkan layar terminal</div>`);
          break;
        case "whoami":
          appendTerminalLine(raw, `<div><strong>Hidayat</strong> — Engineer lintas disiplin:</div>
             <div>1. Cybersecurity / Bug Hunter / Red Teamer</div>
             <div>2. DevOps &amp; DevSecOps Automation</div>
             <div>3. Linux System Administrator</div>`);
          break;
        case "skills":
          appendTerminalLine(raw, `<div><span class="term-key">[SEC]</span> Burp Suite, Nuclei, Recon, OWASP Web/API, IAM &amp; APK Red Team</div>
             <div><span class="term-key">[OPS]</span> Docker, Kubernetes, Terraform, GitHub Actions, Semgrep, Trivy</div>
             <div><span class="term-key">[DEV]</span> TypeScript, React, Next.js, Node.js, Go, Python, PostgreSQL</div>`);
          break;
        case "projects":
          appendTerminalLine(raw, `<div class="term-success">Mengarahkan ke bagian Proyek &amp; Riset...</div>`);
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          break;
        case "contact":
          appendTerminalLine(raw, `<div class="term-success">Membuka bagian Kontak... Email: marlin.hidayat7780@gmail.com</div>`);
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          break;
        case "theme":
          toggleTheme();
          appendTerminalLine(raw, `<div class="term-success">Tema berhasil diubah ke mode <strong>${htmlEl.getAttribute("data-theme")}</strong>.</div>`);
          break;
        case "clear":
          if (terminalBody) terminalBody.replaceChildren();
          break;
        default:
          appendTerminalLine(raw, `<div>Perintah <code>${escapeHtml(raw)}</code> tidak dikenali. Ketik <code>help</code> untuk daftar perintah.</div>`);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Skills Filter Tabs
  // --------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll("#skillTabs .tab-btn");
  const skillCards = document.querySelectorAll("#skillsGrid .skill-card");
  skillTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      skillTabs.forEach((tab) => {
        tab.classList.remove("active");
        tab.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const filter = btn.getAttribute("data-filter");
      skillCards.forEach((card) => {
        card.classList.toggle("hidden", filter !== "all" && card.getAttribute("data-category") !== filter);
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Projects Filter Tabs
  // --------------------------------------------------------------------------
  const projectTabs = document.querySelectorAll("#projectTabs .tab-btn");
  const projectCards = document.querySelectorAll("#projectsGrid .project-card");
  projectTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      projectTabs.forEach((tab) => {
        tab.classList.remove("active");
        tab.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const filter = btn.getAttribute("data-project-filter");
      projectCards.forEach((card) => {
        card.classList.toggle("hidden", filter !== "all" && card.getAttribute("data-project-category") !== filter);
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Print / Save CV Button, Copy Email & Contact Form
  // --------------------------------------------------------------------------
  const downloadCvBtn = document.getElementById("downloadCvBtn");
  downloadCvBtn?.addEventListener("click", () => window.print());

  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const emailAddressEl = document.getElementById("emailAddress");
  if (copyEmailBtn && emailAddressEl) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = emailAddressEl.textContent.trim();
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
        await navigator.clipboard.writeText(email);
        showToast(`Email "${email}" berhasil disalin!`);
      } catch {
        showToast(`Salin email secara manual: ${email}`);
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.reportValidity()) return;

      const name = document.getElementById("senderName")?.value.trim() || "Rekan";
      const senderEmail = document.getElementById("senderEmail")?.value.trim() || "";
      const service = document.getElementById("serviceType")?.value || "Kolaborasi";
      const message = document.getElementById("senderMessage")?.value.trim() || "";
      const subject = `Permintaan kolaborasi: ${service}`;
      const body = `Nama: ${name}\nEmail: ${senderEmail}\nKebutuhan: ${service}\n\nPesan:\n${message}`;
      const mailto = `mailto:marlin.hidayat7780@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // This static portfolio has no backend; hand off the validated message to
      // the visitor's email client instead of claiming it was sent.
      window.location.href = mailto;
      showToast("Pesan disiapkan di aplikasi email Anda.");
    });
  }
});
