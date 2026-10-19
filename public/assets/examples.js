// Example pictures behind the "?" on the screen and body questions, one per answer, so sellers can compare
// their device before choosing. Real photos where a freely licensed one exists (the credit is shown under
// it, as the licence requires); drawings where none does.
// To use your own photo: put it in public/assets/examples/, point `img` at it and delete its `credit`.

const commons = (file, by, license) => ({
  by, license, url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`,
});

export const EXAMPLES = {
  screen: {
    A: { img: 'screen-a.jpg', credit: commons('IPhone 5 paint (top).jpg', 'Neilpcronin', 'CC BY-SA 3.0') },
    'A-': { img: 'screen-a-minus.svg' },
    B: { img: 'screen-b.svg' },
    C: { img: 'screen-c.svg' },
  },
  body: {
    A: { img: 'body-a.jpg', credit: commons('Compare iPhone 16 Pro with the iPhone 15 Pro.jpg', 'Hannerdy', 'CC BY-SA 4.0') },
    'A-': { img: 'body-a-minus.jpg', credit: commons('Iphone scratched face.jpg', 'Hi-tech@Mail.Ru', 'CC BY 3.0') },
    'B+': { img: 'body-b-plus.jpg', credit: commons('IPhone 5 paint (bottom).jpg', 'Neilpcronin', 'CC BY-SA 3.0') },
    B: { img: 'body-b.svg' },
    C: { img: 'body-c.jpg', credit: commons('Apple iPhone 2G 8GB (14).jpg', 'Sevela.p', 'CC BY-SA 3.0') },
  },
};

export const LICENSE_URL = {
  'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
};
