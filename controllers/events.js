const Contestant = require('../models/contestant');

exports.getAll = async (req, res, next) => {
	// let query = {
	// 	is_deleted: false,
	// };
	// console.log(req.query);
	// if (Object.keys(req.query).length > 0) {
	// 	query = {
	// 		is_deleted: false,
	// 		category: req.query.category,
	// 	};
	// }

	let user = null;

	if (req.user) {
		user = {
			_id: req.user._id,
		};
	}

	try {
		let contestants = await Contestant.find();
		console.log(contestants)

		let data = {
			title: 'Contestants | ATS',
			contestants,
			user,
		};
		res.render('contestants', data);
	} catch (error) {
		console.log(error);
	}
};

exports.getOneEvent = async (req, res, next) => {
	const { ref_no } = req.params;

	try {
		let contestant = await Contestant.findOne({ ref_no });
		// let tickets = await Tickets.find({ event: event._id, paid: true });

		let user = null;

		if (req.user) {
			user = {
				_id: req.user._id,
			};
		}

		// let slots;
		// let final = 0;
		// console.log(req.baseUrl + req.url);
		// req.session.eventUrl = req.baseUrl + req.url;

		// tickets.forEach((ticket) => {
		// 	ticket.details.shift();

		// 	let sold = ticket.details.reduce((prev, curr) => {
		// 		let res;
		// 		if (ticket.details[curr] == '') {
		// 			res = prev + Number(0);
		// 		} else {
		// 			res = prev + Number(curr.num);
		// 		}
		// 		return res;
		// 	}, 0);

		// 	final += sold;
		// });

		// if (!event.slots || event.slots == 'unlimited') {
		// 	slots = 'Unlimited';
		// } else {
		// 	slots = Number(event.slots) - Number(final);
		// }

		let data = {
			// title: `${contestant.name} | ATS`,
			contestant,
			user: user
		};

		// if (event.category == 'forms') {
		// 	res.render('formSingle', {
		// 		title: `${event.name} | Syticks`,
		// 		event,
		// 		slots,
		// 		user,
		// 	});
		// } else {
		res.render('contestant', data);
		// }
	} catch (error) {
		console.log(error);
	}
};

exports.getOneEventVote = async (req, res, next) => {
	const { ref_no } = req.params;

	try {
		let contestant = await Contestant.findOne({ ref_no });
		// let tickets = await Tickets.find({ event: event._id, paid: true });

		let user = null;

		if (req.user) {
			user = {
				_id: req.user._id,
			};
		}


		let data = {
			// title: `${contestant.name} | ATS`,
			contestant,
			user: user
		};


		res.render('vote', data);

	} catch (error) {
		console.log(error);
	}
};




// exports.searchEvents = async (req, res, next) => {
// 	const { q } = req.body;

// 	try {
// 		let events = await Events.find(
// 			{ name: { $regex: q, $options: 'i' } },
// 			{},
// 			{ sort: { date: 1 } },
// 		);

// 		let user = null;

// 		if (req.user) {
// 			user = {
// 				_id: req.user._id,
// 			};
// 		}

// 		let data = {
// 			title: `Search Result - ${q} | Syticks`,
// 			events,
// 			query: `Search Result: ${q}`,
// 			user,
// 		};

// 		res.render('events', data);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
