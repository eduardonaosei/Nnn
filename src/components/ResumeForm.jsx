import { useState, useRef } from 'react'
import styles from './ResumeForm.module.css'

const FIELDS = [
  { id: 'objetivo',     label: 'Objetivo Profissional', placeholder: 'Descreva seu objetivo profissional...', type: 'textarea' },
  { id: 'escolaridade', label: 'Escolaridade',           placeholder: 'Ex: Ensino Médio completo — Escola XYZ (2022)', type: 'textarea' },
  { id: 'cursos',       label: 'Cursos e Certificações', placeholder: 'Ex: Curso de Excel — Udemy (2023)', type: 'textarea' },
  { id: 'experiencia',  label: 'Experiência Profissional', placeholder: 'Ex: Atendente — Loja ABC (jan/2022 – dez/2023)', type: 'textarea' },
  { id: 'habilidades',  label: 'Habilidades',            placeholder: 'Ex: Pacote Office, Atendimento ao cliente, Trabalho em equipe', type: 'textarea' },
]

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function ResumeForm({ onGenerate }) {
  const [values, setValues] = useState({
    nome: '', email: '', telefone: '', endereco: '',
    objetivo: '', escolaridade: '', cursos: '', experiencia: '', habilidades: '',
  })
  const [errors, setErrors] = useState({})
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const fileRef = useRef()

  function set(id, value) {
    setValues(v => ({ ...v, [id]: value }))
    if (errors[id]) setErrors(e => ({ ...e, [id]: false }))
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = ev => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function removePhoto() {
    setPhotoPreview(null)
    setPhotoFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function validate() {
    const errs = {}
    if (!values.nome.trim()) errs.nome = 'Nome é obrigatório.'
    if (!values.email.trim() || !isValidEmail(values.email)) errs.email = 'Informe um email válido.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onGenerate({ ...values, photo: photoPreview })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Photo upload */}
      <div className={styles.photoSection}>
        <div className={styles.photoWrap}>
          {photoPreview
            ? <img src={photoPreview} alt="Foto de perfil" className={styles.photoImg} />
            : <div className={styles.photoPlaceholder}>
                <span className={styles.photoIcon}>+</span>
                <span>Foto</span>
              </div>
          }
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.photoInput}
            onChange={handlePhoto}
            aria-label="Adicionar foto"
          />
        </div>
        {photoPreview && (
          <button type="button" className={styles.removePhoto} onClick={removePhoto}>
            Remover foto
          </button>
        )}
      </div>

      {/* Basic info */}
      <div className={styles.grid2}>
        <Field id="nome" label="Nome Completo" required
          value={values.nome} onChange={v => set('nome', v)}
          error={errors.nome} placeholder="Seu nome completo" />
        <Field id="email" label="Email" required type="email"
          value={values.email} onChange={v => set('email', v)}
          error={errors.email} placeholder="seu@email.com" />
      </div>

      <div className={styles.grid2}>
        <Field id="telefone" label="Telefone"
          value={values.telefone} onChange={v => set('telefone', v)}
          placeholder="(00) 00000-0000" />
        <Field id="endereco" label="Cidade / Estado"
          value={values.endereco} onChange={v => set('endereco', v)}
          placeholder="São Paulo, SP" />
      </div>

      {/* Textarea fields */}
      {FIELDS.map(f => (
        <Field key={f.id} id={f.id} label={f.label} type="textarea"
          value={values[f.id]} onChange={v => set(f.id, v)}
          placeholder={f.placeholder} />
      ))}

      <button type="submit" className={styles.submit}>
        Gerar Currículo
      </button>
    </form>
  )
}

function Field({ id, label, required, type = 'text', value, onChange, error, placeholder }) {
  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}{required && <span className={styles.req}>*</span>}
      </label>
      {type === 'textarea'
        ? <textarea
            id={id} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} className={styles.textarea} rows={3}
          />
        : <input
            id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} className={styles.input}
            autoComplete={id === 'email' ? 'email' : id === 'nome' ? 'name' : 'off'}
          />
      }
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}
