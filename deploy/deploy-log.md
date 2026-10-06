# Deploy log — the production server and the domains

What was run on the production server (vandalwayind.com in Phase 6, staging in Phase 7) and at the
registrar (DNS, Phase 7), and what each said. Every block of
output below is the scripts' own output, pasted whole, or a check made by hand on the server right
after. The scripts print hashes, status codes and labels only: the other sites are `site-01` to
`site-10` in the order they stand in the Caddyfile, and no host name, address or port appears here.
(Jules, 2026-10-05)

## Phase 6: the internal copy (V2, V3, V4), 2026-10-05

**What it is.** `deploy/vandalwayind-install.sh` adds one Caddy site for vandalwayind, bound to the
loopback interface and to a socket under `/srv/vandalwayind/`, serving `/srv/vandalwayind/` with
`file_server` (`deploy/caddy/vandalwayind.caddy`). The internal network reaches it on a new port of
its own, an HTTPS port that proxies to the site's socket; no existing route was changed, and the
other routes' settings hash the same before and after every run. The counter's timer
(`vandalwayind-counter.timer`, every ten minutes) and the site's own JSON access log (seven days
kept) come and go with the same two scripts. Node v18.19.1 was already on the server; nothing was
installed. Every run: Caddyfile backed up with a timestamp, `caddy validate` passed, reloaded,
every other site block byte-identical before and after, and every other site answering after the
reload as it did before (five answer 200 or 301; five answered 502 before we started and still do).

**Backups kept** in `/etc/caddy/` as records: one `Caddyfile.bak-vandalwayind-<time>` per install,
one `Caddyfile.pre-undo-vandalwayind-<time>` per undo.

**The runs, in order (UTC).** The undo was run on the server eight times, and each time the server
returned to its backed-up state (the Caddyfile identical to the backup); after each, the install was
re-run. Three of those round trips were forced by something the previous one taught us:

1. `deploy/vandalwayind-install.sh`, first run. Checked over the internal network: the page, the
   guestbook, `counter.gif` 200 with `Cache-Control: no-cache`; the page and images
   `Last-Modified` 1997-08-22, the guestbook 1999-03-02; POST 405; `/.counter/total` 404.
2. `deploy/vandalwayind-uninstall.sh` ran on the server: returned to the backed-up state.
3. `deploy/vandalwayind-install.sh` re-run. Its `systemctl list-timers` line showed a previous last
   run: the undo had left the timer's last-run record behind
   (`/var/lib/systemd/timers/stamp-vandalwayind-counter.timer`). The undo was corrected to remove it.
4. `deploy/vandalwayind-uninstall.sh` (corrected) ran: returned to the backed-up state.
5. `deploy/vandalwayind-install.sh` re-run.
6. Both scripts now call `sha256sum` by name where they print the backup's and the restored
   Caddyfile's hashes (the same command as before, through a helper), and the other-sites check no
   longer writes a URL around a variable. `deploy/vandalwayind-uninstall.sh` ran: returned to the
   backed-up state.
7. `deploy/vandalwayind-install.sh` re-run. At 12:10 the counter's timer ran and counted nothing.
   The site's access log was not on disk: Caddy 2.6.2 keeps a removed site's log file open until
   it restarts, and when the site came back it wrote to that same open file, which the undo had
   deleted. (Reproduced on a workstation with Caddy 2.6.2: remove the site, delete the log, add the
   site back, and Caddy writes to the deleted file.) So: the undo now empties the log instead of
   deleting it; the log has a new name (`vandalwayind.access.log`), so the next install opened a
   fresh file; and the install now stops if Caddy is writing the site's log to a deleted file. The
   old, deleted file stays open inside Caddy, with nothing writing to it, until Caddy next restarts.
   The install's own checks of the page also changed from GET to HEAD, so they are not counted as
   visits.
8. `deploy/vandalwayind-uninstall.sh` (log emptied, not deleted) ran: returned to the backed-up
   state.
9. `deploy/vandalwayind-install.sh` re-run: "access log: written".
10. `deploy/vandalwayind-uninstall.sh` ran again, to prove the path that had failed: the log was
    emptied and left in place; returned to the backed-up state.
11. `deploy/vandalwayind-install.sh` re-run: Caddy picked the emptied log up again, "access log:
    written". The counter then went from 0 to 26 at the 12:20 run.
12. The 1997 page changed (the menu's E-Mail became the page's one `mailto:` link, so the first
    e-mail link a visitor meets is the address). To put it on the server, the undo ran:
    returned to the backed-up state.
