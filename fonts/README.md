# Fonts

Oswald, Barlow and Barlow Semi Condensed, subset to `latin` and `latin-ext` and served from this
origin rather than from Google Fonts. Self-hosting is what lets the builder render correctly with no
network, and means opening a participant's assessment sends no request to a third party.

`fonts.css` in the repository root is Google's own `@font-face` declarations with the URLs rewritten
to point here — including Oswald, which is a single variable file declared at four discrete weights,
exactly as Google serves it.

Both families are licensed under the SIL Open Font License, Version 1.1:

- Barlow and Barlow Semi Condensed — Copyright 2017 The Barlow Project Authors. See `OFL-Barlow.txt`.
- Oswald — Copyright 2016 The Oswald Project Authors. See `OFL-Oswald.txt`.

The OFL permits redistribution with the licence included, which is why these files are here. If the
practice changes the letterhead to a different typeface, replace `fonts.css` and the files in this
directory, update the font stacks in `index.html` (`ST` for the report, the CSS block for the app),
and carry across whatever licence the new typeface requires.

## Refreshing them

Fetch the CSS Google serves for the three families, keep the `latin` and `latin-ext` blocks, download
each `woff2` alongside, and rewrite the `src` URLs to relative paths. Nothing else in the app changes.
