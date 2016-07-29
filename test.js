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