13. `deploy/vandalwayind-install.sh` re-run after the undo.
14. Two fixes deferred from the Phase 6 review, put on the server at 22:49 by the undo (returned to
    the backed-up state) and the install. First: the undo empties the site's log, but Caddy keeps
    writing at its old offset, so at Caddy's next write the emptied log regains a prefix of NUL
    bytes as long as the old file, and the first line after it begins with NULs. The counter
    (`deploy/counter/count.mjs`) now skips leading NUL bytes on a line before reading its JSON;
    before, that first line was skipped as unreadable. Second: the install now writes the date this
    copy began counting (the day it reset the total, UTC, "October 5, 2026") into the served page's
    "times since" line, before the page's Last-Modified is set. The repository's page keeps its own
    date.
15. `deploy/vandalwayind-install.sh` re-run after the undo: the copy that ran until item 16. Checked
    afterwards over the internal network: the page 200, `Last-Modified` 1997-08-22, "times since
    October 5, 2026."; on the server, the log began with NUL bytes and the counter, run by hand,
    counted the visit after them.
16. The 1997 page changed again, approved after the blind picks (`specs-v6`): the menu's E-Mail
    goes to the page's own e-mail line (`#email`), and the address on that line is the page's one
    `mailto:` link, to webmaster@vandalwayind.com, as in its golden. To put it on the server, the
    undo ran at 03:43 on 2026-10-06, from a copy of the repository at 3f4803e: returned to the
    backed-up state.
17. `deploy/vandalwayind-install.sh` re-run after the undo: the copy that is running now. Checked
    afterwards over the internal network: the page 200, `Last-Modified` 1997-08-22, one `mailto:`
    link, to webmaster@vandalwayind.com; the served page is the repository's page byte for byte
    apart from its "times since" line, which now reads "October 6, 2026.", the UTC day this copy
    began counting again.

**What the undo leaves, said plainly.** After the undo the server is in its backed-up state: the
Caddyfile identical to the backup, no `/srv/vandalwayind`, no timer, no last-run record, no unit
files, the internal network serving only its original port, nothing on the site's local port. Two
things remain by design and are not configuration: the backup copies named above, and the site's
access log, empty, held open by Caddy until its next restart (item 7). Emptied is not quite the
end of it: at Caddy's next write to that log, the file regains a NUL-filled prefix as long as it was
before, and the new lines follow it (item 14); the counter reads past it.

### 1. Install, first run

```
== vandalwayind-install.sh, 2026-10-05T12:02:50Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120254Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120254Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                        LEFT LAST PASSED UNIT                       ACTIVATES
Mon 2026-10-05 12:10:00 UTC 6min -         - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: GET / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: GET / 200, GET /.counter/total 404
Caddyfile now sha256 d0e99896150d981a5176edd7c8201aaf00c892b925c35476898427bf529345bb
== vandalwayind-install.sh done
```

### 2. Undo

```
== vandalwayind-uninstall.sh, 2026-10-05T12:03:16Z
internal network: 1 port of the site removed; no other route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-vandalwayind-20261005T120318Z (sha256 d0e99896150d981a5176edd7c8201aaf00c892b925c35476898427bf529345bb)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
files: /srv/vandalwayind/ and the site's access log removed
uninstall Caddyfile sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120254Z: the server returned to its backed-up state
the site is gone: local port 000, socket absent
== vandalwayind-uninstall.sh done
```

Checked by hand afterwards, on the server:

```
caddyfile 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
srv: www
timers: 0
serve: one port, its two original routes
files in the caddy log folder: 0
listen: 0
internal url after undo: 000
```

### 3. Install, re-run

```
== vandalwayind-install.sh, 2026-10-05T12:03:39Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120343Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120343Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                        LEFT LAST                        PASSED UNIT                       ACTIVATES
Mon 2026-10-05 12:10:00 UTC 6min Mon 2026-10-05 12:03:02 UTC      - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: GET / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: GET / 200, GET /.counter/total 404
Caddyfile now sha256 d0e99896150d981a5176edd7c8201aaf00c892b925c35476898427bf529345bb
== vandalwayind-install.sh done
```

### 4. Undo, corrected (the last-run record)

```
== vandalwayind-uninstall.sh, 2026-10-05T12:04:13Z
internal network: 1 port of the site removed; no other route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-vandalwayind-20261005T120415Z (sha256 d0e99896150d981a5176edd7c8201aaf00c892b925c35476898427bf529345bb)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
files: /srv/vandalwayind/ and the site's access log removed
uninstall Caddyfile sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120343Z: the server returned to its backed-up state
the site is gone: local port 000, socket absent
== vandalwayind-uninstall.sh done
```

