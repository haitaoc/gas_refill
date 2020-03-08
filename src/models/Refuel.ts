class Refuel {
    id: string;
    vehicleNickname: string;
    date: string;
    gasPrice: number;
    amountPaid: number;
    amountFueled: number;
    curMileage: number;

    constructor(id: string, vehicleNickname: string, date: string, gasPrice: number, amountPaid: number, curMileage: number) {
        this.id = id;
        this.vehicleNickname = vehicleNickname;
        this.date = date;
        this.gasPrice = gasPrice;
        this.amountPaid = amountPaid;
        this.amountFueled = amountPaid / gasPrice * 100;
        this.curMileage = curMileage;
    }
};

export default Refuel;