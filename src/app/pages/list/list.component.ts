import { Component, signal } from '@angular/core';
import { AddItemComponent } from '../../components/add-item/add-item.component';
import Swal from 'sweetalert2';

// interface
import { IListItems } from '../../interface/IListItems.interface';
import { NgClass } from '@angular/common';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { ELocalStorage } from '../../enum/ELocalStorage.enum';

@Component({
  selector: 'app-list',
  imports: [AddItemComponent, NgClass, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  public addItem = signal(false);

  #setListItems = signal<Array<IListItems>>(this.#parseItems());
  getListItems = this.#setListItems.asReadonly();

  public renderItems() {
    return localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify(this.#setListItems())
    );
  }

  #parseItems() {
    return JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST) || '[]');
  }

  public getInputAndAddItem(value: IListItems) {
    localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify([...this.#setListItems(), value])
    );

    return this.#setListItems.set(this.#parseItems());
  }

  public updateItemCheckbox(value: { id: string; checked: boolean }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter((e) => {
        if (e.id === value.id) {
          e.checked = value.checked;
          return e;
        }
        return;
      });
      return oldValue;
    });
    return this.renderItems();
  }

  public updateItemValue(value: { id: string; value: string }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter((e) => {
        if (e.id === value.id) {
          e.value = value.value;
          return e;
        }
        return;
      });
      return oldValue;
    });
    return this.renderItems();
  }

  public listItemsStage(status: 'pending' | 'completed') {
    return this.getListItems().filter((e: IListItems) => {
      if (status === 'pending') {
        return e.checked === false;
      }
      if (status === 'completed') {
        return e.checked === true;
      }
      return e;
    });
  }

  public deleteItem(value: { id: string }) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Isso não poderá ser revertido!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3c32a8',
      cancelButtonColor: '#c90025',
      confirmButtonText: 'Sim, delete este item.',
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue: IListItems[]) => {
          oldValue.filter((e) => {
            if (e.id === value.id) {
              let itemIndex = oldValue.indexOf(e);
              oldValue.splice(itemIndex, 1);
              return oldValue;
            }
            return;
          });
          return oldValue;
        });
        return this.renderItems();
        /*         this.#setListItems.update((oldValue: IListItems[]) => {
          return oldValue.filter((e) => e.id !== value.id)
        }) */
      }
    });
  }

  public deleteAllItems() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Isso não poderá ser revertido!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3c32a8',
      cancelButtonColor: '#c90025',
      confirmButtonText: 'Sim, delete tudo.',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalStorage.MY_LIST);
        return this.#setListItems.set(this.#parseItems());
      }
    });
  }
}
