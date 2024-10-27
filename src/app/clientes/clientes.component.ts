import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ClienteService } from '../services/cliente.service';
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
  selector: 'app-clientes',
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
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  cliente!: Cliente;
  clienteDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private clienteService: ClienteService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe(
      (data) => {
        console.log('Clientes cargados:', data);
        this.clientes = data;
      },
      (error) => {
        console.error('Error al cargar los clientes', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes', life: 3000 });
      }
    );
  }

  openNew() {
    this.cliente = { id: 0, nombre: '', apellido: '', telefono: '', fecha_nacimiento: new Date() };
    this.submitted = false;
    this.clienteDialog = true;
  }

  hideDialog() {
    this.clienteDialog = false;
    this.submitted = false;
  }

  saveCliente() {
    this.submitted = true;

    if (this.cliente.nombre?.trim()) {
      if (this.cliente.id) {
        // Actualizar cliente existente
        this.clienteService.updateCliente(this.cliente).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado', life: 3000 });
          this.loadClientes();
        });
      } else {
        // Crear nuevo cliente
        this.clienteService.createCliente(this.cliente).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado', life: 3000 });
          this.loadClientes();
        });
      }

      this.clienteDialog = false;
      this.cliente = { id: 0, nombre: '', apellido: '', telefono: '', fecha_nacimiento: new Date() };
    }
  }

  editCliente(cliente: Cliente) {
    this.cliente = { ...cliente };
    this.clienteDialog = true;
  }

  deleteCliente(cliente: Cliente) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar a ${cliente.nombre}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clienteService.deleteCliente(cliente.id).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado', life: 3000 });
            this.loadClientes();
          },
          (error) => {
            console.error('Error al eliminar el cliente', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el cliente', life: 3000 });
          }
        );
      }
    });
  }
}
