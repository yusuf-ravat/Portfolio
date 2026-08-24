/**
 * YUSUFALI RAVAT - PORTFOLIO INTERACTIVITY ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicYear();
  initModeToggle();
  initThemePicker();
  initCanvas();
  initTypewriter();
  initNavScroll();
  initProjectFilters();
  initProjectModals();
  initInteractiveTerminal();
  initCopyButtons();
  initContactForm();
});

function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   0. DARK / LIGHT COLOR MODE TOGGLER
   ========================================================================== */
function initModeToggle() {
  const modeBtn = document.getElementById('modeToggleBtn');
  const modeIcon = document.getElementById('modeIcon');

  // Load saved mode (default: dark)
  const savedMode = localStorage.getItem('yr_portfolio_mode') || 'dark';
  applyMode(savedMode);

  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const currentMode = document.documentElement.getAttribute('data-mode') || 'dark';
      const newMode = currentMode === 'dark' ? 'light' : 'dark';
      applyMode(newMode);
      localStorage.setItem('yr_portfolio_mode', newMode);
      showToast(`Switched to ${newMode === 'light' ? 'Light' : 'Dark'} Mode`);
    });
  }

  function applyMode(mode) {
    document.documentElement.setAttribute('data-mode', mode);
    if (modeIcon) {
      if (mode === 'light') {
        modeIcon.className = 'fas fa-moon';
        modeBtn?.setAttribute('title', 'Switch to Dark Mode');
      } else {
        modeIcon.className = 'fas fa-sun';
        modeBtn?.setAttribute('title', 'Switch to Light Mode');
      }
    }
  }
}

/* ==========================================================================
   1. THEME ACCENT PICKER & PERSISTENCE
   ========================================================================== */
function initThemePicker() {
  const themeBtn = document.getElementById('themePickerBtn');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeOptions = document.querySelectorAll('.theme-option');

  // Load saved theme
  const savedTheme = localStorage.getItem('yr_portfolio_theme') || 'cyan';
  if (savedTheme !== 'cyan') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!themeDropdown.contains(e.target) && e.target !== themeBtn) {
        themeDropdown.classList.remove('show');
      }
    });

    themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.getAttribute('data-set-theme');
        if (theme === 'cyan') {
          document.documentElement.removeAttribute('data-theme');
        } else {
          document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('yr_portfolio_theme', theme);
        themeDropdown.classList.remove('show');
        showToast(`Accent color set to ${opt.textContent.trim()}`);
      });
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE CANVAS PARTICLE BACKGROUND
   ========================================================================== */
function initCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-mode') === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight 
        ? `rgba(2, 132, 199, ${this.alpha * 0.4})` 
        : `rgba(0, 242, 254, ${this.alpha * 0.5})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute('data-mode') === 'light';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isLight
            ? `rgba(2, 132, 199, ${0.08 * (1 - dist / 110)})`
            : `rgba(0, 242, 254, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const words = [
    "Jr. .NET Core Developer",
    "Full-Stack Web Architect",
    "AI & LLM Integration Explorer",
    "ReactJS & ASP.NET Specialist"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   4. NAVIGATION SCROLL SPY & MOBILE MENU
   ========================================================================== */
function initNavScroll() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    navLinkItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle?.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }
}

/* ==========================================================================
   5. PROJECT FILTERING LOGIC
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category?.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT DETAIL MODAL SYSTEM
   ========================================================================== */
