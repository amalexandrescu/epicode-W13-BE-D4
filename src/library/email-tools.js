import sgMail from "@sendgrid/mail";

console.log(process.env.SENDGRID_KEY);
sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendEmail = async (recipientAddress) => {
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Hello first email sent!",
    text: "trying to send my first email",
    html: "<strong>trying to send my first email in bold</strong>",
    // attachments: [
    //   {
    //     content: "Some base 64 encoded attachment content",
    //     filename: "some-attachment.txt",
    //     type: "plain/text",
    //     disposition: "attachment",
    //     content_id: "mytext",
    //   },
    // ],
  };
  try {
    console.log(msg);
    let resp = await sgMail.send(msg);
    console.log(resp);
  } catch (error) {
    console.log(error);
  }
};
