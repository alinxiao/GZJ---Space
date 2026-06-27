import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const projects = [
  {
    id: '01',
    title: '玖珑港社区全案设计',
    en: 'JIULONGGANG COMMUNITY',
    type: '社区商业 / 城市更新',
    year: '2026',
    image: '/images/projects/jiulonggang-cover.jpg',
    detailImage: '/images/details/jiulonggang-detail.jpg',
    description: '以“持续探索”为核心，将旧冷冻厂转译为融合餐饮、共享工坊、创业孵化与社区生活的复合场域。',
    meta: ['18,600 m² 场地研究', '1,600 m² 室内设计', '全案策略与空间表达'],
  },
  {
    id: '02',
    title: '诗卷东方 · 金陵',
    en: 'ORIENTAL POETICS',
    type: '餐饮空间 / 文化叙事',
    year: '2025',
    image: '/images/projects/jinling-cover.jpg',
    detailImage: '/images/details/jinling-detail.png',
    description: '让北京菜系与南京古都文化展开时空对话，以路径、镜面与层次重构东方餐饮空间。',
    meta: ['动线重构', '品牌语境提炼', '效果表达'],
  },
  {
    id: '03',
    title: '湾海创晶洲',
    en: 'BAY CULTURAL HUB',
    type: '展陈设计 / 厂房改造',
    year: '2025',
    image: '/images/projects/wanhai-cover.jpg',
    detailImage: '/images/details/wanhai-detail.jpg',
    description: '从渔港、工业与珊瑚意象中提取空间语言，探索地域文化与交互式展陈的共同生长。',
    meta: ['厂房再生', '互动展陈', '地域文化'],
  },
  {
    id: '04',
    title: '浮舟新渡 · 江畔船坞',
    en: 'RIVERSIDE DOCK',
    type: 'AI 概念设计 / 滨水更新',
    year: '2025',
    image: '/images/projects/fuzhou-cover.png',
    detailImage: '/images/details/fuzhou-detail.png',
    description: '保留工业遗址记忆，以 AI 辅助概念推演，构建文化、艺术与商业共生的滨水创意聚落。',
    meta: ['AI 概念推演', '工业遗产更新', '建筑景观协同'],
  },
]

const strengths = [
  ['01', '空间策略', '从场地研究、业态逻辑到动线规划，把概念转化为可沟通、可推进的空间方案。', '/images/abilities/strategy.jpg'],
  ['02', '设计表达', '熟悉平面方案、施工图、建模与效果表达，在不同阶段保持信息清晰与视觉完整。', '/images/abilities/expression-compressed.jpg'],
  ['03', 'AI 工作流', '关注生成式 AI 与空间设计的结合，用于概念发散、风格探索和汇报效率提升。', '/images/abilities/ai-application.png'],
  ['04', '视觉叙事', '两年校园摄影团队经验，擅长从构图、光线与节奏中建立具有氛围感的故事。', '/images/abilities/visual-story.jpg'],
]

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>
}

