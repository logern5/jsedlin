# jsedlin
JScript line editor inspired by Edlin and GNU ed

Usage:
`cscript jsedlin.js [filename]`

```
[STARTLINE],[ENDLINE]a: add text from STARTLINE to ENDLINE
[STARTLINE],[ENDLINE]l: list contents of file from STARTLINE to ENDLINE
[STARTLINE],[ENDLINE]?[SEARCHTEXT]s: search for SEARCHTEXT from STARTLINE to ENDLINE
[STARTLINE],[ENDLINE]?[SEARCHTEXT]%%%[REPLACETEXT]r: replace SEARCHTEXT with REPLACETEXT from STARTLINE to ENDLINE
[STARTLINE],[ENDLINE]d: delete lines from STARTLINE to ENDLINE
$: a wildcard that represents the last line of the file, can be used as ENDLINE in the above commands
w: write buffer to file
q: quit jsedlin
h: show this help text
```
