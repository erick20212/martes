import { Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { HomeComponent } from './home/home.component';
import { ClientesComponent } from './clientes/clientes.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent,
        title:'home'
    },
    {
        path:'producto',
        component:ProductosComponent,
        title:'producto'
    },
    {
        path:'cliente',
        component:ClientesComponent,
        title:'cliente'
    },
    {
        path:'**',
        redirectTo:'',
        pathMatch:'full'
    }
];