Checked by hand afterwards, on the server:

```
caddyfile 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
srv: www
timers: 0
stamps: 0
units: 0
serve tcp ports: 1
logs: 0
listen: 0
internal url after undo: 000
```

### 5. Install, re-run

```
== vandalwayind-install.sh, 2026-10-05T12:04:32Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120436Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120436Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                        LEFT LAST PASSED UNIT                       ACTIVATES
Mon 2026-10-05 12:10:00 UTC 5min -         - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: GET / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: GET / 200, GET /.counter/total 404
Caddyfile now sha256 d0e99896150d981a5176edd7c8201aaf00c892b925c35476898427bf529345bb
== vandalwayind-install.sh done
```

### 6. Undo

```
== vandalwayind-uninstall.sh, 2026-10-05T12:05:26Z
internal network: 1 port of the site removed; no other route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-vandalwayind-20261005T120527Z (sha256 d0e99896150d981a5176edd7c8201aaf00c892b925c35476898427bf529345bb)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
files: /srv/vandalwayind/ and the site's access log removed
uninstall Caddyfile sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120436Z: the server returned to its backed-up state
the site is gone: local port 000, socket absent
== vandalwayind-uninstall.sh done
```

Checked by hand afterwards, on the server:

```
caddyfile 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
srv: www
timers: 0
stamps: 0
units: 0
serve tcp ports: 1
logs: 0
listen: 0
internal url after undo: 000
```

### 7. Install, re-run

```
== vandalwayind-install.sh, 2026-10-05T12:05:45Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120549Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120549Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                           LEFT LAST PASSED UNIT                       ACTIVATES
Mon 2026-10-05 12:10:00 UTC 4min 3s -         - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: GET / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: GET / 200, GET /.counter/total 404
Caddyfile now sha256 d0e99896150d981a5176edd7c8201aaf00c892b925c35476898427bf529345bb
== vandalwayind-install.sh done
```

### 8. Undo, the log emptied and not deleted

```
== vandalwayind-uninstall.sh, 2026-10-05T12:15:19Z
internal network: 1 port of the site removed; no other route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-vandalwayind-20261005T121521Z (sha256 d0e99896150d981a5176edd7c8201aaf00c892b925c35476898427bf529345bb)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
files: /srv/vandalwayind/ removed; the site's access log emptied (left in place, 0 bytes, for the reason above)
uninstall Caddyfile sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T120549Z: the server returned to its backed-up state
the site is gone: local port 000, socket absent
== vandalwayind-uninstall.sh done
```

Checked by hand afterwards, on the server:

```
caddyfile 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
srv: www
timers: 0
stamps: 0
units: 0
serve tcp ports: 1
files in the caddy log folder: 0
listen: 0
internal url after undo: 000
```

### 9. Install, re-run

```
== vandalwayind-install.sh, 2026-10-05T12:15:40Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261005T121544Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T121544Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
access log: written, and the file Caddy writes is the one the counter reads
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                           LEFT LAST PASSED UNIT                       ACTIVATES
Mon 2026-10-05 12:20:00 UTC 4min 7s -         - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: HEAD / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: HEAD / 200, GET /.counter/total 404
Caddyfile now sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6
== vandalwayind-install.sh done
```

### 10. Undo, with the log already there

```
== vandalwayind-uninstall.sh, 2026-10-05T12:16:08Z
internal network: 1 port of the site removed; no other route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-vandalwayind-20261005T121610Z (sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
files: /srv/vandalwayind/ removed; the site's access log emptied (left in place, 0 bytes, for the reason above)
uninstall Caddyfile sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T121544Z: the server returned to its backed-up state
the site is gone: local port 000, socket absent
== vandalwayind-uninstall.sh done
```

Checked by hand afterwards, on the server:

```
caddyfile 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
srv: www
timers: 0
stamps: 0
units: 0
serve tcp ports: 1
files in the caddy log folder: 1 (1 empty)
listen: 0
internal url after undo: 000
```

### 11. Install, re-run

```
== vandalwayind-install.sh, 2026-10-05T12:16:23Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261005T121627Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T121627Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
access log: written, and the file Caddy writes is the one the counter reads
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                            LEFT LAST PASSED UNIT                       ACTIVATES
Mon 2026-10-05 12:20:00 UTC 3min 23s -         - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: HEAD / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: HEAD / 200, GET /.counter/total 404
Caddyfile now sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6
== vandalwayind-install.sh done
```

### 12. Undo, to put the corrected page on the server

