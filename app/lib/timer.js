

class Timer {
    constructor(date) {
        this.startTime = date || new Date()
    }

    subtractAndMod(val, last, next) {
        return ((val - (val % last)) % next) / last
    }

    leadingZero(val, pad = 10) {
        return val < pad ? `0${val}` : `${val}`
    }

    elapsed() {
        const endVal = new Date() - this.startTime
        return {
            millis: this.subtractAndMod(endVal, 1, Timer.SECOND_IN_MILLIS),
            seconds: this.subtractAndMod(endVal, Timer.SECOND_IN_MILLIS, Timer.MINUTE_IN_MILLIS),
            minutes: this.subtractAndMod(endVal, Timer.MINUTE_IN_MILLIS, Timer.HOUR_IN_MILLIS),
            hours: this.subtractAndMod(endVal, Timer.HOUR_IN_MILLIS, Infinity)
        }
    }

    elapsedString() {
        const vals = this.elapsed()
        return `${this.leadingZero(vals.hours)}:` +
            `${this.leadingZero(vals.minutes)}:` +
            `${this.leadingZero(vals.seconds)}:` +
            `${this.leadingZero(vals.millis, 100)}`
    }
}

Timer.SECOND_IN_MILLIS = 1000
Timer.MINUTE_IN_MILLIS = 60 * Timer.SECOND_IN_MILLIS
Timer.HOUR_IN_MILLIS = 60 * Timer.MINUTE_IN_MILLIS

module.exports = Timer
