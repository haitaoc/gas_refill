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

    public static toUTCString(localDatetime: string): string {
        // Needs to convert to "yyyy/mm/dd HH:MM:SS" for Safari support
        localDatetime = localDatetime.replace(/-/g, '/').replace('T', ' ');
        return new Date(Date.parse(localDatetime)).toISOString();
    }
}

export default DateTime;