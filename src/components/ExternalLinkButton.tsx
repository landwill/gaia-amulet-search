import { Button } from '@mantine/core'
import { ExternalLinkIcon } from 'lucide-react'
import React from 'react'

interface ExternalLinkButtonProps {
  href: string
  mb: number
  children: React.ReactNode | React.ReactNode[]
}

export const ExternalLinkButton = ({ href, mb, children }: ExternalLinkButtonProps) => {
  return <Button component='a'
                 href={href}
                 target='_blank'
                 variant='outline'
                 rightSection={<ExternalLinkIcon size='20' />}
                 mb={mb}
  >{children}</Button>
}