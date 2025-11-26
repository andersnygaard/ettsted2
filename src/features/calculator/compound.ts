export interface YearData {
  year: number;
  balance: number;
  principal: number;
  interest: number;
}

/**
 * Calculate compound interest with yearly compounding
 * Returns year-by-year breakdown
 */
export function calculateCompoundInterest(
  startbeløp: number,
  månedligBeløp: number,
  rentePercent: number,
  år: number
): YearData[] {
  // Validate inputs
  if (!Number.isFinite(startbeløp) || startbeløp < 0) {
    throw new Error('startbeløp must be a non-negative finite number');
  }
  if (!Number.isFinite(månedligBeløp) || månedligBeløp < 0) {
    throw new Error('månedligBeløp must be a non-negative finite number');
  }
  if (!Number.isFinite(rentePercent) || rentePercent < 0 || rentePercent > 100) {
    throw new Error('rentePercent must be between 0 and 100');
  }
  if (!Number.isInteger(år) || år < 1 || år > 100) {
    throw new Error('år must be an integer between 1 and 100');
  }

  const monthlyRate = rentePercent / 100 / 12;

  const data: YearData[] = [];
  let balance = startbeløp;
  let totalPrincipal = startbeløp;

  for (let year = 1; year <= år; year++) {
    // Add monthly contributions for the year (12 * monthly amount)
    const yearlyContributions = månedligBeløp * 12;

    // Apply compound interest (yearly compounding on current balance + contributions)
    // More accurate: balance grows monthly, then we compound yearly
    let yearBalance = balance;
    for (let month = 0; month < 12; month++) {
      yearBalance += månedligBeløp;
      yearBalance *= (1 + monthlyRate);
    }

    totalPrincipal += yearlyContributions;
    const interestEarned = yearBalance - totalPrincipal;

    data.push({
      year,
      balance: yearBalance,
      principal: totalPrincipal,
      interest: interestEarned,
    });

    balance = yearBalance;
  }

  return data;
}

/**
 * Get summary values
 */
export interface SummaryValues {
  sluttverdi: number;
  totalSpart: number;
  renteinntekt: number;
}

export function getSummaryValues(
  startbeløp: number,
  månedligBeløp: number,
  rentePercent: number,
  år: number
): SummaryValues {
  const data = calculateCompoundInterest(startbeløp, månedligBeløp, rentePercent, år);

  if (data.length === 0) {
    throw new Error('No data available for summary');
  }

  const lastYear = data[data.length - 1];

  return {
    sluttverdi: lastYear.balance,
    totalSpart: lastYear.principal,
    renteinntekt: lastYear.interest,
  };
}
