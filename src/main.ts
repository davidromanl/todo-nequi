import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pricetagsOutline, addOutline, pencilOutline, trashOutline, add, pricetagOutline, starOutline, homeOutline, briefcaseOutline, cartOutline, fastFoodOutline, heartOutline, fitnessOutline, bookOutline, carOutline, airplaneOutline, walletOutline, giftOutline, musicalNotesOutline, constructOutline, listOutline, checkmarkOutline } from 'ionicons/icons';
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons({
  'pricetags-outline': pricetagsOutline,
  'add-outline': addOutline,
  'pencil-outline': pencilOutline,
  "trash-outline": trashOutline,
  "add": add,
  "pricetag-outline": pricetagOutline,
  "star-outline": starOutline,
  "home-outline": homeOutline,
  "list-outline": listOutline,
  "briefcase-outline": briefcaseOutline,
  "cart-outline": cartOutline,
  "fast-food-outline": fastFoodOutline,
  "heart-outline": heartOutline,
  "fitness-outline": fitnessOutline,
  "book-outline": bookOutline,
  "car-outline": carOutline,
  "airplane-outline": airplaneOutline,
  "wallet-outline": walletOutline,
  "gift-outline": giftOutline,
  "musical-notes-outline": musicalNotesOutline,
  "construct-outline": constructOutline,
  "checkmark-outline": checkmarkOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__appdb',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
      })
    ),
  ],
});
