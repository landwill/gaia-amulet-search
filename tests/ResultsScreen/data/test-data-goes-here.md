The dumped HTML is too convoluted to be reasonably fuzzed, and contains sensitive information.
I won't commit my html, so I suggest the following process when running the tests:
- open a trade
- navigate to the Kindred tab, then any page besides page 1 (to test that the pageNumber identification works, without 'falling back' to 1)
- wait for it to finish loading
- paste the content of reduceAndDumpPageContents.js into the console, and a file should be downloaded.
  - This doesn't violate the ToS, as it automates no actions. It just reads the HTML.
- copy the file to this folder ('data')
- run the tests, let them fail. Note the expected number of amulets and page number.
- update the test accordingly, depending in which page you selected and how many amulets were on it.