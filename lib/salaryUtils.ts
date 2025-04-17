import { CalculationType, SalaryResult } from '@/types'
import Decimal from 'decimal.js'

interface CalculateSalaryInteface {
  input: string
  type: CalculationType
  pensionPillar: string
  isEmployeeInsurance: boolean
  isEmployerInsurance: boolean
}

const parseStringToNumber = (str: string) => {
  const numericStr = Number(str)
  return Number(isNaN(numericStr) ? 0 : numericStr)
}

const INCOME_TAX_RATE = new Decimal(0.22) // Tulumaks 22%
const SOCIAL_TAX_RATE = new Decimal(0.33) // Sotsiaalmaks 33%
const UNEMPLOYMENT_RATE_EMPLOYEE = new Decimal(0.016) // Töötaja töötuskindlustusmakse
const UNEMPLOYMENT_RATE_EMPLOYER = new Decimal(0.008) // Tööandja Töötuskindlustusmakse
const EMPLOYER_EXPENSE_FACTOR = new Decimal(1)
  .plus(SOCIAL_TAX_RATE)
  .plus(UNEMPLOYMENT_RATE_EMPLOYER)
const ZERO = new Decimal(0)

const calculateTaxFreeIncome = (monthlyGrossSalary: Decimal) => {
  const annualLimit1 = new Decimal(14400)
  const annualLimit2 = new Decimal(25200)
  const maxAnnualTaxFree = new Decimal(7848)
  const reductionDivisor = new Decimal(10800)
  let annualTaxFreeIncome = new Decimal(0)

  const annualGrossSalary = monthlyGrossSalary.times(12)

  if (annualGrossSalary.comparedTo(annualLimit1) <= 0) {
    annualTaxFreeIncome = maxAnnualTaxFree
  } else if (annualGrossSalary.comparedTo(annualLimit2) <= 0) {
    const incomeOverLimit1 = annualGrossSalary.minus(annualLimit1)
    const reductionMultiplier = maxAnnualTaxFree.div(reductionDivisor)
    const reductionAmount = reductionMultiplier.times(incomeOverLimit1)
    annualTaxFreeIncome = maxAnnualTaxFree.minus(reductionAmount)

    if (annualTaxFreeIncome.comparedTo(0) < 0) {
      annualTaxFreeIncome = ZERO
    }
  } else {
    annualTaxFreeIncome = ZERO
  }

  const monthlyTaxFreeIncome = annualTaxFreeIncome.div(12)

  return monthlyTaxFreeIncome
}

// AI generated
const findGrossFromNet = (
  targetNet: Decimal,
  pensionPillarInput: Decimal,
  isEmployeeInsurance: boolean
): Decimal => {
  let low = targetNet
  let high = targetNet.times(2)
  let mid = ZERO
  let iterations = 0
  const maxIterations = 50
  const epsilon = Decimal(0.01)

  while (low.lte(high) && iterations < maxIterations) {
    mid = low.plus(high).div(2)

    const unemploymentTaxEmployee = isEmployeeInsurance
      ? mid.times(UNEMPLOYMENT_RATE_EMPLOYEE)
      : ZERO
    const pensionEmployee = mid.times(pensionPillarInput)
    const taxFreeIncome = calculateTaxFreeIncome(mid)
    const incomeTaxBase = mid
      .minus(unemploymentTaxEmployee)
      .minus(pensionEmployee)
      .minus(taxFreeIncome)
    const taxableIncome = Decimal.max(ZERO, incomeTaxBase)
    const incomeTax = taxableIncome.times(INCOME_TAX_RATE)
    const net = mid
      .minus(unemploymentTaxEmployee)
      .minus(pensionEmployee)
      .minus(incomeTax)

    const diff = net.minus(targetNet)
    if (diff.abs().lte(epsilon)) {
      return mid
    }
    if (diff.gt(0)) {
      high = mid.minus(epsilon)
    } else {
      low = mid.plus(epsilon)
    }
    iterations++
  }
  return mid
}

export const calculateSalary = ({
  input,
  type,
  pensionPillar,
  isEmployeeInsurance,
  isEmployerInsurance,
}: CalculateSalaryInteface): SalaryResult => {
  const salaryInput = new Decimal(parseStringToNumber(input))
  const pensionPillarInput = new Decimal(parseStringToNumber(pensionPillar))

  let grossSalary = ZERO

  if (type === CalculationType.GROSS) {
    grossSalary = salaryInput
  } else if (type === CalculationType.EMPLOYER_EXPENSE) {
    grossSalary = salaryInput.div(EMPLOYER_EXPENSE_FACTOR)
  } else if (type === CalculationType.NET) {
    grossSalary = findGrossFromNet(
      salaryInput,
      pensionPillarInput,
      isEmployeeInsurance
    )
  } else {
    grossSalary = ZERO
  }

  const unemploymentTaxEmployee = isEmployeeInsurance
    ? grossSalary.times(UNEMPLOYMENT_RATE_EMPLOYEE)
    : ZERO
  const pensionEmployee = grossSalary.times(pensionPillarInput)
  const taxFreeIncome = calculateTaxFreeIncome(grossSalary)

  const incomeTaxBase = grossSalary
    .minus(unemploymentTaxEmployee)
    .minus(pensionEmployee)
    .minus(taxFreeIncome)

  const taxableIncome = Decimal.max(ZERO, incomeTaxBase)
  const incomeTax = taxableIncome.times(INCOME_TAX_RATE)

  const netSalary = grossSalary
    .minus(unemploymentTaxEmployee)
    .minus(pensionEmployee)
    .minus(incomeTax)

  const socialTax = grossSalary.times(SOCIAL_TAX_RATE)
  const unemploymentTaxEmployer = isEmployerInsurance
    ? grossSalary.times(UNEMPLOYMENT_RATE_EMPLOYER)
    : ZERO

  const employerExpenses = grossSalary
    .plus(socialTax)
    .plus(unemploymentTaxEmployer)

  return {
    netSalary: netSalary.toDecimalPlaces(2).toNumber(),
    grossSalary: grossSalary.toDecimalPlaces(2).toNumber(),
    employerExpenses: employerExpenses.toDecimalPlaces(2).toNumber(),
  }
}