```
== vandalwayind-uninstall.sh, 2026-10-05T12:21:04Z
internal network: 1 port of the site removed; no other route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-vandalwayind-20261005T122106Z (sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
files: /srv/vandalwayind/ removed; the site's access log emptied (left in place, 0 bytes, for the reason above)
uninstall Caddyfile sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T121627Z: the server returned to its backed-up state
the site is gone: local port 000, socket absent
== vandalwayind-uninstall.sh done
```

### 13. Install, re-run after the undo

```
== vandalwayind-install.sh, 2026-10-05T12:21:22Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261005T122126Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T122126Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
access log: written, and the file Caddy writes is the one the counter reads
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                        LEFT LAST PASSED UNIT                       ACTIVATES
Mon 2026-10-05 12:30:00 UTC 8min -         - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: HEAD / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: HEAD / 200, GET /.counter/total 404
Caddyfile now sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6
== vandalwayind-install.sh done
```

### 14. Undo, to put the counter fixes on the server

```
== vandalwayind-uninstall.sh, 2026-10-05T22:49:10Z
internal network: 1 port of the site removed; no other route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-vandalwayind-20261005T224913Z (sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
files: /srv/vandalwayind/ removed; the site's access log emptied (left in place, 0 bytes, for the reason above)
uninstall Caddyfile sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T122126Z: the server returned to its backed-up state
the site is gone: local port 000, socket absent
== vandalwayind-uninstall.sh done
```

### 15. Install, re-run after the undo

```
== vandalwayind-install.sh, 2026-10-05T22:49:52Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261005T224956Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T224956Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
counting start: the served page reads "times since October 5, 2026."
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
access log: written, and the file Caddy writes is the one the counter reads
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                        LEFT LAST PASSED UNIT                       ACTIVATES
Mon 2026-10-05 23:00:00 UTC 9min -         - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: HEAD / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: HEAD / 200, GET /.counter/total 404
Caddyfile now sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6
== vandalwayind-install.sh done
```

### 16. Undo, to put the page's e-mail links on the server

```
== vandalwayind-uninstall.sh, 2026-10-06T03:43:00Z
internal network: 1 port of the site removed; no other route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-vandalwayind-20261006T034303Z (sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
files: /srv/vandalwayind/ removed; the site's access log emptied (left in place, 0 bytes, for the reason above)
uninstall Caddyfile sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-vandalwayind-20261005T224956Z: the server returned to its backed-up state
the site is gone: local port 000, socket absent
== vandalwayind-uninstall.sh done
```

### 17. Install, re-run after the undo (running)

```
== vandalwayind-install.sh, 2026-10-06T03:43:31Z
preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free
node: v18.19.1 present
before: 11 blocks hashed, 10 other sites checked
Caddyfile backed up: /etc/caddy/Caddyfile.bak-vandalwayind-20261006T034335Z
backup /etc/caddy/Caddyfile.bak-vandalwayind-20261006T034335Z sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4
counting start: the served page reads "times since October 6, 2026."
files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the vandalwayind block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 0674a2446fb392505a816aa6a212be8375edde7aa08a279cb021a78df25163d4, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
other sites: every site that answered before the reload answers after it
access log: written, and the file Caddy writes is the one the counter reads
timer: vandalwayind-counter.timer enabled and started; the counter ran once
systemctl list-timers vandalwayind-counter.timer:
NEXT                        LEFT LAST PASSED UNIT                       ACTIVATES
Tue 2026-10-06 03:50:00 UTC 6min -         - vandalwayind-counter.timer vandalwayind-counter.service
internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275 after 311cb1424af62cfabbba4279ceaaa719ae893233dbd86668b1176f4073d29275)
served on the local port: HEAD / 200, GET /cgi-bin/guestbook.html 200, POST / 405
served through the socket: HEAD / 200, GET /.counter/total 404
Caddyfile now sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6
== vandalwayind-install.sh done
```

## Phase 7: staging (L1), 2026-10-06

**What it is.** `deploy/staging-install.sh` adds one Caddy site for STILL HERE staging, bound to the
loopback interface and to a socket under `/srv/still-here-staging/`, serving the build in
`/srv/still-here-staging/site/` (copied there by rsync) with the rules of
`deploy/caddy/staging.caddy`, which answer research 3's URL table as Pages does and give
`/api/` (so `presence.json`) `access-control-allow-origin: *`. The internal network reaches staging
on a new port of its own, an HTTPS port that proxies to the socket, so staging is a secure context.
Staging's own JSON access log keeps one day. The build is made with `BUILD_ID` set to the commit,
so `/build.txt` is that commit. Its undo is `deploy/staging-uninstall.sh`. The same guardrails as
Phase 6: Caddyfile backed up with a timestamp, `caddy validate` passed before every reload, every
other site block byte-identical before and after (the internal vandalwayind block is one of them,
`site-11`), every other site answering after as before, the internal network's other routes hashed
the same. The staging address is kept in the uncommitted `.env.staging`.