const projectData = {
  axivon: {
    title: "Axivon — AI-Powered SaaS CRM Platform",
    category: "Flagship Independent Project | AI & SaaS",
    period: "2024 – Present",
    role: "Full-Stack & AI Software Developer (4-Member Team)",
    summary: "Working as a core software developer in a 4-member team to architect and build a high-performance, multi-tenant AI-powered SaaS CRM platform designed to streamline customer relationships and automate complex sales workflows.",
    techStack: [
      "ReactJS", ".NET Core Web API", "Entity Framework", "PostgreSQL", 
      "Generative AI", "LLMs", "AI Agents", "Claude Code", "Gemini", "REST APIs"
    ],
    responsibilities: [
      "Architected & developed scalable RESTful APIs using .NET Core Web API and Entity Framework.",
      "Designed PostgreSQL database schemas with multi-tenancy, strict tenant-level data isolation, and role-based access control (RBAC).",
      "Engineered comprehensive CRM modules including Leads, Companies, Contacts, Deals, Tasks, Activities, Calendar, and Dashboard analytics.",
      "Researched and integrated Generative AI & AI Agent workflows for automated smart follow-ups, meeting intelligence, and CRM workflow automation.",
      "Leveraged AI coding agents (Gemini, Claude Code) for rapid prototyping, refactoring, unit tests, and code optimization.",
      "Conducted extensive API integration testing, security reviews, and collaborated in Agile team sprints."
    ],
    highlights: [
      "Multi-tenant data isolation architecture",
      "AI-driven automated sales follow-ups",
      "High-speed PostgreSQL query execution",
      "End-to-end full stack development"
    ]
  },
  motel: {
    title: "Motel Booking Platform",
    category: "Independent Client Project",
    period: "2024",
    role: "Full-Stack .NET Developer",
    summary: "A complete room reservation and booking management system built for hospitality clients, featuring separate administrative and customer portals with automated dynamic pricing algorithms.",
    techStack: [
      ".NET Core Web API", "ReactJS", "AngularJS", "MS SQL Server", 
      "Bootstrap", "HTML5", "CSS3", "JavaScript"
    ],
    responsibilities: [
      "Developed room booking, availability checking, and advance customer reservation modules.",
      "Built a comprehensive admin management dashboard for room inventory, booking approvals, and rate management.",
      "Implemented dynamic pricing business logic to automatically adjust room rates for weekends and high-demand periods.",
      "Added festival-based surge pricing configuration controls directly into the admin console.",
      "Designed robust backend APIs in .NET Core to guarantee zero overbooking and high consistency in MS SQL Server."
    ],
    highlights: [
      "Automated weekend & festival pricing engine",
      "Separate customer and admin interfaces",
      "Seamless availability calendars and instant confirmations"
    ]
  },
  vaibhavlaxmi: {
    title: "VaibhavLaxmi — Finance Management Software",
    category: "Enterprise Solution | FinTech",
    period: "Enterprise Analytic LLP",
    role: "Jr. Web Developer",
    summary: "An enterprise-grade financial management system engineered to handle multi-branch loan distributions, interest rate calculations, repayment installments, and compliance auditing.",
    techStack: [
      ".NET Core Web API", "AngularJS", "MS SQL Server", 
      "Bootstrap", "HTML5", "CSS3", "JavaScript"
    ],
    responsibilities: [
      "Engineered loan management, installment amortization tracking, and complex interest calculation modules.",
      "Built a secure multi-branch loan distribution and collection system, guaranteeing data integrity across distributed branches.",
      "Designed and optimized RESTful APIs and wrote complex MS SQL stored procedures to handle high transaction volumes.",
      "Crafted responsive and intuitive user interfaces with AngularJS, Bootstrap, and CSS3."
    ],
    highlights: [
      "Multi-branch secure ledger and distribution",
      "Automated interest and EMI amortization engine",
      "Optimized SQL queries for high-throughput reporting"
    ]
  },
  semicon: {
    title: "Semicon Referrals — Candidate & Job Portal",
    category: "Enterprise Web Application",
    period: "Enterprise Analytic LLP",
    role: "Jr. Web Developer",
    summary: "A corporate talent recruitment and referral portal that connects qualified candidates with job openings while incentivizing community referrals with automated reward calculation.",
    techStack: [
      ".NET Core Web API", "AngularJS", "MS SQL Server", 
      "JavaScript", "Bootstrap", "HTML5", "CSS3"
    ],
    responsibilities: [
      "Developed core modules for job postings, candidate resume submissions, application tracking, and referral management.",
      "Engineered backend incentive calculation logic to automatically track and credit referral rewards.",
      "Optimized database queries and API response times, resulting in a snappy, seamless user experience.",
      "Collaborated in sprint cycles to rapidly deliver client-requested feature iterations."
    ],
    highlights: [
      "Automated referral reward payout tracking",
      "Comprehensive application status dashboard",
      "Fast, indexed candidate search system"
    ]
  },
  memoriesnsmiles: {
    title: "Memoriesnsmiles — Event Management Platform",
    category: "Service Booking & Event Portal",
    period: "Enterprise Analytic LLP",
    role: "Jr. Web Developer",
    summary: "An all-in-one event booking platform allowing clients to seamlessly customize, schedule, and book photography, catering, and venue decoration services under unified packages.",
    techStack: [
      ".NET Core Web API", "AngularJS", "MS SQL Server", 
      "RESTful APIs", "Bootstrap", "JavaScript"
    ],
    responsibilities: [
      "Developed interactive service customization workflows for photography, catering, and decorations.",
      "Built and integrated .NET Core RESTful APIs to handle booking validation, dates availability, and vendor notifications.",
      "Enhanced database performance by structuring relational tables in MS SQL Server.",
      "Collaborated closely with QA teams to eliminate edge cases and optimize frontend responsiveness."
    ],
    highlights: [
      "Multi-service package builder",
      "Unified date & vendor availability checker",
      "Interactive customer dashboard"
    ]
  },
  shopify: {
    title: "Shopify E-Commerce & Dropshipping Store",
    category: "E-Commerce & Automation",
    period: "Self-Learning & Practical Project",
    role: "Store Architect & Developer",
    summary: "A practical e-commerce clothing store built to gain deep hands-on expertise in storefront customization, order fulfillment automation, dropshipping pipelines, and merchant operations.",
    techStack: [
      "Shopify", "Qikink API", "Dropshipping", 
      "E-Commerce Automation", "UI Customization"
    ],
    responsibilities: [
      "Configured and customized the online clothing storefront, layouts, product collections, and navigation.",
      "Integrated dropshipping automation workflows connecting store orders directly with Qikink for automated fulfillment.",
      "Managed product listings, variant pricing, payment gateways, and checkout funnel optimization.",
      "Gained valuable operational insights into modern digital commerce and supplier API integrations."
    ],
    highlights: [
      "Full dropshipping workflow integration with Qikink",
      "Customized storefront UX & mobile checkout",
      "Automated inventory and order synchronization"
    ]
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalDetailsContainer');
  const closeBtn = document.getElementById('modalCloseBtn');
  const detailButtons = document.querySelectorAll('[data-project-id]');

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data || !modalBody || !modalBackdrop) return;

    modalBody.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
        <div>
          <span class="project-tag-badge">${data.category}</span>
          <h2 style="font-size:1.6rem; margin-top:8px;">${data.title}</h2>
          <p style="color:var(--accent-primary); font-family:var(--font-mono); font-size:0.9rem; margin-top:4px;">${data.role} • ${data.period}</p>
        </div>
      </div>

      <div>
        <h4 style="font-size:1rem; margin-bottom:8px; color:#fff;">Project Overview</h4>
        <p style="color:var(--text-secondary); line-height:1.7;">${data.summary}</p>
      </div>

      <div>
        <h4 style="font-size:1rem; margin-bottom:10px; color:#fff;">Key Responsibilities & Contributions</h4>
        <ul style="display:flex; flex-direction:column; gap:10px;">
          ${data.responsibilities.map(r => `
            <li style="position:relative; padding-left:22px; color:#cbd5e1; font-size:0.92rem; line-height:1.6;">
              <span style="position:absolute; left:0; color:var(--accent-primary); font-weight:bold;">▹</span>
              ${r}
            </li>
          `).join('')}
        </ul>
      </div>

      <div>
        <h4 style="font-size:1rem; margin-bottom:10px; color:#fff;">Key Highlights</h4>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${data.highlights.map(h => `
            <span style="padding:6px 12px; background:rgba(0, 242, 254, 0.08); border:1px solid var(--accent-border); border-radius:6px; font-size:0.82rem; color:var(--accent-primary); font-weight:500;">
              ✓ ${h}
            </span>
          `).join('')}
        </div>
      </div>

      <div>
        <h4 style="font-size:1rem; margin-bottom:10px; color:#fff;">Technologies & Tools</h4>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${data.techStack.map(t => `<span class="tech-tag" style="font-size:0.82rem; padding:5px 12px;">${t}</span>`).join('')}
        </div>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      if (id) openModal(id);
    });
  });

  closeBtn?.addEventListener('click', closeModal);

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. INTERACTIVE AI / CLI TERMINAL PLAYGROUND
   ========================================================================== */
