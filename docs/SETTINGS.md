### Properties list

| key | default value | explanation |
|:---------------|:-----|:-----|
| settings.showModeStatus | false | Whether always to show mode status. |
| settings.richHintsForKeystroke | 500 | Timeout(ms) to show rich hints for keystroke, 0 will disable rich hints. |
| settings.focusOnSaved | true | Whether to focus text input after quitting from vim editor. |
| settings.omnibarMaxResults | 10 | How many results will be listed out each page for Omnibar. |
| settings.omnibarHistoryCacheSize | 100 | The maximum of items fetched from browser history. |
| settings.omnibarPosition | "middle" | Where to position Omnibar. ["middle", "bottom"] |
| settings.omnibarSuggestion | false | Show suggestion URLs|
| settings.omnibarSuggestionTimeout | 200 | Timeout duration before Omnibar suggestion URLs are queried, in milliseconds. Helps prevent unnecessary HTTP requests and API rate-limiting. |
| settings.focusFirstCandidate | false | Whether to focus first candidate of matched result in Omnibar. |
| settings.tabsThreshold | 100 | When total of opened tabs exceeds the number, Omnibar will be used for choosing tabs. |
| settings.clickableSelector | "" | Extra CSS selector to pick elements for hints mode, such as "\*.jfk-button, \*.goog-flat-menu-button". |
| settings.clickablePat | /(https?&#124;thunder&#124;magnet):\/\/\S+/ig | A regex to detect clickable links from text, you could use `O` to open them. |
| settings.editableSelector | div.CodeMirror-scroll,div.ace_content | CSS selector for additional editable elements. |
| settings.smoothScroll | true | Whether to use smooth scrolling when pressing keys like `j`/`k`/`e`/`d` to scroll page or elements. |
| settings.modeAfterYank | "" | Which mode to fall back after yanking text in visual mode. Value could be one of ["", "Caret", "Normal"], default is "", which means no action after yank.|
| settings.scrollStepSize | 70 | A step size for each move by `j`/`k` |
| settings.scrollFriction | 0 | A force that is needed to start continuous scrolling after initial scroll step. A bigger number will cause a flicker after initial step, but help to keep the first step precise. |
| settings.nextLinkRegex | /((>>&#124;next)+)/i | A regex to match links that indicate next page. |
| settings.prevLinkRegex | /((<<&#124;prev(ious)?)+)/i| A regex to match links that indicate previous page. |
| settings.hintAlign | "center" | Alignment of hints on their target elements. ["left", "center", "right"] |
| settings.hintExplicit | false | Whether to wait for explicit input when there is only a single hint available |
| settings.hintShiftNonActive | false | Whether new tab is active after entering hint while holding shift |
| settings.defaultSearchEngine | "g" | The default search engine used in Omnibar. |
| settings.blocklistPattern | undefined | A regex to match the sites that will have Surfingkeys disabled. |
| settings.focusAfterClosed | "right" | Which tab will be focused after the current tab is closed. ["left", "right", "last"] |
| settings.repeatThreshold | 99 | The maximum of actions to be repeated. |
| settings.tabsMRUOrder | true | Whether to list opened tabs in order of most recently used beneath Omnibar. |
| settings.historyMUOrder | true | Whether to list history in order of most used beneath Omnibar. |
| settings.newTabPosition | 'default' | Where to new tab. ["left", "right", "first", "last", "default"] |
| settings.interceptedErrors | [] | Indicates for which errors Surfingkeys will show error page, so that you could use Surfingkeys on those error pages. For example, ["*"] to show error page for all errors, or ["net::ERR_NAME_NOT_RESOLVED"] to show error page only for ERR_NAME_NOT_RESOLVED, please refer to [net_error_list.h](https://github.com/adobe/chromium/blob/master/net/base/net_error_list.h) for complete error list.  |
| settings.enableEmojiInsertion | false | Whether to turn on Emoji completion in Insert mode. |
| settings.startToShowEmoji | 2 | How many characters are needed after colon to show emoji suggestion. |
| settings.stealFocusOnLoad | true | Whether to prevent focus on input on page loaded, set to true by default so that we could use Surfingkeys directly after page loaded, otherwise we need press `Esc` to quit input. |
| settings.enableAutoFocus | true | Whether to enable auto focus after mouse click on some widget. This is different with `stealFocusOnLoad`, which is only for the time of page loaded. For example, there is a hidden input box on a page, it is turned to visible after user clicks on some other link. If you don't like the input to be focused when it's turned to visible, you could set this to false. |
| settings.theme | undefined | To change css of the Surfingkeys UI elements. |
| settings.caseSensitive | false | Whether finding in page/Omnibar is case sensitive. |
| settings.smartCase | true | Whether to make caseSensitive true if the search pattern contains upper case characters. |
| settings.cursorAtEndOfInput | true | Whether to put cursor at end of input when entering an input box, by false to put the cursor where it was when focus was removed from the input. |
| settings.digitForRepeat | true | Whether digits are reserved for repeats, by false to enable mapping of numeric keys. |
| settings.editableBodyCare | true | Insert mode is activated automatically when an editable element is focused, so if document.body is editable for some window/iframe (such as docs.google.com), Insert mode is always activated on the window/iframe, which means all shortcuts from Normal mode will not be available. With `editableBodyCare` as `true`, Insert mode will not be activated automatically in this case. |
| settings.ignoredFrameHosts | ["https://tpc.googlesyndication.com"] | When using `w` to loop through frames, you could use this settings to exclude some of them, such as those for advertisements. |
| settings.aceKeybindings | "vim" | Set it "emacs" to use emacs keybindings in the ACE editor. |
| settings.caretViewport | null | Set it in format `[top, left, bottom, right]` to limit hints generation on `v` for entering visual mode, such as `[window.innerHeight / 2 - 10, 0, window.innerHeight / 2 + 10, window.innerWidth]` will make Surfingkeys generate Hints only for text that display on vertically middle of window. |
| settings.mouseSelectToQuery | [] | All hosts that have enable feature -- mouse selection to query. |
