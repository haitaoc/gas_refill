class DateTime {
    public static nowLocal(): Date {
        const nowUtc = new Date();
        const localDate = new Date(nowUtc.getTime() - nowUtc.getTimezoneOffset() * 60000);
        return localDate;
    }

    public static toLocalString(utcDatetime: string): string {
        console.log(new Date(utcDatetime).toLocaleString());
        return new Date(utcDatetime).toLocaleString();
    }
}

export default DateTime;