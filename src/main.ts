import { Game } from './Game';
import { wedding, calendarEvent, googleFormEmbedUrl } from './wedding';
import './style.css';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
const icons: Record<string, string> = {
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    restart: '<path d="M3 11a9 9 0 1 1 9 9 9.75 9.75 0 0 1-6.74-2.74L3 15"/><path d="M3 3v12h12"/>',
    up: '<path d="m5 12 7-7 7 7M12 19V5"/>',
    arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
    calendar: '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
    location: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    trophy: '<path d="M8 21h8m-4-4v4M7 4H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4M7 2h10v7a5 5 0 0 1-10 0V2Z"/>',
    wine: '<path d="M8 22h8m-4-7v7M7 10h10M8 2h8l1 8a5 5 0 0 1-10 0l1-8Z"/>',
    utensils: '<path d="M3 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V2M6 2v20M21 15V2c-5 0-5 10 0 13Zm0 0v7"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
};
const icon = (name: string) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] ?? icons.heart}</svg>`;
const flower = (className: string) => `<div class="flower ${className}" aria-hidden="true">${Array.from({ length: 8 }, (_, index) => `<i style="--petal:${index}"></i>`).join('')}<b></b></div>`;
const date = new Date(wedding.date);
const longDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' }).format(date);
const shortDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'Europe/Paris' }).format(date).replaceAll('/', '.');
const names = wedding.names.map(escapeHtml);
const initials = wedding.names.map(name => escapeHtml(name.charAt(0))).join('<span>&</span>');
document.title = `${wedding.names.join(' & ')} | On se dit oui !`;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <a class="skip-link" href="#invitation">Aller à l'invitation</a>
    <main>
        <section class="game-hero" id="top" aria-labelledby="runner-title">
            <h2 class="game-heading" id="runner-title">Venez à notre mariage en courant</h2>
            <div class="game-surround">
                <div class="game-shell">
                    <div class="game-header">
                        <span class="game-best" title="Meilleur score sur cet appareil">${icon('trophy')}<span class="record-label">RECORD</span> <span id="best">000</span><span>m</span></span>
                    </div>
                    <div class="game-stage" id="game-stage" data-state="ready">
                        <canvas id="canvas" width="960" height="420" tabindex="0" aria-label="La course au bonheur à deux. Espace, flèche vers le haut ou toucher pour faire sauter les deux personnages l'un après l'autre. P ou Échap pour la pause. Évitez les cadeaux.">Votre navigateur ne prend pas en charge ce jeu. L'invitation et le programme restent disponibles ci-dessous.</canvas>
                        <div class="game-hud" id="game-hud" hidden>
                            <span class="distance"><span id="score">0</span> <small>m</small></span>
                            <button class="icon-button" id="pauseBtn" aria-label="Mettre en pause" data-tooltip="Mettre en pause (P)">${icon('pause')}</button>
                        </div>
                        <div class="game-overlay" id="game-overlay">
                            <div class="overlay-content">
                                <h2 id="game-title" hidden></h2>
                                <p class="game-result" id="game-result" hidden></p>
                                <button class="button button-blue" id="playBtn">${icon('play')} Jouer</button>
                            </div>
                        </div>
                    </div>
                    <div class="game-bottom">
                        <button class="jump-button" id="jumpBtn" hidden disabled aria-label="Sauter" data-tooltip="Sauter (Espace, flèche haut ou toucher)">${icon('up')} Sauter</button>
                    </div>
                </div>
            </div>
            <div class="scroll-invite">
                <p>Vous venez ?<br>Confirmez votre présence plus bas.</p>
                <a class="scroll-cue icon-button" href="#rsvp" aria-label="Confirmer votre présence au mariage" data-tooltip="Confirmer votre présence">${icon('up')}</a>
            </div>
        </section>
        <header class="site-header" id="invitation">
            <a class="monogram" href="#top" aria-label="${names.join(' et ')} - accueil">${initials}<span class="monogram-dot">.</span></a>
            <nav aria-label="Navigation principale">
                <a class="nav-link" href="#programme">Le programme</a>
                <a class="nav-rsvp" href="#rsvp">On sera là ${icon('arrow')}</a>
            </nav>
        </header>
        <section class="invitation" aria-labelledby="couple-name">
            <div class="invitation-heading">
                <p class="eyebrow">UNE VIE À DEUX, UNE FÊTE AVEC VOUS</p>
                <h1 id="couple-name">${names[0]} <em>&</em> ${names[1]}</h1>
                <p class="invitation-line">Un grand oui. Et mille aventures à venir.</p>
                <p class="wedding-date"><time datetime="${escapeHtml(wedding.date)}">${longDate}</time><span aria-hidden="true">·</span>${escapeHtml(wedding.venue)}, ${escapeHtml(wedding.region)}</p>
                <div class="love-note" aria-hidden="true">On se dit oui !<span>et ça se fête.</span></div>
                <div class="date-stamp" aria-hidden="true"><span>LE DÉBUT</span><em>de toujours</em><span>${shortDate}</span></div>
            </div>
        </section>
        <div class="love-ribbon" aria-hidden="true"><span>UN PEU</span>${icon('heart')}<span>BEAUCOUP</span>${icon('heart')}<span>POUR TOUJOURS</span>${icon('heart')}<span>ET SURTOUT, AVEC VOUS</span></div>
        <section class="program-section section" id="programme" aria-labelledby="program-title">
            <div class="section-heading"><p class="eyebrow">LE ${longDate.toLocaleUpperCase('fr-FR')}</p><h2 id="program-title">Une journée pour <em>tout célébrer.</em></h2><p>Des premiers regards à la dernière danse.</p></div>
            <ol class="timeline">${wedding.program.map((event, index) => `
                <li><span class="event-icon event-${index}">${icon(event.icon)}</span><time>${escapeHtml(event.time.replace(':', 'h'))}</time><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.detail)}</p></li>
            `).join('')}</ol>
            <div class="program-details"><p>${icon('location')}<span><strong>${escapeHtml(wedding.venue)}</strong><span>${escapeHtml(wedding.region)}</span></span></p><button class="button button-outline" id="calendarBtn">${icon('calendar')} Garder la date</button></div>
        </section>
        <section class="rsvp-section" id="rsvp" aria-labelledby="rsvp-title">
            <div class="rsvp-inner">
                <div class="rsvp-copy"><p class="eyebrow">UNE PLACE POUR VOUS</p><h2 id="rsvp-title">Et vous,<br>vous <em>venez ?</em></h2><p>Cette journée ne serait pas la même sans vous.<br>On a hâte de vous compter parmi nous !</p><p class="reply-date">Votre petit oui avant le <strong>${escapeHtml(wedding.replyBefore)}</strong>.</p>${flower('flower-rsvp')}</div>
                <div class="rsvp-form" id="rsvp-form">
                    <div class="rsvp-placeholder"><div class="envelope" aria-hidden="true">${icon('heart')}</div><h3>Votre réponse, bientôt ici.</h3><p>Les confirmations de présence<br>ouvriront prochainement.</p><span class="rsvp-signature">Avec amour, ${names.join(' & ')}</span></div>
                </div>
            </div>
        </section>
    </main>
    <footer class="site-footer"><a class="monogram" href="#top" aria-label="Retour en haut">${initials}<span class="monogram-dot">.</span></a><p>Le début de notre toujours.<span>${shortDate} ${icon('heart')} ${escapeHtml(wedding.region)}</span></p><a class="icon-button" href="#top" aria-label="Retour en haut" data-tooltip="Retour en haut">${icon('up')}</a></footer>
    <p class="sr-only" id="game-announcement" role="status" aria-live="polite"></p>
`;

