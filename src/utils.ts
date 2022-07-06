/**
 * Extension events limiter.
 * This class is responsible for managing  the  events of the extension to
 * avoid duplicated events, because the debouncing method didn't work well.
 * First we initilize EventsLimit with desired limit in ms and then we register
 * the function to be fired one time immediatly(leading) or the last (trailing)
 * until the timeout is over.
 */
export class EventsLimit {
  private tailTimer: number = undefined;
  private leadTimer: number = undefined;
  private isCalled: boolean = false;
  private func: Function = undefined;
  private debounce: ReturnType<typeof setTimeout>;

  /**
   * EventsLimit constructor.
   * @param trailTimer The limit in milliseconds for the trailing event.
   * @param leadTimer The limit in milliseconds for the leading event.
   */
  constructor (_trailTimer: number = 100, _leadTimer: number = 200) {
    this.tailTimer = _trailTimer;
    this.leadTimer = _leadTimer;
  }

  /**
* Because some events like onDidChangeActiveTextEditor get fired twice when
* an editor tab is opened. The first event is for the visible range of pre
* mouse position and then gets another event but with the correct visible range.
* So we will use this method to fire the last passed event.
*/
  public Trail = () => {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.func(), this.tailTimer);
  }

  private reset = () => {
    return setTimeout(() => {
      this.isCalled = false;
    }, this.leadTimer);
  }

  public Lead = () => {
    if (!this.isCalled) {
      this.isCalled = true;
      this.func();
    }
    this.reset();
  }

  public Register = (func: Function) => {
    this.func = func;
  }
}