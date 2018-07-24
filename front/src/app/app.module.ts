import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreComponent } from './core/core.component';
import { LoginComponent } from './login/login.component';
import { CorePreviewComponent } from './core/core-preview/core-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoreAddFormComponent } from './core/core-add-form/core-add-form.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routing';
import { NotFoundComponent } from './not-found/not-found.component';
import { ModalModule } from 'ngx-bootstrap';
import { CoreEditFormComponent } from './core/core-edit-form/core-edit-form.component';


@NgModule({
  declarations: [
    AppComponent,
    CoreComponent,
    LoginComponent,
    CorePreviewComponent,
    CoreAddFormComponent,
    NotFoundComponent,
    CoreEditFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,

    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    ModalModule.forRoot(),
  ],
  entryComponents: [CoreAddFormComponent, CoreEditFormComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
