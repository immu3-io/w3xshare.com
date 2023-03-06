import React, { useState } from 'react'

interface ITextareaFieldProps {
  name?: string
  label?: string
  value?: string

  [key: string]: any
}

const TextareaField: React.FC<ITextareaFieldProps> = ({ name, label, value = '', ...props }) => {
  const [state, setState] = useState<string>(value)

  return (
    <>
      <label htmlFor='input'>{label}</label>
      <textarea {...props} id={name} name={name} defaultValue={state} onChange={event => setState(event.target.value)} />
    </>
  )
}

export default TextareaField
