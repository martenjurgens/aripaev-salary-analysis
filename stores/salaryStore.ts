import { calculateSalary } from '@/lib/salaryUtils'
import { CalculationType, SalaryResult } from '@/types'
import { create } from 'zustand'

type SalaryState = {
  calculationType: CalculationType
  salaryInput: string
  salaryResult: SalaryResult
  pensionPillar: string
  isEmployeeInsurance: boolean
  isEmployerInsurance: boolean
}

interface SalaryActions {
  setSalaryInput: (amount: string) => void
  setCalculationType: (type: CalculationType) => void
  setPensionPillar: (amount: string) => void
  setIsEmployeeInsurance: (bool: boolean) => void
  setIsEmployerInsurance: (bool: boolean) => void
  getSalaryResult: () => SalaryResult
}

export const useSalaryStore = create<SalaryState & SalaryActions>()(
  (set, get) => ({
    salaryInput: '0',
    calculationType: CalculationType.GROSS,
    pensionPillar: '0',
    salaryResult: {
      netSalary: 0,
      grossSalary: 0,
      employerExpenses: 0,
    },
    isEmployeeInsurance: true,
    isEmployerInsurance: true,

    setSalaryInput: (amount) => set({ salaryInput: amount }),
    setCalculationType: (type) => set({ calculationType: type }),
    setPensionPillar: (amount) => set({ pensionPillar: amount }),
    setIsEmployeeInsurance: (bool) => set({ isEmployeeInsurance: bool }),
    setIsEmployerInsurance: (bool) => set({ isEmployerInsurance: bool }),

    getSalaryResult: () => {
      const {
        salaryInput,
        calculationType,
        pensionPillar,
        isEmployeeInsurance,
        isEmployerInsurance,
      } = get()

      return calculateSalary({
        input: salaryInput,
        type: calculationType,
        pensionPillar,
        isEmployeeInsurance,
        isEmployerInsurance,
      })
    },
  })
)
