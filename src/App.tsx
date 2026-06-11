import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import LiquidGlass from 'liquid-glass-react'

type Star = { left: string; top: string; size: number; o: string; d: string }

/** 星辰圖：古星盤風格的 canvas 星圖（同心圓 + 二十八宿式分區 + 星座連線），
 *  只畫一次，旋轉交給 CSS transform（純合成層，不重繪） */
function StarChart() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const size = Math.max(window.innerWidth, window.innerHeight) * 1.5
      cv.width = size * dpr
      cv.height = size * dpr
      cv.style.width = `${size}px`
      cv.style.height = `${size}px`
      const ctx = cv.getContext('2d')
      if (!ctx) return
      ctx.scale(dpr, dpr)
      const c = size / 2

      // 同心圓（最外圈實線、中間虛線）
      const rings = [0.26, 0.4, 0.54, 0.68]
      rings.forEach((f, i) => {
        ctx.beginPath()
        ctx.arc(c, c, c * f, 0, Math.PI * 2)
        ctx.strokeStyle = i === rings.length - 1 ? 'rgba(190,200,240,0.12)' : 'rgba(190,200,240,0.06)'
        ctx.setLineDash(i % 2 === 1 ? [4, 9] : [])
        ctx.lineWidth = 1
        ctx.stroke()
      })
      ctx.setLineDash([])

      // 放射分區線（仿星盤的宿度分割）
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(c + Math.cos(a) * c * 0.26, c + Math.sin(a) * c * 0.26)
        ctx.lineTo(c + Math.cos(a) * c * 0.68, c + Math.sin(a) * c * 0.68)
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(190,200,240,0.045)' : 'rgba(190,200,240,0.025)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // 散星：均勻灑在盤面內
      for (let i = 0; i < 240; i++) {
        const a = Math.random() * Math.PI * 2
        const r = Math.sqrt(Math.random()) * c * 0.7
        const x = c + Math.cos(a) * r
        const y = c + Math.sin(a) * r
        const s = Math.random() < 0.12 ? 1.6 : Math.random() < 0.5 ? 1 : 0.7
        ctx.beginPath()
        ctx.arc(x, y, s, 0, Math.PI * 2)
        const warm = Math.random() < 0.25
        ctx.fillStyle = warm
          ? `rgba(232,200,122,${0.35 + Math.random() * 0.4})`
          : `rgba(220,228,255,${0.3 + Math.random() * 0.45})`
        ctx.fill()
      }

      // 星座：群聚的亮星 + 連線
      for (let g = 0; g < 10; g++) {
        const ga = Math.random() * Math.PI * 2
        const gr = (0.18 + Math.random() * 0.45) * c
        const gx = c + Math.cos(ga) * gr
        const gy = c + Math.sin(ga) * gr
        const n = 4 + Math.floor(Math.random() * 4)
        const pts = Array.from({ length: n }, () => ({
          x: gx + (Math.random() - 0.5) * c * 0.2,
          y: gy + (Math.random() - 0.5) * c * 0.2,
        }))

        ctx.beginPath()
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.strokeStyle = 'rgba(167,180,255,0.16)'
        ctx.lineWidth = 1
        ctx.stroke()

        pts.forEach((p) => {
          const s = 1.4 + Math.random() * 1.2
          ctx.beginPath()
          ctx.arc(p.x, p.y, s, 0, Math.PI * 2)
          ctx.shadowColor = 'rgba(190,205,255,0.8)'
          ctx.shadowBlur = 6
          ctx.fillStyle = 'rgba(235,240,255,0.9)'
          ctx.fill()
          ctx.shadowBlur = 0
        })
      }
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])

  return <canvas ref={ref} className="star-chart" aria-hidden />
}

function Sky() {
  const stars = useMemo<Star[]>(() => {
    const out: Star[] = []
    while (out.length < 36) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      // 避開畫面中央（玻璃卡正後方）：閃爍動畫若落在卡片背後，
      // 會逼 backdrop-filter 每幀重算
      if (x > 24 && x < 76 && y > 14 && y < 86) continue
      out.push({
        left: `${x}%`,
        top: `${y}%`,
        size: Math.random() < 0.2 ? 3 : 2,
        o: (0.3 + Math.random() * 0.55).toFixed(2),
        d: `${(2 + Math.random() * 4).toFixed(1)}s`,
      })
    }
    return out
  }, [])

  return (
    <div
      aria-hidden
      className="fixed inset-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(1200px 800px at 70% -10%, #1a1f3d 0%, transparent 60%),' +
          'radial-gradient(900px 700px at 10% 110%, #14182e 0%, transparent 60%), #0b0e1d',
      }}
    >
      {/* 星雲：radial-gradient 自帶柔邊，不再用 blur() 濾鏡（效能殺手） */}
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="nebula nebula-c" />
      <StarChart />
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              '--o': s.o,
              '--d': s.d,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

