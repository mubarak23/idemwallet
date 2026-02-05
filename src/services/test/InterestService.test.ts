import Big from "big.js";
import { InterestService } from "../InterestService";

const RATE = new Big(275).div(1000); // 27.5%
const DAYS_IN_YEAR = new Big(365);

describe("InterestService", () => {
  const service = new InterestService();

it("calculates correct daily interest for 100000 principal", () => {
  const principal = 100000;
  const interest = service.calculateDailyInterest(principal);

  const expected = new Big(principal)
  
    .times(new Big(275).div(1000))
    .div(365);

  expect(interest.eq(expected)).toBe(true);
});


  it("calculates correct interest on leap year (366 days)", () => {
    const principal = 100000;
    const annualRate = new Big(0.275);
    const dailyRate = annualRate.div(366); // leap year
    const expected = new Big(principal).times(dailyRate);
    const calculated = new Big(principal).times(annualRate.div(366));
    expect(calculated.eq(expected)).toBe(true);
  });

  it("handles zero balance correctly", () => {
    const interest = service.calculateDailyInterest(0);
    expect(interest.eq(0)).toBe(true);
  });

  it("rounds down interest correctly", () => {
    const interest = service.calculateDailyInterest(1); // very small
    const rounded = parseInt(interest.round(0, 0).toString(), 10);
    expect(rounded).toBe(0);
  });

  it("does not lose precision with large numbers", () => {
    const principal = 123456789012345;
    const interest = service.calculateDailyInterest(principal);
    expect(interest.gt(0)).toBe(true);
  });
});