/*
 |
 | My promsie implement for practice
 |
 */

;(function (factory) {
	"use strict"

	//CommonJs
	if (typeof exports === "object" && typeof module === "object") {
  	module.exports = factory()

  	return
	}

	//<script>
	if (typeof window !== "undefined") {
		window.myPromise = factory()
	}
}(function () {
	"use strict"

	var PENDING = 0,
		FULFILLED = 1,
		REJECTED = 2

	function noop () {}

	function tryDo(fn, onError) {
		if (typeof fn !== "function") return
		try {
			fn()
		} catch (e) {
			if (typeof onError === "function") {
				onError(e)
			}
		}
	}	

	function Promise(fn) {
		if (typeof this !== "object") {
			throw new TypeError("Promise must be constructed via new")
		}

		var status = PENDING
		var value = null
		var handlers = []
		var fulfill, reject, resolve, handle

		fulfill = function (result) {
			status = FULFILLED
			value = result
			handlers.forEach(handle)
			handlers = []
		}

		reject = function (error) {
			status = REJECTED
			value = error
			handlers.forEach(handle)
			handlers = []
		}

		resolve = function (result) {
			tryDo(function () {
				var then = getThen(result)
				if (then) {
					doResolve(then.bind(result), resolve, reject)

					return
				}
				fulfill(result)
			}, function (e) {
				reject(e)
			})
		}

		handle = function (handler) {
			if (status === PENDING) {
				handlers.push(handler)
			} else if (status === FULFILLED) {
				handler.onFulfilled(value)
			} else if (status === REJECTED) {
				handler.onRejected(value)
			}
		}

		this.done = function (onFulfilled, onRejected) {
			setTimeout(function () {
				handle(new Handler(onFulfilled, onRejected))
			}, 0)
		}

		this.then = function (onFulfilled, onRejected) {
			var self = this

			return new Promise(function (resolve, reject) {
				self.done(function (result) {
					if (typeof onFulfilled === "function") {
						if (Array.isArray(result) && result["_multi_values"]) {
							delete result["_multi_values"]
						} else {
							result = [result]
						}
						resolve(onFulfilled.apply(null, result))
					} else {
						resolve(result)
					}
				}, function (error) {
					if (typeof onRejected === "function") {
						reject(onRejected(error))
					} else {
						reject(error)
					}
				})
			})
		}

		doResolve(fn, resolve, reject)
	}

	Promise.all = function () {
		var promises = filterThenables.apply(null, arguments)

		return new Promise(function (resolve, reject) {
			var results = []
			var doneCount = 0
			promises.forEach(function (promise, index) {
				promise.then(function (result) {
					doneCount++
					results[index] = result
					if (doneCount === promises.length) {
						results["_multi_values"] = true
						resolve(results)
					}
				}, function (error) {
					reject(error)
				})
			})
		})
	}

	Promise.race = function () {
		var promises = filterThenables.apply(null, arguments)

		return new Promise(function (resolve, reject) {
			promises.forEach(function (promise) {
				promise.then(function (result) {
					resolve(result)
				}, function (error) {
					reject(error)
				})
			})
		})
	}

	function Handler(onFulfilled, onRejected) {
		if (typeof this !== "object") {
			throw new TypeError("Handler must be constructed via new")
		}
		this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : noop
		this.onRejected = typeof onRejected === "function" ? onRejected : noop
	}

	function filterThenables(values) {
		if (!Array.isArray(values)) {
			values = Array.apply(null, arguments)
		}

		return values.filter(thenable)
	}

	function thenable(obj) {
		if (!obj) {
			return false
		}
		var type = typeof obj
		if ((type === "object" || type === "function") && typeof obj.then === "function") {
			return true
		}

		return false
	}

	function getThen(obj) {
		if (thenable(obj)) {
			return obj.then
		}
	}

	function doResolve(fn, onFulfilled, onRejected) {
		var done = false
		tryDo(function () {
			fn(function (value) {
				if (done) return 
			  done = true
				onFulfilled(value)
			}, function (error) {
				if (done) return 
				done = true
				onRejected(error)	
			})
		}, function (e) {
			if (done) return 
			done = true
			onRejected(e)
		})
	}

	return Promise
}))
