import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

// interfaces
import { IListItems } from '../../interface/IListItems.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-item',
  imports: [NgClass],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent {
  #cdr = inject(ChangeDetectorRef);
  @Output() public outputAddListItem = new EventEmitter<IListItems>();

  @Input({ required: true }) public inputListItems: Array<IListItems> = [];
  @ViewChild('inputText') public inputText!: ElementRef;

  public focusAndAddItem(value: string) {
    if (value) {
      this.#cdr.detectChanges();

      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const id = `${timestamp}`;

      this.outputAddListItem.emit({
        id: id,
        checked: false,
        value,
      });

      this.inputText.nativeElement.value = '';

      return this.inputText.nativeElement.focus();
    }
  }
}
