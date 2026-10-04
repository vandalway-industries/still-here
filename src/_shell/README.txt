The shared shell of every page on isitstillhere.com. scripts/build.mjs replaces three markers in
each page under src/ with these files: <!-- shell:head --> (after the viewport meta) with head.html,
<!-- shell:header --> (first thing in <body>) with header.html, and <!-- shell:footer --> (after
<main>) with footer.html. The menu link for the page being built gets aria-current="page". The
build fails if a page lacks a marker. This folder is not published. (Jules, 2026-10-04)
