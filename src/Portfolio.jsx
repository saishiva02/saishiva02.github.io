import { useState, useEffect, useRef } from "react";
import "./Portfolio.css";

const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack shopping app with React, Node.js & Stripe integration. JWT auth, real-time inventory.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "#",
    year: "2024",
  },
  {
    id: 2,
    title: "Dev Dashboard",
    description: "Real-time metrics dashboard with WebSocket updates, chart visualizations & dark/light mode.",
    tags: ["TypeScript", "WebSockets", "D3.js", "Express"],
    link: "#",
    year: "2024",
  },
  {
    id: 3,
    title: "AI Note App",
    description: "Smart note-taking app powered by OpenAI API. Auto-summarization & semantic search.",
    tags: ["Next.js", "OpenAI", "PostgreSQL", "Tailwind"],
    link: "#",
    year: "2023",
  },
  {
    id: 4,
    title: "CLI Task Manager",
    description: "Terminal-based productivity tool in Rust. File persistence, tagging, priority queues.",
    tags: ["Rust", "CLI", "SQLite"],
    link: "#",
    year: "2023",
  },
];

const SKILLS = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "CSS / Tailwind"] },
  { category: "Backend", items: ["Node.js", "Express", "Python", "REST & GraphQL"] },
  { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis", "Prisma"] },
  { category: "DevOps", items: ["Docker", "GitHub Actions", "Vercel", "AWS basics"] },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const hover = () => ring.current?.classList.add("big");
    const leave = () => ring.current?.classList.remove("big");
    document.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,.project-card").forEach((el) => {
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", leave);
    });
    let raf;
    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dot.current) { dot.current.style.transform = `translate(${mx - 4}px,${my - 4}px)`; }
      if (ring.current) { ring.current.style.transform = `translate(${rx - 20}px,${ry - 20}px)`; }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); document.removeEventListener("mousemove", move); };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <span className="nav-logo">YN</span>
      <ul className="nav-links">
        {["projects", "skills", "contact"].map((s) => (
          <li key={s}>
            <a href={`#${s}`} className={active === s ? "active" : ""}>
              {s}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Hero() {
  const [ref, inView] = useInView(0.1);
  return (
    <section className="hero" ref={ref}>
      <div className={`hero-content ${inView ? "visible" : ""}`}>
        <p className="hero-greeting">Hey, I'm</p>
        <h1 className="hero-name">GAJULA SAISHIVA</h1>
        <p className="hero-role">Software Developer</p>
        <p className="hero-bio">
          I build fast, clean, and thoughtful digital products. Focused on great UX, solid architecture & shipping things that work.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">View Work</a>
          <a href="#contact" className="btn-ghost">Get in touch</a>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-n">12+</span><span className="stat-l">Projects</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-n">3 yrs</span><span className="stat-l">Experience</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-n">8+</span><span className="stat-l">Tech stack</span></div>
        </div>
      </div>
      <div className={`hero-visual ${inView ? "visible" : ""}`}>
        <div className="avatar-wrap">
          <div className="avatar-ring" />
          <div className="avatar-initials">GS</div>
        </div>
        <div className="floating-badge badge-1">React</div>
        <div className="floating-badge badge-2">Node.js</div>
        <div className="floating-badge badge-3">TypeScript</div>
      </div>
    </section>
  );
}

function Projects() {
  const [ref, inView] = useInView();
  const [filter, setFilter] = useState("All");
  const allTags = ["All", ...new Set(PROJECTS.flatMap((p) => p.tags))];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter));
  return (
    <section id="projects" className="section" ref={ref}>
      <div className={`section-header ${inView ? "visible" : ""}`}>
        <span className="section-label">Work</span>
        <h2 className="section-title">Selected Projects</h2>
      </div>
      <div className={`filter-bar ${inView ? "visible" : ""}`}>
        {allTags.slice(0, 7).map((t) => (
          <button key={t} className={`filter-btn ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="projects-grid">
        {filtered.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`project-card ${inView ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="project-top">
        <span className="project-year">{project.year}</span>
        <a href={project.link} className="project-arrow" aria-label="Open project">↗</a>
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.description}</p>
      <div className="project-tags">
        {project.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}

function Skills() {
  const [ref, inView] = useInView();
  return (
    <section id="skills" className="section skills-section" ref={ref}>
      <div className={`section-header ${inView ? "visible" : ""}`}>
        <span className="section-label">Stack</span>
        <h2 className="section-title">Skills & Tools</h2>
      </div>
      <div className="skills-grid">
        {SKILLS.map((group, i) => (
          <div
            key={group.category}
            className={`skill-group ${inView ? "visible" : ""}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <h4 className="skill-category">{group.category}</h4>
            <ul className="skill-list">
              {group.items.map((item) => (
                <li key={item} className="skill-item">
                  <span className="skill-dot" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [ref, inView] = useInView();
  const [copied, setCopied] = useState(false);
  const email = "thisissaishiva@email.com";
  const copy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section id="contact" className="section contact-section" ref={ref}>
      <div className={`contact-inner ${inView ? "visible" : ""}`}>
        <span className="section-label">Contact</span>
        <h2 className="section-title">Let's build something</h2>
        <p className="contact-sub">Open to full-time roles, freelance, and interesting collaborations.</p>
        <button className="email-pill" onClick={copy}>
          <span>{email}</span>
          <span className="copy-label">{copied ? "Copied!" : "Copy"}</span>
        </button>
        <div className="social-links">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn">LinkedIn</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn">Twitter</a>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = ["projects", "skills", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="portfolio">
      <Cursor />
      <Navbar active={active} />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="footer">
        <span>Built with React · Hosted on GitHub Pages</span>
        <span>© 2026 G SAISHIVA</span>
      </footer>
    </div>
  );
}