function initInteractiveTerminal() {
  const cliOutput = document.getElementById('cliOutput');
  const cliInput = document.getElementById('cliInput');
  const cliHints = document.querySelectorAll('.cli-btn-hint');

  const commands = {
    help: `Available commands:
• <span style="color:var(--accent-primary)">skills</span>: List technical competencies & tools
• <span style="color:var(--accent-primary)">axivon</span>: View details of flagship AI SaaS CRM
• <span style="color:var(--accent-primary)">experience</span>: Summary of professional background
• <span style="color:var(--accent-primary)">contact</span>: Get direct email, phone & social links
• <span style="color:var(--accent-primary)">education</span>: View engineering degree info
• <span style="color:var(--accent-primary)">clear</span>: Clear terminal console`,
    
    skills: `Technical Stack:
• <b>Backend:</b> .NET Core, ASP.NET MVC, Web API, Entity Framework, C#
• <b>Frontend:</b> ReactJS, AngularJS, JavaScript (ES6+), Bootstrap, HTML5/CSS3
• <b>Databases:</b> PostgreSQL, MS SQL Server, MySQL
• <b>AI & Automation:</b> Generative AI, LLMs, AI Agents, Gemini, Claude Code, Prompt Engineering
• <b>Tools:</b> Git, GitHub, Visual Studio, Postman, Shopify, Qikink, Antigravity`,

    axivon: `🚀 <b>Axivon SaaS CRM:</b>
• AI-powered multi-tenant CRM for customer relationship & workflow automation
• Stack: ReactJS, .NET Core Web API, Entity Framework, PostgreSQL, AI Agents
• Yusufali's role: Core developer in a 4-member team building APIs, tenant isolation, and AI workflows.`,

    experience: `💼 <b>Experience Timeline:</b>
1. <b>Independent SaaS & AI Research (June 2024 – Present)</b>
   - Developing Axivon AI SaaS CRM & Client Motel Booking platform.
2. <b>Enterprise Analytic LLP (Jan 2023 – June 2024)</b>
   - Jr. Web Developer (.NET Core Web API, AngularJS, MS SQL).
3. <b>Enterprise Analytic LLP (Jan 2023 – Mar 2023)</b>
   - Developer Intern (.NET Core, SQL Server).`,

    contact: `📬 <b>Contact Yusufali Ravat:</b>
• Email: <a href="mailto:yravat009@gmail.com" style="color:var(--accent-primary)">yravat009@gmail.com</a>
• Phone: <a href="tel:+919714405312" style="color:var(--accent-primary)">+91 97144 05312</a>
• GitHub: <a href="https://github.com/yusuf-ravat" target="_blank" style="color:var(--accent-primary)">github.com/yusuf-ravat</a>
• LinkedIn: <a href="https://www.linkedin.com/in/yusuf-ravat" target="_blank" style="color:var(--accent-primary)">linkedin.com/in/yusuf-ravat</a>
• Location: Gujarat, India (Open to Remote / Global roles)`,

    education: `🎓 <b>Education:</b>
• <b>B.E. in Computer Engineering (2020 – 2023)</b>
  Smt S R Patel Engineering, Unjha
• <b>Diploma in Computer Engineering (2017 – 2020)</b>
  Government Polytechnic, Waghai`
  };

  function executeCliCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Append user query line
    const userLine = document.createElement('div');
    userLine.className = 'cli-output-line';
    userLine.innerHTML = `<span class="cli-symbol">yusufali@dev:~$</span> <span style="color:#fff;">${escapeHtml(cmd)}</span>`;
    cliOutput?.appendChild(userLine);

    if (cmd === 'clear') {
      if (cliOutput) cliOutput.innerHTML = '';
      return;
    }

    const response = commands[cmd] || `Command not found: "${escapeHtml(cmd)}". Type <span style="color:var(--accent-primary)">help</span> for available commands.`;

    const resLine = document.createElement('div');
    resLine.className = 'cli-output-line';
    resLine.style.color = '#cbd5e1';
    resLine.innerHTML = response.replace(/\n/g, '<br>');
    cliOutput?.appendChild(resLine);

    if (cliOutput) cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCliCommand(cliInput.value);
        cliInput.value = '';
      }
    });
  }

  cliHints.forEach(hint => {
    hint.addEventListener('click', () => {
      const cmd = hint.getAttribute('data-cmd');
      if (cmd) {
        executeCliCommand(cmd);
      }
    });
  });
}

/* ==========================================================================
   8. CLIPBOARD COPY UTILITY & TOASTS
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy-text]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      const label = btn.getAttribute('data-copy-label') || 'Text';

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${label} to clipboard!`);
        }).catch(() => {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast(`Copied ${label} to clipboard!`);
        });
      }
    });
  });
}

function showToast(message) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--accent-primary);"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   9. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const subjectInput = document.getElementById('formSubject');
    const messageInput = document.getElementById('formMessage');

    const name = nameInput?.value || '';
    const email = emailInput?.value || '';
    const subject = subjectInput?.value || 'Portfolio Contact Inquiry';
    const message = messageInput?.value || '';

    // Direct mailto link fallback trigger
    const mailtoUri = `mailto:yravat009@gmail.com?subject=${encodeURIComponent(subject + " - from " + name)}&body=${encodeURIComponent("Sender Email: " + email + "\n\n" + message)}`;
    
    showToast("Opening email client to send your message...");
    setTimeout(() => {
      window.location.href = mailtoUri;
      form.reset();
    }, 800);
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