function Field({ label, type, placeholder, autoComplete }: {
  label: string
  type: string
  placeholder: string
  autoComplete: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs tracking-wider text-(--color-mist)">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[15px]
                   text-[#eef0fa] placeholder:text-white/30 outline-none backdrop-blur-sm
                   shadow-[inset_0_1px_0_rgba(255,255,255,.08)]
                   transition-all duration-200
                   focus:border-(--color-gold)/60 focus:bg-white/10
                   focus:shadow-[0_0_0_4px_rgba(232,200,122,.12),0_0_24px_-6px_rgba(232,200,122,.4)]"
      />
    </label>
  )
}

function CardContent() {
  return (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[min(400px,92vw)] px-7 pt-9 pb-7 max-[420px]:px-5">
            <header className="mb-7 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.6, ease: 'backOut' }}
                className="relative mx-auto mb-3.5 grid h-[72px] w-[72px] place-items-center"
              >
                <span className="sigil-ring absolute inset-0 rounded-full" />
                <span
                  className="font-(family-name:--font-serif-tc) text-3xl font-bold text-transparent
                             bg-clip-text bg-linear-to-b from-white to-(--color-gold)
                             [text-shadow:0_0_24px_rgba(232,200,122,.35)]"
                >
                  玄
                </span>
              </motion.div>
              <h1 className="m-0 font-(family-name:--font-serif-tc) text-[26px] font-semibold tracking-[.35em] -mr-[.35em]">
                天機閣
              </h1>
              <p className="m-0 mt-1.5 text-xs tracking-[.3em] -mr-[.3em] text-(--color-mist)">
                觀星 · 問卦 · 知命
              </p>
            </header>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <Field label="手機或信箱" type="text" placeholder="輸入你的手機或信箱" autoComplete="username" />
              <Field label="密碼" type="password" placeholder="輸入密碼" autoComplete="current-password" />

              <div className="flex items-center justify-between text-[13px] text-(--color-mist)">
                <label className="inline-flex cursor-pointer select-none items-center gap-2">
                  <input type="checkbox" defaultChecked className="peer hidden" />
                  <span
                    className="grid h-4 w-4 place-items-center rounded-[5px] border border-white/30 bg-white/5
                               transition-colors peer-checked:border-(--color-gold) peer-checked:bg-(--color-gold)
                               after:h-[4.5px] after:w-2 after:-translate-y-px after:-rotate-45
                               after:border-b-[1.8px] after:border-l-[1.8px] after:border-[#0b0e1d]
                               after:opacity-0 after:content-[''] peer-checked:after:opacity-100"
                  />
                  記住我
                </label>
                <a href="#" className="text-(--color-gold)/85 no-underline hover:text-(--color-gold) hover:underline">
                  忘記密碼
                </a>
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0, scale: 0.99 }}
                type="submit"
                className="sheen relative mt-1 overflow-hidden rounded-xl border-none px-4 py-3.5
                           font-(family-name:--font-serif-tc) text-base font-semibold tracking-[.4em] indent-[.4em]
                           text-[#1a1503] cursor-pointer
                           bg-linear-120 from-[#f3dca0] via-(--color-gold) via-40% to-[#caa45a]
                           shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_10px_30px_-10px_rgba(232,200,122,.55)]
                           hover:shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_14px_36px_-10px_rgba(232,200,122,.7)]"
              >
                開啟天機
              </motion.button>

              <div className="flex items-center gap-3 text-xs tracking-[.2em] text-white/35
                              before:h-px before:flex-1 before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent before:content-['']
                              after:h-px after:flex-1 after:bg-linear-to-r after:from-transparent after:via-white/20 after:to-transparent after:content-['']">
                或以星辰之名
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['紫微登入', '八字登入'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm
                               text-[#eef0fa] backdrop-blur-sm transition-all duration-200
                               hover:border-teal-300/40 hover:bg-white/10
                               hover:shadow-[0_0_20px_-6px_rgba(94,234,212,.35)]"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <p className="m-0 mt-1 text-center text-[13px] text-(--color-mist)">
                還沒有命盤？{' '}
                <a href="#" className="text-(--color-gold)/85 no-underline hover:underline">
                  立即排盤
                </a>
              </p>
            </form>
        </motion.div>
  )
}

export default function App() {
  // 預設用便宜的 blur 玻璃（與連續動畫背景共存順暢）；
  // displacement 液態折射很貴（背後每幀變動都要整個重算），做成選配開關
  const [liquid, setLiquid] = useState(false)

  return (
    <div className="relative grid min-h-dvh place-items-center px-4 py-8">
      <Sky />

      {/* 星環墊在玻璃卡後面，開折射時會被液態扭曲 */}
      <div className="zodiac-ring absolute aspect-square w-[min(560px,130vw)] rounded-full" aria-hidden />

      {liquid ? (
        /* LiquidGlass 的三層 div 都以 top/left 50% + translate(-50%,-50%) 自我置中，
           須給 position:absolute 讓它們脫離文流，否則特效層會把內容往下推 */
        <LiquidGlass
          displacementScale={48}
          blurAmount={0.09}
          saturation={170}
          aberrationIntensity={1.5}
          elasticity={0}
          cornerRadius={26}
          padding="0"
          style={{ position: 'absolute', top: '50%', left: '50%' }}
        >
          <CardContent />
        </LiquidGlass>
      ) : (
        <div className="glass-card">
          <CardContent />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setLiquid((v) => !v)}
          className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs
                     tracking-wider text-white/65 backdrop-blur-md transition-colors
                     hover:bg-white/10 hover:text-white/90"
        >
          液態折射：{liquid ? '開（較耗效能）' : '關'}
        </button>
        <p className="m-0 text-center text-[11px] tracking-[.15em] text-white/30">
          React 19 + liquid-glass-react + motion + Tailwind v4
        </p>
      </div>
    </div>
  )
}
