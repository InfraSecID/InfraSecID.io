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

  // Update the profile links in the contact section.
  const socialLinks = document.querySelector(".social-links");
  if (socialLinks) {
    const githubLink = Array.from(socialLinks.querySelectorAll("a")).find(
      (link) => link.textContent.trim() === "GitHub"
    );
    if (githubLink) {
      githubLink.href = "https://github.com/InfraSecID/";
    }

    const youtubeLink = document.createElement("a");
    youtubeLink.href = "https://www.youtube.com/@infrasecid";
    youtubeLink.target = "_blank";
    youtubeLink.rel = "noopener noreferrer";
    youtubeLink.textContent = "YouTube";

    const separator = document.createElement("span");
    separator.textContent = "•";
    socialLinks.append(separator, youtubeLink);
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
  const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio_theme", theme);
    if (themeLabel) {
      themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
    }
  }

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
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
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

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function runTypingLoop() {
    if (!typingTextEl) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      typingTextEl.textContent = currentRole.substring(0, charIdx);
    } else {
      charIdx++;
      typingTextEl.textContent = currentRole.substring(0, charIdx);
    }

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

  // --------------------------------------------------------------------------
  // 5. Interactive Hero Terminal
  // --------------------------------------------------------------------------
  const terminalForm = document.getElementById("terminalForm");
  const terminalInput = document.getElementById("terminalInput");
  const terminalBody = document.getElementById("terminalBody");

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

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (ch) => {
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
          appendTerminalLine(
            raw,
            `<div>Perintah yang tersedia:</div>
             <div>• <code>whoami</code>   — Ringkasan profil &amp; spesialisasi</div>
             <div>• <code>skills</code>   — Daftar tech stack utama</div>
             <div>• <code>projects</code> — Lompat ke bagian Proyek &amp; Riset</div>
             <div>• <code>theme</code>    — Ganti tema Dark / Light mode</div>
             <div>• <code>contact</code>  — Informasi kontak &amp; kolaborasi</div>
             <div>• <code>clear</code>    — Bersihkan layar terminal</div>`
          );
          break;

        case "whoami":
          appendTerminalLine(
            raw,
            `<div><strong>Hidayat</strong> — Engineer lintas disiplin:</div>
             <div>1. Cybersecurity / Bug Hunter / Red Teamer</div>
             <div>2. DevOps &amp; DevSecOps Automation</div>
             <div>3. Linux System Administrator</div>`
          );
          break;

        case "skills":
          appendTerminalLine(
            raw,
            `<div><span class="term-key">[SEC]</span> Burp Suite, Nuclei, Recon, OWASP Web/API, IAM &amp; APK Red Team</div>
             <div><span class="term-key">[OPS]</span> Docker, Kubernetes, Terraform, GitHub Actions, Semgrep, Trivy</div>
             <div><span class="term-key">[DEV]</span> TypeScript, React, Next.js, Node.js, Go, Python, PostgreSQL</div>`
          );
          break;

        case "projects":
          appendTerminalLine(raw, `<div class="term-success">Mengarahkan ke bagian Proyek &amp; Riset...</div>`);
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "contact":
          appendTerminalLine(raw, `<div class="term-success">Membuka bagian Kontak... Email: hidayat@secops.dev</div>`);
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "theme":
          toggleTheme();
          appendTerminalLine(
            raw,
            `<div class="term-success">Tema berhasil diubah ke mode <strong>${htmlEl.getAttribute("data-theme")}</strong>.</div>`
          );
          break;

        case "clear":
          if (terminalBody) terminalBody.innerHTML = "";
          break;

        default:
          appendTerminalLine(
            raw,
            `<div>Perintah <code>${escapeHtml(raw)}</code> tidak dikenali. Ketik <code>help</code> untuk daftar perintah.</div>`
          );
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
      skillTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      skillCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
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
      projectTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-project-filter");
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-project-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Print / Save CV Button & Copy Email & Contact Form
  // --------------------------------------------------------------------------
  const downloadCvBtn = document.getElementById("downloadCvBtn");
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener("click", () => {
      window.print();
    });
  }

  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const emailAddressEl = document.getElementById("emailAddress");
  if (copyEmailBtn && emailAddressEl) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = emailAddressEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Email "${email}" berhasil disalin!`);
      } catch {
        showToast(`Email: ${email}`);
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("senderName")?.value || "Rekan";
      const service = document.getElementById("serviceType")?.value || "Kolaborasi";
      showToast(`Terima kasih ${name}! Pesan untuk "${service}" siap dikirim.`);
      contactForm.reset();
    });
  }
});