**The runs, in order (UTC).** `deploy/staging-install.sh` first run (1); `deploy/staging-uninstall.sh`
ran once and returned the server to its backed-up state (2); then `deploy/staging-install.sh` re-run
after the undo (3). Built from commit 5a19b1c.

### 1. Install, first run

```
== staging-install.sh, 2026-10-06T06:56:27Z
preconditions: no staging block, no /srv/still-here-staging, local port free, a new port of its own free
before: 12 blocks hashed, 11 other sites checked
staging: Caddyfile backed up: /etc/caddy/Caddyfile.bak-staging-20261006T065633Z
staging backup /etc/caddy/Caddyfile.bak-staging-20261006T065633Z sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6
files: site/ synced to /srv/still-here-staging/site by rsync (130 files); build 5a19b1ca3371a3372cda93970d29d38921f65c8d
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the staging block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
block site-11 sha256 before fe1dd9b02b229f27e04a4a1b6a5cc97e2bc56da698139034c56f892a9dcd8d46 after fe1dd9b02b229f27e04a4a1b6a5cc97e2bc56da698139034c56f892a9dcd8d46
every other site block byte-identical before and after (and the Caddyfile outside the staging block: sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
site-11 answers: before 000 after 000
site-12 answers: before 000 after 000
other sites: every site that answered before the reload answers after it
access log: written, one day kept
internal network: a new port of its own added for staging; no existing route changed (other routes sha256 before e80fa4a7d0c63faa486b44d245df75a1f419cdc72adf72224e22efb65cc2ec20 after e80fa4a7d0c63faa486b44d245df75a1f419cdc72adf72224e22efb65cc2ec20)
url table: /index 200, /index.html 200, /index/ 404, /research 301 (location /research/), /research/ 200, /no-such-page 404, /company/tracker/TRACKER.md 404
presence.json: 200, access-control-allow-origin *
staging /build.txt through the socket: 5a19b1ca3371a3372cda93970d29d38921f65c8d
POST / 405
staging Caddyfile now sha256 e674d25a4a8b9fbb6a5829fe3d7f32f8a7ad47f0f6a01b148d128a7e267a4696
== staging-install.sh done
```

### 2. Undo (deploy/staging-uninstall.sh ran once)

```
== staging-uninstall.sh, 2026-10-06T06:57:04Z
internal network: 1 port of staging removed; no other route changed (other routes sha256 before e80fa4a7d0c63faa486b44d245df75a1f419cdc72adf72224e22efb65cc2ec20 after e80fa4a7d0c63faa486b44d245df75a1f419cdc72adf72224e22efb65cc2ec20)
Caddyfile copied before the undo: /etc/caddy/Caddyfile.pre-undo-staging-20261006T065705Z (sha256 e674d25a4a8b9fbb6a5829fe3d7f32f8a7ad47f0f6a01b148d128a7e267a4696)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
block site-11 sha256 before fe1dd9b02b229f27e04a4a1b6a5cc97e2bc56da698139034c56f892a9dcd8d46 after fe1dd9b02b229f27e04a4a1b6a5cc97e2bc56da698139034c56f892a9dcd8d46
caddy validate: Valid configuration
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
site-11 answers: before 000 after 000
site-12 answers: before 000 after 000
other sites: every site that answered before the reload answers after it
files: /srv/still-here-staging removed; staging's access log emptied (left in place, 0 bytes)
staging uninstall Caddyfile sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6
Caddyfile identical to the backup /etc/caddy/Caddyfile.bak-staging-20261006T065633Z: the server returned to its backed-up state
staging is gone: local port 000, socket absent
== staging-uninstall.sh done
```

### 3. Install, re-run after the undo

