# Notre mariage

Faire-part responsive avec un endless runner en Canvas 2D et TypeScript. Aucun module de jeu supplementaire : le projet utilise uniquement Vite et TypeScript, deja declares dans package.json.

## Lancer le site

Node.js 22.18+ (ou 24+) est recommande.

```powershell
npm.cmd install
npm.cmd run dev
```

Le terminal indique l'adresse locale. Pour verifier le projet :

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

Le dossier `dist` contient le site a publier. Les images du jeu sont incluses dans la compilation.

## Personnaliser le faire-part

Tout le contenu se trouve dans [src/wedding.ts](src/wedding.ts) : prenoms, dates avec fuseau horaire, lieu, region, date limite de reponse, programme et lien Google Forms.

**Les informations Camille et Alex, le 19 juin 2027 et le Domaine des Oliviers sont des exemples. Remplacez-les avant de partager le site.** Le titre du site, le monogramme, le programme et le fichier calendrier utilisent cette configuration. Les couleurs et les mises en page sont dans [src/style.css](src/style.css).

## Integrer Google Forms

Le formulaire fourni est deja configure dans `googleFormUrl`. Pour le remplacer :

1. Creez et publiez votre formulaire Google : nom, presence, nombre de personnes, restrictions alimentaires, etc.
2. Dans les options de partage ou d'integration, recuperez l'URL complete du formulaire public. Utilisez l'adresse `https://docs.google.com/forms/d/e/IDENTIFIANT/viewform`, pas un lien raccourci `forms.gle` ni l'adresse d'edition.
3. Renseignez `googleFormUrl` dans [src/wedding.ts](src/wedding.ts). L'iframe remplacera automatiquement le message d'attente dans la section RSVP.
4. Verifiez les permissions depuis une fenetre privee, puis envoyez une reponse d'essai et controlez sa reception dans Google Forms.

Sans lien valide, aucun formulaire n'est affiche et aucune reponse n'est collectee. Un lien d'ouverture dans un nouvel onglet accompagne le formulaire integre. Les reponses restent gerees par Google, sans serveur ni stockage des invites dans le site. La hauteur de l'iframe peut etre adaptee dans `.rsvp-form iframe` selon la longueur de votre formulaire.

## Le jeu

- Le bouton de depart lance une nouvelle partie ; la collision propose de rejouer.
- Les deux personnages courent ensemble, l'un derriere l'autre, sans selection. Une seule commande fait sauter le premier ; le second reproduit ce saut au meme endroit, avec un decalage adapte a la vitesse du decor. La pause suspend aussi ce decalage. Une collision avec l'un ou l'autre termine la partie ; rejouer reinitialise les deux personnages et annule le saut en attente.
- Saut : Espace, fleche haut, W, toucher le canvas ou bouton Sauter.
- Pause : P, Echap ou bouton pause. Reprendre avec le bouton Reprendre.
- Les commandes clavier sont limitees au canvas pour ne pas intercepter les saisies du formulaire.
- Changer d'onglet ou redimensionner entre les modes mobile et ordinateur met le jeu en pause.
- Les obstacles sont des cadeaux ; la vitesse augmente progressivement. Le meilleur score est conserve uniquement sur cet appareil, si le stockage local est disponible.
- Le jeu occupe la premiere vue avec un titre et un lien vers la confirmation de presence. L'invitation et le programme apparaissent en faisant defiler la page.
- Le decor `asset/shadow.png` defile en parallaxe. L'arche, le gateau, le sol et les trois nuages reutilisent aussi les images du projet. Les deux personnages, en robe et en costume, ont des animations pixel art originales dessinees sur le canvas : repos, course, saut.
- Les textes du jeu utilisent la police locale `font/triton.ttf`, et les boutons reprennent les bleus du decor.

## Verification

`npm.cmd test` utilise seulement le lanceur de tests natif de Node : trajectoire du saut a 30/60/120 FPS, etat au sol, URLs Google Forms et calendrier. Les interactions et le rendu du canvas sont aussi a verifier dans le navigateur apres tout changement graphique, sur ordinateur et mobile.

Les polices Fraunces et DM Sans sont chargees depuis Google Fonts, avec polices de repli si le service est indisponible. Le jeu et ses images n'ont pas de dependance reseau externe. Les pictogrammes sont issus de Lucide/Feather ; leurs notices sont distribuees dans [public/THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt).