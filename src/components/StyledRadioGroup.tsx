import { Field, Label, Radio, RadioGroup, RadioGroupProps } from '@headlessui/react'

export interface StyledRadioOption<T> {
  value: T
  label: string
}

export function StyledRadioGroup<T>({ value, onChange, radios, ...rest }: RadioGroupProps<'div', T> & { radios: StyledRadioOption<T>[] }) {
  return <RadioGroup value={value} onChange={onChange} {...rest}>
    {radios.map(radio => <Field key={radio.label}>
      <Radio value={radio.value} />
      <Label>{radio.label}</Label>
    </Field>)}
  </RadioGroup>
}