import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { HomeComponent } from './home';

import 'styles/styles.css';
import 'styles/headings.css';

type StoreType = {
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));

    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);

    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