```
== staging-install.sh, 2026-10-06T06:57:26Z
preconditions: no staging block, no /srv/still-here-staging, local port free, a new port of its own free
before: 12 blocks hashed, 11 other sites checked
staging: Caddyfile backed up: /etc/caddy/Caddyfile.bak-staging-20261006T065730Z
staging backup /etc/caddy/Caddyfile.bak-staging-20261006T065730Z sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6
files: site/ synced to /srv/still-here-staging/site by rsync (130 files); build 5a19b1ca3371a3372cda93970d29d38921f65c8d
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the staging block)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
block site-11 sha256 before fe1dd9b02b229f27e04a4a1b6a5cc97e2bc56da698139034c56f892a9dcd8d46 after fe1dd9b02b229f27e04a4a1b6a5cc97e2bc56da698139034c56f892a9dcd8d46
every other site block byte-identical before and after (and the Caddyfile outside the staging block: sha256 e11e271d0eeb96ccd80aecc84e0003a7bdd977093b70646e8fafe6f1c708e5b6, as before)
reload: done (systemctl reload caddy); caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
site-11 answers: before 000 after 000
site-12 answers: before 000 after 000
other sites: every site that answered before the reload answers after it
access log: written, one day kept
internal network: a new port of its own added for staging; no existing route changed (other routes sha256 before e80fa4a7d0c63faa486b44d245df75a1f419cdc72adf72224e22efb65cc2ec20 after e80fa4a7d0c63faa486b44d245df75a1f419cdc72adf72224e22efb65cc2ec20)
url table: /index 200, /index.html 200, /index/ 404, /research 301 (location /research/), /research/ 200, /no-such-page 404, /company/tracker/TRACKER.md 404
presence.json: 200, access-control-allow-origin *
staging /build.txt through the socket: 5a19b1ca3371a3372cda93970d29d38921f65c8d
POST / 405
staging Caddyfile now sha256 e674d25a4a8b9fbb6a5829fe3d7f32f8a7ad47f0f6a01b148d128a7e267a4696
== staging-install.sh done
```

### 4. Update to the build of 7f198d9 (files only)

`deploy/staging-install.sh --update` replaces the files of the installed staging with a new build by
rsync and touches nothing else (no Caddyfile, no port). Staging's own log was emptied by hand before
each L1 spec run, so the copy read for L1 item 5 holds only that run.

```
== staging-install.sh --update, 2026-10-06T07:00:40Z
files: site/ synced to /srv/still-here-staging/site by rsync (130 files); build 7f198d95ec58b19b4b1e5db9dde14c08c1b886ea
staging /build.txt through the socket: 7f198d95ec58b19b4b1e5db9dde14c08c1b886ea
== staging-install.sh --update done
```

### 5. Update to the build of a918f13 (files only), after the C4 packet

The same files-only update, so that staging serves the commit the packet goes out with. Nothing
under `src/` changed between 7f198d9 and a918f13; the pages are the same, `/build.txt` is new.
L1's unit test 2 (staging `/build.txt` equals HEAD) passed after it.

```
== staging-install.sh --update, 2026-10-06T12:11:14Z
files: site/ synced to /srv/still-here-staging/site by rsync (130 files); build a918f13bd571433625e9d0986eba5970fc632bec
staging /build.txt through the socket: a918f13bd571433625e9d0986eba5970fc632bec
== staging-install.sh --update done
```

## Phase 7: the security.txt reminder's dry run (L2), 2026-10-06

security-txt-reminder dry run, 06:58 UTC: dispatched by hand with `expires` set to a fabricated near
date (2026-10-16T06:58:40Z), run 37426838369, success. Its log: "Expires 2026-10-16T06:58:40Z: 10.0
days left (dry run)", "opened #1", "dry run: closed #1". Issue #1 "Renew security.txt" opened and
closed in the same second, with no assignee (`RENEWAL_ASSIGNEE` is set in N1). The Pages workflow's
runs on `main` read "skipped" while the repository is private (for example run 37425721753).

## Phase 7: DNS before launch (L3), 2026-10-06

**How.** Through the registrar's DNS API, by direct calls (the zone read, `POST …/validate`, then
`PUT` with `"overwrite": false`, which appends and never replaces). Before each write the whole zone
was read and saved off the repository as that domain's snapshot (its id below is the sha256 of the
saved file), and the registrar's own snapshot taken at the write was read back and compared with
it. The parking address in the zones is written here as "the registrar's parking address": no
address goes in this repository. Each write was the three records L3 names and nothing else.

