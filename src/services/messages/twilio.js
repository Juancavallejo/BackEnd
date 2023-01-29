import twilio from "twilio";

const accountId = "AC5860ae9b886ed01b1bac2ce511275e9e";
const authToken = "a35e51368da3d93eb2f81444017949a8";

export const client = twilio(accountId, authToken)
