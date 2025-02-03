import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';

//interface
import { IListItems } from '../../interface/IListItems.interface';

@Component({
  selector: 'app-input-list-item',
  imports: [],
  templateUrl: './input-list-item.component.html',
  styleUrl: './input-list-item.component.scss',
})
export class InputListItemComponent {
  #cdr = inject(ChangeDetectorRef);

  @Input() public inputListItems: Array<IListItems> = [];
  @Input() public listItemsStage: Array<IListItems> = [];

  @Output() public outputUpdateItemCheckbox = new EventEmitter<{
    id: string;
    checked: boolean;
  }>();

  @Output() public outputUpdateItemValue = new EventEmitter<{
    id: string;
    value: string;
  }>();

  @Output() public outputDeleteItem = new EventEmitter<{
    id: string;
  }>();

  public updateItemValue(id: string, value: string) {
    return this.outputUpdateItemValue.emit({ id, value });
  }

  public updateItemCheckbox(id: string, checked: boolean) {
    return this.outputUpdateItemCheckbox.emit({ id, checked });
  }

  public deleteItem(id: string) {
    return this.outputDeleteItem.emit({ id });
  }
}
