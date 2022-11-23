const axios = require('axios');
const { getUserProfile } = require('../controllers/users');
const User = require('../models/user');
const Contestant = require("../models/contestant")
const Vote = require('../models/vote');

const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	20,
);

exports.makePayment = async (req, res) => {
	let { amount } = req.body;
	let { _id } = req.user;
	console.log(req.user);
	let { ref_no } = req.params;
	let user = await User.findById(_id);
	// let event = await Events.findOne({ slug: slug });

	// console.log(req.body);

	if (amount == 0) {
		req.session.message = {
			type: 'danger',
			intro: 'No ticket selected',
			message: 'Please increase the count to at least 1',
		};
		res.redirect('/');
	}

	let tranCode = nanoid();
	let tx_ref = 'ats-' + tranCode;

	try {
		// let details = [];

		// // let key = Object.keys(req.body);

		// key.forEach((element) => {
		// 	if (element !== 'cart-coupon' && element !== 'slug') {
		// 		console.log(element);

		// 		let obj = {};
		// 		obj.type = element;
		// 		obj.num = req.body[element];
		// 		details.push(obj);
		// 	}
		// });

		let payload = {
			tx_ref,
			amount: amount * 10 * 100,
			currency: 'NGN',
			callback_url: `https://anambratalentshow.com/transaction/verify`,
			payment_options: 'card',
			email: user.email,
			reference: tx_ref,


			customizations: {
				title: 'Anambra Talent Show',
				description: '',
				logo: '',
			},
		};

		// let transaction_payload = {
		// 	amount,
		// 	trans_ref: tx_ref,
		// 	event: event._id,
		// 	user_id: _id,
		// };

		// console.log(details);

		let votePayload = {
			user_id: user._id,
			username: user.username,
			amount: Number(amount * 10),
			trans_ref: tx_ref,
			contestant_id: ref_no,
			vote_no: Number(amount)
		};

		// await Transactions.create(transaction_payload);
		await Vote.create(votePayload);

		let config = {
			headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` },
			'Content-Type': 'application/json'
		};

		const result = await axios.post(
			'https://api.paystack.co/transaction/initialize',
			payload,
			config,
		);

		// result = await result.json()


		let link = result.data.data.authorization_url;
		// console.log(1000, link);
		if (result.status == 200) {

			console.log(link)
			res.redirect(link);
		}
	} catch (error) {

		console.log(error);

		req.session.message = {
			success: false,
		};

		res.redirect(`/contestants/vote/${ref_no}`);
	}
};

exports.verifyPayment = async (req, res) => {
	// https://anambratalentshow.com/transaction/verify?trxref=ats-ajBx9MnC0tW1HBRcqNzU&reference=ats-ajBx9MnC0tW1HBRcqNzU	
	const { trxref, reference, status } = req.query;
	console.log(tx_ref);
	console.log(status);

	console.log(req.query);


	try {
		// const tranx = await Transactions.findOne({ trans_ref: tx_ref });

		const url = `api.paystack.co/transaction/verify/${reference}`

		let config = {
			headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` },
			'Content-Type': 'application/json'
		};

		const result = await axios.post(
			url,
			config,
		);


		if (result.status == '200' && result.data.status == "success") {
			let vote = await Vote.findOne({ trans_ref: trxref });
			let contestant = await Contestant.findOne({ ref_no: vote.contestant_id });

			contestant.totalVotes += vote.vote_no

			vote.trans_complete = true;

			await vote.save();
			await contestant.save();

			req.session.message = {
				success: true,
			};

			res.redirect(`/contestants/vote/${vote.contestant_id}`);

		} else {
			let vote = await Votes.findOne({ trans_ref: trxref });

			req.session.message = {
				success: false,
			};

			res.redirect(`/contestants/vote/${vote.contestant_id}`);
		}
	} catch (error) {

		let vote = await Votes.findOne({ trans_ref: trxref });

		req.session.message = {
			success: false,
		};
		res.redirect(`/contestants/vote/${vote.contestant_id}`);
	}
};

exports.greet = async (req, res) => {
	try {
		res.render('thanks');
	} catch (error) {
		console.log(error);
	}
};



