class DateTime {
    public static now(): Date {
        const nowUtc = new Date();
        const localDate = new Date(nowUtc.getTime() - nowUtc.getTimezoneOffset() * 60000);
        return localDate;
    }

    public static format(datetime: string): string {
        return datetime.slice(0, 19).replace('T', ' ');
    }
}

export default DateTime;