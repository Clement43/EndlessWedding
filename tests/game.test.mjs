import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Physics } from '../src/Physics.ts';
import { Controller } from '../src/Controller.ts';
import { calendarEvent, googleFormEmbedUrl, wedding } from '../src/wedding.ts';

function playerState(jumping = true) {
    return {
        y: 0,
        velocity: -580,
        getIsJumping: () => jumping,
        getY() { return this.y; },
        setY(value) { this.y = value; },
        getVelocityY() { return this.velocity; },
        setVelocityY(value) { this.velocity = value; },
    };
}

for (const fps of [30, 60, 120]) {
    test(`identical jump trajectory at ${fps} FPS`, () => {
        const player = playerState();
        const physics = new Physics();
        for (let frame = 0; frame < fps / 2; frame++) physics.applyGravity(player, 1 / fps);
        assert.ok(Math.abs(player.y + 90) < 0.000001);
        assert.ok(Math.abs(player.velocity - 220) < 0.000001);
    });
}

test('grounded player does not move', () => {
    const player = playerState(false);
    new Physics().applyGravity(player, 0.1);
    assert.equal(player.y, 0);
    assert.equal(player.velocity, -580);
});

test('zero elapsed time does not advance a jump', () => {
    const player = playerState();
    new Physics().applyGravity(player, 0);
    assert.equal(player.y, 0);
    assert.equal(player.velocity, -580);
});

test('keyboard and pointer controls share one jump callback and clean up', () => {
    const canvas = new EventTarget();
    let jumps = 0;
    let pauses = 0;
    let focuses = 0;
    canvas.focus = () => focuses++;
    const controller = new Controller(canvas, () => jumps++, () => pauses++);
    const key = (code, repeat = false) => canvas.dispatchEvent(Object.assign(
        new Event('keydown', { cancelable: true }), { code, repeat },
    ));
    const pointer = (pointerType, button) => canvas.dispatchEvent(Object.assign(
        new Event('pointerdown'), { pointerType, button },
    ));
    try {
        for (const code of ['Space', 'ArrowUp', 'KeyW']) assert.equal(key(code), false);
        key('Space', true);
        pointer('mouse', 2);
        assert.equal(jumps, 3);
        pointer('touch', 0);
        pointer('mouse', 0);
        assert.equal(jumps, 5);
        assert.equal(focuses, 2);
        key('KeyP');
        key('Escape');
        key('KeyP', true);
        assert.equal(pauses, 2);
    } finally {
        controller.destroy();
    }
    key('Space');
    key('KeyP');
    pointer('touch', 0);
    assert.equal(jumps, 5);
    assert.equal(pauses, 2);
});

test('Google Forms embed URL is normalized', () => {
    assert.equal(
        googleFormEmbedUrl('https://docs.google.com/forms/d/e/example-form/viewform?usp=sharing#page')?.href,
        'https://docs.google.com/forms/d/e/example-form/viewform?embedded=true',
    );
    assert.equal(
        googleFormEmbedUrl('https://docs.google.com/forms/d/example-form/viewform')?.href,
        'https://docs.google.com/forms/d/example-form/viewform?embedded=true',
    );
});

test('missing, private and untrusted form URLs are rejected', () => {
    for (const url of [
        '', 'invalid', 'javascript:alert(1)',
        'http://docs.google.com/forms/d/e/example/viewform',
        'https://docs.google.com.evil.test/forms/d/e/example/viewform',
        'https://docs.google.com/forms/d/example/edit',
        'https://forms.gle/example',
    ]) assert.equal(googleFormEmbedUrl(url), null, url);
});

test('calendar event uses configured dates in UTC and CRLF lines', () => {
    const format = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const event = calendarEvent();
    assert.ok(event.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'));
    assert.ok(event.includes(`DTSTART:${format(wedding.date)}\r\n`));
    assert.ok(event.includes(`DTEND:${format(wedding.endDate)}\r\n`));
    assert.ok(event.includes(`SUMMARY:Mariage de ${wedding.names.join(' & ')}\r\n`));
    assert.ok(event.endsWith('END:VCALENDAR\r\n'));
});

test('calendar text cannot inject new event properties', () => {
    const previousRegion = wedding.region;
    try {
        wedding.region = 'Rivage, jardin; sud\nTerrasse';
        assert.ok(calendarEvent().includes('Rivage\\, jardin\\; sud\\nTerrasse'));
    } finally {
        wedding.region = previousRegion;
    }
});