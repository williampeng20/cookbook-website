class Timer {
    constructor(color, interval_func) {
        this.time_left = 900;
        this.timer = null;
        this.interval = interval_func;
        this.color = color;
        this.element;
        if (color == 'white') {
            this.element = document.getElementById('white_timer')
            this.update_time();
        } else {
            this.element = document.getElementById('black_timer');
            this.update_time();
        }
    }

    start() {
        this.timer = setInterval(this.interval, 1000);
    }

    pause() {
        clearInterval(this.timer);
    }

    addTime(num) {
        this.time_left += num;
        this.update_time();
    }

    reset(num) {
        this.time_left = num;
        this.update_time();
    }

    update_time() {
        var subtotal = this.time_left;
        var min = Math.floor(subtotal/60);
        var sec = subtotal - min*60;
        this.element.innerHTML = min + ":" + ((sec > 9) ? "" : "0") + sec;
    }

    timeout() {
        alert(this.color + ' has forfeit by timeout.');
        myGameArea.forfeit();
    }
}
