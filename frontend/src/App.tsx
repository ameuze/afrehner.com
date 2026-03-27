import config from './generated/config'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Projects } from './components/sections/Projects'
import { Resume } from './components/sections/Resume'
import { TestRunnerPanel } from './components/test-runner/TestRunnerPanel'
import { Contact } from './components/sections/Contact'

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Navbar name={config.personal.name} />
        <main>
          <Hero config={config} />
          <About config={config} />
          <Skills config={config} />
          <Projects config={config} />
          <Resume config={config} />
          {config.test_runner.enabled && <TestRunnerPanel config={config} />}
          <Contact config={config} />
        </main>
        <Footer config={config} />
      </div>
    </ThemeProvider>
  )
}