function InteractiveWord({ children, as: Tag = 'h1', className = '' }) {
  const wordRef = useRef(null)
  const frameRef = useRef(null)
  const targetsRef = useRef([])
  const valuesRef = useRef([])

  const animateLetters = () => {
    const letters = wordRef.current?.querySelectorAll('.hero-letter')
    if (!letters) {
      frameRef.current = null
      return
    }

    let stillMoving = false
    letters.forEach((letter, index) => {
      const target = targetsRef.current[index] || 0
      const current = valuesRef.current[index] || 0
      const difference = target - current
      const next = Math.abs(difference) < 0.002 ? target : current + difference * 0.16
      valuesRef.current[index] = next
      letter.style.setProperty('--influence', next.toFixed(3))
      if (Math.abs(target - next) >= 0.002) stillMoving = true
    })

    frameRef.current = stillMoving ? requestAnimationFrame(animateLetters) : null
  }

  const startAnimation = () => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(animateLetters)
  }

  const updateLetters = event => {
    const letters = wordRef.current?.querySelectorAll('.hero-letter')
    const wordRect = wordRef.current?.getBoundingClientRect()
    if (!letters || !wordRect) return

    letters.forEach((letter, index) => {
      const center = wordRect.left + letter.offsetLeft + letter.offsetWidth / 2
      const distance = Math.abs(event.clientX - center)
      targetsRef.current[index] = Math.max(0, 1 - distance / Math.max(180, wordRect.width * 0.22))
    })
    startAnimation()
  }

  const resetLetters = () => {
    targetsRef.current = [...children].map(() => 0)
    startAnimation()
  }

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <Tag
      ref={wordRef}
      className={`interactive-word ${className}`.trim()}
      onPointerMove={updateLetters}
      onPointerLeave={resetLetters}
      aria-label={children}
    >
      {[...children].map((letter, index) => (
        <span className="hero-letter" style={{ '--letter-index': index }} aria-hidden="true" key={`${letter}-${index}`}>
          {letter}
        </span>
      ))}
    </Tag>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [navFixed, setNavFixed] = useState(false)
  const [loadHeroVideo, setLoadHeroVideo] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.setProperty('--scroll', `${window.scrollY * 0.18}px`)
        setNavFixed(heroRef.current.getBoundingClientRect().bottom <= 90)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const targets = document.querySelectorAll([
      '.nav',
      '.contact-pill',
      '.hero-cta',
      '.portrait-wrap',
      '.stats > div',
      '.project-card',
      '.ability-grid article',
      '.footer-mail',
    ].join(','))

    const cleanups = [...targets].map(target => {
      const glow = document.createElement('span')
      glow.className = 'cursor-border-glow'
      glow.setAttribute('aria-hidden', 'true')
      target.appendChild(glow)

      const originalPosition = target.style.position
      if (getComputedStyle(target).position === 'static') target.style.position = 'relative'

      let frame = null
      let pointerX = 0
      let pointerY = 0

      const update = () => {
        const rect = target.getBoundingClientRect()
        glow.style.setProperty('--glow-x', `${pointerX - rect.left}px`)
        glow.style.setProperty('--glow-y', `${pointerY - rect.top}px`)
        frame = null
      }

      const onMove = event => {
        pointerX = event.clientX
        pointerY = event.clientY
        if (!frame) frame = requestAnimationFrame(update)
      }
      const onEnter = event => {
        glow.classList.add('is-visible')
        onMove(event)
      }
      const onLeave = () => glow.classList.remove('is-visible')

      target.addEventListener('pointermove', onMove, { passive: true })
      target.addEventListener('pointerenter', onEnter, { passive: true })
      target.addEventListener('pointerleave', onLeave, { passive: true })

      return () => {
        if (frame) cancelAnimationFrame(frame)
        target.removeEventListener('pointermove', onMove)
        target.removeEventListener('pointerenter', onEnter)
        target.removeEventListener('pointerleave', onLeave)
        target.style.position = originalPosition
        glow.remove()
      }
    })

    return () => cleanups.forEach(cleanup => cleanup())
  }, [])

  useEffect(() => {
    document.body.style.overflow = activeProject || menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeProject, menuOpen])

  useEffect(() => {
    let idleId = null
    let timeoutId = null

    const startLoadingVideo = () => {
      const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData
      const smallScreen = typeof window !== 'undefined' && window.innerWidth < 900

      if (reduceMotion || saveData || smallScreen) return
      setLoadHeroVideo(true)
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(startLoadingVideo, { timeout: 1800 })
      return () => window.cancelIdleCallback(idleId)
    }

    timeoutId = window.setTimeout(startLoadingVideo, 1200)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <main>
      <header className={`nav shell${navFixed ? ' nav-fixed' : ''}`}>
        <a className="brand" href="#top" aria-label="返回首页">
          <span>GZJ</span><small>SPATIAL / AI DESIGN</small>
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#about" onClick={() => setMenuOpen(false)}>关于</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>项目</a>
          <a href="#ability" onClick={() => setMenuOpen(false)}>能力</a>
        </nav>
        <a className="contact-pill" href="mailto:13421276541@163.com">联系我 <Arrow diagonal /></a>
        <button className="menu" onClick={() => setMenuOpen(v => !v)} aria-label="切换菜单">{menuOpen ? '×' : '＝'}</button>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <video className="hero-video" autoPlay={loadHeroVideo} muted loop playsInline preload={loadHeroVideo ? 'auto' : 'none'} poster="/images/projects/community-45.jpg">
          {loadHeroVideo && <source src="/hero-loop.mp4" type="video/mp4" />}
        </video>
        <div className="hero-shade" />
        <div className="hero-grid shell">
          <div className="hero-masthead">
            <InteractiveWord>SPATIAL</InteractiveWord>
            <span className="masthead-arrow">→</span>
            <p>COMMERCIAL SPACE<br />& AI DESIGN PORTFOLIO</p>
          </div>
          <div className="hero-metric">
            <span className="metric-mark">///</span>
            <strong>04<sup>+</sup></strong>
            <p>SELECTED PROJECTS<br />FROM STRATEGY TO SPACE</p>
          </div>
          <a className="hero-cta" href="#work">
            <span>VIEW SELECTED WORKS</span><Arrow diagonal />
          </a>
          <div className="hero-manifesto">
            <b>GZJ</b>
            <p><span>DESIGN</span> IS NOT<br />DECORATION.</p>
          </div>
          <div className="hero-bottom">
            <p>GUAN ZHIJUN / HUIZHOU, CHINA</p>
            <p>SPATIAL STRATEGY · VISUAL NARRATIVE · AI WORKFLOW</p>
          </div>
        </div>
      </section>

      <div className="ambient-bg" aria-hidden="true">
        <span className="ambient-orb ambient-orb-teal" />
        <span className="ambient-orb ambient-orb-blue" />
        <span className="ambient-flow" />
        <svg className="ambient-grain" xmlns="http://www.w3.org/2000/svg">
          <filter id="ambient-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" seed="9" stitchTiles="stitch">
              <animate attributeName="seed" values="8;9;10;9;8" dur="1.6s" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#ambient-noise)" />
        </svg>
      </div>

      <section className="about section shell" id="about">
        <div className="section-kicker"><span>01</span> ABOUT / PROFILE</div>
        <div className="about-layout">
          <div className="portrait-wrap">
            <div className="portrait-grid" aria-hidden="true" />
            <img src="/images/profile/guan-zhijun-motion-v2.png" alt="关智钧拖影风格个人照片" loading="lazy" decoding="async" />
            <div className="portrait-label">GUAN ZHIJUN<br />HUIZHOU, CHINA</div>
          </div>
          <div className="about-copy">
            <h2 className="about-heading">
              <InteractiveWord as="span" className="about-interactive-line">不只设计空间，</InteractiveWord>
              <InteractiveWord as="span" className="about-interactive-line">也设计人与空间的</InteractiveWord>
              <InteractiveWord as="span" className="about-interactive-line about-accent">关系。</InteractiveWord>
            </h2>
            <div className="about-columns">
              <p>环境设计本科背景，拥有商业空间项目协作与落地经验。参与从场地调研、平面规划、图纸绘制到模型表达和现场反馈的完整流程。</p>
              <p>我把 AI 视为设计思考的放大器，用它拓宽概念探索的边界，同时用扎实的空间逻辑让想象回到真实场景。</p>
            </div>
            <a className="text-link" href="mailto:13421276541@163.com">13421276541@163.com <Arrow diagonal /></a>
          </div>
        </div>
        <div className="stats">
          <div><strong>4+</strong><span>落地 / 深度参与项目</span></div>
          <div><strong>3.76</strong><span>本科 GPA</span></div>
          <div><strong>13+</strong><span>竞赛与作品荣誉</span></div>
          <div><strong>2 YRS</strong><span>视觉团队协作经验</span></div>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell work-head">
          <div className="section-kicker"><span>02</span> SELECTED WORKS</div>
        </div>
        <div className="project-list shell">
          {projects.map(project => (
            <article className="project-card" key={project.id} onClick={() => setActiveProject(project)}>
              <div className="project-media">
                <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
                <div className="project-overlay" />
                <div className="project-number">SPATIAL STUDY / {project.id}</div>
                <button type="button" aria-label={`查看${project.title}`}>VIEW <Arrow diagonal /></button>
              </div>
              <div className="project-info">
                <div className="project-meta"><span>{project.type}</span><span>{project.year}</span></div>
                <h3>{project.title}</h3>
                <p>{project.en}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="abilities section shell" id="ability">
        <div className="section-kicker"><span>03</span> CAPABILITIES</div>
        <div className="ability-title"><h2>理性落地，<br />感性表达。</h2><p>能力不是软件清单，而是把复杂问题变成清晰方案的过程。</p></div>
        <div className="ability-grid">
          {strengths.map(([num, title, text, image]) => (
            <article key={num}><img className="ability-image" src={image} alt="" loading="lazy" decoding="async" /><span>{num}</span><div className="ability-mark">＋</div><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
        <div className="tools-line"><span>TOOLS</span><p>AutoCAD · SketchUp · Enscape · Photoshop · Midjourney · AI Workflow</p></div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-bg" />
        <div className="shell footer-inner">
          <div className="section-kicker"><span>04</span> CONTACT</div>
          <div className="footer-contact-row">
            <p>以空间策略为基础，结合视觉叙事与 AI 工作流，持续探索商业空间更清晰、更具感知力的表达方式。</p>
            <a className="footer-mail" href="mailto:13421276541@163.com">发一封邮件 <Arrow diagonal /></a>
          </div>
          <h2 className="footer-name notranslate" translate="no">GUAN ZHIJUN<sup>®</sup></h2>
          <div className="footer-bottom"><span>© 2026 GUAN ZHIJUN</span><span>PHONE · 134 2127 6541</span><span>WECHAT · A135790JK</span><a href="#top">BACK TO TOP ↑</a></div>
        </div>
      </footer>

      {activeProject && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={activeProject.title} onClick={() => setActiveProject(null)}>
          <button className="modal-close" onClick={() => setActiveProject(null)}>关闭 ×</button>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-gallery">
              <figure><img src={activeProject.detailImage} alt={`${activeProject.title} 项目详情`} /><figcaption>01 / DESIGN DETAIL</figcaption></figure>
              <figure><img src={activeProject.image} alt={`${activeProject.title} 项目封面`} /><figcaption>02 / PROJECT COVER</figcaption></figure>
            </div>
            <div className="modal-copy"><span>{activeProject.type} · {activeProject.year}</span><h2>{activeProject.title}</h2><p>{activeProject.description}</p><div className="modal-meta">{activeProject.meta.map(item => <small key={item}>{item}</small>)}</div><p className="modal-hint">向下滚动画廊查看更多项目图像</p></div>
          </div>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
