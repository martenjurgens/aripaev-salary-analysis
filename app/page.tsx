import SalaryCalculationResults from '@/components/salary-calculation-results'
import SalaryCalculator from '@/components/salary-calculator'
import SalarySummary from '@/components/salary-summary'

export default function Home() {
  return (
    <div className='container mx-auto px-4 py-10 max-w-4xl'>
      <div className='space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Estonian Salary Calculator
          </h1>
          <p className='text-muted-foreground'>
            Calculate net, gross, and employer expenses with pension and
            unemployment insurance options
          </p>
        </div>
        <SalaryCalculator />
        <SalaryCalculationResults />
        <SalarySummary />
      </div>
    </div>
  )
}
