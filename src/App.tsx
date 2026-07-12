import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, BookOpen, BriefcaseBusiness, Code2, Layers3, Menu, Moon, Network, ServerCog, ShieldCheck, Sun, TerminalSquare, X } from 'lucide-react'
import { profile } from './data/profile'

type Repo = { id: number; name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; fork: boolean; updated_at: string }

const nav = [['About', '#about'], ['Skills', '#skills'], ['Work', '#work'], ['GitHub', '#github'], ['Contact', '#contact']]
const iconMap = [ServerCog, ShieldCheck, Code2, BookOpen]
const terminalLines = ['ecorpset@node:~$ whoami', 'cloud · linux · cybersecurity', 'ecorpset@node:~$ uptime', 'building resilient systems', 'ecorpset@node:~$ _']

function GitHubIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .7A11.3 11.3 0 0 0 8.42 22.73c.57.1.78-.25.78-.55v-2.16c-3.18.7-3.85-1.35-3.85-1.35-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.54-.3-5.21-1.27-5.21-5.66 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.12 1.18A10.9 10.9 0 0 1 12 4.76c.97 0 1.94.13 2.85.38 2.16-1.49 3.12-1.18 3.12-1.18.62 1.58.23 2.74.11 3.03.73.8 1.17 1.83 1.17 3.08 0 4.4-2.67 5.35-5.22 5.65.41.35.78 1.03.78 2.08v3.08c0 .3.2.66.79.55A11.3 11.3 0 0 0 12 .7Z"/></svg>
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .55 }}>{children}</motion.div>
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <Reveal className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</Reveal>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [light, setLight] = useState(false)
  const [repos, setRepos] = useState<Repo[]>([])
  const [githubError, setGithubError] = useState(false)
  const [terminalIndex, setTerminalIndex] = useState(0)

  useEffect(() => {
    document.documentElement.dataset.theme = light ? 'light' : 'dark'
  }, [light])
  useEffect(() => {
    const id = window.setInterval(() => setTerminalIndex(i => (i + 1) % (terminalLines.length + 1)), 1050)
    return () => window.clearInterval(id)
  }, [])
  useEffect(() => {
    const controller = new AbortController()
    fetch(`https://api.github.com/users/${profile.github}/repos?sort=updated&per_page=100`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('GitHub unavailable')))
      .then((data: Repo[]) => setRepos(data.filter(repo => !repo.fork).slice(0, 6)))
      .catch(() => { if (!controller.signal.aborted) setGithubError(true) })
    return () => controller.abort()
  }, [])
  useEffect(() => {
    const schema = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, url: 'https://aberaberhe.github.io/Object/', sameAs: [`https://github.com/${profile.github}`], jobTitle: 'IT professional', knowsAbout: profile.skills }
    const script = document.createElement('script'); script.type = 'application/ld+json'; script.text = JSON.stringify(schema); document.head.append(script)
    return () => script.remove()
  }, [])
  const topics = useMemo(() => profile.skills.map((skill, i) => ({ skill, i })), [])

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="brand" href="#top" aria-label="EcorpSet home"><span>EC</span> EcorpSet</a>
      <nav aria-label="Primary navigation" className={menuOpen ? 'nav open' : 'nav'}>{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      <div className="header-actions"><button className="icon-button" onClick={() => setLight(v => !v)} aria-label={light ? 'Use dark theme' : 'Use light theme'}>{light ? <Moon size={18}/> : <Sun size={18}/>}</button><a className="github-link" href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer"><GitHubIcon size={17}/><span>GitHub</span></a><button className="menu-button icon-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button></div>
    </header>
    <main id="main">
      <section id="top" className="hero"><div className="orb orb-one"/><div className="orb orb-two"/><div className="grid-lines"/>
        <div className="hero-content"><motion.p className="availability" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><i/> Available for meaningful technical work</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>Engineering <em>clarity</em><br/>for complex systems.</motion.h1>
          <motion.p className="hero-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .18 }}>{profile.summary}</motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .28 }}><a className="button primary" href="#work">Explore work <ArrowDown size={16}/></a><a className="button ghost" href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer"><GitHubIcon size={16}/> View GitHub</a></motion.div>
          <div className="signal-row"><span>01 / INFRASTRUCTURE</span><span>02 / SECURITY</span><span>03 / AUTOMATION</span></div>
        </div>
        <motion.div className="terminal-card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25, duration: .6 }} aria-label="Animated terminal"><div className="terminal-top"><span/><span/><span/><b>system-status</b></div><div className="terminal-body">{terminalLines.slice(0, terminalIndex).map((line, i) => <p key={i} className={line.includes('@') ? 'command' : 'result'}>{line}</p>)}<span className="cursor"/></div><div className="terminal-footer"><span><i/> system operational</span><span>v1.0.0</span></div></motion.div>
      </section>

      <section id="about" className="section about"><SectionHeading eyebrow="01 / PROFILE" title="Built on practical experience." /><Reveal className="about-grid"><p className="about-lead">I work across the systems that keep organizations moving—servers, networks, cloud infrastructure, and the applications around them.</p><div><p>With a Computer Science background and more than three years of practical IT experience, I bring a grounded, systems-first approach to technical work.</p><p>My focus sits where reliable infrastructure, thoughtful automation, and security awareness meet.</p></div></Reveal></section>

      <section id="skills" className="section muted"><SectionHeading eyebrow="02 / CAPABILITIES" title="A practical technical toolkit." copy="Tools and domains developed through hands-on IT work and continual learning."/><div className="skill-cloud">{topics.map(({ skill, i }) => <Reveal key={skill}><span className={`skill-chip chip-${i % 4}`}>{skill}</span></Reveal>)}</div></section>

      <section id="work" className="section"><SectionHeading eyebrow="03 / EXPERIENCE" title="Infrastructure-minded by default."/><div className="timeline"><Reveal><article><span className="timeline-marker"><ServerCog size={18}/></span><p className="eyebrow">FOUNDATION</p><h3>Systems & infrastructure</h3><p>Linux administration, Windows Server, VMware, cloud infrastructure, and Huawei DCS capabilities.</p></article></Reveal><Reveal><article><span className="timeline-marker"><Network size={18}/></span><p className="eyebrow">PRACTICE</p><h3>Networks & security</h3><p>Networking and cybersecurity knowledge applied with operational awareness.</p></article></Reveal><Reveal><article><span className="timeline-marker"><Code2 size={18}/></span><p className="eyebrow">BUILD</p><h3>Automation & software</h3><p>Python, Bash, SQL, Django, React, Java, and C++ for useful technical solutions.</p></article></Reveal></div></section>

      <section id="github" className="section github-section"><SectionHeading eyebrow="04 / OPEN SOURCE" title="Work, straight from GitHub." copy="Live repository data is loaded directly from the public GitHub profile."/><div className="repo-grid">{repos.map(repo => <Reveal key={repo.id}><a className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer"><div><GitHubIcon size={19}/><ArrowUpRight size={18}/></div><h3>{repo.name}</h3><p>{repo.description || 'Open the repository to explore this work.'}</p><footer><span>{repo.language || 'Code'}</span><span>★ {repo.stargazers_count}</span></footer></a></Reveal>)}{!repos.length && <div className="repo-empty">{githubError ? 'GitHub is currently unavailable. Visit the profile directly.' : 'Loading repositories…'}</div>}</div><a className="text-link" href={`https://github.com/${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">All repositories <ArrowUpRight size={16}/></a></section>

      <section className="section muted"><SectionHeading eyebrow="05 / SERVICES" title="Technical support with a systems view."/><div className="service-grid">{profile.services.map(([title, copy], i) => { const Icon = iconMap[i]; return <Reveal key={title}><article className="service"><Icon size={23}/><h3>{title}</h3><p>{copy}</p><span>0{i + 1}</span></article></Reveal>})}</div></section>

      <section className="section stack-section"><SectionHeading eyebrow="06 / TECH STACK" title="From the command line to the interface."/><Reveal><div className="stack-row"><div><TerminalSquare/><b>Systems</b><span>Linux · Windows Server · VMware · Huawei DCS</span></div><div><ShieldCheck/><b>Network & security</b><span>Networking · Cybersecurity · Cloud</span></div><div><Layers3/><b>Development</b><span>Python · Django · React · Java · C++ · Bash · SQL</span></div></div></Reveal></section>

      <section className="section learning"><SectionHeading eyebrow="07 / CONTINUING JOURNEY" title="Always learning, always refining."/><div className="learning-grid"><Reveal><article><BookOpen/><h3>Learning journey</h3><p>Continual study across cloud infrastructure, Linux systems, cybersecurity, and modern software practices.</p></article></Reveal><Reveal><article><ShieldCheck/><h3>Certifications</h3><p>Certification details will be shared here once verified and ready to publish.</p></article></Reveal><Reveal><article><BriefcaseBusiness/><h3>Writing</h3><p>Technical notes and practical lessons are planned for this space.</p><span className="soon">COMING SOON</span></article></Reveal></div></section>

      <section id="contact" className="contact-section"><Reveal><p className="eyebrow">08 / CONNECT</p><h2>Let’s build something <em>reliable.</em></h2><p>For professional connections and current work, find EcorpSet on GitHub.</p><a className="button primary" href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer"><GitHubIcon size={17}/> Connect on GitHub <ArrowUpRight size={16}/></a></Reveal></section>
    </main>
    <footer className="footer"><a className="brand" href="#top"><span>EC</span> EcorpSet</a><p>Designed for clear systems and resilient infrastructure.</p><a href="#top" aria-label="Back to top"><ArrowDown size={17}/></a></footer>
  </>
}

export default App
