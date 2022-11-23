const userModel = require('../models/user');
const Contestant = require('../models/contestant');

const Vote = require('../models/vote');
const DataUri = require('datauri/parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;

exports.getAdminDash = async (req, res, next) => {
	let data;
	try {
		const { _id, role } = req.user;
		if (req.user.role !== 'admin') {
			req.session.message = {
				type: 'danger',
				intro: 'Unauthorized access',
				message: 'User does not have access to the page requested',
			};
			res.redirect('/login');
		}
		const user = await userModel
			.findOne({ _id, role })
			.select('-password -updatedAt -createdAt');
		if (!user) {
			req.session.message = {
				type: 'danger',
				intro: 'Try again',
				message: 'User does not exit',
			};
			res.redirect('/login');
		}

		let contestants = await Contestant.find({});
		// let events = await Event.find({});

		let totalVotes = 0

		for (let i = 0; i < contestants.length; i++) {
			totalVotes += contestants[i].totalVotes
		}

		// let tickets = await Ticket.find({ paid: true });

		data = {
			title: 'Admin Dashboard | ATS',
			contestants,
			voteCount: totalVotes,
			contestantsCount: contestants.length,
			user: user
			// eventCount: events.length,
		};

		res.render('admin-dash', data);
	} catch (error) { }
};

exports.getUpload = async (req, res, next) => {
	if (req.user.role !== 'admin') {
		res.redirect('/login');
	}
	res.render('upload', { title: 'Upload Contestants | ATS', user: req.user });
};

exports.getForms = async (req, res, next) => {
	if (req.user.role !== 'admin') {
		res.redirect('/login');
	}
	res.render('formsAdmin', { title: 'Upload | Syticks' });
};

exports.getEdit = async (req, res, next) => {
	const { slug } = req.params;

	if (req.user.role !== 'admin') {
		res.redirect('/login');
	}

	let event = await Event.findOne({ slug });
	res.render('edit', event);
};

exports.handleUpload = async (req, res, next) => {
	const {
		name, id, category, description
	} = req.body;

	let data;

	try {

		data = {
			name,
			description,
			ref_no: id,
			category,
		};

		if (req.files) {
			data.images = [];

			let dtauri = new DataUri();
			for (const file of req.files) {
				let dataUri = dtauri.format(
					path.extname(file.originalname),
					file.buffer,
				);

				let finalFile = dataUri.content;

				let image = await cloudinary.uploader.upload(finalFile);
				console.log(image);
				data.images.push({
					url: image.secure_url,
					public_id: image.public_id,
				});
			}
		}

		await Contestant.create(data);

		req.session.message = {
			type: 'success',
			intro: 'Uploaded Successfully',

		};

		res.redirect('/admin');
	} catch (error) {
		console.log(error);
	}
};



// exports.getAdminEvents = async (req, res, next) => {
// 	try {
// 		const { role } = req.user;

// 		if (role !== 'admin') {
// 			req.session.message = {
// 				type: 'danger',
// 				intro: 'Unauthorized access',
// 				message: 'User does not have access to the page requested',
// 			};
// 			res.redirect('/login');
// 		}

// 		let events = await Event.find({}).populate('organiser', 'slug');

// 		res.render('admin-events', { title: 'Upload | Syticks', events });
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

exports.getVotesPage = async (req, res, next) => {
	try {
		const { role } = req.user;

		if (role !== 'admin') {
			req.session.message = {
				type: 'danger',
				intro: 'Unauthorized access',
				message: 'User does not have access to the page requested',
			};
			res.redirect('/login');
		}

		let votes = await Vote.find({}).select('username amount vote_no contestant_id');

		res.render('admin-votes', { title: 'Votes Info | ATS', votes: votes, user: req.user });
	} catch (err) {
		console.log(err);
	}
};

// exports.eventsDone = async (req, res, next) => {
// 	try {
// 		const { role } = req.user;
// 		const { slug } = req.params;
// 		if (role !== 'admin') {
// 			req.session.message = {
// 				type: 'danger',
// 				intro: 'Unauthorized access',
// 				message: 'User does not have access to the page requested',
// 			};
// 			res.redirect('/login');
// 		}

// 		let event = await Event.findOne({ slug: slug });
// 		event.done = true;
// 		await event.save();
// 		res.redirect('/admin/events');
// 	} catch (err) {
// 		console.log(err);
// 		res.render('error', { message: 'Internal server error occured ' });
// 	}
// };

// exports.deleteEvent = async (req, res, next) => {
// 	try {
// 		const { role } = req.user;
// 		const { slug } = req.params;
// 		if (role !== 'admin') {
// 			req.session.message = {
// 				type: 'danger',
// 				intro: 'Unauthorized access',
// 				message: 'User does not have access to the page requested',
// 			};
// 			res.redirect('/login');
// 		}

// 		let event = await Event.findOne({ slug: slug });
// 		event.is_deleted = !event.is_deleted;
// 		await event.save();

// 		req.session.message = {
// 			type: 'success',
// 			intro: 'Success',
// 			message: 'Event Status Successfully updated',
// 		};

// 		res.redirect('/admin/events');
// 	} catch (err) {
// 		console.log(err);
// 		res.render('error', { message: 'Internal server error occured ' });
// 	}
// };

// exports.editEvent = async (req, res, next) => {
// 	try {
// 		const { role } = req.user;
// 		const { slug } = req.params;

// 		console.log(role);
// 		if (role !== 'admin') {
// 			req.session.message = {
// 				type: 'danger',
// 				intro: 'Unauthorized access',
// 				message: 'User does not have access to the page requested',
// 			};
// 			res.redirect('/login');
// 		}

// 		let event = await Event.findOne({ slug: slug });

// 		const { name, description, date, slots } = req.body;

// 		let data;

// 		try {
// 			event.name = name || event.name;
// 			event.description = description || event.description;
// 			event.date = date || event.date;
// 			event.slots = slots || event.slots;

// 			let images;

// 			if (req.files) {
// 				event.images = [];

// 				let dtauri = new DataUri();
// 				for (const file of req.files) {
// 					let dataUri = dtauri.format(
// 						path.extname(file.originalname),
// 						file.buffer,
// 					);

// 					let finalFile = dataUri.content;

// 					let image = await cloudinary.uploader.upload(finalFile);
// 					console.log(image);
// 					event.images.push({
// 						url: image.secure_url,
// 						public_id: image.public_id,
// 					});
// 				}
// 			}

// 			let result = await event.save();

// 			console.log(result);

// 			req.session.message = {
// 				type: 'success',
// 				intro: 'Successfully',
// 				message: `Event Updated Successfully`,
// 			};

// 			res.redirect('/');
// 		} catch (error) {
// 			console.log(error);
// 		}

// 		req.session.message = {
// 			type: 'success',
// 			intro: 'Success',
// 			message: 'Event Status Successfully updated',
// 		};

// 		res.redirect('/admin/events');
// 	} catch (err) {
// 		console.log(err);
// 		res.render('error', { message: 'Internal server error occured ' });
// 	}
// };
