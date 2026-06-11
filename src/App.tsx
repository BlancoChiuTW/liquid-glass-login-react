import { useMemo, useRef } from 'react'
import { motion } from 'motion/react'
import LiquidGlass from 'liquid-glass-react'

type Star = { left: string; top: string; size: number; o: string; d: string }

function Sky() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 90 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() < 0.15 ? 3 : Math.random() < 0.5 ? 2 : 1,
        o: (0.25 + Math.random() * 0.6).toFixed(2),
        d: `${(2 + Math.random() * 4).toFixed(1)}s`,
      })),
    [],
  )

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
      <div
        className="absolute rounded-full opacity-55 blur-[90px]"
        style={{
          width: '46vmax', height: '46vmax', left: '-12vmax', top: '-14vmax',
          background: 'radial-gradient(circle at 35% 35%, #7c5cff 0%, #3b2d8f 45%, transparent 72%)',
          animation: 'drift-a 26s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full opacity-55 blur-[90px]"
        style={{
          width: '40vmax', height: '40vmax', right: '-14vmax', top: '16vmax',
          background: 'radial-gradient(circle at 60% 40%, #0ea5a4 0%, #134e4a 50%, transparent 74%)',
          animation: 'drift-b 31s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full opacity-40 blur-[90px]"
        style={{
          width: '34vmax', height: '34vmax', left: '28vmax', bottom: '-18vmax',
          background: 'radial-gradient(circle at 50% 50%, #b45309 0%, #7c2d12 52%, transparent 75%)',
          animation: 'drift-c 23s ease-in-out infinite alternate',
        }}
      />
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

export default function App() {
  const stageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={stageRef} className="relative grid min-h-dvh place-items-center px-4 py-8">
      <Sky />

      {/* 星環墊在玻璃卡後面，給液態折射扭曲用 */}
      <div className="zodiac-ring absolute aspect-square w-[min(560px,130vw)] rounded-full" aria-hidden />

      {/* LiquidGlass 的三層 div 都以 top/left 50% + translate(-50%,-50%) 自我置中，
          須給 position:absolute 讓它們脫離文流，否則特效層會把內容往下推 */}
      <LiquidGlass
        mouseContainer={stageRef}
        displacementScale={56}
        blurAmount={0.09}
        saturation={170}
        aberrationIntensity={2}
        elasticity={0.12}
        cornerRadius={26}
        padding="0"
        style={{ position: 'absolute', top: '50%', left: '50%' }}
      >
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
      </LiquidGlass>

      <p className="absolute bottom-3.5 m-0 w-full text-center text-[11.5px] tracking-[.15em] text-white/30">
        React 19 + liquid-glass-react + motion + Tailwind v4
      </p>
    </div>
  )
}
