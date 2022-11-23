import nodemailer from "nodemailer";

/**
 * Account activation email
 */

const accountActivationEmail = async (to, data) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});
		transporter.sendMail({
			from: `Mini Social <${process.env.EMAIL_USER}>`,
			to: to,
			subject: "Account activation",
			text: "Please activate your account",
			html: `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>Verification Email</title>
                            <style>
                            body{
                                background:#ddd;
                            }
                                .main-wrapper {
                                    background-color: #fff;
                                    height: 800px;
                                    width: 500px;
                                    margin: 0;
                                    padding: 0;
                                    text-align: center;
                                   margin:auto;
                                }
                                .wrapper {
                                    background: #fff;
                                    padding: 50px;
                                    box-shadow: 1px 1px 8px 9px #ddd;
                                }

                                a.btn.btn-button {
                                    background: hsl(206deg 100% 73%);
                                    color: #fff;
                                    display: inline-block;
                                    text-decoration: none;
                                    padding: 10px 30px;
                                    font-size: 20px;
                                    box-shadow: 2px 10px 10px 0px #ddd;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="main-wrapper">
                                <div class="wrapper">
                                    <div class="header">
                                        <h1>Verification your Email</h1>
                                    </div>
                                    <div class="body">
                                        <h2>Dear ${data.name} ! please Verification your email</h2>
                                        <a
                                            class="btn btn-button"
                                            href="${data.activationLInk}"
                                            >Verify Now</a
                                        >
                                    </div>
                                </div>
                            </div>
                        </body>
                    </html>
                    `,
		});
	} catch (error) {
		console.log(error.message);
	}
};

export { accountActivationEmail };
