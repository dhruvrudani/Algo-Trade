import config from 'config'
const nodemailer = require('nodemailer');
const nodeMail: any = config.get('nodeMail')

export const sendEmailHelper = async (email, otp ) => {
	console.log('sendEmail runing  :>> ',);
	var transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: nodeMail.mail,
			pass: nodeMail.password,
		},
	});
	console.log('object :>> ', nodeMail.mail,nodeMail.password);
	let mailOptions = {
		from: 'bhv1912@gmail.com',
		to: email,
		subject: otp,
		text: 'That was easy!',
		html: ` 
        <html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
		<body>
			<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2;height: calc(100% - 20px);justify-content: center;align-items: center;display: flex;justify-content: center;">
				<div style="width:30%;padding:20px 0;background-color: #000000;box-shadow: 0 0.75rem 1.5rem
				rgba(18,38,63,.03);padding: 24px;border-radius: 8px;position:
				relative;">
					<div style="text-align: center;">
						<a href="#">
							<img src="" alt="">
						</a>
						<h1 style="margin:0;text-transform: uppercase;letter-spacing: 1;font-weight: bold;color: #994d00;">Algo Trade</h1>
						<div style="margin-top: 12px; text-align: center;">
							<h3 style="text-transform: capitalize;margin-bottom: 0; color: #f2f2f2;">Here is your one time otp</h3>
						<p style="margin-top: 0px; color:#f2f2f2;font-size: 15px;">OTP expires in 3:00 min</p>
						<div style="margin-top:38px;gap: 40px;/* text-align: center; */justify-content: center;position: relative;background-color: #fff;padding: px;align-items: center;font-size: 22px;border-radius: 10px;width: 100%;">
						<h2 style="margin:0 0px 0 0px;color:#000000;padding:10px 0;letter-spacing: 18px;text-align: center;">${otp}
						</h2>
</div>
<div style=" padding: 20px 0px 0;">
    <a href="http://localhost:3011/auth/change-password" style="
    text-decoration: none;
    color: #f2f2f2;
    font-size: 16px;
">Back to <span style="
    font-size: 16px;
    color: #b35900;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
">Power By Webito </span></a>
</div>
						</div>
					</div>
				</div>
			</div>
		</body>
	</html>`
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log("error", error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};



