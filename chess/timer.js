class Timer {
    constructor(color, interval_func) {
        this.time_left = 150;
        this.timer = null;
        this.interval = interval_func;
        this.color = color;
        this.element;
        if (color == 'white') {
            this.element = document.getElementById('white_timer')
            this.element.innerHTML = this.time_left;
        } else {
            this.element = document.getElementById('black_timer');
            this.element.innerHTML = this.time_left;
        }
    }

    start() {
        this.timer = setInterval(this.interval, 1000);
    }

    pause() {
        clearInterval(this.timer);
        return this.time_left;
    }

    addTime(num) {
        this.time_left += num;
        this.element.innerHTML = this.time_left;
    }

    reset(num) {
        this.time_left = num;
        this.element.innerHTML = this.time_left;
    }
}