**The snapshots (the zones before L3's writes), in full:**

| Domain | Name | Type | TTL | Value |
|---|---|---|---|---|
| isitstillhere.com | `@` | A | 50 | the registrar's parking address |
| isitstillhere.com | `www` | CNAME | 300 | `isitstillhere.com.` |
| isitstillhere.com | `_github-pages-challenge-vandalway-industries` | TXT | 3600 | the value Clive handed over (in `.env.staging`) |
| vandalwayind.com | `@` | A | 50 | the registrar's parking address |
| vandalwayind.com | `www` | CNAME | 300 | `vandalwayind.com.` |

**The steps, in order (UTC):**

- isitstillhere.com zone snapshot before its first change (the Pages challenge, 05:51): the registrar's snapshot id 186064327, holding the two records then there (A `@`, CNAME `www`).
- 05:51 validation dry run passed (`POST /zones/isitstillhere.com/validate`: 200 "Request accepted").
- isitstillhere.com: wrote one record, TXT `_github-pages-challenge-vandalway-industries` (append; the two records before it unchanged on read-back). Recorded at the time in CHECKPOINTS.md § Record.
- isitstillhere.com zone snapshot before L3's write, 06:51: id local-sha256 4c9d761ece2f1bd2866e4927ad93c1061c7d6a0dfbc113150f326f495618ac52 (three record sets, the table above); the registrar's own snapshot at the write, id 186074588, holds the same three record sets.
- vandalwayind.com zone snapshot before its first write, 06:51: id local-sha256 ae6f6c4eef5740ea8336e1c2e36f133d60b6dd9bd38b6576e0c58ad115c0fb30 (two record sets, the table above); the registrar's own snapshot at the write, id 186074603, holds the same two record sets.
- 06:51:49 validation dry run passed for both zones with the same payload (`POST …/validate`: 200 "Request accepted", 200 "Request accepted").
- 06:52:15 isitstillhere.com: wrote three records (append): MX `@` `0 .`; TXT `@` `"v=spf1 -all"`; TXT `_dmarc` `"v=DMARC1; p=reject"`; TTL 3600 each. 200 "Request accepted".
- 06:52:19 vandalwayind.com: wrote three records (append), the same three: MX `@` `0 .`; TXT `@` `"v=spf1 -all"`; TXT `_dmarc` `"v=DMARC1; p=reject"`; TTL 3600 each. 200 "Request accepted".
- Read-back, isitstillhere.com: every other record unchanged, equal to the snapshot (A `@`, CNAME `www`, TXT `_github-pages-challenge-vandalway-industries`); the three new record sets present; six record sets in all (zone sha256 a38f75d3cae1277f9b2156cc67c1b82fea4c596f9620e04d3ac0a4feb0cc8b0b).
- Read-back, vandalwayind.com: every other record unchanged, equal to the snapshot (A `@`, CNAME `www`); the three new record sets present; five record sets in all (zone sha256 9ed23c42dbbd5024c8bda5f27c9874d8595e1a3e0ee39968ab20fec85c687d27).
- No wildcard record in either zone (a random name under each answers NXDOMAIN at the zone's own name servers).

## Phase 8: launch (N1, N2), 2026-10-06

After Clive's C4 sign-off and the repository reading public.

### isitstillhere.com on GitHub Pages (N1)

- Private vulnerability reporting enabled; the repository variable `RENEWAL_ASSIGNEE` set.
- Pages created with the GitHub Actions source; the `github-pages` environment deploys from `main` only.
- Deploy: run 37468552403 (workflow_dispatch on `main`), build and deploy green. An earlier push run
  (37468436366) failed at `configure-pages`: it ran in the minute between the switch and the Pages site existing.
- Custom domain set: `isitstillhere.com`; the domain already verified for the organization.
- DNS, 13:10:42 UTC. Zone saved first (sha256 a38f75d3cae1277f…, as at L3's read-back); the
  registrar's latest snapshot before the write: 186074588. Validation dry run passed (200). Then the
  apex and `www` replaced, which Pages needs (the registrar's placeholder apex A and the `www`
  CNAME to the apex were all they held): A `@` GitHub Pages' four IPv4 addresses; AAAA `@` its
  four IPv6 addresses; CNAME `www` `vandalway-industries.github.io.`; TTL 3600. 200 "Request accepted".
- Read-back, isitstillhere.com: those three record sets changed as written; every other record set
  unchanged (MX, SPF, DMARC, the Pages challenge TXT); zone sha256 62687f8ea041a3eb144b151b14ce68f7b581bed5fb43d737febb6b6814b3248e.

### vandalwayind.com, public (N2)

- DNS, 13:12:52 UTC. Zone saved first (sha256 9ed23c42dbbd5024…, as at L3's read-back); the
  registrar's latest snapshot before the write: 186074603. Validation dry run passed (200). Then A
  `@` replaced: the registrar's placeholder address became the production server's (not written
  here; it is in the uncommitted environment). 200 "Request accepted".
- Read-back, vandalwayind.com: A `@` changed as written; every other record set unchanged (MX, SPF,
  DMARC, CNAME `www` to the apex); zone sha256 088b42fc84ccf206860d476fc7cfee4974485c5a712a339fc8e54d9dd8f929b8. Both public resolvers answered the new
  address within a minute.
- `deploy/vandalwayind-public-install.sh`, run once on the server (vandalwayind.com public block; every other block unchanged, byte-identical, and every other site answering as before). Its output, whole:

```
== vandalwayind-public-install.sh, 2026-10-06T13:13:17Z
preconditions: the internal copy installed, no public block yet
before: 13 blocks hashed, 12 other sites checked
backup /etc/caddy/Caddyfile.bak-vandalwayind-public-20261006T131323Z sha256 e674d25a4a8b9fbb6a5829fe3d7f32f8a7ad47f0f6a01b148d128a7e267a4696
go-live 2026-10-06 total 793 -> 0
files: refreshed; the page reads "times since October 6, 2026."; page and images dated 1997-08-22, guestbook 1999-03-02; counter at 0
caddy validate: Valid configuration
caddy validate passed (the Caddyfile with the public blocks)
block global-options sha256 before 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6 after 1a4dfb2eba60fceb421bc604cf8051ccc07ba5535e361c0390247d0722a726d6
block site-01 sha256 before d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c after d3e30ebb6d30fd797d0871b12da9e8de6ed4faa775c72422150b1c0bf003868c
block site-02 sha256 before f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420 after f35b3dddb7ad4b5ab3a5070572b9d676c1bcea2fe24317567f2fa988f7fe5420
block site-03 sha256 before 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce after 5405def69f196bf47c9a0b1a1c342bde7037d1b17ad2267a10724be2daa411ce
block site-04 sha256 before 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd after 12675a72e769ad5848395a596b50ff81f1ebfefc55b3e4fb3cb7d0567d30ebfd
block site-05 sha256 before 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d after 043369b240d7004697e541c74605d628486ce1f3e906a61ade1d38b76556ad9d
block site-06 sha256 before 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df after 74b5c289b5108108b72b3608333150c1eecc4d5e42661cfedb6f0b5d2182e9df
block site-07 sha256 before 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6 after 266abd9f5c7c9956c5a344e08a09691b65711b08e1853a5bf37c7914a8882be6
block site-08 sha256 before b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab after b960e035aa07c5c13ff08ce67c89d38b712f99e5f4a787188be0399f7b65dbab
block site-09 sha256 before ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba after ff63dd85973364e399921153447feb3cbb29ef225beac1001be0c833c76295ba
block site-10 sha256 before 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624 after 6c03df80ea8cca7408b562a9d9a5e122356405ec966f0d3783a74f65f2a42624
block site-11 sha256 before fe1dd9b02b229f27e04a4a1b6a5cc97e2bc56da698139034c56f892a9dcd8d46 after fe1dd9b02b229f27e04a4a1b6a5cc97e2bc56da698139034c56f892a9dcd8d46
block site-12 sha256 before af5712ac920fc3a50e22c01e5ed16f4f2a7e928d8471c2c0d199a171c79e5b10 after af5712ac920fc3a50e22c01e5ed16f4f2a7e928d8471c2c0d199a171c79e5b10
vandalwayind.com public block: every other block byte-identical before and after
reload: done; caddy active
site-01 answers: before 301 after 301
site-02 answers: before 200 after 200
site-03 answers: before 502 after 502
site-04 answers: before 502 after 502
site-05 answers: before 200 after 200
site-06 answers: before 200 after 200
site-07 answers: before 502 after 502
site-08 answers: before 502 after 502
site-09 answers: before 200 after 200
site-10 answers: before 502 after 502
site-11 answers: before 000 after 000
site-12 answers: before 000 after 000
site-13 answers: before 000 after 000
site-14 answers: before 000 after 000
other sites: every site that answered before the reload answers after it
Caddyfile now sha256 7bca0be197a3fb118b372348f86177e014aa186a58e240438978d19a0c23832a
== vandalwayind-public-install.sh done
```

The go-live line, on its own:

go-live 2026-10-06 total 793 -> 0

- Checked by hand after the reload: `https://vandalwayind.com/` 200 with a valid certificate;
  `http://vandalwayind.com/` and `http://www.vandalwayind.com/` 301 to `https://vandalwayind.com/`;
  `https://www.vandalwayind.com/` 301 to the apex; `Last-Modified` 22 Aug 1997; the counter line
  "times since October 6, 2026."
