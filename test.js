var promise = require('./promise.js')

if (true) {
	var p1 = new promise(function (resolve, reject) {
		setTimeout(function () {
			console.log("p1 resolving ...")
			resolve("hello world")
		}, 1000)
	})

	.then(function (value) {
		console.log("p1 - then - 1 : " + value)
		return value + ", haha!"
	}, function (error) {
		console.log(error)
	})

	.then(function (value) {
		console.log("p1 - then - 2 : " + value)
	}, function(error) {
		console.log(error)
	})
}

if (true) {
	var p2 = new promise(function (resolve, reject) {
		setTimeout(function() {
			console.log("p2 resolving ...1")
			resolve(new promise(function (resolve, reject) {
				setTimeout(function () {
					resolve("p2 resolving ...2")
				}, 1000)
			}))
		}, 1000)
	}).then(function(value) {
		console.log(value)
	})
}

if (true) {
	var p3 = new promise(function (resolve, reject) {
		setTimeout(function () {
			resolve("p3 resolved")
		}, 1000)
	})	
	var p4 = new promise(function (resolve, reject) {
		setTimeout(function () {
			resolve("p4 resolved")
		}, 4000)
	})	
	var p5 = new promise(function (resolve, reject) {
		setTimeout(function () {
			resolve("p5 resolved")
		}, 2500)
	})	

	promise.all([p5, p3, p4]).then(function () {
		console.log(arguments)
	}, function (error) {
		console.log(error)
	})

	promise.race([p5, p4]).then(function () {
		console.log(arguments)
	}, function (error) {
		console.log(error)
	})
}

