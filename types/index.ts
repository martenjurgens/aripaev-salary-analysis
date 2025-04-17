export enum CalculationType {
  GROSS = 'gross',
  NET = 'net',
  EMPLOYER_EXPENSE = 'employerExpense',
}

export type SalaryResult = {
  netSalary: number
  grossSalary: number
  employerExpenses: number
}
