import twilio from "twilio";
import { config } from "../../options/config.js";

const accountId = config.ACCOUNTID;
const authToken = config.AUTHTOKEN;

export const client = twilio(accountId, authToken)
