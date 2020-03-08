import config from 'config/Config';
import Refuel from 'models/Refuel';
import DateTime from 'util/Datetime';

interface Item {
    id: string;
    vehicleNickname: string;
    date: string;
    gasPrice: number;
    amountPaid: number;
    curMileage: number;
}

class RefuelContainer {
    public static async getAll(): Promise<(Refuel | null)[]> {
        const url = `${config.api.endpoint}/refuels`;

        const items: Item[] = (await (await fetch(url)).json());

        const refuels = items.map((item) => this.mapItemToRefuel(item));
        return refuels;
    }

    public static async putOne(refuel: Refuel): Promise<Refuel | null> {
        const url = `${config.api.endpoint}/refuels`;

        const item: Item = (await (await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(refuel)
          })).json());

        return this.mapItemToRefuel(item);
    }

    private static mapItemToRefuel(item: Item): Refuel | null {
        if (item === null) return null;

        return new Refuel(
            item.id,
            item.vehicleNickname,
            DateTime.toLocalString(item.date),
            item.gasPrice,
            item.amountPaid,
            item.curMileage
        );
    }
}

export default RefuelContainer;