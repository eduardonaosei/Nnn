import { useState } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import styles from './App.module.css'

export default function App() {
  const [resumeData, setResumeData] = useState(null)

  function handleGenerate(data) {
    setResumeData(data)
    setTimeout(() => {
      document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function handleReset() {
    setResumeData(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerBadge}>Gratuito</div>
          <h1 className={styles.title}>Criador de Currículo</h1>
          <p className={styles.subtitle}>Preencha o formulário e gere seu currículo profissional em segundos</p>
        </header>

        <ResumeForm onGenerate={handleGenerate} />

        {resumeData && (
          <div id="preview-section">
            <ResumePreview data={resumeData} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}
