import { useEffect, useState } from "react";

import "./DebtRecyclingCalculator.css";

const fmt = (x: number) => `$${Math.abs(x).toFixed(2)}`;

function Row({
  label,
  formula,
  value,
  negative,
  net,
}: {
  label: string;
  formula?: string;
  value: number;
  negative?: boolean;
  net?: boolean;
}) {
  return (
    <tr className={net ? "net" : undefined}>
      <td>{label}</td>
      <td className="formula">{formula}</td>
      <td className="value">
        {negative || value < 0 ? "−" : ""}
        {fmt(value)}
      </td>
    </tr>
  );
}

function N({
  value,
  width = "3.5ch",
  onChange,
}: {
  value: number;
  width?: string;
  onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(() => String(value));
  useEffect(() => {
    if (parseFloat(raw) !== value) setRaw(String(value));
  }, [value]);
  return (
    <input
      className="inline-num"
      type="text"
      inputMode="decimal"
      value={raw}
      style={{ width }}
      onChange={(e) => {
        const str = e.target.value.replace(/^0+(\d)/, "$1");
        setRaw(str);
        const num = parseFloat(str);
        if (!isNaN(num)) onChange(num);
      }}
    />
  );
}

export function DebtRecyclingCalculator() {
  const [principal, setPrincipal] = useState(10_000);
  const [savingsRate, setSavingsRate] = useState(4.5);
  const [mortgageRate, setMortgageRate] = useState(5.6);
  const [investmentReturn, setInvestmentReturn] = useState(6.3);
  const [dividendYield, setDividendYield] = useState(3.7);
  const [taxBracket, setTaxBracket] = useState(37);
  const [invLoanRate, setInvLoanRate] = useState(6.0);

  const pct = (x: number) => x / 100;
  const n = (x: number) =>
    x.toLocaleString("en-AU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  const savingsInterest = principal * pct(savingsRate);
  const savingsTax = savingsInterest * pct(taxBracket);
  const savingsNet = savingsInterest - savingsTax;

  const mortgageSaved = principal * pct(mortgageRate);

  const growth = principal * pct(investmentReturn);
  const growthTax = (growth * pct(taxBracket)) / 2;
  const dividends = principal * pct(dividendYield);
  const dividendTax = dividends * pct(taxBracket);
  const sharesNet = growth - growthTax + dividends - dividendTax;

  const invLoanInterest = principal * pct(invLoanRate);
  const invLoanDeduct = invLoanInterest * pct(taxBracket);
  const option4Net =
    mortgageSaved + sharesNet - invLoanInterest + invLoanDeduct;

  const nets = [savingsNet, mortgageSaved, sharesNet, option4Net];
  const minNet = Math.min(...nets);
  const maxNet = Math.max(...nets);
  const netStyle = (value: number): React.CSSProperties => {
    const t = maxNet === minNet ? 0.5 : (value - minNet) / (maxNet - minNet);
    const hue = Math.round(t * 120);
    return {
      backgroundColor: `hsl(${hue} 55% 93%)`,
      color: `hsl(${hue} 55% 25%)`,
    };
  };

  return (
    <div className="debt-calculator">
      <p className="global-inputs">
        Let’s say I found $
        <N value={principal} width="5.5ch" onChange={setPrincipal} /> in the
        street, and I’m deciding what to do with it. I know my{" "}
        <a href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents#ato-Australianresidenttaxrates2020to2026">
          tax bracket
        </a>{" "}
        is <N value={taxBracket} width="2.5ch" onChange={setTaxBracket} />
        %.
      </p>

      <div className="results">
        <div className="option">
          <h3>Option 1 - Keep it in a savings account</h3>
          <p className="option-sentence">
            My savings account has an interest of
            <N value={savingsRate} onChange={setSavingsRate} />
            %. I can take it out whenever I like, but I'm paying tax on the
            interest.
          </p>
          <table>
            <tbody>
              <Row
                label="Interest"
                formula={`${n(principal)} × ${savingsRate}%`}
                value={savingsInterest}
              />
              <Row
                label="Tax"
                formula={`${n(savingsInterest)} × ${taxBracket}%`}
                value={savingsTax}
                negative
              />
              <Row label="Net" value={savingsNet} net />
            </tbody>
          </table>
        </div>

        <div className="option">
          <h3>Option 2 – Pay down the mortgage</h3>
          <p className="option-sentence">
            My mortgage has an interest of{" "}
            <N value={mortgageRate} onChange={setMortgageRate} />% per year. If
            I pay it down faster, I pay less to the bank. I have an offset
            account to keep the money accessible.
          </p>
          <table>
            <tbody>
              <Row
                label="Interest saved"
                formula={`${n(principal)} × ${mortgageRate}%`}
                value={mortgageSaved}
              />
              <Row label="Net" value={mortgageSaved} net />
            </tbody>
          </table>
        </div>

        <div className="option">
          <h3>Option 3 – invest in shares</h3>
          <p className="option-sentence">
            This is where things get tricky. Firstly, investing is essentially
            gambling, so nobody can predict the actual returns and this method
            carries substantially more risk. But we do know over 10+ years, the
            noise has always averaged out to a steady increase, and governments
            are strongly incentivised to sustain this steady growth. Secondly,
            the returns are made up of two components: growth (the value of the
            shares increasing) and dividends (company profits being paid to
            you). Growth is taxed when it is sold (Capital Gains Tax, CGT), with
            a 50% tax discount if you don't sell it for at least a year.
            Dividends are taxed the same as regular income. I have a few shares
            in Vanguard's VDHG, and based on the historical returns for VDHG
            over the last 10 years, I'm assuming
            <N value={investmentReturn} onChange={setInvestmentReturn} />%
            growth,&nbsp;
            <N value={dividendYield} onChange={setDividendYield} />% dividends
            per year.
          </p>
          <table>
            <tbody>
              <Row
                label="Growth"
                formula={`${n(principal)} × ${investmentReturn}%`}
                value={growth}
              />
              <Row
                label="CGT (50% disc)"
                formula={`${n(growth)} × ${taxBracket}% ÷ 2`}
                value={growthTax}
                negative
              />
              <Row
                label="Dividends"
                formula={`${n(principal)} × ${dividendYield}%`}
                value={dividends}
              />
              <Row
                label="Dividend tax"
                formula={`${n(dividends)} × ${taxBracket}%`}
                value={dividendTax}
                negative
              />
              <Row label="Net" value={sharesNet} net />
            </tbody>
          </table>
        </div>

        <div className="option">
          <h3>Option 4 – debt recycling</h3>
          This is like a combination of options 2 and 3. I pay off the mortgage,
          then redraw the money as an investment loan, using that money to buy
          shares. The key difference here is that the interest on the new loan
          is tax deductible. I found it very difficult to find published rates
          for investment loans, particularly for redraw. I contacted Macquarie
          to get their interest rate,
          <p className="option-sentence">
            <N value={invLoanRate} onChange={setInvLoanRate} />
            %.
          </p>
          <table>
            <tbody>
              <Row
                label="Mortgage net"
                formula="(from option 2)"
                value={mortgageSaved}
              />
              <Row
                label="Shares net"
                formula="(from option 3)"
                value={sharesNet}
              />
              <Row
                label="Loan interest"
                formula={`${n(principal)} × ${invLoanRate}%`}
                value={invLoanInterest}
                negative
              />
              <Row
                label="Tax deduction"
                formula={`${n(invLoanInterest)} × ${taxBracket}%`}
                value={invLoanDeduct}
              />
              <Row label="Net" value={option4Net} net />
            </tbody>
          </table>
        </div>
      </div>

      <div className="summary">
        <table className="summary-inputs">
          <tbody>
            <tr>
              <td>Principal</td>
              <td>
                $<N value={principal} width="5.5ch" onChange={setPrincipal} />
              </td>
            </tr>
            <tr>
              <td>Tax bracket</td>
              <td>
                <N value={taxBracket} width="2.5ch" onChange={setTaxBracket} />%
              </td>
            </tr>
            <tr>
              <td>Savings rate</td>
              <td>
                <N value={savingsRate} onChange={setSavingsRate} />%
              </td>
            </tr>
            <tr>
              <td>Mortgage rate</td>
              <td>
                <N value={mortgageRate} onChange={setMortgageRate} />%
              </td>
            </tr>
            <tr>
              <td>Investment growth</td>
              <td>
                <N value={investmentReturn} onChange={setInvestmentReturn} />%
              </td>
            </tr>
            <tr>
              <td>Dividends</td>
              <td>
                <N value={dividendYield} onChange={setDividendYield} />%
              </td>
            </tr>
            <tr>
              <td>Loan rate</td>
              <td>
                <N value={invLoanRate} onChange={setInvLoanRate} />%
              </td>
            </tr>
          </tbody>
        </table>
        <table className="summary-results">
          <tbody>
            <tr style={netStyle(savingsNet)}>
              <td>Savings account</td>
              <td className="value">
                {savingsNet < 0 ? "−" : ""}
                {fmt(savingsNet)}
              </td>
            </tr>
            <tr style={netStyle(mortgageSaved)}>
              <td>Pay down mortgage</td>
              <td className="value">{fmt(mortgageSaved)}</td>
            </tr>
            <tr style={netStyle(sharesNet)}>
              <td>Invest in shares</td>
              <td className="value">
                {sharesNet < 0 ? "−" : ""}
                {fmt(sharesNet)}
              </td>
            </tr>
            <tr style={netStyle(option4Net)}>
              <td>Debt recycling</td>
              <td className="value">
                {option4Net < 0 ? "−" : ""}
                {fmt(option4Net)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
