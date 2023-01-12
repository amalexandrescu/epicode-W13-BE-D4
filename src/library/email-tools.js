import sgMail from "@sendgrid/mail";
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
    let resp = await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};
