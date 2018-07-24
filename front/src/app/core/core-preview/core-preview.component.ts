import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {ICore} from '../icore';

@Component({
  selector: 'app-core-preview',
  templateUrl: './core-preview.component.html',
  styleUrls: ['./core-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorePreviewComponent {
  @Input() item: ICore;
  @Output() clickItem = new EventEmitter<[number, boolean]>();
  @Output() onEdit = new EventEmitter<ICore>();

  @HostBinding('class._active')
  active = false;

  onClickItem() {
    this.active = !this.active;
    this.clickItem.emit([this.item.id, this.active]);
  }

  onEditItem() {
    this.onEdit.emit(this.item);
  }
}
