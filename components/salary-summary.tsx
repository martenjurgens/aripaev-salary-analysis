'use client'

import { Button } from '@/components/ui/button'
import { useSalaryStore } from '@/stores/salaryStore'
import { useCompletion } from '@ai-sdk/react'
import { Sparkles } from 'lucide-react'
import Markdown from 'react-markdown'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function SalarySummary() {
  const netSalary = useSalaryStore(
    useShallow((state) => state.getSalaryResult().netSalary)
  )

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/salary-summary',
    onError: (error) => {
      toast.error(
        error.message ?? 'Failed to generate summary. Please try again.'
      )
    },
  })

  const handleGenerateSummary = async () => {
    await complete(netSalary.toString())
  }

  return (
    <div className='space-y-4'>
      <Button
        onClick={handleGenerateSummary}
        variant='outline'
        className='w-full'
        disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Living Cost Summary'}
      </Button>

      {completion && (
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg flex items-center'>
              <Sparkles className='mr-2 h-5 w-5 text-primary/80' /> {/* Icon */}
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='max-w-none'>
              <Markdown>{completion}</Markdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