const element = <ElementType extends HTMLElement>(selector: string) => document.querySelector<ElementType>(selector)!;
const stage = element('#game-stage');
const overlay = element('#game-overlay');
const playButton = element<HTMLButtonElement>('#playBtn');
const jumpButton = element<HTMLButtonElement>('#jumpBtn');
const gameTitle = element('#game-title');
const gameResult = element('#game-result');
let previousState = '';

const game = new Game(({ state, score, best }) => {
    element('#score').textContent = String(score);
    element('#best').textContent = String(best).padStart(3, '0');
    if (previousState === state) return;
    previousState = state;
    stage.dataset.state = state;
    overlay.hidden = state === 'running';
    element('#game-hud').hidden = state !== 'running';
    jumpButton.disabled = state !== 'running';
    jumpButton.hidden = state !== 'running';
    gameTitle.hidden = state === 'ready' || state === 'running';
    gameResult.hidden = state !== 'over';
    if (state === 'over') {
        gameTitle.textContent = 'Fin de partie';
        gameResult.textContent = `${score} m | Record : ${best} m`;
        playButton.innerHTML = `${icon('restart')} Rejouer`;
        element('#game-announcement').textContent = `Partie terminée. ${score} mètres. Meilleur score : ${best} mètres.`;
        playButton.focus({ preventScroll: true });
    } else if (state === 'paused') {
        gameTitle.textContent = 'Pause';
        playButton.innerHTML = `${icon('play')} Reprendre`;
        element('#game-announcement').textContent = 'Jeu en pause.';
        playButton.focus({ preventScroll: true });
    } else if (state === 'running') {
        element('#game-announcement').textContent = 'La partie commence. Le second personnage reproduit le saut du premier pour éviter les cadeaux.';
    }
});
playButton.addEventListener('click', () => stage.dataset.state === 'paused' ? game.togglePause() : game.start());
element('#pauseBtn').addEventListener('click', () => game.togglePause());
jumpButton.addEventListener('click', () => {
    game.jump();
    element('#canvas').focus({ preventScroll: true });
});
element('#calendarBtn').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([calendarEvent()], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notre-mariage.ics';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});

const formUrl = googleFormEmbedUrl(wedding.googleFormUrl);
if (formUrl) {
    const container = element('#rsvp-form');
    container.replaceChildren();
    const frame = document.createElement('iframe');
    frame.src = formUrl.href;
    frame.title = `Confirmer votre présence au mariage de ${wedding.names.join(' et ')}`;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    container.append(frame);
    const fallback = document.createElement('a');
    fallback.href = formUrl.href;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.className = 'form-fallback';
    fallback.textContent = 'Ouvrir le formulaire Google dans un nouvel onglet';
    container.append(fallback);
}

if (import.meta.hot) import.meta.hot.dispose(() => game.destroy());