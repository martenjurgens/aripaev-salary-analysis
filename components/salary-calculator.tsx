'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSalaryStore } from '@/stores/salaryStore'
import { CalculationType } from '@/types'

export default function SalaryCalculator() {
  const salaryInput = useSalaryStore((state) => state.salaryInput)
  const setSalaryInput = useSalaryStore((state) => state.setSalaryInput)
  const calculationType = useSalaryStore((state) => state.calculationType)
  const setCalculationType = useSalaryStore((state) => state.setCalculationType)
  const pensionPillar = useSalaryStore((state) => state.pensionPillar)
  const setPensionPillar = useSalaryStore((state) => state.setPensionPillar)
  const isEmployeeInsurance = useSalaryStore(
    (state) => state.isEmployeeInsurance
  )
  const setIsEmployeeInsurance = useSalaryStore(
    (state) => state.setIsEmployeeInsurance
  )
  const isEmployerInsurance = useSalaryStore(
    (state) => state.isEmployerInsurance
  )
  const setIsEmployerInsurance = useSalaryStore(
    (state) => state.setIsEmployerInsurance
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Tabs
          value={calculationType}
          onValueChange={(value) =>
            setCalculationType(value as CalculationType)
          }>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value={CalculationType.GROSS}>
              Gross Salary
            </TabsTrigger>
            <TabsTrigger value={CalculationType.NET}>Net Salary</TabsTrigger>
            <TabsTrigger value={CalculationType.EMPLOYER_EXPENSE}>
              {"Employer's Expense"}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='space-y-2'>
          <Label htmlFor='gross-salary'>Gross Salary (€)</Label>
          <Input
            id='input-salary'
            type='number'
            placeholder='Enter gross salary'
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
          />
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Pension Pillar Contribution</Label>
            <Select
              value={pensionPillar ?? '0'}
              defaultValue='0'
              onValueChange={(value) => setPensionPillar(value)}>
              <SelectTrigger>
                <SelectValue placeholder='Select pension contribution' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>No pension contribution (0%)</SelectItem>
                <SelectItem value='0.02'>2% contribution</SelectItem>
                <SelectItem value='0.04'>4% contribution</SelectItem>
                <SelectItem value='0.06'>6% contribution</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Unemployment Insurance</Label>
            <div className='flex flex-col space-y-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='employer-insurance'
                  checked={isEmployerInsurance}
                  onCheckedChange={(checked) =>
                    setIsEmployerInsurance(checked === true)
                  }
                />
                <Label htmlFor='employer-insurance' className='font-normal'>
                  Employer contribution (0.8%)
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='employee-insurance'
                  checked={isEmployeeInsurance}
                  onCheckedChange={(checked) =>
                    setIsEmployeeInsurance(checked === true)
                  }
                />
                <Label htmlFor='employee-insurance' className='font-normal'>
                  Employee contribution (1.6%)
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
