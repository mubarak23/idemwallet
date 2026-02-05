import Big from "big.js";
import { User } from "../models/User";

const ANNUAL_RATE = new Big("0.275");

const DAYS_IN_YEAR = new Big(365);

export class InterestService {
  /**
   * Calculate daily interest for a given principal
   * @param principal Amount in minor units (e.g., cents/sats)
   * @returns Daily interest as Big
   */
 calculateDailyInterest(principal: number): Big {
  return new Big(principal)
    .times(ANNUAL_RATE)
    .div(DAYS_IN_YEAR);
}

  /**
   * Apply daily interest to all users' balances
   */
  async applyDailyInterest(): Promise<void> {
  const users = await User.findAll();

  for (const user of users) {

    const interest = this.calculateDailyInterest(user.balance);

    const interestRounded = interest.round(0, Big.roundDown).toNumber();

    if (interestRounded <= 0) {
      continue; 
    }
    user.balance = Number(user.balance) + interestRounded;
    await user.save();
  }
}

}

export default new InterestService();
