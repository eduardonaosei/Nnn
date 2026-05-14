import styles from './ResumePreview.module.css'

const SECTIONS = [
  { key: 'objetivo',     title: 'Objetivo' },
  { key: 'escolaridade', title: 'Escolaridade' },
  { key: 'cursos',       title: 'Cursos e Certificações' },
  { key: 'experiencia',  title: 'Experiência Profissional' },
  { key: 'habilidades',  title: 'Habilidades' },
]

export default function ResumePreview({ data, onReset }) {
  function handlePrint() {
    const contactLines = [data.email, data.telefone, data.endereco].filter(Boolean)

    const sectionsHTML = SECTIONS
      .filter(s => data[s.key]?.trim())
      .map(s => `
        <div class="secao">
          <h3>${s.title}</h3>
          <p>${escapeHtml(data[s.key]).replace(/\n/g, '<br>')}</p>
        </div>`)
      .join('')

    const fotoHTML = data.photo
      ? `<img src="${data.photo}" alt="Foto">`
      : ''

    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Currículo — ${escapeHtml(data.nome)}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',Arial,sans-serif;color:#111;background:#fff;padding:30px 40px}
    .cv-header{display:flex;align-items:center;gap:22px;margin-bottom:24px}
    img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid #111;flex-shrink:0}
    h2{font-family:'DM Serif Display',serif;font-size:1.6rem;margin-bottom:5px;color:#111}
    .cv-header p{font-size:0.88rem;color:#444;line-height:1.7}
    .secao{margin-top:20px}
    .secao h3{font-family:'DM Serif Display',serif;font-size:0.95rem;text-transform:uppercase;
      letter-spacing:0.5px;color:#333;border-bottom:2px solid #f5c542;padding-bottom:4px;margin-bottom:8px}
    .secao p{font-size:0.9rem;color:#333;line-height:1.7}
    @media print{body{padding:15px 20px}}
  </style>
</head>
<body>
  <div class="cv-header">
    ${fotoHTML}
    <div>
      <h2>${escapeHtml(data.nome)}</h2>
      <p>${contactLines.map(escapeHtml).join('<br>')}</p>
    </div>
  </div>
  ${sectionsHTML}
  <script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script>
</body>
</html>`)
    win.document.close()
  }

  const contactLines = [data.email, data.telefone, data.endereco].filter(Boolean)

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>
        <span className={styles.labelDot} />
        Visualizacao do curriculo
      </div>

      <div className={styles.cv} id="cv-print">
        {/* Header */}
        <div className={styles.cvHeader}>
          {data.photo && (
            <img src={data.photo} alt="Foto de perfil" className={styles.photo} />
          )}
          <div className={styles.cvHeaderInfo}>
            <h2 className={styles.cvName}>{data.nome}</h2>
            <p className={styles.cvContact}>
              {contactLines.map((line, i) => (
                <span key={i}>{line}{i < contactLines.length - 1 && <br />}</span>
              ))}
            </p>
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.filter(s => data[s.key]?.trim()).map(s => (
          <div key={s.key} className={styles.section}>
            <h3 className={styles.sectionTitle}>{s.title}</h3>
            <p className={styles.sectionText}>{data[s.key]}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.btnPrint} onClick={handlePrint}>
          Imprimir / Salvar PDF
        </button>
        <button className={styles.btnReset} onClick={onReset}>
          Novo Curriculo
        </button>
      </div>
    </div>
  )
}

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
