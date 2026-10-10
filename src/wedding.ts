export const wedding = {
    names: ['Camille', 'Alex'],
    date: '2027-06-19T15:30:00+02:00',
    endDate: '2027-06-20T04:00:00+02:00',
    venue: 'Domaine des Oliviers',
    region: 'Provence',
    replyBefore: '19 mai 2027',
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfihuJfIbPO88bdFkNKa3k74wYqhR0gODipWHIYzXY86NijBw/viewform?usp=publish-editor',
    program: [
        { time: '15:30', title: 'Le grand oui', detail: 'La cérémonie, entourés de vous.', icon: 'heart' },
        { time: '17:00', title: "Un toast à l'amour", detail: 'Un cocktail et beaucoup de sourires.', icon: 'wine' },
        { time: '19:30', title: 'Le bonheur à table', detail: 'Un dîner à savourer ensemble.', icon: 'utensils' },
        { time: '22:00', title: "Jusqu'au bout de la nuit", detail: 'De la musique, des étoiles, et nous.', icon: 'music' },
    ],
};

export function googleFormEmbedUrl(value: string): URL | null {
    try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com'
            || !/^\/forms\/d\/(?:e\/)?[\w-]+\/viewform\/?$/.test(url.pathname)) return null;
        url.search = '';
        url.hash = '';
        url.searchParams.set('embedded', 'true');
        return url;
    } catch {
        return null;
    }
}

export function calendarEvent(): string {
    const date = (value: string) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const text = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/[,;]/g, '\\$&');
    return [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Faire-part//Mariage//FR',
        'BEGIN:VEVENT', `UID:mariage-${date(wedding.date)}@faire-part.local`,
        `DTSTAMP:${date(new Date().toISOString())}`,
        `DTSTART:${date(wedding.date)}`, `DTEND:${date(wedding.endDate)}`,
        `SUMMARY:${text(`Mariage de ${wedding.names.join(' & ')}`)}`,
        `LOCATION:${text(`${wedding.venue}, ${wedding.region}`)}`,
        'END:VEVENT', 'END:VCALENDAR', '',
    ].join('\r\n');
}