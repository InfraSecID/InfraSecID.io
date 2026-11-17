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

  // Render social profiles as consistently sized text links and show the GitHub profile avatar.
  const socialLinks = document.querySelector(".social-links");
  if (socialLinks) {
    const profiles = [
      { name: "GitHub", url: "https://github.com/InfraSecID" },
      { name: "LinkedIn", url: "https://linkedin.com" },
      { name: "HackerOne / Bugcrowd", url: "https://hackerone.com" },
      { name: "Medium", url: "https://medium.com/@izumy" },
      { name: "YouTube", url: "https://www.youtube.com/@infrasecid" }
    ];
    socialLinks.replaceChildren();
    profiles.forEach(({ name, url }, index) => {
      if (index) {
        const separator = document.createElement("span");
        separator.setAttribute("aria-hidden", "true");
        separator.textContent = "•";
        socialLinks.appendChild(separator);
      }
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = name;
      link.style.fontSize = "1rem";
      link.style.fontWeight = "500";
      socialLinks.appendChild(link);
    });

    const profileIcon = document.querySelector(".contact-methods .contact-item:nth-child(2) .contact-icon");
    if (profileIcon) {
      const avatar = document.createElement("img");
      avatar.src = "https://avatars.githubusercontent.com/u/74954715?v=4";
      avatar.alt = "Avatar profil GitHub InfraSecID";
      avatar.width = 42;
      avatar.height = 42;
      avatar.style.width = "42px";
      avatar.style.height = "42px";
      avatar.style.objectFit = "cover";
      avatar.style.borderRadius = "0.65rem";
      profileIcon.replaceChildren(avatar);
    }
  }

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
  // 7. GitHub Projects: refresh public repositories every 30 minutes
  // --------------------------------------------------------------------------
  const projectTabsContainer = document.getElementById("projectTabs");
  const projectsGrid = document.getElementById("projectsGrid");
  const PROJECTS_REFRESH_INTERVAL = 30 * 60 * 1000;
  const PROJECT_CATEGORIES = [
    { id: "security", label: "Security &amp; Cybersecurity" },
    { id: "devops", label: "DevOps &amp; Infrastruktur" },
    { id: "apps", label: "Aplikasi &amp; Tools" }
  ];
  let githubProjects = [];
  let activeProjectFilter = "all";

  function getProjectCategory(repo) {
    const text = `${repo.name} ${repo.description || ""}`.toLowerCase();
    if (/security|cyber|vuln|malware|yara|pentest|bug.?bounty|red.?team|scanner|wazuh|threat|auth/.test(text)) {
      return "security";
    }
    if (/devops|docker|kubernetes|k8s|microservice|terraform|infrastructure|pipeline|cloud|buildflow|ansible|ci.?cd/.test(text)) {
      return "devops";
    }
    return "apps";
  }

  function createProjectCard(repo) {
    const category = PROJECT_CATEGORIES.find((item) => item.id === repo.category);
    const card = document.createElement("article");
    card.className = "project-card";
    card.dataset.projectCategory = repo.category;

    const header = document.createElement("div");
    header.className = "project-card-header";
    const type = document.createElement("span");
    type.className = "project-type";
    type.textContent = category ? category.label.replace("&amp;", "&") : "GitHub Project";
    const status = document.createElement("span");
    status.className = `project-status ${repo.archived ? "status-research" : "status-live"}`;
    status.textContent = repo.archived ? "Archived" : "GitHub Project";
    header.append(type, status);

    const title = document.createElement("h3");
    title.className = "project-title";
    const repoLink = document.createElement("a");
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.rel = "noopener noreferrer";
    repoLink.textContent = repo.name;
    title.appendChild(repoLink);

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = repo.description || "Lihat repository GitHub ini untuk detail proyek dan dokumentasi.";

    const metrics = document.createElement("div");
    metrics.className = "project-metrics";
    const languageMetric = document.createElement("div");
    const language = document.createElement("strong");
    language.textContent = repo.language || "Repository";
    const languageLabel = document.createElement("span");
    languageLabel.textContent = "Bahasa utama";
    languageMetric.append(language, languageLabel);
    const updatedMetric = document.createElement("div");
    const updatedValue = document.createElement("strong");
    updatedValue.textContent = new Date(repo.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const updatedLabel = document.createElement("span");
    updatedLabel.textContent = "Terakhir diperbarui";
    updatedMetric.append(updatedValue, updatedLabel);
    metrics.append(languageMetric, updatedMetric);

    const tags = document.createElement("div");
    tags.className = "project-tags";
    const tagValues = [repo.language, ...(repo.topics || []).slice(0, 4)].filter(Boolean);
    (tagValues.length ? tagValues : [repo.archived ? "Archived" : "GitHub"])
      .forEach((value) => {
        const tag = document.createElement("span");
        tag.textContent = value;
        tags.appendChild(tag);
      });

    card.append(header, title, description, metrics, tags);
    return card;
  }

  function renderGithubProjects() {
    if (!projectsGrid || !projectTabsContainer) return;

    projectTabsContainer.replaceChildren();
    const allButton = document.createElement("button");
    allButton.className = `tab-btn${activeProjectFilter === "all" ? " active" : ""}`;
    allButton.dataset.projectFilter = "all";
    allButton.setAttribute("role", "tab");
    allButton.setAttribute("aria-selected", String(activeProjectFilter === "all"));
    allButton.textContent = "Semua Proyek";
    projectTabsContainer.appendChild(allButton);

    const categoriesInRepos = new Set(githubProjects.map((repo) => repo.category));
    PROJECT_CATEGORIES.filter((category) => categoriesInRepos.has(category.id)).forEach((category) => {
      const button = document.createElement("button");
      button.className = `tab-btn${activeProjectFilter === category.id ? " active" : ""}`;
      button.dataset.projectFilter = category.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(activeProjectFilter === category.id));
      button.textContent = category.label.replace("&amp;", "&");
      projectTabsContainer.appendChild(button);
    });

    const visibleRepos = githubProjects.filter((repo) => activeProjectFilter === "all" || repo.category === activeProjectFilter);
    projectsGrid.replaceChildren(...visibleRepos.slice(0, 6).map(createProjectCard));

    // Keep the 3-by-2 portfolio layout even if the account currently has fewer than six projects.
    for (let index = visibleRepos.length; index < 6; index += 1) {
      const placeholder = document.createElement("article");
      placeholder.className = "project-card project-card-placeholder";
      const title = document.createElement("h3");
      title.className = "project-title";
      title.textContent = "Proyek berikutnya segera hadir";
      const description = document.createElement("p");
      description.className = "project-description";
      description.textContent = "Repository publik baru dari GitHub akan tampil di sini setelah diperbarui.";
      placeholder.append(title, description);
      projectsGrid.appendChild(placeholder);
    }

    projectTabsContainer.querySelectorAll(".tab-btn").forEach((button) => {
      button.addEventListener("click", () => {
        activeProjectFilter = button.dataset.projectFilter;
        renderGithubProjects();
      });
    });
  }

  async function fetchGithubProjects() {
    const repos = [];
    for (let page = 1; page <= 10; page += 1) {
      const response = await fetch(`https://api.github.com/users/InfraSecID/repos?type=owner&sort=updated&per_page=100&page=${page}`, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const pageRepos = await response.json();
      repos.push(...pageRepos);
      if (pageRepos.length < 100) break;
    }

    githubProjects = repos
      .filter((repo) => !repo.fork && !["InfraSecID.io", "InfraSecID"].includes(repo.name))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .map((repo) => ({ ...repo, category: getProjectCategory(repo) }));

    if (activeProjectFilter !== "all" && !githubProjects.some((repo) => repo.category === activeProjectFilter)) {
      activeProjectFilter = "all";
    }
    renderGithubProjects();
  }

  if (projectsGrid && projectTabsContainer) {
    fetchGithubProjects().catch((error) => {
      console.warn("Could not load GitHub projects; keeping the existing portfolio cards.", error);
    });
    window.setInterval(() => {
      fetchGithubProjects().catch((error) => {
        console.warn("Could not refresh GitHub projects; keeping the last displayed projects.", error);
      });
    }, PROJECTS_REFRESH_INTERVAL);
  }

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
