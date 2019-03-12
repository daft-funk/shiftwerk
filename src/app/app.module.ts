import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WerkerHomeComponent } from './werker/werker-home/werker-home.component';
import { WerkerSearchComponent } from './werker/werker-search/werker-search.component';
import { WerkerNotificationsComponent } from './werker/werker-notifications/werker-notifications.component';
import { WerkerProfileComponent } from './werker/werker-profile/werker-profile.component';
import { WerkerSettingsComponent } from './werker/werker-settings/werker-settings.component';
import { WerkerHistoryComponent } from './werker/werker-history/werker-history.component';
import { WerkerScheduleComponent } from './werker/werker-schedule/werker-schedule.component';
import { MakerScheduleComponent } from './maker/maker-schedule/maker-schedule.component';
import { MakerHomeComponent } from './maker/maker-home/maker-home.component';
import { MakerSearchComponent } from './maker/maker-search/maker-search.component';
import { MakerNotificationComponent } from './maker/maker-notification/maker-notification.component';

@NgModule({
  declarations: [
    AppComponent,
    WerkerHomeComponent,
    WerkerSearchComponent,
    WerkerNotificationsComponent,
    WerkerProfileComponent,
    WerkerSettingsComponent,
    WerkerHistoryComponent,
    WerkerScheduleComponent,
    MakerScheduleComponent,
    MakerHomeComponent,
    MakerSearchComponent,
    MakerNotificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
