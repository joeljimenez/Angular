import { HelpPage } from './app.po';

describe('help App', () => {
  let page: HelpPage;

  beforeEach(() => {
    page = new HelpPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
