'use client'

import { Slot } from '@radix-ui/react-slot'
import { Controller, FormProvider, useFormContext, useFormState, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form'

import { Label } from '@/components/ui/label'

export const Form = FormProvider
export const FormField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: ControllerProps<TFieldValues, TName>) => <Controller {...props} />
export const useFormField = () => {
  const { getFieldState } = useFormContext()
  const formState = useFormState()
  return { ...getFieldState('', formState), id: 'form-item', name: '' }
}
export const FormItem = (props: React.ComponentProps<'div'>) => <div {...props} />
export const FormLabel = (props: React.ComponentProps<typeof Label>) => <Label {...props} />
export const FormControl = (props: React.ComponentProps<typeof Slot>) => <Slot {...props} />
export const FormDescription = (props: React.ComponentProps<'p'>) => <p {...props} />
export const FormMessage = (props: React.ComponentProps<'p'>) => <p {...props} />
