function User (lastVisitDate, globalDiscout, nightDiscount, weekendDiscount, ordersCount, ordersTotalPrice, bonus) {
    this.lastVisitDate = lastVisitDate || new Date('8/25/2017');
    this.globalDiscout = globalDiscout || 1;
    this.nightDiscount = nightDiscount || 5;
    this.weekendDiscount = weekendDiscount || 2;
    this.ordersCount = ordersCount || 0;
    this.ordersTotalPrice = ordersTotalPrice || 0;
    this.bonus = bonus || 20;
}


User.decorators = {};

User.prototype.decorate = function (decorator) {  
    var F = function () {},
    overrides = this.constructor.decorators[decorator],
    i,
    newobj;

    F.prototype = this;
    newobj = new F();
    newobj._super = F.prototype;

    for (i in overrides) {
        if (overrides.hasOwnProperty(i)) {
            newobj[i] = overrides[i];
        }
    }
    return newobj;
}

User.decorators.giveDiscount = {
    getDiscount: function () {
        var nowDate = new Date();
        var day = nowDate.getDay();
        var hour = nowDate.getHours();

        if ((hour > 23 || hour < 6) && ((day == 0) || (day == 6))) {
            return this.globalDiscout + this.nightDiscount + this.weekendDiscount;
        } else if ((hour > 23 || hour < 6)) {
            return this.globalDiscout + this.nightDiscount;
        } else if (((day == 0) || (day == 7))) {
            return this.globalDiscout + this.weekendDiscount;
        } else {
            return this.globalDiscout;
        }
    }
}

User.decorators.giveBonus = { 
        getBonus: function () {
            var nowDate = new Date();
            var daysPassed = Math.ceil(Math.abs(this.lastVisitDate.getTime() - nowDate.getTime()) / (1000 * 3600 * 24));;
            var hours = Math.floor(Math.abs(this.lastVisitDate - nowDate) / 36e5);

            if (daysPassed <= 10) {
            return this.bonus += (240 - hours) + this.ordersCount;
            }
            return this.bonus;
    }
}

var lusia = new User; 
lusia = lusia.decorate('giveDiscount');
Lusia = lusia.decorate('giveBonus');
console.log(Lusia.getBonus());
console.log(Lusia.getDiscount());
