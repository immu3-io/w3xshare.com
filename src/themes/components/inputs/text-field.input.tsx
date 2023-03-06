import React, { useState } from 'react'

interface ITextFieldProps {
  name?: string
  label?: string
  value?: string
  [key: string]: any
}

const TextField: React.FC<ITextFieldProps> = ({ name, label, value = '', ...props }) => {
  const [state, setState] = useState<string>(value)

  return (
    <>
      <label htmlFor='input'>{label}</label>
      <input {...props} id={name} name={name} type='text' value={state} onChange={event => setState(event.target.value)} />
    </>
  )
}

export default TextField
