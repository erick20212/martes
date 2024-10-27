import { Component, OnInit } from '@angular/core';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SiderbarComponent } from '../siderbar/siderbar.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    ToolbarModule,
    CommonModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    SiderbarComponent,
    CardModule
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  producto!: Producto;
  productoDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe(
      (data) => {
        console.log('Productos cargados:', data);
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar los productos', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos', life: 3000 });
      }
    );
  }

  openNew() {
    this.producto = { id: 0, nombre: '', precio: 0, descripcion: '' };
    this.submitted = false;
    this.productoDialog = true;
  }

  hideDialog() {
    this.productoDialog = false;
    this.submitted = false;
  }

  saveProducto() {
    this.submitted = true;

    if (this.producto.nombre?.trim()) {
      if (this.producto.id) {
        // Actualizar producto existente
        this.productoService.updateProducto(this.producto).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
          this.loadProductos();
        });
      } else {
        // Crear nuevo producto
        this.productoService.createProducto(this.producto).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
          this.loadProductos();
        });
      }

      this.productoDialog = false;
      this.producto = { id: 0, nombre: '', precio: 0, descripcion: '' };
    }
  }

  editProducto(producto: Producto) {
    this.producto = { ...producto };
    this.productoDialog = true;
  }

  deleteProducto(producto: Producto) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el producto ${producto.nombre}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productoService.deleteProducto(producto.id).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado', life: 3000 });
            this.loadProductos();
          },
          (error) => {
            console.error('Error al eliminar el producto', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto', life: 3000 });
          }
        );
      }
    });
  }
}
