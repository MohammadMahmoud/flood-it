import Server from './bootstrap/server';

/* istanbul ignore if */
if (!module.parent) {
  Server.init();
}
