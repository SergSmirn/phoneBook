import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CoreComponent } from './core/core.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: CoreComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
]