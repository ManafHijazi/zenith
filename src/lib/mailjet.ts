import Mailjet from 'node-mailjet';

export const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_APIKEY_PUBLIC!,
  process.env.MAILJET_APIKEY_SECRET!
);
