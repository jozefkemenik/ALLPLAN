import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class InjectUtilityModule { 
     /**
     * Allows for retrieving singletons using `InjectUtilityModule.injector.get(MyService)`
     * This is good to prevent injecting the service as constructor parameter.
     */
      static injector: Injector;
      constructor(injector: Injector) {
        InjectUtilityModule.injector = injector;
      }
}
