'use client'

import { useSalaryStore } from '@/stores/salaryStore'
import { useShallow } from 'zustand/react/shallow'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SalaryCalculationResults() {
  const salaryCalculationResults = useSalaryStore(
    useShallow((state) => state.getSalaryResult())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation Results</CardTitle>
        <CardDescription>
          Based on your input and selected options
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 border rounded-lg'>
            <div className='text-sm text-muted-foreground'>Net Salary</div>
            <div className='text-2xl font-bold'>
              €{salaryCalculationResults.netSalary}
            </div>
            <div className='text-xs text-muted-foreground'>Take-home pay</div>
          </div>
          <div className='p-4 border rounded-lg'>
            <div className='text-sm text-muted-foreground'>Gross Salary</div>
            <div className='text-2xl font-bold'>
              €{salaryCalculationResults.grossSalary}
            </div>
            <div className='text-xs text-muted-foreground'>
              Before deductions
            </div>
          </div>
          <div className='p-4 border rounded-lg'>
            <div className='text-sm text-muted-foreground'>
              {"Employer's expense"}
            </div>
            <div className='text-2xl font-bold'>
              €{salaryCalculationResults.employerExpenses}
            </div>
            <div className='text-xs text-muted-foreground'>
              Total cost to employer
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
